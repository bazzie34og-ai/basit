import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import business from './src/data/business.json' with { type: 'json' };

export default defineConfig({
  site: business.siteUrl,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !/\/(thank-you|404)\/?$/.test(page),
    }),
  ],
});
