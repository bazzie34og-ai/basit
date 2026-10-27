// JSON-LD builders. Nodes connect through stable @id values.
import { site, plans, rebuildProgram, inPersonAddOn, abs, hasOffice, priceRange, areaPages, type AreaPage } from '../config/site';
import video from '../data/recovery-video.json';

export const ids = {
  business: abs('/#business'),
  roland: abs('/#roland'),
  website: abs('/#website'),
  ytVideo: abs('/#video-short-message'),
  recoveryVideo: abs(`${site.videos.recovery.page}#video-recovery-story`),
};

const heroImage = abs('/images/roland-nielson-mens-life-coach-omaha.jpg');
const sameAs = [...site.socials.map((s) => s.url), ...(site.gbp.url ? [site.gbp.url] : [])];

const dayMap: Record<string, string> = {
  Monday: 'https://schema.org/Monday', Tuesday: 'https://schema.org/Tuesday', Wednesday: 'https://schema.org/Wednesday',
  Thursday: 'https://schema.org/Thursday', Friday: 'https://schema.org/Friday', Saturday: 'https://schema.org/Saturday',
  Sunday: 'https://schema.org/Sunday',
};

export const areaServed = site.serviceArea.map((a) => ({
  '@type': 'City',
  name: a.name,
  sameAs: a.wiki,
  containedInPlace: { '@type': 'State', name: a.state === 'IA' ? 'Iowa' : 'Nebraska' },
}));

const offers = [
  ...plans.map((p) => ({
    '@type': 'Offer',
    name: p.name,
    description: `${p.summary} ${p.details.join('. ')}.`,
    price: p.price,
    priceCurrency: 'USD',
    priceSpecification: { '@type': 'UnitPriceSpecification', price: p.price, priceCurrency: 'USD', unitText: 'MONTH' },
    url: abs('/pricing/'),
    availability: 'https://schema.org/InStock',
  })),
  {
    '@type': 'Offer',
    name: inPersonAddOn.name,
    description: inPersonAddOn.detail,
    price: inPersonAddOn.price,
    priceCurrency: 'USD',
    url: abs('/pricing/'),
  },
  {
    '@type': 'Offer',
    name: rebuildProgram.name,
    description: rebuildProgram.summary,
    ...(rebuildProgram.price
      ? { price: rebuildProgram.price, priceCurrency: 'USD' }
      : { priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'USD', description: 'By application after a free call' } }),
    url: abs('/the-rebuild-program/'),
  },
];

export function businessNode() {
  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    addressLocality: site.city,
    addressRegion: site.region,
    addressCountry: site.country,
  };
  if (hasOffice) {
    address.streetAddress = site.office.streetAddress;
    address.postalCode = site.office.postalCode;
  }
  return {
    '@type': ['ProfessionalService', 'LocalBusiness'],
    '@id': ids.business,
    name: site.name,
    legalName: site.legalName,
    url: abs('/'),
    telephone: site.phone.e164,
    email: site.email,
    image: heroImage,
    logo: abs('/logo.png'),
    description: site.description,
    slogan: site.slogan,
    priceRange,
    currenciesAccepted: 'USD',
    address,
    ...(hasOffice && site.office.lat
      ? { geo: { '@type': 'GeoCoordinates', latitude: Number(site.office.lat), longitude: Number(site.office.lng) } }
      : {}),
    areaServed: allAreasServed(),
    openingHoursSpecification: site.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => dayMap[d]),
      opens: h.opens,
      closes: h.closes,
    })),
    founder: { '@id': ids.roland },
    employee: { '@id': ids.roland },
    sameAs,
    ...(site.gbp.url ? { hasMap: site.gbp.url } : {}),
    potentialAction: {
      '@type': 'ReserveAction',
      name: site.bookingLabel,
      target: { '@type': 'EntryPoint', urlTemplate: site.booking, actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'] },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Coaching plans',
      itemListElement: offers,
    },
    knowsAbout: ['Accountability', 'Habit building', 'Emotional regulation', 'Fatherhood', 'Rebuilding after addiction'],
  };
}

export function personNode() {
  return {
    '@type': 'Person',
    '@id': ids.roland,
    name: 'Roland Nielson',
    jobTitle: "Men's Life Coach",
    worksFor: { '@id': ids.business },
    homeLocation: { '@type': 'City', name: 'Omaha', containedInPlace: { '@type': 'State', name: 'Nebraska' } },
    image: heroImage,
    url: abs('/about/'),
    sameAs: site.socials.map((s) => s.url),
    description:
      "Roland Nielson is a men's life coach in Omaha, Nebraska. He grew up in North Omaha, rebuilt his own life starting in 2011, and is a father of four boys. He coaches men on accountability, habits and rebuilding after addiction or setbacks.",
    knowsAbout: ['Accountability', 'Fatherhood', 'Rebuilding after addiction', 'Habit building'],
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: abs('/'),
    name: site.name,
    inLanguage: site.lang,
    publisher: { '@id': ids.business },
  };
}

export function webPage(opts: { path: string; title: string; description: string; type?: string; image?: string; dateModified?: string }) {
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': abs(`${opts.path}#webpage`),
    url: abs(opts.path),
    name: opts.title,
    description: opts.description,
    inLanguage: site.lang,
    isPartOf: { '@id': ids.website },
    about: { '@id': ids.business },
    ...(opts.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: opts.image } } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
  };
}

