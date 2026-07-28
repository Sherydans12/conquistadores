export type DocumentCategory =
  | 'evaluaciones'
  | 'plan-lector'
  | 'reglamentos'
  | 'protocolos'
  | 'seguridad'
  | 'horarios'
  | 'matriculas'
  | 'institucionales'
  | 'otros';

export type DocumentStatus =
  | 'current'
  | 'historical'
  | 'review'
  | 'external';

export interface PublicDocument {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  year?: number;
  audience?: string[];
  fileType?: string;
  fileSize?: string;
  updatedAt?: string;
  status: DocumentStatus;
  href: string;
  external: boolean;
  featured?: boolean;
  public: boolean;
  sourceLegacyUrl?: string;
  legacyPageUrl?: string;
  keywords?: string[];
}

export const documentCategories: ReadonlyArray<{
  id: DocumentCategory;
  label: string;
}> = [
  { id: 'evaluaciones', label: 'Evaluaciones y calendarios' },
  { id: 'plan-lector', label: 'Plan lector' },
  { id: 'reglamentos', label: 'Reglamentos y convivencia' },
  { id: 'protocolos', label: 'Protocolos internos' },
  { id: 'seguridad', label: 'Seguridad escolar' },
  { id: 'horarios', label: 'Horarios' },
  { id: 'matriculas', label: 'Matrículas y admisión' },
  { id: 'institucionales', label: 'Documentos institucionales' },
  { id: 'otros', label: 'Otros' },
];

export const documentCategoryLabels = Object.fromEntries(
  documentCategories.map((category) => [category.id, category.label]),
) as Record<DocumentCategory, string>;

export const documentStatusLabels: Record<DocumentStatus, string> = {
  current: 'Vigente',
  historical: 'Histórico',
  review: 'En revisión',
  external: 'Externo',
};

const legacyUploads =
  'https://www.colegioconquistadores.com/wp-content/uploads';
const legacySite = 'https://www.colegioconquistadores.com';

interface LevelDocumentSource {
  id: string;
  title: string;
  audience: string;
  path: string;
  fileSize: string;
}

const evaluationSources: LevelDocumentSource[] = [
  {
    id: 'evaluaciones-2026-1-basico',
    title: 'Calendario de evaluaciones 2026 — 1° básico',
    audience: '1° básico',
    path: '2026/03/1%C2%B0-basico-Calendarios-de-evaluacion-1er-semestre-2026.pdf',
    fileSize: '328 KB',
  },
  {
    id: 'evaluaciones-2026-2-basico',
    title: 'Calendario de evaluaciones 2026 — 2° básico',
    audience: '2° básico',
    path: '2026/03/2%C2%B0-basico-Calendarios-de-evaluacion-1er-semestre-2026.pdf',
    fileSize: '330 KB',
  },
  {
    id: 'evaluaciones-2026-3-basico',
    title: 'Calendario de evaluaciones 2026 — 3° básico',
    audience: '3° básico',
    path: '2026/03/3%C2%B0-basico-Calendarios-de-evaluacion-1er-semestre-2026.pdf',
    fileSize: '334 KB',
  },
  {
    id: 'evaluaciones-2026-4-basico',
    title: 'Calendario de evaluaciones 2026 — 4° básico',
    audience: '4° básico',
    path: '2026/03/4%C2%B0-basico-Calendarios-de-evaluacion-1er-semestre-2026.pdf',
    fileSize: '328 KB',
  },
  {
    id: 'evaluaciones-2026-5-basico',
    title: 'Calendario de evaluaciones 2026 — 5° básico',
    audience: '5° básico',
    path: '2026/03/5%C2%B0-basico-Calendarios-de-evaluacion-1er-semestre-2026.pdf',
    fileSize: '329 KB',
  },
  {
    id: 'evaluaciones-2026-6-basico',
    title: 'Calendario de evaluaciones 2026 — 6° básico',
    audience: '6° básico',
    path: '2026/03/6%C2%B0-basico-Calendarios-de-evaluacion-1er-semestre-2026.pdf',
    fileSize: '328 KB',
  },
  {
    id: 'evaluaciones-2026-7-basico',
    title: 'Calendario de evaluaciones 2026 — 7° básico',
    audience: '7° básico',
    path: '2026/03/7%C2%B0-basico-Calendarios-de-evaluacion-1er-semestre-2026.pdf',
    fileSize: '327 KB',
  },
  {
    id: 'evaluaciones-2026-8-basico',
    title: 'Calendario de evaluaciones 2026 — 8° básico',
    audience: '8° básico',
    path: '2026/03/8%C2%B0-basico-Calendarios-de-evaluacion-1er-semestre-2026.pdf',
    fileSize: '328 KB',
  },
  {
    id: 'evaluaciones-2026-1-medio',
    title: 'Calendario de evaluaciones 2026 — 1° medio',
    audience: '1° medio',
    path: '2026/03/1%C2%B0-Medio-Calendarios-de-evaluacion-1er-semestre-2026.pdf',
    fileSize: '328 KB',
  },
  {
    id: 'evaluaciones-2026-2-medio',
    title: 'Calendario de evaluaciones 2026 — 2° medio',
    audience: '2° medio',
    path: '2026/03/2%C2%B0-Medio-Calendarios-de-evaluacion-1er-semestre-2026.pdf',
    fileSize: '335 KB',
  },
  {
    id: 'evaluaciones-2026-3-medio',
    title: 'Calendario de evaluaciones 2026 — 3° medio',
    audience: '3° medio',
    path: '2026/03/3%C2%B0-Medio-Calendarios-de-evaluacion-1er-semestre-2026.pdf',
    fileSize: '333 KB',
  },
];

