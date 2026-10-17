import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const guides = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    h1: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().default('Diamond Plate Brisbane'),
    photo: z.string(),
    related: z.array(z.string()),
    services: z.array(z.object({ href: z.string(), label: z.string() })).length(2),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).min(2),
  }),
});

export const collections = { guides };
