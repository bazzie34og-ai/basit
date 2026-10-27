import { abs } from '../config/site';
import { allEntries } from '../lib/registry';
// lastmod = the newest page date, so the index changes only when content does.
export async function GET() {
  const now = (await allEntries()).map((e) => e.lastmod).sort().at(-1);
  const maps = ['/sitemap-pages.xml', '/sitemap-video.xml'];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${maps.map((m) => `<sitemap><loc>${abs(m)}</loc><lastmod>${now}</lastmod></sitemap>`).join('')}</sitemapindex>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
