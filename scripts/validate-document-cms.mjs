import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertDocumentSnapshot } from '../src/lib/cms/types.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');

const snapshot = assertDocumentSnapshot(
  JSON.parse(await read('src/data/generated/documents.snapshot.json')),
);
const seed = JSON.parse(
  await read('src/data/generated/documents.seed.json'),
);
if (snapshot.documents.length !== 39) {
  errors.push(
    `El snapshot contiene ${snapshot.documents.length} documentos; se esperaban 39.`,
  );
}
const reviewDocuments = seed.documents.filter(
  ({ status, visibility }) => status === 'review' && visibility === 'hidden',
);
if (seed.documents.length !== 46 || reviewDocuments.length !== 7) {
  errors.push(
    `El seed debe contener 46 documentos y 7 review + hidden; contiene ${seed.documents.length} y ${reviewDocuments.length}.`,
  );
}

const privacyHtml = await read('dist/privacidad/index.html');
for (const fragment of [
  '<h1',
  'Privacidad',
  'noindex,nofollow',
  'no ofrece registro',
  'no se utilizará analítica',
  'pendiente de aprobación',
]) {
  if (!privacyHtml.toLowerCase().includes(fragment.toLowerCase())) {
    errors.push(`La página de privacidad omite: ${fragment}.`);
  }
}
const homeHtml = await read('dist/index.html');
if (!homeHtml.includes('href="/privacidad/"')) {
  errors.push('El footer no enlaza /privacidad/.');
}

const legacyRoutes = await read('src/data/legacy-routes.ts');
for (const route of [
  '/notas/',
  '/mi-cuenta/',
  '/mi-cuenta/lost-password/',
  '/registro/',
]) {
  const start = legacyRoutes.indexOf(`from: '${route}'`);
  const block = start >= 0 ? legacyRoutes.slice(start, start + 260) : '';
  if (
    !block.includes("action: 'gone'") ||
    !block.includes('status: 410') ||
    !block.includes('approved: true')
  ) {
    errors.push(`${route} no está registrada como gone 410 aprobada.`);
  }
}

const browserAssetsDirectory = path.join(root, 'dist/_astro');
const browserAssets = (await readdir(browserAssetsDirectory)).filter((name) =>
  name.endsWith('.js'),
);
const forbiddenBrowserFragments = [
  'CMS_STATIC_TOKEN',
  'Authorization',
  '/items/documents',
  '/items/document_categories',
  'cms.colegioconquistadores.com',
];
for (const asset of browserAssets) {
  const source = await readFile(path.join(browserAssetsDirectory, asset), 'utf8');
  for (const fragment of forbiddenBrowserFragments) {
    if (source.includes(fragment)) {
      errors.push(`El asset ${asset} expone una referencia CMS: ${fragment}.`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Validación documental fallida (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `CMS build-time válido: ${snapshot.documents.length} públicos, 7 review excluidos, privacidad, 410 y cero requests CMS en navegador.`,
);
