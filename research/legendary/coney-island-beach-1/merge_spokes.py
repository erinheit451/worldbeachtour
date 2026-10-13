"""Fold research/legendary/<slug>/spoke.<s>.json into showcase.spokes_content[<s>], in composition spoke order."""
import json, os, re
MAIN = r"C:\Users\erinr\wt\worldbeachtour\main"
SLUG = "coney-island-beach-1"
LEG = os.path.join(MAIN, "research", "legendary", SLUG)
CB = os.path.join(MAIN, "site", "content", "beaches", SLUG)
comp = json.load(open(os.path.join(CB, "composition.json"), encoding="utf-8"))
sc_path = os.path.join(CB, "showcase.json")
sc = json.load(open(sc_path, encoding="utf-8"))
content = {}
for spk in comp.get("spokes", []):
    s = spk["slug"]
    p = os.path.join(LEG, f"spoke.{s}.json")
    if not os.path.exists(p):
        print("MISSING", s); continue
    d = json.load(open(p, encoding="utf-8"))
    route = os.path.join(MAIN, "site", "app", "beaches", SLUG, s, "page.tsx")
    words = len(re.findall(r"\S+", d.get("intro", "") + " " + " ".join(x["body"] for x in d.get("sections", []))))
    print(f"{s:14} words={words:5} sections={len(d.get('sections', []))} sources={len(d.get('sources', []))} route={'ok' if os.path.exists(route) else 'MISSING'}")
    content[s] = d
sc["spokes_content"] = content
json.dump(sc, open(sc_path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
