// Pre-launch QA over the built site (run `npm run build` first, then `npm run check:site`).
// Checks: one H1, title/description limits and uniqueness, canonical, OG image, breadcrumbs,
// JSON-LD validity, NAP consistency, no street address, banned words outside scope
// disclaimers, broken internal links, orphans, click depth, image alt/size, word counts.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'node-html-parser';

const DIST = 'dist';
const ORIGIN = 'https://rolandnielson.com';
const NAME = "Roland Nielson – Omaha Men's Life Coaching";
const PHONE = '(402) 577-0738';
const BANNED = /\b(therap\w*|counsel(?:or|ors|ing)|treatment|certified|licensed|diagnos\w*|cure|cures|cured|clinical)\b/gi;
const STREET = /\b\d{2,5}\s+(?:[NSEW]\.?\s+)?[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\s+(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Dr|Drive|Ln|Lane|Ct|Court|Pkwy|Parkway|Cir|Circle|Plaza)\b\.?/;
const NOINDEX = new Set(['/thank-you/', '/review/', '/404/']);

const errors = [];
const warns = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warns.push(`${page}: ${msg}`);

// Collect built pages.
const files = [];
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { if (f !== '_astro') walk(p); }
    else if (f.endsWith('.html') && !/^google[0-9a-f]+\.html$/.test(f)) files.push(p); // skip Search Console verification file
  }
};
walk(DIST);
const urlOf = (file) => {
  const rel = file.slice(DIST.length).replace(/\\/g, '/');
  if (rel === '/404.html') return '/404/';
  return rel.replace(/index\.html$/, '');
};
const exists = (path) => {
  const clean = decodeURI(path.split('#')[0].split('?')[0]);
  if (!clean.startsWith('/')) return true;
  const p = join(DIST, clean);
  return existsSync(p) && (statSync(p).isFile() || existsSync(join(p, 'index.html')));
};

const pages = new Map();
const titles = new Map();
const descs = new Map();
for (const file of files) {
  const url = urlOf(file);
  const html = readFileSync(file, 'utf8');
  const root = parse(html);
  const title = root.querySelector('title')?.text.trim() ?? '';
  const desc = root.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
  const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute('href');
  const robots = root.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';
  const og = root.querySelector('meta[property="og:image"]')?.getAttribute('content');
  const h1s = root.querySelectorAll('h1');
  const noindex = NOINDEX.has(url);

  if (h1s.length !== 1) err(url, `${h1s.length} H1 elements`);
  if (!title) err(url, 'missing <title>');
  if (title.length > 60) err(url, `title ${title.length} chars: ${title}`);
  if (desc.length < 140 || desc.length > 155) err(url, `description ${desc.length} chars`);
  if (!canonical) err(url, 'missing canonical');
  else if (canonical !== ORIGIN + (url === '/404/' ? '/404/' : url)) err(url, `canonical mismatch ${canonical}`);
  if (noindex !== robots.includes('noindex')) err(url, `robots "${robots}" (noindex expected: ${noindex})`);
  if (!og || !exists(og.replace(ORIGIN, ''))) err(url, `OG image missing: ${og}`);
  if (root.querySelector('html')?.getAttribute('lang') !== 'en-US') err(url, 'html lang is not en-US');
  if (!noindex) {
    titles.set(title, [...(titles.get(title) ?? []), url]);
    descs.set(desc, [...(descs.get(desc) ?? []), url]);
  }

  // JSON-LD
  let graph = [];
  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    try { graph = graph.concat(JSON.parse(s.text)['@graph'] ?? []); } catch (e) { err(url, `invalid JSON-LD: ${e.message}`); }
  }
  const types = graph.flatMap((n) => [].concat(n['@type']));
  for (const t of ['LocalBusiness', 'Person', 'WebSite']) if (!types.includes(t)) err(url, `JSON-LD missing ${t}`);
  if (url !== '/' && !NOINDEX.has(url) && !types.includes('BreadcrumbList')) err(url, 'JSON-LD missing BreadcrumbList');
  if (url !== '/' && !NOINDEX.has(url) && !root.querySelector('nav.crumbs')) err(url, 'visible breadcrumb missing');
  if (types.includes('Review') || types.includes('AggregateRating') || JSON.stringify(graph).includes('aggregateRating')) err(url, 'Review/AggregateRating schema found');
  const biz = graph.find((n) => [].concat(n['@type']).includes('LocalBusiness'));
  if (biz) {
    if (biz.name !== NAME) err(url, `schema name "${biz.name}"`);
    if (biz.address?.streetAddress) err(url, 'schema has streetAddress (service-area business)');
  }
  for (const n of graph) {
    if (n['@type'] === 'FAQPage' && !(n.mainEntity?.length)) err(url, 'FAQPage without questions');
    if (n['@type'] === 'VideoObject') {
      for (const k of ['name', 'description', 'thumbnailUrl']) if (!n[k]) err(url, `VideoObject missing ${k}`);
      if (!n.uploadDate) warn(url, `VideoObject "${n.name}" has no uploadDate ({{VIDEO_UPLOAD_DATE}})`);
    }
    if (n['@type'] === 'BlogPosting') for (const k of ['headline', 'datePublished', 'dateModified', 'author', 'image']) if (!n[k]) err(url, `BlogPosting missing ${k}`);
  }

  // Body checks
  const body = root.querySelector('body');
  const text = body.text.replace(/\s+/g, ' ');
  if (!text.includes(NAME)) err(url, 'exact business name not on page');
  if (!text.includes(PHONE)) err(url, 'phone display not on page');
  if (!text.includes('Omaha, NE')) err(url, '"Omaha, NE" not on page');
  if (STREET.test(text)) err(url, `possible street address: ${text.match(STREET)[0]}`);
  for (const m of text.matchAll(/\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/g)) {
    const n = m[0].replace(/\D/g, '');
    if (n === '4025770738' && m[0] !== PHONE) err(url, `phone formatted differently: ${m[0]}`);
  }

  // Banned words: strip scope disclaimers, crisis boxes and scope-flagged FAQ items.
  const scoped = parse(body.toString());
  scoped.querySelectorAll('[data-scope], script, style').forEach((el) => el.remove());
  const hits = [...scoped.text.matchAll(BANNED)].map((m) => {
    const i = m.index;
    return `"${scoped.text.slice(Math.max(0, i - 40), i + 40).replace(/\s+/g, ' ').trim()}"`;
  });
  if (hits.length) err(url, `banned words outside disclaimers: ${hits.join(' | ')}`);
  const headHits = `${title} ${desc}`.match(BANNED);
  if (headHits && !root.querySelector('article[data-scope]')) err(url, `banned word in title/description: ${headHits.join(', ')}`);

  // Images
  for (const img of root.querySelectorAll('img')) {
    if (img.getAttribute('alt') === undefined) err(url, `img without alt: ${img.getAttribute('src')}`);
    if (!img.getAttribute('width') || !img.getAttribute('height')) err(url, `img without width/height: ${img.getAttribute('src')}`);
  }
  // Form fields need labels.
  for (const input of root.querySelectorAll('input:not([type=hidden]), textarea, select')) {
    if (input.closest('.hp')) continue;
    const id = input.getAttribute('id');
    const labelled = (id && root.querySelector(`label[for="${id}"]`)) || input.closest('label');
    if (!labelled) err(url, `unlabelled field: ${input.getAttribute('name')}`);
  }

  // Links
  const links = new Set();
  for (const a of root.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href');
    if (/click here|read more$/i.test(a.text.trim()) && !a.querySelector('.sr-only') && !a.classList.contains('card')) warn(url, `vague anchor "${a.text.trim()}"`);
    if (href.startsWith('/') && !href.startsWith('//')) {
      const path = href.split('#')[0];
      if (!exists(path)) err(url, `broken internal link ${href}`);
      else if (path && !path.endsWith('/') && !/\.\w+$/.test(path)) err(url, `link without trailing slash ${href}`);
      links.add(path || url);
    }
  }
  const words = parse(body.toString());
  words.querySelectorAll('header, footer, nav, script, style, .cta-band, .sticky-bar, details.transcript').forEach((el) => el.remove());
  pages.set(url, { links, words: words.text.split(/\s+/).filter(Boolean).length, noindex });
}

