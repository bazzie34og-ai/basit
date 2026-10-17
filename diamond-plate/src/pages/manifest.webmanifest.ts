import type { APIRoute } from 'astro';
import { business } from '../config/site';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: business.name,
      short_name: business.shortName,
      start_url: '/',
      display: 'standalone',
      background_color: '#05070B',
      theme_color: '#05070B',
      icons: [
        { src: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/favicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
