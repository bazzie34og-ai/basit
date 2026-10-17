// GET /api/bookings.csv — every booking as a CSV, for the monthly results review.
// Protected with HTTP Basic Auth (ADMIN_USER / ADMIN_PASS). Refuses to run if they're not set.
import { getStore } from '@netlify/blobs';
import { timingSafeEqual } from 'node:crypto';

export const config = { path: '/api/bookings.csv' };

const env = (k) => globalThis.Netlify?.env?.get?.(k) ?? process.env[k] ?? '';

const COLUMNS = [
  'createdAt', 'name', 'phone', 'email', 'makeModel', 'registration', 'service', 'vehicleSize', 'extras',
  'serviceType', 'postcode', 'outsideAB', 'preferredDay', 'preferredTime', 'quotedTotal', 'notes', 'howHeard',
  'pageUrl', 'referrer', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'photos', 'id',
];

function safeEqual(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function cell(v) {
  let s = Array.isArray(v) ? v.join('; ') : v == null ? '' : String(v);
  // stop spreadsheet formula injection
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export default async (req) => {
  const user = env('ADMIN_USER');
  const pass = env('ADMIN_PASS');
  if (!user || !pass) return new Response('Export not configured. Set ADMIN_USER and ADMIN_PASS.', { status: 503 });

  const auth = req.headers.get('authorization') || '';
  const [scheme, encoded] = auth.split(' ');
  const [u, ...rest] = scheme === 'Basic' && encoded ? Buffer.from(encoded, 'base64').toString().split(':') : [];
  if (!u || !safeEqual(u, user) || !safeEqual(rest.join(':'), pass)) {
    return new Response('Authentication required', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="LM bookings", charset="UTF-8"' } });
  }

  const store = getStore('bookings');
  const { blobs } = await store.list();
  const rows = [];
  for (const { key } of blobs) {
    const b = await store.get(key, { type: 'json' });
    if (b) rows.push(b);
  }
  rows.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  const csv = [COLUMNS.join(','), ...rows.map((r) => COLUMNS.map((c) => cell(r[c])).join(','))].join('\r\n');

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response('﻿' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="lm-bookings-${stamp}.csv"`,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
};
