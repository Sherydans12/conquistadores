import {
  access,
  mkdir,
  readFile,
  stat,
  unlink,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const SOURCE_PATH = path.resolve(
  '.cache/activity-import/wordpress-activities.json',
);
const CONTENT_ROOT = path.resolve('src/content/activities');
const MANIFEST_PATH = path.resolve(
  'docs/implementation/activity-migration-manifest.json',
);
const allowOverwrite = process.argv.includes('--overwrite-content');

const existingFeatured = new Map([
  [
    5679,
    '/src/assets/images/activities/world-robot-olympiad-2025.webp',
  ],
  [5611, '/src/assets/images/activities/gala-raiz-folclorica-2025.webp'],
  [5626, '/src/assets/images/activities/dia-de-la-familia-2025.webp'],
]);

const featuredPostIds = new Set([5679, 5611, 5626]);
const relatedTitles = new Set([
  'colegio conquistadores lleva su innovacion a la world robot olympiad chile',
  'gala raiz folclorica 2025',
  'dia de la familia 2025',
  'campana teleton 2024',
  'visita del kinder jardin conquistadores',
  'acto pueblos originarios',
]);

const galaResources = [
  [
    'Presentación 1° Básico',
    'https://drive.google.com/file/d/1Zi42VSevpYZr-5Wv-jSsfIEof734sTT9/view?usp=drive_link',
  ],
  [
    'Presentación 2° Básico',
    'https://drive.google.com/file/d/1RGHg8IL3Ht6tX40YgfMOzkMkpkldnrpe/view?usp=drive_link',
  ],
  [
    'Presentación 3° Básico',
    'https://drive.google.com/file/d/1Ol2LuMxbXXVvlr7LwDDcrgIeGB1QnIm5/view?usp=drive_link',
  ],
  [
    'Presentación 4° Básico',
    'https://drive.google.com/file/d/1tyeCSTvVJC1OzCSIac40lZm82pqPZ5R4/view?usp=drive_link',
  ],
  [
    'Presentación 5° Básico',
    'https://drive.google.com/file/d/1BdTn_zszajQNGj4xBJm2Bwf8gDUP89Uh/view?usp=drive_link',
  ],
  [
    'Presentación 6° Básico',
    'https://drive.google.com/file/d/1JhkmZjA92a81HWzcQhXTAqDt5PMCWazI/view?usp=drive_link',
  ],
  [
    'Presentación 7° Básico',
    'https://drive.google.com/file/d/11_aOUb_IVBjC91AGSgWu1ydNOpl0Qrnq/view?usp=drive_link',
  ],
  [
    'Presentación 8° Básico',
    'https://drive.google.com/file/d/18CZcB47oJWTt1ncpwuAx88naUeEsgnKB/view?usp=drive_link',
  ],
  [
    'Presentación 1° Medio',
    'https://drive.google.com/file/d/1WmyOPiOm2FTjgxZ2Wb1R-L5OiXF_dRDG/view?usp=drive_link',
  ],
  [
    'Presentación 2° Medio',
    'https://drive.google.com/file/d/1IacnEOGXHenlPRs117_Ijrb0d7Nt8Zf9/view?usp=drive_link',
  ],
  [
    'Gala completa (todas las presentaciones)',
    'https://drive.google.com/file/d/1SwdnxsQeCMJP9D5MWo_JFVFE5bNNKWkw/view?usp=drive_link',
  ],
];

const galaBody = `Estimada comunidad del Colegio Conquistadores:

Con inmensa alegría y orgullo, celebramos el rotundo éxito de nuestra **Gala Raíz Folclórica 2025**, un evento que llenó de color, música y tradición chilena nuestros corazones, en el marco de la conmemoración de Fiestas Patrias.

Nuestros estudiantes, desde Primero Básico hasta Segundo Medio, demostraron una dedicación admirable y un profundo respeto por nuestras tradiciones. A través de horas de ensayo y con trajes llenos de detalles, nos transportaron a diferentes rincones de Chile y de nuestro folclore andino y polinésico.

Agradecemos sinceramente a los profesores que guiaron cada montaje, a los apoderados por su apoyo incondicional y, por supuesto, a nuestros talentosos estudiantes, que son el corazón y el alma de esta celebración.

## Espectáculo y presentaciones

Cada curso nos regaló un número único, destacando la diversidad de nuestro patrimonio cultural:

<div class="activity-table-wrapper" tabindex="0" role="region" aria-label="Presentaciones de la Gala Raíz Folclórica 2025">
  <table>
    <caption>Presentaciones por curso de la Gala Raíz Folclórica 2025</caption>
    <thead>
      <tr><th scope="col">Curso</th><th scope="col">Presentación</th><th scope="col">Tipo de baile</th></tr>
    </thead>
    <tbody>
      <tr><th scope="row">1° Básico</th><td>Cacharpaya</td><td>Folclore Andino</td></tr>
      <tr><th scope="row">2° Básico</th><td>Trastrasera</td><td>Baile de la Zona Sur</td></tr>
      <tr><th scope="row">3° Básico</th><td>Todos Juntos</td><td>Fusión Folclórica</td></tr>
      <tr><th scope="row">4° Básico</th><td>Mira Niñita</td><td>Fusión Folclórica</td></tr>
      <tr><th scope="row">5° Básico</th><td>Mercado Testaccio</td><td>Baile de Proyección</td></tr>
      <tr><th scope="row">6° Básico</th><td>Caporal</td><td>Folclore Andino</td></tr>
      <tr><th scope="row">7° Básico</th><td>Diablada</td><td>Folclore Andino (Norte)</td></tr>
      <tr><th scope="row">8° Básico</th><td>La Jardinera</td><td>Cueca Chilena / Fusión</td></tr>
      <tr><th scope="row">1° Medio</th><td>Mix Rapanui</td><td>Polinésico (Isla de Pascua)</td></tr>
      <tr><th scope="row">2° Medio</th><td>Fantasía en Cueca</td><td>Baile Nacional Proyectado</td></tr>
    </tbody>
  </table>
</div>

## Videos de las presentaciones

Los videos se conservan como enlaces al almacenamiento de Google Drive del colegio. No se reproducen ni descargan automáticamente desde esta página.`;

const normalize = (value = '') =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, ' ')
    .trim()
    .toLocaleLowerCase('es');

