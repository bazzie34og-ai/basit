// Single source of truth for business facts (NAP, hours, offers, links).
// Every page, component and schema block reads from here. Never hard-code NAP elsewhere.
// Placeholders: leave as '' to hide. Nothing renders for an empty value.

export const site = {
  name: "Roland Nielson – Omaha Men's Life Coaching",
  shortName: 'Roland Nielson',
  legalName: 'Roland Nielson, LLC',
  url: 'https://rolandnielson.com',
  locale: 'en_US',
  lang: 'en-US',
  themeColor: '#0E1B2C',
  description:
    "Men's life coaching in Omaha, NE for fathers, working men and men rebuilding after addiction or setbacks. Evenings and Saturdays. In person, video or phone.",
  slogan: 'Keep your word. Call your kids. Clean up your mess. Try again tomorrow.',
  category: 'Life coach',

  phone: {
    display: '(402) 577-0738',
    e164: '+14025770738',
  },
  // WhatsApp number with country code, digits only (e.g. '14025770738').
  // Empty = WhatsApp buttons stay hidden.
  whatsapp: '14023010103',
  email: 'roland@rolandnielson.com',
  booking: 'https://calendly.com/rolandnielson/free-20-minute-discovery-call',
  bookingLabel: 'Free 20-minute discovery call',

  city: 'Omaha',
  region: 'NE',
  regionName: 'Nebraska',
  country: 'US',
  postalCode: '', // only used once an office address is set
  locality: 'Omaha, NE',
  serviceLine: 'Serving Omaha, NE and the metro',

  // {{OFFICE_ADDRESS}}: empty = service-area business (no street address anywhere).
  // Fill all four fields to switch footer, contact page, map and schema to the office.
  office: {
    streetAddress: '',
    postalCode: '',
    lat: '',
    lng: '',
  },

  // lat/lng are approximate city centers, used only for the drawn service-area map.
  // Edit this one array to change the service area everywhere (footer, home, Omaha page, schema).
  serviceArea: [
    { name: 'Omaha', lat: 41.2565, lng: -95.9345, state: 'NE', wiki: 'https://en.wikipedia.org/wiki/Omaha,_Nebraska' },
    { name: 'Bellevue', lat: 41.1544, lng: -95.9146, state: 'NE', wiki: 'https://en.wikipedia.org/wiki/Bellevue,_Nebraska' },
    { name: 'Papillion', lat: 41.1544, lng: -96.0422, state: 'NE', wiki: 'https://en.wikipedia.org/wiki/Papillion,_Nebraska' },
    { name: 'La Vista', lat: 41.1836, lng: -96.0311, state: 'NE', wiki: 'https://en.wikipedia.org/wiki/La_Vista,_Nebraska' },
    { name: 'Ralston', lat: 41.2022, lng: -96.0425, state: 'NE', wiki: 'https://en.wikipedia.org/wiki/Ralston,_Nebraska' },
    { name: 'Millard', lat: 41.2047, lng: -96.1281, state: 'NE', wiki: 'https://en.wikipedia.org/wiki/Millard,_Omaha' },
    { name: 'Elkhorn', lat: 41.2861, lng: -96.2364, state: 'NE', wiki: 'https://en.wikipedia.org/wiki/Elkhorn,_Omaha' },
    { name: 'Gretna', lat: 41.1408, lng: -96.2397, state: 'NE', wiki: 'https://en.wikipedia.org/wiki/Gretna,_Nebraska' },
    { name: 'Bennington', lat: 41.3647, lng: -96.1581, state: 'NE', wiki: 'https://en.wikipedia.org/wiki/Bennington,_Nebraska' },
    { name: 'Council Bluffs', lat: 41.2619, lng: -95.8608, state: 'IA', wiki: 'https://en.wikipedia.org/wiki/Council_Bluffs,_Iowa' },
  ],

  formats: ['In person', 'Video', 'Phone'],
  inPersonNote:
    'In person at your location or a private meeting space in Omaha, by appointment. Video and phone from anywhere.',

  // Must match the Google Business Profile exactly. Times are America/Chicago.
  timezone: 'America/Chicago',
  hours: [
    { days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], label: 'Tue–Fri', opens: '17:00', closes: '20:00', display: '5:00–8:00 PM' },
    { days: ['Saturday'], label: 'Sat', opens: '11:00', closes: '13:00', display: '11:00 AM–1:00 PM' },
  ],
  closedLabel: 'Sun & Mon',

  socials: [
    { name: 'Facebook', url: 'https://www.facebook.com/share/19HA1yQ6Qc/' },
    { name: 'Instagram', url: 'https://www.instagram.com/rolandnielson/' },
    { name: 'YouTube', url: 'https://www.youtube.com/@rolandnielson' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@roland_omaha' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/roland-nielson-a6896a87' },
    { name: 'X', url: 'https://x.com/catchyname4_u' },
  ],

  // Google Business Profile. {{GBP_URL}} {{GBP_CID}} {{GBP_REVIEW_LINK}}
  gbp: {
    url: '',
    cid: '',
    reviewLink: '',
  },

  // {{GA4_ID}} e.g. 'G-XXXXXXX'. {{GSC_TOKEN}} = Search Console verification content value.
  ga4Id: '',
  gscToken: '',

  videos: {
    youtube: {
      id: '7I9iH_0T6p0',
      title: 'A short message from Roland Nielson, Omaha men\'s life coach',
      description:
        "Roland Nielson, a men's life coach in Omaha, NE, explains who he works with and what coaching with him looks like.",
      uploadDate: '', // {{VIDEO_UPLOAD_DATE}} ISO date, e.g. '2025-11-04'
    },
    recovery: {
      slug: 'roland-nielson-recovery-story-omaha',
      title: 'Rebuilding After Addiction: Roland\'s Story | Omaha Men\'s Life Coach',
      description:
        "Roland Nielson talks about addiction, jail cells, getting clean and why he refuses to whisper about recovery. A short, honest message for men rebuilding in Omaha.",
      uploadDate: '', // {{VIDEO_UPLOAD_DATE}} ISO date
      page: '/rebuilding-after-addiction/',
    },
  },

  // Coaching start date (used in copy and schema).
  coachingSince: '2025-11',
  // Date shown as "Last updated" on service pages unless a page overrides it.
  contentUpdated: '2026-10-16',
} as const;

