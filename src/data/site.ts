import {
  PRODUCTION_HOST,
  PRODUCTION_URL,
  resolveSiteConfig,
  STAGING_HOST,
  STAGING_URL,
} from './site-config';

const resolvedSiteConfig = resolveSiteConfig({
  SITE_ENV: import.meta.env.SITE_ENV,
  SITE_URL: import.meta.env.SITE_URL,
});

export const site = {
  name: 'Colegio Conquistadores',
  shortName: 'Conquistadores',
  tagline: 'Aprender con alegría',
  baseUrl: resolvedSiteConfig.baseUrl,
  environment: resolvedSiteConfig.environment,
  canonicalHost: resolvedSiteConfig.canonicalHost,
  isProduction: resolvedSiteConfig.isProduction,
  indexingAllowed: resolvedSiteConfig.indexingAllowed,
  productionHost: PRODUCTION_HOST,
  productionUrl: PRODUCTION_URL,
  stagingHost: STAGING_HOST,
  stagingUrl: STAGING_URL,
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

export function canonicalUrl(path: string): string {
  const url = new URL(path, site.baseUrl);
  url.search = '';
  url.hash = '';
  return url.toString();
}
