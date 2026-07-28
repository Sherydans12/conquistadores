import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, 'src/content/activities');
const INVENTORY_PATH = path.join(ROOT, 'docs/migration/url-inventory.md');
const EXPECTED_COUNT = 47;
const baseUrlArg = process.argv.find((argument) =>
  argument.startsWith('--base-url='),
);
const baseUrl = baseUrlArg?.slice('--base-url='.length).replace(/\/$/, '');

async function listMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listMarkdownFiles(target)));
    if (entry.isFile() && entry.name.endsWith('.md')) files.push(target);
  }

  return files;
}

function frontmatterValue(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!match) return undefined;
  const raw = match[1].trim();

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function parseActivity(file, source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Frontmatter inválido: ${file}`);
  const [, frontmatter, body] = match;
  const galleryImages = [...frontmatter.matchAll(/^\s+- image:\s*(.+)$/gm)].map(
    (item) => JSON.parse(item[1]),
  );

  return {
    file,
    body,
    galleryImages,
    sourcePostId: Number(frontmatterValue(frontmatter, 'sourcePostId')),
    title: frontmatterValue(frontmatter, 'title'),
    description: frontmatterValue(frontmatter, 'description'),
    publishDate: frontmatterValue(frontmatter, 'publishDate'),
    year: Number(frontmatterValue(frontmatter, 'year')),
    slug: frontmatterValue(frontmatter, 'slug'),
    historicalPath: frontmatterValue(frontmatter, 'historicalPath'),
    legacyUrl: frontmatterValue(frontmatter, 'legacyUrl'),
    featuredImage: frontmatterValue(frontmatter, 'featuredImage'),
    featuredAlt: frontmatterValue(frontmatter, 'featuredAlt'),
    reviewStatus: frontmatterValue(frontmatter, 'reviewStatus'),
    contentQuality: frontmatterValue(frontmatter, 'contentQuality'),
  };
}

const assert = (condition, message, errors) => {
  if (!condition) errors.push(message);
};

async function fileExists(assetPath) {
  try {
    await access(path.join(ROOT, assetPath.replace(/^\/src\//, 'src/')));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const errors = [];
  const inventory = await readFile(INVENTORY_PATH, 'utf8');
  const expectedRoutes = [
    ...new Set(
      [...inventory.matchAll(/https:\/\/www\.colegioconquistadores\.com(\/\d{4}\/\d{2}\/\d{2}\/[^/\s|]+\/)/g)]
        .map((match) => match[1]),
    ),
  ].sort();
  const files = await listMarkdownFiles(CONTENT_ROOT);
  const activities = await Promise.all(
    files.map(async (file) =>
      parseActivity(file, await readFile(file, 'utf8')),
    ),
  );
  const routes = activities.map((activity) => activity.historicalPath).sort();
  const ids = activities.map((activity) => activity.sourcePostId);
  const datedSlugs = activities.map(
    (activity) =>
      `${activity.publishDate.slice(0, 10)}:${activity.slug}`,
  );

  assert(files.length === EXPECTED_COUNT, `Se esperaban 47 archivos y hay ${files.length}.`, errors);
  assert(expectedRoutes.length === EXPECTED_COUNT, `El inventario contiene ${expectedRoutes.length} rutas de actividad.`, errors);
  assert(new Set(routes).size === routes.length, 'Hay rutas históricas duplicadas.', errors);
  assert(new Set(ids).size === ids.length, 'Hay sourcePostId duplicados.', errors);
  assert(new Set(datedSlugs).size === datedSlugs.length, 'Hay slugs duplicados en una misma fecha.', errors);

  for (const expected of expectedRoutes) {
    assert(routes.includes(expected), `Falta la ruta inventariada ${expected}`, errors);
  }
  for (const route of routes) {
    assert(expectedRoutes.includes(route), `Ruta no inventariada ${route}`, errors);
  }

  for (const activity of activities) {
    const prefix = path.relative(ROOT, activity.file);
    const date = new Date(activity.publishDate);
    assert(Number.isInteger(activity.sourcePostId) && activity.sourcePostId > 0, `${prefix}: sourcePostId inválido.`, errors);
    assert(Boolean(activity.title?.trim()), `${prefix}: título vacío.`, errors);
    assert(Boolean(activity.description?.trim()), `${prefix}: descripción vacía.`, errors);
    assert(Boolean(activity.featuredAlt?.trim()), `${prefix}: alt destacado vacío.`, errors);
    assert(!Number.isNaN(date.getTime()), `${prefix}: fecha inválida.`, errors);
    assert(date.getUTCFullYear() === activity.year, `${prefix}: año incoherente.`, errors);
    assert(activity.historicalPath.endsWith(`/${activity.slug}/`), `${prefix}: slug y ruta no coinciden.`, errors);
    assert(
      activity.legacyUrl ===
        `https://www.colegioconquistadores.com${activity.historicalPath}`,
      `${prefix}: legacyUrl no coincide con la ruta histórica.`,
      errors,
    );
    assert(
      ['reviewed', 'needs-review'].includes(activity.reviewStatus),
      `${prefix}: reviewStatus inválido.`,
      errors,
    );
    assert(
      ['full', 'partial', 'minimal'].includes(activity.contentQuality),
      `${prefix}: contentQuality inválido.`,
      errors,
    );
    assert(
      await fileExists(activity.featuredImage),
      `${prefix}: falta ${activity.featuredImage}`,
      errors,
    );
    for (const image of activity.galleryImages) {
      assert(await fileExists(image), `${prefix}: falta ${image}`, errors);
    }
  }

  if (baseUrl) {
    const checks = await Promise.all(
      ['/actividades/', ...routes].map(async (route) => {
        try {
          const response = await fetch(`${baseUrl}${route}`, {
            redirect: 'manual',
          });
          return { route, status: response.status };
        } catch (error) {
          return { route, status: 0, error: error.message };
        }
      }),
    );
    for (const check of checks) {
      assert(
        check.status === 200,
        `Crawl ${check.route}: HTTP ${check.status}${check.error ? ` (${check.error})` : ''}.`,
        errors,
      );
    }
    console.log(`Crawl HTTP: ${checks.length} rutas con respuesta 200.`);
  }

  if (errors.length) {
    console.error(errors.map((error) => `- ${error}`).join('\n'));
    process.exitCode = 1;
    return;
  }

  console.log('Validador de rutas: 47 actividades, rutas e imágenes correctas.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
