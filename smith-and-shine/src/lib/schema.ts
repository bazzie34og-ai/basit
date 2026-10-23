import {
  business, phoneE164, social, areaServed, priceRange, activeServices, monthlyPlan,
} from '../config/site.ts';

const abs = (site: string, path: string) => new URL(path, site + '/').toString();

/** Site-wide AutoWash (an AutomotiveBusiness subtype). No street address: service-area business. */
export function businessSchema(site: string) {
  const offers = [
    ...monthlyPlan.prices.map((p) => ({
      '@type': 'Offer',
      name: `${monthlyPlan.name}: ${p.label}`,
      price: p.price.toFixed(2),
      priceCurrency: 'GBP',
      url: abs(site, monthlyPlan.url),
      itemOffered: { '@type': 'Service', name: `${monthlyPlan.name} (${p.label})` },
    })),
    ...activeServices
      .filter((s) => s.id !== 'monthly' && s.id !== 'not-sure')
      .map((s) => {
        const name = s.group === 'motorbikes' ? `Motorbike ${s.name}` : s.group === 'vans' ? `Van ${s.name}` : s.name;
        const offer: Record<string, unknown> = {
          '@type': 'Offer',
          name,
          url: abs(site, s.url.split('#')[0]),
          itemOffered: { '@type': 'Service', name, description: s.blurb },
        };
        if (s.from !== null) {
          offer.priceSpecification = {
            '@type': 'PriceSpecification', minPrice: s.from.toFixed(2), priceCurrency: 'GBP',
          };
        }
        return offer;
      }),
  ];
  const sameAs = [social.facebook.url, social.instagram.url, social.googleMaps].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoWash',
    '@id': `${site}/#business`,
    name: business.name,
    description: 'Family-run mobile valeting and detailing. We come to your home, driveway or work across Telford and Shropshire.',
    url: `${site}/`,
    telephone: phoneE164,
    logo: abs(site, '/logo-512.png'),
    image: abs(site, '/og/home.png'),
    address: {
      '@type': 'PostalAddress',
      addressLocality: business.locality,
      addressRegion: business.region,
      addressCountry: business.country,
    },
    areaServed: areaServed.map((name) => ({ '@type': 'City', name })),
    priceRange,
    // openingHoursSpecification: TODO-CONFIRM real hours before adding
    sameAs,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Valeting and detailing services',
      itemListElement: offers,
    },
  };
}

export function serviceSchema(site: string, s: { name: string; description: string; url: string; minPrice?: number | null; serviceType?: string }) {
  const out: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    serviceType: s.serviceType ?? s.name,
    description: s.description,
    url: abs(site, s.url),
    provider: { '@id': `${site}/#business` },
    areaServed: areaServed.map((name) => ({ '@type': 'City', name })),
  };
  if (s.minPrice != null) {
    out.offers = {
      '@type': 'Offer',
      priceSpecification: { '@type': 'PriceSpecification', minPrice: s.minPrice.toFixed(2), priceCurrency: 'GBP' },
    };
  }
  return out;
}

export interface Faq { q: string; a: string }

/** FAQPage text must match the visible text exactly; FaqList renders the same strings. */
export function faqSchema(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export interface Crumb { name: string; url: string }

export function breadcrumbSchema(site: string, crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem', position: i + 1, name: c.name, item: abs(site, c.url),
    })),
  };
}

export function articleSchema(site: string, a: { title: string; description: string; url: string; date: string; image: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.date,
    mainEntityOfPage: abs(site, a.url),
    image: abs(site, a.image),
    author: { '@type': 'Person', name: 'Chris', worksFor: { '@id': `${site}/#business` } },
    publisher: { '@id': `${site}/#business` },
  };
}
