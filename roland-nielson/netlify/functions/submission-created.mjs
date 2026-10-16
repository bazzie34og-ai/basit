// Runs automatically after every verified (non-spam) Netlify Forms submission.
// Texts Roland and emails him the lead. Each channel switches on once its
// environment variables are set in Netlify (Project configuration → Environment variables):
//
//   SMS (Twilio):  TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM (+1XXXXXXXXXX)
//   Email (Resend): RESEND_API_KEY, ALERT_EMAIL_FROM (e.g. "Website <alerts@rolandnielson.com>")
//   Optional overrides: ALERT_SMS_TO (default +14025770738), ALERT_EMAIL_TO (default roland@rolandnielson.com)
//
// Netlify's built-in form email notification works without any of this; this adds the text alert.

const env = (k, d = '') => process.env[k] || d;

const clean = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();

function summarize(d, siteUrl) {
  const lines = [
    `New coaching inquiry (${d.form_type === 'full' ? 'contact page' : 'quick form'})`,
    `Name: ${clean(d.name) || '—'}`,
    `Phone: ${clean(d.phone) || '—'}`,
    d.email && `Email: ${clean(d.email)}`,
    d.preferred_contact && `Prefers: ${clean(d.preferred_contact)}`,
    d.who_for && `For: ${clean(d.who_for)}`,
    d.session_pref && `Session: ${clean(d.session_pref)}`,
    d.best_time && `Best time: ${clean(d.best_time)}`,
    d.message && `Message: ${clean(d.message)}`,
    `Page: ${clean(d.source) || '/'}${d.utm_source ? ` (via ${clean(d.utm_source)}/${clean(d.utm_medium)})` : ''}`,
    siteUrl && `All leads: ${siteUrl}`,
  ];
  return lines.filter(Boolean).join('\n');
}

async function sendSms(body) {
  const sid = env('TWILIO_ACCOUNT_SID'), token = env('TWILIO_AUTH_TOKEN'), from = env('TWILIO_FROM');
  if (!sid || !token || !from) return 'sms: not configured';
  const text = body.length > 1500 ? `${body.slice(0, 1490)}…` : body;
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: env('ALERT_SMS_TO', '+14025770738'), From: from, Body: text }),
  });
  return `sms: ${res.status}${res.ok ? '' : ` ${await res.text()}`}`;
}

async function sendEmail(body, d) {
  const key = env('RESEND_API_KEY'), from = env('ALERT_EMAIL_FROM');
  if (!key || !from) return 'email: not configured';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [env('ALERT_EMAIL_TO', 'roland@rolandnielson.com')],
      subject: `New coaching inquiry: ${clean(d.name) || 'website visitor'}`,
      text: body,
      ...(d.email ? { reply_to: clean(d.email) } : {}),
    }),
  });
  return `email: ${res.status}${res.ok ? '' : ` ${await res.text()}`}`;
}

export const handler = async (event) => {
  let payload;
  try {
    ({ payload } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: 'bad payload' };
  }
  if (payload?.form_name !== 'coaching-inquiry') return { statusCode: 200, body: 'ignored' };
  const d = payload.data ?? {};
  if (d['bot-field']) return { statusCode: 200, body: 'honeypot' };
  const siteUrl = process.env.URL ? `https://app.netlify.com/projects/${process.env.SITE_NAME}/forms` : '';
  const body = summarize(d, siteUrl);
  const results = await Promise.allSettled([sendSms(body), sendEmail(body, d)]);
  const log = results.map((r) => (r.status === 'fulfilled' ? r.value : `error: ${r.reason}`)).join(' | ');
  console.log(`lead alert → ${log}`);
  return { statusCode: 200, body: log };
};
