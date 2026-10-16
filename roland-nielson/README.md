# rolandnielson.com: Roland Nielson – Omaha Men's Life Coaching

Static Astro site, hosted on Netlify. No client framework. The only JavaScript handles the mobile menu, the header on scroll, form validation and UTM capture, the video and map facades, and GA4 events (only when GA4 is set).

```
src/config/site.ts     ← ALL business facts (NAP, hours, prices, links, placeholders)
src/data/pages.ts      ← every page's SEO title + meta description
src/data/faqs.ts       ← main FAQ (also feeds Home + FAQPage schema)
src/data/resources.ts  ← Omaha resources page ({{VERIFY}} links)
src/data/testimonials.ts ← empty until real, permission-granted feedback exists
src/content/blog/*.md  ← blog posts (frontmatter enforces title/description limits)
src/lib/schema.ts      ← JSON-LD (connected @id graph)
scripts/               ← media processing, logo/favicon builder, QA checker
assets-src/            ← raw photos/video (the raw .mp4 is git-ignored; outputs are committed)
```

## Run it

```bash
npm install
npm run dev            # http://localhost:4321
npm run build          # outputs dist/
npm run check:site     # pre-launch QA over dist/ (run after build)
npm run preview        # serve dist/ locally
```

Node 20+ (Netlify uses Node 22, set in `netlify.toml`).

### Media pipeline (only when photos or the video change)

```bash
npm run media   # crops/grades photos, compresses the video to MP4 + WebM, makes the poster, captions and transcript
npm run brand   # rebuilds the "R." logo, favicon set and app icons
```

Needs `ffmpeg` and `ffprobe` on your PATH. Inputs in `assets-src/`: `roland-wall.jpg`, `roland-note.jpg`, `roland-recovery-story.mp4` and, optionally, `roland-recovery-story.srt`. If an `.srt` exists it wins; otherwise captions come from `roland-recovery-story.segments.json`, a local Whisper transcription.

**What the media script does:**
- The wall photo is cropped above the belt, so the ID badge and lanyard never appear. Both photos get a light warm grade. Faces are not retouched.
- The video is encoded at 720×1280 (the source is vertical): H.264 MP4 at about 1.6 Mbps and VP9 WebM at about 1.2 Mbps. The poster is a calm frame at 9.6 s.
- Captions go to `public/videos/roland-nielson-recovery-story-omaha.en.vtt`. The on-page transcript goes to `src/data/recovery-video.json`.

## Deploy to Netlify

1. Push this repo to GitHub. In Netlify, choose **Add new site → Import from Git** and pick the repo.
2. **Base directory:** `roland-nielson` (the folder this README is in). Build command and publish directory come from `netlify.toml`.
3. Deploy, then check the preview URL.

### Connect rolandnielson.com
1. Go to **Domain management → Add a domain** and enter `rolandnielson.com`. Add `www.rolandnielson.com` too.
2. Point DNS to Netlify: use Netlify DNS, or set an `A` record for the root to Netlify's load balancer and a `CNAME` for `www` to your `*.netlify.app` name.
3. Make `rolandnielson.com` the **primary domain**. Netlify then redirects www to the root, and `_redirects` enforces it too.
4. **HTTPS → Verify DNS → Provision certificate.** HSTS is already set in `netlify.toml`.

Trailing slashes come from Netlify's pretty URLs (`/about` → `/about/`). The old one-page links redirect: `/story` → `/about/`, `/approach` → `/mens-life-coaching-omaha/` and `/roland.jpeg` → the new hero photo. `/book` is a short link to Calendly.

## Form notifications to Roland's phone

The forms use Netlify Forms. The form name is `coaching-inquiry`, there's a honeypot field, and both the short and the full form post to `/thank-you/`. Each submission records the page it came from and any UTM tags.

1. After the first deploy, open **Forms** in Netlify and click **Enable form detection** if asked, then redeploy.
2. Go to **Site configuration → Notifications → Emails and webhooks → Form submission notifications → Add notification → Email notification**.
3. Event: *New form submission*. Form: `coaching-inquiry`. Email: `roland@rolandnielson.com`.
4. On Roland's phone, turn on push notifications for that mailbox in the mail app. Each lead arrives as a push.
5. Send a test from the live site and check that the email arrives (also check spam).

