# Decision Log

Append-only. Every settled decision gets a dated entry with the why. To change a
decision, add a new dated entry superseding the old one — never edit history.
Sessions: do not re-open anything below without a superseding entry.

---

**2026-07-03 — Value model: data authority first.** (Erin) Every layer ranks by
whether it compounds toward being the only structured source. Consumer traffic,
API licensing, affiliate, and acquisition all price off authority; none is chosen
or excluded now.

**2026-07-03 — The DB is the spine; surfaces are projections.** Every layer must
land in `world_beaches.db` as columns + a `*_source` tag + a confidence level.
Site pages, MCP, dataset releases, API, and reports all read from the DB. No
layer ships as page-only or product-only data.

**2026-07-03 — Open-core split.** Free public dataset release = identity + location
+ country + a small attribute slice, with DOI and citation requirement. The
computed depth (physical truth, sand, review intelligence…) stays proprietary,
served via site/MCP/API.

**2026-07-03 — Quality gates before mass publishing.** Programmatic Tier 3/4 pages
publish only above a completeness threshold; thin rows get noindex. Rollout in
batches with Search Console monitoring between waves. Rationale: 227K raw rows
include junk; publishing it raw reads as spam to Google and to people.

**2026-07-03 — Hazard framing.** Computed hazard attributes (rip propensity,
sharks, drop-offs) are presented as "conditions to know," with confidence levels —
never as safety certification.

**2026-07-03 — Sand collection legality.** Beaches where sand removal is illegal
(Sardinia, Hawaii, various protected coasts) get satellite + literature data only
in the sand library — and the page says so. The disclosure itself is credibility.

**2026-07-03 — Editorial is a parallel track, not the growth engine.** The gold-page
loop (Tier 1/2) continues as the E-E-A-T/brand layer. Growth comes from the data
layers + programmatic surfaces.

**2026-07-03 — Spin-off protocol.** New ideas become `layers/` stubs within 10
minutes, get scored, and wait for a re-rank. No session builds an unranked layer.

**2026-07-03 — Grain-size v3: spatial-inference geology backstop (current).**
Substrate is strongly spatially clustered — nearby KNOWN beaches predict an unknown's
substrate at ~91% accuracy / 70% coarse recall (leave-one-out, distance-weighted kNN
within 25 km), vs 32% for slope. Added as Tier 2 between measured OSM (Tier 1) and the
slope estimate (Tier 3, last resort). Coverage 120K→171K beaches (75% of all);
good-confidence (measured+inferred) = 52%, up from 19%. This is the general pattern for
sparse-label attributes: **spatially interpolate from known points before falling back
to a weak physics proxy.** Grow the seed set (and thus inference quality) via usSEABED +
EMODnet + the Global Coastal Classification transects (already in the enrichment plan).

**2026-07-03 — Grain-size: ground-truth-first (superseded by v3 above).** After the first slope-only run, validated against 29,327 OSM-labelled
beaches: slope-only is a weak proxy — 32% coarse recall, ~64% balanced-accuracy
ceiling even best-tuned (coarse shelf 4.0% vs sand 2.2%, heavy overlap). Rewrote v2
(`sand_grain_size.py`): use OSM substrate tag directly where present (43,389 beaches /
19% — Chesil now correctly 'pebble' at high confidence), slope estimate only for
unknowns at low confidence, labelled '(est.)'. **Publish rule:** high-confidence rows
are page/dataset-ready; low-confidence rows show as "estimated" or stay hidden. Grow
the measured share via usSEABED (US) + EMODnet (EU) + sand passport. Coverage:
43K measured + 91K estimated + 93K none.

**2026-07-03 (SUPERSEDED by the entry above) — Grain-size tendency internal-only.**
Initial slope-only run flagged not-publish-ready off the Chesil miss; replaced by the
ground-truth-first v2 rather than shelving the attribute.

**2026-06 (prior) — Four-tier page architecture locked.** T1 Legendary (30–50) /
T2 Featured (500–1000) / T3 Field Guide (10k–30k) / T4 Stub (200k+). See
`../legendary/tier-system.md`. The Jun-11 "Marquee/Popular/Named/Stub" naming is
superseded.

**2026-07-02 (prior) — Public anchor number is 228,612** unique beaches
(cross-source dedup), published at `/how-many-beaches-in-the-world`. Internal DB
row count (227,780 in `world_beaches.db`) is not the public figure.
