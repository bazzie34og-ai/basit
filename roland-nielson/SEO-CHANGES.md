# SEO changes: local SEO expansion (v3), October 27, 2026

Roland Nielson – Omaha Men's Life Coaching is a men's life coach in Omaha, NE who helps men who feel stuck build discipline, keep their word and rebuild their lives.

This file lists every new and changed URL, its title and primary keyword, its word count and its uniqueness score, followed by the QA results and the open questions for Roland.

## Summary

- **18 service pages** are live, one primary keyword each. The 5 existing service pages moved into the shared template at the same URLs.
- **3 more service pages are written but hidden** behind feature flags in `src/config/site.ts`, all `false`: `OFFERS_GROUP_COACHING`, `OFFERS_LEADERSHIP` and `OFFERS_YOUNG_MEN`. While a flag is off, its page is not built, not linked from anywhere and not in the sitemap.
- **12 service-area pages**, each written separately (highest overlap between any two is 6.2%), plus an upgraded Omaha hub with an H2 for every service and a grid linking every area page.
- **New pages:**
  - `/free-call/`, upgraded, with no main navigation.
  - `/reviews/`, in the main menu. It's honest about there being no reviews yet and shows no ratings.
  - `/services/`, an index of all services.
  - 4 question pages.
  - 5 new blog posts, plus the "Feeling stuck at 40" post rewritten as a 7-day reset.
- **Two blog posts moved to root question pages**, each with a 301 from its old URL:
  - `/blog/how-much-does-a-life-coach-cost-in-omaha/` → `/how-much-does-a-life-coach-cost-omaha/`
  - `/blog/life-coach-vs-therapist/` → `/life-coach-vs-therapist/`
- **Homepage, keeping the design:**
  - first-sentence statement, trust strip ("Built for men · Evenings & Saturdays · Prices shown · Free 20-minute call")
  - "Is this you?", an H2 per service group, "Areas we serve", the gap block
  - FAQ with schema, a city map, and a link to `/free-call/` in the CTA
- **Navigation:**
  - Services mega-menu (By challenge / For who / How we meet / Programs) and an Areas dropdown.
  - Reviews, About, Pricing and a "Free call" button.
  - Footer: plain-text NAP, plus every service and area in compact columns.
  - Mobile sticky bar: Call, Text and Free call.
- **Schema:**
  - Sitewide ProfessionalService/LocalBusiness `#business`: no street address, `priceRange` "$149–$399/mo", `areaServed` covering every city and Omaha neighborhood.
  - Every service page: Service (serviceType = primary keyword, offers "from 149 USD/month") + FAQPage + BreadcrumbList.
  - Every area page: Service (areaServed = that place) + FAQPage + BreadcrumbList.
  - Question pages: Article (+ FAQPage).
- **Booking links:** every on-site link to Calendly gets `?utm_source=website&utm_medium=cta&utm_campaign=<page-slug>`. A build step adds these.
- **GA4:** `click_calendly`, `click_call`, `click_text` and `generate_lead` now carry `page_path` and `page_type` (home, hub, service, area, question, blog or page). They fire only once a GA4 ID is set.
- **Session times:** no session days or times appear in page copy any more, only "evenings and Saturdays" plus the booking page. The FAQ, contact page, CTA band and footer were updated.
- **Sitemap and llms.txt:**
  - The sitemap lists all 58 indexable URLs with lastmod dates.
  - `/llms.txt` lists every page with a one-line description, and its first line is the first-sentence statement.
- **Unchanged as required:** the assessment page, `/review/`, `googledb7bba528fb8626b.html` and all existing redirects. The strict CSP that blocks the Netlify badge still holds (no new inline scripts).

## Pages
### Service pages (18)

