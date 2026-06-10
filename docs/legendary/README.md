# World Beach Tour — Build Spec

Documentation for the build spec. Read in this order:

1. **`spec-v1.2.md`** — parent spec: strategy, lever system, gap fixes, locked beach axes, migration order, change management.
2. **`tier-system.md`** — four-tier architecture (Legendary / Featured / Field Guide / Minimal) with reference implementations per tier.
3. **`data-model.md`** — folder layout, JSON schemas, MDX conventions, sidecar-protection rule, done-ness CI checklist.
4. **`components.md`** — prop contracts for the 15 named components + Tier 3 + Tier 4 templates. Implementation sequence.
5. **`marginalia.md`** — MDX-plus-remark-plugin system. Author experience, reader experience, technical pipeline, audience taxonomy, accessibility.

## Per-beach content lives at

```
site/content/beaches/<slug>/
├── composition.json    — tier, levers, section order, spoke list (Tier 1 + 2 only)
├── meta.json           — image catalogue with Tier A/B flags
├── showcase.json       — structured narrative content (Tier 1 + 2)
├── motif.svg           — Tier 1 signature motif
├── intro.mdx           — optional long-form
├── spike.mdx           — Tier 1 spike deep-explainer with marginalia
└── spokes/<spoke>/     — optional subpages (Tier 1 only)
```

For Tier 3 Field Guide and Tier 4 Minimal, content comes entirely from the pipeline data at `site/data/beaches/<slug>.json` plus automatic enrichment. No per-beach authored content required.

## Reference implementations

| Tier | Slug | Purpose |
|---|---|---|
| Tier 1 (Legendary) | `praia-do-norte-6` (Nazaré) | Pending implementation — reference for `<LegendaryBeachV2>` |
| Tier 2 (Featured) | `glass-beach-4` | Pending implementation — reference for Tier 2 template |
| Tier 3 (Field Guide) | `praia-de-susolmos` · `bromolithos` · `gio-hai` | **Shipped April 2026** — reference for `<FieldGuidePage>` |
| Tier 4 (Minimal) | — | Auto-promote to Tier 3 once eligible; minimal fallback template |

## Beach axes — locked 2026-04-19

Six beaches with composition.json on disk:

| Beach | Tier | Version | Spike / Subtitle |
|---|---|---|---|
| Copacabana | 1 | 0.9 | The beach the world pictures when it pictures a beach. |
| Brighton | 1 | 0.8 | Two Victorian piers: one working, one a burnt skeleton in the sea. |
| Waikīkī | 1 | 0.7 | The two miles of Pacific sand where modern surfing was reintroduced to the world. |
| Bondi | 1 | 0.7 | The beach Australian surf lifesaving was born on. |
| Nazaré (Praia do Norte) | 1 | 0.7 | A submarine canyon produces the world's largest surfable wave. |
| Glass Beach | 2 | 0.7 | Sand of rounded gemstone-coloured sea glass. |

All six currently sit below v1.0. Done-ness CI will flip them to v1.0 once structural + editorial criteria pass.

## Current state of the doc set

- [x] spec-v1.2.md — parent spec
- [x] tier-system.md — four tiers with reference implementations
- [x] data-model.md — schemas + sidecar rule
- [x] components.md — 15 component contracts + Tier 3/4 templates
- [x] marginalia.md — MDX + sidebar + audience taxonomy
- [ ] done-ness-ci.md — planned: concrete `scripts/lint-pages.ts` spec and sample fixtures
- [ ] photography.md — planned: Tier A grading spec, Commons-sourcing pipeline, rights policy

Last doc-set update: 2026-04-19.
