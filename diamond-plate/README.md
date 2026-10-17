# Diamond Plate Ceramic Coating (Brisbane): website

A multi-page, static Astro site with a serverless lead pipeline on Netlify Functions.
Built for three jobs, in order: **turn visitors into calls and quote requests**, **rank for
“ceramic coating Brisbane” and related local searches**, and **look like the most premium
ceramic coating brand in Brisbane**.

- **Framework:** Astro 7 (static output), TypeScript, no CSS framework (tokens in `src/styles/tokens.css`, scoped component styles).
- **JS shipped:** ~3 KB gzip total (no jQuery, no slider libraries).
- **Backend:** `netlify/functions/quote.mjs` (`POST /api/quote`) and `netlify/functions/leads-export.mjs` (`GET /api/leads.csv`), with leads stored in Netlify Blobs and emailed through Resend.

---

## Run it

```bash
cd diamond-plate
npm install
npm run dev        # http://localhost:4321 (static pages; /api/* needs Netlify)
npm run build      # outputs dist/
npm run preview    # serve dist/
```

On Netlify, set the site’s **Base directory** to `diamond-plate`. `netlify.toml` sets the build command
(`npm run build`), publish directory (`dist`) and functions directory (`netlify/functions`).

---

## Change a fact in one place

Every business fact lives in **`src/config/site.ts`**. Change it there and the whole site,
schema, OG images, emails and guides follow.

| To change… | Edit in `src/config/site.ts` |
| --- | --- |
| Phone number | `business.phone` (`display`, `tel`, `schema`) |
| Email, address, geo pin | `business.email`, `business.address`, `business.geo` |
| Prices / package contents | `packages` (and `addOns` for the $80 wheel add-on) |
| The “prices may vary” line | `priceNote` |
| Warranty length (everywhere) | `warrantyYears` |
| Hours | `hours` |
| Reply promise | `replyPromise` |
| Suburbs per region | `regions[].suburbs` |
| Reviews | `reviews` (word for word only) |
| Facebook / Messenger / Google links | `social` |

Other content files:

- `src/config/routes.ts`: every page’s `<title>`, meta description and H1.
- `src/config/faqs.ts`: the FAQ bank (visible answers and FAQPage schema come from the same text).
- `src/config/region-content.ts`: the unique copy for each service-area page.
- `src/content/guides/*.md`: the seven guides. Use `{{tokens}}` such as `{{price.single}}`,
  `{{warrantyYears}}`, `{{noWashDays}}` and `{{phone}}` instead of typing a fact (see `src/lib/tokens.ts`).

---

## Environment variables

Copy `.env.example` → `.env` for local work. On Netlify set them under
**Site configuration → Environment variables** with scopes **Builds** and **Functions**.

| Variable | Needed | What it does |
| --- | --- | --- |
| `PREVIEW_MODE` | yes | `true` (default): noindex on every page, `robots.txt` disallows all, preview ribbon shown. `false` for go-live. |
| `SITE_URL` | yes | Canonical origin, no trailing slash. Drives canonicals, sitemap, OG URLs and schema. |
| `RESEND_API_KEY` | yes | Resend API key (free tier) for lead emails and auto-replies. |
| `LEAD_TO_EMAIL` | yes | Where leads go. Preview: `itsprimopartners@gmail.com`. Live: `infoqld@diamondplate.com.au`. Comma-separate for several. |
| `LEAD_FROM_EMAIL` | yes | `Diamond Plate Leads <onboarding@resend.dev>` until the domain is verified in Resend, then `Diamond Plate <quotes@diamondplate.com.au>`. |
| `ADMIN_USER`, `ADMIN_PASS` | for export | HTTP Basic Auth for `/api/leads.csv`. Export is disabled (503) until both are set. |
| `NOTIFY_WEBHOOK_URL` | optional | Discord / Slack / Google Chat webhook for an instant phone alert per lead. |
| `TURNSTILE_SECRET` + `PUBLIC_TURNSTILE_SITE_KEY` | optional | Cloudflare Turnstile. Skipped gracefully if unset. |
| `PUBLIC_GA4_ID` | optional | GA4 id. GA loads only after the visitor accepts the consent bar. No id = no banner, no GA. |
| `RATE_LIMIT_SALT` | optional | Salt for hashing IPs in the rate limiter. |

> **Resend note:** with the `onboarding@resend.dev` sender, Resend only delivers to the email
> address that owns the Resend account. So in preview, lead emails reach Primo Partners, but
> customer auto-replies won’t send until `diamondplate.com.au` is verified in Resend. Leads are always
> saved to Blobs regardless.

---

## How the quote form works

1. The form posts to `/api/quote`. With JS it sends JSON and shows errors inline (each field has
   `aria-describedby` → its error, and a summary is announced via `aria-live`). Without JS it’s a normal
   form POST: success redirects to `/thank-you/`; errors render a simple page with a back link.
2. Spam protection: honeypot field, a 3-second time-trap (measured when JS runs), max length on every field,
   links stripped from the message, 5 submissions per IP per hour (Netlify Blobs store `ratelimit`), optional Turnstile.
3. The server validates everything (Australian phone formats included) and **saves the lead to Blobs
   (store `leads`) before emailing**, so no lead is lost.
4. Emails the business via Resend (subject `🔷 New quote: {vehicle} in {suburb} ({package})`, a table of every field,
   lead source, a big tap-to-call link, `reply-to` = customer). Sends the customer a short branded auto-reply if they
   gave an email. If email fails, the visitor still gets `{ ok: true }`, the error is logged, and it goes in the webhook alert.
