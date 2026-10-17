/**
 * GET /api/leads.csv: protected CSV export of every saved lead, for the monthly review.
 * HTTP Basic Auth with ADMIN_USER / ADMIN_PASS. Disabled (503) until both are set.
 */
import { getStore } from '@netlify/blobs';

const env = (k) => globalThis.Netlify?.env.get(k) ?? process.env[k] ?? '';

const COLUMNS = ['date', 'name', 'phone', 'email', 'suburb', 'vehicle', 'package', 'howHeard', 'utm_source', 'utm_medium', 'utm_campaign', 'pageUrl'];

/** Constant-time string compare. */
function safeEqual(a, b) {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

/** Quote a CSV cell and neutralise spreadsheet formula injection. */
function cell(v) {
  let s = String(v ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

const unauthorised = () =>
  new Response('Authentication required', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Diamond Plate leads", charset="UTF-8"', 'Cache-Control': 'no-store' } });

export default async (req) => {
  const user = env('ADMIN_USER');
  const pass = env('ADMIN_PASS');
  if (!user || !pass) return new Response('Lead export is disabled until ADMIN_USER and ADMIN_PASS are set.', { status: 503 });

  const header = req.headers.get('authorization') || '';
  if (!header.startsWith('Basic ')) return unauthorised();
  let decoded = '';
  try {
    decoded = atob(header.slice(6));
  } catch {
    return unauthorised();
  }
  const i = decoded.indexOf(':');
  if (i < 0 || !safeEqual(decoded.slice(0, i), user) || !safeEqual(decoded.slice(i + 1), pass)) return unauthorised();

  const store = getStore({ name: 'leads', consistency: 'strong' });
  const { blobs } = await store.list();
  const leads = (await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' }).catch(() => null)))).filter(Boolean);
  leads.sort((a, b) => String(a.receivedAt).localeCompare(String(b.receivedAt)));

  const fmt = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Brisbane', dateStyle: 'short', timeStyle: 'short' });
  const lines = [COLUMNS.join(',')];
  for (const l of leads) {
    const date = l.receivedAt ? fmt.format(new Date(l.receivedAt)) : '';
    lines.push([date, l.name, l.phone, l.email, l.suburb, l.vehicle, l.package, l.howHeard, l.utm_source, l.utm_medium, l.utm_campaign, l.pageUrl].map(cell).join(','));
  }
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response('﻿' + lines.join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="diamond-plate-leads-${stamp}.csv"`,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
};

export const config = { path: '/api/leads.csv', method: ['GET'] };
