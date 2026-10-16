import { getPosts, postPath } from '../../lib/blog';
import { site, abs } from '../../config/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export async function GET() {
  const posts = await getPosts();
  const items = posts.map((p) => `<item><title>${esc(p.data.title)}</title><link>${abs(postPath(p))}</link><guid>${abs(postPath(p))}</guid><pubDate>${p.data.published.toUTCString()}</pubDate><description>${esc(p.data.description)}</description></item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(site.name)} – Blog</title><link>${abs('/blog/')}</link><description>Notes for men rebuilding</description><language>en-us</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
