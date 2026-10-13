"""Write curated images into site/content/beaches/coney-island-beach-1/meta.json.
Resized Commons renditions (hero 2400px, gallery 1280px) are fetched from the API so URLs are real."""
import json, urllib.request, urllib.parse
MAIN = r"C:\Users\erinr\wt\worldbeachtour\main"
IMG = MAIN + r"\research\legendary\coney-island-beach-1\images.json"
META = MAIN + r"\site\content\beaches\coney-island-beach-1\meta.json"
UA = {"User-Agent": "wbt-research/1.0 (erinrose451@gmail.com)"}

def rendition(title, width):
    q = {"action": "query", "titles": "File:" + title, "prop": "imageinfo", "iiprop": "url",
         "iiurlwidth": str(width), "format": "json"}
    with urllib.request.urlopen(urllib.request.Request(
            "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(q), headers=UA), timeout=30) as r:
        p = next(iter(json.load(r)["query"]["pages"].values()))
    ii = p["imageinfo"][0]
    return ii.get("thumburl") or ii["url"], ii.get("thumbwidth"), ii.get("thumbheight")

picks = json.load(open(IMG, encoding="utf-8"))
meta = json.load(open(META, encoding="utf-8"))
gallery = []
for p in picks:
    url, w, h = rendition(p["title"], 1600 if p["role"] == "hero" else 1280)
    thumb = url if p["role"] == "hero" else rendition(p["title"], 640)[0]  # hero renders thumbnail first
    entry = {"url": url, "thumbnail": thumb, "title": p["shows"], "author": p["author"], "license": p["license"],
             "source_url": p["commons_page"], "width": w or p["width"], "height": h or p["height"],
             "tier": "A", "role": p["role"]}
    if p["role"] == "hero":
        meta["images"]["hero"] = entry
    else:
        gallery.append(entry)
meta["images"]["gallery"] = gallery
meta["tier"] = 1
meta["images"]["_enrichment"] = {"curated": "2026-10-13 hand-picked from Wikimedia Commons; license/author from the Commons API",
                                 "hero_auto_selected": False}
json.dump(meta, open(META, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print("hero:", meta["images"]["hero"]["url"][:110])
print("gallery:", len(gallery))
