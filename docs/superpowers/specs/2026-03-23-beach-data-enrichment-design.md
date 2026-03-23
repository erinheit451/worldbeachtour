# Beach Data Enrichment — Design Spec

## Goal

Build the most complete beach intelligence database on Earth. 412K+ beaches, each enriched with physical facts, 12-month climate profiles, ocean conditions, safety data, ecological context, facilities, and cultural metadata. The database is the product — the website and future tools are views on top of it.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Source of truth | SQLite | 412K records with relational data; JSON files don't scale |
| Site export | JSON files for site-worthy beaches only | Next.js static build shouldn't read 412K records |
| Climate storage | JSON columns per metric category | Natural shape for frontend charts; SQLite json_extract() for queries |
| Provenance | Value + source tag | Authoritative without drowning in metadata |
| Grid deduplication | 0.1° cells (~11km) for climate data | Open-Meteo/Copernicus grids are 5-50km; no reason to fetch twice |
| Live vs static | Store monthly normals + station IDs, not daily snapshots | Normals are useful for years; daily snapshots are stale immediately |
| Priority | Universal structured data first, editorial for top beaches after | Structured data doesn't care about popularity |

## Data Classification

### Tier 1: Permanently Static (gather once)
Facts about the physical world that change on geological timescales.

### Tier 2: Climate Profiles (12-month arrays, gather once, valid for years)
Monthly normals averaged over 30+ years. Not "today's weather" but "what's July typically like here."

### Tier 3: Annual Refresh
Water quality ratings, certifications, popularity signals. Gather once, re-run yearly.

### Tier 4: Live/Dynamic (store connection info only)
Today's tide times, current wave height, live weather. Store the station ID or grid cell so a future live widget knows where to fetch — never store the snapshot.

---

## SQLite Schema

### beaches table (enriched)

