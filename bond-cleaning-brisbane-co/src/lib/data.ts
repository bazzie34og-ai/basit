import siteData from '../data/site-data.json';
import type { AreaData, ServiceData } from './types';
import { areaGroups } from '../config/site';

export const allServices = (siteData.services as ServiceData[]).map((s) =>
  // The kit marks the urgent page "only publish if same/next-day capacity is real": tie it to the sameDay flag.
  s.flag ? { ...s, flag: 'sameDay' } : s
);
/** The 22 service pages (the pillar "bond cleaning brisbane" is the homepage). */
export const services = allServices.filter((s) => !s.pillar);
export const areas = siteData.areas as AreaData[];

export const serviceBySlug = (slug: string) => {
  const s = allServices.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown service ${slug}`);
  return s;
};
export const areaBySlug = (slug: string) => {
  const a = areas.find((x) => x.slug === slug);
  if (!a) throw new Error(`Unknown area ${slug}`);
  return a;
};
export const areaUrl = (slug: string) => `/bond-cleaning-${slug}/`;
export const groupOfArea = (slug: string) => areaGroups.find((g) => g.slugs.includes(slug));
export const servicesInGroup = (group: string) => services.filter((s) => s.group === group);

/** Keyword anchor text for links to a service page, e.g. "Oven cleaning in Brisbane". */
export const kwAnchor = (s: ServiceData) => {
  const k = s.primary.replace(/ brisbane$/, ' in Brisbane');
  return k.charAt(0).toUpperCase() + k.slice(1);
};
/** Menu-friendly names for services */
export const shortName = (s: ServiceData) => s.name;
