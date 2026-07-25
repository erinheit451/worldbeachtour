# The Ontology of a Beach

**Canonical data specification for World Beach Tour.**
Source of record: `beach_ontology.xlsx` (kept alongside this file). This Markdown is the
human-readable, version-controlled canonicalization of that workbook — folded into the
program per the 2026-07-04 decision (previously the xlsx lived only in `~/Downloads` and
kept getting lost). When the two disagree, reconcile and update both.

> A **working ontology** — not an attribute list. It defines the entity (what a beach *is*,
> with a key and a boundary rule), the relationships between beaches, and provenance as a
> first-class object. Every downstream surface (Tier 1–4 pages, the query engines, the Beach
> MCP server, the open dataset, the API) is a *projection* of this model.

## Meta-model

- **Beach is the core class.** Everything else attaches to it via relationships.
- **A value is never a column on Beach.** It is an `Observation(beach × attribute)` carrying
  source, method, date, and confidence. The "current view" of a beach is *materialised* from
  its newest valid Observations.
- **The DB is the spine.** Every layer must land as data + a `*_source` + a confidence level,
  with provenance. A layer is not "done" when a script runs — only when its attributes are
  populated at scale with provenance.

**Scale of the model:** 14 entity classes · **102 typed attributes across 14 domains** ·
17 relationships · controlled enumerations · an Observation provenance model · encoded
constraints & ethics · 9 query engines.

**Type vocabulary:** `categorical` = fixed vocab (see enum) · `ordinal` = ordered tiers ·
`score` = 0–100 · `numeric` = measured · `array` = multi-valued · `daterange` = windows ·
`boolean` · `text`.

---

## 1 · Classes — the entities in the world model

| ID | Class | Kind | Definition | Key | Geometry |
|----|-------|------|------------|-----|----------|
| C01 | **Beach** | SpatialFeature | The core entity: a named, bounded stretch of unconsolidated shore (sand/shingle/cobble/shell) at a land–water margin. | `beach_id` (ULID) | Polygon (wet+dry) + centroid Point + backshore Polyline |
| C02 | BeachSegment | Beach | A sub-stretch of a long strand that differs materially (lifeguarded zone, naturist end, rocky third). Lets one 12 km beach carry conflicting values honestly. | `segment_id` | Polygon within parent |
| C03 | Coastline | SpatialFeature | A named macro-coast (Costa Brava, Big Sur) grouping many Beaches. | `coastline_id` | Polyline / region Polygon |
| C04 | Bay | SpatialFeature | Intermediate grouping (bay, cove-cluster, gulf) between Coastline and Beach. | `bay_id` | Polygon |
| C05 | AdminArea | SpatialFeature | The jurisdiction(s) a Beach falls in (municipality → region → country). Carries most Law-domain values. | `admin_id` (GADM/ISO) | Polygon |
| C06 | **Observation** | Reified statement | One dated, sourced measurement of one Attribute of one Beach. NOT stored on the Beach row — this makes provenance first-class. | `obs_id` | — |
| C07 | Source | Provenance | A dataset, API, sensor, publication, or contributor that Observations cite. | `source_id` | — |
| C08 | Method | Provenance | The named, versioned algorithm/model/protocol that produced a computed Observation. | `method_id` | — |
| C09 | Event | TemporalFeature | A dated occurrence indexed to a Beach: festival, wildlife run, eclipse path, closure. | `event_id` | Point/date |
| C10 | Hazard | Reified statement | A typed danger (rip, stinger, biotoxin, shark history, crime) with a severity tier and validity window. | `hazard_id` | — |
| C11 | POI | SpatialFeature | A point feature on/near the Beach: pier, lighthouse, toilet, hospital, AED, boat ramp, food. | `poi_id` (OSM) | Point |
| C12 | Wreck | SpatialFeature | A shipwreck/salvage site offshore, joined to nearest Beach for history & treasure layers. | `wreck_id` | Point (depth) |
| C13 | MediaRef | Reference | A cultural-canon reference (painting, film, novel, song) tied to a Beach. | `media_id` | — |
| C14 | Webcam | Sensor | A public live camera feed pointed at a Beach; anchors the live-state engine. | `cam_id` | Point |

---

