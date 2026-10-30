import type { APIRoute } from 'astro';
import { business } from '../config/site';
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: business.name,
      short_name: 'Bond Cleaning Co.',
      description: business.positioning,
      start_url: '/',
      display: 'standalone',
      background_color: '#FFFFFF',
      theme_color: '#12304A',
      icons: [
        { src: '/android-chrome-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/app-icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } }
  );
