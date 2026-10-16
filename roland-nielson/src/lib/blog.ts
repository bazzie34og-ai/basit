import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;
export const postPath = (p: Post) => `/blog/${p.id}/`;
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
export const niceDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export async function getPosts() {
  const posts = await getCollection('blog', (p) => !p.data.draft);
  return posts.sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf() || a.data.title.localeCompare(b.data.title));
}
export const readingMinutes = (body = '') => Math.max(1, Math.round(body.split(/\s+/).length / 230));
