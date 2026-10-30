import type { ServiceContent } from '../../lib/types';
import { pick } from '../../data/faqs';
import { ticks, callout, rta, RTA_CARPET } from '../shared';

export const addons: ServiceContent[] = [
  // ---------------------------------------------------------------------------
  // Tier 2 (ready to book) · Pet owner bond clean
  {
    slug: 'pet-owner-bond-cleaning-brisbane',
    tier: 2,
    short: 'Bond clean, carpets and flea treatment in one',
    icon: 'paw',
    intro: `<p>Had a dog or cat in the rental? Your lease may require a professional carpet clean and flea treatment at the end. We bundle the bond clean, carpet steam clean and pet hair removal, and arrange flea treatment through {pestPartner}, so you get one booking and every receipt the agent asks for.</p>
<p>Our pet owner bond cleaning in Brisbane suits families leaving houses in Aspley, Bracken Ridge, North Lakes and across the Northside. The full bundle is a fixed price from {price:packagePet} for a 2-bed, quoted within {replyTime}.</p>`,
    heroPhoto: 'carpet',
    heroAlt: 'Pet owner bond cleaning Brisbane: bedroom carpet before and after steam cleaning during a Brisbane bond clean',
    photos: ['carpet', 'fan', 'laundry'],
    problem: {
      h2: 'Three bookings, three receipts, one inspection',
      quotes: ['"We paid for pest control and it was never done."', '"I didn\'t know if the pet clause meant carpets, fleas or both."'],
      paras: [
        "A bond clean with pets usually means coordinating a cleaner, a carpet cleaner and a pest controller in the same day, then collecting three receipts for the agent. One no-show and the whole inspection slips.",
        "The other risk is paying for something that isn't done. Pet owners told us about paid flea treatments that never happened, with nothing to show the agent. Every part of our bundle is photographed and logged, and the pest certificate goes into your report.",
      ],
    },
    included: {
      h2: 'Bond clean with pets: the full bundle',
      groups: [
        { h3: 'The bond clean', items: ['Every room to the exit checklist', 'Oven, bathrooms, tracks, fans and skirting'] },
        { h3: 'Carpets and odour', items: ['Carpet steam clean with hot water extraction', 'Enzyme treatment on pet urine spots', 'Carpet receipt for the agent'] },
        { h3: 'Pet hair', items: ['Hair removed from vents, skirting and door seals', 'Air-con filters washed', 'Flyscreens and sliding door tracks'] },
        { h3: 'Flea treatment', items: ['Done by {pestPartner}', 'Treatment certificate in your photo report'] },
      ],
    },
    sections: [
      {
        id: 'pet-clause',
        eyebrow: 'The pet clause',
        h2: 'What the RTA says about pets at the end of a lease',
        html: `<p>In Queensland you only need pest control at the end of a lease if pests came from your tenancy, or pest control was done at the start and you agreed to it, which is common with pets. Carpets go back to their starting standard; if they were professionally cleaned at move-in or your pet clause says so, the agent can ask for a professional clean. They can't make you use a particular company or charge a set fee (${rta(RTA_CARPET, 'RTA: carpet cleaning and pest control')}).</p>${callout('Read your lease for a special term about pets. It usually says exactly what is required: carpets, fleas, or both.')}`,
        bg: 'bg',
      },
      {
        id: 'partner',
        eyebrow: 'Licensed partner',
        h2: 'Flea treatment north Brisbane, by a licensed operator',
        html: "<p>We are cleaners, not pest controllers, and Queensland requires pest control to be done by a licensed operator. So end of lease pest control is carried out by {pestPartner}, booked for the same day as your clean. You get their treatment certificate with the operator's licence number, the date and the time, inside your photo report. That's the proof the agent wants, and the proof that it was actually done.</p>",
      },
      {
        id: 'packages',
        eyebrow: 'Package pricing',
        h2: 'Bond carpet cleaning and pest control Brisbane packages',
        html: '<p>Choose the package that matches your lease. All three include the photo report and the re-clean promise.</p>',
        component: 'packages',
        bg: 'bg',
      },
    ],
    price: {
      h2: 'Pet owner bond clean prices',
      html: '<p>Bond + carpet + flea for a 2-bed: {price:packagePet}. Bond + carpet: {price:packageCarpet}. Flea treatment on its own through our partner: {price:flea}. All fixed from your photos.</p>',
    },
    faqs: [
      { id: 'pe1', q: 'What do I need to do at the end of a lease with a pet?', a: "Check your lease. Often it's a professional carpet clean and, if agreed, flea treatment. Our pet owner bond clean covers both." },
      { id: 'pe2', q: 'Do I have to get pest control when I move out in QLD?', a: 'Only if pests came from your tenancy or it was agreed (often with pets). Check your lease.' },
      { id: 'pe3', q: 'Do you do the flea treatment yourselves?', a: 'No. A licensed pest control partner does it, and the certificate goes in your report.' },
      { id: 'pe4', q: 'How do I know the flea treatment was actually done?', a: "You get the licensed operator's certificate and photos in your report." },
      { id: 'pe5', q: 'Do you remove pet hair from vents and skirting?', a: "Yes, it's part of the bundle." },
      ...pick('A3'),
    ],
    related: ['end-of-lease-cleaning-brisbane', 'carpet-steam-cleaning-brisbane', 'pet-stain-odour-removal-brisbane', 'bond-back-guarantee'],
    cta: { h2: 'One booking for the whole pet clause.', p: 'Bond clean, carpets and fleas, with every receipt in one report.' },
    areasIntro: 'Pet owner bond cleans across all 20 suburbs, most often in the family-home suburbs of the north.',
  },

  // ---------------------------------------------------------------------------
  // Tier 2 · Oven & rangehood cleaning
  {
    slug: 'oven-cleaning-brisbane',
    tier: 2,
    short: 'Door glass, racks, filters and cooktop',
    icon: 'oven',
    intro: `<p>The oven is the first thing many property managers open at the final inspection. We take the door glass apart where the model allows, degrease racks, trays and the cavity, and clean the rangehood filters and canopy.</p>
<p>Our oven cleaning in Brisbane is included in every bond clean, and available on its own for renters and owners on the Northside. A heavy build-up deep clean is {price:ovenDeep}, quoted from a photo within {replyTime}, and takes 1 to 2 hours.</p>`,
    heroPhoto: 'oven',
    heroAlt: 'Oven cleaning Brisbane: oven door glass before and after a bond clean in Brisbane, baked-on grease removed',
    photos: ['oven', 'cupboard'],
    problem: {
      h2: 'Streaky glass and a greasy filter',
      quotes: ['"The agent opened the oven, saw streaks between the glass, and that was a $90 deduction."'],
      paras: [
        "Ovens hold years of baked-on grease, and the worst of it sits where you can't reach: between the panes of the door glass, behind the fan cover and in the rangehood filter above. A quick wipe of the inside makes it look better without passing an inspection.",
        "We clean it in the order an agent checks it: door glass first, then racks and cavity, then the rangehood and cooktop.",
      ],
    },
    included: {
      h2: 'Oven and range hood: step by step',
      groups: [
        { h3: 'Oven', items: ['Racks and trays soaked and degreased', 'Cavity, roof, fan cover and seals', 'Door glass inside, outside and between the panes'] },
        { h3: 'Range hood cleaning', items: ['Mesh or baffle filters soaked in degreaser', 'Canopy inside and out, light cover', 'Charcoal filters noted if they need replacing'] },
        { h3: 'Cooktop', items: ['Gas: trivets, burners and caps degreased', 'Ceramic and induction: glass scraped and polished', 'Knobs, splashback and benchtop edges'] },
      ],
    },
    sections: [
      {
        id: 'door-glass',
        eyebrow: 'Door glass',
        h2: 'Separating the oven door glass, where the model allows',
        html: '<p>Most streaks on oven glass are on the inside panes, where grease and steam get trapped. Many oven doors can be safely taken apart to clean between them; some can\'t. We check the model first, separate the glass where it\'s designed to come apart, and photograph the result. If a door can\'t be separated safely, we clean every surface we can reach and tell you so.</p>',
        bg: 'bg',
      },
      {
        id: 'bbq',
        eyebrow: 'Extras',
        h2: 'BBQ cleaning and heavy build-up',
        html: `<p>Outdoor BBQs are often on the inventory in houses and townhouses. We degrease the hotplate, grill, drip tray and hood as an add-on. If your oven has years of build-up, we'll tell you from the photos that it needs a deep clean, and the price is agreed before we start, never added on the day.</p>${ticks(['Professional degreasers safe on enamel and stainless steel', 'No caustic sprays left behind on seals', 'Before and after photos in your report'])}`,
      },
    ],
    price: {
      h2: 'Oven cleaning prices',
      html: '<p>Standard oven and rangehood cleaning is included in every bond clean. On its own, or for heavy build-up, a deep clean is {price:ovenDeep}. BBQs are quoted from a photo.</p>',
    },
    faqs: [
      { id: 'ov1', q: 'Is oven cleaning included in a bond clean?', a: 'Yes, standard oven and rangehood cleaning is included. Very heavy build-up may be priced as a deep clean, agreed up front.' },
      { id: 'ov2', q: 'Do you clean between the oven door glass?', a: 'Yes, where the door can be safely separated.' },
      { id: 'ov3', q: 'How long does an oven clean take?', a: 'Usually 1–2 hours depending on build-up.' },
      { id: 'ov4', q: 'Do you clean BBQs?', a: 'Yes, as an add-on.' },
      { id: 'ov5', q: 'What products do you use?', a: 'Professional degreasers that are safe on enamel and stainless steel.' },
      ...pick('F10'),
    ],
    related: ['end-of-lease-cleaning-brisbane', 'pet-owner-bond-cleaning-brisbane', 'carpet-steam-cleaning-brisbane', 'bond-back-guarantee'],
    cta: { h2: 'The first thing they open, done right.', p: 'Send a photo of the oven for a fixed price.' },
    areasIntro: 'Oven and rangehood cleaning in all 20 suburbs, on its own or with your bond clean.',
  },

  // ---------------------------------------------------------------------------
  // Tier 2 · Window, track & blind cleaning
  {
    slug: 'window-cleaning-brisbane',
    tier: 2,
    short: 'Tracks, sills, flyscreens and blinds',
    icon: 'window',
    intro: `<p>Window tracks and sliding door tracks are among the most common items on a bond claim. We clean glass inside and out where it's safe to reach, vacuum and wipe tracks, wash fly screens and dust blinds slat by slat.</p>
<p>Our window cleaning in Brisbane is part of every bond clean, and bookable on its own for renters, sellers and owners. Detailed blind washing is {price:blindsDetail} a room, quoted within {replyTime}.</p>`,
    heroPhoto: 'cupboard',
    heroAlt: 'Window cleaning Brisbane is part of our bond clean, shown here with a stained under-sink cupboard before and after end of lease cleaning in Brisbane',
    photos: ['cupboard', 'fan'],
    problem: {
      h2: 'The tracks nobody looks at until the agent does',
      quotes: ['"Every window track was on the list. I didn\'t even know you were meant to clean them."'],
      paras: [
        "Window tracks collect dust, dead insects and, in Brisbane's humidity, mould. They're easy to miss when you're cleaning a whole house, and easy for an agent to check: they just slide the window open.",
        "Glass is the other trap. Streaks show up in the afternoon sun, especially on big sliding doors and balcony glass.",
      ],
    },
    included: {
      h2: 'Window tracks cleaning, glass and blinds',
      groups: [
        { h3: 'Tracks and sills', items: ['Tracks vacuumed, then scrubbed with a detail brush', 'Wiped dry, corners and drainage holes cleared', 'Sills and frames wiped'] },
        { h3: 'Sliding doors', items: ['Glass both sides', 'Tracks, runners and seals'] },
        { h3: 'Fly screens cleaning', items: ['Removed where possible and washed', 'Frames wiped and refitted'] },
        { h3: 'Blind cleaning', items: ['Venetian: slat by slat', 'Roller: wiped and spot cleaned', 'Vertical: each blade and the headrail'] },
        { h3: 'Interior & exterior window cleaning', items: ['Inside all glass', 'Outside from the ground or balcony where safe'] },
      ],
    },
    sections: [
      {
        id: 'mould',
        eyebrow: 'Brisbane humidity',
        h2: 'Mould on window frames and seals',
        html: '<p>Black spots on window seals and frames are common in Brisbane, especially in bedrooms and bathrooms that don\'t get much air. Surface mould on frames, tracks and rubber seals is part of our clean. If mould is coming from a leak or a building fault, that\'s a maintenance issue for the owner, and we\'ll note it in your report.</p>',
        bg: 'bg',
      },
      {
        id: 'safe-reach',
        eyebrow: 'Safe-reach policy',
        h2: 'Exterior glass: what we can and can\'t reach',
        html: `<p>We clean outside glass from the ground, a balcony or a low step ladder. We don't clean glass that needs rope access, high ladders on sloping ground, or reaching over a balcony edge. Exterior windows on upper storeys of highsets and apartments usually fall into that group, and we'll say so on your quote. Agents generally don't expect tenants to clean glass they can't safely reach.</p>`,
      },
    ],
    price: {
      h2: 'Window cleaning prices',
      html: '<p>Tracks, sills, inside glass and blind dusting are included in every bond clean. Detailed slat-by-slat blind washing is {price:blindsDetail} per room. Windows-only visits for sellers or owners are quoted from photos.</p>',
    },
    faqs: [
      { id: 'wi1', q: 'Do you clean window tracks and sills?', a: "Yes, vacuumed, scrubbed and wiped. They're one of the most common items on agents' lists." },
      { id: 'wi2', q: 'Do you clean outside windows?', a: 'Yes, where they can be reached safely from the ground or a balcony.' },
      { id: 'wi3', q: 'Do you clean flyscreens?', a: 'Yes, removed where possible and washed.' },
      { id: 'wi4', q: 'Can you remove mould from window frames?', a: 'Yes, surface mould on frames and seals.' },
      { id: 'wi5', q: 'Are blinds included?', a: 'Blinds are dusted as standard. Detailed slat-by-slat washing is [an add-on].' },
      ...pick('F7'),
    ],
    related: ['end-of-lease-cleaning-brisbane', 'pet-owner-bond-cleaning-brisbane', 'carpet-steam-cleaning-brisbane', 'bond-back-guarantee'],
    cta: { h2: 'Tracks, sills and glass: off the list.', p: 'Get a fixed price for your bond clean, windows included.' },
    areasIntro: 'Window and track cleaning in every suburb we clean.',
  },

  // ---------------------------------------------------------------------------
  // Tier 2 · Wall washing & spot cleaning
  {
    slug: 'wall-washing-brisbane',
    tier: 2,
    short: 'Spot cleaning included, full washing priced up front',
    icon: 'wall',
    intro: `<p>Scuffs, fingerprints and marks around light switches are included in every bond clean as spot cleaning. Full wall washing is an add-on for smoke-affected, greasy or heavily marked walls.</p>
<p>Our wall washing in Brisbane is priced per room from {price:wallRoom}, agreed from your photos within {replyTime} and never added on the day.</p>`,
    heroPhoto: 'laundry',
    heroAlt: 'Wall washing Brisbane: laundry floor and walls before and after a bond clean in Brisbane',
    photos: ['laundry', 'cupboard'],
    problem: {
      h2: 'The surprise wall charge',
      quotes: ['"Halfway through, they said the walls would be another $450."'],
      paras: [
        "Walls are where a lot of on-the-day price jumps happen. The cleaner arrives, points at the hallway and says the walls aren't included. You're out of time, so you pay.",
        "We sort it out from your photos instead. If your walls need more than spot cleaning, we say so on the quote, with the price, before you book.",
      ],
    },
    included: {
      h2: 'Wall spot cleaning vs full wall washing',
      groups: [
        { h3: 'Spot clean walls (included)', items: ['Scuffs and marks at hand height', 'Light switches, power points and door surrounds', 'Fingerprints around handles'] },
        { h3: 'Full wall wash (add-on)', items: ['Every wall washed top to bottom', 'Nicotine and grease film removed', 'Ceilings in kitchens and bathrooms'] },
      ],
    },
    sections: [
      {
        id: 'what-lifts',
        eyebrow: 'What comes off',
        h2: 'Crayon, scuffs, paint and what can\'t be cleaned',
        html: `${ticks(['Scuffs and shoe marks: usually lift', 'Crayon and pencil: usually lift with the right product', 'Grease near the stove and fingerprints: lift', 'Nicotine film: lifts with a full wall wash, sometimes needs two passes', 'Pen and permanent marker: often fade but stay', 'Flat or matt paint that rubs off when cleaned: needs a touch-up, not a clean'])}<p>Some marks need repainting rather than cleaning. If we think a mark will make the paint worse, we stop and tell you.</p>`,
        bg: 'bg',
      },
      {
        id: 'agreed',
        eyebrow: 'Agreed up front',
        h2: 'Never added mid-clean',
        html: "<p>If you didn't book a wall wash, you won't be charged for one. If our crew spots walls that need more than a spot clean, they'll show you, and you decide in writing before anything extra is done. You can always say no.</p>",
      },
    ],
    price: {
      h2: 'Wall wash prices',
      html: '<p>Spot cleaning: included. Full wall washing: {price:wallRoom} per room. Smoke-affected properties are quoted from photos, because the work varies a lot.</p>',
    },
    faqs: [
      { id: 'wa1', q: 'Is wall cleaning included in a bond clean?', a: 'Spot cleaning of marks, scuffs and light switches is included. Full wall washing is an add-on, priced before we start.' },
      { id: 'wa2', q: 'Will you charge extra for walls on the day?', a: 'No. If walls need more than spot cleaning, we tell you from your photos and agree it in writing before the clean.' },
      { id: 'wa3', q: 'Can you remove crayon and scuff marks?', a: 'Most, yes. Some marks need repainting rather than cleaning.' },
      { id: 'wa4', q: 'Do you wash smoke-stained walls?', a: 'Yes, full wall washing handles nicotine and grease film.' },
      { id: 'wa5', q: 'Will cleaning damage the paint?', a: 'We test first and use gentle methods suited to the paint finish.' },
      ...pick('F1'),
    ],
    related: ['end-of-lease-cleaning-brisbane', 'pet-owner-bond-cleaning-brisbane', 'carpet-steam-cleaning-brisbane', 'bond-back-guarantee'],
    cta: { h2: 'Walls priced before we arrive.', p: 'Send a photo of the worst wall and we\'ll tell you what it needs.' },
    areasIntro: 'Wall spot cleaning and washing across all 20 suburbs.',
  },

  // ---------------------------------------------------------------------------
  // Tier 2 · Pressure washing, balcony & garage
  {
    slug: 'pressure-washing-brisbane',
    tier: 2,
    short: 'Patios, balconies, driveways and garages',
    icon: 'hose',
    intro: `<p>Patios, balconies, driveways and garage floors are often on the exit report, and outdoor areas count. We pressure wash hard surfaces and sweep and clean garages so the outside matches the inside.</p>
<p>Our pressure cleaning in Brisbane is an add-on to a bond clean for house and townhouse renters, and for sellers before listing. Priced up front from {price:pressure}, quoted from photos within {replyTime}.</p>`,
    heroPhoto: 'laundry',
    heroAlt: 'Pressure cleaning Brisbane add-on: laundry floor and walls before and after a bond clean in Brisbane',
    photos: ['laundry'],
    problem: {
      h2: 'Outdoor areas forgotten until the agent\'s list',
      quotes: ['"We cleaned the whole house and the agent flagged the patio and the garage."'],
      paras: [
        "When you're cleaning a house, outdoor areas are the last thing on the list and the first to be dropped. But the exit condition report covers the patio, the alfresco, the garage and the driveway too.",
        "Brisbane's wet season leaves black mould on pavers and paths, and garages collect oil and dust. Both show up clearly at inspection.",
      ],
    },
    included: {
      h2: 'Surfaces we clean',
      groups: [
        { h3: 'Patio cleaning', items: ['Tiles and pavers, grout lines', 'Alfresco floors and outdoor kitchens'] },
        { h3: 'Driveway cleaning', items: ['Concrete and exposed aggregate', 'Paths and steps'] },
        { h3: 'Garage cleaning', items: ['Swept, cobwebs down, floor washed', 'Oil stains treated where possible'] },
        { h3: 'Balcony cleaning', items: ['Tiles and drains', 'Glass and rails'] },
      ],
    },
    sections: [
      {
        id: 'exit-report',
        eyebrow: 'On the exit report',
        h2: 'What agents check outside',
        html: `<p>If an area is part of the property you rented, it's part of the inspection. Agents typically walk the patio, open the garage, look at the driveway for oil marks and check balcony drains. We put each outdoor area on your quote as a separate line, so you can see exactly what's booked.</p>`,
        bg: 'bg',
      },
      {
        id: 'safe',
        eyebrow: 'Methods',
        h2: 'High pressure water cleaning, used carefully',
        html: `${ticks(['Pressure set to the surface, so pavers and grout aren\'t damaged', 'Apartment balconies cleaned with low-water methods that don\'t flood neighbours below', 'Water-wise: we sweep and pre-treat first to use less water', 'Run-off kept out of stormwater where we can'])}`,
      },
    ],
    price: {
      h2: 'Pressure washing prices',
      html: '<p>From {price:pressure} for a typical patio or driveway, {price:garage} for a single garage, and {price:balcony} for a balcony. All add-ons are priced on your quote before the clean.</p>',
    },
    faqs: [
      { id: 'pw1', q: 'Do I have to clean the patio when I move out?', a: "If it's part of the property, yes, back to its starting condition." },
      { id: 'pw2', q: 'Do you pressure wash driveways?', a: 'Yes, concrete, pavers and tiles.' },
      { id: 'pw3', q: 'Do you clean garage floors?', a: 'Yes, swept and washed, with oil stains treated where possible.' },
      { id: 'pw4', q: 'Can you clean balconies in apartments?', a: "Yes, with methods that don't flood neighbours below." },
      { id: 'pw5', q: 'Is pressure washing included in a bond clean?', a: "No, it's an add-on, priced up front." },
    ],
    related: ['end-of-lease-cleaning-brisbane', 'house-bond-cleaning-brisbane', 'carpet-steam-cleaning-brisbane', 'bond-back-guarantee'],
    cta: { h2: 'Make the outside match the inside.', p: 'Add outdoor areas to your bond clean quote.' },
    areasIntro: 'Pressure washing for houses and townhouses across these 20 suburbs.',
  },
];
