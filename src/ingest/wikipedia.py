"""Ingest beach data from Wikipedia "List of beaches" articles.

Parses rendered HTML from Wikipedia's API to extract beach names,
then looks up coordinates via Wikipedia's geolocation data.
"""

import json
import os
import re
import time
import uuid
import requests
from bs4 import BeautifulSoup
from slugify import slugify
from tqdm import tqdm

WIKI_API = "https://en.wikipedia.org/w/api.php"
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")
HEADERS = {"User-Agent": "WorldBeachTour/1.0 (beach-database-project; contact@example.com)"}

# Comprehensive list of Wikipedia beach list articles
BEACH_LIST_ARTICLES = [
    # Europe
    "List of beaches in Albania", "List of beaches in Bulgaria",
    "List of beaches in Croatia", "List of beaches in Cyprus",
    "List of beaches in Denmark", "List of beaches in England",
    "List of beaches in Estonia", "List of beaches in Finland",
    "List of beaches in France", "List of beaches in Germany",
    "List of beaches in Greece", "List of beaches in Iceland",
    "List of beaches in Ireland", "List of beaches in Italy",
    "List of beaches in Latvia", "List of beaches in Lithuania",
    "List of beaches in Malta", "List of beaches in Montenegro",
    "List of beaches in the Netherlands", "List of beaches in Northern Ireland",
    "List of beaches in Norway", "List of beaches in Poland",
    "List of beaches in Portugal", "List of beaches in Romania",
    "List of beaches in Russia", "List of beaches in Scotland",
    "List of beaches in Slovenia", "List of beaches in Spain",
    "List of beaches in Sweden", "List of beaches in Turkey",
    "List of beaches in Ukraine", "List of beaches in Wales",
    # North America
    "List of beaches in Bermuda",
    "List of beaches in California", "List of beaches in Connecticut",
    "List of beaches in Delaware", "List of beaches in Florida",
    "List of beaches in Georgia (U.S. state)", "List of beaches in Hawaii",
    "List of beaches in Maine", "List of beaches in Maryland",
    "List of beaches in Massachusetts", "List of beaches in Michigan",
    "List of beaches in New Hampshire", "List of beaches in New Jersey",
    "List of beaches in New York", "List of beaches in North Carolina",
    "List of beaches in Oregon", "List of beaches in Rhode Island",
    "List of beaches in South Carolina", "List of beaches in Texas",
    "List of beaches in Virginia", "List of beaches in Washington (state)",
    "List of beaches in British Columbia", "List of beaches in Nova Scotia",
    "List of beaches in Ontario",
    "List of beaches in Mexico", "List of beaches in Cuba",
    "List of beaches in the Dominican Republic", "List of beaches in Jamaica",
    "List of beaches in Puerto Rico", "List of beaches in Costa Rica",
    "List of beaches in Panama", "List of beaches in Belize",
    "List of beaches in Honduras", "List of beaches in the Bahamas",
    "List of beaches in Barbados", "List of beaches in Trinidad and Tobago",
    "List of beaches in Aruba", "List of beaches in Curaçao",
    "List of beaches in the Cayman Islands",
    "List of beaches in the U.S. Virgin Islands",
    "List of beaches in the British Virgin Islands",
    "List of beaches in Antigua and Barbuda", "List of beaches in Saint Lucia",
    "List of beaches in Grenada", "List of beaches in Saint Kitts and Nevis",
    # South America
    "List of beaches in Argentina", "List of beaches in Brazil",
    "List of beaches in Chile", "List of beaches in Colombia",
    "List of beaches in Ecuador", "List of beaches in Peru",
    "List of beaches in Uruguay", "List of beaches in Venezuela",
    # Africa
    "List of beaches in Egypt", "List of beaches in Ghana",
    "List of beaches in Kenya", "List of beaches in Madagascar",
    "List of beaches in Mauritius", "List of beaches in Morocco",
    "List of beaches in Mozambique", "List of beaches in Nigeria",
    "List of beaches in Senegal", "List of beaches in Seychelles",
    "List of beaches in South Africa", "List of beaches in Tanzania",
    "List of beaches in Tunisia", "List of beaches in Cape Verde",
    # Asia
    "List of beaches in Bangladesh", "List of beaches in Cambodia",
    "List of beaches in China", "List of beaches in Goa",
    "List of beaches in Hong Kong", "List of beaches in India",
    "List of beaches in Indonesia", "List of beaches in Israel",
    "List of beaches in Japan", "List of beaches in Lebanon",
    "List of beaches in Malaysia", "List of beaches in the Maldives",
    "List of beaches in Myanmar", "List of beaches in Oman",
    "List of beaches in Pakistan", "List of beaches in the Philippines",
    "List of beaches in Singapore", "List of beaches in South Korea",
    "List of beaches in Sri Lanka", "List of beaches in Taiwan",
    "List of beaches in Thailand", "List of beaches in the United Arab Emirates",
    "List of beaches in Vietnam",
    # Oceania
    "List of beaches in Australia",
    "List of beaches in New South Wales", "List of beaches in Queensland",
    "List of beaches in South Australia", "List of beaches in Tasmania",
    "List of beaches in Victoria (Australia)", "List of beaches in Western Australia",
    "List of beaches in New Zealand", "List of beaches in Fiji",
    "List of beaches in Papua New Guinea", "List of beaches in Samoa",
    "List of beaches in Tonga", "List of beaches in Guam",
]

