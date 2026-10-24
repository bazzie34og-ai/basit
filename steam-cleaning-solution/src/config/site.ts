/**
 * Steam Cleaning Solution LTD: every fact, price, area, promise and review lives here.
 *
 * HONESTY RULES
 * - Never invent facts, prices, years, reviews, names, accreditations or guarantees.
 * - A field set to `null` is hidden from the site until the owner fills it in.
 * - `TODO-CONFIRM` marks anything the owner must approve before go-live.
 *   Search the repo for "TODO-CONFIRM" to see the full list (priority order is in the README).
 */

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------
const env = (typeof process !== 'undefined' ? process.env : {}) as Record<string, string | undefined>;

/** Preview builds are noindex, disallow-all and show the Primo Partners ribbon. */
export const PREVIEW_MODE = (env.PREVIEW_MODE ?? 'true').toLowerCase() !== 'false';
export const SITE_URL = (env.SITE_URL || env.URL || 'https://steam-cleaning-solution-cardiff.netlify.app').replace(/\/$/, '');
export const GA4_ID = env.PUBLIC_GA4_ID || '';
export const TURNSTILE_SITE_KEY = env.PUBLIC_TURNSTILE_SITE_KEY || '';

// ---------------------------------------------------------------------------
// Business
// ---------------------------------------------------------------------------
export const business = {
  // TODO-CONFIRM (priority 1): exact trading name. Must match Companies House and the
  // Google Business Profile word for word. Their posts also use "Steam Cleaning LTD".
  name: 'Steam Cleaning Solution LTD',
  shortName: 'Steam Cleaning Solution',
  descriptor: 'Carpet, upholstery & deep cleaning · Cardiff & Newport',

  taglines: {
    primary: 'Cleaner Homes • Brighter Lives',
    closer: 'A cleaner, healthier home closer to you',
    carpets: 'Fresh Carpets. Cleaner Homes. Better Living.',
  },

  phones: {
    /** The number for calls. Used for every tel: link and as schema `telephone`. */
    call: { display: '07506 285260', tel: '+447506285260' },
    // TODO-CONFIRM (priority 2): which number takes WhatsApp. Their green flyer says
    // "Message or call 07506 285260"; their posts also show 07480 267434 for WhatsApp.
    whatsapp: { display: '07480 267434', e164: '+447480267434', wa: '447480267434' },
  },

  email: 'Steamcleaning769@gmail.com',

  social: {
    instagram: 'https://www.instagram.com/steamcleaningltd/',
    instagramHandle: '@steamcleaningltd',
    facebook: null as string | null, // TODO-CONFIRM: Facebook page URL
  },

  google: {
    gbpMapsUrl: null as string | null, // TODO-CONFIRM: Google Maps link once the profile is live
    gbpReviewUrl: null as string | null, // TODO-CONFIRM: "Ask for reviews" link from the profile
  },

  /** Service-area business: no street address is published. */
  locality: { addressLocality: 'Cardiff', addressRegion: 'Wales', addressCountry: 'GB' },

  // TODO-CONFIRM (priority 5): the owner's Facebook lists the company from June 2019.
  // Set to 2019 only once confirmed. Hidden while null.
  sinceYear: null as number | null,

  // TODO-CONFIRM (priority 6): real working hours. Facebook says "Always open".
  // Shape: [{ days: ['Monday', ...], opens: '08:00', closes: '18:00' }]. Hidden while null.
  hours: null as null | { days: string[]; opens: string; closes: string }[],
  hoursFallback: 'Message any time, we reply fast',

  // TODO-CONFIRM: typical reply time to a photo quote.
  replyTime: 'usually within the hour',

  // TODO-CONFIRM: typical drying time (brief suggests "a few hours").
  dryingTime: 'a few hours',

  /** Flags from their own posts. Each one is hidden when false. */
  // TODO-CONFIRM: owner to confirm each flag (default true, from their posts).
  insured: true, // "Fully insured"
  ecoProducts: true, // "Eco-friendly products"
  petSafe: true, // "Pet & child friendly solutions"

  /** Only fill this with real evidence (product data sheet). Until then the 99% claim never shows. */
  germClaimEvidence: null as string | null,

  referencesOnRequest: true, // their flyer: "References available on request"
  shortNotice: true, // "Short-notice slots when we have them"
};

