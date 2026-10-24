# Steam Cleaning Solution LTD: website

Carpet, sofa & deep cleaning in Cardiff and Newport. Astro + TypeScript, hand-built CSS with tokens (no Tailwind, no UI kit), Netlify Functions v2 for the quote form.

- **Every fact, price, area, promise and review** lives in `src/config/site.ts`.
- **Design tokens** live in `src/styles/tokens.css`.
- **Page copy:** `src/content/servicePages.ts`, `src/content/areas.ts`, `src/content/guides/*.md`.
- **Client photos and logos** go in `assets/` (see `assets/README.md`).

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # assets → astro build → OG images → CSP headers, into dist/
npm test           # quote logic, API end-to-end (local Blobs + stubbed Resend), site audit of dist/
```

`npm test` audits the built site, so run `npm run build` first. The audit checks titles, metas, H1s, canonicals, banned phrases, FAQ schema vs visible text, NAP, WhatsApp pre-fills, area word counts, preview mode and the sitemap.

## Deploy (Netlify)

- Build command `npm run build`, publish `dist`, functions `netlify/functions` (all set in `netlify.toml`).
- The site lives in the `steam-cleaning-solution/` folder of the repo, so set **Base directory** to `steam-cleaning-solution`.
- Site name: `steam-cleaning-solution-cardiff` → https://steam-cleaning-solution-cardiff.netlify.app
- Security headers are in `netlify.toml`. The CSP is generated at build time into `dist/_headers`, with a sha256 hash for every inline script (no `'unsafe-inline'` for scripts).

## Environment variables

| Variable | Preview | Go-live |
|---|---|---|
| `PREVIEW_MODE` | `true` (noindex, disallow-all robots, Primo Partners ribbon) | `false` |
| `SITE_URL` | `https://steam-cleaning-solution-cardiff.netlify.app` | the real domain |
| `RESEND_API_KEY` | Resend API key | same |
| `QUOTE_TO_EMAIL` | `itsprimopartners@gmail.com` | `Steamcleaning769@gmail.com` |
| `QUOTE_FROM_EMAIL` | `onboarding@resend.dev` | an address on their verified domain |
| `ADMIN_USER`, `ADMIN_PASS` | for `/api/quotes.csv` | same |
| `PUBLIC_GA4_ID` | optional. GA4 loads only with an ID **and** the visitor's consent | |
| `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET` | optional Cloudflare Turnstile | |
| `RATE_SALT` | optional salt for hashed IPs in the rate limiter | |

Copy `.env.example` to `.env` for local development. Never commit secrets.

## The quote form

`/quote/` is three short steps (what, photos, details) with a live summary and a "Send on WhatsApp instead" link. Photos are compressed in the browser to about 1600px. Without JavaScript the same form posts normally and redirects to `/thank-you/`.

`/api/quote` (`netlify/functions/quote.mts`):

1. Accepts multipart, urlencoded or JSON.
2. Spam protection: honeypot, a 3-second time trap, length limits, links stripped from notes, 5 requests per IP per hour (Netlify Blobs), optional Turnstile.
3. **Saves to Netlify Blobs first** (`quotes` store, photos in `quote-photos`), so nothing is lost if email fails.
4. Emails the owner via Resend: subject `New quote request: {items} · {postcode}`, a tidy table, "WhatsApp {name}" and "Call {name}" buttons, photos attached. Postcodes outside CF/NP are flagged, never rejected.
5. Sends a short auto-reply if the customer gave an email.

### Exporting quotes

Open `https://<site>/api/quotes.csv` and log in with `ADMIN_USER` / `ADMIN_PASS`. It opens in Excel or Google Sheets, newest first, with the Facebook/UTM source of each lead.

### Tracking

Events: `whatsapp_click`, `call_click`, `quote_start`, `quote_submit`, `photo_added` (pushed to `dataLayer`, and to GA4 when consented). First-touch UTMs, `fbclid` and the landing page are kept in `sessionStorage` and sent with each quote, so you can see which Facebook ads bring jobs.

## How to set prices

