// Writes dist/_headers with a strict CSP: every inline <script> gets a sha256 hash,
// so 'unsafe-inline' is never needed for scripts. Also adds noindex headers in preview mode.
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dist = path.join(root, 'dist');
const preview = (process.env.PREVIEW_MODE ?? 'true').toLowerCase() !== 'false';

async function* walk(d) {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) yield* walk(p); else if (p.endsWith('.html')) yield p;
  }
}
const hashes = new Set();
for await (const f of walk(dist)) {
  const html = await readFile(f, 'utf8');
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g)) {
    if (!m[1].trim()) continue;
    hashes.add(`'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`);
  }
}
const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].join(' ')} https://www.googletagmanager.com https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  'frame-src https://challenges.cloudflare.com',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const lines = ['/*', `  Content-Security-Policy: ${csp}`];
if (preview) lines.push('  X-Robots-Tag: noindex, nofollow');
lines.push('', '/thank-you/*', '  X-Robots-Tag: noindex', '');
await writeFile(path.join(dist, '_headers'), lines.join('\n'));
console.log(`[headers] CSP with ${hashes.size} inline script hash(es)${preview ? ', preview noindex' : ''}`);
