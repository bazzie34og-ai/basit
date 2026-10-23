import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE_URL = (process.env.SITE_URL || process.env.URL || 'https://smith-and-shine-telford.netlify.app').replace(/\/$/, '');

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  output: 'static',
  prefetch: false,
  integrations: [
    sitemap({
      filter: (page) => !/\/(thank-you|404)\/?$/.test(page) && !page.includes('/og/'),
    }),
  ],
  image: { responsiveStyles: false },
  vite: { build: { assetsInlineLimit: 2048 } },
});
