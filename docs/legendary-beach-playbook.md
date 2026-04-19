# Legendary Beach Playbook

> How to produce a Copacabana-grade page for a Tier 1 beach — what's reusable, what's bespoke, what takes real editorial work.

**Reference implementation:** `site/app/beaches/copacabana-7/page.tsx` + `site/data/beaches/copacabana-7.json` + `site/content/beaches/copacabana-7/meta.json`.

---

## What a "legendary" page actually is

Not a templated beach page with more fields filled in. A legendary page is:

1. **Structured data that carries weight** — 12–18 timeline events with sources, 4–8 zones with character descriptions, 6–12 named businesses verified against their own websites, 8–15 cultural references with Wikipedia links.
2. **Four to six paragraphs of first-person-aware editorial voice** — the `intro_text` and the "signature section." These cannot be auto-generated; they are the soul.
3. **Honest context** — for Copa this is the favela above. For Bondi it might be shark culling vs shark safety. For Maya Bay it's the over-tourism closure. Every iconic beach has a tension a guide normally elides. We don't.
4. **Archival + modern photography** — 10–20 images with full Wikimedia attribution and license visible.
5. **Verification** — every named business, hotel, restaurant, museum checked against its own website or Wikipedia before it goes on the page. No hallucinated addresses, no invented bus routes, no dated fares.

A Tier 1 page is the internet's best page on that beach, written so a local nods. Nothing less qualifies.

## The 15 shared sections (reusable)

Every legendary page has these, differing only by the data and one or two pull quotes:

| # | Section | Data it needs | What makes it bespoke |
|---|---|---|---|
| 00 | Hero | hero image + name + location | image choice, tagline |
| 00b | QuickDecisionPanel | when/where/how-long | the three answers |
| 01 | Story | `intro_text` (4–6 paragraphs) | **fully bespoke prose** |
| 04 | Zones | `zones[]` with position_along_beach_pct | the zone characters |
| 05 | DaySection | `day_in_time.{dawn,midday,golden,night}` | **bespoke prose per vignette** |
| 06 | Timeline | `timeline[]` with year/title/description/wiki_url | event selection + wording |
| 07 | Calendar | `climate` + `tides` + `recurring_events[]` | recurring events |
| 08 | Water | section prose + at-a-glance dl | **bespoke marine story** |
| 09 | Versus | comparison card rows | which rivals, which axes |
| 10 | Stay | hotel tiers per zone | verified hotel names |
| 11 | Eat | `food_drink[]` + `businesses[]` restaurants | verified names |
| 13 | Planner | airports, payments, visa, duration | jurisdiction-specific |
| 14 | Safety | what-locals-do + in-the-water | **bespoke reality** |
| 15 | ViewBack | archival + modern photos with attribution | photo selection |
| 17 | Sources | provenance by category | source list |

## The 2 bespoke sections per beach (the signatures)

Every legendary page has **1–2 signature sections** unique to the beach. These are not formulaic. They are the reason the page exists.

| Beach | Signature 1 | Signature 2 |
|---|---|---|
| Copacabana | Calçadão (Burle Marx pavement) | Music (Beco das Garrafas + funk carioca) |
| Waikīkī | Duke Kahanamoku + surfing's birthplace | Hawaiian monarchy deposition + Pearl Harbor adjacency |
| Bondi | "Bondi Rescue" + lifeguard origin | Shark encounter culture + saltwater pool |
| Ipanema | Bossa nova lyrics anchor | Farme de Amoedo + Posto 9 sociology |
| Omaha | D-Day landing sector | American Cemetery + the narrowing of the draw |
| Maya Bay | The Beach (2000 film) | 2018 closure → 2022 rehabilitation |
| Nazaré | Praia do Norte canyon physics | Garrett McNamara 2011 → current world records |
| Pipeline | 1968 Phil Edwards + surf magazine lore | Reef anatomy + the Triple Crown |

Each signature section is a `<Component>` under `site/components/signature/` — about 80–150 lines of JSX mixing bespoke prose with a small amount of structured data (e.g., PostoMap for Copa).

## The data JSON schema

Already defined by `copacabana-7.json`. Top-level fields:

