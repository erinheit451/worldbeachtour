# World Beach Tour — Content Hit List

The curated build queue for "really cool beaches worth something special." ~200 beaches across 9 lenses, tiered by the depth of treatment each earns. Produced by lens-first research → DB cross-check → Opus curation, with a second-pass for under-represented regions (Japan, Korea, West Africa, Middle East, Pacific NW, India south coast). Human-auditable: argue with any row.

## How to read this

**Tier**
- **T1 — Marquee** (19): Full `LegendaryBeach` template. Main page is rich + 4-8 lens sub-pages.
- **T2 — Lens-legendary** (~110): Depth on 1-2 lenses. Main page competent; sub-page(s) on prominent lens(es) blown out.
- **T3 — Honorable mention** (~70): One striking angle, single main-page section, no sub-pages.

**Lens prominence (1-5)** — which lenses get sub-pages and how much depth. 5 = sub-page is the destination. 3-4 = deep section on main page + possible short sub-page. 1-2 = ambient mention only. **Lens IDs:** `surf · sand · history · photography · diving · environment · family · travel · culture` (culture added as 9th lens 2026-04-19).

**Status**
- `built` — content folder exists at `site/content/beaches/<slug>/`
- `ready` — in DB, notab ≥ 10 and Wikidata linked. Safe to generate.
- `thin` — in DB but under-enriched (notab < 10 or no Wikidata). **Enrich before generating** or content will lack grounding.
- `seed` — not in DB. **Must be seeded with coords + Wikidata QID** before any content work. See gap memo `project_worldbeachtour_enrichment_gap.md`.

## Decisions baked into this list

1. **Culture is now the 9th lens.** Added to `site/lib/lenses.ts` and `lens-tabs.tsx` 2026-04-19. Reason: the marquee set (Copa, Waikīkī, Bondi, Positano, Pampelonne) leans heavily on cultural identity that doesn't map cleanly to history/travel.
2. **Famous surf spots get their own DB rows** (not "named breaks" sub-objects of a parent beach). Pipeline becomes `banzai-pipeline`, not a child of Ehukai Beach Park. Reason: each named break has its own audience, photography, history, and SEO target. This matches the `feedback_landmark_vs_template.md` rule — build the landmark with depth.
3. **Data work blocks content work.** ~150 thin rows + ~125 seed rows must be enriched/seeded before Haiku content gen produces grounded output for those beaches.

## Critical findings from cross-check

Of 380 candidate lookups (round 1 + round 2):

| Status | Count | Meaning |
|---|---|---|
| built | 51 | Already has an MDX content folder |
| ready | 22 | In DB, well-enriched (notab≥10 + WD), unbuilt |
| thin | 156 | In DB but under-enriched — **blocks quality generation** |
| seed | 151 | Not in DB at all — **requires manual seeding** |

**Phase order:**
1. **Phase 1 — Enrich the `thin` rows.** Wikidata QID backfill + Wikipedia pageview backfill on ~156 named rows. Builds on existing gap memo.
2. **Phase 2 — Seed the `seed` rows.** Create DB rows from Wikipedia coords + QIDs. ~151 rows. Many are surf spots / atolls / WW2 invasion beaches that OSM doesn't tag as "beach."
3. **Phase 3 — Generate content** in tier order: T1 marquee (hand-shaped) → T2 batch via Haiku subagents with hand review → T3 lighter review.

---

## TIER 1 — Marquee (19)

Full `LegendaryBeach` template. Main page is the experience; lens sub-pages are depth destinations.

| Slug | Name | Country | Lens prominence | Status | Why marquee |
|---|---|---|---|---|---|
| copacabana-7 | Copacabana | BR | travel:5 culture:5 history:4 surf:3 | built | Rio's front-facing beach, mosaic, NYE, Girl from Ipanema cultural nexus |
| waikiki-beach-1 | Waikīkī | US-HI | travel:5 surf:5 history:4 culture:4 | built | Birthplace of modern surfing (Duke), Mālama, Hawaiian monarchy coast |
| bondi-beach | Bondi Beach | AU | travel:5 surf:4 culture:5 history:3 | built | Bondi Rescue, shark nets, Icebergs, Gadigal Country |
| praia-do-norte-6 | Praia do Norte (Nazaré) | PT | surf:5 photography:4 history:3 | built | Canyon-funneled 100ft+ waves, McNamara, fishing heritage |
| banzai-pipeline | Banzai Pipeline | US-HI | surf:5 history:4 photography:4 culture:3 | **seed** | Most filmed wave on earth — Eddie, NSSA, banzai reef bathymetry |
| omaha-beach | Omaha Beach | FR | history:5 travel:3 environment:2 | thin | D-Day, American Cemetery, pilgrimage coast |
| teahupoo | Teahupoʻo | PF | surf:5 history:3 photography:4 | **seed** | 2024 Olympics, heaviest wave on earth, reef physics |
| jeffreys-bay | Jeffrey's Bay | ZA | surf:5 history:3 culture:3 | **seed** | World's best right pointbreak, J-Bay Open |
| glass-beach-3 | Glass Beach (Fort Bragg) | US-CA | sand:5 history:5 environment:3 | thin | Dump-origin sea glass, geology + cleanup story |
| reynisfjara | Reynisfjara | IS | sand:5 photography:5 environment:3 | thin | Basalt columns, black sand, sneaker-wave deaths |
| whitehaven-beach | Whitehaven Beach | AU | sand:5 travel:4 photography:4 | **seed** | 98% silica, Hill Inlet swirl, Whitsundays icon |
| anse-source-d-argent | Anse Source d'Argent | SC | sand:5 photography:5 travel:4 | **seed** | La Digue granite boulders, La Digue iconic |
| maya-bay | Maya Bay (Phi Phi Leh) | TH | travel:5 photography:5 environment:4 culture:3 | **seed** | *The Beach* movie, reopened post-restoration |
| cannon-beach | Cannon Beach | US-OR | photography:5 travel:4 environment:3 culture:3 | **seed** | Haystack Rock (Goonies), PNW icon |
| navagio-beach | Navagio (Shipwreck Beach) | GR | photography:5 history:3 travel:4 | thin | MV Panagiotis wreck in limestone cove, Zakynthos icon |
| tulum-beach | Tulum Beach | MX | travel:5 history:4 culture:4 | thin | Mayan cliffside ruins on Caribbean, boho icon |
| sipadan | Sipadan | MY | diving:5 environment:5 | **seed** | World-class coral wall, Borneo — permit-limited UNESCO candidate |
| boulders-beach | Boulders Beach | ZA | environment:5 family:4 | thin (n=32.8) | African penguin colony, Simon's Town — highest-notab seed candidate |
| varkala-beach | Varkala Beach | IN | culture:5 travel:4 photography:4 | **ready** (n=36.0) | Cliff-top temple beach, Ayurvedic + Hindu pilgrimage, India's photogenic south coast — surfacing this as marquee gives India a flagship. |