# Skip these strings when found in list items
SKIP_PATTERNS = [
    "list of", "beaches of", "beaches in", "category:", "template:", "portal:",
    "references", "external links", "see also", "further reading", "notes",
    "bibliography", "isbn", "retrieved", "archived", "cite",
    "municipality", "province", "region", "county", "district",
    "prefecture", "department", "geography", "tourism",
]

# Country code lookup
COUNTRY_MAP = {
    "Albania": "AL", "Argentina": "AR", "Aruba": "AW", "Australia": "AU",
    "Bahamas": "BS", "Bangladesh": "BD", "Barbados": "BB", "Belize": "BZ",
    "Bermuda": "BM", "Brazil": "BR", "Bulgaria": "BG", "Cambodia": "KH",
    "Cape Verde": "CV", "Cayman Islands": "KY", "Chile": "CL", "China": "CN",
    "Colombia": "CO", "Costa Rica": "CR", "Croatia": "HR", "Cuba": "CU",
    "Curaçao": "CW", "Cyprus": "CY", "Denmark": "DK",
    "Dominican Republic": "DO", "Ecuador": "EC", "Egypt": "EG",
    "England": "GB", "Estonia": "EE", "Fiji": "FJ", "Finland": "FI",
    "France": "FR", "Germany": "DE", "Ghana": "GH", "Goa": "IN",
    "Greece": "GR", "Grenada": "GD", "Guam": "GU", "Honduras": "HN",
    "Hong Kong": "HK", "Iceland": "IS", "India": "IN", "Indonesia": "ID",
    "Ireland": "IE", "Israel": "IL", "Italy": "IT", "Jamaica": "JM",
    "Japan": "JP", "Kenya": "KE", "Latvia": "LV", "Lebanon": "LB",
    "Lithuania": "LT", "Madagascar": "MG", "Malaysia": "MY",
    "Maldives": "MV", "Malta": "MT", "Mauritius": "MU", "Mexico": "MX",
    "Montenegro": "ME", "Morocco": "MA", "Mozambique": "MZ",
    "Myanmar": "MM", "Netherlands": "NL", "New South Wales": "AU",
    "New Zealand": "NZ", "Nigeria": "NG", "Northern Ireland": "GB",
    "Norway": "NO", "Oman": "OM", "Pakistan": "PK", "Panama": "PA",
    "Papua New Guinea": "PG", "Peru": "PE", "Philippines": "PH",
    "Poland": "PL", "Portugal": "PT", "Puerto Rico": "PR",
    "Queensland": "AU", "Romania": "RO", "Russia": "RU",
    "Saint Kitts and Nevis": "KN", "Saint Lucia": "LC",
    "Samoa": "WS", "Scotland": "GB", "Senegal": "SN", "Seychelles": "SC",
    "Singapore": "SG", "Slovenia": "SI", "South Africa": "ZA",
    "South Australia": "AU", "South Korea": "KR", "Spain": "ES",
    "Sri Lanka": "LK", "Sweden": "SE", "Taiwan": "TW", "Tanzania": "TZ",
    "Tasmania": "AU", "Thailand": "TH", "Tonga": "TO",
    "Trinidad and Tobago": "TT", "Tunisia": "TN", "Turkey": "TR",
    "U.S. Virgin Islands": "VI", "Ukraine": "UA",
    "United Arab Emirates": "AE", "Uruguay": "UY", "Venezuela": "VE",
    "Victoria (Australia)": "AU", "Vietnam": "VN", "Wales": "GB",
    "Western Australia": "AU", "Antigua and Barbuda": "AG",
    "British Virgin Islands": "VG",
    # US states
    "California": "US", "Connecticut": "US", "Delaware": "US",
    "Florida": "US", "Georgia (U.S. state)": "US", "Hawaii": "US",
    "Maine": "US", "Maryland": "US", "Massachusetts": "US",
    "Michigan": "US", "New Hampshire": "US", "New Jersey": "US",
    "New York": "US", "North Carolina": "US", "Oregon": "US",
    "Rhode Island": "US", "South Carolina": "US", "Texas": "US",
    "Virginia": "US", "Washington (state)": "US",
    # Canadian provinces
    "British Columbia": "CA", "Nova Scotia": "CA", "Ontario": "CA",
}


