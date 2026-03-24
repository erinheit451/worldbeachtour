# Waikiki Beach: Data Gap Analysis

*Deep exploration of what we have, what we're missing, and what would make this the most comprehensive beach intelligence database on earth.*

---

## 1. What We Have

### Database Record (`beaches` table)

| Field | Value | Notes |
|-------|-------|-------|
| name | Waikiki Beach | Includes macron (Waikiki) |
| slug | waikiki-beach-1 | |
| centroid | 21.2741, -157.8263 | Single point, not polygon |
| country_code | US | |
| admin_level_1 | Hawaii | |
| admin_level_2 | NULL | Missing — should be "Honolulu" |
| water_body_type | ocean | Correct (Pacific) |
| substrate_type | sand | Correct but lacks nuance |
| beach_length_m | NULL | MDX says 2 miles / 3.2 km |
| nearest_city | Honolulu, 4.9 km | |
| nearest_airport | HNL, 11.4 km | |
| blue_flag | 0 | Correct — Blue Flag is not awarded in Hawaii |
| shark_incidents_total | 0 | Suspicious for a beach this size/old |
| notability_score | 0.0 | Wildly wrong — should be near maximum |
| data_completeness_pct | 12.5 | Accurate reflection of DB emptiness |
| enrichment_version | 0 | Never enriched |

### Sources

| Source | ID | URL |
|--------|-----|-----|
| OSM | way/218679862 | openstreetmap.org/way/218679862 |

One source only. No Wikipedia, Wikidata, NOAA, EPA, or any other linkage.

### Attributes (3 records)

- `facilities.access = yes`
- `water_conditions.swimming = true`
- `surfing.surfing_available = true`

Three boolean-level facts. That is the sum total of structured attribute data.

### Photos: None

### Species: None

### Climate/Ocean data: All NULL

Every single climate column (air temp, rain, sun hours, wind, UV, humidity, cloud cover) and ocean column (water temp, wave height, wave period, swell direction, salinity, chlorophyll) is NULL. The `climate_grid_cell` field is also NULL, meaning Waikiki has not been linked to the climate grid.

### MDX Content (8 lenses)

This is where the real data lives — in unstructured prose. The content is genuinely excellent and contains hundreds of data points that are NOT in the database:

| Lens | Key data buried in prose |
|------|--------------------------|
| **overview.mdx** | Beach length (2 mi), water temp (75-80F), annual visitors (~4.5M), beach sections (6 named), orientation (south-facing), swell season (Apr-Oct), visibility (15-50 ft) |
| **surf.mdx** | 6 named breaks (Canoes, Queens, Pops, Threes, Kaisers, Walls), wave heights by break, swell direction (SSW-SSE), swell season, tide pattern (mixed semidiurnal, ~2ft range), wind (NE trades 10-20kt), surf lesson prices ($80-250), board rental prices ($20-40/hr) |
| **history.mdx** | Name etymology, ancient significance, royal era, Moana Hotel (1901), Ala Wai Canal (1921-28), Duke Kahanamoku, Royal Hawaiian (1927), WWII, jet age (1959), modern stats (30K hotel rooms, 72K visitors/day, $2B annual spend) |
| **sand.mdx** | Sand composition (calcium carbonate, biogenic), grain size (0.25-0.5mm), color (white-tan), sand budget dynamics, erosion causes, replenishment history (1920s, 2012: 24K cu yd, 2022: 20K cu yd), cost ($50-150/cu yd), geological context |
| **environment.mdx** | Reef type (fringing), reef status (degraded but recovering), coral species (3 named), water quality issues (Ala Wai), endangered species (honu, monk seal, humpback), sunscreen ban (Act 104, 2021), enterococci monitoring |
| **family.mdx** | Lifeguard coverage (daily, multiple towers), nearshore depth (2-4 ft), Kuhio Beach features, Kahanamoku Lagoon, kids' surf lessons, Waikiki Aquarium ($12/$5), Honolulu Zoo ($19/$11), outrigger rides ($25-35), catamaran ($30-45), jellyfish cycle (8-10 days after full moon), beach wheelchair program |
| **photography.mdx** | Golden hour times by season, best vantage points, Diamond Head trail (1.6 mi RT, 560 ft gain, $5), drone restrictions (Class B airspace), helicopter tour prices ($250-350) |
| **travel.mdx** | Airport transfer options and prices, seasonal weather breakdown, hotel price tiers ($80-$500+), daily budget estimates, parking costs, bus routes, Biki bikeshare ($4.50/30min) |

