export type LegacyRouteAction =
  | 'redirect'
  | 'gone'
  | 'not-found'
  | 'external-service'
  | 'pending';

export interface LegacyRoute {
  from: string;
  to?: string;
  action: LegacyRouteAction;
  status?: 301 | 302 | 404 | 410;
  reason: string;
  approved: boolean;
  launchBlocker?: boolean;
}

export const legacyRoutes: readonly LegacyRoute[] = [
  {
    from: '/calendario-de-evaluaciones-2026/',
    to: '/documentos/?category=evaluaciones&year=2026',
    action: 'redirect',
    status: 301,
    reason: 'El centro documental conserva los calendarios 2026 por nivel.',
    approved: true,
  },
  {
    from: '/plan-lector-2026/',
    to: '/documentos/?category=plan-lector&year=2026',
    action: 'redirect',
    status: 301,
    reason: 'El centro documental conserva los planes lectores 2026 por nivel.',
    approved: true,
  },
  {
    from: '/protocolos-internos/',
    to: '/documentos/?category=protocolos',
    action: 'redirect',
    status: 301,
    reason: 'La sección de protocolos explica que los documentos están en revisión.',
    approved: true,
  },
  {
    from: '/reglamento-interno-de-convivencia-escolar/',
    to: '/documentos/?category=reglamentos&year=2026',
    action: 'redirect',
    status: 301,
    reason: 'El destino publica el RICE 2026.',
    approved: true,
  },
  {
    from: '/horarios-2025/',
    action: 'not-found',
    status: 404,
    reason: 'El archivo histórico de horarios 2025 fue retirado por decisión institucional.',
    approved: true,
  },
  {
    from: '/matriculas-2025/',
    action: 'not-found',
    status: 404,
    reason: 'La página inconsistente de matrícula 2025 fue retirada y no tiene reemplazo equivalente.',
    approved: true,
  },
  {
    from: '/matriculas-2026/',
    to: '/matriculas-2027/',
    action: 'redirect',
    status: 301,
    reason: 'Matrículas 2027 reemplaza la experiencia pública del proceso anterior.',
    approved: true,
  },
  {
    from: '/category/actividades2023/',
    to: '/actividades/?year=2023',
    action: 'redirect',
    status: 301,
    reason: 'Las publicaciones 2023 están disponibles en el archivo completo.',
    approved: true,
  },
  {
    from: '/category/actividades2023/page/2/',
    to: '/actividades/?year=2023',
    action: 'redirect',
    status: 301,
    reason: 'La paginación heredada queda consolidada en el filtro anual.',
    approved: true,
  },
  {
    from: '/category/actividades2023/page/3/',
    to: '/actividades/?year=2023',
    action: 'redirect',
    status: 301,
    reason: 'La paginación heredada queda consolidada en el filtro anual.',
    approved: true,
  },
  {
    from: '/category/actividades2023/page/4/',
    to: '/actividades/?year=2023',
    action: 'redirect',
    status: 301,
    reason: 'La paginación heredada queda consolidada en el filtro anual.',
    approved: true,
  },
  {
    from: '/category/actividades-2024/',
    to: '/actividades/',
    action: 'redirect',
    status: 301,
    reason: 'La categoría heredada se consolida en el archivo general de actividades.',
    approved: true,
  },
  {
    from: '/category/actividades-2024/page/2/',
    to: '/actividades/',
    action: 'redirect',
    status: 301,
    reason: 'La paginación heredada se consolida en el archivo general de actividades.',
    approved: true,
  },
  {
    from: '/category/uncategorized/',
    to: '/actividades/',
    action: 'redirect',
    status: 301,
    reason: 'Las publicaciones están presentes en el archivo completo.',
    approved: true,
  },
  {
    from: '/author/administrador/',
    to: '/actividades/',
    action: 'redirect',
    status: 301,
    reason: 'El archivo de autor queda consolidado en Actividades.',
    approved: true,
  },
  {
    from: '/author/administrador/page/2/',
    to: '/actividades/',
    action: 'redirect',
    status: 301,
    reason: 'La paginación de autor queda consolidada en Actividades.',
    approved: true,
  },
  {
    from: '/author/administrador/page/3/',
    to: '/actividades/',
    action: 'redirect',
    status: 301,
    reason: 'La paginación de autor queda consolidada en Actividades.',
    approved: true,
  },
  {
    from: '/author/administrador/page/4/',
    to: '/actividades/',
    action: 'redirect',
    status: 301,
    reason: 'La paginación de autor queda consolidada en Actividades.',
    approved: true,
  },
  {
    from: '/author/administrador/page/5/',
    to: '/actividades/',
    action: 'redirect',
    status: 301,
    reason: 'La paginación de autor queda consolidada en Actividades.',
    approved: true,
  },
  {
    from: '/mi-cuenta/',
    action: 'gone',
    status: 410,
    reason: 'No existen cuentas públicas necesarias.',
    approved: true,
  },
  {
    from: '/mi-cuenta/lost-password/',
    action: 'gone',
    status: 410,
    reason: 'No se necesita recuperación pública.',
    approved: true,
  },
  {
    from: '/registro/',
    action: 'gone',
    status: 410,
    reason: 'No existirá registro público.',
    approved: true,
  },
  {
    from: '/notas/',
    action: 'gone',
    status: 410,
    reason: 'El portal de notas no se utiliza.',
    approved: true,
  },
  {
    from: '/?wpr_mega_menu=wpr-mega-menu-item-4795',
    to: '/',
    action: 'redirect',
    status: 301,
    reason: 'El parámetro técnico del mega menú de WordPress se descarta.',
    approved: true,
  },
];

function validateLegacyRoutes(routes: readonly LegacyRoute[]): void {
  const sources = new Set<string>();

  for (const route of routes) {
    if (!route.from.startsWith('/') || sources.has(route.from)) {
      throw new Error(`Ruta heredada inválida o duplicada: ${route.from}`);
    }
    sources.add(route.from);

    if (
      route.action === 'redirect' &&
      (!route.to || (route.status !== 301 && route.status !== 302))
    ) {
      throw new Error(`Redirección incompleta: ${route.from}`);
    }
    if (route.action === 'gone' && route.status !== 410) {
      throw new Error(`Ruta gone sin estado 410: ${route.from}`);
    }
    if (route.action === 'not-found' && route.status !== 404) {
      throw new Error(`Ruta retirada sin estado 404: ${route.from}`);
    }
    if (
      route.approved &&
      !['redirect', 'gone', 'not-found'].includes(route.action)
    ) {
      throw new Error(`Acción aprobada inválida: ${route.from}`);
    }
  }
}

validateLegacyRoutes(legacyRoutes);

export const exactLegacyRedirects = legacyRoutes.filter(
  (route): route is LegacyRoute & { to: string; status: 301 | 302 } =>
    route.approved &&
    route.action === 'redirect' &&
    Boolean(route.to) &&
    !route.from.includes('?'),
);

export const queryLegacyRedirects = legacyRoutes.filter(
  (route): route is LegacyRoute & { to: string; status: 301 | 302 } =>
    route.approved &&
    route.action === 'redirect' &&
    Boolean(route.to) &&
    route.from.includes('?'),
);

export const goneLegacyRoutes = legacyRoutes.filter(
  (route) => route.approved && route.action === 'gone',
);

export const notFoundLegacyRoutes = legacyRoutes.filter(
  (route) => route.approved && route.action === 'not-found',
);