## 2 · Attributes — 102 properties across 14 domains

`★` = cheap, high-value wedge · `+` = added beyond the original source doc. Each attribute is
typed and carries source-type (`computed` / `licensed` / `community` / `hybrid`) and build cost.

### Sky & Celestial (7)
| ID | Attribute | Answers | Type | ★ |
|----|-----------|---------|------|---|
| SKY-01 | Sunset-over-water score | Does the sun set over the ocean here on a given date? | score | ★ |
| SKY-02 | Moonrise-over-water windows | Which nights does the full moon rise over the sea? | daterange | ★ |
| SKY-03 | Natural shade by hour | Is there shade on the sand after 3pm? | array | ★ |
| SKY-04 | UV / sunburn index | How fast will I burn here in July? | ordinal (ENUM-UV) | |
| SKY-05 | Dark-sky / Milky Way visibility | Can I see the galactic core in August? | ordinal (ENUM-BORTLE) | |
| SKY-06 | Meteor / eclipse-path flag | Is this beach in a path of totality / shower radiant? | daterange | |
| SKY-07 | Bioluminescence propensity | Do the waves glow at night here? | ordinal (ENUM-PROP) | |

### Climate & Air (5)
| ID | Attribute | Answers | Type | ★ |
|----|-----------|---------|------|---|
| CLI-01 | Coastal microclimate / fog | Sunny, or a June-gloom coast? | categorical (ENUM-FOG) | |
| CLI-02 | Sunshine probability by month | Odds of a clear beach day in May? | array | ★ |
| CLI-03 | Sea-breeze onset time | When does the afternoon onshore wind start? | numeric | |
| CLI-04 | Wind climatology (rose) | Calm cove or blustery? | array | |
| CLI-05 | + Air quality & wildfire smoke | Is the air safe / smoky, now & seasonally? | ordinal (ENUM-AQI) | |

### Water & Ocean (7)
| ID | Attribute | Answers | Type | ★ |
|----|-----------|---------|------|---|
| WAT-01 | Water-temperature calendar | Warm enough to swim in April? | array | ★ |
| WAT-02 | Clarity / true water colour | Bluest water / best snorkel visibility? | numeric (Secchi m) | ★ |
| WAT-03 | Tidal character | Does it become a 500m flat at low tide? | numeric | |
| WAT-04 | Surf / wave climate profile | Break type, consistency, best season? | categorical (ENUM-BREAK) | |
| WAT-05 | Current / rip structure tier | Structural rip-current risk? | ordinal (ENUM-RISK) | |
| WAT-06 | + Water-entry ergonomics | Gentle shelf or sudden drop-off / dumping shore-break? | categorical (ENUM-ENTRY) | ★ |
| WAT-07 | + Sea-surface temp extremes | Dangerously cold (cold-shock) or bath-warm? | categorical (ENUM-TEMPBAND) | |

### Life & Ecology (8)
| ID | Attribute | Answers | Type | ★ |
|----|-----------|---------|------|---|
| ECO-01 | Coral reef / snorkel value | What will I actually see snorkelling? | score | |
| ECO-02 | Official bathing-water quality | Is the water clean & safe to swim? | categorical (ENUM-BWQ) | ★ |
| ECO-03 | Coastal birding value | Best birding & what's around in spring? | score | ★ |
| ECO-04 | Megafauna event calendar | What wildlife event is on the week I visit? | daterange | |
| ECO-05 | Tide-pool richness | Best tide-pooling near me? | score | ★ |
| ECO-06 | Seaweed / red-tide / sargassum | Will it stink or be a brown mat? | ordinal (ENUM-PROP) | |
| ECO-07 | Seagrass / mangrove / MPA extent | Is this a protected/pristine coast? | categorical (ENUM-PROTECT) | |
| ECO-08 | Plastic / litter propensity | How likely is it litter-strewn? | ordinal (ENUM-PROP) | |

