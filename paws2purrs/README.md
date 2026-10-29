# Paws 2 Purrs Dog Daycare & Boarding: website

Static Astro site for Vanessa's dog daycare and home boarding business in Arnold, Nottingham.
Design system: "Woodland Home" (pine, cream, honey, arched frames, polaroids, paw trail).

- **Preview:** https://paws2purrs-preview.netlify.app (Netlify project `paws2purrs-preview`, see [Deploy](#deploy))
- **Research:** [RESEARCH.md](RESEARCH.md)

```bash
cd paws2purrs
npm install
npm run dev        # http://localhost:4321 (TODO FAQ answers are visible in dev only)
npm run build      # outputs dist/
```

`npm run dev/build` first runs `scripts/build-images.mjs`, which makes the AVIF/WebP/JPEG photo sizes, icons, logo PNGs and the OG image from `assets-src/`. Outputs are committed in `public/images`, and existing files are skipped, so builds are fast.

---

## Editing the site: `src/data/business.json`

Almost everything Vanessa might change lives in **one file**:

| Key | What it does |
|---|---|
| `phone`, `whatsappNumber` | Every Call / WhatsApp / Text button, schema and footer |
| `email` | Empty = the Email card opens the enquiry form. Add an address and it becomes a `mailto:` with subject "Enquiry from website" |
| `address.*` | `display` is what's shown ("Arnold, Nottingham NG5"). `street` only goes into schema if `flags.showFullAddress` is true |
| `announcement` | The dismissible top bar (text, emoji, link). Change `id` when you change the text so people who closed the old one see the new one. `enabled: false` hides it |
| `availabilityPill`, `diaryPill` | "Taking new clients" / "2027 diary now open" pills |
| `flags.previewMode` | `noindex` + footer ribbon (the `PREVIEW_MODE` env var in `netlify.toml` overrides it) |
| `flags.showFullAddress` | Adds the street to the LocalBusiness schema (default false) |
| `flags.showPrices` + `prices[]` | Shows the hidden price table on service pages |
| `flags.freeMeetAndGreet` | Changes "Book a meet & greet" to "Book a free meet & greet" everywhere |
| `flags.fiveStarLicence` | Adds "(5-star)" to the licence line and trust row |
| `flags.showInstagram` | Adds Instagram to the footer and `sameAs` |
| `google.reviewsUrl`, `google.profileConfirmed` | "Read all reviews on Google" link. Set `profileConfirmed: true` once it's her exact profile URL (it's then added to `sameAs`) |
| `analytics.ga4Id` | GA4 measurement ID (`G-XXXX`). Empty = no analytics script at all |
| `searchConsoleVerification` | The `content` value of Google's verification meta tag |
| `areas[]` | Areas in the schema `areaServed`. Set `confirmed: true` once Vanessa confirms |
| `openingHours` | Schema opening hours, e.g. `"Mo-Fr 07:30-17:00"` once confirmed |
| `siteUrl` | Canonical URLs, sitemap, OG image. Change to `https://paws2purrs.co.uk` at launch |

Other content:
- Reviews (word for word, never edit): `src/data/reviews.ts`
- FAQ: `src/data/faqs.ts`. Items with `todo: true` are hidden in production. Write the answer, remove `todo`.
- Worry → promise list: `src/data/promises.ts`
- Photos, alt text, captions, gallery tags: `src/data/photos.json` (add a photo to `assets-src/photos/`, add an entry, run `npm run images`)

## Conversion system
Same as the LaCaze build: sticky three-button mobile bar (Call / page-aware WhatsApp / Enquire, hidden while typing in the form), header pill + Call button, two-step Netlify form → `/thank-you/` with a "Send this to Vanessa on WhatsApp too" summary, GA4 click tracking (`call_click`, `whatsapp_click`, `sms_click`, `email_click`, `form_submit` with `service`), and the same closing CTA block on every service and area page.

## Form email notifications
Netlify Forms is enabled on the project. Submissions appear under **Netlify → paws2purrs-preview → Forms → enquiry**.

1. Netlify → Project configuration → **Notifications → Emails and webhooks → Form submission notifications → Add notification → Email notification**.
2. Event: *New form submission*, Form: `enquiry`, Email: **Vanessa's email (TODO)**. During the preview, use Abdul's email.
3. Optional later: SMS/WhatsApp alerts with Zapier or Make ("Netlify: new form submission" → "Twilio SMS" or "WhatsApp"), or a Netlify *outgoing webhook* on the same screen.

