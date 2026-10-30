/**
 * ONE FILE FOR EVERY FACT ON THE SITE.
 * Name, phone, email, hours, promises, prices and flags live here and nowhere else.
 * Anything in [BRACKETS] is a placeholder still to confirm. Search this file for "[".
 *
 * Promise flags: switching a flag to false removes that promise everywhere
 * (chips, copy, FAQs, schema). Setting `confirmed.x = true` removes the [brackets]
 * from that promise's wording once the owner has signed it off.
 */

export const business = {
  name: 'Bond Cleaning Brisbane Co.',
  identity:
    'Bond Cleaning Brisbane Co. is a bond cleaning company in Brisbane that cleans rentals on the Northside and inner north for tenants moving out.',
  positioning: "Brisbane Northside's bond cleaning specialists. Fixed price, photo-proof, inspection ready.",
  /** Display format, e.g. "0412 345 678" */
  phone: '[PHONE]',
  /** International format for tel: links and schema, e.g. "+61412345678" */
  phoneE164: '[PHONE]',
  /** Digits only for wa.me links, e.g. "61412345678" */
  whatsapp: '[WHATSAPP]',
  email: '[EMAIL]',
  hours: '[Mon to Sun, 7am to 7pm]',
  hoursSchema: { opens: '07:00', closes: '19:00' },
  serviceArea: "Serving Brisbane's Northside and inner north",
  /** How fast we reply with a fixed price during business hours */
  replyTime: '[15 minutes]',
  /** Same/next-day call cut-off */
  cutOff: '[2pm]',
  pestPartner: '[licensed pest control partner]',
  gbpReviewLink: '[GBP_REVIEW_LINK]',
  /** Add the GBP, Facebook and Instagram URLs once they exist (used in schema sameAs and the footer). */
  sameAs: [] as string[],
  /** Analytics: add the GA4 or GTM ID at go-live. Empty = no analytics script is loaded. */
  ga4Id: '',
  gtmId: '',
  foundingYear: 2026,
};

/** Unconfirmed promises. On by default with bracketed wording. */
export const flags = {
  payAfter: true,
  /** Hours we have to come back after the agent's list arrives. null = drop the time window wording. */
  reCleanWindowHours: 24 as number | null,
  /** Guarantee stays open for this many days after the clean (covers the inspection date). */
  guaranteeDays: 7 as number | null,
  /** true = carpet steam clean free with every full bond clean; false = priced per room */
  freeCarpet: true,
  sameDay: true,
  noWeekendSurcharge: true,
  /** null = don't mention an insurance amount (police checks still shown if policeChecked) */
  insuranceAmount: '$20m' as string | null,
  policeChecked: true,
  ownCrews: true,
  splitPayment: true,
  freeCancellationHours: 48 as number | null,
  monthlyInvoicing: true,
  noUrgentSurcharge: true,
};

/** Set an entry to true once the owner confirms it; the [brackets] disappear from that wording. */
export const confirmed: Record<string, boolean> = {
  payAfter: false,
  reCleanWindow: false,
  guaranteeDays: false,
  freeCarpet: false,
  sameDay: false,
  noWeekendSurcharge: false,
  insurance: false,
  policeChecked: false,
  ownCrews: false,
  splitPayment: false,
  cancellation: false,
  monthlyInvoicing: false,
  noUrgentSurcharge: false,
  hours: false,
  turnaround: false,
  dryTimes: false,
};

/**
 * Prices in AUD. null = not confirmed yet: the site shows "[$]" and the quote form
 * shows "We'll text your fixed price within [15 minutes]" instead of a price guide.
 */
