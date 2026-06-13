"""Cross-check the canonical 'internationally known' beach list against the DB
and the built-content inventory, so we know — per beach — whether it needs
seeding, enrichment, basic content, or the marquee build.

Outputs docs/marquee-100.md (status table) + prints a summary.
Read-only against the main-clone DB.
"""

import sqlite3
import os
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
DB = Path("C:/Users/Roci/worldbeachtour/output/world_beaches.db")
CONTENT_DIR = REPO / "site" / "content" / "beaches"
APP_DIR = REPO / "site" / "app" / "beaches"

# Canonical internationally-known beaches. (name, country, [search keys]).
# Search keys are distinctive slug fragments; first match wins, ranked by notability.
CANDIDATES = [
    # ── Already-iconic / signature register ──
    ("Copacabana", "BR", ["copacabana"]),
    ("Ipanema", "BR", ["ipanema"]),
    ("Waikīkī", "US", ["waikiki-beach-1", "waikiki"]),
    ("Bondi Beach", "AU", ["bondi"]),
    ("Nazaré (Praia do Norte)", "PT", ["praia-do-norte"]),
    ("Banzai Pipeline", "US", ["pipeline"]),
    ("Teahupoʻo", "PF", ["teahupoo"]),
    ("Glass Beach", "US", ["glass-beach"]),
    # ── North America ──
    ("South Beach (Miami)", "US", ["south-beach", "miami"]),
    ("Venice Beach (LA)", "US", ["venice-beach"]),
    ("Santa Monica", "US", ["santa-monica"]),
    ("Daytona Beach", "US", ["daytona"]),
    ("Myrtle Beach", "US", ["myrtle"]),
    ("Virginia Beach", "US", ["virginia-beach"]),
    ("Coney Island", "US", ["coney-island"]),
    ("Malibu", "US", ["malibu"]),
    ("Zuma Beach", "US", ["zuma"]),
    ("Siesta Key", "US", ["siesta"]),
    ("Clearwater Beach", "US", ["clearwater"]),
    ("Cannon Beach", "US", ["cannon-beach"]),
    ("Lanikai Beach", "US", ["lanikai"]),
    ("Hanauma Bay", "US", ["hanauma"]),
    ("Hapuna Beach", "US", ["hapuna"]),
    ("Papakōlea (green sand)", "US", ["papakolea"]),
    ("Cancún (Playa Delfines)", "MX", ["delfines", "cancun"]),
    ("Tulum", "MX", ["tulum"]),
    ("Playa del Carmen", "MX", ["playa-del-carmen"]),
    ("Cabo (Lover's/Médano)", "MX", ["medano", "lover", "cabo"]),
    ("Acapulco", "MX", ["acapulco"]),
    ("Tofino (Long Beach)", "CA", ["tofino", "long-beach-tofino"]),
    # ── Caribbean ──
    ("Grace Bay (Turks & Caicos)", "TC", ["grace-bay"]),
    ("Seven Mile Beach (Cayman)", "KY", ["seven-mile"]),
    ("Seven Mile Beach (Negril)", "JM", ["negril"]),
    ("Eagle Beach (Aruba)", "AW", ["eagle-beach"]),
    ("Pink Sands (Harbour Island)", "BS", ["pink-sands", "harbour-island"]),
    ("Maho Beach (St Martin)", "MF", ["maho"]),
    ("Trunk Bay (St John)", "VI", ["trunk-bay"]),
    ("Shoal Bay (Anguilla)", "AI", ["shoal-bay"]),
    ("Varadero (Cuba)", "CU", ["varadero"]),
    ("The Baths (Virgin Gorda)", "VG", ["the-baths"]),
    # ── South America ──
    ("Praia do Sancho", "BR", ["sancho"]),
    ("Jericoacoara", "BR", ["jericoacoara"]),
    ("Punta del Este", "UY", ["punta-del-este"]),
    # ── Mediterranean Europe ──
    ("Pampelonne (St-Tropez)", "FR", ["pampelonne"]),
    ("Nice (Promenade)", "FR", ["nice", "promenade-des"]),
    ("Étretat", "FR", ["etretat"]),
    ("Positano (Spiaggia Grande)", "IT", ["positano"]),
    ("Capri (Marina Piccola)", "IT", ["capri", "marina-piccola"]),
    ("Cinque Terre (Monterosso)", "IT", ["monterosso"]),
    ("La Pelosa (Sardinia)", "IT", ["la-pelosa", "pelosa"]),
    ("Cala Goloritzé (Sardinia)", "IT", ["goloritze"]),
    ("Spiaggia Rosa (Budelli)", "IT", ["budelli", "spiaggia-rosa"]),
    ("Navagio (Shipwreck)", "GR", ["navagio"]),
    ("Elafonissi (Crete)", "GR", ["elafonissi"]),
    ("Balos Lagoon (Crete)", "GR", ["balos"]),
    ("Myrtos (Kefalonia)", "GR", ["myrtos", "murtos"]),
    ("Paradise/Super Paradise (Mykonos)", "GR", ["paradise-mykonos", "psarrou", "paradise"]),
    ("Red Beach (Santorini)", "GR", ["red-beach"]),
    ("Sarakiniko (Milos)", "GR", ["sarakiniko"]),
    ("Nissi Beach (Cyprus)", "CY", ["nissi"]),
    ("La Concha (San Sebastián)", "ES", ["la-concha"]),
    ("Playa de las Catedrales", "ES", ["catedrales", "catedrais"]),
    ("Praia da Marinha", "PT", ["praia-da-marinha"]),
    ("Praia do Camilo / Benagil", "PT", ["camilo", "benagil"]),
    ("Maspalomas (Gran Canaria)", "ES", ["maspalomas"]),
    # ── Northern / Atlantic Europe ──
    ("Brighton Beach", "GB", ["brighton"]),
    ("Durdle Door", "GB", ["durdle"]),
    ("Giant's Causeway", "GB", ["giant", "causeway"]),
    ("Reynisfjara (Iceland)", "IS", ["reynisfjara"]),
    ("Diamond Beach (Jökulsárlón)", "IS", ["diamond-beach", "jokulsarlon"]),
    ("Lofoten (Haukland/Uttakleiv)", "NO", ["haukland", "uttakleiv"]),
    ("Scheveningen", "NL", ["scheveningen"]),
    ("Sylt", "DE", ["sylt"]),
    # ── Africa / Indian Ocean ──
    ("Camps Bay (Cape Town)", "ZA", ["camps-bay"]),
    ("Clifton (Cape Town)", "ZA", ["clifton"]),
    ("Boulders Beach (penguins)", "ZA", ["boulders"]),
    ("Diani Beach (Kenya)", "KE", ["diani"]),
    ("Nungwi (Zanzibar)", "TZ", ["nungwi"]),
    ("Anse Source d'Argent (Seychelles)", "SC", ["anse-source", "source-d-argent"]),
    ("Anse Lazio (Seychelles)", "SC", ["anse-lazio"]),
    ("Le Morne / Flic en Flac (Mauritius)", "MU", ["le-morne", "flic-en-flac"]),
    ("Skeleton Bay (Namibia)", "NA", ["skeleton"]),
    # ── Middle East ──
    ("JBR / Jumeirah (Dubai)", "AE", ["jumeirah", "jbr"]),
    ("Saadiyat (Abu Dhabi)", "AE", ["saadiyat"]),
    # ── South Asia ──
    ("Varkala Beach", "IN", ["varkala"]),
    ("Palolem (Goa)", "IN", ["palolem"]),
    ("Calangute / Baga (Goa)", "IN", ["calangute", "baga"]),
    ("Marina Beach (Chennai)", "IN", ["marina-beach-chennai"]),
    ("Radhanagar (Andaman)", "IN", ["radhanagar"]),
    ("Cox's Bazar", "BD", ["cox-s-bazar", "cox-bazar"]),
    ("Mirissa / Unawatuna (Sri Lanka)", "LK", ["mirissa", "unawatuna"]),
    ("Maldives (Bikini Beach etc.)", "MV", ["maldiv", "bikini-beach"]),
    # ── Southeast Asia ──
    ("Maya Bay (Phi Phi Leh)", "TH", ["maya-bay", "phi-phi"]),
    ("Railay Beach", "TH", ["railay"]),
    ("Phra Nang", "TH", ["phra-nang"]),
    ("Patong (Phuket)", "TH", ["patong"]),
    ("Kata / Karon (Phuket)", "TH", ["karon", "kata-noi", "hat-kata"]),
    ("White Beach (Boracay)", "PH", ["boracay", "white-beach"]),
    ("El Nido (Palawan)", "PH", ["el-nido"]),
    ("Coron (Kayangan)", "PH", ["coron", "kayangan"]),
    ("Kuta Beach (Bali)", "ID", ["kuta"]),
    ("Seminyak (Bali)", "ID", ["seminyak"]),
    ("Nusa Dua (Bali)", "ID", ["nusa-dua"]),
    ("Padang Padang (Bali)", "ID", ["padang-padang"]),
    ("Uluwatu (Bali)", "ID", ["uluwatu"]),
    ("Sanur (Bali)", "ID", ["sanur"]),
    ("Kelingking (Nusa Penida)", "ID", ["kelingking", "nusa-penida"]),
    ("My Khe / China Beach (Da Nang)", "VN", ["my-khe", "china-beach", "gio-hai"]),
    # ── East Asia ──
    ("Haeundae (Busan)", "KR", ["haeundae"]),
    ("Jeju (Hyeopjae)", "KR", ["hyeopjae", "jeju"]),
    ("Yuigahama (Kamakura)", "JP", ["yuigahama"]),
    ("Okinawa (Emerald)", "JP", ["okinawa", "emerald"]),
    # ── Oceania / Pacific ──
    ("Manly Beach", "AU", ["manly"]),
    ("Whitehaven Beach", "AU", ["whitehaven"]),
    ("Surfers Paradise", "AU", ["surfers-paradise"]),
    ("Cottesloe", "AU", ["cottesloe"]),
    ("Cable Beach (Broome)", "AU", ["cable-beach"]),
    ("Byron Bay", "AU", ["byron"]),
    ("Noosa", "AU", ["noosa"]),
    ("Wineglass Bay", "AU", ["wineglass"]),
    ("Hyams Beach", "AU", ["hyams"]),
    ("Ninety Mile Beach (NZ)", "NZ", ["ninety-mile", "te-oneroa"]),
    ("Piha", "NZ", ["piha"]),
    ("Cathedral Cove", "NZ", ["cathedral-cove"]),
    ("Hot Water Beach", "NZ", ["hot-water"]),
    ("Matira (Bora Bora)", "PF", ["matira", "bora-bora"]),
    ("Natadola (Fiji)", "FJ", ["natadola"]),
    ("Aitutaki Lagoon", "CK", ["aitutaki"]),
    # ── Surf icons ──
    ("Jeffrey's Bay", "ZA", ["jeffrey", "j-bay"]),
    ("Mavericks", "US", ["mavericks"]),
    ("Trestles", "US", ["trestles"]),
    ("Hossegor", "FR", ["hossegor"]),
    ("Mundaka", "ES", ["mundaka"]),
    ("Supertubos (Peniche)", "PT", ["supertubos", "peniche"]),
    ("Cloudbreak (Fiji)", "FJ", ["cloudbreak"]),
    ("Bells Beach", "AU", ["bells-beach"]),
    # ── Geological / unique ──
    ("Hidden Beach (Marieta)", "MX", ["marieta", "hidden-beach"]),
    ("Pfeiffer (purple sand)", "US", ["pfeiffer"]),
    ("Bowling Ball Beach", "US", ["bowling-ball"]),
    ("Zlatni Rat", "HR", ["zlatni"]),
    # ── History ──
    ("Omaha Beach", "FR", ["omaha"]),
    ("Utah Beach", "FR", ["utah-beach"]),
    ("Juno Beach", "FR", ["juno"]),
    ("Gold Beach", "FR", ["gold-beach"]),
    ("Sword Beach", "FR", ["sword-beach"]),
    ("ANZAC Cove (Gallipoli)", "TR", ["anzac", "gallipoli"]),
    ("Iwo Jima", "JP", ["iwo-jima", "suribachi"]),
    ("Dunkirk", "FR", ["dunkirk"]),
]