**The fundamental problem:** Hundreds of structured data points exist only inside MDX prose, not in queryable database fields. The DB knows almost nothing; the content knows almost everything.

---

## 2. What's Missing

### A. Physical & Geographic Data

| Gap | Priority | Type | Data Source |
|-----|----------|------|-------------|
| Beach length in meters | HIGH | Universal | Computed from OSM polygon geometry; MDX says 2 miles (3,219m) |
| Beach width (average and range) | HIGH | Universal | Satellite imagery measurement, USGS coastal surveys |
| Beach area (sq meters) | MEDIUM | Universal | Computed from polygon |
| Full polygon geometry | HIGH | Universal | Already in OSM (way/218679862) — need to store/use it |
| Beach sections as sub-entities | HIGH | Notable | Kahanamoku, Fort DeRussy, Gray's, Royal Hawaiian, Kuhio, Queen's Surf — each has different character, crowds, facilities |
| Sand color | HIGH | Universal | "White to tan" — in MDX but not in DB `sand_color` column |
| Sand composition detail | MEDIUM | Notable | Calcium carbonate, biogenic, coralline algae, foram, coral fragments, sea urchin spine — in MDX but not structured |
| Sand grain size | MEDIUM | Notable | 0.25-0.5mm (medium) — in MDX but not structured |
| Sand origin (natural vs imported) | HIGH | Waikiki-specific | Majority imported — critical differentiator |
| Orientation degrees | HIGH | Universal | South-facing (~180 deg) — computable from geometry, mentioned in MDX |
| Sunset/sunrise visibility | HIGH | Universal | Sunset: YES (over Waianae Mtns to NW). Sunrise: partial (behind Diamond Head). Computable. |
| Elevation above sea level | LOW | Universal | Near zero — SRTM/DEM data |
| Nearshore depth profile | MEDIUM | Notable | Shallow reef flat (2-4ft nearshore), drops off past reef. NOAA bathymetry charts. |
| Reef distance from shore | MEDIUM | Notable | "Several hundred yards" — environment.mdx |
| Underwater topography map | LOW | Notable | NOAA hydrographic surveys, LIDAR bathymetry |
| Diamond Head proximity/visibility | HIGH | Waikiki-specific | The defining visual landmark. Distance, bearing, summit elevation (760ft) |

### B. Climate & Weather

| Gap | Priority | Type | Data Source |
|-----|----------|------|-------------|
| Monthly air temp (high/low) | HIGH | Universal | Open-Meteo ERA5, or NOAA station data (Honolulu AP). MDX: 80F winter high, 87F summer high |
| Monthly rainfall (mm) | HIGH | Universal | Open-Meteo. MDX: 3.5" Jan, 0.5" Jun |
| Monthly sunshine hours | HIGH | Universal | Open-Meteo ERA5 |
| Monthly UV index | HIGH | Universal | Open-Meteo. MDX: "regularly exceeds 11" |
| Monthly humidity | MEDIUM | Universal | Open-Meteo |
| Wind speed/direction by month | HIGH | Universal | Open-Meteo. MDX: NE trades 10-20kt |
| Trade wind reliability by month | MEDIUM | Waikiki-specific | When trades stall vs blow — affects surf quality |
| Kona wind frequency | LOW | Waikiki-specific | South winds that chop up the surf |
| Cloud cover patterns | LOW | Universal | Open-Meteo |
| Best time of day to visit by month | MEDIUM | Notable | Composite of UV, crowd, wind, light |
| Rainfall timing (brief tropical showers vs all-day) | MEDIUM | Notable | Qualitative but valuable — MDX mentions "brief and localized" |
| Hurricane risk window | LOW | Universal | June-Nov technically; last major Oahu impact rare |

