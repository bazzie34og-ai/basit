// Crops the BEFORE and AFTER panels out of each supplied composite photo
// (1080x1080, panels at x 18–533 and 547–1062) for the drag slider.
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
const dir = new URL('../src/assets/photos/', import.meta.url).pathname;
for (const f of readdirSync(dir).filter((f) => f.endsWith('-before-after.jpg'))) {
  const base = f.replace('-before-after.jpg', '');
  await sharp(dir + f).extract({ left: 18, top: 18, width: 515, height: 957 }).jpeg({ quality: 88 }).toFile(`${dir}${base}-before.jpg`);
  await sharp(dir + f).extract({ left: 547, top: 18, width: 515, height: 957 }).jpeg({ quality: 88 }).toFile(`${dir}${base}-after.jpg`);
}
