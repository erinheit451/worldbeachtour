# World Beach Tour — Comprehensive Page Strategy Research

> **Status:** Research synthesis (2026-06-13). Floor, not ceiling — input for an Erin decision pass, not a locked plan.
> **Question driving it:** "Given the goal of the most comprehensive and useful beach resource in the world, how do we build the deepest possible page per beach — adaptable by user type — and what revenue, data, and utility layers are we missing?"
> **Scope note:** Companion to `build-out-strategy.md` (tier system + ISR plan) and `beach-page-architecture.md` (composable page + `dominant_lens`). This doc does **not** restate those; it extends them with (a) a user-persona/lens model, (b) a data-gap catalog, (c) a utility/laws layer, (d) a revenue model, (e) a multilingual verdict, and (f) topics we hadn't considered.

---

## 0. The one-paragraph thesis

We already have most of the machinery: a tiered composable page, a per-beach `dominant_lens`, a 9-lens tab system (`site/lib/lenses.ts`), an 11-value `audience` marginalia taxonomy, and a genuinely deep data model (climate normals, ocean temp, partial wave data, tides, sand Q/F/L, ecology, protected areas, bathymetry, orientation/`sunset_visible`). The gap between "stub" and "legendary" is **data completeness and lens depth, not page type.** So the comprehensive-page strategy is: **one canonical adaptive page that self-personalizes to the beach's nature (dominant lens) and the user's intent (lens chips + audience marginalia), progressively disclosed, with depth that grows as data fills in.** The biggest single unlock is finishing the **wave/surf data** (currently deferred) — it gates the entire surf persona and a "surfable: yes/no" flag that improves search, filtering, and honest expectation-setting across all 228K beaches.

---

## 1. The adaptive page model (how one page serves every user)

### 1.1 The critical UX finding
Nielsen Norman Group explicitly warns **against** audience-gated navigation ("I am a surfer / I am a family") as the primary structure: users are multiple personas at once or none, it adds cognitive load, and it forces content duplication. **Do not build an "I am a ___" wall.** A single beach serves a surfer AND a photographer AND a family simultaneously.

### 1.2 The four-layer adaptive page (recommended)
We already have the primitives for all four — this is mostly composition discipline, not new tech.

| Layer | What it is | Personalizes by | Existing asset |
|---|---|---|---|
| **1. Universal core** | Always shown: hero, map, "can I [swim/surf/visit] here?" quick-decision card, getting there, best months, safety | Nobody — everyone needs it | `<QuickDecision>` |
| **2. Dominant-lens block** | Page *leads* with the beach's defining lens (Nazaré→surf, Glass Beach→sand, Copacabana→culture) | **The beach** (data-driven, no user input) | `dominant_lens` field — our strongest asset |
| **3. Lens chips** | Intent chips that **re-order & expand sections in place** (not navigate away). "Surf" floats the surf section up; "Family" floats safety/facilities | **User intent** | `lens-tabs.tsx` — evolve from tabs→in-place chips |
| **4. Audience marginalia** | Margin notes tagged `audience="surfers"` etc. — one paragraph serves geology + surfers + safety simultaneously | **Multiple personas at once** | `<MarginNote>` + the `audience` taxonomy |

**Free personalization via intent:** if the visitor arrives from `/surf` hub or searched "surfing [beach]", pre-activate the surf chip. Entry-path beats asking.

**The single highest-value adaptive element** is a per-persona one-line **verdict** in the quick-decision card:
- "Surfable? **Yes — beach break, best Oct–Mar, NW swell.**"
- "Good for kids? **Yes — gentle shelving, lifeguarded, Blue Flag.**"
- "Snorkel? **No reef nearby — skip.**"

Precedents: Surfline (one spot page, toggleable swell/wind/tide views + good/fair/poor verdict), AllTrails (activity + difficulty as *modifiers* over one trail object, info-icon progressive disclosure), Wikivoyage (one valuable page, not audience forks).

### 1.3 The full persona taxonomy (~35 personas, 7 families)
The 6 Erin named are folded in and expanded. Each persona below = (cares about / served by existing data / data gap).