### Physical Form (12)
| ID | Attribute | Answers | Type | ★ |
|----|-----------|---------|------|---|
| FRM-01 | Sand colour & mineral class | Carbonate white, quartz tan, volcanic black, pink? | categorical (ENUM-MINERAL) | ★ |
| FRM-02 | Grain-size estimate | Fine, medium, coarse or pebble underfoot? | ordinal (ENUM-GRAIN) | |
| FRM-03 | Macro sand-library image | A microscope shot of this beach's sand. | array (images) | |
| FRM-04 | Morphodynamic beach type | Reflective, intermediate or dissipative? | categorical (ENUM-MORPHO) | ★ |
| FRM-05 | Beach width by tide-state | How wide is the sand at high vs low tide? | numeric | |
| FRM-06 | Substrate beyond sand | Barefoot-friendly or water-shoes? | categorical (ENUM-SUBSTR) | |
| FRM-07 | Singing / booming sands | Does the sand squeak or boom? | boolean | |
| FRM-08 | Geological features | Sea caves, arches, stacks, blowholes, basalt? | array (ENUM-GEO) | |
| FRM-09 | Tidal-island crossing window | Can I walk out to it, until when? | daterange | |
| FRM-10 | Erosion trajectory / SLR exposure | Which beaches are disappearing fastest? | numeric (m/yr) | |
| FRM-11 | + Sand surface temperature | Will the sand burn bare feet? | ordinal (ENUM-TEMPBAND) | |
| FRM-12 | + Artificiality / coastal engineering | Natural, nourished, or fully artificial? Groomed or wild? | categorical (ENUM-ARTIFICE) | |

### Hazard & Safety (10)
| ID | Attribute | Answers | Type | ★ |
|----|-----------|---------|------|---|
| HAZ-01 | Jellyfish / stinger season | Box jelly / Irukandji / Med bloom windows? | daterange | |
| HAZ-02 | Shark incident history | Has anything happened here? | integer | |
| HAZ-03 | Dangerous fauna | Stonefish, urchins, blue-ringed octopus, crocs? | array | |
| HAZ-04 | Biotoxin / shellfish closure | Safe to dig clams right now? | boolean | ★ |
| HAZ-05 | Rip-current propensity | Structural drowning risk? | ordinal (ENUM-RISK) | |
| HAZ-06 | Crime / break-in / drowning stats | Is the car park a break-in hotspot? | ordinal (ENUM-RISK) | |
| HAZ-07 | Lifeguard presence & season | Patrolled, and when? | daterange | |
| HAZ-08 | + Emergency access | Nearest hospital / AED / decompression chamber? | numeric (km) | ★ |
| HAZ-09 | + Post-rain contamination window | Unsafe to swim after recent rainfall (stormwater)? | boolean | |
| HAZ-10 | + Warm-water pathogens | Vibrio / naegleria risk in warm brackish water? | ordinal (ENUM-RISK) | |

### Access & Infrastructure (8)
| ID | Attribute | Answers | Type | ★ |
|----|-----------|---------|------|---|
| ACC-01 | Car-free / transit access | Reachable without a car? | boolean | ★ |
| ACC-02 | Structural crowding index | An empty-beach finder with no foot-traffic data. | score | ★ |
| ACC-03 | Piers / docks / jetties / ramps | Can I launch or fish from a pier? | array | |
| ACC-04 | Lighthouses | Is there a lighthouse here? | boolean | |
| ACC-05 | Facilities inventory | Showers, toilets, changing, rentals? | array (ENUM-FACIL) | |
| ACC-06 | Accessibility grade | Wheelchair/stroller feasible? Mobi-mat? | ordinal (ENUM-ACCESS) | |
| ACC-07 | Coastal-trail nodes | On a long-distance walking route? | array | |
| ACC-08 | Mobile connectivity | Can I work from this beach? | ordinal (ENUM-SIGNAL) | |

### Law & Governance (9) — *attaches mostly to AdminArea*
| ID | Attribute | Answers | Type | ★ |
|----|-----------|---------|------|---|
| LAW-01 | Nudity / topless legality | Is this a legal naturist beach? | categorical (ENUM-NUDITY) | |
| LAW-02 | Drive-on-beach rules | Can I drive on this sand? | boolean | |
| LAW-03 | Bonfire / camping / overnight | Beach fire or sleep here? | categorical (ENUM-ALLOW) | |
| LAW-04 | Dogs / alcohol / glass / smoking | Off-leash by season? Glass banned? | array (ENUM-ALLOW) | |
| LAW-05 | Drone / photography legality | Can I fly a drone or shoot here? | categorical (ENUM-ALLOW) | |
| LAW-06 | Collecting bans | Illegal to take sand / shells / rocks? | boolean | |
| LAW-07 | Metal-detecting legality × yield | Can I detect here — and is it worth it? | score | |
| LAW-08 | Reservation-required & ownership | Book ahead? Public/private/military/park? | categorical (ENUM-OWNER) | |
| LAW-09 | + Sacred / indigenous restrictions | Cultural or spiritual limits on entry, photos, removal? | categorical (ENUM-SACRED) | |

