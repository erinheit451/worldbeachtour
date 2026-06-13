"""Wave-climatology enrichment via the (free, no-key) Open-Meteo Marine API.

For each beach slug, fetches ~2 years of daily wave data and aggregates to a
12-month climatology: typical wave height, big-day height (p90), dominant
period, plus a derived character (calm-swim / mixed / surf / heavy). Writes a
`waves` block into site/data/beaches/<slug>.json so the Sea-&-surf surface can
render — closing the 0%-wave-data gap that strands the surfer/safety user.

Climatology, not a forecast: keyed to coordinates, stable, ISR/static-safe.
Usage: python scripts/enrich_waves.py <slug> [<slug> ...]
"""

import json
import sys
import time
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
DATA_DIR = REPO / "site" / "data" / "beaches"
MARINE = "https://marine-api.open-meteo.com/v1/marine"
# Two recent complete years → smooths year-to-year noise without huge payloads.
START, END = "2023-01-01", "2024-12-31"


def fetch_daily(lat, lng):
    url = (f"{MARINE}?latitude={lat}&longitude={lng}"
           f"&start_date={START}&end_date={END}"
           f"&daily=wave_height_max,wave_period_max,swell_wave_height_max"
           f"&timezone=auto")
    with urllib.request.urlopen(url, timeout=60) as r:
        return json.load(r)


def monthly_climatology(daily):
    times = daily["time"]
    heights = daily.get("wave_height_max") or []
    periods = daily.get("wave_period_max") or []
    swell = daily.get("swell_wave_height_max") or []
    buckets = {m: {"h": [], "p": [], "s": []} for m in range(1, 13)}
    for i, t in enumerate(times):
        m = int(t[5:7])
        if i < len(heights) and heights[i] is not None:
            buckets[m]["h"].append(heights[i])
        if i < len(periods) and periods[i] is not None:
            buckets[m]["p"].append(periods[i])
        if i < len(swell) and swell[i] is not None:
            buckets[m]["s"].append(swell[i])

    def mean(xs):
        return round(sum(xs) / len(xs), 2) if xs else None

    def p90(xs):
        if not xs:
            return None
        s = sorted(xs)
        return round(s[min(len(s) - 1, int(0.9 * len(s)))], 2)

    height_mean = [mean(buckets[m]["h"]) for m in range(1, 13)]
    height_big = [p90(buckets[m]["h"]) for m in range(1, 13)]
    period_mean = [mean(buckets[m]["p"]) for m in range(1, 13)]
    return height_mean, height_big, period_mean


MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def summarize(height_mean, height_big, period_mean):
    valid = [(i, h) for i, h in enumerate(height_mean) if h is not None]
    if not valid:
        return None
    annual = round(sum(h for _, h in valid) / len(valid), 2)
    big_idx, big_val = max(valid, key=lambda x: x[1])
    calm_idx, calm_val = min(valid, key=lambda x: x[1])
    peak_big = max((h for h in height_big if h is not None), default=None)
    periods = [p for p in period_mean if p is not None]
    typ_period = round(sum(periods) / len(periods), 1) if periods else None

    # Character from typical annual wave height (significant wave height).
    if annual < 0.6:
        character = "Calm — gentle swimming water most of the year"
    elif annual < 1.2:
        character = "Mixed — usually swimmable, with a livelier season"
    elif annual < 2.0:
        character = "Exposed — real surf, and rip current to respect"
    else:
        character = "Heavy — a powerful, surf-driven coast"

    return {
        "annual_mean_m": annual,
        "biggest_month": MONTHS[big_idx + 1],
        "biggest_month_m": big_val,
        "calmest_month": MONTHS[calm_idx + 1],
        "calmest_month_m": calm_val,
        "peak_big_day_m": peak_big,
        "typical_period_s": typ_period,
        "character": character,
    }


def main(slugs):
    for slug in slugs:
        p = DATA_DIR / f"{slug}.json"
        if not p.exists():
            print(f"  SKIP {slug} — no data file")
            continue
        d = json.loads(p.read_text(encoding="utf-8"))
        lat, lng = d.get("centroid_lat"), d.get("centroid_lng")
        if lat is None or lng is None:
            print(f"  SKIP {slug} — no coords")
            continue
        try:
            raw = fetch_daily(lat, lng)
        except Exception as e:
            print(f"  FAIL {slug} — {e}")
            continue
        daily = raw.get("daily")
        if not daily:
            print(f"  FAIL {slug} — no daily data (inland point?)")
            continue
        hm, hb, pm = monthly_climatology(daily)
        summary = summarize(hm, hb, pm)
        if not summary:
            print(f"  FAIL {slug} — empty climatology")
            continue
        d["waves"] = {
            "height_mean_m": hm,
            "height_big_m": hb,
            "period_mean_s": pm,
            "summary": summary,
            "source": "Open-Meteo Marine (ERA5 Ocean reanalysis, 2023–2024)",
        }
        p.write_text(json.dumps(d, indent=2, ensure_ascii=False), encoding="utf-8")
        s = summary
        print(f"  OK {slug}: annual {s['annual_mean_m']}m, "
              f"biggest {s['biggest_month']} {s['biggest_month_m']}m, "
              f"period {s['typical_period_s']}s — {s['character']}")
        time.sleep(0.5)  # be polite to the free API


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: python scripts/enrich_waves.py <slug> [<slug> ...]")
        sys.exit(1)
    main(sys.argv[1:])
