// Audits the built site in dist/ (run `npm run build` first).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const pages: { url: string; html: string }[] = [];
function walk(d: string) {
  for (const f of readdirSync(d)) {
    const p = path.join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f === 'index.html' || f === '404.html') pages.push({ url: '/' + path.relative(dist, p).replace(/index\.html$|\.html$/, ''), html: readFileSync(p, 'utf8') });
  }
}
if (existsSync(dist)) walk(dist);
const get = (html: string, re: RegExp) => html.match(re)?.[1] ?? '';
const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = (html: string) => decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');

const BANNED = ['welcome to', 'elevate', 'unleash', 'seamless', 'top-notch', 'look no further', 'we pride ourselves', 'second to none', 'one-stop shop', 'experience the difference', 'transform your', 'nestled', 'cutting-edge', 'state-of-the-art', 'unparalleled', 'game-changer', 'meticulous attention to detail', 'sparkling clean', 'spotless guarantee', 'your satisfaction is our priority', "we've got you covered", 'we’ve got you covered', '1000+', 'happy homes'];

test('dist exists', () => assert.ok(pages.length > 25, `found ${pages.length} pages`));

test('unique titles ≤ 60, descriptions ≤ 155, one H1, canonical', () => {
  const titles = new Set<string>();
  for (const p of pages) {
    const t = decode(get(p.html, /<title>([^<]*)<\/title>/));
    const d = decode(get(p.html, /<meta name="description" content="([^"]*)"/));
    assert.ok(t && t.length <= 60, `${p.url} title ${t.length}: ${t}`);
    assert.ok(d && d.length <= 155, `${p.url} description ${d.length}`);
    assert.ok(!titles.has(t), `duplicate title ${t}`);
    titles.add(t);
    assert.equal((p.html.match(/<h1[\s>]/g) || []).length, 1, `${p.url} H1 count`);
    assert.match(p.html, /<link rel="canonical" href="https:\/\/[^"]+\/"/, `${p.url} canonical`);
    assert.match(p.html, /<html lang="en-GB"/);
  }
});

test('no banned phrases, no invented germ or rating claims', () => {
  for (const p of pages) {
    const body = text(p.html).toLowerCase();
    for (const b of BANNED) assert.ok(!body.includes(b), `${p.url} contains "${b}"`);
    assert.ok(!/kills 99/.test(body), `${p.url} germ claim`);
    assert.ok(!/AggregateRating|"Review"/.test(p.html), `${p.url} rating schema`);
  }
});

test('JSON-LD parses; FAQPage matches visible text; breadcrumbs on inner pages', () => {
  for (const p of pages) {
    const blocks = [...p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    assert.equal(blocks.length, 1, p.url);
    const graph = blocks[0]['@graph'] as any[];
    assert.ok(graph.some((n) => n['@type'] === 'HousekeepingService'), p.url);
    const visible = text(p.html);
    for (const faq of graph.filter((n) => n['@type'] === 'FAQPage')) {
      for (const q of faq.mainEntity) {
        assert.ok(visible.includes(q.name), `${p.url} FAQ q not visible: ${q.name}`);
        assert.ok(visible.includes(q.acceptedAnswer.text), `${p.url} FAQ a not visible: ${q.name}`);
      }
    }
    if (p.url !== '/' && !/404/.test(p.url) && !/thank-you/.test(p.url)) assert.ok(graph.some((n) => n['@type'] === 'BreadcrumbList'), `${p.url} breadcrumbs`);
  }
});

test('NAP identical in every footer; tel uses config number', () => {
  for (const p of pages) {
    const footer = get(p.html, /<footer class="site-footer[^"]*"[^>]*>([\s\S]*?)<\/footer>/);
    assert.match(footer, /Steam Cleaning Solution LTD/, p.url);
    assert.match(footer, /Carpet, upholstery &amp; deep cleaning · Cardiff &amp; Newport/, p.url);
    assert.match(footer, /07506 285260/, p.url);
    assert.match(footer, /07480 267434/, p.url);
    for (const m of p.html.matchAll(/href="tel:([^"]+)"/g)) assert.equal(m[1], '+447506285260', p.url);
  }
});

test('WhatsApp pre-fill differs per service page', () => {
  const seen = new Set<string>();
  for (const p of pages.filter((p) => /cleaning|removal/.test(p.url) && !p.url.startsWith('/guides') && !p.url.startsWith('/areas'))) {
    const wa = get(p.html, /class="mbar__btn mbar__btn--wa" href="([^"]+)"/);
    assert.ok(wa.startsWith('https://wa.me/447480267434?text='), p.url);
    assert.ok(!seen.has(wa), `${p.url} WhatsApp text not unique`);
    seen.add(wa);
  }
  assert.ok(seen.size >= 8);
});

test('area pages have ≥ 350 words of main copy', () => {
  for (const p of pages.filter((p) => /^\/areas\/[a-z]+\/$/.test(p.url) || p.url === '/newport/')) {
    const main = get(p.html, /<section class="area"[^>]*>([\s\S]*?)<\/section>/) + get(p.html, /<section class="phead[^"]*"[^>]*>([\s\S]*?)<\/section>/);
    const n = text(main).split(' ').filter(Boolean).length;
    assert.ok(n >= 350, `${p.url} has ${n} words`);
  }
});

test('preview mode: noindex + ribbon + disallow-all', () => {
  if ((process.env.PREVIEW_MODE ?? 'true') === 'false') return;
  for (const p of pages) {
    assert.match(p.html, /<meta name="robots" content="noindex, nofollow"/, p.url);
    assert.match(p.html, /Preview prepared for Steam Cleaning Solution LTD by Abdul Basit · Primo Partners/, p.url);
  }
  assert.match(readFileSync(path.join(dist, 'robots.txt'), 'utf8'), /Disallow: \/\n/);
});

test('sitemap excludes thank-you', () => {
  const sm = readdirSync(dist).filter((f) => f.startsWith('sitemap-') && f !== 'sitemap-index.xml').map((f) => readFileSync(path.join(dist, f), 'utf8')).join('');
  assert.ok(sm.includes('/carpet-cleaning-cardiff/'));
  assert.ok(!sm.includes('thank-you'));
  assert.ok(!sm.includes('404'));
});