```json
{
  "slug": "...",
  "name": "...",
  "centroid_lat": ...,
  "centroid_lng": ...,
  "country_code": "...",
  "admin_level_1": "...",
  "beach_length_m": ...,
  "wikipedia_url": "...",
  "nearest_city": "...",
  "nearest_airport": { "iata": "...", "name": "...", "distance_km": ... },
  "safety": { "shark_incidents_total": ... },
  "facilities": { "parking": ..., "restrooms": ..., "food_nearby": ... },
  "climate": { "air_temp_high": [12 nums], "air_temp_low": [12], "water_temp": [12], "rain_mm": [12], "sun_hours": [12], "climate_source": "...", "ocean_source": "..." },
  "tides": { "range_spring_m": ..., "range_neap_m": ..., "type": "...", "source": "..." },
  "species": [ ... ],
  "showcase": {
    "is_showcase": true,
    "signature_motif": "unique-identifier",
    "intro_text": "4–6 paragraphs. Bespoke voice. Uses \\n\\n between paragraphs.",
    "favela_note": "Honest-context section. **Bold** supported via inline markdown.",
    "day_in_time": { "dawn": "...", "midday": "...", "golden": "...", "night": "..." },
    "food_drink": [ { "name", "description", "where" } ],
    "timeline": [ { "year", "month", "event_type", "title", "description", "wiki_url", "source" } ],
    "zones": [ { "zone_code", "name", "position_along_beach_pct", "character", "best_for", "notes", "lat", "lng" } ],
    "landmarks": [ { "name", "landmark_type", "year_built", "architect_or_designer", "description", "wikipedia_url" } ],
    "cultural_refs": [ { "ref_type", "title", "creator", "year", "description", "wikipedia_url" } ],
    "recurring_events": [ { "name", "when_text", "month", "description", "typical_attendance" } ],
    "businesses": [ { "name", "category", "description", "address", "year_established", "external_url" } ]
  }
}
```

## The meta.json schema

```json
{
  "tier": 1,
  "showcase": true,
  "images": {
    "hero": { "url", "title", "author", "license", "source_url", "width", "height", "role": "hero" },
    "section": {
      "<role_key>": { "url", "title", "author", "license", "width", "height", "role": "section:<role_key>" },
      ...
    },
    "gallery": [ {...}, ... ]
  }
}
```

Image roles are referenced by name from the page. Copa uses: `mosaic`, `pre_expansion`, `palace`, `posto_5_sign`, `sugarloaf_night`, `panorama`, `nye`, `olympic_2016`, `flying_down_poster`, `zweig_portrait`, `forte_1930`. Each beach defines its own role set.

## The process — per beach

**Budget: 2–3 days per Tier 1 page.**

### Day 1 — Research + structured data

1. **Read everything** — Wikipedia (all language editions), Wikivoyage, the local tourism board site, and 2–3 books or longform articles about the beach. Keep notes with citations. No shortcuts here — the verified-citation hedge in the Sources footer depends on this reading.
2. **Populate the JSON** — timeline (12–18 events), zones (4–8), landmarks (6–12), cultural_refs (8–15), recurring_events, businesses, food_drink. Each entry cites its source.
3. **Pick the 1–2 signature stories** — what are *this* beach's Calçadão + Beco das Garrafas? Sketch them in 2–3 sentences each.
4. **Curate images** — search Wikimedia Commons for 15–25 candidates, keep 10–15, verify licenses. Store attribution in `meta.json`.

### Day 2 — Editorial writing

5. **intro_text** — 4–6 paragraphs. This is the voice. Rewrite until a local would nod.
6. **day_in_time** — 4 vignettes, one per time of day. Concrete sensory detail.
7. **favela_note / honest-context** — the tension this beach carries. Written with specificity, not disclaimers.
8. **signature section prose** — the bespoke React components, 80–150 lines each.
9. **Section commentary** — the italic hedges, the pull quotes, the small voice notes sprinkled through sections.

### Day 3 — Polish + verification

10. **Verify every business name** — open the website, confirm it exists, confirm the address. Wikipedia-linked entities get their link instead.
11. **Run the page** — `cd site && npm run dev`, visit the URL, read every section out loud, check images render.
12. **Fix the rough edges** — pull quotes, caption wording, image order, navigation anchors.
13. **Deploy + smoke check** on Vercel preview if available.

## The tempo — waves of 3–4

Don't ship one at a time. Ship in **waves of 3–4 beaches** together. Reasons:

- **Image sourcing is batchable.** One Wikimedia Commons session across 4 beaches finds more and is faster than four separate sessions.
- **Editorial voice drifts** across weeks. Writing 4 intros in a week keeps the voice consistent.
- **The signature-section pattern validates.** By beach #3 you'll discover whether a reusable `<ShorelineProfile>` helper component is worth building or if every signature section is genuinely unique. Commit to the right abstraction only after the pattern has been tested.
- **Deploy as a set.** A wave of four iconic beaches hitting the site at once is a meaningful content drop — more linkable, more shareable, more shippable than trickling one-per-week.

### Recommended waves

| Wave | Beaches | Logic |
|---|---|---|
| 1 | Waikīkī · Bondi · Ipanema · Omaha | Pacific/Oceania/Brazil/Europe — four continents, four different signature patterns |
| 2 | Nazaré · Pipeline · South Beach · Maya Bay | All have single defining stories |
| 3 | Navagio · Whitehaven · Reynisfjara · Boulders | Natural-wonder-led rather than culture-led |
| 4 | Coney Island · Varkala · Malibu · Glass Beach | American popular culture + Hindu pilgrimage |
| 5 | Utah/Juno/Sword/Gold | D-Day cluster — they reference each other |

## What NOT to delegate to subagents

Subagents can reliably populate:
- Timeline rows (given a Wikipedia URL and instruction to pick 12–18 events)
- Landmark lists
- Species lists (already in DB)
- Recurring-event descriptions
- Climate chart helper text

Subagents CANNOT reliably produce:
- `intro_text` — the voice is the product
- `day_in_time` vignettes — they generate generic travel-blog paragraphs
- `favela_note` honest-context — they hedge instead of state
- Pull quotes — they invent instead of select
- Signature section prose — generic travel copy ensues

**Rule:** subagents for structured data; human for voice.

## The build-time wiring

Each beach uses the route `app/beaches/<slug>/page.tsx`. For Tier 1 pages, the file is ~40 lines:

```tsx
import { LegendaryBeach } from "@/components/showcase/legendary-beach";
import { loadBeach } from "@/lib/beach-loader";
import type { Metadata } from "next";
import WaikikiSurfingOrigin from "@/components/signature/waikiki-surfing-origin";
import WaikikiMonarchy from "@/components/signature/waikiki-monarchy";

const SLUG = "waikiki-beach";

export const metadata: Metadata = {
  title: "Waikīkī — The Beach That Invented Surf Culture",
  description: "Duke Kahanamoku, Hawaiian monarchy, and the post-war template every tourist beach still copies.",
};

export default function WaikikiPage() {
  const { data, meta } = loadBeach(SLUG);
  return (
    <LegendaryBeach
      data={data}
      meta={meta}
      signatures={[
        { id: "surfing", label: "Surfing's Birthplace", component: <WaikikiSurfingOrigin data={data} meta={meta} /> },
        { id: "monarchy", label: "The Monarchy", component: <WaikikiMonarchy data={data} meta={meta} /> },
      ]}
      versusCompare={[/* local rival beaches */]}
      sourcesVoice="Written to pass the kumu hula test. Corrections welcome."
    />
  );
}
```

The `<LegendaryBeach>` component renders the 15 shared sections, inserts the signatures at their declared position in the nav, and threads through the per-beach customizations.

## Non-negotiables

- No invented data. Every address, hotel, business, date, quote: cited.
- Every image has attribution visible on the page.
- Every dated claim ("R$80–150", "reinstated April 2025") carries a timestamp in the text so readers see staleness.
- Honest-context section is not optional. The reader can see the tension.
- The sources footer names every data provider.

If the page can't meet all six, it's not a legendary page — it's a good one. Ship it as a regular beach page instead.

## Open questions

- **Who owns editorial voice when I'm not around?** Today, any intro_text has to come through me. If we want to scale to 20+ pages without voice drift, we need a style guide doc (one-pager) with 10 example sentences and 10 anti-examples.
- **Image licensing at scale.** Wikimedia Commons is the safe default. Flickr CC is next. For beaches under-represented on Commons (Oppenheimer, Tarkwa), we may need commissioned photography — budget implications.
- **Translation.** All pages English-first. Portuguese and Spanish translations for the most-visited (Copa, Maya Bay, Ipanema) would multiply reach. Out of current scope.
