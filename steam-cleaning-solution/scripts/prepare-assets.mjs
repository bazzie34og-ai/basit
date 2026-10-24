// Prepares client assets for the build.
//  - Copies photos from /assets/photos into src/assets/photos (astro:assets makes AVIF/WebP).
//  - Splits before/after composites by DETECTING the white gutter (never a guessed midpoint).
//  - Copies the two logo cut-outs into src/assets/logos.
//  - Renders the favicon set from public/favicon.svg.
// Missing files are reported, never faked: pages show an honest "photo to come" plate instead.
import { readdir, mkdir, copyFile, readFile, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC_PHOTOS = path.join(root, 'assets/photos');
const SRC_LOGOS = path.join(root, 'assets/logos');
const OUT_PHOTOS = path.join(root, 'src/assets/photos');
const OUT_LOGOS = path.join(root, 'src/assets/logos');
const PUBLIC = path.join(root, 'public');

/** Composites and how they are laid out. */
export const COMPOSITES = {
  'hallway-carpet-before-after.jpg': { layout: 'lr', out: ['hallway-carpet-before', 'hallway-carpet-after'] },
  'patio-path-before-after.jpg': { layout: 'lr', out: ['patio-path-before', 'patio-path-after'] },
  'skylight-glass-before-after.jpg': { layout: 'tb', out: ['skylight-glass-before', 'skylight-glass-after'] },
  // 2×2 grid: left column before, right column after → two pairs
  'stairs-carpet-before-after.jpg': {
    layout: 'grid',
    out: ['stairs-carpet-1-before', 'stairs-carpet-1-after', 'stairs-carpet-2-before', 'stairs-carpet-2-after'],
  },
};

const WHITE = 232; // a gutter pixel is at least this bright on every channel
const COVER = 0.96; // share of a line that must be white to count as gutter

/** Returns [start, end) of the white run nearest the centre on one axis, or null. */
export function findGutter(data, width, height, channels, axis) {
  const len = axis === 'x' ? width : height;
  const across = axis === 'x' ? height : width;
  const white = new Array(len).fill(false);
  for (let i = 0; i < len; i++) {
    let count = 0;
    for (let j = 0; j < across; j++) {
      const x = axis === 'x' ? i : j;
      const y = axis === 'x' ? j : i;
      const o = (y * width + x) * channels;
      if (data[o] >= WHITE && data[o + 1] >= WHITE && data[o + 2] >= WHITE) count++;
    }
    white[i] = count / across >= COVER;
  }
  const runs = [];
  let s = -1;
  for (let i = 0; i <= len; i++) {
    if (i < len && white[i]) { if (s < 0) s = i; }
    else if (s >= 0) { runs.push([s, i]); s = -1; }
  }
  // Only interior runs (not touching an edge) between 20% and 80% of the axis
  const mid = len / 2;
  const interior = runs.filter(([a, b]) => a > 0 && b < len && a > len * 0.2 && b < len * 0.8 && b - a >= 2);
  if (!interior.length) return null;
  interior.sort((r1, r2) => Math.abs((r1[0] + r1[1]) / 2 - mid) - Math.abs((r2[0] + r2[1]) / 2 - mid));
  return interior[0];
}

async function trimWhite(buf) {
  try { return await sharp(buf).trim({ background: '#ffffff', threshold: 20 }).toBuffer(); }
  catch { return buf; }
}

async function crop(file, rect) {
  const b = await sharp(file).extract(rect).jpeg({ quality: 92, mozjpeg: true }).toBuffer();
  return trimWhite(b);
}

async function splitComposite(file, spec) {
  const img = sharp(file).removeAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels } = info;
  const parts = [];
  if (spec.layout === 'lr' || spec.layout === 'tb') {
    const axis = spec.layout === 'lr' ? 'x' : 'y';
    const g = findGutter(data, W, H, channels, axis);
    if (!g) throw new Error(`no white gutter found in ${path.basename(file)}`);
    if (axis === 'x') {
      parts.push({ left: 0, top: 0, width: g[0], height: H }, { left: g[1], top: 0, width: W - g[1], height: H });
    } else {
      parts.push({ left: 0, top: 0, width: W, height: g[0] }, { left: 0, top: g[1], width: W, height: H - g[1] });
    }
  } else {
    const gx = findGutter(data, W, H, channels, 'x');
    const gy = findGutter(data, W, H, channels, 'y');
    if (!gx || !gy) throw new Error(`grid gutters not found in ${path.basename(file)}`);
    const L = { left: 0, width: gx[0] }, R = { left: gx[1], width: W - gx[1] };
    const T = { top: 0, height: gy[0] }, B = { top: gy[1], height: H - gy[1] };
    // pair 1 = top row (before left, after right), pair 2 = bottom row
    parts.push({ ...L, ...T }, { ...R, ...T }, { ...L, ...B }, { ...R, ...B });
  }
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    const buf = await crop(file, parts[i]);
    const dest = path.join(OUT_PHOTOS, `${spec.out[i]}.jpg`);
    await writeFile(dest, buf);
    out.push(dest);
  }
  return out;
}

