// 1200×630 OG cards for every built page: linen ground, forest serif title,
// the wand-line strip and the logo (or the type wordmark until the logo file arrives).
import { readFile, readdir, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import opentype from 'opentype.js';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dist = path.join(root, 'dist');
const fontDir = path.join(root, 'node_modules/@fontsource');
const serif = opentype.parse((await readFile(path.join(fontDir, 'instrument-serif/files/instrument-serif-latin-400-normal.woff'))).buffer);
const sans = opentype.parse((await readFile(path.join(fontDir, 'hanken-grotesk/files/hanken-grotesk-latin-600-normal.woff'))).buffer);

function wrap(font, text, size, max) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (font.getAdvanceWidth(t, size) > max && line) { lines.push(line); line = w; } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}
const pathD = (font, text, x, y, size, opts) => font.getPath(text, x, y, size, opts).toPathData(1);

function wand(y, h, width) {
  let d = '';
  let x = -20, i = 0;
  while (x < width + 20) {
    const bow = h * (0.24 + ((i * 37) % 10) / 120);
    d += `M${x} ${y + 3}C${x + bow} ${y + h * 0.32} ${x + bow} ${y + h * 0.68} ${x} ${y + h - 3}`;
    x += h * 0.3 * (0.9 + ((i * 53) % 10) / 50);
    i++;
  }
  return d;
}

async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name === 'index.html') yield p;
  }
}

const logoPng = path.join(root, 'src/assets/logos/logo-script-forest-transparent.png');
const logo = existsSync(logoPng) ? await sharp(logoPng).resize({ width: 260 }).png().toBuffer() : null;

let n = 0;
for await (const file of htmlFiles(dist)) {
  const html = await readFile(file, 'utf8');
  const img = html.match(/<meta property="og:image" content="[^"]*?(\/og\/[^"]+\.png)"/)?.[1];
  const title = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1]?.replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, '’').replace(/&quot;/g, '"');
  if (!img || !title) continue;
  const out = path.join(dist, img);
  const clean = title.replace(/\s*\|.*$/, '');
  const size = clean.length > 42 ? 76 : 92;
  const lines = wrap(serif, clean, size, 1000).slice(0, 3);
  const top = 300 - (lines.length - 1) * size * 0.55;
  const titlePaths = lines.map((l, i) => `<path d="${pathD(serif, l, 96, top + i * size * 1.02, size)}" fill="#124932"/>`).join('');
  const label = 'CARPETS · SOFAS · MATTRESSES · CARDIFF & NEWPORT';
  const labelPath = pathD(sans, label, 96, 130, 20, { letterSpacing: 0.14 });
  const word = logo ? '' : `<path d="${pathD(serif, 'Steam Cleaning Solution', 96, 560, 40)}" fill="#13201A"/><path d="M1060 560l18-16 18 16M1086 553v-10h4v13" fill="none" stroke="#124932" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#F4F1E8"/>
<rect x="24" y="24" width="1152" height="582" fill="none" stroke="#B98B5E" stroke-width="1.5"/>
<path d="${labelPath}" fill="#56645B"/>
${titlePaths}
<path d="${wand(470, 44, 1200)}" fill="none" stroke="#BEC9BB" stroke-width="2" stroke-linecap="round"/>
${word}
<path d="M1120 92c-.6-.4-9-6-9-11.5 0-3 2.3-5.2 5-5.2 1.7 0 3.2.9 4 2.3.8-1.4 2.3-2.3 4-2.3 2.7 0 5 2.2 5 5.2 0 5.5-8.4 11.1-9 11.5z" fill="#A8894A"/>
</svg>`;
  await mkdir(path.dirname(out), { recursive: true });
  let pipe = sharp(Buffer.from(svg));
  if (logo) pipe = pipe.composite([{ input: logo, left: 96, top: 520 }]);
  await pipe.png({ compressionLevel: 9, palette: true }).toFile(out);
  n++;
}
console.log(`[og] ${n} cards written`);
