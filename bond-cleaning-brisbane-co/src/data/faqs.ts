/**
 * FAQ bank: 33 questions from the kit (A–E) + 22 worries about bond cleaners (F).
 * Answers start with the answer. RTA sources linked where the rule comes from.
 * `flag` = only shown while that promise flag is on (see src/config/site.ts).
 */
export interface Faq {
  id: string;
  q: string;
  a: string;
  flag?: string;
}

const RTA_CLEAN = 'https://www.rta.qld.gov.au/ending-a-tenancy/vacating-a-property/cleaning';
const RTA_CARPET = 'https://www.rta.qld.gov.au/ending-a-tenancy/vacating-a-property/carpet-cleaning-and-pest-control';
const RTA_END = 'https://www.rta.qld.gov.au/ending-a-tenancy';
const rta = (href: string, label = 'RTA') => `<a href="${href}" rel="noopener" target="_blank">${label}</a>`;

export const faqGroups = [
  { key: 'A', title: 'Rules and rights in Queensland', anchor: 'qld-rules' },
  { key: 'B', title: 'Price and booking', anchor: 'price-and-booking' },
  { key: 'C', title: 'Guarantee and trust', anchor: 'guarantee-and-trust' },
  { key: 'D', title: "What's included", anchor: 'whats-included' },
  { key: 'E', title: 'Situations', anchor: 'situations' },
  { key: 'F', title: 'Worries about bond cleaners (and what we do about them)', anchor: 'worries' },
];