def _extract_place(title):
    match = re.search(r'List of beaches in (?:the )?(.+)', title)
    return match.group(1) if match else None


def _get_beaches_from_article(title):
    """Extract beach names from a Wikipedia article's HTML."""
    try:
        resp = requests.get(
            WIKI_API,
            params={"action": "parse", "page": title, "prop": "text", "format": "json"},
            headers=HEADERS,
            timeout=30,
        )
        if resp.status_code != 200:
            return []
        data = resp.json()
        if "error" in data:
            return []
        html = data["parse"]["text"]["*"]
    except Exception:
        return []

    soup = BeautifulSoup(html, "html.parser")

    # Remove "See also", "References", etc sections
    for heading in soup.find_all(["h2", "h3"]):
        span = heading.find("span", class_="mw-headline")
        if span and span.get_text().lower() in ("see also", "references", "external links",
                                                   "further reading", "notes", "bibliography"):
            # Remove everything after this heading until next heading
            for sibling in heading.find_next_siblings():
                if sibling.name in ("h2", "h3"):
                    break
                sibling.decompose()
            heading.decompose()

    # Extract from list items and table cells
    beach_names = set()

    # From <li> items
    for li in soup.find_all("li"):
        a = li.find("a")
        if a and a.get("href", "").startswith("/wiki/"):
            text = a.get_text().strip()
            href = a.get("href", "")
            # Skip non-content links
            if any(p in text.lower() for p in SKIP_PATTERNS):
                continue
            if any(p in href.lower() for p in ["category:", "template:", "portal:", "file:"]):
                continue
            if text and 2 < len(text) < 150:
                beach_names.add(text)

    # From table rows (some articles use tables)
    for table in soup.find_all("table", class_="wikitable"):
        for row in table.find_all("tr"):
            cells = row.find_all(["td", "th"])
            if cells:
                a = cells[0].find("a")
                if a:
                    text = a.get_text().strip()
                    if text and 2 < len(text) < 150:
                        if not any(p in text.lower() for p in SKIP_PATTERNS):
                            beach_names.add(text)

    return list(beach_names)


