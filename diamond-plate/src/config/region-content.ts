/**
 * Unique copy for each service-area page. Each page is written separately
 * around its own local driving conditions: never swap names between them.
 * Facts about the business still come from site.ts.
 */
import type { QA } from '../lib/schema';
import { business, warrantyYears } from './site';

export interface RegionCopy {
  eyebrow: string;
  lead: string;
  localH2: string;
  local: string;
  whyH2: string;
  why: string;
  nextH2: string;
  next: { href: string; label: string; desc: string }[];
  cta: { heading: string; text: string };
  tipsH2: string;
  tips: string;
  faq: QA[];
}

export const regionCopy: Record<string, RegionCopy> = {
  'eastern-suburbs-bayside': {
    eyebrow: 'Murarrie · Cannon Hill · Carindale · Wynnum · Manly',
    lead:
      'Our Brisbane base is in Murarrie, so the east and bayside are home turf. We bring ceramic coating to driveways and work car parks from Bulimba and Norman Park out to Wynnum, Manly and Lota, with fixed prices and nothing to drop off.',
    localH2: 'What bay air and port roads do to paint',
    local: `<p>Living near Moreton Bay is great for weekends and hard on paint. On the bayside, Wynnum, Manly and Lota cop salty air on most onshore breezes. Salt settles as a fine film you can barely see, holds moisture against the paint, and works its way into the edges of panels and around badges. Leave it long enough and it dulls the clear coat.</p>
<p>Further in, the problem changes. Murarrie, Hemmant, Tingalpa and Cannon Hill sit between the Gateway Motorway and the Port of Brisbane, so a lot of the traffic is trucks. That means road film, diesel grime and fine grit that sticks to the lower half of the car and the rear hatch. Add the big fig and gum trees around Bulimba, Balmoral and Camp Hill, and you get sap and bird droppings on top.</p>
<p>A graphene ceramic coating doesn’t stop any of that landing on the car. What it does is give the paint a slick, hydrophobic surface that contaminants struggle to bond to. A rinse moves salt film. Truck grime lets go with a normal hand wash instead of a hard scrub. And droppings come off before the morning sun bakes them into the clear coat.</p>`,
    whyH2: 'Why east-side owners choose a mobile coating',
    why: `<p>Most people out this way don’t want to spend a Saturday sitting in a workshop waiting room in an industrial estate. With a mobile service, the applicator comes to you, whether that’s a carport in Coorparoo, a townhouse garage in Carindale or the car park at work in Murarrie or Hemmant.</p>
<p>The job is the same as anywhere else: full wash, decontamination, a clay bar to make the paint smooth, then the coating. For bayside cars that see a lot of salt air, the decontamination step matters, because it removes the bonded grime a wash leaves behind so the coating goes onto clean paint.</p>
<p>After that, keep it simple. Rinse salt off regularly, especially after a windy week or a drive along the Esplanade at Manly, and hand wash with a pH-neutral shampoo. Our aftercare guide covers the rest.</p>`,
    nextH2: 'Read next',
    next: [
      { href: '/new-car-paint-protection/', label: 'New car paint protection', desc: 'Picked up a new car from a dealer on the east side? Start here.' },
      { href: '/guides/is-ceramic-coating-worth-it-queensland/', label: 'Is it worth it in Queensland?', desc: 'Salt air, UV and storms, honestly weighed up.' },
      { href: '/ceramic-coating-prices/', label: 'Ceramic coating prices', desc: 'Fixed packages, published.' },
    ],
    cta: { heading: 'Salt air on the car again?', text: 'We’re based in Murarrie and come to you across the east and bayside.' },
    tipsH2: 'Looking after a coated car on the east side',
    tips: `<ul>
<li><strong>After a windy week at Wynnum or Manly,</strong> give the car a plain rinse with town water, even if it looks clean. Salt film is easy to miss.</li>
<li><strong>Parked near the port or the Gateway?</strong> Truck grime collects on the lower doors and the rear hatch. Rinse those first, then wash top-down.</li>
<li><strong>Under the figs in Bulimba or Camp Hill?</strong> Check the roof and bonnet for droppings each evening in summer, and lift them off before the next day’s sun.</li>
<li><strong>Coorparoo and Norman Park carports</strong> still catch blown dust and leaf litter, so a fortnightly hand wash keeps the beading strong.</li>
</ul>
<p>None of this is complicated. The coating does the heavy lifting; you just don’t let contaminants sit.</p>`,
    faq: [
      {
        q: 'Can I bring my car to your Murarrie base?',
        a: '<p>Our service is mobile, so we come to you. Murarrie is our Brisbane base. Call us if you’d like to talk about where the job will happen.</p>',
      },
      {
        q: 'Does ceramic coating stop salt damage near the bay?',
        a: '<p>It helps a lot, but it isn’t a force field. The coating makes salt film and grime easier to rinse off, so they don’t sit on the paint. You still need to wash the car regularly.</p>',
      },
      {
        q: 'How do I book a coating in the eastern suburbs?',
        a: `<p>Call ${business.phone.display} or send the quote form with your car and suburb. We confirm a fixed price, then book a day to come to your home or work.</p>`,
      },
    ],
  },

  northside: {
    eyebrow: 'Chermside · Aspley · Albany Creek · Hamilton · North Lakes',
    lead:
      'From the river at Hamilton and Ascot up to Bracken Ridge and North Lakes, we bring ceramic coating to northside driveways and work car parks. Australian-made graphene ceramic, fixed prices, and a trained applicator who comes to you.',
    localH2: 'Airport runs, the Gateway and brand-new estates',
    local: `<p>A lot of northside driving happens at speed. The airport and Gateway commute from Clayfield, Ascot and Hamilton, and the run up the Gympie Road corridor through Kedron, Chermside and Aspley, mean plenty of highway time. That brings bug strikes on the bonnet and mirrors, fine road grit, and brake dust on the wheels.</p>
<p>Then there’s the north. North Lakes and the newer estates around it are full of new cars, often parked on driveways in full sun because the garage is full of everything else. New paint gets its first summer of UV, bird droppings and storm grime straight away. Around Albany Creek, Everton Park and Stafford, the leafy streets add sap and droppings from the trees overhead.</p>
<p>A ceramic coating gives the paint a slick, hydrophobic finish. Bug splatter and grime don’t bond as easily, so they wash off before they etch. Water beads straight off after an afternoon storm. And the deep gloss lasts, instead of going flat after a couple of Queensland summers.</p>`,
    whyH2: 'Why northside owners coat new cars early',
    why: `<p>If you’ve just collected a new car from a dealer in the area, the best time to protect it is now, in the first weeks, before the paint has had time to pick up marks. Every job starts with a full wash, decontamination and a clay bar, because new cars aren’t always as clean as they look after transport and a quick dealer wash.</p>
<p>Because we’re mobile, the applicator can do the job on your driveway in North Lakes, outside your unit in Nundah, or at work. The applicator explains every step at hand-over, so you know exactly what was done and how to look after it.</p>
<p>If the dealer has offered its own paint protection, ask which product it is, what the warranty conditions are, and whether inspections or reapplication are required. Then compare it with our fixed prices and the ${warrantyYears}-year national warranty.</p>`,
    nextH2: 'Read next',
    next: [
      { href: '/new-car-paint-protection/', label: 'New car paint protection', desc: 'For new cars from North Lakes to Hamilton.' },
      { href: '/guides/ceramic-coating-vs-dealer-paint-protection/', label: 'Ceramic coating vs dealer protection', desc: 'Questions to ask before you sign.' },
      { href: '/ceramic-coating-prices/', label: 'Ceramic coating prices', desc: 'Four fixed packages.' },
    ],
    cta: { heading: 'New car on the northside?', text: 'Get it coated in the first weeks, on your own driveway.' },
    tipsH2: 'Northside driving habits that help the coating',
    tips: `<ul>
<li><strong>After an airport run or a trip up the Bruce,</strong> deal with the bug splatter on the bumper and mirrors within a day or two, using a bug and tar remover rather than a scrubbing brush.</li>
<li><strong>In the North Lakes estates,</strong> driveways often face the afternoon sun. If the garage is full, a car cover or carport makes a real difference to how long droppings and storm grime take to bake on.</li>
<li><strong>Around Albany Creek and Stafford,</strong> street trees drop sap in warm weather. Soften it with water and lift it gently; never scrape.</li>
<li><strong>Skip the brush car wash near the shops at Chermside.</strong> The chemicals won’t hurt the coating, but brushes cause swirls.</li>
</ul>`,
    faq: [
      {
        q: 'Do you cover North Lakes and Bracken Ridge?',
        a: '<p>Yes. They’re on our northside list. If your suburb isn’t listed, ask anyway and we’ll tell you straight.</p>',
      },
      {
        q: 'Will a coating stop bug splatter from the highway?',
        a: '<p>Bugs will still hit the car. The coating makes them easier to wash off before they etch the paint. Use a bug and tar remover on the worst of it.</p>',
      },
      {
        q: 'Can you coat my car at work in Hamilton or Chermside?',
        a: '<p>Yes. We can come to your workplace as well as your home. Tell us where the car will be parked when you book.</p>',
      },
    ],
  },

  'southside-logan': {
    eyebrow: 'Mount Gravatt · Sunnybank · Springwood · Shailer Park · Browns Plains',
    lead:
      'Southside and Logan cars spend a lot of time on the M1 and the Logan Motorway. We bring ceramic coating to your driveway or work, from Mount Gravatt and Sunnybank through Springwood, Daisy Hill and Browns Plains, at fixed published prices.',
    localH2: 'Motorway miles: stone chips, bugs and grime',
    local: `<p>If you live in Rochedale, Underwood, Springwood or Shailer Park, you probably know the Pacific Motorway better than you’d like. Motorway driving is hard on the front of a car. Bugs hit the bumper, bonnet and mirrors, road grime builds up behind the wheels, and stones flicked up by trucks can chip the paint.</p>
<p>We’ll be honest about that last one. A ceramic coating won’t stop stone chips. If chips are your main worry, paint protection film is the tool for that, and our guide to ceramic coating vs PPF explains when it makes sense. What a coating does well is the rest: it gives the paint a slick surface so bug splatter and grime wash off more easily, before they have a chance to etch the clear coat.</p>
<p>Around Logan, there’s also the new-home factor. Estates around Browns Plains, Calamvale and the Logan growth corridor mean new cars, new driveways and not much shade yet. Cars parked in full sun see more UV and more baked-on droppings, which is exactly when easy washing pays off.</p>`,
    whyH2: 'Why southside owners like a fixed price',
    why: `<p>Most Brisbane coating businesses don’t publish their prices. Ours are right there: four packages, from the single layer to Ultimate Plus with the interior and wheels done. Large 4WDs, vans and cars that need extra prep may vary, and we’ll confirm that before we start.</p>
<p>Because we come to you, there’s no driving across town to a workshop and waiting for a lift back. The applicator works on your driveway in Eight Mile Plains or Daisy Hill, or at your workplace, and walks you through the car when it’s done.</p>
<p>Utes and 4WDs are common out this way too. If yours spends weekends on dirt roads, a coating makes the clean-up much quicker. Our 4WD page has the details.</p>`,
    nextH2: 'Read next',
    next: [
      { href: '/4wd-ute-ceramic-coating/', label: '4WD and ute ceramic coating', desc: 'For motorway miles and weekend dirt.' },
      { href: '/guides/ceramic-coating-vs-ppf/', label: 'Ceramic coating vs PPF', desc: 'The honest answer on stone chips.' },
      { href: '/ceramic-coating-prices/', label: 'Ceramic coating prices', desc: 'Fixed and published.' },
    ],
    cta: { heading: 'Spending your life on the M1?', text: 'Make bugs and road grime easier to wash off. We come to you.' },
    tipsH2: 'Southside and Logan care tips',
    tips: `<ul>
<li><strong>Motorway commuters:</strong> the front bumper, bonnet edge and mirrors take the worst of it. Rinse them first at every wash and use a bug and tar remover on splatter.</li>
<li><strong>New estates without shade:</strong> in Calamvale, Browns Plains or Underwood, a car on an open driveway gets hit by sun from early morning. Wash droppings off the same day.</li>
<li><strong>Bore and tank water:</strong> if your Logan property runs on tank water, finish the wash with town water where you can, because rain and bore water can leave mineral spots.</li>
<li><strong>Weekend dirt roads:</strong> let a rinse soften dried mud before you touch it with a mitt.</li>
</ul>
<p>Follow those and the coating will keep the paint glossy and easy to clean through plenty of Queensland summers.</p>`,
    faq: [
      {
        q: 'Will ceramic coating protect against stone chips on the M1?',
        a: '<p>No. A coating doesn’t stop stone chips. It protects against contaminants and makes washing easier. For chip protection, look at paint protection film.</p>',
      },
      {
        q: 'Do you come out to Logan?',
        a: '<p>Yes. Springwood, Shailer Park, Daisy Hill, Underwood and Browns Plains are on our list, along with the southside suburbs. Ask if yours isn’t listed.</p>',
      },
      {
        q: 'Is the price different in Logan?',
        a: '<p>No. Our packages are fixed prices for most cars wherever we go. Large 4WDs, vans and cars needing extra prep may vary, and we confirm before we start.</p>',
      },
    ],
  },

  redlands: {
    eyebrow: 'Capalaba · Birkdale · Wellington Point · Cleveland · Victoria Point',
    lead:
      'The Redlands is coastal living, and coastal living is tough on paint. We bring ceramic coating to driveways from Capalaba and Alexandra Hills out to Cleveland, Thornlands, Victoria Point and Redland Bay, with fixed prices and a trained applicator who comes to you.',
    localH2: 'Salt, birds and cars that live outside',
    local: `<p>Along the Redlands coast at Wellington Point, Cleveland and Victoria Point, the sea breeze carries salt onto everything parked outside. Salt film is easy to miss and slow to wash off. Left on the paint, it holds moisture and helps grime stick.</p>
<p>The Redlands is also bird country. Between the water, the bushland around Alexandra Hills and Thornlands and the big trees on suburban streets, bird droppings are a constant. They’re acidic, and on a hot day they can bake into the clear coat within hours.</p>
<p>And plenty of Redlands driveways are full. The garage holds the boat, the caravan or the camping gear, so the car lives outside. Cars parked in the open see more sun, salt, sap and droppings than cars kept under cover. A graphene ceramic coating gives the paint a slick, hydrophobic layer. Salt rinses off, droppings lift more easily if you get to them quickly, and the gloss stays deeper for longer.</p>`,
    whyH2: 'Why Redlands owners pick a mobile coating',
    why: `<p>Getting a car from Redland Bay or Victoria Point to a workshop and back can eat most of a day. With a mobile service, the applicator comes to your driveway in Birkdale or Cleveland, or to your work in Capalaba, and the car never leaves home.</p>
<p>Every job gets the same full prep: wash, decontamination, clay bar, then the coating, applied by a trained Diamond Plate applicator. For coastal cars, decontamination matters because it lifts the bonded grime that salt air helps build up.</p>
<p>If you tow a boat or caravan, the car will be getting salt spray on the ramp too. Rinse it with town water after a trip, hand wash it with a pH-neutral shampoo, and keep it out of brush car washes. Our aftercare guide has the details.</p>`,
    nextH2: 'Read next',
    next: [
      { href: '/guides/ceramic-coating-aftercare/', label: 'Ceramic coating aftercare', desc: 'Salt, droppings and the first wash.' },
      { href: '/interior-and-wheel-protection/', label: 'Interior and wheel protection', desc: 'For cabins full of wet gear.' },
      { href: '/ceramic-coating-prices/', label: 'Ceramic coating prices', desc: 'Fixed packages from Capalaba to Redland Bay.' },
    ],
    cta: { heading: 'Car living outside next to the boat?', text: 'Give the paint a slick layer against salt and droppings. We come to you.' },
    tipsH2: 'Redlands care tips for coastal cars',
    tips: `<ul>
<li><strong>After the boat ramp at Cleveland or Victoria Point,</strong> rinse the car and the tow vehicle’s lower panels with town water the same day. Salt spray on the ramp is easy to forget.</li>
<li><strong>Near Wellington Point and the foreshore,</strong> salt settles on cars parked overnight. A quick rinse once a week does more than an occasional big wash.</li>
<li><strong>Bushland streets in Alexandra Hills and Thornlands</strong> mean more birds and more sap. Check the roof and boot lid each evening in summer.</li>
<li><strong>On tank water in Redland Bay?</strong> Finish with town water where you can to avoid mineral spots.</li>
</ul>`,
    faq: [
      {
        q: 'What should I do about bird droppings on a coated car?',
        a: '<p>Get them off as soon as you can, ideally the same day. The coating makes them lift more easily, but on a hot day they can still mark the paint if left to bake on.</p>',
      },
      {
        q: 'Do you come to Redland Bay and Victoria Point?',
        a: '<p>Yes. Both are on our Redlands list, along with Capalaba, Alexandra Hills, Birkdale, Wellington Point, Cleveland and Thornlands.</p>',
      },
      {
        q: 'Can you coat the car while the boat is in the driveway?',
        a: '<p>Usually, yes. Tell us how the driveway is set up when you book and we’ll talk through where the job can happen.</p>',
      },
    ],
  },
};
