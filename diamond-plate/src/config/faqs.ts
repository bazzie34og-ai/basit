/**
 * FAQ bank. Answers are HTML strings; the FAQPage schema uses the same text
 * with tags stripped, so visible and structured answers always match.
 * Facts only from site.ts and Diamond Plate's own FAQ.
 */
import { business, csiro, hours, money, priceFrom, priceTo, processInfo, warranty, warrantyYears } from './site';
import type { QA } from '../lib/schema';

export const faqs = {
  worth: {
    q: 'Is ceramic coating worth it in Brisbane?',
    a: `<p>For most new and near-new cars, yes. Brisbane paint copes with strong UV, summer storms, bird and bat droppings, tree sap and, near the bay, salt air. A ceramic coating adds a protective, hydrophobic layer, so those contaminants wash off more easily and the gloss lasts. With fixed prices from ${money(priceFrom)} and a ${warrantyYears}-year warranty, the cost works out to a small amount per year of ownership. Read <a href="/guides/is-ceramic-coating-worth-it-queensland/">is ceramic coating worth it in Queensland</a> for the full picture.</p>`,
  },
  cost: {
    q: 'How much does ceramic coating cost in Brisbane?',
    a: `<p>Our prices are fixed and published: ${money(priceFrom)} for a single layer of Graphene Ceramic 9H+, up to ${money(priceTo)} for two layers plus full interior and wheel protection. Large 4WDs, vans and vehicles needing extra prep may vary, and we’ll confirm before we start. See <a href="/ceramic-coating-prices/">all ceramic coating prices</a>.</p>`,
  },
  last: {
    q: 'How long does ceramic coating last?',
    a: `<p>Diamond Plate coatings carry a ${warrantyYears}-year national warranty with no annual inspections, no reapplication and no capped warranty payments. How good it looks over those years depends on aftercare: regular hand washes with a pH-neutral shampoo and getting droppings off quickly.</p>`,
  },
  scratches: {
    q: 'Does ceramic coating remove or prevent scratches?',
    a: '<p>No. A coating doesn’t remove existing scratches or swirl marks, and no coating can prevent swirls or wash marks. It helps the paint resist light marks and makes it much easier to clean, which means less scrubbing. Any marks already in the paint will still be there under the coating, so tell us about them when you book.</p>',
  },
  mobile: {
    q: 'Do you come to me?',
    a: `<p>Yes. We’re a mobile service. A trained applicator comes to your home or workplace across Brisbane, Logan and the Redlands. Our Brisbane base is in Murarrie. We’ll talk through the spot where the car will be when we book. See <a href="/mobile-ceramic-coating/">how mobile ceramic coating works</a>.</p>`,
  },
  duration: {
    q: 'How long does the job take?',
    a: `<p>It depends on the car and the package, and we’ll give you a time when we book. The coating itself is touch-dry in about ${processInfo.touchDryMinutes} minutes.</p>`,
  },
  wash: {
    q: 'When can I wash my car after ceramic coating?',
    a: `<p>Don’t wash it for ${processInfo.noWashDays} days. After that, hand wash fortnightly or weekly with a pH-neutral shampoo, use a bug and tar remover when needed, and use town water rather than bore or rain water where you can. The <a href="/guides/ceramic-coating-aftercare/">aftercare guide</a> covers the first ${processInfo.noWashDays} days and beyond.</p>`,
  },
  carwash: {
    q: 'Can I take a ceramic coated car through an automatic car wash?',
    a: '<p>The chemicals in a car wash won’t harm the coating, but brush washes cause swirl marks, so a hand wash is best. More in <a href="/guides/automatic-car-wash-after-ceramic-coating/">car washes after ceramic coating</a>.</p>',
  },
  transfer: {
    q: 'Is the warranty transferable if I sell the car?',
    a: `<p>No. ${warranty.transferNote}</p>`,
  },
  inspections: {
    q: 'Do I need annual inspections or reapplication to keep the warranty?',
    a: `<p>No. The ${warrantyYears}-year national warranty has no annual inspections, no reapplication and no capped warranty payments. See <a href="/warranty/">the warranty, explained</a>.</p>`,
  },
  csiro: {
    q: 'What did CSIRO test?',
    a: `<p>${csiro.full} That’s chemical resistance only. CSIRO didn’t test scratch or UV performance, and it doesn’t certify or approve products.</p>`,
  },
  graphene: {
    q: 'What’s the difference between graphene and ceramic coating?',
    a: '<p>Graphene Ceramic 9H+ is a ceramic coating infused with graphene, a single layer of carbon atoms in a hexagonal lattice. It’s Diamond Plate’s main product. A standard Ceramic 9H also exists. Both were tested by CSIRO for chemical resistance. See <a href="/guides/graphene-vs-ceramic-coating/">graphene vs ceramic coating</a>.</p>',
  },
  insurance: {
    q: 'What happens if the car is in an accident?',
    // TODO-CONFIRM insurer recognition with the owner.
    a: `<p>${warranty.insuranceNote}</p>`,
  },
  water: {
    q: 'Does the water I wash with matter?',
    a: '<p>Yes, a little. Town water is better than bore or rain water, which can leave mineral spots.</p>',
  },
  dealer: {
    q: 'The dealer offered paint protection. Is this different?',
    a: '<p>It can be. Ask the dealer which product it is, who applies it, what the warranty conditions are, whether annual inspections are needed and whether reapplication is required. Our guide to <a href="/guides/ceramic-coating-vs-dealer-paint-protection/">ceramic coating vs dealer paint protection</a> lists the questions to ask.</p>',
  },
  newcar: {
    q: 'When should I coat a new car?',
    a: '<p>As early as you can, ideally in the first weeks, before the sun, droppings and sap have had time to mark the paint. We clean, decontaminate and clay the paint first, because new cars can arrive with contamination on the paint.</p>',
  },
  hours: {
    q: 'When can I reach you?',
    a: `<p>${hours.display}. ${hours.weekendNote} Call ${business.phone.display} or send the quote form any time.</p>`,
  },
} satisfies Record<string, QA>;

export type FaqKey = keyof typeof faqs;
export const pick = (...keys: FaqKey[]): QA[] => keys.map((k) => faqs[k]);