### Economy & Hospitality (7)
| ID | Attribute | Answers | Type | ★ |
|----|-----------|---------|------|---|
| ECON-01 | Flight access & price | Best beach from PDX under $400 this month? | numeric | |
| ECON-02 | Hotel density & ADR | Affordable lodging near this beach? | numeric | |
| ECON-03 | Beach-club vs free & sunbed price | Free beaches near Amalfi w/o a €40 sunbed? | categorical (ENUM-CLUB) | |
| ECON-04 | Entry / parking / access fees | What will it cost just to get on the sand? | numeric | |
| ECON-05 | Walkable food | Can I walk to a beach bar? | boolean | |
| ECON-06 | Seasonal operating rhythm | Is the town open in October or shuttered? | categorical (ENUM-SEASON) | |
| ECON-07 | + Travel friction | Language, currency, cards accepted, visa proximity? | array | |

### Activity & Recreation (7)
| ID | Attribute | Answers | Type | ★ |
|----|-----------|---------|------|---|
| ACT-01 | Swim suitability calendar | Swimmable in March: yes/no? | array | |
| ACT-02 | Dive / snorkel profile | Reef, wreck, visibility? | score | |
| ACT-03 | Wind / kite suitability | Kite/windsurf beach, and when? | score | |
| ACT-04 | Surf / pier fishing | Spots, species by season, licences? | array | |
| ACT-05 | Foraging / shellfishing | Dig clams / crab / mussels this weekend? | boolean | ★ |
| ACT-06 | Boating / anchorages | Beachable coves, dinghy landings, moorings? | array | |
| ACT-07 | Wellness / thermal beaches | Natural hot spring / mud therapy? | boolean | |

### Collecting & Hobby (5)
| ID | Attribute | Answers | Type | ★ |
|----|-----------|---------|------|---|
| COL-01 | Sea-glass beaches | Best sea-glass hunting near me? | score | |
| COL-02 | Gemstone / mineral sands | Green-sand, garnet, jade beaches? | array | |
| COL-03 | Fossil / shark-tooth beaches | Where can I find fossils / teeth? | score | |
| COL-04 | Shelling quality | Best shelling, after which conditions? | score | |
| COL-05 | Storm-driven restock forecast | The beach just restocked — go now? | boolean | |

### History & Story (6)
| ID | Attribute | Answers | Type | ★ |
|----|-----------|---------|------|---|
| HIS-01 | Shipwrecks offshore | Beaches near a shipwreck? | array | |
| HIS-02 | Treasure / salvage lore | Treasure beaches / where coins wash up? | score | |
| HIS-03 | Historical events | What happened on this beach? | array | |
| HIS-04 | Coastal archaeology | Roman ports, middens, petroglyphs? | array | |
| HIS-05 | Lore & hauntings | Ghost stories & legends? | text | |
| HIS-06 | Namesake & etymology | Why is it called that? | text | |

### Culture & Community (7)
| ID | Attribute | Answers | Type | ★ |
|----|-----------|---------|------|---|
| CUL-01 | Festivals & events index | What's on this beach and when? | daterange | ★ |
| CUL-02 | Religious / traditional gatherings | Beach traditions & rituals here? | daterange | |
| CUL-03 | Seasonal-tradition genre | Polar plunges, midsummer bonfires? | daterange | |
| CUL-04 | Cultural archetype / vibe | Fishing village, resort, surf, party, naturist? | categorical (ENUM-VIBE) | |
| CUL-05 | Cultural canon | Beaches in paintings, films, novels, songs? | array | |
| CUL-06 | + Soundscape | Lapping surf, highway noise, or flight-path roar? | categorical (ENUM-SOUND) | |
| CUL-07 | + Social safety by group | Solo-woman / LGBTQ acceptance vs mere legality; harassment? | categorical (ENUM-SOCIAL) | |

