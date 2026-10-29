import { siteUrl, previewMode } from '../lib/site';
export function GET() {
  const body = previewMode
    ? `# Preview build: not for indexing\nUser-agent: *\nDisallow: /\n`
    : `User-agent: *\nAllow: /\nDisallow: /thank-you/\n\nSitemap: ${siteUrl}/sitemap-index.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
