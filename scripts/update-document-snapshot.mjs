import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchDirectusSnapshot } from '../src/lib/cms/directus.ts';

const cmsUrl = process.env.CMS_URL?.trim();
const token = process.env.CMS_STATIC_TOKEN?.trim();
if (!cmsUrl || !token) {
  console.error(
    'CMS_URL y CMS_STATIC_TOKEN son obligatorios para actualizar el snapshot.',
  );
  process.exit(1);
}

const snapshot = await fetchDirectusSnapshot({
  cmsUrl,
  token,
  timeoutMs: 10_000,
});
const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const outputPath = path.join(
  projectRoot,
  'src/data/generated/documents.snapshot.json',
);
await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
console.log(
  `Snapshot actualizado: ${snapshot.documents.length} documentos, generado ${snapshot.generatedAt}.`,
);
