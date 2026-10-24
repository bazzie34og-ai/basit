import { business, services, towns, SITE_URL, enabledServices, type Service } from '../config/site';

export const BUSINESS_ID = `${SITE_URL}/#business`;
export const abs = (p: string) => (p.startsWith('http') ? p : `${SITE_URL}${p}`);

function offer(s: Service) {
  const o: Record<string, unknown> = {
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name: s.name, url: abs(s.path) },
  };
  if (s.fromPrice != null) {
    o.priceSpecification = { '@type': 'PriceSpecification', price: s.fromPrice, priceCurrency: 'GBP', minPrice: s.fromPrice };
  }
  return o;
}

export function businessSchema() {
  const sameAs = [business.social.facebook, business.social.instagram, business.google.gbpMapsUrl].filter(Boolean);
  const node: Record<string, unknown> = {
    '@type': 'HousekeepingService',
    '@id': BUSINESS_ID,
    name: business.name,
    description: business.descriptor,
    url: `${SITE_URL}/`,
    telephone: business.phones.call.tel,
    email: business.email,
    logo: abs('/icon-512.png'),
    image: abs('/og/home.png'),
    address: { '@type': 'PostalAddress', ...business.locality },
    areaServed: towns.map((t) => ({ '@type': 'City', name: t.name })),
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'customer service', telephone: business.phones.call.tel, availableLanguage: 'en-GB' },
      { '@type': 'ContactPoint', contactType: 'customer service', name: 'WhatsApp', telephone: business.phones.whatsapp.e164, url: `https://wa.me/${business.phones.whatsapp.wa}`, availableLanguage: 'en-GB' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Cleaning services',
      itemListElement: enabledServices().map(offer),
    },
  };
  if (sameAs.length) node.sameAs = sameAs;
  if (business.sinceYear) node.foundingDate = String(business.sinceYear);
  if (business.hours) {
    node.openingHoursSpecification = business.hours.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes }));
  }
  return node;
}

export function websiteSchema() {
  return { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: business.shortName, inLanguage: 'en-GB', publisher: { '@id': BUSINESS_ID } };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.href) })),
  };
}

export function serviceSchema(key: keyof typeof services, areaNames: string[] = towns.map((t) => t.name)) {
  const s = services[key];
  const node: Record<string, unknown> = {
    '@type': 'Service',
    '@id': `${abs(s.path)}#service`,
    name: s.name,
    serviceType: s.name,
    url: abs(s.path),
    provider: { '@id': BUSINESS_ID },
    areaServed: areaNames.map((name) => ({ '@type': 'City', name })),
  };
  if (s.fromPrice != null) node.offers = offer(s);
  return node;
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function articleSchema(a: { title: string; description: string; path: string; published: string; modified?: string }) {
  return {
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    url: abs(a.path),
    mainEntityOfPage: abs(a.path),
    datePublished: a.published,
    dateModified: a.modified ?? a.published,
    inLanguage: 'en-GB',
    image: abs(`/og${a.path.replace(/\/$/, '')}.png`),
    author: { '@id': BUSINESS_ID },
    publisher: { '@id': BUSINESS_ID },
  };
}