**SMS later:** add an *Outgoing webhook* notification for `coaching-inquiry`. Point it at a Zapier or Make webhook, or at a small Netlify Function that calls Twilio and texts (402) 577-0738.

## Editing the site

- **Phone, email, hours, service areas, prices, socials:** edit `src/config/site.ts`. Every page, the footer, the schema and `llms.txt` update from it. Hours must match the Google Business Profile exactly.
- **Titles and descriptions:** edit `src/data/pages.ts`. Titles must be 60 characters or fewer. Descriptions must be 140–155 characters. `npm run check:site` enforces both.
- **FAQ:** edit `src/data/faqs.ts`. Mark legal "what coaching is not" answers with `scope: true`.
- **New blog post:** add `src/content/blog/my-post.md` with the same frontmatter as the existing posts. Link to booking with `[text](#book)` and to calling with `[text](#call)`. Never type the phone number or the Calendly URL into a post.
- **Testimonials:** add real ones to `src/data/testimonials.ts` with written permission. The section appears automatically. Never add Review or AggregateRating schema.
- **Office address later:** fill `office` in `site.ts` (street, ZIP, lat, lng). The footer, contact page, map and schema all switch over. No other edits.

### Scope-of-practice rule
Roland is a non-clinical coach with no certification. These words appear only inside "what this is not" disclaimers: therapy, therapist, counseling, counselor, treatment, certified, licensed, diagnose, cure, clinical. Wrap disclaimers in an element with `data-scope`. The QA script fails the build check if any of those words show up anywhere else.

## Google Business Profile

- **Profile website link:** `https://rolandnielson.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp`
- **Profile appointment link:** `https://calendly.com/rolandnielson/free-20-minute-discovery-call?utm_source=google&utm_medium=organic&utm_campaign=gbp-booking`
- Category: *Life coach*. Set it up as a service-area business with no address shown. Add the same 10 service areas as `site.ts`.
- Hours: Tue–Fri 5:00–8:00 PM, Sat 11:00 AM–1:00 PM, Sun and Mon closed.
- Once the profile is live, fill `gbp.url`, `gbp.cid` and `gbp.reviewLink` in `site.ts`. That turns on:
  - the "Find us on Google" footer link,
  - `sameAs` and `hasMap` in the schema,
  - the map embedding the profile instead of the city,
  - `rolandnielson.com/review`, which redirects to the review form. Share that link with clients.
- Reply to every Google review personally and specifically. Competitors' replies are generic.

## Video

- **Also upload the recovery video to YouTube** as "Rebuilding After Addiction: My Story | Omaha Men's Life Coach Roland Nielson". In the description, link back to https://rolandnielson.com/rebuilding-after-addiction/ and add the transcript.
- The transcript and captions were made by automatic transcription (Whisper, run locally). **Roland should read them once and correct anything misheard.** Edit `assets-src/roland-recovery-story.segments.json` (or add an `.srt`) and run `npm run media`.
- Set `uploadDate` for both videos in `site.ts` (`videos.youtube.uploadDate`, `videos.recovery.uploadDate`). Google needs it for video rich results.
- Confirm the YouTube video's title and description in `site.ts` match the real video. They were written without access to YouTube.

## Analytics (GA4)

Set `ga4Id` in `site.ts`. That loads GA4 with Consent Mode and shows a small cookie notice. The site sends these events, each with `page_path`: `click_call`, `click_text`, `click_email`, `click_calendly`, `generate_lead` (form submit) and `video_play`. In GA4, mark `generate_lead`, `click_call` and `click_calendly` as key events. Set `gscToken` for the Search Console verification meta tag, or verify with DNS instead.

## Launch TODO: every placeholder

Empty placeholders render nothing. Search `site.ts` for `''`.

