import {
  assertDocumentSnapshot,
  isPublishedPublic,
  type DocumentCategory,
  type DocumentSnapshot,
  type SnapshotDocument,
} from './types.ts';
import {
  managedAssetUrl,
  resolveManagedDocumentMime,
  safeManagedFilename,
} from './document-formats.ts';

const DEFAULT_TIMEOUT_MS = 8_000;
const PUBLIC_DOCUMENT_FIELDS = [
  'id',
  'title',
  'slug',
  'description',
  'category.id',
  'category.name',
  'category.slug',
  'school_year',
  'status',
  'visibility',
  'file.id',
  'file.filename_download',
  'file.type',
  'file.filesize',
  'external_url',
  'audience',
  'featured',
  'keywords',
  'sort',
  'published_at',
  'expires_at',
].join(',');

interface DirectusOptions {
  cmsUrl: string;
  token: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
  now?: Date;
}

interface DirectusResponse {
  data?: unknown;
  errors?: Array<{ message?: string }>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function directusUrl(value: string): URL {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('CMS_URL no es una URL válida.');
  }
  const local = ['localhost', '127.0.0.1', '::1'].includes(url.hostname);
  if (url.protocol !== 'https:' && !(local && url.protocol === 'http:')) {
    throw new Error('CMS_URL debe utilizar HTTPS fuera del entorno local.');
  }
  url.pathname = url.pathname.replace(/\/+$/, '');
  return url;
}

function normalizeDocumentUrl(value: string): {
  href: string;
  external: boolean;
} {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('external_url no es una URL válida.');
  }
  if (!['https:', 'http:'].includes(url.protocol)) {
    throw new Error('external_url debe utilizar HTTP(S).');
  }
  if (
    url.hostname === 'www.colegioconquistadores.com' &&
    url.pathname === '/documentos/'
  ) {
    return {
      href: `${url.pathname}${url.search}`,
      external: false,
    };
  }
  return { href: url.toString(), external: true };
}

