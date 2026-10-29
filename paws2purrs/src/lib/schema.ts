import { biz, siteUrl, photoUrl, services } from './site';

export const businessId = `${siteUrl}/#business`;

export function localBusiness() {
  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    addressLocality: biz.address.locality,
    addressRegion: biz.address.region,
    postalCode: biz.address.postcode,
    addressCountry: biz.address.country,
  };
  if (biz.flags.showFullAddress) address.streetAddress = biz.address.street;

  const sameAs = [biz.facebook.url];
  if (biz.flags.showInstagram) sameAs.push(biz.instagram.url);
  if (biz.google.profileConfirmed) sameAs.push(biz.google.reviewsUrl);

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': businessId,
    name: biz.name,
    alternateName: biz.shortName,
    description:
      `Licensed and insured dog daycare and home boarding run by ${biz.owner} from her home in Arnold, Nottingham. ` +
      'Small-pack woodland walks, home-from-home overnight stays, dog walks with pick-up and drop-off, dog pop-ins, cat visits and small animal feeds.',
    url: `${siteUrl}/`,
    telephone: biz.phone.schema,
    logo: `${siteUrl}/icons/icon-512.png`,
    image: [photoUrl('hero', true), photoUrl('vanessaHusky', true), photoUrl('boarding', true)],
    founder: { '@type': 'Person', name: biz.owner + (biz.ownerSurname ? ` ${biz.ownerSurname}` : '') },
    address,
    geo: { '@type': 'GeoCoordinates', latitude: biz.geo.latitude, longitude: biz.geo.longitude },
    areaServed: biz.areas.map((a) => ({ '@type': 'Place', name: `${a.name}, Nottingham` })),
    sameAs,
    knowsAbout: ['Dog daycare', 'Home dog boarding', 'Dog walking', 'Cat sitting'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Dog and pet care services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, url: siteUrl + s.href, description: s.blurb },
      })),
    },
  };
  if (biz.email) data.email = biz.email;
  if (biz.openingHours) data.openingHours = biz.openingHours;
  return data;
}

export function serviceSchema(name: string, description: string, path: string, serviceType: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    serviceType,
    description,
    url: siteUrl + path,
    provider: { '@id': businessId },
    areaServed: biz.areas.map((a) => ({ '@type': 'Place', name: `${a.name}, Nottingham` })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a.replace(/<[^>]+>/g, '') },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: siteUrl + t.path,
    })),
  };
}
