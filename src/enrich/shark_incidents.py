"""
Enrich beaches with shark incident data from the Global Shark Attack File (GSAF).

Primary: Downloads CSV from GitHub (geocoded version with Latitude/Longitude columns).
Fallback: Downloads official GSAF5.xls from sharkattackfile.net and approximates
          incident coordinates using country centroids.

Matches incidents to beaches within 10km radius.
"""

import csv
import io
import math
from collections import defaultdict

import requests
from tqdm import tqdm

GSAF_CSV_URL = "https://raw.githubusercontent.com/cjabradshaw/GSharkAttackData/main/data/GSAF_attackdata.csv"
GSAF_XLS_URL = "https://www.sharkattackfile.net/spreadsheets/GSAF5.xls"
MATCH_RADIUS_KM = 10
GRID_SIZE = 0.1  # ~11km grid cells for spatial indexing

# Country name → approximate centroid (lat, lng) for incident geocoding fallback
# Covers the top shark-incident countries in GSAF
COUNTRY_CENTROIDS = {
    "USA": (37.09, -95.71),
    "UNITED STATES": (37.09, -95.71),
    "AUSTRALIA": (-25.27, 133.78),
    "SOUTH AFRICA": (-30.56, 22.94),
    "BRAZIL": (-14.24, -51.93),
    "BAHAMAS": (25.03, -77.40),
    "NEW ZEALAND": (-40.90, 174.89),
    "PAPUA NEW GUINEA": (-6.31, 143.96),
    "MEXICO": (23.63, -102.55),
    "FIJI": (-17.71, 178.07),
    "PHILIPPINES": (12.88, 121.77),
    "INDONESIA": (-0.79, 113.92),
    "MOZAMBIQUE": (-18.67, 35.53),
    "TANZANIA": (-6.37, 34.89),
    "CUBA": (21.52, -77.78),
    "ARGENTINA": (-38.42, -63.62),
    "INDIA": (20.59, 78.96),
    "JAPAN": (36.20, 138.25),
    "ITALY": (41.87, 12.57),
    "IRAN": (32.43, 53.69),
    "MALDIVES": (3.20, 73.22),
    "THAILAND": (15.87, 100.99),
    "HAWAII": (20.80, -156.33),
    "FLORIDA": (27.99, -81.76),
    "CALIFORNIA": (36.78, -119.42),
    "NORTH CAROLINA": (35.63, -79.81),
    "SOUTH CAROLINA": (33.84, -81.16),
    "GULF OF MEXICO": (25.00, -90.00),
    "CARIBBEAN": (17.00, -68.00),
    "RED SEA": (22.00, 38.00),
    "REUNION": (-21.11, 55.54),
    "SEYCHELLES": (-4.68, 55.49),
    "KENYA": (-0.02, 37.91),
    "MADAGASCAR": (-18.77, 46.87),
    "CHILE": (-35.68, -71.54),
    "PERU": (-9.19, -75.02),
    "ECUADOR": (-1.83, -78.18),
    "COSTA RICA": (9.75, -83.75),
    "PANAMA": (8.54, -80.78),
    "VENEZUELA": (6.42, -66.59),
    "COLOMBIA": (4.57, -74.30),
    "GREECE": (39.07, 21.82),
    "CROATIA": (45.10, 15.20),
    "TURKEY": (38.96, 35.24),
    "EGYPT": (26.82, 30.80),
    "NIGERIA": (9.08, 8.68),
    "ANGOLA": (-11.20, 17.87),
    "SENEGAL": (14.50, -14.45),
    "GHANA": (7.95, -1.02),
    "TAIWAN": (23.70, 121.00),
    "SOLOMON ISLANDS": (-9.65, 160.16),
    "VANUATU": (-15.38, 166.96),
    "SAMOA": (-13.76, -172.10),
    "TONGA": (-21.18, -175.20),
    "MICRONESIA": (7.43, 150.55),
    "MARSHALL ISLANDS": (7.13, 171.18),
    "GUAM": (13.44, 144.79),
    "PALAU": (7.52, 134.58),
    "NEW CALEDONIA": (-20.90, 165.62),
    "FRENCH POLYNESIA": (-17.68, -149.41),
    "BERMUDA": (32.32, -64.75),
    "BARBADOS": (13.19, -59.54),
    "TRINIDAD AND TOBAGO": (10.69, -61.22),
    "HAITI": (18.97, -72.29),
    "PUERTO RICO": (18.22, -66.59),
    "DOMINICAN REPUBLIC": (18.74, -70.16),
    "JAMAICA": (18.11, -77.30),
    "CAYMAN ISLANDS": (19.31, -81.25),
    "NORFOLK ISLAND": (-29.04, 167.96),
    "LORD HOWE ISLAND": (-31.55, 159.08),
    "AZORES": (37.74, -25.67),
    "CANARY ISLANDS": (28.29, -16.63),
    "CAPE VERDE": (16.54, -23.04),
    "MAURITIUS": (-20.35, 57.55),
    "ZIMBABWE": (-19.02, 29.15),
    "SOUTH KOREA": (35.91, 127.77),
    "CHINA": (35.86, 104.20),
    "HONG KONG": (22.32, 114.17),
    "SINGAPORE": (1.35, 103.82),
    "MALAYSIA": (4.21, 108.96),
    "SRI LANKA": (7.87, 80.77),
    "BANGLADESH": (23.68, 90.36),
    "MYANMAR": (21.92, 95.96),
    "VIETNAM": (14.06, 108.28),
    "SPAIN": (40.46, -3.75),
    "PORTUGAL": (39.40, -8.22),
    "FRANCE": (46.23, 2.21),
    "UK": (55.38, -3.44),
    "UNITED KINGDOM": (55.38, -3.44),
    "IRELAND": (53.14, -7.69),
    "NORWAY": (60.47, 8.47),
    "SWEDEN": (60.13, 18.64),
    "DENMARK": (56.26, 9.50),
}


