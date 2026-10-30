import type { ServiceContent } from '../../lib/types';
import { pick } from '../../data/faqs';
import { ticks, callout, rta, RTA_END, RTA_CLEAN } from '../shared';

export const coreB: ServiceContent[] = [
  // ---------------------------------------------------------------------------
  // Tier 2 (ready to book) · Furnished property bond cleaning
  {
    slug: 'furnished-property-bond-cleaning-brisbane',
    tier: 2,
    short: 'The property and the landlord’s furniture',
    icon: 'sofa',
    intro: `<p>Leaving a furnished rental means cleaning around, under and inside the landlord's furniture as well as the property itself. We clean furnished apartments and houses to the inventory and condition report, including mattresses and upholstery when the lease asks for it.</p>
<p>Our furnished bond cleaning in Brisbane suits tenants leaving furnished units, corporate lets and short-stay homes on the Northside. Fixed prices start at {price:b1} plus a furnished allowance, quoted within {replyTime} from your photos.</p>`,
    heroPhoto: 'carpet',
    heroAlt: 'Furnished bond cleaning Brisbane result: bedroom carpet before and after steam cleaning during a Brisbane bond clean',
    photos: ['carpet', 'cupboard', 'oven'],
    problem: {
      h2: 'Furniture makes the inspection longer',
      quotes: ['"The inventory listed every cushion and the agent checked under the bed."'],
      paras: [
        "In a furnished rental the agent inspects two things: the property and the inventory. That means drawers, bed bases, the sofa, the dining chairs and every appliance on the list. A standard bond clean that only does the empty-house items will miss half of it.",
        "Most tenants also aren't sure whether the mattress or sofa needs a professional clean. Usually the answer is in the lease or the inventory, and we'll read it with you before we quote.",
      ],
    },
    included: {
      h2: 'Furnished rental cleaning checklist',
      intro: 'We work from your inventory. Bring it to the quote, or forward the agent\'s copy.',
      groups: [
        { h3: 'Around, under and inside furniture', items: ['Inside every drawer, bedside and TV unit', 'Under beds and sofas, light furniture moved to clean beneath', 'Bed bases, headboards and frames wiped'] },
        { h3: 'Soft furnishings', items: ['Sofa and chairs vacuumed, crumbs and hair removed', 'Cushions, throws and curtains checked against the inventory'] },
        { h3: 'Appliances on the inventory', items: ['Microwave, toaster, kettle and coffee machine', 'Fridge and freezer inside, seals and shelves', 'Washing machine drum and drawer, dryer filter'] },
        { h3: 'The property itself', items: ['Kitchen, oven and rangehood', 'Bathrooms, windows, tracks, fans and skirting'] },
      ],
    },
    sections: [
      {
        id: 'inventory',
        eyebrow: 'The inventory',
        h2: 'A furnished apartment end of lease clean, item by item',
        html: `<p>The inventory is your second condition report. If it lists a "grey three-seater fabric sofa, clean", the agent expects it back that way. We go through the inventory line by line while we clean and note anything that was already marked, so your photo report covers the furniture too.</p>${callout('Check whether your inventory says items were professionally cleaned at the start. If it does, the agent can usually ask for the same at the end.')}`,
        bg: 'bg',
      },
      {
        id: 'addons',
        eyebrow: 'Add-ons',
        h2: 'Mattress and upholstery cleaning, when the lease asks for it',
        html: `<p>We can steam clean mattresses and fabric or leather upholstery on the same visit, so you have one booking and one invoice. Both are priced up front.</p>${ticks(['<a href="/mattress-cleaning-brisbane/">Mattress cleaning</a>: steam cleaned, deodorised, dry the same day', '<a href="/upholstery-cleaning-brisbane/">Upholstery and sofa cleaning</a>: fabric and leather, spot tested first', 'Curtains and blinds checked and dusted'])}`,
      },
    ],
    price: {
      h2: 'Furnished bond cleaning prices',
      html: "<p>A furnished clean takes a little longer than an empty-house clean because there's more to clean. We price it from your photos and the inventory: the bond clean for your bedrooms and bathrooms, plus a furnished allowance of {price:furnished}. Mattresses ({price:mattress} each) and sofas ({price:sofaSeat} a seat) are listed separately.</p>",
    },
    faqs: [
      { id: 'fu1', q: "What's different about a furnished bond clean?", a: 'We clean the property plus the landlord\'s furniture: inside drawers, under beds and sofas, and appliances on the inventory.' },
      { id: 'fu2', q: 'Do I need mattresses cleaned?', a: "Only if the lease or inventory says so, or they've been stained. We can steam clean them as an add-on." },
      { id: 'fu3', q: 'Do you move heavy furniture?', a: 'We move light furniture to clean under it. Heavy items are cleaned around unless arranged.' },
      { id: 'fu4', q: 'Can you clean sofas too?', a: 'Yes, fabric and leather upholstery cleaning is available as an add-on.' },
      { id: 'fu5', q: 'Is a furnished clean more expensive?', a: "Slightly, because there's more to clean. You get a fixed price from photos." },
      ...pick('C20'),
    ],
    related: ['mattress-cleaning-brisbane', 'upholstery-cleaning-brisbane', 'carpet-steam-cleaning-brisbane', 'bond-back-guarantee'],
    cta: { h2: 'Hand back the furniture as clean as the floors.', p: 'Send the inventory and a few photos for a fixed price.' },
    areasIntro: 'Furnished units and houses across these 20 Northside suburbs.',
  },

  // ---------------------------------------------------------------------------
  // Tier 5 (B2B) · Rental cleaning for property managers
  {
    slug: 'property-manager-cleaning-brisbane',
    tier: 5,
    short: 'Turnovers for agencies and landlords',
    icon: 'handshake',
    intro: `<p>Property managers need turnovers done on time, to the checklist, with proof. We give agencies priority booking, one contact person, photo reports on every job{?monthlyInvoicing} and [monthly invoicing]{/monthlyInvoicing}.</p>
<p>Our real estate cleaning in Brisbane covers vacate cleans, pre-lease cleans and re-cleans for agencies and private landlords across the Northside and inner north. Turnaround is usually {turnaround} of keys, at fixed rates from {price:b1}.</p>`,
    heroPhoto: 'oven',
    heroAlt: 'Real estate cleaning Brisbane result: oven door glass before and after a bond clean in Brisbane, baked-on grease removed',
    photos: ['oven', 'fan', 'laundry'],
    problem: {
      h2: 'What slows a turnover down',
      quotes: ['"The tenant\'s cleaner didn\'t come back and I had a new tenant moving in Monday."', '"I spend more time chasing cleaners than leasing."'],
      paras: [
        "Every vacancy day costs the owner rent. When a cleaner runs late, leaves the oven half done or won't return for the re-clean, the property manager is the one taking the owner's call and rebooking trades.",
        "Disputes cost time too. Without photos, a cleaning claim becomes a back-and-forth between tenant, owner and the RTA. A dated, room-by-room report on every job settles most of them before they start.",
      ],
    },
    included: {
      h2: 'Rental property cleaning for agencies',
      groups: [
        { h3: 'Vacate and exit cleans', items: ['Cleaned to your agency checklist and the Form 14a', 'Photo report sent to you and the tenant'] },
        { h3: 'Pre-lease and re-let cleans', items: ['Between tenants, ready for photos and the entry report', 'Carpets, windows and outdoor add-ons in one booking'] },
        { h3: 'Re-cleans and touch-ups', items: ['Items from your exit inspection fixed fast', 'Before-and-after photos of each item'] },
        { h3: 'Owner-occupier and sale handovers', items: ['Pre-sale and settlement cleans', 'Landlord moving back in'] },
      ],
    },
    sections: [
      {
        id: 'partner',
        eyebrow: 'Partner agencies',
        h2: 'Real estate cleaning service built for property managers',
        html: `${ticks(['<strong>Priority slots</strong> at the end of the month, when every lease seems to end at once', '<strong>One named coordinator</strong> for your agency, by phone or email', '<strong>A photo report on every job</strong>, sent to you and the tenant', '{?monthlyInvoicing}<strong>[Monthly invoicing]</strong> for owner-paid work{/monthlyInvoicing}', '<strong>Your checklist is the standard.</strong> Send it once and we use it on every job'])}`,
        component: 'partnerForm',
        bg: 'bg',
      },
      {
        id: 'turnaround',
        eyebrow: 'Turnaround',
        h2: 'Keys back, property ready to re-let',
        html: '<p>Most turnovers are cleaned within {turnaround} of key collection, so the property is ready for the next tenant\'s entry inspection. If your exit inspection finds anything, send the list and we return {reclean}. You get the same report format every time, so it slots straight into your files.</p>',
      },
      {
        id: 'tenants',
        eyebrow: 'Recommending us to tenants',
        h2: 'A recommend-to-tenants pack, without the pressure',
        html: `<p>Many agencies like to give vacating tenants a cleaner they trust. We'll send you a one-page tenant sheet with our checklist, how pricing works and the re-clean promise. We never pay for referrals and we never pressure tenants: the RTA is clear that tenants can choose any cleaner, and we say so on the sheet.</p><p>What you get from recommending us is simpler: fewer re-inspections and fewer cleaning disputes.</p>`,
        bg: 'sand',
      },
    ],
    price: {
      h2: 'Rental cleaning rates',
      html: '<p>Agency work uses the same fixed price table as our tenant bond cleans: {price:b1} for a 1-bed, {price:b2} for a 2-bed, {price:b3} for a 3-bed house. Partner agencies get priority booking rather than hidden discounts, so tenants and owners always see the same price.</p>',
    },
    faqs: [
      { id: 'pm1', q: 'Can tenants book you directly from our recommendation?', a: "Yes, and we'll treat your checklist as the standard. Tenants always remain free to choose any cleaner." },
      { id: 'pm2', q: 'How fast can you turn a property around?', a: 'Usually within {turnaround} of keys, so it\'s ready to re-let.' },
      { id: 'pm3', q: 'Do you provide photo evidence?', a: "Yes, a room-by-room photo report on every job, useful if there's a dispute." },
      { id: 'pm4', q: 'Do you offer monthly invoicing?', a: 'Yes, for partner agencies [confirm terms].', flag: 'monthlyInvoicing' },
      { id: 'pm5', q: 'Who do we contact?', a: 'One named coordinator for your agency, by phone or email.' },
    ],
    related: ['vacate-cleaning-brisbane', 'carpet-steam-cleaning-brisbane', 'failed-inspection-reclean-brisbane', 'bond-back-guarantee'],
    cta: { h2: 'Fewer vacancy days. No chasing.', p: 'Become a partner agency, or book a single turnover today.' },
    areasIntro: 'We handle turnovers for rentals in all 20 of these suburbs.',
  },

  // ---------------------------------------------------------------------------
  // Tier 5 (B2B) · Pre-sale cleaning
  {
    slug: 'pre-sale-cleaning-brisbane',
    tier: 5,
    short: 'Ready for listing photos and settlement',
    icon: 'camera',
    intro: `<p>Buyers notice grime before they notice the floor plan. A pre-sale clean uses our bond-clean checklist to get a home ready for photos, open homes and settlement.</p>
<p>We do pre sale house cleaning in Brisbane for sellers, agents and investors on the Northside. Fixed prices from {price:b2} for a 2-bed, quoted within {replyTime}, booked a day or two before your listing photos.</p>`,
    heroPhoto: 'oven',
    heroAlt: 'Pre sale house cleaning Brisbane result: oven door glass before and after, baked-on grease removed',
    photos: ['oven', 'shower', 'fan'],
    problem: {
      h2: 'What buyers see in the listing photos',
      quotes: ['"The photographer was booked for Thursday and the oven hadn\'t been cleaned in years."'],
      paras: [
        "Listing photos are taken with every light on and the blinds open. That shows off a home, and every streak on the glass, dusty fan and stained grout line too. Buyers scrolling a listing make up their minds in seconds.",
        "Settlement is the other moment that matters. A clean handover avoids a last-minute argument with the buyer's agent at the pre-settlement inspection.",
      ],
    },
    included: {
      h2: 'Pre sale clean: the photo-ready checklist',
      groups: [
        { h3: 'What the camera picks up', items: ['Glass, mirrors and shower screens streak-free', 'Kitchen benchtops, splashback and appliance fronts', 'Light fittings and ceiling fans dust-free'] },
        { h3: 'What buyers open', items: ['Oven, rangehood and pantry', 'Wardrobes, vanity and linen cupboards', 'Laundry cupboards'] },
        { h3: 'Finishing touches', items: ['Skirting boards and door frames', 'Window tracks and sills', 'Floors throughout'] },
      ],
    },
    sections: [
      {
        id: 'settlement',
        eyebrow: 'Settlement',
        h2: 'Pre-settlement cleaning for a clean handover',
        html: '<p>Once the furniture is out, a pre sale property cleaning visit gets the empty home ready for the buyer\'s final inspection. It\'s the same checklist as a bond clean, timed for after the removalists. Book it with the agent so it fits the settlement date.</p>',
        bg: 'bg',
      },
      {
        id: 'outside',
        eyebrow: 'Kerb appeal',
        h2: 'Windows and outdoor add-ons',
        html: `<p>The first photo is often the front of the house. These add-ons are priced up front:</p>${ticks(['<a href="/window-cleaning-brisbane/">Window, track and blind cleaning</a> inside and out where safely reachable', '<a href="/pressure-washing-brisbane/">Pressure washing</a> of driveways, paths and patios', 'Balcony glass and alfresco areas'])}`,
      },
    ],
    price: {
      h2: 'Pre-sale home cleaning prices',
      html: "<p>Priced on the same fixed table as our bond cleans: {price:b2} for a 2-bed, {price:b3} for a 3-bed, {price:b4} for a 4-bed. Your agent can book it for you, and the invoice goes to whoever you choose.</p>",
    },
    faqs: [
      { id: 'ps1', q: 'When should I book a pre-sale clean?', a: 'A day or two before listing photos, and again before settlement if needed.' },
      { id: 'ps2', q: 'Is it the same as a bond clean?', a: 'Same checklist and team, focused on how the home looks in photos and at open homes.' },
      { id: 'ps3', q: 'Can you clean before settlement?', a: 'Yes, after the furniture is out, so the buyer gets a clean handover.' },
      { id: 'ps4', q: 'Do you clean outside windows?', a: 'Yes, where safely reachable. Ask for windows and pressure washing as add-ons.' },
      { id: 'ps5', q: 'Can my agent book it?', a: 'Yes. We work with agents directly.' },
    ],
    related: ['window-cleaning-brisbane', 'pressure-washing-brisbane', 'carpet-steam-cleaning-brisbane', 'oven-cleaning-brisbane'],
    cta: { h2: 'Photo-ready in a day.', p: 'Tell us the photo date and we\'ll book the clean the day before.' },
    areasIntro: 'Selling on the Northside? We do pre-sale cleans in all 20 suburbs.',
  },

  // ---------------------------------------------------------------------------
  // Tier 1 (emergency) · Urgent & next-day bond cleaning
  {
    slug: 'urgent-bond-cleaning-brisbane',
    tier: 1,
    short: 'Inspection tomorrow? Call us first',
    icon: 'zap',
    intro: `<p>Inspection tomorrow and the place isn't clean? Call us. When we have a crew free on the Northside we can clean {?sameDay}[the same or next day]{/sameDay}{!sameDay}at the next available slot{/sameDay}. Call before {cutOff} for the best chance.</p>
<p>Our urgent bond clean in Brisbane is a full bond clean on short notice, at a fixed price from your photos. Send photos on WhatsApp and we reply with a price within {replyTime}. {?noUrgentSurcharge}[No urgent surcharge.]{/noUrgentSurcharge}</p>`,
    heroPhoto: 'oven',
    heroAlt: 'Urgent bond clean Brisbane result: oven door glass before and after a bond clean in Brisbane, baked-on grease removed',
    photos: ['oven', 'shower'],
    problem: {
      h2: 'When the cleaner doesn\'t turn up',
      quotes: ['"They cancelled the night before. The inspection is at 9am."', '"I thought I could do it myself. I was wrong."'],
      paras: [
        "Last minute end of lease cleaning usually starts with something going wrong: a cleaner cancels, a DIY clean takes three times longer than planned, or the agent brings the inspection forward. You need an honest answer fast, not a call back tomorrow.",
        "We'll tell you straight away whether we can make it. If we can, you get a fixed price and an arrival window. If we can't, you'll know in minutes, so you can make other plans.",
      ],
    },
    included: {
      h2: 'Same day bond clean, full checklist',
      intro: "Urgent doesn't mean rushed. It's the same checklist, often with a bigger crew so it's done in time.",
      groups: [
        { h3: 'The items agents check first', items: ['Oven, rangehood and cooktop', 'Bathroom grout, glass and exhaust fans', 'Window tracks and sliding doors'] },
        { h3: 'The rest of the property', items: ['Cupboards inside, skirting, fans and light switches', 'Walls spot cleaned, floors throughout'] },
        { h3: 'Proof', items: ['Photo report and invoice the same evening'] },
      ],
    },
    sections: [
      {
        id: 'photos-now',
        eyebrow: 'Fastest route',
        h2: 'Send photos now, price in {replyTime}',
        html: `<ol><li><strong>WhatsApp us 4 to 6 photos:</strong> oven, bathroom, kitchen, carpets and anything you're worried about.</li><li><strong>Tell us the inspection time</strong> and suburb.</li><li><strong>Get a fixed price and arrival window</strong> by text, usually within {replyTime} during business hours.</li><li><strong>Reply yes</strong> and the crew is booked.</li></ol>`,
        bg: 'bg',
      },
      {
        id: 'availability',
        eyebrow: 'Honest availability',
        h2: 'Next day bond cleaning: our cut-off and how we decide',
        html: '<p>Call before {cutOff} for a next-day slot. Whether we can fit you in depends on how many crews are free and where they are on the Northside that day. The last week of the month is the hardest, because most leases end then. We never take a booking we can\'t keep: if the answer is no, we say so in the first call.</p>',
      },
      {
        id: 'no-show',
        eyebrow: 'No-show rescue',
        h2: 'Your bond cleaner didn\'t show up?',
        html: `<p>Call us now. We'll check same and next-day availability, price the clean from your photos, and if we can make it, send an arrival-window SMS so you know exactly when the crew will be there. On every job we book, if a cleaner is sick we send a backup crew. That's the promise we wish every renter had.</p>${callout("If your inspection is too soon for anyone to clean, ask the agent in writing for a short extension. Many will agree to a few hours if they know a professional clean is booked.", true)}`,
        bg: 'sand',
      },
    ],
    price: {
      h2: 'Urgent bond clean prices',
      html: '<p>Same table as every bond clean: {price:b1} for a 1-bed, {price:b2} for a 2-bed, {price:b3} for a 3-bed. {?noUrgentSurcharge}[No urgent surcharge]{/noUrgentSurcharge}{!noUrgentSurcharge}Any same-day fee is stated in your fixed price{/noUrgentSurcharge}, written in your quote before you say yes.</p>',
    },
    faqs: [
      { id: 'ur1', q: 'Can you do a bond clean today?', a: 'If a crew is free on the Northside, yes. Call before {cutOff} for the best chance.' },
      { id: 'ur2', q: "My cleaner didn't turn up. Can you help?", a: "Call us now. We'll check same or next-day availability and give you a fixed price from photos." },
      { id: 'ur3', q: 'Do you charge more for urgent bookings?', a: '{?noUrgentSurcharge}[No urgent surcharge.]{/noUrgentSurcharge}{!noUrgentSurcharge}A small same-day fee of {price:urgent}, stated in your fixed price.{/noUrgentSurcharge}' },
      { id: 'ur4', q: 'Can I send photos on WhatsApp?', a: "Yes. That's the fastest way to get a price." },
      { id: 'ur5', q: "What if you can't fit me in?", a: "We'll tell you straight away so you can make other plans." },
      ...pick('F5'),
    ],
    related: ['failed-inspection-reclean-brisbane', 'end-of-lease-cleaning-brisbane', 'oven-cleaning-brisbane', 'bond-back-guarantee'],
    cta: { h2: 'Inspection soon? Call now.', p: 'We answer {hours}. Send photos on WhatsApp for the fastest fixed price.' },
    areasIntro: 'Urgent crews work across all 20 Northside suburbs. Closer suburbs are easier to fit in at short notice.',
  },

  // ---------------------------------------------------------------------------
  // Tier 3 (evaluating) · Bond back guarantee
  {
    slug: 'bond-back-guarantee',
    tier: 3,
    short: 'The re-clean promise, in plain English',
    icon: 'shield',
    intro: `<p>If your agent flags anything we cleaned, send us their list and we come back and fix it free {reclean} of receiving it. The guarantee is written on your quote and invoice, with the conditions in plain English.</p>
<p>This is our bond back guarantee cleaning promise for every bond clean in Brisbane: no extra fee, no add-on to unlock it, and it runs until your agent signs off. Bond cleans start at {price:b1}, priced within {replyTime}.</p>`,
    heroPhoto: 'shower',
    heroAlt: 'Bond back guarantee cleaning result: shower tiles and grout before and after end of lease cleaning in Brisbane',
    photos: ['shower', 'cupboard', 'fan'],
    problem: {
      h2: 'Guarantees that disappear when you need them',
      quotes: ['"No guarantee unless I paid extra for the walls."', '"Their guarantee was three days. The inspection was day five."', '"They said they\'d come back. They never did."'],
      paras: [
        "A lot of \"bond back guarantees\" have a catch. Some only apply if you buy the carpet package. Some expire before the agent has even inspected. Some depend on the cleaner answering the phone after they've been paid.",
        "Ours is simple because it has to be. It comes with every bond clean, lasts until the agent's inspection, and is written down where you can see it.",
      ],
    },
    included: {
      h2: "What's covered: everything we cleaned",
      intro: 'If it was on your bond clean and the agent flags it, we fix it. That includes:',
      groups: [
        { h3: 'Kitchen', items: ['Oven, rangehood, cooktop and cupboards', 'Dishwasher, sink and benchtops'] },
        { h3: 'Bathrooms and laundry', items: ['Shower, grout, toilet, vanity and mirrors', 'Laundry tub and floors'] },
        { h3: 'Every room', items: ['Tracks, sills, skirting, fans and light fittings', 'Walls spot cleaned, floors'] },
        { h3: 'Add-ons you booked', items: ['Carpets, balconies, garages and anything else on your quote'] },
      ],
    },
    sections: [
      {
        id: 'how-long',
        eyebrow: 'How long it lasts',
        h2: 'Until the agent signs off',
        html: '<p>The guarantee runs until your agent\'s final inspection, as long as the inspection is within {guaranteeDays} of the clean. That covers the normal gap between handover and inspection, so it never expires before the agent walks through. If the agent sends a list, we come back {reclean}. If they flag something again after our re-clean, we come back again.</p>',
        component: 'seal',
        bg: 'sand',
      },
      {
        id: 'claim',
        eyebrow: 'How to claim',
        h2: 'Send us the list. That\'s it.',
        html: `<ol><li><strong>Forward the agent's email or list</strong> by text, WhatsApp or email, with any photos they sent.</li><li><strong>We confirm a return time</strong> {reclean}, and arrange access with you or the agent.</li><li><strong>We fix every item we cleaned</strong> and photograph each one.</li><li><strong>You send the new photos to the agent.</strong> We repeat until they sign off.</li></ol>`,
      },
      {
        id: 'not-covered',
        eyebrow: 'What is not covered',
        h2: 'The honest exclusions',
        html: `${ticks(['Damage, repairs and anything that needs a tradesperson', 'Fair wear and tear: faded paint, worn carpet, old scratches', 'Marks that won\'t come off without repainting', 'Areas you didn\'t book, like a garage that wasn\'t on your quote', 'Mould from leaks or building faults, which is the owner\'s maintenance issue', 'Anything changed after we left, like items moved back in'])}<p>Can any cleaner guarantee your full bond back? No honest one can, because your bond also covers rent, damage and things outside cleaning. We guarantee what we control: the clean, the photos and the re-clean.</p>`,
        bg: 'bg',
      },
      {
        id: 'no-upsell',
        eyebrow: 'No strings',
        h2: 'Bond back cleaning with nothing to unlock',
        html: '<p>You never have to buy an add-on to "activate" the guarantee. You never have to leave a review for it. You never have to pay a deposit to keep it. It\'s one guarantee, the same on every bond clean, worded the same on every page of this site and on your invoice.</p>',
      },
      {
        id: 'acl',
        eyebrow: 'Your consumer rights',
        h2: 'Australian Consumer Law comes first',
        html: '<p>Our re-clean guarantee is in addition to your rights under the Australian Consumer Law, not instead of them. Services must be provided with due care and skill. If we fall short, you\'re entitled to have it fixed, whatever our own terms say. Read the full <a href="/terms/">guarantee terms and conditions</a>.</p>',
        bg: 'sand',
      },
    ],
    price: {
      h2: 'What the guarantee costs',
      html: '<p>Nothing. It\'s part of every bond clean, from {price:b1} for a 1-bed unit. Compare that with "from $45" adverts that charge separately for the guarantee, the oven or the walls.</p>',
    },
    faqs: [
      { id: 'bg1', q: 'Do I have to pay extra for the guarantee?', a: 'No. It comes with every bond clean. We never make the guarantee depend on buying add-ons.' },
      { id: 'bg2', q: 'How long does the guarantee last?', a: "Until your agent's final inspection, as long as it's within {guaranteeDays} of the clean." },
      { id: 'bg3', q: 'What happens if the agent finds something?', a: 'Send us their list. We come back {reclean} and fix anything we cleaned, free.' },
      { id: 'bg4', q: "What isn't covered?", a: "Damage, fair wear and tear, marks that won't come off without repainting, and areas you didn't book." },
      { id: 'bg5', q: "Can you guarantee I'll get my full bond back?", a: 'No honest cleaner can, because the bond also covers rent and damage. We guarantee the clean, the photos and the re-clean.' },
      ...pick('F13', 'F2'),
    ],
    related: ['carpet-steam-cleaning-brisbane', 'oven-cleaning-brisbane', 'window-cleaning-brisbane', 'failed-inspection-reclean-brisbane'],
    cta: { h2: 'A guarantee worth having.', p: 'Get a fixed price with the re-clean promise written on it.' },
    areasIntro: 'The same guarantee applies in every suburb we clean.',
  },

  // ---------------------------------------------------------------------------
  // Tier 1 (emergency) · Failed inspection rescue clean
  {
    slug: 'failed-inspection-reclean-brisbane',
    tier: 1,
    short: 'Send the agent’s list, we fix it fast',
    icon: 'alert',
    intro: `<p>Failed your inspection after a DIY clean or another company? Send us the agent's list and photos. We quote a fixed price for the items on the list and can often fix them the same or next day.</p>
<p>Our bond re-clean in Brisbane is a rescue service for tenants with an agent's list and a deadline. Most list-only re-cleans cost far less than a full clean; you get the fixed price within {replyTime} of sending the list.</p>`,
    heroPhoto: 'cupboard',
    heroAlt: 'Bond re-clean Brisbane result: stained under-sink cupboard before and after end of lease cleaning in Brisbane',
    photos: ['cupboard', 'oven', 'fan'],
    problem: {
      h2: 'You failed the inspection. Now what?',
      quotes: ['"The agent sent a list of 14 things and gave me until Friday."', '"The company that did it won\'t answer my calls."'],
      paras: [
        "An agent's list after a failed bond inspection is stressful, but it's also useful: it tells you exactly what stands between you and your bond. Most lists are the same few things: oven glass, rangehood filters, window tracks, skirting, exhaust fans and grout.",
        "The worst move is waiting. If the items aren't fixed by the agent's deadline, they can book their own cleaner and claim the cost from your bond.",
      ],
    },
    included: {
      h2: 'Bond clean reclean: what usually needs fixing',
      groups: [
        { h3: 'The usual list', items: ['Oven door glass and racks', 'Rangehood filters', 'Window and sliding door tracks', 'Skirting boards, light switches and door frames'] },
        { h3: 'Bathrooms', items: ['Soap scum, grout and shower glass', 'Exhaust fans', 'Mould on silicone'] },
        { h3: 'Easy to miss', items: ['Inside drawers and the under-sink cupboard', 'Ceiling fans and light fittings', 'Behind the fridge and washing machine spaces'] },
      ],
    },
    sections: [
      {
        id: 'read-list',
        eyebrow: 'Step one',
        h2: "How to read the agent's list",
        html: `<p>Agent not happy with the bond clean? Ask for three things in writing: the list itself, photos of each item, and the deadline. A vague "the whole unit isn't clean" isn't something you can fix. A list of specific items is. Then compare it with your entry condition report: anything that was already like that when you moved in isn't yours to fix.</p>`,
        bg: 'bg',
      },
      {
        id: 'list-price',
        eyebrow: 'Fixed price for the list',
        h2: 'You pay for the items on the list, nothing else',
        html: "<p>We price the re-clean from the list and photos, so you only pay for the work the agent asked for. If you'd like us to go over anything else while we're there, we'll quote it separately and you decide. Every item gets a before-and-after photo you can forward straight to the agent.</p>",
      },
      {
        id: 'deadline',
        eyebrow: 'Timing',
        h2: "Beating the agent's deadline",
        html: "<p>Send the list as soon as you get it. We can often fix a failed bond inspection the same or next day, and we'll tell you up front if the deadline is too tight. If it is, ask the agent in writing for a short extension and mention the booked re-clean. Most would rather wait a day than arrange a cleaner themselves.</p>",
        bg: 'sand',
      },
      {
        id: 'still-claims',
        eyebrow: 'If they still claim',
        h2: 'Your next steps if the agent still claims part of your bond',
        html: `<p>Ask for the agent's evidence, compare it with your photos and our dated before-and-after report, and don't sign a refund form you disagree with. If you can't agree, the RTA offers free dispute resolution. For bonds lodged after 30 September 2024 the agent must provide supporting evidence for a claim within 14 days. See the ${rta(RTA_END, "RTA's ending a tenancy guide")} and the ${rta(RTA_CLEAN, 'RTA cleaning standard')}.</p>`,
      },
    ],
    price: {
      h2: 'Bond re-clean prices',
      html: '<p>Priced per list, fixed in writing. A short list (oven, tracks, a few fans) costs a fraction of a full bond clean. A long list may be close to a full clean, and if so we\'ll tell you which is better value.</p>',
    },
    faqs: [
      { id: 'fi1', q: 'I failed my inspection. What should I do first?', a: "Get the agent's list in writing with photos, ask for the deadline, then send it to us for a fixed price." },
      { id: 'fi2', q: 'Will you only clean the items on the list?', a: "Yes, unless you want more. You pay only for what's on the list." },
      { id: 'fi3', q: 'How fast can you fix it?', a: 'Often the same or next day.' },
      { id: 'fi4', q: "My original cleaner won't come back. Can they still be held to it?", a: "That's between you and them, but don't wait. Fixing it before the deadline protects your bond." },
      { id: 'fi5', q: 'What if the agent still claims part of my bond?', a: "Ask for their evidence, compare it with your photos, and use the RTA's free dispute resolution." },
      ...pick('A8', 'F15'),
    ],
    related: ['bond-back-guarantee', 'urgent-bond-cleaning-brisbane', 'oven-cleaning-brisbane', 'window-cleaning-brisbane'],
    cta: { h2: 'Send us the list now.', p: 'WhatsApp the agent\'s list and photos for a fixed price within {replyTime}.' },
    areasIntro: 'Rescue cleans across all 20 Northside and inner north suburbs.',
  },
];
