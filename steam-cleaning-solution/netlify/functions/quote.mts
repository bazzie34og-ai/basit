import type { Config, Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { parseQuote, summary, inArea, LIMITS, type Quote } from '../../src/lib/quote.ts';
import { coreAreas, business } from '../../src/config/site.ts';
import { ownerEmail, customerEmail, sendResend, esc } from '../lib/email.ts';

const RATE_LIMIT = 5; // per IP per hour
const MIN_MS = 3000; // time trap

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

function htmlError(messages: string[], status = 400) {
  const list = messages.map((m) => `<li>${esc(m)}</li>`).join('');
  return new Response(`<!doctype html><html lang="en-GB"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Please check your details</title>
<body style="background:#F4F1E8;color:#13201A;font:18px/1.6 system-ui,Arial,sans-serif;padding:2rem;max-width:40rem;margin:auto">
<h1 style="font-family:Georgia,serif;font-weight:400">Nearly there</h1><p>Please go back and check:</p><ul>${list}</ul>
<p><a href="/quote/" style="color:#124932;font-weight:600">Back to the form</a> · or WhatsApp us on <a href="https://wa.me/${business.phones.whatsapp.wa}" style="color:#124932">${business.phones.whatsapp.display}</a></p></body></html>`, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

async function hash(s: string) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s + (process.env.RATE_SALT || 'scs')));
  return [...new Uint8Array(d)].slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') return json({ ok: false, message: 'Method not allowed' }, 405);
  const ctype = req.headers.get('content-type') || '';
  const wantsJson = (req.headers.get('accept') || '').includes('application/json') || ctype.includes('application/json');
  const fail = (status: number, message: string, errors?: Record<string, string>) =>
    wantsJson ? json({ ok: false, message, errors }, status) : htmlError(errors ? Object.values(errors) : [message], status);

  // ---- Body: JSON or multipart / urlencoded ----
  let get: (k: string) => string | null;
  let getAll: (k: string) => string[];
  let files: File[] = [];
  try {
    if (ctype.includes('application/json')) {
      const body = (await req.json()) as Record<string, unknown>;
      get = (k) => (body[k] == null ? null : Array.isArray(body[k]) ? String((body[k] as unknown[])[0]) : String(body[k]));
      getAll = (k) => (body[k] == null ? [] : Array.isArray(body[k]) ? (body[k] as unknown[]).map(String) : [String(body[k])]);
    } else {
      const form = await req.formData();
      get = (k) => { const v = form.get(k); return typeof v === 'string' ? v : null; };
      getAll = (k) => form.getAll(k).filter((v): v is string => typeof v === 'string');
      files = form.getAll('photos').filter((v): v is File => typeof v !== 'string' && v.size > 0);
    }
  } catch {
    return fail(400, 'We couldn’t read that form. Please try again.');
  }

  // ---- Spam protection ----
  if ((get('company_website') || '').trim()) {
    // Honeypot filled: reject quietly (looks like success to the bot, nothing saved or sent).
    return wantsJson ? json({ ok: true, redirect: '/thank-you/' }) : new Response(null, { status: 303, headers: { Location: '/thank-you/' } });
  }
  const ts = Number(get('ts'));
  if (ts && Number.isFinite(ts) && Date.now() - ts < MIN_MS) {
    return fail(400, 'That was very quick. Please check your details and send again.');
  }

  const ip = context.ip || req.headers.get('x-nf-client-connection-ip') || 'unknown';
  const rl = getStore('quote-ratelimit');
  const bucket = `${await hash(ip)}-${Math.floor(Date.now() / 3_600_000)}`;
  const count = Number((await rl.get(bucket)) || 0);
  if (count >= RATE_LIMIT) return fail(429, 'Too many requests from your connection. Please WhatsApp or call us instead.');
  await rl.set(bucket, String(count + 1));

  if (process.env.TURNSTILE_SECRET) {
    const token = get('cf-turnstile-response') || '';
    const v = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET, response: token, remoteip: ip }),
    }).then((r) => r.json() as Promise<{ success: boolean }>).catch(() => ({ success: false }));
    if (!v.success) return fail(400, 'Please complete the check and send again.');
  }

  // ---- Validate ----
  const { quote, errors } = parseQuote(get, getAll);
  if (Object.keys(errors).length) return fail(422, 'Please check the highlighted fields.', errors);

  const photos = files.filter((f) => f.type.startsWith('image/')).slice(0, LIMITS.photos);
  let total = 0;
  for (const f of photos) {
    total += f.size;
    if (f.size > LIMITS.photoBytes || total > LIMITS.totalBytes) return fail(413, 'Your photos are too large. Try fewer photos, or send them on WhatsApp.', { photos: 'Photos too large.' });
  }

  // ---- Save first, so nothing is lost ----
  const id = `${new Date().toISOString().replace(/[:.]/g, '-')}-${crypto.randomUUID().slice(0, 8)}`;
  const outOfArea = !inArea(quote.postcode, coreAreas);
  const photoStore = getStore('quote-photos');
  const photoKeys: string[] = [];
  const attachments: { filename: string; content: string }[] = [];
  for (let i = 0; i < photos.length; i++) {
    const buf = await photos[i].arrayBuffer();
    const ext = photos[i].type === 'image/png' ? 'png' : photos[i].type === 'image/webp' ? 'webp' : 'jpg';
    const key = `${id}/photo-${i + 1}.${ext}`;
    await photoStore.set(key, buf, { metadata: { type: photos[i].type } });
    photoKeys.push(key);
    attachments.push({ filename: `photo-${i + 1}.${ext}`, content: Buffer.from(buf).toString('base64') });
  }
  const record: Record<string, unknown> = { id, receivedAt: new Date().toISOString(), ...quote, outOfArea, summary: summary(quote), photoKeys, email_status: 'pending' };
  const quotes = getStore('quotes');
  await quotes.setJSON(id, record);

  // ---- Email ----
  const to = process.env.QUOTE_TO_EMAIL || 'itsprimopartners@gmail.com';
  const from = process.env.QUOTE_FROM_EMAIL || 'onboarding@resend.dev';
  const fromHeader = `${business.shortName} <${from}>`;
  const owner = ownerEmail(quote as Quote, { id, outOfArea, photoCount: photos.length });
  const sent = await sendResend({ from: fromHeader, to: [to], subject: owner.subject, html: owner.html, text: owner.text, attachments, ...(quote.email ? { reply_to: quote.email } : {}) }).catch((e) => ({ ok: false, error: String(e) }));
  let autoReply: { ok: boolean; error?: string } | null = null;
  if (quote.email) {
    const c = customerEmail(quote as Quote);
    autoReply = await sendResend({ from: fromHeader, to: [quote.email], subject: c.subject, html: c.html, text: c.text, reply_to: business.email }).catch((e) => ({ ok: false, error: String(e) }));
  }
  record.email_status = sent.ok ? 'sent' : `failed: ${sent.error}`;
  if (autoReply) record.autoreply_status = autoReply.ok ? 'sent' : `failed: ${autoReply.error}`;
  await quotes.setJSON(id, record);
  if (!sent.ok) console.error('[quote] email failed', id, sent.error);

  return wantsJson
    ? json({ ok: true, id, redirect: '/thank-you/', items: summary(quote) })
    : new Response(null, { status: 303, headers: { Location: '/thank-you/' } });
};

export const config: Config = { path: '/api/quote', method: ['POST'] };