const readingPlanSources: LevelDocumentSource[] = [
  {
    id: 'plan-lector-2026-1-basico',
    title: 'Plan de lecturas complementarias — 1° básico',
    audience: '1° básico',
    path: '2025/12/Plan-de-lecturas-complementarias-1%C2%B0.pdf',
    fileSize: '287 KB',
  },
  {
    id: 'plan-lector-2026-2-basico',
    title: 'Plan de lecturas complementarias — 2° básico',
    audience: '2° básico',
    path: '2025/12/Plan-de-lecturas-complementarias-2%C2%B0.pdf',
    fileSize: '282 KB',
  },
  {
    id: 'plan-lector-2026-3-basico',
    title: 'Plan de lecturas complementarias — 3° básico',
    audience: '3° básico',
    path: '2025/12/Plan-de-lecturas-complementarias-3%C2%B0.pdf',
    fileSize: '307 KB',
  },
  {
    id: 'plan-lector-2026-4-basico',
    title: 'Plan de lecturas complementarias — 4° básico',
    audience: '4° básico',
    path: '2025/12/Plan-de-lecturas-complementarias-4%C2%B0.pdf',
    fileSize: '364 KB',
  },
  {
    id: 'plan-lector-2026-5-basico',
    title: 'Plan de lecturas domiciliarias — 5° básico',
    audience: '5° básico',
    path: '2025/12/Plan-de-lecturas-domiciliarias-5%C2%B0.pdf',
    fileSize: '264 KB',
  },
  {
    id: 'plan-lector-2026-6-basico',
    title: 'Plan de lecturas domiciliarias — 6° básico',
    audience: '6° básico',
    path: '2025/12/Plan-de-lecturas-domiciliarias-6%C2%B0.pdf',
    fileSize: '256 KB',
  },
  {
    id: 'plan-lector-2026-7-basico',
    title: 'Plan de lecturas domiciliarias — 7° básico',
    audience: '7° básico',
    path: '2025/12/Plan-de-lecturas-domiciliarias-7%C2%B0.pdf',
    fileSize: '309 KB',
  },
  {
    id: 'plan-lector-2026-8-basico',
    title: 'Plan de lecturas domiciliarias — 8° básico',
    audience: '8° básico',
    path: '2025/12/Plan-de-lecturas-domiciliarias-8%C2%B0.pdf',
    fileSize: '299 KB',
  },
  {
    id: 'plan-lector-2026-1-medio',
    title: 'Plan de lecturas domiciliarias — 1° medio',
    audience: '1° medio',
    path: '2025/12/Plan-de-lecturas-domiciliarias-1%C2%B0-medio.pdf',
    fileSize: '276 KB',
  },
  {
    id: 'plan-lector-2026-2-medio',
    title: 'Plan de lecturas domiciliarias — 2° medio',
    audience: '2° medio',
    path: '2025/12/Plan-de-lecturas-domiciliarias-2%C2%B0-medio.pdf',
    fileSize: '286 KB',
  },
  {
    id: 'plan-lector-2026-3-medio',
    title: 'Plan de lecturas domiciliarias — 3° medio',
    audience: '3° medio',
    path: '2025/12/Plan-de-lecturas-domiciliarias-3%C2%B0-medio.pdf',
    fileSize: '229 KB',
  },
];