Spam protection: honeypot field `bot-field` (and Netlify's built-in filter).

## Deploy
Netlify project **`paws2purrs-preview`** was created with Forms enabled.
Settings: **Base directory `paws2purrs`**, build command `npm run build`, publish directory `dist` (all in `netlify.toml`).

The first upload couldn't run from the build environment (its network policy blocks `api.netlify.com`). To publish, either:
- **Link the repo (recommended):** Netlify → paws2purrs-preview → Project configuration → Build & deploy → *Link repository* → GitHub `bazzie34og-ai/basit`, branch `claude/paws-2-purrs-website-nc61be` (later `main`), base directory `paws2purrs`. Every push then redeploys.
- **Or from a laptop:**
  ```bash
  cd paws2purrs && npm install && npm run build && npx netlify-cli deploy --site 5b3d2d10-30ac-4cb5-ae4c-f7b7da683484 --dir dist --prod
  ```

> Note: the project was created with **team login (SSO) required for all deploys** (your Netlify team's default). Vanessa won't be able to open the preview until you set Project configuration → Access & security → Visitor access to public, or to a password you share with her.

## Connecting paws2purrs.co.uk (or another domain)
I didn't touch the domain. It couldn't be checked from the build environment, so look at it in a browser first and find out who holds it (her Facebook links to it).
1. Netlify → Domain management → **Add a domain** → `paws2purrs.co.uk` (add `www` too, and redirect one to the other).
2. Either point the domain's nameservers to Netlify DNS, or at the current registrar add `A @ 75.2.60.5` and `CNAME www paws2purrs-preview.netlify.app` (Netlify shows the exact records).
3. Wait for HTTPS to provision, then set `siteUrl` in `business.json` to `https://paws2purrs.co.uk` and redeploy.

## Launch checklist
- [ ] Vanessa signs off the TODO list below
- [ ] `PREVIEW_MODE = "false"` in `netlify.toml` and `flags.previewMode: false` in `business.json` (removes noindex, the robots `Disallow` and the footer ribbon)
- [ ] Visitor access set to public
- [ ] Domain connected and `siteUrl` updated
- [ ] GA4 ID added (`analytics.ga4Id`)
- [ ] Search Console: add the property, paste the verification code into `searchConsoleVerification`, redeploy, verify, submit `https://paws2purrs.co.uk/sitemap-index.xml`
- [ ] Form notification email set to Vanessa
- [ ] Add the website link to her Google Business Profile, Facebook page, DogFriendly and DoggyDaysOut listings
- [ ] Make sure name / phone / area match her Google Business Profile exactly (footer shows "Paws 2 Purrs Dog Daycare & Boarding · Arnold, Nottingham NG5 · 07837 729815")
- [ ] Ask 3 happy clients for new Google reviews (send them the "Write a review" link from her profile)
- [ ] Test on a real phone: Call, WhatsApp, Text, Email, form → thank-you → WhatsApp summary
- [ ] Rich Results Test on `/`, `/faq/` and one service page

## TODO: for Vanessa to confirm
1. **Surname** (optional; only used in schema `founder`).
2. **Email address** → `business.json email` (until then the Email button opens the form).
3. **Show the full address?** Default: area only ("Arnold, Nottingham NG5"). Directory sites already list her house number; does she want those changed?
4. **5-star licence**: Gedling's 1 June 2025 list shows "Paws 2 Purrs: 5 stars" (home boarding). Confirm, and turn on `flags.fiveStarLicence`.
5. **Licence number**, and whether the licence covers **day care** as well as home boarding.
6. **Years**: flyer says "10 years' experience", DogFriendly says the business has run "seven years". Site uses 10 years' experience.
7. **Free meet & greet / trial day?** → `flags.freeMeetAndGreet`.
8. **Opening hours** for schema (daycare ~7:30am–5pm; which days?).
9. **Areas covered** (Mapperley, Woodthorpe, Sherwood, Redhill, Bestwood, Daybrook, Gedling, Carlton are proposals) and whether pick-up on walks has a radius.
10. **Walking spots**: the area pages name nearby parks only as "the kind of places" owners know. Are there specific places she's happy to name?
11. **Vaccinations required** (FAQ hidden until answered).
12. **Puppies / unneutered dogs?** (FAQ hidden until answered).
13. **Maximum dogs in the pack** (a very common owner question; optional).
14. **Prices**: keep hidden, or publish? (`flags.showPrices` + `prices[]`)
15. **Google Business Profile URL** for the reviews button and `sameAs`. Also the total Google star rating (stars are not shown until confirmed). Reviewer #1's name wasn't captured.
16. **Instagram @paw_2_purrs**: confirm it's hers and active → `flags.showInstagram`.
17. **paws2purrs.co.uk**: who owns it, and is it live?
18. The "For Apollo" cookie photo in `/assets/reference` is **not used**. If it's her own photo it could go on the About page.
19. **Announcement text** after Christmas (edit `announcement` in `business.json`).

## Notes
- No `Review`/`aggregateRating` schema (self-serving reviews aren't eligible); reviews are shown visually only.
- The flyers in `/assets/reference` are never used on the site. All photos are Vanessa's; photo 03 is cropped to remove the phone "<" arrow.
- Photos are 720px wide originals, so they're never stretched beyond that.
- The logo is an inline SVG in the header and footer (PNGs kept in `public/images/`). The honey "2" is upright, matching the supplied PNG logo files.