```sql
CREATE TABLE beaches (
  id TEXT PRIMARY KEY,                -- UUID
  slug TEXT UNIQUE NOT NULL,
  name TEXT,
  centroid_lat REAL NOT NULL,
  centroid_lng REAL NOT NULL,
  country_code TEXT,
  admin_level_1 TEXT,                 -- state/province
  admin_level_2 TEXT,                 -- county/municipality
  admin_level_3 TEXT,                 -- city/town

  -- Physical
  water_body_type TEXT,               -- ocean, lake, river
  substrate_type TEXT,                -- sand, pebble, gravel, rock, mixed, unknown
  sand_color TEXT,                    -- white, golden, black, pink, red, gray
  coastal_type TEXT,                  -- bay, cove, lagoon, strait, open_coast, estuary
  beach_length_m REAL,
  orientation_deg REAL,               -- compass bearing the beach faces (0=N, 90=E, etc)
  orientation_label TEXT,             -- "east-facing", "southwest-facing"
  sunset_visible INTEGER,             -- 1 if orientation faces west-ish (225-315°)
  elevation_m REAL,                   -- beach elevation above sea level
  nearshore_depth_m REAL,             -- avg depth within 200m of shore (GEBCO)

  -- Nearest places
  nearest_city TEXT,
  nearest_city_distance_km REAL,
  nearest_airport_iata TEXT,
  nearest_airport_name TEXT,
  nearest_airport_distance_km REAL,

  -- Climate profiles (JSON arrays, 12 elements = Jan-Dec)
  -- Each value is a monthly average from 30-year climate normals
  climate_air_temp_high JSON,         -- [24.1, 24.5, 25.8, ...]  °C
  climate_air_temp_low JSON,          -- [18.2, 18.0, 19.1, ...]  °C
  climate_rain_mm JSON,               -- [62, 45, 38, ...]  mm/month
  climate_sun_hours JSON,             -- [180, 195, 220, ...]  hours/month
  climate_wind_speed JSON,            -- [12.3, 11.8, ...]  km/h avg
  climate_wind_direction JSON,        -- ["NE", "NE", "E", ...]  prevailing
  climate_uv_index JSON,              -- [6, 7, 9, ...]  avg daily max
  climate_humidity_pct JSON,          -- [78, 76, 72, ...]  %
  climate_cloud_cover_pct JSON,       -- [45, 42, 38, ...]  %
  climate_source TEXT,                -- "open_meteo_era5"
  climate_grid_cell TEXT,             -- "21.3_-157.8" (which cell this was fetched from)

  -- Ocean profiles (JSON arrays, 12 elements = Jan-Dec, NULL for lake/river)
  ocean_water_temp JSON,              -- [24.3, 23.8, ...]  °C SST
  ocean_wave_height_m JSON,           -- [1.2, 1.4, ...]  significant wave height avg
  ocean_wave_period_s JSON,           -- [8.5, 9.1, ...]  seconds
  ocean_swell_direction JSON,         -- ["NW", "NW", "W", ...]
  ocean_visibility_m JSON,            -- [15, 12, 18, ...]  underwater visibility estimate
  ocean_salinity_psu JSON,            -- [35.1, 35.0, ...]  practical salinity units
  ocean_chlorophyll JSON,             -- [0.3, 0.5, ...]  mg/m³ (algae indicator)
  ocean_source TEXT,                  -- "copernicus_marine"

  -- Tides (per-beach, not grid-deduplicated)
  tide_range_spring_m REAL,           -- meters, spring tide range
  tide_range_neap_m REAL,             -- meters, neap tide range
  tide_type TEXT,                     -- diurnal, semi-diurnal, mixed
  tide_source TEXT,                   -- "fes2022"
  tide_station_id TEXT,               -- nearest station for live lookups

  -- Safety
  water_quality_rating TEXT,          -- excellent, good, sufficient, poor
  water_quality_source TEXT,          -- "eu_bathing_2024", "epa_beacon_2024"
  water_quality_year INTEGER,
  blue_flag INTEGER DEFAULT 0,        -- 1 if currently certified
  blue_flag_source TEXT,
  shark_incidents_total INTEGER,      -- all-time count within 10km
  shark_incident_last_year INTEGER,   -- year of most recent
  shark_source TEXT,                  -- "gsaf"
  lifeguard INTEGER,                  -- 1=yes, 0=no, NULL=unknown
  lifeguard_source TEXT,

  -- Facilities (from OSM deep tags)
  has_parking INTEGER,
  has_restrooms INTEGER,
  has_showers INTEGER,
  has_changing_rooms INTEGER,
  wheelchair_accessible INTEGER,      -- 1=yes, 0=no, NULL=unknown
  has_food_nearby INTEGER,            -- restaurant/cafe within 500m
  camping_allowed INTEGER,
  dogs_allowed INTEGER,               -- 1=yes, 0=no, NULL=unknown
  nudism TEXT,                        -- "yes", "designated", "no", NULL
  facilities_source TEXT,             -- "osm_overpass"

  -- Ecology
  protected_area_name TEXT,           -- NULL if not in a protected area
  protected_area_type TEXT,           -- "national_park", "marine_reserve", etc
  protected_area_iucn TEXT,           -- IUCN category (Ia, Ib, II, III, IV, V, VI)
  protected_area_source TEXT,         -- "wdpa"
  unesco_site TEXT,                   -- UNESCO World Heritage site name, NULL if none
  coral_reef_distance_km REAL,        -- distance to nearest mapped reef, NULL if >50km
  seagrass_nearby INTEGER,            -- 1 if within 5km
  mangrove_nearby INTEGER,            -- 1 if within 5km
  species_observed_count INTEGER,     -- total distinct species from iNat/eBird/OBIS
  notable_species JSON,               -- ["Green sea turtle", "Humpback whale", ...]
  ecology_sources JSON,               -- ["wdpa", "inaturalist", "ebird", "obis"]

  -- Popularity & editorial signals
  wikipedia_url TEXT,
  wikipedia_page_views_annual INTEGER,
  wikidata_id TEXT,
  wikidata_sitelinks INTEGER,         -- number of language editions
  photo_count INTEGER,                -- total from Commons + Flickr
  notability_score REAL,              -- computed composite (0-100)

  -- Computed / derived
  best_months JSON,                   -- ["may", "jun", "jul", "aug", "sep"]
  swim_suitability TEXT,              -- "excellent", "good", "fair", "poor", "dangerous"

  -- Metadata
  source_layer INTEGER,               -- priority layer from dedup
  enrichment_version INTEGER DEFAULT 0,
  created_at TEXT,
  updated_at TEXT
);

-- Indexes for common queries
CREATE INDEX idx_beaches_country ON beaches(country_code);
CREATE INDEX idx_beaches_water_body ON beaches(water_body_type);
CREATE INDEX idx_beaches_substrate ON beaches(substrate_type);
CREATE INDEX idx_beaches_notability ON beaches(notability_score DESC);
CREATE INDEX idx_beaches_coords ON beaches(centroid_lat, centroid_lng);
CREATE INDEX idx_beaches_climate_grid ON beaches(climate_grid_cell);
```

