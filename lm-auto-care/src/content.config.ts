import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const faq = z.object({ q: z.string(), a: z.string() });

const guides = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string().max(60),
    description: z.string().max(155),
    h1: z.string(),
    kicker: z.string(),
    published: z.string(),
    photo: z.string(),
    photoAlt: z.string(),
    photoCaption: z.string().optional(),
    services: z.array(z.object({ href: z.string(), label: z.string() })).length(2),
    faqs: z.array(faq).min(3),
    order: z.number(),
  }),
});

const areas = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/areas' }),
  schema: z.object({
    title: z.string().max(60),
    description: z.string().max(155),
    h1: z.string(),
    group: z.string(),
    photo: z.string(),
    photoAlt: z.string(),
    photoCaption: z.string().optional(),
    pullQuote: z.string(),
    suits: z.array(z.object({ href: z.string(), label: z.string(), why: z.string() })).min(2),
    faqs: z.array(faq).min(2),
    order: z.number(),
  }),
});

export const collections = { guides, areas };