for (const [t, urls] of titles) if (urls.length > 1) err(urls.join(', '), `duplicate title "${t}"`);
for (const [d, urls] of descs) if (urls.length > 1) err(urls.join(', '), 'duplicate description');

// Click depth from home + orphans.
const depth = new Map([['/', 0]]);
const queue = ['/'];
while (queue.length) {
  const u = queue.shift();
  for (const l of pages.get(u)?.links ?? []) if (pages.has(l) && !depth.has(l)) { depth.set(l, depth.get(u) + 1); queue.push(l); }
}
for (const [u, p] of pages) {
  if (p.noindex) continue;
  if (!depth.has(u)) err(u, 'orphan: not reachable from home');
  else if (depth.get(u) > 2) err(u, `click depth ${depth.get(u)} (> 2)`);
}

// Redirect file sanity: no chains (target of one rule is not the source of another).
const redirects = existsSync(join(DIST, '_redirects')) ? readFileSync(join(DIST, '_redirects'), 'utf8') : '';
if (!redirects) err('_redirects', 'missing');
const rules = redirects.split('\n').filter((l) => l && !l.startsWith('#')).map((l) => l.trim().split(/\s+/));
const sources = new Set(rules.map((r) => r[0]));
for (const [from, to] of rules) if (to.startsWith('/') && sources.has(to)) err('_redirects', `redirect chain ${from} → ${to}`);
for (const [, to] of rules) if (to.startsWith('/') && !exists(to)) err('_redirects', `redirect target missing ${to}`);

// Sitemaps
const sm = readFileSync(join(DIST, 'sitemap-pages.xml'), 'utf8');
for (const [u, p] of pages) {
  const inMap = sm.includes(`<loc>${ORIGIN}${u}</loc>`);
  if (p.noindex && inMap) err(u, 'noindex page in sitemap');
  if (!p.noindex && !inMap) err(u, 'missing from sitemap');
}

console.log('Word counts (main content):');
for (const [u, p] of [...pages].sort()) console.log(`  ${String(p.words).padStart(5)}  depth ${depth.get(u) ?? '-'}  ${u}`);
if (warns.length) { console.log(`\n${warns.length} warning(s):`); warns.forEach((w) => console.log('  ! ' + w)); }
if (errors.length) { console.log(`\n${errors.length} error(s):`); errors.forEach((e) => console.log('  ✗ ' + e)); process.exit(1); }
console.log(`\n✓ ${pages.size} pages passed all checks.`);
