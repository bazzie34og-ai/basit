// Deploy-time mail check. Runs on Netlify's build servers after each build and
// writes a plain-language result into the deploy summary (never the password).
// It checks: which SMTP_* variables exist, whether the domain and mail server
// resolve in DNS, and whether the mailbox login works (no email is sent).
// Set SMTP_TEST_SEND=1 for one deploy to also send a real test email to ALERT_EMAIL_TO.
import dns from 'node:dns/promises';
import nodemailer from 'nodemailer';
import { logDiagnostic } from '../../lib-diagnostics.mjs';
import { mailConfig, transportOptions, notifyEmails, notifyForms } from '../../mail-config.mjs';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Send one real test email on deploy while this file exists (toggle via git).
const SEND_TEST = existsSync(fileURLToPath(new URL('./send-test', import.meta.url)));

let result = null;

const env = (k, d = '') => process.env[k] || d;

export const onPostBuild = async ({ utils }) => {
  try { await check(utils); } catch (e) { console.log(`[smtp-check] skipped: ${e.message}`); }
};

// After the deploy is live: make sure Netlify's own form email notifications exist
// (uses the build's built-in Netlify API token, so no mailbox password is needed),
// then store both results in the "site-diagnostics" form.
export const onSuccess = async ({ constants }) => {
  let notify = '';
  try { notify = await ensureNotifications(constants); } catch (e) { notify = `Form email notifications: error ${e.message}`; }
  console.log(`[smtp-check] ${notify}`);
  const smtp = result ? `${result.title}\n${result.summary}` : '';
  await logDiagnostic(notify.startsWith('Form email notifications: active') ? 'Email alerts: active (Netlify notifications)' : 'Email alerts: check needed', `${notify}\n\n${smtp}`);
};

async function api(token, path, init = {}) {
  const res = await fetch(`https://api.netlify.com/api/v1${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  const text = await res.text();
  let body; try { body = JSON.parse(text); } catch { body = text; }
  if (!res.ok) throw new Error(`${init.method || 'GET'} ${path} → ${res.status} ${typeof body === 'string' ? body.slice(0, 200) : JSON.stringify(body).slice(0, 200)}`);
  return body;
}

async function ensureNotifications(constants) {
  const token = constants?.NETLIFY_API_TOKEN || process.env.NETLIFY_API_TOKEN;
  const siteId = constants?.SITE_ID || process.env.SITE_ID;
  if (!token || !siteId) return 'Form email notifications: skipped (no build API token available)';
  const forms = await api(token, `/sites/${siteId}/forms`);
  const hooks = await api(token, `/hooks?site_id=${siteId}`);
  const lines = [];
  let created = 0, existing = 0;
  for (const name of notifyForms) {
    const form = forms.find((f) => f.name === name);
    if (!form) { lines.push(`${name}: form not found yet`); continue; }
    for (const email of notifyEmails()) {
      const has = hooks.some((h) => h.type === 'email' && h.event === 'submission_created' && h.data?.email === email && (!h.form_id || h.form_id === form.id));
      if (has) { existing++; continue; }
      await api(token, '/hooks', { method: 'POST', body: JSON.stringify({ site_id: siteId, form_id: form.id, type: 'email', event: 'submission_created', data: { email } }) });
      created++;
      lines.push(`${name} → ${email}: created`);
    }
  }
  const after = await api(token, `/hooks?site_id=${siteId}`);
  const emailHooks = after.filter((h) => h.type === 'email' && h.event === 'submission_created');
  return [`Form email notifications: ${emailHooks.length ? 'active' : 'none set'} (${emailHooks.length} email notification${emailHooks.length === 1 ? '' : 's'}; ${created} created, ${existing} already set)`,
    ...lines, ...emailHooks.map((h) => `  • ${h.data?.email} for form ${forms.find((f) => f.id === h.form_id)?.name || 'any form'}`)].join('\n');
}

async function check(utils) {
  const lines = [];
  const { host, port, user, pass } = mailConfig();
  lines.push(`Variables: SMTP_HOST ${host ? `= ${host}` : 'MISSING'} · SMTP_PORT = ${port} · SMTP_USER ${user ? `= ${user}` : 'MISSING'} · SMTP_PASS ${pass ? 'is set' : 'MISSING'}`);

  const domain = (user.split('@')[1] || 'rolandnielson.com').toLowerCase();
  try {
    const mx = await dns.resolveMx(domain);
    lines.push(`${domain} receives mail via: ${mx.sort((a, b) => a.priority - b.priority).map((m) => m.exchange).join(', ')}`);
  } catch (e) {
    lines.push(`${domain} has NO mail (MX) records (${e.code}). Mail sent to @${domain} addresses will bounce.`);
  }
  if (host) {
    try { lines.push(`${host} resolves to ${(await dns.resolve4(host)).join(', ')}`); }
    catch (e) { lines.push(`${host} does NOT resolve (${e.code}). Use the server name shown in your hosting email settings.`); }
  }

  let ok = false;
  if (host && user && pass) {
    const { servername, options } = await transportOptions();
    lines.push(`TLS certificate name used: ${servername}`);
    const t = nodemailer.createTransport(options);
    try {
      await t.verify();
      ok = true;
      lines.push('Mailbox login: OK. The site can send email.');
      if (SEND_TEST || env('SMTP_TEST_SEND') === '1') {
        const to = env('ALERT_EMAIL_TO', 'roland@rolandnielson.com');
        const info = await t.sendMail({ from: env('ALERT_EMAIL_FROM', `Roland Nielson <${user}>`), to, subject: 'Test from rolandnielson.com: email is working', text: 'This is a test from your website. Assessment results and contact-form leads will arrive like this.' });
        lines.push(`Test email sent to ${to} (${info.response || info.messageId}).`);
      }
    } catch (e) {
      lines.push(`Mailbox login FAILED: ${e.code || ''} ${e.response || e.message}`.trim());
    }
  } else {
    lines.push('Mailbox login: not tested (a variable is missing).');
  }
  const summary = lines.join('\n');
  console.log(`[smtp-check]\n${summary}`);
  const title = ok ? 'Email check: working' : 'Email check: NOT working';
  result = { title, summary };
  utils.status.show({ title, summary });
}