### C. Ocean & Water

| Gap | Priority | Type | Data Source |
|-----|----------|------|-------------|
| Monthly water temperature | HIGH | Universal | Copernicus SST, NOAA buoy. MDX: 75-80F year-round |
| Wave height by month/season | HIGH | Universal | Open-Meteo Marine, CDIP buoys. MDX: 1-6ft surf season |
| Wave period | MEDIUM | Universal | MDX: 14-20 second periods for south swell |
| Swell direction by season | HIGH | Notable | MDX: South (Apr-Oct), flat winter, occasional NW wrap |
| Tidal range | HIGH | Universal | MDX: ~2ft, mixed semidiurnal. NOAA Honolulu tide station. |
| Tide type | HIGH | Universal | Mixed semidiurnal — in MDX |
| Tide station ID | MEDIUM | Universal | NOAA station linkage |
| Current patterns | MEDIUM | Notable | MDX: mild westward longshore current |
| Rip current locations | MEDIUM | Notable | Near Natatorium, Ala Wai channel outflow |
| Water visibility by season | MEDIUM | Notable | MDX: 15-50ft nearshore, 40-100ft offshore |
| Water color description | LOW | Notable | Turquoise over reef flat in midday — photography MDX |
| Salinity | LOW | Universal | Copernicus |
| Chlorophyll (productivity) | LOW | Universal | Copernicus |

### D. Surf Data

| Gap | Priority | Type | Data Source |
|-----|----------|------|-------------|
| Named surf breaks as sub-entities | HIGH | Notable | Canoes, Queens, Pops, Threes, Kaisers, Walls — ALL in MDX with detailed profiles |
| Break type per spot | HIGH | Notable | Reef break, right-hander, etc. — in MDX |
| Skill level per break | HIGH | Notable | Beginner (Canoes), intermediate (Queens), advanced (Pops/Walls) — in MDX |
| Typical crowd count per break | MEDIUM | Notable | MDX: "50-100 surfers at Canoes on summer day" |
| Surfline camera URL | MEDIUM | Notable | Referenced in MDX but not linked |
| NOAA buoy reference | MEDIUM | Notable | MDX mentions buoy 51201 |
| Surf season months | HIGH | Universal | Apr-Oct — in MDX |
| Surf school names/URLs | LOW | Notable | Hans Hedemann, Ty Gurney — in MDX |
| Board recommendation | MEDIUM | Notable | Longboard 9ft+ — in MDX |

### E. Safety

| Gap | Priority | Type | Data Source |
|-----|----------|------|-------------|
| Shark incidents (verify zero) | HIGH | Universal | GSAF says 0 — seems low for area this popular. Verify against ISAF and Hawaii DLNR data. South shore Oahu IS low-risk, but zero ever? |
| Jellyfish calendar | HIGH | Notable | Box jellyfish 8-10 days after full moon — in MDX. Computable from lunar cycle. |
| Water quality grade | HIGH | Universal | Hawaii DOH enterococci monitoring. EPA BEACON database. |
| Brown water advisory frequency | MEDIUM | Notable | How many days/year is swimming discouraged post-rain? |
| Rip current danger zones | MEDIUM | Notable | In MDX — near Natatorium, Ala Wai outflow |
| Reef injury risk areas | MEDIUM | Notable | Shallow reef at Canoes and Pops — in MDX |
| Crime/theft rate | LOW | Notable | MDX mentions car break-ins, valuables theft |
| Lifeguard tower locations | HIGH | Notable | Named in MDX: Kahanamoku, Fort DeRussy, Kuhio — but not geolocated |
| Lifeguard hours | MEDIUM | Universal | Daily coverage — in MDX |
| Emergency services response time | LOW | Notable | Proximity to Kapiolani Medical Center |
| Sunburn time by month/skin type | MEDIUM | Universal | Computable from UV index |

