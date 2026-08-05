import snapshotJson from '../../data/generated/documents.snapshot.json' with {
  type: 'json',
};
import { fetchDirectusSnapshot } from './directus.ts';
import {
  assertDocumentSnapshot,
  comparePublicDocuments,
  type DocumentCatalog,
  type DocumentSnapshot,
  type PublicDocument,
} from './types.ts';

export type DocumentsSource = 'directus' | 'snapshot';

export const RETIRED_DOCUMENT_SLUGS = new Set([
  'horarios-2025',
  'ficha-matricula-2025',
]);

const RETIRED_CATEGORY_SLUGS = new Set(['horarios']);

export interface DocumentsEnvironment {
  CMS_URL?: string;
  CMS_STATIC_TOKEN?: string;
  CMS_DOCUMENTS_SOURCE?: string;
  CMS_APPROVED_SNAPSHOT?: string;
  SITE_ENV?: string;
  CI?: string;
}

export interface LoadDocumentOptions {
  environment?: DocumentsEnvironment;
  snapshot?: unknown;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

function getRuntimeEnvironment(): DocumentsEnvironment {
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: DocumentsEnvironment };
  };

  return runtime.process?.env ?? {};
}

function snapshotToCatalog(
  snapshot: DocumentSnapshot,
  cmsUrl?: string,
): DocumentCatalog {
  const categories = snapshot.categories.filter(
    (category) => !RETIRED_CATEGORY_SLUGS.has(category.slug),
  );
  const labels = new Map(
    categories.map((category) => [category.slug, category.name]),
  );
  const managedOrigin = (() => {
    try {
      return cmsUrl ? new URL(cmsUrl).origin : null;
    } catch {
      return null;
    }
  })();
  const documents: PublicDocument[] = snapshot.documents
    .filter((document) => !RETIRED_DOCUMENT_SLUGS.has(document.slug))
    .map((document) => ({
      id: document.id,
      title: document.title,
      slug: document.slug,
      description: document.description,
      category: document.category,
      categoryLabel: labels.get(document.category) ?? document.category,
      year: document.schoolYear ?? undefined,
      audience: document.audience,
      fileType: document.fileType ?? undefined,
      fileSize: document.fileSize ?? undefined,
      status: document.displayStatus,
      href: document.href,
      external: document.external,
      managedFile:
        managedOrigin !== null &&
        !document.href.startsWith('/') &&
        new URL(document.href).origin === managedOrigin,
      featured: document.featured,
      keywords: document.keywords,
      sort: document.sort,
      publishedAt: document.publishedAt ?? undefined,
      expiresAt: document.expiresAt ?? undefined,
    }));
  return {
    generatedAt: snapshot.generatedAt,
    source: snapshot.source === 'directus' ? 'directus' : 'snapshot',
    categories: [...categories].sort(
      (left, right) =>
        left.sort - right.sort || left.name.localeCompare(right.name, 'es'),
    ),
    documents: documents.sort(comparePublicDocuments),
  };
}

export function resolveDocumentsSource(
  environment: DocumentsEnvironment = getRuntimeEnvironment(),
): DocumentsSource {
  const requested = environment.CMS_DOCUMENTS_SOURCE?.trim().toLowerCase();
  if (requested && requested !== 'directus' && requested !== 'snapshot') {
    throw new Error(
      'CMS_DOCUMENTS_SOURCE debe ser "directus" o "snapshot".',
    );
  }
  const siteEnvironment = environment.SITE_ENV?.trim().toLowerCase();
  const production = siteEnvironment === 'production';
  const staging = siteEnvironment === 'staging';

  if (requested === 'directus') return 'directus';
  if (requested === 'snapshot') {
    if (
      production &&
      environment.CMS_APPROVED_SNAPSHOT?.trim().toLowerCase() !== 'true'
    ) {
      throw new Error(
        'Producción exige CMS_APPROVED_SNAPSHOT=true para usar el snapshot.',
      );
    }
    return 'snapshot';
  }
  if (production) {
    throw new Error(
      'Producción exige CMS_DOCUMENTS_SOURCE=directus o un snapshot aprobado explícitamente.',
    );
  }
  if (
    staging &&
    environment.CMS_URL?.trim() &&
    environment.CMS_STATIC_TOKEN?.trim()
  ) {
    return 'directus';
  }
  return 'snapshot';
}

export async function loadDocumentCatalog({
  environment = getRuntimeEnvironment(),
  snapshot = snapshotJson,
  fetchImpl = fetch,
  timeoutMs,
}: LoadDocumentOptions = {}): Promise<DocumentCatalog> {
  const source = resolveDocumentsSource(environment);
  if (source === 'snapshot') {
    return snapshotToCatalog(
      assertDocumentSnapshot(snapshot),
      environment.CMS_URL?.trim(),
    );
  }
  const cmsUrl = environment.CMS_URL?.trim();
  const token = environment.CMS_STATIC_TOKEN?.trim();
  if (!cmsUrl) {
    throw new Error('CMS_URL es obligatorio al usar Directus.');
  }
  if (!token) {
    throw new Error('CMS_STATIC_TOKEN es obligatorio al usar Directus.');
  }
  const directusSnapshot = await fetchDirectusSnapshot({
    cmsUrl,
    token,
    fetchImpl,
    timeoutMs,
  });
  return snapshotToCatalog(directusSnapshot, cmsUrl);
}
