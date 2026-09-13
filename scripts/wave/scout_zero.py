"""Zero-LLM scout: build research/urls/<slug>.txt without WebSearch.
Why: the session WebSearch quota (200) is shared by every agent; Wave 4's 16 LLM
scouts spent it (~95k tokens each) and Wave 5's scouts all failed on it. The
sources an LLM scout finds are mostly (a) the Wikipedia article, (b) the URLs
that article already cites, and (c) a few dated news hits — all reachable by
script: Wikipedia API `externallinks` + `langlinks`, and Bing's RSS search.
Output matches scout.md: best-first URL list, then a `#` notes block. Story
strength is left for the extractor (it must find a `strong` spike or the wave
parks the slug).
Usage: python scout_zero.py <slug> [slug...] [--max 24]
"""
import json, os, re, sys, urllib.parse, urllib.request, xml.etree.ElementTree as ET

try: sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception: pass

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA = os.path.join(ROOT, "site", "data", "beaches")
OUT = os.path.join(ROOT, "research", "urls")
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36 WorldBeachTour-scout/1.0"}

# languages worth pulling a second Wikipedia article from, by country
LOCAL_LANG = {"ES": ["es", "ca"], "PT": ["pt"], "GR": ["el"], "EL": ["el"], "FR": ["fr"], "IT": ["it"],
              "DE": ["de"], "NL": ["nl"], "IN": ["ml", "hi", "ta", "te", "mr"], "TR": ["tr"], "HR": ["hr"],
              "BR": ["pt"], "MX": ["es"], "CU": ["es"], "PR": ["es"], "TH": ["th"], "ID": ["id"], "PH": ["tl"],
              "KR": ["ko"], "JP": ["ja"], "FI": ["fi"], "NO": ["no"], "DK": ["da"], "SE": ["sv"], "PL": ["pl"],
              "CY": ["el"], "CW": ["nl", "pap"], "JM": [], "SO": ["so"], "PK": ["ur"], "GH": [], "VI": [], "CA": ["fr"]}
DROP = re.compile(r"(doi\.org|books\.google|worldcat|jstor|isbn|amazon\.|youtube|youtu\.be|instagram|facebook|tiktok|"
                  r"pinterest|tripadvisor|booking\.com|airbnb|expedia|hotels\.com|yelp|airial|viator|getyourguide|"
                  r"wunderground|geohack|toolforge|wikimedia\.org/wiki/File|id\.loc\.gov|lux\.collections|viaf\.org|geonames|"
                  r"wikidata\.org|britannica\.com/science|ocearch|oceanicsociety|\.pdf$|\.jpg$|\.png$)", re.I)
OFFICIAL = re.compile(r"(\.gov\b|\.gov\.|\.gouv\.|\.gob\.|\.gc\.ca|\.nic\.in|\.edu\b|\.ac\.|council|ajuntament|"
                      r"ayuntamiento|cm-[a-z]|camara|municipio|comune|mairie|parks|nps\.gov|noaa|epa\.|eea\.europa|"
                      r"blueflag|bandera|lifesaving|rnli|surflifesaving|coastguard)", re.I)
NEWS = re.compile(r"(news|times|post|herald|tribune|gazette|chronicle|standard|guardian|bbc|abc\.net|cbc\.ca|"
                  r"sfgate|kqed|sapo\.pt|publico|observador|expresso|diario|jornal|periodico|elpais|elmundo|"
                  r"lavanguardia|ultimahora|mallorca|ibiza|thehindu|indianexpress|timesofindia|hindustantimes|"
                  r"onmanorama|mathrubhumi|smh\.com|theage|watoday|perthnow|thewest|kathimerini|ekathimerini|"
                  r"ouest-france|letelegramme|globalnews|thestar|nationalpost)", re.I)


def get(url, timeout=25, tries=4):
    import time
    for i in range(tries):   # Wikipedia/Bing 429 on rapid batches; back off instead of silently returning nothing
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code in (429, 503) and i < tries - 1: time.sleep(3 * (i + 1)); continue
            raise
    raise RuntimeError("unreachable")


def wiki(lang, title):
    """externallinks + langlinks + first-paragraph-ish extract for one article."""
    api = (f"https://{lang}.wikipedia.org/w/api.php?action=parse&page={urllib.parse.quote(title)}"
           f"&prop=externallinks|langlinks&redirects=1&format=json")
    try:
        d = json.loads(get(api))["parse"]
    except Exception as e:
        return [], {}, f"{lang}:{title} unavailable ({str(e)[:40]})"
    ext = [u if u.startswith("http") else "https:" + u for u in d.get("externallinks", [])]
    ll = {l["lang"]: l["*"] for l in d.get("langlinks", [])}
    return ext, ll, None


