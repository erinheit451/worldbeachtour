# World Beach Tour — Marginalia System

**Version 1.0 · April 2026**
**Companion to:** `components.md` (the `<MarginNote>` primitive), `data-model.md` (the audience taxonomy), `spec-v1.2.md`

The mechanism that lets a single Tier 1 / Tier 2 page serve multiple reader profiles — surfers, spectators, photographers, geology nerds, families — without duplicating the page. Short sidebar annotations tagged by audience, rendered beside the paragraph they comment on.

This is the single replacement for the rejected patterns: tabs, "Paths for Different Readers," "If you have two minutes." All of those fragment the flow. Marginalia keeps one editorial flow and layers optional depth in the gutter.

---

## 1. The author experience

A writer composing an MDX file adds a margin note with a simple component tag, inline with the paragraph it comments on:

```mdx
## The Canyon

The Nazaré canyon is a submarine gorge that begins 500 m from the shore and drops to
5,000 m within twenty kilometres. Most submarine canyons diffuse swell; this one does
the opposite.

<MarginNote audience="geology">
Canyon focusing occurs when bathymetry narrows faster than wavelength decays. Nazaré's
head is unusually abrupt — IPMA (2013).
</MarginNote>

When a North Atlantic storm sends long-period swell onto the canyon, the topography
acts like an acoustic lens. At Praia do Norte the wave rises under compounded
pressure...

<MarginNote audience="surfers">
Best swell is 305° at 18 s period. The canyon focuses tightly — 5° off and the wave
is half the size.
</MarginNote>
```

**Rules for authors.**
- Place a `<MarginNote>` **immediately after** the paragraph it annotates. The renderer uses position, not explicit anchoring (see §3).
- A margin note is 20–60 words. Longer than 60 = belongs inline; shorter than 20 = probably too thin to justify.
- A paragraph may carry multiple margin notes. Each must have a distinct `audience` tag.
- Do not use margin notes for operational content (hours, prices, addresses). That's the sidebar's `PlanStack`.
- Do not use margin notes as footnotes. Citations use `<Citation>`.

**Rule for editors.** Every margin note must earn its place. If removing a margin note would not lose information specifically relevant to its audience tag, delete it.

---

## 2. The reader experience

### Desktop (≥ 1024 px)

The page renders in a 12-column grid. Prose occupies columns 1–8 (max 65ch). Margin notes live in columns 9–12, vertically aligned to the paragraph they follow.

Each margin note renders as a small card:
- **Audience pill** at top-left — uppercase, small-caps, beach's supporting accent colour, 10 px tracking-widest
- **Body text** — 14 px, muted colour (`#666`), line-height 1.55
- **Left border** — 2 px, beach's supporting accent colour, full card height
- **No background** — transparent on the page's off-white body background

Example positioning:

```
┌───────────────────────────────────────┬──────────────────────────────┐
│                                       │                              │
│  The Nazaré canyon is a submarine     │                              │
│  gorge that begins 500 m from the     │                              │
│  shore and drops to 5,000 m within    │                              │
│  twenty kilometres.                   │                              │
│                                       │                              │
│  Most submarine canyons diffuse       │  FOR GEOLOGY                 │
│  swell; this one does the opposite.   │  Canyon focusing occurs      │
│                                       │  when bathymetry narrows     │
│  When a North Atlantic storm sends    │  faster than wavelength      │
│  long-period swell onto the canyon,   │  decays. Nazaré's head is    │
│  the topography acts like an          │  unusually abrupt — IPMA     │
│  acoustic lens. At Praia do Norte     │  (2013).                     │
│  the wave rises...                    │                              │
│                                       │  FOR SURFERS                 │
│                                       │  Best swell is 305° at       │
│                                       │  18 s period...              │
│                                       │                              │
└───────────────────────────────────────┴──────────────────────────────┘
```

**Multiple notes per paragraph** stack vertically in the sidebar, in the order they appear in MDX. They scroll-align to the paragraph's top edge.

**Vertical alignment rule.** A margin note's top edge aligns to the first line of the paragraph immediately preceding it. If that paragraph is short and the margin note is tall (or vice versa), leave empty gutter — do not re-flow the margin note to fit.

### Tablet (768–1023 px)

Sidebar collapses. Each margin note becomes an **inline collapsible** placed immediately after the paragraph it annotates:

```
The Nazaré canyon is a submarine gorge that begins 500 m from the shore and
drops to 5,000 m within twenty kilometres. Most submarine canyons diffuse
swell; this one does the opposite.

  ▸ FOR GEOLOGY   [click to expand]

When a North Atlantic storm sends long-period swell onto the canyon...
```

