# Build-Out Strategy — from 311 pages to every beach on Earth

> Decided basis: 2026-06-10. Supersedes the *migration order* section of
> `beach-page-architecture.md` (the tier model and subpage policy there still stand).
> Inputs: marquee audit, architecture doc, and two June-2026 research passes
> (programmatic-SEO enforcement state; serving architectures at 200K+ pages).

## Where we are (verified 2026-06-10)

| Asset | State |
|---|---|
| DB | 227,780 beaches, 117 columns. Climate **97%** (was "blocked" — now nearly done). City/airport/shark/notability 100%. Bathymetry 90K, cyclones 13K, sand predicted all + curated 20 + wikipedia 1,081. **Best-months 0%** (derivable from climate already in DB — pure compute). |
| Site | 311 pages live on Hetzner, static export. GA4 + Search Console verification live as of today. |
| Pages | ~10 marquee (T3) pages with bespoke signatures; tier system coded in `site/lib/tier.ts`. |
| Repo | Everything committed and pushed to `erinheit451/worldbeachtour` (master). |
| Known data gaps | ~37 famous beaches Wikidata-unmatched (curated QID seed list designed); best-months; species/facilities partial on long tail. |

## The three verdicts from research

### 1. Static export cannot carry 228K pages — migrate to ISR

No published case of a Next.js static export finishing at even 100K pages; OOM
and multi-hour builds start far earlier; 228K pages ≈ 456K+ output files per build.
**Verdict: the current architecture caps out around a few thousand pages.**

The replacement (well-trodden, self-host friendly):

- `output: "standalone"` Next.js server on the Hetzner box (16 cores, idle capacity)
- `generateStaticParams` pre-renders only the editorial set (~1,300 pages, <30s build)
- `dynamicParams = true` + `revalidate = 86400`: the other 226K render **on first
  request from SQLite** and are ISR-cached to disk
- nginx micro-cache in front (`proxy_cache_lock on`, 1h TTL for stubs) — repeat
  hits never touch Node
- SQLite read-only on-server: WAL, `mmap_size` ≥ DB size, shared connection.
  The 300MB DB lives in RAM; per-request DB time is sub-millisecond.
- `experimental.preloadEntriesOnStart = false` (mandatory at this route count)

This is also the unlock for **adaptive pages that use the DB actively**: compare
any two beaches, similar-beaches, "best beaches right now" (seasonal, from
best-months), live nearby modules, map explorer, real search. None of that is
possible with a frozen export.

Rollback safety: the static deploy path stays intact until cutover is verified;
nginx flips between `current/` (static) and the Node upstream with one config swap.

### 2. SEO: indexing discipline is the entire game now

Google's scaled-content enforcement (March 2024 → Aug 2025 spam update → ongoing)
is **site-level**: URL-creation velocity vs. quality-page growth vs. engagement
("good clicks") ratios. Sites that survive at 100K+ pages (Zillow, AllTrails,
Wanderlog) share: unique per-page data a competitor can't replicate, staged
rollout over years, and strict indexing discipline. Sites that died: template
pages where only the place-name changes.

Our position is strong **if we respect the line**: a WBT stub carries climate,
best-months, sand composition, nearest city/airport, shark history, cyclone
exposure, bathymetry, nearby-beaches — 8–12 real data attributes nothing else on
the web has per-beach. That clears the "unique data" bar. What we must NOT do is
index 226K pages that nobody clicks yet.

Policy (locked unless Erin overrides):

1. **Publish everything, index selectively.** All 228K URLs exist (ISR makes this
   free). Pages below the data-completeness/tier threshold get
   `noindex` **in the initial HTML head** (2025 Google change: JS-injected noindex
   may never be seen).
2. **Sitemaps contain only indexable URLs**, segmented by tier
   (`sitemap-t3.xml`, `-t2.xml`, `-t1.xml`, regional shards <50K each) so Search
   Console shows per-tier indexation rates. `lastmod` driven by real per-beach
   data-change timestamps — never blanket dates. Drop `priority`/`changefreq`
   (Google ignores them).
3. **Staged promotion.** Index T1–T3 (~1,300) now. Promote stub cohorts
   (5–10K at a time, best-data-first) only when the previous cohort shows
   impressions + non-trivial engagement in GSC. Zapier took years from 100 → 5K.
4. **Structured data:** `Beach` + `BreadcrumbList` JSON-LD on every page;
   `FAQPage` ("when to visit / is it safe to swim") on T1+ — FAQ schema is now an
   AI-Overview extraction source. Organization entity sitewide.
5. **Internal linking is the crawl engine:** country → region → beach hubs +
   "nearby beaches" modules so no indexable page is orphaned.
6. **AI crawlers:** big incumbents (TripAdvisor, AllTrails) now block GPTBot et
   al. to protect their moat. We are the opposite case — young site, distribution
   hungry. **Allow AI crawlers for now**; revisit when the DB is the business.
   (llms.txt: skip — measured usage is negligible and Google rejected it.)

### 3. Orchestration economics: programs first, API for bulk, Fable for judgment

The cost ladder, cheapest first — most remaining work is at the top:

| Layer | What | Cost |
|---|---|---|
| **Programs (no LLM)** | best-months derivation, QID seeding, pageviews backfill, climate tail, tier recompute, completeness scores, sitemap/JSON-LD generation, image fetching, exports | $0 — cron it |
| **Haiku via Batch API** | T1 prose (1–2 grounded paragraphs × ~1,050 beaches), meta descriptions, alt text. Grounding rules + a validation program that rejects any claim not traceable to the beach's JSON | **~$5–10 total** (Batch = 50% off). Even the top 5,000 beaches ≈ $25–50. Does not touch the Claude subscription. |
| **Sonnet subagents** | implementation tasks (ISR migration steps, sitemap system), T2 dominant-lens essays (71), QA passes | cents per task via session subagents |
| **Fable (orchestrator)** | architecture, design language, T3 bespoke pages, review gates, this plan | the scarce resource — used for judgment, never bulk |

Rule of thumb: **if a task is deterministic, it's a program; if it's bulk
generation, it's Haiku Batch with programmatic validation; if it's judgment, it's
Fable.** LLM cost is a rounding error here — the real budgets are Erin's review
time and Fable session usage, both protected by this split.

## Images & storage

Measured 2026-06-10: `site/public/` is 370MB (largest: malibu 57, copa 56,
teahupoo 48, pipeline 44) and `.git` history is already 627MB — ~1GB on disk
total. Today's push needed per-commit chunking to survive. The walls ahead:

- GitHub gets painful past ~1–2GB and history only grows; pushes get fragile.
- T1-with-images (1,046 × 2–5MB) ≈ +2–5GB → too big for git.
- Long-tail (1 image × 200KB × 228K) ≈ 45GB → never git.

Plan: existing marquee images stay in git (rewriting history isn't worth it),
but **every new image batch from here goes to Cloudflare R2** (10GB free, zero
egress) behind `images.worldbeachtour.com`,
fronted by Cloudflare's free CDN (also fixes US latency from the DE box).
Attribution `.meta.json` manifests stay in git; server keeps a synced copy as
backup. For long-tail stubs, prefer **on-demand Wikimedia Commons URLs**
(`Special:FilePath`, hotlink-tolerated) with a nightly cache job — zero storage
until a beach earns curated images.

## Execution phases

> Re-sequenced 2026-06-10 after talking it through with Erin: **data first, then
> the page, then the pipes, then the scale.** The original order put the ISR
> migration ahead of page design; that was backwards — the page that will exist
> 227K times (the stub/T1 "every-beach page") has never been designed with the
> care the marquees got, and designing it needs no new infrastructure.

**Phase 1 — Data completion sprint** (programs only, starts immediately)
best-months derivation → finish climate tail (~5K) → famous-beach QID seed +
pageviews backfill → per-beach data-completeness score → tier recompute.
Output: every beach has the fields the every-beach page renders.

**Phase 2 — Design the every-beach page** (the heart; iterative with Erin)
Pick ~20 deliberately diverse beaches (famous / mid / data-rich nobody /
data-poor nobody / cold-water / urban / remote) and design the T0/T1 page on
the **current static site** until each would make a local nod. This is where
tier boundaries, usability, and depth get settled — at a scale where changing
course costs an afternoon. Page quality IS the SEO (engagement signals);
design and SEO are the same workstream here.

**Phase 3 — ISR migration** (after Phase 2 stabilizes; Sonnet subagents + Fable review)
DB copy to server → standalone build → systemd service → nginx micro-cache →
load test (target: stub p95 < 100ms first-hit, < 5ms cached) → cutover with
static rollback path. Validate 1,000 random slugs render correctly from DB.
Plumbing only — no page is redesigned; the same components render at request
time instead of build time.

**Phase 4 — SEO scaffolding + content engine** (programs + Haiku Batch + review gates)
Tiered sitemaps + lastmod tracking, per-page robots meta from completeness
score, JSON-LD everywhere, region/country hubs, internal-link modules,
AI-crawler robots.txt policy. T1 prose program with grounding validation →
T2 essays (Haiku draft, Sonnet tighten, Erin spot-check ~10%). Stubs go live
noindexed the moment Phase 3 ships — they cost nothing.

**Phase 5 — Measure & promote** (ongoing, mostly dashboards)
GSC per-tier indexation + GA4 engagement → promote stub cohorts → demote/fix
underperformers. The tier-design doubt gets answered with data, not debate:
GA4 is live as of today and Search Console unlocks the moment Erin verifies.

**Continuous track (independent of all phases):** marquee/T3 editorial pages
keep landing at sustainable cadence — they're the reputation engine.

**Parallel product track** (post-Phase 2, each is a contained feature):
beach compare · similar-beaches · "best right now" seasonal hub · map explorer ·
search over the full 228K · public API / MCP server (AI-agent distribution —
same playbook as supplements).

## Decisions Erin owns

1. **ISR migration go/no-go.** Recommended: go. Without it the project caps at a
   few thousand pages and none of the adaptive features are possible.
2. **Indexing posture.** Recommended: index ~1,300 now, stubs noindexed, cohort
   promotion by evidence. Alternative (index everything) risks site-level
   penalty that takes the marquee pages down with it.
3. **AI-crawler policy.** Recommended: allow (distribution > moat at this stage).
4. **Bulk-content spend channel.** Recommended: Anthropic Batch API (~$10–75
   real dollars total) instead of burning Claude-session usage on bulk prose.
5. **Image storage.** Recommended: repo is already ~1GB (627MB history +
   370MB images) — existing images stay, but new image batches go to R2
   starting with the next marquee/T2 sourcing run.
6. **Design validation.** Recommended: don't pause for a redesign — ship the
   Phase-1 pilot (Whitehaven or similar T2), instrument, and let the marquee
   audit's spoke pages (Spectator's Guide, Local's Guide, event deep-dives) be
   built as data arrives. The "are tiers useful" question is empirical now.