async function newer(src, dest) {
  if (!existsSync(dest)) return true;
  return (await stat(src)).mtimeMs > (await stat(dest)).mtimeMs;
}

async function photos() {
  await mkdir(OUT_PHOTOS, { recursive: true });
  if (!existsSync(SRC_PHOTOS)) return console.warn('[assets] /assets/photos missing');
  const files = (await readdir(SRC_PHOTOS)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  if (!files.length) console.warn('[assets] no photos in /assets/photos yet: pages will show "photo to come" plates');
  for (const f of files) {
    const src = path.join(SRC_PHOTOS, f);
    const spec = COMPOSITES[f];
    if (spec) {
      const first = path.join(OUT_PHOTOS, `${spec.out[0]}.jpg`);
      if (!(await newer(src, first))) continue;
      try {
        const out = await splitComposite(src, spec);
        console.log(`[assets] split ${f} → ${out.map((o) => path.basename(o)).join(', ')}`);
      } catch (e) {
        console.error(`[assets] ${e.message}. Not split; check the composite by hand.`);
      }
    } else {
      const dest = path.join(OUT_PHOTOS, f.toLowerCase().replace(/\.jpeg$/, '.jpg'));
      if (await newer(src, dest)) await copyFile(src, dest);
    }
  }
}

async function logos() {
  await mkdir(OUT_LOGOS, { recursive: true });
  for (const f of ['logo-script-forest-transparent.png', 'logo-script-cream-transparent.png']) {
    const src = path.join(SRC_LOGOS, f);
    if (existsSync(src)) await copyFile(src, path.join(OUT_LOGOS, f));
    else console.warn(`[assets] logo missing: assets/logos/${f} (type-only wordmark used instead)`);
  }
}

async function favicons() {
  const svg = await readFile(path.join(PUBLIC, 'favicon.svg'));
  const linenBg = { r: 0xf4, g: 0xf1, b: 0xe8, alpha: 1 };
  await sharp(svg, { density: 384 }).resize(32, 32).png().toFile(path.join(PUBLIC, 'favicon-32.png'));
  await sharp(svg, { density: 768 }).resize(140, 140).extend({ top: 20, bottom: 20, left: 20, right: 20, background: linenBg })
    .flatten({ background: linenBg }).png().toFile(path.join(PUBLIC, 'apple-touch-icon.png'));
  for (const s of [192, 512]) {
    const pad = Math.round(s * 0.14);
    await sharp(svg, { density: 1200 }).resize(s - pad * 2, s - pad * 2)
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: linenBg })
      .flatten({ background: linenBg }).png().toFile(path.join(PUBLIC, `icon-${s}.png`));
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  await photos();
  await logos();
  await favicons();
}
