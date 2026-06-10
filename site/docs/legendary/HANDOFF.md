# Legendary pages — handoff

Last updated: 2026-04-19

## Read this first — the intent (in Erin's words)

> "Make each one as good as it can be in its own right. AND them all have a
> consistent design language. Then all have the appropriate sub pages…
> there isn't a consistent typography or rules. It gets hodgepodged. I want
> to simplify and enhance the style guide. And then there are elements that
> stick out like a sore thumb. Then that drift has been applied to
> subsequent pages where we forcefit sections that don't belong. So it
> needs cleaned up. A properly built Nazaré page with sub pages in a
> polished consistent design language would be a win. Then we align it
> against the other legendary pages."

The four-part goal:

1. **Each legendary page is bespoke** — as good as it can be on its own terms.
2. **They share a consistent design language** — typography scale, color
   tokens, component vocabulary, section rhythm. Not a fixed template.
3. **Each has appropriate sub pages** — the ones *that beach* earns, not a
   template list applied to every page.
4. **Cleanup** — existing 6 legendary pages have hodgepodge typography and
   forcefit sections. Fix the style guide, then align each page to it.

**Middle tier** = "popular beach pages that people would know but not
beaches EVERYONE would know." To be defined after Nazaré is locked.

## The trap to avoid

Prior sessions kept producing big spec docs and flexible-composition
frameworks before confirming alignment. Erin's frustration:

- "I don't want a fixed template for legendary beach pages. I want a
  consistent design language that flexes so that each one is definitive
  and exceptional."
- "You're not hearing me still."

**Work order for the next session:**

1. Audit what's on Praia do Norte today — load-bearing vs. forcefit.
2. Show Erin the audit. Get alignment before coding.
3. **Short, tight** style-guide doc — typography scale (3 sizes not 8),
   color tokens, approved component vocabulary, section rhythm rules. Not
   a spec. A constraint list.
4. Rebuild Praia do Norte against it on `/beaches-v2/praia-do-norte-6`.
5. Name Nazaré's sub-pages (the ones this beach earns, not the abstract
   spoke list).
6. Align the other 5 legendary pages against the reference.

Do NOT write 500-line spec docs, MDX plugins, lint rules, or CI scripts
before the Nazaré rebuild ships. Those are downstream of a working
reference.

## Where work currently sits

### Legendary pages in the DB (6)

All have composition.json at `site/content/beaches/<slug>/composition.json`:

| Slug | Tier | Spike | Voice | Hero | Version | Page file |
|------|------|-------|-------|------|---------|-----------|
| copacabana-7 | 1 | cultural-ubiquity | ROMANTIC | MONUMENT | v0.9 | `app/beaches/copacabana-7/page.tsx` |
| brighton-beach-1 | 1 | two-piers | WRY | LAYERED | v0.8 | `app/beaches/brighton-beach-1/page.tsx` |
| waikiki-beach-1 | 1 | surfing-reintroduced | REVERENT | LAYERED | v0.7 | `app/beaches/waikiki-beach-1/page.tsx` |
| bondi-beach | 1 | surf-lifesaving-origin | WRY | MONUMENT | v0.7 | `app/beaches/bondi-beach/page.tsx` |
| **praia-do-norte-6** | 1 | the-canyon | SEVERE | SPIKE | v0.7 | `app/beaches/praia-do-norte-6/page.tsx` |
| glass-beach-4 | 2 | — | CLINICAL | ABSENCE | v0.7 | `app/beaches/glass-beach-4/page.tsx` |

praia-do-norte-6 is marked `reference_implementation: true`.

### Current live page architecture (v1)

Each legendary page uses `<LegendaryBeach>` from
`components/showcase/legendary-beach.tsx` with per-beach config passed as
props + optional signature components. This is the CMS-template
architecture Erin flagged as wrong. Page files are 260–360 lines of config.

### v2 scaffold (in progress, not shipping yet)

- `site/components/legendary-v2/` — full scaffold built but **don't
  generalize it further** until Nazaré's shape is known.
  - `types.ts`, `theme.ts`, `citation-registry.ts`, `shell.tsx`,
    `sticky-nav.tsx`, `legendary-beach-v2.tsx`
  - `primitives/`: section-divider, pull-quote, figure, citation,
    data-callout, margin-note
  - `sections/`: hero, quick-facts, story, spike-deep-explainer, sources
  - 10+ sections from the composition list are still stubbed as
    `<PendingSection>` — **do not build them all out until Nazaré tells
    you which ones are actually needed.**
- Preview route: `/beaches-v2/<slug>` at
  `site/app/beaches-v2/[slug]/page.tsx`

### Spec docs (archive; don't treat as law)

`site/docs/legendary/` — README, spec-v1.2.md, tier-system.md,
data-model.md, components.md, marginalia.md, done-ness-ci.md. Useful
reference for the six-axis lever system and audience taxonomy. **Do not
implement these end-to-end before Nazaré ships.**

## Deployment

- Host: Hetzner DE (178.104.99.176), nginx + Let's Encrypt, HTTP/2
- Deploy: `bash site/scripts/deploy.sh` (rsync, never manual tar)
- `/beaches-v2/*` preview route is safe to ship; legendary v1 routes at
  `/beaches/<slug>` remain live and unchanged

## The Praia do Norte audit (started, not finished)

The audit step ran through loading the page file + showcase.json. Full
data captured, analysis not yet produced for Erin. Files read:

- `site/content/beaches/praia-do-norte-6/composition.json`
- `site/content/beaches/praia-do-norte-6/showcase.json`
- `site/app/beaches/praia-do-norte-6/page.tsx` (290 lines)

**Next action when resuming:** open the page in a browser (locally or
live at https://worldbeachtour.com/beaches/praia-do-norte-6) and walk
section-by-section. For each section answer:

1. Does this section genuinely belong on the Nazaré page?
2. Is the typography consistent with the rest?
3. Does it "forcefit" a template pattern that wasn't earned here?

Then write a short audit note — one paragraph per section, ship it to
Erin. DO NOT start coding until Erin aligns on the audit.

## Useful memory pointers

Check these before starting work:

- `~/.claude/projects/C--users-roci/memory/feedback_landmark_vs_template.md`
- `~/.claude/projects/C--users-roci/memory/feedback_erin_collaboration_mode.md`
- `~/.claude/projects/C--users-roci/memory/project_worldbeachtour.md`
- `~/.claude/projects/C--users-roci/memory/project_worldbeachtour_hosting.md`