// ---------------------------------------------------------------------------
// Owner's note: hidden until `name` is set
// ---------------------------------------------------------------------------
export const owner = {
  name: null as string | null, // TODO-CONFIRM (priority 4): owner's first name
  // TODO-CONFIRM: the owner should rewrite this in their own words. Placeholder only;
  // it never shows while `name` is null.
  note: [
    'I started Steam Cleaning Solution because I kept hearing the same thing: people wanted their carpets done but were nervous about who they let in.',
    'So we keep it simple. You send a photo, I give you a fixed price, and I turn up when I said I would. If something won’t come out, I’ll tell you before I start, not after.',
  ],
};

// ---------------------------------------------------------------------------
// The visit: promises the owner must approve (TODO-CONFIRM priority 3, every line)
// ---------------------------------------------------------------------------
export const visit = [
  { when: 'The day before', title: 'We confirm by message', body: 'A short message with your time slot, so you are never left waiting in.' },
  { when: 'On the morning', title: 'We call when we’re on the way', body: 'A quick call with our arrival time. If anything changes, you hear it from us first.' },
  { when: 'At the door', title: 'Shoe covers on, then a walk round', body: 'We walk round with you, look at every stain and agree the plan and the price before anything starts.' },
  { when: 'Patch test', title: 'Delicate fabrics tested first', body: 'We test a hidden spot first and tell you honestly what will come out and what won’t.' },
  { when: 'The clean', title: 'Pre-treatment, then hot water extraction', body: 'Stains are treated first. Then we rinse the fibres with hot water and extract it straight back out. We move furniture and put it back, with edges and skirting protected.' },
  { when: 'Drying', title: 'Fans if needed, plus aftercare', body: 'We set up air movers where it helps and leave you simple aftercare tips.' },
  { when: 'Afterwards', title: 'You pay the price we quoted', body: 'Nothing more. No add-ons at the door, no surprise fees.' },
];

/** Before we arrive. TODO-CONFIRM: owner to check each line. */
export const beforeWeArrive = {
  items: [
    { title: 'Parking near the door', body: 'Our machine and hoses run from the van, so a space close by helps. If it’s permit parking, a visitor permit saves the day.' },
    { title: 'A tap and a socket', body: 'Access to a tap for clean water and one plug socket.' },
    { title: 'Small items cleared', body: 'Toys, shoes, plants and ornaments off the floor. We move the furniture.' },
    { title: 'Pets settled', body: 'Pets in another room while we work, and off the carpet until it’s dry.' },
  ],
  // TODO-CONFIRM: typical job lengths
  duration: 'A single room usually takes under an hour. A whole house or a full sofa set can take a few hours. We’ll give you a time with your quote.',
};

/** Honest expectations. */
export const honesty = {
  oldCarpets: 'Old or worn carpets: we’ll tell you what to expect before we start.',
  patchTest: 'We patch-test every fabric first, and we tell you honestly if something won’t come out.',
  price: 'The price we quote from your photo is the price you pay.',
};

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export type ServiceKey =
  | 'carpet' | 'stairs' | 'sofa' | 'mattress' | 'rug' | 'stain'
  | 'tenancy' | 'deep' | 'caravan' | 'commercial' | 'exterior';

export interface Service {
  key: ServiceKey;
  name: string;
  /** Short name for menus and breadcrumbs */
  short: string;
  path: string;
  enabled: boolean;
  /** Pounds. null = show "Fixed quote from a photo". Never invent a number. */
  fromPrice: number | null;
  /** One line on what the "From" price includes. Only shown when fromPrice is set. */
  priceNote: string | null;
  /** Hotel-menu line */
  menuLine: string;
  /** WhatsApp pre-fill subject, e.g. "sofa cleaning" */
  waSubject: string;
  related: ServiceKey[];
}

