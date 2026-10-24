import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE_URL = (process.env.SITE_URL || process.env.URL || 'https://steam-cleaning-solution-cardiff.netlify.app').replace(/\/$/, '');

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: false,
  integrations: [
    sitemap({
      filter: (page) => !/\/(thank-you|404)\/?$/.test(page),
    }),
  ],
  image: { responsiveStyles: false },
});
