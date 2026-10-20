# LaCaze Roadside Assistance — website

The website for **LaCaze Roadside Assistance**: 24/7 jump starts, lockouts and fuel delivery in Spring, TX and North Houston. It's built with [Astro](https://astro.build) as a static site and hosted on Netlify. Every page works without JavaScript; the only scripts are small ones (form checks, "Use my location", the menu and click tracking).

```
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs dist/
npm run preview    # serve dist/ locally
```

> This folder lives inside the `basit` repo. In Netlify, set **Base directory = `lacaze-roadside`**. The build command and publish folder come from `netlify.toml`.

---

## Edit business info in one file: `src/data/business.json`

Every page, the footer and the structured data (schema) read from this file. Change a value, then rebuild or redeploy.

| What | Key | Notes |
|---|---|---|
| Phone | `phoneDisplay`, `phoneE164`, `phoneSchema` | Keep all three in sync, e.g. `(832) 949-4837`, `+18329494837`, `+1-832-949-4837` |
| Email | `email` | |
| **Prices** | `prices.jumpStart`, `prices.lockout`, `prices.fuelDelivery` | Numbers in dollars, e.g. `65`. `null` = not confirmed, so the site says "upfront quote on the phone" |
| **Arrival time** | `averageArrivalMinutes` | e.g. `30`. `null` = hidden |
| Google profile | `googleProfileUrl` | Your Google Maps share link. Powers "See all reviews on Google" and schema `sameAs` |
| Map embed | `googleMapsEmbedUrl` | Optional "Embed a map" URL from Google Maps. Leave it empty to show a Spring, TX map |
| Reviews | `reviews[]` | Copy the text **word for word** from Google. Use first name + last initial |
| Rating | `googleRating`, `googleReviewCount` | Update these when new reviews come in |
| Social links | `social.facebook`, `social.instagram`, … | Add a link only after you confirm it's yours. Empty = hidden |
| GA4 | `ga4Id` | e.g. `G-ABC123XYZ`. Empty = analytics not loaded |
| Search Console | `searchConsoleVerification` | The `content` value from Google's HTML-tag verification |
| Live domain | `siteUrl` | Change this to the real domain at launch (it's used for canonical URLs, the sitemap and OG tags) |

Page text lives in `src/data/` too: `services.js` (service pages), `towns.js` (town pages), `guides.js` (articles) and `faqs.js` (FAQ).

**Replacing John's photo:** put the new photo at `assets-src/photos/john-lacaze-jr-owner.jpg` (portrait, about 720×950), run `npm run assets`, and commit the files it creates in `public/img/`. The script only resizes and re-encodes the photo; it never edits it.

**Logo:** the whole site uses one logo, John's official badge: `assets-src/logos/lacaze_logo_badge_official.jpg`. A copy with only the outer black background removed (`lacaze_logo_badge_official_transparent.png`) is what the header, footer, favicon, app icons and share image are made from. Run `npm run assets` to regenerate them. To regenerate the social-share image, run `node scripts/og.mjs` (needs Playwright).

---

## Preview mode (noindex), and switching it off at launch

`PREVIEW_MODE` is set in `netlify.toml`:

```toml
[build.environment]
  PREVIEW_MODE = "true"
```

While it's `"true"`, every page includes `<meta name="robots" content="noindex, nofollow">` so Google won't index the site yet.

Red **DEV TODO** notes (for values still waiting on John) appear only in `npm run dev`, or in a build run with `SHOW_TODOS=true`. They never appear on the live site.

**At launch** (once the custom domain is connected and `siteUrl` is updated): change it to `PREVIEW_MODE = "false"` and push. The noindex tags disappear on the next deploy. A local production build is `PREVIEW_MODE=false npm run build`.

---

## Form submissions → John's email (FormSubmit, free)

The "Request help" form sends each request by email to **lacazeroadside@gmail.com** through [FormSubmit](https://formsubmit.co). It's free, needs no account, and doesn't use Netlify's paid form notifications. The address comes from `email` in `src/data/business.json`.

**One-time activation (required):**
1. Send one test request from the live site.
2. FormSubmit emails lacazeroadside@gmail.com with the subject "Action Required: Activate FormSubmit". Open it and click **Activate Form**. Check spam if it isn't in the inbox.
3. Done. From then on, every request arrives as an email titled "New roadside help request — LaCaze website", with name, phone, service, location (a Google Maps link when "Use my location" is used), notes and the page it came from.

How it behaves:
- The form sends in the background, then shows `/thank-you/`.
- If sending fails (no signal, or the form isn't activated yet), the customer sees "We couldn't send your request just now. Please call (832) 949-4837" and their details stay filled in.
- Spam protection: a hidden `_honey` field, plus the 10-digit phone check.
- Without JavaScript, the form posts to FormSubmit directly and redirects to `/thank-you/`.
- To change the inbox, edit `email` in `business.json` and redeploy. A new address needs the one-time activation again.
- *(Optional)* For text alerts, set up a Gmail filter on that subject that forwards to a phone, or use Zapier's Gmail → SMS.

**Call and Text buttons** are plain phone links (`tel:+18329494837`, `sms:+18329494837`). They need no backend and cost nothing.

## Click tracking (GA4)

`src/scripts/site.js` sends GA4 events, but only when `window.gtag` exists, that is, once `ga4Id` is set:

- `call_click`: any `tel:` link
- `text_click`: any `sms:` link
- `form_submit`: the request form passes validation and submits

In GA4, mark `call_click` and `form_submit` as **key events** (conversions).

---

## Connect a custom domain

1. Netlify → **Domain management → Add a domain** → enter the domain (e.g. `lacazeroadside.com`).
2. If the domain is at Namecheap or GoDaddy, either switch the nameservers to Netlify DNS (easiest), or add the records Netlify shows: an `A` record for `@` pointing to Netlify's load balancer, and a `CNAME` for `www` pointing to `<site>.netlify.app`.
3. Wait for HTTPS to be issued (automatic, Let's Encrypt).
4. Update `siteUrl` in `src/data/business.json` to the new domain and redeploy.

---

## Launch checklist

- [ ] John reviews every page, especially the About page (written in his voice) and the service and town pages
- [ ] Confirm prices → `prices.*`
- [ ] Confirm typical arrival time → `averageArrivalMinutes`
- [ ] Confirm payment methods, fuel amount, diesel availability and after-hours pricing (FAQ TODOs in `src/data/faqs.js` and `services.js`)
- [ ] Add the Google Business Profile link → `googleProfileUrl`
- [ ] Add confirmed social links → `social.*` (see "Needs confirmation" below)
- [ ] Set `siteUrl` to the real domain and connect the domain in Netlify
- [ ] **Remove noindex:** set `PREVIEW_MODE = "false"` in `netlify.toml`
- [ ] Add the GA4 measurement ID → `ga4Id`
- [ ] Add the Search Console verification → `searchConsoleVerification`, then verify in Google Search Console
- [ ] **Submit the sitemap** in Search Console: `https://<domain>/sitemap-index.xml`
- [ ] Send a test request and click **Activate Form** in the FormSubmit email (see above)
- [ ] **Add the website link to the Google Business Profile**, and make sure its name, phone and service area match the site footer exactly
- [ ] Test the Call and Text buttons on a real iPhone and a real Android phone
- [ ] Run the home page and one service page through Google's [Rich Results Test](https://search.google.com/test/rich-results)

---

## Official profiles: needs confirmation

A web search (October 2026) found **no indexed official pages** for "LaCaze Roadside Assistance", the number (832) 949-4837, or "John LaCaze Jr." on Facebook, Instagram, TikTok, YouTube or LinkedIn. Facebook and Instagram pages also can't be read without logging in. So **no social links are published yet**, and the footer icons, About page links and schema `sameAs` stay hidden until URLs are added.

To add them: open each profile while logged in, check that it shows the same business name, phone, photo or Spring, TX location, then paste the URL into `business.json`.

| Profile | Status |
|---|---|
| Facebook: "LaCaze Roadside Assistance" | Not found by search. Needs URL from John |
| Google Business Profile / Maps | Not found by search. Needs share link from John |
| Instagram / TikTok / YouTube / LinkedIn (John LaCaze Jr.) | None found. Ask John |

---

## Project map

```
src/data/business.json   ← business facts, prices, reviews, links, analytics IDs
src/data/*.js            ← page copy (services, towns, guides, FAQ)
src/layouts/Base.astro   ← <head>, SEO meta, JSON-LD, header/footer/action bar
src/components/          ← Header, Footer, ActionBar, RequestForm, CtaBlock, Reviews, ServiceMap, HeroScene…
src/pages/               ← routes ([slug].astro = service + town pages)
src/styles/global.css    ← design tokens + all styles (inlined at build)
src/scripts/site.js      ← progress bar, header, reveal, menu, form, geolocation, GA4 events
assets-src/              ← original logos, photos, review screenshots
scripts/                 ← image + OG generation
```
