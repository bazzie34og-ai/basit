# LM Auto Care · website

Mobile car valeting in Aberdeen. A static Astro site with two Netlify Functions
for bookings. No Tailwind, no UI kit, no tracking unless switched on.

The design idea is **the job sheet**: ruled tariff card, hand-ticked checklists,
mono job labels, a red SIGNED OFF stamp, a sketch map, and LM's own phone photos
leading every section, on warm paper with a faint granite speckle.

## Run it

```bash
cd lm-auto-care
npm install
npm run dev        # http://localhost:4321
npm run build      # static site into dist/
npm test           # prices maths, page meta, booking function end to end
```

The booking function (`/api/book`) only runs on Netlify or under `netlify dev`.
`npm test` exercises it locally against a throwaway Netlify Blobs server with
email stubbed out.

## Where things live

| What | Where |
| --- | --- |
| **Every fact, price, area, review, TODO** | `src/config/site.ts` |
| Page titles and descriptions | `src/config/pages.ts` |
| Design tokens (colours, fonts) | `src/styles/tokens.css` |
| Guides (long reads) | `src/content/guides/*.md` |
| Area pages | `src/content/areas/*.md` |
| FAQ copy used on the home page | `src/content/faqs.ts` |
| Booking backend | `netlify/functions/book.mjs` |
| Bookings CSV export | `netlify/functions/bookings-export.mjs` |
| Validation rules (shared by browser and server) | `src/lib/validate.ts` |
| Photos (LM's own, number plates checked) | `src/assets/photos`, `src/assets/before-after` |

### Changing a price

Edit the number in `src/config/site.ts` (`services`, `sizes` or `extras`). It
updates the tariff card, the calculator, the booking form, the booking email,
the schema and the FAQ answers. Then update the hand-written expectations in
`tests/pricing.test.mjs` and run `npm test`; the test is deliberately written
out by hand so a typo in config gets caught.

A few prices also appear inside prose (the guides and service page copy, e.g.
"£45 for a small car" for interior + pet hair). After a price change, search the
project for `£` and read the hits.

## Environment variables

All documented in `.env.example`. Set them in Netlify → Site configuration →
Environment variables.

| Variable | Needed? | What it does |
| --- | --- | --- |
| `PREVIEW_MODE` | default `true` | `true`: noindex on every page, `robots.txt` disallows all, preview ribbon shows |
| `SITE_URL` | at go-live | Canonical domain, no trailing slash. Falls back to Netlify's `URL` |
| `RESEND_API_KEY` | yes | Sends the booking email and the customer auto-reply |
| `BOOKING_TO_EMAIL` | yes | Preview: `itsprimopartners@gmail.com`. Live: `lmautocarez@gmail.com` |
| `BOOKING_FROM_EMAIL` | yes | `onboarding@resend.dev` until a domain is verified in Resend |
| `ADMIN_USER`, `ADMIN_PASS` | for export | Basic Auth for `/api/bookings.csv` |
| `NOTIFY_WEBHOOK_URL` | optional | Discord / Slack / Google Chat webhook, one-line alert per booking |
| `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET` | optional | Cloudflare Turnstile on the booking form |
| `PUBLIC_GA4_ID` | optional | GA4, loaded only after the visitor says yes in the consent bar |

**Resend note:** with the default `onboarding@resend.dev` sender, Resend only
delivers to the address that owns the Resend account. So in preview, the
business email reaches Primo Partners but customer auto-replies won't arrive
until a domain (e.g. `lmautocare.uk`) is verified and `BOOKING_FROM_EMAIL`
is changed to something like `bookings@lmautocare.uk`.

## How a booking is handled

1. Spam checks: honeypot field, a 3-second time-trap, 5 per IP per hour
   (in Blobs), field length limits, URLs stripped from notes, optional Turnstile.
2. Server-side validation (same rules as the browser). Errors go back as JSON
   and show inline under each field, announced to screen readers.
3. **Saved to Netlify Blobs (`bookings`) before anything is sent.** Photos go
   to `booking-photos`.
4. Email to the business (table of every field, WhatsApp and Call buttons,
   photos attached, reply-to set to the customer). Non-AB postcodes are
   flagged, never rejected.
5. Short plain-text auto-reply to the customer, if they gave an email.
6. Optional webhook alert.
7. If the email fails, the customer still sees success (it's saved) and the
   failure is logged and alerted.

Without JavaScript the form still works: all steps show at once, it posts
normally and redirects to `/thank-you/`. On the last step there's also
"Send these details on WhatsApp", which builds the whole summary into a
`wa.me` message.

## Exporting bookings

Visit `https://<site>/api/bookings.csv` and log in with `ADMIN_USER` /
`ADMIN_PASS`. Opens straight in Excel or Google Sheets. One row per booking,
including UTM and gclid so you can see where bookings came from.

## Tracking

`src/scripts/track.ts` pushes these to `window.dataLayer`:
`whatsapp_click`, `call_click`, `book_start`, `book_step_1`…`book_step_6`,
`book_submit`, `whatsapp_booking`, `calculator_used`, `price_view`.
In preview mode each one is also logged to the browser console as `[track]`.
First-touch UTMs and gclid are kept in sessionStorage and passed into the form.

## Rebuilding fonts and the speckle

The fonts in `public/fonts/` are static, latin-only cuts of Archivo (Expanded
800 and 600/700), Source Serif 4 and IBM Plex Mono, about 100 KB in total.
To change weights, edit and run `python3 scripts/build-fonts.py`
(needs `pip install fonttools brotli`). The granite tile is
`node scripts/build-speckle.mjs`. OG images are generated at build time by
`src/pages/og/[slug].png.ts`.

## Deploy (Netlify)

- Base directory: `lm-auto-care` (this folder lives inside a bigger repo)
- Build command: `npm run build` · Publish: `dist` · Functions: `netlify/functions`
- All of that is in `netlify.toml`, along with the security headers and CSP.

## Go-live checklist

1. Owner signs off every **TODO-CONFIRM** below; update `src/config/site.ts`.
2. Buy the domain (suggested `lmautocare.uk` or `lmvaleting.co.uk`;
   `lmautocare.co.uk` is taken) and add it in Netlify.
3. Verify the domain in Resend; set `BOOKING_FROM_EMAIL=bookings@<domain>`.
4. Set `BOOKING_TO_EMAIL=lmautocarez@gmail.com`.
5. Set `SITE_URL=https://<domain>` and `PREVIEW_MODE=false`. Redeploy.
6. Check `/robots.txt` now allows crawling and points at the sitemap; check a
   page source has `index, follow`; the preview ribbon is gone.
7. Send one real test booking with a photo; confirm email, auto-reply, CSV.
8. Add the site URL (with `?utm_source=google&utm_medium=organic&utm_campaign=gbp`)
   to the Google Business Profile; put the GBP and review links in config.
9. Submit `sitemap-index.xml` in Google Search Console.
10. Validate a page with Google's Rich Results Test and schema.org validator.

## TODO-CONFIRM (owner to confirm before go-live)

Everything here is either a placeholder or a careful guess. All of it lives
in `src/config/site.ts` unless noted.

1. **Owner's name** for the signed note (currently "the LM Auto Care team").
2. **Payment methods** (cash / card / bank transfer), and whether there's **no
   card surcharge**. If so, say so prominently (competitors get complaints about it).
3. **Exact hours** (site uses: weekdays morning or afternoon, weekends evening
   preferred). Schema `openingHoursSpecification` is left out until confirmed.
4. **Drop-off location.** No address is published until confirmed.
5. **Flats with no outside tap:** what actually happens? (Site says "message us
   first and we'll talk it through".)
6. **Exact towns and suburbs covered**, especially Ellon, Inverurie, Stonehaven,
   Banchory, Newmachar and Balmedie, and whether far-out towns cost more
   (site says prices are the same everywhere).
7. **Facebook page URL** (currently a Facebook search link) and **Instagram
   handle**: the price graphic says `@LMAUTOCARE`, the live profile is `@lmauto_care`.
8. **Google Business Profile** URL and review link (adds "Leave a Google review"
   buttons automatically once set).
9. **Review texts** from the five Facebook reviews, with permission. The reviews
   block shows quotes only once `reviews` has entries.
10. **"Mini valet" = Basic Clean and "full valet" = Full Works** naming. Happy with it?
11. **Basic Exterior Wash £10–£20:** what decides where in the range a car falls?
12. **Separate wheel and body mitts / two-bucket wash?** Not claimed anywhere
    until confirmed.
13. **"No smoking in or near your car"** promise? Not claimed until confirmed.
14. **Reply time** after a form booking (site says "We aim to reply the same day").
15. **Offshore workers page:** does the owner want it, and how do keys and
    access work while someone's away?
16. **"If something's not right, tell us while we're still there and we'll put it
    right"** (owner's note and The LM Way). Happy to promise that?
17. **Bad weather:** the FAQ says "if the forecast looks properly bad, we'll be in touch".
18. A real **headlight restoration before/after** photo, to replace the honest
    placeholder note on that page.

## Assets

Only LM's own photos are used. The price list graphics, Facebook screenshots
and competitor review research were reference only and are not in this repo.
The van's number plate in the hero photo was blurred (it was faintly readable);
every other plate was already covered or blurred.
