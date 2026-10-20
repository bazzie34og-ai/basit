import { b, abs } from './site.js';

const sameAs = Object.values(b.social).filter(Boolean).concat(b.googleProfileUrl ? [b.googleProfileUrl] : []);

export const businessId = abs('/#business');

// Price fields for an Offer; fuel delivery is a service fee plus the cost of fuel.
function offerFor(key) {
  const p = b.prices[key];
  if (p == null) return {};
  const o = { price: String(p), priceCurrency: 'USD' };
  if (key === 'fuelDelivery') o.description = `$${p} service fee plus the cost of fuel`;
  return o;
}

export function businessSchema() {
  const s = {
    '@type': ['AutomotiveBusiness', 'EmergencyService'],
    '@id': businessId,
    name: b.name,
    slogan: b.tagline,
    url: abs('/'),
    logo: abs('/img/lacaze-roadside-assistance-logo.png'),
    image: [abs('/img/og-lacaze-roadside-assistance.jpg'), abs('/img/john-lacaze-jr-owner.jpg')],
    telephone: b.phoneSchema,
    email: b.email,
    priceRange: b.priceRange,
    founder: { '@type': 'Person', name: b.owner, jobTitle: 'Owner' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: b.locality,
      addressRegion: b.region,
      postalCode: b.postalCode,
      addressCountry: b.country,
    },
    areaServed: b.cities.map((c) => ({ '@type': 'City', name: `${c}, TX` })),
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    }],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Roadside assistance services',
      itemListElement: [
        ['Jump start service', '/jump-start-spring-tx/', 'jumpStart'],
        ['Car lockout service', '/car-lockout-spring-tx/', 'lockout'],
        ['Emergency fuel delivery', '/fuel-delivery-spring-tx/', 'fuelDelivery'],
      ].map(([name, path, key]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name, url: abs(path) }, ...offerFor(key) })),
    },
  };
  if (sameAs.length) s.sameAs = sameAs;
  return s;
}

export function websiteSchema() {
  return { '@type': 'WebSite', '@id': abs('/#website'), url: abs('/'), name: b.name, publisher: { '@id': businessId }, inLanguage: 'en-US' };
}

export function breadcrumbSchema(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.href) })),
  };
}

const strip = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

export function faqSchema(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: strip(f.a) } })),
  };
}

export function serviceSchema({ name, serviceType, description, path, key }) {
  const offer = offerFor(key);
  return {
    ...(offer.price ? { offers: { '@type': 'Offer', ...offer } } : {}),
    '@type': 'Service',
    name,
    serviceType,
    description,
    url: abs(path),
    provider: { '@id': businessId },
    areaServed: b.cities.map((c) => ({ '@type': 'City', name: `${c}, TX` })),
    hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' },
  };
}

export function articleSchema({ headline, description, path, datePublished, dateModified }) {
  return {
    '@type': 'Article',
    headline,
    description,
    url: abs(path),
    mainEntityOfPage: abs(path),
    image: [abs('/img/og-lacaze-roadside-assistance.jpg')],
    datePublished,
    dateModified: dateModified || datePublished,
    author: { '@type': 'Person', name: b.owner, url: abs('/about/') },
    publisher: { '@id': businessId },
    inLanguage: 'en-US',
  };
}