Every service in `src/config/site.ts` has `fromPrice: null`. While it's `null`, the site shows "Fixed quote from a photo, usually within the hour". Never put in a made-up number.

To publish a price, set both fields:

```ts
carpet: { ..., fromPrice: 75, priceNote: 'Per room, up to 4×4m, stains pre-treated' },
```

The menu then shows "From £75", the service page shows the note, the schema `Offer` gets a price, and the cost guide lists your prices next to the market ranges.

### Cardiff market prices (for the owner, not shown as yours)

Typical Cardiff ranges from BizHub365 and Bark (2026):

| Job | Typical range |
|---|---|
| Single room carpet | £75–£150 |
| 3-bed house (carpets) | £200–£320 |
| Stairs & landing | £60–£120 |
| Sofa | £120–£200 |
| Pet odour treatment | £100–£180 per room |

The cost guide shows these as credited market prices, clearly marked "not our prices".

## Reviews

`reviews[]` starts empty. Paste the 3 Facebook reviews **word for word** with first name + initial, source and date. Never write, paraphrase or borrow a review. There is no Review or AggregateRating schema, on purpose. While the list is empty the home page shows "Ask us for references".

## Photos and logo

See `assets/README.md`. The asset pack was not in the repository, so until it arrives the preview shows "Photo to come" plates and a type-only wordmark (on a live build, missing photos are simply hidden). **Ask the owner for the original logo file**, because the supplied cut-outs come from a flyer and are soft.

Font fallbacks in `src/styles/global.css` are metric-matched to Instrument Serif and Hanken Grotesk (measured from the font files with opentype.js), which keeps CLS near zero while fonts load.

## Go-live checklist

1. Clear the TODO-CONFIRM list below with the owner.
2. Set `PREVIEW_MODE=false` and set the real `SITE_URL`.
3. Swap the email env vars: `QUOTE_TO_EMAIL=Steamcleaning769@gmail.com`, and `QUOTE_FROM_EMAIL` to an address on their domain once it's verified in Resend.
4. Set `ADMIN_USER` / `ADMIN_PASS`, then submit a test quote and check that the email, photos, auto-reply and CSV all work.
5. Replace the jsbin link on their Facebook page with the new site.
6. Add the URL to the new Google Business Profile, then fill `google.gbpMapsUrl` and `google.gbpReviewUrl` in config.
7. Submit the sitemap (`/sitemap-index.xml`) in Google Search Console.

## TODO-CONFIRM, in priority order

Search the code for `TODO-CONFIRM` to find each one.

1. **Trading name:** "Steam Cleaning Solution LTD" vs "Steam Cleaning LTD". It must match Companies House and the Google profile (`business.name`).
2. **Which number takes WhatsApp:** 07480 267434 is set for WhatsApp, but the green flyer says "Message or call 07506 285260" (`business.phones`).
3. **The visit promises:** every step of "The visit", plus "Before we arrive", job durations, the end of tenancy and deep clean checklists, the photo report and itemised invoice (`visit`, `beforeWeArrive`, `tenancyExtras`, `servicePages.ts`).
4. **Owner's first name:** the owner's note stays hidden until it's set, and the note copy is a placeholder for the owner to rewrite (`owner`).
5. **Since 2019:** Facebook lists June 2019. It is hidden until `sinceYear` is set.
6. **Hours:** Facebook says "Always open". The site shows "Message any time, we reply fast" until `hours` is set. Also confirm the reply time ("usually within the hour") and drying time ("a few hours").
7. **Exterior service:** confirm patio and skylight cleaning is something they sell before setting `services.exterior.enabled = true`.
8. **Towns:** Cardiff, Newport, Penarth, Barry, Caerphilly, Cwmbran, Pontypridd. Remove a town to unpublish it, and have the owner read each area page.
9. **Reviews:** paste the 3 Facebook reviews word for word.
10. **Original logo file.**

Also to confirm: the insured / eco-friendly / pet-safe flags (default true, from their posts), the Facebook page URL, leather sofa cleaning, caravan parks and areas, and the privacy retention period.
