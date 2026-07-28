import { readFile, readdir, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, 'src/content/activities');
const DIST_ROOT = path.join(ROOT, 'dist');
const forbiddenBodyPatterns = [
  ['Elementor', /elementor-/i],
  ['Ajax Search Lite', /ajax-search-lite/i],
  ['script remoto', /<script\b/i],
  ['estilo inline heredado', /<style\b/i],
  ['formulario heredado', /<form\b/i],
  ['REST de WordPress', /wp-json/i],
  ['módulo “Últimas actividades”', /ultimas actividades/i],
];

async function listFiles(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(target, extension)));
    if (entry.isFile() && entry.name.endsWith(extension)) files.push(target);
  }
  return files;
}

function markdownBody(source) {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
}

async function main() {
  const routeValidation = spawnSync(
    process.execPath,
    [path.join(ROOT, 'scripts/validate-activity-routes.mjs')],
    { cwd: ROOT, encoding: 'utf8' },
  );
  process.stdout.write(routeValidation.stdout);
  process.stderr.write(routeValidation.stderr);
  if (routeValidation.status !== 0) process.exit(routeValidation.status ?? 1);

  const errors = [];
  const contentFiles = await listFiles(CONTENT_ROOT, '.md');
  for (const file of contentFiles) {
    const body = markdownBody(await readFile(file, 'utf8'));
    for (const [label, pattern] of forbiddenBodyPatterns) {
      if (pattern.test(body)) {
        errors.push(`${path.relative(ROOT, file)} conserva ${label}.`);
      }
    }
  }

  const inventory = await readFile(
    path.join(ROOT, 'docs/migration/url-inventory.md'),
    'utf8',
  );
  const routes = [
    ...new Set(
      [...inventory.matchAll(/https:\/\/www\.colegioconquistadores\.com(\/\d{4}\/\d{2}\/\d{2}\/[^/\s|]+\/)/g)]
        .map((match) => match[1]),
    ),
  ];
  const expectedBuiltPages = ['/actividades/', ...routes];
  for (const route of expectedBuiltPages) {
    const builtFile = path.join(DIST_ROOT, route.replace(/^\//, ''), 'index.html');
    try {
      const html = await readFile(builtFile, 'utf8');
      const h1Count = (html.match(/<h1(?:\s|>)/g) ?? []).length;
      if (h1Count !== 1) errors.push(`${route}: ${h1Count} elementos H1.`);
      if (!/<meta name="robots" content="noindex,nofollow">/.test(html)) {
        errors.push(`${route}: staging no contiene noindex,nofollow.`);
      }
      if (/wp-json|elementor-|ajax-search-lite/i.test(html)) {
        errors.push(`${route}: HTML construido contiene dependencia heredada.`);
      }
    } catch {
      errors.push(`${route}: falta dist${route}index.html.`);
    }
  }

  const homeHtml = await readFile(path.join(DIST_ROOT, 'index.html'), 'utf8');
  if (/https:\/\/www\.colegioconquistadores\.com\/2025\//.test(homeHtml)) {
    errors.push('La portada aún contiene enlaces absolutos de actividades a WordPress.');
  }

  const manifest = JSON.parse(
    await readFile(
      path.join(ROOT, 'docs/implementation/activity-migration-manifest.json'),
      'utf8',
    ),
  );
  if (manifest.entries.length !== 47) {
    errors.push(`El manifiesto contiene ${manifest.entries.length} entradas.`);
  }

  const imageFiles = await listFiles(
    path.join(ROOT, 'src/assets/images/activities'),
    '.webp',
  );
  const imageStats = await Promise.all(imageFiles.map((file) => stat(file)));
  const bytes = imageStats.reduce((total, item) => total + item.size, 0);
  const largest = Math.max(...imageStats.map((item) => item.size));

  if (errors.length) {
    console.error(errors.map((error) => `- ${error}`).join('\n'));
    process.exitCode = 1;
    return;
  }

  console.log(`QA estático: ${expectedBuiltPages.length} páginas de actividades verificadas.`);
  console.log(
    `Recursos locales: ${imageFiles.length} imágenes WebP, ${(bytes / 1024 / 1024).toFixed(1)} MB; mayor ${(largest / 1024).toFixed(1)} KB.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