### F. Ecology & Environment

| Gap | Priority | Type | Data Source |
|-----|----------|------|-------------|
| Coral species list | HIGH | Notable | 3 named in MDX (Porites lobata, Pocillopora meandrina, Montipora capitata). NOAA coral database has more. |
| Coral cover percentage | MEDIUM | Notable | UH Hawaii Institute of Marine Biology studies |
| Fish species list | HIGH | Notable | MDX names ~15 species across lenses. REEF.org survey data. |
| Sea turtle frequency | HIGH | Notable | MDX: 5-20 at Turtle Canyon. Critical visitor draw. |
| Monk seal haul-out frequency | MEDIUM | Waikiki-specific | MDX mentions occasional haul-outs. NOAA tracking data. |
| Whale season (months, viewing probability) | MEDIUM | Notable | Dec-Apr. Humpback. Visible from shore. |
| Invasive species | LOW | Notable | Algae species, ta'ape (bluestripe snapper — introduced), roi |
| Parrotfish sand production estimate | LOW | Waikiki-specific | MDX: 800 lbs/year per fish. Academic literature. |
| Reef health trend (improving/declining) | MEDIUM | Notable | "Degraded but recovering" — in MDX. UH monitoring data. |
| Protected area status | MEDIUM | Universal | DB column exists, is NULL. Check WDPA. |
| Sand nourishment history timeline | HIGH | Waikiki-specific | 1920s, 2012 (24K cu yd), 2022 (20K cu yd) — in MDX |
| Erosion rate (m/year) | HIGH | Notable | UH Coastal Geology Group, USGS |
| Sea level rise projections for this beach | MEDIUM | Notable | MDX: 1ft by mid-century, 2-3ft by 2100 |
| Ala Wai runoff impact data | MEDIUM | Waikiki-specific | Water quality monitoring, DOH data |
| Seagrass/mangrove presence | LOW | Universal | DB columns exist, are NULL. Not applicable (no seagrass/mangrove at Waikiki). Should be set to FALSE, not NULL. |

### G. Cultural & Historical

| Gap | Priority | Type | Data Source |
|-----|----------|------|-------------|
| Hawaiian name + meaning | HIGH | Notable | "Wai-kiki" = "spouting fresh water" — in MDX |
| Ancient Hawaiian significance | MEDIUM | Notable | Royal surfing ground, ali'i, battles — in MDX |
| Duke Kahanamoku connection | HIGH | Waikiki-specific | Birthplace of modern surfing — in MDX |
| Key historical dates | MEDIUM | Notable | Moana 1901, Ala Wai 1921-28, Royal Hawaiian 1927, WWII, statehood 1959 — in MDX |
| Landmark buildings/features | MEDIUM | Notable | Pink Palace, Moana Surfrider, Duke statue, banyan tree |
| UNESCO status | LOW | Universal | DB column exists, is NULL. Not UNESCO. Should be FALSE. |
| National Register listings | LOW | Waikiki-specific | Royal Hawaiian and Moana Surfrider are listed |
| Cultural events calendar | MEDIUM | Notable | Friday Hilton fireworks, Kuhio Beach hula shows (Tue/Thu/Sat), Honolulu festivals |
| Wikipedia URL | HIGH | Universal | DB column exists, is NULL. Easy to fill. |
| Wikidata ID | HIGH | Universal | DB column exists, is NULL. Easy to fill. |

### H. Practical / Visitor Information

