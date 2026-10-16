import { defineConfig } from 'astro/config';
import remarkSiteLinks from './src/lib/remark-site-links.mjs';
import { site } from './src/config/site.ts';
import { redirectsFile } from './src/lib/redirects.ts';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Writes dist/_redirects from config after each build (Astro skips _-prefixed pages).
const netlifyRedirects = {
  name: 'netlify-redirects',
  hooks: {
    'astro:build:done': ({ dir }) => writeFileSync(fileURLToPath(new URL('_redirects', dir)), redirectsFile()),
  },
};

export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  prefetch: false,
  devToolbar: { enabled: false },
  integrations: [netlifyRedirects],
  markdown: {
    remarkPlugins: [remarkSiteLinks({ booking: site.booking, phoneE164: site.phone.e164 })],
  },
});
