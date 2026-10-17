/**
 * Diamond Plate Ceramic Coating (Brisbane): single source of truth.
 *
 * Every business fact on the site comes from this file. Never hard-code a
 * phone number, price, address or warranty length anywhere else.
 *
 * Items marked `TODO-CONFIRM` must be checked with the owner before go-live.
 * They are also listed in README.md.
 */

const env = (key: string) => (typeof process !== 'undefined' ? process.env[key] : undefined);

/** PREVIEW_MODE defaults to true until it is explicitly set to "false". */
export const PREVIEW_MODE = (env('PREVIEW_MODE') ?? 'true').toLowerCase() !== 'false';

/** SITE_URL drives canonicals, sitemap, OG URLs and schema. No trailing slash. */
export const SITE_URL = (env('SITE_URL') || 'https://diamond-plate-brisbane.netlify.app').replace(/\/+$/, '');

export const GA4_ID = env('PUBLIC_GA4_ID') || '';
export const TURNSTILE_SITE_KEY = env('PUBLIC_TURNSTILE_SITE_KEY') || '';

export const business = {
  /** Exact Google Business Profile name. Use in titles, header, footer, schema, contact. */
  name: 'Diamond Plate Ceramic Coating',
  /** Fine for body copy. */
  shortName: 'Diamond Plate',
  brand: 'Diamond Plate Australia',
  brandSummary:
    'Australian-made, Australian-owned ceramic and graphene ceramic coatings, made by its own R&D team and applied only by trained Diamond Plate applicators.',
  phone: {
    display: '1300 995 100',
    tel: 'tel:1300995100',
    schema: '+61 1300 995 100',
  },
  email: 'infoqld@diamondplate.com.au',
  address: {
    street: 'Suite B/4/20 Smallwood Pl',
    suburb: 'Murarrie', // Google's listing spells it "Murrarie"; official spelling is Murarrie.
    state: 'QLD',
    postcode: '4172',
    country: 'AU',
    countryName: 'Australia',
    /** One-line form, identical to the Google Business Profile. */
    oneLine: 'Suite B/4/20 Smallwood Pl, Murarrie QLD 4172',
  },
  /** TODO-CONFIRM: decoded from the Google plus code G4V3+Q4 Murarrie. Check against the GBP pin. */
  geo: { lat: -27.45556, lng: 153.10281 },
  headOffice: 'PO Box 7366, Mt Annan NSW 2567',
  /** Mobile service. Murarrie is the Brisbane base. */
  serviceModel: 'mobile',
  /** TODO-CONFIRM: can customers drop cars at Murarrie? Until confirmed, never say "visit our workshop". */
  dropOffAvailable: false,
  /** TODO-CONFIRM: Nate is a Brisbane applicator. Until confirmed, use this caption only. */
  technicianCaption: 'Nate, Diamond Plate certified applicator',
} as const;

/**
 * TODO-CONFIRM hours. Google shows "Opens 8 AM Mon". Placeholder Mon–Fri 8:00am–5:00pm.
 * Weekend enquiries are answered the next working day (stated on their current site).
 */
export const hours = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const,
  opens: '08:00',
  closes: '17:00',
  display: 'Mon–Fri 8:00am–5:00pm',
  weekendNote: 'Weekend enquiries are answered the next working day.',
};

/** TODO-CONFIRM the reply promise with the owner. */
export const replyPromise = 'We reply within 1 business hour, Mon–Fri';

/** TODO-CONFIRM: Facebook says "7–10 year", parts of the FAQ say 10. Change here only. */
export const warrantyYears = 12;

export const warranty = {
  years: warrantyYears,
  label: `${warrantyYears}-year national warranty`,
  points: ['No annual inspections', 'No reapplication', 'No capped warranty payments'],
  transferable: false,
  transferNote: 'The warranty covers the original purchaser and is not transferable.',
  /** TODO-CONFIRM: insurer recognition, from their FAQ. Use once, on the FAQ and warranty pages. */
  insuranceNote:
    'Our FAQ notes that major insurers recognise Diamond Plate and cover reapplication as part of an accident repair. Check with your insurer when you make a claim.',
};

export const csiro = {
  /** Say exactly this. Never "CSIRO certified/approved"; never scratch or UV claims. */
  short: 'CSIRO independently tested for chemical resistance',
  full:
    'CSIRO independently tested both Diamond Plate coatings for chemical resistance to ASTM D1308-20. The tests included hydrochloric acid and ethanol, and the result was resistance to discolouration, blistering and cracking.',
};

export const products = {
  main: 'Graphene Ceramic 9H+',
  standard: 'Ceramic 9H',
};

export type PackageId = 'single' | 'diamond-plus' | 'double' | 'ultimate-plus';

