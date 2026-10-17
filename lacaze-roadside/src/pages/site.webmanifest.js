import business from '../data/business.json';
export function GET() {
  return new Response(JSON.stringify({
    name: business.name,
    short_name: business.shortName,
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0D0E',
    theme_color: '#0B0D0E',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }, null, 2), { headers: { 'Content-Type': 'application/manifest+json' } });
}
