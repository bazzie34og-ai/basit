// Title (≤ 60 chars) and meta description (≤ 155 chars) for every fixed page.
// Guides and area pages carry theirs in frontmatter. tests/meta.test.mjs checks the lengths.

export interface PageMeta { title: string; description: string; }

export const pages: Record<string, PageMeta> = {
  '/': {
    title: 'Mobile Car Valeting Aberdeen | LM Auto Care',
    description: 'Mobile car valeting across Aberdeen. We come to your home or work. Fixed prices from £10, mini valet £30, full valet £85. Book on WhatsApp.',
  },
  '/prices/': {
    title: 'Car Valeting Prices Aberdeen, from £10 | LM Auto Care',
    description: 'Every valet price in one place: £10 wash to £85 full valet, size supplements and extras. Price your car in the calculator. No surprises at the door.',
  },
  '/full-valet-aberdeen/': {
    title: 'Full Valet Aberdeen: The Full Works, £85 | LM Auto Care',
    description: 'Our full valet, the Full Works: snow foam, hand wash, wax, seats and carpets, door cards, final quality check. £85, done at your door in Aberdeen.',
  },
  '/mini-valet-aberdeen/': {
    title: 'Mini Valet Aberdeen: Basic Clean, £30 | LM Auto Care',
    description: 'A mini valet at your door in Aberdeen. Our Basic Clean: wash, wheels, hoover, dash wiped, windows. £30, plus a fixed supplement for bigger cars.',
  },
  '/interior-valet-aberdeen/': {
    title: 'Interior Valet Aberdeen, £35 at Your Door | LM Auto Care',
    description: 'Interior car cleaning in Aberdeen: full hoover, seats and carpets cleaned, dash, door cards, console and inside windows. £35, we come to you.',
  },
  '/exterior-valet-aberdeen/': {
    title: 'Exterior Valet Aberdeen: Snow Foam Hand Wash | LM Auto Care',
    description: 'Exterior valet in Aberdeen: pre-wash, snow foam, hand wash, microfibre dry, wax spray, tyres dressed. £35 at your door. No brushes, no queue.',
  },
  '/mobile-car-wash-aberdeen/': {
    title: 'Mobile Car Wash Aberdeen, from £10 | LM Auto Care',
    description: 'A hand car wash at your house or work in Aberdeen. From £10. No queue, no drive-through, no waiting room. Water and power needed on site.',
  },
  '/pet-hair-removal-aberdeen/': {
    title: 'Dog Hair Removal From Cars, Aberdeen | LM Auto Care',
    description: 'Dog hair out of seats, carpets and the boot. Pet hair removal is £10 on any valet in Aberdeen. Beach walks, muddy paws, we come to you.',
  },
  '/headlight-restoration-aberdeen/': {
    title: 'Headlight Restoration Aberdeen, £25 | LM Auto Care',
    description: 'Cloudy, yellow headlights? Headlight restoration in Aberdeen for £25: removes haze, restores a clearer finish. Add it to any valet at your door.',
  },
  '/valet-before-selling-or-lease-return/': {
    title: 'End of Lease & Pre-Sale Valet, Aberdeen | LM Auto Care',
    description: 'Valet before selling your car or handing back a lease in Aberdeen. Thorough Clean £60 or the Full Works £85, done at your door before the deadline.',
  },
  '/offshore-workers/': {
    title: 'Car Valet for Offshore Workers, Aberdeen | LM Auto Care',
    description: "Home from offshore to a clean car. We valet it while you're away or the week you're back. Aberdeen mobile valeting, booked on WhatsApp.",
  },
  '/areas/': {
    title: 'Mobile Valeting Aberdeenshire & City Areas | LM Auto Care',
    description: 'Where we valet: Aberdeen city, Bridge of Don and Dyce, the West End and Deeside, Cove and Portlethen, and Aberdeenshire towns. Valeting near you.',
  },
  '/the-lm-way/': {
    title: 'The LM Way: About LM Auto Care, Aberdeen',
    description: 'About LM Auto Care: a small, fully trained mobile valeting team in Aberdeen. How we work, what we ask of you, and the job sheet every Full Works follows.',
  },
  '/reviews/': {
    title: 'LM Auto Care Reviews | Mobile Valeting Aberdeen',
    description: 'LM Auto Care reviews: 100% recommend on Facebook. Read what customers say in their own words, and leave a review after your valet.',
  },
  '/faq/': {
    title: 'Car Valeting Questions, Answered | LM Auto Care Aberdeen',
    description: 'How mobile valeting works in Aberdeen: water and power, prices, sizes, timings, drop-off, pet hair and what to do before we arrive.',
  },
  '/book/': {
    title: 'Book a Car Valet in Aberdeen | LM Auto Care',
    description: 'Book a car valet in Aberdeen in six short steps. See your price as you go, add photos if you like, or send it all on WhatsApp instead.',
  },
  '/guides/': {
    title: 'Car Care Notes From an Aberdeen Valeter | LM Auto Care',
    description: 'Plain advice from a mobile valeter in Aberdeen: mini vs full valet, why washes scratch, road salt, dog hair, and getting a car ready to sell.',
  },
  '/thank-you/': {
    title: "Thanks, We've Got Your Booking | LM Auto Care",
    description: "Your booking request has reached LM Auto Care. Here's what happens next.",
  },
  '/privacy/': {
    title: 'Privacy | LM Auto Care',
    description: 'What LM Auto Care does with the details you send through the booking form, and how to ask us to delete them.',
  },
  '/404/': {
    title: 'Page Not Found | LM Auto Care',
    description: "That page doesn't exist. Here's how to get a price for a valet in Aberdeen instead.",
  },
};

export const meta = (path: string): PageMeta => {
  const m = pages[path];
  if (!m) throw new Error(`No meta for ${path}`);
  return m;
};
