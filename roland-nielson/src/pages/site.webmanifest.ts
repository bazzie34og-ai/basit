import { site } from '../config/site';
export function GET() {
  return new Response(JSON.stringify({
    name: site.name,
    short_name: site.shortName,
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F1EA',
    theme_color: site.themeColor,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }, null, 2), { headers: { 'Content-Type': 'application/manifest+json' } });
}
