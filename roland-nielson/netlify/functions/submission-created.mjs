// Runs automatically after every verified (non-spam) Netlify Forms submission.
//
// coaching-inquiry            → text + email Roland the lead.
// personal-patterns-assessment → validate and re-score on the server, send Roland a SHORT
//                                alert (full answers stay in the login-protected Netlify
//                                Forms dashboard), and email the participant their results
//                                only if they ticked "Email me a copy of my results".
//
// Each channel switches on once its environment variables are set in Netlify
// (Project configuration → Environment variables):
//   SMS (Twilio):   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM (+1XXXXXXXXXX)
//   Email (Resend): RESEND_API_KEY, ALERT_EMAIL_FROM (e.g. "Roland Nielson <hello@rolandnielson.com>")
//   Optional:       ALERT_SMS_TO (default +14025770738), ALERT_EMAIL_TO (default roland@rolandnielson.com)
//
// Netlify's built-in form email notification works without any of this.
import { FORM_NAME as ASSESSMENT_FORM, CATEGORIES, score, band } from '../../src/data/assessment.mjs';

const BOOKING = 'https://calendly.com/rolandnielson/free-20-minute-discovery-call';
const env = (k, d = '') => process.env[k] || d;
const clean = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();
const dashboard = () => (process.env.SITE_NAME ? `https://app.netlify.com/projects/${process.env.SITE_NAME}/forms` : '');

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

async function sendEmail({ to, subject, text, replyTo }) {
  const key = env('RESEND_API_KEY'), from = env('ALERT_EMAIL_FROM');
  if (!key || !from) return 'email: not configured';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  return `email(${to === env('ALERT_EMAIL_TO', 'roland@rolandnielson.com') ? 'roland' : 'participant'}): ${res.status}${res.ok ? '' : ` ${await res.text()}`}`;
}

// --- Coaching inquiry -----------------------------------------------------------
async function handleInquiry(d) {
  const body = [
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
    dashboard() && `All leads: ${dashboard()}`,
  ].filter(Boolean).join('\n');
  return Promise.allSettled([
    sendSms(body),
    sendEmail({ to: env('ALERT_EMAIL_TO', 'roland@rolandnielson.com'), subject: `New coaching inquiry: ${clean(d.name) || 'website visitor'}`, text: body, replyTo: clean(d.email) }),
  ]);
}

// --- Personal Patterns Assessment ---------------------------------------------------
export function validateAssessment(d) {
  const problems = [];
  if (!clean(d.name)) problems.push('name missing');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(d.email))) problems.push('email invalid');
  if (String(d.phone ?? '').replace(/\D/g, '').length < 10) problems.push('phone invalid');
  const result = score(d);
  if (!result.valid) problems.push(`missing ratings: ${result.missing.join(', ')}`);
  return { ok: problems.length === 0, problems, scores: result.scores };
}

async function handleAssessment(d, submittedAt) {
  const v = validateAssessment(d);
  if (!v.ok) {
    console.log(`assessment rejected (server validation): ${v.problems.join('; ')}`);
    return [{ status: 'fulfilled', value: `invalid: ${v.problems.join('; ')}` }];
  }
  const when = new Date(submittedAt || Date.now()).toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' });
  // Short summary only: no answers, scores or reflections in the alert (brief §10).
  const alert = [
    'New Personal Patterns Assessment',
    `Name: ${clean(d.name)}`,
    `Submitted: ${when} (Central)`,
    d.marketing_optin === 'yes' ? 'Opted in to tips and offers: yes' : 'Opted in to tips and offers: no',
    dashboard() && `Full record (login required): ${dashboard()}`,
  ].filter(Boolean).join('\n');

  const tasks = [
    sendSms(alert),
    sendEmail({ to: env('ALERT_EMAIL_TO', 'roland@rolandnielson.com'), subject: `New Personal Patterns Assessment: ${clean(d.name)}`, text: alert }),
  ];

  if (d.results_email === 'yes') {
    const lines = CATEGORIES.map((c) => `${c.name}: ${v.scores[c.key]} / 25 (${band(v.scores[c.key])})\n  ${c.explores}`);
    const text = [
      `Hi ${clean(d.name).split(' ')[0]},`,
      '',
      'Thanks for taking the Personal Patterns Assessment. Here are your results:',
      '',
      ...lines,
      d.motivators && `\nWhat motivates you: ${clean(d.motivators)}`,
      '',
      "High or low scores don't define your personality or your worth. They show patterns, and patterns can change.",
      '',
      'Want to talk about your patterns and one change you want to make? Book a free 20-minute discovery call:',
      BOOKING,
      '',
      'Roland Nielson',
      "Roland Nielson – Omaha Men's Life Coaching",
      '',
      'This is an original, unvalidated coaching reflection tool, not a clinical assessment. You received this email because you asked for a copy of your results.',
    ].filter((l) => typeof l === 'string').join('\n');
    tasks.push(sendEmail({ to: clean(d.email), subject: 'Your Personal Patterns results', text }));
  }
  return Promise.allSettled(tasks);
}

export const handler = async (event) => {
  let payload;
  try {
    ({ payload } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: 'bad payload' };
  }
  const d = payload?.data ?? {};
  if (d['bot-field']) return { statusCode: 200, body: 'honeypot' };

  let results;
  if (payload?.form_name === 'coaching-inquiry') results = await handleInquiry(d);
  else if (payload?.form_name === ASSESSMENT_FORM) results = await handleAssessment(d, payload.created_at);
  else return { statusCode: 200, body: 'ignored' };

  const log = results.map((r) => (r.status === 'fulfilled' ? r.value : `error: ${r.reason}`)).join(' | ');
  console.log(`${payload.form_name} → ${log}`);
  return { statusCode: 200, body: log };
};
