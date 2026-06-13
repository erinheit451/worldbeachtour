"""Export the 20-beach template-validation sample set to the full StubData shape.

Reads the canonical DB (read-only) and emits one JSON per sample into
site/data/preview/<slug>.json — the shape `site/components/stub-beach.tsx`
consumes (climate arrays, classification, tides, sand, storm history, neighbors,
wikidata_id for the tier gate). This closes the wiring gap where the base
exporter never carried the extended field-guide fields.

DB lives only in the main clone (output/ is gitignored); default path points
there. Read-only — never writes to the DB.
"""

import json
import math
import sqlite3
from pathlib import Path

# The 20-beach validation set (template-sample-set.md), with the missing
# river-beach slug substituted per the 2026-06-13 DB check.
SAMPLE_SLUGS = [
    # T2 boundary — famous, distinct dominant lens
    "zlatni-rat", "omaha-beach-3", "marina-beach-chennai", "coney-island-beach-1",
    # T1 — known, no editorial yet
    "praia-da-marinha", "nissi-bay", "karang-bolong-beach", "daaibooi",
    "gezira-beach", "bystranda", "skjellvika-1",
    # Lake beaches
    "grote-rietplas-parelstrand", "parc-de-l-arabie",
    # T0 — named nobodies with good data
    "playa-de-cuesta-maneli", "praia-da-ilha-das-andorinhas", "elephant-beach-1",
    "playa-fluvial-de-villoria-de-orbigo",  # substitute for rio-tuerto-villaobispo-de-otero-pm (missing)
    # T0 — unnamed stubs
    "beach-18.4604--64.4327", "beach-63.4076-10.3423", "beach--20.6075-116.8042",
]

MONTHS_HINT = 12


def jarr(val):
    """Parse a JSON array column to a Python list, else None."""
    if not val:
        return None
    try:
        arr = json.loads(val)
        return arr if isinstance(arr, list) else None
    except (ValueError, TypeError):
        return None


def slugify(s):
    if not s:
        return None
    return (
        s.lower().strip()
        .replace(" ", "-").replace("/", "-").replace("'", "")
    )


_VAGUE = {"unknown", "unnamed", "none", "other", "n/a", ""}


def humanize(s):
    if not s:
        return None
    if str(s).strip().lower() in _VAGUE:
        return None
    return s.replace("_", " ").strip().capitalize()


def haversine_km(lat1, lon1, lat2, lon2):
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def find_neighbors(conn, row, limit=6, radius_deg=0.35):
    """Nearest named beaches within a small bounding box, by great-circle distance."""
    lat, lng = row["centroid_lat"], row["centroid_lng"]
    if lat is None or lng is None:
        return []
    cands = conn.execute(
        """SELECT slug, name, centroid_lat, centroid_lng, wikipedia_url
           FROM beaches
           WHERE slug != ?
             AND name IS NOT NULL AND name != ''
             AND centroid_lat BETWEEN ? AND ?
             AND centroid_lng BETWEEN ? AND ?""",
        (row["slug"], lat - radius_deg, lat + radius_deg,
         lng - radius_deg, lng + radius_deg),
    ).fetchall()
    scored = []
    for c in cands:
        d = haversine_km(lat, lng, c["centroid_lat"], c["centroid_lng"])
        scored.append((d, c))
    scored.sort(key=lambda x: x[0])
    out = []
    for d, c in scored[:limit]:
        out.append({
            "slug": c["slug"],
            "name": c["name"],
            "distance_km": round(d, 1),
            "has_wiki": bool(c["wikipedia_url"]),
        })
    return out


def build_classification(row):
    """Best-effort dual-breadcrumb classification from the columns we have.

    Only `coastal_type` is a real classifier today; substrate/water-body stand
    in for the primary/micro levels so the Type breadcrumb renders. Honest
    placeholder — refine when a real typology pipeline lands.
    """
    coastal = humanize(row["coastal_type"])
    substrate = humanize(row["substrate_type"])
    water = humanize(row["water_body_type"])
    # Prefer the real coastal classifier for the headline; substrate/water-body
    # stand in only when it's absent. "unknown" substrate never becomes a label.
    primary = coastal or substrate or water or "Beach"
    if not coastal:
        coastal = primary
    micro = water or substrate or primary
    return {
        "primary_type": primary,
        "primary_type_slug": slugify(primary),
        "coastal_type": coastal,
        "coastal_type_slug": slugify(coastal),
        "micro_type": micro,
        "micro_type_slug": slugify(micro),
    }


