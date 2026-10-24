import test from 'node:test';
import assert from 'node:assert/strict';
import { normalisePostcode, normalisePhone, inArea, parseQuote, summary, whatsappText, stripLinks } from '../src/lib/quote.ts';

const fromObj = (o: Record<string, string | string[]>) => ({
  get: (k: string) => { const v = o[k]; return v == null ? null : Array.isArray(v) ? v[0] : v; },
  getAll: (k: string) => { const v = o[k]; return v == null ? [] : Array.isArray(v) ? v : [v]; },
});

test('postcodes', () => {
  assert.equal(normalisePostcode('cf243aa'), 'CF24 3AA');
  assert.equal(normalisePostcode(' np20  1ab '), 'NP20 1AB');
  assert.equal(normalisePostcode('CF24'), 'CF24');
  assert.equal(normalisePostcode('BS1 4DJ'), 'BS1 4DJ');
  assert.equal(normalisePostcode('hello'), null);
  assert.equal(inArea('CF24 3AA'), true);
  assert.equal(inArea('NP44'), true);
  assert.equal(inArea('BS1 4DJ'), false);
  assert.equal(inArea('CB1 1AA'), false);
});

test('phones', () => {
  assert.equal(normalisePhone('07506 285260'), '07506285260');
  assert.equal(normalisePhone('+44 7480 267434'), '07480267434');
  assert.equal(normalisePhone('029 2000 0000'), '02920000000');
  assert.equal(normalisePhone('12345'), null);
});

test('links stripped', () => {
  assert.equal(stripLinks('see https://spam.example/x now'), 'see [link removed] now');
  assert.equal(stripLinks('<b>hi</b>'), 'hi');
});

test('parse + summary + whatsapp', () => {
  const { get, getAll } = fromObj({ items: ['carpet_rooms', 'stairs', 'mattress', 'other'], qty_carpet_rooms: '3', qty_stairs: '1', qty_mattress: '2', mattress_size: 'King', other: 'Curtains', name: 'Sam', phone: '07700 900123', postcode: 'cf11 9aa', days: ['Mon', 'Bogus'], notes: 'Dog www.x.com', heard: 'Facebook ad' });
  const { quote, errors } = parseQuote(get, getAll);
  assert.deepEqual(errors, {});
  assert.equal(quote.postcode, 'CF11 9AA');
  assert.deepEqual(quote.days, ['Mon']);
  assert.equal(quote.notes, 'Dog [link removed]');
  assert.equal(summary(quote), 'Carpets: 3 rooms, Stairs & landing: 1 flight, 2 mattresses (King), Other: Curtains');
  assert.match(whatsappText(quote), /Postcode: CF11 9AA/);
});

test('errors', () => {
  const { get, getAll } = fromObj({ name: 'S', phone: 'x', postcode: 'nope', email: 'bad' });
  const { errors } = parseQuote(get, getAll);
  assert.deepEqual(Object.keys(errors).sort(), ['email', 'items', 'name', 'phone', 'postcode']);
});
