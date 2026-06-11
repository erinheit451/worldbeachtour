# Template Spec Pack — the four page tiers + the index

> Draft 1 for Erin's review — 2026-06-11.
> The approval artifact for the tier templates. One page per tier: the job,
> the fixed spine, the flex slots (data-gated), what exists, what's missing,
> and the open design questions. Constraint lists, not 500-line specs.
>
> Companion: `template-sample-set.md` (the ~20 beaches we validate against).

## REVISED TIER MODEL (2026-06-11, after the data sweep with Erin)

The original architecture-doc split (index only ~1,100, everything else
"stub") was gated on **English Wikipedia presence** — which measures Anglophone
documentation, not whether a beach is real or known. The DB sweep showed the
correct fourth axis is **named vs unnamed**, and the counts under Erin's model:

| Tier | Name | Gate | Count today | Count after identity repairs |
|---|---|---|---|---|
| **1 — Marquee** | world-legendary | **hand-curated list only** (pageview thresholds surface D-Day beaches and a ship-breaking yard — curation is the only honest gate) | 8 built | 20–100 (hit-list has 200 candidates) |
| **2 — Popular** | beaches people travel for | pv > ~5K OR wikidata + clean notability ≥ 20 | ~500–1,000 | ~1,500–3,000 |
| **3 — Named** | "the world's beaches" — on the map, not obscure | **has a name** (+ findability) | **79,147** | same |
| **4 — Stub** | there, but not easily found | unnamed (OSM geometry only) | **148,633** | same |

Numbering note: Erin's numbering (1 = top) is now canonical in docs and
discussion. The codebase's `tier.ts` uses the inverse (3 = monument); to avoid
permanent confusion we use the **names** — Marquee / Popular / Named / Stub —
everywhere, and the code's numeric scale gets remapped during the template
build. Sections below were drafted under the old labels: T3→Marquee,
T2→Popular, T1+T0→split into Named (named beaches — the field-guide template
with identity) and Stub (unnamed — a reduced coordinates+data+nearby variant).

Known data caveats feeding the gates:
- `notability_score` is polluted (960 *unnamed* beaches score ≥10, incl. a
  beach club) — never gate on it alone; always pair with name/wikidata.
- `beach_length_m` is unpopulated (34 rows) — size can't gate anything yet.
- The famous-37 QID repair + any-language sitelinks sweep + pageviews backfill
  (all zero-LLM programs) firm up the Marquee/Popular boundary before bulk
  production.

## The flex principle (applies to every tier)

A section renders **only when its data exists and is worth showing**. No empty
skeletons, no "N/A" cells, no template tax. Each tier defines a *maximum*
shape; the data decides the actual shape per beach. Confidence is always
labeled (`verified` / `computed` / `predicted` — already implemented in T0).
What we don't know is said out loud — the honesty block is a brand feature at
every tier below T3.

---

## T0 — Stub: "the field guide entry" (227K beaches, 99.5% of the site)

**The job:** beat Google Maps on *context* for a beach nobody has written
about: what kind of beach this is, when it's worth visiting, what's nearby
that's better documented — and be honest about the rest. The reader is
someone who found a beach on a map and wants to know if it's worth the walk.

**Status: designed and ~80% built** (`site/components/stub-beach.tsx` — the
field-guide concept). Needs validation against diverse real data + 3 wiring
gaps closed.

**Spine (renders for every beach, no exceptions):**
1. Header — name (+ local name), dual breadcrumb (Place › / Type ›), subtitle
2. Field-guide card — up to 8 data cells (type, size, tide, water body,
   climate, access, airport, services), each confidence-tagged
3. "What we don't know" honesty block + contribute CTA
4. Provenance table — where every datum came from
5. Neighbors on this shoreline (internal links — crawl path + user escape hatch)

**Flex slots (data-gated):**
- Sand swatch (sand prediction exists — ~100%)
- Typical conditions this month (climate — 97.7%)
- Coastline diagram (OSM geometry)
- "A year here" strip (climate + best-months)
- Context photos (Commons within ~900m)
- Setting prose paragraph (only where grounded text exists)
- Beaches-like-this-one (similarity pipeline — **not built yet**)
- Storm history (cyclone data — 13K beaches)

**Wiring gaps to close before approval:**
1. `YearStrip` requires `water_temp_c`, which most beaches lack — needs an
   air-temp fallback mode or the slot stays dark for ~95% of beaches.
2. Contribute CTA points at a placeholder Google Form URL.
3. Typological siblings are hand-picked placeholders — either build the
   similarity vector (7 dims, cheap compute) or gate the section off at launch.

**Open design questions:**
- Q1: Is the field-guide register right for T0, or too clinical? (Decide on
  real samples, including a data-poor one.)
- Q2: Best-months now exists in the DB — should the "beach-day window" band
  use it instead of the component's inline recomputation? (Yes, proposed.)