| Gap | Priority | Type | Data Source |
|-----|----------|------|-------------|
| Parking situation + prices | HIGH | Notable | MDX: $35-55 hotel valet, $1.50/hr public. Notoriously bad. |
| Public transit routes | MEDIUM | Notable | MDX: Bus routes 2, 8, 13, 20, 23. Biki bikeshare. |
| Restroom locations (geolocated) | MEDIUM | Notable | MDX: Kapahulu groin, Kuhio Beach |
| Shower locations (geolocated) | MEDIUM | Notable | MDX: same areas |
| Beach wheelchair availability | MEDIUM | Notable | MDX: free program at Kuhio Beach lifeguard station |
| Has_parking | HIGH | Universal | DB column exists, is NULL. Answer: yes (public lots, street metered) |
| Has_restrooms | HIGH | Universal | DB column exists, is NULL. Answer: yes |
| Has_showers | HIGH | Universal | DB column exists, is NULL. Answer: yes |
| Wheelchair_accessible | HIGH | Universal | DB column exists, is NULL. Answer: yes (Kuhio Beach) |
| Has_food_nearby | HIGH | Universal | DB column exists, is NULL. Answer: obviously yes |
| Dogs_allowed | MEDIUM | Universal | DB column exists, is NULL. Answer: no (Hawaii beach dog rules) |
| Camping_allowed | LOW | Universal | DB column exists, is NULL. Answer: no |
| Nudism | LOW | Universal | DB column exists, is NULL. Answer: no |
| Beach chair/umbrella rental prices | MEDIUM | Notable | MDX: $30-50/half day |
| Alcohol rules | MEDIUM | Notable | No alcohol on Honolulu beaches (ordinance) |
| Smoking rules | LOW | Notable | Hawaii bans smoking at beaches (Act 218, 2014) |
| Drone regulations | LOW | Notable | Class B airspace, restricted — in photography MDX |

### I. Nearby Attractions (as structured data)

| Gap | Priority | Type | Data Source |
|-----|----------|------|-------------|
| Diamond Head trail | HIGH | Notable | MDX: 1.6mi RT, 560ft gain, $5 reservation. Iconic. |
| Waikiki Aquarium | MEDIUM | Notable | MDX: est. 1904, $12/$5, 60-90 min |
| Honolulu Zoo | MEDIUM | Notable | MDX: 42 acres, $19/$11 |
| Kapiolani Park | MEDIUM | Notable | Adjacent green space |
| Ala Moana Beach Park | MEDIUM | Notable | Adjacent beach, different character |
| Pearl Harbor memorial | MEDIUM | Notable | Major attraction, ~30 min away |
| International Market Place | LOW | Notable | Shopping/dining |
| Hanauma Bay | MEDIUM | Notable | Snorkeling, ~30 min drive |

### J. Economic & Social Metrics

