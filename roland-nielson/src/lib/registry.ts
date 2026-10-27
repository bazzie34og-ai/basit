// All indexable URLs (pages, services, areas, questions, posts) for sitemaps, OG images and llms.txt.
import { pages, ogSlug, type PageMeta } from '../data/pages';
import { getPosts, postPath, isoDate } from './blog';
import { getServices, getAreas, getQuestions, pathOf } from './content';

const noteImg = { loc: '/images/rebuilding-after-addiction-coaching-omaha.webp', title: 'Roland Nielson holding a note about healing' };

export async function allEntries(): Promise<PageMeta[]> {
  const [posts, services, areas, questions] = await Promise.all([getPosts(), getServices(), getAreas(), getQuestions()]);
  return [
    ...pages,
    ...services.map((s) => ({
      path: pathOf(s.id),
      title: s.data.seoTitle,
      description: s.data.description,
      nav: s.data.nav,
      og: { eyebrow: s.data.eyebrow, headline: s.data.ogHeadline },
      lastmod: isoDate(s.data.updated),
      priority: 0.9,
      ...(s.data.video ? { videos: [s.data.video], images: [noteImg] } : {}),
    })),
    ...areas.map((a) => ({
      path: pathOf(a.id),
      title: a.data.seoTitle,
      description: a.data.description,
      nav: a.info.name,
      og: { eyebrow: `Life coach · ${a.info.name}, ${a.info.state}`, headline: a.data.ogHeadline },
      lastmod: isoDate(a.data.updated),
      priority: 0.8,
    })),
    ...questions.map((q) => ({
      path: pathOf(q.id),
      title: q.data.seoTitle,
      description: q.data.description,
      nav: q.data.title,
      og: { eyebrow: 'Straight answers', headline: q.data.ogHeadline },
      lastmod: isoDate(q.data.updated),
      priority: 0.7,
    })),
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