- Q3: SEO line: T0 ships `noindex` until cohort promotion — confirmed?

---

## T1 — Standard: "the data page with a voice" (~1,000–17,000 beaches)

**The job:** the canonical reference for a *known* beach that has identity
(Wikipedia/Wikidata) but no editorial coverage from us yet. Everything T0 has,
plus: the beach gets *named context* — a grounded intro paragraph, its
Wikipedia-derived facts, real photos of the beach itself (not just "context"
photos), and best-months called out as a recommendation rather than a chart.

**Status: not designed.** This is the main new design work. The generic
`[slug]/page.tsx` lens-summary page currently serving these is the legacy
pattern the architecture doc says to replace.

**Spine = T0 spine plus:**
1. Grounded intro block — 1–2 paragraphs synthesized from Wikipedia +
   our data (Haiku Batch, validation-checked; voice rules apply: declarative,
   no brochure adjectives, no invented businesses)
2. Hero photo of the actual beach (Commons-matched) when available
3. "When to go" — best-months as a stated recommendation with the reasoning
   ("May–June: 26–28°C highs, before the August crowds and the meltemi wind")
4. Wikipedia/Wikidata attribution in provenance

**Flex slots:** everything from T0, plus visitor-relevant extras where data
exists (blue flag status, protected-area, lifeguard, facilities from the OSM
sweep).

**Open design questions:**
- Q4: One template serving 1,000 vs 17,000 beaches is the same design problem
  — the *gate* is the decision. Proposal: T1 = `wikipedia_url` present OR
  notability ≥ 15 (current `tier.ts` logic). The 16.7K wikidata-only beaches
  without enwiki articles stay T0 until the resolver + pageviews say otherwise.
- Q5: Does T1 get indexed at launch? Proposal: yes for the ~1,000 with
  pageviews > 1,000/yr; the rest promoted in cohorts.

---

## T2 — Featured: "one great essay + the full data page" (~75–150 beaches)

**The job:** a beach people travel for. T1 everything, plus **one
dominant-lens essay** (surf, sand, history, culture — whichever this beach is
*for*) written to publishable quality, plus a real photo set. May earn ONE
subpage when the dominant lens overflows (≥2× main-page length — Rule 2 of
the architecture doc).

**Status: pattern exists** (São Martinho, Glass Beach, Reynisfjara are
working T2s) **but no locked template** — each was built ad hoc.

**Spine = T1 spine plus:**
1. Dominant-lens section — the expanded essay block with images (MDX)
2. Brief secondary-lens blocks (only ones with content; link to subpage if any)
3. Timeline (if ≥3 real events)
4. Curated photo essay (4–10 images, captioned)

**Production path:** Haiku researches+drafts from web sources → Sonnet
tightens → Erin spot-checks ~10%. ~$0.20–0.50/beach.

**Open design questions:**
- Q6: Which lens taxonomy is canonical? (surf / sand / history / culture /
  nature / family — needs locking before bulk T2 production.)
- Q7: The T2 queue — hit-list.md has 200 candidates; first 25 to produce?

---

## T3 — Monument: NOT a template (8 today → ~19–25)

**The job:** the definitive page on a world-famous beach — a destination in
itself, something a local would respect. **Design language, not template**
(per Erin's standing rule): shared typography/color/component vocabulary +
bespoke signature components per beach, composed per-page.

**Status: live and maturing** — 8 monuments, the design-language track
continues (Nazaré is the reference implementation). The marquee audit's
findings (signature buried mid-page, checkbox sections, three overlapping
history modules) are the active work list. Spoke subpages (Spectator's Guide,
event deep-dives, Local's Guide) get added per the audit as each earns it.

**Not blocked on anything in this spec.** Cadence: 1–2 pages/month of
editorial work, continuous.

---

## The categorized index (the fifth deliverable)

**The job:** every beach reachable in ≤3 clicks; crawl paths for Google;
browse paths for humans. Three structures:

1. **Place tree** — `/regions/<country>` → region → beach list (exists in
   skeleton; needs region-level pages with counts, best-of callouts, and the
   tier-badge listing rows)
2. **Type tree** — NEW: `/types/<coastal-type>` (pocket cove, barrier spit,
   urban strand…) — the dual breadcrumb on T0 already points here; powered by
   the classification fields
3. **Topic hubs** — `/sand` (exists), `/surf`, `/travel` — curated editorial
   destinations, 30–80 beaches each, link to canonical beach pages

**Open design question:**
- Q8: Type tree at launch or after ISR? (It's 200–400 list pages — static-safe
  either way. Proposal: skeleton at launch, it's cheap and the breadcrumbs
  already promise it.)

---

## Approval flow

1. Erin reads this pack + the sample set doc
2. We build T0 + T1 against the samples on the live site under a preview
   route (real data, clickable)
3. Iterate per tier → mark each spec **APPROVED** with date
4. Approved spec = the contract bulk production validates against
