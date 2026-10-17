/**
 * LM Auto Care: every business fact lives in this file.
 *
 * Change a price here and it changes on the tariff card, the calculator,
 * the booking form, the schema and the booking email. Nothing else on the
 * site hard-codes a price, a phone number or an area.
 *
 * Anything marked TODO-CONFIRM is a best guess or a placeholder that the
 * owner still needs to confirm. The README lists all of them.
 *
 * Keep this file to plain, erasable TypeScript (no enums, no namespaces):
 * the Netlify functions and the unit tests import it directly.
 */

export const business = {
  name: 'LM Auto Care',
  descriptor: 'Mobile Valeting',
  taglines: {
    main: 'Cleaner Cars. Brighter Journeys.',
    way: 'The LM Way',
    trio: 'Wash · Protect · Maintain',
    more: 'More than a clean',
  },
  phoneDisplay: '07936 060804',
  phoneE164: '+447936060804',
  tel: 'tel:+447936060804',
  whatsappNumber: '447936060804',
  email: 'lmautocarez@gmail.com',
  areaLine: 'Aberdeen & surrounding areas',
  locality: 'Aberdeen',
  region: 'Scotland',
  country: 'GB',
  // Their own bio says "Fully trained". Do not expand into certifications.
  training: 'Fully trained',
  // TODO-CONFIRM: owner's first name for the signed note. Until then:
  ownerSignature: 'the LM Auto Care team',
  ownerName: null as string | null,
  // TODO-CONFIRM: cash / card / bank transfer, and whether card has no surcharge.
  paymentMethods: null as string[] | null,
  noCardSurcharge: null as boolean | null,
  // TODO-CONFIRM: is there a "no smoking in or near your car" promise?
  noSmokingPromise: null as boolean | null,
  // TODO-CONFIRM: separate wheel and body mitts / two-bucket wash. Only claim if true.
  separateWheelMitts: null as boolean | null,
} as const;

export const social = {
  // TODO-CONFIRM: the price graphic says @LMAUTOCARE; the live profile is @lmauto_care.
  instagram: { handle: '@lmauto_care', url: 'https://www.instagram.com/lmauto_care/' },
  tiktok: { handle: '@lm.auto.care', url: 'https://www.tiktok.com/@lm.auto.care' },
  // TODO-CONFIRM: exact Facebook page URL.
  facebook: { name: 'LM Auto Care', url: 'https://www.facebook.com/search/top?q=LM%20Auto%20Care' as string, confirmed: false },
  facebookRecommend: '100% recommend (5 reviews)',
  // Google Business Profile is being created. TODO-CONFIRM both links.
  googleProfileUrl: null as string | null,
  googleReviewUrl: null as string | null,
} as const;

/** Honest expectations, shown near every call to action. */
export const expectations = {
  // Their own wording on the price list.
  waterPower: 'Water and power supply needed at your location',
  waterPowerPlain: 'We need a water supply and a power socket where the car is.',
  // TODO-CONFIRM: what happens for flats with no outside tap.
  noTapNote: null as string | null,
  // TODO-CONFIRM: exact hours. These are their posted preferences.
  times: {
    weekdays: 'Weekdays: morning or afternoon',
    weekends: 'Weekends: evening preferred',
    short: 'Weekday mornings or afternoons; weekend evenings.',
  },
  // TODO-CONFIRM: drop-off location. Never publish an address until confirmed.
  dropOff: 'Drop-off is available too. Ask us where when you book.',
  dropOffAddress: null as string | null,
  // TODO-CONFIRM: how quickly the owner normally replies to a form booking.
  replyTime: 'We aim to reply the same day.',
} as const;

/** TODO-CONFIRM exact opening hours. Empty means "not published in schema". */
export const openingHours: { days: string[]; opens: string; closes: string }[] = [];

// ─────────────────────────────────────────────────────────────────────────────
// Services and prices, exactly as on their price list.
// ─────────────────────────────────────────────────────────────────────────────

export type Scope = 'exterior' | 'interior' | 'inside & out';

export interface Service {
  id: string;
  name: string;
  /** Search term shown alongside, never instead of, their name. TODO-CONFIRM the mapping. */
  aka?: string;
  scope: Scope;
  scopeLabel: string;
  priceMin: number;
  priceMax: number;
  includes: string[];
  note?: string;
  /** The page on this site that sells this service, if any. */
  href?: string;
  jobCode: string;
}