---

## TIER 2 — Lens-legendary (~110)

Depth on 1-2 lenses. Grouped by primary lens for review.

### T2 / SURF (32)

| Slug | Name | Country | Lens prominence | Status | The angle |
|---|---|---|---|---|---|
| sunset-beach-northshore | Sunset Beach | US-HI | surf:5 history:3 | **seed** | North Shore winter big-wave, Triple Crown |
| waimea-bay | Waimea Bay | US-HI | surf:5 history:4 | **seed** | The Eddie big-wave invitational |
| honolua-bay | Honolua Bay | US-HI | surf:5 environment:4 | **seed** | Maui righthander, MLCD protected |
| mavericks | Mavericks | US-CA | surf:5 history:3 | **seed** | Half Moon Bay big-wave proving ground |
| trestles | Trestles (Lower/Upper) | US-CA | surf:5 culture:3 | **seed** | WSL Finals venue, San Onofre State Beach |
| malibu-lagoon-state-beach-2 | Malibu Surfrider | US-CA | surf:5 history:4 culture:4 | thin | First Point, Gidget, birthplace of modern surf culture |
| huntington-beach-1 | Huntington Pier | US-CA | surf:4 family:4 culture:4 | thin | "Surf City USA", US Open, walk of fame |
| ocean-beach-sf | Ocean Beach SF | US-CA | surf:4 environment:3 | **seed** | Heavy beach-break under Sutro baths |
| steamer-lane | Steamer Lane | US-CA | surf:5 history:3 | **seed** | Santa Cruz icon, Lighthouse Point |
| rincon-point | Rincon | US-CA | surf:5 | **seed** | "Queen of the Coast", Santa Barbara |
| black-s-beach-2 | Black's Beach | US-CA | surf:5 environment:3 | built | Torrey Pines submarine canyon powers the wave |
| cloud-9-siargao | Cloud 9 | PH | surf:5 travel:3 | **seed** | Siargao reef pass, put the Philippines on the surf map |
| uluwatu | Uluwatu | ID | surf:5 culture:3 | **seed** | Bali's signature left, Pura Luhur temple overlook |
| padang-padang | Padang Padang | ID | surf:5 | **seed** | "Balinese Pipeline" barrel |
| desert-point-lombok | Desert Point | ID | surf:5 | **seed** | Lombok reef left, one of the best on earth |
| g-land-plengkung | G-Land / Plengkung | ID | surf:5 environment:4 | **seed** | Java jungle left in national park |
| cloudbreak-tavarua | Cloudbreak | FJ | surf:5 | **seed** | Tavarua reef pass |
| bells-beach | Bells Beach | AU | surf:5 history:4 culture:3 | thin | Rip Curl Pro home break since 1961 |
| snapper-rocks-superbank | Snapper Rocks / Superbank | AU | surf:5 | **seed** | World's longest sand-bottom right |
| kirra | Kirra | AU | surf:5 | **seed** | Superbank's shallowest barrel section |
| margaret-river | Margaret River | AU | surf:5 travel:3 | thin | WA reef-break power, wine region overlap |
| shipsterns-bluff | Shipsterns Bluff | AU | surf:5 photography:4 | **seed** | Tasmanian slab wave, stepladder lip |
| raglan-manu-bay | Raglan / Manu Bay | NZ | surf:5 culture:3 | **seed** | Endless Summer left |
| piha-beach | Piha | NZ | surf:5 environment:4 culture:3 | thin | Heavy black-iron-sand break, Lion Rock |
| punta-de-lobos | Punta de Lobos | CL | surf:5 environment:3 | thin | Chile pointbreak, coastal conservation story |
| chicama | Chicama | PE | surf:5 | **seed** | Reportedly world's longest left |
| puerto-escondido-zicatela | Puerto Escondido (Zicatela) | MX | surf:5 culture:3 | **seed** | "Mexican Pipeline" — heavy beach-break |
| pavones | Pavones | CR | surf:5 | **seed** | Long left on the Osa side |
| mullaghmore-head | Mullaghmore Head | IE | surf:5 photography:4 | **seed** | Irish big-wave slab |
| skeleton-bay | Skeleton Bay | NA | surf:5 environment:5 photography:5 | **seed** | Longest left ever filmed, fog desert coast |
| mundaka | Mundaka | ES | surf:5 culture:3 | **seed** | Basque country rivermouth left |
| hossegor-1 | Hossegor (La Gravière) | FR | surf:5 travel:3 | thin | French beach-break HQ, Quik Pro |
| supertubos | Supertubos | PT | surf:5 | thin | Peniche A-frame, MEO Pro Portugal |