def precompute_distributions(conn):
    """Scan the DB once to build global + per-country distributions for the
    comparison module — the data-moat feature. Returns sorted lists so we can
    percentile-rank any beach against its peers.
    """
    glob = {"temp": [], "season": [], "length": []}
    by_country = {}
    for cc, hi, bm, length in conn.execute(
        "SELECT country_code, climate_air_temp_high, best_months, beach_length_m FROM beaches"
    ):
        d = by_country.setdefault(cc or "??", {"temp": [], "season": [], "length": []})
        h = jarr(hi)
        if h:
            peak = max(x for x in h if x is not None) if any(x is not None for x in h) else None
            if peak is not None:
                glob["temp"].append(peak)
                d["temp"].append(peak)
        b = jarr(bm)
        if b is not None:
            glob["season"].append(len(b))
            d["season"].append(len(b))
        if length is not None:
            glob["length"].append(length)
            d["length"].append(length)
    for store in [glob, *by_country.values()]:
        for k in store:
            store[k].sort()
    return {"global": glob, "country": by_country}


def pct_below(sorted_vals, v):
    """Percentile: fraction of peers strictly below v (0..100). None if too few peers."""
    import bisect
    n = len(sorted_vals)
    if n < 20 or v is None:
        return None
    return round(100 * bisect.bisect_left(sorted_vals, v) / n)


def build_comparisons(row, dist):
    """2–4 'only we can say this' comparisons from the full-DB distributions."""
    cc = row.get("country_code") or "??"
    country = dist["country"].get(cc, {"temp": [], "season": [], "length": []})
    out = []

    hi = jarr(row.get("climate_air_temp_high"))
    peak = max((x for x in hi if x is not None), default=None) if hi else None
    if peak is not None:
        p = pct_below(country["temp"], peak)
        if p is not None:
            warmer = p >= 50
            out.append({
                "metric": "Peak warmth",
                "text": (f"Warmer than {p}% of beaches in its country"
                         if warmer else f"Cooler than {100 - p}% of beaches in its country"),
                "detail": f"Peak-month high ≈ {round(peak)}°C",
            })
        pg = pct_below(dist["global"]["temp"], peak)
        if pg is not None and (pg >= 80 or pg <= 20):
            out.append({
                "metric": "Worldwide",
                "text": (f"Among the warmest {100 - pg}% of beaches on Earth"
                         if pg >= 80 else f"Among the coolest {pg}% of beaches on Earth"),
                "detail": None,
            })

    bm = jarr(row.get("best_months"))
    if bm is not None:
        p = pct_below(country["season"], len(bm))
        # Only surface season as a comparison when it's a genuine standout
        # (long); a short season is already honest in the climate chart.
        if p is not None and p >= 60:
            out.append({
                "metric": "Beach season",
                "text": f"Longer beach season than {p}% of beaches in its country",
                "detail": f"{len(bm)} comfortable month{'s' if len(bm) != 1 else ''} a year",
            })

    length = row.get("beach_length_m")
    if length is not None:
        p = pct_below(country["length"], length)
        if p is not None and p >= 70:
            out.append({
                "metric": "Size",
                "text": f"Larger than {p}% of measured beaches in its country",
                "detail": f"{round(length):,} m of shoreline",
            })
    return out


TAXON_LABEL = {
    "bird": "Birds", "mammal": "Mammals", "reptile": "Reptiles",
    "amphibian": "Amphibians", "fish": "Fish", "insect": "Insects",
    "mollusc": "Molluscs", "plant": "Plants", "fungi": "Fungi",
    "arachnid": "Arachnids", "crustacean": "Crustaceans",
    "invertebrate": "Invertebrates", "ray-finned fishes": "Fish",
    "other": "Other", "protozoan": "Protozoans",
}


