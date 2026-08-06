import { defineConfig } from 'astro/config';
import { resolveSiteConfig } from './src/data/site-config.ts';

const siteConfig = resolveSiteConfig(process.env);

export default defineConfig({
  site: siteConfig.baseUrl.toString(),
  output: 'static',
  redirects: {
    '/matriculas-2026/': {
      status: 301,
      destination: '/matriculas-2027/',
    },
  },
  devToolbar: {
    enabled: false,
  },
});