def _haversine_km(lat1, lng1, lat2, lng2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlng / 2) ** 2)
    return R * 2 * math.asin(math.sqrt(a))


def _parse_incident_row(row):
    """Parse a GSAF CSV row. Returns dict or None if unparseable."""
    # Try multiple possible column name variants
    lat_val = (
        row.get("Latitude") or row.get("latitude") or
        row.get("LAT") or row.get("lat") or ""
    )
    lng_val = (
        row.get("Longitude") or row.get("longitude") or
        row.get("LNG") or row.get("lng") or row.get("LON") or row.get("lon") or ""
    )
    year_val = (
        row.get("Year") or row.get("year") or row.get("YEAR") or "0"
    )

    try:
        lat = float(str(lat_val).strip())
        lng = float(str(lng_val).strip())
    except (ValueError, TypeError):
        return None

    try:
        year = int(str(year_val).strip())
    except (ValueError, TypeError):
        year = 0

    if lat == 0 and lng == 0:
        return None
    if not (-90 <= lat <= 90 and -180 <= lng <= 180):
        return None

    return {"lat": lat, "lng": lng, "year": year}


def _download_gsaf_csv():
    """Try to download geocoded CSV. Returns list of incident dicts or None."""
    try:
        resp = requests.get(GSAF_CSV_URL, timeout=30)
        resp.raise_for_status()
        reader = csv.DictReader(io.StringIO(resp.text))
        incidents = []
        for row in reader:
            parsed = _parse_incident_row(row)
            if parsed:
                incidents.append(parsed)
        if incidents:
            print(f"  CSV: parsed {len(incidents)} geocoded incidents")
            return incidents
        return None
    except Exception as e:
        print(f"  CSV download failed: {e}")
        return None