### beach_sources table (unchanged from current)

```sql
CREATE TABLE beach_sources (
  id INTEGER PRIMARY KEY,
  beach_id TEXT REFERENCES beaches(id),
  source_name TEXT NOT NULL,          -- "osm", "geonames", "wikidata", etc
  source_id TEXT,                     -- external ID
  source_url TEXT,
  raw_data JSON,                      -- original payload
  fetched_at TEXT
);
```

### beach_photos table (new)

```sql
CREATE TABLE beach_photos (
  id INTEGER PRIMARY KEY,
  beach_id TEXT REFERENCES beaches(id),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  source TEXT NOT NULL,                -- "wikimedia_commons", "flickr"
  license TEXT,                        -- "CC-BY-SA-4.0", "CC-BY-2.0", etc
  author TEXT,
  title TEXT,
  width INTEGER,
  height INTEGER,
  fetched_at TEXT
);

CREATE INDEX idx_photos_beach ON beach_photos(beach_id);
```

### beach_species table (new)

```sql
CREATE TABLE beach_species (
  id INTEGER PRIMARY KEY,
  beach_id TEXT REFERENCES beaches(id),
  species_name TEXT NOT NULL,
  common_name TEXT,
  taxon_group TEXT,                    -- "bird", "fish", "mammal", "reptile", "invertebrate"
  observation_count INTEGER,
  source TEXT,                         -- "inaturalist", "ebird", "obis"
  iucn_status TEXT,                    -- "LC", "NT", "VU", "EN", "CR"
  fetched_at TEXT
);

CREATE INDEX idx_species_beach ON beach_species(beach_id);
```

### climate_grid_cells table (new — deduplication cache)

```sql
CREATE TABLE climate_grid_cells (
  cell_id TEXT PRIMARY KEY,            -- "21.3_-157.8"
  centroid_lat REAL,
  centroid_lng REAL,
  climate_air_temp_high JSON,
  climate_air_temp_low JSON,
  climate_rain_mm JSON,
  climate_sun_hours JSON,
  climate_wind_speed JSON,
  climate_wind_direction JSON,
  climate_uv_index JSON,
  climate_humidity_pct JSON,
  climate_cloud_cover_pct JSON,
  ocean_water_temp JSON,
  ocean_wave_height_m JSON,
  ocean_wave_period_s JSON,
  ocean_swell_direction JSON,
  ocean_salinity_psu JSON,
  ocean_chlorophyll JSON,
  fetched_at TEXT,
  source TEXT                          -- "open_meteo_era5 + copernicus_marine"
);
```

The pipeline fetches into `climate_grid_cells` first, then copies the relevant arrays into each beach's row based on its nearest cell. This means:
- 50-80K API fetches instead of 412K
- Each beach still has the data directly on its row for fast queries
- The grid table serves as a cache — re-run only updates cells, not all beaches

---

## Enrichment Pipeline — 5 Phases

