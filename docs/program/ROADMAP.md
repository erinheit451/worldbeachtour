# Atlas Program Roadmap

**Mission:** make World Beach Tour the definitive structured source for every beach
on Earth — the dataset that people, press, papers, and AI assistants cite.
**Value model (settled 2026-07-03):** data authority first. Monetization paths
(affiliate, API licensing, reports, acquisition) all price off authority and none
requires choosing today.

Facts of record: **227,780** deduped beaches (public anchor number **228,612**),
**117** attribute columns, ~30 enrichment pipelines coded, 109 gold pages live,
799 URLs indexed. Coverage audit 2026-07-03: climate/best-months/swim-suitability
~97%, sand regime 99%, sharks/notability/airports 100%, tides 62%, slope+nearshore
depth 52%, protected areas 29%, water quality 9%. Orientation/sunset, waves, water
temp, sand color, species, facilities, photos, beach dimensions: **&lt;1% (stubs)**.

## Scoring rubric

Each layer is rated H/M/L on five axes. Rank order is set by the first three;
the last two break ties.

| Axis | Question |
|---|---|
| **Uniqueness** | Does this exist as structured data anywhere else? (H = nowhere) |
| **Leverage** | How many other layers/products does it unblock or feed? |
| **Cost** | Build + run + ongoing maintenance (H = cheap — scored inverted) |
| **Authority** | Citation/GEO/press yield once published |
| **Revenue** | How directly it monetizes |

Standing rule: **dependency-keystones outrank everything they unblock.**

## The stack rank (re-ranked 2026-07-03)

| # | Layer / move | Status | U | L | C | A | R | Note |
|---|---|---|---|---|---|---|---|---|
| 1 | [Geometry keystone](layers/geometry-keystone.md) — polygon fetch | scoped | M | **H** | H | M | L | ~2 days; unblocks #2, #5, dimensions, photo matching |
| 2 | [Physical truth](layers/physical-truth.md) + [marine climate](layers/marine-climate.md) compute sprint | partial | **H** | **H** | H | H | M | Sunset, shade, crowding, rip, accessibility; waves + water temp |
| 3 | [Programmatic publish](layers/distribution-products.md) — Tier 3/4 rollout | scoped | M | **H** | M | **H** | M | 799 → six figures, quality-gated; data unpublished = authority zero |
| 4 | Beach MCP + open dataset release ([products](layers/distribution-products.md)) | idea | **H** | H | H | **H** | M | First-mover window open NOW; DOI makes 228,612 THE number |
| 5 | [Sand library](layers/sand-library.md) phase 1 — satellite + inference + calibration | scoped | **H** | M | M | **H** | L | The brand-defining vertical; grain-size inference NOT polygon-blocked |
| 6 | Query engine + intersection pages ([products](layers/distribution-products.md)) | idea | **H** | M | M | **H** | M | "Only site that can answer this"; needs #1–2 |
| 7 | [Travel economics](layers/travel-economics.md) | idea | M | M | M | L | **H** | The affiliate/revenue layer; flight-deal queries |
| 8 | [Review mining](layers/review-mining.md) | idea | **H** | M | M | H | M | Structured attributes from millions of reviews — model-shaped work |
| 9 | [Climate future](layers/climate-future.md) + rankings/press engine | idea | **H** | M | M | **H** | M | "Beaches with a deadline" = the press franchise |
| 10 | [Life & ecology](layers/life-ecology.md), [surf](layers/surf.md), [dive/snorkel](layers/dive-snorkel.md) verticals | partial | H | M | M | M | M | Vertical audience unlocks |
| 11 | [Place & access](layers/place-access.md) at scale | scoped | M | M | H | M | M | OSM deep tags; feeds crowding index |
| 12 | [Social signal](layers/social-signal.md) | scoped | M | M | L | M | M | Deferred build — but apply for research APIs NOW (free, slow) |
| 13 | [Culture & legal](layers/culture-legal.md) | idea | M | L | M | M | L | Nudity/dog/bonfire rules = real search demand |
| 14 | [Live conditions](layers/live-conditions.md) | idea | L | L | M | L | M | Last; passthrough until traffic exists |
| — | [Editorial](layers/editorial.md) (gold pages) | building | — | — | — | H | — | Parallel track, already looping; E-E-A-T + brand |

## Operating cadence

- **At most two active tracks at once** (one compute, one publish), plus the gold
  editorial loop which runs independently. Everything else stays parked in the
  registry — parked is a status, not a failure.
- A layer ships when: columns populated at target coverage → spot-verified against
  known beaches → provenance + confidence recorded → surfaced on at least one
  distribution surface.
- Re-rank the table above only when something ships or a new layer scores H/H.

## No-regret actions (do regardless of rank)

1. Apply for **Meta Content Library** and **TikTok Research API** access — free,
   approvals take weeks, needed by layer 12 eventually.
2. Every new pipeline writes `*_source` and confidence columns from day one.

## 90-day sequence

| When | Track |
|---|---|
| Weeks 1–2 | Keystone: polygon fetch → re-run `geometry_derived`. Research-API applications out. |
| Weeks 2–6 | Compute sprint: sunset score, wave climate, water temp, shade, crowding. Sand grain-size inference (already unblocked). |
| Weeks 5–10 | Publish: Tier 3 template + quality-gated batches; MCP server; dataset release w/ DOI + launch post. |
| Weeks 10–13 | Own the question: beach finder + intersection pages; first computed-ranking press piece. |

Related pre-existing docs: [enrichment plan](../enrichment-plan.md) ·
[polygon future-scope](../future-scope-polygon-geometry-fetch.md) ·
[social future-scope](../future-scope-social-photo-mining.md) ·
[tier system](../legendary/tier-system.md)
