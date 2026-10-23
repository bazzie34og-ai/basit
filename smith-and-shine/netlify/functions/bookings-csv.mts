/**
 * GET /api/bookings.csv
 * Every booking saved in Netlify Blobs, as a CSV. Protected by Basic Auth
 * (ADMIN_USER / ADMIN_PASS env vars). Open it in Excel or Google Sheets.
 */
import type { Config } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const COLUMNS = [
  'id', 'createdAt', 'name', 'phone', 'email', 'postcode', 'postcodeLocal', 'vehicle', 'sizeLabel',
  'serviceLabel', 'estimate', 'preferredDay', 'notes', 'howHeard', 'pageUrl', 'utm', 'photoKeys', 'email_status',
];

export default async (req: Request) => {
  const user = Netlify.env.get('ADMIN_USER');
  const pass = Netlify.env.get('ADMIN_PASS');
  if (!user || !pass) return new Response('Export disabled: set ADMIN_USER and ADMIN_PASS.', { status: 503 });

  const auth = req.headers.get('authorization') || '';
  const [scheme, encoded] = auth.split(' ');
  let okAuth = false;
  if (scheme === 'Basic' && encoded) {
    const [u, ...rest] = atob(encoded).split(':');
    okAuth = safeEqual(u, user) && safeEqual(rest.join(':'), pass);
  }
  if (!okAuth) {
    return new Response('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Smith & Shine bookings", charset="UTF-8"' },
    });
  }

  const store = getStore({ name: 'bookings', consistency: 'strong' });
  const rows: Record<string, unknown>[] = [];
  for await (const page of store.list({ paginate: true })) {
    for (const blob of page.blobs) {
      const r = await store.get(blob.key, { type: 'json' });
      if (r) rows.push(r as Record<string, unknown>);
    }
  }
  rows.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

  const cell = (v: unknown) => {
    let s = v == null ? '' : typeof v === 'object' ? (Array.isArray(v) ? v.join(' ') : Object.entries(v as object).map(([k, x]) => `${k}=${x}`).join('; ')) : String(v);
    if (/^[=+\-@]/.test(s)) s = `'${s}`; // stop spreadsheet formula injection
    return `"${s.replace(/"/g, '""')}"`;
  };
  const csv = '﻿' + [COLUMNS.join(','), ...rows.map((r) => COLUMNS.map((c) => cell(r[c])).join(','))].join('\r\n');
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="smith-and-shine-bookings-${date}.csv"`,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
};

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const config: Config = { path: '/api/bookings.csv', method: 'GET' };