**A — Wave & wind sports:** Surfers · Bodyboarders/bodysurfers/skimboarders · Kitesurfers/windsurfers/wing-foilers · SUP/flatwater kayakers · Sea kayakers/surfskis
**B — Underwater:** Snorkelers · Scuba (shore dives) · Spearfishers/freedivers
**C — Surface craft:** Surf/shore anglers · Sailors/small-boat
**D — On-the-sand:** Beach travelers/sightseers (default) · Open-water/lap swimmers · Families · Accessibility/disabled visitors · Dog owners · Campers/RV/van-life · Runners/walkers · Naturists
**E — Naturalist/collector:** Birders · Beachcombers/shellers/sea-glass · Fossil hunters · Rockpoolers/tidepoolers · Metal detectorists
**F — Light/sky/image:** Photographers/sunset chasers · Astro-tourists/stargazers · Bioluminescence chasers
**G — Experience/lifestyle:** Honeymooners/couples · Wedding/event planners · Wellness/cold-plunge/sauna · Digital nomads · Surf-lesson seekers

**Cross-cutting modifiers (not personas):** skill level (beginner↔expert) · season/month · time-of-day · group type · mobility.

**Recommended v1 first-class chip set** (gets verdict + chip + marginalia): **Surf, Swim, Family, Snorkel/Dive, Photography, Nature/Wildlife, Sand & Geology, History/Culture, Accessibility.** Everything else (kite, fish, dog, astro, beachcomb, naturist, camp) served by **expanded marginalia + ranking-filter traits** until demand proves out.

**Action:** expand the `audience` marginalia taxonomy (currently 11) to add at least: anglers, divers/snorkelers, kitesurfers/windsurfers, swimmers, dog-owners, birders/naturalists, stargazers, beachcombers.

### 1.4 Per-persona data-need highlights (where we're strong / where we have gaps)
- **Strong already:** photographers (we *derive* `sunset_visible` + `orientation_deg` — west-facing sunset beaches are a literal computed field), families (`slope_pct` gentle-entry, Blue Flag, lifeguard), swimmers (`ocean_water_temp` monthly, bathing grade), sand/geology (Q/F/L + curated narrative + samples).
- **Gaps that block a persona:** surfers/kite (wave height/period/swell + wind-by-direction climatology — **deferred, must finish**), snorkel/dive (water-clarity/turbidity climatology, reef-proximity flag, entry-type), accessibility (beach-wheelchair/Mobi-mat — mostly absent from OSM), dog policy + seasonal dates (high demand, poorly covered), stargazing (Bortle/light-pollution — free VIIRS raster, easy win), anglers (target species + seasonal runs, structure mapping).

### 1.5 Surfability classification (proposal — highest-value new field)
Two questions: **(1) could this beach ever surf** (static/structural) and **(2) when/how good** (dynamic/forecast).

- **Tier 1 — static `surfable: true/false/unconfirmed`** (computable now-ish): `swell_exposure` (from `orientation_deg` vs open-ocean swell window — enclosed/sheltered seas ≈ 0, e.g. a Med lagoon is never surfable) × `bathymetry_break` (`slope_pct` + `drop_off_flag` + `nearshore_depth_m` → spilling beach-break vs plunging shorebreak vs too-deep-no-break) × fetch exposure. **Ship this across all 228K now** — it powers surf-hub curation, the surf chip's visibility, the "Surfable?" verdict, honest expectation-setting, and filters out the ~200K obviously-not-surf beaches. Validate against known fixtures (Nazaré/Pipeline/Teahupo'o = true; a Caribbean lagoon/Baltic strand = false).
- **Tier 2 — seasonal window** (needs wave climatology, ERA5 is free): "best surf Oct–Mar, NW swell, mid tide."
- **Tier 3 — live forecast:** embed/link Surfline/Open-Meteo Marine per spot; don't host.

---

## 2. Data gaps — live, forecast, historical, cameras, AIS, satellite

**Universal architecture rule (load-bearing):** at 228K pages you can **never** call an API per pageview. Pattern everywhere = **snap beaches to a coarse grid (~0.1°/11km collapses 228K→~20–50K unique coastal cells) or to a nearest station, batch-ingest on a cron into our DB, serve from our store via ISR + edge TTL.** Reserve any live per-request fetch for a few hundred landmark pages. Second rule: **WBT is commercial** (GA4 + affiliate), which gates several "free" sources — check licensing every time.