export interface Package {
  id: PackageId;
  name: string;
  short: string;
  price: number;
  tag?: string;
  summary: string;
  includes: string[];
  warrantyCovers: string;
}

export const packages: Package[] = [
  {
    id: 'single',
    name: 'Single Layer: Premium Graphene Ceramic',
    short: 'Single Layer',
    price: 990,
    summary: 'One layer of Graphene Ceramic 9H+ on your paint.',
    includes: ['1 layer of Graphene Ceramic 9H+ on paint', 'Full wash, decontamination and clay bar prep', `${warrantyYears}-year national warranty`],
    warrantyCovers: 'Paint',
  },
  {
    id: 'diamond-plus',
    name: 'Diamond Package Plus',
    short: 'Diamond Package Plus',
    price: 1395,
    summary: 'One layer of graphene ceramic plus interior protection and free wheel protection.',
    includes: [
      '1 layer of graphene ceramic on paint',
      'Fabric/leather stain protection',
      'Vinyl protection against fading, UV, cracking and splitting',
      'Free alloy wheel protection (valued at $80)',
    ],
    warrantyCovers: 'Paint, fabric/leather and vinyl',
  },
  {
    id: 'double',
    name: 'Double Layer: Premium Graphene Ceramic ×2',
    short: 'Double Layer',
    price: 1495,
    tag: 'Most popular',
    summary: 'Two layers, for deeper gloss and a premium look.',
    includes: ['2 layers of Graphene Ceramic 9H+ on paint', 'Deeper gloss and a premium look', `${warrantyYears}-year national warranty`],
    warrantyCovers: 'Paint',
  },
  {
    id: 'ultimate-plus',
    name: 'Ultimate Plus: ×2 layers plus interior',
    short: 'Ultimate Plus',
    price: 1695,
    tag: 'Best protection',
    summary: 'Two layers, the full interior package and free wheel protection.',
    includes: [
      '2 layers of graphene ceramic on paint',
      'Full interior package: fabric/leather and vinyl',
      'Free alloy wheel protection',
      'Warranty covers everything',
    ],
    warrantyCovers: 'Everything',
  },
];

export const addOns = [{ name: 'Alloy wheel protection', price: 80 }];

/** TODO-CONFIRM with the owner. */
export const priceNote =
  "Fixed prices for most cars. Large 4WDs, vans and vehicles needing extra prep may vary, and we’ll confirm before we start.";

export const priceFrom = Math.min(...packages.map((p) => p.price));
export const priceTo = Math.max(...packages.map((p) => p.price));

const aud = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 });
/** "$1,395" (AU style). */
export const money = (n: number) => aud.format(n).replace('A$', '$');

export const priceRange = `${money(priceFrom)}–${money(priceTo)}`;

/** The process, from their FAQ. */
export const processInfo = {
  steps: ['Full wash', 'Decontamination', 'Clay bar to make the paint smooth', 'Coating applied by a trained applicator'],
  touchDryMinutes: 30,
  noWashDays: 7,
};

export const social = {
  facebook: 'https://www.facebook.com/diamondplateaustralia/',
  facebookStats: { followers: '1.7K', recommendPct: 96, reviews: 19 },
  /** TODO-CONFIRM the Messenger page username. */
  messenger: 'https://m.me/diamondplateaustralia',
  nationalSite: 'https://diamondplate.com.au',
  /** TODO-CONFIRM: paste the exact Google Maps place URL. */
  googleMaps: 'https://www.google.com/maps/search/?api=1&query=Diamond+Plate+Ceramic+Coating+Murarrie+QLD+4172',
  /** TODO-CONFIRM: paste the place's "write a review" link from the GBP dashboard. */
  googleReview: 'https://www.google.com/maps/search/?api=1&query=Diamond+Plate+Ceramic+Coating+Murarrie+QLD+4172',
};

export interface Review {
  headline?: string;
  quote: string;
  name: string;
  source: 'Diamond Plate review' | 'Google review';
  /** TODO-CONFIRM flag for reviews whose exact wording still needs checking. */
  confirmed: boolean;
}

