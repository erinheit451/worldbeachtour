"""Ingest beach data from GeoNames.

Downloads allCountries.zip and filters for BCH/BCHS feature codes.
"""

import csv
import io
import json
import os
import uuid
import zipfile
import requests
from slugify import slugify
from tqdm import tqdm

GEONAMES_URL = "https://download.geonames.org/export/dump/allCountries.zip"
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")

# GeoNames allCountries.txt columns (tab-separated)
COLUMNS = [
    "geonameid", "name", "asciiname", "alternatenames",
    "latitude", "longitude", "feature_class", "feature_code",
    "country_code", "cc2", "admin1_code", "admin2_code",
    "admin3_code", "admin4_code", "population", "elevation",
    "dem", "timezone", "modification_date",
]


def download_geonames(force=False):
    """Download the allCountries.zip file if not already present."""
    os.makedirs(DATA_DIR, exist_ok=True)
    zip_path = os.path.join(DATA_DIR, "allCountries.zip")

    if os.path.exists(zip_path) and not force:
        print(f"  Using cached {zip_path}")
        return zip_path

    print("  Downloading allCountries.zip (~1.5GB, this will take a while)...")
    resp = requests.get(GEONAMES_URL, stream=True, timeout=600)
    resp.raise_for_status()

    total = int(resp.headers.get("content-length", 0))
    with open(zip_path, "wb") as f:
        with tqdm(total=total, unit="B", unit_scale=True, desc="GeoNames") as pbar:
            for chunk in resp.iter_content(chunk_size=1024 * 1024):
                f.write(chunk)
                pbar.update(len(chunk))

    return zip_path


def _parse_beaches(zip_path):
    """Stream through allCountries.txt and yield beach records."""
    with zipfile.ZipFile(zip_path, "r") as zf:
        with zf.open("allCountries.txt") as f:
            reader = io.TextIOWrapper(f, encoding="utf-8")
            for line in reader:
                parts = line.strip().split("\t")
                if len(parts) < 19:
                    continue
                row = dict(zip(COLUMNS, parts))
                if row["feature_code"] in ("BCH", "BCHS"):
                    yield row


def _make_slug(name, lat, lng):
    if name:
        base = slugify(name)
    else:
        base = f"beach-{float(lat):.4f}-{float(lng):.4f}"
    return base


def ingest(conn):
    """Run the GeoNames ingest pipeline."""
    print("=== GeoNames Beach Ingest ===")

    zip_path = download_geonames()

    total_inserted = 0
    batch = []

    for row in tqdm(_parse_beaches(zip_path), desc="Parsing beaches"):
        lat = float(row["latitude"])
        lng = float(row["longitude"])
        name = row["name"] if row["name"] else None

        geojson = json.dumps({
            "type": "Point",
            "coordinates": [lng, lat]
        })

        slug = _make_slug(name, lat, lng)
        base_slug = slug
        counter = 1
        while True:
            existing = conn.execute(
                "SELECT 1 FROM beaches WHERE slug = ?", (slug,)
            ).fetchone()
            if not existing:
                break
            slug = f"{base_slug}-{counter}"
            counter += 1

        beach_id = str(uuid.uuid4())
        source_id = str(uuid.uuid4())

        conn.execute(
            """INSERT INTO beaches
               (id, name, slug, geometry_geojson, centroid_lat, centroid_lng,
                country_code, admin_level_1, admin_level_2,
                water_body_type, substrate_type, source_layer)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ocean', 'unknown', 1)""",
            (
                beach_id, name, slug, geojson, lat, lng,
                row["country_code"] if row["country_code"] else None,
                row["admin1_code"] if row["admin1_code"] else None,
                row["admin2_code"] if row["admin2_code"] else None,
            ),
        )

        alt_names = row.get("alternatenames", "")
        raw = {
            "geonameid": row["geonameid"],
            "asciiname": row["asciiname"],
            "alternatenames": alt_names,
            "timezone": row["timezone"],
            "feature_code": row["feature_code"],
        }

        conn.execute(
            """INSERT INTO beach_sources
               (id, beach_id, source_name, source_id, source_url, raw_data)
               VALUES (?, ?, 'geonames', ?, ?, ?)""",
            (
                source_id, beach_id, row["geonameid"],
                f"https://www.geonames.org/{row['geonameid']}",
                json.dumps(raw),
            ),
        )

        total_inserted += 1
        if total_inserted % 5000 == 0:
            conn.commit()

    conn.commit()
    print(f"GeoNames ingest complete: {total_inserted} beaches inserted")
    return total_inserted
