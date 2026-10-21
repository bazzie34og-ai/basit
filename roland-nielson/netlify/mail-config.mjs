// Non-secret mail settings. Environment variables override these.
// The only value that must live in Netlify is SMTP_PASS (the mailbox password).
export const mailConfig = () => ({
  host: process.env.SMTP_HOST || 'mail.rolandnielson.com',
  port: Number(process.env.SMTP_PORT || 465),
  user: process.env.SMTP_USER || 'roland@rolandnielson.com',
  pass: process.env.SMTP_PASS || '',
});
