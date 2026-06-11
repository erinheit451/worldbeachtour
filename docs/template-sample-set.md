# Template validation sample set — 20 beaches

> Companion to `template-specs.md`. The templates get built and approved
> against these 20 real beaches. Chosen to stress every axis the templates
> must flex on: fame, data richness, climate, water body, geography, and the
> honesty problem. If a template renders all 20 well, it ships.

## T2 boundary — famous, each with a different dominant lens (4)

| Beach | Why it's here |
|---|---|
| `zlatni-rat` (HR, notab 39) | The shape-shifting spit. Sand/nature dominant. Tests: geometry-led page. |
| `omaha-beach-3` (FR, 43) | History-dominant — a beach where "best months" and "swim suitability" must defer to memorial gravity. Tests: tone flexing. |
| `marina-beach-chennai` (IN, 43) | Urban mega-beach, global-south, culture-dominant, almost no "visit" framing in Western terms. Tests: the template outside its comfort zone. |
| `coney-island-beach-1` (US, 44) | Urban classic, culture/history. Tests: city-beach data (transit access > airport). |

## T1 — known beaches, no editorial yet (7)

| Beach | Why it's here |
|---|---|
| `praia-da-marinha` (PT, 41) | Photogenic cliff cove right at the T1/T2 boundary — the promotion-line test case. |
| `nissi-bay` (CY, 37) | Party beach. Tests: when the data says "calm, warm" but the identity is nightlife. |
| `karang-bolong-beach` (ID, 15) | Indonesia, modest data, non-Latin naming. Tests: thin-but-real T1. |
| `daaibooi` (CW, 22) | Small Caribbean island cove. Tests: small-island context (airport = lifeline). |
| `gezira-beach` (SO, 19) | Mogadishu. Tests: honesty under complicated safety context — the hardest tone problem in the set. |
| `bystranda` (NO, 20) | Urban cold-water city beach (Kristiansand). Tests: when "best months" is a 6-week window. |
| `skjellvika-1` (NO, 13) | Small cold-water cove at the T0/T1 boundary — the demotion-line test case. |

## Lake beaches (2)

| Beach | Why it's here |
|---|---|
| `grote-rietplas-parelstrand` (NL, 16) | Engineered lake swim beach — no tides, no waves, no sand prediction validity. Tests: how much of the template survives inland. |
| `parc-de-l-arabie` (CH, 16) | Swiss lakeside park. Tests: "beach" at its definitional edge. |

## T0 — named nobodies with good data (4)

| Beach | Why it's here |
|---|---|
| `playa-de-cuesta-maneli` (ES) | Dune-backed Atlantic nobody, full climate+sand. The *ideal* T0: rich data, zero fame. |
| `praia-da-ilha-das-andorinhas` (BR) | Brazilian island strand. Tests: T0 in the tropics. |
| `elephant-beach-1` (FK) | Falkland Islands. Remote, cold, no tourism infrastructure at all. The extreme honesty test. |
| `rio-tuerto-villaobispo-de-otero-pm` (ES) | A **river** beach. Tests: water-body flexibility (no tides, no waves, no ocean anything). |

## T0 — unnamed stubs (3)

| Beach | Why it's here |
|---|---|
| `beach-18.4604--64.4327` (VG) | Unnamed BVI cove — the data says paradise, the identity says nothing. Can the page be honest AND inviting? |
| `beach-63.4076-10.3423` (NO) | Unnamed Norwegian shore. Tests: the most minimal viable page. |
| `beach--20.6075-116.8042` (AU) | Unnamed Pilbara coast — cyclone country. Tests: storm-history flex slot on a nobody. |

## How we use it

1. Build the T0/T1 preview route rendering these 20 from live DB exports
2. Walk all 20 with Erin — section by section, the marquee-audit questions:
   does each section belong *here*, is anything forcefit, what's missing
3. Fix, re-walk, approve
4. The 20 become the permanent regression set: any template change must
   re-render all 20 acceptably before deploy
