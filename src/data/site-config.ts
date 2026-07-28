export const STAGING_URL = 'https://staging.colegioconquistadores.com';
export const PRODUCTION_URL = 'https://www.colegioconquistadores.com';
export const STAGING_HOST = new URL(STAGING_URL).hostname;
export const PRODUCTION_HOST = new URL(PRODUCTION_URL).hostname;

export type SiteEnvironment = 'staging' | 'production';

export interface SiteEnvironmentInput {
  SITE_ENV?: string;
  SITE_URL?: string;
}

export interface ResolvedSiteConfig {
  environment: SiteEnvironment;
  baseUrl: URL;
  canonicalHost: string;
  isProduction: boolean;
  indexingAllowed: boolean;
}

function isRootHttpsUrl(url: URL): boolean {
  return (
    url.protocol === 'https:' &&
    url.pathname === '/' &&
    url.search === '' &&
    url.hash === '' &&
    url.username === '' &&
    url.password === ''
  );
}

export function resolveSiteConfig(
  input: SiteEnvironmentInput,
): ResolvedSiteConfig {
  const requestedEnvironment: SiteEnvironment =
    input.SITE_ENV?.trim() === 'production' ? 'production' : 'staging';
  const configuredUrl = input.SITE_URL?.trim();
  let parsedUrl: URL | undefined;

  if (configuredUrl) {
    try {
      parsedUrl = new URL(configuredUrl);
    } catch {
      if (requestedEnvironment === 'production') {
        throw new Error(
          'SITE_URL debe ser una URL HTTPS válida para compilar producción.',
        );
      }
    }
  }

  if (requestedEnvironment === 'production') {
    if (
      !parsedUrl ||
      !isRootHttpsUrl(parsedUrl) ||
      parsedUrl.hostname !== PRODUCTION_HOST
    ) {
      throw new Error(
        `SITE_ENV=production exige SITE_URL=${PRODUCTION_URL}.`,
      );
    }

    const baseUrl = new URL(PRODUCTION_URL);
    return {
      environment: 'production',
      baseUrl,
      canonicalHost: PRODUCTION_HOST,
      isProduction: true,
      indexingAllowed: true,
    };
  }

  const baseUrl =
    parsedUrl &&
    isRootHttpsUrl(parsedUrl) &&
    parsedUrl.hostname === STAGING_HOST
      ? new URL(STAGING_URL)
      : new URL(STAGING_URL);

  return {
    environment: 'staging',
    baseUrl,
    canonicalHost: STAGING_HOST,
    isProduction: false,
    indexingAllowed: false,
  };
}