**Collapsed state.** Displays the audience pill + a chevron. 40 px tall. Dashed top and bottom border in the supporting colour at 30 % opacity.

**Expanded state.** Shows full body text. Stays expanded until collapsed by the reader.

**Default state.** Collapsed. Readers opt in per-note.

### Mobile (< 768 px)

Identical to tablet — inline collapsibles.

### Print

Margin notes render inline with the prose, in small type, prefixed by the audience tag. No collapsibles. Readers who print a page get everything on paper.

---

## 3. Technical pipeline

### 3.1 MDX → React

**Pipeline.** `@next/mdx` with a custom remark plugin and the standard component registry.

```
.mdx source
    │
    ▼
 remark parser (unified.js)
    │
    ▼
 remark-margin-notes plugin  ←  adds positional metadata
    │
    ▼
 rehype compiler
    │
    ▼
 React tree
    │
    ▼
 <LegendaryShell> + <MarginalizedProse> layout
```

### 3.2 `remark-margin-notes` plugin

At compile time, the plugin walks the AST and for each `<MarginNote>` node:

1. Finds the preceding paragraph node (the one it annotates).
2. Assigns that paragraph a stable `id` (auto-generated hash of its first 40 characters — deterministic and stable across builds).
3. Sets `anchorParagraph` on the MarginNote equal to that paragraph id.
4. Assigns the MarginNote a sequential `id` like `margin-<paragraph-id>-<index>`.
5. Leaves the AST shape intact — the MarginNote stays where the author wrote it, so if anything downstream falls back to linear rendering, it still makes sense.

**Plugin source lives at** `scripts/mdx/remark-margin-notes.ts`. Tested against a fixture set of MDX files.

### 3.3 `<MarginalizedProse>` layout component

Wraps the full MDX-rendered tree. At render time:

1. Walks the tree, pulls every `<MarginNote>` out of the inline position.
2. Collects them into a structured list: `{ id, anchorParagraphId, audience, content }[]`.
3. Renders two siblings:
   - **Prose column:** the MDX tree with `<MarginNote>` nodes replaced by an invisible `<span id="margin-ref-N">` anchor inside the preceding paragraph.
   - **Sidebar column:** a stack of `<MarginNoteCard>` components, each with CSS `position: sticky` pinned to its corresponding paragraph's `offsetTop`.

The "pin to paragraph top" behaviour is done via `useLayoutEffect` + `IntersectionObserver`: the sidebar margin-note cards measure the position of their anchored paragraph on mount and on resize, and set `translateY` accordingly.

### 3.4 Responsive fallback

At ≤ 1023 px, `<MarginalizedProse>` switches to an inline-collapsible rendering — the sidebar column is not rendered; margin notes are emitted in-place as `<details>` elements with a small summary header.

This single component handles the responsive split; no duplication of content.

---

## 4. Audience taxonomy

Fixed and closed. Adding a new value requires a spec change + a codebase sweep. Current 11 values:

| Audience | Meaning |
|---|---|
| `surfers` | Board users, wave-riders — board selection, swell behaviour, etiquette |
| `spectators` | Visitors watching rather than participating |
| `photographers` | Angles, timing, light, access |
| `geology` | Bathymetry, sediment, formation |
| `ecology` | Species, seasonal patterns, conservation status |
| `history` | Historical events + context beyond the main prose |
| `culture` | Music, film, literature, local practice |
| `safety` | Real risks, protocols, what locals actually do |
| `operational` | Transit, access, hours, prices, booking |
| `families` | Child-appropriate, stroller access, pace |
| `accessibility` | Wheelchair access, mobility, sensory accommodations |

**Why closed.** If the set drifts to 20+ audiences, individual tags become meaningless and readers stop trusting the filter. 11 covers the legitimate reader profiles without fragmenting.

**Rendering per audience.** Each audience has a fixed display label used in the pill:

```
surfers        → "For Surfers"
spectators     → "For Spectators"
photographers  → "For Photographers"
geology        → "For Geology Nerds"
ecology        → "Ecology"
history        → "History"
culture        → "Culture"
safety         → "Safety"
operational    → "Logistics"
families       → "Families"
accessibility  → "Access"
```

The mapping lives in `site/components/legendary/audiences.ts` and is the single source of truth for both the pill label and any future filter UI.

---

## 5. Accessibility

