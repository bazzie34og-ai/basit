import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const qa = z.object({ q: z.string(), a: z.string() });
const seo = {
  seoTitle: z.string().max(80),
  description: z.string().min(140).max(160),
  keyword: z.string(), // the one primary keyword this page owns
  ogHeadline: z.string().max(60),
  updated: z.coerce.date(),
};

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(), // H1
    seoTitle: z.string().max(60),
    description: z.string().min(140).max(155),
    published: z.coerce.date(),
    updated: z.coerce.date(),
    keyword: z.string(),
    related: z.array(z.string()).default([]),
    scope: z.boolean().default(false), // whole post is a "what coaching is not" comparison
    draft: z.boolean().default(false),
  }),
});

// One page per service at /<file name>/. Body markdown = the "why this keeps happening" story.
const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(), // H1: "{Service} in Omaha, NE"
    ...seo,
    nav: z.string(), // menu + breadcrumb label
    group: z.enum(['challenge', 'who', 'meet', 'program']),
    order: z.number(),
    flag: z.enum(['OFFERS_GROUP_COACHING', 'OFFERS_LEADERSHIP', 'OFFERS_YOUNG_MEN']).optional(),
    serviceName: z.string(), // exact service phrase, e.g. "Accountability Coaching" (matches the GBP service)
    eyebrow: z.string(),
    pain: z.string(), // the core pain in the customer's words
    intro: z.string(), // 2 sentences; the first answers the search
    isThisYou: z.array(z.string()).min(5).max(7),
    storyHeading: z.string(), // H2 above the body markdown
    steps: z.array(z.object({ pillar: z.string(), h: z.string(), p: z.string() })).min(3).max(4),
    workOn: z.array(z.object({ h: z.string(), p: z.string() })).min(4).max(6),
    forWho: z.array(z.string()).min(3).max(6),
    notFor: z.array(z.string()).min(2).max(4),
    related: z.array(z.object({ slug: z.string(), anchor: z.string() })).length(3),
    areas: z.array(z.string()).min(4).max(6),
    faqs: z.array(qa).min(5).max(8),
    video: z.enum(['recovery', 'youtube']).optional(),
    priceNote: z.string().optional(), // replaces the default "Plans from $149/month" line
  }),
});

// One page per service area at /<file name>/. Body markdown = "How in-person coaching works in {place}".
const areas = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/areas' }),
  schema: z.object({
    title: z.string(), // H1: "Men's life coaching in {place}"
    ...seo,
    intro: z.string(),
    painsHeading: z.string(),
    pains: z.array(z.object({ h: z.string(), p: z.string() })).min(4).max(5),
    inPersonHeading: z.string(),
    places: z.array(z.object({ name: z.string(), note: z.string() })).min(2).max(4),
    services: z.array(z.object({ slug: z.string(), anchor: z.string() })).min(6).max(8),
    nearby: z.array(z.string()).min(3).max(4),
    faqs: z.array(qa).min(4).max(6),
  }),
});

// Answer-first question pages at /<file name>/.
const questions = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/questions' }),
  schema: z.object({
    title: z.string(), // H1 = the question
    ...seo,
    published: z.coerce.date(),
    service: z.object({ path: z.string(), anchor: z.string() }),
    faqs: z.array(qa).default([]),
    scope: z.boolean().default(false), // whole page explains what coaching is not
  }),
});

export const collections = { blog, services, areas, questions };