### Phase 1: Grid-Based Climate Bulk Fetch
**Scope:** ~50-80K unique grid cells covering all 412K beaches
**Runtime estimate:** 3-5 days with respectful rate limiting
**No API keys required**

| Step | Source | What it produces |
|---|---|---|
| 1a. Compute grid cells | Local computation | Deduplicate 412K coords to ~50-80K unique 0.1° cells |
| 1b. Open-Meteo climate normals | `archive-api.open-meteo.com` | air_temp_high/low, rain, sun, wind, uv, humidity, cloud — 12-month arrays |
| 1c. Open-Meteo marine | `marine-api.open-meteo.com` | wave_height, wave_period, swell_direction — 12-month arrays (coastal cells only) |
| 1d. Copernicus Marine SST | `data.marine.copernicus.eu` | water_temp, salinity, chlorophyll — 12-month arrays (requires free registration) |
| 1e. Map cells to beaches | Local computation | Copy climate arrays from nearest cell to each beach row |
| 1f. Compute "best months" | Local computation | Composite score from temp + rain + sun + wind |

**Grid deduplication algorithm:**
```
For each beach:
  cell_id = f"{round(lat, 1)}_{round(lng, 1)}"
  assign beach to cell_id
Deduplicate: fetch only unique cell_ids
```

### Phase 2: Per-Beach Computed (No API Calls)
**Scope:** All 412K beaches
**Runtime estimate:** 1-2 hours (pure computation)

| Step | Source | What it produces |
|---|---|---|
| 2a. GADM spatial join | GADM GeoPackage (1.5GB download) | admin_level_2, admin_level_3 for 100% of beaches |
| 2b. Nearest city | GeoNames allCountries + KD-tree | nearest_city, nearest_city_distance_km |
| 2c. Nearest airport | OurAirports CSV + KD-tree | nearest_airport_iata, nearest_airport_name, nearest_airport_distance_km |
| 2d. Beach orientation | OSM polygon geometry + coastline | orientation_deg, orientation_label, sunset_visible |
| 2e. Beach length | OSM polygon geometry | beach_length_m (where polygon exists, ~25-35%) |
| 2f. Substrate heuristic | Name regex ("Sandy", "Rocky", "Pebble") | substrate_type upgrade for ~5-15K beaches |
| 2g. Swim suitability | Composite: wave_height + water_quality + tide_range | swim_suitability rating |

### Phase 3: Per-Beach Spatial Queries (Moderate API/Data Load)
**Scope:** All 412K beaches
**Runtime estimate:** 1-2 weeks

| Step | Source | What it produces |
|---|---|---|
| 3a. OSM Overpass deep tags | Overpass API (rate-limited) | facilities (parking, restrooms, showers, etc), substrate, access |
| 3b. Tidal range | FES2022 Python library (pyfes) | tide_range_spring_m, tide_range_neap_m, tide_type |
| 3c. Bathymetry | GEBCO netCDF grid (local, 7GB) | nearshore_depth_m |
| 3d. GCC substrate | Zenodo dataset (730K transects) | substrate_type upgrade to 75-85% coverage |
| 3e. Protected areas | WDPA GeoPackage (spatial intersect) | protected_area_name/type/iucn |
| 3f. Shark incidents | Global Shark Attack File CSV | shark_incidents_total, shark_incident_last_year |
| 3g. Coral/seagrass/mangrove | Allen Coral Atlas + UNEP-WCMC layers | coral_reef_distance_km, seagrass_nearby, mangrove_nearby |
| 3h. Elevation | Copernicus DEM or SRTM (local tiles) | elevation_m |
| 3i. Water quality | EU Bathing + EPA BEACON (already ingested) | water_quality_rating, water_quality_year |
| 3j. Blue Flag | Already ingested | blue_flag flag |

### Phase 4: Per-Beach Ecological (Rate-Limited APIs)
**Scope:** All 412K beaches (but many will return empty — species data is observation-dependent)
**Runtime estimate:** 2-4 weeks