export const services: Record<ServiceKey, Service> = {
  carpet: {
    key: 'carpet', name: 'Carpet cleaning', short: 'Carpets', path: '/carpet-cleaning-cardiff/', enabled: true,
    fromPrice: null, priceNote: null,
    menuLine: 'Lounges, bedrooms, hallways. Deep hot water extraction, stains treated first.',
    waSubject: 'carpet cleaning', related: ['stairs', 'stain'],
  },
  stairs: {
    key: 'stairs', name: 'Stairs, landing & hallway carpets', short: 'Stairs & landing', path: '/stairs-landing-carpet-cleaning-cardiff/', enabled: true,
    fromPrice: null, priceNote: null,
    menuLine: 'The busiest carpet in the house, cleaned step by step by hand tool.',
    waSubject: 'stairs and landing carpet cleaning', related: ['carpet', 'rug'],
  },
  sofa: {
    key: 'sofa', name: 'Sofa & upholstery cleaning', short: 'Sofas & upholstery', path: '/sofa-upholstery-cleaning-cardiff/', enabled: true,
    fromPrice: null, priceNote: null,
    menuLine: 'Fabric sofas, corner sofas, armchairs and footstools. Patch-tested first.',
    waSubject: 'sofa cleaning', related: ['mattress', 'stain'],
  },
  mattress: {
    key: 'mattress', name: 'Mattress cleaning', short: 'Mattresses', path: '/mattress-cleaning-cardiff/', enabled: true,
    fromPrice: null, priceNote: null,
    menuLine: 'A healthier, fresher sleeping environment. Stains and odours treated.',
    waSubject: 'mattress cleaning', related: ['sofa', 'stain'],
  },
  rug: {
    key: 'rug', name: 'Rug cleaning', short: 'Rugs', path: '/rug-cleaning-cardiff/', enabled: true,
    fromPrice: null, priceNote: null,
    menuLine: 'Restore colour, remove dirt and revive your rugs. Wool and shaggy rugs too.',
    waSubject: 'rug cleaning', related: ['carpet', 'sofa'],
  },
  stain: {
    key: 'stain', name: 'Stain & odour treatment', short: 'Stains & odours', path: '/stain-odour-removal-cardiff/', enabled: true,
    fromPrice: null, priceNote: null,
    menuLine: 'Pet accidents, coffee, tea, wine. Treated at the source, not perfumed over.',
    waSubject: 'stain or odour treatment', related: ['carpet', 'sofa'],
  },
  tenancy: {
    key: 'tenancy', name: 'End of tenancy cleaning', short: 'End of tenancy', path: '/end-of-tenancy-cleaning-cardiff/', enabled: true,
    fromPrice: null, priceNote: null,
    menuLine: 'For tenants, landlords and letting agents. Carpets, kitchens, bathrooms.',
    waSubject: 'end of tenancy cleaning', related: ['carpet', 'deep'],
  },
  deep: {
    key: 'deep', name: 'Deep home cleaning', short: 'Deep cleaning', path: '/deep-cleaning-cardiff/', enabled: true,
    fromPrice: null, priceNote: null,
    menuLine: 'One-off deep cleans of kitchens, bathrooms or the whole home.',
    waSubject: 'a deep clean', related: ['tenancy', 'carpet'],
  },
  caravan: {
    key: 'caravan', name: 'Caravan & holiday home cleaning', short: 'Caravans & holiday homes', path: '/caravan-holiday-home-cleaning/', enabled: true,
    fromPrice: null, priceNote: null,
    menuLine: 'Upholstery, carpets and a full clean between seasons or guests.',
    waSubject: 'caravan or holiday home cleaning', related: ['sofa', 'deep'],
  },
  commercial: {
    key: 'commercial', name: 'Commercial & office cleaning', short: 'Commercial', path: '/commercial-cleaning-cardiff/', enabled: true,
    fromPrice: null, priceNote: null,
    menuLine: 'Office carpets, rentals and shared spaces, booked around your hours.',
    waSubject: 'commercial or office cleaning', related: ['carpet', 'tenancy'],
  },
  // TODO-CONFIRM (priority 7): they post patio and skylight before/afters. Confirm it is a
  // service they sell before setting enabled: true. The page is not built while false.
  exterior: {
    key: 'exterior', name: 'Patio & exterior glass cleaning', short: 'Patios & glass', path: '/patio-exterior-cleaning-cardiff/', enabled: false,
    fromPrice: null, priceNote: null,
    menuLine: 'Patios, paths, skylights and glass roofs.',
    waSubject: 'patio or exterior cleaning', related: ['deep', 'commercial'],
  },
};

/** Leather sofas. TODO-CONFIRM: do they clean leather? Hidden while null. */
export const leatherCleaning: boolean | null = null;

/** Caravan parks / areas. TODO-CONFIRM. Hidden while empty. */
export const caravanAreas: string[] = [];

/** End of tenancy extras. TODO-CONFIRM each. */
export const tenancyExtras = {
  photoReport: true, // before/after photo report
  itemisedInvoice: true, // itemised invoice for the deposit or inventory clerk
};

