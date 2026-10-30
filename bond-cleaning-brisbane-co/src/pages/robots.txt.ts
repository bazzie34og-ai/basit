import type { APIRoute } from 'astro';
// Preview builds stay crawlable so the noindex header and meta tag can be seen; production lists the sitemap.
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\nDisallow: /thank-you/\nDisallow: /styleguide/\n\nSitemap: ${new URL('/sitemap-index.xml', site)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
