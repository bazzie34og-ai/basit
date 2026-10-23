/**
 * Smith & Shine: every business fact lives here, once.
 *
 * Change a price, phone number or area in this file and the whole site,
 * the schema, the booking form, the estimator and the booking emails follow.
 *
 * Anything marked TODO-CONFIRM is unverified and listed in README.md.
 * Never add a fact here that the owner hasn't given us.
 */

// ---------------------------------------------------------------------------
// Business
// ---------------------------------------------------------------------------

export const business = {
  // TODO-CONFIRM: exact Google Business Profile name, character for character.
  // Facebook writes it "Smith&Shine"; the price list writes "Smith & Shine".
  name: 'Smith & Shine',
  facebookName: 'Smith&Shine',
  tagline: 'Detailing & Valeting Specialists · Auto Detailing Aficionado',
  descriptor: 'Mobile valeting & detailing · Telford, Shropshire',
  owner: 'Chris',
  ownerNickname: 'Mr Smith',
  // TODO-CONFIRM: reviews name "Kirt" (and once "Kirk"), and one says "Chris and his son".
  // Until confirmed we only ever say "Chris and the team".
  teamLine: 'Chris and the team',
  locality: 'Telford',
  region: 'Shropshire',
  country: 'GB',
  // TODO-CONFIRM: real working hours. Facebook says "Always open";
  // reviews mention weekday and Saturday visits. Left out of schema until confirmed.
  hoursText: 'Weekdays and Saturdays, by appointment',
  // TODO-CONFIRM: accepted payment methods.
  paymentText: '',
  // TODO-CONFIRM: typical reply time.
  replyPromise: 'We usually reply the same day.',
  // Mobile service-area business: never publish a street address.
  serviceModel: 'We come to you: home, driveway or work.',
} as const;

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

// ⚠️ TODO-CONFIRM (FIRST PRIORITY): the price-list graphics say 07433 723029,
// Facebook says +44 7422 723029. Using the price-list number as a placeholder.
// It must match the Google Business Profile exactly.
export const phone = '07433 723029';

/** +447433723029 */
export const phoneE164 = '+44' + phone.replace(/\s/g, '').replace(/^0/, '');
/** 447433723029 (for wa.me links) */
export const whatsappNumber = phoneE164.replace('+', '');
export const telHref = `tel:${phoneE164}`;