| URL | Status | Title | Primary keyword | Words | Uniqueness (max overlap) |
|---|---|---|---|---|---|
| /accountability-coaching/ | changed | Accountability Coach Omaha \| Keep Your Word – Roland Nielson | accountability coach Omaha | 1563 (own 1350) | 5.6% with /mentoring-for-men/ |
| /coaching-for-fathers/ | changed | Life Coach for Dads Omaha \| Be There, Not Just Home – Roland Nielson | life coach for dads Omaha | 1552 (own 1345) | 5.6% with /life-coaching-for-men-over-40/ |
| /confidence-coaching-for-men/ | new | Confidence Coach for Men Omaha \| Trust Your Own Calls Again – Roland Nielson | confidence coach for men | 1555 (own 1350) | 5.4% with /purpose-and-direction-coaching/ |
| /discipline-and-habit-coaching-for-men/ | new | Discipline Coach for Men Omaha \| Do What You Already Know – Roland Nielson | discipline coach for men | 1560 (own 1353) | 5.6% with /mens-life-coaching-omaha/ |
| /divorced-dad-coaching/ | new | Coaching for Divorced Dads Omaha \| Steady Life, Close Kids – Roland Nielson | coaching for divorced dads | 1572 (own 1359) | 5.4% with /purpose-and-direction-coaching/ |
| /in-person-life-coaching-omaha/ | new | In Person Life Coach Omaha \| Face to Face or Walk and Talk – Roland Nielson | in person life coach Omaha | 1496 (own 1305) | 4.8% with /accountability-coaching/ |
| /life-after-job-loss-coaching/ | new | Coaching After Job Loss Omaha \| Steady Days, Next Job – Roland Nielson | coaching after job loss | 1519 (own 1301) | 5.5% with /life-coaching-for-men-over-40/ |
| /life-coaching-for-men-over-40/ | new | Life Coach for Men Over 40 Omaha \| Make the Next Half Count – Roland Nielson | life coach for men over 40 | 1542 (own 1322) | 5.6% with /coaching-for-fathers/ |
| /mens-life-coaching-omaha/ | changed | Life Coach for Men Omaha \| Get Unstuck and Move Again – Roland Nielson | life coach for men Omaha | 1552 (own 1349) | 5.6% with /discipline-and-habit-coaching-for-men/ |
| /mentoring-for-men/ | new | Mentor for Men Omaha \| An Older Guy Who's Been There – Roland Nielson | mentor for men Omaha | 1520 (own 1304) | 5.7% with /relationship-coaching-for-men/ |
| /mindset-coaching-for-men/ | new | Mindset Coach Omaha \| Get Out of Your Own Way – Roland Nielson | mindset coach Omaha | 1562 (own 1346) | 5.4% with /relationship-coaching-for-men/ |
| /online-life-coaching-for-men/ | new | Online Life Coach for Men \| Video or Phone, No Commute – Roland Nielson | online life coach for men | 1507 (own 1295) | 4.7% with /mindset-coaching-for-men/ |
| /purpose-and-direction-coaching/ | new | Purpose Coach for Men Omaha \| Get Off Autopilot – Roland Nielson | purpose coach for men | 1554 (own 1332) | 5.4% with /life-after-job-loss-coaching/ |
| /rebuilding-after-addiction/ | changed | Recovery Coach Omaha \| Build a Life Worth Staying Sober For – Roland Nielson | recovery coach Omaha | 1590 (own 1351) | 5.3% with /mens-life-coaching-omaha/ |
| /relationship-coaching-for-men/ | new | Relationship Coach for Men Omaha \| More Than Roommates – Roland Nielson | relationship coach for men Omaha | 1537 (own 1327) | 5.8% with /stress-and-overwhelm-coaching-for-men/ |
| /stop-before-you-react-coaching/ | new | Anger Coaching for Men Omaha \| A Pause Before You Snap – Roland Nielson | anger coaching for men | 1549 (own 1361) | 5.1% with /divorced-dad-coaching/ |
| /stress-and-overwhelm-coaching-for-men/ | new | Stress Coach for Men Omaha \| A Lighter, Saner Week – Roland Nielson | stress coach for men | 1523 (own 1315) | 5.8% with /relationship-coaching-for-men/ |
| /the-rebuild-program/ | changed | Men's Coaching Program Omaha \| The Rebuild Program – Roland Nielson | men's coaching program Omaha | 1587 (own 1336) | 4.9% with /mentoring-for-men/ |

### Service-area pages (12)