def build_wildlife(conn, beach_id):
    """The 'what lives here' module from iNaturalist observations, grouped by
    taxon, most-observed first. Unique per-beach biodiversity — nobody else has it.
    """
    rows = conn.execute(
        """SELECT common_name, species_name, taxon_group, observation_count, iucn_status
           FROM beach_species WHERE beach_id = ?
           ORDER BY observation_count DESC""",
        (beach_id,),
    ).fetchall()
    if not rows:
        return None
    groups = {}
    total = 0
    for r in rows:
        r = dict(r)
        total += 1
        g = r.get("taxon_group") or "other"
        groups.setdefault(g, []).append({
            "common": r.get("common_name") or r.get("species_name"),
            "latin": r.get("species_name"),
            "obs": r.get("observation_count"),
            "iucn": r.get("iucn_status"),
        })
    ordered = sorted(groups.items(), key=lambda kv: -len(kv[1]))
    return {
        "total_species": total,
        "groups": [
            {"label": TAXON_LABEL.get(g, g.title()), "key": g,
             "count": len(items), "top": items[:8]}
            for g, items in ordered
        ],
    }


def build_photos(conn, beach_id, limit=8):
    """Top Commons photos for the beach, landscape-first, decent resolution.

    These are proximity-fetched (not curated) — we surface them honestly as
    'near here'. Prefer landscape + width >= 800 so the gallery looks intentional.
    """
    rows = conn.execute(
        """SELECT url, thumbnail_url, license, author, title, width, height
           FROM beach_photos WHERE beach_id = ?""",
        (beach_id,),
    ).fetchall()
    if not rows:
        return []

    def score(r):
        w, h = r["width"] or 0, r["height"] or 0
        landscape = 1 if w >= h and w > 0 else 0
        big = 1 if w >= 800 else 0
        return (landscape, big, w)

    ranked = sorted((dict(r) for r in rows), key=score, reverse=True)
    out = []
    seen = set()
    for r in ranked:
        if not r.get("thumbnail_url") and not r.get("url"):
            continue
        key = r.get("title")
        if key in seen:
            continue
        seen.add(key)
        out.append({
            "url": r.get("url"),
            "thumb": r.get("thumbnail_url") or r.get("url"),
            "license": r.get("license"),
            "author_html": r.get("author"),
            "title": r.get("title"),
            "width": r.get("width"),
            "height": r.get("height"),
        })
        if len(out) >= limit:
            break
    return out