| Gap | Priority | Type | Data Source |
|-----|----------|------|-------------|
| Annual visitor count | HIGH | Notable | MDX: ~4.5M. Hawaii Tourism Authority data. |
| Average daily visitor density | MEDIUM | Notable | MDX: ~72K visitors/day in Waikiki district |
| Hotel room count in beach zone | MEDIUM | Notable | MDX: ~30,000 hotel rooms |
| Annual tourism revenue | MEDIUM | Notable | MDX: ~$2B in Waikiki |
| Average hotel price by month | MEDIUM | Notable | Scraped from booking platforms; MDX has tiers |
| TripAdvisor rating + review count | MEDIUM | Notable | TripAdvisor API or scraping |
| Google Maps rating + review count | MEDIUM | Notable | Google Places API |
| Instagram post count (#waikiki, #waikikibeach) | LOW | Notable | Social media APIs |
| Wikipedia page views | MEDIUM | Universal | DB column exists, is NULL. Wikimedia API — trivial. |
| Crowd density by hour of day | MEDIUM | Notable | Google Popular Times data, could proxy from Google Places |
| Crowd density by month | MEDIUM | Notable | Hawaii Tourism Authority monthly arrivals |
| Beach "affordability index" | LOW | Notable | Composite: hotel + food + activity prices vs median |

### K. Dive & Snorkel Data (as structured entities)

| Gap | Priority | Type | Data Source |
|-----|----------|------|-------------|
| Dive sites as sub-entities | HIGH | Notable | Turtle Canyon, Atlantis Reef, Kewalo Pipe Reef, Sea Tiger, YO-257/San Pedro — all in MDX |
| Dive site depths | HIGH | Notable | In MDX: 15-120ft range |
| Visibility range by site | MEDIUM | Notable | In MDX: 40-100ft |
| Wreck details (Sea Tiger, YO-257) | MEDIUM | Waikiki-specific | Length, depth, sinking date — in MDX |
| Snorkel access points | MEDIUM | Notable | Queen's Surf Beach best from shore — in MDX |
| Dive operator names/prices | LOW | Notable | $130-160 two-tank, $120-180 discover scuba — in MDX |

### L. Data Science / Computed Metrics

| Gap | Priority | Type | Data Source |
|-----|----------|------|-------------|
| Notability score (fix from 0.0) | CRITICAL | Universal | Should incorporate: Wikipedia views, hotel count, visitor count, cultural significance, surf heritage. Current 0.0 is absurd — Waikiki should score near maximum. |
| Data completeness (accurate) | HIGH | Universal | Currently 12.5%. Filling NULL DB columns would raise this dramatically. |
| Best months (computed) | HIGH | Universal | DB column exists, is NULL. Composite of weather, crowd, price, surf. |
| Swim suitability score | HIGH | Universal | DB column exists, is NULL. Waikiki: excellent (calm, warm, lifeguarded). |
| "Beach personality" tags | MEDIUM | Notable | Urban, iconic, beginner-surf, family, crowded, engineered, sunset, historical |
| Similar beaches | MEDIUM | Notable | Copacabana, Bondi, South Beach Miami, Patong — comparable urban beach resort strips |
| Price index vs comparable beaches | LOW | Notable | Normalized cost comparison |
| Photo composition scores | LOW | Notable | Which angles/times produce best-rated photos |
| Walkability score | LOW | Notable | How much is accessible without a car — very high for Waikiki |
| "Instagram-ability" score | LOW | Notable | Proxy from hashtag density, photo uploads |
| Seasonal score curves | MEDIUM | Notable | Month-by-month composite quality rating |

---

## 3. Data Source Map

### Free APIs (no key needed)

| Source | Data it fills | Coverage |
|--------|--------------|----------|
| **Open-Meteo Climate API** | Air temp, rain, sun hours, wind, UV, humidity — monthly normals | 100% of beaches |
| **Open-Meteo Marine API** | Wave height, period, swell direction | All coastal |
| **NOAA Tides & Currents** | Tide range, type, station. Station 1612340 (Honolulu) | US coasts |
| **NOAA GSAF (shark data)** | Shark incident history — verify the zero | Global |
| **Wikipedia API** | Page URL, extract, page views | Notable beaches |
| **Wikidata API** | Wikidata ID, sitelink count, structured claims | Notable beaches |
| **Wikimedia Commons geosearch** | CC-licensed photos within radius | Global |
| **OSM Overpass** | Detailed tags (facilities, surface, access) | Global |
| **EPA BEACON** | Beach water quality monitoring, advisory days | US beaches |
| **NOAA Coral Reef Watch** | Bleaching alerts, SST anomalies | Tropical coasts |

### Free APIs (key required)

| Source | Data it fills | Coverage |
|--------|--------------|----------|
| **Google Places API** | Rating, review count, popular times, photos | Global notable |
| **Flickr API** | CC photos by lat/lon | Global |
| **Surfline API** (unofficial) | Live cam URLs, spot forecasts, spot IDs | Major surf beaches |
| **REEF.org fish survey data** | Species lists by geographic zone | Dive-popular sites |
| **Hawaii DOH Clean Water Branch** | Enterococci monitoring, advisory history | Hawaii beaches |

### Paid / Restricted Sources

| Source | Data it fills | Cost |
|--------|--------------|------|
| **Copernicus Marine** | SST, salinity, chlorophyll — gridded monthly | Free registration |
| **AVISO+ FES2022** | Tidal constituents at any lat/lon | Free for research |
| **Sentinel-2 via GEE** | Sand color from satellite imagery | Free (Google account) |
| **TripAdvisor Content API** | Rating, review count, ranking | Business partnership |
| **AirDNA / hotel price data** | Average nightly rate by month | Paid subscription |

### Computable from Existing Data

| Metric | Input needed |
|--------|-------------|
| Beach length | OSM polygon geometry (already have way ID) |
| Orientation + sunset flag | Polygon waterfront bearing calculation |
| Best months | Composite of temp, rain, UV, crowd, price, surf season |
| Swim suitability | Wave height, water temp, lifeguard, hazards |
| Notability score | Wikipedia views, hotel count, visitor data, cultural factors |
| Jellyfish risk by date | Lunar cycle calculation (8-10 days after full moon) |
| Sunburn time by month | UV index + skin type formula |
| Similar beaches | Feature vector distance in multi-dimensional attribute space |

### Manual / Editorial (high value, not automatable)

| Data point | Why manual |
|-----------|-----------|
| Beach section boundaries | Requires local knowledge or detailed mapping |
| Surf break locations and profiles | Requires surf knowledge — we have it in MDX |
| Cultural significance narrative | Requires research — we have it in MDX |
| Sand importation timeline | Historical records — we have it in MDX |
| Local tips (best food, parking hacks) | Requires lived experience |
| Photography vantage points | Requires photographer knowledge — we have it in MDX |

---

## 4. Priority Matrix

### CRITICAL — Fix immediately (data is wrong or absurd)

1. **Notability score = 0.0** — Waikiki Beach is one of the 10 most famous beaches on Earth. This score should be near maximum. The scoring algorithm is either broken or has never been run with real inputs.
2. **shark_incidents_total = 0** — Needs verification. South shore Oahu is genuinely low-risk, but "zero incidents ever" across all of GSAF history seems worth double-checking against Hawaii DLNR records.

### HIGH — Fill from existing MDX content (zero API calls needed)

These are data points we already KNOW from our own content but haven't structured into the database:

3. **beach_length_m** = 3219 (2 miles)
4. **sand_color** = "white"
5. **orientation_deg** = ~180, **orientation_label** = "S", **sunset_visible** = true
6. **has_parking** = true, **has_restrooms** = true, **has_showers** = true, **wheelchair_accessible** = true, **has_food_nearby** = true, **dogs_allowed** = false, **camping_allowed** = false, **nudism** = false
7. **lifeguard** = true
8. **admin_level_2** = "Honolulu"
9. **tide_type** = "mixed_semidiurnal", **tide_range_spring_m** ≈ 0.6
10. **wikipedia_url**, **wikidata_id** — trivial lookup
11. **best_months** — compute from known seasonal data
12. **swim_suitability** = "excellent"

### HIGH — Fill from free APIs (low effort, high value)

13. **Climate grid linkage** — Run Open-Meteo enrichment for this lat/lon. Fills 12+ columns.
14. **Ocean data** — Open-Meteo Marine API for wave/swell. Copernicus for SST.
15. **NOAA tide station linkage** — Station 1612340 (Honolulu Harbor)
16. **Wikipedia page views** — Single Wikimedia API call
17. **Wikimedia Commons photos** — Geosearch at this lat/lon
18. **EPA BEACON water quality** — US beach monitoring data

### MEDIUM — Would differentiate the database

19. **Beach sections as sub-entities** — No other beach database breaks Waikiki into its 6 named sections with distinct characteristics
20. **Surf breaks as structured data** — Canoes, Queens, Pops, Threes, Kaisers, Walls with skill level, wave height, bottom type
21. **Dive sites as structured data** — Turtle Canyon, Sea Tiger wreck, etc.
22. **Jellyfish risk calendar** — Computable from lunar cycle, unique and practical
23. **Sand nourishment timeline** — No other database tracks this; it's a genuine Waikiki superpower
24. **Coral species list from MDX** — Already written, just needs structuring
25. **Crowd density patterns** — Google Popular Times proxy
26. **Economic metrics** — Annual visitors, hotel rooms, revenue (from MDX + Hawaii Tourism Authority)

### LOW — Nice to have, pursue when infrastructure exists

27. Detailed bathymetry profile
28. Instagram/social metrics
29. Photography vantage points as geolocated entities
30. Dive operator directory
31. Nearby attraction sub-entities with distances and prices
32. Historical photo archive linkage
33. Real-time integration hooks (surf cam, water quality, tide)

---

## 5. The "Holy Shit" Features

What would make someone say "this site knows EVERYTHING about this beach"?

### Jellyfish Probability Calendar
Compute box jellyfish risk for any future date based on the lunar cycle (8-10 days after full moon). Show a month view: "green/yellow/red" days. No other beach site does this. The data is in our MDX. The math is trivial.

### Sand Origin Story
"73% of the sand you're standing on was imported." A visual timeline of every known sand nourishment project with volumes, sources, and costs. We have most of this in the sand MDX. No other site structures this.

### Surf Break Map with Skill Matching
"You said you're an intermediate longboarder. Go to Queens. Here's why." Interactive map with named breaks, skill levels, typical crowd counts, best tide state. All data exists in our surf MDX.

### Erosion Clock
"Waikiki loses approximately X cubic yards of sand per year. The last replenishment was in 2022." Real-time-feeling counter based on known erosion rates. Dramatic and educational.

### The 72,000 Problem
"There are 72,000 visitors in Waikiki on any given day, spread across a 2-mile beach. That's 22,500 visitors per mile. Here's when the crowd thins out." Crowd density analysis with hour-by-hour and month-by-month patterns.

### Historical Coastline Overlay
Show the 1900 coastline versus today. The beach didn't exist in its current form. The wetlands, fishponds, taro fields — all gone. We describe this transformation in the history MDX; visualizing it would be devastating.

### Duke's Wave Calculator
"Duke Kahanamoku rode this exact wave in 1917." Map the historical surf breaks to modern ones. Show what a south swell looked like 100 years ago versus today with reef degradation.

### Turtle Probability Meter
Based on known green sea turtle behavior at Turtle Canyon (5-20 per dive on typical day), time of year, and water conditions: "Your chance of seeing a sea turtle today: HIGH." Engaging and based on real ecological data.

### Sunset Quality Predictor
Waikiki faces south, but sunsets are visible to the northwest over the Waianae Mountains. Cloud cover, humidity, and aerosol data could predict sunset quality on a 1-5 scale. "Tonight's sunset forecast: 4/5 (partly cloudy, moderate humidity = vivid colors)."

### The Real Cost Counter
"A family of four will spend approximately $X today at Waikiki." Interactive calculator using our pricing data: hotel tier + meals + activities + gear rental + parking. Compare to Bondi, Copacabana, South Beach.

---

## 6. Structural Observations

### The MDX-DB Disconnect
The single biggest finding: **our MDX content is 50x richer than our database**. The content pipeline has produced genuinely excellent, data-dense prose, but almost none of it has been extracted back into structured, queryable fields. A one-time extraction pass — pulling DataCard values, named entities, prices, measurements, species, and place names from the 8 MDX files — would fill 30-40 database columns for this beach alone.

### The Sub-Entity Problem
Waikiki is not one beach. It's 6 beach sections, 6+ surf breaks, 5+ dive sites, and 3+ snorkel spots. The current schema treats it as a single point at a single lat/lon. A `beach_sub_features` table (or similar) would let us model Canoes as a surf break belonging to Waikiki, Turtle Canyon as a dive site, Kuhio Beach as a family-optimized section. This is where the database becomes genuinely more useful than a travel blog.

### The NULL Problem
The `beaches` table has ~90 columns. For Waikiki, approximately 70 are NULL. Many of those NULLs are actually known FALSE values (no UNESCO site, no mangroves, no seagrass, no camping, no nudism). Setting known FALSE values to FALSE rather than leaving them NULL would immediately improve data completeness percentage and query reliability.

### Notability Score is Broken
A beach with 4.5 million annual visitors, 30,000 hotel rooms, and foundational importance to the history of surfing scores 0.0. Whatever the notability algorithm is, it either hasn't been run or needs to incorporate external signals (Wikipedia views, hotel density, cultural landmarks, visitor counts).
