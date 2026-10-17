// POST /api/book — the booking form's backend (Netlify Functions v2).
//
// Order of work, deliberately:
//   1. spam checks (honeypot, time-trap, rate limit, optional Turnstile)
//   2. validate (shared rules in src/lib/validate.ts)
//   3. SAVE to Netlify Blobs, so no booking is ever lost
//   4. then email the business, auto-reply the customer, ping the webhook
// If email fails the customer still gets { ok: true }: the booking is saved
// and the failure is logged and alerted.

import { getStore } from '@netlify/blobs';
import { createHash, randomUUID } from 'node:crypto';
import { validateBooking, FIELD_STEP, waNumber } from '../../src/lib/validate.ts';
import { business, services, sizes, extras, expectations, waLink } from '../../src/config/site.ts';

export const config = { path: '/api/book' };

const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
const MIN_FILL_MS = 3000;
const RATE_LIMIT = 5; // per IP per hour

const env = (k, fallback = '') => (globalThis.Netlify?.env?.get?.(k) ?? process.env[k] ?? fallback);

export default async (req, context) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });

  const wantsJson = (req.headers.get('accept') || '').includes('application/json');
  const fail = (status, body) =>
    wantsJson
      ? Response.json({ ok: false, ...body }, { status })
      : new Response(errorPage(body), { status, headers: { 'content-type': 'text/html; charset=utf-8' } });

  // ── parse JSON or multipart/urlencoded ──
  let raw = {};
  let files = [];
  try {
    const type = req.headers.get('content-type') || '';
    if (type.includes('application/json')) {
      raw = await req.json();
    } else {
      const fd = await req.formData();
      for (const [k, v] of fd.entries()) {
        if (typeof v === 'string') {
          if (k === 'extras') (raw.extras ||= []).push(v);
          else raw[k] = v;
        } else if (k === 'photos' && v.size > 0) {
          files.push(v);
        }
      }
    }
  } catch {
    return fail(400, { error: 'We couldn’t read that form. Please try again.' });
  }

  // ── spam: honeypot ──
  if (String(raw.company || '').trim() !== '') {
    console.warn('[book] honeypot tripped');
    return fail(400, { error: 'Sorry, that didn’t go through.' });
  }

  // ── spam: time-trap (only when the browser stamped the start time) ──
  const started = Number(raw.t || 0);
  if (started && Date.now() - started < MIN_FILL_MS) {
    console.warn('[book] time-trap tripped');
    return fail(400, { error: 'That was quick. Too quick for a human, we think. Please try again.' });
  }

  // ── spam: rate limit per IP ──
  const ip = context?.ip || req.headers.get('x-nf-client-connection-ip') || 'unknown';
  const ipHash = createHash('sha256').update(`lm:${ip}`).digest('hex').slice(0, 24);
  try {
    const limits = getStore('ratelimit');
    const now = Date.now();
    const seen = ((await limits.get(ipHash, { type: 'json' })) || []).filter((t) => now - t < 3600_000);
    if (seen.length >= RATE_LIMIT) return fail(429, { error: 'Too many bookings from here in the last hour. Please message us on WhatsApp instead.' });
    seen.push(now);
    await limits.setJSON(ipHash, seen);
  } catch (err) {
    console.error('[book] rate limit store unavailable', err);
  }

  // ── spam: Cloudflare Turnstile, only if configured ──
  const turnstileSecret = env('TURNSTILE_SECRET');
  if (turnstileSecret) {
    const token = String(raw['cf-turnstile-response'] || '');
    const ok = await verifyTurnstile(turnstileSecret, token, ip);
    if (!ok) return fail(400, { error: 'Please complete the check at the bottom of the form.' });
  }

  // ── validate ──
  const result = validateBooking(raw);
  const photoErrors = checkPhotos(files);
  if (!result.ok || photoErrors) {
    const errors = { ...(result.ok ? {} : result.errors), ...(photoErrors ? { photos: photoErrors } : {}) };
    const firstStep = Math.min(...Object.keys(errors).map((k) => FIELD_STEP[k] ?? 7));
    return fail(400, { errors, step: firstStep });
  }
  const b = result.booking;

  // ── save first ──
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const key = `${createdAt.replace(/[:.]/g, '-')}_${id.slice(0, 8)}`;
  const photos = [];
  let emailed = false;
  try {
    const photoStore = getStore('booking-photos');
    for (const [i, f] of files.entries()) {
      const buf = Buffer.from(await f.arrayBuffer());
      const ext = f.type === 'image/png' ? 'png' : f.type.includes('hei') ? 'heic' : 'jpg';
      const pkey = `${key}/${i + 1}.${ext}`;
      await photoStore.set(pkey, buf, { metadata: { type: f.type, name: f.name } });
      photos.push({ key: pkey, filename: `${b.makeModel.replace(/[^\w]+/g, '-')}-${i + 1}.${ext}`, type: f.type, content: buf.toString('base64') });
    }
    await getStore('bookings').setJSON(key, {
      id,
      createdAt,
      ...b,
      photos: photos.map((p) => p.key),
      ipHash,
      userAgent: (req.headers.get('user-agent') || '').slice(0, 200),
      status: 'new',
    });
  } catch (err) {
    // Saving failed. This is the one case we must not pretend all is well.
    console.error('[book] could not save booking', err);
    await alert(`⚠️ LM booking could NOT be saved (${b.name}, ${b.phone}). Error: ${err?.message || err}`);
    emailed = await sendBusinessEmail(b, photos, createdAt).catch(() => false);
    if (!emailed) return fail(500, { error: 'Something went wrong on our side. Please message us on WhatsApp instead.' });
  }

  // ── tell the business, the customer and the phone ──
  if (!emailed) {
    try {
      emailed = await sendBusinessEmail(b, photos, createdAt);
    } catch (err) {
      console.error('[book] business email failed', err);
    }
  }
  if (b.email) {
    try {
      await sendAutoReply(b);
    } catch (err) {
      console.error('[book] auto-reply failed', err);
    }
  }
  await alert(
    `🧽 New LM booking: ${serviceName(b.service)} · ${b.makeModel} · ${b.postcode}${b.outsideAB ? ' (outside AB)' : ''} · ${b.quotedTotal} · ${b.name} ${b.phone}` +
      (emailed ? '' : ' · ⚠️ email NOT sent, check the bookings export'),
  );

  if (wantsJson) return Response.json({ ok: true, id });
  return new Response(null, { status: 303, headers: { Location: '/thank-you/' } });
};

