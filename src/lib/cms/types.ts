import {
  isManagedDocumentFileType,
  type DocumentLinkBehavior,
} from './document-formats.ts';

export const CMS_DOCUMENT_STATUSES = [
  'draft',
  'review',
  'published',
  'archived',
] as const;
export const CMS_DOCUMENT_VISIBILITIES = ['public', 'hidden'] as const;

export type CmsDocumentStatus = (typeof CMS_DOCUMENT_STATUSES)[number];
export type CmsDocumentVisibility =
  (typeof CMS_DOCUMENT_VISIBILITIES)[number];
export type DocumentDisplayStatus = 'current' | 'historical' | 'external';

export interface DocumentCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort: number;
}

export interface PublicDocument {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  categoryLabel: string;
  year?: number;
  audience?: string[];
  fileType?: string;
  fileSize?: string;
  status: DocumentDisplayStatus;
  href: string;
  external: boolean;
  managedFile: boolean;
  linkBehavior: DocumentLinkBehavior;
  fileName?: string;
  featured: boolean;
  keywords?: string[];
  sort: number;
  publishedAt?: string;
  expiresAt?: string;
}

export interface SnapshotDocument {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  schoolYear: number | null;
  status: CmsDocumentStatus;
  visibility: CmsDocumentVisibility;
  href: string;
  external: boolean;
  audience: string[];
  featured: boolean;
  keywords: string[];
  sort: number;
  publishedAt: string | null;
  expiresAt: string | null;
  fileType: string | null;
  fileSize: string | null;
  fileName: string | null;
  managedFile: boolean;
  linkBehavior: DocumentLinkBehavior;
  displayStatus: DocumentDisplayStatus;
}

export interface DocumentSnapshot {
  schemaVersion: 1;
  generatedAt: string;
  source: string;
  categories: DocumentCategory[];
  documents: SnapshotDocument[];
}

export interface DocumentCatalog {
  generatedAt: string;
  source: 'directus' | 'snapshot';
  categories: DocumentCategory[];
  documents: PublicDocument[];
}

const internalFields = new Set([
  'notes_internal',
  'user_created',
  'user_updated',
  'date_created',
  'date_updated',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function requiredString(
  record: Record<string, unknown>,
  field: string,
  context: string,
): string {
  const value = record[field];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${context}: ${field} debe ser un texto no vacío.`);
  }
  return value;
}

function optionalString(
  value: unknown,
  context: string,
): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') {
    throw new Error(`${context}: se esperaba texto o null.`);
  }
  return value;
}

function stringArray(value: unknown, context: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error(`${context}: se esperaba un arreglo de textos.`);
  }
  return value;
}

function finiteNumber(value: unknown, context: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${context}: se esperaba un número.`);
  }
  return value;
}

export function isPublishedPublic(value: {
  status?: unknown;
  visibility?: unknown;
}): boolean {
  return value.status === 'published' && value.visibility === 'public';
}

