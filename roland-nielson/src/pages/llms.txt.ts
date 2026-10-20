// /llms.txt: a plain summary for AI assistants, generated from the same config as the site.
import { site, plans, inPersonAddOn, rebuildProgram, hoursText, areaNames, abs } from '../config/site';
import { getPosts, postPath } from '../lib/blog';

export async function GET() {
  const posts = await getPosts();
  const body = `# ${site.name}

> ${site.description}

Roland Nielson is a men's life coach in ${site.locality} (service-area business, no public office). He grew up in North Omaha, began rebuilding his own life in 2011 after addiction and juvenile detention, and is a father of four boys. He has coached men since November 2025. He works with men roughly 30–55: fathers, working men, men rebuilding after addiction or setbacks, and men in life transitions.

## Key facts
- Business name: ${site.name}
- Legal name: ${site.legalName}
- Phone (call or text): ${site.phone.display}
- Email: ${site.email}
- Website: ${abs('/')}
- Free first step: ${site.bookingLabel}: ${site.booking}
- Hours (Central time): ${hoursText}
- Session formats: in person in Omaha by appointment (client's location or a private meeting space), video, phone
- Service area: ${areaNames.join(', ')}

## Prices (USD)
${plans.map((p) => `- ${p.name}: ${p.priceLabel}${p.unit}. ${p.details.join('; ')}`).join('\n')}
- ${inPersonAddOn.name}: ${inPersonAddOn.priceLabel} per in-person session. ${inPersonAddOn.detail}
- ${rebuildProgram.name}: ${rebuildProgram.summary} ${rebuildProgram.price ? `$${rebuildProgram.price}/month.` : 'Price shared on the free call; apply by booking a call.'}

## Scope of practice
Roland is a non-clinical life coach with no coaching, counseling or peer-recovery certification. Coaching is not therapy, counseling, medical care, addiction treatment or crisis support, and does not diagnose or treat any condition. He refers clients to licensed professionals when appropriate. Crisis help: call or text 988. Local services: call 211.

## Key pages
- [Men's life coaching in Omaha](${abs('/mens-life-coaching-omaha/')})
- [Accountability coaching](${abs('/accountability-coaching/')})
- [Coaching for fathers and husbands](${abs('/coaching-for-fathers/')})
- [Rebuilding after addiction](${abs('/rebuilding-after-addiction/')})
- [The Rebuild Program](${abs('/the-rebuild-program/')})
- [Pricing](${abs('/pricing/')})
- [About Roland](${abs('/about/')})
- [For families](${abs('/for-families/')})
- [Omaha metro service area](${abs('/omaha-life-coach/')})
- [Omaha resources](${abs('/omaha-resources/')})
- [Free Personal Patterns Assessment](${abs('/personal-patterns-assessment/')}): 20-statement self-reflection tool, results on screen, no purchase required
- [FAQ](${abs('/faq/')})
- [Contact](${abs('/contact/')})

## Blog
${posts.map((p) => `- [${p.data.title}](${abs(postPath(p))})`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