| Step | Source | API Key? | What it produces |
|---|---|---|---|
| 4a. iNaturalist | iNaturalist API v1 | No | Species within 1km, observation counts |
| 4b. eBird | eBird API 2.0 | Free key | Bird species within 5km, notable/rare species |
| 4c. OBIS | OBIS API | No | Marine species within 5km |
| 4d. Aggregate species | Local computation | species_observed_count, notable_species JSON |
| 4e. IUCN status | GBIF / IUCN cross-reference | No | iucn_status per species (LC/NT/VU/EN/CR) |

### Phase 5: Popularity, Photos & Editorial (Selective)
**Scope:** Notable beaches first (~10K with Wikipedia), then expand
**Runtime estimate:** 1-2 weeks for photos/popularity, ongoing for editorial

| Step | Source | What it produces |
|---|---|---|
| 5a. Wikipedia page views | Wikimedia Pageviews API | wikipedia_page_views_annual |
| 5b. Wikidata sitelinks | Already ingested | wikidata_sitelinks count |
| 5c. Notability score | Computed: page_views + sitelinks + photo_count + source_count + blue_flag | notability_score (0-100) |
| 5d. Wikimedia Commons photos | Commons API geosearch (500m radius) | Photos with CC license, stored in beach_photos |
| 5e. Flickr CC photos | Flickr API (free key) | Photos with CC license, stored in beach_photos |
| 5f. Wikipedia extracts | Wikipedia API (exintro) | Short description for ~10K notable beaches |
| 5g. Wikidata cultural | SPARQL (filming locations, events) | Film/TV appearances, historical events |
| 5h. LLM content generation | Claude Haiku batch | Full MDX content for top 1,000-10,000 beaches |

---

## Notability Score (0-100)

Used to prioritize which beaches get editorial investment and site pages.

```
notability_score = (
  normalize(wikipedia_page_views_annual, 0, 1_000_000) * 30 +   -- 30% weight
  normalize(wikidata_sitelinks, 0, 50) * 20 +                    -- 20% weight
  normalize(photo_count, 0, 100) * 15 +                           -- 15% weight
  normalize(source_count, 1, 5) * 10 +                            -- 10% weight
  (10 if blue_flag else 0) +                                      -- 10% weight
  (10 if water_quality_rating == 'excellent' else 0) +            -- 10% weight
  normalize(species_observed_count, 0, 500) * 5                   -- 5% weight
)
```

Beaches scoring >50 get full editorial treatment. Beaches scoring >20 get photo search + Wikipedia extract. All beaches get structured data regardless of score.

---

## Site Export Pipeline

```
SQLite (412K enriched)
  → export script filters by: notability_score > threshold OR has MDX content
  → writes per-beach JSON to content-pipeline/data/beaches/
  → includes all structured data + climate profiles + photos + species
  → Next.js build reads only these exported files
```

The export script replaces the current `export_beach_json()` function. It writes a richer JSON shape:

```json
{
  "slug": "waikiki-beach-1",
  "name": "Waikīkī Beach",
  "centroid_lat": 21.274,
  "centroid_lng": -157.826,
  "country_code": "US",
  "admin_level_1": "Hawaii",
  "admin_level_2": "Honolulu County",
  "admin_level_3": "Honolulu",
  "water_body_type": "ocean",
  "substrate_type": "sand",
  "sand_color": "golden",
  "coastal_type": "bay",
  "beach_length_m": 320,
  "orientation": { "degrees": 190, "label": "south-facing", "sunset_visible": true },
  "nearest_city": { "name": "Honolulu", "distance_km": 2.1 },
  "nearest_airport": { "iata": "HNL", "name": "Daniel K. Inouye International", "distance_km": 12.4 },
  "climate": {
    "air_temp_high": { "values": [27, 27, 27, 28, 29, 30, 31, 31, 31, 30, 29, 27], "source": "open_meteo_era5" },
    "air_temp_low": { "values": [19, 19, 20, 21, 22, 23, 24, 24, 24, 23, 22, 20], "source": "open_meteo_era5" },
    "rain_mm": { "values": [62, 45, 38, 24, 18, 10, 12, 15, 20, 38, 55, 68], "source": "open_meteo_era5" },
    "sun_hours": { "values": [210, 215, 240, 255, 275, 290, 300, 295, 270, 245, 220, 205], "source": "open_meteo_era5" },
    "wind_speed_kmh": { "values": [18, 18, 20, 22, 22, 22, 22, 20, 18, 16, 16, 18], "source": "open_meteo_era5" },
    "uv_index": { "values": [8, 9, 10, 11, 12, 12, 12, 12, 11, 10, 9, 8], "source": "open_meteo_era5" },
    "best_months": ["apr", "may", "jun", "jul", "aug", "sep"]
  },
  "ocean": {
    "water_temp": { "values": [24, 24, 24, 25, 26, 27, 27, 28, 27, 27, 26, 25], "source": "copernicus_marine" },
    "wave_height_m": { "values": [1.2, 1.4, 1.1, 0.8, 0.6, 0.5, 0.5, 0.5, 0.6, 0.8, 1.0, 1.3], "source": "open_meteo_marine" },
    "wave_period_s": { "values": [12, 13, 11, 9, 8, 7, 7, 7, 8, 10, 11, 12], "source": "open_meteo_marine" }
  },
  "tides": {
    "range_spring_m": 0.7,
    "range_neap_m": 0.3,
    "type": "mixed",
    "station_id": "1612340",
    "source": "fes2022"
  },
  "safety": {
    "water_quality": { "rating": "excellent", "year": 2024, "source": "epa_beacon" },
    "blue_flag": true,
    "shark_incidents": { "total": 8, "last_year": 2019, "source": "gsaf" },
    "lifeguard": true,
    "swim_suitability": "excellent"
  },
  "facilities": {
    "parking": true,
    "restrooms": true,
    "showers": true,
    "wheelchair_accessible": true,
    "food_nearby": true,
    "dogs_allowed": false,
    "source": "osm_overpass"
  },
  "ecology": {
    "protected_area": null,
    "coral_reef_distance_km": 0.5,
    "seagrass_nearby": true,
    "species_count": 147,
    "notable_species": ["Green sea turtle", "Humpback whale", "Spinner dolphin"],
    "sources": ["inaturalist", "ebird", "obis"]
  },
  "photos": [
    { "url": "https://commons.wikimedia.org/...", "license": "CC-BY-SA-4.0", "author": "...", "source": "wikimedia_commons" }
  ],
  "popularity": {
    "wikipedia_url": "https://en.wikipedia.org/wiki/Waik%C4%ABk%C4%AB",
    "wikipedia_page_views_annual": 482000,
    "notability_score": 89.2
  },
  "sources": [
    { "source_name": "osm", "source_id": "way/218679862", "source_url": "https://www.openstreetmap.org/way/218679862" },
    { "source_name": "geonames", "source_id": "5854384", "source_url": "https://www.geonames.org/5854384" },
    { "source_name": "overture", "source_id": "91dc4d60-20cf-421d-b867-bd5f4df34ecb", "source_url": "https://overturemaps.org" }
  ]
}
```

---

## External Data Downloads Required

These are one-time downloads that live locally and don't require repeated API calls:

| Dataset | Size | What it provides |
|---|---|---|
| GADM GeoPackage | ~1.5 GB | Administrative boundaries worldwide |
| GEBCO bathymetry | ~7 GB | Ocean depth grid |
| GCC coastal transects | ~200 MB | Substrate classification for 730K transects |
| WDPA protected areas | ~1 GB | Marine/coastal reserves worldwide |
| Allen Coral Atlas | ~500 MB | Global coral reef extent |
| UNEP-WCMC seagrass | ~100 MB | Global seagrass distribution |
| Global Mangrove Watch | ~300 MB | Global mangrove extent |
| OurAirports CSV | ~10 MB | Airport locations worldwide |
| Global Shark Attack File | ~5 MB | Historical shark incidents |
| FES2022 tidal model | ~2 GB | Global tidal constituents |
| SRTM / Copernicus DEM | ~varies | Elevation tiles (download per-region) |

