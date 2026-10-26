# Prospect Engine: notes

## Read this first: how this list was made

The cloud environment's network policy blocks every directory site (MyJobQuote, FreeIndex,
DogFriendly, Google, Bing, DuckDuckGo, Facebook, Yell, Checkatrade all return a proxy 403).
I could not open a single profile page or run Playwright to reveal FreeIndex numbers.

So this list was built **only from a web-search tool that returns summaries of results**.
In practice that means:
- **Nothing was verified live.** Every number, review count and detail is "per search result".
  Open each source link before you message anyone.
- **No word-for-word review quotes.** The summaries paraphrase, so the openers use paraphrased
  details only (no quote marks). Re-read the review before sending.
- **The "no website" check is search-only.** Each one had 1–2 searches that found no own site,
  but I couldn't see the directory's website field.
- **Confidence is capped at Medium.** Nothing is marked High, because nothing was checked first-hand.
  "Low" means a phone number or an activity date is missing.

To unblock proper verification, add these to the environment's allowed domains (environment settings → Network access):
`www.myjobquote.co.uk`, `www.freeindex.co.uk`, `www.dogfriendly.co.uk`, `www.google.com`, `html.duckduckgo.com`.

## ⚠️ MyJobQuote phone numbers may not be the owner's own

Several MyJobQuote numbers share the prefixes 07418… / 07441… (SGP 07418365430, Norfolk Landscape Gardener 07418348089,
Over Branch 07418370251, G&i 07441449091, First Class Roofing 07441472224). For SGP and Over Branch, the business's own
Facebook/Yell shows a *different* number. This pattern suggests MyJobQuote may route calls through its own numbers.
I couldn't confirm it either way. **Tap the wa.me link first. If WhatsApp shows no account, the number is probably routed:
call it instead, or find the owner's own number.**

## Niche

**Tree surgeons (primary), plus one roofer and one driveway installer.**
- Jobs are £300–£3,000 for trees and £500–£15k for roofs and drives, so one extra job pays for a £400 site.
- Customers check insurance, qualifications, photos and reviews before letting someone fell a tree or redo a roof.
- MyJobQuote is full of owner-run firms with real reviews and no website of their own, competing on price
  ("compare up to 3 quotes").
- Before/after photos make a natural portfolio.
- Late autumn and winter is peak season for tree work (dormant-season pruning, storms), so they're busy and leads matter now.
- All towns are outside central London (two are in outer-London Croydon/Bexley).

## Sources
- **MyJobQuote `/t/` profiles:** worked best in search. Profiles show founding year, sole-trader status, review counts, and sometimes a phone number.
- **Gumtree / Yell / Facebook snippets:** occasionally gave a business-published number (Weather & Heights wrote its number into its Gumtree ad title).
- **FreeIndex:** search results mostly surfaced firms *with* websites. Playwright reveal impossible (blocked).
- **DogFriendly:** found groomers with numbers, but the best one (Woof In Style, 75 reviews) had no review newer than Aug 2024.

## Dropped, and why
| Business | Reason |
|---|---|
| SGP Tree Surgery, Rochford | Facebook links to sjptreeservices.co.uk, so it has a website. Name and number also conflict. |
| JR Tree & Landscapes, Motherwell | Has jrtreelandscapes.co.uk |
| Lumberjak Tree Care, Cullompton | Has lumberjaktreecare.com |
| Buckleigh Farm Tree Surgery, Newton Abbot | Has buckleighfarmsawmills.co.uk |
| C.A. Oakley Tree Care, Alton | Has its own site |
| Ross Hanley Tree Specialists, Harrogate | Has its own site, and 0 reviews |
| Treebeard Trees & Hedges | Has its own site |
| GK Driveways & Patios, Manchester | Has gkdriveways.co.uk (good redesign candidate maybe) |
| Pro Resin Drives, Coventry | Has its own site. Company record shows dissolved. |
| Midlands Trees, Stourport | 3.9 rating, and a recent Oct 2026 complaint |
| Acorn Tree Services, Galston | Review telling people to avoid them |
| Woof In Style (groomer) | No activity after Aug 2024 |
| Resin Co, Hartlepool / JG Paving, Trimdon | 0 reviews, no phone |
| The Roofing Company, Waltham Cross / Elite Roofing, Basildon | Mixed reviews (a no-show, an untidy job) |

## Uncertainties to check per prospect
- **Weather & Heights:** based in Crawley Down, Ifield or Hastings? Founded 2002 or 2005? The Yell 0800 number differs from the Gumtree mobile.
- **First Class Roofing:** confirm the number is Dave's own, not routed. Croydon is outer London.
- **G&i, Norfolk Landscape Gardener:** numbers may be routed (see above).
- **L & K Treecare:** Facebook says Birmingham, MyJobQuote says Burntwood. The number is from a cached Facebook snapshot.
- **Over Branch:** two numbers. I used Yell's 07878833884 because MyJobQuote's may be routed.
- **Allseasons Tree Surgery:** a directory shows a website link I couldn't see. Check it isn't a live site before messaging.
- **CJP:** reviewers name "Connor", but the business doesn't publish an owner name, so the opener uses "Hi there".
- **Low-confidence rows (JKL, CJP, Magic Contracting, Cut Above, GG, K Jones, Tree Down, MJ Driveways):** no phone number found. Open the profile to get one.

## Rebuilding
Edit `prospects.json`, then run `python3 prospects/build.py` to regenerate `prospects.csv` and `prospects.html`.
