import type { APIRoute } from 'astro';
import { PREVIEW_MODE, SITE_URL } from '../lib/env.ts';

// Preview: keep everything out of Google. Live: allow all, point at the sitemap.
export const GET: APIRoute = () => {
  const body = PREVIEW_MODE
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /thank-you/\n\nSitemap: ${SITE_URL}/sitemap-index.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