def _download_gsaf_xls():
    """Download official GSAF5.xls and geocode using country centroids."""
    try:
        import xlrd
    except ImportError:
        print("  xlrd not available — skipping XLS fallback")
        return []

    try:
        print(f"  Downloading GSAF5.xls from sharkattackfile.net...")
        resp = requests.get(GSAF_XLS_URL, timeout=60)
        resp.raise_for_status()

        wb = xlrd.open_workbook(file_contents=resp.content)
        ws = wb.sheet_by_index(0)
        headers = [str(ws.cell_value(0, c)).strip() for c in range(ws.ncols)]

        # Find columns
        def find_col(names):
            for name in names:
                try:
                    return headers.index(name)
                except ValueError:
                    pass
            return None

        country_idx = find_col(["Country", "COUNTRY"])
        year_idx = find_col(["Year", "YEAR"])

        if country_idx is None:
            print("  XLS: could not find Country column")
            return []

        incidents = []
        for r in range(1, ws.nrows):
            country_raw = str(ws.cell_value(r, country_idx)).strip().upper()
            if not country_raw or country_raw in ("", "NAN", "INVALID", "QUESTIONABLE"):
                continue

            # Look up centroid
            centroid = COUNTRY_CENTROIDS.get(country_raw)
            if centroid is None:
                # Try partial match for common cases like "USA (FLORIDA)"
                for key in COUNTRY_CENTROIDS:
                    if key in country_raw or country_raw.startswith(key[:4]):
                        centroid = COUNTRY_CENTROIDS[key]
                        break

            if centroid is None:
                continue

            try:
                year_raw = ws.cell_value(r, year_idx) if year_idx is not None else 0
                year = int(float(str(year_raw))) if year_raw else 0
            except (ValueError, TypeError):
                year = 0

            incidents.append({
                "lat": centroid[0],
                "lng": centroid[1],
                "year": year,
                "country": country_raw,
            })

        print(f"  XLS: parsed {len(incidents)} incidents (country-centroid geocoded)")
        return incidents

    except Exception as e:
        print(f"  XLS download/parse failed: {e}")
        return []


def _download_gsaf():
    """Download GSAF data. Tries geocoded CSV first, falls back to XLS with centroids."""
    print("Downloading GSAF shark incident data...")

    # Try geocoded CSV first
    csv_incidents = _download_gsaf_csv()
    if csv_incidents:
        return csv_incidents

    # Fall back to XLS with country centroid geocoding
    return _download_gsaf_xls()


def enrich_shark_incidents(conn, incidents=None) -> int:
    """Match shark incidents to nearest beaches. Returns count updated."""
    if incidents is None:
        incidents = _download_gsaf()

    if not incidents:
        print("No shark incidents to process")
        return 0

    # Build spatial grid of incidents
    grid = defaultdict(list)
    for inc in incidents:
        key = (round(inc["lat"] / GRID_SIZE), round(inc["lng"] / GRID_SIZE))
        grid[key].append(inc)

    # Process each beach
    rows = conn.execute(
        "SELECT id, centroid_lat, centroid_lng FROM beaches WHERE shark_incidents_total IS NULL"
    ).fetchall()

    count = 0
    for row in tqdm(rows, desc="Matching shark incidents"):
        lat, lng = row["centroid_lat"], row["centroid_lng"]
        if lat is None or lng is None:
            continue
        gx, gy = round(lat / GRID_SIZE), round(lng / GRID_SIZE)

        # Search 9-cell neighborhood
        nearby = []
        for di in (-1, 0, 1):
            for dj in (-1, 0, 1):
                nearby.extend(grid.get((gx + di, gy + dj), []))

        # Filter by actual distance
        matches = [inc for inc in nearby if _haversine_km(lat, lng, inc["lat"], inc["lng"]) <= MATCH_RADIUS_KM]

        if matches:
            total = len(matches)
            last_year = max(inc["year"] for inc in matches if inc["year"] > 0) if any(inc["year"] > 0 for inc in matches) else None
            conn.execute(
                """UPDATE beaches SET shark_incidents_total = ?, shark_incident_last_year = ?,
                   shark_source = 'gsaf', updated_at = datetime('now') WHERE id = ?""",
                (total, last_year, row["id"]),
            )
        else:
            conn.execute(
                """UPDATE beaches SET shark_incidents_total = 0,
                   shark_source = 'gsaf', updated_at = datetime('now') WHERE id = ?""",
                (row["id"],),
            )
        count += 1
        if count % 10000 == 0:
            conn.commit()

    conn.commit()
    print(f"Shark incidents: enriched {count} beaches")
    return count


if __name__ == "__main__":
    import sys
    from src.db.schema import get_connection
    from src.db.migrate_to_enriched import migrate

    db_path = sys.argv[1] if len(sys.argv) > 1 else "output/world_beaches.db"
    conn = get_connection(db_path)
    migrate(conn)
    enrich_shark_incidents(conn)
    conn.close()
