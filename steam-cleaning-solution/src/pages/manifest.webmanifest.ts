import type { APIRoute } from 'astro';
import { business } from '../config/site';

export const GET: APIRoute = () =>
  new Response(JSON.stringify({
    name: business.name,
    short_name: 'Steam Cleaning',
    start_url: '/',
    display: 'browser',
    background_color: '#F4F1E8',
    theme_color: '#124932',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }, null, 2), { headers: { 'Content-Type': 'application/manifest+json' } });
