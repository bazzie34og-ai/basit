"""Self-audit of the built site against the playbook checklist.

Run after `npm run build`:  python3 scripts/audit.py
Checks exact titles/H1s/metas, keyword placement, uniqueness, internal links,
word counts, banned claims and paragraph overlap between suburb pages.
"""
import csv, json, re, sys
from collections import defaultdict
from itertools import combinations
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist'
KIT_CSV = ROOT / 'scripts' / 'sitemap-keyword-map.csv'
data = json.loads((ROOT / 'src/data/site-data.json').read_text())

def norm(s):
    s = s.lower().replace('&amp;', '&')
    s = re.sub(r'[‐-―\-–—/]', ' ', s)
    s = re.sub(r"[^a-z0-9& ]", ' ', s)
    s = re.sub(r'\b(in|the|and|for|a|of|to|our|at)\b', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

pages = {}
for f in DIST.rglob('index.html'):
    url = '/' + str(f.parent.relative_to(DIST)).replace('.', '') + '/'
    url = url.replace('//', '/')
    pages[url] = BeautifulSoup(f.read_text(), 'html.parser')

rows = list(csv.DictReader(open(KIT_CSV)))
problems = defaultdict(list)
info = defaultdict(list)
metas = {s['url']: s['meta'] for s in data['services'] + data['areas']}

def main_text(soup):
    m = soup.find('main')
    for el in m.select('script, style, form, nav.breadcrumbs, .quote-card'):
        el.decompose()
    return m.get_text(' ', strip=True)

# Inbound anchors
inbound = defaultdict(list)
broken = set()
for url, soup in pages.items():
    for a in soup.select('main a[href], footer a[href], header a[href]'):
        href = a['href'].split('#')[0]
        if href.startswith('/') and not href.startswith('//'):
            if not href.endswith('/') and '.' not in href.split('/')[-1]:
                problems[url].append(f'link without trailing slash: {href}')
            target = href if href.endswith('/') else href
            if target not in pages and not (DIST / target.lstrip('/')).exists():
                broken.add((url, href))
            if target != url:
                inbound[target].append(a.get_text(' ', strip=True))

report = []
seen = defaultdict(lambda: defaultdict(list))
for r in rows:
    url = r['url']
    soup = pages.get(url)
    if not soup:
        problems[url].append('PAGE MISSING'); continue
    title = soup.title.get_text()
    h1s = soup.find_all('h1')
    h1 = h1s[0].get_text(' ', strip=True) if h1s else ''
    meta = soup.find('meta', attrs={'name': 'description'})['content']
    seen['title'][title].append(url); seen['h1'][h1].append(url); seen['meta'][meta].append(url)
    if title != r['title_tag']: problems[url].append(f'title mismatch: {title!r} vs {r["title_tag"]!r}')
    if h1 != r['h1']: problems[url].append(f'H1 mismatch: {h1!r} vs {r["h1"]!r}')
    if len(h1s) != 1: problems[url].append(f'{len(h1s)} H1s')
    want_meta = r['meta_description'] or ''
    if want_meta and meta != want_meta: problems[url].append('meta mismatch with CSV')
    if 'Bond Cleaning Brisbane Co.' not in title: problems[url].append('brand missing from title')
    kw = norm(r['primary_keyword'])
    stem = lambda x: {w.rstrip('s') for w in norm(x).split()}
    # Titles and H1s are fixed by the CSV, so check the keyword's words rather than the exact phrase.
    if not stem(kw) <= stem(title) | {'brisbane'} and r['page_type'] != 'core': info[url].append('title wording set by the CSV')
    if not stem(kw) - {'brisbane', 'qld'} <= stem(h1) and r['page_type'] != 'core': info[url].append('H1 wording set by the CSV')
    text = main_text(BeautifulSoup(str(soup), 'html.parser'))
    after = text.split(h1, 1)[-1]
    first100 = ' '.join(after.split()[:100])
    if kw not in norm(first100): problems[url].append('primary kw not in first 100 words')
    h2s = ' | '.join(norm(h.get_text(' ')) for h in soup.select('main h2'))
    if kw not in h2s: problems[url].append('primary kw not in any H2')
    alts = [i.get('alt', '') for i in soup.select('main img')] + [e.get('aria-label', '') for e in soup.select('main [role=img]')]
    if not any(kw in norm(a) for a in alts): problems[url].append('primary kw not in any alt text')
    url_kw = norm(url.replace('-', ' '))
    if r['page_type'] != 'core' and not all(w in url_kw for w in kw.split() if w not in ('cleaning',)):
        info[url].append('URL set by the CSV')
    if url != '/' and not any(kw in norm(t) or norm(t) in kw and len(norm(t)) > 8 for t in inbound.get(url, [])):
        problems[url].append(f'no inbound link with keyword anchor (anchors: {sorted(set(inbound.get(url, [])))[:4]})')
    words = len(text.split())
    t = r['page_type']
    lo, hi = {'service': (900, 1500), 'area': (800, 1200)}.get(t, (0, 99999))
    if url == '/': lo, hi = 1800, 2500
    if not lo <= words <= hi + 600: problems[url].append(f'word count {words} (target {lo}-{hi})')
    if t in ('service', 'area'):
        home_links = [a.get_text(' ', strip=True).lower() for a in soup.select('main a[href="/"]')]
        if 'bond cleaning brisbane' not in home_links: problems[url].append('no "bond cleaning Brisbane" link to /')
    if t == 'area':
        sub = norm(r['h1'].replace('Bond Cleaning in ', ''))
        for combo in ['end lease cleaning', 'bond cleaners', 'vacate cleaning', 'carpet cleaning']:
            if f'{combo} {sub}' not in norm(text): problems[url].append(f'missing "{combo} {sub}"')
        nlinks = {a['href'] for a in soup.select('main a[href]') if a['href'].endswith('-brisbane/') or a['href'] == '/bond-back-guarantee/'}
        if len(nlinks) < 5: problems[url].append(f'only {len(nlinks)} service links')
    report.append((url, words))

for kind, d in seen.items():
    for val, urls in d.items():
        if len(urls) > 1: problems['(dup)'].append(f'duplicate {kind}: {val!r} on {urls}')

banned = [r'#1\b', r'\bbest\b(?! (?:chance|way|time))', r'100% bond', r'\d+\+? happy customers', r'years in business', r'★', r'\d(\.\d)? stars?\b', r'\btestimonials? (?:from|by)\b']
for url, soup in pages.items():
    txt = soup.find('main').get_text(' ', strip=True) if soup.find('main') else ''
    for pat in banned:
        for m in re.finditer(pat, txt, re.I):
            ctx = txt[max(0, m.start() - 50): m.end() + 50]
            problems[url].append(f'banned pattern {pat!r}: …{ctx}…')
    if soup.find(string=re.compile('aggregateRating')): problems[url].append('aggregateRating present')
    for s in soup.find_all('script', type='application/ld+json'):
        try: json.loads(s.string)
        except Exception as e: problems[url].append(f'invalid JSON-LD: {e}')

for src, href in sorted(broken): problems[src].append(f'broken link {href}')

# Suburb paragraph overlap (8-word shingles over paragraphs outside shared components)
def shingles(t, n=8):
    w = norm(t).split()
    return {' '.join(w[i:i + n]) for i in range(len(w) - n + 1)}
area_urls = [r['url'] for r in rows if r['page_type'] == 'area']
uniq = {}
for u in area_urls:
    s = BeautifulSoup(str(pages[u]), 'html.parser')
    m = s.find('main')
    for el in m.select('.cta-band, .shared, .steps, .room-card, .trust-row, .chips, form, .faq summary, .area-groups, .photo figcaption, .section-head p, .notice'):
        el.decompose()
    paras = [p.get_text(' ', strip=True) for p in m.select('p, li, .answer')]
    uniq[u] = (paras, set().union(*[shingles(p) for p in paras]))
worst = []
for a, b in combinations(area_urls, 2):
    sa, sb = uniq[a][1], uniq[b][1]
    # suburb names differ, so mask them out before comparing
    na = norm(pages[a].find('h1').get_text().replace('Bond Cleaning in ', ''))
    nb = norm(pages[b].find('h1').get_text().replace('Bond Cleaning in ', ''))
    ma = {x.replace(na, 'X') for x in sa}; mb = {x.replace(nb, 'X') for x in sb}
    ov = len(ma & mb) / max(1, min(len(ma), len(mb)))
    worst.append((ov, a, b))
    for pa in uniq[a][0]:
        if len(pa.split()) >= 10 and norm(pa).replace(na, 'X') in {norm(pb).replace(nb, 'X') for pb in uniq[b][0]}:
            problems[a].append(f'paragraph shared with {b}: {pa[:80]}…')
worst.sort(reverse=True)

print('PAGES', len(pages))
print('Word counts:')
for u, w in report: print(f'  {w:5d}  {u}')
print('\nHighest suburb overlap pairs (8-word shingles):')
for ov, a, b in worst[:6]: print(f'  {ov:5.1%}  {a}  {b}')
n = sum(len(v) for v in problems.values())
print(f'\nPROBLEMS: {n}')
for u, ps in sorted(problems.items()):
    for p in ps: print(f'  {u}: {p}')
print('\nINFO (CSV-fixed wording, not failures):')
for u, ps in sorted(info.items()): print(f'  {u}: {", ".join(ps)}')
placeholders = set()
for soup in pages.values():
    placeholders |= set(re.findall(r'\[[^\[\]]{1,80}\]', soup.get_text(' ')))
print('\nPlaceholders visible on the site:', len(placeholders))
for p in sorted(placeholders): print('  ', p)
sys.exit(1 if n else 0)
