import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimate, estimateShort, servicesForSize } from '../src/lib/estimate.ts';
import { monthlyPlan, services, activeServices } from '../src/config/site.ts';
import { validateBooking, normaliseUkPhone, isLocalPostcode, normalisePostcode, stripLinks } from '../src/lib/booking.ts';

test('monthly plan estimate matches config for every size', () => {
  for (const row of monthlyPlan.prices) {
    const e = estimate('monthly', row.size);
    assert.equal(e.kind, 'fixed');
    assert.equal(e.amount, row.price);
  }
});

test('published 2026 prices are exactly as the price list', () => {
  const from = Object.fromEntries(services.map((s) => [s.id, s.from]));
  assert.deepEqual(monthlyPlan.prices.map((p) => p.price), [30, 40, 50, 60]);
  assert.equal(from['mini-valet'], 45);
  assert.equal(from['full-valet'], 70);
  assert.equal(from['full-valet-deep'], 90);
  assert.equal(from['detailing'], 110);
  assert.equal(from['paint-correction'], 160);
  assert.equal(from['moto-clean'], 60);
  assert.equal(from['moto-detail'], 120);
  assert.equal(from['van-mini'], 60);
  assert.equal(from['ceramic'], null);
  assert.equal(from['ppf'], null);
  assert.equal(monthlyPlan.includes.length, 12);
});

test('every priced service estimates its config "from" price for each allowed size', () => {
  for (const s of activeServices) {
    for (const size of s.forSizes) {
      const e = estimate(s.id, size);
      if (s.id === 'monthly') continue;
      if (s.from === null) {
        assert.equal(e.kind, 'quote', `${s.id}/${size}`);
        assert.equal(estimateShort(e), 'quote');
      } else {
        assert.equal(e.kind, 'from', `${s.id}/${size}`);
        assert.equal(e.amount, s.from);
        assert.equal(estimateShort(e), String(s.from));
      }
    }
  }
});

test('services are not offered for the wrong vehicle', () => {
  assert.equal(estimate('full-valet', 'motorbike').kind, 'invalid');
  assert.equal(estimate('moto-detail', 'small').kind, 'invalid');
  assert.equal(estimate('monthly', 'van').kind, 'invalid');
  assert.equal(estimate('nope', 'small').kind, 'invalid');
  assert.deepEqual(servicesForSize('motorbike').map((s) => s.id), ['moto-clean', 'moto-detail', 'not-sure']);
});

test('UK phone validation', () => {
  assert.equal(normaliseUkPhone('07433 723029'), '07433723029');
  assert.equal(normaliseUkPhone('+44 7433 723029'), '07433723029');
  assert.equal(normaliseUkPhone('0044 7433 723029'), '07433723029');
  assert.equal(normaliseUkPhone('01952 123456'), '01952123456');
  assert.equal(normaliseUkPhone('12345'), null);
  assert.equal(normaliseUkPhone('+1 555 123 4567'), null);
});

test('postcodes: UK format required, outside TF/SY/WV only flagged', () => {
  assert.equal(normalisePostcode('tf11 8aa'), 'TF11 8AA');
  assert.equal(isLocalPostcode('TF1 1AA'), true);
  assert.equal(isLocalPostcode('SY1 1AA'), true);
  assert.equal(isLocalPostcode('B1 1AA'), false);
  const base = { name: 'Sam', phone: '07123456789', vehicle: 'Ford Focus', size: 'medium', service: 'full-valet' };
  const ok = validateBooking({ ...base, postcode: 'B1 1AA' });
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.data.postcodeLocal, false);
  const bad = validateBooking({ ...base, postcode: 'nowhere' });
  assert.equal(bad.ok, false);
});

test('validation errors and link stripping', () => {
  const r = validateBooking({ name: '', phone: 'x', postcode: '', vehicle: '', size: '', service: '' });
  assert.equal(r.ok, false);
  if (!r.ok) assert.deepEqual(Object.keys(r.errors).sort(), ['name', 'phone', 'postcode', 'service', 'size', 'vehicle']);
  assert.equal(stripLinks('see https://spam.example/x now'), 'see [link removed] now');
  assert.equal(stripLinks('visit www.spam.com'), 'visit [link removed]');
});
