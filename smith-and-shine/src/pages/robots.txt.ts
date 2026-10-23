import type { APIRoute } from 'astro';
import { PREVIEW_MODE, SITE_URL } from '../config/env.ts';

export const GET: APIRoute = () => {
  const body = PREVIEW_MODE
    ? `# Preview build: keep out of search until go-live\nUser-agent: *\nDisallow: /\n`
    : `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /thank-you/\n\nSitemap: ${SITE_URL}/sitemap-index.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
