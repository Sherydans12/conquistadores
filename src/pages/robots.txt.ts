import type { APIRoute } from 'astro';
import { site } from '../data/site';

export const GET: APIRoute = () => {
  const body =
    site.environment === 'production'
      ? [
          'User-agent: *',
          'Allow: /',
          `Sitemap: ${new URL('/sitemap.xml', site.baseUrl).toString()}`,
        ].join('\n')
      : ['User-agent: *', 'Disallow: /'].join('\n');

  return new Response(`${body}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