### 2.1 Weather forecast (we have monthly NORMALS, not live forecast)
- **Open-Meteo** (CC-BY 4.0, cache+redistribute legal; free non-commercial, €29/mo commercial, **or self-host AGPLv3 free on the Hetzner box**) — the backbone; 16-day hourly **+ a marine/wave endpoint**.
- **Met.no/Yr** (CC-BY, caching mandatory) — free global fallback/cross-check. **NWS api.weather.gov** (public domain, US only) — optional US upgrade.
- Skip: Tomorrow.io/AccuWeather (poor fit). Windy API (~$720/yr) only for an animated map overlay on marquee beaches.

### 2.2 Ocean / marine forecast + LIVE feeds (we have climatology, not live)
- **Open-Meteo Marine** — one free call = waves + swell + SST + sea-level/tide + currents + UV, global, 16-day. Unlocks the differentiator **"live forecast vs. your climatology."**
- **NOAA NDBC buoys** (public domain) — live wave/wind/water-temp, ~900 stations (US-heavy + some global). **The "live data" credibility centerpiece** ("Buoy 18mi offshore: 4.2ft @ 12s, water 58°F, 14 min ago"). + **CDIP** for nearshore US.
- **Tides (live):** NOAA CO-OPS (free, US) + **WorldTides** (cheap PAYG, global). "Next high tide 3:42pm."
- **NOAA OISST** — live global daily SST (1-day lag) → "today vs typical" everywhere.
- **Copernicus Marine (CMEMS)** — free, redistribution-OK, authoritative global waves/SST/currents (E-E-A-T sourcing).
- One-time dependency: precompute `beach_id → nearest active station + distance + bearing`, with a max-radius cutoff so we never show a meaningless far buoy.

