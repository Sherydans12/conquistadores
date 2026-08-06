export type DocumentLinkBehavior = 'open' | 'download';

interface ManagedDocumentFormat {
  fileType: 'PDF' | 'Word (DOCX)';
  linkBehavior: DocumentLinkBehavior;
  extension: '.pdf' | '.docx';
}

export const MANAGED_DOCUMENT_MIME_TYPES = {
  'application/pdf': {
    fileType: 'PDF',
    linkBehavior: 'open',
    extension: '.pdf',
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    fileType: 'Word (DOCX)',
    linkBehavior: 'download',
    extension: '.docx',
  },
} as const satisfies Record<string, ManagedDocumentFormat>;

export type ManagedDocumentMime = keyof typeof MANAGED_DOCUMENT_MIME_TYPES;

export function isManagedDocumentFileType(
  value: unknown,
): value is ManagedDocumentFormat['fileType'] {
  return Object.values(MANAGED_DOCUMENT_MIME_TYPES).some(
    ({ fileType }) => fileType === value,
  );
}

const MACRO_EXTENSIONS = /\.(?:docm|dotm)$/i;
const UNSAFE_FILENAME_CHARACTERS = /[<>:"/\\|?*\u0000-\u001f\u007f]/g;

export function resolveManagedDocumentMime(
  mime: unknown,
  slug: string,
): ManagedDocumentFormat {
  if (
    typeof mime !== 'string' ||
    !Object.hasOwn(MANAGED_DOCUMENT_MIME_TYPES, mime)
  ) {
    const received = typeof mime === 'string' && mime ? mime : 'MIME ausente';
    throw new Error(
      `Documento ${slug}: MIME administrado no permitido (${received}).`,
    );
  }

  return MANAGED_DOCUMENT_MIME_TYPES[mime as ManagedDocumentMime];
}

export function safeManagedFilename(
  filenameDownload: unknown,
  slug: string,
  format: ManagedDocumentFormat,
): string {
  if (typeof filenameDownload !== 'string' || filenameDownload.trim() === '') {
    throw new Error(
      `Documento ${slug}: filename_download no está disponible para Astro.`,
    );
  }

  const basename = filenameDownload.trim().split(/[\\/]/).at(-1) ?? '';
  if (MACRO_EXTENSIONS.test(basename)) {
    throw new Error(
      `Documento ${slug}: los formatos Word con macros no están permitidos.`,
    );
  }

  const sanitized = basename
    .normalize('NFC')
    .replace(UNSAFE_FILENAME_CHARACTERS, '-')
    .replace(/\s+/g, ' ')
    .replace(/^\.+/, '')
    .trim();
  const safeSlug = slug
    .replace(UNSAFE_FILENAME_CHARACTERS, '-')
    .replace(/^\.+/, '')
    .trim();
  const stem = sanitized.replace(/\.[^.]*$/, '').trim() || safeSlug || 'documento';
  const maxStemLength = 160 - format.extension.length;
  return `${stem.slice(0, maxStemLength).trim()}${format.extension}`;
}

export function managedAssetUrl(
  baseUrl: URL,
  fileId: string,
  filename: string,
  behavior: DocumentLinkBehavior,
): string {
  const assetUrl = new URL(
    `/assets/${encodeURIComponent(fileId)}/${encodeURIComponent(filename)}`,
    baseUrl,
  );
  if (behavior === 'download') assetUrl.search = 'download';
  return assetUrl.toString();
}
