/**
 * The 6 real before/after photos. Alt text and captions are exactly as in
 * the kit's photo-placement.md. To add a new job, drop the photo in
 * src/assets/photos/ (name it [service]-[suburb]-[item]-before-after.jpg)
 * and add an entry here.
 */
import type { ImageMetadata } from 'astro';
import { flags } from '../config/site';
import oven from '../assets/photos/bond-cleaning-brisbane-oven-door-before-after.jpg';
import fan from '../assets/photos/bond-cleaning-brisbane-ceiling-fan-before-after.jpg';
import shower from '../assets/photos/end-of-lease-cleaning-brisbane-shower-before-after.jpg';
import carpet from '../assets/photos/bond-cleaning-brisbane-carpet-steam-clean-before-after.jpg';
import cupboard from '../assets/photos/end-of-lease-cleaning-brisbane-under-sink-cupboard-before-after.jpg';
import laundry from '../assets/photos/bond-cleaning-brisbane-laundry-before-after.jpg';
import ovenBefore from '../assets/photos/bond-cleaning-brisbane-oven-door-before.jpg';
import ovenAfter from '../assets/photos/bond-cleaning-brisbane-oven-door-after.jpg';

export type PhotoKey = 'oven' | 'fan' | 'shower' | 'carpet' | 'cupboard' | 'laundry';

export interface Photo {
  key: PhotoKey;
  src: ImageMetadata;
  file: string;
  alt: string;
  caption: string;
  room: 'Kitchen' | 'Bathroom' | 'Carpet' | 'Laundry' | 'Fans';
  service: string;
  suburb?: string;
}

export const photos: Record<PhotoKey, Photo> = {
  oven: {
    key: 'oven',
    src: oven,
    file: 'bond-cleaning-brisbane-oven-door-before-after',
    alt: 'Oven door glass before and after a bond clean in Brisbane, baked-on grease removed',
    caption: 'Oven door glass: baked-on grease removed for the final inspection',
    room: 'Kitchen',
    service: '/oven-cleaning-brisbane/',
  },
  fan: {
    key: 'fan',
    src: fan,
    file: 'bond-cleaning-brisbane-ceiling-fan-before-after',
    alt: 'Dusty ceiling fan blades before and after end of lease cleaning in Brisbane',
    caption: 'Ceiling fans: thick dust cleared from every blade',
    room: 'Fans',
    service: '/house-bond-cleaning-brisbane/',
  },
  shower: {
    key: 'shower',
    src: shower,
    file: 'end-of-lease-cleaning-brisbane-shower-before-after',
    alt: 'Shower tiles and grout before and after end of lease cleaning in Brisbane',
    caption: 'Shower: soap scum, grout and floor tiles cleaned to the agent checklist',
    room: 'Bathroom',
    service: '/end-of-lease-cleaning-brisbane/',
  },
  carpet: {
    key: 'carpet',
    src: carpet,
    file: 'bond-cleaning-brisbane-carpet-steam-clean-before-after',
    alt: 'Bedroom carpet before and after steam cleaning during a Brisbane bond clean',
    caption: flags.freeCarpet
      ? 'Carpet: steam cleaned [complimentary with every bond clean]'
      : 'Carpet: steam cleaned for the final inspection',
    room: 'Carpet',
    service: '/carpet-steam-cleaning-brisbane/',
  },
  cupboard: {
    key: 'cupboard',
    src: cupboard,
    file: 'end-of-lease-cleaning-brisbane-under-sink-cupboard-before-after',
    alt: 'Stained under-sink cupboard before and after end of lease cleaning in Brisbane',
    caption: 'Kitchen cupboards: cleaned inside, not just the doors',
    room: 'Kitchen',
    service: '/vacate-cleaning-brisbane/',
  },
  laundry: {
    key: 'laundry',
    src: laundry,
    file: 'bond-cleaning-brisbane-laundry-before-after',
    alt: 'Laundry floor and walls before and after a bond clean in Brisbane',
    caption: 'Laundry: floors, walls and corners cleaned for handover',
    room: 'Laundry',
    service: '/move-out-cleaning-brisbane/',
  },
};

export const photoOrder: PhotoKey[] = ['oven', 'fan', 'shower', 'carpet', 'cupboard', 'laundry'];

export const slider = {
  before: ovenBefore,
  after: ovenAfter,
  alt: 'Oven door glass before and after a bond clean in Brisbane, baked-on grease removed',
};