export function assertDocumentSnapshot(value: unknown): DocumentSnapshot {
  if (!isRecord(value) || value.schemaVersion !== 1) {
    throw new Error('Snapshot documental inválido: schemaVersion debe ser 1.');
  }
  const generatedAt = requiredString(value, 'generatedAt', 'snapshot');
  if (Number.isNaN(Date.parse(generatedAt))) {
    throw new Error('Snapshot documental inválido: generatedAt no es una fecha.');
  }
  const source = requiredString(value, 'source', 'snapshot');
  if (!Array.isArray(value.categories) || !Array.isArray(value.documents)) {
    throw new Error(
      'Snapshot documental inválido: categories y documents deben ser arreglos.',
    );
  }

  const categorySlugs = new Set<string>();
  const categories = value.categories.map((raw, index) => {
    if (!isRecord(raw)) {
      throw new Error(`Categoría ${index}: objeto inválido.`);
    }
    const slug = requiredString(raw, 'slug', `categoría ${index}`);
    if (categorySlugs.has(slug)) {
      throw new Error(`Categoría duplicada: ${slug}.`);
    }
    categorySlugs.add(slug);
    return {
      id: requiredString(raw, 'id', `categoría ${slug}`),
      name: requiredString(raw, 'name', `categoría ${slug}`),
      slug,
      description: optionalString(
        raw.description,
        `categoría ${slug}.description`,
      ),
      sort: finiteNumber(raw.sort, `categoría ${slug}.sort`),
    };
  });

  if (value.documents.length === 0) {
    throw new Error(
      'Snapshot documental inválido: una lista vacía no puede publicarse.',
    );
  }
  const slugs = new Set<string>();
  const documents = value.documents.map((raw, index) => {
    if (!isRecord(raw)) {
      throw new Error(`Documento ${index}: objeto inválido.`);
    }
    for (const field of Object.keys(raw)) {
      if (internalFields.has(field)) {
        throw new Error(`Documento ${index}: campo interno expuesto (${field}).`);
      }
    }
    const slug = requiredString(raw, 'slug', `documento ${index}`);
    if (slugs.has(slug)) throw new Error(`Documento duplicado: ${slug}.`);
    slugs.add(slug);
    if (!isPublishedPublic(raw)) {
      throw new Error(
        `Documento ${slug}: el snapshot solo admite published + public.`,
      );
    }
    const category = requiredString(raw, 'category', `documento ${slug}`);
    if (!categorySlugs.has(category)) {
      throw new Error(`Documento ${slug}: categoría desconocida ${category}.`);
    }
    const href = requiredString(raw, 'href', `documento ${slug}`);
    if (href.startsWith('/')) {
      if (href.startsWith('//')) {
        throw new Error(`Documento ${slug}: href relativo no permitido.`);
      }
    } else {
      let parsedHref: URL;
      try {
        parsedHref = new URL(href);
      } catch {
        throw new Error(
          `Documento ${slug}: href debe ser una URL HTTP(S) o una ruta local.`,
        );
      }
      if (!['https:', 'http:'].includes(parsedHref.protocol)) {
        throw new Error(`Documento ${slug}: protocolo de URL no permitido.`);
      }
    }
    if (
      raw.displayStatus !== 'current' &&
      raw.displayStatus !== 'historical' &&
      raw.displayStatus !== 'external'
    ) {
      throw new Error(`Documento ${slug}: displayStatus inválido.`);
    }
    const displayStatus: DocumentDisplayStatus = raw.displayStatus;
    if (typeof raw.external !== 'boolean' || typeof raw.featured !== 'boolean') {
      throw new Error(`Documento ${slug}: flags booleanos inválidos.`);
    }
    const schoolYear =
      raw.schoolYear === null
        ? null
        : finiteNumber(raw.schoolYear, `documento ${slug}.schoolYear`);
    const fileName = optionalString(
      raw.fileName,
      `documento ${slug}.fileName`,
    );
    const managedFile = raw.managedFile === undefined ? false : raw.managedFile;
    if (typeof managedFile !== 'boolean') {
      throw new Error(`Documento ${slug}: managedFile debe ser booleano.`);
    }
    const linkBehaviorValue = raw.linkBehavior ?? 'open';
    if (linkBehaviorValue !== 'open' && linkBehaviorValue !== 'download') {
      throw new Error(`Documento ${slug}: linkBehavior inválido.`);
    }
    const linkBehavior: DocumentLinkBehavior = linkBehaviorValue;
    const fileType = optionalString(
      raw.fileType,
      `documento ${slug}.fileType`,
    );
    if (managedFile && !isManagedDocumentFileType(fileType)) {
      throw new Error(
        `Documento ${slug}: formato de archivo administrado inválido.`,
      );
    }
    if (managedFile && fileType === 'Word (DOCX)' && linkBehavior !== 'download') {
      throw new Error(
        `Documento ${slug}: un DOCX administrado debe ser descargable.`,
      );
    }
    if (linkBehavior === 'download') {
      if (
        fileType !== 'Word (DOCX)' ||
        !managedFile ||
        !fileName ||
        !href.endsWith('?download')
      ) {
        throw new Error(
          `Documento ${slug}: descarga DOCX administrada incompleta.`,
        );
      }
    }
    return {
      id: requiredString(raw, 'id', `documento ${slug}`),
      title: requiredString(raw, 'title', `documento ${slug}`),
      slug,
      description: requiredString(raw, 'description', `documento ${slug}`),
      category,
      schoolYear,
      status: 'published' as const,
      visibility: 'public' as const,
      href,
      external: raw.external,
      audience: stringArray(raw.audience, `documento ${slug}.audience`),
      featured: raw.featured,
      keywords: stringArray(raw.keywords, `documento ${slug}.keywords`),
      sort: finiteNumber(raw.sort, `documento ${slug}.sort`),
      publishedAt: optionalString(
        raw.publishedAt,
        `documento ${slug}.publishedAt`,
      ),
      expiresAt: optionalString(
        raw.expiresAt,
        `documento ${slug}.expiresAt`,
      ),
      fileType,
      fileSize: optionalString(raw.fileSize, `documento ${slug}.fileSize`),
      fileName,
      managedFile,
      linkBehavior,
      displayStatus,
    };
  });

  return {
    schemaVersion: 1,
    generatedAt,
    source,
    categories,
    documents,
  };
}

export function comparePublicDocuments(
  left: PublicDocument,
  right: PublicDocument,
): number {
  if (left.featured !== right.featured) return left.featured ? -1 : 1;
  if (left.sort !== right.sort) return left.sort - right.sort;
  const leftDate = left.publishedAt ? Date.parse(left.publishedAt) : 0;
  const rightDate = right.publishedAt ? Date.parse(right.publishedAt) : 0;
  if (leftDate !== rightDate) return rightDate - leftDate;
  return left.title.localeCompare(right.title, 'es');
}
