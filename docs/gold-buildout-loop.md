# Gold Build-Out Loop — runbook

The repeatable procedure for the self-paced loop that keeps shipping Tier-2
"gold" Featured pages. One beach per iteration, at an easy steady pace.

## Goal

Keep converting notable, data-ready beaches into Manila-grade gold pages and get
each one **live** (committed → pushed to master → deployed → verified in prod).
Near-term target: work down `docs/gold-buildout-queue.txt` (ranked by notability),
~one beach per iteration. Reassess the queue after each wave of ~10.

## Per-iteration procedure

1. **Pick the next beach** from `docs/gold-buildout-queue.txt` (top-down by
   notability), applying the **selection rule** below. Restate the literal pick.
2. **Verify it's genuinely unbuilt** — `site/content/beaches/<slug>/composition.json`
   must NOT exist AND there must be no bespoke `site/app/beaches/<slug>/page.tsx`
   (old legendary pages render via their own .tsx and need no composition.json).
   If already built, skip and pick the next.
3. **Inventory the scaffold** — read the existing `meta.json` (images),
   `overview.mdx`/`travel.mdx` (pre-existing), and `site/data/beaches/<slug>.json`
   (coords, climate, airport, sand, cyclone exposure) for accurate facts.
4. **Research** — web-search the beach. Verify EVERY fact, date, name, number.
   Find the distinctive angle and the honest tension (the uncomfortable truth a
   normal guide elides). No invented businesses/people/films — omit if unverifiable.
5. **Author** the two files to `docs/content-spec.md` exactly:
   - `composition.json` (tier 2; subtitle + spike_statement; levers; spokes; adaptive:true)
   - `showcase.json` (all keys; spike_explainer ≥700 words; cited key_facts; margin_notes;
     day_in_time; honest_reckoning_note + reckoning_pullquote; timeline; zones; etc.)
   Plus **one authored deep-dive spoke** `.mdx` matching the dominant lens (MDX
   components MapEmbed/DataCard; ends with a back-link to the full guide).
   **Voice:** declarative, specific, anti-AI-slop (NO pristine/stunning/nestled/gem/
   paradise/hidden); honest, not moralizing. Match the `manila-bay-beach-1` exemplar.
6. **Render-verify locally (best-effort pre-check)** — background dev servers get
   reaped between iterations, so do NOT assume one is running. Start fresh each time:
   free the port (`Get-NetTCPConnection -LocalPort 3100 -State Listen` → `Stop-Process`
   the OwningProcess), then launch `cd site && PORT=3100 npx next dev -p 3100` in the
   background, wait for "Ready", and curl the main + spoke routes (first hit compiles).
   Confirm 200s, grep the HTML for authored strings, scan the log for errors. If the dev
   server won't cooperate, don't block on it — JSON validation (step 7) plus the
   server-side build during deploy (step 10, which aborts on any error and leaves prod on
   the last-good build) plus the live-verify (step 11) are the real gate.
7. **Validate JSON** — both files parse; spike_explainer word count ≥700.
   **Field shapes MUST match what `standard-sections.tsx` reads** (a wrong shape
   either crashes the prerender — e.g. `food_drink` as a string → `f.map is not a
   function` — or silently renders an empty section). Author these exactly:
   - `food_drink`: array of `{name, description, where}` (NOT a string)
   - `timeline`: `{year:<int>, month:null, event_type, title, description, wiki_url?}`
     (year is a **number** — it's sorted numerically; content is `title`+`description`)
   - `zones`: `{zone_code, name, position_along_beach_pct:<number>, lat, lng, character,
     best_for, notes}` (missing `position_along_beach_pct` → renders `NaN%`)
   - `landmarks`: `{name, landmark_type, year_built, architect_or_designer, description, wikipedia_url?}`
   - `cultural_refs`: `{ref_type, title, creator, year, description, wikipedia_url?}`
   - `recurring_events`: `{name, when_text, month, description, typical_attendance}`
   - `margin_notes`: array of `{audience, anchor_para_index:<int>, text}` (objects, NOT strings)
   - `key_facts`: `{label, value, source?}` (value renders LARGE — keep it short)
   - `things_to_know`: `{label, note}`
   When unsure, diff against a recent known-good page (e.g. `governor-s-beach-4`).
8. **Commit** on `gold-buildout-resume` (the worktree workspace) with the message
   format `feat(gold): complete <Name> (<place>) — full Featured page (<spokes> spokes)`,
   ending with the `Co-Authored-By: Claude Opus 4.8 (1M context)` line.
9. **Push to master** — `git fetch origin`; if `origin/master` moved, rebase the
   branch on it first; then `CLAUDE_ALLOW_PUSH=1 git push origin gold-buildout-resume:master`
   (FF). Never force.
10. **Deploy** — `bash scripts/deploy.sh` (rsyncs `site/` → Hetzner box, rebuilds the
    standalone server, restarts `worldbeachtour.service`).
11. **Verify LIVE** — `curl https://worldbeachtour.com/beaches/<slug>?cb=$(date +%s%N)`
    returns 200 and contains the authored strings + "Written by Erin Rose". This is
    the load-bearing proof; don't claim "live" without it.
12. **Pace** — schedule the next iteration at an easy steady cadence.

## Selection rule (skip the noise in the ranked queue)

The queue is sorted by notability but contains OSM-import noise and dupes. SKIP:
- ALL-CAPS / generic OSM names ("TOWN BEACH", "FIUME FINE", "PLAYA BLANCA PM1",
  canal/idrovora/cantiere/canottieri entries) — not real destinations.
- Slugs that are near-dupes of an already-built page (e.g. `waikiki-3` vs the built
  `waikiki-beach-1`; `praia-da-falesia` is already gold under its built slug).
- Anything failing step 2 (already built).
PREFER: real, recognizable beaches with a clear distinctive draw AND an honest
tension — the gold formula. Strong early picks: `alang-ship-breaking-yard` (world's
largest ship-breaking beach), `oppenheimer-beach` (USVI), notable Indian coast
(`rushikonda-beach`, `golden-beach-puri`, `dumas-beach`, `alappuzha-beach-1`).

## Two render paths — check before authoring composition.json

Most beaches render via the generic **v2** route (`app/beaches/[slug]/page.tsx` →
`LegendaryBeachV2` → `loadBundle`), which is driven by `composition.json` +
`showcase.json`. That is the normal gold target.

BUT the ~6 original April "marquee" pages (e.g. `teahupoo`) have a **dedicated
bespoke route** `app/beaches/<slug>/page.tsx` using `components/showcase/legendary-beach`,
which reads **`showcase.json` ONLY and ignores `composition.json`** (a static route
wins over `[slug]`). For those: to improve the page, AUGMENT `showcase.json`
(e.g. add `spike_explainer`, `key_facts`) — do NOT add a `composition.json` (it's
inert and misleading). Tell them apart: `ls site/app/beaches/<slug>/` — if a
`page.tsx` exists there, it's bespoke-v1; if not, it's v2/composition-driven.
Confirm live by grepping rendered section ids (bespoke uses `bathymetry`, `postos`,
`viewback`, `planner`…; v2 uses `spike_deep_explainer`, `plan_stack`, `things_to_know`…).

## Infra reference

Deploy/server details (standalone ISR on :8012 behind nginx, the cutover history,
the wbt-deploy fix) are in the memory note `project_worldbeachtour_gold_buildout`.
Work ONLY in the worktree `C:\Users\Roci\worldbeachtour-gold-resume`.
