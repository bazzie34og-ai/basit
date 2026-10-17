// Generates public/granite.png: a 240px tile of sparse dark and light flecks,
// ~4% ink, used as the granite speckle on light sections. Run: node scripts/build-speckle.mjs
import sharp from 'sharp';
const w = 240, h = 240;
const px = Buffer.alloc(w * h * 4);
let seed = 11;
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
for (let i = 0; i < w * h; i++) {
  const r = rand();
  if (r > 0.9) {
    const dark = rand() > 0.3;
    px[i * 4] = dark ? 22 : 120;
    px[i * 4 + 1] = dark ? 24 : 116;
    px[i * 4 + 2] = dark ? 28 : 110;
    px[i * 4 + 3] = Math.round(dark ? 14 + rand() * 22 : 10 + rand() * 14);
  }
}
await sharp(px, { raw: { width: w, height: h, channels: 4 } }).png({ palette: true, colours: 32, effort: 10 }).toFile('public/granite.png');
console.log('public/granite.png written');
