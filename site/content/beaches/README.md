# Beach content directory

This directory holds **beach content that is NOT pipeline-managed**. Any enrichment script that regenerates `site/data/beaches/<slug>.json` from the database must NOT touch anything under this directory.

## Per-beach layout

```
content/beaches/<slug>/
├── meta.json         # hero + section images, attributions, licenses
├── showcase.json     # Tier-1 showcase content (signature pages only)
└── *.mdx             # lens text for non-showcase beaches
```

## `showcase.json` — the protected Tier-1 content

Signature beaches (Copacabana, Waikīkī, Bondi — see `app/beaches/[slug]/layout.tsx`'s `SHOWCASE_SLUGS`) store their hand-written editorial content here. This includes:

- `intro_text` — the 4–6 paragraph lead prose
- `favela_note` — the honest-context prose
- `day_in_time` — four-time-of-day vignettes
- `timeline` — 15–20 curated historical events with Wikipedia citations
- `zones` — beach zones with position + character + best-for
- `landmarks` — 6–12 named landmarks
- `cultural_refs` — film, TV, music, literature, historical, brand references
- `recurring_events` — annual events with attendance figures
- `businesses` — verified restaurants, hotels, museums
- `food_drink` — 4–6 food/drink items with description + where

The page renderer (`app/beaches/<slug>/page.tsx`) loads `data/beaches/<slug>.json` from the pipeline **and** `content/beaches/<slug>/showcase.json` from this directory, then merges. The pipeline can rewrite `data/beaches/<slug>.json` freely without losing showcase content.

**Rule for pipeline authors:** never write to anything under `content/beaches/`. The pipeline's output path is `data/beaches/`.

See `docs/legendary-beach-playbook.md` for the full editorial process + schema.