export function whatsappHref(text?: string): string {
  const base = `https://wa.me/${whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const social = {
  instagram: { handle: '@smith.and.shine', url: 'https://www.instagram.com/smith.and.shine/' },
  // TODO-CONFIRM: Facebook page URL. Shown only once filled in.
  facebook: { name: 'Smith&Shine', url: '', recommend: '96%', reviewCount: 19 },
  // TODO-CONFIRM: Google Maps / Business Profile URL. Shown only once filled in.
  googleMaps: '',
  // TODO-CONFIRM: direct Google reviews URL and "write a review" URL.
  // Until then these fall back to a Google search for the business.
  googleReviews: 'https://www.google.com/search?q=Smith+%26+Shine+Telford+reviews',
  googleWriteReview: 'https://www.google.com/search?q=Smith+%26+Shine+Telford+reviews',
};

// TODO-CONFIRM: current Google review count and rating (about 72–75, all five-star).
export const googleRating = {
  stars: 5,
  label: '70+',
  summary: '★★★★★ 70+ Google reviews',
};

// ---------------------------------------------------------------------------
// Prices (from the Smith & Shine 2026 price list, exactly)
// ---------------------------------------------------------------------------

export type SizeId = 'small' | 'medium' | 'large' | 'suv' | 'van' | 'motorbike';

export const sizes: { id: SizeId; label: string; hint: string }[] = [
  // TODO-CONFIRM: the example cars for each size are our guide, not Chris's.
  { id: 'small', label: 'Small', hint: 'e.g. Fiesta, Corsa, Polo, Fiat 500' },
  { id: 'medium', label: 'Medium', hint: 'e.g. Focus, Golf, Audi A3, Tesla Model 3' },
  { id: 'large', label: 'Large', hint: 'e.g. estates, Audi A6, BMW 5 Series' },
  { id: 'suv', label: '4x4-SUV', hint: 'e.g. Qashqai, F-Pace, Ranger, Range Rover' },
  { id: 'van', label: 'Van', hint: 'e.g. Transit Custom, Vivaro, VW ID. Buzz' },
  { id: 'motorbike', label: 'Motorbike', hint: 'Any bike, from scooters to Harleys' },
];

export const monthlyPlan = {
  name: 'Monthly Detail Package',
  pitch: 'Why not look after your car in 2026 with our Smith & Shine Monthly Detail Package',
  url: '/monthly-valet-plan/',
  // price per visit, in pounds
  prices: [
    { size: 'small' as SizeId, label: 'Small cars', price: 30 },
    { size: 'medium' as SizeId, label: 'Medium cars', price: 40 },
    { size: 'large' as SizeId, label: 'Large cars', price: 50 },
    { size: 'suv' as SizeId, label: '4x4 & SUV', price: 60 },
  ],
  includes: [
    '3-stage wash process',
    'Tar removal',
    'Alloy wheels cleaned and protected',
    'Tyres dressed and shined',
    'Exterior plastics restored',
    'Hydrophobic paint protection',
    'Polish',
    'Windows cleaned inside and out',
    'Full interior vacuum (including boot)',
    'Dashboard cleaned and shined',
    'Seats cleaned',
    'Air freshener',
  ],
};

export type ServiceId =
  | 'monthly'
  | 'mini-valet'
  | 'full-valet'
  | 'full-valet-deep'
  | 'detailing'
  | 'paint-correction'
  | 'moto-clean'
  | 'moto-detail'
  | 'van-mini'
  | 'ceramic'
  | 'ppf'
  | 'not-sure';

export interface Service {
  id: ServiceId;
  /** Name on the price board */
  name: string;
  /** Name in the booking form dropdown and emails */
  formLabel: string;
  /** "from" price in pounds; null = price on quote; monthly uses monthlyPlan.prices */
  from: number | null;
  group: 'monthly' | 'cars' | 'motorbikes' | 'vans' | 'quote';
  /** Which sizes this service is for */
  forSizes: SizeId[];
  url: string;
  /** One plain-English line */
  blurb: string;
  enabled: boolean;
}

const CARS: SizeId[] = ['small', 'medium', 'large', 'suv'];
const CARS_AND_VANS: SizeId[] = [...CARS, 'van'];

export const services: Service[] = [
  {
    id: 'monthly', name: 'Monthly Detail Package', formLabel: 'Monthly Detail Package',
    from: 30, group: 'monthly', forSizes: CARS, url: '/monthly-valet-plan/',
    blurb: 'A proper clean inside and out, every month, on your driveway.', enabled: true,
  },
  {
    id: 'mini-valet', name: 'Mini Valet & Polish', formLabel: 'Mini Valet & Polish',
    from: 45, group: 'cars', forSizes: CARS, url: '/mini-valet-telford/',
    blurb: 'A quick freshen-up with a polish. Ideal between bigger cleans.', enabled: true,
  },
  {
    id: 'full-valet', name: 'Full Valet', formLabel: 'Full Valet',
    from: 70, group: 'cars', forSizes: CARS, url: '/full-valet-telford/',
    blurb: 'Every surface, inside and out. The one most people book first.', enabled: true,
  },
  {
    id: 'full-valet-deep', name: 'Full Valet & Deep Clean', formLabel: 'Full Valet & Deep Clean',
    from: 90, group: 'cars', forSizes: CARS, url: '/full-valet-telford/#deep-clean',
    blurb: 'For stains, pet hair, spills and cars that have been "lived in".', enabled: true,
  },
  {
    id: 'detailing', name: 'Detailing', formLabel: 'Detailing',
    from: 110, group: 'cars', forSizes: CARS, url: '/car-detailing-telford/',
    blurb: 'Slower, deeper work on paint, wheels, trim and interior.', enabled: true,
  },
  {
    id: 'paint-correction', name: 'Detailing & Paint Correction', formLabel: 'Detailing & Paint Correction',
    from: 160, group: 'cars', forSizes: CARS, url: '/paint-correction-telford/',
    blurb: 'Machine polishing that removes swirls and light scratches.', enabled: true,
  },
  {
    id: 'moto-clean', name: 'Clean & Shine', formLabel: 'Motorbike: Clean & Shine',
    from: 60, group: 'motorbikes', forSizes: ['motorbike'], url: '/motorbike-detailing-telford/',
    blurb: 'A careful wash and shine for your bike.', enabled: true,
  },
  {
    id: 'moto-detail', name: 'Full Detail', formLabel: 'Motorbike: Full Detail',
    from: 120, group: 'motorbikes', forSizes: ['motorbike'], url: '/motorbike-detailing-telford/',
    blurb: 'Engine, chrome, paint and wheels, done properly.', enabled: true,
  },
  {
    id: 'van-mini', name: 'Mini Valet', formLabel: 'Van: Mini Valet',
    from: 60, group: 'vans', forSizes: ['van'], url: '/van-valeting-telford/',
    blurb: 'Cab and outside cleaned for work vans and campers.', enabled: true,
  },
  {
    // TODO-CONFIRM: ceramic product brand(s) and warranty.
    id: 'ceramic', name: 'Ceramic coating', formLabel: 'Ceramic coating (quote)',
    from: null, group: 'quote', forSizes: CARS_AND_VANS, url: '/ceramic-coating-telford/',
    blurb: 'A hard, glossy layer that makes washing easier and beads water.', enabled: true,
  },
  {
    // TODO-CONFIRM: PPF brand, warranty, and whether it's full or partial wraps.
    id: 'ppf', name: 'Paint protection film (PPF)', formLabel: 'Paint protection film (quote)',
    from: null, group: 'quote', forSizes: CARS_AND_VANS, url: '/paint-protection-film-telford/',
    blurb: 'Clear film over the paint that takes stone chips so your paint doesn’t.', enabled: true,
  },
  {
    id: 'not-sure', name: 'Not sure yet', formLabel: 'Not sure: help me choose',
    from: null, group: 'quote', forSizes: [...CARS_AND_VANS, 'motorbike'], url: '/prices/',
    blurb: 'Tell us about the car and Chris will suggest the right clean.', enabled: true,
  },
];

/** Feature flags. Switch PPF off here and its page, links and form option all go. */
export const features = {
  ppf: { enabled: true },
};

for (const s of services) if (s.id === 'ppf') s.enabled = features.ppf.enabled;

export const activeServices = services.filter((s) => s.enabled);
export const serviceById = (id: string) => activeServices.find((s) => s.id === id);

export const priceRange = '£30–£160+';
export const formatGBP = (n: number) => `£${n.toLocaleString('en-GB')}`;

// ---------------------------------------------------------------------------
// Areas (from the business's own hashtags) TODO-CONFIRM full coverage
// ---------------------------------------------------------------------------

export interface Area {
  slug: string | null; // null = covered on the home page
  name: string;
  url: string;
  /** rough position for the stylised map, from lat/long */
  lat: number;
  lon: number;
}

export const areas: Area[] = [
  { slug: null, name: 'Telford', url: '/', lat: 52.676, lon: -2.447 },
  { slug: 'shrewsbury', name: 'Shrewsbury', url: '/areas/shrewsbury/', lat: 52.708, lon: -2.754 },
  { slug: 'shifnal-albrighton', name: 'Shifnal', url: '/areas/shifnal-albrighton/', lat: 52.666, lon: -2.373 },
  { slug: 'shifnal-albrighton', name: 'Albrighton', url: '/areas/shifnal-albrighton/', lat: 52.637, lon: -2.279 },
  { slug: 'newport-shropshire', name: 'Newport', url: '/areas/newport-shropshire/', lat: 52.769, lon: -2.378 },
  { slug: 'bridgnorth', name: 'Bridgnorth', url: '/areas/bridgnorth/', lat: 52.535, lon: -2.42 },
  { slug: 'ironbridge-madeley-broseley', name: 'Ironbridge', url: '/areas/ironbridge-madeley-broseley/', lat: 52.628, lon: -2.486 },
];

/** Area pages, in footer order */
export const areaPages = [
  { url: '/areas/shrewsbury/', name: 'Shrewsbury' },
  { url: '/areas/shifnal-albrighton/', name: 'Shifnal & Albrighton' },
  { url: '/areas/newport-shropshire/', name: 'Newport' },
  { url: '/areas/bridgnorth/', name: 'Bridgnorth' },
  { url: '/areas/ironbridge-madeley-broseley/', name: 'Ironbridge, Madeley & Broseley' },
];

// TODO-CONFIRM: the full list of Telford estates covered.
export const telfordVillages = [
  'Wellington', 'Hadley', 'Donnington', 'Oakengates', 'Priorslee', 'Lawley', 'Dawley',
  'Madeley', 'Stirchley', 'Ketley', 'Leegomery', 'Trench', 'Muxton', 'St Georges',
];

/** Every town for schema areaServed */
export const areaServed = [
  'Telford', 'Shrewsbury', 'Shifnal', 'Albrighton', 'Newport', 'Bridgnorth',
  'Ironbridge', 'Madeley', 'Broseley', 'Wellington',
];

// ---------------------------------------------------------------------------
// Reviews: real Google reviews, word for word. Never edit the text.
// ---------------------------------------------------------------------------

export interface Review {
  name: string;
  text: string;
  tag: string; // what the job was, for context (not part of the quote)
}

export const reviews: Review[] = [
  {
    name: 'Aimee P.',
    tag: 'Regular customer · family car',
    // keep "then": it's in the original
    text: 'Excellent job as always, for a family of 4 children the car gets grubby! Chris provides a fantastic service with the ease of him coming to the house. Always happy with then end result and feel it’s so worth the money. He is also really friendly and always a pleasure to see again.',
  },
  {
    name: 'Andrew P.',
    tag: 'Jaguar XE · paint work',
    text: 'Mr Smith worked hard on my jaguar xe to get her best results. At the time before her repair there was alot of damage to the paint work on the passenger side however, Mr Smith knew just what to do and the damage was barely noticeable after her time with him. Great service definitely worth the money.',
  },
  {
    name: 'Tasha K.',
    tag: 'Late booking',
    text: 'Was a late booking and he fitted me in perfectly. He has done an amazing job at an excellent price really, would completely recommend him to do your car. I will definitely be having mine done again. My car looks shiny, clean inside and out and smells divine.',
  },
  {
    name: 'John J.',
    tag: 'Dog owners',
    text: 'Great service from great guys. To be honest our car was a tip with ground in dirt, marks and stains (dog owners) It is now gleaming like a brand new car....If we could give more than five stars we would!!',
  },
  {
    name: 'Luke D.',
    tag: 'Van · full valet for resale',
    text: 'Awesome service all round by Chris and his team. Had a full valet done on my van for resale. I couldn’t be happier with the end result. Almost looks like new again! Really friendly, Proffesional guys..would recommend to anyone. Thank you!',
  },
  {
    name: 'Josh P.',
    tag: 'Fixed price',
    text: 'Did a fantastic job with great communication. East to talk to sticks to a quoted price. Great time keeping skills and easy going with the timing.',
  },
  {
    name: 'Matt S.',
    tag: 'Two cars · mini valet + paint correction',
    text: 'Fantastic job from Chris and team on our two cars. A mini valet for one and some paint correction and protection work on the other. See you next month :-)',
  },
  {
    name: 'Andrew R.',
    tag: 'Rainy day',
    text: 'Had my car done today, Chris was very punctual, although it was raining, he still managed to do a fantastic job thst I have just not had time to do. Attention to detail is brilliant, would highly recommend.',
  },
  {
    name: 'Kyle H.',
    tag: 'VW ID. Buzz',
    text: 'Chris made my VW Buzz look like brand new! Amazing quality work!!',
  },
  {
    name: 'Iain W.',
    tag: 'Saturday morning',
    text: 'Guys came round on a Saturday morning and cleaned wife’s car. Amazing job and great price. Will definitely be using them again',
  },
];

export const reviewByName = (name: string) => {
  const r = reviews.find((x) => x.name === name);
  if (!r) throw new Error(`Unknown review: ${name}`);
  return r;
};

/**
 * Short phrases from reviews that were cut off with "…More" on Google.
 * We never show these as full reviews, only as the exact fragment, credited.
 */
export const reviewFragments = {
  tesla: { text: 'The car looks better than the day I collected it.', name: 'Anthony C.', car: 'Tesla Model 3' },
  ranger: { text: 'made my ranger look brand new', name: 'Geoff H.', car: 'Ford Ranger' },
  carWashes: { text: 'After trying multiple car washes in the area and being disappointed with the results, I decided to try Smith and Shine and I’m so glad I did.', name: 'Harry M.' },
  informative: { text: 'He was very informative, telling me what he has done and what he can do in the future.', name: 'Claire B.' },
  onions: { text: 'knows his onions (and is happy to talk shop too!)', name: 'A Google reviewer' },
  urgent: { text: 'Chris really did his best to sort me out asap as I needed a full valeting service urgently', name: 'Claire L.' },
  quick: { text: 'Quick response when first contacted it, reliable and an amazing result in the end!', name: 'Ana M.' },
  threeCars: { text: 'We had three cars and a motorbike cleaned', name: 'Corinna W.' },
};

// ---------------------------------------------------------------------------
// Navigation (6 items max)
// ---------------------------------------------------------------------------

export const nav = {
  valeting: {
    label: 'Valeting',
    links: [
      { url: '/monthly-valet-plan/', label: 'Monthly plan', note: 'from £30' },
      { url: '/mini-valet-telford/', label: 'Mini valet & polish', note: 'from £45' },
      { url: '/full-valet-telford/', label: 'Full valet', note: 'from £70' },
      { url: '/van-valeting-telford/', label: 'Vans', note: 'from £60' },
      { url: '/motorbike-detailing-telford/', label: 'Motorbikes', note: 'from £60' },
    ],
  },
  detailing: {
    label: 'Detailing & Protection',
    links: [
      { url: '/car-detailing-telford/', label: 'Car detailing', note: 'from £110' },
      { url: '/paint-correction-telford/', label: 'Paint correction', note: 'from £160' },
      { url: '/ceramic-coating-telford/', label: 'Ceramic coating', note: 'on quote' },
      ...(features.ppf.enabled
        ? [{ url: '/paint-protection-film-telford/', label: 'Paint protection film', note: 'on quote' }]
        : []),
    ],
  },
  simple: [
    { url: '/prices/', label: 'Prices' },
    { url: '/areas/', label: 'Areas' },
    { url: '/reviews/', label: 'Reviews' },
  ],
  book: { url: '/book/', label: 'Book' },
};

export const guides = [
  { url: '/guides/mini-valet-vs-full-valet/', label: 'Mini valet vs full valet' },
  { url: '/guides/how-often-should-you-valet-your-car/', label: 'How often to valet your car' },
  { url: '/guides/paint-correction-vs-ceramic-coating/', label: 'Paint correction vs ceramic' },
  { url: '/guides/pet-hair-and-smells-in-your-car/', label: 'Pet hair & smells' },
  { url: '/guides/valet-before-selling-your-car-or-van/', label: 'Valet before you sell' },
];

export const howHeardOptions = [
  'Google search', 'Google Maps', 'Facebook', 'Instagram', 'A friend or neighbour', 'Saw you working nearby', 'Other',
];

// ---------------------------------------------------------------------------
// What each clean includes.
// TODO-CONFIRM: only the Monthly Detail Package list comes from Chris's own
// price list. These lists are our best description of each service and must
// be checked by Chris before go-live.
// ---------------------------------------------------------------------------

export const inclusions = {
  miniValet: [
    'Hand wash and dry',
    'Wheels and tyres cleaned',
    'Quick polish for shine',
    'Interior vacuum',
    'Dashboard and console wiped down',
    'Windows cleaned inside and out',
  ],
  fullValet: [
    '3-stage wash, including tar removal',
    'Alloy wheels cleaned, tyres dressed',
    'Exterior plastics restored',
    'Polish',
    'Full interior vacuum, including the boot',
    'Dashboard, door cards and console cleaned',
    'Seats cleaned',
    'Windows cleaned inside and out',
    'Air freshener',
  ],
  deepClean: [
    'Everything in the full valet',
    'Seats and carpets deep cleaned',
    'Stains treated',
    'Pet hair removed',
    'Extra time on smells and spills',
  ],
  detailing: [
    'Careful wash and decontamination',
    'Wheels, arches and tyres cleaned properly',
    'Paint polished to bring the gloss back',
    'Protection on the paint',
    'Trim and plastics restored',
    'Interior detailed, not just tidied',
  ],
  vanMini: [
    'Outside washed and dried',
    'Wheels and tyres cleaned',
    'Cab vacuumed',
    'Dash and door cards wiped down',
    'Windows cleaned inside and out',
  ],
};
