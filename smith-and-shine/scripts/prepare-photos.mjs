// Copies Chris's photos from assets/photos-original into src/assets/photos,
// blurring number plates and house numbers first. Astro then makes the
// AVIF/WebP sizes at build time. Run once after adding new photos:
//   npm run photos
import sharp from 'sharp';
import { readdir, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';

const SRC = process.env.PHOTOS_SRC || 'assets/photos-original';
const OUT = 'src/assets/photos';

// [left, top, width, height] in original pixels
const BLUR = {
  // partial plate on the S5 and a readable plate on the blue car behind
  'audi-s5-cabriolet-grey-detail.jpg': [[628, 305, 92, 95], [0, 55, 48, 34]],
  // house numbers on wheelie bins (customer privacy)
  'ford-focus-rs-smith-and-shine-plate.jpg': [[80, 360, 40, 60], [155, 360, 35, 40]],
  'jaguar-xe-red-gloss-detail.jpg': [[360, 228, 40, 40]],
};

// [left, top, width, height] to keep, for photos with screenshot borders
const CROP = {
  'ford-focus-rs-smith-and-shine-plate.jpg': [20, 0, 718, 1143],
};

await mkdir(OUT, { recursive: true });
for (const file of await readdir(SRC)) {
  if (!/\.jpe?g$/i.test(file)) continue;
  const input = path.join(SRC, file);
  const output = path.join(OUT, file);
  const regions = BLUR[file];
  const crop = CROP[file];
  if (!regions && !crop) { await copyFile(input, output); continue; }
  const img = sharp(input);
  const meta = await img.metadata();
  const patches = [];
  for (const [left, top, w, h] of regions ?? []) {
    const width = Math.min(w, meta.width - left);
    const height = Math.min(h, meta.height - top);
    const patch = await sharp(input).extract({ left, top, width, height }).blur(14).toBuffer();
    patches.push({ input: patch, left, top });
  }
  const done = await img.composite(patches).jpeg({ quality: 92 }).toBuffer();
  const out = crop ? sharp(done).extract({ left: crop[0], top: crop[1], width: crop[2], height: crop[3] }) : sharp(done);
  await out.jpeg({ quality: 90 }).toFile(output);
  console.log(regions ? 'blurred' : 'cropped', file);
}
