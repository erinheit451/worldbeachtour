"""One-off analysis: tier boundary samples + candidate tier counts (Erin's 4-tier model)."""
import sys
import sqlite3

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
db = sqlite3.connect("output/world_beaches.db")
db.row_factory = sqlite3.Row
q = lambda s: db.execute(s).fetchone()[0]

NAMED = "name IS NOT NULL AND name != ''"
UNNAMED = "(name IS NULL OR name = '')"


def show(label, sql):
    print(f"--- {label} ---")
    for r in db.execute(sql):
        pv = r["wikipedia_page_views_annual"] or 0
        print(f"  {(r['name'] or r['slug'])[:38]:40} {r['country_code'] or '??'} notab={r['notability_score']:<5} pv={pv:,}")


show(
    "named, notability < 2.5 (T3 floor sample)",
    "SELECT name,slug,country_code,notability_score,wikipedia_page_views_annual "
    f"FROM beaches WHERE {NAMED} AND notability_score < 2.5 ORDER BY RANDOM() LIMIT 10",
)

print()
print("== notability pollution check ==")
n1 = q(f"SELECT COUNT(*) FROM beaches WHERE {UNNAMED} AND notability_score >= 10")
n2 = q(f"SELECT COUNT(*) FROM beaches WHERE {NAMED} AND notability_score >= 10")
print(f"unnamed with notab>=10: {n1:,}")
print(f"named   with notab>=10: {n2:,}")

print()
print("== candidate tier counts (Erin model) ==")
print("T1 pv>100K:", q("SELECT COUNT(*) FROM beaches WHERE wikipedia_page_views_annual > 100000"))
t2a = q("SELECT COUNT(*) FROM beaches WHERE wikipedia_page_views_annual > 5000 OR (wikidata_id IS NOT NULL AND notability_score >= 20)")
t2b = q("SELECT COUNT(*) FROM beaches WHERE wikipedia_page_views_annual > 1000 OR (wikidata_id IS NOT NULL AND notability_score >= 15)")
t3 = q(f"SELECT COUNT(*) FROM beaches WHERE {NAMED}")
t3f = q(f"SELECT COUNT(*) FROM beaches WHERE {NAMED} AND (wikidata_id IS NOT NULL OR nearest_city_distance_km <= 25)")
t4 = q(f"SELECT COUNT(*) FROM beaches WHERE {UNNAMED}")
print(f"T2 strict (pv>5K OR wikidata+notab>=20): {t2a:,}")
print(f"T2 looser (pv>1K OR wikidata+notab>=15): {t2b:,}")
print(f"T3 named: {t3:,}")
print(f"T3 named+findable (wikidata OR city<=25km): {t3f:,}")
print(f"T4 unnamed: {t4:,}")