async function requestData(
  url: URL,
  token: string,
  fetchImpl: typeof fetch,
  timeoutMs: number,
): Promise<unknown[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });
    let payload: DirectusResponse;
    try {
      payload = (await response.json()) as DirectusResponse;
    } catch {
      throw new Error(`Directus respondió JSON inválido (${url.pathname}).`);
    }
    if (!response.ok) {
      throw new Error(
        payload.errors?.[0]?.message ||
          `Directus respondió HTTP ${response.status} (${url.pathname}).`,
      );
    }
    if (!Array.isArray(payload.data)) {
      throw new Error(`Respuesta inválida de Directus (${url.pathname}).`);
    }
    return payload.data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Directus superó el timeout de ${timeoutMs} ms.`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function parseCategory(value: unknown, index: number): DocumentCategory {
  if (!isRecord(value)) throw new Error(`Categoría Directus ${index} inválida.`);
  const { id, name, slug, description, sort } = value;
  if (
    typeof id !== 'string' ||
    typeof name !== 'string' ||
    typeof slug !== 'string' ||
    (description !== null && typeof description !== 'string') ||
    typeof sort !== 'number'
  ) {
    throw new Error(`Categoría Directus ${index} tiene campos inválidos.`);
  }
  return { id, name, slug, description, sort };
}

function parseStringArray(value: unknown, field: string, slug: string): string[] {
  if (value === null) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error(`Documento ${slug}: ${field} debe ser un arreglo de textos.`);
  }
  return value;
}

function formatFileSize(value: unknown): string | null {
  const bytes = typeof value === 'string' ? Number(value) : value;
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes <= 0) {
    return null;
  }
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  return `${Math.ceil(bytes / 1024)} KB`;
}

function displayStatus(
  document: Record<string, unknown>,
  schoolYear: number | null,
  keywords: string[],
  currentYear: number,
): 'current' | 'historical' | 'external' {
  const externalUrl =
    typeof document.external_url === 'string' ? document.external_url : '';
  if (externalUrl && !externalUrl.toLowerCase().includes('.pdf')) {
    return 'external';
  }
  if (
    (schoolYear !== null && schoolYear < currentYear) ||
    keywords.some((keyword) => keyword.toLowerCase().includes('históric'))
  ) {
    return 'historical';
  }
  return 'current';
}

function parseDocument(
  value: unknown,
  baseUrl: URL,
  categoriesById: Map<string, DocumentCategory>,
  currentYear: number,
): SnapshotDocument | null {
  if (!isRecord(value)) throw new Error('Directus devolvió un documento inválido.');
  if (!isPublishedPublic(value)) return null;
  for (const field of ['id', 'title', 'slug', 'description']) {
    if (typeof value[field] !== 'string' || value[field] === '') {
      throw new Error(`Directus devolvió documents.${field} inválido.`);
    }
  }
  const slug = value.slug as string;
  const categoryValue = value.category;
  const categoryId =
    typeof categoryValue === 'string'
      ? categoryValue
      : isRecord(categoryValue) && typeof categoryValue.id === 'string'
        ? categoryValue.id
        : null;
  const category =
    categoryId !== null ? categoriesById.get(categoryId) : undefined;
  if (!category) throw new Error(`Documento ${slug}: categoría inactiva o inválida.`);

  const file = value.file;
  const externalUrl =
    typeof value.external_url === 'string' && value.external_url
      ? value.external_url
      : null;
  const fileId =
    typeof file === 'string'
      ? file
      : isRecord(file) && typeof file.id === 'string'
        ? file.id
        : null;
  if ((fileId === null) === (externalUrl === null)) {
    throw new Error(
      `Documento ${slug}: debe tener exactamente archivo o URL externa.`,
    );
  }
  if (fileId && !isRecord(file)) {
    throw new Error(
      `Documento ${slug}: el archivo asociado no está visible para Astro.`,
    );
  }
  const fileRecord = isRecord(file) ? file : null;

  const managedFormat = fileId
    ? resolveManagedDocumentMime(fileRecord?.type, slug)
    : null;
  const filename =
    fileId && managedFormat
      ? safeManagedFilename(fileRecord?.filename_download, slug, managedFormat)
      : null;
  const location =
    fileId && managedFormat && filename
      ? {
          href: managedAssetUrl(
            baseUrl,
            fileId,
            filename,
            managedFormat.linkBehavior,
          ),
          external: true,
        }
      : normalizeDocumentUrl(externalUrl as string);
  const schoolYear =
    value.school_year === null
      ? null
      : typeof value.school_year === 'number'
        ? value.school_year
        : (() => {
            throw new Error(`Documento ${slug}: school_year inválido.`);
          })();
  const audience = parseStringArray(value.audience, 'audience', slug);
  const keywords = parseStringArray(value.keywords, 'keywords', slug);
  const sort =
    typeof value.sort === 'number'
      ? value.sort
      : (() => {
          throw new Error(`Documento ${slug}: sort inválido.`);
        })();
  const publishedAt =
    value.published_at === null || value.published_at === undefined
      ? null
      : typeof value.published_at === 'string'
        ? value.published_at
        : (() => {
            throw new Error(`Documento ${slug}: published_at inválido.`);
          })();
  const expiresAt =
    value.expires_at === null || value.expires_at === undefined
      ? null
      : typeof value.expires_at === 'string'
        ? value.expires_at
        : (() => {
            throw new Error(`Documento ${slug}: expires_at inválido.`);
          })();
  return {
    id: value.id as string,
    title: value.title as string,
    slug,
    description: value.description as string,
    category: category.slug,
    schoolYear,
    status: 'published',
    visibility: 'public',
    href: location.href,
    external: location.external,
    audience,
    featured: value.featured === true,
    keywords,
    sort,
    publishedAt,
    expiresAt,
    fileType: managedFormat
      ? managedFormat.fileType
      : externalUrl?.toLowerCase().includes('.pdf')
        ? 'PDF'
        : 'Servicio web',
    fileSize: fileRecord ? formatFileSize(fileRecord.filesize) : null,
    fileName: filename,
    managedFile: fileId !== null,
    linkBehavior: managedFormat?.linkBehavior ?? 'open',
    displayStatus: displayStatus(value, schoolYear, keywords, currentYear),
  };
}

function documentSlug(value: unknown): string | undefined {
  return (
    isRecord(value) && typeof value.slug === 'string' && value.slug.trim()
      ? value.slug
      : undefined
  );
}

export async function fetchDirectusSnapshot({
  cmsUrl,
  token,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  fetchImpl = fetch,
  now = new Date(),
}: DirectusOptions): Promise<DocumentSnapshot> {
  if (!token.trim()) throw new Error('CMS_STATIC_TOKEN está vacío.');
  const baseUrl = directusUrl(cmsUrl);
  const categoriesUrl = new URL('/items/document_categories', baseUrl);
  categoriesUrl.searchParams.set(
    'fields',
    'id,name,slug,description,active,sort',
  );
  categoriesUrl.searchParams.set('filter[active][_eq]', 'true');
  categoriesUrl.searchParams.set('sort', 'sort,name');
  categoriesUrl.searchParams.set('limit', '-1');

  const documentsUrl = new URL('/items/documents', baseUrl);
  documentsUrl.searchParams.set('fields', PUBLIC_DOCUMENT_FIELDS);
  documentsUrl.searchParams.set('filter[status][_eq]', 'published');
  documentsUrl.searchParams.set('filter[visibility][_eq]', 'public');
  documentsUrl.searchParams.set('sort', '-featured,sort,-published_at,title');
  documentsUrl.searchParams.set('limit', '-1');

  const [rawCategories, rawDocuments] = await Promise.all([
    requestData(categoriesUrl, token, fetchImpl, timeoutMs),
    requestData(documentsUrl, token, fetchImpl, timeoutMs),
  ]);
  const categories = rawCategories.map(parseCategory);
  const categoryIds = new Map(
    categories.map((category) => [category.id, category]),
  );
  const documents: SnapshotDocument[] = [];
  const documentSlugs = new Set<string>();
  let omittedDocuments = 0;
  for (const rawDocument of rawDocuments) {
    try {
      const document = parseDocument(
        rawDocument,
        baseUrl,
        categoryIds,
        now.getFullYear(),
      );
      if (document) {
        if (documentSlugs.has(document.slug)) {
          throw new Error(`Documento duplicado: ${document.slug}.`);
        }
        documentSlugs.add(document.slug);
        documents.push(document);
      }
    } catch (error) {
      omittedDocuments += 1;
      const slug = documentSlug(rawDocument);
      const cause =
        error instanceof Error
          ? error.message
          : 'Error de validación desconocido.';
      console.warn('[documentos] Documento público omitido.', {
        ...(slug ? { slug } : {}),
        cause,
      });
    }
  }
  if (omittedDocuments > 0) {
    console.warn('[documentos] Resumen de documentos omitidos.', {
      omittedDocuments,
      validDocuments: documents.length,
    });
  }
  const snapshot = assertDocumentSnapshot({
    schemaVersion: 1,
    generatedAt: now.toISOString(),
    source: 'directus',
    categories,
    documents,
  });
  return {
    ...snapshot,
    documents: [...snapshot.documents].sort((left, right) => {
      if (left.featured !== right.featured) return left.featured ? -1 : 1;
      if (left.sort !== right.sort) return left.sort - right.sort;
      const leftDate = left.publishedAt ? Date.parse(left.publishedAt) : 0;
      const rightDate = right.publishedAt ? Date.parse(right.publishedAt) : 0;
      if (leftDate !== rightDate) return rightDate - leftDate;
      return left.title.localeCompare(right.title, 'es');
    }),
  };
}
