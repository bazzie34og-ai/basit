// JSON-LD, built only from config. No Review or AggregateRating: self-serving review markup is not allowed.
import { business, social, services, extras, areaGroups, priceRange, openingHours, type Service } from '../config/site.ts';
import { SITE_URL } from './env.ts';

export const BUSINESS_ID = `${SITE_URL}/#business`;

const abs = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path}`);

export function areaServed() {
  return [
    { '@type': 'City', name: 'Aberdeen' },
    ...areaGroups.flatMap((g) => g.suburbs.map((name) => ({ '@type': 'Place', name: `${name}, Aberdeenshire` }))),
  ];
}

export function businessSchema(imagePath: string, logoPath: string) {
  const sameAs = [social.facebook.confirmed ? social.facebook.url : null, social.instagram.url, social.tiktok.url, social.googleProfileUrl].filter(Boolean);
  const node: Record<string, unknown> = {
    '@type': 'AutoWash',
    '@id': BUSINESS_ID,
    name: business.name,
    description: `Mobile car valeting across ${business.areaLine}. We come to your home or work, or you can drop off. Fixed prices from £10.`,
    url: `${SITE_URL}/`,
    telephone: business.phoneE164,
    email: business.email,
    address: { '@type': 'PostalAddress', addressLocality: business.locality, addressRegion: business.region, addressCountry: business.country },
    areaServed: areaServed(),
    priceRange,
    image: abs(imagePath),
    logo: abs(logoPath),
    slogan: business.taglines.main,
    sameAs,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Valeting services',
      itemListElement: [
        ...services.map((s) => offer(s.name, s.priceMin, s.priceMax, s.includes.join(', '), s.href)),
        ...extras.map((e) => offer(e.name, e.price, e.price, e.blurb, e.href)),
      ],
    },
  };
  if (openingHours.length) {
    node.openingHoursSpecification = openingHours.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes }));
  }
  return node;
}

function offer(name: string, min: number, max: number, description: string, href?: string) {
  const price =
    min === max
      ? { price: min.toFixed(2), priceCurrency: 'GBP' }
      : { priceSpecification: { '@type': 'PriceSpecification', minPrice: min.toFixed(2), maxPrice: max.toFixed(2), priceCurrency: 'GBP' } };
  return {
    '@type': 'Offer',
    ...price,
    itemOffered: { '@type': 'Service', name, description, ...(href ? { url: abs(href) } : {}) },
  };
}

export function serviceSchema(opts: { name: string; serviceType: string; path: string; description: string; service?: Service; price?: [number, number] }) {
  const [min, max] = opts.price ?? (opts.service ? [opts.service.priceMin, opts.service.priceMax] : [0, 0]);
  const node: Record<string, unknown> = {
    '@type': 'Service',
    '@id': `${abs(opts.path)}#service`,
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: abs(opts.path),
    provider: { '@id': BUSINESS_ID },
    areaServed: areaServed(),
  };
  if (min) {
    node.offers = {
      '@type': 'Offer',
      priceCurrency: 'GBP',
      ...(min === max ? { price: min.toFixed(2) } : { priceSpecification: { '@type': 'PriceSpecification', minPrice: min.toFixed(2), maxPrice: max.toFixed(2), priceCurrency: 'GBP' } }),
      url: abs(opts.path),
    };
  }
  return node;
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.href) })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function articleSchema(opts: { headline: string; description: string; path: string; image: string; datePublished: string; dateModified?: string }) {
  return {
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    image: abs(opts.image),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    mainEntityOfPage: abs(opts.path),
    author: { '@type': 'Organization', name: business.name, '@id': BUSINESS_ID },
    publisher: { '@id': BUSINESS_ID },
  };
}