| Placeholder | Where | What to do |
|---|---|---|
| `{{GA4_ID}}` | `site.ga4Id` | GA4 measurement ID (G-…) |
| `{{GSC_TOKEN}}` | `site.gscToken` | Search Console HTML-tag token (optional if verified by DNS) |
| `{{GBP_URL}}` | `site.gbp.url` | Google Business Profile share URL |
| `{{GBP_CID}}` | `site.gbp.cid` | Profile CID (numeric), for the map embed |
| `{{GBP_REVIEW_LINK}}` | `site.gbp.reviewLink` | "Ask for reviews" link from the profile |
| `{{PREMIUM_PRICE}}` | `PREMIUM_PRICE` in `site.ts` | Monthly price for the Rebuild Program (or leave as "Book a call to apply") |
| `{{POLICY}}` | `POLICY` in `site.ts` | Cancellation and rescheduling policy (shows in FAQ, Pricing, Terms) |
| `{{OFFICE_ADDRESS}}` | `site.office` | Only if Roland gets a public office |
| `{{VIDEO_UPLOAD_DATE}}` | `site.videos.*.uploadDate` | ISO dates for both videos |
| `{{TRANSCRIPT}}` | — | Done (auto-transcribed). Review for accuracy. |

### {{VERIFY}}: resource links to confirm before launch
Every entry in `src/data/resources.ts` needs a check: the link opens, the phone number is right, and it still serves the Omaha area. Set `verified: true` on each one you check.

- 988 Suicide & Crisis Lifeline: https://988lifeline.org/
- Veterans Crisis Line: https://www.veteranscrisisline.net/
- Boys Town National Hotline, 1-800-448-3000: https://www.boystown.org/hotline
- Nebraska Family Helpline, 1-888-866-8660: https://dhhs.ne.gov/Pages/Nebraska-Family-Helpline.aspx
- 211 Nebraska: https://ne211.org/
- 211 Iowa: https://www.211iowa.org/
- Heartland Family Service: https://www.heartlandfamilyservice.org/
- Siena Francis House: https://sienafrancis.org/
- Open Door Mission: https://opendoormission.org/
- Legal Aid of Nebraska: https://www.legalaidofnebraska.org/
- Heartland Workforce Solutions: https://www.hws-ne.org/
- AA Omaha Area Intergroup: https://www.omahaaa.org/
- NA meeting search: https://www.na.org/meetingsearch/
- SMART Recovery meetings: https://meetings.smartrecovery.org/
- Celebrate Recovery: https://www.celebraterecovery.com/
- SAMHSA National Helpline, 1-800-662-4357: https://www.samhsa.gov/find-help/helplines/national-helpline
- Al-Anon: https://al-anon.org/
- Nar-Anon: https://www.nar-anon.org/
- NAMI Nebraska: https://naminebraska.org/
- F3 Nation: https://f3nation.com/
- Omaha Public Library: https://omahalibrary.org/

### Other content to confirm
- **Blog dates:** all six starter posts are dated the launch day. Change `published` and `updated` if they go live on a different day.
- **National price ranges:** the Pricing page and the cost post quote typical US coaching prices ($75–$300+ per session, $200–$1,000 a month). Re-check them each year.
- **Commitment language:** the Rebuild Program copy says spots are limited so Roland can be available between sessions. Keep it only if that's true.
- **Logo:** no logo file was supplied. The "R." monogram was rebuilt from the brief and the mark in Roland's video, so compare it with the original.

## QA checklist (what `npm run check:site` covers)
Each page must have:
- exactly one H1,
- a title and description within the limits, and unique across the site,
- a canonical URL, the right robots tag and an OG image that exists,
- visible breadcrumbs and BreadcrumbList schema (inner pages),
- valid JSON-LD with no Review or AggregateRating and no street address,
- the exact business name, (402) 577-0738 and "Omaha, NE",
- no banned words outside disclaimers,
- no broken internal links, links with trailing slashes,
- click depth of 2 or less from Home, and no orphan pages,
- images with alt text and width/height, and labelled form fields.

It also checks for redirect chains and that the sitemap contains every indexable page and none of the noindex ones.
