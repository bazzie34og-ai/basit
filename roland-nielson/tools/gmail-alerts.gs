/**
 * Roland Nielson – website form alerts to Gmail (Google Apps Script).
 *
 * Runs inside Roland's own Google account. Every 5 minutes it checks the
 * website's saved form submissions and emails each new one to Roland.
 * Nothing on the website changes, and no website deploy is needed.
 *
 * Setup (once):
 *   1. Go to https://script.google.com → New project. Delete the sample code
 *      and paste this whole file.
 *   2. Paste your Netlify access token between the quotes on the NETLIFY_TOKEN line.
 *   3. Click Save, choose "setup" in the function list at the top, then click Run.
 *      Approve the Google permission prompts (it needs to send email and connect
 *      to Netlify). That's it.
 */

const NETLIFY_TOKEN = 'PASTE_NETLIFY_TOKEN_HERE';
const SITE_ID = 'd3dda6d5-543b-41c6-b193-7482e0a01adc';
const SEND_TO = 'rolandnielson@gmail.com, roland@rolandnielson.com';
const FORMS = ['personal-patterns-assessment', 'coaching-inquiry'];

const CATEGORIES = [
  { key: 'action', name: 'Action & Initiative' },
  { key: 'connection', name: 'Connection & Communication' },
  { key: 'consistency', name: 'Consistency & Follow-Through' },
  { key: 'structure', name: 'Structure & Decision-Making' },
];
const QUESTIONS = [
  'I take action when I face an unfamiliar problem.',
  'I feel comfortable making decisions without everyone’s approval.',
  'I address difficult situations rather than avoid them.',
  'I prefer taking responsibility for solving problems.',
  'I recover quickly when a plan fails.',
  'I find it easy to start conversations with new people.',
  'I openly express my thoughts and feelings.',
  'I feel energized after meaningful interactions.',
  'I actively seek to understand other people’s perspectives.',
  'I feel comfortable asking for support when I need it.',
  'I follow through on commitments even when my motivation drops.',
  'I maintain routines that support my goals.',
  'I finish important tasks before starting new projects.',
  'I stay consistent when progress is slow.',
  'I make time for responsibilities even during stressful weeks.',
  'I prefer to have a clear plan before beginning a project.',
  'I review important details before making decisions.',
  'I track deadlines, appointments, and commitments.',
  'I adjust my plans when new evidence challenges my assumptions.',
  'I use systems or tools to keep myself organized.',
];
const SCALE = { 1: 'Strongly disagree', 2: 'Disagree', 3: 'Neutral', 4: 'Agree', 5: 'Strongly agree' };

/** Run once: sends any submissions not yet emailed, then checks every 5 minutes. */
function setup() {
  ScriptApp.getProjectTriggers().forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('checkSubmissions').timeBased().everyMinutes(5).create();
  checkSubmissions();
}

function checkSubmissions() {
  const props = PropertiesService.getScriptProperties();
  const seen = JSON.parse(props.getProperty('seen') || '[]');
  const res = UrlFetchApp.fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/submissions?per_page=100`, {
    headers: { Authorization: `Bearer ${NETLIFY_TOKEN.trim()}` },
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) throw new Error(`Netlify said ${res.getResponseCode()}: ${res.getContentText().slice(0, 200)}`);
  const subs = JSON.parse(res.getContentText())
    .filter((s) => FORMS.includes(s.form_name) && !seen.includes(s.id))
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
  for (const s of subs) {
    const mail = s.form_name === 'personal-patterns-assessment' ? assessmentEmail(s) : inquiryEmail(s);
    const d = s.data || {};
    MailApp.sendEmail({
      to: SEND_TO, subject: mail.subject, htmlBody: mail.html, name: 'rolandnielson.com',
      ...(d.email ? { replyTo: d.email } : {}),
    });
    seen.push(s.id);
  }
  props.setProperty('seen', JSON.stringify(seen.slice(-500)));
}

const esc = (v) => String(v == null ? '' : v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const when = (iso) => Utilities.formatDate(new Date(iso), 'America/Chicago', 'MMM d, yyyy h:mm a') + ' (Omaha time)';
const row = (k, v) => (v ? `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>` : '');
const shell = (title, body) => `<div style="font-family:Arial,sans-serif;max-width:640px;color:#1d2733">
  <h2 style="margin:0 0 4px;color:#1d2733">${esc(title)}</h2>${body}
  <p style="color:#888;font-size:12px;margin-top:24px">Sent automatically from rolandnielson.com. Reply to this email to answer the person directly.</p></div>`;
const contact = (d) => `<table style="border-collapse:collapse;margin:12px 0">${row('Name', d.name)}${row('Email', d.email)}${row('Phone', d.phone)}</table>
  ${d.phone ? `<p><a href="tel:${esc(String(d.phone).replace(/[^0-9+]/g, ''))}" style="background:#7d5f2f;color:#fff;padding:10px 16px;border-radius:4px;text-decoration:none">Call ${esc(d.name || 'them')}</a></p>` : ''}`;

function band(n) {
  if (n >= 20) return 'Frequently expressed behaviors';
  if (n >= 14) return 'Situational or mixed behaviors';
  return 'Less frequently expressed behaviors';
}

function assessmentEmail(s) {
  const d = s.data || {};
  const scores = CATEGORIES.map((c, ci) => {
    let n = 0;
    for (let i = 1; i <= 5; i++) n += Number(d[`q${ci * 5 + i}`]) || 0;
    return { ...c, n };
  });
  const bars = scores.map((c) => `<p style="margin:10px 0 2px"><strong>${esc(c.name)}</strong>: ${c.n} / 25 <span style="color:#666">(${band(c.n)})</span></p>
    <div style="background:#e9e4da;height:10px;border-radius:5px"><div style="background:#7d5f2f;height:10px;border-radius:5px;width:${Math.round((c.n / 25) * 100)}%"></div></div>`).join('');
  const answers = QUESTIONS.map((q, i) => row(`${i + 1}. ${q}`, SCALE[d[`q${i + 1}`]] || d[`q${i + 1}`] || '—')).join('');
  const body = `<p style="color:#666;margin:0">${when(s.created_at)}</p>${contact(d)}
    <h3>Scores</h3>${bars}
    <table style="border-collapse:collapse;margin:16px 0">${row('Top motivators', d.motivators)}${row('Wants to improve', d.improve_area)}${row('Biggest obstacle', d.obstacle)}${row('Wants a copy of results', d.results_email)}${row('Marketing opt-in', d.marketing_optin)}</table>
    <h3>All 20 answers</h3><table style="border-collapse:collapse;font-size:14px">${answers}</table>`;
  return { subject: `New assessment: ${d.name || 'Someone'} completed the Personal Patterns Assessment`, html: shell('New Personal Patterns Assessment', body) };
}

function inquiryEmail(s) {
  const d = s.data || {};
  const body = `<p style="color:#666;margin:0">${when(s.created_at)}</p>${contact(d)}
    <table style="border-collapse:collapse;margin:12px 0">${row('Prefers', d.preferred_contact)}${row('For', d.who_for)}${row('Session type', d.session_pref)}${row('Best time', d.best_time)}${row('Page', d.source)}</table>
    ${d.message ? `<h3>Message</h3><p style="white-space:pre-wrap">${esc(d.message)}</p>` : ''}`;
  return { subject: `New coaching inquiry from ${d.name || 'the website'}`, html: shell('New coaching inquiry', body) };
}
