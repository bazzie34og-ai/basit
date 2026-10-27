// Read-only audit of the built site: title, H1, main-content word count, the phrase the
// title leads with (its target keyword) and internal links. Flags pages whose titles or
// H1s lead with the same phrase. Run after `npm run build`: node scripts/audit-pages.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'node-html-parser';

const DIST = 'dist';
const files = [];
const walk = (d) => readdirSync(d).forEach((f) => {
  const p = join(d, f);
  if (statSync(p).isDirectory()) { if (f !== '_astro') walk(p); }
  else if (f === 'index.html' || f === '404.html') files.push(p);
});
walk(DIST);
const rows = files.map((f) => {
  const root = parse(readFileSync(f, 'utf8'));
  const url = f.slice(DIST.length).replace(/index\.html$/, '').replace('404.html', '404/');
  const robots = root.querySelector('meta[name=robots]')?.getAttribute('content') ?? '';
  const title = root.querySelector('title')?.text.trim() ?? '';
  const h1 = root.querySelector('h1')?.text.replace(/\s+/g, ' ').trim() ?? '';
  const main = root.querySelector('main');
  main?.querySelectorAll('.cta-band, script, style, [data-shared]').forEach((e) => e.remove());
  const words = (main?.text ?? '').split(/\s+/).filter(Boolean).length;
  const links = new Set(root.querySelectorAll('main a[href^="/"]').map((a) => a.getAttribute('href').split('#')[0]).filter((h) => h !== url));
  const keyword = title.split(/[|–]/)[0].replace(/\(.*?\)/g, '').trim().toLowerCase();
  return { url, title, h1, words, keyword, links: links.size, noindex: robots.includes('noindex') };
}).sort((a, b) => a.url.localeCompare(b.url));

console.log('| URL | Title | H1 | Words | Keyword (title lead) | Internal links |\n|---|---|---|---|---|---|');
for (const r of rows) console.log(`| ${r.url}${r.noindex ? ' (noindex)' : ''} | ${r.title} | ${r.h1} | ${r.words} | ${r.keyword} | ${r.links} |`);
const seen = new Map();
for (const r of rows.filter((x) => !x.noindex)) seen.set(r.keyword, [...(seen.get(r.keyword) ?? []), r.url]);
const clashes = [...seen].filter(([, u]) => u.length > 1);
console.log(`\n${clashes.length ? 'Pages sharing a title keyword:\n' + clashes.map(([k, u]) => `- "${k}": ${u.join(', ')}`).join('\n') : 'No two pages share a title keyword.'}`);
