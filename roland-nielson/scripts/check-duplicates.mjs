// Uniqueness check for service and area pages (run after `npm run build`).
// Compares the visible body text of every pair using 8-word shingles and fails if any two pages
// share more than 20% of their shingles (share of the smaller page). Site chrome (header, footer,
// CTA band, sticky bar) and blocks that repeat by design ([data-shared]: gap block, price/where-we-meet,
// "What this is not") are left out, so the score reflects each page's own content.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'node-html-parser';
import { areaPages } from '../src/config/site.ts';

const LIMIT = 0.2;
const DIST = 'dist';
const serviceDir = 'src/content/services';
import { readdirSync } from 'node:fs';
const slugs = [
  ...readdirSync(serviceDir).filter((f) => f.endsWith('.md')).map((f) => ({ kind: 'service', slug: f.replace(/\.md$/, '') })),
  ...areaPages.map((a) => ({ kind: 'area', slug: a.slug })),
].filter((p) => existsSync(join(DIST, p.slug, 'index.html'))); // flagged pages aren't built

const pages = slugs.map((p) => {
  const root = parse(readFileSync(join(DIST, p.slug, 'index.html'), 'utf8'));
  const main = root.querySelector('main');
  main.querySelectorAll('script, style, .cta-band, [data-shared]').forEach((e) => e.remove());
  const words = main.text.toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean);
  const sh = new Set();
  for (let i = 0; i + 8 <= words.length; i++) sh.add(words.slice(i, i + 8).join(' '));
  return { ...p, words: words.length, sh };
});

const pairs = [];
for (let i = 0; i < pages.length; i++) for (let j = i + 1; j < pages.length; j++) {
  const a = pages[i], b = pages[j];
  let shared = 0; for (const s of a.sh) if (b.sh.has(s)) shared++;
  pairs.push({ a: a.slug, b: b.slug, pct: shared / Math.max(1, Math.min(a.sh.size, b.sh.size)) });
}
pairs.sort((x, y) => y.pct - x.pct);
const maxBy = new Map();
for (const p of pairs) for (const s of [p.a, p.b]) if (!maxBy.has(s) || maxBy.get(s).pct < p.pct) maxBy.set(s, { pct: p.pct, other: s === p.a ? p.b : p.a });

console.log(`Uniqueness: ${pages.length} pages, ${pairs.length} pairs, 8-word shingles, limit ${LIMIT * 100}%\n`);
console.log('| Page | Type | Words (own content) | Highest overlap | With |\n|---|---|---|---|---|');
for (const p of pages) { const m = maxBy.get(p.slug); console.log(`| /${p.slug}/ | ${p.kind} | ${p.words} | ${(m.pct * 100).toFixed(1)}% | /${m.other}/ |`); }
const bad = pairs.filter((p) => p.pct > LIMIT);
console.log(`\nTop pairs:\n${pairs.slice(0, 5).map((p) => `  ${(p.pct * 100).toFixed(1).padStart(5)}%  /${p.a}/ ↔ /${p.b}/`).join('\n')}`);
if (bad.length) { console.log(`\n✗ ${bad.length} pair(s) over ${LIMIT * 100}%`); process.exit(1); }
console.log(`\n✓ No two pages share more than ${LIMIT * 100}% of their shingles.`);
