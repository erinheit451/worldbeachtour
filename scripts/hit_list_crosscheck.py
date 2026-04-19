"""Cross-check hit-list candidates against world_beaches.db.

Reads a list of (name, country_code) tuples, fuzzy-matches against the DB,
and emits a markdown report showing the best candidate slug, name, notability,
and views — plus a flag for misses worth investigating.
"""
from __future__ import annotations
import sqlite3
import re
from pathlib import Path

DB = Path("output/world_beaches.db")

# Normalize US-* subnational codes to US for DB lookup
def norm_country(cc: str) -> str:
    if cc.startswith("US-"):
        return "US"
    return cc

# Strip diacritics + common suffixes for matching
def normalize(s: str) -> str:
    s = s.lower()
    s = (s.replace("ʻ", "")
           .replace("ā", "a").replace("ē", "e").replace("ī", "i")
           .replace("ō", "o").replace("ū", "u")
           .replace("ñ", "n").replace("é", "e").replace("è", "e")
           .replace("á", "a").replace("í", "i").replace("ó", "o")
           .replace("ú", "u").replace("ç", "c").replace("ã", "a")
           .replace("õ", "o").replace("â", "a").replace("ê", "e")
           .replace("ô", "o").replace("ö", "o").replace("ä", "a")
           .replace("ü", "u").replace("ß", "ss"))
    s = re.sub(r"[^a-z0-9 ]+", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

def match_one(cur, raw_name: str, country: str, state_hint: str | None = None):
    """Return list of (slug, db_name, notab, views, wikidata) ranked best→worst."""
    nname = normalize(raw_name)
    # Tokens for partial matching
    toks = [t for t in nname.split() if t not in ("beach", "bay", "cove", "the")]
    if not toks:
        toks = nname.split()
    db_country = norm_country(country)
    # Pull all beaches in country whose normalized name contains the first significant token
    primary = toks[0]
    sql = """
      SELECT slug, name, notability_score, wikipedia_page_views_annual, wikidata_id, admin_level_1
      FROM beaches
      WHERE country_code = ? AND lower(name) LIKE ?
      ORDER BY notability_score DESC NULLS LAST
      LIMIT 50
    """
    rows = cur.execute(sql, (db_country, f"%{primary}%")).fetchall()
    scored = []
    for slug, name, notab, views, wd, region in rows:
        n = normalize(name)
        # Score: count how many tokens appear in normalized DB name
        hits = sum(1 for t in toks if t in n)
        if hits == 0:
            continue
        # Bonus if state hint matches region
        bonus = 0
        if state_hint and region and state_hint.lower() in region.lower():
            bonus = 5
        scored.append((hits + bonus + (1 if notab else 0), slug, name, notab or 0, views or 0, wd, region))
    scored.sort(reverse=True, key=lambda r: (r[0], r[3], r[4]))
    return scored[:3]

# Hit-list candidates: (name, country_code, state_hint_or_None)
CANDIDATES = [
    # SURF
    ("Banzai Pipeline", "US", "Hawaii"),
    ("Sunset Beach", "US", "Hawaii"),
    ("Waimea Bay", "US", "Hawaii"),
    ("Honolua Bay", "US", "Hawaii"),
    ("Mavericks", "US", "California"),
    ("Trestles", "US", "California"),
    ("Malibu", "US", "California"),
    ("Huntington Beach", "US", "California"),
    ("Ocean Beach", "US", "California"),
    ("Steamer Lane", "US", "California"),
    ("Rincon", "US", "California"),
    ("Black's Beach", "US", "California"),
    ("Cloud 9", "PH", None),
    ("Uluwatu", "ID", None),
    ("Padang Padang", "ID", None),
    ("Keramas", "ID", None),
    ("Desert Point", "ID", None),
    ("Lakey", "ID", None),
    ("Plengkung", "ID", None),
    ("Lagundri", "ID", None),
    ("Macaronis", "ID", None),
    ("Cloudbreak", "FJ", None),
    ("Tavarua", "FJ", None),
    ("Teahupoo", "PF", None),
    ("Jeffreys Bay", "ZA", None),
    ("Dungeons", "ZA", None),
    ("Skeleton Bay", "NA", None),
    ("Donkey Bay", "NA", None),
    ("Anchor Point", "MA", None),
    ("Imsouane", "MA", None),
    ("Mundaka", "ES", None),
    ("Hossegor", "FR", None),
    ("La Graviere", "FR", None),
    ("Supertubos", "PT", None),
    ("Coxos", "PT", None),
    ("Ericeira", "PT", None),
    ("Bells Beach", "AU", None),
    ("Snapper Rocks", "AU", None),
    ("Kirra", "AU", None),
    ("Burleigh Heads", "AU", None),
    ("Margaret River", "AU", None),
    ("Shipsterns", "AU", None),
    ("Manly Beach", "AU", None),
    ("Byron Bay", "AU", None),
    ("Raglan", "NZ", None),
    ("Manu Bay", "NZ", None),
    ("Piha", "NZ", None),
    ("Punta de Lobos", "CL", None),
    ("Pichilemu", "CL", None),
    ("Chicama", "PE", None),
    ("Mancora", "PE", None),
    ("Puerto Escondido", "MX", None),
    ("Zicatela", "MX", None),
    ("Pavones", "CR", None),
    ("Witch's Rock", "CR", None),
    ("Tamarindo", "CR", None),
    ("Salina Cruz", "MX", None),
    ("Sayulita", "MX", None),
    ("Mullaghmore", "IE", None),
    ("Thurso", "GB", None),

    # SAND
    ("Reynisfjara", "IS", None),
    ("Diamond Beach", "IS", None),
    ("Jokulsarlon", "IS", None),
    ("Vik", "IS", None),
    ("Punaluu", "US", "Hawaii"),
    ("Papakolea", "US", "Hawaii"),
    ("Kaihalulu", "US", "Hawaii"),
    ("Glass Beach", "US", "California"),
    ("Glass Beach", "US", "Hawaii"),
    ("Pfeiffer Beach", "US", "California"),
    ("Bowling Ball", "US", "California"),
    ("Pink Sands", "BS", None),
    ("Pink Beach", "ID", None),
    ("Tangsi", "ID", None),
    ("Elafonissi", "GR", None),
    ("Balos", "GR", None),
    ("Spiaggia Rosa", "IT", None),
    ("Budelli", "IT", None),
    ("Whitehaven", "AU", None),
    ("Hyams Beach", "AU", None),
    ("Lucky Bay", "AU", None),
    ("Cable Beach", "AU", None),
    ("Anse Source d'Argent", "SC", None),
    ("Praia do Sancho", "BR", None),
    ("Navagio", "GR", None),
    ("Benagil", "PT", None),
    ("Marinha", "PT", None),
    ("Etretat", "FR", None),
    ("Durdle Door", "GB", None),
    ("Old Harry Rocks", "GB", None),
    ("Giant's Causeway", "GB", None),
    ("Cathedral Cove", "NZ", None),
    ("Wharariki", "NZ", None),
    ("Koekohe", "NZ", None),
    ("Moeraki", "NZ", None),
    ("Shell Beach", "AU", None),
    ("Falesia", "PT", None),
    ("Praia Vermelha", "BR", None),
    ("Coxs Bazar", "BD", None),
    ("Adraga", "PT", None),
    ("Cala Goloritze", "IT", None),
    ("Cala Mariolu", "IT", None),
    ("La Pelosa", "IT", None),
    ("Talisker", "GB", None),
    ("Sandymouth", "GB", None),
    ("Skeleton Coast", "NA", None),
    ("Hidden Beach", "MX", None),
    ("Marieta", "MX", None),
    ("Ulong", "PW", None),
    ("Kynance", "GB", None),
    ("Eigg", "GB", None),
    ("Ramla", "MT", None),

    # HISTORY
    ("Omaha Beach", "FR", None),
    ("Utah Beach", "FR", None),
    ("Juno Beach", "FR", None),
    ("Gold Beach", "FR", None),
    ("Sword Beach", "FR", None),
    ("Pointe du Hoc", "FR", None),
    ("Anzio", "IT", None),
    ("Salerno", "IT", None),
    ("Paestum", "IT", None),
    ("Suribachi", "JP", None),
    ("Iwo Jima", "JP", None),
    ("Tarawa", "KI", None),
    ("Saipan", "MP", None),
    ("Tinian", "MP", None),
    ("Peleliu", "PW", None),
    ("Guadalcanal", "SB", None),
    ("Anzac Cove", "TR", None),
    ("Suvla", "TR", None),
    ("Inchon", "KR", None),
    ("Dunkirk", "FR", None),
    ("Playa Giron", "CU", None),
    ("Plymouth", "US", "Massachusetts"),
    ("Botany Bay", "AU", None),
    ("Drake's Beach", "US", "California"),
    ("Port Arthur", "AU", None),
    ("St. Augustine", "US", "Florida"),
    ("Dieppe", "FR", None),
    ("Walcheren", "NL", None),
    ("Maleme", "GR", None),
    ("Goree", "SN", None),
    ("Cape Coast", "GH", None),
    ("Elmina", "GH", None),
    ("Bunce", "SL", None),
    ("Kwajalein", "MH", None),
    ("San Carlos", "FK", None),
    ("Plymouth Hoe", "GB", None),
    ("Mers el Kebir", "DZ", None),
    ("Hastings", "GB", None),
    ("Pevensey", "GB", None),
    ("Marathon", "GR", None),
    ("Trafalgar", "ES", None),
    ("Ostia", "IT", None),

    # PHOTOGRAPHY
    ("Uttakleiv", "NO", None),
    ("Haukland", "NO", None),
    ("Ramberg", "NO", None),
    ("Kvalvika", "NO", None),
    ("Sandur", "FO", None),
    ("Saksun", "FO", None),
    ("Camilo", "PT", None),
    ("Porquerolles", "FR", None),
    ("Anse Lazio", "SC", None),
    ("Lopes Mendes", "BR", None),
    ("Hokitika", "NZ", None),
    ("Wineglass Bay", "AU", None),
    ("Twelve Apostles", "AU", None),
    ("Loch Ard", "AU", None),
    ("Maya Bay", "TH", None),
    ("Phra Nang", "TH", None),
    ("Railay", "TH", None),
    ("Halong", "VN", None),
    ("El Nido", "PH", None),
    ("Kayangan", "PH", None),
    ("Coron", "PH", None),
    ("McWay", "US", "California"),
    ("Bandon", "US", "Oregon"),
    ("Cannon Beach", "US", "Oregon"),
    ("Haystack Rock", "US", "Oregon"),
    ("Ruby Beach", "US", "Washington"),
    ("Second Beach", "US", "Washington"),
    ("La Push", "US", "Washington"),

    # DIVING
    ("Sipadan", "MY", None),
    ("Mabul", "MY", None),
    ("Layang Layang", "MY", None),
    ("Tubbataha", "PH", None),
    ("Apo Island", "PH", None),
    ("Anilao", "PH", None),
    ("Raja Ampat", "ID", None),
    ("Wakatobi", "ID", None),
    ("Bunaken", "ID", None),
    ("Lembeh", "ID", None),
    ("Hanifaru", "MV", None),
    ("Havelock", "IN", None),
    ("Radhanagar", "IN", None),
    ("Similan", "TH", None),
    ("Surin", "TH", None),
    ("Ko Tao", "TH", None),
    ("Heron Island", "AU", None),
    ("Lady Elliot", "AU", None),
    ("Ningaloo", "AU", None),
    ("Coral Bay", "AU", None),
    ("Rottnest", "AU", None),
    ("Lord Howe", "AU", None),
    ("Tortuga Bay", "EC", None),
    ("Gardner Bay", "EC", None),
    ("Cocos Island", "CR", None),
    ("Bonaire", "BQ", None),
    ("Klein Curacao", "CW", None),
    ("Stingray City", "KY", None),
    ("Hol Chan", "BZ", None),
    ("Roatan", "HN", None),
    ("West Bay", "HN", None),
    ("Cozumel", "MX", None),
    ("Palancar", "MX", None),
    ("Ras Mohammed", "EG", None),
    ("Dahab", "EG", None),
    ("Marsa Alam", "EG", None),
    ("Aliwal", "ZA", None),
    ("Sodwana", "ZA", None),
    ("Aldabra", "SC", None),
    ("Chuuk", "FM", None),
    ("Bikini Atoll", "MH", None),
    ("Scapa", "GB", None),

    # WILDLIFE / ENVIRONMENT
    ("Boulders Beach", "ZA", None),
    ("Ostional", "CR", None),
    ("Tortuguero", "CR", None),
    ("Playa Grande", "CR", None),
    ("Praia do Forte", "BR", None),
    ("Mon Repos", "AU", None),
    ("Rekawa", "LK", None),
    ("Nungwi", "TZ", None),
    ("Akumal", "MX", None),
    ("Phillip Island", "AU", None),
    ("Bay of Fires", "AU", None),
    ("Punta Tombo", "AR", None),
    ("Valdes", "AR", None),
    ("Hervey Bay", "AU", None),
    ("Kaikoura", "NZ", None),
    ("San Ignacio", "MX", None),
    ("La Jolla", "US", "California"),
    ("Ano Nuevo", "US", "California"),
    ("Piedras Blancas", "US", "California"),
    ("Volunteer Point", "FK", None),
    ("Salisbury Plain", "GS", None),
    ("St Andrews Bay", "GS", None),
    ("Donsol", "PH", None),
    ("Mafia", "TZ", None),
    ("Misali", "TZ", None),
    ("Pulau Tiga", "MY", None),
    ("Christmas Island", "CX", None),
    ("Turquoise Bay", "AU", None),

    # FAMILY
    ("Siesta Key", "US", "Florida"),
    ("Clearwater Beach", "US", "Florida"),
    ("St Pete Beach", "US", "Florida"),
    ("Coronado", "US", "California"),
    ("La Jolla Shores", "US", "California"),
    ("Carmel", "US", "California"),
    ("Hapuna", "US", "Hawaii"),
    ("Kaanapali", "US", "Hawaii"),
    ("Bournemouth", "GB", None),
    ("Brighton", "GB", None),
    ("Blackpool", "GB", None),
    ("Scheveningen", "NL", None),
    ("Sylt", "DE", None),
    ("Westerland", "DE", None),
    ("Warnemunde", "DE", None),
    ("Lloret de Mar", "ES", None),
    ("Marbella", "ES", None),
    ("Rimini", "IT", None),
    ("Forte dei Marmi", "IT", None),
    ("Lido di Jesolo", "IT", None),
    ("Cancun", "MX", None),
    ("Wildwood", "US", "New Jersey"),
    ("Rehoboth", "US", "Delaware"),
    ("Virginia Beach", "US", "Virginia"),
    ("Myrtle Beach", "US", "South Carolina"),
    ("Cape May", "US", "New Jersey"),
    ("Nags Head", "US", "North Carolina"),
    ("Daytona Beach", "US", "Florida"),
    ("Surfers Paradise", "AU", None),
    ("Cottesloe", "AU", None),
    ("Mission Beach", "US", "California"),
    ("Ocean City", "US", "Maryland"),

    # TRAVEL / DESTINATION
    ("Matira", "PF", None),
    ("Aitutaki", "CK", None),
    ("Temae", "PF", None),
    ("Paradise Beach", "GR", None),
    ("Super Paradise", "GR", None),
    ("Red Beach", "GR", None),
    ("Perissa", "GR", None),
    ("Kamari", "GR", None),
    ("Ses Salines", "ES", None),
    ("Illetes", "ES", None),
    ("Marina Piccola", "IT", None),
    ("Positano", "IT", None),
    ("Marina Grande", "IT", None),
    ("Monterosso", "IT", None),
    ("Promenade des Anglais", "FR", None),
    ("Pampelonne", "FR", None),
    ("St Jean", "BL", None),
    ("Gouverneur", "BL", None),
    ("Shoal Bay", "AI", None),
    ("Meads Bay", "AI", None),
    ("Half Moon", "AG", None),
    ("Dickenson", "AG", None),
    ("Reduit", "LC", None),
    ("Anse Chastanet", "LC", None),
    ("Tulum", "MX", None),
    ("Holbox", "MX", None),
    ("San Juan del Sur", "NI", None),
    ("Mirissa", "LK", None),
    ("Unawatuna", "LK", None),
    ("Arugam", "LK", None),
    ("Anjuna", "IN", None),
    ("Palolem", "IN", None),
    ("Calangute", "IN", None),
    ("Patong", "TH", None),
    ("Kata", "TH", None),
    ("Karon", "TH", None),
    ("Chaweng", "TH", None),
    ("Lamai", "TH", None),
    ("Ao Nang", "TH", None),
    ("Boracay", "PH", None),
    ("White Beach", "PH", None),
    ("My Khe", "VN", None),
    ("Cua Dai", "VN", None),
    ("Medano", "MX", None),
    ("Lover's Beach", "MX", None),
    ("Manuel Antonio", "CR", None),
    ("Punta del Este", "UY", None),
    ("Mar del Plata", "AR", None),
    ("Joaquina", "BR", None),
    ("Praia Mole", "BR", None),
    ("Trancoso", "BR", None),
    ("Itacare", "BR", None),
    ("Jericoacoara", "BR", None),
    ("Pipa", "BR", None),
    ("Ipanema", "BR", None),
    ("Leblon", "BR", None),
    ("Camps Bay", "ZA", None),
    ("Clifton", "ZA", None),
]

def main():
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    # Check region_subdivision exists
    # admin_level_1 is the state/province field

    out_lines = ["# Hit-list cross-check report\n",
                 "Format: `query | best slug | matched name | region | notab | views | wd?`",
                 "Misses (no good match) flagged with ❌\n"]
    misses = []
    for raw_name, country, state in CANDIDATES:
        try:
            results = match_one(cur, raw_name, country, state)
        except sqlite3.OperationalError as e:
            results = []
        if not results:
            out_lines.append(f"❌ **{raw_name}** ({country}, {state or '-'}) — NO MATCH")
            misses.append((raw_name, country, state))
            continue
        best = results[0]
        _, slug, name, notab, views, wd, region = best
        wd_flag = "✅" if wd else "—"
        out_lines.append(
            f"`{raw_name}` ({country}/{state or '-'}) → **{slug}** | {name} | {region or '-'} | n={notab:.1f} | v={views} | wd={wd_flag}"
        )
        # Also list runner-ups if competitive
        for r in results[1:]:
            _, s2, n2, nb2, v2, _, rg2 = r
            out_lines.append(f"    - alt: {s2} | {n2} | {rg2 or '-'} | n={nb2:.1f}")
    out_lines.append("\n## Misses summary")
    out_lines.append(f"Total candidates: {len(CANDIDATES)} | misses: {len(misses)}")
    for n, c, s in misses:
        out_lines.append(f"- {n} ({c}, {s or '-'})")

    Path("docs/hit-list-crosscheck.md").write_text("\n".join(out_lines), encoding="utf-8")
    print(f"Wrote docs/hit-list-crosscheck.md — {len(CANDIDATES)} candidates, {len(misses)} misses")

if __name__ == "__main__":
    main()