export const enabledServices = () => Object.values(services).filter((s) => s.enabled);

/** The price line shown everywhere a price would appear. */
export function priceLabel(s: Service): string {
  return s.fromPrice != null ? `From £${s.fromPrice}` : 'Photo quote';
}
export const PHOTO_QUOTE_LINE = `Fixed quote from a photo, ${business.replyTime}`;

// ---------------------------------------------------------------------------
// Areas. TODO-CONFIRM (priority 8): the town list. Remove a town to unpublish its page.
// ---------------------------------------------------------------------------
export interface Town {
  slug: string;
  name: string;
  path: string;
  postcodes: string[];
  services: ServiceKey[];
  nearby: string[]; // slugs
}

const ALL_HOME: ServiceKey[] = ['carpet', 'stairs', 'sofa', 'mattress', 'rug', 'stain', 'tenancy', 'deep'];

export const towns: Town[] = [
  { slug: 'cardiff', name: 'Cardiff', path: '/areas/cardiff/', postcodes: ['CF3', 'CF5', 'CF10', 'CF11', 'CF14', 'CF15', 'CF23', 'CF24'], services: [...ALL_HOME, 'commercial'], nearby: ['penarth', 'caerphilly', 'newport', 'barry'] },
  { slug: 'newport', name: 'Newport', path: '/newport/', postcodes: ['NP10', 'NP18', 'NP19', 'NP20'], services: [...ALL_HOME, 'commercial'], nearby: ['cwmbran', 'cardiff', 'caerphilly'] },
  { slug: 'penarth', name: 'Penarth', path: '/areas/penarth/', postcodes: ['CF64'], services: ALL_HOME, nearby: ['cardiff', 'barry'] },
  { slug: 'barry', name: 'Barry', path: '/areas/barry/', postcodes: ['CF62', 'CF63'], services: ALL_HOME, nearby: ['penarth', 'cardiff'] },
  { slug: 'caerphilly', name: 'Caerphilly', path: '/areas/caerphilly/', postcodes: ['CF83'], services: ALL_HOME, nearby: ['cardiff', 'pontypridd', 'newport'] },
  { slug: 'cwmbran', name: 'Cwmbran', path: '/areas/cwmbran/', postcodes: ['NP44'], services: ALL_HOME, nearby: ['newport', 'caerphilly'] },
  { slug: 'pontypridd', name: 'Pontypridd', path: '/areas/pontypridd/', postcodes: ['CF37', 'CF38'], services: ALL_HOME, nearby: ['caerphilly', 'cardiff'] },
];

export const cardiffNeighbourhoods = [
  'Roath', 'Canton', 'Cathays', 'Llandaff', 'Whitchurch', 'Rhiwbina', 'Pontprennau',
  'Cyncoed', 'Grangetown', 'Splott', 'Cardiff Bay', 'Ely', 'Fairwater', 'Llanishen',
];

/** Postcode prefixes treated as "in area". Others are flagged in the email, never rejected. */
export const coreAreas = ['CF', 'NP'];

// ---------------------------------------------------------------------------
// Reviews: real only. TODO-CONFIRM (priority 9): paste the 3 Facebook reviews word for word.
// Never write, paraphrase or borrow a review.
// ---------------------------------------------------------------------------
export interface Review {
  text: string;
  name: string; // first name + initial, e.g. "Sarah J."
  source: 'Facebook' | 'Google';
  date: string; // ISO, e.g. "2025-03-14"
}
export const reviews: Review[] = [];

// ---------------------------------------------------------------------------
// Stain index. Honest outcome words only.
// ---------------------------------------------------------------------------
export const stains = [
  { name: 'Candle wax', outcome: 'Usually lifts', note: 'We lift the wax first, then extract what’s left. Coloured wax can leave a faint tint.' },
  { name: 'Coffee & tea', outcome: 'Usually lifts', note: 'Fresh spills come out well. Old ones with milk or sugar may need two goes.' },
  { name: 'Dog & cat accidents', outcome: 'Often improves a lot', note: 'We treat the smell where it starts, under the pile, not just the surface. Old, repeated accidents can leave a mark.' },
  { name: '“It’s just old”', outcome: 'Honest chat first', note: 'Flattened, worn traffic lanes clean up brighter but can’t grow new fibres. We’ll say so before we start.' },
  { name: 'Makeup', outcome: 'Usually lifts', note: 'Foundation and mascara respond well to pre-treatment. Lipstick may need a second pass.' },
  { name: 'Mud', outcome: 'Usually lifts', note: 'Left to dry and hoovered first, mud is one of the easier ones.' },
  { name: 'Nail varnish', outcome: 'We’ll patch-test first', note: 'Black varnish is the toughest. Solvents can harm some fibres, so we test before we try.' },
  { name: '“Previous tenants”', outcome: 'Often improves a lot', note: 'Mystery marks of unknown age. We test, treat and tell you which ones are permanent.' },
  { name: 'Red wine', outcome: 'Often improves a lot', note: 'Blot, don’t rub, and don’t pour salt on it. The sooner we see it, the better it goes.' },
  { name: 'Slime', outcome: 'Usually lifts', note: 'Children’s slime breaks down with the right pre-treatment. The dye in it is the tricky part.' },
];

