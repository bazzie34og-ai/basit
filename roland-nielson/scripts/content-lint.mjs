// Quick checks on the markdown in src/content/{services,areas,questions,blog} before a build:
// lengths, banned words, word counts and 8-word-shingle overlap between pages of the same kind.
// Usage: node scripts/content-lint.mjs [services|areas|questions|blog ...]   (default: all)
// The build-time checks (scripts/check-site.mjs, scripts/check-duplicates.mjs) are the source of truth.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import yaml from 'js-yaml';

const KINDS = process.argv.slice(2).length ? process.argv.slice(2) : ['services', 'areas', 'questions', 'blog'];
const BANNED = /\b(therap\w*|counsel(?:or|ors|ing)|treatment|certified|licensed|diagnos\w*|clinical|cure[sd]?)\b/gi;
const SCOPE_OK = new Set(['questions/life-coach-vs-therapist']); // pages that explain what coaching is not
// Page-specific words only; the templates add ~200 shared words (gap block, pricing, where we meet).
const WORDS = { services: [800, 1200], areas: [600, 900], questions: [900, 1300], blog: [900, 1300] };

const read = (kind) => {
  const dir = join('src/content', kind);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
    const raw = readFileSync(join(dir, f), 'utf8');
    const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!m) return { kind, id: basename(f, '.md'), error: 'no frontmatter' };
    let data;
    try { data = yaml.load(m[1]); } catch (e) { return { kind, id: basename(f, '.md'), error: `YAML: ${e.message.split('\n')[0]}` }; }
    return { kind, id: basename(f, '.md'), data, body: m[2] };
  });
};
// All human-readable text in a page's frontmatter + body (keys, URLs and slugs dropped).
const SKIP_KEYS = new Set(['slug', 'path', 'group', 'order', 'flag', 'related', 'areas', 'nearby', 'video', 'updated', 'published', 'keyword', 'seoTitle', 'description', 'ogHeadline']);
const textOf = (v, key = '') => {
  if (SKIP_KEYS.has(key)) return '';
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v.map((x) => textOf(x)).join(' ');
  if (v && typeof v === 'object') return Object.entries(v).map(([k, x]) => (k === 'slug' ? '' : textOf(x, k))).join(' ');
  return '';
};
const plain = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[#*_>`|-]+/g, ' ').replace(/\s+/g, ' ').trim();
const shingles = (s) => {
  const w = plain(s).toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i + 8 <= w.length; i++) set.add(w.slice(i, i + 8).join(' '));
  return set;
};

let problems = 0;
const report = (f, msg) => { problems++; console.log(`  ✗ ${f.kind}/${f.id}: ${msg}`); };
const all = [];
for (const kind of KINDS) {
  const files = read(kind);
  console.log(`\n${kind}: ${files.length} file(s)`);
  for (const f of files) {
    if (f.error) { report(f, f.error); continue; }
    const d = f.data;
    const text = plain(`${textOf(d)} ${f.body}`);
    const words = text.split(/\s+/).filter(Boolean).length;
    const [lo, hi] = WORDS[kind];
    if (words < lo || words > hi) report(f, `${words} words (target ${lo}–${hi})`);
    if (d.seoTitle && d.seoTitle.length > (kind === 'blog' ? 60 : 80)) report(f, `seoTitle ${d.seoTitle.length} chars`);
    if (d.description && (d.description.length < 140 || d.description.length > (kind === 'blog' ? 155 : 160))) report(f, `description ${d.description.length} chars (140–155)`);
    if (d.ogHeadline && d.ogHeadline.length > 60) report(f, `ogHeadline ${d.ogHeadline.length} chars (≤ 60)`);
    for (const q of d.faqs ?? []) {
      const n = plain(q.a).split(/\s+/).length;
      if (n < 40 || n > 80) report(f, `FAQ answer ${n} words (40–80): "${q.q}"`);
    }
    if (!SCOPE_OK.has(`${kind}/${f.id}`) && !d.scope) {
      const hits = [...`${textOf(d)} ${d.seoTitle ?? ''} ${d.description ?? ''} ${f.body}`.matchAll(BANNED)].map((m) => m[0]);
      if (hits.length) report(f, `banned words: ${[...new Set(hits)].join(', ')}`);
    }
    // Session hours belong on the booking page: flag clock times and day ranges ("Tue–Fri").
    const DAY = '(?:mon(?:day)?|tue(?:s|sday)?|wed(?:nesday)?|thu(?:rs|rsday)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?)';
    const timeRe = new RegExp(`\\b\\d{1,2}(:\\d\\d)?\\s?(am|pm|a\\.m\\.|p\\.m\\.)(?![a-z])|\\b${DAY}\\.?\\s?(–|-|to|through)\\s?${DAY}\\b`, 'i');
    if (timeRe.test(`${textOf(d)} ${f.body}`)) report(f, 'mentions session days or times (say "evenings and Saturdays")');
    console.log(`  · ${f.id}: ${words} words`);
    all.push({ ...f, sh: shingles(text) });
  }
}
// Overlap: services vs services/areas, areas vs areas.
const comparable = all.filter((f) => f.kind === 'services' || f.kind === 'areas');
const pairs = [];
for (let i = 0; i < comparable.length; i++) for (let j = i + 1; j < comparable.length; j++) {
  const a = comparable[i], b = comparable[j];
  let shared = 0; for (const s of a.sh) if (b.sh.has(s)) shared++;
  const pct = shared / Math.max(1, Math.min(a.sh.size, b.sh.size));
  pairs.push({ a: `${a.kind}/${a.id}`, b: `${b.kind}/${b.id}`, pct });
}
pairs.sort((x, y) => y.pct - x.pct);
if (pairs.length) {
  console.log('\nHighest overlap (8-word shingles, share of the smaller page):');
  for (const p of pairs.slice(0, 5)) console.log(`  ${(p.pct * 100).toFixed(1).padStart(5)}%  ${p.a} ↔ ${p.b}`);
  for (const p of pairs.filter((x) => x.pct > 0.1)) { problems++; console.log(`  ✗ overlap ${(p.pct * 100).toFixed(1)}% > 10% lint limit: ${p.a} ↔ ${p.b}`); }
}
console.log(problems ? `\n${problems} problem(s).` : '\n✓ Content lint passed.');
process.exit(problems ? 1 : 0);
