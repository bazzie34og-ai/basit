// Runs automatically after every verified (non-spam) Netlify Forms submission.
//
// coaching-inquiry             → email Roland the lead (+ optional SMS).
// personal-patterns-assessment → validate and re-score on the server, email Roland the
//                                full results, and email the participant their results
//                                when they tick "Email me a copy of my results".
//
// Email is sent through Roland's own mailbox over SMTP (no third-party email service).
// Set these in Netlify → Project configuration → Environment variables:
//   SMTP_HOST   e.g. mail.rolandnielson.com (Namecheap hosting) or smtp.gmail.com
//   SMTP_PORT   465 (SSL, default) or 587 (STARTTLS)
//   SMTP_USER   the full mailbox address, e.g. roland@rolandnielson.com
//   SMTP_PASS   that mailbox's password (Gmail: an App Password)  ← mark as secret
// Optional:
//   ALERT_EMAIL_TO    where alerts go (default roland@rolandnielson.com)
//   ALERT_EMAIL_FROM  sender shown to people (default "Roland Nielson <SMTP_USER>")
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, ALERT_SMS_TO → text alerts
import nodemailer from 'nodemailer';
import { logDiagnostic } from '../lib-diagnostics.mjs';
import { mailConfig } from '../mail-config.mjs';
import { FORM_NAME as ASSESSMENT_FORM, CATEGORIES, QUESTIONS, score, band } from '../../src/data/assessment.mjs';

const BOOKING = 'https://calendly.com/rolandnielson/free-20-minute-discovery-call';
const BUSINESS = "Roland Nielson – Omaha Men's Life Coaching";
const env = (k, d = '') => process.env[k] || d;
const clean = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();
const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const dashboard = () => (process.env.SITE_NAME ? `https://app.netlify.com/projects/${process.env.SITE_NAME}/forms` : '');
const rolandInbox = () => env('ALERT_EMAIL_TO', 'roland@rolandnielson.com');
const central = (iso) => new Date(iso || Date.now()).toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' });

// --- Transport -------------------------------------------------------------------
let transport;
export function mailer() {
  if (transport !== undefined) return transport;
  const { host, port, user, pass } = mailConfig();
  if (!host || !user || !pass) return (transport = null);
  transport = nodemailer.createTransport({
    host, port, secure: port === 465, auth: { user, pass },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
  });
  return transport;
}

async function sendEmail({ to, subject, text, html, replyTo, label }) {
  const t = mailer();
  if (!t) return `email(${label}): not configured`;
  const from = env('ALERT_EMAIL_FROM', `Roland Nielson <${mailConfig().user}>`);
  const info = await t.sendMail({ from, to, subject, text, html, ...(replyTo ? { replyTo } : {}) });
  return `email(${label}): sent ${info.messageId ?? ''}`.trim();
}

async function sendSms(body) {
  const sid = env('TWILIO_ACCOUNT_SID'), token = env('TWILIO_AUTH_TOKEN'), from = env('TWILIO_FROM');
  if (!sid || !token || !from) return 'sms: not configured';
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: env('ALERT_SMS_TO', '+14025770738'), From: from, Body: body.slice(0, 1500) }),
  });
  return `sms: ${res.status}`;
}

// --- Shared HTML shell -------------------------------------------------------------
const shell = (title, inner) => `<!doctype html><html><body style="margin:0;background:#F5F1EA;font-family:Arial,Helvetica,sans-serif;color:#2A2F36">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F1EA;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFDF9;border:1px solid #E6DCCB;border-radius:12px">
<tr><td style="background:#0E1B2C;color:#F5F1EA;padding:20px 24px;border-radius:12px 12px 0 0">
<div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#D2B483">Roland Nielson</div>
<div style="font-family:Georgia,serif;font-size:22px;margin-top:6px">${esc(title)}</div></td></tr>
<tr><td style="padding:24px">${inner}</td></tr>
<tr><td style="padding:16px 24px;font-size:12px;color:#555C66;border-top:1px solid #E6DCCB">${esc(BUSINESS)} · Omaha, NE · (402) 577-0738</td></tr>
</table></td></tr></table></body></html>`;
const row = (k, v) => (v ? `<tr><td style="padding:4px 12px 4px 0;color:#555C66;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>` : '');
const button = (href, label) => `<a href="${esc(href)}" style="display:inline-block;background:#B08D57;color:#0E1B2C;font-weight:bold;text-decoration:none;padding:12px 20px;border-radius:999px">${esc(label)}</a>`;
const scoreBars = (scores) => CATEGORIES.map((c) => {
  const s = scores[c.key], pct = Math.round((s / 25) * 100);
  return `<div style="margin:0 0 16px"><div style="font-weight:bold;color:#0E1B2C">${esc(c.name)} <span style="float:right">${s} / 25</span></div>
<div style="background:#E6DCCB;border-radius:99px;height:10px;margin:6px 0"><div style="background:#13294A;width:${pct}%;height:10px;border-radius:99px"></div></div>
<div style="font-size:14px;color:#3B5F86;font-weight:bold">${esc(band(s))}</div>
<div style="font-size:13px;color:#555C66">${esc(c.explores)}</div></div>`;
}).join('');