### 2.3 Historical / climate-trend (the "environmental lens")
- **Deltares Shoreline Monitor** (CC-BY, global, 500m transects) — **per-beach erosion/accretion rate in m/yr.** The single best unique stat: "this beach is eroding 1.2 m/yr." **Ingest first.**
- **ERA5 wave climate** (Copernicus, CC-BY) — precompute per-beach monthly significant-wave-height + swell-direction normals (also the surfability Tier-2 unlock).
- **NOAA Coral Reef Watch** (public domain) — degree-heating-weeks / bleaching-alert / SST-anomaly history; conditional on reef/tropical beaches (pairs with existing ecology).
- Plus: OISST warming trend (°C/decade), ENSO/ONI sitewide widget, GTSM storm-surge return periods (the additive part beyond our existing IBTrACS cyclone tracks), NASA/NOAA sea-level trends (station-limited — snap-to-nearest, don't overclaim).

### 2.4 Live cameras (the `beach_webcams` table is empty)
**Legal line is the whole story** — only two safe scalable paths:
- **YouTube iframe embeds** of permanent live channels (explore.org, tourism boards, resorts, harbor cams) — ToS-sanctioned, free, broadest. Catch: live-embed IDs aren't guaranteed permanent → build a **link-rot health-check job**. The workhorse.
- **SkylineWebcams/Whatsupcams** — free sanctioned embed widgets (partnership-gated; good for flagships).
- **Windy Webcams API** — great `nearby=lat,lon,radius` discovery, **but redistributing imagery is forbidden** and Pro is €9,990/yr → use free tier **only as a discovery index**, then resolve to a sanctioned YouTube/partner embed.
- **Forbidden — do not build on:** EarthCam embedding without permit, RTSP/HLS scraping/hotlinking (infringing, risky on a commercial site). Surfline = negotiated paid partnership only (worth it for marquee breaks).
- **Reality:** the entire legal webcam universe is a few thousand cams. Treat a cam as a **premium feature on the few hundred landmark pages**, tight radius (≤2–5km) + coastal sanity check. **Rule (mirrors "never teach parsing"): only embed what we're licensed to embed.**

### 2.5 Shipping / boats / AIS
**Winners are static geospatial datasets, not live AIS** — precompute offline, free, crawlable, commercial-safe, scales to 228K at zero per-request cost.
- **OSM** (`route=ferry` + terminals, `leisure=marina`, harbours; ODbL) — **ferry routes = beach ACCESS, the highest-value real-intent use** ("how do I get there").
- **Natural Earth Ports** (public domain) + **NGA World Port Index** (public domain, ~3,700 ports) — nearest-port panel.
- **Vessel density "how busy is this water":** EMODnet (EU, free, commercial-OK) + NOAA MarineCadastre (US, public domain) — pre-aggregated rasters, regional only.
- **aisstream.io** (free, commercial-OK, live websocket, ~200km coastal) — optional "vessels near here now" widget (gimmicky for SEO since uncrawlable).
- **Decision flag:** **Global Fishing Watch** (free, global, best overfishing/environmental story) is **CC BY-NC — non-commercial only**, conflicts with monetization. Request commercial terms or confine to a non-monetized context. MarineTraffic/Spire = enterprise quote-only.

### 2.6 Satellite imagery & earth observation
Two cost regimes: a base-map tile per page is cheap (billed per map-*load*, lazy-init the map); derived per-beach analytics are heavy → landmark beaches only.
- **EOX Sentinel-2 cloudless** WMTS — gorgeous global base layer for every page. **Use the 2016/2017 CC-BY-4.0 layer (commercial-safe); 2018+ is CC-BY-NC-SA, not usable commercially.**
- **NASA GIBS** WMTS — free, unlimited, global daily, commercial-safe (best free fallback/overlay).
- **Sentinel-2 raw** (10m, CC-BY) via **Microsoft Planetary Computer** (free STAC + compute, no Google-Earth-Engine commercial trap) — backbone for pre-baked derived analytics on landmark beaches: recent true-color chip, NDTI turbidity/clarity, CoastSat shoreline-change trend.
- **Zero-compute global overlays:** Allen Coral Atlas (free 5m reef extent) + NASA Ocean Color (chlorophyll/turbidity/algal-bloom indicator).
- **Avoid free-tier:** Google Earth Engine (commercial = paid agreement), Esri World Imagery (not licensed commercial), Google Maps (costly + no-cache ToS). **Mapbox** = 50K loads/mo free then cheap PAYG (best paid upgrade). Planet/Maxar = quote-only, hero pages only.

### 2.7 Overall ranking — highest-value NEW feeds to add
1. **Open-Meteo (forecast + Marine), self-hosted** — one integration adds 7–16d forecast, swell, live SST, currents, UV, sea-level to all 228K, and unlocks "forecast vs. climatology." Highest leverage, lowest cost.
2. **NOAA NDBC buoys (+CDIP, +OISST)** — the live-data credibility proof. Free/public domain.
3. **Deltares Shoreline Monitor** — free, global, per-beach erosion rate (m/yr). Unique sticky stat.
4. **Live tides** — CO-OPS (US) + WorldTides (global).
5. **EOX Sentinel-2 cloudless (CC-BY) base map on every page** — visual transformation, near-zero marginal cost.
6. **OSM ferry/port/marina static layer** — free, crawlable, answers "how do I get there."
7. **Coral Reef Watch + ERA5 wave climate + Allen Coral Atlas + NASA Ocean Color** — conditional/zero-compute environmental lens.
8. **YouTube webcam embeds on landmark beaches** — premium flourish.

---

## 3. The utility / "things you actually need but can't find" layer

These are differentiators — virtually no beach site does them reliably. Split by **dataset-at-scale** vs **curate-the-famous-few-hundred**.

### 3.1 Populate from a dataset at scale (cheap, broad)
- **Water quality / sewage / closures (LIVE):** US **EPA BEACON 2.0**, UK **Surfers Against Sewage Safer Seas** (real-time CSO sewage alerts, public API), EU **EEA Bathing Water** (DISCOMAP ArcGIS + national APIs). The **single biggest structured win** — live "is the water clean right now."
- **US rip-current risk (LIVE):** NOAA NWS Surf Zone Forecast feeds (parse, geo-match). US-scalable.
- **Drone/camping/fire "likely prohibited" flags:** spatial join beach coords → **WDPA/Protected Planet / PAD-US** protected-area polygons (drones banned in ~all US/AU national parks).
- **Shark history:** ISAF + Global Shark Attack File (downloadable, lat/long) — as historical context, **never live risk**.
- **Tsunami zones:** spatial overlay (NGI global, NOAA, state GIS) — "is this beach in an inundation zone."
- **US smoking bans:** ANRF + CDC STATE System (joinable by city).
- **Etiquette/nudity norms + tipping + dress:** mostly **country-level attributes** → one curated country profile fans out to thousands of beaches instantly. Cheapest high-coverage layer.
- **Blue Flag certification:** FEE annual list / national open datasets.
- **Geometry-derived access:** OSM/Overpass — parking distance, **`step_count` (literal cliff-step counts where tagged)**, ferry, fee, `wheelchair`, `4wd_only`. Free but sparse.

### 3.2 Curate per priority beach (the famous few hundred that drive traffic)
- **Drive-on beaches:** OSM detects *candidates* (drivable `highway=track`/`service` way over a sand beach + `motor_vehicle`/`4wd_only`/`surface=sand`), but **legal status must be curated** (NPS/county/state/QLD Parks). High-value differentiator — current+comprehensive drive-on status exists nowhere.
- **Weird local laws taxonomy:** alcohol/glass/fire/BBQ/smoking/dog-seasonal/drone/fishing-license/**sand-&-shell-removal**/metal-detecting/camping/curfew/jet-ski/parking/nudity. The viral **"it's illegal to take sand here"** list (Sardinia €3,000 fine, Hawaii since 2013) is a standalone link-magnet.
- **Hazard regional advisories:** jellyfish/stinger season (box jellyfish/Irukandji windows), crocodile zones (N. Australia), stonefish/blue-ringed-octopus/cone-snail habitats, sneaker-wave season (Pacific NW Oct–Apr), cold-water-shock.
- **Per-country flag-warning legend** + which system governs each beach (US ICW vs UK RNLI vs AU systems differ — tourists routinely misread flags; purple = marine life in US, red-over-yellow = lifeguarded swim zone in UK).
- **Accessibility:** beach-wheelchair / Mobi-mat / accessible-toilet / ramp-vs-stairs (findaccessiblebeaches.com, tourism boards) — underserved, ranks well, goodwill-rich.
- **Seasonal closures:** turtle/bird nesting (gates close at dusk May–Oct), military ranges.

### 3.3 The 5 standout utility differentiators
1. Live water-quality + sewage-spill status (US/UK/EU).
2. Live US rip-current risk + correct per-country flag legend.
3. Drive-on-beach legal/permit status, current and comprehensive.
4. The "weird local laws" taxonomy — esp. the viral sand/shell-removal list.
5. Accessibility layer (Mobi-mat / beach wheelchairs / step counts).

### 3.4 Liability discipline (must encode as editorial rule)
Hazard/legal content is the liability hot zone. **Never render our own "safe to swim" verdict** — surface official feeds with attribution + timestamp; fail to "data unavailable — check [official]" rather than show stale "safe." Every legal/rule field carries **"last verified [date]" + a link to the source ordinance**; global "not legal advice / laws change" disclaimer. **Coverage honesty:** most live feeds only cover designated/monitored beaches (a few thousand, not 228K) — show "monitored — live data" vs "not monitored" explicitly. **Licensing to confirm before ingest:** NOAA/EPA = public domain (fine), EEA = open, OSM = ODbL (share-alike + attribution), SAS/ISAF/GSAF/Blue-Flag = check terms. Geo-matching accuracy matters (wrong beach's advisory = safety/liability risk) — vet the ID crosswalk for any beach showing live hazard data.

---

## 4. Revenue model — what we're missing

**Structural advantage:** every page already renders **nearest city / nearest airport** — a natural, non-spammy slot for "OK, how do I actually go here?" booking intent, ×228K. **Reality check:** none of this pays until traffic arrives; the work now is *wiring* so pages convert the moment SEO traffic lands.

### 4.1 The hooks, by priority
1. **WIRE FIRST — Accommodation via Travelpayouts** (umbrella: Booking/Hotellook/WayAway under one signup, content-only approval, one tracking script). On the "nearest city" point: "Where to stay near [Beach]." ~4–6% effective of booking value; highest-intent, highest per-conversion $.
2. **Tours & activities — Viator (8%) + GetYourGuide (8–10%)** side-by-side. No traffic minimum, fast approval. "Things to do near [beach]" — surf lessons, dive trips, snorkel tours, charters, auto-pulled by geo.
3. **Flights — Skyscanner/WayAway** (same Travelpayouts account, near-zero marginal effort, but low ~1–1.6% rate). On the "nearest airport" point.
4. **Reef-safe sunscreen database ⭐ — the authority+commerce flagship.** A structured "which sunscreen is legal where (Hawaii/Maui/Palau/Key West/Bonaire/Mexico ban differing ingredients) + independently lab-tested reef-safe" hub. Answers a real pre-trip search, earns AI citations/links (E-E-A-T asset, not a link farm), monetizes via **direct brand programs at 10–20%** (Stream2Sea/Badger/Raw Elements/Thinksport) — far better than Amazon's 3%. Auto-inject a "⚠️ chemical sunscreen banned here — compliant options" badge on every beach in a ban jurisdiction. **Lean on legal-ban facts + lab tests, never repeat brand "reef-safe" marketing claims** (active labeling litigation, June 2025).
5. **Display ads — AdSense now** (instant baseline) → **Raptive at 25K pageviews/mo** or **Mediavine** once at $5K/yr ad revenue. Travel display ~$3–15 RPM rising to ~$15–30 premium.
6. **High-ticket experiences — Tripaneer/BookSurfCamps/BookYogaRetreats** + PADI dive ecosystem on surf/dive beaches (multi-day camps $500–2,000+, strong per-conversion).
7. **Adjacent traveler affiliates (not in the streams but obvious fits):** car rental (DiscoverCars/Rentalcars), eSIM (Airalo), travel insurance — all natural on a destination page.
8. **Later, post-traffic:** direct local listings / featured-beach sponsorships (tourism boards/DMOs), **data licensing / public API / MCP server** (the 228K structured DB is the real long-term asset), membership/trip-planner Pro, ebook/region guides.

### 4.2 Which gear earns a standalone database vs contextual links
Standalone page only where there's a **real purchase decision + regulatory/safety angle + repeat demand:** reef-safe sunscreen (flagship), snorkel/dive gear, UPF clothing (secondary). Everything else — beach tents, wagons, water shoes, dry bags, swimwear, kites, fishing/surf gear — **contextual links only** (low Amazon rate, low consideration).

### 4.3 Revenue math (honest)
At ~100K monthly pageviews (a milestone, not today): display ~$1,000/mo at $10 RPM; affiliate $1,000–3,000/mo if 2–3% of pageviews are booking-intent. The 228K-page scale means tiny per-page RPM compounds — but only after indexation. **Sequence affiliate-first** because the site is below the traffic level where display alone pays, and booking intent is the highest-value action on a beach page.

---

## 5. Multilingual — verdict: **not yet; build the architecture now, translate winners later**

**Recommendation:** **No** to mass-translating 228K × N languages. **Yes** to (a) adopting i18n-ready routing during the ISR migration (cheap, reversible, obligates no translation) and (b) a tightly-scoped pilot that localizes only proven editorial T2/T3 winners + home-country beaches into 2–4 languages *after* English proves out.

**Why not now:** the site is pre-traffic and still proving the English tier structure. The decisive risk is Google's **scaled-content-abuse** policy (March 2024), which names "translations... where little value is provided" as flaggable. Google softened in 2025 (MT not *strictly* spam — it's about resulting value), but **"templated × machine-translated × 228K" is the textbook shape the policy targets.** Reddit got away with AI translation because the underlying threads are valuable+unique; our pages must clear that bar *before* translation. The asymmetry: a botched English launch costs English rankings; a botched multilingual launch can flag the whole domain.

**Prioritization framework (translate only the intersection):**
- **Axis A (page deserves it):** editorial T2/T3 or a programmatic page with *proven* English GSC demand — never a stub.
- **Axis B (language worth it):** **home-country language for beaches in that country** (Brazil→pt-BR, Greece→el, Japan→ja — local capture, low English competition, minimal cannibalization) **+** top traveler source-markets (es, de, fr, pt-BR, ja). Pilot subset: **es, de, pt-BR, ja** (French 5th). The highest-ROI move = home-country language for in-country beaches → a few thousand pages, not millions.

**Architecture (Next.js App Router + ISR, 2026):** subdirectory routing (`/es/...`, pools domain authority on a young domain — not subdomains/ccTLDs) · **next-intl** (App Router standard; auto-emits hreflang `Link` headers incl. `x-default`) · reciprocal self-referencing hreflang via `generateMetadata.alternates.languages` · localized routes = more `generateStaticParams (locale × slug)` but **pre-render only translated winners, never the full matrix** · per-locale sitemaps with `xhtml:link`, excluding noindex stubs.

**Translation quality/cost:** LLMs now lead pro MT (Claude/GPT-4.1 best-in-class 2025); editorial pages get **LLM translate + light native review** before indexing (protect E-E-A-T + voice); proven programmatic winners get LLM/DeepL on prose templates, structured data stays locale-*formatted* not translated; stubs/unproven = English-only. ~1,300 editorial × 4 languages = a few hundred dollars total; 228K × 4 = ~$10–40K — another reason to scope tight. Apply the **same cohort-promotion "earn indexation" gate to localization.**

---

## 6. Topics we hadn't considered (additional research surfaced)

These weren't in the original ask — flagging as the "floor not ceiling" expansion.

1. **Crowd / busyness intelligence.** "How crowded is this beach, when?" is a top unmet need. Google Popular Times (via BestTime.app or SerpApi), parking-lot fill as a proxy, seasonal crowd curves. Powers a families/honeymoon "quietest time" verdict and an "if crowded, try these nearby" module.
2. **Similarity & comparison engine.** "Beaches like this one" / "this vs that" — already on the parallel-product-track in build-out-strategy. The data model (sand regime, climate, waves, vibe) makes a genuine vector-similarity engine possible. Strong internal-linking + engagement asset.
3. **Multi-beach trip / road-trip planning.** "Best beaches on the Algarve in October," beach road-trips (pairs with drive-on + ferry data), itinerary export. Converts directly to accommodation/car-rental affiliate.
4. **User-generated content & freshness.** Reviews, recent photos, condition reports, "I was here" check-ins. The one thing programmatic data can't fake — drives E-E-A-T (real experience), freshness signals, and a moat. Even lightweight (photo upload + 5-star + a comment) compounds. Consider citizen-science sand samples (mail-in) tying to the geology lens.
5. **Structured data / AI-citation optimization.** Schema.org `Beach`/`TouristAttraction` + `FAQPage` + `BreadcrumbList` on T1+ (already in Phase 4). Go further: make the data **AI-answer-ready** (clean factual blocks AI engines cite) — the distribution play given the "allow AI crawlers" decision. The MCP-server/API idea doubles as both product and citation surface.
6. **Alerts & subscriptions (engagement + monetization).** "Email me when water quality at [beach] is clean / when surf is good / jellyfish season ends." Builds a list, recurring engagement, and a natural premium tier.
7. **Connectivity / practical-logistics microdata.** Cell signal, nearest hospital/emergency + lifeguard hours, nearest toilet/shower/freshwater, EV charging in the lot, drinking water — small facts, high "I'm planning the actual day" value.
8. **Climate-future framing.** "This beach by 2050" using the shoreline-erosion + sea-level data — a genuinely novel, shareable, on-brand-for-the-environmental-lens angle.
9. **Disambiguation / naming.** Many beaches share names (multiple "Main Beach", "Praia da Rocha"); local/native names; pronunciation. Affects search, hreflang, and not-showing-the-wrong-beach. Worth a deliberate canonical-name + alias strategy.
10. **Site accessibility (a11y) itself.** Distinct from beach-accessibility data — the *website* should meet WCAG (alt text on the masonry galleries, contrast on the lever-colored pages, keyboard nav on lens chips). Matters for the disabled-visitor audience we're serving and for SEO.
11. **Offline / trip-pack export.** A printable/offline "beach day pack" (tides, sunset time, what to bring, rules, hazards) — high utility where signal is poor, and a shareable artifact.
12. **Golden-hour / sun-position calculator.** We have `sunset_visible` + `orientation` — a computed "sun sets over the water at 8:14pm tonight, golden hour 7:30–8:14" widget is cheap and beloved by the photographer persona.

---

## 7. Decisions for Erin (consolidated)

**Highest-leverage, decide first:**
1. **Un-defer wave/surf data?** ERA5 wave reanalysis is free and gates the entire surf persona + surfability classifier + kite persona. Recommend: yes, next enrichment priority.
2. **Ship the static `surfable: true/false/unconfirmed` flag** across all 228K now (from orientation × bathymetry), before full wave climatology? Recommend: yes.
3. **Adaptive-page model:** agree to "no 'I am a ___' gate — dominant-lens default + intent chips that re-order in place + audience marginalia"? (Reuses `lens-tabs.tsx` + `<MarginNote>`, keeps one canonical URL, respects the NN/g caution.)

**Data ingest priorities (pick the slate):**
4. Open-Meteo (self-host on Hetzner vs €29/mo?), NDBC buoys, Deltares shoreline, live tides (WorldTides cost), EOX CC-BY satellite base map.
5. **Global Fishing Watch is CC-BY-NC** — pursue commercial terms or drop the overfishing story on monetized pages?
6. Which 3 non-OSM curation investments: **accessibility**, **dog policy + seasonal dates**, **light-pollution/Bortle** (easy free win)?

**Revenue:**
7. Confirm the nearest-city/airport fields are clean enough (IATA + geocode) to template hotel/flight/tour deep links across 228K. (Glob timed out — needs verification in code.)
8. Wire Travelpayouts hotels first + Viator/GYG tours; turn on AdSense now; build the reef-safe sunscreen hub in parallel.

**Utility layer:**
9. Adopt the liability editorial rule (surface official feeds + timestamp + "last verified", never our own safety verdict; "monitored vs not" honesty).
10. Confirm OSM ODbL share-alike compatibility with our data model before deep OSM ingest.

**Multilingual:**
11. Adopt next-intl + subdirectory routing during the ISR migration (translate nothing yet)? Do we have native QA access for pilot languages (restricts the set)?
12. What's the home-country distribution of the 228K (sets home-language priority + realistic page counts)?
13. Define the GSC-impression threshold that promotes a page from English-only → localize.

**Additional topics (Section 6) — which to pull forward:** crowd intelligence, similarity engine, UGC/reviews, alerts/subscriptions, AI-citation structured data, climate-future framing.

---

## Appendix — key source pointers
- Existing assets: `site/lib/lenses.ts` (9 lenses), `site/components/lens-tabs.tsx`, `docs/legendary/data-model.md §7` (audience marginalia taxonomy), `docs/beach-page-architecture.md` (`dominant_lens`, subpage rules), `docs/superpowers/specs/2026-04-18-enrichment-v2-design.md` (**wave data deferred to Track 1b**).
- Data feeds: Open-Meteo (CC-BY/AGPL), NOAA NDBC/CDIP/OISST/CO-OPS (public domain), Copernicus Marine + ERA5 (CC-BY), Deltares Shoreline Monitor (CC-BY), EOX s2maps.eu (CC-BY 2016/17 only), NASA GIBS, Microsoft Planetary Computer, Allen Coral Atlas, EPA BEACON, SAS Safer Seas, EEA Bathing Water, WDPA/Protected Planet, ISAF/GSAF, OSM/Overpass (ODbL), Natural Earth + NGA WPI, EMODnet, aisstream.io, Windy Webcams (discovery only).
- Revenue: Travelpayouts, Viator, GetYourGuide, Tripaneer, Amazon Associates + direct reef-safe brands (Stream2Sea/Badger/Raw Elements/Thinksport), Raptive/Mediavine/AdSense.
- Multilingual: Google scaled-content-abuse policy, next-intl, hreflang/x-default best practice.
- UX precedent: NN/g audience-based-navigation caution, Surfline, AllTrails, Wikivoyage.
