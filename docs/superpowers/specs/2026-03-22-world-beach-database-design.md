# World Beach Database — Design Spec

## Vision
A comprehensive database of every beach on Earth — ocean, lake, and river — that serves as the foundation for dynamically personalized web experiences. The page reshapes itself based on user intent: travel, surfing, environmental research, family planning, etc.

## Layer 1 (Current Build): Named/Documented Beaches
Merge all major open datasets into a single deduplicated database of 50-70K named beaches worldwide.

### Sources (priority order)
1. **OSM Overpass** — ~49K named, ~242K total features (`natural=beach` + `leisure=beach_resort`)
2. **GeoNames** — ~20-40K beach entries (BCH/BCHS feature codes), points only
3. **EU Bathing Water Directive** — ~22K sites (15K coastal + 7K inland), rich water quality
4. **EPA BEACON** — ~6K US beaches with water quality monitoring
5. **Wikidata** — ~10-20K with Wikipedia links, images, multilingual names
6. **Blue Flag** — ~4.3K certified beaches

### Schema

**`beaches` table:**
- `id` TEXT PRIMARY KEY (UUID)
- `name` TEXT (nullable — unnamed beaches exist)
- `slug` TEXT UNIQUE
- `geometry` BLOB (SpatiaLite geometry — polygon preferred, point fallback)
- `centroid_lat` REAL
- `centroid_lng` REAL
- `country_code` TEXT (ISO 3166-1 alpha-2)
- `admin_level_1` TEXT (state/province)
- `admin_level_2` TEXT (county/municipality)
- `water_body_type` TEXT — ocean | sea | lake | river | reservoir
- `substrate_type` TEXT — sand | gravel | pebble | rock | mixed | unknown
- `beach_length_m` REAL (nullable, derived from geometry)
- `source_layer` INTEGER (1, 2, or 3)
- `created_at` TEXT
- `updated_at` TEXT

**`beach_sources` table:**
- `id` TEXT PRIMARY KEY
- `beach_id` TEXT FK → beaches
- `source_name` TEXT (osm | geonames | eu_bathing | epa_beacon | wikidata | blue_flag)
- `source_id` TEXT (original ID in source system)
- `source_url` TEXT
- `raw_data` TEXT (JSON blob of original record)
- `ingested_at` TEXT

**`beach_attributes` table:**
- `id` TEXT PRIMARY KEY
- `beach_id` TEXT FK → beaches
- `category` TEXT — facilities | water_conditions | surfing | environment | travel | safety | social
- `key` TEXT
- `value` TEXT
- `value_type` TEXT — string | number | boolean | json
- `source_id` TEXT FK → beach_sources
- `last_updated` TEXT

**Indexes:** spatial index on geometry, btree on country_code, category+key, beach_id on all child tables.

### Deduplication
Spatial proximity (<500m between centroids) + fuzzy name matching (Levenshtein ratio >0.8). OSM geometry wins for shape; richest attributes merge from all sources.

### Tech Stack
Python 3.11+, SQLite + SpatiaLite, requests, osmium/Overpass API, shapely, geopandas, rapidfuzz.

### Deliverables
- SQLite+SpatiaLite database file
- GeoJSON and JSON export capability
- Idempotent ingest scripts (re-runnable to refresh)

---

## Layer 2 (Future): Satellite Coastline Classification
Integrate existing global coastline classification datasets to identify unnamed beach segments.

### Key datasets
- **GCC Dataset (2024)** — 730K transect points at 1km spacing, classified by substrate. Free on Zenodo.
- **GCL_FCS30 (2025)** — 30m resolution global coastline classification, >85% accuracy. Free.
- **Luijendijk 2018** — Identified ~50K sandy coasts from 1.9M Landsat images.

### Approach
1. Download GCC dataset, filter for sandy/beach substrate types
2. Convert classified shoreline segments into discrete beach records (segment where sand→rock transitions)
3. Cross-reference with Layer 1 to find gaps — new unnamed beaches get geometry-based IDs
4. Optionally run CoastSat on specific regions for higher-resolution polygons

### Estimated yield
Could double coverage to 100-150K beach records, most unnamed but with accurate geometry and substrate classification.

### Tools
Google Earth Engine (free for research), CoastSat (open source Python), GDAL/OGR for raster→vector conversion.

---

## Layer 3 (Future): Inland Beaches (Lakes & Rivers)
The most novel layer — no global inland beach database exists.

### Data sources
- **EU Bathing Water Directive** — ~7,300 inland sites (already partially captured in Layer 1)
- **OSM inland beaches** — spatial filter: `natural=beach` features near `natural=water` or `waterway=*` (est. 20-40K)
- **US state park systems** — fragmented across 50 agencies, estimated 3-8K beach entries
- **Sentinel-2 satellite** — classification of sandy shoreline on lakes >100 hectares globally (~50K lakes)

### Classification definition
A contiguous area of unconsolidated sediment (sand, gravel, pebbles) along a lake or river shoreline that is:
- At least 10m in length, 2m in width above normal waterline
- Not permanently submerged
- Accessible (not fenced private land)

### Key challenges
- No institutional owner for the category
- Water level instability (reservoirs, seasonal rivers)
- Smaller features (avg 30-100m vs hundreds of meters for ocean beaches)
- Tree shadow confuses satellite classification
- 7-10x more shoreline to scan than ocean coastline
- Definition ambiguity (beach vs muddy bank)

### Phased approach
1. Aggregate EU + OSM + US state park inland beaches (~30-50K)
2. Sentinel-2 first-pass on lakes >100 hectares (candidate detection)
3. Crowdsource ground truth for validation

### Estimated yield
Phase 1: 30-50K inland beaches. Full satellite analysis: potentially 100-200K.
