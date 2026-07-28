import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const SOURCE = 'https://www.colegioconquistadores.com';
const OUTPUT_DIRECTORY = path.resolve('.cache/activity-import');
const INTERMEDIATE_PATH = path.join(OUTPUT_DIRECTORY, 'wordpress-activities.json');
const REPORT_PATH = path.join(OUTPUT_DIRECTORY, 'review-report.json');

const decodeEntities = (value = '') =>
  value
    .replaceAll('&#8211;', '–')
    .replaceAll('&#8212;', '—')
    .replaceAll('&#8216;', '‘')
    .replaceAll('&#8217;', '’')
    .replaceAll('&#8220;', '“')
    .replaceAll('&#8221;', '”')
    .replaceAll('&#8230;', '…')
    .replaceAll('&#038;', '&')
    .replaceAll('&amp;', '&')
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');

const stripTags = (value = '') =>
  decodeEntities(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, ' ')
      .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();

const unique = (values) => [...new Set(values.filter(Boolean))];

function collectMatches(html, expression, group = 1) {
  return unique([...html.matchAll(expression)].map((match) => decodeEntities(match[group])));
}

function extractCandidates(html) {
  const unsafeRemoved = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, '')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '');

  const contentBlocks = [
    ...unsafeRemoved.matchAll(
      /<(h[2-4]|p|li|caption|th|td)\b[^>]*>([\s\S]*?)<\/\1>/gi,
    ),
  ]
    .map((match) => ({
      tag: match[1].toLocaleLowerCase('es'),
      text: stripTags(match[2]),
    }))
    .filter(
      ({ text }) =>
        text.length > 1 &&
        !/^(últimas actividades|buscar actividad|ver actividades)$/i.test(text),
    );

  return {
    contentBlocks,
    textBlocks: contentBlocks.map(({ text }) => text),
    imageUrls: collectMatches(
      unsafeRemoved,
      /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi,
    ).filter((url) => url.startsWith('http')),
    links: collectMatches(
      unsafeRemoved,
      /<a\b[^>]*\bhref=["']([^"'#]+)["'][^>]*>/gi,
    ).filter((url) => url.startsWith('http')),
    driveLinks: collectMatches(
      unsafeRemoved,
      /<a\b[^>]*\bhref=["'](https:\/\/drive\.google\.com\/[^"']+)["'][^>]*>/gi,
    ),
    containsElementor: /elementor-element/i.test(html),
    containsSearch: /ajax-search-lite|Buscar Actividad/i.test(html),
    containsLatestActivities: /[UÚ]ltimas Actividades/i.test(stripTags(html)),
    containsForm: /<form\b/i.test(html),
    containsScript: /<script\b/i.test(html),
    containsTable: /<table\b/i.test(html),
  };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Colegio-Conquistadores-Astro-Importer/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }

  return {
    data: await response.json(),
    totalPages: Number(response.headers.get('x-wp-totalpages') || '1'),
  };
}

async function fetchPosts() {
  const posts = [];
  let page = 1;
  let totalPages = 1;

  do {
    const url = new URL('/wp-json/wp/v2/posts', SOURCE);
    url.searchParams.set('per_page', '20');
    url.searchParams.set('page', String(page));
    url.searchParams.set('orderby', 'id');
    url.searchParams.set('order', 'asc');
    url.searchParams.set(
      '_fields',
      'id,slug,link,date,modified,title,content,featured_media,categories',
    );

    const result = await fetchJson(url);
    posts.push(...result.data);
    totalPages = result.totalPages;
    page += 1;
  } while (page <= totalPages);

  return posts;
}

async function fetchMedia(mediaIds) {
  const entries = await Promise.all(
    mediaIds.map(async (id) => {
      const url = new URL(`/wp-json/wp/v2/media/${id}`, SOURCE);
      url.searchParams.set(
        '_fields',
        'id,source_url,alt_text,caption,media_details,mime_type',
      );
      const { data } = await fetchJson(url);
      return [id, data];
    }),
  );

  return Object.fromEntries(entries);
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );
  return results;
}