const stripTags = (value = '') =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;/g, '’')
    .replace(/\s+/g, ' ')
    .trim();

const isDateArtifact = (value) =>
  /^(?:\d{1,2}\s+de\s+\p{Letter}+|\d{1,2}\/\d{1,2}\/\d{4}|\p{Letter}+\s+\d{1,2},\s+\d{4}|\d{1,2}\s+de\s+\p{Letter}+\s+[–-]\s+\d{4})$/iu.test(
    value,
  );

function cleanEditorialBlocks(post) {
  const titleKey = normalize(post.title);
  return post.candidates.contentBlocks.filter(({ tag, text }) => {
    const key = normalize(text);
    if (!text || isDateArtifact(text)) return false;
    if (relatedTitles.has(key)) return false;
    if (key === titleKey || (tag.startsWith('h') && key.includes(titleKey))) {
      return false;
    }
    if (['caption', 'th', 'td'].includes(tag)) return false;
    if (/^h[2-4]$/.test(tag)) return false;
    return true;
  });
}

function descriptionFrom(text) {
  const compact = text.replace(/\s+/g, ' ').trim();
  if (compact.length <= 158) return compact;
  const sentenceEnd = compact.slice(0, 170).match(/^(.{80,158}[.!?])(?:\s|$)/);
  if (sentenceEnd) return sentenceEnd[1];
  const shortened = compact.slice(0, 155).replace(/\s+\S*$/, '');
  return `${shortened}…`;
}