// ---------------------------------------------------------------------------
// Home FAQ: 8 items from real search questions. Visible text and FAQPage schema both read from here.
// ---------------------------------------------------------------------------
export const homeFaq = [
  { q: 'How long does carpet take to dry after cleaning?', a: `Usually dry to walk on in ${business.dryingTime}. It depends on the carpet, the weather and the airflow in the room. We bring air movers, and opening a window or putting the heating on low helps a lot.` },
  { q: 'How much does it cost?', a: `Send us a photo on WhatsApp with your postcode and we’ll reply with a fixed price, ${business.replyTime}. ${honesty.price}` },
  { q: 'Is it safe with pets and children?', a: 'Our solutions are pet and child friendly. We rinse thoroughly so no sticky residue is left behind. Keep pets and little ones off the carpet until it’s dry.' },
  { q: 'Will the stains come back?', a: 'Stains come back when soap or dirt is left deep in the carpet and wicks up as it dries. Hot water extraction rinses it out instead of leaving it in. If a stain is permanent, we tell you before we start.' },
  { q: 'Do I need to move the furniture?', a: 'No. We move sofas, chairs and tables and put them back. Please clear small items like toys, shoes and ornaments, and let us know about anything very heavy or fragile.' },
  { q: 'Will this help me get my deposit back?', a: 'Clean carpets are one of the things landlords and inventory clerks check first. We can give you before and after photos and an itemised invoice to show your landlord or letting agent.' },
  { q: 'What do you need from me on the day?', a: 'Parking near the door, access to a tap and a plug socket, and small items off the floor. If you have permit parking, a visitor permit is a big help.' },
  { q: 'How long does the clean take?', a: beforeWeArrive.duration },
];

// ---------------------------------------------------------------------------
// Market prices: README only, never on the page as this company’s prices.
// (Shown in the cost guide, credited as typical market ranges.)
// ---------------------------------------------------------------------------
export const marketRanges = {
  source: 'BizHub365 and Bark, 2026',
  rows: [
    { item: 'Single room carpet', range: '£75–£150' },
    { item: '3-bed house (carpets)', range: '£200–£320' },
    { item: 'Stairs & landing', range: '£60–£120' },
    { item: 'Sofa', range: '£120–£200' },
    { item: 'Pet odour treatment (per room)', range: '£100–£180' },
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export const tel = `tel:${business.phones.call.tel}`;

export function waLink(text: string): string {
  return `https://wa.me/${business.phones.whatsapp.wa}?text=${encodeURIComponent(text)}`;
}

/** Pre-filled WhatsApp text, different on every page. */
export function waText(subject = 'cleaning'): string {
  return `Hi, I'd like a quote for ${subject}. Here's a photo 📷 Postcode: `;
}

/** The trust line, built only from flags that are true. */
export function trustItems(): string[] {
  const out: string[] = [];
  if (business.insured) out.push('Fully insured');
  if (business.petSafe) out.push('Pet & child friendly');
  if (business.ecoProducts) out.push('Eco-friendly products');
  out.push('No hidden charges');
  return out;
}

export const nav = [
  { label: 'Carpets', href: '/carpet-cleaning-cardiff/' },
  { label: 'Sofas & Upholstery', href: '/sofa-upholstery-cleaning-cardiff/' },
  { label: 'End of Tenancy', href: '/end-of-tenancy-cleaning-cardiff/' },
  { label: 'Areas', href: '/areas/' },
  { label: 'How it works', href: '/how-it-works/' },
  { label: 'Get a quote', href: '/quote/' },
];