// --- Coaching inquiry -----------------------------------------------------------------
async function handleInquiry(d, submittedAt) {
  const fields = [
    ['Name', clean(d.name)], ['Phone', clean(d.phone)], ['Email', clean(d.email)],
    ['Prefers', clean(d.preferred_contact)], ['For', clean(d.who_for)], ['Session', clean(d.session_pref)],
    ['Best time', clean(d.best_time)], ['Message', clean(d.message)],
    ['Page', clean(d.source) || '/'], ['Source', d.utm_source ? `${clean(d.utm_source)} / ${clean(d.utm_medium)}` : ''],
    ['Submitted', `${central(submittedAt)} (Central)`],
  ];
  const text = ['New coaching inquiry', ...fields.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`), dashboard() && `All leads: ${dashboard()}`].filter(Boolean).join('\n');
  const html = shell('New coaching inquiry', `<table role="presentation" style="font-size:15px">${fields.map(([k, v]) => row(k, v)).join('')}</table>
${d.phone ? `<p style="margin:20px 0 0">${button(`tel:${String(d.phone).replace(/[^\d+]/g, '')}`, `Call ${clean(d.name).split(' ')[0] || 'back'}`)}</p>` : ''}`);
  return Promise.allSettled([
    sendEmail({ to: rolandInbox(), subject: `New coaching inquiry: ${clean(d.name) || 'website visitor'}`, text, html, replyTo: clean(d.email), label: 'roland' }),
    sendSms(text),
  ]);
}

// --- Personal Patterns Assessment -----------------------------------------------------
export function validateAssessment(d) {
  const problems = [];
  if (!clean(d.name)) problems.push('name missing');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(d.email))) problems.push('email invalid');
  if (String(d.phone ?? '').replace(/\D/g, '').length < 10) problems.push('phone invalid');
  const result = score(d);
  if (!result.valid) problems.push(`missing ratings: ${result.missing.join(', ')}`);
  return { ok: problems.length === 0, problems, scores: result.scores };
}

export function assessmentEmails(d, scores, submittedAt) {
  const name = clean(d.name), first = name.split(' ')[0] || 'there';
  const scoreLines = CATEGORIES.map((c) => `${c.name}: ${scores[c.key]} / 25 (${band(scores[c.key])})`);
  const answers = QUESTIONS.map((q) => `${q.n}. ${q.text} → ${d[q.id]}`);

  // Roland: full record.
  const rText = [
    `New Personal Patterns Assessment from ${name}`, '',
    `Name: ${name}`, `Email: ${clean(d.email)}`, `Phone: ${clean(d.phone)}`, `Submitted: ${central(submittedAt)} (Central)`, '',
    'SCORES', ...scoreLines, '',
    d.motivators && `Motivators: ${clean(d.motivators)}`,
    d.improve_area && `Wants to improve: ${clean(d.improve_area)}`,
    d.obstacle && `What gets in the way: ${clean(d.obstacle)}`, '',
    `Tips/offers opt-in: ${d.marketing_optin === 'yes' ? 'yes' : 'no'} · Results copy requested: ${d.results_email === 'yes' ? 'yes' : 'no'}`,
    `Source: ${clean(d.source) || '/'}${d.utm_source ? ` (${clean(d.utm_source)} / ${clean(d.utm_medium)})` : ''} · Version: ${clean(d.assessment_version)}`, '',
    'ANSWERS (1 = strongly disagree, 5 = strongly agree)', ...answers,
    dashboard() && `\nAll records: ${dashboard()}`,
  ].filter((l) => typeof l === 'string').join('\n');
  const rHtml = shell(`New assessment: ${name}`, `
<table role="presentation" style="font-size:15px;margin-bottom:20px">${row('Name', name)}${row('Email', clean(d.email))}${row('Phone', clean(d.phone))}${row('Submitted', `${central(submittedAt)} (Central)`)}</table>
${scoreBars(scores)}
<table role="presentation" style="font-size:15px;margin:8px 0 20px">${row('Motivators', clean(d.motivators))}${row('Wants to improve', clean(d.improve_area))}${row('What gets in the way', clean(d.obstacle))}${row('Tips/offers opt-in', d.marketing_optin === 'yes' ? 'Yes' : 'No')}${row('Source', clean(d.source))}</table>
<p style="font-weight:bold;margin:16px 0 4px">All 20 answers (1 = strongly disagree, 5 = strongly agree)</p><ol style="font-size:13px;color:#2A2F36;padding-left:20px;margin:0">${QUESTIONS.map((q) => `<li>${esc(q.text)} <b>${esc(d[q.id])}</b></li>`).join('')}</ol>
<p style="margin:20px 0 0">${button(`tel:${String(d.phone).replace(/[^\d+]/g, '')}`, `Call ${first}`)}</p>`);

  // Participant: their own results + booking link.
  const pText = [
    `Hi ${first},`, '', 'Thanks for taking the Personal Patterns Assessment. Here are your results:', '',
    ...CATEGORIES.map((c) => `${c.name}: ${scores[c.key]} / 25 (${band(scores[c.key])})\n  ${c.explores}`),
    d.motivators && `\nWhat motivates you: ${clean(d.motivators)}`, '',
    "High or low scores don't define your personality or your worth. They show patterns, and patterns can change.", '',
    'Want to talk about your patterns and one change you want to make? Book a free 20-minute discovery call:', BOOKING, '',
    'Roland Nielson', BUSINESS, '',
    'This is an original, unvalidated coaching reflection tool, not a clinical assessment. You received this because you asked for a copy of your results.',
  ].filter((l) => typeof l === 'string').join('\n');
  const pHtml = shell('Your Personal Patterns results', `
<p style="font-size:16px">Hi ${esc(first)}, thanks for taking the assessment. Here are your results.</p>
${scoreBars(scores)}
${d.motivators ? `<p><b>What motivates you:</b> ${esc(clean(d.motivators))}</p>` : ''}
<p style="font-size:14px;color:#555C66">High or low scores don't define your personality or your worth. They show patterns, and patterns can change.</p>
<p style="font-family:Georgia,serif;font-size:18px;color:#0E1B2C">Want to talk about your patterns and one change you want to make?</p>
<p>${button(BOOKING, 'Book Your Free 20-Minute Discovery Call')}</p>
<p style="font-size:12px;color:#555C66">This is an original, unvalidated coaching reflection tool, not a clinical assessment. You received this because you asked for a copy of your results.</p>`);
  return { roland: { text: rText, html: rHtml }, participant: { text: pText, html: pHtml } };
}

async function handleAssessment(d, submittedAt) {
  const v = validateAssessment(d);
  if (!v.ok) {
    console.log(`assessment rejected (server validation): ${v.problems.join('; ')}`);
    return [{ status: 'fulfilled', value: `invalid: ${v.problems.join('; ')}` }];
  }
  const mail = assessmentEmails(d, v.scores, submittedAt);
  const tasks = [
    sendEmail({ to: rolandInbox(), subject: `New Personal Patterns Assessment: ${clean(d.name)}`, ...mail.roland, replyTo: clean(d.email), label: 'roland' }),
    sendSms(`New Personal Patterns Assessment: ${clean(d.name)}, ${clean(d.phone)}. Full results in your email.`),
  ];
  if (d.results_email === 'yes') {
    tasks.push(sendEmail({ to: clean(d.email), subject: 'Your Personal Patterns results', ...mail.participant, replyTo: rolandInbox(), label: 'participant' }));
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
  if (payload?.form_name === 'coaching-inquiry') results = await handleInquiry(d, payload.created_at);
  else if (payload?.form_name === ASSESSMENT_FORM) results = await handleAssessment(d, payload.created_at);
  else return { statusCode: 200, body: 'ignored' };

  const log = results.map((r) => (r.status === 'fulfilled' ? r.value : `error: ${r.reason?.message ?? r.reason}`)).join(' | ');
  console.log(`${payload.form_name} → ${log}`);
  await logDiagnostic(`Email delivery: ${payload.form_name}`, `${clean(d.name)}: ${log}`);
  return { statusCode: 200, body: log };
};
