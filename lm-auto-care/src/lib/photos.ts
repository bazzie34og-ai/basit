// Content files refer to photos by short key; this maps the key to the real image.
import type { ImageMetadata } from 'astro';
import van from '../assets/photos/lm-auto-care-van-and-kit-on-site-mg-hs.jpg';
import foam from '../assets/photos/mazda-cx3-snow-foam-mobile-valet-aberdeen.jpg';
import mazdaFront from '../assets/photos/mazda-cx3-interior-front-seats-after-valet.jpg';
import mazdaRear from '../assets/photos/mazda-cx3-rear-seats-after-interior-valet.jpg';
import cheryInt from '../assets/photos/chery-tiggo7-interior-after-valet.jpg';
import cheryExt from '../assets/photos/chery-tiggo7-exterior-after-valet.jpg';
import mgRed from '../assets/photos/mg-hs-red-exterior-after-valet.jpg';
import mgRearBefore from '../assets/before-after/mg-hs-exterior-before-rear.jpg';

export const photos: Record<string, ImageMetadata> = { van, foam, mazdaFront, mazdaRear, cheryInt, cheryExt, mgRed, mgRearBefore };

export function photo(key: string): ImageMetadata {
  const p = photos[key];
  if (!p) throw new Error(`Unknown photo key: ${key}`);
  return p;
}
