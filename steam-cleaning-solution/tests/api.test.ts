// End-to-end test of /api/quote and /api/quotes.csv against a local Netlify Blobs server,
// with the Resend API stubbed. Run: npm test
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { BlobsServer } from '@netlify/blobs/server';
import { setEnvironmentContext, getStore } from '@netlify/blobs';

const sent: any[] = [];
const realFetch = globalThis.fetch;
let server: BlobsServer;
let quote: (req: Request, ctx: any) => Promise<Response>;
let csv: (req: Request) => Promise<Response>;

before(async () => {
  const token = 'test';
  server = new BlobsServer({ directory: mkdtempSync(path.join(tmpdir(), 'blobs-')), port: 0, token });
  const { port } = await server.start();
  setEnvironmentContext({ edgeURL: `http://localhost:${port}`, token, siteID: 'site' });
  process.env.RESEND_API_KEY = 're_test';
  process.env.QUOTE_TO_EMAIL = 'owner@example.com';
  process.env.ADMIN_USER = 'admin';
  process.env.ADMIN_PASS = 'pa:ss';
  globalThis.fetch = (async (url: any, init?: any) => {
    if (String(url).startsWith('https://api.resend.com')) { sent.push(JSON.parse(init.body)); return new Response('{"id":"x"}', { status: 200 }); }
    return realFetch(url, init);
  }) as typeof fetch;
  quote = (await import('../netlify/functions/quote.mts')).default;
  csv = (await import('../netlify/functions/quotes-csv.mts')).default;
});
after(async () => { globalThis.fetch = realFetch; await server.stop(); });

function form(extra: Record<string, string> = {}, photos = 0) {
  const f = new FormData();
  const base: Record<string, string> = { name: 'Sam Jones', phone: '07700 900123', postcode: 'cf24 3aa', email: 'sam@example.com', notes: 'Permit parking', heard: 'Facebook ad', ts: String(Date.now() - 60_000), ...extra };
  for (const [k, v] of Object.entries(base)) f.append(k, v);
  f.append('items', 'carpet_rooms'); f.append('qty_carpet_rooms', '2');
  f.append('items', 'sofa_seats'); f.append('qty_sofa_seats', '3');
  f.append('days', 'Sat');
  for (let i = 0; i < photos; i++) f.append('photos', new Blob([new Uint8Array([0xff, 0xd8, 0xff, i])], { type: 'image/jpeg' }), `p${i}.jpg`);
  return f;
}
const req = (body: FormData, json = true) => new Request('http://x/api/quote', { method: 'POST', body, headers: json ? { Accept: 'application/json' } : {} });
let ipN = 0;
const ctx = () => ({ ip: `10.0.0.${++ipN}` });

test('valid JSON-mode submission saves, emails with photos, auto-replies', async () => {
  sent.length = 0;
  const res = await quote(req(form({}, 2)), ctx());
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.ok, true);
  assert.equal(body.redirect, '/thank-you/');
  const saved: any = await getStore('quotes').get(body.id, { type: 'json' });
  assert.equal(saved.postcode, 'CF24 3AA');
  assert.equal(saved.email_status, 'sent');
  assert.equal(saved.photoKeys.length, 2);
  assert.equal(sent.length, 2);
  assert.equal(sent[0].subject, 'New quote request: Carpets: 2 rooms, Sofa: 3 seats · CF24 3AA');
  assert.equal(sent[0].attachments.length, 2);
  assert.match(sent[0].html, /WhatsApp Sam/);
  assert.match(sent[0].html, /wa\.me\/447700900123/);
  assert.deepEqual(sent[1].to, ['sam@example.com']);
});

test('no-JS post redirects 303 to /thank-you/', async () => {
  const res = await quote(req(form(), false), ctx());
  assert.equal(res.status, 303);
  assert.equal(res.headers.get('location'), '/thank-you/');
});

test('out-of-area postcode is flagged, not rejected', async () => {
  sent.length = 0;
  const res = await quote(req(form({ postcode: 'BS1 4DJ', email: '' })), ctx());
  assert.equal(res.status, 200);
  assert.match(sent[0].html, /OUTSIDE CF\/NP/);
  assert.equal(sent.length, 1, 'no auto-reply without email');
});

test('validation errors are returned per field', async () => {
  const res = await quote(req(form({ phone: 'abc', postcode: 'zzz' })), ctx());
  assert.equal(res.status, 422);
  const body = await res.json();
  assert.ok(body.errors.phone && body.errors.postcode);
});

test('validation errors without JS show an HTML page', async () => {
  const res = await quote(req(form({ phone: 'abc' }), false), ctx());
  assert.equal(res.status, 422);
  assert.match(await res.text(), /Back to the form/);
});

test('honeypot is rejected silently (nothing saved or sent)', async () => {
  sent.length = 0;
  const before = (await getStore('quotes').list()).blobs.length;
  const res = await quote(req(form({ company_website: 'spam.biz' })), ctx());
  assert.equal(res.status, 200);
  assert.equal(sent.length, 0);
  assert.equal((await getStore('quotes').list()).blobs.length, before);
});

test('time trap rejects submissions under 3s', async () => {
  const res = await quote(req(form({ ts: String(Date.now() - 500) })), ctx());
  assert.equal(res.status, 400);
});

test('rate limit: 6th request from one IP in an hour is refused', async () => {
  const c = { ip: '192.168.1.1' };
  for (let i = 0; i < 5; i++) assert.equal((await quote(req(form({ email: '' })), c)).status, 200);
  assert.equal((await quote(req(form({ email: '' })), c)).status, 429);
});

test('links are stripped from notes', async () => {
  const res = await quote(req(form({ notes: 'cheap pills http://spam.example' })), ctx());
  const { id } = await res.json();
  const saved: any = await getStore('quotes').get(id, { type: 'json' });
  assert.equal(saved.notes, 'cheap pills [link removed]');
});

test('CSV export needs Basic Auth and returns rows', async () => {
  assert.equal((await csv(new Request('http://x/api/quotes.csv'))).status, 401);
  const bad = 'Basic ' + Buffer.from('admin:wrong').toString('base64');
  assert.equal((await csv(new Request('http://x/api/quotes.csv', { headers: { authorization: bad } }))).status, 401);
  const good = 'Basic ' + Buffer.from('admin:pa:ss').toString('base64');
  const res = await csv(new Request('http://x/api/quotes.csv', { headers: { authorization: good } }));
  assert.equal(res.status, 200);
  const text = await res.text();
  assert.match(text.replace(/^\uFEFF/, ''), /^id,receivedAt,name/);
  assert.match(text, /Sam Jones/);
  assert.match(text, /CF24 3AA/);
});
