// Posts a short status record into the hidden "site-diagnostics" Netlify form,
// so delivery results can be read in Netlify Forms (no secrets are ever included).
// Links and email addresses are masked: Netlify's spam filter hides entries that contain them.
const tidy = (v) => String(v).replace(/https?:\/\/\S+/g, '[link]').replace(/\S+@\S+\.\w+/g, (m) => m.replace('@', ' at '));
export async function logDiagnostic(title, message) {
  const base = process.env.URL || 'https://rolandnielson.com';
  try {
    await fetch(`${base}/__forms.html`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ 'form-name': 'site-diagnostics', name: 'Website system', title: tidy(title), message: tidy(message).slice(0, 4000) }).toString(),
    });
  } catch { /* diagnostics must never break the caller */ }
}
