import { defineConfig } from 'astro/config';
import remarkSiteLinks from './src/lib/remark-site-links.mjs';
import { site, bookingUtm } from './src/config/site.ts';
import { redirectsFile } from './src/lib/redirects.ts';
import { writeFileSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Writes dist/_redirects from config after each build (Astro skips _-prefixed pages).
const netlifyRedirects = {
  name: 'netlify-redirects',
  hooks: {
    'astro:build:done': ({ dir }) => writeFileSync(fileURLToPath(new URL('_redirects', dir)), redirectsFile()),
  },
};

// Every on-site link to the booking page gets UTM tags naming the page it was clicked on
// (?utm_source=website&utm_medium=cta&utm_campaign=<page-slug>). Embeds (free-call iframe) are left alone.
const bookingUtmLinks = {
  name: 'booking-utm',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const root = fileURLToPath(dir);
      const walk = (d) => readdirSync(d).flatMap((f) => {
        const p = join(d, f);
        return statSync(p).isDirectory() ? (f === '_astro' ? [] : walk(p)) : p.endsWith('.html') ? [p] : [];
      });
      const href = `href="${site.booking}"`;
      for (const file of walk(root)) {
        const html = readFileSync(file, 'utf8');
        if (!html.includes(href)) continue;
        const rel = file.slice(root.length).replace(/\\/g, '/').replace(/^\//, '').replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
        const slug = rel ? rel.replace(/\//g, '-') : 'home';
        writeFileSync(file, html.split(href).join(`href="${bookingUtm(slug).replace(/&/g, '&amp;')}"`));
      }
    },
  },
};

export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  prefetch: false,
  // Never inline bundled scripts: the CSP has no 'unsafe-inline' in script-src (blocks Netlify's badge).
  vite: { build: { assetsInlineLimit: 0 } },
  devToolbar: { enabled: false },
  integrations: [netlifyRedirects, bookingUtmLinks],
  markdown: {
    remarkPlugins: [remarkSiteLinks({ booking: site.booking, phoneE164: site.phone.e164 })],
  },
});
