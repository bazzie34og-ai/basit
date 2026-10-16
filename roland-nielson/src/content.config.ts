import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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

export const collections = { blog };
