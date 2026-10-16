// Video sitemap: the YouTube message and the self-hosted recovery story, on every page that shows them.
import { pages } from '../data/pages';
import { site, abs } from '../config/site';
import data from '../data/recovery-video.json';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;');
export function GET() {
  const yt = site.videos.youtube, rv = site.videos.recovery;
  const video = {
    youtube: `<video:video><video:thumbnail_loc>https://i.ytimg.com/vi/${yt.id}/hqdefault.jpg</video:thumbnail_loc><video:title>${esc(yt.title)}</video:title><video:description>${esc(yt.description)}</video:description><video:player_loc>https://www.youtube-nocookie.com/embed/${yt.id}</video:player_loc>${yt.uploadDate ? `<video:publication_date>${yt.uploadDate}</video:publication_date>` : ''}<video:family_friendly>yes</video:family_friendly></video:video>`,
    recovery: `<video:video><video:thumbnail_loc>${abs('/videos/roland-recovery-story-poster.jpg')}</video:thumbnail_loc><video:title>${esc(rv.title)}</video:title><video:description>${esc(rv.description)}</video:description><video:content_loc>${abs(`/videos/${rv.slug}.mp4`)}</video:content_loc><video:duration>${data.durationSeconds}</video:duration>${rv.uploadDate ? `<video:publication_date>${rv.uploadDate}</video:publication_date>` : ''}<video:family_friendly>yes</video:family_friendly></video:video>`,
  };
  const urls = pages.filter((p) => p.videos?.length && !p.noindex).map((p) => `<url><loc>${abs(p.path)}</loc>${p.videos!.map((v) => video[v]).join('')}</url>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${urls.join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
