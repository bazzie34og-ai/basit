/**
 * POST /api/quote: the lead pipeline.
 *
 * 1. Parse JSON (fetch from the form script) or a normal form POST (no JS).
 * 2. Spam checks: honeypot, time-trap, optional Turnstile, per-IP rate limit (5/hour, Netlify Blobs).
 * 3. Validate on the server; return field-level errors.
 * 4. Save the lead to Netlify Blobs BEFORE emailing, so no lead is ever lost.
 * 5. Email the business (Resend), auto-reply to the customer if they gave an email,
 *    and optionally ping a chat webhook (Discord / Slack / Google Chat).
 */
import { getStore } from '@netlify/blobs';
import {
  business, contactOptions, howHeardOptions, packageOptions, replyPromise, vehicleAges, PREVIEW_MODE,
} from '../../src/config/site.ts';

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const MIN_ELAPSED_MS = 3000;

const env = (k, fallback = '') => (globalThis.Netlify?.env.get(k) ?? process.env[k] ?? fallback) || fallback;

const LIMITS = {
  name: 80, phone: 20, suburb: 60, vehicle: 80, vehicleAge: 40, email: 120, package: 60, preferredContact: 10,
  bestTime: 60, message: 1000, howHeard: 30, pageUrl: 300, referrer: 300, utm_source: 100, utm_medium: 100,
  utm_campaign: 150, gclid: 200, submittedAt: 40,
};

const clean = (v, max) =>
  String(v ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim()
    .slice(0, max);

/** Remove anything that looks like a link from free text. */
const stripLinks = (s) =>
  s
    .replace(/\b(?:https?:\/\/|www\.)\S+/gi, '[link removed]')
    .replace(/\b[a-z0-9-]+\.(?:com|net|org|ru|xyz|info|biz|io|co|top|site|online)(?:\/\S*)?\b/gi, '[link removed]');

/** Normalise an Australian phone number. Returns null when invalid. */
export function normalisePhone(raw) {
  let d = String(raw).replace(/[^\d+]/g, '');
  if (d.startsWith('+61')) d = '0' + d.slice(3);
  else if (d.startsWith('61') && d.length === 11) d = '0' + d.slice(2);
  d = d.replace(/\D/g, '');
  if (/^0[2378]\d{8}$/.test(d)) return { digits: d, display: `(${d.slice(0, 2)}) ${d.slice(2, 6)} ${d.slice(6)}` };
  if (/^04\d{8}$/.test(d)) return { digits: d, display: `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}` };
  if (/^1[38]00\d{6}$/.test(d)) return { digits: d, display: `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}` };
  if (/^13\d{4}$/.test(d)) return { digits: d, display: `${d.slice(0, 2)} ${d.slice(2)}` };
  return null;
}

export function validate(input) {
  const v = {};
  for (const [k, max] of Object.entries(LIMITS)) v[k] = clean(input[k], max);
  v.message = stripLinks(v.message);
  const errors = {};

  if (v.name.length < 2) errors.name = 'Please tell us your name.';
  else if (/https?:|www\./i.test(v.name)) errors.name = 'Please enter just your name.';

  const phone = normalisePhone(v.phone);
  if (!v.phone) errors.phone = 'Please enter a phone number so we can call you back.';
  else if (!phone) errors.phone = 'That doesn’t look like an Australian number. Try 04xx xxx xxx or (07) xxxx xxxx.';
  else v.phone = phone.display;
  v.phoneDigits = phone?.digits ?? '';

  if (v.suburb.length < 2) errors.suburb = 'Which suburb is the car in?';
  if (v.vehicle.length < 2) errors.vehicle = 'Tell us the make and model, e.g. 2025 Toyota Prado.';
  if (!vehicleAges.includes(v.vehicleAge)) errors.vehicleAge = 'Please choose how old the car is.';

  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) errors.email = 'That email address doesn’t look right.';
  if (v.package && !packageOptions.includes(v.package)) errors.package = 'Please choose a package from the list.';
  if (v.preferredContact && !contactOptions.includes(v.preferredContact)) v.preferredContact = '';
  if (v.howHeard && !howHeardOptions.includes(v.howHeard)) v.howHeard = '';
  if (input.message && String(input.message).length > LIMITS.message) errors.message = `Please keep your message under ${LIMITS.message} characters.`;

  return { values: v, errors };
}

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

