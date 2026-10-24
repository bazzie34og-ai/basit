import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
// @ts-ignore: plain JS module
import { findGutter } from '../scripts/prepare-assets.mjs';

async function composite(w: number, h: number, gutterAt: number, gw: number, axis: 'x' | 'y') {
  const noise = Buffer.alloc(w * h * 3);
  for (let i = 0; i < noise.length; i++) noise[i] = 40 + ((i * 7919) % 150);
  for (let a = 0; a < (axis === 'x' ? w : h); a++) {
    if (a < gutterAt || a >= gutterAt + gw) continue;
    for (let b = 0; b < (axis === 'x' ? h : w); b++) {
      const x = axis === 'x' ? a : b, y = axis === 'x' ? b : a;
      noise.fill(255, (y * w + x) * 3, (y * w + x) * 3 + 3);
    }
  }
  return sharp(noise, { raw: { width: w, height: h, channels: 3 } }).raw().toBuffer({ resolveWithObject: true });
}

test('finds an off-centre vertical gutter', async () => {
  const { data, info } = await composite(720, 400, 371, 9, 'x');
  assert.deepEqual(findGutter(data, info.width, info.height, 3, 'x'), [371, 380]);
});

test('finds a horizontal gutter', async () => {
  const { data, info } = await composite(720, 900, 440, 12, 'y');
  assert.deepEqual(findGutter(data, info.width, info.height, 3, 'y'), [440, 452]);
});

test('returns null when there is no gutter', async () => {
  const { data, info } = await composite(300, 200, 0, 0, 'x');
  assert.equal(findGutter(data, info.width, info.height, 3, 'x'), null);
});
