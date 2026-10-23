/**
 * POST /api/book
 * Booking requests from the website. Order of work:
 *   1. spam checks (honeypot, time-trap, rate limit, optional Turnstile)
 *   2. validate
 *   3. SAVE TO NETLIFY BLOBS FIRST, so nothing is ever lost
 *   4. email Chris (Resend) with photos attached, auto-reply to the customer,
 *      optional one-line webhook alert
 * Works with fetch (JSON response) and with a plain no-JS form post (303 redirect).
 */
import type { Config, Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { validateBooking, bookingSummaryText, ukPhoneToWhatsapp, LIMITS, type CleanBooking } from '../../src/lib/booking.ts';
import { estimate, estimateShort } from '../../src/lib/estimate.ts';
import { business, phone, whatsappHref } from '../../src/config/site.ts';

const RATE_LIMIT = 5; // per IP per hour
const MIN_FILL_MS = 3000;

interface StoredBooking extends CleanBooking {
  id: string;
  createdAt: string;
  estimate: string;
  estimateLabel: string;
  pageUrl: string;
  utm: Record<string, string>;
  photoKeys: string[];
  ipHash: string;
  email_status?: string;
}

export default async (req: Request, context: Context) => {
  const wantsJson = (req.headers.get('accept') || '').includes('application/json');
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });

  let fields: Record<string, string> = {};
  let files: File[] = [];
  try {
    const ct = req.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const body = await req.json();
      for (const [k, v] of Object.entries(body || {})) if (typeof v === 'string') fields[k] = v;
    } else {
      const fd = await req.formData();
      fd.forEach((v, k) => {
        if (typeof v === 'string') fields[k] = v;
        else if (k === 'photos' && v.size > 0) files.push(v);
      });
    }
  } catch {
    return fail(400, 'We couldn’t read that form. Please try again.', wantsJson);
  }

  // --- spam: honeypot. Pretend success so bots learn nothing. ---
  if (fields.company) return ok(wantsJson);

  // --- spam: time-trap ---
  const ts = Number(fields.ts || 0);
  if (!ts || Date.now() - ts < MIN_FILL_MS) {
    return fail(400, 'That was a bit quick! Please check your details and send again.', wantsJson);
  }

  // --- spam: rate limit by IP (kept in Blobs) ---
  const ipHash = await sha256((context.ip || req.headers.get('x-nf-client-connection-ip') || 'unknown') + (Netlify.env.get('RATE_SALT') || 'ss'));
  const rl = getStore({ name: 'booking-ratelimit', consistency: 'strong' });
  const hour = new Date().toISOString().slice(0, 13);
  const rlKey = `${hour}/${ipHash}`;
  const count = Number((await rl.get(rlKey)) || 0);
  if (count >= RATE_LIMIT) {
    return fail(429, `Too many requests from here. Please WhatsApp or call Chris on ${phone} instead.`, wantsJson);
  }
  await rl.set(rlKey, String(count + 1));

  // --- spam: optional Turnstile ---
  const turnstileSecret = Netlify.env.get('TURNSTILE_SECRET');
  if (turnstileSecret) {
    const token = fields['cf-turnstile-response'] || '';
    const v = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: turnstileSecret, response: token, remoteip: context.ip || '' }),
    }).then((r) => r.json()).catch(() => ({ success: false }));
    if (!v.success) return fail(400, 'Please complete the “I’m human” check and send again.', wantsJson);
  }

  // --- validate ---
  const result = validateBooking(fields);
  if (!result.ok) return fail(422, 'Please check the highlighted fields.', wantsJson, result.errors);
  const b = result.data;

  // --- photos: max 3, images only, size-capped ---
  files = files.filter((f) => f.type.startsWith('image/') && f.size <= LIMITS.photoBytes).slice(0, LIMITS.photos);

  const e = estimate(b.service, b.size);
  const id = `${new Date().toISOString().replace(/[:.]/g, '-')}-${crypto.randomUUID().slice(0, 8)}`;
  const utm: Record<string, string> = {};
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'landing', 'referrer']) {
    if (fields[k]) utm[k] = fields[k].slice(0, 200);
  }

  // --- 1. save first ---
  const store = getStore({ name: 'bookings', consistency: 'strong' });
  const photoStore = getStore({ name: 'booking-photos' });
  const photoKeys: string[] = [];
  const attachments: { filename: string; content: string }[] = [];
  for (const [i, f] of files.entries()) {
    const buf = await f.arrayBuffer();
    const key = `${id}/photo-${i + 1}.jpg`;
    await photoStore.set(key, buf, { metadata: { type: f.type, name: f.name } });
    photoKeys.push(key);
    attachments.push({ filename: `${b.name.replace(/\W+/g, '-')}-photo-${i + 1}.jpg`, content: toBase64(buf) });
  }
  const record: StoredBooking = {
    ...b,
    id,
    createdAt: new Date().toISOString(),
    estimate: estimateShort(e),
    estimateLabel: e.label,
    pageUrl: (fields.pageUrl || '').slice(0, 200),
    utm,
    photoKeys,
    ipHash: ipHash.slice(0, 16),
  };
  await store.setJSON(id, record);

  // --- 2. notify (failures here never lose the booking) ---
  const statuses: string[] = [];
  try {
    statuses.push(await sendOwnerEmail(record, attachments));
  } catch (err) {
    statuses.push(`owner:error:${(err as Error).message}`);
  }
  if (b.email) {
    try { statuses.push(await sendAutoReply(record)); } catch (err) { statuses.push(`reply:error:${(err as Error).message}`); }
  }
  const hook = Netlify.env.get('NOTIFY_WEBHOOK_URL');
  if (hook) {
    const line = `New booking: ${b.serviceLabel} · ${b.vehicle} · ${b.postcode} · est. £${record.estimate} · ${b.name} ${b.phone}`;
    try {
      await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: line, content: line }) });
      statuses.push('webhook:sent');
    } catch { statuses.push('webhook:error'); }
  }
  record.email_status = statuses.join(' | ');
  await store.setJSON(id, record).catch(() => {});

  return ok(wantsJson);
};

