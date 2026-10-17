// End-to-end test of netlify/functions/book.mjs and bookings-export.mjs against
// a local Netlify Blobs server, with Resend and the webhook stubbed.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { BlobsServer } from '@netlify/blobs/server';

let server;
const sent = [];
const realFetch = globalThis.fetch;

before(async () => {
  const token = 'test-token';
  server = new BlobsServer({ directory: mkdtempSync(join(tmpdir(), 'lm-blobs-')), token, port: 0 });
  const { port } = await server.start();
  process.env.NETLIFY_BLOBS_CONTEXT = Buffer.from(JSON.stringify({ edgeURL: `http://localhost:${port}`, token, siteID: 'test' })).toString('base64');
  Object.assign(process.env, { RESEND_API_KEY: 're_test', BOOKING_TO_EMAIL: 'owner@example.com', ADMIN_USER: 'admin', ADMIN_PASS: 'secret pass', NOTIFY_WEBHOOK_URL: 'https://hooks.example/x' });
  globalThis.fetch = async (url, init) => {
    const u = String(url);
    if (u.startsWith('https://api.resend.com') || u.startsWith('https://hooks.example')) {
      sent.push({ url: u, body: JSON.parse(init.body) });
      return new Response('{"id":"x"}', { status: 200 });
    }
    return realFetch(url, init);
  };
});
after(async () => {
  globalThis.fetch = realFetch;
  await server.stop();
});

const { default: book } = await import('../netlify/functions/book.mjs');
const { default: exportCsv } = await import('../netlify/functions/bookings-export.mjs');

function multipart(fields, photos = []) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) [].concat(v).forEach((x) => fd.append(k, x));
  photos.forEach((p, i) => fd.append('photos', new File([p], `p${i}.jpg`, { type: 'image/jpeg' })));
  return fd;
}
const good = {
  name: 'Jamie Test', phone: '07700 900123', email: 'jamie@example.com', makeModel: 'Ford Focus', registration: 'sv19abc',
  service: 'full-works', vehicleSize: 'large', extras: ['pet-hair'], serviceType: 'mobile', postcode: 'ab106ry',
  preferredDay: '2026-11-02', preferredTime: 'Weekday morning', notes: 'Dog hair. See https://spam.example', howHeard: 'Google',
  quotedTotal: '£1', t: String(Date.now() - 60_000), company: '', utm_source: 'google',
};
const call = (fd, ip, accept = 'application/json') =>
  book(new Request('https://x/api/book', { method: 'POST', body: fd, headers: { accept } }), { ip });

test('valid booking with photos: saved, emailed with attachments, auto-reply, webhook', async () => {
  sent.length = 0;
  const r = await call(multipart(good, [new Uint8Array([0xff, 0xd8, 1, 2, 3])]), '1.1.1.1');
  const j = await r.json();
  assert.equal(r.status, 200);
  assert.equal(j.ok, true);
  const emails = sent.filter((s) => s.url.includes('resend'));
  assert.equal(emails.length, 2, 'business email + auto-reply');
  const biz = emails[0].body;
  assert.equal(biz.subject, '🧽 New booking: Full Works · Ford Focus · AB10 6RY · £105');
  assert.equal(biz.attachments.length, 1);
  assert.equal(biz.reply_to, 'jamie@example.com');
  assert.match(biz.html, /wa\.me\/447700900123/);
  assert.match(biz.html, /\[link removed\]/);
  assert.equal(emails[1].body.to[0], 'jamie@example.com');
  assert.match(emails[1].body.text, /£105/);
  assert.ok(sent.some((s) => s.url.includes('hooks.example')));
});

test('no-JS post redirects to /thank-you/', async () => {
  const r = await call(multipart(good), '1.1.1.2', 'text/html');
  assert.equal(r.status, 303);
  assert.equal(r.headers.get('location'), '/thank-you/');
});

test('invalid input returns field errors and the step to show', async () => {
  const r = await call(multipart({ ...good, phone: '123', postcode: 'nope', makeModel: '' }), '1.1.1.3');
  const j = await r.json();
  assert.equal(r.status, 400);
  assert.deepEqual(Object.keys(j.errors).sort(), ['makeModel', 'phone', 'postcode']);
  assert.equal(j.step, 1);
});

test('non-AB postcode is accepted and flagged', async () => {
  sent.length = 0;
  const r = await call(multipart({ ...good, postcode: 'DD1 1AA' }), '1.1.1.4');
  assert.equal(r.status, 200);
  assert.match(sent[0].body.html, /not an AB postcode/);
});

test('honeypot is rejected', async () => {
  const r = await call(multipart({ ...good, company: 'Spam Ltd' }), '1.1.1.5');
  assert.equal(r.status, 400);
});

test('time-trap rejects submissions under 3 seconds', async () => {
  const r = await call(multipart({ ...good, t: String(Date.now() - 500) }), '1.1.1.6');
  assert.equal(r.status, 400);
});

test('rate limit: 6th booking in an hour from one IP is refused', async () => {
  const codes = [];
  for (let i = 0; i < 6; i++) codes.push((await call(multipart(good), '9.9.9.9')).status);
  assert.deepEqual(codes, [200, 200, 200, 200, 200, 429]);
});

test('CSV export needs auth and returns bookings', async () => {
  const noAuth = await exportCsv(new Request('https://x/api/bookings.csv'));
  assert.equal(noAuth.status, 401);
  const bad = await exportCsv(new Request('https://x/api/bookings.csv', { headers: { authorization: 'Basic ' + btoa('admin:wrong') } }));
  assert.equal(bad.status, 401);
  const ok = await exportCsv(new Request('https://x/api/bookings.csv', { headers: { authorization: 'Basic ' + btoa('admin:secret pass') } }));
  assert.equal(ok.status, 200);
  const csv = await ok.text();
  assert.match(csv, /^\uFEFF?createdAt,name,phone/);
  assert.match(csv, /Jamie Test,07700 900123/);
  assert.match(csv, /£105/);
});
