// Titles ≤ 60, descriptions ≤ 155, all unique; one H1 per built page; canonical present.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pages } from '../src/config/pages.ts';

test('fixed page meta lengths', () => {
  for (const [path, m] of Object.entries(pages)) {
    assert.ok(m.title.length <= 60, `${path} title ${m.title.length}: ${m.title}`);
    assert.ok(m.description.length <= 155, `${path} description ${m.description.length}`);
  }
});

const dist = new URL('../dist/', import.meta.url).pathname;
const decode = (s) => s?.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const htmlFiles = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? htmlFiles(p) : f.endsWith('.html') ? [p] : [];
});

test('built pages: one H1, unique titles and descriptions, canonical', { skip: !existsSync(dist) && 'run npm run build first' }, () => {
  const titles = new Map();
  const descs = new Map();
  for (const f of htmlFiles(dist)) {
    const html = readFileSync(f, 'utf8');
    const h1s = html.match(/<h1[\s>]/g) || [];
    assert.equal(h1s.length, 1, `${f} has ${h1s.length} H1s`);
    const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1]);
    const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1]);
    assert.ok(title && title.length <= 60, `${f} title: ${title}`);
    assert.ok(desc && desc.length <= 155, `${f} desc length ${desc?.length}`);
    assert.ok(!titles.has(title), `duplicate title ${title} in ${f} and ${titles.get(title)}`);
    assert.ok(!descs.has(desc), `duplicate description in ${f}`);
    titles.set(title, f);
    descs.set(desc, f);
    assert.match(html, /<link rel="canonical" href="https?:\/\/[^"]+\/"/, `${f} canonical`);
    assert.match(html, /<html lang="en-GB"/);
  }
});
