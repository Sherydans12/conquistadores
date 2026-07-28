import { defineConfig } from 'astro/config';
import { resolveSiteConfig } from './src/data/site-config.ts';

const siteConfig = resolveSiteConfig(process.env);

export default defineConfig({
  site: siteConfig.baseUrl.toString(),
  output: 'static',
  devToolbar: {
    enabled: false,
  },
});