const schoolSupplySources: LevelDocumentSource[] = [
  {
    id: 'utiles-2026-1-basico',
    title: 'Lista de útiles escolares 2026 — 1° básico',
    audience: '1° básico',
    path: '2025/12/LISTA-DE-UTILES-ESCOLARES-1%C2%B0-BASICO-2026.pdf',
    fileSize: '206 KB',
  },
  {
    id: 'utiles-2026-2-basico',
    title: 'Lista de útiles escolares 2026 — 2° básico',
    audience: '2° básico',
    path: '2025/12/LISTA-DE-UTILES-ESCOLARES-2%C2%B0-BASICO-2026.pdf',
    fileSize: '188 KB',
  },
  {
    id: 'utiles-2026-3-basico',
    title: 'Lista de útiles escolares 2026 — 3° básico',
    audience: '3° básico',
    path: '2025/12/LISTA-DE-UTILES-ESCOLARES-3%C2%B0-BASICO-2026.pdf',
    fileSize: '195 KB',
  },
  {
    id: 'utiles-2026-4-basico',
    title: 'Lista de útiles escolares 2026 — 4° básico',
    audience: '4° básico',
    path: '2025/12/LISTA-DE-UTILES-ESCOLARES-4%C2%B0-BASICO-2026.pdf',
    fileSize: '195 KB',
  },
  {
    id: 'utiles-2026-5-basico',
    title: 'Lista de útiles escolares 2026 — 5° básico',
    audience: '5° básico',
    path: '2025/12/LISTA-DE-UTILES-ESCOLARES-5%C2%B0-BASICO-2026.pdf',
    fileSize: '156 KB',
  },
  {
    id: 'utiles-2026-6-basico',
    title: 'Lista de útiles escolares 2026 — 6° básico',
    audience: '6° básico',
    path: '2025/12/LISTA-DE-UTILES-ESCOLARES-6%C2%B0-BASICO-2026.pdf',
    fileSize: '156 KB',
  },
  {
    id: 'utiles-2026-7-basico',
    title: 'Lista de útiles escolares 2026 — 7° básico',
    audience: '7° básico',
    path: '2025/12/LISTA-DE-UTILES-ESCOLARES-7%C2%B0-BASICO-2026.pdf',
    fileSize: '158 KB',
  },
  {
    id: 'utiles-2026-8-basico',
    title: 'Lista de útiles escolares 2026 — 8° básico',
    audience: '8° básico',
    path: '2025/12/LISTA-DE-UTILES-ESCOLARES-8%C2%B0-BASICO-2026.pdf',
    fileSize: '186 KB',
  },
  {
    id: 'utiles-2026-1-medio',
    title: 'Lista de útiles escolares 2026 — 1° medio',
    audience: '1° medio',
    path: '2025/12/LISTA-DE-UTILES-ESCOLARES-1%C2%B0-MEDIO-2026.pdf',
    fileSize: '155 KB',
  },
  {
    id: 'utiles-2026-2-medio',
    title: 'Lista de útiles escolares 2026 — 2° medio',
    audience: '2° medio',
    path: '2025/12/LISTA-DE-UTILES-ESCOLARES-2%C2%B0-MEDIO-2026.pdf',
    fileSize: '154 KB',
  },
  {
    id: 'utiles-2026-3-medio',
    title: 'Lista de útiles escolares 2026 — 3° medio',
    audience: '3° medio',
    path: '2025/12/LISTA-DE-UTILES-ESCOLARES-3%C2%B0-MEDIO-2026.pdf',
    fileSize: '159 KB',
  },
];

