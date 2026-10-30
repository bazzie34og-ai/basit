import type { ServiceContent } from '../../lib/types';
import { pick } from '../../data/faqs';
import { ticks, callout, rta, RTA_CARPET } from '../shared';

export const carpet: ServiceContent[] = [
  // ---------------------------------------------------------------------------
  // Tier 2 (ready to book) · Carpet steam cleaning
  {
    slug: 'carpet-steam-cleaning-brisbane',
    tier: 2,
    short: 'Hot water extraction with the receipt',
    icon: 'droplet',
    intro: `<p>In Queensland, carpets must be returned to the condition they were in at the start of your lease. If they were professionally cleaned when you moved in, or you had a pet, expect the agent to ask for a receipt. We steam clean with hot water extraction and give you the receipt. With a bond clean, carpet steam cleaning is {carpet}.</p>
<p>Our end of lease carpet cleaning in Brisbane covers bedrooms, living areas and stairs across the Northside, booked on the same day as your bond clean. Prices are per room from {price:carpetRoom}, quoted in writing within {replyTime}.</p>`,
    heroPhoto: 'carpet',
    heroAlt: 'End of lease carpet cleaning Brisbane: bedroom carpet before and after steam cleaning during a Brisbane bond clean',
    photos: ['carpet'],
    problem: {
      h2: 'Do the carpets really need doing?',
      quotes: ['"The agent just said \'carpets need to be professionally cleaned\'. Do they?"', '"The last carpet cleaner left them soaking wet the night before the inspection."'],
      paras: [
        "Carpet cleaning is the add-on renters are least sure about. Some agents ask for it on every exit, some only when there was a pet, and leases word it differently. Paying for a clean you don't need is annoying; skipping one you do need costs you more.",
        "Then there's the job itself. Carpets left wet, marks that come back as they dry, or no receipt to show the agent. We avoid all three.",
      ],
    },
    included: {
      h2: 'Carpet steam cleaning Brisbane: how we do it',
      groups: [
        { h3: 'Before we start', items: ['Pre-vacuum to lift grit and hair', 'Stains and traffic lanes pre-treated', 'We point out anything that may not lift'] },
        { h3: 'Hot water extraction', items: ['Hot water and rinse injected into the pile', 'Dirt and solution extracted with high suction', 'Edges and corners done by hand tool'] },
        { h3: 'After', items: ['Pile groomed so it dries evenly', 'Furniture pads if anything is moved back', 'Itemised receipt for your agent'] },
      ],
    },
    sections: [
      {
        id: 'qld-rule',
        eyebrow: 'The QLD carpet rule',
        h2: 'Do I have to steam clean carpets when I move out in QLD?',
        html: `<p>Only back to their starting standard. The RTA says carpets must be left in the same condition as at the start of the tenancy, less fair wear and tear. A professional clean can be required if the carpets were professionally cleaned when you moved in, or if you agreed to it in the lease because you had a pet. An agent also can't make you use their carpet cleaner or charge a set fee (${rta(RTA_CARPET, 'RTA: carpet cleaning and pest control')}).</p>${callout('Check your entry condition report and lease for the words "professionally cleaned". If neither mentions it and there was no pet, a thorough vacuum may be enough.')}`,
        bg: 'bg',
      },
      {
        id: 'dry',
        eyebrow: 'Drying time',
        h2: 'How long carpets take to dry, and what to expect',
        html: `<p>Most carpets are dry in {dryCarpet} with windows open or the air-con running. Brisbane's humid summer days slow that down a little, so we usually clean carpets early in the bond clean and leave them to dry while we finish the kitchen and bathrooms. We don't soak carpets, which is what causes slow drying, shrinkage and that damp smell.</p>${ticks(['Walk on them in clean socks only until dry', 'Keep furniture off for a few hours, or use the pads we leave', 'Leave windows open or the air-con on'])}`,
      },
      {
        id: 'receipt',
        eyebrow: 'Proof',
        h2: 'Bond and carpet cleaning Brisbane, with the receipt agents ask for',
        html: "<p>You get an itemised receipt showing the rooms cleaned, the method and the date. It goes in your photo report with before and after shots of the carpets, ready to forward to your property manager. If you book carpets with your bond clean, everything is on one invoice.</p>",
        bg: 'sand',
      },
    ],
    price: {
      h2: 'Carpet cleaning prices',
      html: '<p>Carpet steam cleaning is {carpet}. Stairs, hallways and large living areas are counted as rooms on your quote. Pet treatment for urine and odour is priced separately; see <a href="/pet-stain-odour-removal-brisbane/">pet stain and odour removal</a>.</p>',
    },
    faqs: [
      { id: 'cs1', q: 'Do I have to steam clean the carpets when I move out in QLD?', a: 'Only back to the condition at the start. If they were professionally cleaned at move-in or you agreed to it because of a pet, the agent can ask for it.' },
      { id: 'cs2', q: 'Is carpet cleaning included in the bond clean?', a: '{?freeCarpet}[Yes, free with every full bond clean.]{/freeCarpet}{!freeCarpet}It\'s an add-on from {price:carpetRoom} per room.{/freeCarpet}' },
      { id: 'cs3', q: 'How long do carpets take to dry?', a: 'Usually {dryCarpet} with windows open or the air-con on.' },
      { id: 'cs4', q: 'Will you give me a receipt?', a: 'Yes, an itemised receipt you can forward to your agent.' },
      { id: 'cs5', q: 'Can my agent make me use their carpet cleaner?', a: 'No. In Queensland you can choose your own carpet cleaner.' },
      ...pick('D27'),
    ],
    related: ['end-of-lease-cleaning-brisbane', 'pet-owner-bond-cleaning-brisbane', 'carpet-stain-removal-brisbane', 'pet-stain-odour-removal-brisbane'],
    cta: { h2: 'Carpets done, receipt in hand.', p: 'Add carpets to your bond clean, or book them on their own.' },
    areasIntro: 'Carpet cleaners across North Brisbane: carpet cleaning in every one of these suburbs.',
  },

  // ---------------------------------------------------------------------------
  // Tier 2 · Carpet stain removal
  {
    slug: 'carpet-stain-removal-brisbane',
    tier: 2,
    short: 'Honest advice on what will lift',
    icon: 'droplet',
    intro: `<p>Wine, coffee, makeup, rust and mystery marks. We treat stains before steam cleaning and tell you honestly which ones will lift and which are permanent, so there are no surprises at inspection.</p>
<p>Our carpet stain removal in Brisbane is for renters with a mark the agent will spot, booked on its own or with a carpet steam clean. Spot treatment is included with every carpet clean; stain-only visits are quoted from a photo within {replyTime}.</p>`,
    heroPhoto: 'carpet',
    heroAlt: 'Carpet stain removal Brisbane: bedroom carpet before and after steam cleaning during a Brisbane bond clean',
    photos: ['carpet'],
    problem: {
      h2: 'Paying for stains that never come out',
      quotes: ['"I paid for stain removal and the red wine mark was still there."'],
      paras: [
        "Not every stain can be removed, and a cleaner who promises otherwise is guessing. Bleach spots and some dyes have changed the colour of the fibre itself, so there's nothing left to clean out.",
        "We'd rather tell you that before we start. You see a photo of each stain in your quote with our honest call: likely to lift, likely to fade, or likely to stay.",
      ],
    },
    included: {
      h2: 'Stain removal and spot cleaning carpet',
      groups: [
        { h3: 'Assess', items: ['Test the fibre type: wool, nylon or polyester', 'Identify the stain and how old it is'] },
        { h3: 'Treat', items: ['Matched spotter for each stain type', 'Agitated gently, never scrubbed hard', 'Rinsed and extracted so it doesn\'t wick back'] },
        { h3: 'Report', items: ['Before and after photo of each stain', 'Note of anything that is permanent'] },
      ],
    },
    sections: [
      {
        id: 'guide',
        eyebrow: 'Stain by stain',
        h2: 'What usually comes out, and what might not',
        html: `<div class="table-wrap"><table><thead><tr><th>Stain</th><th>Our honest view</th></tr></thead><tbody>
<tr><td>Red wine</td><td>Fresh: usually lifts. Old and set: usually fades a lot, sometimes a faint shadow stays.</td></tr>
<tr><td>Coffee and tea</td><td>Usually lifts well with a tannin spotter.</td></tr>
<tr><td>Makeup and foundation</td><td>Usually lifts; oily makeup needs a solvent spotter first.</td></tr>
<tr><td>Rust</td><td>Often lifts with a rust remover; very old rust can leave a mark.</td></tr>
<tr><td>Ink and marker</td><td>Depends on the ink. Ballpoint often lifts; permanent marker often fades but stays.</td></tr>
<tr><td>Pet urine</td><td>The mark usually lifts. The smell needs <a href="/pet-stain-odour-removal-brisbane/">enzyme treatment</a>.</td></tr>
<tr><td>Bleach and nail polish remover</td><td>Permanent. The colour has been removed from the fibre, so it needs a carpet repair, not a clean.</td></tr>
</tbody></table></div>`,
        bg: 'bg',
      },
      {
        id: 'permanent',
        eyebrow: 'Honest advice',
        h2: 'If a stain is permanent',
        html: "<p>We'll tell you, and suggest the next step: a patch repair by a carpet layer, or talking to the agent about whether it's on your entry condition report. Spills during the tenancy are usually the tenant's responsibility rather than fair wear and tear, so knowing early gives you time to deal with it.</p>",
      },
    ],
    price: {
      h2: 'Carpet stain removal prices',
      html: '<p>Spot treatment is included in our carpet steam clean ({carpet} with a bond clean). A stain-only visit is quoted from a photo, so you know the price and our honest expectation before we come.</p>',
    },
    faqs: [
      { id: 'st1', q: 'Can every carpet stain be removed?', a: "No. Most food, drink and dirt stains lift, but bleach marks, dyes and old rust can be permanent. We'll tell you honestly before we start." },
      { id: 'st2', q: "Will I be charged for stains you can't remove?", a: "You pay the price agreed up front. We'll say beforehand which stains are likely to stay." },
      { id: 'st3', q: 'Do stains count as fair wear and tear?', a: 'Usually not. Stains from spills are normally the tenant\'s responsibility.' },
      { id: 'st4', q: 'Should I try to remove stains myself first?', a: 'Avoid harsh chemicals or scrubbing. They can set the stain or damage the fibres.' },
      { id: 'st5', q: 'Is stain treatment part of the steam clean?', a: 'Spot treatment is included with our carpet steam clean.' },
    ],
    related: ['carpet-steam-cleaning-brisbane', 'pet-stain-odour-removal-brisbane', 'pet-owner-bond-cleaning-brisbane', 'end-of-lease-cleaning-brisbane'],
    cta: { h2: 'Send a photo of the stain.', p: "We'll tell you honestly whether it will lift, and what it costs." },
    areasIntro: 'Stain removal across all 20 suburbs we clean.',
  },

  // ---------------------------------------------------------------------------
  // Tier 2 · Pet stain & odour removal
  {
    slug: 'pet-stain-odour-removal-brisbane',
    tier: 2,
    short: 'Enzyme treatment so the smell stays gone',
    icon: 'paw',
    intro: `<p>Pet urine soaks below the carpet surface, so a standard steam clean can leave the smell behind. We use an enzyme treatment on affected areas before extraction to break down the source of the odour.</p>
<p>Our pet stain and odour removal in Brisbane is for dog and cat owners before a pet-clause inspection, or anyone living with the smell. Priced per area from a photo, quoted within {replyTime}, usually done with the carpet steam clean.</p>`,
    heroPhoto: 'carpet',
    heroAlt: 'Pet stain and odour removal Brisbane: bedroom carpet before and after steam cleaning during a Brisbane bond clean',
    photos: ['carpet'],
    problem: {
      h2: 'Why the smell comes back',
      quotes: ['"The carpet looked fine after cleaning. Two days later the smell was back."'],
      paras: [
        "Pet urine doesn't stay on top of the carpet. It soaks through the pile into the backing and the underlay, where hot water extraction alone can't reach. As the carpet dries, the smell wicks back up, often after the inspection has been booked.",
        "Pet clauses in Queensland leases often ask for a professional carpet clean at the end. If the agent can still smell it, that clean hasn't done its job.",
      ],
    },
    included: {
      h2: 'Pet odour carpet cleaning, step by step',
      groups: [
        { h3: 'Find it', items: ['UV light to find old urine spots you can\'t see', 'Map the affected areas before we quote'] },
        { h3: 'Break it down', items: ['Enzyme treatment applied deep into the pile', 'Left to dwell so it breaks down the urine salts', 'Hot water extraction to remove it all'] },
        { h3: 'Finish', items: ['Pet hair and pet dander cleaning from carpets, vents and skirting', 'Deodoriser on the treated areas'] },
      ],
    },
    sections: [
      {
        id: 'enzyme',
        eyebrow: 'How enzymes work',
        h2: 'Pet stain removal that treats the source',
        html: "<p>Enzyme cleaners contain proteins that break urine down into simple compounds that can then be rinsed out. They need time to work, which is why we apply them first and extract last. In most homes that removes the smell completely. Where urine has soaked right into the underlay over months, the underlay may need replacing, and we'll tell you before you pay for something that won't fix it.</p>",
        bg: 'bg',
      },
      {
        id: 'bundle',
        eyebrow: 'One booking',
        h2: 'Part of the pet owner bond clean',
        html: '<p>Leaving a rental with a pet? Our <a href="/pet-owner-bond-cleaning-brisbane/">pet owner bond clean</a> bundles the bond clean, carpet steam clean, pet odour treatment and flea treatment by a licensed partner, with every receipt your agent asks for.</p>',
        component: 'packages',
      },
    ],
    price: {
      h2: 'Pet odour removal prices',
      html: '<p>Priced per treated area on top of the carpet clean, quoted from photos. Spot odour treatment is included in the pet owner bond clean bundle ({price:packagePet} for a 2-bed).</p>',
    },
    faqs: [
      { id: 'po1', q: 'Why does pet smell come back after cleaning?', a: 'Urine soaks below the carpet surface. Without an enzyme treatment the source stays behind.' },
      { id: 'po2', q: 'Can you remove dog urine smell?', a: 'In most cases, yes, using enzyme treatment and hot water extraction. Heavily soaked underlay may need replacing.' },
      { id: 'po3', q: 'Do I need flea treatment too?', a: 'Only if your lease requires it or there are fleas. We arrange it through a licensed partner.' },
      { id: 'po4', q: 'Do you remove pet hair?', a: 'Yes, from carpets, skirting, vents and soft furnishings.' },
      { id: 'po5', q: 'Is it included in the pet owner bond clean?', a: 'Yes, spot odour treatment is part of that bundle.' },
      ...pick('A4'),
    ],
    related: ['pet-owner-bond-cleaning-brisbane', 'carpet-steam-cleaning-brisbane', 'carpet-stain-removal-brisbane', 'end-of-lease-cleaning-brisbane'],
    cta: { h2: 'Get rid of the smell, not just the mark.', p: 'Send photos of the affected areas for a fixed price.' },
    areasIntro: 'Pet odour treatment for rentals across all 20 suburbs.',
  },

  // ---------------------------------------------------------------------------
  // Tier 2 · Mattress cleaning
  {
    slug: 'mattress-cleaning-brisbane',
    tier: 2,
    short: 'Steam cleaned, usable the same day',
    icon: 'bed',
    intro: `<p>Leaving a furnished rental, or just want a fresh bed? We steam clean and deodorise mattresses, treat stains, and leave them dry enough to use the same day.</p>
<p>Our mattress cleaning in Brisbane is booked with a furnished bond clean or on its own, for singles through to kings. From {price:mattress} a mattress, quoted within {replyTime}, usually dry in {dryMattress}.</p>`,
    heroPhoto: 'carpet',
    heroAlt: 'Mattress cleaning Brisbane uses the same hot water extraction as this bedroom carpet, shown before and after steam cleaning during a Brisbane bond clean',
    photos: ['carpet'],
    problem: {
      h2: 'Mattresses on the inventory',
      quotes: ['"The inventory listed the mattress as \'clean, no stains\'. It wasn\'t any more."'],
      paras: [
        "In a furnished rental, the mattress is on the inventory like any other item, and agents do lift the sheets at the final inspection. A sweat mark or a spilled drink can turn into a claim for a replacement.",
        "A proper mattress clean takes an hour or so and, done right, leaves the mattress dry enough to sleep on that night.",
      ],
    },
    included: {
      h2: 'Mattress steam cleaning process',
      groups: [
        { h3: 'Dry clean first', items: ['Vacuumed with a HEPA filter for dust and dust mites', 'Seams, piping and buttons done by hand'] },
        { h3: 'Treat', items: ['Organic stains pre-treated', 'Low-moisture hot water extraction', 'Deodorised'] },
        { h3: 'Dry', items: ['Left to air-dry with windows open or a fan', 'Photo of each side in your report'] },
      ],
    },
    sections: [
      {
        id: 'when',
        eyebrow: 'When it is required',
        h2: 'Furnished rental mattress cleaning: when the lease asks for it',
        html: `<p>Check two places: the lease and the inventory. If either says mattresses were professionally cleaned at the start, the agent can expect the same at the end. If they're listed as "clean" and they're now stained, cleaning is usually cheaper than a replacement claim. If neither applies and the mattress is clean, you probably don't need it.</p>${callout('Mattress protectors are worth it in a furnished rental. They make this whole page unnecessary.', true)}`,
        bg: 'bg',
      },
    ],
    price: {
      h2: 'Mattress cleaning prices',
      html: '<p>{price:mattress} per mattress, any size, with a small extra for double-sided cleaning. Booked with a <a href="/furnished-property-bond-cleaning-brisbane/">furnished bond clean</a>, it goes on the same invoice.</p>',
    },
    faqs: [
      { id: 'ma1', q: 'Do I need to clean the mattress in a furnished rental?', a: "If the inventory or lease says so, or it's stained. Check your condition report." },
      { id: 'ma2', q: 'How long until I can sleep on it?', a: 'Usually {dryMattress} to dry.' },
      { id: 'ma3', q: 'Can you remove stains from a mattress?', a: 'Most organic stains improve a lot; some old stains may remain.' },
      { id: 'ma4', q: 'Is it safe for kids and pets?', a: 'Yes. We use low-toxicity products and hot water extraction.' },
      { id: 'ma5', q: 'Can you do it with the bond clean?', a: 'Yes, add it when you book.' },
    ],
    related: ['furnished-property-bond-cleaning-brisbane', 'upholstery-cleaning-brisbane', 'carpet-stain-removal-brisbane', 'pet-stain-odour-removal-brisbane'],
    cta: { h2: 'A fresh mattress by tonight.', p: 'Add it to your bond clean or book it on its own.' },
    areasIntro: 'Mattress cleaning in every suburb we serve.',
  },

  // ---------------------------------------------------------------------------
  // Tier 2 · Upholstery & sofa cleaning
  {
    slug: 'upholstery-cleaning-brisbane',
    tier: 2,
    short: 'Fabric and leather, cleaned on site',
    icon: 'sofa',
    intro: `<p>Fabric and leather sofas, dining chairs and ottomans, cleaned on site. Ideal for furnished rentals at the end of a lease, or for your own furniture before you move it into a new place.</p>
<p>Our upholstery cleaning in Brisbane is priced per seat from {price:sofaSeat}, quoted within {replyTime}, and usually dry in a few hours.</p>`,
    heroPhoto: 'carpet',
    heroAlt: 'Upholstery cleaning Brisbane uses the same hot water extraction as this bedroom carpet, shown before and after steam cleaning in Brisbane',
    photos: ['carpet'],
    problem: {
      h2: 'Furniture on the inventory, and fabric you don\'t want ruined',
      quotes: ['"I was scared a cleaner would shrink the sofa covers."'],
      paras: [
        "A furnished lease puts the landlord's sofa on your inventory. Food marks, pet hair and that grey line where heads rest are all things an agent can note at the exit inspection.",
        "The worry with upholstery is damage: shrinking, colour run or water marks. That's why we identify the fabric and spot test before anything else.",
      ],
    },
    included: {
      h2: 'Sofa cleaning Brisbane: what we do',
      groups: [
        { h3: 'Couch cleaning (fabric)', items: ['Vacuumed, including under cushions', 'Pre-treated for marks and body oils', 'Low-moisture extraction, cushions and frame'] },
        { h3: 'Leather cleaning', items: ['pH-balanced leather cleaner', 'Conditioned to stop cracking'] },
        { h3: 'Other pieces', items: ['Dining chairs, ottomans and bedheads', 'Pet hair removal'] },
      ],
    },
    sections: [
      {
        id: 'methods',
        eyebrow: 'Fabric vs leather',
        h2: 'The right method for each material',
        html: "<p>Every sofa has a care code, usually on a tag under a cushion. \"W\" means water-based cleaning is fine, \"S\" means solvent only, \"WS\" means either, and \"X\" means vacuum only. We follow the tag. Leather gets a gentle cleaner and conditioner rather than water extraction.</p>",
        bg: 'bg',
      },
      {
        id: 'spot-test',
        eyebrow: 'Spot test policy',
        h2: 'We spot test first, every time',
        html: "<p>Before cleaning a whole piece, we test a hidden area for colour run and shrinkage. If the test shows a risk, we stop and tell you, and you don't pay for a clean we can't do safely.</p>",
      },
    ],
    price: {
      h2: 'Upholstery cleaning prices',
      html: '<p>{price:sofaSeat} per seat. A three-seater is three seats; dining chairs and ottomans are priced per item on your quote.</p>',
    },
    faqs: [
      { id: 'up1', q: 'Do you clean fabric and leather sofas?', a: 'Yes, with methods suited to each. We spot test first.' },
      { id: 'up2', q: 'How long does upholstery take to dry?', a: 'Usually a few hours.' },
      { id: 'up3', q: 'Can you clean dining chairs and ottomans?', a: 'Yes, priced per item.' },
      { id: 'up4', q: 'Is it worth cleaning my sofa before moving?', a: "Yes, it's the easiest time, before it goes into your new place." },
      { id: 'up5', q: 'Do you clean furnished rental furniture for the bond?', a: 'Yes, as part of a furnished property clean or on its own.' },
    ],
    related: ['furnished-property-bond-cleaning-brisbane', 'mattress-cleaning-brisbane', 'carpet-stain-removal-brisbane', 'pet-stain-odour-removal-brisbane'],
    cta: { h2: 'Sofa clean before the move.', p: 'Send a photo and the care tag for a fixed price.' },
    areasIntro: 'On-site upholstery cleaning across these 20 suburbs.',
  },
];
