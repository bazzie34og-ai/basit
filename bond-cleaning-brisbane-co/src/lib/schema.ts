/** JSON-LD builders (templates from the kit's schema-examples.md). No aggregateRating or review, ever. */
import { business, flags, areaGroups } from '../config/site';
import { allServices, areas, areaBySlug } from './data';
import { plain, flagOn } from './tpl';
import type { Faq } from '../data/faqs';

export const siteUrl = (path = '/') => new URL(path, import.meta.env.SITE).href;
export const businessId = () => siteUrl('/#business');

const isPlaceholder = (v: string) => !v || v.includes('[');

export const placeOf = (slug: string) => {
  const a = areaBySlug(slug);
  return { '@type': 'Place', name: `${a.name} QLD ${a.pc}` };
};
export const allPlaces = () => areaGroups.flatMap((g) => g.slugs).map(placeOf);

export function localBusiness() {
  const out: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': businessId(),
    name: business.name,
    description: business.identity,
    slogan: business.positioning,
    url: siteUrl('/'),
    logo: siteUrl('/images/brand/app-icon-512.png'),
    image: siteUrl('/images/og-bond-cleaning-brisbane-co.jpg'),
    telephone: business.phoneE164,
    email: business.email,
    priceRange: '$$',
    address: { '@type': 'PostalAddress', addressLocality: 'Brisbane', addressRegion: 'QLD', addressCountry: 'AU' },
    areaServed: allPlaces(),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: business.hoursSchema.opens,
        closes: business.hoursSchema.closes,
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Bond and end of lease cleaning services',
      itemListElement: allServices
        .filter((s) => !s.flag || flagOn(s.flag))
        .map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.gbp, url: siteUrl(s.url) } })),
    },
  };
  // Placeholders are kept out of structured data so validators don't flag them.
  if (isPlaceholder(business.phoneE164)) delete out.telephone;
  if (isPlaceholder(business.email)) delete out.email;
  const sameAs = business.sameAs.filter((u) => !isPlaceholder(u));
  if (sameAs.length) out.sameAs = sameAs;
  return out;
}

export const website = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': siteUrl('/#website'),
  url: siteUrl('/'),
  name: business.name,
  inLanguage: 'en-AU',
  publisher: { '@id': businessId() },
});

export const serviceSchema = (o: { name: string; serviceType: string; url: string; description?: string; area?: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: o.name,
  serviceType: o.serviceType,
  url: siteUrl(o.url),
  ...(o.description ? { description: plain(o.description) } : {}),
  provider: { '@id': businessId() },
  areaServed: o.area ? placeOf(o.area) : allPlaces(),
});

export const faqPage = (items: Faq[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: plain(f.q),
    acceptedAnswer: { '@type': 'Answer', text: plain(f.a) },
  })),
});

export const breadcrumb = (items: { name: string; href: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: siteUrl(it.href) })),
});

export const article = (o: { title: string; description: string; url: string; published: string; modified?: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: o.title,
  description: o.description,
  mainEntityOfPage: siteUrl(o.url),
  url: siteUrl(o.url),
  datePublished: o.published,
  dateModified: o.modified ?? o.published,
  inLanguage: 'en-AU',
  image: siteUrl('/images/og-bond-cleaning-brisbane-co.jpg'),
  author: { '@type': 'Organization', name: business.name, url: siteUrl('/') },
  publisher: { '@id': businessId() },
});

export const aboutPage = () => ({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: siteUrl('/about/'),
  name: `About ${business.name}`,
  mainEntity: { '@id': businessId() },
});

export const contactPage = () => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  url: siteUrl('/contact/'),
  name: 'Contact & Free Quote',
  mainEntity: { '@id': businessId() },
});

export { areas };