def bing(q, must, n=6):
    """RSS search; keep only items whose title/description/URL mention every word of `must`
    (Bing ignores quotes and pads generic names with trivia: 'Ocean Beach' -> ocean facts)."""
    url = "https://www.bing.com/search?format=rss&q=" + urllib.parse.quote_plus(q)
    GENERIC = {"beach","praia","playa","platja","plage","cala","spiaggia","strand","the","and","des","del","les","north","south","sands"}
    words = [w for w in re.findall(r"\w+", must.lower()) if len(w) > 2 and w not in GENERIC]
    try:
        root = ET.fromstring(get(url))
        out = []
        for item in root.iter("item"):
            link = (item.findtext("link") or "").strip()
            blob = ((item.findtext("title") or "") + " " + (item.findtext("description") or "") + " " + link).lower()
            if link and not DROP.search(link) and all(w in blob for w in words): out.append(link)
        return out[:n]
    except Exception:
        return []


def rank(u):
    if "wikipedia.org" in u: return 0
    if OFFICIAL.search(u): return 1
    if NEWS.search(u): return 2
    if "web.archive.org" in u: return 5
    return 3


def scout(slug, cap):
    d = json.load(open(os.path.join(DATA, f"{slug}.json"), encoding="utf-8"))
    name, cc = d.get("name") or slug, (d.get("country_code") or "").upper()
    town = d.get("nearest_city") or ""
    wurl = d.get("wikipedia_url") or ""
    notes, urls = [], []
    m = re.match(r"https?://(\w+)\.wikipedia\.org/wiki/(.+)", wurl)
    en_title = urllib.parse.unquote(m.group(2)) if m else name
    urls.append(wurl or f"https://en.wikipedia.org/wiki/{urllib.parse.quote(name.replace(' ', '_'))}")
    ext, ll, err = wiki(m.group(1) if m else "en", en_title)
    if err: notes.append(err)
    local_titles = []
    for lang in LOCAL_LANG.get(cc, []):
        if lang in ll:
            local_titles.append((lang, ll[lang]))
            urls.append(f"https://{lang}.wikipedia.org/wiki/{urllib.parse.quote(ll[lang].replace(' ', '_'))}")
    for lang, t in local_titles[:1]:
        e2, _, err2 = wiki(lang, t)
        if not err2: ext += e2
    refs = [u for u in dict.fromkeys(ext) if not DROP.search(u)]
    refs.sort(key=rank)
    # recency + tension via Bing RSS (4 queries)
    # generic names ("Ocean Beach") need a place qualifier or Bing returns ocean trivia
    dis = re.search(r",\s*([^,()]+)$", en_title.replace("_", " "))
    place = (dis.group(1).strip() if dis else "") or town or (d.get("admin_level_1") or "")
    qs = [f'"{name}" "{place}" 2026', f'"{name}" "{place}" 2025',
          f'"{name}" "{place}" beach (erosion OR closure OR drowning OR pollution OR council OR "blue flag")']
    if local_titles: qs.append(f'"{local_titles[0][1]}" 2025')
    news = []
    for q in qs[:3]: news += bing(q, f"{name} {place}")
    if len(qs) > 3: news += bing(qs[3], local_titles[0][1])
    news += bing(f"{name} {place} {town}".strip(), f"{name} {place}")   # unquoted fallback for small beaches
    news = [u for u in dict.fromkeys(news) if "wikipedia.org" not in u]
    top = [u for u in refs if rank(u) <= 1]          # wikipedia + official first
    rest = [u for u in refs if rank(u) > 1]
    seen, final = set(urls), list(urls)
    for u in top + news[:8] + rest:
        if u in seen: continue
        seen.add(u); final.append(u)
        if len(final) >= cap: break
    body = "\n".join(final) + "\n"
    body += f"# notes: zero-LLM scout (scout_zero.py). identity: name={name!r} country={cc} town={town!r} wikipedia={en_title!r}; "
    body += (f"local-language article(s): {', '.join(f'{l}:{t}' for l, t in local_titles)}. " if local_titles else "no local-language article found. ")
    body += f"{len(refs)} reference URLs harvested from the article(s); {len(news)} dated/news hits from 4 Bing queries. "
    body += ("Scaffold overview/travel claims are UNVERIFIED hypotheses. " + (" ".join(notes) if notes else "")) + "\n"
    body += "# story_strength: unknown — extractor decides (park if no strong spike candidate)\n"
    os.makedirs(OUT, exist_ok=True)
    open(os.path.join(OUT, f"{slug}.txt"), "w", encoding="utf-8", newline="\n").write(body)
    print(f"{slug:28} urls={len(final):2} refs={len(refs):2} news={len(news):2} local={[l for l,_ in local_titles]}")


if __name__ == "__main__":
    args = sys.argv[1:]
    cap = 24
    if "--max" in args:
        i = args.index("--max"); cap = int(args[i + 1]); del args[i:i + 2]
    import time
    for s in args:
        try: scout(s, cap)
        except Exception as e: print(f"{s:28} FAILED {e}")
        time.sleep(1.5)
