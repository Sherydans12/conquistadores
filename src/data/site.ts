const STAGING_URL = 'https://staging.colegioconquistadores.com';
const PRODUCTION_HOST = 'www.colegioconquistadores.com';

type SiteEnvironment = 'staging' | 'production';

function getBaseUrl(): URL {
  const configuredUrl = import.meta.env.SITE_URL?.trim();

  try {
    return new URL(configuredUrl || STAGING_URL);
  } catch {
    return new URL(STAGING_URL);
  }
}

const baseUrl = getBaseUrl();
const requestedEnvironment =
  import.meta.env.SITE_ENV === 'production' ? 'production' : 'staging';
const environment: SiteEnvironment =
  requestedEnvironment === 'production' && baseUrl.hostname === PRODUCTION_HOST
    ? 'production'
    : 'staging';

export const site = {
  name: 'Colegio Conquistadores',
  shortName: 'Conquistadores',
  tagline: 'Aprender con alegría',
  baseUrl,
  environment,
  productionHost: PRODUCTION_HOST,
  phone: {
    display: '(51) 223 4652',
    href: 'tel:+56512234652',
    international: '+56 51 223 4652',
  },
  address: {
    street: 'Las Azucenas 690',
    locality: 'Coquimbo',
    country: 'Chile',
    display: 'Las Azucenas 690, Coquimbo',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Las%20Azucenas%20690%2C%20Coquimbo',
  },
  social: {
    instagram: {
      label: 'Instagram',
      url: 'https://www.instagram.com/colegioconquistadorescoquimbo/',
    },
    youtube: {
      label: 'YouTube',
      url: 'https://www.youtube.com/watch?v=Ff5jlg1Ez98',
    },
  },
  seo: {
    defaultTitle: 'Colegio Conquistadores | Aprender con alegría',
    defaultDescription:
      'Colegio Conquistadores de Coquimbo: educación integral e inclusiva, aprendizaje con alegría y una comunidad comprometida.',
    defaultImage: '/images/brand/colegio-conquistadores-og.webp',
    themeColor: '#1a2779',
    locale: 'es_CL',
  },
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, site.baseUrl).toString();
}
