# Prospect Engine: notes

## Status: blocked, no prospects yet

This run found **0 prospects**. The cloud environment's network policy refused every
site the research needs (HTTP 403 from the proxy, and DNS failure for page fetches):
`myjobquote.co.uk`, `freeindex.co.uk`, `dogfriendly.co.uk`, `google.com`, `bing.com`,
`duckduckgo.com`, `facebook.com`, `mybuilder.com`, `checkatrade.com`, `wikipedia.org`.

The only thing that worked was the search tool, which returns *summaries* of results,
not the pages. That isn't enough to meet the brief's rules: no verbatim review quotes,
no full phone numbers read from the business's own listing, no FreeIndex "Display"
click with Playwright, and no way to check a site is really missing. So no
prospects were written. Nothing here is invented.

**To unblock:** open the environment settings (the cloud environment menu in the session
title bar, then Edit). Under Network access, either choose a broader level or add these
under Allowed domains:
`www.myjobquote.co.uk`, `www.freeindex.co.uk`, `www.dogfriendly.co.uk`, `www.google.com`,
`html.duckduckgo.com`, `www.bing.com`. Steps: https://code.claude.com/docs/en/cloud-environments#network-access

## Niche (planned)

**Primary: tree surgeons. Secondary: driveways/patios (resin, block paving).**
- Affordability: tree jobs run £300–£3,000 and driveways £2k–£15k, so one extra job pays for a £400 site several times over.
- Research-heavy buyers: people compare quotes and check insurance, qualifications (NPTC) and before/after photos before letting someone up a tree or dig up a drive.
- Lots of sole traders with no site: MyJobQuote/FreeIndex are full of owner-run firms with real reviews and only a directory or Facebook page.
- Visual proof: before/after photos of felling, crown reductions and new drives make a strong portfolio page.
- Timing: late autumn into winter is peak season for tree work (dormant-season pruning, storm damage), so owners are busy and lead flow matters now.
- Target towns outside London: e.g. Shrewsbury, Telford, Crewe, Durham (DH), Stockport, Worcester, Lincoln.

## Sources (to test once the network allows)
- MyJobQuote `/t/<slug>` profiles (search results show e.g. `myjobquote.co.uk/t/k-jones-tree-surgeon-garden-maintenance`, Shrewsbury): not yet fetched or verified.
- FreeIndex tree surgeons category (258 members per search summary): needs Playwright for numbers.
- DogFriendly: only if groomers are added.

## Dropped prospects
None. No prospects were evaluated.

## How to build the deliverables
Add verified entries to `prospects.json` (fields listed in `build.py`), then run
`python3 prospects/build.py`. This regenerates `prospects.csv` and `prospects.html`.
`wa.me` links are made automatically for 07… numbers only.
