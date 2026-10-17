/**
 * 1200×630 Open Graph images, generated at build time: black, hex lattice,
 * the dP mark, the page H1 and "From $990 · 12-year warranty".
 * Text is converted to SVG paths with opentype.js so no system fonts are needed.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import sharp from 'sharp';
import opentype from 'opentype.js';
import { routes, ogSlug } from '../../config/routes';
import { business, money, priceFrom, warrantyYears } from '../../config/site';
import { fill } from '../../lib/tokens';

const require = createRequire(import.meta.url);

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = Object.values(routes).map((r) => ({ slug: ogSlug(r.path), h1: r.h1 }));
  const guides = (await getCollection('guides')).map((g) => ({ slug: ogSlug(`/guides/${g.id}/`), h1: fill(g.data.h1) }));
  return [...pages, ...guides].map((p) => ({ params: { slug: p.slug }, props: { h1: p.h1 } }));
};

let fonts: Promise<[opentype.Font, opentype.Font]> | null = null;
const loadFonts = () =>
  (fonts ??= Promise.all([
    readFile(require.resolve('@fontsource/saira-condensed/files/saira-condensed-latin-800-normal.woff')),
    readFile(require.resolve('@fontsource/inter/files/inter-latin-600-normal.woff')),
  ]).then(([a, b]) => [opentype.parse(a.buffer.slice(a.byteOffset, a.byteOffset + a.byteLength)), opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength))]));

let markPng: Promise<Buffer> | null = null;
const loadMark = () =>
  (markPng ??= readFile(path.join(process.cwd(), 'src/assets/logos/diamond-plate-dp-mark-transparent.png')).then((b) =>
    sharp(b).resize({ height: 52 }).png().toBuffer(),
  ));

/** opentype's toPathData() can emit NaN when rounding; serialise commands ourselves. */
const n = (v: number) => (Math.round(v * 10) / 10).toString();
const serialise = (p: opentype.Path) =>
  p.commands
    .map((c: any) =>
      c.type === 'M' || c.type === 'L' ? `${c.type}${n(c.x)} ${n(c.y)}`
      : c.type === 'Q' ? `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`
      : c.type === 'C' ? `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`
      : 'Z')
    .join('');

/** Glyph-by-glyph layout with kerning (avoids opentype.js GSUB gaps in some fonts). */
function layout(font: opentype.Font, text: string, x: number, y: number, size: number, ls = 0) {
  const scale = size / font.unitsPerEm;
  let d = '';
  let prev: opentype.Glyph | null = null;
  for (const ch of text) {
    const g = font.charToGlyph(ch);
    if (prev) x += font.getKerningValue(prev, g) * scale;
    d += serialise(g.getPath(x, y, size));
    x += (g.advanceWidth ?? 0) * scale + ls * size;
    prev = g;
  }
  return { d, width: x };
}
const measure = (font: opentype.Font, text: string, size: number, ls = 0) => layout(font, text, 0, 0, size, ls).width;

function wrap(font: opentype.Font, text: string, size: number, max: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (measure(font, test, size, 0.02) > max && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function hexPattern() {
  const s = 34, W = Math.sqrt(3) * s;
  const hex = (cx: number, cy: number) =>
    'M' + [0, 1, 2, 3, 4, 5].map((i) => { const a = (Math.PI / 180) * (60 * i - 90); return `${(cx + s * Math.cos(a)).toFixed(1)} ${(cy + s * Math.sin(a)).toFixed(1)}`; }).join('L') + 'Z';
  let d = '';
  for (let row = -1; row < 9; row++) for (let col = -1; col < 22; col++) d += hex(col * W + (row % 2 ? W / 2 : 0), row * 1.5 * s);
  return d;
}

export const GET: APIRoute = async ({ props }) => {
  const [display, body] = await loadFonts();
  const h1 = String(props.h1).toUpperCase();
  let size = 92;
  let lines = wrap(display, h1, size, 1010);
  while (lines.length > 3 && size > 56) { size -= 6; lines = wrap(display, h1, size, 1010); }
  const lh = size * 1.02;
  const top = 250;
  const titlePaths = lines.map((l, i) => layout(display, l, 96, top + i * lh, size, 0.02).d).join('');
  const subtitle = `From ${money(priceFrom)} · ${warrantyYears}-year warranty`;
  const subPath = layout(body, subtitle, 96, top + lines.length * lh + 40, 34).d;
  const brandPath = layout(display, 'DIAMOND PLATE', 232, 138, 40, 0.04).d;
  const tagPath = layout(body, 'CERAMIC COATING · BRISBANE', 234, 160, 15, 0.22).d;
  const phonePath = layout(body, business.phone.display, 96, 575, 26).d;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="0.18"><stop offset="0" stop-color="#1F5BFF"/><stop offset=".5" stop-color="#38C8FF"/><stop offset="1" stop-color="#1F5BFF"/></linearGradient>
    <radialGradient id="m" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 0) scale(900 700)"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".6" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <mask id="mk"><rect width="1200" height="630" fill="url(#m)"/></mask>
    <radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#38C8FF" stop-opacity=".9"/><stop offset="1" stop-color="#38C8FF" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#05070B"/>
  <path d="${hexPattern()}" fill="none" stroke="#F3F6FA" stroke-opacity=".08" stroke-width="1.6" mask="url(#mk)"/>
  <ellipse cx="1150" cy="300" rx="16" ry="120" fill="url(#glow)"/>
  <path d="${brandPath}" fill="#F3F6FA"/>
  <path d="${tagPath}" fill="#C7D2E0"/>
  <path d="${titlePaths}" fill="#F3F6FA"/>
  <path d="${subPath}" fill="url(#g)"/>
  <rect x="96" y="530" width="140" height="3" fill="url(#g)"/>
  <path d="${phonePath}" fill="#C7D2E0"/>
</svg>`;

  const png = await sharp(Buffer.from(svg))
    .composite([{ input: await loadMark(), left: 96, top: 104 }])
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