/** One blob per submission under the IP-hash prefix; count the recent ones. No read-modify-write counters. */
async function rateLimited(ipHash) {
  const store = getStore({ name: 'ratelimit', consistency: 'strong' });
  const now = Date.now();
  const { blobs } = await store.list({ prefix: `${ipHash}/` });
  let recent = 0;
  await Promise.all(
    blobs.map(async (b) => {
      const t = Number(b.key.split('/')[1]);
      if (now - t < RATE_WINDOW_MS) recent++;
      else await store.delete(b.key);
    }),
  );
  if (recent >= RATE_LIMIT) return true;
  await store.set(`${ipHash}/${now}`, '1');
  return false;
}

async function verifyTurnstile(token, ip) {
  const secret = env('TURNSTILE_SECRET');
  if (!secret) return true; // optional: skip gracefully when not configured
  if (!token) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret, response: token, remoteip: ip || '' }),
  });
  const json = await res.json().catch(() => ({}));
  return json.success === true;
}

function row(label, value) {
  return `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #e3e9f1;color:#5a6676;font:600 13px Arial,sans-serif;white-space:nowrap;vertical-align:top">${esc(label)}</th><td style="padding:8px 12px;border-bottom:1px solid #e3e9f1;font:14px Arial,sans-serif;color:#05070B">${esc(value) || '<span style="color:#98a3b3">—</span>'}</td></tr>`;
}

function businessEmail(lead) {
  const v = lead;
  const pkg = v.package || 'No package chosen';
  const subject = `🔷 New quote: ${v.vehicle} in ${v.suburb} (${pkg})`;
  const source = [v.howHeard && `Heard via: ${v.howHeard}`, v.utm_source && `utm: ${v.utm_source}/${v.utm_medium}/${v.utm_campaign}`, v.gclid && 'Google Ads click (gclid)', v.referrer && `Referrer: ${v.referrer}`]
    .filter(Boolean)
    .join(' · ') || 'Direct / unknown';
  const html = `<!doctype html><html><body style="margin:0;background:#F3F6FA;padding:24px">
  <table role="presentation" width="100%" style="max-width:620px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #d5dde8">
    <tr><td style="background:#05070B;padding:20px 24px;font:800 20px Arial,sans-serif;color:#F3F6FA;letter-spacing:.04em">DIAMOND PLATE · NEW QUOTE REQUEST</td></tr>
    <tr><td style="padding:24px">
      <p style="margin:0 0 6px;font:600 14px Arial,sans-serif;color:#5a6676">Call ${esc(v.name)} now:</p>
      <p style="margin:0 0 20px"><a href="tel:${esc(v.phoneDigits)}" style="display:inline-block;background:#1F5BFF;color:#fff;text-decoration:none;font:700 24px Arial,sans-serif;padding:14px 22px;border-radius:10px">📞 ${esc(v.phone)}</a></p>
      <table role="presentation" width="100%" style="border-collapse:collapse">
        ${row('Name', v.name)}${row('Phone', v.phone)}${row('Email', v.email)}${row('Suburb', v.suburb)}
        ${row('Vehicle', v.vehicle)}${row('Vehicle age', v.vehicleAge)}${row('Package', v.package)}
        ${row('Preferred contact', v.preferredContact)}${row('Best time', v.bestTime)}${row('Message', v.message)}
        ${row('How heard', v.howHeard)}${row('Lead source', source)}${row('Page', v.pageUrl)}${row('Referrer', v.referrer)}
        ${row('utm_source', v.utm_source)}${row('utm_medium', v.utm_medium)}${row('utm_campaign', v.utm_campaign)}${row('gclid', v.gclid)}
        ${row('Submitted', new Date(v.receivedAt).toLocaleString('en-AU', { timeZone: 'Australia/Brisbane' }))}${row('Lead id', v.id)}
      </table>
      <p style="margin:20px 0 0;font:13px Arial,sans-serif;color:#5a6676">Reply promise on the site: “${esc(replyPromise)}.” Saved to Netlify Blobs (store “leads”).</p>
    </td></tr>
  </table></body></html>`;
  const text = `New quote request\n\nCall: ${v.phone}\nName: ${v.name}\nEmail: ${v.email}\nSuburb: ${v.suburb}\nVehicle: ${v.vehicle} (${v.vehicleAge})\nPackage: ${pkg}\nPreferred contact: ${v.preferredContact}\nBest time: ${v.bestTime}\nMessage: ${v.message}\n\nSource: ${source}\nPage: ${v.pageUrl}`;
  return { subject, html, text };
}