### T2 / SAND & GEOLOGY (28)

| Slug | Name | Country | Lens prominence | Status | The angle |
|---|---|---|---|---|---|
| diamond-beach-jokulsarlon | Diamond Beach (Jökulsárlón) | IS | sand:5 photography:5 | **seed** | Glacier ice chunks on black sand |
| punaluu | Punaluʻu | US-HI | sand:5 environment:4 | **seed** | Hawaiian black sand + hawksbill/green turtles |
| papakolea | Papakōlea | US-HI | sand:5 | **seed** | Green olivine sand (one of four globally) |
| kaihalulu-beach | Kaihalulu | US-HI | sand:5 | thin | Maui red-sand cinder cone beach |
| pfeiffer-beach | Pfeiffer Beach | US-CA | sand:5 photography:5 | **seed** | Manganese-garnet purple sand, keyhole arch |
| bowling-ball-beach | Bowling Ball Beach | US-CA | sand:5 | built | Schooner Gulch concretions |
| pink-sands-beach-harbour-island | Pink Sands Beach | BS | sand:5 travel:4 | **seed** | Harbour Island pink from foram fragments |
| elafonissi | Elafonissi | GR | sand:5 travel:4 | **seed** | Crete pink + lagoon |
| balos-lagoon | Balos Lagoon | GR | sand:4 travel:4 photography:4 | thin | Crete turquoise lagoon |
| spiaggia-rosa-budelli | Spiaggia Rosa (Budelli) | IT | sand:5 environment:4 | **seed** | Sardinia pink, closed to foot traffic |
| hyams-beach | Hyams Beach | AU | sand:5 travel:3 | thin | "Whitest sand" (Guinness era) |
| lucky-bay | Lucky Bay | AU | sand:5 environment:3 | thin | Squeaky white sand + roo neighbors |
| cable-beach-6 | Cable Beach | AU | sand:4 travel:4 culture:3 | built | Broome 22km, red-dirt cliffs, camel train sunset |
| praia-do-sancho | Praia do Sancho | BR | sand:5 photography:5 environment:4 | thin | Fernando de Noronha cliff descent, often ranked #1 |
| etretat | Étretat | FR | sand:5 photography:5 history:3 culture:3 | **seed** | Chalk arches and needle, Monet painted |
| durdle-door | Durdle Door | GB | sand:5 photography:5 | **seed** | Limestone arch, Jurassic Coast |
| old-harry-rocks | Old Harry Rocks | GB | sand:4 photography:4 | **seed** | Chalk stacks, Dorset |
| giants-causeway-beach | Giant's Causeway shore | GB | sand:5 environment:3 | **seed** | Basalt columns, Antrim |
| cathedral-cove-1 | Cathedral Cove | NZ | sand:5 photography:5 | thin | Coromandel sea arch, Narnia film location |
| wharariki-beach | Wharariki Beach | NZ | sand:5 photography:5 | **seed** | Sea stacks + sand patterns |
| moeraki-koekohe | Moeraki (Koekohe) | NZ | sand:5 photography:5 | **seed** | Spherical concretions, Otago |
| shell-beach-2 | Shell Beach | AU | sand:5 environment:4 | thin | Shark Bay all-cockle, UNESCO |
| praia-da-falesia | Praia da Falésia | PT | sand:4 photography:4 | thin | Red-cliff Algarve 6km |
| cox-bazar | Cox's Bazar | BD | sand:4 travel:3 | **seed** | Longest natural sea beach (~120km) |
| algar-de-benagil | Algar de Benagil | PT | photography:5 sand:4 | **seed** | Sea cave with ceiling oculus |
| praia-da-marinha | Praia da Marinha | PT | sand:5 photography:5 | thin | Algarve arches, "most beautiful in Europe" (ranked) |
| cala-goloritze | Cala Goloritzé | IT | sand:5 photography:5 | **seed** | Sardinia limestone needle |
| singing-sands-eigg | Singing Sands (Eigg) | GB | sand:5 environment:3 | **seed** | Quartz sand booms underfoot |

### T2 / HISTORY (23)

