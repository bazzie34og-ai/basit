import type { PhotoKey } from '../data/photos';
import type { Faq } from '../data/faqs';

export type Tier = 1 | 2 | 3 | 4 | 5;

/** A free-form page section. html is template copy run through t(). */
export interface Section {
  id?: string;
  eyebrow?: string;
  h2: string;
  html: string;
  /** Optional second column (HTML) shown beside the copy on desktop */
  aside?: string;
  /** Render a shared component in the aside instead of html */
  component?:
    | 'photoReport'
    | 'packages'
    | 'askBox'
    | 'partnerForm'
    | 'beforeArrive'
    | 'noNeed'
    | 'moveTimeline'
    | 'houseTable'
    | 'apartmentTable'
    | 'seal';
  bg?: 'bg' | 'sand' | 'white';
}

export interface ServiceContent {
  slug: string;
  tier: Tier;
  /** One line for menus and hubs */
  short: string;
  icon: string;
  /** Answer-first paragraph(s) under the H1. The first sentence carries the primary keyword. */
  intro: string;
  /** Short reassurance under the CTA row */
  chips?: string[];
  heroPhoto: PhotoKey;
  photos: PhotoKey[];
  problem: { h2: string; quotes: string[]; paras: string[] };
  included: { h2: string; intro?: string; groups: { h3: string; items: string[] }[] };
  sections: Section[];
  process?: { h2: string; intro?: string };
  price: { h2: string; html: string };
  faqs: Faq[];
  faqH2?: string;
  related: string[];
  cta: { h2: string; p: string };
  /** Which areas paragraph lead-in to use above the 20-suburb grid */
  areasIntro: string;
}

export interface AreaContent {
  slug: string;
  tier: Tier;
  persona: string;
  intro: string;
  local: { h2: string; paras: string[] };
  access: { h3: string; html: string };
  checks: { h3: string; html: string; items: string[] };
  extra: { h2: string; html: string };
  photos: [PhotoKey, PhotoKey];
  photoIntro: string;
  services: { slug: string; anchor: string; why: string }[];
  servicesH2: string;
  faqs: Faq[];
  nearbyIntro: string;
  cta: { h2: string; p: string };
  /** Fill from a real booking only. null = section not rendered at all. */
  realJob: null | {
    street: string;
    property: string;
    agentList: string[];
    found: string;
    did: string;
    outcome: string;
    photos: string[];
  };
}

export interface ServiceData {
  slug: string;
  name: string;
  group: 'core' | 'carpet' | 'addon';
  pillar?: boolean;
  h1: string;
  title: string;
  primary: string;
  secondary: string[];
  lead: string;
  gbp: string;
  url: string;
  meta: string;
  flag?: string;
}

export interface AreaData {
  name: string;
  slug: string;
  pc: string;
  homes: string;
  local: string;
  access: string;
  focus: string;
  near: string[];
  url: string;
  title: string;
  h1: string;
  primary: string;
  secondary: string[];
  meta: string;
}
