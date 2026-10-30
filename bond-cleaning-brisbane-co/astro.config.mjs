// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';

// SITE_URL drives canonicals, sitemap, Open Graph and schema.
// Preview: the Netlify URL (Netlify sets URL automatically). Production: https://bondcleaningco.com
const PRODUCTION_URL = 'https://bondcleaningco.com';
const SITE_URL = (process.env.SITE_URL || process.env.URL || PRODUCTION_URL).replace(/\/$/, '');

// The site is indexable only when it is built for the real domain and NOINDEX isn't set.
// Every other build (the netlify.app preview, deploy previews, branch deploys) sends
// X-Robots-Tag: noindex and a robots noindex meta tag. Go-live = set SITE_URL to the domain.
const INDEXABLE = SITE_URL === PRODUCTION_URL && process.env.NOINDEX !== 'true';
process.env.PUBLIC_INDEXABLE = INDEXABLE ? 'true' : 'false';

/** Writes the noindex header for non-production builds into dist/_headers. */
function previewNoindex() {
  return {
    name: 'preview-noindex',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const file = new URL('_headers', dir);
        const existing = existsSync(file) ? readFileSync(file, 'utf8') : '';
        const rule = INDEXABLE ? '' : '/*\n  X-Robots-Tag: noindex, nofollow\n';
        writeFileSync(file, existing + rule);
      },
    },
  };
}

const NOT_IN_SITEMAP = ['/thank-you/', '/styleguide/', '/404/'];

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !NOT_IN_SITEMAP.some((p) => page.endsWith(p)),
    }),
    previewNoindex(),
  ],
  vite: {
    define: { 'import.meta.env.PUBLIC_INDEXABLE': JSON.stringify(INDEXABLE ? 'true' : 'false') },
  },
});
