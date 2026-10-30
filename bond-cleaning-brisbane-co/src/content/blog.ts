/**
 * Blog posts (tier 4, researching). Each answers one real question, links to one
 * service page and one or two suburb pages, and carries Article + FAQPage schema.
 */
import type { Faq } from '../data/faqs';
import { rta, RTA_CARPET, RTA_CLEAN, RTA_END } from './shared';

export interface Post {
  slug: string;
  title: string;
  description: string;
  published: string;
  readMins: number;
  query: string;
  excerpt: string;
  html: string;
  faqs: Faq[];
}

export const posts: Post[] = [
  {
    slug: 'do-you-have-to-steam-clean-carpets-when-you-move-out-qld',
    title: 'Do You Have to Get Your Carpets Steam Cleaned When You Move Out in QLD?',
    description: 'The Queensland rule on carpet cleaning at the end of a lease, when an agent can ask for a professional clean, and how to avoid paying for one you don\'t need.',
    published: '2026-10-27',
    readMins: 6,
    query: 'carpet cleaning end of lease qld',
    excerpt: "Short answer: not always. Carpets go back to their starting standard. Here's when a professional clean is required, and when it isn't.",
    html: `<p><strong>Short answer: not always.</strong> In Queensland, carpets must be returned to the condition they were in at the start of your tenancy, less fair wear and tear. A professional carpet clean can be required only in two situations: the carpets were professionally cleaned when you moved in, or you agreed to a professional clean in your lease, usually because you had a pet.</p>
<p>That's the rule from the Residential Tenancies Authority (${rta(RTA_CARPET, 'RTA: carpet cleaning and pest control')}). Everything else in this guide is about applying it to your lease without overpaying, and without losing bond money.</p>

<h2>What "back to their starting standard" means</h2>
<p>Your entry condition report records how the carpets looked on day one. At the exit inspection, the property manager compares the carpets with that record. If they're as clean as they were, apart from normal wear in walkways, you've met the standard. If there are new stains, ground-in dirt or pet odour, you haven't.</p>
<p>So the question isn't really "do I have to steam clean?". It's "will the carpets match the entry report if I don't?". A short lease in a bedroom you barely used might only need a thorough vacuum. Three years with kids and a dog almost certainly needs more.</p>

<h2>When an agent can ask for a professional carpet clean</h2>
<h3>1. The carpets were professionally cleaned at the start</h3>
<p>Check your entry condition report and the lease. If either says the carpets were professionally cleaned before you moved in, the agent can expect the same standard at the end. Keep the receipt from your clean; it's the proof they'll ask for.</p>
<h3>2. You agreed to it because of a pet</h3>
<p>Many Queensland leases with pets include a special term requiring professional carpet cleaning, and sometimes flea treatment, at the end of the tenancy. If you signed it, it applies. Read the exact wording: some clauses only mention carpets, some mention pest control too.</p>
<h3>3. Neither applies</h3>
<p>If the carpets weren't professionally cleaned at the start and there's no pet clause, the agent can't insist on a professional clean as a rule. They can still claim against your bond if the carpets are dirtier than at the start, so the practical question is whether you can get them back to that standard yourself.</p>

<h2>Can the agent make me use their carpet cleaner?</h2>
<p>No. In Queensland a landlord or agent can't require you to use a particular carpet cleaning or pest control company, or charge you a set fee for it. You can choose your own cleaner, as long as the result meets the standard. If an agent tells you otherwise, point them politely to the ${rta(RTA_CARPET, 'RTA guidance')}.</p>

<h2>DIY hire machine or professional clean?</h2>
<p>Supermarket hire machines can work on lightly soiled carpets in a small unit. They're less effective on traffic lanes, pet urine and older stains, and they leave more water in the carpet, which slows drying. If your lease requires a professional clean, a DIY hire won't meet it, and you won't have the receipt the agent wants.</p>
<p>A professional hot water extraction clean pre-treats stains, rinses the pile and extracts most of the moisture. Carpets are usually dry within a few hours with the windows open. For pet urine, an enzyme treatment is needed first, otherwise the smell can come back as the carpet dries.</p>

<h2>What to do before your inspection</h2>
<ol>
<li><strong>Find your entry condition report</strong> and look at what it says about the carpets, room by room.</li>
<li><strong>Read your lease</strong> for any special term about carpets or pets.</li>
<li><strong>Photograph the carpets now</strong>, in daylight, so you know what you're dealing with.</li>
<li><strong>Book carpets last</strong>, after the removalists but before the inspection, so nothing is dragged across them.</li>
<li><strong>Keep the receipt</strong> and before and after photos together, ready to forward.</li>
</ol>

<h2>How we handle carpets at end of lease</h2>
<p>We steam clean carpets with hot water extraction as part of our <a href="/carpet-steam-cleaning-brisbane/">end of lease carpet cleaning</a>, on the same day as the bond clean. Spot stain treatment is included, pet odour gets enzyme treatment, and you get an itemised receipt in your photo report. Family homes in <a href="/bond-cleaning-aspley/">Aspley</a> and <a href="/bond-cleaning-bracken-ridge/">Bracken Ridge</a> are where we do the most of these, often with a pet clause in the lease.</p>
<blockquote>The rule in one line: carpets go back to how they were at the start. A professional clean is only compulsory if they were professionally cleaned at move-in or you agreed to it, usually because of a pet.</blockquote>`,
    faqs: [
      { id: 'b1a', q: 'Is carpet steam cleaning compulsory at the end of a lease in Queensland?', a: 'No, not always. Carpets must go back to their starting standard. A professional clean can be required if the carpets were professionally cleaned at move-in or you agreed to it in the lease, usually because of a pet.' },
      { id: 'b1b', q: 'Can my agent tell me which carpet cleaner to use?', a: "No. A landlord or agent in Queensland can't require a particular carpet cleaning company or charge a set fee for it." },
      { id: 'b1c', q: 'Will a hire machine from the supermarket be enough?', a: "Sometimes, for light soiling and no pet clause. If your lease requires a professional clean, a DIY hire won't meet it, and you won't have the receipt." },
      { id: 'b1d', q: 'How long do carpets take to dry after steam cleaning?', a: 'Usually a few hours with windows open or the air-con on, which is why we clean carpets early in the bond clean.' },
    ],
  },
  {
    slug: 'what-brisbane-property-managers-check-at-a-final-inspection',
    title: 'What Brisbane Property Managers Check at a Final Inspection',
    description: 'A room-by-room walk-through of a Queensland final inspection: how the exit condition report works, what agents check first, and the items most often flagged.',
    published: '2026-10-27',
    readMins: 7,
    query: 'final inspection checklist qld',
    excerpt: 'The agent compares your entry report with the exit report, room by room. Here is the route they take and what they look at.',
    html: `<p>At a final inspection, your property manager compares the property with the entry condition report you signed when you moved in, using the exit condition report (Form 14a). They walk the property room by room and note anything that is dirtier or more damaged than at the start, beyond fair wear and tear. Those notes are what a bond claim is built on.</p>
<p>Knowing the route they take, and what they look at, is the easiest way to protect your bond. Here's the walk-through, the way it usually happens.</p>

<h2>Before they arrive: the two reports</h2>
<p>The entry condition report is your baseline. It records the condition of each room when you moved in, often with photos. The exit condition report uses the same rooms and items. The ${rta(RTA_CLEAN, 'RTA explains the cleaning standard')}: the property should be left in the same condition as at the start of the tenancy, apart from fair wear and tear.</p>
<p><strong>Fair wear and tear</strong> covers ageing from normal use, like faded curtains or worn carpet in a hallway. It doesn't cover dirt, grime, grease or damage that happened during the tenancy.</p>

<h2>The walk-through, room by room</h2>
<h3>Kitchen: the oven comes first</h3>
<p>Almost every inspection starts in the kitchen, and most agents open the oven. They look at the door glass, including between the panes, the racks and the back wall. Then they look up at the rangehood filter, open a few cupboards, check the under-sink cupboard and run a hand along the benchtop edge. The dishwasher filter and the space where the fridge stood are common surprises.</p>
<h3>Bathrooms: grout, glass and the exhaust fan</h3>
<p>In the bathroom they check shower glass and tiles for soap scum, grout lines for mould, the toilet including behind the pedestal, and the mirror. In Brisbane's humidity, mould on silicone and ceilings is common, so expect them to look up at the exhaust fan cover too.</p>
<h3>Bedrooms and living areas: up, down and along</h3>
<p>Here the checks are quick and physical. The agent looks up at the ceiling fan and light fittings, runs a finger along the skirting boards, checks light switches and door frames, and opens the wardrobes. Air-con filters and vents are checked in rooms with split systems.</p>
<h3>Windows and sliding doors: the track test</h3>
<p>Expect the agent to slide a window or the balcony door open and look at the track. Tracks collect dust, dead insects and mould, and they are one of the most common items on an exit report. Sills, frames, flyscreens and blinds are checked at the same time.</p>
<h3>Laundry and outdoor areas</h3>
<p>In the laundry: the tub, the floor waste and behind the washing machine space. Outside: the patio or balcony, the garage floor and any area included in your lease. Pet owners can expect questions about carpets and fleas if there's a pet clause.</p>

<h2>The items most often flagged</h2>
<ul>
<li>Window tracks and sliding door tracks</li>
<li>Skirting boards and top of door frames</li>
<li>Ceiling fans and light fittings</li>
<li>Rangehood filters and oven door glass</li>
<li>Exhaust fans and air-con vents</li>
<li>Inside cupboards, including under the sink</li>
<li>Shower grout and glass</li>
<li>Light switches and marks on walls</li>
</ul>
<p>Our <a href="/bond-cleaning-checklist/">bond cleaning checklist</a> covers all of these, in inspection order, and you can tick it off on your phone.</p>

<h2>What happens after the inspection</h2>
<p>If everything matches, the agent signs off and you can lodge your bond refund with the RTA. If they find problems, they'll usually send a list and a deadline to fix them. Ask for the list in writing with photos. A vague "the unit wasn't up to standard" isn't something you can fix; a list of specific items is. For bonds lodged after 30 September 2024, an agent who claims against the bond must provide supporting evidence within 14 days (see the ${rta(RTA_END, "RTA's ending a tenancy guide")}).</p>

<h2>How to walk through it yourself first</h2>
<p>The day before your inspection, do the agent's route: open the oven, look up at every fan, slide every window, open every cupboard. Photograph each room in daylight. If you've booked an <a href="/end-of-lease-cleaning-brisbane/">end of lease clean</a>, your dated photo report does this for you and becomes your evidence if there's ever a dispute.</p>
<p>In apartment-heavy suburbs like <a href="/bond-cleaning-brisbane-city/">Brisbane City</a>, inspections are short and focus on balcony glass, galley kitchens and internal bathrooms. In townhouse areas like <a href="/bond-cleaning-chermside/">Chermside</a>, add stairs, balustrades and air-con filters to your list.</p>`,
    faqs: [
      { id: 'b2a', q: 'What is Form 14a?', a: 'Form 14a is the exit condition report in Queensland. The agent uses it to record the condition of the property at the end of the tenancy and compare it with the entry condition report.' },
      { id: 'b2b', q: 'What do agents check first at a final inspection?', a: 'Usually the oven and rangehood, then bathrooms, then fans, skirting, window tracks and inside cupboards.' },
      { id: 'b2c', q: 'Do I need to attend the final inspection?', a: "You don't have to, but it helps to be available. Keep your own photos and any cleaning report so you can respond to a list quickly." },
      { id: 'b2d', q: 'What if the agent finds problems?', a: 'Ask for a written list with photos and a deadline, compare it with your entry report, and fix the items before the deadline. If you used a cleaner with a re-clean guarantee, send them the list.' },
    ],
  },
  {
    slug: 'how-much-does-a-bond-clean-cost-in-brisbane',
    title: 'How Much Does a Bond Clean Cost in Brisbane? (Real Prices)',
    description: 'What a bond clean costs in Brisbane by property size, what is included, what costs extra, and why fixed prices beat hourly rates and "from $45" adverts.',
    published: '2026-10-27',
    readMins: 6,
    query: 'bond cleaning brisbane prices',
    excerpt: 'Most Brisbane bond cleans cost between about $250 and $600 before carpets. Here is what moves the price, and what a fair quote includes.',
    html: `<p><strong>Most bond cleans in Brisbane cost between about $250 and $600 before carpets</strong>, depending on the number of bedrooms and bathrooms and the condition of the property. A studio or 1-bed unit sits at the lower end. A 4-bed house with two bathrooms, a garage and a patio sits at the top, or above it.</p>
<p>That range hides a lot of variation, so this guide explains what moves the price, what a fair quote includes, and the pricing tricks to watch for. For our own fixed prices by bedroom, see the <a href="/pricing/">bond cleaning prices</a> page.</p>

<h2>What decides the price</h2>
<h3>Bedrooms and bathrooms</h3>
<p>These are the biggest factors. Bathrooms take the longest per square metre: grout, glass, the toilet, the vanity and the exhaust fan. That's why a 2-bed with two bathrooms costs more than a 2-bed with one.</p>
<h3>Condition</h3>
<p>Years of oven build-up, heavy mould or smoke-stained walls add real time. A fair cleaner prices this from photos before the day. An unfair one "discovers" it on the day.</p>
<h3>Carpets and add-ons</h3>
<p>Carpet steam cleaning, balconies, garages, full wall washing and flea treatment are usually priced on top. Some companies include carpets; if they do, check how many rooms.</p>
<h3>Property type</h3>
<p>Queenslanders, highsets and larger houses take longer than their bedroom count suggests: more windows, louvres, fans, skirting and outdoor space. Apartments are quicker but may involve lift bookings and strict building hours.</p>

<h2>How long a bond clean takes</h2>
<p>As a guide, with a team of two: a 1-bed unit takes about three to four hours, a 2-bed about four to five, a 3-bed house six to seven, and a 4-bed most of a day. Very dirty properties take longer. If a quote is hourly, multiply these by the hourly rate to see what you might really pay.</p>

<h2>Fixed price vs hourly rate</h2>
<p>Hourly pricing sounds fair, but it moves on the day and rewards slow work. Many of the complaints Brisbane renters post about bond cleaners start the same way: "the quote was $300, the bill was $600". A fixed price, set from photos and written down, removes that risk. Any change should be agreed with you in writing before the work starts, never halfway through.</p>

<h2>What about "from $45" adverts?</h2>
<p>Very low advertised prices are usually for one room, one hour, or a clean that excludes the oven, the walls, the windows or the guarantee. They're the starting point for a conversation, not the price you'll pay. When comparing quotes, compare the total for your whole property with everything on your lease included.</p>

<h2>What a fair bond clean quote includes</h2>
<ul>
<li>The whole property: kitchen, oven, rangehood, bathrooms, laundry, every room</li>
<li>Inside cupboards and wardrobes, tracks, fans, skirting and light switches</li>
<li>Walls spot cleaned</li>
<li>A written list of what's included and what isn't</li>
<li>A re-clean guarantee that lasts past your inspection date, without extra fees</li>
<li>An invoice, and ideally a photo report you can forward to the agent</li>
</ul>

<h2>Ways to keep the cost down</h2>
<ol>
<li><strong>Empty the property completely</strong> before the clean. Cleaning around boxes takes longer.</li>
<li><strong>Send good photos</strong> so the quote is accurate: oven, bathrooms, carpets and any problem areas.</li>
<li><strong>Only book what your lease requires.</strong> If there's no carpet clause and the carpets are fine, you may not need a carpet clean.</li>
<li><strong>Book early.</strong> The last days of the month are the busiest, and late bookings have less choice.</li>
<li><strong>Do the easy jobs yourself</strong>, like removing rubbish and wiping out the fridge.</li>
</ol>

<h2>Example: a family house on the Northside</h2>
<p>A 3-bed, 2-bath lowset in <a href="/bond-cleaning-kedron/">Kedron</a> with a patio and a single garage needs a full bond clean, the patio washed and the garage swept. Priced properly, that's one fixed number with the patio and garage listed as add-ons, booked for the day after the removalists. Our <a href="/house-bond-cleaning-brisbane/">house bond cleaning</a> is priced exactly this way. A 2-bed apartment in <a href="/bond-cleaning-newstead/">Newstead</a> is quicker, but adds a lift booking and balcony glass.</p>`,
    faqs: [
      { id: 'b3a', q: 'How much is a bond clean in Brisbane?', a: 'Most bond cleans in Brisbane cost between about $250 and $600 before carpets, depending on bedrooms, bathrooms and condition.' },
      { id: 'b3b', q: 'How much should a 3 bedroom bond clean cost in Brisbane?', a: 'A 3-bed house usually sits towards the upper middle of that range before carpets, more if it has extra bathrooms, a garage or heavy build-up. Ask for a fixed price from photos.' },
      { id: 'b3c', q: 'Is it cheaper to pay by the hour?', a: 'Rarely. Hourly rates move on the day. A fixed price set from photos is easier to compare and can\'t blow out.' },
      { id: 'b3d', q: 'Are carpets included in the price?', a: 'Sometimes. Check how many rooms are included, and whether your lease actually requires a professional carpet clean.' },
    ],
  },
  {
    slug: 'is-a-professional-bond-clean-worth-it',
    title: 'Is a Professional Bond Clean Worth It? An Honest Answer',
    description: "Professional bond cleaning isn't required in Queensland. Here is when doing it yourself makes sense, when paying a professional is worth it, and how to decide.",
    published: '2026-10-27',
    readMins: 6,
    query: 'is professional bond cleaning worth it',
    excerpt: "You don't have to hire anyone. Whether you should depends on your time, the property and the risk of a re-clean. Here's how to decide.",
    html: `<p><strong>You don't have to hire a professional bond cleaner in Queensland.</strong> The ${rta(RTA_CLEAN, 'RTA')} is clear that you can clean the property yourself. What matters is that it's left in the same condition as at the start of the tenancy, apart from fair wear and tear. So the honest answer to "is it worth it?" is: sometimes yes, sometimes no.</p>
<p>Here's how to work it out for your situation.</p>

<h2>When doing it yourself makes sense</h2>
<ul>
<li><strong>A small, well-kept unit.</strong> A studio or 1-bed you've cleaned regularly can be bond-ready in a long day.</li>
<li><strong>You have time.</strong> At least a full day, after the removalists and before the inspection, with power and water still on.</li>
<li><strong>The oven and bathroom are in good shape.</strong> These are the hardest jobs. If they're already clean, most of the work is detail.</li>
<li><strong>No carpet or pet clause.</strong> If your lease doesn't require a professional carpet clean, you avoid the main thing a DIY clean can't easily do.</li>
<li><strong>You're willing to follow a checklist properly.</strong> Use our free <a href="/bond-cleaning-checklist/">bond cleaning checklist</a>, the same one we clean to.</li>
</ul>

<h2>When a professional clean pays for itself</h2>
<ul>
<li><strong>Larger homes.</strong> A 3 or 4-bed house is a two-person, full-day job. Done alone, it's a weekend.</li>
<li><strong>Heavy build-up.</strong> Years of oven grease, mould in the grout or smoke film on walls need the right products and time.</li>
<li><strong>A carpet or pet clause.</strong> If the lease requires a professional carpet clean or flea treatment, you'll need receipts anyway.</li>
<li><strong>You're short on time or already gone.</strong> If you've moved interstate or your new job starts Monday, the clean can happen without you.</li>
<li><strong>You want the risk off your plate.</strong> A good professional comes back if the agent flags anything they cleaned.</li>
</ul>

<h2>The real cost of a DIY bond clean</h2>
<p>DIY isn't free. Add up:</p>
<ol>
<li><strong>Your hours.</strong> A typical 2-bed takes one person 10 to 14 hours to do properly. Multiply by what an hour of your time is worth, or by the shifts you'd miss.</li>
<li><strong>Products and hire.</strong> Oven cleaner, mould remover, microfibre cloths, a track brush, a ladder for fans, and a carpet machine if needed.</li>
<li><strong>The re-clean risk.</strong> If the agent flags items and you can't get back to fix them, they may arrange a cleaner and claim the cost from your bond.</li>
</ol>
<p>Our <a href="/pricing/">pricing page</a> has a small calculator to run your own numbers against a fixed price.</p>

<h2>What makes a professional clean worth paying for</h2>
<p>Not every professional clean is worth it. The value comes from four things, and a cleaner who can't offer them is mostly selling labour:</p>
<ol>
<li><strong>A fixed price in writing</strong>, set from photos, that doesn't change on the day.</li>
<li><strong>A guarantee that outlasts your inspection</strong>, with no extra fee, so a list from the agent costs you nothing.</li>
<li><strong>Proof</strong>: a dated, room-by-room photo report and an invoice for the agent.</li>
<li><strong>Accountability</strong>: one business, one contact, insured, with a clear process if something goes wrong.</li>
</ol>
<p>That's how our <a href="/bond-back-guarantee/">bond back guarantee</a> works. It's also the checklist we'd suggest using to compare any bond cleaner, us included.</p>

<h2>A middle option</h2>
<p>Some renters do most of the clean themselves and book just the hardest parts: the oven, the carpets or the windows and tracks. It's a sensible compromise for a well-kept place. Others do the whole clean and keep a professional's number handy in case the agent sends a list; our failed inspection rescue exists for that.</p>

<h2>The honest bottom line</h2>
<p>If you have a small, tidy unit, a free day and no carpet clause, doing it yourself is often fine. If you have a family home, a pet clause, little time, or you simply want the risk handled, a professional bond clean with a real guarantee is usually worth it. In older character homes, like the Queenslanders in <a href="/bond-cleaning-new-farm/">New Farm</a>, or bigger newer homes in <a href="/bond-cleaning-north-lakes/">North Lakes</a>, the extra windows, fans and outdoor areas tip the balance towards paying.</p>`,
    faqs: [
      { id: 'b4a', q: 'Do I need professional bond cleaning in QLD?', a: 'No. You can clean it yourself. The property must be left in the same condition as at the start of the tenancy, apart from fair wear and tear.' },
      { id: 'b4b', q: 'How long does a DIY bond clean take?', a: 'For one person, a 2-bed unit usually takes 10 to 14 hours to do properly, more if the oven or bathroom needs heavy cleaning.' },
      { id: 'b4c', q: 'What should a professional bond clean include?', a: 'A fixed price in writing, the full checklist including oven, tracks and cupboards, a re-clean guarantee that lasts past your inspection, and an invoice and photo report.' },
      { id: 'b4d', q: 'Can I just book the oven and carpets?', a: 'Yes. Many renters do the rest themselves and book the hardest parts separately.' },
    ],
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug)!;