export const services: Service[] = [
  {
    id: 'exterior-wash',
    name: 'Basic Exterior Wash',
    scope: 'exterior',
    scopeLabel: 'Exterior only',
    // TODO-CONFIRM: what decides £10 vs £20 (size, how dirty?).
    priceMin: 10,
    priceMax: 20,
    includes: ['Hand wash & dry', 'Wheels cleaned', 'Tyres dressed', 'Windows cleaned', 'Quick finishing touch'],
    note: 'A great option to keep your car looking fresh and clean.',
    href: '/mobile-car-wash-aberdeen/',
    jobCode: 'EXT-W',
  },
  {
    id: 'basic-clean',
    name: 'Basic Clean',
    aka: 'mini valet',
    scope: 'inside & out',
    scopeLabel: 'Inside & out',
    priceMin: 30,
    priceMax: 30,
    includes: ['Exterior wash', 'Wheels cleaned', 'Interior vacuum', 'Dashboard & surfaces wiped', 'Windows cleaned', 'Quick finishing touch'],
    note: 'Perfect for keeping your car fresh between full cleans.',
    href: '/mini-valet-aberdeen/',
    jobCode: 'MINI',
  },
  {
    id: 'interior-valet',
    name: 'Interior Valet',
    scope: 'interior',
    scopeLabel: 'Interior only',
    priceMin: 35,
    priceMax: 35,
    includes: ['Full interior vacuum', 'Seats & carpets cleaned', 'Dashboard & trims cleaned', 'Door cards cleaned', 'Centre console cleaned', 'Interior windows cleaned', 'Detailed finishing touches'],
    href: '/interior-valet-aberdeen/',
    jobCode: 'INT',
  },
  {
    id: 'exterior-valet',
    name: 'Exterior Valet',
    scope: 'exterior',
    scopeLabel: 'Exterior only',
    priceMin: 35,
    priceMax: 35,
    includes: ['Pre-wash', 'Wheel & tyre clean', 'Snow foam', 'Thorough hand wash', 'Full rinse', 'Microfibre dry', 'Wax spray finish', 'Tyres dressed'],
    href: '/exterior-valet-aberdeen/',
    jobCode: 'EXT-V',
  },
  {
    id: 'thorough-clean',
    name: 'Thorough Clean',
    scope: 'inside & out',
    scopeLabel: 'Full inside & out',
    priceMin: 60,
    priceMax: 60,
    includes: ['Everything in the £35 Interior Valet', 'Everything in the £35 Exterior Valet'],
    note: 'A thorough clean inside and out to get your vehicle looking fresh, clean and presentable again.',
    href: '/valet-before-selling-or-lease-return/',
    jobCode: 'THOR',
  },
  {
    id: 'full-works',
    name: 'Full Works',
    aka: 'full valet',
    scope: 'inside & out',
    scopeLabel: 'Our complete detail',
    priceMin: 85,
    priceMax: 85,
    includes: [
      'Thorough exterior wash',
      'Pre-wash & snow foam',
      'Detailed wheel clean',
      'Thorough hand wash',
      'Wax spray protection',
      'Tyre dressing',
      'Full interior vacuum',
      'Seats & carpets cleaned',
      'Dashboard & trims cleaned',
      'Door cards & centre console',
      'Interior windows',
      'Detailed finishing touches',
      'Final quality check',
    ],
    href: '/full-valet-aberdeen/',
    jobCode: 'FULL',
  },
];

export interface Size {
  id: string;
  name: string;
  short: string;
  examples: string;
  supplement: number;
}

export const sizes: Size[] = [
  { id: 'small', name: 'Small cars', short: 'Small', examples: 'Hatchbacks & small cars', supplement: 0 },
  { id: 'medium', name: 'Medium vehicles', short: 'Medium', examples: 'Larger hatchbacks, saloons, estates', supplement: 5 },
  { id: 'large', name: 'Large vehicles / SUVs', short: 'Large / SUV', examples: 'Large SUVs, 4x4s, large estates', supplement: 10 },
  { id: 'seven-seater', name: '7-seaters / large MPVs', short: '7-seater / MPV', examples: '7-seater vehicles, large MPVs', supplement: 15 },
];

export interface Extra {
  id: string;
  name: string;
  price: number;
  blurb: string;
  href?: string;
}

export const extras: Extra[] = [
  { id: 'engine-bay', name: 'Engine Bay Clean', price: 10, blurb: 'Removes dirt and grease with safe, gentle products, for a cleaner, fresher engine.' },
  { id: 'pet-hair', name: 'Pet Hair Removal', price: 10, blurb: 'Thorough pet hair removal from seats, carpets and boot, for a fresh, clean interior.', href: '/pet-hair-removal-aberdeen/' },
  { id: 'headlights', name: 'Headlight Restoration', price: 25, blurb: 'Removes haze and yellowing, improves visibility, restores a clearer finish.', href: '/headlight-restoration-aberdeen/' },
  { id: 'baby-seat', name: 'Baby Seat Clean', price: 10, blurb: 'Deep clean and sanitise, removes stains and spills, using safe, family-friendly products.' },
];

export const priceRange = '£10–£85';

/** Their own six booking steps, in order. The booking form follows these exactly. */
export const bookingSteps = [
  { n: 1, title: 'Vehicle details', detail: 'Make and model. Registration if you like.' },
  { n: 2, title: 'Service required', detail: 'Pick from the tariff. Add any extras.' },
  { n: 3, title: 'Service type', detail: 'Mobile, at your location. Or drop-off.' },
  { n: 4, title: 'Your location', detail: 'Just the postcode to start with.' },
  { n: 5, title: 'Preferred date & time', detail: 'Weekdays morning or afternoon. Weekends, evening preferred.' },
  { n: 6, title: 'Photos (optional)', detail: 'A few clear photos of the vehicle help us price it right.' },
];

