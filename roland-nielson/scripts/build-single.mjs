// Packs the built site (dist/) into ONE self-contained HTML file with hash routing,
// for hosts that accept a single HTML bundle. Images and fonts are inlined; the
// recovery video streams from jsDelivr (GitHub CDN) at a pinned commit.
// Usage: node scripts/build-single.mjs <out.html> <commit-sha>
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { parse } from 'node-html-parser';

const DIST = 'dist';
const [OUT, SHA] = process.argv.slice(2);
const CDN = `https://cdn.jsdelivr.net/gh/bazzie34og-ai/basit@${SHA}/roland-nielson/public/videos`;
const mime = { '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const cache = new Map();
const data = (p) => {
  if (cache.has(p)) return cache.get(p);
  const f = join(DIST, p);
  if (!existsSync(f)) return null;
  const uri = `data:${mime[extname(p)] ?? 'application/octet-stream'};base64,${readFileSync(f).toString('base64')}`;
  cache.set(p, uri);
  return uri;
};
const inlineAssets = (html) => html
  .replace(/(src|image)?srcset="([^"]+)"/g, (m, pre, set) => {
    const last = set.split(',').map((s) => s.trim().split(' ')[0]).pop();
    const d = last.startsWith('/') ? data(last) : null;
    return d ? `${pre ?? ''}srcset="${d}"` : m;
  })
  .replace(/(src|poster)="(\/(?:_astro|images|videos)\/[^"]+\.(?:avif|webp|jpg|png|svg))"/g, (m, a, p) => { const d = data(p); return d ? `${a}="${d}"` : m; })
  .replace(/url\((['"]?)(\/_astro\/[^)'"]+)\1\)/g, (m, q, p) => { const d = data(p); return d ? `url(${d})` : m; })
  .replace(/src="\/videos\/([^"]+\.(?:mp4|webm|vtt))"/g, `src="${CDN}/$1"`)
  .replace(/href="\/videos\/([^"]+\.mp4)"/g, `href="${CDN}/$1"`);

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? (f === '_astro' ? [] : walk(p)) : f === 'index.html' ? [p] : []; });
const routes = {};
const styles = new Set();
let script = '';
let shell;
for (const f of walk(DIST)) {
  const path = f.slice(DIST.length).replace(/index\.html$/, '');
  if (path === '/review/') continue;
  const html = readFileSync(f, 'utf8');
  const root = parse(html);
  root.querySelectorAll('style').forEach((s) => styles.add(s.innerHTML));
  const src = root.querySelector('script[type="module"][src]')?.getAttribute('src');
  if (src && !script) script = readFileSync(join(DIST, src), 'utf8');
  routes[path] = {
    title: root.querySelector('title').text,
    description: root.querySelector('meta[name="description"]').getAttribute('content'),
    cta: Boolean(root.querySelector('.cta-band')),
    main: root.querySelector('main').innerHTML,
  };
  if (path === '/') shell = root;
}
const header = shell.querySelector('header.site-header').outerHTML;
const cta = shell.querySelector('section.cta-band').outerHTML;
const footer = shell.querySelector('footer.site-footer').outerHTML;
const sticky = shell.querySelector('nav.sticky-bar').outerHTML;
const jsonLd = shell.querySelector('script[type="application/ld+json"]').outerHTML;
const headMeta = shell.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], meta[name="theme-color"], meta[name^="geo."]')
  .map((m) => m.outerHTML.replace(/content="\/(og|images)\//, 'content="https://rolandnielson.com/$1/')).join('\n');

const sections = Object.entries(routes).map(([p, r]) =>
  `<div class="route" data-route="${p}"${p === '/' ? '' : ' hidden'}>${r.main}</div>`).join('\n');

// Internal links → hash routes. Forms post to "/" (the only file on this host).
let body = `${header}\n<main id="main" tabindex="-1">${sections}</main>\n${cta}\n${footer}\n${sticky}`;
body = body.replace(/href="(\/[^"#?]*)(#[^"]*)?"/g, (m, p, h) => (routes[p] ? `href="#${p}"` : m));
body = body.replace(/action="\/thank-you\/"/g, 'action="/"');
body = inlineAssets(body);

const meta = Object.fromEntries(Object.entries(routes).map(([p, r]) => [p, { t: r.title, d: r.description, c: r.cta }]));
const router = `
const ROUTES = ${JSON.stringify(meta)};
const ctaBand = document.querySelector('.cta-band');
const descTag = document.querySelector('meta[name="description"]');
function show(path, scroll = true) {
  if (!ROUTES[path]) path = '/';
  document.querySelectorAll('.route').forEach((el) => (el.hidden = el.dataset.route !== path));
  const r = ROUTES[path];
  document.title = r.t; descTag?.setAttribute('content', r.d);
  if (ctaBand) ctaBand.hidden = !r.c;
  document.querySelectorAll('header a[href^="#/"]').forEach((a) => {
    const href = a.getAttribute('href').slice(1);
    if (href === path || (href !== '/' && path.startsWith(href))) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  const menuBtn = document.querySelector('[data-menu-btn]');
  if (menuBtn?.getAttribute('aria-expanded') === 'true') menuBtn.click();
  document.querySelectorAll('.route:not([hidden]) .reveal').forEach((el) => el.classList.add('in'));
  if (scroll) { window.scrollTo(0, 0); document.getElementById('main')?.focus({ preventScroll: true }); }
}
const current = () => (location.hash.startsWith('#/') ? location.hash.slice(1) : '/');
window.addEventListener('hashchange', () => { if (location.hash.startsWith('#/') || !location.hash) show(current()); });
document.querySelectorAll('form[data-lead-form]').forEach((f) => f.addEventListener('submit', (e) => {
  if (!e.defaultPrevented) { try { sessionStorage.setItem('rn-sent', '1'); } catch {} }
}));
let sent = false; try { sent = sessionStorage.getItem('rn-sent') === '1'; sessionStorage.removeItem('rn-sent'); } catch {}
if (sent) { history.replaceState(null, '', '#/thank-you/'); show('/thank-you/'); } else show(current(), false);
`;

const out = `<!doctype html>
<html lang="en-US">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${routes['/'].title}</title>
<meta name="description" content="${routes['/'].description}" />
<link rel="canonical" href="https://rolandnielson.com/" />
<link rel="icon" href="${data('/favicon.svg')}" type="image/svg+xml" />
${headMeta}
${jsonLd}
<style>${[...styles].join('\n')}</style>
<script>document.documentElement.classList.add('js');</script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
${body}
<script type="module">${script}</script>
<script type="module">${router}</script>
</body>
</html>`;
writeFileSync(OUT, out);
console.log(`${OUT}: ${(out.length / 1024 / 1024).toFixed(2)} MB, ${Object.keys(routes).length} routes`);