async function fetchMediaIndex() {
  const media = [];
  let page = 1;
  let totalPages = 1;

  do {
    const url = new URL('/wp-json/wp/v2/media', SOURCE);
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', String(page));
    url.searchParams.set('orderby', 'id');
    url.searchParams.set('order', 'asc');
    url.searchParams.set(
      '_fields',
      'id,source_url,alt_text,caption,media_details,mime_type',
    );
    const result = await fetchJson(url);
    media.push(...result.data);
    totalPages = result.totalPages;
    page += 1;
  } while (page <= totalPages);

  return media;
}

async function fetchPageSignals(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'text/html',
      'User-Agent': 'Colegio-Conquistadores-Astro-Importer/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }

  const html = await response.text();
  return {
    sliderIds: collectMatches(html, /data-ssid=["'](\d+)["']/gi),
    sliderCacheFiles: collectMatches(
      html,
      /wp-content\/uploads\/slider\/cache\/[^"'()<>\s\\]+\/([^"'()<>\s\\]+)/gi,
    ),
    uploadUrls: collectMatches(
      html,
      /(?:https?:)?(?:\\\/|\/){2}www\.colegioconquistadores\.com(?:\\\/|\/)wp-content(?:\\\/|\/)uploads(?:\\\/|\/)[^"'()<>\s\\]+/gi,
      0,
    ).map((value) => value.replaceAll('\\/', '/')),
  };
}

const normalizedMediaStem = (value) =>
  path
    .basename(new URL(value, SOURCE).pathname)
    .replace(/\.[^.]+$/, '')
    .replace(/-scaled$/, '')
    .toLocaleLowerCase('es');

function normalizePost(post, media, pageSignals, mediaIndex) {
  const candidates = extractCandidates(post.content.rendered);
  const sliderPrefixes = pageSignals.sliderIds.map(
    (id) => `${SOURCE}/wp-content/uploads/slider${id}/`,
  );
  const folderGalleryMedia = mediaIndex
    .filter(
      (item) =>
        item.mime_type?.startsWith('image/') &&
        sliderPrefixes.some((prefix) => item.source_url.startsWith(prefix)) &&
        !item.source_url.includes('/slider/cache/'),
    )
    .map((item) => ({
      id: item.id,
      sourceUrl: item.source_url,
      alt: decodeEntities(item.alt_text ?? ''),
      caption: stripTags(item.caption?.rendered ?? ''),
      width: item.media_details?.width ?? null,
      height: item.media_details?.height ?? null,
      filesize: item.media_details?.filesize ?? null,
      mimeType: item.mime_type ?? null,
    }));
  const fallbackGalleryMedia = pageSignals.sliderCacheFiles
    .map((filename) => {
      const targetStem = filename
        .replace(/\.[^.]+$/, '')
        .replace(/-scaled$/, '')
        .toLocaleLowerCase('es');
      return mediaIndex.find(
        (item) =>
          item.mime_type?.startsWith('image/') &&
          !item.source_url.includes('/slider/cache/') &&
          normalizedMediaStem(item.source_url) === targetStem,
      );
    })
    .filter(Boolean)
    .map((item) => ({
      id: item.id,
      sourceUrl: item.source_url,
      alt: decodeEntities(item.alt_text ?? ''),
      caption: stripTags(item.caption?.rendered ?? ''),
      width: item.media_details?.width ?? null,
      height: item.media_details?.height ?? null,
      filesize: item.media_details?.filesize ?? null,
      mimeType: item.mime_type ?? null,
    }));
  const galleryMedia = [
    ...new Map(
      [...folderGalleryMedia, ...fallbackGalleryMedia].map((item) => [
        item.sourceUrl,
        item,
      ]),
    ).values(),
  ];

  return {
    sourcePostId: post.id,
    title: decodeEntities(stripTags(post.title.rendered)),
    slug: post.slug,
    historicalPath: new URL(post.link).pathname,
    legacyUrl: post.link,
    publishDate: post.date,
    modifiedDate: post.modified,
    categories: post.categories,
    featuredMedia: {
      id: post.featured_media,
      sourceUrl: media?.source_url ?? null,
      alt: decodeEntities(media?.alt_text ?? ''),
      caption: stripTags(media?.caption?.rendered ?? ''),
      width: media?.media_details?.width ?? null,
      height: media?.media_details?.height ?? null,
      filesize: media?.media_details?.filesize ?? null,
      mimeType: media?.mime_type ?? null,
    },
    galleryMedia,
    pageSignals: {
      sliderIds: pageSignals.sliderIds,
      sliderCacheFiles: pageSignals.sliderCacheFiles,
      nonCacheUploadUrls: pageSignals.uploadUrls.filter(
        (url) => !url.includes('/slider/cache/'),
      ),
    },
    candidates,
    renderedHtml: post.content.rendered,
  };
}

async function main() {
  const allowOverwrite = process.argv.includes('--overwrite-cache');
  await mkdir(OUTPUT_DIRECTORY, { recursive: true });

  if (!allowOverwrite) {
    try {
      await readFile(INTERMEDIATE_PATH, 'utf8');
      throw new Error(
        `Ya existe ${path.relative(process.cwd(), INTERMEDIATE_PATH)}. ` +
          'Use --overwrite-cache para reemplazar solo la caché local.',
      );
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }

  const posts = await fetchPosts();
  const mediaIds = unique(posts.map((post) => post.featured_media));
  const [mediaById, mediaIndex, pageSignals] = await Promise.all([
    fetchMedia(mediaIds),
    fetchMediaIndex(),
    mapWithConcurrency(posts, 4, (post) => fetchPageSignals(post.link)),
  ]);
  const normalized = posts.map((post, index) =>
    normalizePost(
      post,
      mediaById[post.featured_media],
      pageSignals[index],
      mediaIndex,
    ),
  );

  const duplicatePostIds = posts
    .map((post) => post.id)
    .filter((id, index, values) => values.indexOf(id) !== index);
  const duplicatePaths = normalized
    .map((post) => post.historicalPath)
    .filter((route, index, values) => values.indexOf(route) !== index);

  const reviewReport = {
    generatedAt: new Date().toISOString(),
    source: SOURCE,
    itemCount: normalized.length,
    dateRange: {
      earliest: normalized
        .map((post) => post.publishDate)
        .sort((a, b) => a.localeCompare(b))[0],
      latest: normalized
        .map((post) => post.publishDate)
        .sort((a, b) => b.localeCompare(a))[0],
    },
    validation: {
      expectedCount: 47,
      countMatches: normalized.length === 47,
      duplicatePostIds,
      duplicatePaths,
      missingFeaturedMedia: normalized
        .filter((post) => !post.featuredMedia.sourceUrl)
        .map((post) => post.sourcePostId),
    },
    reviewQueue: normalized.map((post) => ({
      sourcePostId: post.sourcePostId,
      historicalPath: post.historicalPath,
      title: post.title,
      textBlockCount: post.candidates.textBlocks.length,
      imageCandidateCount: post.candidates.imageUrls.length,
      galleryImageCount: post.galleryMedia.length,
      sliderIds: post.pageSignals.sliderIds,
      driveLinkCount: post.candidates.driveLinks.length,
      containsSearch: post.candidates.containsSearch,
      containsLatestActivities: post.candidates.containsLatestActivities,
      containsTable: post.candidates.containsTable,
      requiresEditorialReview: true,
    })),
    safeguards: {
      writesCuratedContent: false,
      cacheIsIgnoredByGit: true,
      productionBuildDependency: false,
      authenticatedDataRequested: false,
    },
  };

  await writeFile(INTERMEDIATE_PATH, `${JSON.stringify(normalized, null, 2)}\n`);
  await writeFile(REPORT_PATH, `${JSON.stringify(reviewReport, null, 2)}\n`);

  console.log(
    `Importación preparada: ${normalized.length} entradas y ${mediaIds.length} medios destacados.`,
  );
  console.log(`Intermedio local: ${path.relative(process.cwd(), INTERMEDIATE_PATH)}`);
  console.log(`Reporte local: ${path.relative(process.cwd(), REPORT_PATH)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
