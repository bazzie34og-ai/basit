# Paws 2 Purrs: keyword & competitor research (29 Oct 2026)

Research done with live web search before writing the copy. Some sites (Google Maps, Facebook, Instagram, paws2purrs.co.uk, dogfriendly.co.uk, gedling.gov.uk) were **blocked by this build environment's network policy**, so a few checks need doing by hand (listed at the end).

## 1. What ranks for the core searches

| Search | What came back |
|---|---|
| dog daycare Arnold | Pawshake (Arnold daycare listing page), Rover (Nottingham daycare, plus an **Arnold, Minnesota** page), The Good Dog Guide (Arnold directory) |
| dog boarding Arnold Nottingham | Pawshake home boarding (Arnold), DogFriendly listings, directories |
| dog daycare Nottingham | Rover (two Nottingham pages), Pawshake (Nottingham, Carlton, Radcliffe), Nottingham Pet Care (Wollaton, Trustpilot 4.5 from 25), Ruffles (city-centre indoor daycare) |
| home dog boarding Nottingham | Pawshake sitter profiles, Canine Care Club (Hucknall), B's Wings (Sherwood), Nottingham Pet Care, Dexters Pet Pals, The Paw Pad, a Rover profile "licensed with Gedling Borough" |

**Takeaway:** your quick check was right. Page 1 for Arnold is almost entirely **platforms and directories** (Pawshake, Rover, Good Dog Guide, DogFriendly). There's **no independent Arnold daycare/boarding website** in the results. Even Rover's "Arnold" page is the wrong country. An independent, licensed site with real photos, real reviews and proper local pages has a clear gap to fill.

Paws 2 Purrs already appears on: DogFriendly (kennels listing #89792, entered in the Dog Friendly Awards), DoggyDaysOut ("paws2purrs Dog Daycare and boarding: Dog Friendly Daycare in Nottingham") and Facebook. **These should all link to the new website once it's live** (citations plus backlinks).

## 2. Licence check: a big trust win
Gedling Borough Council publishes star ratings for licensed animal businesses. Search results for its list (dated **1 June 2025**) show, under **Home Boarding: "Paws 2 Purrs: 5 stars"**.
- This backs up the "5 stars" on her DogFriendly listing.
- The site keeps `flags.fiveStarLicence = false` until Vanessa confirms it (as briefed). **Recommend turning it on**: it's the strongest trust signal she has, and competitors' sites lead with theirs.
- Note: the list showed her under *home boarding*. Ask Vanessa whether her licence also covers *day care* (Gedling licenses these separately). The site just says "Licensed by Gedling Borough Council", which is accurate either way.

## 3. Discrepancies spotted
- **Years:** her DogFriendly listing says the business has run "for seven years"; her 2026 flyer says "10 years' experience". The site uses **10 years' experience** (her experience, not the business's age, so both can be true). Confirm.
- **House number:** directory listings publish the full street address (house number on Cross Street). The site only shows "Arnold, Nottingham NG5", as briefed. Ask Vanessa whether she wants those listings changed too.

## 4. Owner pain points (from guidance and 1–3★ reviews)
From Blue Cross, RSPCA, platform complaints (Rover/Pawshake) and forums:
- **"Is it actually licensed?"** Owners are told to ask for proof of licence and insurance before booking (Blue Cross). → Licence + insurance appear in the hero, trust row, every service page, footer and FAQ.
- **Last-minute cancellations by platform sitters** are the most common complaint on Rover/Pawshake review sites. → "Dogs stay for years" + long-term regulars (Gracie 5+, Loki ~6, Reign ~4, Lola 3+) + "reliable" quotes.
- **"Where will my dog sleep? How many dogs?"** (RSPCA advice). → "Sleep where they normally would", "small pack". *TODO: if Vanessa is happy to state her maximum number of dogs, add it. It's a frequent question.*
- **Updates and visibility.** Reviewers on every platform praise photo/video updates. → Updates feature in trust row, promises, FAQ.
- **Visit first.** Guidance says to visit before booking. → "Book a meet & greet" CTA everywhere.
- **Nervous dogs, medication, big breeds.** → Backed with Jill's, Claire's and the husky owner's own words.

## 5. Price context (not used on site)
Rover's Nottingham guide and listings show home daycare from around £20–£28/day and Pawshake boarding from ~£36/night. Prices are **not** on the site (`SHOW_PRICES=false`), but this helps Vanessa if she decides to publish.

## 6. Keyword map (where each target lives)
| Page | Primary | Secondary |
|---|---|---|
| `/` | dog daycare Arnold, dog boarding Arnold | doggy daycare Nottingham, dog sitter Arnold, licensed |
| `/dog-daycare-arnold-nottingham/` | doggy daycare Arnold / Nottingham | nervous dog daycare, husky daycare, insured dog daycare |
| `/dog-boarding-arnold-nottingham/` | home dog boarding Nottingham | dog boarding not kennels, home from home, weekend/holiday boarding, boarding for dogs on medication |
| `/dog-walking-arnold-nottingham/` | dog walker Arnold | dog walking with pick up and drop off, dog pop in visits |
| `/cat-sitting-arnold-nottingham/` | cat sitter Arnold | cat pop ins Nottingham, small animal feeding |
| `/christmas-dog-boarding-nottingham/` | Christmas dog boarding Nottingham | holiday dog boarding |
| Area pages | dog daycare + Mapperley / Woodthorpe / Sherwood / Redhill / Bestwood / Daybrook / Gedling / Carlton | home dog boarding near …, dog walking near … |

"Daycare for puppies" was **not** targeted: puppies aren't confirmed.

## 7. Couldn't check from here (do by hand)
- `paws2purrs.co.uk`: DNS didn't resolve from this environment, and the host was blocked, so I couldn't tell if it's live, parked or lapsed. Check in a browser and with the registrar.
- Instagram `@paw_2_purrs`: listed on her own Facebook page, but I couldn't load it. Kept off the site until confirmed (`flags.showInstagram`).
- Her exact Google Business Profile URL: not found in search. The site uses a Google Maps search link for "Paws 2 Purrs … NG5 7BD" for now.
- Google autocomplete / "People also ask": not reachable as raw data here. FAQ questions came from the brief, guidance sites and reviews.
