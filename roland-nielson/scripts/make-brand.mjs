// Builds the "R." monogram, wordmark, favicon set and touch icons from the brand fonts.
// Text is converted to outlines, so the SVGs render the same everywhere.
// Run with: npm run brand
import satori from 'satori';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const fraunces = readFileSync('node_modules/@fontsource/fraunces/files/fraunces-latin-600-normal.woff');
const manrope = readFileSync('node_modules/@fontsource/manrope/files/manrope-latin-700-normal.woff');
const fonts = [
  { name: 'Fraunces', data: fraunces, weight: 600, style: 'normal' },
  { name: 'Manrope', data: manrope, weight: 700, style: 'normal' },
];
const NAVY = '#13294A', SLATE = '#3B5F86', BONE = '#F5F1EA', INK = '#0E1B2C';
const h = (type, style, children) => ({ type, props: { style, children } });

const mark = (color = NAVY, size = 120) =>
  h('div', { display: 'flex', alignItems: 'flex-end', fontFamily: 'Fraunces', fontSize: size, lineHeight: 1, color }, [
    h('span', {}, 'R'),
    h('div', { width: size * 0.17, height: size * 0.17, borderRadius: 999, background: SLATE, marginLeft: size * 0.03, marginBottom: size * 0.17 }, []),
  ]);

const render = (node, width, height) => satori(node, { width, height, fonts });
mkdirSync('public', { recursive: true });
mkdirSync('src/assets/brand', { recursive: true });

// Monogram alone (transparent) — header, footer.
const markSvg = await render(h('div', { display: 'flex', width: 100, height: 100, alignItems: 'center', justifyContent: 'center' }, [mark(NAVY, 100)]), 100, 100);
writeFileSync('src/assets/brand/logo-mark.svg', markSvg);
const markLight = await render(h('div', { display: 'flex', width: 100, height: 100, alignItems: 'center', justifyContent: 'center' }, [mark(BONE, 100)]), 100, 100);
writeFileSync('src/assets/brand/logo-mark-light.svg', markLight);

// Full logo: monogram + ROLAND NIELSON wordmark.
const full = await render(
  h('div', { display: 'flex', alignItems: 'center', width: 640, height: 140, gap: 26 }, [
    mark(NAVY, 120),
    h('div', { display: 'flex', fontFamily: 'Manrope', fontSize: 40, letterSpacing: 9, color: NAVY }, 'ROLAND NIELSON'),
  ]),
  640, 140,
);
writeFileSync('public/logo.svg', full);

// Favicon: monogram on a bone tile.
const tile = (size, radius) =>
  h('div', { display: 'flex', width: size, height: size, background: BONE, borderRadius: radius, alignItems: 'center', justifyContent: 'center', paddingBottom: size * 0.04 }, [mark(NAVY, size * 0.78)]);
const favSvg = await render(tile(64, 14), 64, 64);
writeFileSync('public/favicon.svg', favSvg);

const png = (svg, size) => sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png().toBuffer();
const squareTile = await render(tile(512, 0), 512, 512);
writeFileSync('public/apple-touch-icon.png', await png(squareTile, 180));
writeFileSync('public/icon-192.png', await png(squareTile, 192));
writeFileSync('public/icon-512.png', await png(squareTile, 512));
// Maskable: extra safe-zone padding on an ink background.
const maskable = await render(
  h('div', { display: 'flex', width: 512, height: 512, background: INK, alignItems: 'center', justifyContent: 'center' }, [mark(BONE, 280)]),
  512, 512,
);
writeFileSync('public/icon-maskable-512.png', await png(maskable, 512));
const logoPng = await sharp(Buffer.from(full), { density: 300 }).resize(640).png().toBuffer();
writeFileSync('public/logo.png', logoPng);

// favicon.ico with 16/32/48 PNG entries.
const sizes = [16, 32, 48];
const imgs = await Promise.all(sizes.map((s) => png(favSvg, s)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const o = 6 + 16 * i;
  header.writeUInt8(s, o); header.writeUInt8(s, o + 1); header.writeUInt8(0, o + 2); header.writeUInt8(0, o + 3);
  header.writeUInt16LE(1, o + 4); header.writeUInt16LE(32, o + 6);
  header.writeUInt32LE(imgs[i].length, o + 8); header.writeUInt32LE(offset, o + 12);
  offset += imgs[i].length;
});
writeFileSync('public/favicon.ico', Buffer.concat([header, ...imgs]));
console.log('Brand assets written.');
