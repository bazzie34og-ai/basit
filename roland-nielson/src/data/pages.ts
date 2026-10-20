// Every static page: SEO title (≤ 60 chars), meta description (140–155 chars), sitemap data.
// Blog posts are added from the content collection in src/lib/registry.ts.

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  nav?: string; // short label for menus and breadcrumbs
  og: { eyebrow: string; headline: string };
  lastmod: string;
  priority?: number;
  images?: { loc: string; title: string }[];
  videos?: ('youtube' | 'recovery')[];
  noindex?: boolean;
};

const UPDATED = '2026-10-16';
const heroImg = { loc: '/images/roland-nielson-mens-life-coach-omaha.jpg', title: 'Roland Nielson, men\'s life coach in Omaha' };
const noteImg = { loc: '/images/rebuilding-after-addiction-coaching-omaha.webp', title: 'Roland Nielson holding a note about healing' };

export const pages: PageMeta[] = [
  {
    path: '/',
    title: "Men's Life Coach in Omaha, NE | Roland Nielson",
    description:
      "Men's life coaching in Omaha for fathers, working men and men rebuilding. Evenings and Saturdays, in person or online. Book a free 20-minute call today.",
    nav: 'Home',
    og: { eyebrow: "Men's Life Coaching · Omaha, NE", headline: 'For men ready to rebuild' },
    lastmod: UPDATED,
    priority: 1,
    images: [heroImg],
    videos: ['youtube'],
  },
  {
    path: '/mens-life-coaching-omaha/',
    title: 'Life Coaching for Men in Omaha | Roland Nielson',
    description:
      'One-on-one life coaching for men in Omaha who feel stuck, overwhelmed or done starting over. Plain talk, a real plan, weekly sessions. Book a free call.',
    nav: "Men's Life Coaching",
    og: { eyebrow: 'Life coaching for men · Omaha', headline: 'Tired of living the same day?' },
    lastmod: UPDATED,
    priority: 0.9,
  },
  {
    path: '/accountability-coaching/',
    title: 'Accountability Coach in Omaha | Discipline & Habits',
    description:
      'Accountability coaching in Omaha for men who start strong and slip. Simple habits, weekly check-ins and a plan built for bad days. Book a free call now.',
    nav: 'Accountability Coaching',
    og: { eyebrow: 'Accountability coaching · Omaha', headline: 'Accountability that holds on a bad Tuesday' },
    lastmod: UPDATED,
    priority: 0.9,
  },
  {
    path: '/coaching-for-fathers/',
    title: 'Coaching for Fathers & Husbands in Omaha',
    description:
      'Coaching for Omaha fathers and husbands who want to be present at home, calm under pressure and keep their word. Evening sessions. Book a free call.',
    nav: 'Coaching for Fathers',
    og: { eyebrow: 'Coaching for fathers · Omaha', headline: 'Be the dad who comes home and stays' },
    lastmod: UPDATED,
    priority: 0.9,
    images: [noteImg],
  },
  {
    path: '/rebuilding-after-addiction/',
    title: 'Life Coaching for Men Rebuilding After Addiction',
    description:
      'Coaching from lived experience for Omaha men rebuilding after addiction: structure, routine, accountability and trust. Not a program. Book a free call.',
    nav: 'Rebuilding After Addiction',
    og: { eyebrow: 'Rebuilding after addiction · Omaha', headline: 'Life after the hardest chapter' },
    lastmod: UPDATED,
    priority: 0.9,
    images: [noteImg],
    videos: ['recovery'],
  },
  {
    path: '/the-rebuild-program/',
    title: "The Rebuild Program | 3–6 Month Men's Coaching",
    description:
      "The Rebuild Program is a 3–6 month men's coaching program in Omaha: habits, mindset, relationships and discipline with weekly support. Apply by call.",
    nav: 'The Rebuild Program',
    og: { eyebrow: 'Premium coaching · 3–6 months', headline: 'The Rebuild Program' },
    lastmod: UPDATED,
    priority: 0.8,
    videos: ['recovery'],
  },
  {
    path: '/pricing/',
    title: 'Life Coaching Prices in Omaha | Plans from $149',
    description:
      'Clear life coaching prices in Omaha: plans from $149 a month, founding rate for 3 clients, no hidden fees. See what is included and book a free call.',
    nav: 'Pricing',
    og: { eyebrow: 'Pricing · Plans from $149/month', headline: 'What coaching costs, with no surprises' },
    lastmod: UPDATED,
    priority: 0.9,
  },
  {
    path: '/about/',
    title: "About Roland Nielson | Omaha Men's Life Coach",
    description:
      "Roland Nielson grew up in North Omaha, rebuilt his life starting in 2011 and is a father of four boys. Read his story and how he coaches men today.",
    nav: 'About',
    og: { eyebrow: 'About Roland', headline: 'I got tired of living the same day' },
    lastmod: UPDATED,
    priority: 0.8,
    images: [heroImg, noteImg],
    videos: ['youtube', 'recovery'],
  },
  {
    path: '/for-families/',
    title: "Help for Your Husband or Son | Omaha Men's Coach",
    description:
      'Worried about your husband or adult son? How to bring up coaching, what it can and cannot do, and how to book a free call for him in Omaha. Start here.',
    nav: 'For Families',
    og: { eyebrow: 'For wives, partners and parents', headline: 'When someone you love keeps getting stuck' },
    lastmod: UPDATED,
    priority: 0.8,
  },
  {
    path: '/omaha-life-coach/',
    title: "Life Coach in Omaha, NE | Men's Coaching Across the Metro",
    description:
      "Men's life coaching across Omaha, Bellevue, Papillion, Elkhorn and Council Bluffs. In person or by video. Book a free 20-minute call with Roland Nielson.",
    nav: 'Omaha Metro',
    og: { eyebrow: 'Life coach in Omaha, NE', headline: 'Life coaching for men across the Omaha metro' },
    lastmod: '2026-10-20',
    priority: 0.9,
  },
  {
    path: '/free-call/',
    title: "Free 20-Minute Call | Men's Life Coach in Omaha",
    description:
      "Not sure coaching is for you? Book a free, no-pressure 20-minute call with Roland Nielson, men's life coach in Omaha, and talk about what keeps happening.",
    nav: 'Free Call',
    og: { eyebrow: 'Free 20-minute call · No pressure', headline: 'Tell me what keeps happening' },
    lastmod: '2026-10-20',
    priority: 0.9,
  },
  {
    path: '/omaha-resources/',
    title: 'Omaha Resources for Men: Support, Groups & Help',
    description:
      'A plain list of Omaha resources for men and families: crisis lines, 211, AA and SMART Recovery meetings, family support and local help. Save this page.',
    nav: 'Omaha Resources',
    og: { eyebrow: 'Omaha resources', headline: 'Omaha resources worth knowing' },
    lastmod: UPDATED,
    priority: 0.6,
  },
  {
    path: '/personal-patterns-assessment/',
    title: 'Free Personal Patterns Assessment | Roland Nielson',
    description:
      'Explore your habits, communication, follow-through, and decision-making with a free 20-question self-reflection assessment from Roland Nielson.',
    nav: 'Free Assessment',
    og: { eyebrow: 'Free self-reflection tool · 5–8 minutes', headline: 'Understand Your Personal Patterns' },
    lastmod: '2026-10-20',
    priority: 0.8,
  },
  {
    path: '/faq/',
    title: "Life Coaching FAQ | Omaha Men's Life Coach",
    description:
      'Straight answers about life coaching in Omaha: cost, the free call, sessions, privacy, who it helps and what Roland does not do. Read them before you call.',
    nav: 'FAQ',
    og: { eyebrow: 'Questions men ask', headline: 'Straight answers' },
    lastmod: UPDATED,
    priority: 0.7,
  },
  {
    path: '/blog/',
    title: "Blog | Roland Nielson – Omaha Men's Life Coaching",
    description:
      'Short, honest notes for men rebuilding: bad days, being present with your kids, staying consistent and what coaching costs in Omaha. New posts monthly.',
    nav: 'Blog',
    og: { eyebrow: 'Notes from Roland', headline: 'Notes for men rebuilding' },
    lastmod: UPDATED,
    priority: 0.6,
  },
  {
    path: '/contact/',
    title: 'Contact Roland | Free Discovery Call in Omaha',
    description:
      'Call or text (402) 577-0738, send a message or book a free 20-minute discovery call with Omaha men\'s life coach Roland Nielson. Replies within 24 hours.',
    nav: 'Contact',
    og: { eyebrow: 'Contact · Free 20-minute call', headline: 'Tell me what keeps happening' },
    lastmod: UPDATED,
    priority: 0.8,
  },
  {
    path: '/privacy/',
    title: 'Privacy Policy | Roland Nielson',
    description:
      'How Roland Nielson, LLC handles what you share through this website, the contact form and coaching sessions. Plain language, no selling of your data.',
    nav: 'Privacy',
    og: { eyebrow: 'Legal', headline: 'Privacy policy' },
    lastmod: UPDATED,
    priority: 0.2,
  },
  {
    path: '/terms/',
    title: 'Terms & Coaching Disclaimer | Roland Nielson',
    description:
      'Website terms and the coaching disclaimer for Roland Nielson, LLC. What coaching is, what it is not, payments, scheduling and your responsibilities.',
    nav: 'Terms',
    og: { eyebrow: 'Legal', headline: 'Terms and coaching disclaimer' },
    lastmod: UPDATED,
    priority: 0.2,
  },
  {
    path: '/thank-you/',
    title: 'Thank You | Roland Nielson',
    description:
      'Thanks for reaching out to Roland Nielson. He replies within 24 hours, usually the same evening. Book your free 20-minute discovery call on this page.',
    og: { eyebrow: 'Message received', headline: 'Thanks. I got your message.' },
    lastmod: UPDATED,
    noindex: true,
  },
  {
    path: '/review/',
    title: 'Leave a Review | Roland Nielson',
    description:
      'Thank you for taking a minute to leave an honest Google review for Roland Nielson – Omaha Men\'s Life Coaching. It helps other men in Omaha find help.',
    og: { eyebrow: 'Reviews', headline: 'Leave an honest review' },
    lastmod: UPDATED,
    noindex: true,
  },
  {
    path: '/404/',
    title: 'Page Not Found | Roland Nielson',
    description:
      'That page is not here. Head back to the home page, read about coaching for men in Omaha or book a free 20-minute discovery call with Roland Nielson.',
    og: { eyebrow: '404', headline: 'That page is not here' },
    lastmod: UPDATED,
    noindex: true,
  },
];

export const page = (path: string) => {
  const p = pages.find((x) => x.path === path);
  if (!p) throw new Error(`No page meta for ${path}`);
  return p;
};

export const ogSlug = (path: string) => (path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/\//g, '-'));