function createLevelDocuments(
  sources: LevelDocumentSource[],
  options: {
    category: DocumentCategory;
    description: (audience: string) => string;
    legacyPageUrl: string;
    keywords: string[];
  },
): PublicDocument[] {
  return sources.map((source) => {
    const href = `${legacyUploads}/${source.path}`;

    return {
      id: source.id,
      title: source.title,
      description: options.description(source.audience),
      category: options.category,
      year: 2026,
      audience: [source.audience],
      fileType: 'PDF',
      fileSize: source.fileSize,
      status: 'current',
      href,
      external: true,
      public: true,
      sourceLegacyUrl: href,
      legacyPageUrl: options.legacyPageUrl,
      keywords: [...options.keywords, source.audience],
    };
  });
}

const evaluationDocuments = createLevelDocuments(evaluationSources, {
  category: 'evaluaciones',
  description: (audience) =>
    `Calendario de evaluaciones del primer semestre de 2026 para ${audience}.`,
  legacyPageUrl: `${legacySite}/calendario-de-evaluaciones-2026/`,
  keywords: ['calendario', 'evaluaciones', 'primer semestre'],
});

const readingPlanDocuments = createLevelDocuments(readingPlanSources, {
  category: 'plan-lector',
  description: (audience) => `Plan lector 2026 para ${audience}.`,
  legacyPageUrl: `${legacySite}/plan-lector-2026/`,
  keywords: ['lecturas', 'libros', 'plan lector'],
});

const schoolSupplyDocuments = createLevelDocuments(schoolSupplySources, {
  category: 'matriculas',
  description: (audience) =>
    `Lista de útiles escolares 2026 para ${audience}.`,
  legacyPageUrl: `${legacySite}/matriculas-2026/`,
  keywords: ['útiles', 'materiales', 'matrícula', 'admisión'],
});

const currentInstitutionalDocuments: PublicDocument[] = [
  {
    id: 'rice-2026',
    title: 'Reglamento Interno de Convivencia Escolar 2026',
    description:
      'Reglamento interno de convivencia escolar publicado para 2026.',
    category: 'reglamentos',
    year: 2026,
    fileType: 'PDF',
    fileSize: '695 KB',
    status: 'current',
    href: `${legacyUploads}/2026/05/RICE-CC.pdf`,
    external: true,
    featured: true,
    public: true,
    sourceLegacyUrl: `${legacyUploads}/2026/05/RICE-CC.pdf`,
    legacyPageUrl: `${legacySite}/reglamento-interno-de-convivencia-escolar/`,
    keywords: ['RICE', 'convivencia escolar', 'reglamento interno'],
  },
  {
    id: 'reglamento-evaluacion-2026-2027',
    title: 'Reglamento de Evaluación 2026–2027',
    description:
      'Reglamento de evaluación del Colegio Conquistadores para 2026–2027.',
    category: 'reglamentos',
    year: 2026,
    fileType: 'PDF',
    fileSize: '365 KB',
    status: 'current',
    href: `${legacyUploads}/2025/12/REGLAMENTO-DE-EVALUACION-CONQUISTADORES-2026-2027.pdf`,
    external: true,
    featured: true,
    public: true,
    sourceLegacyUrl: `${legacyUploads}/2025/12/REGLAMENTO-DE-EVALUACION-CONQUISTADORES-2026-2027.pdf`,
    legacyPageUrl: `${legacySite}/matriculas-2026/`,
    keywords: ['evaluación', 'reglamento', '2027'],
  },
  {
    id: 'pei-2026',
    title: 'Proyecto Educativo Institucional 2026',
    description:
      'Proyecto Educativo Institucional del Colegio Conquistadores publicado para 2026.',
    category: 'institucionales',
    year: 2026,
    fileType: 'PDF',
    fileSize: '768 KB',
    status: 'current',
    href: `${legacyUploads}/2026/03/PEI-COLEGIO-CONQUISTADORES-2026.pdf`,
    external: true,
    featured: true,
    public: true,
    sourceLegacyUrl: `${legacyUploads}/2026/03/PEI-COLEGIO-CONQUISTADORES-2026.pdf`,
    legacyPageUrl: `${legacySite}/matriculas-2026/`,
    keywords: ['PEI', 'proyecto educativo', 'institucional'],
  },
];

