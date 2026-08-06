import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  distPathForRoute,
  distRoot,
  extractSitemapLocations,
  pathExists,
  projectRoot,
  readText,
  unique,
  walkFiles,
} from './validation-helpers.mjs';

const EXPECTED_ACTIVITY_COUNT = 46;
const RETIRED_ACTIVITY_ROUTES = new Set([
  '/2024/08/30/visita-del-kinder-jardin-conquistadores/',
]);
const publicRoutesSource = await readText(
  path.join(projectRoot, 'src/data/public-routes.ts'),
);
const manifest = JSON.parse(
  await readText(
    path.join(
      projectRoot,
      'docs/implementation/activity-migration-manifest.json',
    ),
  ),
);
const staticRoutes = [
  ...publicRoutesSource.matchAll(/\bpath:\s*'([^']+)'/g),
].map((match) => match[1]);
const activityRoutes = manifest.entries
  .map((entry) => entry.astroPath)
  .filter((route) => !RETIRED_ACTIVITY_ROUTES.has(route));
const expectedRoutes = [...staticRoutes, ...activityRoutes];
const errors = [];

if (staticRoutes.length !== 9) {
  errors.push(`Se esperaban 9 rutas públicas estables y se encontraron ${staticRoutes.length}.`);
}
if (activityRoutes.length !== EXPECTED_ACTIVITY_COUNT) {
  errors.push(
    `El manifiesto activo contiene ${activityRoutes.length} actividades; se esperaban ${EXPECTED_ACTIVITY_COUNT}.`,
  );
}
if (unique(expectedRoutes).length !== expectedRoutes.length) {
  errors.push('Existen rutas públicas duplicadas.');
}

const forbiddenFragments = [
  '/mi-cuenta',
  '/registro',
  '/notas',
  '/robots.txt',
  '/404',
  '/sitemap',
  '?',
  '#',
];
for (const route of expectedRoutes) {
  if (
    !route.startsWith('/') ||
    (route !== '/' && !route.endsWith('/')) ||
    forbiddenFragments.some((fragment) => route.includes(fragment))
  ) {
    errors.push(`Ruta pública inválida o sensible: ${route}`);
  }
  if (!(await pathExists(distPathForRoute(route)))) {
    errors.push(`Falta HTML generado para ${route}`);
  }
}

for (const output of ['404.html', 'sitemap.xml', 'robots.txt']) {
  if (!(await pathExists(path.join(distRoot, output)))) {
    errors.push(`Falta dist/${output}`);
  }
}

const sitemapXml = await readText(path.join(distRoot, 'sitemap.xml'));
const sitemapUrls = extractSitemapLocations(sitemapXml);
const sitemapPaths = sitemapUrls.map((location) => {
  const url = new URL(location);
  if (url.search || url.hash) {
    errors.push(`El sitemap contiene parámetros o fragmentos: ${location}`);
  }
  return url.pathname;
});
if (unique(sitemapPaths).length !== sitemapPaths.length) {
  errors.push('El sitemap contiene URL duplicadas.');
}
if (!sitemapPaths.includes('/matriculas-2027/')) {
  errors.push('El sitemap omite /matriculas-2027/.');
}
if (sitemapPaths.includes('/matriculas-2026/')) {
  errors.push('El sitemap todavía contiene /matriculas-2026/.');
}
for (const route of expectedRoutes) {
  if (!sitemapPaths.includes(route)) errors.push(`El sitemap omite ${route}`);
}
for (const sitemapPath of sitemapPaths) {
  if (!expectedRoutes.includes(sitemapPath)) {
    errors.push(`El sitemap contiene una ruta no pública: ${sitemapPath}`);
  }
}

const contentFiles = (await walkFiles(path.join(projectRoot, 'src/content/activities')))
  .filter((filePath) => filePath.endsWith('.md'));
if (contentFiles.length !== EXPECTED_ACTIVITY_COUNT) {
  errors.push(
    `La colección contiene ${contentFiles.length} Markdown; se esperaban ${EXPECTED_ACTIVITY_COUNT}.`,
  );
}
const contentRoutes = [];
for (const filePath of contentFiles) {
  const source = await readFile(filePath, 'utf8');
  if (source.includes('staging.colegioconquistadores.com')) {
    errors.push(
      `Contenido editorial con host de staging codificado: ${path.relative(projectRoot, filePath)}`,
    );
  }
  const match = source.match(/^historicalPath:\s*['"]?([^'"\r\n]+)['"]?\s*$/m);
  if (!match) {
    errors.push(`Falta historicalPath en ${path.relative(projectRoot, filePath)}`);
  } else {
    contentRoutes.push(match[1]);
  }
}
for (const route of activityRoutes) {
  if (!contentRoutes.includes(route)) {
    errors.push(`El manifiesto y la colección difieren en ${route}`);
  }
}

const dataFiles = await walkFiles(path.join(projectRoot, 'src/data'));
for (const filePath of dataFiles) {
  const relativePath = path.relative(projectRoot, filePath).replaceAll('\\', '/');
  if (relativePath === 'src/data/site-config.ts' || relativePath === 'src/data/site.ts') {
    continue;
  }

  const source = await readFile(filePath, 'utf8');
  if (source.includes('staging.colegioconquistadores.com')) {
    errors.push(`Datos de contenido con host de staging codificado: ${relativePath}`);
  }
}

const robots = await readText(path.join(distRoot, 'robots.txt'));
if (!robots.includes('User-agent: *')) errors.push('robots.txt no declara User-agent.');

const baseUrlArgument = process.argv.find((argument) =>
  argument.startsWith('--base-url='),
);
if (baseUrlArgument) {
  const baseUrl = new URL(baseUrlArgument.slice('--base-url='.length));
  const checks = [...expectedRoutes];
  const batchSize = 8;

  for (let index = 0; index < checks.length; index += batchSize) {
    const batch = checks.slice(index, index + batchSize);
    const responses = await Promise.all(
      batch.map(async (route) => ({
        route,
        response: await fetch(new URL(route, baseUrl), { redirect: 'manual' }),
      })),
    );
    for (const { route, response } of responses) {
      if (response.status !== 200) {
        errors.push(`HTTP ${response.status} en ${route}; se esperaba 200.`);
      }
    }
  }

  const notFoundPageResponse = await fetch(new URL('/404.html', baseUrl), {
    redirect: 'manual',
  });
  if (![200, 404].includes(notFoundPageResponse.status)) {
    errors.push(
      `/404.html respondió ${notFoundPageResponse.status}; se esperaba 200 o 404 según el servidor local.`,
    );
  }

  const missingPath = `/qa-ruta-inexistente-${Date.now()}/`;
  const missingResponse = await fetch(new URL(missingPath, baseUrl), {
    redirect: 'manual',
  });
  if (missingResponse.status !== 404) {
    errors.push(
      `La ruta inexistente respondió ${missingResponse.status}; se esperaba 404.`,
    );
  }
}

if (errors.length > 0) {
  console.error(`Validación de rutas fallida (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Rutas correctas: ${staticRoutes.length} estables + ${activityRoutes.length} actividades = ${expectedRoutes.length} URL en sitemap.`,
);
if (baseUrlArgument) {
  console.log('Crawl HTTP local: rutas públicas 200, página 404 y 404 real verificados.');
}
