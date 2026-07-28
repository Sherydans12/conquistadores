import { stat } from 'node:fs/promises';
import path from 'node:path';
import {
  distRoot,
  formatBytes,
  projectRoot,
  walkFiles,
} from './validation-helpers.mjs';

const MIB = 1024 ** 2;
const limits = {
  sourceFile: 1 * MIB,
  activitySources: 100 * MIB,
  allSources: 125 * MIB,
  distAstro: 250 * MIB,
  generatedFile: 750 * 1024,
};
const imageExtensions = new Set([
  '.avif',
  '.gif',
  '.jpeg',
  '.jpg',
  '.png',
  '.svg',
  '.webp',
]);

async function inventory(directory, filter = () => true) {
  const files = (await walkFiles(directory)).filter(filter);
  const entries = await Promise.all(
    files.map(async (filePath) => ({
      filePath,
      size: (await stat(filePath)).size,
    })),
  );
  const total = entries.reduce((sum, entry) => sum + entry.size, 0);
  const largest = entries.reduce(
    (current, entry) => (entry.size > current.size ? entry : current),
    { filePath: '', size: 0 },
  );
  return { files, entries, total, largest };
}

const sourceRoot = path.join(projectRoot, 'src/assets');
const activityRoot = path.join(sourceRoot, 'images/activities');
const astroRoot = path.join(distRoot, '_astro');
const sourceImages = await inventory(sourceRoot, (filePath) =>
  imageExtensions.has(path.extname(filePath).toLowerCase()),
);
const allSources = await inventory(sourceRoot);
const activitySources = await inventory(activityRoot, (filePath) =>
  imageExtensions.has(path.extname(filePath).toLowerCase()),
);
const dist = await inventory(distRoot);
const distAstro = await inventory(astroRoot);
const generatedImages = await inventory(astroRoot, (filePath) =>
  imageExtensions.has(path.extname(filePath).toLowerCase()),
);
const errors = [];

for (const entry of sourceImages.entries) {
  if (entry.size > limits.sourceFile) {
    errors.push(
      `Fuente sobre 1 MiB: ${path.relative(projectRoot, entry.filePath)} (${formatBytes(entry.size)})`,
    );
  }
}
for (const entry of distAstro.entries) {
  if (entry.size > limits.generatedFile) {
    errors.push(
      `Asset generado sobre 750 KiB: ${path.relative(projectRoot, entry.filePath)} (${formatBytes(entry.size)})`,
    );
  }
}
if (activitySources.total > limits.activitySources) {
  errors.push(`Actividades superan 100 MiB (${formatBytes(activitySources.total)}).`);
}
if (allSources.total > limits.allSources) {
  errors.push(`src/assets supera 125 MiB (${formatBytes(allSources.total)}).`);
}
if (distAstro.total > limits.distAstro) {
  errors.push(`dist/_astro supera 250 MiB (${formatBytes(distAstro.total)}).`);
}

console.log(`Imágenes fuente: ${sourceImages.files.length}.`);
console.log(`src/assets: ${formatBytes(allSources.total)}.`);
console.log(`Actividades fuente: ${formatBytes(activitySources.total)}.`);
console.log(
  `Mayor fuente: ${path.relative(projectRoot, sourceImages.largest.filePath)} (${formatBytes(sourceImages.largest.size)}).`,
);
console.log(`dist: ${formatBytes(dist.total)}.`);
console.log(`dist/_astro: ${formatBytes(distAstro.total)}.`);
console.log(`Variantes de imagen generadas: ${generatedImages.files.length}.`);
console.log(
  `Mayor asset generado: ${path.relative(projectRoot, distAstro.largest.filePath)} (${formatBytes(distAstro.largest.size)}).`,
);

if (errors.length > 0) {
  console.error(`Presupuesto de assets excedido (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Presupuestos de assets dentro de los límites iniciales.');
