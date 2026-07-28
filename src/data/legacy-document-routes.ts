export interface LegacyDocumentRoute {
  from: string;
  to: string;
  status: 200 | 301;
  approved: false;
  note: string;
}

/**
 * Propuestas SEO únicamente. No se importan en middleware ni en la
 * configuración de hosting. Una redirección solo podrá aprobarse cuando el
 * ancla de destino contenga todo el contenido equivalente y producción haya
 * sido revisada.
 */
export const legacyDocumentRoutes: LegacyDocumentRoute[] = [
  {
    from: '/plan-lector-2026/',
    to: '/documentos/#plan-lector',
    status: 301,
    approved: false,
    note: 'Requiere equivalencia completa de todos los niveles publicados.',
  },
  {
    from: '/protocolos-internos/',
    to: '/documentos/#protocolos',
    status: 301,
    approved: false,
    note: 'No aprobar hasta validar la vigencia de cada protocolo.',
  },
  {
    from: '/calendario-de-evaluaciones-2026/',
    to: '/documentos/#evaluaciones-2026',
    status: 301,
    approved: false,
    note: 'Requiere equivalencia completa de calendarios por curso.',
  },
  {
    from: '/reglamento-interno-de-convivencia-escolar/',
    to: '/documentos/#reglamentos',
    status: 301,
    approved: false,
    note: 'Requiere confirmar paridad editorial y del archivo RICE.',
  },
  {
    from: '/horarios-2025/',
    to: '/documentos/#archivo-historico',
    status: 301,
    approved: false,
    note: 'Ruta histórica; conservar hasta revisar enlaces entrantes.',
  },
  {
    from: '/documentos/',
    to: '/documentos/',
    status: 200,
    approved: false,
    note: 'Ruta canónica que debe conservarse sin redirección.',
  },
];
