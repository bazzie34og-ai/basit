import type { ServiceContent } from '../../lib/types';
import { pick } from '../../data/faqs';
import { fourNames, ticks, callout, rta, RTA_CLEAN, RTA_CARPET } from '../shared';

export const coreA: ServiceContent[] = [
  // ---------------------------------------------------------------------------
  // Tier 2 (ready to book) · End of lease cleaning
  {
    slug: 'end-of-lease-cleaning-brisbane',
    tier: 2,
    short: 'The full clean to the exit condition report',
    icon: 'home',
    intro: `<p>End of lease cleaning and bond cleaning are the same job in Queensland: a full clean of the property before you hand back the keys. We follow the exit condition report the agent will use, clean every item on it, and come back free {reclean} if the agent flags anything.</p>
<p>We do end of lease cleaning in Brisbane for renters across the Northside and inner north, from CBD studios to four-bed houses. Most Brisbane end of lease cleans cost between about $250 and $600 before carpets. Ours is a fixed price from {price:b1}, sent in writing within {replyTime} of your photos, with a room-by-room photo report the same day.</p>`,
    heroPhoto: 'shower',
    photos: ['shower', 'oven', 'cupboard'],
    problem: {
      h2: 'The four ways an end of lease clean goes wrong',
      quotes: [
        '"The agent said the whole unit wasn\'t up to standard. No list, just a deduction."',
        '"Light switches, skirting and the window sills were all on the list."',
        '"They never sent an invoice, so I had nothing to show the agent."',
      ],
      paras: [
        "You can pay for an end of lease clean and still lose part of your bond. It usually comes down to the small things nobody photographed: a greasy rangehood filter, dust along the skirting, grime packed into the sliding door track. When there's no record of how the place was left, it's your word against the agent's.",
        "The other trap is price. A quote that looks cheap on the phone grows on the day once the cleaner \"finds\" the walls or the oven. We fix both problems the same way: a fixed price from your photos before we arrive, and a dated photo of every room when we leave.",
      ],
    },
    included: {
      h2: "What's in our end of lease cleaning Brisbane checklist",
      intro: 'Every item below is on the exit condition report your property manager walks through. We tick it, then photograph it.',
      groups: [
        { h3: 'Oven and cooktop', items: ['Oven cavity, racks and trays degreased', 'Door glass cleaned, separated where the model allows', 'Cooktop and knobs, gas burners or ceramic glass'] },
        { h3: 'Rangehood', items: ['Filters soaked and degreased', 'Canopy, light cover and fan housing wiped'] },
        { h3: 'Window tracks and sills', items: ['Tracks vacuumed, scrubbed and wiped', 'Sills, frames and sliding door tracks'] },
        { h3: 'Skirting boards and light switches', items: ['Every skirting board wiped by hand', 'Light switches, power points and door handles'] },
        { h3: 'Exhaust fans', items: ['Bathroom and laundry exhaust covers dusted and washed'] },
        { h3: 'Cupboards inside', items: ['Inside every kitchen cupboard, drawer and wardrobe', 'The cupboard under the sink'] },
        { h3: 'Shower grout and mould', items: ['Soap scum, glass screen and grout lines', "Surface mould on silicone and ceilings, common in Brisbane's humidity"] },
      ],
    },
    sections: [
      {
        id: 'four-names',
        eyebrow: 'Same job, four names',
        h2: 'End of lease, bond, vacate or exit: the same clean',
        html: `<p>People search for an end of lease clean, a bond clean, a vacate clean or an exit clean. In Queensland they're one job with one standard: the property goes back to the condition on your entry report, less fair wear and tear. Whatever your agent's email calls it, this is the clean they mean.</p>${fourNames('/end-of-lease-cleaning-brisbane/')}`,
        bg: 'bg',
      },
      {
        id: 'form-14a',
        eyebrow: 'How the inspection works',
        h2: 'What the agent compares: entry report vs exit report (Form 14a)',
        html: `<p>When you moved in you signed an entry condition report. When you leave, the property manager fills in the exit condition report (Form 14a) and compares the two, room by room. Anything dirtier than it was at the start, beyond fair wear and tear, can be claimed against your bond. The ${rta(RTA_CLEAN, 'RTA explains the standard here')}.</p>
<p>That's why we clean from the same list. Before we start, tell us anything noted on your entry report, like a stained carpet or an old mark on a wall, so we don't waste time on something that was already there. If the agent later says "the whole unit wasn't clean", ask for their list in writing, with photos, and send it to us.</p>
${callout('Fair wear and tear covers ageing from normal use, like faded paint or worn carpet in a hallway. It never covers dirt, grease or grime.')}`,
      },
      {
        id: 'photo-report',
        eyebrow: 'Proof, not promises',
        h2: 'Your photo report and tax invoice, the same day',
        html: `<p>Before we lock up, we photograph every room: the oven, the inside of the cupboards, the tracks, the fans. The report is dated and emailed to you with the tax invoice, usually before you've finished unpacking at the new place.</p>${ticks(['Forward it straight to your property manager', 'Keep it as evidence if there is ever a dispute', 'See the finish time, so you know the crew stayed until the checklist was done'])}`,
        component: 'photoReport',
        bg: 'bg',
      },
      {
        id: 'no-need',
        eyebrow: 'Moved interstate?',
        h2: 'End of lease cleaning when you have already left Brisbane',
        html: "<p>Plenty of our end of lease cleans are for people who have already driven to Sydney or flown home. You don't need to be there. Leave the keys in a lockbox or with the agent, and we'll handle access, send photos when we finish, and deal with the re-clean if the agent sends a list.</p>",
        component: 'noNeed',
      },
    ],
    price: {
      h2: 'End of lease cleaning Brisbane prices',
      html: `<p>We price end of lease cleans by bedrooms, bathrooms and condition, never by the hour. A 1-bed unit starts at {price:b1}, a 2-bed at {price:b2}, a 3-bed house at {price:b3}. Carpets are {carpet}. Your fixed price arrives in writing before we book you in, and it doesn't move on the day.</p>`,
    },
    faqs: [
      { id: 'eol1', q: 'Is end of lease cleaning the same as a bond clean?', a: 'Yes. In Queensland, end of lease, bond, vacate and exit cleaning all mean the same job: returning the property to its entry condition, less fair wear and tear.' },
      { id: 'eol2', q: 'What if the agent says the whole place isn\'t clean?', a: 'Ask for their list and photos, then send them to us. We come back {reclean} and fix anything we cleaned, and our dated photo report shows the condition we left it in.' },
      { id: 'eol3', q: 'Do you give me an invoice for the agent?', a: 'Yes. A tax invoice and the room-by-room photo report are emailed the same day, ready to forward.' },
      { id: 'eol4', q: 'Will the price change on the day?', a: 'No. Your price is fixed from your photos before we arrive. If something wasn\'t in the photos, we agree any change with you in writing before doing it, never mid-clean.' },
      { id: 'eol5', q: "Can you do it if I've already moved out?", a: "Yes. Leave keys or a lockbox code and we'll send photos and the invoice when we finish." },
      ...pick('D24', 'B15'),
    ],
    related: ['carpet-steam-cleaning-brisbane', 'oven-cleaning-brisbane', 'window-cleaning-brisbane', 'bond-back-guarantee'],
    cta: { h2: 'Get your bond back without the stress.', p: 'Send a few photos and we\'ll text back a fixed price for your end of lease clean within {replyTime}.' },
    areasIntro: 'We do end of lease cleans in every one of these 20 suburbs each week. Pick yours to see the local notes.',
  },

  // ---------------------------------------------------------------------------
  // Tier 2 (ready to book) · Vacate & exit cleaning
  {
    slug: 'vacate-cleaning-brisbane',
    tier: 2,
    short: 'What your agent calls the move-out clean',
    icon: 'key',
    intro: `<p>Vacate cleaning, exit cleaning and bond cleaning all mean the clean you book when you leave a rental. Whatever your agent calls it, the standard is the same: the property must match the entry report, less fair wear and tear. That is the standard we clean to.</p>
<p>Our exit cleaning in Brisbane is for tenants whose property manager has sent a "vacate clean" checklist, and for agents who need a reliable exit clean between tenants. Expect a fixed price from {price:b1} for a 1-bed, confirmed in writing within {replyTime}, and a photo report on the day.</p>`,
    heroPhoto: 'cupboard',
    photos: ['cupboard', 'oven', 'fan'],
    problem: {
      h2: 'When the agent\'s email says "vacate clean"',
      quotes: [
        '"The email said exit clean. I didn\'t know if that was different to a bond clean."',
        '"The agent said I had to use their cleaner."',
      ],
      paras: [
        "Agencies use different words. One property manager writes \"vacate clean\", another \"exit clean\", a third just attaches a checklist. It sounds like there's a special service you're supposed to know about. There isn't: they want the property back the way it was when you moved in.",
        "Some tenants are also told to use the agency's preferred cleaner. In Queensland you can choose your own. What matters is the result, and a photo record that proves it.",
      ],
    },
    included: {
      h2: 'The exit clean checklist we work from',
      intro: 'This mirrors the exit condition report. The items in bold are the ones agents flag most often.',
      groups: [
        { h3: 'Kitchen cabinets and cupboards', items: ['Inside and out, including shelves, hinges and handles', 'Under-sink cupboard cleaned and dried'] },
        { h3: 'Oven and range hood', items: ['Racks, trays, cavity and door glass', 'Range hood filters degreased'] },
        { h3: 'Ceiling fans and light fittings', items: ['Fan blades wiped one by one', 'Light covers dusted, dead insects removed'] },
        { h3: 'Bathrooms', items: ['Bath, shower, toilet and vanity', 'Mirrors and glass streak-free'] },
        { h3: 'Walls and doors', items: ['Walls spot cleaned for scuffs and marks', 'Doors, frames and skirting boards'] },
        { h3: 'Floors', items: ['Vinyl floors and tiles mopped', 'Carpets vacuumed edge to edge'] },
      ],
    },
    sections: [
      {
        id: 'definition',
        eyebrow: 'Plain English',
        h2: 'What is a vacate clean, and what is an exit clean?',
        html: `<p>A vacate clean is the clean done when a tenant vacates a rental. An exit clean is the same thing, named after the exit inspection. Both are bond cleans: the deep clean that gets your bond back. A professional exit clean differs from a regular clean because it covers what a weekly clean skips: inside cupboards, the oven, tracks, skirting, fans and walls.</p>${fourNames('/vacate-cleaning-brisbane/')}`,
        bg: 'bg',
      },
      {
        id: 'your-right',
        eyebrow: 'Your rights in QLD',
        h2: "You choose your own vacate cleaners",
        html: `<p>A landlord or agent in Queensland can't require you to use a particular carpet cleaning or pest control company, or charge you a set fee for one (${rta(RTA_CARPET, 'RTA: carpet cleaning and pest control')}). For general cleaning, the ${rta(RTA_CLEAN, 'RTA cleaning guide')} is clear that you can do it yourself or hire someone.</p>
<p>So you're free to compare vacate cleaners on what matters: a fixed price, a guarantee that lasts past the inspection, and proof of the work. If your agent does recommend someone, that's fine too. Just remember you still answer to the entry condition report, whoever cleans.</p>`,
      },
      {
        id: 'packages',
        eyebrow: 'Packages',
        h2: 'Bond exit cleaning packages',
        html: '<p>Most exit cleans fall into one of three bundles. Each one comes with the photo report and the re-clean promise.</p>',
        component: 'packages',
        bg: 'bg',
      },
    ],
    price: {
      h2: 'Exit cleaning in Brisbane: what it costs',
      html: '<p>Exit cleaning is priced like every other bond clean we do: by bedrooms and bathrooms, fixed from your photos. From {price:b1} for a studio or 1-bed and {price:b2} for a 2-bed unit. Garages, balconies and patios are add-ons, so tell us when you book and they\'re in your price.</p>',
    },
    faqs: [
      { id: 'vac1', q: 'What is a vacate clean?', a: "It's the clean done when a tenant leaves a rental, the same as a bond or end of lease clean." },
      { id: 'vac2', q: 'My agent said I must use their cleaner. Is that right?', a: "No. In Queensland a landlord or agent can't make you use a particular cleaning, carpet or pest company. You can choose your own." },
      { id: 'vac3', q: 'Is an exit clean different from a regular clean?', a: 'Yes. It covers inside cupboards, ovens, rangehoods, tracks, skirting, fans and walls: the things a weekly clean skips and an inspection checks.' },
      { id: 'vac4', q: 'How soon before the inspection should I book?', a: 'Ideally the day before or the morning of handover, after the removalists have gone.' },
      { id: 'vac5', q: 'Do you clean garages and outdoor areas?', a: "Yes, as add-ons. Tell us when you book so they're in your fixed price." },
      ...pick('C21', 'D25'),
    ],
    related: ['carpet-steam-cleaning-brisbane', 'oven-cleaning-brisbane', 'window-cleaning-brisbane', 'bond-back-guarantee'],
    cta: { h2: 'Exit clean booked in under a minute.', p: "Four taps for your price, then we confirm the date in writing." },
    areasIntro: 'Exit cleaners on the Northside every day. Choose your suburb for access and parking notes.',
  },

  // ---------------------------------------------------------------------------
  // Tier 2 (ready to book) · Move-out cleaning
  {
    slug: 'move-out-cleaning-brisbane',
    tier: 2,
    short: 'Timed between the removalists and the inspection',
    icon: 'truck',
    intro: `<p>Moving out is a week of boxes, utilities and keys. The clean is the one part that decides whether you get your bond back. Book a fixed-price move out clean timed for after the removalists leave and before your final inspection, and we handle the rest.</p>
<p>Our move out cleaning in Brisbane suits families and renters on the Northside who need it done in a single, well-timed day. A fixed price from {price:b1}, a reply within {replyTime}, and photos in your inbox before the inspection.</p>`,
    heroPhoto: 'laundry',
    photos: ['laundry', 'oven', 'shower'],
    problem: {
      h2: 'Moving week leaves no time to clean',
      quotes: ['"The removalists ran three hours late and the cleaners had already left."', '"The cleaner turned up while the couch was still in the lounge room."'],
      paras: [
        "Moving week runs on other people's timetables. The truck is late, the last boxes take longer than planned, and the clean gets squeezed into the evening before the inspection. That's when ovens, tracks and fans get skipped.",
        "We plan your move-out clean around the removalists, not the other way round. If they run late, tell us and we'll shift the start where we can, so the crew arrives to an empty property and stays until the checklist is done.",
      ],
    },
    included: {
      h2: 'What our move out cleaners clean',
      groups: [
        { h3: 'Kitchen', items: ['Oven, rangehood and cooktop', 'Inside every cupboard and drawer', 'Fridge space and dishwasher'] },
        { h3: 'Bathrooms and laundry', items: ['Shower, bath, toilet and vanity', 'Laundry tub, washing machine space and floor waste'] },
        { h3: 'Every room', items: ['Ceiling fans, light fittings and switches', 'Skirting boards, doors and frames', 'Walls spot cleaned'] },
        { h3: 'Windows and floors', items: ['Window tracks and sliding door tracks', 'Floors vacuumed and mopped, corners included'] },
      ],
    },
    sections: [
      {
        id: 'timeline',
        eyebrow: 'Moving-week timeline',
        h2: 'Removalists, then the clean, then the inspection',
        html: `<p>Here's how a typical moving day runs when the clean is booked properly:</p>
<ol><li><strong>Two weeks out:</strong> book your removalist and your move-out clean together. The last days of the month fill first, because that's when most leases end.</li><li><strong>The day before:</strong> confirm power and water stay connected through the clean.</li><li><strong>Moving day:</strong> removalists leave at 10. We arrive at 11.</li><li><strong>By 5pm:</strong> your photo report and invoice arrive by email.</li><li><strong>Next morning:</strong> the agent inspects at 9. If anything's flagged, send us the list.</li></ol>`,
        component: 'moveTimeline',
        bg: 'bg',
      },
      {
        id: 'before',
        eyebrow: 'Get ready',
        h2: 'What to do before the move out cleaners arrive',
        html: "<p>A move-out clean goes fastest in an empty property with the power on. The list on the right is everything we ask for. If you can't tick one of them, tell us when you book and we'll plan around it.</p>",
        component: 'beforeArrive',
      },
      {
        id: 'late',
        eyebrow: 'When plans change',
        h2: 'Flexible start times, and what happens if removalists run late',
        html: `<p>Moving-related cleaning lives or dies on timing. We give you an arrival window the day before, and if the truck is running behind, a quick text is all it takes. We'll move your start time where the day allows {?freeCancellationHours}[at no charge]{/freeCancellationHours}. If we genuinely can't fit a later start, we tell you straight away so you're never left with an empty house and no cleaner.</p>
<p>Doing a move in/out clean on the same weekend? Book both together. We'll clean your new place first so you can unpack into clean cupboards, then come back for the old one once the truck has gone. See <a href="/move-in-cleaning-brisbane/">move-in cleaning</a>.</p>`,
      },
    ],
    price: {
      h2: 'Move-out cleaning in Brisbane: prices',
      html: '<p>Fixed by bedrooms and bathrooms from your photos: {price:b1} for a 1-bed unit, {price:b2} for a 2-bed, {price:b3} for a 3-bed house. No hourly rate, so a removalist running late never costs you more.</p>',
    },
    faqs: [
      { id: 'mo1', q: 'When should the move-out clean happen?', a: 'After everything is out and before the final inspection, usually the same or next day after the removalists.' },
      { id: 'mo2', q: 'What if the removalists run late?', a: "Tell us as soon as you know. We'll move your start time where we can, at no charge [confirm policy]." },
      { id: 'mo3', q: 'Does the power and water need to be on?', a: 'Yes, both need to be connected on the day.' },
      { id: 'mo4', q: 'Do I need to be there?', a: "No. Leave keys or a lockbox code and we'll send photos when we finish." },
      { id: 'mo5', q: 'Can you take rubbish away?', a: "We don't do rubbish removal as standard. Please clear the property, or ask us about it when booking." },
      ...pick('F12', 'E30'),
    ],
    related: ['carpet-steam-cleaning-brisbane', 'oven-cleaning-brisbane', 'window-cleaning-brisbane', 'bond-back-guarantee'],
    cta: { h2: 'One less thing in moving week.', p: 'Book the clean with your removalist and get a fixed price in writing today.' },
    areasIntro: 'Moving out of one of these suburbs? We clean all 20 every week.',
  },

  // ---------------------------------------------------------------------------
  // Tier 5/2 (B2B and ready to book) · Move-in cleaning
  {
    slug: 'move-in-cleaning-brisbane',
    tier: 5,
    short: 'Start the lease clean, with dated proof',
    icon: 'calendar',
    intro: `<p>Moving into a rental that wasn't cleaned properly? A move-in clean gets the place to the standard you'll be expected to leave it in, and our dated photo report doubles as evidence for your entry condition report.</p>
<p>We do move in cleaning in Brisbane for new tenants, buyers and investors on the Northside, usually on the day you get the keys. A fixed price, often a little under a bond clean, quoted from photos within {replyTime}, from {price:b1} for a 1-bed.</p>`,
    heroPhoto: 'cupboard',
    photos: ['cupboard', 'shower'],
    problem: {
      h2: 'Moving into someone else\'s mess',
      quotes: ['"The last tenant left grease in the oven and I was scared I\'d be charged for it when I left."'],
      paras: [
        "It happens more than it should: you collect the keys and find a sticky oven, a mouldy shower and crumbs in every drawer. Cleaning it yourself takes a weekend you don't have. Ignoring it risks being blamed for it a year later.",
        "A move-in clean solves both. You unpack into a clean home, and you hold dated photos showing what the property looked like on day one.",
      ],
    },
    included: {
      h2: 'What a move in clean covers',
      groups: [
        { h3: 'Kitchen sanitise', items: ['Inside every cupboard and drawer before you unpack', 'Oven, rangehood, cooktop and dishwasher', 'Benchtops, splashback, sink and taps sanitised'] },
        { h3: 'Bathroom sanitise', items: ['Toilet, shower, bath and vanity disinfected', 'Grout and silicone, surface mould treated', 'Exhaust fans'] },
        { h3: 'Living and bedrooms', items: ['Wardrobes inside', 'Ceiling fans, light fittings, skirting boards', 'Window tracks and floors'] },
      ],
    },
    sections: [
      {
        id: 'entry-report',
        eyebrow: 'Protect your bond from day one',
        h2: 'How our photos support your entry condition report',
        html: `<p>You usually have a few days to return the entry condition report to your agent. That's your chance to record anything that wasn't clean or was already damaged. Note it in writing, add your own photos, and keep a copy.</p>
<p>Our move-in photo report adds a second, dated record. It shows the property after cleaning, so if anything is still marked or stained, it's clearly existing. When you move out, that record is worth far more than a memory of "it was like that when we got here".</p>${callout('Note any problems on the entry condition report itself. Our photos support it; they don\'t replace it.')}`,
        bg: 'bg',
      },
      {
        id: 'combo',
        eyebrow: 'Moving both ends?',
        h2: 'Move-in plus move-out: one booking, two clean homes',
        html: `<p>If you're leaving a Northside rental and moving into another, book both. We clean the new place first so your boxes go into clean cupboards, then do the <a href="/end-of-lease-cleaning-brisbane/">end of lease clean</a> on the old one after the removalists leave. One coordinator, one invoice, two photo reports.</p>
<p>Buying an investment property or settling on a home? The same one off house clean works for owners: the previous occupant's grime gone before you, or your new tenant, move in.</p>`,
      },
    ],
    price: {
      h2: 'Move-in cleaning in Brisbane: prices',
      html: "<p>A move-in clean is priced from photos like a bond clean, and is often slightly cheaper because the property is usually in better shape. From {price:b1} for a 1-bed unit. If it's worse than the photos showed, we'll tell you before we start, not after.</p>",
    },
    faqs: [
      { id: 'mi1', q: 'Should I clean before I move into a rental?', a: "If it wasn't left clean, yes, and note it on your entry condition report with photos so you're not charged for it later." },
      { id: 'mi2', q: 'Can your photos help with my entry condition report?', a: 'Yes. Our dated photo report shows the condition after cleaning, which is useful evidence alongside your own report.' },
      { id: 'mi3', q: 'Is a move-in clean cheaper than a bond clean?', a: 'Often a little, because the property is usually in better condition. You get a fixed price from photos.' },
      { id: 'mi4', q: 'Do you clean inside cupboards before I unpack?', a: 'Yes, inside every cupboard, drawer and wardrobe.' },
      { id: 'mi5', q: 'Can you clean the day I get the keys?', a: 'Usually yes. Book early, as start-of-month dates fill fast.' },
      ...pick('E33'),
    ],
    related: ['carpet-steam-cleaning-brisbane', 'oven-cleaning-brisbane', 'window-cleaning-brisbane', 'bond-back-guarantee'],
    cta: { h2: 'Start your new lease clean.', p: 'Tell us the key date and we\'ll lock in your move-in clean with a fixed price.' },
    areasIntro: 'Moving into one of these suburbs? We do move-in cleans across all 20.',
  },

  // ---------------------------------------------------------------------------
  // Tier 2 (ready to book) · House bond cleaning
  {
    slug: 'house-bond-cleaning-brisbane',
    tier: 2,
    short: 'Houses and Queenslanders, priced by bedrooms',
    icon: 'home',
    intro: `<p>Houses take longer than units: more windows and tracks, more fans, more skirting, often a garage and patio. We price houses by bedrooms and bathrooms from your photos, so a 4-bed lowset in Aspley and a Queenslander in New Farm each get an honest fixed quote.</p>
<p>Our bond house cleaning in Brisbane is built for families in 3 to 5-bed rentals and anyone leaving a timber Queenslander. A 3-bed house starts at {price:b3}, quoted in writing within {replyTime}, and a team of two usually finishes it in most of a day.</p>`,
    heroPhoto: 'fan',
    photos: ['fan', 'oven', 'carpet'],
    problem: {
      h2: 'Why big houses lose bonds',
      quotes: ['"The hourly rate seemed fine until it took eleven hours."', '"Nobody touched the garage or the patio, and both were on the agent\'s list."'],
      paras: [
        "A house bond clean is where hourly pricing hurts. More rooms means more hours, and the bill keeps climbing while you watch. Big houses also have the jobs people forget: high fans, louvres, the garage floor, the patio, the downstairs laundry.",
        "We quote houses as a fixed price by bedrooms and bathrooms and list the outdoor areas on your quote, so the garage and patio are either in the price or clearly not booked.",
      ],
    },
    included: {
      h2: 'Bond house cleaning in Brisbane: what we cover',
      groups: [
        { h3: 'Ceiling fans and high fittings', items: ['Every fan blade, on high ceilings too', 'Light fittings, smoke alarm covers and cobwebs'] },
        { h3: 'Windows, louvres and sliding doors', items: ['Window tracks and sliding door tracks', 'Louvre blades one by one', 'Flyscreens washed'] },
        { h3: 'Kitchen and laundry', items: ['Oven, rangehood, cupboards inside', 'Laundry tub and washing machine space'] },
        { h3: 'Bathrooms', items: ['Every bathroom and toilet, ensuite included', 'Grout, glass and exhaust fans'] },
        { h3: 'Floors and walls', items: ['Timber floors with a timber-safe cleaner', 'Skirting boards through every room, walls spot cleaned'] },
      ],
    },
    sections: [
      {
        id: 'queenslander',
        eyebrow: 'Queenslanders',
        h2: 'Queenslander bond clean: timber, VJs, louvres and verandahs',
        html: `<p>A Queenslander has more surfaces than its floor plan suggests. VJ walls catch dust in every groove. Louvres have a dozen blades per window. Verandahs and high ceilings mean ladders and time. We clean them the way they need:</p>${ticks(['Timber floors damp mopped with a pH-neutral cleaner, never soaked', 'VJ walls wiped with the grain, gently, so painted timber isn\'t stripped', 'Louvre blades and tracks inside and out where safely reachable', 'Verandah boards swept and washed, rails wiped', 'High ceiling fans and light fittings with the right ladders', 'Picture rails, door tops and fretwork dusted'])}<p>We clean Queenslanders across New Farm, Windsor, Wavell Heights, Albion and Nundah every month.</p>`,
        bg: 'sand',
      },
      {
        id: 'lowset-highset',
        eyebrow: 'Lowset and highset',
        h2: 'Lowset, highset and what is under the house',
        html: "<p>A lowset brick home in Aspley or Bracken Ridge is all on one level, usually with a garage and a patio out the back. A highset in Wavell Heights or Kedron often has a downstairs laundry, a rumpus room or under-house storage. If those areas are part of your lease, they're part of the inspection. Tell us what's downstairs when you book and it goes into your fixed price.</p>",
      },
      {
        id: 'house-prices',
        eyebrow: 'House prices',
        h2: 'End of lease house cleaning prices (3 to 5 bed)',
        html: '<p>Fixed by bedrooms and bathrooms, never by the hour. Five bedrooms or more, or a big Queenslander, we quote from photos.</p>',
        component: 'houseTable',
        bg: 'bg',
      },
      {
        id: 'outdoor',
        eyebrow: 'Outside counts too',
        h2: 'Outdoor checklist: patio, garage and driveway',
        html: `<p>The exit condition report doesn't stop at the back door. These are the outdoor items we add to a house bond clean when they're in your lease:</p>${ticks(['Patio and alfresco swept and washed', 'Garage floor swept, oil marks treated where possible', 'Driveway and paths pressure washed', 'Outdoor light fittings and cobwebs', 'Bins rinsed, clothesline wiped'])}<p>See <a href="/pressure-washing-brisbane/">pressure washing, balcony and garage cleaning</a> for prices.</p>`,
      },
    ],
    price: {
      h2: 'What a house bond clean costs',
      html: '<p>3 bed, 2 bath: {price:b3}. 4 bed, 2 bath: {price:b4}. 5 bed or more: quoted from photos. Carpets are {carpet}. Garages and patios are priced on your quote so nothing is a surprise.</p>',
    },
    faqs: [
      { id: 'hb1', q: 'How much is a bond clean for a 3 or 4 bedroom house?', a: "A fixed price based on bedrooms, bathrooms and condition: {price:b3} for 3 bed, {price:b4} for 4 bed. Never hourly, so big houses don't creep up." },
      { id: 'hb2', q: 'Do you clean Queenslanders?', a: 'Yes. Timber floors, VJ walls, louvres, verandahs and high fans are normal for us.' },
      { id: 'hb3', q: 'Is the garage included?', a: "Garages are an add-on. Include it when you book so it's in your fixed price." },
      { id: 'hb4', q: 'Do you clean louvre windows?', a: 'Yes, each louvre blade and the tracks, inside and out where safely reachable.' },
      { id: 'hb5', q: 'How long does a house bond clean take?', a: 'A 3-bed house usually takes a team of two most of a day.' },
      ...pick('D23'),
    ],
    related: ['carpet-steam-cleaning-brisbane', 'oven-cleaning-brisbane', 'window-cleaning-brisbane', 'bond-back-guarantee'],
    cta: { h2: 'A fixed price for the whole house.', p: 'Send photos of the kitchen, bathrooms and any outdoor areas, and we\'ll price the lot.' },
    areasIntro: 'From Queenslanders in the inner north to family homes in North Lakes, we clean houses in all 20 suburbs.',
  },

  // ---------------------------------------------------------------------------
  // Tier 2 (ready to book) · Apartment & unit bond cleaning
  {
    slug: 'apartment-bond-cleaning-brisbane',
    tier: 2,
    short: 'Lift bookings, balconies and glass handled',
    icon: 'building',
    intro: `<p>Apartment bond cleans live or die on details: balcony glass, sliding door tracks, the rangehood filter and the lift booking. We book the loading dock and service lift with your building manager, then clean to the agent's checklist.</p>
<p>Our apartment end of lease cleaning in Brisbane covers studios, 1-beds and 2-beds in the CBD, Fortitude Valley, Newstead, Hamilton and Bowen Hills. Fixed prices start at {price:b1} for a studio, quoted within {replyTime}, and most units are finished in half a day.</p>`,
    heroPhoto: 'shower',
    photos: ['shower', 'oven', 'cupboard'],
    problem: {
      h2: 'Apartments have their own bond traps',
      quotes: ['"The cleaners couldn\'t get up because nobody booked the lift."', '"The balcony glass was streaky and the agent noticed straight away."'],
      paras: [
        "In a tower, the clean starts before anyone picks up a cloth. Somebody has to book the service lift, find the loading dock and fit inside the building's move-out hours. Miss any of that and the crew is stuck in the basement.",
        "Inside, units are small but exacting. Agents look at balcony glass in the afternoon light, open the rangehood in the galley kitchen and check the exhaust fan in the internal bathroom. Those are the items we spend the most time on.",
      ],
    },
    included: {
      h2: 'Apartment end of lease cleaning in Brisbane: the unit checklist',
      groups: [
        { h3: 'Balcony and balustrade glass', items: ['Glass balustrades both sides where safe', 'Balcony tiles swept and mopped, drain cleared', 'Sliding door tracks and seals'] },
        { h3: 'Galley kitchen', items: ['Range hood filters degreased', 'Oven, cooktop and integrated appliances', 'Stone benchtops with stone-safe products'] },
        { h3: 'Internal bathroom', items: ['Exhaust fan cover washed', 'Shower glass, grout and mould treatment', 'Mirrors and vanity inside'] },
        { h3: 'Living and bedroom', items: ['Wardrobe tracks and shelves', 'Air-con filters and vents', 'Light switches, skirting and floors'] },
      ],
    },
    sections: [
      {
        id: 'lift',
        eyebrow: 'Building access',
        h2: 'We book the lift and loading dock with your building manager',
        html: '<p>Send us your building manager\'s contact and your unit number. We\'ll book the service lift and loading dock, check the building\'s move-out hours and arrive inside them. If there\'s no visitor parking, tell us and we\'ll plan for a loading bay or nearby parking instead.</p>',
        bg: 'bg',
        component: 'beforeArrive',
      },
      {
        id: 'strata',
        eyebrow: 'Strata rules',
        h2: 'Strata move-out time windows',
        html: `<p>Many Brisbane apartment buildings only allow moves and trades in set hours, often weekdays between 8am and 4pm, and some need a bond for lift use. We work inside those windows, so you never get a strata breach on your last day. If your removalist has the lift in the morning, we book the afternoon slot.</p>
<p>Living in a CBD or Valley tower on a short lease? The unit bond clean is usually our quickest job, and the one where the details matter most.</p>`,
      },
      {
        id: 'apartment-prices',
        eyebrow: 'Unit prices',
        h2: 'Studio, 1-bed and 2-bed fixed prices',
        html: '<p>Our studio bond clean in Brisbane and 1 and 2-bed unit prices are fixed. Balconies are included as a sweep and glass clean; large wraparound balconies are priced on your quote.</p>',
        component: 'apartmentTable',
        bg: 'bg',
      },
    ],
    price: {
      h2: 'Apartment bond cleaning prices',
      html: "<p>Studio or 1-bed: {price:b1}. 2-bed, 1 bath: {price:b2}. 2-bed, 2 bath: {price:b2b2}. Carpets in the bedrooms are {carpet}. Sharing the unit? {?splitPayment}[We can split the payment between housemates.]{/splitPayment}</p>",
    },
    faqs: [
      { id: 'ap1', q: 'Do you organise the lift booking?', a: "Yes. Send us the building manager's contact and we'll book the service lift and loading dock." },
      { id: 'ap2', q: 'Is the balcony included?', a: "Balcony sweep and glass are [included]. Large balconies may be priced separately; it's all in your fixed quote." },
      { id: 'ap3', q: 'Where do you park in the CBD?', a: "We use loading docks or visitor parking where available. Tell us if there's none so we can plan." },
      { id: 'ap4', q: 'How much is a 1 bedroom apartment bond clean?', a: 'From {price:b1}, fixed. Send photos for an exact price.' },
      { id: 'ap5', q: 'Do you clean the rangehood filters?', a: 'Yes, filters soaked and degreased, canopy wiped inside and out.' },
      ...pick('E31'),
    ],
    related: ['carpet-steam-cleaning-brisbane', 'oven-cleaning-brisbane', 'window-cleaning-brisbane', 'bond-back-guarantee'],
    cta: { h2: 'Lift booked, balcony sparkling, bond back.', p: 'Send your building details with your photos and we\'ll handle the rest.' },
    areasIntro: 'Apartment towers in the CBD, Valley, Newstead, Bowen Hills and Hamilton, and units across the rest of these 20 suburbs.',
  },
];
