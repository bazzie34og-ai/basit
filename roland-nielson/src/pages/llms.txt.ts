// /llms.txt: a plain summary for AI assistants, generated from the same config and content as the site.
// The first line is the site's first-sentence statement, word for word.
import { site, plans, inPersonAddOn, rebuildProgram, areaNames, abs, priceRange } from '../config/site';
import { pages } from '../data/pages';
import { getPosts, postPath } from '../lib/blog';
import { getServices, getAreas, getQuestions, pathOf, serviceGroups } from '../lib/content';

export const FIRST_SENTENCE =
  "Roland Nielson – Omaha Men's Life Coaching is a men's life coach in Omaha, NE who helps men who feel stuck build discipline, keep their word and rebuild their lives.";

export async function GET() {
  const [posts, services, areas, questions] = await Promise.all([getPosts(), getServices(), getAreas(), getQuestions()]);
  const pg = (path: string) => pages.find((p) => p.path === path)!;
  const line = (title: string, path: string, desc: string) => `- [${title}](${abs(path)}): ${desc}`;
  const core = ['/', '/omaha-life-coach/', '/services/', '/free-call/', '/pricing/', '/about/', '/reviews/', '/for-families/', '/personal-patterns-assessment/', '/faq/', '/omaha-resources/', '/contact/', '/blog/'];
  const body = `${FIRST_SENTENCE}

# ${site.name}

> ${site.description}

Roland Nielson is a men's life coach in ${site.locality} (service-area business, no public office or street address). He grew up in North Omaha, began rebuilding his own life in 2011 after addiction and juvenile detention, and is a father of four. He has coached men since November 2025. He works with men roughly 30–55: fathers, working men, men rebuilding after addiction or setbacks, and men in life transitions. His three pillars: Make tomorrow easier · Stop before you react · Do what you said.

## Key facts
- Business name: ${site.name}
- Phone (call or text): ${site.phone.display}
- Email: ${site.email}
- Location: ${site.locality}. Service area: ${areaNames.join(', ')}
- Website: ${abs('/')}
- Free first step: ${site.bookingLabel}: ${site.booking}
- When: evenings and Saturdays (open times on the booking page)
- Formats: in person in Omaha by appointment (client's place, a private meeting space or a walk-and-talk), video, phone
- Price range: ${priceRange}

## Prices (USD)
${plans.map((p) => `- ${p.name}: ${p.priceLabel}${p.unit}. ${p.details.join('; ')}`).join('\n')}
- ${inPersonAddOn.name}: ${inPersonAddOn.priceLabel} per in-person session. ${inPersonAddOn.detail}
- ${rebuildProgram.name}: ${rebuildProgram.summary} ${rebuildProgram.price ? `$${rebuildProgram.price}/month.` : 'Price shared on the free call; apply by booking a call.'}

## Scope of practice
Roland is a non-clinical life coach with no coaching, counseling or peer-recovery certification; he coaches from lived experience. Coaching is not therapy, counseling, medical care, addiction treatment or crisis support, and does not diagnose or treat any condition. He refers clients to licensed professionals when appropriate. Crisis help: call or text 988. Local services: call 211.

## Main pages
${core.map((p) => line(pg(p).nav ?? pg(p).title, p, pg(p).description)).join('\n')}

${serviceGroups.map((g) => {
  const items = services.filter((s) => s.data.group === g.id);
  return items.length ? `## Coaching services: ${g.label.toLowerCase()}\n${items.map((s) => line(`${s.data.serviceName} in Omaha`, pathOf(s.id), s.data.description)).join('\n')}` : '';
}).filter(Boolean).join('\n\n')}

## Service areas
${areas.map((a) => line(`Life coach in ${a.info.name}, ${a.info.state}`, pathOf(a.id), a.data.description)).join('\n')}

## Questions answered
${questions.map((q) => line(q.data.title, pathOf(q.id), q.data.description)).join('\n')}

## Blog
${posts.map((p) => line(p.data.title, postPath(p), p.data.description)).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
