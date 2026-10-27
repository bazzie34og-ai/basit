// Service, area and question pages (markdown collections), with feature flags applied.
// Every menu, link list, sitemap and schema block reads from these helpers, so a page whose
// flag is off simply doesn't exist anywhere.
import { getCollection, type CollectionEntry } from 'astro:content';
import { flags, areaPages, areaLabel, type AreaPage } from '../config/site';

export type Service = CollectionEntry<'services'>;
export type Area = CollectionEntry<'areas'>;
export type Question = CollectionEntry<'questions'>;

export const pathOf = (id: string) => `/${id}/`;

export const serviceGroups = [
  { id: 'challenge', label: 'By challenge' },
  { id: 'who', label: 'For who' },
  { id: 'meet', label: 'How we meet' },
  { id: 'program', label: 'Programs' },
] as const;

export async function getServices(): Promise<Service[]> {
  const all = await getCollection('services', (s) => !s.data.flag || flags[s.data.flag]);
  const g = serviceGroups.map((x) => x.id as string);
  return all.sort((a, b) => g.indexOf(a.data.group) - g.indexOf(b.data.group) || a.data.order - b.data.order);
}

export async function getAreas(): Promise<(Area & { info: AreaPage })[]> {
  const all = await getCollection('areas');
  return areaPages
    .map((info) => {
      const entry = all.find((a) => a.id === info.slug);
      return entry ? { ...entry, info } : null;
    })
    .filter((x): x is Area & { info: AreaPage } => Boolean(x));
}

export const getQuestions = () => getCollection('questions');

export const areaInfo = (slug: string) => areaPages.find((a) => a.slug === slug);
export { areaLabel };

// Menu groups: services grouped as in the header mega-menu.
export async function serviceMenu() {
  const services = await getServices();
  return serviceGroups.map((g) => ({
    ...g,
    links: services.filter((s) => s.data.group === g.id).map((s) => ({ href: pathOf(s.id), label: s.data.nav })),
  }));
}