### Screen reader order

On desktop, the DOM order matches the visual reading order: prose, then the margin note stack for that paragraph, then the next paragraph. Screen readers read margin notes **after** the paragraph they annotate, which is the correct order.

On tablet/mobile, the collapsible renders inline — screen readers skip collapsed content by default (readers opt-in by expanding). This matches visual behaviour.

### Keyboard navigation

Each `<MarginNoteCard>` is `tabindex="0"` and shows a focus ring in the supporting colour when focused. A keyboard user tabbing through a page touches each margin note, so the page doesn't hide content behind visual-only conventions.

Collapsed inline variants are standard `<details>` elements — keyboard-native expand/collapse via Enter or Space.

### ARIA

- Each `<MarginNoteCard>` has `role="complementary"` and `aria-label` like `"Margin note for surfers"`.
- The paragraph each margin note anchors to has `aria-describedby="margin-<n>"` pointing to the note. This creates an explicit semantic link that assistive tech can surface.

### Reduced motion

The sidebar's sticky-positioning uses `translateY` transitions only when `prefers-reduced-motion: no-preference`. For users with reduced motion, margin notes stay in their DOM position without the smooth-stick animation.

---

## 6. Anchor links + deep linking

### Link to a specific margin note

Each margin note's `id` is stable (deterministic from paragraph content + index). A URL like:

```
https://worldbeachtour.com/beaches/nazare/#margin-canyon-1a2b-1
```

scrolls to the paragraph, visually highlights both the paragraph and the margin note (a 3-second pulse in the supporting colour), and — on mobile — auto-expands the collapsible.

### Share-margin-note UX

Each card has a subtle `⋯` menu on hover with a "Copy link to this note" action. Used sparingly; don't make the sharing UI intrusive.

---

## 7. Content-model integration

### Per data-model.md

- Marginalia lives **inside MDX files** (spike.mdx, honest-reckoning.mdx, intro.mdx if long).
- Short prose in `showcase.json` (intro_text, day_in_time.dawn, etc.) does NOT support marginalia. If a beach needs marginalia in the Story section, promote `intro_text` → `intro.mdx`.
- The done-ness linter (`scripts/lint-pages.ts`) validates:
  - Every `<MarginNote audience="...">` uses a value from the fixed taxonomy
  - No margin note exceeds 80 words (soft warn at 60)
  - No paragraph has more than 3 margin notes

---

## 8. Edge cases

### A margin note with no preceding paragraph

If a `<MarginNote>` appears as the first node in an MDX document, the remark plugin logs a warning and renders the note inline at document top with a special `style="no-anchor"` variant. This is a content bug and should be fixed in editorial review.

### A very long margin note

Soft-cap at 60 words; hard-warn at 80. Margin notes that consistently push past these limits are editorial failures — promote to inline prose or a `<DataCallout>` or a spoke.

### A paragraph shorter than its margin note

On desktop, the margin note may visually extend below its anchored paragraph, overflowing into the gutter space beside the next paragraph. This is acceptable — the alignment rule is "top edge of margin note = top line of anchored paragraph." Overflow is better than re-aligning (which would drift the semantic link).

### Multiple audiences wanting the same info

If a margin note would legitimately serve two audiences (e.g., a safety note is also an operational note), pick the more specific one. Marginalia is not about tagging for filter completeness; it's about serving the most specific reader need.

---

## 9. Implementation checklist

To ship the marginalia system alongside the Nazaré reference implementation:

- [ ] Write `scripts/mdx/remark-margin-notes.ts` plugin with unit tests
- [ ] Build `<MarginNote>` component at `site/components/primitives/margin-note.tsx`
- [ ] Build `<MarginalizedProse>` layout component at `site/components/legendary/marginalized-prose.tsx`
- [ ] Register `<MarginNote>` and `<Figure>` / `<Citation>` etc. in the MDX components map
- [ ] CSS for sidebar grid layout, sticky positioning, audience pill styling, collapsible transitions
- [ ] A11y: keyboard focus rings, ARIA relationships, screen-reader order verified
- [ ] Reduced-motion CSS fallbacks
- [ ] Deep-linking + highlight-pulse implementation
- [ ] Lint rule: audience taxonomy validation + word-count caps
- [ ] Visual regression test against a fixture Nazaré spike.mdx

Approximate effort: 1 week of focused work. Ideally built before or alongside the first Tier 1 reference implementation (Nazaré) so the page design is informed by the real layout behaviour.

---

*End of marginalia.md v1.0*
