import { abs } from '../config/site';
export function GET() {
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap-index.xml')}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