| Slug | Name | Country | Lens prominence | Status | The angle |
|---|---|---|---|---|---|
| utah-beach | Utah Beach | FR | history:5 | thin | D-Day US 4th Division |
| juno-beach | Juno Beach | FR | history:5 | thin | D-Day Canadian landings |
| gold-beach | Gold Beach | FR | history:5 | thin | D-Day British landings |
| sword-beach | Sword Beach | FR | history:5 | thin | D-Day British east flank |
| pointe-du-hoc-1 | Pointe du Hoc | FR | history:5 photography:3 | thin | Rangers' cliff assault |
| anzio | Anzio | IT | history:5 | **seed** | 1944 Allied landing, breakout stalemate |
| iwo-jima-suribachi | Iwo Jima (Suribachi) | JP | history:5 | **seed** | Flag-raising, 1945 |
| tarawa-betio | Tarawa (Betio) | KI | history:5 | **seed** | 1943 US Marines, brutal three-day |
| peleliu | Peleliu beaches | PW | history:5 | **seed** | 1944 Marines, Nakagawa's cave defense |
| guadalcanal-red-beach | Guadalcanal (Red Beach) | SB | history:5 | **seed** | 1942 first US offensive in Pacific |
| anzac-cove | ANZAC Cove | TR | history:5 travel:3 culture:3 | **seed** | 1915 ANZAC landing, pilgrimage |
| inchon | Inchon | KR | history:5 | **seed** | 1950 MacArthur's amphibious gamble |
| dunkirk-2 | Dunkirk | FR | history:5 | thin | 1940 Operation Dynamo |
| playa-giron | Playa Girón (Bay of Pigs) | CU | history:5 | **seed** | 1961 CIA-backed invasion |
| dieppe-beach | Dieppe Beach | FR | history:5 | **seed** | 1942 Canadian raid, D-Day lessons |
| goree-island | Gorée Island shore | SN | history:5 culture:4 | **seed** | Door of No Return, slave trade UNESCO |
| cape-coast-beach | Cape Coast Beach | GH | history:5 culture:4 | thin | Slave-trade castle, Obama visit |
| elmina-beach | Elmina Beach | GH | history:5 | thin | Oldest European structure in sub-Saharan Africa |
| san-carlos-falklands | San Carlos | FK | history:5 | **seed** | 1982 Falklands landing ("Bomb Alley") |
| marathon-beach | Marathon Beach | GR | history:5 | thin | 490 BC Persian-war landing |
| trafalgar-cadiz | Trafalgar (Cádiz) | ES | history:5 | **seed** | 1805 naval battle, Nelson |
| my-khe-china-beach | My Khe (China Beach) | VN | travel:4 history:5 | **seed** | Da Nang, R&R during Vietnam War |
| omaha-beach-3 | Omaha Beach (alt slug) | FR | history:5 | built | Already has content folder — verify vs `omaha-beach` and dedupe |

### T2 / PHOTOGRAPHY (18)

| Slug | Name | Country | Lens prominence | Status | The angle |
|---|---|---|---|---|---|
| uttakleiv-haukland | Uttakleiv / Haukland | NO | photography:5 environment:4 | **seed** | Lofoten arctic mountain-meets-beach |
| ramberg | Ramberg | NO | photography:5 | **seed** | Lofoten white sand |
| kvalvika | Kvalvika | NO | photography:5 | **seed** | Lofoten hike-in |
| saksun-faroe | Saksun (Faroe) | FO | photography:5 | **seed** | Tidal lagoon, black church |
| praia-do-camilo | Praia do Camilo | PT | photography:5 | **seed** | Algarve staircase-in-cliff |
| anse-lazio | Anse Lazio | SC | photography:5 travel:4 | built | Praslin's postcard beach |
| lopes-mendes | Lopes Mendes | BR | photography:5 travel:3 | **seed** | Ilha Grande 3km arc |
| hokitika | Hokitika | NZ | photography:5 environment:3 | **seed** | Driftwood beach, West Coast |
| wineglass-bay | Wineglass Bay | AU | photography:5 environment:4 | thin | Tasmania crescent, Freycinet |
| twelve-apostles-marine-national-park-2 | Twelve Apostles | AU | photography:5 | thin | Victoria limestone stacks |
| phra-nang | Phra Nang | TH | photography:5 travel:4 | **seed** | Krabi limestone, Princess Cave |
| railay-beach | Railay | TH | photography:5 travel:4 | thin | Karst peninsula |
| halong-bay-coves | Halong Bay coves | VN | photography:5 travel:4 | **seed** | Karst seascape UNESCO |
| el-nido | El Nido | PH | photography:5 travel:5 | thin | Bacuit Bay twin/hidden beaches |
| coron-kayangan | Coron (Kayangan) | PH | photography:5 diving:3 | **seed** | Limestone lake-beach |
| mcway-cove | McWay Cove | US-CA | photography:5 | **seed** | Big Sur waterfall on beach |
| bandon-beach | Bandon Beach | US-OR | photography:5 | **seed** | Sea stacks, Face Rock |
| ruby-second-beach | Ruby Beach / Second Beach | US-WA | photography:5 environment:3 | **seed** | Olympic NP / La Push sea stacks |
| jodogahama | Jodogahama | JP | photography:5 sand:4 | **seed** | Iwate basalt formations, "Pure Land" beach |

### T2 / DIVING (17)

| Slug | Name | Country | Lens prominence | Status | The angle |
|---|---|---|---|---|---|
| tubbataha-reef | Tubbataha Reef | PH | diving:5 environment:5 | **seed** | Sulu Sea pinnacle, UNESCO |
| raja-ampat | Raja Ampat | ID | diving:5 environment:5 | **seed** | Highest marine biodiversity on earth |
| bunaken | Bunaken | ID | diving:5 | **seed** | Sulawesi steep coral walls |
| lembeh-strait | Lembeh Strait | ID | diving:5 | **seed** | Muck-dive / critter capital |
| hanifaru-bay | Hanifaru Bay | MV | diving:5 environment:5 | **seed** | Manta + whale shark feeding frenzy |
| radhanagar-beach | Radhanagar Beach | IN | diving:4 travel:5 | **seed** | Havelock, Andamans #1 ranked |
| similan-islands | Similan Islands | TH | diving:5 | **seed** | Granite boulder dives |
| heron-island | Heron Island | AU | diving:5 environment:5 | thin | GBR coral cay, turtle rookery |
| lady-elliot-island | Lady Elliot | AU | diving:5 environment:4 | **seed** | Manta + turtle cleaning stations |
| ningaloo-coral-bay | Ningaloo (Coral Bay) | AU | diving:5 environment:5 | **seed** | Whale-shark snorkel |
| cocos-island-cr | Cocos Island | CR | diving:5 environment:5 | **seed** | Hammerhead schools, UNESCO |
| stingray-city | Stingray City | KY | diving:4 family:4 | **seed** | Grand Cayman sandbar swim-with |
| dahab-blue-hole | Dahab (Blue Hole) | EG | diving:5 history:3 | **seed** | Free-dive landmark, memorial wall |
| aliwal-shoal | Aliwal Shoal | ZA | diving:5 | **seed** | Ragged-tooth + tiger sharks |
| aldabra-atoll | Aldabra Atoll | SC | diving:5 environment:5 | **seed** | Pristine UNESCO atoll |
| chuuk-truk-lagoon | Chuuk (Truk) Lagoon | FM | diving:5 history:5 | **seed** | WWII Japanese fleet wrecks |
| scapa-flow | Scapa Flow | GB | diving:5 history:5 | **seed** | Scuttled WWI German fleet |

