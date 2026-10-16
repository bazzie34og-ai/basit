import { abs } from '../config/site';
export function GET() {
  const now = new Date().toISOString();
  const maps = ['/sitemap-pages.xml', '/sitemap-video.xml'];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${maps.map((m) => `<sitemap><loc>${abs(m)}</loc><lastmod>${now}</lastmod></sitemap>`).join('')}</sitemapindex>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