export function breadcrumbs(crumbs: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
  };
}

export type QA = { q: string; a: string };
export function faqPage(path: string, faqs: QA[]) {
  return {
    '@type': 'FAQPage',
    '@id': abs(`${path}#faq`),
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() } })),
  };
}

export function service(opts: { path: string; name: string; serviceType: string; description: string; offerIds?: string[] }) {
  const chosen = opts.offerIds ? plans.filter((p) => opts.offerIds!.includes(p.id)) : plans;
  return {
    '@type': 'Service',
    '@id': abs(`${opts.path}#service`),
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    provider: { '@id': ids.business },
    areaServed,
    audience: { '@type': 'PeopleAudience', audienceType: 'Men ages 30–55', suggestedGender: 'male' },
    url: abs(opts.path),
    offers: chosen.map((p) => ({ '@type': 'Offer', name: p.name, price: p.price, priceCurrency: 'USD', url: abs('/pricing/') })),
  };
}

export function youtubeVideo() {
  const v = site.videos.youtube;
  return {
    '@type': 'VideoObject',
    '@id': ids.ytVideo,
    name: v.title,
    description: v.description,
    thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
    ...(v.uploadDate ? { uploadDate: v.uploadDate } : {}),
    embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
    url: `https://www.youtube.com/watch?v=${v.id}`,
    publisher: { '@id': ids.business },
  };
}

export function recoveryVideo() {
  const v = site.videos.recovery;
  const d = video.durationSeconds;
  return {
    '@type': 'VideoObject',
    '@id': ids.recoveryVideo,
    name: v.title,
    description: v.description,
    thumbnailUrl: abs('/videos/roland-recovery-story-poster.jpg'),
    ...(v.uploadDate ? { uploadDate: v.uploadDate } : {}),
    duration: `PT${Math.floor(d / 60)}M${d % 60}S`,
    contentUrl: abs(`/videos/${v.slug}.mp4`),
    ...(video.transcript.length ? { transcript: video.transcript.join(' ') } : {}),
    inLanguage: 'en',
    publisher: { '@id': ids.business },
    creator: { '@id': ids.roland },
  };
}

export function blogPosting(opts: { path: string; title: string; description: string; published: string; updated: string; image: string }) {
  return {
    '@type': 'BlogPosting',
    '@id': abs(`${opts.path}#article`),
    headline: opts.title,
    description: opts.description,
    datePublished: opts.published,
    dateModified: opts.updated,
    image: opts.image,
    author: { '@id': ids.roland },
    publisher: { '@id': ids.business },
    mainEntityOfPage: { '@id': abs(`${opts.path}#webpage`) },
    inLanguage: site.lang,
  };
}

// A service-area page's place: a City, or a Place inside Omaha for neighborhoods.
export function areaPlace(a: AreaPage) {
  const state = { '@type': 'State', name: a.state === 'IA' ? 'Iowa' : 'Nebraska' };
  return a.kind === 'neighborhood'
    ? { '@type': 'Place', name: `${a.name}, Omaha, NE`, containedInPlace: { '@type': 'City', name: 'Omaha', containedInPlace: state } }
    : { '@type': 'City', name: a.name, containedInPlace: state };
}
// Omaha plus every service-area page (cities and Omaha neighborhoods).
export const allAreasServed = () => {
  const cities = new Map(areaServed.map((c) => [c.name, c] as const));
  for (const a of areaPages) if (a.kind === 'city' && !cities.has(a.name)) cities.set(a.name, areaPlace(a) as (typeof areaServed)[number]);
  return [...cities.values(), ...areaPages.filter((a) => a.kind === 'neighborhood').map(areaPlace)];
};

// Service node for the per-service and per-area pages. Offers: "from $149/month" (or a note).
export function localService(opts: { path: string; name: string; serviceType: string; description: string; area?: AreaPage; priceNote?: string }) {
  return {
    '@type': 'Service',
    '@id': abs(`${opts.path}#service`),
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    provider: { '@id': ids.business },
    areaServed: opts.area ? areaPlace(opts.area) : allAreasServed(),
    audience: { '@type': 'PeopleAudience', audienceType: 'Men', suggestedGender: 'male' },
    url: abs(opts.path),
    offers: opts.priceNote
      ? { '@type': 'Offer', description: opts.priceNote, priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'USD', description: opts.priceNote }, url: abs('/pricing/') }
      : {
          '@type': 'Offer',
          description: 'Plans from $149/month',
          price: 149,
          priceCurrency: 'USD',
          priceSpecification: { '@type': 'UnitPriceSpecification', price: 149, minPrice: 149, priceCurrency: 'USD', unitText: 'MONTH', referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' } },
          url: abs('/pricing/'),
          availability: 'https://schema.org/InStock',
        },
  };
}

export function article(opts: { path: string; title: string; description: string; published: string; updated: string; image: string }) {
  return { ...blogPosting(opts), '@type': 'Article' };
}

// The site-wide graph, included on every page.
export const baseGraph = () => [businessNode(), personNode(), websiteNode()];