### T2 / ENVIRONMENT & WILDLIFE (17)

| Slug | Name | Country | Lens prominence | Status | The angle |
|---|---|---|---|---|---|
| ostional | Ostional | CR | environment:5 | **seed** | Olive ridley arribada mass nesting |
| tortuguero | Tortuguero | CR | environment:5 | **seed** | Green turtle nesting mecca |
| playa-grande-baulas | Playa Grande (Las Baulas) | CR | environment:5 | **seed** | Leatherback nesting protected |
| praia-do-forte | Praia do Forte | BR | environment:5 culture:3 | thin | TAMAR turtle program HQ |
| mon-repos | Mon Repos | AU | environment:5 | **seed** | Loggerhead nesting, Bundaberg |
| nungwi-beach | Nungwi | TZ | environment:4 travel:4 | thin | Zanzibar turtle conservancy |
| phillip-island-penguin | Phillip Island | AU | environment:5 family:5 | **seed** | Little penguin parade |
| bay-of-fires | Bay of Fires | AU | environment:4 photography:5 | thin | Orange lichen rocks |
| punta-tombo | Punta Tombo | AR | environment:5 | **seed** | Magellanic penguin colony (500K pairs) |
| valdes-peninsula | Valdés Peninsula | AR | environment:5 | **seed** | Orcas surf-strand for seals |
| hervey-bay | Hervey Bay | AU | environment:5 | **seed** | Humpback nursery bay |
| kaikoura | Kaikōura | NZ | environment:5 | **seed** | Sperm whales year-round |
| san-ignacio-lagoon | San Ignacio Lagoon | MX | environment:5 | **seed** | "Friendly" grey whales |
| la-jolla-cove | La Jolla Cove | US-CA | environment:5 family:4 | thin | Sea-lion haul-out on stairs |
| ano-nuevo | Año Nuevo | US-CA | environment:5 | thin | Elephant-seal rookery |
| volunteer-point | Volunteer Point | FK | environment:5 | **seed** | Accessible king-penguin colony |
| donsol | Donsol | PH | environment:5 | **seed** | Whale-shark interaction |

### T2 / FAMILY (18)

| Slug | Name | Country | Lens prominence | Status | The angle |
|---|---|---|---|---|---|
| siesta-beach | Siesta Key | US-FL | family:5 sand:4 | thin | Quartz-powder sand, consistent "best" ranking |
| clearwater-beach | Clearwater | US-FL | family:5 travel:3 | thin | Archetypal Gulf resort beach |
| coronado-beach-ca | Coronado | US-CA | family:5 culture:3 | **seed** | Calm + Hotel del Coronado |
| la-jolla-shores-beach | La Jolla Shores | US-CA | family:5 environment:3 | thin | Gentle waves + tidepools |
| carmel-beach | Carmel Beach | US-CA | family:4 photography:3 | thin | White sand, pet-friendly |
| hapuna-beach-state-recreation-area | Hapuna | US-HI | family:5 | thin | Big Island swim icon |
| kaanapali | Kāʻanapali | US-HI | family:5 travel:4 | **seed** | Maui resort core, Black Rock |
| bournemouth-beach | Bournemouth | GB | family:5 culture:3 | thin | British seaside pier classic |
| brighton-beach-1 | Brighton Beach | GB | family:5 culture:4 | built | Pebble pier, Palace Pier |
| scheveningen-beach | Scheveningen | NL | family:5 history:3 | thin | The Hague resort, Kurhaus |
| sylt-1 | Sylt (Westerland) | DE | family:4 | thin | German chic family island |
| virginia-beach | Virginia Beach | US-VA | family:5 | **seed** | Boardwalk family, Navy town |
| myrtle-beach | Myrtle Beach | US-SC | family:5 travel:3 | **seed** | Family resort capital of Grand Strand |
| cape-may | Cape May | US-NJ | family:5 culture:4 | thin | Victorian family beach, oldest US resort |
| surfers-paradise-beach | Surfers Paradise | AU | family:5 travel:4 | thin | Gold Coast family high-rise |
| cottesloe-beach | Cottesloe | AU | family:5 | thin | Perth's iconic family beach |
| mission-beach | Mission Beach | US-CA | family:4 culture:3 | thin | Boardwalk + Belmont Park |
| haeundae-beach | Haeundae Beach | KR | family:5 travel:5 culture:4 | **ready** (n=29.3) | Busan #1, summer festival, Korea's flagship beach |

### T2 / TRAVEL & DESTINATION (22)