| URL | Status | Title | Primary keyword | Words | Uniqueness (max overlap) |
|---|---|---|---|---|---|
| /life-coach-bellevue-ne/ | new | Life Coach Bellevue, NE \| Men's Life Coaching – Roland Nielson | life coach Bellevue NE | 1040 (own 1061) | 6.2% with /life-coach-midtown-omaha/ |
| /life-coach-bennington-ne/ | new | Life Coach Bennington, NE \| Men's Life Coaching – Roland Nielson | life coach Bennington NE | 958 (own 978) | 5.9% with /life-coach-benson-omaha/ |
| /life-coach-benson-omaha/ | new | Life Coach Benson Omaha, NE \| Men's Life Coaching – Roland Nielson | life coach Benson Omaha | 1035 (own 1060) | 5.9% with /life-coach-bennington-ne/ |
| /life-coach-council-bluffs-ia/ | new | Life Coach Council Bluffs, IA \| Men's Life Coaching – Roland Nielson | life coach Council Bluffs IA | 1050 (own 1070) | 5.3% with /life-coach-benson-omaha/ |
| /life-coach-elkhorn-ne/ | new | Life Coach Elkhorn, NE \| Men's Life Coaching – Roland Nielson | life coach Elkhorn NE | 975 (own 989) | 4.9% with /life-coach-north-omaha/ |
| /life-coach-gretna-ne/ | new | Life Coach Gretna, NE \| Men's Life Coaching – Roland Nielson | life coach Gretna NE | 951 (own 976) | 5.4% with /life-coach-north-omaha/ |
| /life-coach-la-vista-ne/ | new | Life Coach La Vista, NE \| Men's Life Coaching – Roland Nielson | life coach La Vista NE | 1002 (own 1022) | 5.2% with /life-coach-midtown-omaha/ |
| /life-coach-midtown-omaha/ | new | Life Coach Midtown Omaha, NE \| Men's Life Coaching – Roland Nielson | life coach Midtown Omaha | 1042 (own 1065) | 6.2% with /life-coach-bellevue-ne/ |
| /life-coach-north-omaha/ | new | Life Coach North Omaha, NE \| Men's Life Coaching – Roland Nielson | life coach North Omaha | 1037 (own 1065) | 5.5% with /life-coach-ralston-ne/ |
| /life-coach-papillion-ne/ | new | Life Coach Papillion, NE \| Men's Life Coaching – Roland Nielson | life coach Papillion NE | 989 (own 1010) | 5.9% with /life-coach-midtown-omaha/ |
| /life-coach-ralston-ne/ | new | Life Coach Ralston, NE \| Men's Life Coaching – Roland Nielson | life coach Ralston NE | 972 (own 994) | 5.5% with /life-coach-north-omaha/ |
| /life-coach-west-omaha/ | new | Life Coach West Omaha, NE \| Men's Life Coaching – Roland Nielson | life coach West Omaha | 1035 (own 1055) | 4.9% with /life-coach-bennington-ne/ |

### Hub, home and supporting pages (5)

| URL | Status | Title | Primary keyword | Words | Uniqueness (max overlap) |
|---|---|---|---|---|---|
| / | changed | Men's Life Coach Omaha, NE \| Roland Nielson – Omaha Men's Life Coaching | men's life coach Omaha | 1550 | — |
| /free-call/ | changed | Free Life Coaching Consultation Omaha \| Free 20-Minute Call | free life coaching consultation Omaha | 596 | — |
| /omaha-life-coach/ | changed | Life Coach Omaha, NE \| Life Coaching for Men Across the Metro | life coach Omaha | 1953 | — |
| /reviews/ | new | Reviews \| Roland Nielson – Omaha Men's Life Coaching | Roland Nielson reviews | 270 | — |
| /services/ | new | Men's Coaching Services in Omaha \| Roland Nielson | men's coaching services Omaha | 446 | — |

### Question pages (4)

| URL | Status | Title | Primary keyword | Words | Uniqueness (max overlap) |
|---|---|---|---|---|---|
| /how-much-does-a-life-coach-cost-omaha/ | new | How Much Does a Life Coach Cost in Omaha? (2026 Prices) | how much does a life coach cost Omaha | 1303 | — |
| /is-life-coaching-worth-it/ | new | Is Life Coaching Worth It? An Honest Answer for Men | is life coaching worth it | 1264 | — |
| /life-coach-vs-therapist/ | new | Life Coach vs Therapist: Which One Do You Need? | life coach vs therapist | 1275 | — |
| /what-does-a-life-coach-do/ | new | What Does a Life Coach Do? A Plain Answer From an Omaha Coach | what does a life coach do | 1285 | — |

### Blog posts (new or rewritten) (6)

| URL | Status | Title | Primary keyword | Words | Uniqueness (max overlap) |
|---|---|---|---|---|---|
| /blog/a-coach-not-a-couch/ | new | A Coach, Not a Couch: Why More Men Choose Coaching | why men choose coaching | 1033 | — |
| /blog/feeling-stuck-at-40/ | changed | Feeling Stuck at 40: A 7-Day Reset for Men | feeling stuck at 40 | 1130 | — |
| /blog/how-to-stop-snapping-at-your-family/ | new | How to Stop Snapping at Your Family: A Dad's Guide | how to stop snapping at your family | 1169 | — |
| /blog/rebuilding-your-life-after-divorce-as-a-dad/ | new | Rebuilding Your Life After Divorce as a Dad | rebuilding your life after divorce as a dad | 1096 | — |
| /blog/sober-but-still-stuck/ | new | Sober but Still Stuck: What Comes After Recovery | sober but still stuck | 1114 | — |
| /blog/why-you-start-strong-on-monday-and-quit-by-thursday/ | new | Why You Start Strong on Monday and Quit by Thursday | why do I quit by Thursday | 1132 | — |

