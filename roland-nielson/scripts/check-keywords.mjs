// Keyword cannibalisation check (run after `npm run build`). Prints a page → primary keyword table and
// fails if two pages share a primary keyword, or if one page's keyword appears in another page's title or
// H1 (unless that page's own keyword is a longer phrase containing it, e.g. "in person life coach Omaha").
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'node-html-parser';
import yaml from 'js-yaml';

const DIST = 'dist';
const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/\b(ne|ia|nebraska|iowa)\b/g, ' ').replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
// Static pages own these keywords (collection pages declare theirs in frontmatter).
const keywords = new Map(Object.entries({
  '/': "men's life coach Omaha",
  '/omaha-life-coach/': 'life coach Omaha',
  '/free-call/': 'free life coaching consultation Omaha',
  '/pricing/': 'life coaching prices Omaha',
  '/services/': "men's coaching services Omaha",
  '/reviews/': 'Roland Nielson reviews',
  '/about/': 'Roland Nielson',
  '/for-families/': 'help for your husband or son',
  '/faq/': 'life coaching FAQ',
  '/personal-patterns-assessment/': 'personal patterns assessment',
  '/omaha-resources/': 'Omaha resources for men',
}));
for (const dir of ['services', 'areas', 'questions', 'blog']) {
  const base = join('src/content', dir);
  for (const f of readdirSync(base).filter((x) => x.endsWith('.md'))) {
    const slug = f.replace(/\.md$/, '');
    const path = dir === 'blog' ? `/blog/${slug}/` : `/${slug}/`;
    if (!existsSync(join(DIST, path, 'index.html'))) continue; // flagged off
    const fm = yaml.load(readFileSync(join(base, f), 'utf8').match(/^---\n([\s\S]*?)\n---/)[1]);
    keywords.set(path, fm.keyword);
  }
}
const rows = [...keywords].map(([path, kw]) => {
  const root = parse(readFileSync(join(DIST, path, 'index.html'), 'utf8'));
  return { path, kw, title: root.querySelector('title').text.trim(), h1: root.querySelector('h1').text.replace(/\s+/g, ' ').trim() };
});
const errors = [];
const seen = new Map();
for (const r of rows) {
  const k = norm(r.kw);
  if (seen.has(k)) errors.push(`"${r.kw}" is the primary keyword of both ${seen.get(k)} and ${r.path}`);
  seen.set(k, r.path);
}
for (const r of rows) for (const o of rows) {
  if (r === o) continue;
  const k = norm(r.kw), own = norm(o.kw);
  if (own.includes(k)) continue; // o targets a longer phrase that contains r's keyword
  const hay = ` ${norm(o.title.split(/\s[|–]\s/)[0])} | ${norm(o.h1)} `;
  if (new RegExp(`(^|\\s)${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`).test(hay)) errors.push(`${o.path} uses ${r.path}'s keyword "${r.kw}" in its title or H1`);
}
console.log('| Page | Primary keyword | Title | H1 |\n|---|---|---|---|');
for (const r of rows.sort((a, b) => a.path.localeCompare(b.path))) console.log(`| ${r.path} | ${r.kw} | ${r.title} | ${r.h1} |`);
if (errors.length) { console.log(`\n✗ ${errors.length} problem(s):\n${errors.map((e) => '  - ' + e).join('\n')}`); process.exit(1); }
console.log(`\n✓ ${rows.length} pages, each with its own primary keyword; no title or H1 targets another page's keyword.`);
