# World Beach Database Enrichment Plan

## Current State (412K beaches)
- Substrate type: 12% known (88% "unknown")
- Beach length: 0%
- County/municipality: 0.8%
- Facilities: ~0%
- Tides/weather/crowd: 0%
- Photos: 1%
- Descriptions: 0%

---

## Phase 1 — Quick Wins (Week 1-2)

### OSM Overpass Deep Tag Extraction
- **Source:** Overpass API
- **Tags:** `surface=*`, `natural=sand/shingle/pebble/rock`, `beach:surface=*`, `amenity=toilets/shower/parking`, `emergency=lifeguard`, `tourism=*`, `fee=*`, `dog=*`
- **Coverage:** 30-80K beaches get substrate + facilities + popularity tags
- **Approach:** Query by country bounding box, match to existing beaches by OSM ID or proximity
- **Effort:** 2-3 days | **Priority:** HIGH

### GADM Admin Boundary Join
- **Source:** GADM (`https://gadm.org/download_world.html`) — free admin boundary polygons
- **Coverage:** 412K → 100% county/municipality
- **Approach:** Download GeoPackage (~1.5GB), spatial join beach points to admin level 2 polygons via GeoPandas `sjoin`
- **Effort:** 1-2 days | **Priority:** HIGH

### GeoJSON Polygon → Beach Length
- **Source:** Own database (OSM/Overture polygon geometries)
- **Coverage:** 80-150K beaches with polygon geometry
- **Approach:** For each polygon, compute oriented minimum bounding rectangle (Shapely), longer side = beach length
- **Effort:** 2-3 days | **Priority:** HIGH

### Nearest City/Airport
- **Source:** GeoNames cities15000 + OurAirports (`https://ourairports.com/data/`)
- **Coverage:** 412K → 100%
- **Approach:** KD-tree spatial lookup, store nearest city name + distance, nearest airport name + distance
- **Effort:** 1 day | **Priority:** HIGH

### Name-Based Substrate Heuristic
- **Source:** Own database
- **Coverage:** 5-15K beaches with names containing "Sandy", "Pebble", "Rocky", "Shingle", "Arena", "Sable", etc.
- **Approach:** Regex matching across languages
- **Effort:** 0.5 days | **Priority:** LOW

---

## Phase 2 — Major Data Joins (Week 3-4)

### GCC Dataset (Global Coastal Classification)
- **Source:** Zenodo `https://zenodo.org/records/10839491` — 730K coastal transects classified by substrate
- **Coverage:** 150-200K beaches
- **Approach:** Download GeoPackage (~2GB), KD-tree spatial join beach coords to nearest transect within 500m
- **Effort:** 3-5 days | **Priority:** HIGH — single biggest substrate coverage jump

### Wikimedia Commons Photos
- **Source:** `https://commons.wikimedia.org/w/api.php` — geosearch API
- **Coverage:** 30-60K beaches
- **Approach:** `action=query&list=geosearch&gscoord={lat}|{lon}&gsradius=500&gsnamespace=6`
- **Effort:** 3-4 days | **Priority:** HIGH

### Flickr CC Photos
- **Source:** Flickr API — free API key required
- **Coverage:** 50-100K beaches
- **Approach:** `flickr.photos.search` with lat/lon/radius, CC licenses only. Rate: 3600 req/hr
- **Effort:** 3-4 days | **Priority:** HIGH

### Wikipedia Description Extraction
- **Source:** Wikipedia API (multi-language)
- **Coverage:** 5-15K notable beaches
- **Approach:** Fetch intro extracts for beaches with Wikidata links, search by name for others
- **Effort:** 1-2 days | **Priority:** MEDIUM

### NOAA Tide Stations (US)
- **Source:** `https://api.tidesandcurrents.noaa.gov/` — free, no key
- **Coverage:** ~20K US coastal beaches
- **Approach:** Fetch station list, KD-tree match to beaches, store tidal range
- **Effort:** 2 days | **Priority:** HIGH for US

