import type { PublicDocument } from './types.ts';

export interface DocumentActionPresentation {
  label: 'Ver documento' | 'Descargar formulario Word';
  target?: '_blank';
  rel?: 'noopener noreferrer';
  download?: string;
  accessibleHint?: string;
}

export function getDocumentActionPresentation(
  document: PublicDocument,
): DocumentActionPresentation {
  const downloadsManagedDocx =
    document.managedFile && document.linkBehavior === 'download';
  if (downloadsManagedDocx) {
    if (!document.fileName) {
      throw new Error(
        `Documento ${document.slug}: descarga DOCX sin nombre de archivo.`,
      );
    }
    return {
      label: 'Descargar formulario Word',
      download: document.fileName,
      accessibleHint: ' (formato Word DOCX)',
    };
  }

  return {
    label: 'Ver documento',
    target: document.external ? '_blank' : undefined,
    rel: document.external ? 'noopener noreferrer' : undefined,
    accessibleHint: document.external
      ? ' (se abre fuera de este sitio)'
      : undefined,
  };
}
