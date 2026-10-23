# Smith & Shine: website

Mobile valeting & detailing in Telford, Shropshire. Astro (static) + Netlify Functions.
Design system: "Ironbridge & Gold" (cast iron, ivory and gold leaf, with the 1779 Iron Bridge arch as the motif).

- **Preview:** `https://smith-and-shine-telford.netlify.app` (not deployed yet, see [Deploy](#deploy))
- **Every fact, price, area and review lives in one file:** [`src/config/site.ts`](src/config/site.ts)

---

## ⚠️ TODO-CONFIRM (check these with Chris before go-live)

Every unverified item is marked `// TODO-CONFIRM` in `src/config/site.ts`.

1. **Phone number conflict (most important).** The 2026 price-list graphics say **07433 723029**. Facebook says **+44 7422 723029**. The site uses **07433 723029** as a placeholder. Whichever is right must match the Google Business Profile exactly. Change it once in `site.ts` → `phone`; tel: links, WhatsApp links, schema, footer and emails all follow.
2. **Exact Google Business Profile name**, character for character ("Smith & Shine" vs "Smith&Shine"). → `business.name`
3. **Google review count and rating** (shown as "★★★★★ 70+ Google reviews"; research says about 72–75, all five-star). → `googleRating`
4. **Google reviews URL** and **"write a review" URL** (currently a Google search fallback). → `social.googleReviews`, `social.googleWriteReview`
5. **Google Maps / Business Profile URL** (adds to schema `sameAs` once set). → `social.googleMaps`
6. **Facebook page URL** (the footer icon and schema `sameAs` appear once it's filled in). → `social.facebook.url`
7. **Team:** reviews say "Kirt" (and once "Kirk") and one says "Chris and his son". Spelling and relationship unconfirmed, so the site only says "Chris and the team". → `business.teamLine`
8. **Opening hours.** Facebook says "Always open"; reviews mention weekday and Saturday visits. The site says "Weekdays and Saturdays, by appointment". `openingHoursSpecification` is left out of the schema until confirmed. → `business.hoursText`
9. **Reply time** ("We usually reply the same day"). → `business.replyPromise`
10. **Payment methods** (not shown anywhere yet). → `business.paymentText`
11. **Full area coverage**, including the Telford estate list and the villages listed on each area page (`src/content/areas/*.md`). Also: is there any travel charge for the outer towns? The site doesn't mention one.
12. **What each clean includes.** Only the Monthly Detail Package list is from Chris's own price list. The mini valet, full valet, deep clean, detailing and van lists are our best description and need Chris to check. → `inclusions`
13. **Car size examples** on the booking form and prices page (e.g. "Medium: Focus, Golf, A3"). → `sizes[].hint`
14. **Ceramic coating:** product brand(s) and warranty. Page currently says "confirmed with your quote".
15. **PPF:** brand, warranty, and full vs partial wraps. Page is behind a flag: `features.ppf.enabled` in `site.ts`; set to `false` to remove the page, its links and the form option in one go.
16. **Owner's email** for bookings at go-live (`BOOKING_TO_EMAIL`).
17. **Owner's note, About page and the five guides** are written in Chris's voice from his own review replies. Chris should read them and change anything that doesn't sound like him.
18. **Privacy page:** add the business's legal name / data-controller details if needed.
19. **Rain policy:** the FAQ says "if it's properly wild, we'll talk to you and sort another day". Confirm that's how Chris handles it.
20. **Does Chris need the customer's water or power?** The site deliberately doesn't say either way.

---

## Run it

Needs Node 22.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site → dist/, then OG images → dist/og/
npm run preview    # serve dist/
npm test           # price estimator, validation, and the booking functions
npm run check      # Astro/TypeScript check
```

To test the booking function locally with real Blobs, use the Netlify CLI: `npx netlify dev`.

### Photos

Originals go in `assets/photos-original/` (git-ignored, because some show number plates).
`npm run photos` copies them into `src/assets/photos/`, **blurring number plates and house numbers** and cropping screenshot borders (see the `BLUR` and `CROP` lists in `scripts/prepare-photos.mjs`). Only the processed copies are committed. Astro then makes AVIF/WebP at fixed sizes and never upscales.

### Fonts

Manrope comes from `@fontsource/manrope`. Fraunces comes from `@fontsource-variable/fraunces`, subset to the characters the site uses (keeps the optical-size axis) into `public/fonts/`. Rebuild with `python3 scripts/subset-fonts.py` (needs `pip install fonttools brotli`). Metric-matched fallback fonts in `src/styles/tokens.css` stop layout shift while fonts load.

---

## Changing prices (one place)

Open `src/config/site.ts`:

- Monthly plan: `monthlyPlan.prices` (per size) and `monthlyPlan.includes` (the 12 items).
- Everything else: `services` → `from` (a number, or `null` for "price on quote").

The price board, every service page, the FAQ answers, the booking form, the live estimate, the booking email subject, the schema `hasOfferCatalog` and the OG text all read from there. `npm test` checks the estimator against config, and checks the 2026 price list values, so update `tests/estimate.test.ts` when the price list changes.

---

## Bookings

The form at `/book/` has three steps and a live estimate. It posts to **`/api/book`** (`netlify/functions/book.mts`):

1. Spam checks: honeypot field, time-trap (under 3 seconds is rejected), length limits, links stripped from notes, **5 requests per IP per hour** (Netlify Blobs), optional Cloudflare Turnstile.
2. Validation: UK phone, UK postcode. Postcodes outside TF/SY/WV are **flagged in the email, never rejected**.
3. **Saved to Netlify Blobs first** (store `bookings`, photos in `booking-photos`), so nothing is lost if email fails.
4. Email to `BOOKING_TO_EMAIL` via Resend. Subject: `New booking: {service} · {vehicle} · {postcode} · est. £{estimate}`. Tidy table, "WhatsApp {name}" button with a pre-filled reply, "Call {name}" button, photos attached.
5. Short, warm auto-reply to the customer if they gave an email.
6. One-line alert to `NOTIFY_WEBHOOK_URL` if set.

Works without JavaScript (normal form post, 303 redirect to `/thank-you/`, or a plain error page). With JavaScript, photos are compressed in the browser to about 1600px JPEG, and the last step can **send the same summary on WhatsApp instead**.

### Exporting bookings

`https://<site>/api/bookings.csv`, protected with Basic Auth (`ADMIN_USER` / `ADMIN_PASS`). Opens in Excel or Google Sheets. Newest first.

### Tracking

Events: `whatsapp_click`, `call_click`, `book_start`, `book_submit`, `estimate_used`, `upsell_click`. GA4 loads **only** if `PUBLIC_GA4_ID` is set **and** the visitor says yes on the small consent bar. First-touch UTMs and `gclid` are kept in sessionStorage and sent with the booking.

---

## Environment variables

Set in Netlify → Site configuration → Environment variables. See `.env.example`.

| Variable | Needed | What it does |
| --- | --- | --- |
| `PREVIEW_MODE` | yes | `true` (default): noindex, robots `Disallow: /`, preview ribbon. `false` at go-live. |
| `SITE_URL` | yes | Canonical domain, no trailing slash. |
| `RESEND_API_KEY` | yes | Resend API key for booking emails. |
| `BOOKING_TO_EMAIL` | yes | Preview: `itsprimopartners@gmail.com`. Go-live: owner's email. Comma-separate for several. |
| `BOOKING_FROM_EMAIL` | yes | `onboarding@resend.dev` until the domain is verified in Resend. Note: Resend only delivers `onboarding@resend.dev` mail to the Resend account's own address, so **customer auto-replies only start once the domain is verified**. |
| `ADMIN_USER`, `ADMIN_PASS` | yes | Basic Auth for `/api/bookings.csv`. |
| `NOTIFY_WEBHOOK_URL` | optional | Slack/Discord/Zapier webhook for a one-line alert. |
| `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET` | optional | Cloudflare Turnstile spam check. |
| `PUBLIC_GA4_ID` | optional | GA4 measurement ID (consent-gated). |
| `RATE_SALT` | optional | Extra salt for hashing IPs in the rate limiter. |

No secrets are committed.

---

## Deploy

Netlify, with `smith-and-shine/` as the **base directory** (this project lives in a subfolder of the repo):

- Base directory: `smith-and-shine`
- Build command: `npm run build`
- Publish directory: `dist`
- Functions: `netlify/functions` (Functions v2, routes `/api/book` and `/api/bookings.csv`)
- Site name: `smith-and-shine-telford`

`netlify.toml` sets the security headers (CSP allowing self, Google Analytics and Turnstile; `X-Frame-Options: DENY`; Referrer-Policy; Permissions-Policy; HSTS) and long caching for hashed assets.

### Go-live checklist

1. Clear the TODO-CONFIRM list above (phone number first).
2. Add the custom domain in Netlify and set `SITE_URL` to it.
3. Verify the domain in Resend; set `BOOKING_FROM_EMAIL` to e.g. `bookings@<domain>` and `BOOKING_TO_EMAIL` to Chris's email.
4. Set `PREVIEW_MODE=false` and redeploy. Check `/robots.txt` allows crawling and pages are `index, follow`.
5. Send one real test booking (with a photo) and check: saved (`/api/bookings.csv`), email + attachment arrived, auto-reply arrived, redirect worked.
6. Validate schema at https://validator.schema.org (home + one service page).
7. Submit `/sitemap-index.xml` in Google Search Console.
8. Update the Google Business Profile website link to the new domain, and make sure its name and phone match the footer exactly.
9. Optional: add `PUBLIC_GA4_ID`, Turnstile keys, and a `NOTIFY_WEBHOOK_URL`.

---

## Structure

```
src/config/site.ts       every fact, price, area, review, nav, TODO-CONFIRM
src/config/env.ts        build-time env (PREVIEW_MODE, SITE_URL, GA4…)
src/lib/estimate.ts      price estimator (shared by form, function, tests)
src/lib/booking.ts       validation + WhatsApp/email summary (shared)
src/lib/schema.ts        JSON-LD: AutoWash, Service, FAQPage, Article, BreadcrumbList
src/styles/tokens.css    design tokens (colours, type, spacing, fonts)
src/components/          BridgeArch, PriceBoard, AreaMap, MobileBar, Header…
src/layouts/             Base (SEO/OG/schema), Service (service pages)
src/content/areas/       area pages (600+ unique words each)
src/content/guides/      Car Care Notes (900–1,300 words each)
netlify/functions/       book.mts, bookings-csv.mts
scripts/                 prepare-photos, make-og, subset-fonts
tests/                   estimator, validation and function tests
```

No review or AggregateRating schema on purpose: Google treats reviews a business hosts about itself as self-serving. Reviews are quoted word for word, typos and all.
