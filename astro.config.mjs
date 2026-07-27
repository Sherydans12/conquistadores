import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://staging.colegioconquistadores.com',
  output: 'static',
  devToolbar: {
    enabled: false,
  },
});
