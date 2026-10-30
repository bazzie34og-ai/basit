# Bond Cleaning Brisbane Co. website

Astro static site for **Bond Cleaning Brisbane Co.**, bond and end of lease cleaning for Brisbane's Northside and inner north. Built from the `bond-cleaning-brisbane-co-website-kit` plus the build brief.

- **Netlify project:** `bond-cleaning-brisbane-co` → https://bond-cleaning-brisbane-co.netlify.app (preview, noindex)
- **Production domain (not bought yet):** https://bondcleaningco.com

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run audit      # self-audit against the playbook (python3 + beautifulsoup4)
```

Node 22. The build crops the slider photos once with `node scripts/crop-photos.mjs` (already done; re-run only if the source photos change).

## Where things live

| What | File |
|---|---|
| **Every fact, promise, price and flag** | `src/config/site.ts` (search for `[`) |
| Services and suburbs: URLs, titles, H1s, metas, keywords | `src/data/site-data.json` (from the kit) |
| Service page copy (22) | `src/content/services/*.ts` |
| Suburb page copy (20) | `src/content/areas/*.ts` |
| FAQ bank (33 + 22 worries) | `src/data/faqs.ts` |
| Blog posts | `src/content/blog.ts` |
| Photos, alt text, captions | `src/data/photos.ts` + `src/assets/photos/` |
| Real Google reviews (empty until real ones exist) | `src/data/reviews.json` |
| Design tokens and components CSS | `src/styles/global.css` |
| JSON-LD builders | `src/lib/schema.ts` |
| Copy templating (`{phone}`, `{reclean}`, `{?payAfter}…{/payAfter}`) | `src/lib/tpl.ts` |

Each page file states its buyer-intent tier in a comment at the top.

### Promise flags

`flags` in `site.ts` switch promises on or off everywhere (chips, copy, FAQs, schema): `payAfter`, `reCleanWindowHours`, `guaranteeDays`, `freeCarpet`, `sameDay`, `noWeekendSurcharge`, `insuranceAmount`, `policeChecked`, `ownCrews`, `splitPayment`, `freeCancellationHours`, `monthlyInvoicing`, `noUrgentSurcharge`. When the owner confirms a promise, set its entry in `confirmed` to `true` and the `[brackets]` disappear from that wording.

### Prices

Set the numbers in `prices` (`b1` … `b4`, add-ons, packages). While `b1` and `b2` are `null`, the site shows `[$]` and the quote form says "We'll text your fixed price within [15 minutes]". Once set, the form shows "Bond cleans like yours usually cost $X–$Y" after step 1.

### Adding a real job to a suburb page

Each suburb in `src/content/areas/*.ts` has `realJob: null`. Replace it with `{ street, property, agentList, found, did, outcome, photos }` from a real booking (street name, never a number) and the "What the agent's list said" section appears. Never copy another suburb's job or photos.

### Adding reviews

Paste real Google reviews into `src/data/reviews.json` as `[{ "name", "suburb", "date", "text", "url" }]`, exactly as written on Google. The review blocks on the homepage, service pages and `/reviews/` appear automatically. Never add `AggregateRating`.

## Pages (62 built)

53 from `sitemap-keyword-map.csv` (homepage, 10 core pages, 22 services, 20 suburbs) + 4 blog posts + `/thank-you/` (noindex), `/privacy/`, `/terms/`, `/404`, `/styleguide/` (noindex). There is no `/bond-cleaning-brisbane/` page; it 301s to `/`.

## Decisions and kit contradictions

1. **Repo layout.** The repo root already holds a different site, so this one lives in `bond-cleaning-brisbane-co/`. The root `netlify.toml` sets that folder as the build base.
2. **Suburb briefs were templated.** The kit's answer-first paragraphs and FAQs were near-identical across suburbs. The brief says pages must be unique, so every suburb page was written fresh (highest 8-word-shingle overlap between any two suburb pages: 13%).
3. **Exact alt text vs keyword in alt.** Gallery images keep the kit's exact alt text. Hero images on service pages carry a truthful keyword lead-in before the exact alt. Suburb pages don't claim the generic photos were taken there; the keyword sits in the suburb map's label instead.
4. **CSV titles/H1s that differ from the primary keyword** (e.g. "Exit & Vacate Cleaning" for *exit cleaning brisbane*, "Pressure Washing" for *pressure cleaning brisbane*) were kept exactly as the CSV says. The keyword phrase is in the first 100 words, an H2, an alt text and inbound anchors instead.
5. **Empty metas in the CSV** (homepage and core pages): homepage meta from `home.md`; core page metas written.
6. **Urgent page.** The kit says "only publish if same/next-day capacity is real". It's tied to the `sameDay` flag: off = the copy says "next available slot" and the service leaves the schema offer list.
7. **Slider photos.** The drag slider uses the BEFORE and AFTER halves of the supplied oven photo, cropped square. No new imagery.
8. **Netlify Forms** allows one file per field, so the photo upload is three optional inputs (8 MB total).
9. **Noindex.** A Netlify project's own `*.netlify.app` URL is its production context, so context-based noindex wouldn't cover it. Instead the build adds `X-Robots-Tag: noindex` and a robots meta tag unless `SITE_URL=https://bondcleaningco.com`. Deploy previews and branch deploys are forced to noindex in `netlify.toml` too.
10. **Seal badge** reads "EST. 2026". That's accurate and not a years-in-business claim.
11. **"Most booked"** badge on the 2-bed price card is a label only, as the brief allows; no numbers are claimed.
12. **Word counts.** The homepage is about 3,000 words and the end of lease page about 1,800, above the 2,500/1,500 targets, because the shared FAQ and checklist components add words. Everything else is in range.

## Open items (fill in `src/config/site.ts`)

- [ ] `[PHONE]` display + `phoneE164` (tel: links, schema)
- [ ] `[WHATSAPP]` (wa.me links)
- [ ] `[EMAIL]` (suggest hello@bondcleaningco.com; no Gmail)
- [ ] Hours `[Mon to Sun, 7am to 7pm]` and `hoursSchema`
- [ ] Reply time `[15 minutes]`, same/next-day cut-off `[2pm]`
- [ ] All prices `[$]`: 1–4 bed, add-ons, packages, furnished, extra bathroom
- [ ] `payAfter`: pay after the clean
- [ ] `reCleanWindowHours` `[24 hours]` and `guaranteeDays` `[7 days]`
- [ ] `freeCarpet`: free with every bond clean, or priced per room
- [ ] `sameDay` / `noUrgentSurcharge`: urgent capacity and pricing
- [ ] `noWeekendSurcharge`
- [ ] `insuranceAmount` `[$20m]` + certificate on About
- [ ] `policeChecked`, `ownCrews` (no subcontractors)
- [ ] `splitPayment` for share houses
- [ ] `freeCancellationHours` `[48 hours]` + later-cancellation policy (terms page)
- [ ] `monthlyInvoicing` for partner agencies; turnaround `[24–48 hours]`
- [ ] Carpet and mattress drying times `[3–6 hours]` / `[4–6 hours]`
- [ ] `pestPartner`: licensed pest control partner's name
- [ ] `gbpReviewLink` and `sameAs` (GBP, Facebook, Instagram) after the GBP build
- [ ] About page: founder/team name, how we hire and train, team photo (real only)
- [ ] FAQ A8 (bond claim evidence within 14 days): have the RTA or a lawyer check the wording
- [ ] Real jobs per suburb (`realJob`) and real Google reviews (`reviews.json`) as they happen
- [ ] GA4 or GTM ID (`ga4Id` / `gtmId`)
- [ ] **TODO: add notification email in Netlify UI** (Forms → Form notifications → Email) for the `quote` and `partner` forms

## Go-live

1. Buy `bondcleaningco.com` (and ideally `bondcleaningco.com.au`; redirect it to .com).
2. Netlify → Domain management → add the domain; HTTPS is automatic.
3. Set `SITE_URL=https://bondcleaningco.com` (production context) and redeploy. That alone removes noindex, fixes canonicals, sitemap, OG and schema URLs.
4. Fill `site.ts` (open items above) and set `confirmed` for each signed-off promise.
5. Add the form notification email in the Netlify UI.
6. Add GA4/GTM IDs. `dataLayer` already receives `call_click`, `whatsapp_click`, `quote_step1`, `quote_submit`.
7. Submit `https://bondcleaningco.com/sitemap-index.xml` to Google Search Console **and** Bing Webmaster Tools.
8. Build the Google Business Profile with the same name, identity sentence, categories, services, 20 areas and description (`gbp-alignment.md` in the kit). Website link: `https://bondcleaningco.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp`.
9. Run the Rich Results Test on `/`, one service page and `/faq/`, and Lighthouse mobile on the live domain.

## After launch (playbook)

- Add a real job and photos to each suburb page as jobs happen.
- Publish 2 blog posts a month and share each as a GBP post. Planned topics:
  5. Can Your Agent Make You Use Their Cleaner? Your Rights in QLD
  6. Bond Cleaning With Pets: Carpets, Fleas and What the Lease Says
  7. Moving Out of a Queenslander: The Bond Clean Jobs People Forget
  8. Apartment Move-Outs in the Brisbane CBD: Lifts, Docks and Balconies
  9. Failed Your Bond Inspection? What to Do in the Next 48 Hours
  10. Bond Clean vs Regular Clean: What's Actually Different
  11. The Exit Condition Report (Form 14a) Explained for Brisbane Renters
  12. Agent Claiming Your Bond for Cleaning? How to Use Your Photo Report
  13. Mould in a Rental Bathroom: What You Pay For and What You Don't (QLD)
  14. 5 Questions to Ask Any Bond Cleaner Before You Book
- Refresh the homepage and service pages every 3 months.
- Monthly: ask ChatGPT, Gemini, Perplexity and Google AI Mode "best bond cleaner in North Brisbane" and log who's named.