| Slug | Name | Country | Lens prominence | Status | The angle |
|---|---|---|---|---|---|
| matira-bora-bora | Matira Beach (Bora Bora) | PF | travel:5 photography:4 | **seed** | Bora Bora public beach, lagoon |
| aitutaki-lagoon | Aitutaki Lagoon | CK | travel:5 photography:4 | **seed** | Cook Islands lagoon archetype |
| paradise-mykonos | Super Paradise / Paradise (Mykonos) | GR | travel:5 culture:4 | **seed** | Mykonos party-beach archetype |
| perissa-beach-1 | Perissa / Kamari | GR | travel:4 sand:3 | thin | Santorini volcanic black |
| ses-salines-beach | Ses Salines | ES | travel:4 culture:3 | thin | Ibiza salt-flats beach |
| illetes-formentera | Formentera (Illetes) | ES | travel:5 sand:4 | **seed** | "Caribbean of Europe" |
| marina-piccola-capri | Marina Piccola (Capri) | IT | travel:5 photography:4 | **seed** | Faraglioni view |
| positano-beach | Positano Beach | IT | travel:5 culture:5 | **seed** | Amalfi cliffside |
| monterosso-cinque-terre | Monterosso al Mare | IT | travel:4 culture:3 | **seed** | Cinque Terre beach access |
| pampelonne | Pampelonne | FR | travel:5 culture:5 | **seed** | St-Tropez glamour beach |
| shoal-bay-east | Shoal Bay East | AI | travel:5 sand:4 | thin | Anguilla #1 beach |
| holbox | Holbox | MX | travel:5 environment:4 | **seed** | Whale-shark island, no cars |
| mirissa-arugam-bay | Mirissa / Unawatuna / Arugam Bay | LK | travel:5 surf:4 culture:3 | **seed** | Sri Lanka south coast trio |
| calangute-beach | Calangute / Anjuna / Palolem | IN | travel:5 culture:4 | thin | Goa A-list, hippie legacy |
| patong-beach | Patong / Kata / Karon | TH | travel:5 | thin | Phuket family/party trio |
| boracay-white-beach | Boracay (White Beach) | PH | travel:5 sand:5 | **seed** | Powdery 4km destination |
| manuel-antonio-beach | Manuel Antonio | CR | travel:5 environment:5 | thin | Pacific resort + monkeys + park |
| punta-del-este | Punta del Este | UY | travel:4 culture:4 | **seed** | South-American Hamptons |
| jericoacoara-pipa | Jericoacoara / Pipa / Trancoso | BR | travel:5 culture:4 | **seed** | Brazilian NE A-list trio |
| ipanema-beach | Ipanema | BR | travel:5 culture:5 surf:3 | thin | Rio's other front beach, bossa nova |
| camps-bay-beach | Camps Bay | ZA | travel:5 photography:4 | thin | Cape Town glam strip below Twelve Apostles |
| long-beach-tofino | Long Beach (Tofino) | CA | travel:5 surf:4 environment:4 | **ready** (n=25.0) | Pacific Rim NP, Tofino's signature, BC's wild west coast |

### T2 / CULTURE (NEW LENS, 8)

Beaches whose primary identity is cultural — not just travel destinations but cultural touchstones with story, identity, ritual.

| Slug | Name | Country | Lens prominence | Status | The angle |
|---|---|---|---|---|---|
| yuigahama | Yuigahama | JP | culture:5 history:4 family:3 | **ready** (n=21.6) | Kamakura's ancient surf beach, samurai-era backdrop, classic Japanese summer |
| santa-maria-cv | Santa Maria (Sal) | CV | culture:5 travel:4 | **ready** (n=18.2) | Cape Verde's main beach town, morna music, Cesaria Evora coast |
| tel-aviv-gordon | Tel Aviv (Gordon/Frishman) | IL | culture:5 travel:5 | thin | Mediterranean city beach, Bauhaus city + matkot + Friday sunset rituals |
| varanasi-ghats | Varanasi Ghats (river beach) | IN | culture:5 history:5 | **seed** (river not sea) | Hindu cremation ghats — only included if scope expands beyond ocean |
| bali-uluwatu-temple-beach | Pura Luhur Uluwatu | ID | culture:5 surf:3 | **seed** | Cliff temple + Kecak fire dance + Uluwatu surf beneath |
| iona-island-beach | Iona | GB | culture:5 history:5 | **seed** | Cradle of Scottish Christianity, white-shell beach, abbey |
| mont-saint-michel-beach | Mont-Saint-Michel tidal flats | FR | culture:5 history:5 photography:5 | **seed** | Tidal abbey island — beach is the path that appears at low tide |
| ngor | Plage de Ngor | SN | culture:4 surf:4 | thin | Dakar surf birthplace, Endless Summer location, Sabar drumming culture |

---

## TIER 3 — Honorable mentions (~70)

Single striking angle, one section on main page, no sub-page. Tabled for uniformity. Generate as part of T2 batch if time permits; otherwise deferred until top tiers ship.

### T3 / SURF

