// Integration test for netlify/functions/book.mts and bookings-csv.mts against a
// real local Netlify Blobs server. Resend and the webhook are intercepted, so no
// email is sent; we assert on exactly what would have been sent.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { BlobsServer } from '@netlify/blobs/server';
import { setEnvironmentContext } from '@netlify/blobs';

const env: Record<string, string> = {
  RESEND_API_KEY: 'test-key',
  BOOKING_TO_EMAIL: 'owner@example.com',
  BOOKING_FROM_EMAIL: 'onboarding@resend.dev',
  NOTIFY_WEBHOOK_URL: 'https://hooks.example.com/x',
  ADMIN_USER: 'chris',
  ADMIN_PASS: 'kettle-on',
};
(globalThis as any).Netlify = { env: { get: (k: string) => env[k], set: (k: string, v: string) => { env[k] = v; }, has: (k: string) => k in env, delete: (k: string) => { delete env[k]; } } };

const sent: { url: string; body: any }[] = [];
const realFetch = globalThis.fetch;
let server: BlobsServer;
let book: (req: Request, ctx: any) => Promise<Response>;
let csv: (req: Request) => Promise<Response>;

before(async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'blobs-'));
  server = new BlobsServer({ directory: dir, port: 0, token: 'tok' });
  const { port } = await server.start();
  setEnvironmentContext({ siteID: 'site', token: 'tok', edgeURL: `http://localhost:${port}`, uncachedEdgeURL: `http://localhost:${port}` });
  globalThis.fetch = (async (input: any, init?: any) => {
    const url = String(input instanceof Request ? input.url : input);
    if (url.startsWith('https://api.resend.com') || url.startsWith('https://hooks.example.com')) {
      sent.push({ url, body: JSON.parse(init.body) });
      return Response.json({ id: 'x' });
    }
    return realFetch(input, init);
  }) as typeof fetch;
  book = (await import('../netlify/functions/book.mts')).default;
  csv = (await import('../netlify/functions/bookings-csv.mts')).default;
});
after(async () => { globalThis.fetch = realFetch; await server.stop(); });

const base = () => ({
  name: 'Sam Test', phone: '07123 456789', postcode: 'tf11 8aa', vehicle: 'Ford Focus', size: 'medium',
  service: 'full-valet', email: 'sam@example.com', preferredDay: 'Saturday', notes: 'Dog hair, see https://spam.example',
  ts: String(Date.now() - 10_000), company: '', estimate: '70', pageUrl: '/book/', utm_source: 'google',
});
const ctx = (ip: string) => ({ ip });
function multipart(fields: Record<string, string>, photos = 0, json = true) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  for (let i = 0; i < photos; i++) fd.append('photos', new File([new Uint8Array([0xff, 0xd8, 0xff, i])], `p${i}.jpg`, { type: 'image/jpeg' }));
  return new Request('http://localhost/api/book', { method: 'POST', body: fd, headers: json ? { Accept: 'application/json' } : {} });
}

test('valid booking: saved, emailed with photos, auto-reply, webhook, JSON redirect', async () => {
  sent.length = 0;
  const res = await book(multipart(base(), 2), ctx('1.1.1.1'));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, redirect: '/thank-you/' });
  const owner = sent.find((s) => s.url.includes('resend') && s.body.to[0] === 'owner@example.com')!;
  assert.equal(owner.body.subject, 'New booking: Full Valet · Ford Focus · TF11 8AA · est. £70');
  assert.equal(owner.body.attachments.length, 2);
  assert.match(owner.body.html, /WhatsApp Sam/);
  assert.match(owner.body.html, /wa\.me\/447123456789/);
  assert.match(owner.body.html, /tel:07123456789/);
  assert.doesNotMatch(owner.body.html, /spam\.example/);
  const reply = sent.find((s) => s.url.includes('resend') && s.body.to[0] === 'sam@example.com');
  assert.ok(reply, 'auto-reply sent');
  assert.ok(sent.find((s) => s.url.includes('hooks.example.com')));
});

test('no-JS post redirects with 303', async () => {
  const res = await book(multipart(base(), 0, false), ctx('2.2.2.2'));
  assert.equal(res.status, 303);
  assert.equal(res.headers.get('location'), '/thank-you/');
});

test('postcode outside TF/SY/WV is flagged, not rejected', async () => {
  sent.length = 0;
  const res = await book(multipart({ ...base(), postcode: 'B1 1AA' }), ctx('3.3.3.3'));
  assert.equal(res.status, 200);
  assert.match(sent[0].body.html, /OUTSIDE TF\/SY\/WV/);
});

test('invalid input returns field errors; no-JS gets an HTML error page', async () => {
  const res = await book(multipart({ ...base(), phone: '123', postcode: 'nope' }), ctx('4.4.4.4'));
  assert.equal(res.status, 422);
  const j = await res.json();
  assert.ok(j.errors.phone && j.errors.postcode);
  const res2 = await book(multipart({ ...base(), phone: '123' }, 0, false), ctx('4.4.4.5'));
  assert.equal(res2.status, 422);
  assert.match(await res2.text(), /UK phone number/);
});

test('honeypot pretends success but sends nothing', async () => {
  sent.length = 0;
  const res = await book(multipart({ ...base(), company: 'Spam Ltd' }), ctx('5.5.5.5'));
  assert.equal(res.status, 200);
  assert.equal(sent.length, 0);
});

test('time-trap rejects forms filled in under 3 seconds', async () => {
  const res = await book(multipart({ ...base(), ts: String(Date.now() - 500) }), ctx('6.6.6.6'));
  assert.equal(res.status, 400);
});

test('rate limit: 6th request in an hour from one IP is refused', async () => {
  const codes = [];
  for (let i = 0; i < 6; i++) codes.push((await book(multipart(base()), ctx('7.7.7.7'))).status);
  assert.deepEqual(codes, [200, 200, 200, 200, 200, 429]);
});

test('CSV export needs Basic Auth and lists bookings', async () => {
  assert.equal((await csv(new Request('http://localhost/api/bookings.csv'))).status, 401);
  const bad = 'Basic ' + btoa('chris:wrong');
  assert.equal((await csv(new Request('http://localhost/api/bookings.csv', { headers: { authorization: bad } }))).status, 401);
  const good = 'Basic ' + btoa('chris:kettle-on');
  const res = await csv(new Request('http://localhost/api/bookings.csv', { headers: { authorization: good } }));
  assert.equal(res.status, 200);
  const text = await res.text();
  assert.match(text.split('\r\n')[0], /id,createdAt,name,phone/);
  assert.ok(text.split('\r\n').length >= 9, 'header + saved bookings');
  assert.match(text, /"Sam Test"/);
});