export type Plan = {
  id: string;
  name: string;
  summary: string;
  price: number | null; // null = placeholder / apply
  priceLabel: string;
  unit: string;
  badge?: string;
  details: string[];
  cta: { label: string; href: string };
  featured?: boolean;
};

// {{PREMIUM_PRICE}}: set to a number (monthly) to show it. Empty = "Book a call to apply".
export const PREMIUM_PRICE: number | null = null;

// Personal Patterns Assessment. Turn resultsEmail on only after RESEND_API_KEY and
// ALERT_EMAIL_FROM are set in Netlify; until then the "Email me a copy" option is hidden.
export const assessmentSettings = {
  resultsEmail: false,
};

export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    summary: 'A steady check-in for men who need structure, not a big overhaul.',
    price: 149,
    priceLabel: '$149',
    unit: '/month',
    details: ['2 × 45-minute sessions a month', 'In person, video or phone', 'Evening and Saturday times'],
    cta: { label: 'Book a free call', href: site.booking },
  },
  {
    id: 'core',
    name: 'Core Coaching',
    summary: 'Weekly sessions. The plan most men pick.',
    price: 249,
    priceLabel: '$249',
    unit: '/month',
    details: ['4 × 45-minute sessions a month', 'Weekly accountability', 'In person, video or phone'],
    cta: { label: 'Book a free call', href: site.booking },
    featured: true,
  },
  {
    id: 'focused',
    name: 'Focused Support',
    summary: 'Longer sessions for a heavier season.',
    price: 399,
    priceLabel: '$399',
    unit: '/month',
    details: ['4 × 60-minute sessions a month', 'More room for the hard conversations', 'In person, video or phone'],
    cta: { label: 'Book a free call', href: site.booking },
  },
  {
    id: 'founding',
    name: 'Founding Client',
    summary: 'Core Coaching at a founding rate, for the first three men only.',
    price: 199,
    priceLabel: '$199',
    unit: '/month',
    badge: 'Limited: first 3',
    details: ['Core Coaching: 4 × 45-minute sessions a month', '3-month commitment ($597 total)', 'Only 3 spots, then it closes'],
    cta: { label: 'Ask about a founding spot', href: site.booking },
  },
];

export const rebuildProgram = {
  name: 'The Rebuild Program',
  price: PREMIUM_PRICE,
  summary:
    '3–6 month high-accountability program: habits, mindset, relationships, discipline and long-term goals. Weekly sessions plus between-session check-ins.',
  cta: { label: 'Book a call to apply', href: site.booking },
};

export const inPersonAddOn = {
  name: 'In-person add-on',
  price: 40,
  priceLabel: '+$40',
  detail: 'Per in-person session (covers room costs). Video and phone have no extra fee.',
};

// {{POLICY}}: commitment and cancellation policy. Empty = FAQ says "ask on the free call".
export const POLICY = '';

// Helpers ---------------------------------------------------------------------
export const tel = `tel:${site.phone.e164}`;
export const sms = `sms:${site.phone.e164}`;
// WhatsApp click-to-chat link, optionally with a pre-typed message. '' when no number is set.
export const whatsapp = (text = '') => {
  const n = site.whatsapp.replace(/\D/g, '');
  return n ? `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ''}` : '';
};
export const mailto = `mailto:${site.email}`;
export const abs = (path: string) => new URL(path, site.url).href;
export const hasOffice = Boolean(site.office.streetAddress && site.office.postalCode);
export const hoursText = `${site.hours.map((h) => `${h.label} ${h.display}`).join(' · ')} · ${site.closedLabel} closed`;
export const areaNames = site.serviceArea.map((a) => (a.state === 'NE' ? a.name : `${a.name} (${a.state})`));
export const priceRange = '$149–$399/month';