# Surf/featured slugs already in code (built marquee/featured)
BESPOKE_BUILT = {
    "bondi-beach", "brighton-beach-1", "copacabana-7", "malibu", "pipeline",
    "praia-do-norte-6", "teahupoo", "waikiki-beach-1", "reynisfjara",
    "glass-beach-4", "sao-martinho-do-porto", "peniche",
}


def main():
    conn = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
    conn.row_factory = sqlite3.Row
    content = {p.name for p in CONTENT_DIR.iterdir() if p.is_dir()} if CONTENT_DIR.exists() else set()
    bespoke = {p.name for p in APP_DIR.iterdir()
               if p.is_dir() and (p / "page.tsx").exists()} if APP_DIR.exists() else set()

    def best_match(keys):
        for k in keys:
            # exact slug first
            r = conn.execute(
                "SELECT slug,name,notability_score,wikipedia_page_views_annual,wikidata_id,photo_count "
                "FROM beaches WHERE slug=?", (k,)).fetchone()
            if r:
                return dict(r)
        for k in keys:
            rows = conn.execute(
                "SELECT slug,name,notability_score,wikipedia_page_views_annual,wikidata_id,photo_count "
                "FROM beaches WHERE slug LIKE ? ORDER BY COALESCE(wikipedia_page_views_annual,0) DESC, "
                "COALESCE(notability_score,0) DESC LIMIT 1", (f"%{k}%",)).fetchall()
            if rows:
                return dict(rows[0])
        return None

    def status_of(slug):
        if slug in bespoke or slug in BESPOKE_BUILT:
            return "MARQUEE"
        if slug in content:
            return "content"
        return None

    counts = {"MARQUEE": 0, "content": 0, "ready": 0, "thin": 0, "seed": 0}
    rows_out = []
    for name, cc, keys in CANDIDATES:
        m = best_match(keys)
        if not m:
            st = "seed"
            rows_out.append((name, cc, "—", "—", st, ""))
            counts["seed"] += 1
            continue
        slug = m["slug"]
        built = status_of(slug)
        nt = m["notability_score"]
        pv = m["wikipedia_page_views_annual"]
        wd = bool(m["wikidata_id"])
        if built == "MARQUEE":
            st = "MARQUEE"
        elif built == "content":
            st = "content"
        elif wd and (nt or 0) >= 10:
            st = "ready"
        else:
            st = "thin"
        counts[st] = counts.get(st, 0) + 1
        pvs = f"{int(pv/1000)}K" if pv else "—"
        rows_out.append((name, cc, slug, pvs, st, f"nt{int(nt) if nt else 0} {'WD' if wd else ''}"))

    # markdown
    lines = ["# Marquee-100 — internationally-known beaches, build status",
             "",
             "Generated by `scripts/marquee_crosscheck.py`. Status: **MARQUEE** = bespoke "
             "LegendaryBeach page; **content** = has an MDX page (basic, not marquee); "
             "**ready** = in DB, enriched (WD + notab≥10), no page; **thin** = in DB, "
             "under-enriched; **seed** = not in DB, must be seeded.",
             "",
             f"Totals: {counts}",
             "",
             "| Beach | CC | Status | DB slug | Wiki views/yr | Signals |",
             "|---|---|---|---|---|---|"]
    for name, cc, slug, pvs, st, sig in rows_out:
        lines.append(f"| {name} | {cc} | **{st}** | `{slug}` | {pvs} | {sig} |")
    (REPO / "docs" / "marquee-100.md").write_text("\n".join(lines), encoding="utf-8")

    print("COUNTS:", counts, "  total:", len(CANDIDATES))
    print("\nBy status:")
    for target in ["seed", "thin", "ready", "content", "MARQUEE"]:
        names = [r[0] for r in rows_out if r[4] == target]
        print(f"\n{target.upper()} ({len(names)}): " + ", ".join(names))


if __name__ == "__main__":
    main()