**Total local storage:** ~13 GB

---

## API Rate Limits & Runtime Estimates

| API | Rate Limit | Calls Needed | Estimated Runtime |
|---|---|---|---|
| Open-Meteo (climate) | 10,000/day (free) | ~80K cells | 8 days |
| Open-Meteo (marine) | 10,000/day (free) | ~50K coastal cells | 5 days |
| Copernicus Marine | Bulk download (THREDDS) | ~50K coastal cells | 2-3 days |
| Overpass API (OSM) | ~10K/day respectful | ~412K beaches (batched by bbox) | 5-7 days |
| iNaturalist API | ~100/min | ~412K beaches | 3-4 weeks |
| eBird API | ~100/min | ~412K beaches | 3-4 weeks |
| OBIS API | ~60/min | ~412K beaches | 4-5 weeks |
| Wikimedia Commons | ~200/min | ~412K beaches | 2 days |
| Flickr API | ~3600/hr | ~412K beaches | 5 days |
| Wikipedia Pageviews | ~100/s | ~10K notable | minutes |

**Total enrichment runtime:** ~6-8 weeks if run sequentially. Phases 1-3 (~3 weeks) deliver the core moat. Phases 4-5 run in parallel and can be ongoing.

---

## Pipeline Script Architecture

```
src/
  enrich/
    grid_climate.py          -- Phase 1: grid cell computation + Open-Meteo + Copernicus fetch
    computed_fields.py       -- Phase 2: GADM join, nearest city/airport, orientation, length
    osm_deep_tags.py         -- Phase 3a: Overpass facility extraction
    tidal.py                 -- Phase 3b: FES2022 tidal range
    bathymetry.py            -- Phase 3c: GEBCO depth lookup
    substrate_gcc.py         -- Phase 3d: GCC transect matching
    protected_areas.py       -- Phase 3e: WDPA spatial intersect
    shark_incidents.py       -- Phase 3f: GSAF proximity
    ecology_layers.py        -- Phase 3g: coral/seagrass/mangrove
    elevation.py             -- Phase 3h: DEM lookup
    species_inaturalist.py   -- Phase 4a: iNaturalist API
    species_ebird.py         -- Phase 4b: eBird API
    species_obis.py          -- Phase 4c: OBIS API
    species_aggregate.py     -- Phase 4d: merge + IUCN status
    popularity.py            -- Phase 5a-c: Wikipedia views + notability score
    photos.py                -- Phase 5d-e: Commons + Flickr
    wikipedia_extracts.py    -- Phase 5f: description extraction
    wikidata_cultural.py     -- Phase 5g: filming locations, events

run_enrichment.py            -- Orchestrator: runs phases in order, tracks progress, resumable
```

Each enrichment script:
- Reads from SQLite, writes back to SQLite
- Is idempotent (can re-run safely, skips already-enriched rows)
- Tracks progress in a `enrichment_log` table (script name, last beach processed, timestamp)
- Respects rate limits with exponential backoff
- Can be run independently or via the orchestrator

---

## Success Metrics

After full enrichment:

| Metric | Target |
|---|---|
| Climate profiles | 100% of beaches |
| Substrate type known | 75-85% |
| Municipality/county | 100% |
| Nearest city + airport | 100% |
| Beach orientation | 80%+ (where OSM polygon exists) |
| Tidal range | 100% coastal |
| Water temperature | 100% coastal |
| Facilities data | 30-80K beaches (where OSM has tags) |
| Protected area status | All that intersect |
| Species observations | Where data exists (varies by region) |
| Photos | 50-100K beaches with at least 1 photo |
| Water quality rating | ~28K (EU + US) |
| Notability score | 100% (computed for all) |
| Full editorial content | Top 1,000-10,000 by notability |