### Signal & Sentiment (4)
| ID | Attribute | Answers | Type | ★ |
|----|-----------|---------|------|---|
| SIG-01 | Review-mined attributes | Crowd / seaweed / vendor-hassle signals w/ seasonality? | array | |
| SIG-02 | Social volume & virality | Going viral / over-touristed right now? | score | |
| SIG-03 | Webcam directory | Show me this beach live. | array | ★ |
| SIG-04 | Live conditions state | Is it good right now? | score | |

---

## 3 · Relationships — the graph (17)

The biggest thing a flat list lacks. Beach-to-beach edges (R03–R05, R17) power the similarity
and erosion engines.

| ID | Relationship | From → To | Card. | Powers |
|----|--------------|-----------|-------|--------|
| R01 | partOf | Beach → Bay/Coastline/AdminArea | N:1 | roll-ups; "best beach on the Algarve"; Law inheritance |
| R02 | hasSegment | Beach → BeachSegment | 1:N | honest per-zone answers on one physical beach |
| R03 | **adjacentTo** | Beach → Beach | N:N | "the quieter beach next door"; overflow routing |
| R04 | **littoralNeighbour** | Beach → Beach (up/down-drift) | N:N | erosion causation; sand-mineral inheritance; restock prediction |
| R05 | **alternativeTo** | Beach → Beach | N:N | the Similarity Engine ("if you love Playa X…") |
| R06 | sharesCatchmentWith | Beach → Beach | N:N | contamination & red-tide co-alerts |
| R07 | hasObservation | Beach → Observation | 1:N | provenance, versioning, conflict resolution |
| R08 | observedVia | Observation → Method | N:1 | reproducibility; re-run on model upgrade |
| R09 | citesSource | Observation → Source | N:N | trust scoring; licence tracking |
| R10 | hasHazard | Beach → Hazard | 1:N | safety layers as "conditions", never certifications |
| R11 | hostsEvent | Beach → Event | 1:N | perfect-day engine; event travel |
| R12 | hasPOI | Beach → POI | 1:N | facilities, emergency access, food, piers |
| R13 | nearWreck | Beach → Wreck | N:N | history & treasure layers |
| R14 | referencedIn | Beach → MediaRef | N:N | culture layer; AI-uncounterfeitable content |
| R15 | watchedBy | Beach → Webcam | 1:N | is-it-good-right-now engine |
| R16 | onTrail | Beach → Route | N:N | itinerary stitching |
| R17 | **sameVibeAs** | Beach → Beach | N:N | fast pre-filter before full similarity join |

---

## 4 · Enumerations — controlled vocabularies

The allowed values that make the data joinable and citable.