export const faqs: Record<string, Faq> = {
  // A. Rules and rights in Queensland
  A1: {
    id: 'A1',
    q: 'Do I have to hire a professional bond cleaner in Queensland?',
    a: `No. The ${rta(RTA_CLEAN)} says you can clean the property yourself or hire someone. What matters is that it's left in the same condition as at the start of the tenancy, apart from fair wear and tear.`,
  },
  A2: {
    id: 'A2',
    q: 'Do I have to steam clean the carpets when I move out?',
    a: `Only to the standard they were in when you moved in. If the carpets were professionally cleaned at the start, or you agreed to a professional clean because you had a pet, the agent can ask for it. Source: ${rta(RTA_CARPET, 'RTA: carpet cleaning and pest control')}.`,
  },
  A3: {
    id: 'A3',
    q: 'Can my agent make me use their cleaner?',
    a: `No. A landlord or agent can't require you to use a particular carpet cleaning or pest control company, or charge a set fee for it. Source: ${rta(RTA_CARPET)}.`,
  },
  A4: {
    id: 'A4',
    q: 'Do I need pest control at the end of my lease?',
    a: `Only if pests came from your tenancy, or if pest control was done at the start and you agreed to it (often when you have pets). Source: ${rta(RTA_CARPET)}.`,
  },
  A5: {
    id: 'A5',
    q: 'What does "fair wear and tear" cover?',
    a: `Normal ageing from everyday use, like faded paint or worn carpet in walkways. It doesn't cover dirt, grime, grease or damage that happened during the tenancy. Source: ${rta(RTA_CLEAN)}.`,
  },
  A6: {
    id: 'A6',
    q: 'What does the agent check at the final inspection?',
    a: `They compare the property with the entry condition report using the exit condition report (Form 14a). The items most often flagged are window tracks, skirting boards, ceiling fans, light fittings, air-con vents, inside cupboards, the oven and the rangehood. Source: ${rta(RTA_CLEAN)}. Our <a href="/bond-cleaning-checklist/">bond cleaning checklist</a> follows the same list.`,
  },
  A7: {
    id: 'A7',
    q: 'How fast do I get my bond back?',
    a: `If you and the landlord agree on the refund, the RTA can pay it quickly. If one side doesn't respond or disagrees, the claim goes through the RTA's notice and dispute process, which takes longer. Check the current timeframes in the ${rta(RTA_END, "RTA's ending a tenancy section")}.`,
  },
  A8: {
    id: 'A8',
    q: 'What if the agent claims part of my bond for cleaning?',
    a: `Ask for their evidence, compare it with your own photos, and use the RTA's free dispute resolution if you disagree. For bonds lodged after 30 September 2024, the agent must provide supporting evidence within 14 days of making a claim. Our dated photo report is your evidence. See the ${rta(RTA_END)} for the steps.`,
  },

  // B. Price and booking
  B9: {
    id: 'B9',
    q: 'How much is a bond clean in Brisbane?',
    a: 'Most bond cleans in Brisbane cost between about $250 and $600 before carpets, depending on size and condition. Ours are fixed prices by bedrooms and bathrooms: {price:b1} for a 1 bed, {price:b2} for a 2 bed, {price:b3} for a 3 bed and {price:b4} for a 4 bed. See our <a href="/pricing/">bond cleaning prices</a>.',
  },
  B10: {
    id: 'B10',
    q: 'Why do some bond cleaning quotes go up on the day?',
    a: 'Usually because of hourly rates or "from" prices. We quote a fixed price from your photos, in writing, before we arrive, so the price doesn\'t change on the day.',
  },
  B11: {
    id: 'B11',
    q: 'Do I pay upfront?',
    flag: 'payAfter',
    a: '[No. You pay after the clean, once you\'ve seen the photo report.]',
  },
  B12: {
    id: 'B12',
    q: 'Is carpet steam cleaning included?',
    a: '{?freeCarpet}[Yes, free with every full bond clean], and you get the receipt the agent may ask for.{/freeCarpet}{!freeCarpet}It\'s an add-on from {price:carpetRoom} per room, and you get the receipt the agent may ask for.{/freeCarpet}',
  },
  B13: {
    id: 'B13',
    q: 'Do you charge more on weekends?',
    flag: 'noWeekendSurcharge',
    a: '[No. Same price seven days a week.]',
  },
  B14: {
    id: 'B14',
    q: 'Can you clean tomorrow?',
    flag: 'sameDay',
    a: '[Often, yes.] Next-day spots on the Northside depend on availability, so call before {cutOff}. See <a href="/urgent-bond-cleaning-brisbane/">urgent bond cleaning</a>.',
  },
  B15: {
    id: 'B15',
    q: 'How long does a bond clean take?',
    a: 'About 4 to 10 hours of cleaning time depending on size and condition. A team of two usually finishes a 2-bed unit in around half a day.',
  },

  // C. Guarantee and trust
  C16: {
    id: 'C16',
    q: "What happens if the agent isn't happy?",
    a: "Send us the agent's list. We come back {reclean} and fix anything on it that we cleaned, free, until the agent signs off. See our <a href=\"/bond-back-guarantee/\">bond back guarantee</a>.",
  },
  C17: {
    id: 'C17',
    q: 'Is your bond back guarantee real?',
    a: "Yes. It's written on your quote and invoice. It covers a free re-clean of anything we cleaned that the agent flags within {guaranteeDays} of the clean. It can't cover damage, repairs or things outside the cleaning scope.",
  },
  C18: {
    id: 'C18',
    q: "What if you don't show up?",
    a: '[You get an arrival-window SMS the day before. If a cleaner is sick we send a backup crew.]',
  },
  C19: {
    id: 'C19',
    q: 'Are you insured and police checked?',
    a: 'Yes. {insurance}{?policeChecked}, and every cleaner is [police checked]{/policeChecked}.',
  },
  C20: {
    id: 'C20',
    q: 'Do I need to be there?',
    a: 'No. Leave keys or a lockbox code. We send room-by-room photos and the invoice when we finish.',
  },
  C21: {
    id: 'C21',
    q: 'Will you give me a receipt for the agent?',
    a: 'Yes. You get a tax invoice and the photo report by email on the day, ready to forward.',
  },

  // D. What's included
  D22: {
    id: 'D22',
    q: "What's included in a bond clean?",
    a: 'Kitchen, oven, rangehood and cooktop; bathrooms and toilets; laundry; inside all cupboards and wardrobes; windows, tracks and sliding doors; blinds; ceiling fans and light fittings; exhaust fans and air-con filters; skirting boards, doors and light switches; wall spot cleaning; and all floors. See the <a href="/bond-cleaning-checklist/">full checklist</a>.',
  },
  D23: {
    id: 'D23',
    q: 'Do you clean outside windows, balconies and garages?',
    a: 'Balconies, patios and garages are add-ons. Outside windows are included where they can be reached safely from the ground or a balcony.',
  },
  D24: {
    id: 'D24',
    q: 'Can you remove mould?',
    a: "Yes, surface mould on tiles, grout, silicone and ceilings. Mould caused by leaks or building faults is a maintenance issue for the owner. Brisbane's humidity makes bathroom mould common, so we treat it as standard.",
  },
  D25: {
    id: 'D25',
    q: 'Do I have to empty the house first?',
    a: 'For a full bond clean, yes. Everything should be out so we can clean inside cupboards and under where furniture stood. For furnished rentals, book our <a href="/furnished-property-bond-cleaning-brisbane/">furnished property clean</a>.',
  },
  D26: {
    id: 'D26',
    q: 'Do I need the power and water on?',
    a: 'Yes, both need to be connected on the day.',
  },
  D27: {
    id: 'D27',
    q: 'I have pets. What extra do I need?',
    a: 'Usually a professional carpet steam clean and, if your lease says so, flea treatment. Our <a href="/pet-owner-bond-cleaning-brisbane/">pet owner bond clean</a> covers both, with flea treatment by a licensed pest control partner.',
  },
  D28: {
    id: 'D28',
    q: 'Do you clean Queenslanders and big houses?',
    a: 'Yes. Timber floors, VJ walls, louvres, verandahs, high ceilings and lots of fans are normal for us. See <a href="/house-bond-cleaning-brisbane/">house bond cleaning</a>.',
  },

  // E. Situations
  E29: {
    id: 'E29',
    q: 'I failed my inspection with another cleaner. Can you help?',
    a: 'Yes. Send the agent\'s list and photos and we\'ll quote a fixed price for those items. We can often fix them the same or next day. See our <a href="/failed-inspection-reclean-brisbane/">failed inspection rescue clean</a>.',
  },
  E30: {
    id: 'E30',
    q: "I've already moved interstate. Can you still do it?",
    a: 'Yes. We can collect keys, deal with your agent about access, and email you the photos and invoice.',
  },
  E31: {
    id: 'E31',
    q: "We're in a share house. Can we split the bill?",
    flag: 'splitPayment',
    a: '[Yes. We can send separate payment links to each housemate.]',
  },
  E32: {
    id: 'E32',
    q: "I'm a property manager. Can you handle our turnovers?",
    a: 'Yes. Priority booking, one contact person, a photo report on every job{?monthlyInvoicing} and [monthly invoicing]{/monthlyInvoicing}. See <a href="/property-manager-cleaning-brisbane/">real estate cleaning for property managers</a>.',
  },
  E33: {
    id: 'E33',
    q: 'Do you do move-in or pre-sale cleans?',
    a: 'Yes, with the same team and the same checklist. See <a href="/move-in-cleaning-brisbane/">move-in cleaning</a> and <a href="/pre-sale-cleaning-brisbane/">pre-sale cleaning</a>.',
  },

  // F. Worries about bond cleaners
  F1: {
    id: 'F1',
    q: 'Will you add extra charges on the day?',
    a: "No. Your price is fixed from your photos. If we find something that wasn't visible, we show you and agree it in writing before doing it. You can say no.",
  },
  F2: {
    id: 'F2',
    q: 'Do I have to pay extra for the bond back guarantee?',
    a: 'No. It comes with every bond clean. We never use the guarantee to sell add-ons.',
  },
  F3: {
    id: 'F3',
    q: "What if the agent's list comes back after you've cleaned?",
    a: 'Send it to us. We return {reclean} and fix anything we cleaned, free.',
  },
  F4: {
    id: 'F4',
    q: 'Do you take a deposit?',
    flag: 'payAfter',
    a: "[No. You pay after the clean, once you've seen the photos.]",
  },
  F5: {
    id: 'F5',
    q: "What happens if you can't make my booking?",
    a: "We tell you as early as possible and send a backup crew. If we truly can't, you'll know in time to make other plans.",
  },
  F6: {
    id: 'F6',
    q: 'Is there a cancellation fee?',
    flag: 'freeCancellationHours',
    a: 'Cancellation is free {cancel} your booking. [Confirm policy.]',
  },
  F7: {
    id: 'F7',
    q: 'Will you clean the skirting boards, light switches and window sills?',
    a: "Yes, every one. They're on our checklist and in your photo report.",
  },
  F8: {
    id: 'F8',
    q: 'Do you clean inside cupboards and under the sink?',
    a: 'Yes, inside every cupboard, drawer, wardrobe and the cupboard under the sink.',
  },
  F9: {
    id: 'F9',
    q: 'Do you clean under and behind appliances?',
    a: 'Yes, where the fridge and washing machine spaces are empty or appliances can be moved safely.',
  },
  F10: {
    id: 'F10',
    q: 'Will my oven glass be streak-free?',
    a: "That's the standard. We separate the door glass where the model allows and photograph the result.",
  },
  F11: {
    id: 'F11',
    q: 'Do you use subcontractors?',
    a: '{?ownCrews}[Our own trained crews do every clean.] {/ownCrews}Either way, you have one coordinator who answers for the job.',
  },
  F12: {
    id: 'F12',
    q: 'How long will the cleaners stay?',
    a: 'Until the checklist is complete, not a set number of hours. You get finish photos to check.',
  },
  F13: {
    id: 'F13',
    q: "What if the re-clean still doesn't satisfy the agent?",
    a: 'We come back again. The guarantee runs until the agent signs off, within {guaranteeDays} of the clean.',
  },
  F14: {
    id: 'F14',
    q: 'Will you call me to upsell?',
    a: 'No. You get one follow-up on the channel you choose.',
  },
  F15: {
    id: 'F15',
    q: "The agent says the whole unit wasn't clean. What now?",
    a: 'Ask for a written list with photos and the exit condition report. Send them to us, and use our dated photo report as your evidence.',
  },
  F16: {
    id: 'F16',
    q: "My exit condition report hasn't arrived. Is that normal?",
    a: "Ask the agent for it in writing. Keep your own photos and our photo report in the meantime; they're your record of how you left the property.",
  },
  F17: {
    id: 'F17',
    q: 'The agent recommended a cleaner. Do I have to use them?',
    a: `No. You can choose your own cleaner (${rta(RTA_CARPET)}). You're still responsible for the property matching the entry report, so choose someone who gives you proof.`,
  },
  F18: {
    id: 'F18',
    q: 'I sent the invoice to the agent and heard nothing. Should I worry?',
    a: "Keep a copy and lodge your bond refund with the RTA once you've returned the keys. If the agent disputes it, our photo report supports your case.",
  },
  F19: {
    id: 'F19',
    q: 'Will you damage anything?',
    a: "We use surface-safe products and a lock-up checklist, and we're {insurance}. If something goes wrong, we tell you straight away and fix it.",
  },
  F20: {
    id: 'F20',
    q: 'Can I see proof the clean was done?',
    a: 'Yes. Every job gets a room-by-room photo report and finish time, emailed the same day.',
  },
  F21: {
    id: 'F21',
    q: 'Will you ask me to remove a bad review?',
    a: "Never. If we get something wrong, tell us and we'll make it right.",
  },
  F22: {
    id: 'F22',
    q: "What's not included?",
    a: "Repairs, painting, rubbish removal (unless booked), building-related mould and windows that can't be reached safely. We list exclusions on your quote.",
  },
};

export const byGroup = (key: string) => Object.values(faqs).filter((f) => f.id.startsWith(key));
export const pick = (...ids: string[]): Faq[] => ids.map((id) => faqs[id]).filter(Boolean);
