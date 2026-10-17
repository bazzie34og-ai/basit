// FAQ copy. Rendered visibly and as FAQPage schema from the same objects, so they always match.
// Answers only state facts from config or the brief. Anything unconfirmed stays vague on purpose.
import { business, expectations } from '../config/site.ts';

export type Faq = { q: string; a: string };

export const homeFaqs: Faq[] = [
  {
    q: 'Do you really come to me?',
    a: "Yes. LM Auto Care is a mobile valeting service, so we come to your home, your work or wherever the car's parked in Aberdeen and the surrounding areas. There's a drop-off option too if that suits you better.",
  },
  {
    q: 'What do you need from me on the day?',
    a: `${expectations.waterPowerPlain} An outside tap and a socket we can run a cable to is ideal. Leave the keys handy and that's it.`,
  },
  {
    q: 'How much is a valet?',
    a: 'From £10 for a Basic Exterior Wash up to £85 for the Full Works, our full valet. The Basic Clean, our mini valet, is £30. Bigger vehicles have a fixed size supplement of £5, £10 or £15, and you see it before you book.',
  },
  {
    q: 'Will the price change when you see the car?',
    a: 'The prices on this site are the prices. Pick the service and the size in the calculator and that total is what you pay. If you add an extra like pet hair removal, it is added at the listed price.',
  },
  {
    q: 'When can you come?',
    a: `${expectations.times.weekdays}. ${expectations.times.weekends}. Tell us what suits when you book and we'll confirm a time on WhatsApp.`,
  },
  {
    q: "What's the difference between a mini valet and a full valet?",
    a: 'Our Basic Clean (mini valet, £30) is a quick wash outside, a hoover and a wipe-down inside, good for keeping on top of things. The Full Works (full valet, £85) adds pre-wash, snow foam, wax spray protection, seats and carpets cleaned, door cards, the centre console and a final quality check.',
  },
  {
    q: 'Can you get dog hair out?',
    a: 'Yes. Pet Hair Removal is a £10 extra on any service and covers the seats, carpets and boot. It pairs well with the Interior Valet.',
  },
  {
    q: 'How do I book?',
    a: `Message us on WhatsApp on ${business.phoneDisplay} with the car, the service and your postcode, or use the booking form on this site. We'll reply on WhatsApp to confirm a time.`,
  },
];