"Words" counts the visible main content, including shared blocks. "Own" excludes the parts that repeat by design: the gap block, the price and "where we meet" box, "What this is not", and the recovery video and its transcript. Uniqueness is the highest share of 8-word shingles any page shares with another service or area page. The limit is 20%; the highest here is 6.2%.

## QA results (all pass)

| Check | Result |
|---|---|
| `npm run build` | Passes with no errors or warnings. 61 HTML pages. |
| `scripts/check-duplicates.mjs` (8-word shingles, 20% limit) | Passes. 30 service and area pages, 435 pairs, highest pair 6.2%. |
| `scripts/check-keywords.mjs` | Passes. 54 pages each own one primary keyword, and no title or H1 targets another page's keyword. |
| `scripts/check-site.mjs` | Passes on all 61 pages: one H1, unique title and meta, canonical, breadcrumb, OG image, valid JSON-LD with no street address, banned-word scan, no broken internal links, no orphans, click depth ≤ 2, sitemap coverage. |
| Flags | `group-coaching-for-men`, `personal-leadership-coaching-for-men` and `life-coaching-for-young-men` are not in `dist/`, the sitemap, llms.txt or any link. |
| Mobile at 375 px | No horizontal scroll, and every button and menu target is at least 44 px. Checked on 10 pages, including both menus. |
| Lighthouse mobile (local build) | Home 99, hub 99, `/accountability-coaching/` 100, `/life-coach-bellevue-ne/` 100, `/free-call/` 99. Accessibility, best practices and SEO are 100 on all five. LCP is 1.5–1.8 s. |

## Decisions that differ slightly from the brief

- **Title length:** titles follow the brief's formulas, so many run 61–76 characters. The site check now allows up to 80 and warns above 72. Google may cut the brand part off the longest ones.
- **Gap block wording:** "no therapy-speak" became "practical and forward-looking: what you will do this week, not years of talking about the past". The banned-word rule allows "therapy" only in the "What this is not" box and on the coach-vs-therapist page.
- **Service page length:** each service page has 1,130–1,200 words of its own writing (about 1,300 with headings). With the required shared blocks (gap block, price and places, "What this is not") the full page is about 1,500–1,590 words, a little over the 1,400 guide.
- **"Feeling stuck at 40" post:** rewritten in place at its existing URL rather than added as a near-duplicate, so it doesn't compete with itself.
- **Breadcrumbs:** Home → Services → {Service} uses the new `/services/` index. Home → Omaha → {Area} uses `/omaha-life-coach/`.
- **IndexNow:** skipped, because no key is configured.

## Open questions for Roland

1. **Flagged services:** which of these do you actually offer? Each page is written and goes live by switching its flag to `true` in `src/config/site.ts`.
   - Men's group coaching (`OFFERS_GROUP_COACHING`)
   - Personal leadership coaching (`OFFERS_LEADERSHIP`)
   - Life coaching for young men (`OFFERS_YOUNG_MEN`)
2. **Meeting places:** which of these do you actually use for walk-and-talks? Remove or change any you don't.
   - North Omaha: Miller Park, Fontenelle Park, Hummel Park
   - Midtown: Memorial Park, Elmwood Park, Turner Park at Midtown Crossing
   - Benson: Benson Park, Elmwood Park
   - West Omaha: Zorinsky Lake, Standing Bear Lake, Keystone Trail
   - Elkhorn: a neighborhood park or trail, Zorinsky Lake
   - Bennington: Standing Bear Lake
   - Bellevue: Fontenelle Forest, Haworth Park
   - Papillion: Walnut Creek Lake and Recreation Area, Halleck Park
   - La Vista: Central Park in La Vista, Walnut Creek Lake
   - Ralston: Seymour Smith Park (just over the line in Omaha)
   - Gretna: Schramm Park State Recreation Area
   - Council Bluffs: Lake Manawa State Park, Bob Kerrey Pedestrian Bridge, Bayliss Park
   - Hub and in-person page: Keystone Trail, Zorinsky Lake, Standing Bear Lake, Gene Leahy Mall at The RiverFront
3. **Confidentiality wording:** the Ralston page says the only time you'd share anything is if someone's safety is at risk. Is that how you handle it?
4. **Mentoring:** the mentoring page says it isn't sold separately and happens inside the normal plans. Is that right?
5. **Google Business Profile:** send the GBP URL, CID and review link so `sameAs`, "Find us on Google", `/reviews/` and the `/review/` redirect can use them. Also check that the GBP service names match the H2s on the hub. They use the `serviceName` in each service file, e.g. "Accountability Coaching" or "Divorced Dad Coaching".
6. **Still waiting from before:** GA4 ID, the Rebuild Program price, a cancellation policy and the video upload dates.
