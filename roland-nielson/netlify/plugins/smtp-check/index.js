// Deploy-time mail check. Runs on Netlify's build servers after each build and
// writes a plain-language result into the deploy summary (never the password).
// It checks: which SMTP_* variables exist, whether the domain and mail server
// resolve in DNS, and whether the mailbox login works (no email is sent).
// Set SMTP_TEST_SEND=1 for one deploy to also send a real test email to ALERT_EMAIL_TO.
import dns from 'node:dns/promises';
import nodemailer from 'nodemailer';
import { logDiagnostic } from '../../lib-diagnostics.mjs';
import { mailConfig } from '../../mail-config.mjs';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Send one real test email on deploy while this file exists (toggle via git).
const SEND_TEST = existsSync(fileURLToPath(new URL('./send-test', import.meta.url)));

let result = null;

const env = (k, d = '') => process.env[k] || d;

export const onPostBuild = async ({ utils }) => {
  try { await check(utils); } catch (e) { console.log(`[smtp-check] skipped: ${e.message}`); }
};

// After the deploy is live, store the result in the "site-diagnostics" form.
export const onSuccess = async () => {
  if (result) await logDiagnostic(result.title, result.summary);
};

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
    const t = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass }, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000 });
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
