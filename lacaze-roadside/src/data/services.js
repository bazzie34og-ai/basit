// Service pages. `body` is trusted HTML authored here. Towns-served, pricing note,
// FAQ and the call/form block are added by the template in src/pages/[slug].astro.
export const servicePages = [
  {
    slug: 'jump-start-spring-tx',
    key: 'jumpStart',
    icon: 'battery',
    preset: 'Jump start',
    name: 'Jump start service',
    serviceType: 'Jump start / battery boost',
    title: 'Jump Start Service in Spring, TX | 24/7 | LaCaze',
    h1: 'Dead Battery? Fast Jump Starts in Spring, TX',
    description: 'Car battery dead in Spring, TX? LaCaze Roadside Assistance brings a $75 mobile jump start to you 24/7. No membership. Call (832) 949-4837.',
    lead: 'Turn the key and nothing — or just a click. We bring a <strong>mobile jump start</strong> to your driveway, parking lot or shoulder, any hour, with an upfront price before we roll.',
    body: `
<h2>That sinking “click, click, click” feeling</h2>
<p>You’re already late. The dash flickers, the engine won’t turn over, and the parking lot is emptying out. Maybe it’s 11 p.m. outside a grocery store on FM 2920, or 6 a.m. in your own driveway with the kids buckled in. A <strong>dead car battery</strong> is one of the most common reasons a car won’t start in the Houston area — and Texas heat is a big reason why. High temperatures speed up the chemical wear inside a battery, so many batteries here give out with little warning.</p>
<p>When your car won’t start, you don’t need a membership card or a phone tree. You need someone who answers, tells you how long it will take, and shows up. That’s what we do.</p>

<h2>How our mobile jump start works</h2>
<ol>
  <li><strong>Call or text <a href="tel:+18329494837">(832) 949-4837</a>.</strong> A real person answers — John, the owner. Tell us what happened: clicking, slow crank, no lights at all, or warning lights on the dash.</li>
  <li><strong>Share your location.</strong> Text a map pin or tap “Use my location” on our request form. A cross street, store name or highway exit works too.</li>
  <li><strong>Get your upfront price.</strong> You’ll hear the price and an honest arrival estimate before we head your way.</li>
  <li><strong>We arrive and boost your battery.</strong> We connect safely, give your battery the boost it needs and get the engine running.</li>
  <li><strong>We stay until you’re safely back on the road.</strong> We make sure the car keeps running before we leave and let you know if the signs point to a battery or charging problem you should get checked.</li>
</ol>

<h2>Is it the battery, or something else?</h2>
<p>A jump start helps when the battery is drained — lights left on, a door not fully shut, a short trip in the heat, or an aging battery. Common signs:</p>
<ul>
  <li>Clicking when you turn the key, or a slow, labored crank</li>
  <li>Dim or flickering dash lights and headlights</li>
  <li>Push-button start that lights up the dash but won’t crank</li>
  <li>A battery warning light that came on recently</li>
</ul>
<p>If the engine cranks normally but won’t fire, the problem may be fuel or ignition rather than the battery. Tell us what you’re seeing when you call and we’ll be honest about whether a jump start is likely to help. Ran out of gas instead? We also do <a href="/fuel-delivery-spring-tx/">emergency fuel delivery</a>.</p>

<h2>What to do while you wait</h2>
<ul>
  <li><strong>On a road or shoulder:</strong> turn on your hazards. If you’re on a busy road like I-45, the Grand Parkway or FM 1960 and it’s unsafe to get out, <strong>stay in your car with your seatbelt on</strong> — we’re on the way.</li>
  <li><strong>Turn everything off:</strong> headlights, A/C, radio and chargers. This keeps any remaining charge for the restart.</li>
  <li><strong>In the heat:</strong> if the car is too hot to sit in and you’re somewhere safe, like a parking lot, wait in nearby shade or inside a store and keep your phone on.</li>
  <li><strong>Don’t keep cranking.</strong> Repeated tries can drain the battery further.</li>
  <li><strong>Keep your phone handy.</strong> If anything changes on our side, we call you first.</li>
</ul>
<p>For more on handling a no-start in summer, read our guide: <a href="/guides/car-wont-start-texas-heat/">what to do when your car won’t start in Texas heat</a>.</p>
`,
    faqs: [
      { q: 'Who can jump start my car near me right now?', a: '<p>If you’re in Spring or nearby — The Woodlands, Klein, Tomball, Magnolia, Conroe, Cypress, Humble, Aldine, Porter or North Houston — call LaCaze Roadside Assistance at <a href="tel:+18329494837">(832) 949-4837</a>. We’re open 24/7 and come to you.</p>' },
      { q: 'How much does a jump start cost?', a: '<p>A jump start is <strong>$75</strong>, with no membership needed and no surprise fees when we arrive. You’ll confirm the price on the phone before we head out. See <a href="/pricing/">pricing</a>.</p>' },
      { q: 'Can you jump start a car in a parking garage?', a: '<p>Usually, yes. Tell us the garage, level and any height limits when you call so we can plan how to reach you.</p>' },
      { q: 'Will a jump start fix my battery?', a: '<p>A jump start gets you running when the battery is drained. If your battery is old or failing, it may die again, so plan to have the battery and charging system tested soon. We’ll tell you what we notice.</p>' },
      { q: 'Do you jump start cars late at night or on weekends?', a: '<p>Yes. We’re available 24 hours a day, 7 days a week, including late nights, weekends and holidays.</p>' },
      { q: 'What if my car still won’t start after the jump?', a: '<p>Then the problem may not be the battery. We’ll explain what we see so you can decide on next steps, like calling a tow or a mechanic.</p>' },
    ],
  },
  {
    slug: 'car-lockout-spring-tx',
    key: 'lockout',
    icon: 'key',
    preset: 'Lockout',
    name: 'Car lockout service',
    serviceType: 'Vehicle lockout / unlock car door',
    title: 'Car Lockout Service in Spring, TX | LaCaze',
    h1: 'Locked Out of Your Car? We’ll Get You Back In',
    description: 'Locked keys in your car in Spring, TX? LaCaze Roadside Assistance unlocks car doors 24/7 for $65 — no membership. Call (832) 949-4837.',
    lead: 'Keys on the seat, doors locked, and you’re standing outside. Our <strong>car lockout service</strong> comes to you 24/7 to get you back in carefully — with an upfront price before we roll.',
    body: `
<h2>That moment the door clicks shut</h2>
<p>You hear the lock, and you see your keys on the seat — or in the ignition, or in a bag in the back. It happens to everyone: grabbing groceries at a busy store, loading kids into the car, stepping out at a gas pump, or after a long day when your mind is somewhere else. Push-button cars can lock themselves with the fob still inside, too. Suddenly a normal errand turns into standing in a parking lot with your phone, wondering who to call.</p>
<p>When you’re <strong>locked out of your car</strong>, the last thing you want is a three-hour wait from an app. Call a local, owner-operated company that picks up the phone.</p>

<h2>How we unlock your car</h2>
<ol>
  <li><strong>Call or text <a href="tel:+18329494837">(832) 949-4837</a>.</strong> Tell us where you are, the make and model, and whether anyone is inside the vehicle.</li>
  <li><strong>Share your location.</strong> Send a map pin by text, or use “Use my location” on the request form.</li>
  <li><strong>Get your upfront price</strong> and an honest arrival estimate before we head out.</li>
  <li><strong>We open your car carefully.</strong> We use proper lockout tools made for unlocking car doors, and we take care with your door, paint, window and weather seals.</li>
  <li><strong>You get your keys back</strong> — and we don’t leave until you’re in and good to go.</li>
</ol>
<p>Please be ready to show that the car is yours once it’s open — a license matching the registration, for example. It protects you and every other driver.</p>

<h2>If a child or pet is locked inside</h2>
<div class="callout"><p><strong>Call 911 first if a child, a vulnerable adult or a pet is locked in a hot car.</strong> Inside temperatures in a Texas summer can climb dangerously fast. Then call us — but emergency services come first.</p></div>

<h2>What to do while you wait</h2>
<ul>
  <li><strong>Check every door and the trunk.</strong> Sometimes one door or the hatch didn’t lock.</li>
  <li><strong>Look for a spare.</strong> A spare key at home or with family might be faster — we’ll tell you honestly if that’s the better option.</li>
  <li><strong>Don’t force it.</strong> Coat hangers, wedges and screwdrivers can scratch paint, tear weather stripping and damage wiring inside the door.</li>
  <li><strong>Stay somewhere safe and visible.</strong> At night, wait in a lit area or inside a nearby store, and keep your phone on.</li>
  <li><strong>If the engine is running</strong> with the keys inside, don’t worry — that’s a common call. Just stay near the vehicle.</li>
</ul>
<p>Read more in our guide: <a href="/guides/locked-keys-in-car/">locked your keys in the car? What to do (and not do)</a>.</p>

<h2>Car lockout service near you, 24/7</h2>
<p>Lockouts don’t keep business hours. Whether it’s a late-night lockout outside a restaurant in The Woodlands, a Saturday-morning lockout at a Tomball ballfield, or a lockout in your own driveway in Spring, we’re available 24 hours a day with no membership needed.</p>
`,
    faqs: [
      { q: 'How much does a car lockout cost?', a: '<p>A vehicle lockout is <strong>$65</strong> — no membership and no surprise fees. You’ll confirm the price on the phone before we head out. See <a href="/pricing/">pricing</a>.</p>' },
      { q: 'Will unlocking my car damage it?', a: '<p>We use proper lockout tools made for opening car doors and work carefully to protect your door, window, paint and weather seals.</p>' },
      { q: 'What if my keys are locked in the trunk?', a: '<p>Tell us when you call. On many vehicles, opening a door gives access to the trunk release or fold-down seats.</p>' },
      { q: 'Can you make me a new key?', a: '<p>Our lockout service gets you back into your car when your keys are inside. If your keys are lost or broken, you may need a locksmith or dealer for a replacement key — we’ll tell you honestly when you call.</p>' },
      { q: 'Do I need to prove it’s my car?', a: '<p>Yes. Once the car is open, please show ID that matches the registration or other proof that it’s yours. It keeps everyone safe.</p>' },
      { q: 'Do you handle lockouts at night?', a: '<p>Yes, 24/7 — late nights, weekends and holidays included.</p>' },
    ],
  },
  {
    slug: 'fuel-delivery-spring-tx',
    key: 'fuelDelivery',
    icon: 'fuel',
    preset: 'Fuel delivery',
    name: 'Emergency fuel delivery',
    serviceType: 'Emergency fuel delivery / gas delivery',
    title: 'Emergency Fuel Delivery in Spring, TX | LaCaze',
    h1: 'Ran Out of Gas? We Bring Fuel to You',
    description: 'Out of gas in Spring, TX or on I-45? 24/7 emergency fuel delivery from LaCaze Roadside Assistance: $60 + fuel. Call (832) 949-4837.',
    lead: 'The needle hit empty and the engine went quiet. Our <strong>emergency fuel delivery</strong> brings enough gas to get you to the next station — 24/7, with an upfront price before we roll.',
    body: `
<h2>When the engine sputters and the gas station is just out of reach</h2>
<p>Maybe you were sure you could make it to the next exit. Maybe the fuel gauge isn’t accurate, or traffic on I-45 crawled for an hour and burned the last of your tank. Now you’re coasting onto the shoulder, cars are flying by, and the nearest gas station is a mile away — too far to walk safely, especially at night or in the heat.</p>
<p>Running out of gas is stressful, but it’s one of the simplest roadside problems to fix. You don’t need a tow — you need fuel delivered to where you are.</p>

<h2>How our gas delivery works</h2>
<ol>
  <li><strong>Get safe first.</strong> Pull as far off the road as you can and turn your hazards on.</li>
  <li><strong>Call or text <a href="tel:+18329494837">(832) 949-4837</a>.</strong> Tell us your vehicle and the type of fuel it takes.</li>
  <li><strong>Share your location.</strong> Text a map pin, or give us the highway, direction of travel and nearest exit or mile marker.</li>
  <li><strong>Get your upfront price</strong> and arrival estimate before we roll.</li>
  <li><strong>We bring fuel to you</strong> — enough to get you to the nearest gas station — and stay until your engine is running and you’re safely back on the road.</li>
</ol>

<h2>Stuck on the highway? Safety first</h2>
<div class="callout"><p><strong>Stuck somewhere unsafe? Stay in your car with your seatbelt on and your hazards flashing — we’re on the way.</strong> If you feel you’re in danger from traffic, call 911.</p></div>
<ul>
  <li><strong>Don’t walk along the highway</strong> to find gas. Shoulders on I-45, the Grand Parkway (SH 99) and TX-249 are dangerous, especially after dark.</li>
  <li><strong>If you must get out,</strong> exit on the side away from traffic and stand well behind a barrier or up the embankment.</li>
  <li><strong>In the heat,</strong> keep water with you and crack windows if the A/C isn’t running. If you’re safe in a parking lot, wait in nearby shade or indoors.</li>
  <li><strong>Turn off accessories</strong> to save your battery, but keep your hazards on.</li>
  <li><strong>Keep your phone on.</strong> We’ll call you with updates — and if we’re running late, we call you first.</li>
</ul>
<p>Our guide covers more: <a href="/guides/ran-out-of-gas-i-45-grand-parkway/">ran out of gas on I-45 or the Grand Parkway? Stay safe until help arrives</a>.</p>

<h2>After you’re running again</h2>
<p>Head straight to a gas station and fill up. Running a tank completely dry can sometimes make a car hard to restart. If your car cranks but won’t start after fuel is added, let us know — a dead battery from trying to restart is common, and we can also give you a <a href="/jump-start-spring-tx/">jump start</a>.</p>

<h2>Gas delivery near you, day or night</h2>
<p>We deliver fuel across Spring and the north Houston area 24 hours a day — late nights, weekends and holidays. No membership needed, no long dispatch wait, and a real person on the phone.</p>
`,
    faqs: [
      { q: 'How much does fuel delivery cost?', a: '<p>Fuel delivery is <strong>$60 plus the cost of fuel</strong>. You’ll confirm the price on the phone before we head out. See <a href="/pricing/">pricing</a>.</p>' },
      { q: 'How much gas do you bring?', a: '<p>We bring enough fuel to get you safely to the nearest gas station so you can fill up.</p>', todo: 'Confirm with John how many gallons are delivered.' },
      { q: 'Can you deliver diesel?', a: '<p>Tell us your vehicle and fuel type when you call, and we’ll confirm before we head out.</p>', todo: 'Confirm whether diesel is available.' },
      { q: 'Do you deliver gas on the highway?', a: '<p>Yes. Tell us the highway, direction and nearest exit or mile marker — for example, I-45 northbound near Rayford Rd — and stay in your car with hazards on if the shoulder is unsafe.</p>' },
      { q: 'Is it safe to walk to a gas station?', a: '<p>Walking along a highway shoulder is dangerous, especially at night. It’s safer to stay with your vehicle and have fuel delivered.</p>' },
      { q: 'Do you deliver gas at night?', a: '<p>Yes, we’re available 24/7, including late nights, weekends and holidays.</p>' },
    ],
  },
];
