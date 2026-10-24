import type { ServiceKey } from '../config/site';

export interface GuideMeta {
  slug: string;
  path: string;
  short: string; // footer label
  title: string; // <title>, ≤ 60
  h1: string;
  description: string; // ≤ 155
  service: ServiceKey;
  published: string;
}

const g = (m: Omit<GuideMeta, 'path'>): GuideMeta => ({ ...m, path: `/guides/${m.slug}/` });

export const guides: GuideMeta[] = [
  g({ slug: 'how-long-does-carpet-take-to-dry', short: 'Carpet drying times', title: 'How Long Does Carpet Take to Dry After Cleaning?', h1: 'How long does carpet take to dry after cleaning?', description: 'Typical drying times after hot water extraction, what speeds it up, and how to dry carpets in damp Welsh weather. Plain answers from a Cardiff cleaner.', service: 'carpet', published: '2026-10-24' }),
  g({ slug: 'end-of-tenancy-carpet-cleaning-deposit', short: 'Getting your deposit back', title: 'End of Tenancy Carpet Cleaning Cardiff: Your Deposit', h1: 'End of tenancy carpet cleaning in Cardiff: how to get your deposit back', description: 'What landlords and inventory clerks check on carpets, the evidence that helps, and a move-out checklist for tenants in Cardiff and Newport.', service: 'tenancy', published: '2026-10-24' }),
  g({ slug: 'dog-accidents-on-carpet-smell', short: 'Dog accidents & smells', title: 'Dog Accidents on Carpet: Why the Smell Comes Back', h1: 'Dog accidents on carpet: why the smell comes back, and how it’s properly treated', description: 'Why dog urine smells return on damp days, what not to use, and how a proper treatment reaches the underlay. Honest advice for pet owners.', service: 'stain', published: '2026-10-24' }),
  g({ slug: 'steam-cleaning-vs-hot-water-extraction', short: 'Steam vs extraction', title: 'Steam Cleaning vs Hot Water Extraction: The Difference', h1: 'Steam cleaning vs hot water extraction: what’s the difference?', description: 'An honest look at the terms. What “steam cleaning” usually means for carpets, how hot water extraction works, and when each one fits.', service: 'carpet', published: '2026-10-24' }),
  g({ slug: 'carpet-cleaning-cost-cardiff', short: 'Carpet cleaning prices', title: 'How Much Does Carpet Cleaning Cost in Cardiff?', h1: 'How much does carpet cleaning cost in Cardiff?', description: 'Typical Cardiff market prices for rooms, stairs, sofas and pet treatments, what changes the price, and how to get a fixed quote from a photo.', service: 'carpet', published: '2026-10-24' }),
];
