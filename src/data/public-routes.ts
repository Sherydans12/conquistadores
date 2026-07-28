export interface PublicRoute {
  path: string;
  type:
    | 'home'
    | 'institutional'
    | 'documents'
    | 'activities'
    | 'activity';
  indexableInProduction: boolean;
  includeInSitemap: boolean;
  priority?: number;
  changeFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export const staticPublicRoutes: readonly PublicRoute[] = [
  {
    path: '/',
    type: 'home',
    indexableInProduction: true,
    includeInSitemap: true,
    priority: 1,
    changeFrequency: 'weekly',
  },
  {
    path: '/quienes-somos/',
    type: 'institutional',
    indexableInProduction: true,
    includeInSitemap: true,
    priority: 0.8,
    changeFrequency: 'yearly',
  },
  {
    path: '/personal/',
    type: 'institutional',
    indexableInProduction: true,
    includeInSitemap: true,
    priority: 0.8,
    changeFrequency: 'yearly',
  },
  {
    path: '/talleres/',
    type: 'institutional',
    indexableInProduction: true,
    includeInSitemap: true,
    priority: 0.7,
    changeFrequency: 'yearly',
  },
  {
    path: '/academias/',
    type: 'institutional',
    indexableInProduction: true,
    includeInSitemap: true,
    priority: 0.7,
    changeFrequency: 'yearly',
  },
  {
    path: '/matriculas-2026/',
    type: 'institutional',
    indexableInProduction: true,
    includeInSitemap: true,
    priority: 0.9,
    changeFrequency: 'monthly',
  },
  {
    path: '/documentos/',
    type: 'documents',
    indexableInProduction: true,
    includeInSitemap: true,
    priority: 0.9,
    changeFrequency: 'monthly',
  },
  {
    path: '/actividades/',
    type: 'activities',
    indexableInProduction: true,
    includeInSitemap: true,
    priority: 0.8,
    changeFrequency: 'weekly',
  },
];

const forbiddenRouteFragments = [
  '/mi-cuenta',
  '/registro',
  '/notas',
  '/search',
  '/wp-',
  '/admin',
];

function validateStaticPublicRoutes(routes: readonly PublicRoute[]): void {
  const paths = new Set<string>();

  for (const route of routes) {
    if (
      !route.path.startsWith('/') ||
      (route.path !== '/' && !route.path.endsWith('/')) ||
      route.path.includes('?') ||
      route.path.includes('#') ||
      route.path.includes('://')
    ) {
      throw new Error(`Formato inválido de ruta pública: ${route.path}`);
    }

    if (
      forbiddenRouteFragments.some((fragment) =>
        route.path.toLowerCase().includes(fragment),
      )
    ) {
      throw new Error(`Ruta técnica o sensible no permitida: ${route.path}`);
    }

    if (paths.has(route.path)) {
      throw new Error(`Ruta pública duplicada: ${route.path}`);
    }
    paths.add(route.path);
  }
}

validateStaticPublicRoutes(staticPublicRoutes);
