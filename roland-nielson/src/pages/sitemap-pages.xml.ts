// Pages + posts with image entries. Excludes noindex pages (thank-you, review, 404).
import { allEntries, ogSlug } from '../lib/registry';
import { abs } from '../config/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;');
export async function GET() {
  const entries = (await allEntries()).filter((e) => !e.noindex);
  const urls = entries.map((e) => {
    const images = [...(e.images ?? []), { loc: `/og/${ogSlug(e.path)}.png`, title: e.title }];
    return `<url><loc>${abs(e.path)}</loc><lastmod>${e.lastmod}</lastmod><priority>${(e.priority ?? 0.5).toFixed(1)}</priority>${images
      .map((i) => `<image:image><image:loc>${abs(i.loc)}</image:loc><image:title>${esc(i.title)}</image:title></image:image>`)
      .join('')}</url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls.join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
