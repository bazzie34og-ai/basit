import type { ServiceKey } from '../config/site';
import { business, honesty, leatherCleaning, caravanAreas, tenancyExtras } from '../config/site';

export interface Block { h2: string; body: string[]; list?: string[] }
export interface ServicePage {
  key: ServiceKey;
  title: string; // ≤ 60
  description: string; // ≤ 155
  h1: string; // use *word* for the one italic phrase
  lede: string;
  photo?: { key: string; caption: string; alt: string };
  pairKeys?: string[];
  includes: string[];
  blocks: Block[];
  faq: { q: string; a: string }[];
}

const HWE = 'Hot water extraction: we spray hot water and cleaning solution deep into the fibres, then suck it straight back out with the dirt.';
const PRE = 'Pre-treatment: a cleaning solution matched to the stain, left to work for a few minutes before the main clean.';

export const servicePages: Record<string, ServicePage> = {
  carpet: {
    key: 'carpet',
    title: 'Carpet Cleaning Cardiff | Hot Water Extraction',
    description: 'Carpet cleaning in Cardiff and Newport. Deep hot water extraction, stains pre-treated, furniture moved. WhatsApp a photo for a fixed price.',
    h1: 'Carpet cleaning in Cardiff, *done properly*',
    lede: 'Lounges, bedrooms, hallways, stairs and landings. We take out the dirt that hoovering leaves behind, treat the stains, and leave your carpets fresh and soft underfoot.',
    photo: { key: 'hallway-carpet-drying-air-movers', caption: 'Hallway · after extraction', alt: 'A freshly cleaned hallway carpet drying with air movers in place' },
    pairKeys: ['hallway'],
    includes: [
      'A walk round with you first, to agree the plan and the price',
      'Furniture moved and put back, edges and skirting protected',
      'Pre-treatment of stains and high-traffic areas',
      'Deep hot water extraction across the whole carpet',
      'Air movers to speed up drying where needed',
      'Aftercare tips before we leave',
    ],
    blocks: [
      {
        h2: 'How we clean a carpet',
        body: [
          'Hoovering lifts what sits on top. The grit, skin, pet hair and old spills that sink to the bottom of the pile stay there, and that is what makes a carpet look flat and grey over time.',
          `We start with a pre-treatment on stains and the busy walkways. ${PRE}`,
          `Then we go over every part of the carpet with hot water extraction. ${HWE} The dirty water goes into our machine, not back into your carpet.`,
          'You’ll see the stripes the wand leaves as it passes. They brush out as the pile dries and settles.',
        ],
      },
      {
        h2: 'Rooms, stairs and hallways',
        body: [
          'We clean single rooms, whole houses, or just the bit that gets the most traffic. Hallways and stairs take the heaviest wear in most homes, so many people start there.',
          'Stairs are cleaned step by step with a hand tool, because a big floor wand can’t reach into the corners of each tread.',
        ],
      },
      {
        h2: 'What to expect, honestly',
        body: [
          honesty.oldCarpets + ' Worn, flattened areas come up brighter and cleaner, but cleaning can’t put back fibres that have gone.',
          honesty.patchTest,
          `Most carpets are dry to walk on in ${business.dryingTime}. We’ll tell you on the day what to expect for yours.`,
        ],
      },
    ],
    faq: [
      { q: 'Do you clean carpets on stairs?', a: 'Yes. Stairs and landings are cleaned step by step with a hand tool so we reach the edges and the back of each tread. Many people book a hallway, stairs and landing together.' },
      { q: 'Will my carpet shrink?', a: 'Not with the right method. We use a controlled amount of water and extract it straight back out. We check the carpet type first, and if something needs a gentler approach, we say so.' },
      { q: 'Can you get rid of traffic lanes?', a: 'Grey walkways are usually trapped dirt, and they often lift a lot. If the pile itself is worn or crushed, it will be cleaner and brighter but may still show the path.' },
    ],
  },

  stairs: {
    key: 'stairs',
    title: 'Stair Carpet Cleaning Cardiff | Stairs & Landing',
    description: 'Stairs, landing and hallway carpet cleaning in Cardiff. Each step cleaned by hand tool, stains treated, fast drying. Fixed price from a photo.',
    h1: 'Stairs, landing & hallway carpets, *step by step*',
    lede: 'The stairs and hallway are the busiest carpet in most homes. Every visitor, every school run, every muddy dog walks over them. They are also the hardest to clean well, which is why we do them by hand.',
    pairKeys: ['stairs1', 'stairs2'],
    includes: [
      'Each tread and riser cleaned with a hand tool',
      'Edges and the back of each step reached properly',
      'Pre-treatment for scuffs, mud and footfall marks',
      'Landing and hallway cleaned with the floor wand',
      'Bannisters and skirting protected while we work',
    ],
    blocks: [
      {
        h2: 'Why stairs need a different approach',
        body: [
          'A big floor wand is made for open rooms. On a stair it misses the corners and the nosing, which is the front edge of each step where wear shows first.',
          `So we use a smaller hand tool on every step. ${HWE}`,
          'It takes longer, and it is the difference between a stair that looks done and one that is properly clean.',
        ],
      },
      {
        h2: 'Victorian terraces, long hallways',
        body: [
          'Many homes around Cardiff and Newport have long, narrow hallways leading straight to the stairs. That strip of carpet takes every footstep in the house. We pay extra attention to the first few feet inside the door and the bottom steps, where grit gets ground in.',
        ],
      },
      {
        h2: 'Drying and getting back to normal',
        body: [
          `Stairs usually dry quickly because there is less carpet per step. Most are fine to walk on in ${business.dryingTime}. If you need to use them sooner, socks are fine, outdoor shoes are not.`,
          'We can set up an air mover at the bottom of the stairs to keep the air moving up through the house.',
        ],
      },
    ],
    faq: [
      { q: 'How long does a stairs and landing clean take?', a: 'A standard staircase and landing usually takes around an hour. We’ll give you a time with your quote.' },
      { q: 'Can we still use the stairs while they dry?', a: 'Yes, carefully, in socks or clean slippers. Avoid outdoor shoes until the carpet is fully dry.' },
      { q: 'Can you clean just the stairs?', a: 'Yes. Plenty of people book only the stairs, landing and hallway, since that’s where the wear shows first.' },
    ],
  },

  sofa: {
    key: 'sofa',
    title: 'Sofa Cleaning Cardiff | Upholstery & Armchairs',
    description: 'Sofa and upholstery cleaning in Cardiff and Newport. Fabric sofas, corner sofas, armchairs. Patch-tested first. WhatsApp a photo for a fixed price.',
    h1: 'Sofa & upholstery cleaning, *patch-tested first*',
    lede: 'Fabric sofas, corner sofas, armchairs and footstools. The seat you sit in every evening collects more than you think. We lift it out gently and leave the fabric fresh, soft and clean.',
    includes: [
      'Check of the fabric label and a patch test on a hidden spot',
      'Hoover of seats, backs, arms and the gaps between',
      'Pre-treatment of marks, drink spills and grubby arms',
      'Gentle hot water extraction matched to the fabric',
      'Cushions cleaned on all sides you can see',
      'Tips for drying and plumping before we go',
    ],
    blocks: [
      {
        h2: 'We patch-test every fabric first',
        body: [
          'Not every fabric likes water. Some marks set, some colours run, and some fibres change texture. Before we start, we read the care label and test a hidden spot, such as the back of a cushion or underneath a seat.',
          honesty.patchTest + ' If a fabric isn’t safe to wet-clean, we tell you before we start.',
        ],
      },
      {
        h2: 'Corner sofas, armchairs and footstools',
        body: [
          `Corner sofas take longer than a two-seater, and we price them on the photo you send. Armchairs, footstools and dining chairs can be added to the same visit. ${HWE}`,
          leatherCleaning === true
            ? 'We also clean and condition leather sofas.'
            : 'Leather is a different job with different products. Send us a photo and we’ll tell you honestly whether it’s something we can help with.',
        ],
      },
      {
        h2: 'Pets, kids and everyday life',
        body: [
          'Grubby arms, food, drink, pet hair and the smell a dog leaves on its favourite seat all respond well. Our solutions are rinsed out, so nothing sticky is left behind to attract dirt again.',
          'Upholstery is usually dry in a few hours. Leave the windows open or the heating on low, and keep pets off until it’s dry.',
        ],
      },
    ],
    faq: [
      { q: 'Can you clean a corner sofa?', a: 'Yes. Send a photo of the whole sofa and one of the fabric label if you can find it, and we’ll give you a fixed price.' },
      { q: 'Will the cushions come off?', a: 'Zip-off covers can shrink if they are washed separately, so cleaning them on the sofa is usually safer. We’ll check yours on the day.' },
      { q: 'How long until we can sit on the sofa?', a: 'Usually a few hours. Put a clean towel down if you need to sit on it sooner, and keep pets off until it’s fully dry.' },
    ],
  },

  mattress: {
    key: 'mattress',
    title: 'Mattress Cleaning Cardiff | Stains & Odours',
    description: 'Mattress cleaning in Cardiff and Newport for a healthier, fresher sleeping environment. Stains, sweat marks and odours treated. Photo quotes.',
    h1: 'Mattress cleaning for a *fresher* night’s sleep',
    lede: 'We spend a third of our lives in bed, and a mattress soaks up sweat, skin, spills and accidents. A deep clean gives you a healthier, fresher sleeping environment, without buying a new one.',
    includes: [
      'Thorough hoover of the top, sides and seams',
      'Pre-treatment of stains, sweat marks and accidents',
      'Low-moisture hot water extraction so it dries faster',
      'Odour treatment where needed',
      'Advice on airing and drying before you make the bed',
    ],
    blocks: [
      {
        h2: 'What builds up in a mattress',
        body: [
          'Every night we shed skin and sweat into the mattress. Dust mites live on that skin, and their droppings are a common trigger for people with allergies. Spills, nappy leaks and children’s accidents add to it.',
          'Hoovering removes some of what sits on top. Cleaning reaches further and treats the marks and smells properly.',
        ],
      },
      {
        h2: 'How we clean it',
        body: [
          `We hoover first, then pre-treat any marks. ${PRE}`,
          `Then we use hot water extraction with less water than we’d use on a carpet. ${HWE} Using less water means the mattress dries faster and the inside stays dry.`,
        ],
      },
      {
        h2: 'Honest expectations',
        body: [
          'Fresh stains and general dullness usually lift well. Old yellowing from sweat often improves a lot but may not disappear completely. We’ll tell you what to expect before we start.',
          'Allow the mattress to dry fully before you put sheets back on. On a warm day with a window open, that is usually a few hours.',
        ],
      },
    ],
    faq: [
      { q: 'Does cleaning get rid of dust mites?', a: 'Cleaning removes much of the dust, skin and debris dust mites live on. It helps, but no clean makes a mattress permanently mite-free. Washing bedding hot and airing the room helps keep it that way.' },
      { q: 'Can you clean a child’s mattress after accidents?', a: 'Yes. We treat urine at the source to deal with the smell, not just the mark. Tell us how old the accidents are when you message, as it helps us plan.' },
      { q: 'When can I sleep on it?', a: 'Once it’s dry, which is usually a few hours. We use a low-moisture method so it dries the same day.' },
    ],
  },

  rug: {
    key: 'rug',
    title: 'Rug Cleaning Cardiff | Wool & Shaggy Rugs',
    description: 'Rug cleaning in Cardiff and Newport. Restore colour, remove dirt and revive your rugs, including wool and shaggy rugs. Fixed price from a photo.',
    h1: 'Rug cleaning to *revive* colour and feel',
    lede: 'Restore colour, remove dirt and revive your rugs. From a modern shaggy rug to a wool rug you inherited, we clean them in your home and tell you honestly what to expect.',
    includes: [
      'A look at the fibre, backing and fringe before we start',
      'Patch test for colour fastness',
      'Thorough dry soil removal, the grit you can’t see',
      'Pre-treatment and a gentle extraction clean',
      'Fringes cleaned and groomed where possible',
      'Laid flat to dry with airflow',
    ],
    blocks: [
      {
        h2: 'Wool, shaggy and synthetic rugs',
        body: [
          'Wool is hard-wearing and naturally resists dirt, but it doesn’t like too much heat or the wrong solution. Shaggy rugs hold a surprising amount of grit deep in the pile. Synthetic rugs are usually the easiest to clean.',
          `We check what your rug is made of and adjust the method. ${HWE}`,
        ],
      },
      {
        h2: 'Colour run, and why we test first',
        body: [
          'Some rugs, especially hand-dyed ones, can bleed colour when wet. We test a hidden corner first. If the colours aren’t stable, we tell you and suggest what we can safely do instead.',
          honesty.patchTest,
        ],
      },
      {
        h2: 'Drying',
        body: [
          'Rugs dry best flat, with air moving over and under them. Thicker rugs take longer than thin ones. We’ll tell you on the day, and leave you tips on how to dry it at home.',
        ],
      },
    ],
    faq: [
      { q: 'Do you clean rugs in my home?', a: 'Yes. We clean rugs on site, usually on a protected hard floor or a sheet so the floor underneath stays dry.' },
      { q: 'Can you clean a shaggy rug?', a: 'Yes. Shaggy rugs hold a lot of grit, so we spend more time on dry soil removal before the wet clean. They take longer to dry than flat rugs.' },
      { q: 'Can you clean antique or silk rugs?', a: 'Send us a photo and the label if there is one. Some rugs need specialist care, and if yours does, we’ll say so rather than risk it.' },
    ],
  },

  stain: {
    key: 'stain',
    title: 'Pet Odour Removal Carpet Cardiff | Stains & Smells',
    description: 'Pet odour and stain removal in Cardiff. Dog urine, coffee, red wine and more, treated at the source. Honest about what will come out. Photo quotes.',
    h1: 'Stain & odour removal, *treated at the source*',
    lede: 'Pet accidents, coffee, tea, red wine, makeup, mud. Some stains lift easily, some take work, and some won’t fully go. We tell you which is which before we start.',
    includes: [
      'Identifying the stain and what it’s on',
      'A patch test on the fibre',
      'Stain-specific pre-treatment, left to work',
      'For pet urine: treatment that reaches the underlay',
      'Hot water extraction to rinse out the stain and the product',
      'An honest note on anything that may stay',
    ],
    blocks: [
      {
        h2: 'Why pet smells come back',
        body: [
          'When a dog or cat has an accident, the urine goes through the carpet into the underlay. Wiping the top cleans the surface. The rest dries into salts underneath, and on a damp day, those salts release the smell again.',
          'A proper treatment reaches the underlay and breaks down what is causing the smell. Perfumed sprays only cover it for a while.',
          `Then we rinse the area with hot water extraction. ${HWE}`,
        ],
      },
      {
        h2: 'Coffee, tea, wine and the rest',
        body: [
          'Coffee and tea usually lift well, especially if they are recent. Red wine often improves a lot. Black nail varnish and dye-based stains are the hardest, and we always patch-test before trying.',
          'The full list is in our stain index, with what you can safely do before we arrive.',
        ],
      },
      {
        h2: 'What not to do before we arrive',
        body: [
          'Don’t rub, as it spreads the stain and frays the fibres. Blot with a white cloth instead. Avoid bleach and strong household sprays: they can strip colour and make a stain permanent.',
        ],
      },
    ],
    faq: [
      { q: 'Can you get rid of dog urine smell from carpet?', a: 'In most cases the smell improves a lot because we treat the underlay, not just the surface. Very old, repeated accidents can leave a mark or need the underlay replacing. We’ll be honest about that.' },
      { q: 'Will the stain come back after cleaning?', a: 'Stains come back when residue is left deep in the carpet and wicks up as it dries. We rinse thoroughly to avoid that. If anything does reappear, message us.' },
      { q: 'Is the treatment safe for my pets?', a: 'Our solutions are pet and child friendly. Keep pets off the area until it’s dry.' },
    ],
  },

  tenancy: {
    key: 'tenancy',
    title: 'End of Tenancy Cleaning Cardiff | Carpets & Deep Clean',
    description: 'End of tenancy cleaning in Cardiff and Newport for tenants, landlords and letting agents. Carpets, kitchens, bathrooms. Photo report and invoice.',
    h1: 'End of tenancy cleaning, *with the evidence*',
    lede: 'For tenants moving out, landlords between lets, and letting agents who need it done right first time. Carpets, kitchens, bathrooms, or the whole property.',
    // TODO-CONFIRM: owner to confirm the end of tenancy checklist
    includes: [
      'Carpet cleaning in every room, stairs and landing',
      'Kitchen deep clean, including the oven, hob and cupboards',
      'Bathroom deep clean: limescale, grout, glass and fittings',
      'Skirting, doors, switches and window sills',
      ...(tenancyExtras.photoReport ? ['A before and after photo report'] : []),
      ...(tenancyExtras.itemisedInvoice ? ['An itemised invoice for your deposit or inventory clerk'] : []),
    ],
    blocks: [
      {
        h2: 'For tenants: getting your deposit back',
        body: [
          'Carpets and kitchens are what inventory clerks check first. Marks on carpets, grease on the hob and limescale in the bathroom are the most common reasons for deductions.',
          'We clean to the standard a check-out inspection looks for, and give you the paperwork to show it was done professionally.',
        ],
      },
      {
        h2: 'For landlords and letting agents',
        body: [
          'Between tenants, time matters. Send us the address, access details and a few photos. We give you a fixed price, collect or meet for the keys, and send photos when it’s done.',
          '“Stains from previous tenants” are the hardest to predict. We test, treat and tell you which marks are permanent, so you can decide what to do next.',
        ],
      },
      {
        h2: 'Carpets only, or the whole property',
        body: [
          `Many tenancy agreements ask for carpets to be professionally cleaned. ${HWE} If you’d rather clean the rest yourself, we can just do the carpets.`,
        ],
      },
    ],
    faq: [
      { q: 'Will this guarantee I get my deposit back?', a: 'No one can promise that, because your landlord or agent decides. What we can do is clean to inspection standard and give you photos and an itemised invoice as evidence.' },
      { q: 'Do I need to be there?', a: 'No. Lots of tenants and landlords leave us a key or arrange a key safe. We send photos when we’re done.' },
      { q: 'Can you work around the check-out date?', a: 'Tell us the date when you message. We’ll fit around it where we can, and we have short-notice slots when they’re available.' },
    ],
  },

  deep: {
    key: 'deep',
    title: 'Deep Cleaning Cardiff | One-Off Kitchen & Bathroom',
    description: 'One-off deep cleaning in Cardiff and Newport. Kitchens, bathrooms or the whole home, plus steam cleaning for carpets and sofas. Fixed photo quotes.',
    h1: 'One-off deep cleaning, *top to bottom*',
    lede: 'A kitchen that needs more than a wipe, a bathroom with limescale that won’t shift, or a whole home before guests, a new baby or a move. We do the jobs a regular clean doesn’t reach.',
    // TODO-CONFIRM: owner to confirm the deep clean checklist
    includes: [
      'Kitchens: oven, hob, extractor, cupboard fronts, tiles and sink',
      'Bathrooms: limescale, grout, glass, taps and the toilet base',
      'Skirting, doors, handles, switches and sills',
      'Carpets and sofas can be added to the same visit',
    ],
    blocks: [
      {
        h2: 'Kitchens and bathrooms',
        body: [
          'Grease builds up on the hob, the extractor and the tops of cupboards. Limescale builds up around taps and shower screens. These take time, the right products and patience, which is what a deep clean is for.',
          'We work room by room and you can walk round with us at the end.',
        ],
      },
      {
        h2: 'Steam cleaning and extraction',
        body: [
          `For carpets, rugs and sofas we use hot water extraction. ${HWE} People often call this “steam cleaning”, and it’s the method most carpet cleaners use.`,
        ],
      },
      {
        h2: 'Who books a deep clean',
        body: [
          'People moving in or out, people preparing a home for sale, families before a new arrival, and anyone who just wants a fresh start. Tell us what matters most and we’ll quote for exactly that.',
        ],
      },
    ],
    faq: [
      { q: 'What’s the difference between a deep clean and a regular clean?', a: 'A regular clean keeps things tidy. A deep clean goes after the build-up: grease, limescale, grime in corners and behind things. It takes longer and is usually a one-off.' },
      { q: 'Do you bring your own products and equipment?', a: 'Yes. We bring everything, including the machines. We just need access to water and a plug socket.' },
      { q: 'Can I add carpets or a sofa?', a: 'Yes. Send photos of everything you want done and we’ll give you one fixed price for the visit.' },
    ],
  },

  caravan: {
    key: 'caravan',
    title: 'Caravan Cleaning South Wales | Holiday Homes',
    description: 'Caravan and holiday home cleaning across South Wales. Upholstery, carpets and a full clean between seasons or guests. WhatsApp a photo for a price.',
    h1: 'Caravan & holiday home cleaning, *between seasons*',
    lede: 'Static caravans and holiday homes get heavy use for a few months, then sit closed up. We clean the upholstery, carpets and surfaces so it’s fresh for you, your family or your next guests.',
    includes: [
      'Upholstery: built-in seating, cushions and bed bases',
      'Carpets and rugs',
      'Kitchen and shower room clean',
      'Mattresses on request',
    ],
    blocks: [
      {
        h2: 'Damp, sand and sun cream',
        body: [
          'Caravans pick up sand, damp, sun cream and the smell of a closed-up space. Built-in seating is hard to take apart and wash, so it’s usually what needs us most.',
          `We clean upholstery and carpets with hot water extraction, using less water so it dries faster in a small space. ${HWE}`,
        ],
      },
      {
        h2: 'Where we go',
        body: [
          caravanAreas.length
            ? `We currently clean caravans and holiday homes at ${caravanAreas.join(', ')}.`
            : 'Send your park or postcode with your photos and we’ll tell you if we can get to you.',
          'If you’re not there, we can arrange access with the park office or a key safe.',
        ],
      },
    ],
    faq: [
      { q: 'Can you clean while I’m not at the caravan?', a: 'Yes, if access can be arranged with the park or a key safe. We send photos when we’re done.' },
      { q: 'How long will the seating take to dry?', a: 'Usually a few hours with a window open. Small spaces dry faster with airflow, so we leave the windows open while we work where it’s safe to.' },
    ],
  },

  commercial: {
    key: 'commercial',
    title: 'Office Carpet Cleaning Cardiff | Commercial Cleaning',
    description: 'Office carpet cleaning and commercial cleaning in Cardiff and Newport. Offices, rentals and shared spaces, booked around your hours. Fixed quotes.',
    h1: 'Office & commercial carpet cleaning, *around your hours*',
    lede: 'Offices, rental properties, shared hallways and small business premises. We clean carpets and upholstery at times that suit you, so your team and customers aren’t disturbed.',
    includes: [
      'Office carpets, entrances and corridors',
      'Upholstered chairs and reception seating',
      'Rental and Airbnb turnovers',
      'Early, late or weekend slots where available',
    ],
    blocks: [
      {
        h2: 'Busy floors need deeper cleans',
        body: [
          'Office carpets take far more footfall than a home. Grit from outside wears the fibres, and coffee spills collect around desks. Regular hoovering keeps it tidy, but the ground-in dirt needs extraction.',
          `${HWE} Commercial carpet tiles usually dry quickly, so you can be back at work the same day.`,
        ],
      },
      {
        h2: 'Rentals and short lets',
        body: [
          'For landlords with rental flats or holiday lets, we can clean carpets and sofas between guests and send photos so you know it’s done.',
        ],
      },
    ],
    faq: [
      { q: 'Can you clean outside office hours?', a: 'Tell us what suits you when you message. We fit early mornings, evenings and weekends where we can.' },
      { q: 'Do you provide invoices for businesses?', a: 'Yes. Tell us what you need on the invoice when you book.' },
    ],
  },

  exterior: {
    key: 'exterior',
    title: 'Patio Cleaning Cardiff | Skylight & Glass Cleaning',
    description: 'Patio, path and skylight glass cleaning in Cardiff and Newport. Moss, algae and grime removed. WhatsApp a photo for a fixed price.',
    h1: 'Patio, path & skylight *cleaning*',
    lede: 'Green, slippery patios and paths, and skylights that let in less light every year. We clean them back and tell you honestly how long it’s likely to stay that way.',
    pairKeys: ['patio', 'skylight'],
    includes: ['Patios and paths', 'Skylight and glass roof cleaning', 'Rinse-down of surrounding areas'],
    blocks: [
      {
        h2: 'Patios and paths',
        body: [
          'In the Welsh weather, moss and algae grow on patios quickly, especially in shade. Cleaning lifts it off and makes the surface safer to walk on.',
        ],
      },
      {
        h2: 'Skylights and glass',
        body: ['Skylight glass collects grime and algae you can’t reach from inside. Cleaning it brings back the light.'],
      },
    ],
    faq: [
      { q: 'How long will my patio stay clean?', a: 'It depends on shade and drainage. Shady patios go green faster. We’ll give you tips to slow it down.' },
    ],
  },
};
