// Generates optimized, descriptively named images from assets-src/ into public/.
// Run: npm run assets   (re-run after replacing the logo or John's photo)
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const src = 'assets-src';
const out = 'public/img';
mkdirSync(out, { recursive: true });

const logo = `${src}/logos/lacaze_logo_luxe_horizontal_dark.png`;
const icon = `${src}/logos/lacaze_icon.png`;
const photo = `${src}/photos/john-lacaze-jr-owner.jpg`;

// Logo (header 44px tall -> 1x/2x/3x), plus PNG for schema/OG
for (const h of [48, 96, 144]) {
  await sharp(logo).resize({ height: h }).webp({ quality: 92 }).toFile(`${out}/lacaze-roadside-assistance-logo-${h}.webp`);
}
await sharp(logo).resize({ width: 800 }).png({ compressionLevel: 9 }).toFile(`${out}/lacaze-roadside-assistance-logo.png`);

// Icons
const trimmedIcon = sharp(icon).trim();
const iconBuf = await trimmedIcon.png().toBuffer();
for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  const pad = name === 'apple-touch-icon.png' || name.startsWith('icon-') ? Math.round(size * 0.08) : 0;
  const inner = size - pad * 2;
  const img = await sharp(iconBuf).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: name === 'favicon-32.png' ? { r: 0, g: 0, b: 0, alpha: 0 } : { r: 11, g: 13, b: 14, alpha: 1 } } })
    .composite([{ input: img, left: pad, top: pad }]).png().toFile(`public/${name}`);
}

// Owner photo (never altered — resize/encode only)
for (const w of [480, 720]) {
  await sharp(photo).resize({ width: w }).webp({ quality: 80 }).toFile(`${out}/john-lacaze-jr-owner-${w}.webp`);
  await sharp(photo).resize({ width: w }).avif({ quality: 55 }).toFile(`${out}/john-lacaze-jr-owner-${w}.avif`);
}
await sharp(photo).resize({ width: 720 }).jpeg({ quality: 82 }).toFile(`${out}/john-lacaze-jr-owner.jpg`);
console.log('assets built');
