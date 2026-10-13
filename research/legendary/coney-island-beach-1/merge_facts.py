"""Merge topic fact sheets -> research/coney-island-beach-1.json (what trace_check/quote_check read),
then split into author-readable parts sheet.partNofM.json (<=45k chars each, one topic per part group)."""
import json, os, glob
MAIN = r"C:\Users\erinr\wt\worldbeachtour\main"
SLUG = "coney-island-beach-1"
LEG = os.path.join(MAIN, "research", "legendary", SLUG)
TOPICS = ["visit", "now", "hist1", "hist2", "culture", "gaps"]
CAP = 45_000

merged = {"slug": SLUG, "beach_name": "Coney Island Beach", "researched_at": "2026-10-13",
          "identity": None, "spike_candidates": [], "facts": [], "recency": {}, "dead_ends": [],
          "conflicts": [], "derivations": []}
per_topic = {}
for t in TOPICS:
    p = os.path.join(LEG, f"facts.{t}.json")
    if not os.path.exists(p):
        raise SystemExit(f"missing {p}")
    d = json.load(open(p, encoding="utf-8"))
    per_topic[t] = d
    merged["identity"] = merged["identity"] or d.get("identity")
    merged["spike_candidates"] += [dict(c, topic=t) for c in d.get("spike_candidates", [])]
    merged["facts"] += d.get("facts", [])
    merged["recency"][t] = d.get("recency")
    merged["dead_ends"] += [f"[{t}] {x}" for x in d.get("dead_ends", [])]
    merged["conflicts"] += [f"[{t}] {x}" if isinstance(x, str) else dict(x, topic=t) for x in d.get("conflicts", [])]
der = os.path.join(LEG, "derivations.json")
if os.path.exists(der):
    merged["derivations"] = json.load(open(der, encoding="utf-8"))
ids = [f["id"] for f in merged["facts"]]
dupes = {i for i in ids if ids.count(i) > 1}
json.dump(merged, open(os.path.join(MAIN, "research", f"{SLUG}.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"facts={len(ids)} dupes={sorted(dupes)} spikes={len(merged['spike_candidates'])} "
      f"conflicts={len(merged['conflicts'])} dead_ends={len(merged['dead_ends'])}")

# author parts: per topic, facts chunked; each part repeats the topic's conflicts/dead_ends/recency on its first chunk
for f in glob.glob(os.path.join(LEG, "sheet.part*.json")):
    os.remove(f)
parts = []
for t in TOPICS:
    d = per_topic[t]
    head = {"topic": t, "spike_candidates": d.get("spike_candidates", []), "conflicts": d.get("conflicts", []),
            "dead_ends": d.get("dead_ends", []), "recency": d.get("recency"), "facts": []}
    cur = dict(head)
    for fact in d.get("facts", []):
        slim = {k: fact.get(k) for k in ("id", "topic", "fact", "quote", "url", "source_title", "source_type",
                                          "date_of_source", "confidence", "time_sensitive") if fact.get(k) is not None}
        cur["facts"].append(slim)
        if len(json.dumps(cur, ensure_ascii=False)) > CAP:
            cur["facts"].pop()
            parts.append(cur)
            cur = {"topic": t, "note": "continued", "facts": [slim]}
    parts.append(cur)
for i, p in enumerate(parts, 1):
    json.dump(p, open(os.path.join(LEG, f"sheet.part{i}of{len(parts)}.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)
print(f"{len(parts)} author parts:", [len(json.dumps(p, ensure_ascii=False)) for p in parts])