def build_stub(conn, slug, dist):
    row = conn.execute("SELECT * FROM beaches WHERE slug = ?", (slug,)).fetchone()
    if not row:
        return None, "MISSING"
    row = dict(row)

    # ── Climate (12-month arrays) ───────────────────────────────────────
    climate = None
    highs = jarr(row.get("climate_air_temp_high"))
    if highs:
        water_temp = jarr(row.get("ocean_water_temp")) if isinstance(
            row.get("ocean_water_temp"), str) else None
        climate = {
            "air_temp_high": highs,
            "air_temp_low": jarr(row.get("climate_air_temp_low")) or [],
            "rain_mm": jarr(row.get("climate_rain_mm")) or [],
            "wind_speed": jarr(row.get("climate_wind_speed")),
            "sun_hours": jarr(row.get("climate_sun_hours")),
            "climate_source": row.get("climate_source"),
            "climate_type": None,
        }
        if water_temp:
            climate["water_temp_c"] = water_temp
        else:
            # water temp is 0% in the DB — flag the gap honestly; the component
            # falls back to air temp for the "beach-day window".
            climate["water_temp_source_note"] = (
                "No monthly sea-surface temperature on record for this beach; "
                "the season guide below is keyed to air temperature."
            )

    # ── Tides ───────────────────────────────────────────────────────────
    tides = None
    if row.get("tide_range_spring_m") is not None:
        tides = {
            "range_spring_m": row.get("tide_range_spring_m"),
            "range_neap_m": row.get("tide_range_neap_m"),
            "type": row.get("tide_type"),
            "source": row.get("tide_source"),
        }

    # ── Sand (predicted) ────────────────────────────────────────────────
    sand = None
    if row.get("sand_regime_label"):
        sand = {"predicted": {
            "q_pct": row.get("sand_q_pct"),
            "f_pct": row.get("sand_f_pct"),
            "l_pct": row.get("sand_l_pct"),
            "regime": row.get("sand_regime_label"),
            "regime_plain": humanize(row.get("sand_regime_label")),
            "source": row.get("sand_predicted_source"),
        }}

    # ── Storm history (IBTrACS cyclone passes) ──────────────────────────
    storm_history = None
    haz = conn.execute(
        """SELECT COUNT(*) AS n, MIN(observed_date) AS first, MAX(observed_date) AS last
           FROM beach_hazards
           WHERE beach_id = ? AND hazard_type = 'tropical_cyclone'""",
        (row["id"],),
    ).fetchone()
    if haz and haz["n"] and haz["n"] > 0:
        n = haz["n"]
        storm_history = {
            "cyclone_count_50yr": n,
            "paragraph": (
                f"{n} tropical-cyclone track{'s' if n != 1 else ''} have passed "
                f"within range of this coast in the historical record "
                f"(IBTrACS, {str(haz['first'])[:4]}–{str(haz['last'])[:4]})."
            ),
            "source": "IBTrACS v04r01 (NOAA)",
        }

    photos = build_photos(conn, row["id"])
    wildlife = build_wildlife(conn, row["id"])
    comparisons = build_comparisons(row, dist)

    # Sea & surf — fetch wave climatology (Open-Meteo Marine). Best-effort.
    waves = None
    try:
        from enrich_waves import fetch_daily, monthly_climatology, summarize
        raw = fetch_daily(row["centroid_lat"], row["centroid_lng"])
        daily = raw.get("daily")
        if daily:
            hm, hb, pm = monthly_climatology(daily)
            summ = summarize(hm, hb, pm)
            if summ:
                waves = {"height_mean_m": hm, "height_big_m": hb,
                         "period_mean_s": pm, "summary": summ,
                         "source": "Open-Meteo Marine (ERA5 Ocean reanalysis, 2023–2024)"}
    except Exception as e:
        print(f"    (waves skipped for {slug}: {e})")

    # Safety & conditions — shark history is 100% populated; depth/tide gate flex.
    safety = {}
    sharks = row.get("shark_incidents_total")
    if sharks is not None:
        safety["shark_incidents_total"] = sharks
        safety["shark_incident_last_year"] = row.get("shark_incident_last_year")
    if row.get("nearshore_depth_m") is not None:
        safety["nearshore_depth_m"] = row.get("nearshore_depth_m")
    if row.get("lifeguard") is not None:
        safety["lifeguard"] = bool(row.get("lifeguard"))
    safety = safety or None

    # Conservation
    conservation = None
    if row.get("protected_area_name"):
        conservation = {
            "name": row.get("protected_area_name"),
            "type": humanize(row.get("protected_area_type")),
            "iucn": row.get("protected_area_iucn"),
            "unesco": bool(row.get("unesco_site")) if row.get("unesco_site") else False,
        }

    # Facilities — only keys that have a recorded value (flex; mostly famous beaches)
    facilities = {}
    for db_key, out_key in [
        ("has_parking", "parking"), ("has_restrooms", "restrooms"),
        ("has_showers", "showers"), ("has_changing_rooms", "changing_rooms"),
        ("has_food_nearby", "food_nearby"), ("wheelchair_accessible", "wheelchair"),
        ("dogs_allowed", "dogs"), ("camping_allowed", "camping"), ("nudism", "nudism"),
    ]:
        v = row.get(db_key)
        if v is not None:
            facilities[out_key] = bool(v)
    facilities = facilities or None

    water_quality = None
    if row.get("water_quality_rating"):
        water_quality = {
            "rating": row.get("water_quality_rating"),
            "source": row.get("water_quality_source"),
            "year": row.get("water_quality_year"),
        }
    blue_flag = bool(row.get("blue_flag")) if row.get("blue_flag") else None

    nearest_airport = None
    if row.get("nearest_airport_iata"):
        nearest_airport = {
            "iata": row["nearest_airport_iata"],
            "name": row.get("nearest_airport_name"),
            "distance_km": row.get("nearest_airport_distance_km"),
        }

    osm = None
    # (geometry omitted in v1 preview — coastline diagram is a later flex slot)

    data = {
        "slug": row["slug"],
        "name": row["name"],
        "country_code": row["country_code"],
        "admin_level_1": row["admin_level_1"],
        "admin_level_2": row.get("admin_level_2"),
        "centroid_lat": row["centroid_lat"],
        "centroid_lng": row["centroid_lng"],
        "water_body_type": row.get("water_body_type"),
        "substrate_type": row.get("substrate_type"),
        "beach_length_m": row.get("beach_length_m"),
        "orientation_deg": row.get("orientation_deg"),
        "orientation_label": row.get("orientation_label"),
        "slope_pct": row.get("slope_pct"),
        "nearshore_depth_m": row.get("nearshore_depth_m"),
        "classification": build_classification(row),
        "nearest_city": row.get("nearest_city"),
        "nearest_city_distance_km": row.get("nearest_city_distance_km"),
        "nearest_airport": nearest_airport,
        "climate": climate,
        "tides": tides,
        "sand": sand,
        "storm_history": storm_history,
        "photos": photos or None,
        "safety": safety,
        "conservation": conservation,
        "facilities": facilities,
        "water_quality": water_quality,
        "blue_flag": blue_flag,
        "wildlife": wildlife,
        "waves": waves,
        "comparisons": comparisons or None,
        # Fields the tier gate + T1 template need:
        "wikidata_id": row.get("wikidata_id"),
        "wikidata_sitelinks": row.get("wikidata_sitelinks"),
        "wikipedia_url": row.get("wikipedia_url"),
        "wikipedia_page_views_annual": row.get("wikipedia_page_views_annual"),
        "notability_score": row.get("notability_score"),
        "data_completeness_pct": row.get("data_completeness_pct"),
        "best_months": jarr(row.get("best_months")),
        "swim_suitability": row.get("swim_suitability"),
        "intro_text": row.get("intro_text"),
    }

    # Drop keys that are entirely None/absent so the flex principle holds —
    # a missing section never renders an empty skeleton.
    data = {k: v for k, v in data.items() if v is not None}

    neighbors = find_neighbors(conn, row)
    return {"data": data, "neighbors": neighbors}, "OK"