5. UTM parameters, `gclid` and referrer from the first page of the visit are stored in `sessionStorage`
   and copied into hidden fields.

### Tracking events (`src/scripts/track.ts`)

Pushed to `dataLayer` (and logged to the console in preview mode): `call_click` (every `tel:` link, with page path),
`quote_start`, `quote_submit`, `messenger_click`, `price_view` (package grid / table scrolled into view), and
`generate_lead` on `/thank-you/` after a real submission (use this one as the GA4 conversion).

---

## Export leads (monthly review)

Open **`{SITE_URL}/api/leads.csv`** and sign in with `ADMIN_USER` / `ADMIN_PASS`. You get a CSV with
date, name, phone, email, suburb, vehicle, package, howHeard, utm_source, utm_medium, utm_campaign, pageUrl.
Leads are also visible in the Netlify UI under **Data & Storage → Blobs → leads**.

---

## Go-live checklist (5 steps)

1. **Confirm every TODO-CONFIRM item below** with the owner and update `src/config/site.ts`.
2. **Verify the domain in Resend**, then set `LEAD_FROM_EMAIL=Diamond Plate <quotes@diamondplate.com.au>` and
   `LEAD_TO_EMAIL=infoqld@diamondplate.com.au` in Netlify.
3. **Point the domain at Netlify** and set `SITE_URL` to it (e.g. `https://brisbane.diamondplate.com.au`, no trailing slash).
4. **Set `PREVIEW_MODE=false`** (removes noindex and the ribbon, opens `robots.txt`) and trigger a redeploy.
5. **After deploy:** submit a test quote, check `/api/leads.csv`, submit `{SITE_URL}/sitemap-index.xml` in Google Search Console,
   and update the Google Business Profile website link (see `GBP-NOTES.md`).

---

## TODO-CONFIRM (check with the owner before go-live)

All of these are marked `TODO-CONFIRM` in the code. Most are in `src/config/site.ts`.

1. **Drop-off:** can customers drop cars at Murarrie? (`business.dropOffAvailable`). Until confirmed the site says “We come to you” and never “visit our workshop”.
2. **Hours:** placeholder Mon–Fri 8:00am–5:00pm (Google shows “Opens 8 AM Mon”) (`hours`).
3. **Warranty length:** 12 years in config; Facebook says “7–10 year” and parts of the FAQ say 10 (`warrantyYears`).
4. **Insurance:** major insurers recognise Diamond Plate and cover reapplication after an accident repair (`warranty.insuranceNote`).
5. **Large-vehicle pricing:** “Large 4WDs, vans and vehicles needing extra prep may vary” (`priceNote`).
6. **Reply promise:** “We reply within 1 business hour, Mon–Fri” (`replyPromise`; the customer auto-reply in `quote.mjs` uses the same wording).
7. **Technician:** is Nate a Brisbane applicator? Captions say “Nate, Diamond Plate certified applicator” until confirmed (`business.technicianCaption`).
8. **Paint correction / machine polishing:** not offered on the site. Confirm it isn’t a service.
9. **PPF:** the PPF guide says “we don’t install film”. Confirm.
10. **Messenger link:** `https://m.me/diamondplateaustralia`. Confirm the page username (`social.messenger`).
11. **Google Maps URL** for `sameAs` and the **Google review link** for the “Leave us a Google review” buttons (`social.googleMaps`, `social.googleReview`). Both currently use a Maps search link.
12. **Geo pin:** −27.45556, 153.10281, decoded from the GBP plus code G4V3+Q4. Confirm against the pin (`business.geo`).
13. **Google review wording:** Motti Abraham’s and Matt’s reviews must be checked word for word against Google (`reviews[].confirmed: false`).
14. **Suburb coverage** for all four regions (`regions`).
15. **GST:** whether the published prices include GST (the terms page currently doesn’t say; see `src/pages/terms.astro`).
16. **Phone number:** the site uses only 1300 995 100 (the GBP number). See `GBP-NOTES.md` for the mismatches to fix elsewhere.

---

## Project map

```
diamond-plate/
├── netlify.toml                    # build, functions, security + cache headers
├── netlify/functions/
│   ├── quote.mjs                   # POST /api/quote: lead pipeline
│   └── leads-export.mjs            # GET /api/leads.csv: protected CSV export
├── src/
│   ├── config/site.ts              # ALL business facts (single source of truth)
│   ├── config/routes.ts            # titles, descriptions, H1s
│   ├── config/faqs.ts              # FAQ bank
│   ├── config/region-content.ts    # service-area copy
│   ├── config/photos.ts            # photo alt text + captions
│   ├── content/guides/*.md         # the 7 guides (content collection)
│   ├── components/                 # Header, Footer, QuoteForm, PackageCards, BeforeAfter…
│   ├── layouts/Base.astro          # head, SEO, schema, preview ribbon, consent
│   ├── lib/schema.ts               # JSON-LD builders (no review/rating schema)
│   ├── lib/tokens.ts               # {{token}} fill for Markdown guides
│   ├── pages/                      # every route, plus robots.txt, manifest, og/*.png
│   ├── scripts/                    # main.ts, track.ts, quote-form.ts
│   └── styles/tokens.css           # design tokens + base styles
└── GBP-NOTES.md                    # Google Business Profile hand-off for the owner
```

Photos are Diamond Plate’s national work and are captioned “Diamond Plate work”, never as Brisbane jobs.
The review graphics, social posts and screenshots from the asset pack are reference only and are not in this repo.
