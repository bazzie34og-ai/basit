#!/usr/bin/env python3
"""Build prospects.csv and prospects.html from prospects.json.

Each entry in prospects.json is one verified prospect (see FIELDS). Every
fact must carry a source URL in `sources`; nothing here is generated.
"""
import csv
import html
import json
import re
from pathlib import Path
from urllib.parse import quote

HERE = Path(__file__).parent

FIELDS = [
    "business", "owner", "niche", "town", "areas",
    "phone", "phone_type", "wa_link", "phone_source",
    "website_status", "website_check",
    "track_record", "activity", "human_detail", "pain_points",
    "opener", "pain_message", "bridge", "confidence", "confidence_reason", "strength", "sources",
]
CONF_ORDER = {"High": 0, "Medium": 1, "Low": 2}


def wa_link(phone):
    digits = re.sub(r"\D", "", phone or "")
    if digits.startswith("07") and len(digits) == 11:
        return "https://wa.me/44" + digits[1:]
    return ""


def load():
    rows = json.loads((HERE / "prospects.json").read_text(encoding="utf-8"))
    for r in rows:
        r["wa_link"] = wa_link(r.get("phone"))
        r["phone_type"] = "Mobile" if r["wa_link"] else (r.get("phone_type") or "Landline/none")
    rows.sort(key=lambda r: (CONF_ORDER.get(r.get("confidence"), 9), -int(r.get("strength") or 0)))
    return rows


def write_csv(rows):
    with open(HERE / "prospects.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        for r in rows:
            out = {k: r.get(k, "") for k in FIELDS}
            out["pain_points"] = " | ".join(r.get("pain_points") or [])
            out["sources"] = " ".join(r.get("sources") or [])
            w.writerow(out)


def card(i, r):
    e = html.escape
    pains = "".join(f"<li>{e(p)}</li>" for p in r.get("pain_points") or []) or "<li>No clear pain point found</li>"
    links = " ".join(f'<a href="{e(u)}" target="_blank" rel="noopener">Open source ↗</a>' for u in r.get("sources") or [])
    if r["wa_link"]:
        wa = f'<a class="btn wa" href="{e(r["wa_link"])}?text={quote(r.get("opener", ""))}" target="_blank" rel="noopener">Open WhatsApp</a>'
        wa2 = f'<a class="btn wa" href="{e(r["wa_link"])}?text={quote(r.get("pain_message", ""))}" target="_blank" rel="noopener">WhatsApp this one</a>'
    else:
        wa = '<span class="btn off">No WhatsApp (no mobile)</span>'
        wa2 = wa
    return f"""
<article class="card" data-id="{i}">
  <header><h2>{e(r.get("business",""))}</h2><span class="conf {e(r.get("confidence","").lower())}">{e(r.get("confidence",""))}</span></header>
  <p class="meta">{e(r.get("owner") or "Owner not published")} · {e(r.get("town",""))} · {e(r.get("niche",""))}</p>
  <p class="meta">{e(r.get("phone") or "No phone")} ({e(r["phone_type"])}) · Website: {e(r.get("website_status",""))}</p>
  <p class="meta">{e(r.get("track_record",""))} · Active: {e(r.get("activity",""))}</p>
  <h3>Human detail</h3><p>{e(r.get("human_detail",""))}</p>
  <h3>Pain points</h3><ul>{pains}</ul>
  <h3>Opener</h3><p class="msg" id="o{i}">{e(r.get("opener",""))}</p>
  <h3>Or: insider question</h3><p class="msg" id="p{i}">{e(r.get("pain_message",""))}</p>
  <div class="actions"><button onclick="cp('p{i}',this)">Copy insider question</button>{wa2}</div>
  <h3>Bridge (after they reply)</h3><p class="msg" id="b{i}">{e(r.get("bridge",""))}</p>
  <p class="small">Confidence: {e(r.get("confidence_reason",""))}</p>
  <p class="links">{links}</p>
  <div class="actions">
    <button onclick="cp('o{i}',this)">Copy opener</button>{wa}
    <button onclick="cp('b{i}',this)">Copy bridge</button>
    <select onchange="save(this)" id="s{i}" data-key="{e(r.get('business',''))}">
      <option>Not contacted</option><option>Sent</option><option>Replied</option>
      <option>Interested</option><option>Not interested</option>
    </select>
  </div>
</article>"""


PAGE = """<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Website Prospects</title>
<style>
:root{--bg:#f6f7f9;--card:#fff;--ink:#1d2330;--mute:#5d6678;--line:#e3e6ec;--acc:#2456d6;--wa:#1f9d55}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
main{max-width:720px;margin:0 auto;padding:16px}h1{font-size:1.4rem;margin:.2em 0}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px;margin:14px 0}
.card header{display:flex;justify-content:space-between;gap:8px;align-items:start}h2{font-size:1.15rem;margin:0}
h3{font-size:.8rem;text-transform:uppercase;letter-spacing:.04em;color:var(--mute);margin:14px 0 4px}
.meta,.small{color:var(--mute);font-size:.9rem;margin:4px 0}.msg{background:#f1f4fb;border-radius:10px;padding:10px;margin:0}
.conf{font-size:.75rem;padding:2px 8px;border-radius:99px;background:#e8eefc;color:var(--acc);white-space:nowrap}.conf.medium{background:#fdf2dc;color:#8a5a00}.conf.low{background:#f3e8e8;color:#8a2a2a}
.links a{color:var(--acc);margin-right:10px;font-size:.9rem}
.actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
button,.btn,select{font:inherit;padding:10px;border-radius:10px;border:1px solid var(--line);background:#fff;text-align:center;text-decoration:none;color:var(--ink)}
.btn.wa{background:var(--wa);color:#fff;border-color:var(--wa)}.btn.off{color:var(--mute);font-size:.85rem}
ul{margin:0;padding-left:20px}
</style></head><body><main>
<h1>Website Prospects</h1><p class="meta">{count} prospects · WhatsApp is not confirmed for any number — tap to check. Built from search results only (sites were blocked); check every source before sending.</p>
{cards}
</main><script>
function cp(id,b){var t=document.getElementById(id).innerText;var done=function(){var o=b.innerText;b.innerText='Copied';setTimeout(function(){b.innerText=o},1200)};
if(navigator.clipboard){navigator.clipboard.writeText(t).then(done,function(){fb(t);done()})}else{fb(t);done()}}
function fb(t){var a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}a.remove()}
function save(s){try{localStorage.setItem('prospect-status-'+s.dataset.key,s.value)}catch(e){}}
document.querySelectorAll('select[id^=s]').forEach(function(s){try{var v=localStorage.getItem('prospect-status-'+s.dataset.key);if(v)s.value=v}catch(e){}});
</script></body></html>"""


def main():
    rows = load()
    write_csv(rows)
    cards = "".join(card(i, r) for i, r in enumerate(rows))
    (HERE / "prospects.html").write_text(PAGE.replace("{count}", str(len(rows))).replace("{cards}", cards), encoding="utf-8")
    print(f"Built {len(rows)} prospects")


if __name__ == "__main__":
    main()