- **ENUM-MINERAL** (FRM-01): carbonate-white · quartz-tan · volcanic-black · olivine-green · garnet-pink · shell-hash · mixed
- **ENUM-GRAIN** (FRM-02, ordered): silt · fine · medium · coarse · granule-pebble · cobble-boulder
- **ENUM-MORPHO** (FRM-04, ordered): reflective · intermediate · dissipative
- **ENUM-SUBSTR** (FRM-06): sand · shingle · cobble · boulder · shell-hash · rock-platform
- **ENUM-ENTRY** (WAT-06): gentle-shelf · moderate · sudden-dropoff · dumping-shorebreak · lagoon
- **ENUM-BREAK** (WAT-04): beach-break · point-break · reef-break · none
- **ENUM-VIBE** (CUL-04): fishing-village · resort-strip · surf-town · party-beach · wild-remote · family-mild · naturist
- **ENUM-RISK** (multiple, ordered): none · low · moderate · high
- **ENUM-PROP** (multiple, ordered): rare · occasional · frequent
- **ENUM-BWQ** (ECO-02, ordered): excellent · good · sufficient · poor
- **ENUM-PROTECT** (ECO-07, ordered): none · local · mpa · strict-reserve
- **ENUM-ACCESS** (ACC-06, ordered): full · partial · difficult
- **ENUM-FACIL** (ACC-05): toilets · showers · changing · rentals · parking
- **ENUM-SIGNAL** (ACC-08, ordered): none · weak · strong
- **ENUM-NUDITY** (LAW-01): designated-naturist · tolerated · topless-ok · prohibited
- **ENUM-ALLOW** (multiple): allowed · seasonal · permit-required · prohibited
- **ENUM-OWNER** (LAW-08): public · private · park-managed · military · reservation-required
- **ENUM-SACRED** (LAW-09): open · respect-requested · no-photography · no-removal · restricted-access
- **ENUM-ARTIFICE** (FRM-12): natural-wild · natural-groomed · nourished · engineered · fully-artificial
- **ENUM-TEMPBAND** (multiple, ordered): cold · cool · comfortable · hot
- **ENUM-FOG** (CLI-01): clear · marine-layer-am · persistent-fog
- **ENUM-GEO** (FRM-08): sea-cave · arch · stack · blowhole · columnar-basalt · waterfall
- **ENUM-CLUB** (ECON-03): free-public · mixed · club-dominated
- **ENUM-SEASON** (ECON-06): year-round · summer-only · weekend-shoulder
- **ENUM-SOUND** (CUL-06): natural-quiet · mixed · road-noise · flight-path
- **ENUM-SOCIAL** (CUL-07): welcoming · mixed · legal-not-accepted · unsafe
- **ENUM-UV** (SKY-04, ordered): low · moderate · high · extreme
- **ENUM-BORTLE** (SKY-05, ordered): 1-3 · 4-5 · 6-9
- **ENUM-AQI** (CLI-05, ordered): good · moderate · unhealthy

---

## 5 · Provenance model

Every value is a dated, sourced Observation — not a column. This is what makes a
"computed-truth" product trustworthy.

| Field | Datatype | Req | Purpose |
|-------|----------|-----|---------|
| `obs_id` | ULID | Y | Unique id for this single value |
| `beach_id` | FK→Beach | Y | Which beach the value describes |
| `attribute_id` | FK→Attribute | Y | Which property is being asserted |
| `value` | typed | Y | The value itself, typed per the attribute |
| `observed_at` | datetime | Y | When the measurement/derivation refers to |
| `ingested_at` | datetime | Y | When it entered the store |
| `valid_until` | datetime | N | Expiry for seasonal/live values; blank = static |
| `method_id` | FK→Method | cond. | Required for computed values; the versioned algorithm |
| `source_id` | FK→Source | Y | Dataset/API/contributor backing it |
| `confidence` | 0–1 | Y | Model or contributor confidence |
| `spatial_resolution` | metres | N | Native resolution of the input (e.g. 10 m Sentinel-2) |
| `contributor_id` | FK→User | cond. | For community values; enables reputation weighting |
| `verified_by` | enum | N | auto / community-confirmed / expert-reviewed |
| `supersedes` | FK→Observation | N | Prior value this replaces — full history retained |
| `conflict_rule` | enum (on Method) | Y | newest / highest-confidence / authoritative-source / expert-override |
| `completeness` | 0–1 (derived on Beach) | Y | Share of applicable attributes with a live Observation |

---

## 6 · Constraints & Ethics

The rules that make this a specification, not a wishlist. `E-` rows encode tripwires as rules.

- **K01 · Identity** — Every Beach has one immutable `beach_id` (ULID) that survives renames,
  merges and splits; human names live in a separate names table with language + source. *A name
  is not a key.*
- **K02 · Segmentation** — A new Beach boundary is drawn where the shoreline is broken by a
  headland/river mouth >X m, OR where a core attribute (substrate, ownership, morphodynamic
  type) changes materially. Continuous homogeneous sand = one Beach; use BeachSegment for
  internal variation. *This defines what the ~240K count actually counts.*
- **K03 · Merge/Split** — When erosion/accretion merges or splits beaches, old ids are retired
  with a `succeededBy` pointer; ids are never silently reused.
- **K04 · No value without Observation** — No attribute is stored directly on a Beach; every
  value is an Observation. Beaches expose a "current view" materialised from newest valid
  Observations.
- **K05 · Cardinality** — Attribute cardinality (1:1 / 0:1 / 0:N) is enforced on write; 0:N
  attributes (events, hazards, POIs) never collapse to a single column.