function markdownBody(post, blocks) {
  if (post.sourcePostId === 5611) return galaBody;

  const lead =
    post.sourcePostId === 5679
      ? stripTags(
          post.renderedHtml.match(/<h6\b[^>]*>([\s\S]*?)<\/h6>/i)?.[1] ?? '',
        )
      : '';
  const paragraphs = blocks.filter(({ tag }) => tag === 'p').map(({ text }) => text);
  const listItems = blocks.filter(({ tag }) => tag === 'li').map(({ text }) => text);
  const sections = [];

  if (lead) sections.push(`**${lead}**`);
  sections.push(...paragraphs);
  if (listItems.length) sections.push(listItems.map((item) => `- ${item}`).join('\n'));

  return sections.join('\n\n');
}

function yamlString(value) {
  return JSON.stringify(value);
}

function localAssetPath(year, slug, filename) {
  return `/src/assets/images/activities/${year}/${slug}/${filename}`;
}

function diskPathFromAsset(assetPath) {
  return path.resolve(assetPath.replace(/^\/src\//, 'src/'));
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function fetchBuffer(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'image/*',
          'User-Agent': 'Colegio-Conquistadores-Astro-Migration/1.0',
        },
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`No fue posible descargar ${url}: ${lastError?.message}`);
}

async function optimizeImage(sourceUrl, destination, kind) {
  if (await exists(destination)) {
    try {
      const metadata = await sharp(destination).metadata();
      return {
        bytes: (await stat(destination)).size,
        width: metadata.width,
        height: metadata.height,
        reused: true,
      };
    } catch {
      await unlink(destination);
    }
  }

  const input = await fetchBuffer(sourceUrl);
  await mkdir(path.dirname(destination), { recursive: true });
  const pipeline = sharp(input, { failOn: 'warning' }).rotate().resize({
    width: kind === 'featured' ? 1600 : 1200,
    height: kind === 'featured' ? 1600 : 1200,
    fit: 'inside',
    withoutEnlargement: true,
  });
  await pipeline
    .webp({
      quality: kind === 'featured' ? 76 : 68,
      effort: 3,
      smartSubsample: true,
    })
    .toFile(destination);

  const metadata = await sharp(destination).metadata();
  return {
    bytes: (await stat(destination)).size,
    width: metadata.width,
    height: metadata.height,
    reused: false,
  };
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let next = 0;
  let completed = 0;

  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await mapper(items[index], index);
      completed += 1;
      if (completed % 25 === 0 || completed === items.length) {
        console.log(`Imágenes procesadas: ${completed}/${items.length}`);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );
  return results;
}

async function main() {
  if (!(await exists(SOURCE_PATH))) {
    throw new Error(
      'Falta la caché de importación. Ejecute primero npm run activities:import.',
    );
  }

  if (!allowOverwrite && (await exists(CONTENT_ROOT))) {
    throw new Error(
      'El directorio de contenido ya existe. Use --overwrite-content únicamente después de revisar los cambios.',
    );
  }

  const posts = JSON.parse(await readFile(SOURCE_PATH, 'utf8')).sort((a, b) =>
    a.publishDate.localeCompare(b.publishDate),
  );
  const jobs = [];
  const postWork = [];

  for (const post of posts) {
    const year = Number(post.historicalPath.split('/')[1]);
    const featuredAsset =
      existingFeatured.get(post.sourcePostId) ??
      localAssetPath(year, post.slug, 'featured.webp');
    const featuredStem = path
      .basename(new URL(post.featuredMedia.sourceUrl).pathname)
      .replace(/\.[^.]+$/, '')
      .replace(/-scaled$/, '')
      .toLocaleLowerCase('es');
    const gallerySource = post.galleryMedia.filter((item) => {
      const stem = path
        .basename(new URL(item.sourceUrl).pathname)
        .replace(/\.[^.]+$/, '')
        .replace(/-scaled$/, '')
        .toLocaleLowerCase('es');
      return item.sourceUrl !== post.featuredMedia.sourceUrl && stem !== featuredStem;
    });
    const gallery = gallerySource.map((item, index) => ({
      sourceUrl: item.sourceUrl,
      assetPath: localAssetPath(
        year,
        post.slug,
        `gallery-${String(index + 1).padStart(3, '0')}.webp`,
      ),
      alt: `${post.title}: registro fotográfico ${index + 1}`,
      caption: item.caption || undefined,
    }));

    if (!existingFeatured.has(post.sourcePostId)) {
      jobs.push({
        sourceUrl: post.featuredMedia.sourceUrl,
        assetPath: featuredAsset,
        kind: 'featured',
        postId: post.sourcePostId,
      });
    }
    jobs.push(
      ...gallery.map((item) => ({
        sourceUrl: item.sourceUrl,
        assetPath: item.assetPath,
        kind: 'gallery',
        postId: post.sourcePostId,
      })),
    );
    postWork.push({ post, year, featuredAsset, gallery });
  }

  const jobResults = await mapWithConcurrency(jobs, 12, async (job) => ({
    ...job,
    ...(await optimizeImage(
      job.sourceUrl,
      diskPathFromAsset(job.assetPath),
      job.kind,
    )),
  }));
  const resultByAsset = new Map(
    jobResults.map((result) => [result.assetPath, result]),
  );

  for (const [postId, assetPath] of existingFeatured) {
    const destination = diskPathFromAsset(assetPath);
    const metadata = await sharp(destination).metadata();
    resultByAsset.set(assetPath, {
      assetPath,
      kind: 'featured',
      postId,
      bytes: (await stat(destination)).size,
      width: metadata.width,
      height: metadata.height,
      reused: true,
    });
  }

  const manifestEntries = [];
  for (const work of postWork) {
    const { post, year, featuredAsset, gallery } = work;
    const cleanBlocks = cleanEditorialBlocks(post);
    const body = markdownBody(post, cleanBlocks);
    const firstParagraph =
      cleanBlocks.find(({ tag }) => tag === 'p')?.text ?? post.title;
    const description =
      post.sourcePostId === 5611
        ? 'La Gala Raíz Folclórica 2025 reunió presentaciones de 1° Básico a 2° Medio y enlaces públicos a los registros audiovisuales.'
        : descriptionFrom(firstParagraph);
    const isPartial = post.sourcePostId === 5200;
    const contentQuality = body.trim()
      ? isPartial
        ? 'partial'
        : 'full'
      : 'minimal';
    const reviewStatus =
      contentQuality === 'full' ? 'reviewed' : 'needs-review';
    const featuredAlt =
      post.featuredMedia.alt ||
      `Imagen destacada de la actividad ${post.title}`;
    const externalResources =
      post.sourcePostId === 5611
        ? galaResources.map(([label, url]) => ({
            label,
            url,
            service: 'Google Drive',
          }))
        : [];

    const lines = [
      '---',
      `sourcePostId: ${post.sourcePostId}`,
      `title: ${yamlString(post.title)}`,
      `description: ${yamlString(description)}`,
      `publishDate: ${yamlString(post.publishDate)}`,
      `modifiedDate: ${yamlString(post.modifiedDate)}`,
      `year: ${year}`,
      `slug: ${yamlString(post.slug)}`,
      `historicalPath: ${yamlString(post.historicalPath)}`,
      `legacyUrl: ${yamlString(post.legacyUrl)}`,
      `featuredImage: ${yamlString(featuredAsset)}`,
      `featuredAlt: ${yamlString(featuredAlt)}`,
      `featured: ${featuredPostIds.has(post.sourcePostId)}`,
      `reviewStatus: ${yamlString(reviewStatus)}`,
      `contentQuality: ${yamlString(contentQuality)}`,
    ];

    if (gallery.length) {
      lines.push('gallery:');
      for (const item of gallery) {
        lines.push(`  - image: ${yamlString(item.assetPath)}`);
        lines.push(`    alt: ${yamlString(item.alt)}`);
        if (item.caption) {
          lines.push(`    caption: ${yamlString(item.caption)}`);
        }
      }
    }

    if (externalResources.length) {
      lines.push('externalResources:');
      for (const resource of externalResources) {
        lines.push(`  - label: ${yamlString(resource.label)}`);
        lines.push(`    url: ${yamlString(resource.url)}`);
        lines.push(`    service: ${yamlString(resource.service)}`);
      }
    }
    lines.push('---', '', body.trim(), '');

    const contentPath = path.join(CONTENT_ROOT, String(year), `${post.slug}.md`);
    await mkdir(path.dirname(contentPath), { recursive: true });
    await writeFile(contentPath, `${lines.join('\n')}\n`);

    const featuredResult = resultByAsset.get(featuredAsset);
    manifestEntries.push({
      sourcePostId: post.sourcePostId,
      title: post.title,
      historicalUrl: post.legacyUrl,
      astroPath: post.historicalPath,
      publishDate: post.publishDate,
      modifiedDate: post.modifiedDate,
      migrationStatus: 'migrated',
      reviewStatus,
      contentQuality,
      featuredImage: {
        path: featuredAsset,
        sourceUrl: post.featuredMedia.sourceUrl,
        bytes: featuredResult.bytes,
        width: featuredResult.width,
        height: featuredResult.height,
        reusedFromHome: existingFeatured.has(post.sourcePostId),
      },
      gallery: {
        migratedImages: gallery.length,
        sourceSliderIds: post.pageSignals.sliderIds,
        paths: gallery.map((item) => item.assetPath),
      },
      externalResources: externalResources.map(({ label, url, service }) => ({
        label,
        url,
        service,
      })),
      notes: isPartial
        ? [
            'El video MP4 heredado de 30,8 MB no se incorporó; la actividad conserva texto e imagen destacada y requiere una decisión editorial sobre el video.',
          ]
        : [],
    });
  }

  const allResults = [...resultByAsset.values()];
  const uniqueAssets = [
    ...new Map(allResults.map((item) => [item.assetPath, item])).values(),
  ];
  const manifest = {
    generatedAt: new Date().toISOString(),
    source: 'https://www.colegioconquistadores.com',
    destination: 'https://staging.colegioconquistadores.com',
    expectedActivities: 47,
    migratedActivities: manifestEntries.length,
    dateRange: {
      earliest: manifestEntries[0].publishDate,
      latest: manifestEntries.at(-1).publishDate,
    },
    summary: {
      full: manifestEntries.filter((item) => item.contentQuality === 'full').length,
      partial: manifestEntries.filter(
        (item) => item.contentQuality === 'partial',
      ).length,
      minimal: manifestEntries.filter(
        (item) => item.contentQuality === 'minimal',
      ).length,
      needsReview: manifestEntries.filter(
        (item) => item.reviewStatus === 'needs-review',
      ).length,
      featuredImages: manifestEntries.length,
      galleryImages: manifestEntries.reduce(
        (sum, item) => sum + item.gallery.migratedImages,
        0,
      ),
      externalResources: manifestEntries.reduce(
        (sum, item) => sum + item.externalResources.length,
        0,
      ),
      uniqueLocalImages: uniqueAssets.length,
      totalImageBytes: uniqueAssets.reduce((sum, item) => sum + item.bytes, 0),
      largestImageBytes: Math.max(...uniqueAssets.map((item) => item.bytes)),
    },
    entries: manifestEntries,
  };

  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(
    `Contenido generado: ${manifestEntries.length} actividades y ${manifest.summary.galleryImages} imágenes de galería.`,
  );
  console.log(
    `Peso local: ${(manifest.summary.totalImageBytes / 1024 / 1024).toFixed(1)} MB.`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
