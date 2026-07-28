export type LegacyRouteAction =
  | 'redirect'
  | 'gone'
  | 'external-service'
  | 'pending';

export interface LegacyRoute {
  from: string;
  to?: string;
  action: LegacyRouteAction;
  status?: 301 | 302 | 410;
  reason: string;
  approved: boolean;
  launchBlocker?: boolean;
}

/**
 * Inventario de decisiones propuestas. Este módulo no se conecta a Astro,
 * Cloudflare ni a ningún otro mecanismo activo de redirección.
 */
export const legacyRoutes: readonly LegacyRoute[] = [
  {
    from: '/calendario-de-evaluaciones-2026/',
    to: '/documentos/?category=evaluaciones&year=2026',
    action: 'redirect',
    status: 301,
    reason:
      'El centro documental contiene los once calendarios 2026 por nivel inventariados en la página heredada.',
    approved: true,
  },
  {
    from: '/plan-lector-2026/',
    to: '/documentos/?category=plan-lector&year=2026',
    action: 'redirect',
    status: 301,
    reason:
      'El centro documental contiene los once planes lectores 2026 por nivel inventariados en la página heredada.',
    approved: true,
  },
  {
    from: '/protocolos-internos/',
    to: '/documentos/?category=protocolos',
    action: 'redirect',
    status: 301,
    reason:
      'Los protocolos 2024 siguen ocultos y en revisión; el destino aún no contiene contenido equivalente.',
    approved: false,
    launchBlocker: true,
  },
  {
    from: '/reglamento-interno-de-convivencia-escolar/',
    to: '/documentos/?category=reglamentos&year=2026',
    action: 'redirect',
    status: 301,
    reason:
      'El destino publica el mismo RICE 2026 identificado en la ruta heredada.',
    approved: true,
  },
  {
    from: '/horarios-2025/',
    to: '/documentos/?category=horarios&year=2025',
    action: 'redirect',
    status: 301,
    reason:
      'El destino solo conserva una ficha de archivo y no incorpora todavía los diez PDF por curso.',
    approved: false,
    launchBlocker: true,
  },
  {
    from: '/matriculas-2025/',
    to: '/matriculas-2026/',
    action: 'redirect',
    status: 301,
    reason:
      'La página heredada mezcla archivos 2025 y 2026; no hay equivalencia documental confirmada.',
    approved: false,
    launchBlocker: true,
  },
  {
    from: '/category/actividades2023/',
    to: '/actividades/?year=2023',
    action: 'redirect',
    status: 301,
    reason:
      'El filtro anual conserva las publicaciones 2023 de la categoría heredada en el archivo completo.',
    approved: true,
  },
  {
    from: '/category/actividades2023/page/2/',
    to: '/actividades/?year=2023',
    action: 'redirect',
    status: 301,
    reason:
      'La paginación heredada queda consolidada en el filtro anual completo.',
    approved: true,
  },
  {
    from: '/category/actividades2023/page/3/',
    to: '/actividades/?year=2023',
    action: 'redirect',
    status: 301,
    reason:
      'La paginación heredada queda consolidada en el filtro anual completo.',
    approved: true,
  },
  {
    from: '/category/actividades2023/page/4/',
    to: '/actividades/?year=2023',
    action: 'redirect',
    status: 301,
    reason:
      'La paginación heredada queda consolidada en el filtro anual completo.',
    approved: true,
  },
  {
    from: '/category/actividades-2024/',
    to: '/actividades/?year=2024',
    action: 'redirect',
    status: 301,
    reason:
      'La categoría heredada también contiene publicaciones de 2025; el filtro 2024 no es equivalente.',
    approved: false,
    launchBlocker: true,
  },
  {
    from: '/category/actividades-2024/page/2/',
    to: '/actividades/?year=2024',
    action: 'redirect',
    status: 301,
    reason:
      'La categoría heredada también contiene publicaciones de 2025; se requiere revisar esta paginación.',
    approved: false,
    launchBlocker: true,
  },
  {
    from: '/category/uncategorized/',
    to: '/actividades/',
    action: 'redirect',
    status: 301,
    reason:
      'Las tres publicaciones de Uncategorized están presentes en el archivo completo.',
    approved: true,
  },
  {
    from: '/author/administrador/',
    to: '/actividades/',
    action: 'redirect',
    status: 301,
    reason:
      'El archivo de autor duplicaba las 47 actividades conservadas en el hub.',
    approved: true,
  },
  {
    from: '/author/administrador/page/2/',
    to: '/actividades/',
    action: 'redirect',
    status: 301,
    reason:
      'La paginación de autor queda consolidada en el archivo completo.',
    approved: true,
  },
  {
    from: '/author/administrador/page/3/',
    to: '/actividades/',
    action: 'redirect',
    status: 301,
    reason:
      'La paginación de autor queda consolidada en el archivo completo.',
    approved: true,
  },
  {
    from: '/author/administrador/page/4/',
    to: '/actividades/',
    action: 'redirect',
    status: 301,
    reason:
      'La paginación de autor queda consolidada en el archivo completo.',
    approved: true,
  },
  {
    from: '/author/administrador/page/5/',
    to: '/actividades/',
    action: 'redirect',
    status: 301,
    reason:
      'La paginación de autor queda consolidada en el archivo completo.',
    approved: true,
  },
  {
    from: '/mi-cuenta/',
    action: 'pending',
    reason:
      'Requiere decidir un portal académico seguro, servicio externo o subdominio dedicado.',
    approved: false,
    launchBlocker: true,
  },
  {
    from: '/mi-cuenta/lost-password/',
    action: 'pending',
    reason:
      'La recuperación debe pertenecer al futuro proveedor de identidad; no se puede simular en estático.',
    approved: false,
    launchBlocker: true,
  },
  {
    from: '/registro/',
    action: 'gone',
    status: 410,
    reason:
      'El registro heredado está deshabilitado, pero la eliminación definitiva requiere aprobación institucional.',
    approved: false,
    launchBlocker: true,
  },
  {
    from: '/notas/',
    action: 'pending',
    reason:
      'Flujo crítico con datos de estudiantes: exige autenticación, autorización y auditoría en un portal seguro.',
    approved: false,
    launchBlocker: true,
  },
  {
    from: '/?wpr_mega_menu=wpr-mega-menu-item-4795',
    action: 'pending',
    reason:
      'Artefacto técnico basado en query string; requiere una regla específica y aprobación antes del lanzamiento.',
    approved: false,
    launchBlocker: true,
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
    if (route.approved && route.action !== 'redirect') {
      throw new Error(`Solo se pueden aprobar redirecciones: ${route.from}`);
    }
  }
}

validateLegacyRoutes(legacyRoutes);

export const exactLegacyRedirects = legacyRoutes.filter(
  (route): route is LegacyRoute & { to: string; status: 301 | 302 } =>
    route.action === 'redirect' && Boolean(route.to),
);
