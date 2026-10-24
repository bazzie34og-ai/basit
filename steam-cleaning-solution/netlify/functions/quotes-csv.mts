import type { Config } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { timingSafeEqual } from 'node:crypto';

const safeEq = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};
const unauthorised = () => new Response('Authentication required', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Quotes", charset="UTF-8"', 'Cache-Control': 'no-store' } });

export function toCsv(rows: Record<string, unknown>[], cols: string[]): string {
  const cell = (v: unknown) => {
    let s = Array.isArray(v) ? v.join('; ') : v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // stop spreadsheet formula injection
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\r\n');
}

export default async (req: Request) => {
  const user = process.env.ADMIN_USER, pass = process.env.ADMIN_PASS;
  if (!user || !pass) return new Response('Export disabled: set ADMIN_USER and ADMIN_PASS', { status: 503 });
  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Basic ')) return unauthorised();
  const [u, ...p] = Buffer.from(auth.slice(6), 'base64').toString().split(':');
  if (!safeEq(u, user) || !safeEq(p.join(':'), pass)) return unauthorised();

  const store = getStore('quotes');
  const { blobs } = await store.list();
  const rows: Record<string, unknown>[] = [];
  for (const b of blobs) {
    const r = (await store.get(b.key, { type: 'json' })) as Record<string, unknown> | null;
    if (!r) continue;
    const t = (r.touch || {}) as Record<string, string>;
    rows.push({ ...r, utm_source: t.utm_source, utm_medium: t.utm_medium, utm_campaign: t.utm_campaign, fbclid: t.fbclid, landing: t.landing, photos: (r.photoKeys as string[] | undefined)?.length ?? 0 });
  }
  rows.sort((a, b) => String(b.receivedAt).localeCompare(String(a.receivedAt)));
  const cols = ['id', 'receivedAt', 'name', 'phone', 'email', 'postcode', 'outOfArea', 'summary', 'days', 'notes', 'heard', 'photos', 'utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'landing', 'email_status', 'autoreply_status'];
  return new Response('﻿' + toCsv(rows, cols), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="quotes-${new Date().toISOString().slice(0, 10)}.csv"`, 'Cache-Control': 'no-store' },
  });
};

export const config: Config = { path: '/api/quotes.csv' };