def _batch_get_coords(titles, batch_size=50):
    """Look up coordinates for Wikipedia article titles."""
    coords = {}

    for i in range(0, len(titles), batch_size):
        batch = titles[i:i + batch_size]
        joined = "|".join(batch)

        try:
            resp = requests.get(
                WIKI_API,
                params={
                    "action": "query",
                    "titles": joined,
                    "prop": "coordinates",
                    "format": "json",
                },
                headers=HEADERS,
                timeout=30,
            )
            if resp.status_code == 200:
                data = resp.json()
                pages = data.get("query", {}).get("pages", {})
                for pid, page in pages.items():
                    if "coordinates" in page:
                        c = page["coordinates"][0]
                        coords[page["title"]] = (c["lat"], c["lon"])
        except Exception:
            pass

        time.sleep(0.3)

    return coords


def ingest(conn):
    """Run the Wikipedia beach list ingest pipeline."""
    print("=== Wikipedia Beach Lists Ingest ===")

    os.makedirs(DATA_DIR, exist_ok=True)
    cache_path = os.path.join(DATA_DIR, "wikipedia_beaches.json")

    if os.path.exists(cache_path):
        print("  Using cached Wikipedia data")
        with open(cache_path, "r", encoding="utf-8") as f:
            all_entries = json.load(f)
    else:
        all_entries = []

        for article in tqdm(BEACH_LIST_ARTICLES, desc="Wikipedia articles"):
            place = _extract_place(article)
            cc = COUNTRY_MAP.get(place)

            names = _get_beaches_from_article(article)
            if not names:
                continue

            # Batch geocode
            name_coords = _batch_get_coords(names)

            for name in names:
                lat, lng = name_coords.get(name, (None, None))
                all_entries.append({
                    "name": name,
                    "lat": lat,
                    "lng": lng,
                    "country_code": cc,
                    "region": place,
                    "source_article": article,
                })

            time.sleep(0.5)

        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(all_entries, f)

        print(f"  Extracted {len(all_entries)} beach entries from Wikipedia")

    # Count with/without coords
    with_coords = sum(1 for e in all_entries if e.get("lat") is not None)
    print(f"  {with_coords} with coordinates, {len(all_entries) - with_coords} without")

    # Insert
    total_inserted = 0
    skipped = 0

    for entry in tqdm(all_entries, desc="Inserting"):
        name = entry.get("name")
        lat = entry.get("lat")
        lng = entry.get("lng")
        cc = entry.get("country_code")

        if not name or lat is None or lng is None:
            skipped += 1
            continue

        geojson = json.dumps({"type": "Point", "coordinates": [lng, lat]})

        slug = slugify(name) if name else f"wiki-{lat:.4f}-{lng:.4f}"
        base_slug = slug
        counter = 1
        while True:
            existing = conn.execute("SELECT 1 FROM beaches WHERE slug = ?", (slug,)).fetchone()
            if not existing:
                break
            slug = f"{base_slug}-{counter}"
            counter += 1

        beach_id = str(uuid.uuid4())
        source_id = str(uuid.uuid4())

        conn.execute(
            """INSERT INTO beaches
               (id, name, slug, geometry_geojson, centroid_lat, centroid_lng,
                country_code, water_body_type, substrate_type, source_layer)
               VALUES (?, ?, ?, ?, ?, ?, ?, 'ocean', 'unknown', 1)""",
            (beach_id, name, slug, geojson, lat, lng, cc),
        )

        conn.execute(
            """INSERT INTO beach_sources
               (id, beach_id, source_name, source_id, source_url, raw_data)
               VALUES (?, ?, 'wikipedia', ?, ?, ?)""",
            (
                source_id, beach_id, slug,
                f"https://en.wikipedia.org/wiki/{entry.get('source_article', '').replace(' ', '_')}",
                json.dumps(entry, default=str),
            ),
        )

        total_inserted += 1
        if total_inserted % 2000 == 0:
            conn.commit()

    conn.commit()
    print(f"Wikipedia ingest complete: {total_inserted} inserted, {skipped} skipped (no coords)")
    return total_inserted
