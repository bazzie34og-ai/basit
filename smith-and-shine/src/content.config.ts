import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const faq = z.object({ q: z.string(), a: z.string() });

const areas = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/areas' }),
  schema: z.object({
    title: z.string().max(60),
    description: z.string().max(155),
    h1: z.string(),
    name: z.string(),
    mapHighlight: z.string(),
    order: z.number(),
    villages: z.array(z.string()),
    photo: z.string(),
    alt: z.string(),
    caption: z.string(),
    waText: z.string(),
    lead: z.string(),
    faqs: z.array(faq),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string().max(60),
    description: z.string().max(155),
    h1: z.string(),
    date: z.string(),
    order: z.number(),
    photo: z.string(),
    alt: z.string(),
    standfirst: z.string(),
    faqs: z.array(faq),
    cta: z.object({ text: z.string(), url: z.string(), label: z.string() }),
  }),
});

export const collections = { areas, guides };