| Slug | Name | Country | Status | Angle |
|---|---|---|---|---|
| burleigh-heads | Burleigh Heads | AU | thin | QLD pointbreak |
| byron-bay-pass | Byron Bay (The Pass) | AU | **seed** | Longboard wave |
| imsouane | Imsouane | MA | **seed** | Long-ride right pointbreak |
| pichilemu | Pichilemu | CL | **seed** | Chile big-wave hub (Punta de Lobos parent town) |
| mancora | Máncora | PE | **seed** | North Peru point |
| tamarindo | Tamarindo | CR | **seed** | Beginner mecca |
| sayulita | Sayulita | MX | **seed** | Beginner mecca |
| witches-rock | Witch's Rock / Ollie's Point | CR | **seed** | Endless Summer II locations |
| coxos | Coxos | PT | **seed** | Ericeira power right |
| thurso-east | Thurso East | GB | **seed** | Scotland reef break |
| anchor-point-ma | Anchor Point | MA | **seed** | Morocco's signature right |
| niijima | Niijima | JP | **seed** | Tokyo islands surf |
| hyeopjae | Hyeopjae Beach | KR | thin | Jeju west coast surf + Biyangdo view |

### T3 / SAND

| Slug | Name | Country | Status | Angle |
|---|---|---|---|---|
| praia-da-falesia | Praia da Falésia | PT | thin | (also in T2 sand — borderline) |
| adraga | Praia da Adraga | PT | **seed** | Sintra cliffs |
| cala-mariolu | Cala Mariolu | IT | **seed** | Sardinia white pebbles |
| la-pelosa | La Pelosa | IT | **seed** | Sardinia turquoise + tower |
| sandymouth | Sandymouth | GB | **seed** | Cornwall striped cliffs |
| kynance | Kynance Cove | GB | **seed** | Cornwall serpentine |
| talisker | Talisker Bay | GB | **seed** | Skye black/grey sand |
| ramla-bay-gozo | Ramla Bay | MT | **seed** | Gozo red sand |
| praia-vermelha | Praia Vermelha | BR | thin | Red sand at Sugarloaf |
| hidden-beach-marieta | Hidden Beach (Marieta) | MX | **seed** | Crater roof collapse |
| ulong-beach-palau | Ulong Beach | PW | **seed** | Survivor location, white crescent |
| spiaggia-di-citara | Spiaggia di Citara | IT | thin | Ischia thermal volcanic |

### T3 / HISTORY

| Slug | Name | Country | Status | Angle |
|---|---|---|---|---|
| salerno-paestum | Salerno (Paestum) | IT | **seed** | 1943 landing |
| saipan-beaches | Saipan | MP | **seed** | 1944 invasion |
| tinian | Tinian | MP | **seed** | Atomic-bomb staging |
| bunce-island | Bunce Island | SL | **seed** | Slave-trade fortress |
| kwajalein | Kwajalein | MH | **seed** | 1944 invasion |
| maleme-crete | Maleme | GR | **seed** | 1941 paratroop invasion of Crete |
| plymouth-rock-area | Plymouth Rock area | US-MA | **seed** | Pilgrim landing |
| botany-bay-cook | Botany Bay | AU | **seed** | Cook 1770 landing |
| drakes-beach | Drake's Beach | US-CA | **seed** | Drake's 1579 California claim |
| pevensey-bay | Pevensey Bay | GB | **seed** | William Conqueror landing |
| hastings-shore | Hastings shore | GB | **seed** | 1066 area |
| ostia-antica | Ostia Antica | IT | **seed** | Roman seaport |
| mers-el-kebir | Mers-el-Kébir | DZ | **seed** | 1940 French fleet attack |
| plymouth-hoe | Plymouth Hoe | GB | **seed** | Drake's bowls / Armada |

### T3 / PHOTOGRAPHY

| Slug | Name | Country | Status | Angle |
|---|---|---|---|---|
| sandur-faroe | Sandur (Faroe) | FO | **seed** | Faroe basalt + sea stacks |
| porquerolles-notre-dame | Plage de Notre-Dame (Porquerolles) | FR | **seed** | Mediterranean turquoise |
| loch-ard-gorge | Loch Ard Gorge | AU | thin | Stack-and-arch beach |
| aoshima-miyazaki | Aoshima | JP | **seed** | "Devil's Washboard" rock pavement |
| shi-shi-beach | Shi Shi Beach | US-WA | thin | Sea-stack hike-in |

### T3 / DIVING

| Slug | Name | Country | Status | Angle |
|---|---|---|---|---|
| mabul | Mabul | MY | **seed** | Macro/muck capital |
| layang-layang | Layang Layang | MY | **seed** | Hammerhead atoll |
| apo-island | Apo Island | PH | **seed** | Marine sanctuary |
| anilao | Anilao | PH | **seed** | Macro mecca |
| wakatobi | Wakatobi | ID | **seed** | Coral triangle |
| coron-wrecks | Coron Wrecks | PH | **seed** | WWII Japanese fleet (separate from Kayangan) |
| surin-islands | Surin Islands | TH | **seed** | Manta cleaning |
| ko-tao | Ko Tao | TH | **seed** | Cheapest cert in world |
| rottnest | Rottnest Island | AU | **seed** | Quokka + reef |
| lord-howe | Lord Howe Island | AU | **seed** | Southernmost coral |
| bonaire-shore | Bonaire shore-dive sites | BQ | **seed** | Klein Bonaire etc |
| klein-curacao | Klein Curaçao | CW | **seed** | Tug wreck + day trip |
| hol-chan | Hol Chan / Shark Ray Alley | BZ | **seed** | Belize barrier reef |
| roatan-west-bay | Roatán West Bay | HN | **seed** | Mesoamerican reef |
| cozumel-palancar | Cozumel (Palancar etc) | MX | **seed** | Drift-dive walls |
| marsa-alam | Marsa Alam | EG | **seed** | Dolphin house |
| sodwana-bay | Sodwana Bay | ZA | **seed** | Coelacanth coast |
| bikini-atoll | Bikini Atoll | MH | **seed** | Saratoga + nuclear wrecks |

### T3 / ENVIRONMENT