const historicalDocuments: PublicDocument[] = [
  {
    id: 'pise-2024',
    title: 'Plan Integral de Seguridad Escolar 2024',
    description:
      'Versión histórica 2024 del Plan Integral de Seguridad Escolar.',
    category: 'seguridad',
    year: 2024,
    fileType: 'PDF',
    fileSize: '1.4 MB',
    status: 'historical',
    href: `${legacyUploads}/2023/12/PLAN-INTEGRAL-DE-SEGURIDAD-ESCOLAR-COLEGIO-CONQUISTADORES-2024.pdf`,
    external: true,
    public: true,
    sourceLegacyUrl: `${legacyUploads}/2023/12/PLAN-INTEGRAL-DE-SEGURIDAD-ESCOLAR-COLEGIO-CONQUISTADORES-2024.pdf`,
    legacyPageUrl: `${legacySite}/documentos/`,
    keywords: ['PISE', 'seguridad escolar', 'emergencias'],
  },
  {
    id: 'horarios-2025',
    title: 'Archivo de horarios 2025',
    description:
      'Página histórica con los horarios publicados por curso durante 2025.',
    category: 'horarios',
    year: 2025,
    fileType: 'Página',
    status: 'historical',
    href: `${legacySite}/horarios-2025/`,
    external: true,
    public: true,
    legacyPageUrl: `${legacySite}/horarios-2025/`,
    keywords: ['horarios', 'cursos', 'archivo'],
  },
];

const externalServices: PublicDocument[] = [
  {
    id: 'certificados-estudios-mineduc',
    title: 'Certificados de Estudios',
    description:
      'Acceso al portal oficial de Mineduc para consultar certificados de estudios.',
    category: 'otros',
    fileType: 'Servicio web',
    status: 'external',
    href: 'https://certificados.mineduc.cl/mvc/home/index',
    external: true,
    public: true,
    keywords: ['certificados', 'estudios', 'Mineduc'],
  },
];