def main():
    repo_root = Path(__file__).resolve().parents[1]
    # output/ is gitignored — DB lives in the main clone only.
    candidates = [
        repo_root / "output" / "world_beaches.db",
        Path("C:/Users/Roci/worldbeachtour/output/world_beaches.db"),
    ]
    db_path = next((p for p in candidates if p.exists()), None)
    if not db_path:
        raise SystemExit(f"DB not found in: {[str(c) for c in candidates]}")

    out_dir = repo_root / "site" / "data" / "preview"
    out_dir.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)
    conn.row_factory = sqlite3.Row

    print("Precomputing distributions for comparison module (one full-DB scan)…")
    dist = precompute_distributions(conn)
    print(f"  global peers: {len(dist['global']['temp'])} temps, "
          f"{len(dist['country'])} countries")

    manifest = []
    for slug in SAMPLE_SLUGS:
        bundle, status = build_stub(conn, slug, dist)
        if status != "OK":
            print(f"  {status:8} {slug}")
            continue
        (out_dir / f"{slug}.json").write_text(
            json.dumps(bundle, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        d = bundle["data"]
        has_wd = "wikidata_id" in d
        named = bool(d.get("name"))
        tier = "T1" if (has_wd and named) else "T0"
        manifest.append({"slug": slug, "name": d.get("name"), "tier_gate": tier,
                         "completeness": d.get("data_completeness_pct"),
                         "neighbors": len(bundle["neighbors"])})
        print(f"  OK  [{tier}] {slug:38} comp={d.get('data_completeness_pct')} "
              f"nb={len(bundle['neighbors'])} climate={'climate' in d} sand={'sand' in d}")

    (out_dir / "_manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    conn.close()
    print(f"\nDone — {len(manifest)} sample(s) -> {out_dir}")


if __name__ == "__main__":
    main()
