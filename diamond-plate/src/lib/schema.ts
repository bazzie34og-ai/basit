/** JSON-LD builders. Everything comes from src/config/site.ts. No review or rating schema, ever. */
import { SITE_URL, business, hours, packages, priceRange, regions, social } from '../config/site';

export const BUSINESS_ID = `${SITE_URL}/#business`;
const abs = (path: string) => new URL(path, SITE_URL + '/').href;

export const areaServed = [
  { '@type': 'City', name: 'Brisbane', containedInPlace: { '@type': 'State', name: 'Queensland' } },
  { '@type': 'City', name: 'Logan', containedInPlace: { '@type': 'State', name: 'Queensland' } },
  { '@type': 'AdministrativeArea', name: 'Redland City', containedInPlace: { '@type': 'State', name: 'Queensland' } },
  ...regions.map((r) => ({ '@type': 'Place', name: `${r.name}, Brisbane` })),
];

export const offerFor = (p: (typeof packages)[number]) => ({
  '@type': 'Offer',
  name: p.name,
  price: p.price.toFixed(2),
  priceCurrency: 'AUD',
  url: abs('/ceramic-coating-prices/'),
  itemOffered: {
    '@type': 'Service',
    name: p.name,
    description: `${p.summary} Warranty covers: ${p.warrantyCovers.toLowerCase()}.`,
    provider: { '@id': BUSINESS_ID },
  },
});

export function businessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    '@id': BUSINESS_ID,
    name: business.name,
    url: SITE_URL + '/',
    telephone: business.phone.schema,
    email: business.email,
    image: abs('/diamond-plate-logo.png'),
    logo: abs('/diamond-plate-logo.png'),
    description: `Mobile graphene ceramic coating across Brisbane. ${business.brandSummary}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.suburb,
      addressRegion: business.address.state,
      postalCode: business.address.postcode,
      addressCountry: business.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: business.geo.lat, longitude: business.geo.lng },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: [...hours.days], opens: hours.opens, closes: hours.closes },
    ],
    areaServed,
    priceRange,
    sameAs: [social.facebook, social.nationalSite, social.googleMaps],
    parentOrganization: { '@type': 'Organization', name: business.brand, url: social.nationalSite },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Ceramic coating packages',
      itemListElement: packages.map(offerFor),
    },
  };
}

export interface Crumb { name: string; path: string }

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
  };
}

export function serviceSchema(opts: { name: string; path: string; description: string; serviceType?: string; offers?: (typeof packages)[number][] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': abs(opts.path) + '#service',
    name: opts.name,
    serviceType: opts.serviceType ?? 'Ceramic coating',
    description: opts.description,
    url: abs(opts.path),
    provider: { '@id': BUSINESS_ID },
    areaServed,
    ...(opts.offers?.length
      ? opts.offers.length === 1
        ? { offers: offerFor(opts.offers[0]) }
        : {
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'AUD',
              lowPrice: Math.min(...opts.offers.map((o) => o.price)).toFixed(2),
              highPrice: Math.max(...opts.offers.map((o) => o.price)).toFixed(2),
              offerCount: opts.offers.length,
            },
          }
      : {}),
  };
}

export interface QA { q: string; a: string }

/** Strip HTML so the schema text matches the visible answer text exactly. */
export const plain = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

export function faqSchema(items: QA[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: plain(i.a) },
    })),
  };
}

export function articleSchema(a: { title: string; description: string; path: string; date: Date; updated?: Date; image: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    mainEntityOfPage: abs(a.path),
    datePublished: a.date.toISOString().slice(0, 10),
    dateModified: (a.updated ?? a.date).toISOString().slice(0, 10),
    image: a.image,
    author: { '@type': 'Organization', name: 'Diamond Plate Brisbane', url: SITE_URL + '/' },
    publisher: { '@id': BUSINESS_ID, '@type': 'AutomotiveBusiness', name: business.name, logo: { '@type': 'ImageObject', url: abs('/diamond-plate-logo.png') } },
    inLanguage: 'en-AU',
  };
}