export const prices: Record<string, number | null> = {
  b1: null, // Studio / 1 bed, 1 bath
  b2: null, // 2 bed, 1 bath
  b2b2: null, // 2 bed, 2 bath
  b3: null, // 3 bed, 2 bath
  b4: null, // 4 bed, 2 bath
  // 5 bed+ is always "Quote"
  carpetRoom: null,
  balcony: null,
  garage: null,
  wallRoom: null,
  mattress: null,
  sofaSeat: null,
  pressure: null,
  flea: null,
  ovenDeep: null,
  blindsDetail: null,
  extraBathroom: null,
  furnished: null,
  packageCarpet: null, // bond + carpet (2 bed reference)
  packagePet: null, // bond + carpet + flea (2 bed reference)
  urgent: null, // only used if noUrgentSurcharge is switched off
};

export const priceRows = [
  { key: 'b1', label: 'Studio or 1 bed', detail: '1 bathroom', time: '3–4 hours', crew: 'Team of 2' },
  { key: 'b2', label: '2 bed', detail: '1 bathroom', time: '4–5 hours', crew: 'Team of 2', popular: true },
  { key: 'b2b2', label: '2 bed', detail: '2 bathrooms', time: '5–6 hours', crew: 'Team of 2' },
  { key: 'b3', label: '3 bed', detail: '2 bathrooms', time: '6–7 hours', crew: 'Team of 2' },
  { key: 'b4', label: '4 bed', detail: '2 bathrooms', time: 'Most of a day', crew: 'Team of 2–3' },
  { key: 'b5', label: '5 bed or more', detail: 'Any bathrooms', time: 'A full day', crew: 'Team of 3', quoteOnly: true },
];

export const addons = [
  { key: 'carpetRoom', name: 'Carpet steam clean', unit: 'per room', freeWhen: 'freeCarpet' },
  { key: 'balcony', name: 'Balcony or patio wash', unit: 'each' },
  { key: 'garage', name: 'Garage sweep and wash', unit: 'each' },
  { key: 'wallRoom', name: 'Full wall washing', unit: 'per room' },
  { key: 'blindsDetail', name: 'Blinds washed slat by slat', unit: 'per room' },
  { key: 'ovenDeep', name: 'Heavy build-up oven deep clean', unit: 'each' },
  { key: 'mattress', name: 'Mattress steam clean', unit: 'each' },
  { key: 'sofaSeat', name: 'Sofa and upholstery', unit: 'per seat' },
  { key: 'pressure', name: 'Pressure washing (driveway, patio)', unit: 'from' },
  { key: 'flea', name: 'Flea treatment by a licensed partner', unit: 'per property' },
];

/** Used by the quote form price guide (only when prices above are set). */
export const priceGuideSpread = 0.2; // shows base price to base + 20%

export const areaGroups = [
  { key: 'inner', name: 'Inner north', slugs: ['brisbane-city', 'fortitude-valley', 'new-farm', 'newstead', 'bowen-hills', 'windsor', 'albion'] },
  { key: 'northeast', name: 'North-east', slugs: ['ascot', 'hamilton', 'nundah', 'wavell-heights'] },
  { key: 'north', name: 'North', slugs: ['kedron', 'chermside', 'aspley', 'carseldine', 'bracken-ridge', 'north-lakes'] },
  { key: 'northwest', name: 'North-west', slugs: ['stafford', 'everton-park', 'mitchelton'] },
];

export const serviceGroups = [
  { key: 'core', name: 'Bond & end of lease', blurb: 'The full clean before you hand back the keys.' },
  { key: 'carpet', name: 'Carpet & upholstery', blurb: 'Steam cleaning with the receipt your agent wants.' },
  { key: 'addon', name: 'Add-ons', blurb: 'The extras that turn up on exit reports.' },
];

export const mainNav = [
  { label: 'Services', href: '/services/', mega: 'services' },
  { label: 'Areas', href: '/areas/', mega: 'areas' },
  { label: 'Pricing', href: '/pricing/' },
  { label: 'Our Work', href: '/our-work/' },
  { label: 'Reviews', href: '/reviews/' },
  { label: 'FAQ', href: '/faq/' },
  { label: 'About', href: '/about/' },
];
