import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE_URL = (process.env.SITE_URL || process.env.URL || 'https://lm-auto-care-preview.netlify.app').replace(/\/$/, '');

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  prefetch: false,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thank-you/') && !page.includes('/404'),
    }),
  ],
  image: {
    // Phone photos are ~720px wide. Never upscale.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  vite: {
    // Keep every script external so the CSP can stay script-src 'self'.
    build: { assetsInlineLimit: 0 },
  },
});