export const howHeardOptions = ['Google', 'Facebook', 'Instagram', 'TikTok', 'Friend', 'Other'];

// ─────────────────────────────────────────────────────────────────────────────
// Areas. TODO-CONFIRM every town and suburb with the owner.
// ─────────────────────────────────────────────────────────────────────────────

export interface AreaGroup {
  slug: string;
  name: string;
  short: string;
  suburbs: string[];
}

export const areaGroups: AreaGroup[] = [
  {
    slug: 'north-aberdeen-dyce-bridge-of-don',
    name: 'North Aberdeen, Dyce & Bridge of Don',
    short: 'North',
    suburbs: ['Bridge of Don', 'Dyce', 'Danestone', 'Bucksburn', 'Kingswells', 'Newhills', 'Persley', 'Middlefield', 'Northfield'],
  },
  {
    slug: 'west-end-westhill-deeside',
    name: 'West End, Westhill & Deeside',
    short: 'Central & West',
    suburbs: ['Rosemount', 'Old Aberdeen', 'Mannofield', 'Cults', 'Bieldside', 'Milltimber', 'Peterculter', 'Westhill', 'Garthdee', 'Hazlehead'],
  },
  {
    slug: 'south-aberdeen-cove-portlethen',
    name: 'South Aberdeen, Cove Bay & Portlethen',
    short: 'South',
    suburbs: ['Torry', 'Kincorth', 'Cove Bay', 'Altens', 'Nigg', 'Portlethen', 'Newtonhill'],
  },
  {
    slug: 'aberdeenshire-towns',
    name: 'Aberdeenshire towns',
    short: 'Shire',
    suburbs: ['Ellon', 'Inverurie', 'Stonehaven', 'Balmedie', 'Newmachar', 'Banchory'],
  },
];

export const allAreas = ['Aberdeen', ...areaGroups.flatMap((g) => g.suburbs)];

// ─────────────────────────────────────────────────────────────────────────────
// Reviews. TODO-CONFIRM: paste the real Facebook review texts here, with the
// reviewer's permission. Never invent one. While empty, the site shows only
// the Facebook "100% recommend" line and a link.
// ─────────────────────────────────────────────────────────────────────────────

export interface Review {
  quote: string;
  name: string;
  source: 'Facebook' | 'Google';
  service?: string;
}

export const reviews: Review[] = [];

/** Facebook giveaways: mention only as "we run giveaways". No dates. */
export const giveawaysLine = 'Follow us on Facebook. We run giveaways.';

// ─────────────────────────────────────────────────────────────────────────────
// WhatsApp pre-filled messages per page.
// ─────────────────────────────────────────────────────────────────────────────

export const waBase = `https://wa.me/${business.whatsappNumber}`;

export function waLink(text: string): string {
  return `${waBase}?text=${encodeURIComponent(text)}`;
}

export const waMessages = {
  default: "Hi LM Auto Care, I'd like a price for a valet. Car: ___ Postcode: ___",
  home: "Hi LM Auto Care, I'd like to book a valet. Car: ___ Postcode: ___",
  prices: "Hi LM Auto Care, I've seen your prices. I'd like to book. Service: ___ Car: ___ Postcode: ___",
  fullWorks: "Hi LM Auto Care, I'd like a price for the Full Works (full valet). Car: ___ Postcode: ___",
  basicClean: "Hi LM Auto Care, I'd like a price for a Basic Clean (mini valet). Car: ___ Postcode: ___",
  interior: "Hi LM Auto Care, I'd like a price for an interior valet. Car: ___ Postcode: ___",
  exterior: "Hi LM Auto Care, I'd like a price for an exterior valet with snow foam. Car: ___ Postcode: ___",
  wash: "Hi LM Auto Care, I'd like a mobile car wash. Car: ___ Postcode: ___",
  petHair: "Hi LM Auto Care, I need dog hair out of my car. Car: ___ Postcode: ___",
  headlights: "Hi LM Auto Care, I'd like headlight restoration (£25). Car: ___ Postcode: ___",
  selling: "Hi LM Auto Care, I'm selling / handing back my car and need it valeted. Car: ___ Postcode: ___ Date needed by: ___",
  offshore: "Hi LM Auto Care, I'm offshore and I'd like the car valeted for when I'm home. Car: ___ Postcode: ___ Home on: ___",
  areas: "Hi LM Auto Care, do you cover my area? Postcode: ___ Car: ___",
  faq: "Hi LM Auto Care, I've a question about a valet: ",
  reviews: "Hi LM Auto Care, I'd like to book a valet. Car: ___ Postcode: ___",
  guides: "Hi LM Auto Care, I've been reading your notes and I'd like a price. Car: ___ Postcode: ___",
  thanks: "Hi LM Auto Care, I've just sent a booking through the website and it's a bit urgent. Name: ___",
  notFound: "Hi LM Auto Care, your website sent me to a page that doesn't exist. I'd like a price. Car: ___ Postcode: ___",
} as const;
