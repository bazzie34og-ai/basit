// Netlify _redirects, generated so the /review/ link follows config (GBP review link).
// Trailing slashes are handled by Netlify's pretty URLs (/about → /about/).
import { site } from '../config/site';

export function redirectsFile() {
  const lines = [
    '# Canonical host: HTTPS, no www',
    'http://rolandnielson.com/*      https://rolandnielson.com/:splat 301!',
    'http://www.rolandnielson.com/*  https://rolandnielson.com/:splat 301!',
    'https://www.rolandnielson.com/* https://rolandnielson.com/:splat 301!',
    '',
    '# Old one-page site anchors and files',
    '/story          /about/                                           301',
    '/approach       /mens-life-coaching-omaha/                        301',
    '/roland.jpeg    /images/roland-nielson-mens-life-coach-omaha.jpg  301',
    '/roland.jpg     /images/roland-nielson-mens-life-coach-omaha.jpg  301',
    '/index.html     /                                                 301',
    '',
    '# Blog posts that became question pages (Oct 2026)',
    '/blog/how-much-does-a-life-coach-cost-in-omaha/  /how-much-does-a-life-coach-cost-omaha/  301',
    '/blog/life-coach-vs-therapist/                   /life-coach-vs-therapist/                301',
    '',
    '# Short links',
    '/book           ' + site.booking + '  302',
    ...(site.gbp.reviewLink ? ['/review         ' + site.gbp.reviewLink + '  302!', '/review/        ' + site.gbp.reviewLink + '  302!'] : []),
  ];
  return lines.join('\n') + '\n';
}