// ─────────────────────────────────────────────────────────────────────────────

function checkPhotos(files) {
  if (files.length > MAX_PHOTOS) return `Up to ${MAX_PHOTOS} photos, please.`;
  for (const f of files) {
    const type = (f.type || '').toLowerCase();
    const okType = PHOTO_TYPES.includes(type) || /\.(heic|heif)$/i.test(f.name || '');
    if (!okType) return 'Photos need to be JPEG, PNG or HEIC.';
    if (f.size > MAX_PHOTO_BYTES) return 'Each photo needs to be under 4 MB. Try a smaller one.';
  }
  return null;
}

async function verifyTurnstile(secret, token, ip) {
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const j = await r.json();
    return !!j.success;
  } catch (err) {
    console.error('[book] turnstile verify failed', err);
    return false;
  }
}

const serviceName = (id) => services.find((s) => s.id === id)?.name ?? id;
const sizeName = (id) => sizes.find((z) => z.id === id)?.name ?? id;
const extraNames = (ids) => extras.filter((e) => ids.includes(e.id)).map((e) => `${e.name} (£${e.price})`);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

async function resend(payload) {
  const key = env('RESEND_API_KEY');
  if (!key) {
    console.warn('[book] RESEND_API_KEY not set, skipping email');
    return false;
  }
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return true;
}

