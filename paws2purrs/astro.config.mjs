import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import biz from './src/data/business.json' with { type: 'json' };

const site = (process.env.SITE_URL || biz.siteUrl).replace(/\/$/, '');

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  integrations: [
    sitemap({ filter: (page) => !/\/(thank-you|404)\/?$/.test(page) }),
  ],
});
