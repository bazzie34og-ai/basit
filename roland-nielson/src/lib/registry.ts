// All indexable URLs (pages + posts) for sitemaps and OG images.
import { pages, ogSlug, type PageMeta } from '../data/pages';
import { getPosts, postPath, isoDate } from './blog';

export async function allEntries(): Promise<PageMeta[]> {
  const posts = await getPosts();
  return [
    ...pages,
    ...posts.map((p) => ({
      path: postPath(p),
      title: p.data.seoTitle,
      description: p.data.description,
      og: { eyebrow: 'Notes from Roland', headline: p.data.title.split(/[:?(]/)[0].trim() + (p.data.title.includes('?') ? '?' : '') },
      lastmod: isoDate(p.data.updated),
      priority: 0.6,
    })),
  ];
}
export { ogSlug };
