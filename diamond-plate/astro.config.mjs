// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { remarkTokens } from './src/lib/tokens.ts';

const SITE_URL = (process.env.SITE_URL || 'https://diamond-plate-brisbane.netlify.app').replace(/\/+$/, '');

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  markdown: { processor: unified({ remarkPlugins: [remarkTokens] }) },
  integrations: [
    sitemap({
      filter: (page) => !/\/(thank-you|404)\/?$/.test(new URL(page).pathname),
    }),
  ],
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