function customerEmail(lead, siteUrl) {
  const first = lead.name.split(/\s+/)[0];
  const aftercare = `${siteUrl}/guides/ceramic-coating-aftercare/`;
  const subject = `We’ve got your request, ${first}`;
  const html = `<!doctype html><html><body style="margin:0;background:#05070B;padding:24px">
  <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#0C1118;border:1px solid #1F2A38;border-radius:14px">
    <tr><td style="padding:28px 28px 8px;font:800 22px Arial,sans-serif;letter-spacing:.06em;color:#F3F6FA">DIAMOND PLATE</td></tr>
    <tr><td style="padding:0 28px 28px;font:16px/1.6 Arial,sans-serif;color:#C7D2E0">
      <p style="color:#F3F6FA">Thanks ${esc(first)}, we’ve got your request for your ${esc(lead.vehicle)}. We’ll be in touch within 1 business hour (Mon–Fri) from <strong style="color:#F3F6FA">${esc(business.phone.display)}</strong>.</p>
      <p style="margin:20px 0 8px;color:#F3F6FA;font-weight:700">What happens next</p>
      <ol style="padding-left:20px;margin:0">
        <li>We call or text you to confirm your package and fixed price.</li>
        <li>We book a day, at your home or work. We come to you.</li>
        <li>A trained applicator coats the car and walks you through the aftercare.</li>
      </ol>
      <p style="margin:24px 0"><a href="${aftercare}" style="display:inline-block;background:#38C8FF;color:#05070B;text-decoration:none;font:700 15px Arial,sans-serif;padding:12px 18px;border-radius:999px">Read the aftercare guide</a></p>
      <p style="font-size:13px;color:#8d9bb0;margin:0">${esc(business.name)} · ${esc(business.address.oneLine)} · <a href="${business.phone.tel}" style="color:#38C8FF">${esc(business.phone.display)}</a></p>
    </td></tr>
  </table></body></html>`;
  const text = `Thanks ${first}, we've got your request for your ${lead.vehicle}. We'll be in touch within 1 business hour (Mon–Fri) from ${business.phone.display}.\n\nWhat happens next:\n1. We call or text you to confirm your package and fixed price.\n2. We book a day, at your home or work. We come to you.\n3. A trained applicator coats the car and walks you through the aftercare.\n\nAftercare guide: ${aftercare}\n\n${business.name}, ${business.address.oneLine}`;
  return { subject, html, text };
}

async function sendResend(payload) {
  const key = env('RESEND_API_KEY');
  if (!key) throw new Error('RESEND_API_KEY is not set');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

async function notifyWebhook(text) {
  const url = env('NOTIFY_WEBHOOK_URL');
  if (!url) return;
  // `content` is read by Discord, `text` by Slack and Google Chat.
  await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: text, text }) });
}