export const reviewDocuments: PublicDocument[] = [
  {
    id: 'carta-ley-tea',
    title: 'Carta Ley TEA',
    description: 'Documento publicado en 2024, pendiente de revisión editorial.',
    category: 'institucionales',
    year: 2024,
    fileType: 'PDF',
    fileSize: '410 KB',
    status: 'review',
    href: `${legacyUploads}/2024/09/CARTA-LEY-TEA-COLEGIO-CONQUISTADORES.pdf`,
    external: true,
    public: false,
    sourceLegacyUrl: `${legacyUploads}/2024/09/CARTA-LEY-TEA-COLEGIO-CONQUISTADORES.pdf`,
  },
  {
    id: 'protocolo-enfermeria-2024',
    title: 'Protocolo de Enfermería 2024',
    description: 'Documento 2024 pendiente de confirmación de vigencia.',
    category: 'protocolos',
    year: 2024,
    fileType: 'PDF',
    fileSize: '147 KB',
    status: 'review',
    href: `${legacyUploads}/2023/12/PROTOCOLO-ENFERMERIA-COLEGIO-CONQUISTADORES-2024.pdf`,
    external: true,
    public: false,
    sourceLegacyUrl: `${legacyUploads}/2023/12/PROTOCOLO-ENFERMERIA-COLEGIO-CONQUISTADORES-2024.pdf`,
  },
  {
    id: 'protocolo-accidentes-escolares-2024',
    title: 'Protocolo de Accidentes Escolares 2024',
    description: 'Documento 2024 pendiente de confirmación de vigencia.',
    category: 'protocolos',
    year: 2024,
    fileType: 'PDF',
    fileSize: '170 KB',
    status: 'review',
    href: `${legacyUploads}/2024/01/PROTOCOLO-DE-ACCIDENTES-ESCOLARES-COLEGIO-CONQUISTADORES-2024.pdf`,
    external: true,
    public: false,
    sourceLegacyUrl: `${legacyUploads}/2024/01/PROTOCOLO-DE-ACCIDENTES-ESCOLARES-COLEGIO-CONQUISTADORES-2024.pdf`,
  },
  {
    id: 'protocolo-identidad-genero-2024',
    title: 'Protocolo de Identidad de Género 2024',
    description: 'Documento 2024 pendiente de confirmación de vigencia.',
    category: 'protocolos',
    year: 2024,
    fileType: 'PDF',
    fileSize: '189 KB',
    status: 'review',
    href: `${legacyUploads}/2024/01/PROTOCOLO-DE-IDENTIDAD-DE-GENERO-COLEGIO-CONQUISTADORES-2024.pdf`,
    external: true,
    public: false,
    sourceLegacyUrl: `${legacyUploads}/2024/01/PROTOCOLO-DE-IDENTIDAD-DE-GENERO-COLEGIO-CONQUISTADORES-2024.pdf`,
  },
  {
    id: 'reglamento-evaluacion-2025-2026',
    title: 'Reglamento de Evaluación 2025–2026',
    description:
      'Versión anterior pendiente de confirmar como archivo histórico.',
    category: 'reglamentos',
    year: 2025,
    fileType: 'PDF',
    fileSize: '325 KB',
    status: 'review',
    href: `${legacyUploads}/2025/05/REGLAMENTO-DE-EVALUACION-CONQUISTADORES-2025-2026.pdf`,
    external: true,
    public: false,
    sourceLegacyUrl: `${legacyUploads}/2025/05/REGLAMENTO-DE-EVALUACION-CONQUISTADORES-2025-2026.pdf`,
  },
  {
    id: 'ficha-matricula-2025',
    title: 'Ficha de matrícula 2025',
    description:
      'Archivo enlazado desde páginas heredadas, pendiente de revisión.',
    category: 'matriculas',
    year: 2025,
    fileType: 'PDF',
    fileSize: '585 KB',
    status: 'review',
    href: `${legacyUploads}/2024/12/ficha-de-matricula-2025-PDF.pdf`,
    external: true,
    public: false,
    sourceLegacyUrl: `${legacyUploads}/2024/12/ficha-de-matricula-2025-PDF.pdf`,
  },
  {
    id: 'compra-materiales-sin-ano',
    title: 'Compra de materiales',
    description:
      'Documento sin año identificable, pendiente de revisión editorial.',
    category: 'matriculas',
    fileType: 'PDF',
    fileSize: '132 KB',
    status: 'review',
    href: `${legacyUploads}/2023/12/Compra-materiales.pdf`,
    external: true,
    public: false,
    sourceLegacyUrl: `${legacyUploads}/2023/12/Compra-materiales.pdf`,
  },
];

const allDocuments: PublicDocument[] = [
  ...evaluationDocuments,
  ...readingPlanDocuments,
  ...schoolSupplyDocuments,
  ...currentInstitutionalDocuments,
  ...historicalDocuments,
  ...externalServices,
  ...reviewDocuments,
];

function assertUniqueDocumentIds(documents: PublicDocument[]): void {
  const ids = new Set<string>();

  for (const document of documents) {
    if (ids.has(document.id)) {
      throw new Error(`Duplicate public document id: ${document.id}`);
    }
    ids.add(document.id);
  }
}

assertUniqueDocumentIds(allDocuments);

export const publicDocuments = allDocuments.filter(
  (document) => document.public && document.status !== 'review',
);

export const featuredDocuments = publicDocuments.filter(
  (document) => document.featured,
);

export function getPublicDocumentsByCategory(
  category: DocumentCategory,
): PublicDocument[] {
  return publicDocuments.filter(
    (document) =>
      document.category === category &&
      document.status !== 'historical' &&
      document.status !== 'external',
  );
}

export const publicHistoricalDocuments = publicDocuments.filter(
  (document) => document.status === 'historical',
);

export const publicExternalServices = publicDocuments.filter(
  (document) => document.status === 'external',
);
