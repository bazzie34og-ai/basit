// Run with: npm test
// Checks every service × size × extras combination against hand-worked totals.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quote, priceLabel } from '../src/lib/pricing.ts';
import { services, sizes, extras } from '../src/config/site.ts';

// Written out by hand from their price list, deliberately not derived from config.
const BASE = { 'exterior-wash': [10, 20], 'basic-clean': [30, 30], 'interior-valet': [35, 35], 'exterior-valet': [35, 35], 'thorough-clean': [60, 60], 'full-works': [85, 85] };
const SIZE = { small: 0, medium: 5, large: 10, 'seven-seater': 15 };
const EXTRA = { 'engine-bay': 10, 'pet-hair': 10, headlights: 25, 'baby-seat': 10 };

const subsets = (arr) => arr.reduce((acc, x) => acc.concat(acc.map((s) => [...s, x])), [[]]);

test('config matches the printed price list', () => {
  assert.deepEqual(Object.fromEntries(services.map((s) => [s.id, [s.priceMin, s.priceMax]])), BASE);
  assert.deepEqual(Object.fromEntries(sizes.map((s) => [s.id, s.supplement])), SIZE);
  assert.deepEqual(Object.fromEntries(extras.map((e) => [e.id, e.price])), EXTRA);
});

test('every service × size × extras combination adds up', () => {
  let n = 0;
  for (const [sid, [lo, hi]] of Object.entries(BASE)) {
    for (const [zid, sup] of Object.entries(SIZE)) {
      for (const combo of subsets(Object.keys(EXTRA))) {
        const add = combo.reduce((t, id) => t + EXTRA[id], 0);
        const q = quote(sid, zid, combo);
        assert.equal(q.min, lo + sup + add, `${sid}/${zid}/${combo}`);
        assert.equal(q.max, hi + sup + add, `${sid}/${zid}/${combo}`);
        assert.equal(q.label, lo === hi ? `£${lo + sup + add}` : `£${lo + sup + add}–£${hi + sup + add}`);
        n++;
      }
    }
  }
  assert.equal(n, 6 * 4 * 16);
});

test('worked examples', () => {
  assert.equal(quote('full-works', 'large', ['pet-hair']).label, '£105');
  assert.equal(quote('interior-valet', 'medium', ['baby-seat']).label, '£50');
  assert.equal(quote('thorough-clean', 'small', []).label, '£60');
  assert.equal(quote('exterior-wash', 'seven-seater', ['headlights']).label, '£50–£60');
  assert.equal(priceLabel(10, 20), '£10–£20');
});

test('unknown extras are ignored, unknown services throw', () => {
  assert.equal(quote('basic-clean', 'small', ['made-up']).label, '£30');
  assert.throws(() => quote('nope', 'small'));
  assert.throws(() => quote('basic-clean', 'tiny'));
});