export const config: Config = { path: '/api/book' };

// ---------------------------------------------------------------------------

function ok(json: boolean) {
  if (json) return Response.json({ ok: true, redirect: '/thank-you/' });
  return new Response(null, { status: 303, headers: { Location: '/thank-you/' } });
}

function fail(status: number, message: string, json: boolean, errors?: Record<string, string>) {
  if (json) return Response.json({ ok: false, message, errors }, { status });
  const list = errors ? Object.values(errors).map((m) => `<li>${esc(m)}</li>`).join('') : '';
  const page = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Please check your booking | Smith &amp; Shine</title>
<style>body{font-family:system-ui,sans-serif;background:#F6F1E7;color:#17181B;margin:0;padding:2rem 1rem;line-height:1.6}main{max-width:34rem;margin:0 auto}h1{font-family:Georgia,serif}li{color:#8E3B2B;font-weight:700}a{color:#17181B}.b{display:inline-block;background:#C9A24B;color:#1E1F23;padding:.8rem 1.2rem;font-weight:700;text-decoration:none;margin-top:1rem}</style></head>
<body><main><h1>Nearly there</h1><p>${esc(message)}</p>${list ? `<ul>${list}</ul>` : ''}
<p><a class="b" href="javascript:history.back()">Go back and fix it</a></p>
<p>Or WhatsApp or call Chris on <a href="tel:${esc(phone.replace(/\s/g, ''))}">${esc(phone)}</a>.</p></main></body></html>`;
  return new Response(page, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

async function sha256(s: string) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(d)).map((x) => x.toString(16).padStart(2, '0')).join('');
}

function toBase64(buf: ArrayBuffer) {
  return Buffer.from(buf).toString('base64');
}

async function resend(payload: Record<string, unknown>) {
  const key = Netlify.env.get('RESEND_API_KEY');
  if (!key) return 'skipped:no-key';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`resend ${res.status} ${(await res.text()).slice(0, 200)}`);
  return 'sent';
}

function fromAddress() {
  return `${business.name} website <${Netlify.env.get('BOOKING_FROM_EMAIL') || 'onboarding@resend.dev'}>`;
}

async function sendOwnerEmail(r: StoredBooking, attachments: { filename: string; content: string }[]) {
  const to = Netlify.env.get('BOOKING_TO_EMAIL');
  if (!to) return 'owner:skipped:no-to';
  const subject = `New booking: ${r.serviceLabel} · ${r.vehicle} · ${r.postcode} · est. £${r.estimate}`;
  const first = r.name.split(' ')[0];
  const reply = `Hi ${first}, it’s Chris from Smith & Shine. Thanks for your booking request for a ${r.serviceLabel.toLowerCase()} on your ${r.vehicle}. `;
  const waLink = `https://wa.me/${ukPhoneToWhatsapp(r.phone)}?text=${encodeURIComponent(reply)}`;
  const rows: [string, string][] = [
    ['Service', r.serviceLabel],
    ['Estimate', r.estimateLabel],
    ['Vehicle', `${r.vehicle} (${r.sizeLabel})`],
    ['Postcode', r.postcodeLocal ? r.postcode : `${r.postcode}  ⚠️ OUTSIDE TF/SY/WV, check distance`],
    ['Name', r.name],
    ['Phone', r.phone],
    ['Email', r.email || '–'],
    ['Preferred day', r.preferredDay || '–'],
    ['Notes', r.notes || '–'],
    ['Photos', r.photoKeys.length ? `${r.photoKeys.length} attached` : 'none'],
    ['How they heard', r.howHeard || '–'],
    ['Booked from', r.pageUrl || '–'],
    ['Source', Object.entries(r.utm).map(([k, v]) => `${k}=${v}`).join(', ') || '–'],
    ['Ref', r.id],
  ];
  const html = `<!doctype html><html><body style="margin:0;background:#F6F1E7;font-family:Arial,sans-serif;color:#17181B">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F1E7;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-top:4px solid #C9A24B">
<tr><td style="background:#1E1F23;color:#F6F1E7;padding:20px 24px;font-family:Georgia,serif;font-size:22px">New booking request<br><span style="font-size:15px;color:#E9C877">${esc(r.serviceLabel)} · ${esc(r.postcode)} · est. £${esc(r.estimate)}</span></td></tr>
<tr><td style="padding:20px 24px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;border-collapse:collapse">
${rows.map(([k, v], i) => `<tr style="background:${i % 2 ? '#fff' : '#F6F1E7'}"><td style="padding:9px 10px;font-weight:bold;width:34%;vertical-align:top">${esc(k)}</td><td style="padding:9px 10px;white-space:pre-wrap">${esc(v)}</td></tr>`).join('')}
</table>
<p style="margin:22px 0 8px">
<a href="${waLink}" style="display:inline-block;background:#C9A24B;color:#1E1F23;padding:12px 18px;font-weight:bold;text-decoration:none;margin:0 8px 8px 0">WhatsApp ${esc(first)}</a>
<a href="tel:${esc(r.phone)}" style="display:inline-block;background:#1E1F23;color:#F6F1E7;padding:12px 18px;font-weight:bold;text-decoration:none;margin:0 8px 8px 0">Call ${esc(first)}</a>
</p>
<p style="font-size:12px;color:#4A4C52">Saved to Netlify Blobs as ${esc(r.id)}. Export everything at /api/bookings.csv.</p>
</td></tr></table></td></tr></table></body></html>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nWhatsApp: ${waLink}\nCall: tel:${r.phone}`;
  const status = await resend({
    from: fromAddress(),
    to: to.split(',').map((s) => s.trim()),
    reply_to: r.email || undefined,
    subject,
    html,
    text,
    attachments: attachments.length ? attachments : undefined,
  });
  return `owner:${status}`;
}

async function sendAutoReply(r: StoredBooking) {
  const first = r.name.split(' ')[0];
  const summary = bookingSummaryText({ ...r, estimateLabel: r.estimateLabel });
  const html = `<!doctype html><html><body style="margin:0;background:#F6F1E7;font-family:Arial,sans-serif;color:#17181B">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-top:4px solid #C9A24B">
<tr><td style="padding:24px;font-size:16px;line-height:1.6">
<p style="font-family:Georgia,serif;font-size:22px;margin:0 0 12px">Thanks ${esc(first)}, got it!</p>
<p>Your booking request is with me. ${esc(business.replyPromise)} I’ll be in touch to sort a day and confirm the price. The price I quote is the price you pay.</p>
<p>Here’s what you sent:</p>
<pre style="white-space:pre-wrap;font-family:Arial,sans-serif;background:#F6F1E7;padding:12px 14px;font-size:14px">${esc(summary)}</pre>
<p>Need me sooner? <a href="${whatsappHref(`Hi Chris, it’s ${first}. I’ve just sent a booking request.`)}" style="color:#17181B">WhatsApp me</a> or call ${esc(phone)}.</p>
<p>Kettle on standby. Cake optional, but noted.</p>
<p style="font-family:Georgia,serif;font-style:italic;font-size:20px;color:#8A6A1E;margin:18px 0 0">Chris</p>
<p style="font-size:13px;color:#4A4C52;margin:2px 0 0">${esc(business.name)} · ${esc(business.descriptor)}</p>
</td></tr></table></td></tr></table></body></html>`;
  const text = `Thanks ${first}, got it!\n\nYour booking request is with me. ${business.replyPromise} I’ll be in touch to sort a day and confirm the price.\n\n${summary}\n\nNeed me sooner? WhatsApp or call ${phone}.\n\nChris\n${business.name}`;
  const status = await resend({
    from: fromAddress(),
    to: [r.email],
    subject: `Thanks ${first}, your Smith & Shine booking request`,
    html,
    text,
  });
  return `reply:${status}`;
}