function sendBusinessEmail(b, photos, createdAt) {
  const to = env('BOOKING_TO_EMAIL', 'itsprimopartners@gmail.com');
  const from = env('BOOKING_FROM_EMAIL', 'onboarding@resend.dev');
  const first = b.name.split(/\s+/)[0];
  const svc = serviceName(b.service);
  const waText = `Hi ${first}, it's LM Auto Care about your ${svc} for the ${b.makeModel}. `;
  const waHref = `https://wa.me/${waNumber(b.phone)}?text=${encodeURIComponent(waText)}`;
  const telHref = `tel:+${waNumber(b.phone)}`;
  const when = new Date(createdAt).toLocaleString('en-GB', { timeZone: 'Europe/London', dateStyle: 'medium', timeStyle: 'short' });

  const rows = [
    ['Name', b.name],
    ['Phone', b.phone],
    ['Email', b.email || '—'],
    ['Car', `${b.makeModel}${b.registration ? ` (${b.registration})` : ''}`],
    ['Service', svc],
    ['Size', sizeName(b.vehicleSize)],
    ['Extras', extraNames(b.extras).join(', ') || 'None'],
    ['Quoted total', b.quotedTotal],
    ['Type', b.serviceType === 'drop-off' ? 'Drop-off' : 'Mobile (at their location)'],
    ['Postcode', b.outsideAB ? `${b.postcode}  ⚠️ not an AB postcode, check you cover it` : b.postcode],
    ['Preferred day', b.preferredDay || '—'],
    ['Preferred time', b.preferredTime || '—'],
    ['Notes', b.notes || '—'],
    ['Heard about us', b.howHeard || '—'],
    ['Photos', photos.length ? `${photos.length} attached` : 'None'],
    ['Sent', when],
    ['From page', b.pageUrl || '—'],
    ['Referrer', b.referrer || '—'],
    ['UTM', [b.utm_source, b.utm_medium, b.utm_campaign, b.utm_term, b.utm_content].filter(Boolean).join(' / ') || '—'],
    ['gclid', b.gclid || '—'],
  ];

  const btn = (href, label, bg) =>
    `<a href="${esc(href)}" style="display:inline-block;background:${bg};color:#fff;font:600 18px/1 Arial,sans-serif;padding:16px 22px;text-decoration:none;border-radius:3px;margin:0 8px 8px 0">${esc(label)}</a>`;

  const html = `<!doctype html><html><body style="margin:0;background:#F3F1EC;padding:24px;font-family:Georgia,serif;color:#121417">
  <div style="max-width:620px;margin:0 auto;background:#fff;border:1px solid #121417;padding:24px">
    <p style="font:12px/1.4 monospace;letter-spacing:.06em;text-transform:uppercase;color:#5d626a;margin:0 0 6px">New booking · ${esc(when)}</p>
    <h1 style="font:800 24px/1.15 Arial,sans-serif;margin:0 0 6px">${esc(svc)} · ${esc(b.makeModel)}</h1>
    <p style="font:700 28px/1 monospace;color:#0B5FC2;margin:8px 0 18px">${esc(b.quotedTotal)}</p>
    <p style="margin:0 0 18px">${btn(waHref, `WhatsApp ${first}`, '#1B1E22')}${btn(telHref, `Call ${first}`, '#0B5FC2')}</p>
    <table cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:15px">
      ${rows.map(([k, v]) => `<tr><td style="border-top:1px solid #E7E4DC;color:#5d626a;font:12px monospace;text-transform:uppercase;letter-spacing:.05em;width:34%;vertical-align:top">${esc(k)}</td><td style="border-top:1px solid #E7E4DC;vertical-align:top">${esc(v)}</td></tr>`).join('')}
    </table>
  </div></body></html>`;

  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nWhatsApp: ${waHref}\nCall: ${telHref}`;
  const payload = {
    from: `LM Auto Care website <${from}>`,
    to: to.split(',').map((s) => s.trim()).filter(Boolean),
    subject: `🧽 New booking: ${svc} · ${b.makeModel} · ${b.postcode} · ${b.quotedTotal}`,
    html,
    text,
    attachments: photos.map((p) => ({ filename: p.filename, content: p.content })),
  };
  if (b.email) payload.reply_to = b.email;
  return resend(payload);
}

function sendAutoReply(b) {
  const from = env('BOOKING_FROM_EMAIL', 'onboarding@resend.dev');
  const first = b.name.split(/\s+/)[0];
  const svc = serviceName(b.service);
  const ex = extraNames(b.extras);
  const text = [
    `Hi ${first},`,
    '',
    `Thanks for your booking request. Here's what you asked for:`,
    '',
    `  ${svc} for your ${b.makeModel}`,
    `  Size: ${sizeName(b.vehicleSize)}`,
    `  Extras: ${ex.length ? ex.join(', ') : 'none'}`,
    `  ${b.serviceType === 'drop-off' ? 'Drop-off' : `Mobile, at ${b.postcode}`}`,
    `  Quoted price: ${b.quotedTotal}`,
    '',
    `We'll message you on WhatsApp to confirm a time. ${expectations.replyTime}`,
    '',
    `A reminder: ${expectations.waterPowerPlain}`,
    '',
    `If anything's changed, or it's urgent, message us: ${waLink('Hi LM Auto Care, about my booking: ')}`,
    `or call ${business.phoneDisplay}.`,
    '',
    'Cheers,',
    business.ownerName ?? 'LM Auto Care',
    `${business.name} · Mobile valeting, ${business.areaLine}`,
  ].join('\n');
  return resend({
    from: `${business.name} <${from}>`,
    to: [b.email],
    reply_to: business.email,
    subject: `Got your booking: ${svc}, ${b.quotedTotal}`,
    text,
  });
}

async function alert(line) {
  const url = env('NOTIFY_WEBHOOK_URL');
  if (!url) return;
  try {
    // Discord reads "content"; Slack and Google Chat read "text".
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: line, text: line }) });
  } catch (err) {
    console.error('[book] webhook failed', err);
  }
}

function errorPage(body) {
  const list = body.errors ? Object.values(body.errors).map((m) => `<li>${esc(m)}</li>`).join('') : `<li>${esc(body.error || 'Something went wrong.')}</li>`;
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Check your booking | LM Auto Care</title>
<style>body{font:18px/1.6 Georgia,serif;background:#F3F1EC;color:#121417;margin:0;padding:2rem 1rem}main{max-width:36rem;margin:0 auto}h1{font:800 italic 2rem/1.1 Arial,sans-serif}li{margin:.4rem 0}a{color:#0B5FC2}</style></head>
<body><main><h1>Nearly. A couple of things to fix:</h1><ul>${list}</ul>
<p>Use your browser’s back button to fix them (your answers should still be there), <a href="/book/">start the form again</a>, or <a href="${esc(waLink("Hi LM Auto Care, I tried to book on the website. "))}">send it on WhatsApp instead</a>.</p></main></body></html>`;
}
