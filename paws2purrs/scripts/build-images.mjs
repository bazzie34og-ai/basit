// Generates responsive AVIF/WebP/JPEG photos with SEO-friendly names, app icons,
// logo fallbacks and the 1200x630 OG image. Runs before every dev/build.
import sharp from 'sharp';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'assets-src');
const OUT = path.join(root, 'public', 'images');
const WIDTHS = [360, 540, 720];

const photos = JSON.parse(await readFile(path.join(root, 'src/data/photos.json'), 'utf8'));
await mkdir(OUT, { recursive: true });
await mkdir(path.join(root, 'public', 'icons'), { recursive: true });

const exists = (p) => access(p).then(() => true, () => false);
const dims = {};

for (const [key, p] of Object.entries(photos)) {
  let img = sharp(path.join(SRC, 'photos', p.file)).rotate();
  const meta = await img.metadata();
  let { width, height } = meta;
  if (p.crop?.top) {
    img = img.extract({ left: 0, top: p.crop.top, width, height: height - p.crop.top });
    height -= p.crop.top;
  }
  const buf = await img.toBuffer();
  const widths = [...new Set(WIDTHS.map((w) => Math.min(w, width)))];
  for (const w of widths) {
    const base = path.join(OUT, `${p.slug}-${w}`);
    if (await exists(`${base}.avif`)) continue;
    const r = sharp(buf).resize({ width: w });
    await r.clone().avif({ quality: 52, effort: 5 }).toFile(`${base}.avif`);
    await r.clone().webp({ quality: 74 }).toFile(`${base}.webp`);
    if (w === widths[widths.length - 1]) await r.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(`${base}.jpg`);
  }
  dims[key] = { width, height, widths };
}
await writeFile(path.join(root, 'src/data/photo-dims.json'), JSON.stringify(dims, null, 2));

// App icons + logo fallbacks
const icon = path.join(SRC, 'logos', 'paws2purrs_icon_1024.png');
for (const s of [32, 180, 192, 512]) {
  await sharp(icon).resize(s, s).png().toFile(path.join(root, 'public', 'icons', `icon-${s}.png`));
}
for (const name of ['horizontal_on-light', 'horizontal_on-dark', 'stacked_on-light', 'stacked_on-dark']) {
  await sharp(path.join(SRC, 'logos', `paws2purrs_logo_${name}.png`))
    .resize({ width: 640 })
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(root, 'public', 'images', `paws-2-purrs-logo-${name}.png`));
}

// OG image: cream background, stacked logo left, hero photo in an arch on the right
const W = 1200, H = 630;
const archW = 400, archH = 520, archX = 720, archY = 55;
const archPath = `M0,${archW / 2} A${archW / 2},${archW / 2} 0 0 1 ${archW},${archW / 2} L${archW},${archH} L0,${archH} Z`;
const heroArch = await sharp(path.join(SRC, 'photos', photos.hero.file))
  .resize(archW, archH, { fit: 'cover', position: 'centre' })
  .composite([{ input: Buffer.from(`<svg width="${archW}" height="${archH}"><path d="${archPath}" fill="#fff"/></svg>`), blend: 'dest-in' }])
  .png().toBuffer();
const ring = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#F7F2E8"/>
  <rect x="0" y="${H - 14}" width="${W}" height="14" fill="#20372A"/>
  <g transform="translate(${archX - 14},${archY - 14})"><path d="M0,${archW / 2 + 14} A${archW / 2 + 14},${archW / 2 + 14} 0 0 1 ${archW + 28},${archW / 2 + 14} L${archW + 28},${archH + 28} L0,${archH + 28} Z" fill="none" stroke="#D4913A" stroke-width="2"/></g>
</svg>`);
const logo = await sharp(path.join(SRC, 'logos', 'paws2purrs_logo_stacked_on-light.png')).resize({ width: 560 }).toBuffer();
const logoMeta = await sharp(logo).metadata();
await sharp(ring)
  .composite([
    { input: logo, left: 90, top: Math.round((H - logoMeta.height) / 2) - 6 },
    { input: heroArch, left: archX, top: archY },
  ])
  .jpeg({ quality: 84 })
  .toFile(path.join(OUT, 'og-paws-2-purrs-dog-daycare-arnold.jpg'));

console.log(`images: ${Object.keys(dims).length} photos processed`);
