/**
 * Photo registry: one place for every photo's alt text and caption.
 * These are Diamond Plate's national work (some are Sydney homes), so captions
 * say "Diamond Plate work" and never name a Brisbane suburb.
 */
import type { ImageMetadata } from 'astro';
import { business } from './site';
import hero from '../assets/photos/hero-cinematic-garage-dark.jpg';
import nateInspect from '../assets/photos/technician-nate-inspecting-red-paint.jpg';
import nateDog from '../assets/photos/technician-nate-applying-coating-with-dog.jpg';
import nateCustomer from '../assets/photos/technician-nate-with-happy-customer.jpg';
import amg from '../assets/photos/mercedes-amg-gt-ceramic-coating.jpg';
import lambo from '../assets/photos/lamborghini-huracan-black-ceramic-coating.jpg';
import rav4 from '../assets/photos/toyota-rav4-silver-ceramic-coating.jpg';
import xtrail from '../assets/photos/nissan-xtrail-grey-ceramic-coating.jpg';
import kona from '../assets/photos/hyundai-kona-blue-ceramic-coating.jpg';
import glc from '../assets/photos/mercedes-glc-white-ceramic-coating.jpg';
import megane from '../assets/photos/renault-megane-rs-orange-ceramic-coating.jpg';
import brzBefore from '../assets/photos/subaru-brz-before.jpg';
import brzAfter from '../assets/photos/subaru-brz-after.jpg';

export interface Photo { src: ImageMetadata; alt: string; caption: string }

const work = 'Diamond Plate work';

export const photos = {
  hero: { src: hero, alt: 'Dark luxury car in a garage, ready for a ceramic coating', caption: '' },
  nateInspect: {
    src: nateInspect,
    alt: 'Diamond Plate applicator inspecting red car paint before applying ceramic coating',
    caption: business.technicianCaption,
  },
  nateDog: {
    src: nateDog,
    alt: 'Diamond Plate applicator coating alloy wheels in a home driveway during a mobile ceramic coating job',
    caption: `${business.technicianCaption}, on a driveway job`,
  },
  nateCustomer: {
    src: nateCustomer,
    alt: 'Happy customer with the Diamond Plate applicator after a ceramic coating hand-over',
    caption: `${business.technicianCaption}, at hand-over`,
  },
  amg: { src: amg, alt: 'Black Mercedes-AMG GT with graphene ceramic coating applied by Diamond Plate', caption: `${work}: Mercedes-AMG GT` },
  lambo: { src: lambo, alt: 'Black Lamborghini Huracán showing deep gloss after graphene ceramic coating', caption: `${work}: Lamborghini Huracán` },
  rav4: { src: rav4, alt: 'Silver Toyota RAV4 family SUV protected with Diamond Plate ceramic paint protection', caption: `${work}: Toyota RAV4` },
  xtrail: { src: xtrail, alt: 'Grey Nissan X-Trail with new car paint protection from a ceramic coating', caption: `${work}: Nissan X-Trail` },
  kona: { src: kona, alt: 'Blue Hyundai Kona with glossy ceramic coated paint in a driveway', caption: `${work}: Hyundai Kona` },
  glc: { src: glc, alt: 'White Mercedes GLC front end after a Diamond Plate ceramic coating', caption: `${work}: Mercedes GLC` },
  megane: { src: megane, alt: 'Orange Renault Megane RS with graphene ceramic coating reflecting the sky', caption: `${work}: Renault Megane RS` },
  brzBefore: { src: brzBefore, alt: 'Blue Subaru BRZ before ceramic coating, with dull, contaminated paint on the bonnet', caption: '' },
  brzAfter: { src: brzAfter, alt: 'Blue Subaru BRZ after decontamination and ceramic coating, with clean glossy paint', caption: '' },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
