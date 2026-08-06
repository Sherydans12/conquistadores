import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertDocumentSnapshot } from '../src/lib/cms/types.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const retiredDocumentSlugs = new Set([
  'horarios-2025',
  'ficha-matricula-2025',
]);

const snapshot = assertDocumentSnapshot(
  JSON.parse(await read('src/data/generated/documents.snapshot.json')),
);
const seed = JSON.parse(
  await read('src/data/generated/documents.seed.json'),
);
const activeSnapshotDocuments = snapshot.documents.filter(
  ({ slug }) => !retiredDocumentSlugs.has(slug),
);
if (activeSnapshotDocuments.length !== 38) {
  errors.push(
    `El snapshot activo contiene ${activeSnapshotDocuments.length} documentos; se esperaban 38.`,
  );
}
const activeSeedDocuments = seed.documents.filter(
  ({ slug }) => !retiredDocumentSlugs.has(slug),
);
const reviewDocuments = activeSeedDocuments.filter(
  ({ status, visibility }) => status === 'review' && visibility === 'hidden',
);
if (activeSeedDocuments.length !== 44 || reviewDocuments.length !== 6) {
  errors.push(
    `El seed activo debe contener 44 documentos y 6 review + hidden; contiene ${activeSeedDocuments.length} y ${reviewDocuments.length}.`,
  );
}

const privacyHtml = await read('dist/privacidad/index.html');
const robotsText = await read('dist/robots.txt');
const privacyRobots = robotsText.includes('Allow: /')
  ? 'index,follow'
  : 'noindex,nofollow';
for (const fragment of [
  '<h1',
  'Privacidad',
  privacyRobots,
  'Arturo Javier Galleguillos Trigo',
  'galleguillostrigo@gmail.com',
  'no ofrece registro',
  'no se utilizará analítica',
]) {
  if (!privacyHtml.toLowerCase().includes(fragment.toLowerCase())) {
    errors.push(`La página de privacidad omite: ${fragment}.`);
  }
}
if (privacyHtml.toLowerCase().includes('pendiente de aprobación')) {
  errors.push('La página de privacidad conserva texto pendiente de aprobación.');
}
const homeHtml = await read('dist/index.html');
if (!homeHtml.includes('href="/privacidad/"')) {
  errors.push('El footer no enlaza /privacidad/.');
}
const documentsHtml = await read('dist/documentos/index.html');
for (const retiredSlug of retiredDocumentSlugs) {
  if (documentsHtml.includes(retiredSlug)) {
    errors.push(`El centro documental todavía publica ${retiredSlug}.`);
  }
}
const enrollmentHtml = await read('dist/matriculas-2027/index.html');
const emptyEnrollmentMessage =
  'Los documentos de Matrículas 2027 se publicarán en esta sección cuando estén disponibles.';
for (const [label, html] of [
  ['/documentos/', documentsHtml],
  ['/matriculas-2027/', enrollmentHtml],
]) {
  if (!html.includes(emptyEnrollmentMessage)) {
    errors.push(`${label} omite el estado vacío de documentos 2027.`);
  }
  if (html.includes('CMS_STATIC_TOKEN')) {
    errors.push(`${label} expone CMS_STATIC_TOKEN.`);
  }
}
if (!documentsHtml.includes('Matrículas y admisión 2027')) {
  errors.push('/documentos/ omite la sección principal de Matrículas 2027.');
}
if (!documentsHtml.includes('Matrículas y admisión — años anteriores')) {
  errors.push('/documentos/ no identifica los documentos de años anteriores.');
}
if (!documentsHtml.includes('utiles-2026-1-basico')) {
  errors.push('/documentos/ dejó de publicar el catálogo normalizado de 2026.');
}
if (enrollmentHtml.includes('utiles-2026-1-basico')) {
  errors.push('/matriculas-2027/ presenta un documento de 2026 como contenido 2027.');
}
for (const html of [homeHtml, enrollmentHtml]) {
  if (!html.includes('https://portal.edupay.baselogic.cl/')) {
    errors.push('Falta el acceso oficial a EduPay en una ruta requerida.');
  }
  if (/<iframe\b/i.test(html)) {
    errors.push('EduPay no debe integrarse mediante iframe.');
  }
}

const legacyRoutes = await read('src/data/legacy-routes.ts');
for (const route of [
  '/notas/',
  '/mi-cuenta/',
  '/mi-cuenta/lost-password/',
  '/registro/',
]) {
  const start = legacyRoutes.indexOf(`from: '${route}'`);
  const block = start >= 0 ? legacyRoutes.slice(start, start + 280) : '';
  if (
    !block.includes("action: 'gone'") ||
    !block.includes('status: 410') ||
    !block.includes('approved: true')
  ) {
    errors.push(`${route} no está registrada como gone 410 aprobada.`);
  }
}
for (const route of ['/horarios-2025/', '/matriculas-2025/']) {
  const start = legacyRoutes.indexOf(`from: '${route}'`);
  const block = start >= 0 ? legacyRoutes.slice(start, start + 340) : '';
  if (
    !block.includes("action: 'not-found'") ||
    !block.includes('status: 404') ||
    !block.includes('approved: true')
  ) {
    errors.push(`${route} no está registrada como retirada 404 aprobada.`);
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
  `CMS build-time válido: ${activeSnapshotDocuments.length} públicos efectivos, ${reviewDocuments.length} review excluidos, privacidad aprobada, 410 y cero requests CMS en navegador.`,
);