- **K06 · Temporality honesty** — live/seasonal values must carry `valid_until`; a stale live
  value is hidden, not shown as current. *"Is it good right now" fails safe.*
- **K07 · Safety framing** — Hazard-class attributes render as "conditions to know", never as a
  certification or all-clear; absence of a hazard Observation ≠ safe.
- **E01 · Ethics — misfortune line** — Attributes whose input is an individual's misfortune
  (crime HAZ-06, drowning stats) are aggregate-only, thresholded, never person-identifiable, and
  reviewed before publishing.
- **E02 · Ethics — sacred/indigenous** — LAW-09 restrictions are authored *with* the relevant
  communities, can suppress other attributes (hide exact location, ban sand-library submissions),
  and override engagement goals. *Cultural harm outranks completeness.*
- **E03 · Ethics — collecting** — Where a collecting-ban Observation (LAW-06) exists,
  collector-layer outputs (sand library, sea-glass, shelling) show the ban prominently and
  disable contribution prompts.
- **E04 · Ethics — social safety** — CUL-07 is sourced from community + rights indices, never
  inferred from an individual, and is advisory; it distinguishes legality from lived acceptance
  without profiling any person.

---

## 7 · Query engines — why the graph is load-bearing

Each product maps to the exact attributes AND relationships it consumes.

| Engine | The query | Needs attributes | Needs relationships |
|--------|-----------|------------------|--------------------|
| **Similarity** | "If you love Playa X, here are 12 that match its sand, water colour, crowd & vibe." | FRM-01, WAT-02, ACC-02, CUL-04, + full vector | R05, R17 |
| **Perfect-Day** | Best beach for a date: tide × shade × water-temp × crowd × light. | WAT-01, WAT-03, SKY-01, SKY-03, ACC-02, ECO-06 | R11, R01 |
| **Is-It-Good-Right-Now** | One live per-beach state. | SIG-04, WAT-03, WAT-05, WAT-01, CLI-04, ECO-06 | R15, R06 |
| **Empty-Beach Finder** | Solitude with zero foot-traffic data. | ACC-02, ACC-01, SKY-01 | R03 |
| **Erosion / Deadline** | "The 100 beaches disappearing fastest." (press franchise) | FRM-10, FRM-05 | R04 |
| **Answer-Engine Substrate (GEO)** | "Quiet beach near Porto with afternoon shade." | ACC-02, SKY-03, CLI-01, CUL-04 | R01 |
| **Safe-for-Kids** | "Calm, shallow, lifeguarded, clean beaches near me." | WAT-06, FRM-04, WAT-05, HAZ-07, ECO-02, SKY-03 | R01, R12 |
| **Restock / Collector** | "The beach just restocked — go now." | COL-05, COL-04, FRM-01 | R04 |

---

## Appendix · Current coverage vs this ontology (2026-07-18)

Measured against the live `world_beaches.db` (227,780 beaches). **Only ~8 of 102 attributes
are populated at scale (~7%).** Live dashboard: *WBT Build Atlas* artifact.

**At scale (>50%):** FRM-06 substrate (100%), FRM-02 grain (75%), FRM-01 sand-mineral *predicted*
(98%, but not the FRM-01 spectral class), WAT-03 tides (62%), HAZ-02 shark (100%), ACT-01 swim
calendar (97%), + the climate spine feeding CLI-*.

**Partial (10–50%):** ECO-07 protected/MPA (29%), ECO-02 bathing-water (9%), FRM-04 morphodynamic,
HAZ-07 lifeguard (3%).

**~0% — designed, not built (9 of 14 domains):** all of Sky & Celestial, Access & Infrastructure,
Law & Governance, Economy & Hospitality, Collecting & Hobby, History & Story, Culture & Community,
Signal & Sentiment — plus most of Water (temp/clarity/surf/rip/entry), Hazard (jellyfish/biotoxin/
crime/pathogens), Activity (dive/kite/fishing/foraging), and Ecology (coral/birding/tide-pools/
sargassum).

Filling this is the program (see `ROADMAP.md` / `layers/`). Critical path: geometry keystone →
compute sprint → Tier-3 template → publish, with editorial (T1/T2) running in parallel.