/** Transcribed word for word. Never invent or edit reviews. */
export const reviews: Review[] = [
  {
    headline: 'Looking better than when I drove it out of the show room',
    quote:
      'Diamond Plate did an excellent job of my car. It ended up looking better than when I drove it out of the show room. Very happy. He also had good advice for continuing care. Good business to deal with from start to finish.',
    name: 'Diamond Plate customer',
    source: 'Diamond Plate review',
    confirmed: true,
  },
  {
    headline: 'WOW',
    quote:
      'Thanks to the gentlemen at Diamond Plate for a great job. Car is easier to clean, water beads straight off and what can I say about the shine, wow!',
    name: 'Aristotle',
    source: 'Diamond Plate review',
    confirmed: true,
  },
  {
    headline: 'My car looks great!',
    quote:
      'I had a great experience with Diamond Plate. The applicator was fantastic. He explained everything that was done to my car. Happy with the customer service I received. My car looks great!',
    name: 'Diamond Plate customer',
    source: 'Diamond Plate review',
    confirmed: true,
  },
  {
    // TODO-CONFIRM exact wording on Google before going live.
    quote: 'Nate did an exceptional job and was attentive to every detail throughout the process.',
    name: 'Motti Abraham',
    source: 'Google review',
    confirmed: false,
  },
  {
    // TODO-CONFIRM exact wording on Google before going live.
    quote: 'Great company all Australian made love dealing with them',
    name: 'Matt',
    source: 'Google review',
    confirmed: false,
  },
];

export interface Region {
  slug: string;
  name: string;
  short: string;
  path: string;
  suburbs: string[];
  /** Map embed query. */
  mapQuery: string;
  angle: string;
}

/** TODO-CONFIRM suburb coverage with the owner. */
export const regions: Region[] = [
  {
    slug: 'eastern-suburbs-bayside',
    name: 'Eastern Suburbs & Bayside',
    short: 'East & Bayside',
    path: '/service-areas/eastern-suburbs-bayside/',
    suburbs: [
      'Murarrie', 'Cannon Hill', 'Morningside', 'Hawthorne', 'Bulimba', 'Balmoral', 'Tingalpa', 'Hemmant', 'Wynnum',
      'Manly', 'Lota', 'Carindale', 'Belmont', 'Gumdale', 'Camp Hill', 'Coorparoo', 'Norman Park',
    ],
    mapQuery: 'Wynnum QLD',
    angle: 'Salt air near the bay, Gateway and port truck grime',
  },
  {
    slug: 'northside',
    name: 'Northside',
    short: 'Northside',
    path: '/service-areas/northside/',
    suburbs: [
      'Chermside', 'Aspley', 'Albany Creek', 'Nundah', 'Clayfield', 'Ascot', 'Hamilton', 'Kedron', 'Stafford',
      'Everton Park', 'Bracken Ridge', 'North Lakes',
    ],
    mapQuery: 'Chermside QLD',
    angle: 'Airport and Gateway commutes, new estates at North Lakes',
  },
  {
    slug: 'southside-logan',
    name: 'Southside & Logan',
    short: 'Southside & Logan',
    path: '/service-areas/southside-logan/',
    suburbs: [
      'Mount Gravatt', 'Sunnybank', 'Eight Mile Plains', 'Rochedale', 'Underwood', 'Springwood', 'Shailer Park',
      'Daisy Hill', 'Calamvale', 'Browns Plains',
    ],
    mapQuery: 'Springwood QLD',
    angle: 'M1 and Pacific Motorway stone chips and bugs, Logan’s new-home estates',
  },
  {
    slug: 'redlands',
    name: 'Redlands',
    short: 'Redlands',
    path: '/service-areas/redlands/',
    suburbs: ['Capalaba', 'Alexandra Hills', 'Birkdale', 'Wellington Point', 'Cleveland', 'Thornlands', 'Victoria Point', 'Redland Bay'],
    mapQuery: 'Cleveland QLD',
    angle: 'Coastal salt and bird droppings, boats and caravans parked outdoors',
  },
];

export const allSuburbs = regions.flatMap((r) => r.suburbs.map((s) => ({ suburb: s, region: r }))).sort((a, b) => a.suburb.localeCompare(b.suburb));

export const vehicleAges = ['Brand new (under 3 months)', 'Under 3 years', '3+ years'] as const;
export const howHeardOptions = ['Google search', 'Google Maps', 'Facebook', 'Friend', 'Dealer', 'Other'] as const;
export const contactOptions = ['Call', 'Text', 'Email'] as const;
export const notSurePackage = 'Not sure, recommend one';
export const packageOptions = [...packages.map((p) => `${p.short} ${money(p.price)}`), notSurePackage];

/** Money pages (used by the footer and internal links). */
export const services = [
  { name: 'Ceramic coating prices', path: '/ceramic-coating-prices/' },
  { name: 'Graphene ceramic coating', path: '/graphene-ceramic-coating/' },
  { name: 'New car paint protection', path: '/new-car-paint-protection/' },
  { name: 'Mobile ceramic coating', path: '/mobile-ceramic-coating/' },
  { name: '4WD & ute ceramic coating', path: '/4wd-ute-ceramic-coating/' },
  { name: 'Tesla & EV ceramic coating', path: '/ev-tesla-ceramic-coating/' },
  { name: 'Interior & wheel protection', path: '/interior-and-wheel-protection/' },
  { name: 'Warranty', path: '/warranty/' },
];