---

## Phase 3 — Climate & Marine (Week 5-8)

### Open-Meteo Climate Normals
- **Source:** `https://open-meteo.com/` — free, no API key
- **Coverage:** 412K → 100%
- **Approach:** Monthly avg temp high/low, rain days, sunshine hours per beach. 10K req/day = ~6 weeks runtime
- **Effort:** 2-3 days code + 6 weeks runtime | **Priority:** HIGH

### Copernicus Sea Surface Temperature
- **Source:** `https://data.marine.copernicus.eu/` — free registration
- **Coverage:** 350K coastal beaches
- **Approach:** Download monthly SST NetCDF, extract nearest grid cell per beach
- **Effort:** 3-4 days | **Priority:** HIGH

### FES2022 Global Tidal Range
- **Source:** AVISO+ — free for research
- **Coverage:** All coastal beaches
- **Approach:** `pyfes` Python library computes tidal constituents at any lat/lon
- **Effort:** 3-4 days | **Priority:** HIGH

### Open-Meteo Wave Data
- **Source:** `https://open-meteo.com/en/docs/marine-weather-api`
- **Coverage:** All coastal beaches
- **Approach:** Historical wave height/period averages for surf/swim classification
- **Effort:** 2 days | **Priority:** MEDIUM

### Water Body Reclassification
- **Source:** Natural Earth ocean/sea/lake polygons
- **Coverage:** 412K — fixes misclassifications, adds specific sea names
- **Effort:** 1-2 days | **Priority:** MEDIUM

### Beach Orientation / Sunset Direction
- **Source:** Computed from GeoJSON geometry
- **Coverage:** 80-150K beaches with polygon geometry
- **Approach:** Compute waterfront bearing → sunset/sunrise view flags
- **Effort:** 1 day | **Priority:** MEDIUM

---

## Phase 4 — Polish & ML (Week 9+)

### Sentinel-2 Substrate ML
- **Coverage:** 100-150K remaining unknown
- **Approach:** Extract spectral values via GEE, train Random Forest on known substrates
- **Effort:** 2-3 weeks | **Priority:** MEDIUM

### LLM-Generated Descriptions
- **Coverage:** 412K → 100%
- **Approach:** Claude Haiku, ~$5-10 for all beaches. Do LAST after all enrichment.
- **Effort:** 1-2 days | **Priority:** HIGH (but last)

### Photo Density → Popularity Proxy
- **Coverage:** All beaches with photos
- **Approach:** Photo count within 500m = popularity tier
- **Effort:** 1 day | **Priority:** MEDIUM

---

## Projected Coverage

| Field | Current | After Phase 1 | After Phase 2 | After All |
|-------|---------|---------------|---------------|-----------|
| Substrate | 12% | 20% | 55-60% | 75-85% |
| Beach length | 0% | 25-35% | 25-35% | 35-40% |
| County/municipality | 0.8% | 100% | 100% | 100% |
| Facilities | ~0% | 10-15% | 10-15% | 15-20% |
| Tides | 0% | 0% | 5% (US) | 80%+ |
| Weather/climate | 0% | 0% | 0% | 100% |
| Water temperature | 0% | 0% | 0% | 85% |
| Photos | 1% | 1% | 15-25% | 20-30% |
| Descriptions | 0% | 0% | 3-4% | 100% (LLM) |
| Nearest city | 0% | 100% | 100% | 100% |
| Nearest airport | 0% | 100% | 100% | 100% |

## Key Technical Notes
1. Use spatial indexing (KD-tree / R-tree) for all joins
2. Store provenance (`{field}_source`) and confidence for every enriched field
3. Batch by country for APIs with rate limits
4. Implement checkpoint/resume for long-running API crawls
5. Track CC licenses for all photos
6. **GCC dataset is the single highest-ROI source** not yet tapped — 730K transects, directly classifies substrate
