"""Attach hand-picked Commons photos to Tier-1 spokes: hero_image + per-section image (matched by heading keyword).
Each pick was checked by eye on a contact sheet; license/author come from the Commons API (candidates.json)."""
import json, os, urllib.request, urllib.parse
MAIN = r"C:\Users\erinr\wt\worldbeachtour\main"
LEG = os.path.join(MAIN, "research", "legendary", "coney-island-beach-1")
CAND = r"C:\Users\erinr\AppData\Local\Temp\claude\C--Users-erinr\bdf85002-5d88-45c8-b437-09b03e6ec4ab\scratchpad\commons\candidates.json"
UA = {"User-Agent": "wbt-research/1.0 (erinrose451@gmail.com)"}
rows = json.load(open(CAND, encoding="utf-8"))

# spoke -> (hero idx, hero caption), [(heading keyword, idx, caption)]
PICKS = {
    "travel": ((166, "Sunbathers on Coney Island Beach, May 2015"), []),
    "history": ((140, "The beach, boardwalk and Steeplechase Pier from the air, taken between 1917 and 1964 (National Archives)"), [
        ("crowded years", 198, "The beach packed from water to boardwalk, 1928")]),
    "the-rides": ((63, "The Cyclone, Parachute Jump and Wonder Wheel at dusk"), [
        ("Wonder Wheel", 45, "Deno's Wonder Wheel, July 2025"),
        ("Cyclone", 94, "The Cyclone, August 2022"),
        ("Parachute Jump", 112, "The Parachute Jump, September 2018"),
        ("Carousell", 30, "The B&B Carousell, 2014")]),
    "the-shoreline": ((132, "The beach and Parachute Jump from Steeplechase Pier, October 2023"), [
        ("Sandy", 28, "Volunteers sweep sand off the boardwalk after Hurricane Sandy, November 2012"),
        ("boardwalk", 32, "Boardwalk planks being replaced near Coney Island Avenue"),
        ("build", 186, "The Coney Island peninsula and its beach from the air, December 2008")]),
}

def rendition(title, width):
    q = {"action": "query", "titles": title, "prop": "imageinfo", "iiprop": "url", "iiurlwidth": str(width), "format": "json"}
    with urllib.request.urlopen(urllib.request.Request(
            "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(q), headers=UA), timeout=30) as r:
        p = next(iter(json.load(r)["query"]["pages"].values()))
    return p["imageinfo"][0].get("thumburl") or p["imageinfo"][0]["url"]

def image(idx, caption, width):
    r = rows[idx]
    return {"url": rendition(r["title"], width), "title": caption, "author": r["artist"], "license": r["license"],
            "source_url": "https://commons.wikimedia.org/wiki/" + r["title"].replace(" ", "_")}

for spoke, ((hidx, hcap), secs) in PICKS.items():
    p = os.path.join(LEG, f"spoke.{spoke}.json")
    d = json.load(open(p, encoding="utf-8"))
    d["hero_image"] = image(hidx, hcap, 1600)
    for s in d.get("sections", []):
        s.pop("image", None)
    used = set()
    for kw, idx, cap in secs:
        sec = next((s for s in d["sections"] if kw.lower() in s["heading"].lower() and id(s) not in used), None)
        if not sec:
            print(f"  {spoke}: no section heading matches {kw!r}"); continue
        sec["image"] = image(idx, cap, 1024); used.add(id(sec))
        print(f"  {spoke}: '{sec['heading'][:55]}' <- #{idx}")
    json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(spoke, "hero <-", hidx)