function htmlErrorPage(errors) {
  const items = Object.values(errors).map((e) => `<li>${esc(e)}</li>`).join('');
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Please check your details | ${esc(business.name)}</title>
  <style>body{margin:0;background:#05070B;color:#F3F6FA;font:17px/1.6 system-ui,sans-serif;padding:48px 16px}main{max-width:620px;margin:0 auto}h1{font-size:2rem;margin:0 0 12px}li{color:#FF5A5F;margin:6px 0}a{color:#38C8FF}.btn{display:inline-block;margin-top:20px;padding:14px 22px;border-radius:999px;background:#38C8FF;color:#05070B;font-weight:700;text-decoration:none}</style></head>
  <body><main><h1>Please check your details</h1><p>We couldn’t send your request yet:</p><ul>${items}</ul>
  <a class="btn" href="javascript:history.back()">Go back and fix it</a>
  <p>Or call us on <a href="${business.phone.tel}">${esc(business.phone.display)}</a>.</p></main></body></html>`;
}

export default async (req, context) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });

  const type = req.headers.get('content-type') || '';
  const wantsJson = type.includes('application/json') || (req.headers.get('accept') || '').includes('application/json');
  const reply = (status, body) =>
    wantsJson
      ? Response.json(body, { status })
      : status === 200
        ? new Response(null, { status: 303, headers: { Location: '/thank-you/' } })
        : new Response(htmlErrorPage(body.errors || { form: body.message || 'Something went wrong.' }), { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });

  let input = {};
  try {
    if (type.includes('application/json')) input = await req.json();
    else input = Object.fromEntries((await req.formData()).entries());
  } catch {
    return reply(400, { ok: false, message: 'We couldn’t read that submission.' });
  }
  if (typeof input !== 'object' || input === null) return reply(400, { ok: false, message: 'Bad request.' });

  // Spam: honeypot.
  if (String(input.website || '').trim()) {
    console.warn('quote: honeypot triggered');
    return reply(400, { ok: false, message: 'Submission rejected.' });
  }
  // Spam: time-trap (only measurable when JS ran; no-JS posts rely on the honeypot + rate limit).
  const elapsed = Number(input.elapsed);
  const jsEnabled = input.elapsed !== undefined && input.elapsed !== '';
  if (jsEnabled && (!Number.isFinite(elapsed) || elapsed < MIN_ELAPSED_MS)) {
    console.warn('quote: time-trap triggered', elapsed);
    return reply(400, { ok: false, message: 'That was a little quick. Please try again.' });
  }

  const ip = context?.ip || req.headers.get('x-nf-client-connection-ip') || '';
  if (!(await verifyTurnstile(input['cf-turnstile-response'], ip))) {
    return reply(400, { ok: false, message: 'Please complete the security check and try again.' });
  }

  const { values, errors } = validate(input);
  if (Object.keys(errors).length) return reply(422, { ok: false, errors });

  const ipHash = await sha256(`${ip}|${env('RATE_LIMIT_SALT', 'dp-brisbane')}`);
  try {
    if (await rateLimited(ipHash)) {
      return reply(429, { ok: false, message: `Too many requests from this connection. Please call us on ${business.phone.display}.` });
    }
  } catch (e) {
    console.error('quote: rate limit check failed (continuing)', e);
  }

  const receivedAt = new Date().toISOString();
  const id = `${receivedAt}-${crypto.randomUUID().slice(0, 8)}`;
  const lead = { id, receivedAt, ...values, jsEnabled, ipHash, preview: PREVIEW_MODE };

  // 1. Save first. If this fails, tell the user to call: never pretend a lost lead was received.
  const leads = getStore({ name: 'leads', consistency: 'strong' });
  try {
    await leads.setJSON(id, lead);
  } catch (e) {
    console.error('quote: failed to save lead', e);
    await notifyWebhook(`⚠️ Lead could NOT be saved: ${values.name} ${values.phone} (${values.vehicle}, ${values.suburb}). ${e}`).catch(() => {});
    return reply(500, { ok: false, message: `Sorry, something went wrong. Please call us on ${business.phone.display}.` });
  }

  // 2. Email + alerts. Failures are logged and reported, but the lead is safe in Blobs.
  const to = env('LEAD_TO_EMAIL', PREVIEW_MODE ? 'itsprimopartners@gmail.com' : business.email);
  const from = env('LEAD_FROM_EMAIL', 'Diamond Plate Leads <onboarding@resend.dev>');
  const siteUrl = (env('SITE_URL') || env('URL') || new URL(req.url).origin).replace(/\/+$/, '');
  const problems = [];

  const biz = businessEmail(lead);
  try {
    await sendResend({ from, to: to.split(',').map((s) => s.trim()), subject: biz.subject, html: biz.html, text: biz.text, ...(lead.email ? { reply_to: lead.email } : {}) });
  } catch (e) {
    console.error('quote: business email failed', e);
    problems.push(`business email failed: ${e.message}`);
  }

  if (lead.email) {
    const cust = customerEmail(lead, siteUrl);
    try {
      await sendResend({ from, to: [lead.email], subject: cust.subject, html: cust.html, text: cust.text, reply_to: business.email });
    } catch (e) {
      console.error('quote: auto-reply failed', e);
      problems.push(`auto-reply failed: ${e.message}`);
    }
  }

  try {
    await notifyWebhook(
      `🔷 New quote: ${lead.vehicle} in ${lead.suburb} (${lead.package || 'no package'}) · ${lead.name} ${lead.phone}` +
        (problems.length ? `\n⚠️ ${problems.join(' | ')} (lead saved in Blobs: ${id})` : ''),
    );
  } catch (e) {
    console.error('quote: webhook failed', e);
  }

  if (problems.length) await leads.setJSON(id, { ...lead, emailProblems: problems }).catch(() => {});
  return reply(200, { ok: true });
};

export const config = { path: '/api/quote', method: ['POST'] };