| Slug | Name | Country | Status | Angle |
|---|---|---|---|---|
| rekawa | Rekawa | LK | **seed** | Sri Lanka turtle nesting |
| akumal | Akumal | MX | thin | Green-turtle snorkel |
| christmas-island-shore | Christmas Island shore | CX | **seed** | Red-crab migration |
| turquoise-bay-ningaloo | Turquoise Bay | AU | **seed** | Drift snorkel turtles |
| misali-island | Misali Island | TZ | **seed** | Coral + turtle |
| mafia-island | Mafia Island | TZ | **seed** | Whale-shark season |
| pulau-tiga | Pulau Tiga | MY | **seed** | Snake island (Borneo) |
| salisbury-plain-sg | Salisbury Plain | GS | **seed** | South Georgia king-penguin sweep |
| st-andrews-bay-sg | St Andrews Bay | GS | **seed** | Largest king-penguin colony |
| piedras-blancas | Piedras Blancas | US-CA | **seed** | Roadside elephant seals |

### T3 / FAMILY

| Slug | Name | Country | Status | Angle |
|---|---|---|---|---|
| st-pete-beach | St. Pete Beach | US-FL | thin | Long calm Gulf shore |
| rehoboth | Rehoboth | US-DE | **seed** | Family Delaware boardwalk |
| wildwood | Wildwood | US-NJ | **seed** | Boardwalk family classic |
| nags-head | Nags Head (Outer Banks) | US-NC | **seed** | Wide family shore |
| daytona | Daytona Beach | US-FL | **seed** | Drive-on family beach |
| ocean-city-md | Ocean City | US-MD | **seed** | Boardwalk family |
| lloret-de-mar | Lloret de Mar | ES | thin | Costa Brava family resort |
| marbella | Marbella | ES | thin | Costa del Sol family |
| rimini | Rimini | IT | thin | Italian Riviera family |
| forte-dei-marmi | Forte dei Marmi | IT | thin | Tuscany family chic |
| lido-di-jesolo | Lido di Jesolo | IT | thin | Venice family lido |
| warnemunde | Warnemünde | DE | **seed** | Baltic family beach |
| sunny-beach-bg | Sunny Beach | BG | thin | Black Sea package archetype |
| mamaia | Mamaia | RO | thin | Romanian Black Sea resort |

### T3 / TRAVEL & CULTURE

| Slug | Name | Country | Status | Angle |
|---|---|---|---|---|
| temae | Temae | PF | **seed** | Moorea accessible beach |
| reduit | Reduit | LC | **seed** | St Lucia main beach |
| anse-chastanet | Anse Chastanet | LC | **seed** | St Lucia Pitons backdrop |
| half-moon-bay-ag | Half Moon Bay (Antigua) | AG | **seed** | Atlantic Antigua crescent |
| dickenson-bay | Dickenson Bay | AG | **seed** | Antigua resort beach |
| st-jean-stbarth | St Jean / Gouverneur | BL | **seed** | St-Barth glamour |
| meads-bay-anguilla | Meads Bay | AI | **seed** | Anguilla resort beach |
| medano-cabo | Médano | MX | **seed** | Cabo party beach |
| lovers-beach-cabo | Lover's Beach | MX | **seed** | Cabo arch beach |
| mar-del-plata | Mar del Plata | AR | thin | Argentine resort |
| joaquina-floripa | Joaquina | BR | **seed** | Floripa surf+dunes |
| praia-mole | Praia Mole | BR | **seed** | Floripa scene beach |
| leblon | Leblon | BR | thin | Rio family side |
| cua-dai | Cua Dai | VN | **seed** | Hoi An beach |
| ao-nang | Ao Nang | TH | **seed** | Krabi gateway |
| chesterman-beach | Chesterman Beach | CA | thin | Tofino surf-resort |
| cox-bay-beach | Cox Bay | CA | thin | Tofino's open Pacific |
| saadiyat-beach | Saadiyat Beach | AE | thin | Abu Dhabi luxury, Louvre proximity |
| pearl-jumeirah | Pearl Jumeirah | AE | thin | Dubai public beach |

---

## Open follow-ups for Erin

1. **Slug collisions to resolve.** `omaha-beach-3` already exists as built content while `omaha-beach` (the main marquee) is thin. Probably need to consolidate. Same audit needed on Cape Coast/Elmina (both built, both T2). Want me to run a slug-collision audit before content gen?
2. **Pacific WW2 seed pass.** Tarawa, Peleliu, Guadalcanal, Iwo Jima, Saipan, Tinian, Kwajalein, Bikini, Chuuk are all `seed`. That's a coherent batch with shared sourcing (NPS, USMC History Division, Wikipedia). Worth a single seeding run?
3. **Iceland surf? / Faroe surf?** The Lofoten/Faroe candidates are all photography-led. Skipping cold-water surf for now (Unstad in Lofoten, Atlantic Faroe spots) — flag if you want them in.
4. **River/lake culture beaches.** Varanasi ghats and Mont-Saint-Michel tidal flats are arguably "beaches" in a cultural sense but not ocean. Included in T2 culture as a flag — drop them if WBT is strictly ocean.

---

## Deliverables

- `docs/hit-list.md` (this file) — human-auditable source of truth
- `docs/hit-list-longlist.md` — pre-curation long-list (raw research dump)
- `docs/hit-list-crosscheck.md` — DB cross-check with best-slug matches + misses
- `scripts/hit_list_crosscheck.py` — re-runnable cross-check tool
- `data/hit-list.json` — pipeline-consumable version (generated from this markdown)
