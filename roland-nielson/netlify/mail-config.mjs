// Non-secret mail settings. Environment variables override these.
// The only value that must live in Netlify is SMTP_PASS (the mailbox password).
import dns from 'node:dns/promises';

export const mailConfig = () => ({
  host: process.env.SMTP_HOST || 'mail.rolandnielson.com',
  port: Number(process.env.SMTP_PORT || 465),
  user: process.env.SMTP_USER || 'roland@rolandnielson.com',
  pass: process.env.SMTP_PASS || '',
});

// Shared hosting (Namecheap) serves mail.<domain> with a certificate for the
// server's own name (*.web-hosting.com). Find that name via reverse DNS so TLS
// still verifies the certificate properly. SMTP_TLS_SERVERNAME overrides.
export async function tlsServername(host) {
  const override = process.env.SMTP_TLS_SERVERNAME;
  let ip = null;
  try { [ip] = await dns.resolve4(host); } catch { /* fall back to the host name */ }
  if (override) return { ip, servername: override };
  if (!ip) return { ip: null, servername: host };
  try {
    const names = await dns.reverse(ip);
    // The certificate covers *.web-hosting.com (one label) and web-hosting.com itself.
    const oneLabel = names.find((n) => /^[^.]+\.web-hosting\.com\.?$/i.test(n));
    if (oneLabel) return { ip, servername: oneLabel.replace(/\.$/, '') };
    if (names.some((n) => /web-hosting\.com\.?$/i.test(n))) return { ip, servername: 'web-hosting.com' };
  } catch { /* no reverse DNS */ }
  // Namecheap-hosted mail (MX on jellyfish.systems / web-hosting.com) uses the web-hosting.com certificate.
  try {
    const domain = (mailConfig().user.split('@')[1] || '').toLowerCase();
    const mx = await dns.resolveMx(domain);
    if (mx.some((m) => /(jellyfish\.systems|web-hosting\.com)\.?$/i.test(m.exchange))) return { ip, servername: 'web-hosting.com' };
  } catch { /* no MX */ }
  return { ip, servername: host };
}

// nodemailer transport options. Connects by IP with an explicit TLS server name,
// so the certificate is still fully verified (and nodemailer's DNS cache can't
// substitute a different name).
export async function transportOptions() {
  const { host, port, user, pass } = mailConfig();
  const { ip, servername } = await tlsServername(host);
  return {
    servername,
    options: {
      host: ip || host, servername, port, secure: port === 465, auth: { user, pass },
      tls: { servername },
      connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
    },
  };
}
