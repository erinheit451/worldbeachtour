# Praia do Norte (Nazaré) — delta audit, 2026-04-29

Audit of the **shipped v2 page** against the **2026-04-19 audit** (`audit-praia-do-norte.md`). Most of the original audit was implemented in the live page. This doc captures what drifted, what's still forcefit, what's underdone, and the typography rules to lock so the other 5 monuments can be aligned.

Source under audit: `site/components/legendary-v2/nazare-v2.tsx` (live at https://worldbeachtour.com/beaches/praia-do-norte-6).

---

## Score: the v2 page is largely faithful to intent

| 2026-04-19 audit asked | v2 page shipped | Status |
|---|---|---|
| Cut Paths signature | Not present | ✓ |
| Cut Versus signature (Pipeline/Mavericks) | Not present | ✓ |
| Cut View-back gallery | Not present | ✓ |
| Cut Climate bar chart | Not present | ✓ |
| Cut Planner / Stay / Eat from main | Not present | ✓ |
| Cut Calendar / recurring events from main | Not present | ✓ |
| Demote Sources to footer | `PageProvenance` block at bottom, small type | ✓ |
| Rename `postos` anchor | Now `zone_code` | ✓ |
| Cultural footprint as prose, not 15-card grid | 3 prose articles | ✓ |
| Honest Context renamed to "Village Beneath" | `VillageBeneathSection` | ✓ |
| Drop-cap Story opener + pull-quote | Both present | ✓ |
| Spoke footer with 3 links | Present | ✓ (with a substitution — see drift) |

**The page is closer to landing than the original audit assumes.** The remaining work is delta cleanup, not rewrite.

---

## Drift — what changed between intent and implementation

### 1. Spoke set: `Local` was replaced by `Sanctuary`

The original audit named three spokes: **Travel · Local · Surfing**. The shipped page links: **Travel · Surfing · Sanctuary**.

This is a substantive call, not a rename. `Sanctuary` covers the 1182 Lenda, the Santuário, the 8 Sept Festas — all the religious-pilgrimage layer. But the `Local` spoke as originally defined also held secular events: WSL Tow Challenge, Carnaval, Feira do Livro, Museu do Surf hours, the seasonal rhythm scaffold. Those have **no home now**.

**Decision needed (Erin):**
- (a) Add a fourth spoke "Local" alongside Sanctuary — clean separation, but four-spoke pages start to feel template-y.
- (b) Fold secular events into Travel ("when to come" is a planning question) and let Sanctuary stay religious — probably right.
- (c) Add a thin `When to come` band on main (1 paragraph: surf season Oct-Feb, pilgrimage Sept 8, empty-village spring) and let the actual event detail live wherever it lands. My pick.

### 2. Timeline: 7 events shipped, audit said review-but-keep-15

`HISTORY_KEEP = new Set([1182, 1377, 1577, 1968, 2011, 2020, 2023])` filters down from the showcase.json's 15-event timeline. The audit explicitly said *"keep all 15 events; review whether 2011 + 2013 McNamara rides collapse to one beat."* The v2 page collapsed much harder than that.

The 7 chosen are good (founding legend → sanctuary → Spanish raid → fado → McNamara → record → UNESCO), but **8 turning points are silent**: 1755 Lisbon earthquake/tsunami (the canyon connection!), 1889 funicular, 1952 Guimarães film, 1968 Portuguese revolution era, 2013 Gabeira wipeout, 2017 Koxa record, 2021 HBO premiere. Some of these are load-bearing — especially 1755, which is referenced in the Canyon section text but not in the timeline.

**Decision:** expand to 10–12 events. Keep the 7 already there; add 1755 (canyon physics + national disaster), 1889 (funicular — the only piece of village infrastructure named in the page), 2013 (Gabeira — already in Water Stories text, deserves the timeline beat), 2021 (HBO — referenced in Cultural Footprint, deserves the beat). The other 8-event gap can stay implicit.

### 3. Water Stories on main reads surf-spoke

The audit said *"the applied forecasting / wetsuit / safety-driver detail goes to Surfing spoke; main page gets the conceptual version."* But `WaterStoriesSection` on main has:
- Tow-in protocol mechanics (two jet-skis, rescue sled, 90-second target)
- Named water-safety drivers (Lucas Chianca, Nic von Rupp, Pedro "Scooby" Vianna, Kai Lenny)
- Wipeout physiology (CO₂ vest, 45-second hold-down)

That's surfer-grade detail. It belongs on `/surfing`, not main. Main needs: McNamara 2011 inflection (✓ kept), Maya Gabeira survival arc (✓ kept), Márcio Freire death (✓ kept) — those are *narrative* beats. The protocol/safety-team material is *applied* and breaks the audit's main-vs-spoke rule.

**Recommendation:** trim the third article ("The Water-Safety Operation") down to ~80 words on main — "you don't paddle into Nazaré; you're towed. There's a community of safety drivers who live here from October through February." Move the protocol detail and named drivers to `/surfing`. Net cut: ~400 words. Density on main goes down; main gets faster.

### 4. "Nearby on the Silver Coast" — a section the audit didn't bless

The audit's 10-section list ends with `Spoke Footer`. The shipped page has an 11th section: 5 cards on São Martinho, Alcobaça, Peniche, Óbidos, Batalha. **This section is some of the strongest non-Nazaré writing on the page** — it argues Nazaré-as-anchor of the Costa de Prata, not Nazaré-as-isolated-spectacle.

Keep it. It's earned, not forcefit. The audit was just incomplete on this point.

But: **the framing differs from the rest of the page.** Story/Canyon/Village are Nazaré-specific in voice. Nearby reads like a mini travel guide. Two soft fixes:
- Drop the cards from `bg-white` rounded boxes to flat prose-like blocks. The card pattern repeats elsewhere on the page (Zones, Spoke Footer) — three different things shouldn't all use card grids.
- Rename the section header. "Five places within an hour" is generic-tasteful. Something specific: "What you can drive to in an hour and why it's the trip" or "The coast Nazaré is the middle of."

### 5. Drop-cap font fallback bug

Story drop-cap uses inline `<style>` to set `font-family: var(--display-family, var(--font-inter))`. If the CSS variable doesn't load (cold render, slow font), the fallback is **Inter** — but the page is using Barlow Condensed everywhere else. Inter would look badly out of register at 120px. Fallback should be `var(--font-barlow-condensed), 'Impact', sans-serif` — match the AUSTERE family the rest of the page uses, not generic Inter.

---

## Typography drift — three rules to lock

The v2 page **already declares its own typography tokens** (`H2`, `H2_DARK`, `H3`, `H3_DARK`, `H4`, `EYEBROW`, `BODY`, `BODY_DARK`, `BODY_SM`, `PullQuote` sizes). Good — these are codified. But there's still drift inside the page:

### Rule 1 — kill the redundant `font-display` class on headings

H2 and H3 declare both `font-display` (which maps to DM Serif via `globals.css`) **and** `style={fontFamily: var(--display-family)}` (which overrides to Barlow Condensed for AUSTERE). The inline style wins, so the class is dead — but it's a footgun. If someone removes the inline style next refactor, headings silently flip to DM Serif and the page goes hodgepodge.

Fix: drop `font-display` from these strings. Or build a `<DisplayHeading>` component that does both properly. The latter is cleaner and reusable across the other 5 monuments.

### Rule 2 — `Fact` display size is a 4th heading size that wasn't in the audit's "four sizes"

`Fact` uses `text-[26px]` for data-display labels in the Canyon aside. That's between H3 (22px) and H2 (44px) — a fifth display size the audit's "four sizes only" rule didn't anticipate. Two options:
- **(a) Promote `Fact` value type to H3 (22px)** — same size, just slightly different weight/spacing. Loses a hair of visual hierarchy in the aside.
- **(b) Codify `text-[26px]` as the *data-display* size** — name it `FACT` in the typography tokens. It's a real-use case (numbers want to be bigger than headings around them), and the cross-section SVG also has its own type (10px mono labels) which is similarly defensible.

My pick: **(b) — codify a 4th size called FACT (26px) explicitly, named for "data display" use only.** The audit's "four sizes" rule should become **four prose sizes + one data size**, not "four total."

### Rule 3 — H2 size is enormous

`H2 = text-[44px] sm:text-[60px]` — section headings on Nazaré are **larger than the H1 on most sites' homepages**. On a long page (~6 screens of content), this much display type starts to feel monotonous. The Story drop-cap (120px) and the Hero h1 (`text-7xl/text-8xl` = 72-96px) are the only things that should be huge; H2 should be ~36-44px.

Recommendation: **drop H2 sm to `text-[44px]`, drop the lg jump to nothing (or `text-[48px]`).** Keeps the editorial weight without screaming. Compare against Brighton/Bondi/Copa later — if their H2 is the same size, they'll feel monotonous too once you see them in sequence.

### Rule 4 — section background palette is too rich

The page uses **four** section background colors: paper-white, cool grey, cream, dark slate. That's a lot of vertical color movement on one page. Walk-through (top to bottom):

| § | Color | Section |
|---|---|---|
| 1 | (hero photo) | Hero |
| 2 | paper-white | Story |
| 3 | cool grey | Canyon |
| 4 | cool grey | Water Stories |
| 5 | cream | Zones |
| 6 | cream | Day |
| 7 | cream | Village |
| 8 | paper-white | Timeline |
| 9 | paper-white | Cultural Footprint |
| 10 | **DARK** | Village Beneath |
| 11 | paper-white | Nearby |
| 12 | paper-white | Spoke Footer |

The dark Village Beneath earns the inversion — it's the honest-reckoning section. But cream → paper-white at the Day → Timeline boundary feels arbitrary, and the Day section's cream lasts only one short section before the cream → cream → cream Village/Zones run.

**Cleaner: 3 backgrounds.**
- Paper-white: Story, Timeline, Cultural Footprint, Nearby, Spoke Footer (the spine)
- Cool grey: Canyon, Water Stories, Village (the deep-explainer middle)
- Dark slate: Village Beneath only (earned inversion)

Drop cream entirely. Day folds into Village (it's already cream — same color, same style — they should be one section anyway).

---

## What goes on the style guide doc (the actual deliverable)

Once Erin signs off on the audit above, the style guide is **one page**, not a spec:

```
TYPOGRAPHY (per-page; uses --display-family for AUSTERE/CLASSICAL/VERNACULAR)

Sizes (mobile · desktop):
  H1   text-5xl · text-7xl/8xl   hero only
  H2   text-3xl · text-[44px]    section headers (down from 60px)
  H3   text-xl  · text-[22px]    sub-heads
  H4   text-base                 micro-labels
  FACT text-[26px]               data-display only (Fact, etc.)
  BODY text-[19px]/1.75          long-form prose
  BODY_SM text-sm/relaxed        cards, captions, asides
  EYEBROW text-[11px] mono uppercase tracking-[0.3em]   one per section

Forbidden: text-2xl, text-3xl, prose-lg, ad-hoc text-[N]px in body content,
font-display class on anything that also has style={fontFamily: var(--display-family)}

SECTION BACKGROUNDS (3 only)
  PAPER  #FAFAF7    spine sections
  COOL   #F1F5F9    deep-explainer middle sections
  DARK   #0F172A    earned inversion only (one per page max)

SECTION RHYTHM
  - section padding: py-20 sm:py-28 always
  - max-w-3xl narrow / max-w-6xl wide / max-w-7xl full — pick one per section
  - Eyebrow → H2 → kicker (italic serif) → body. Always in that order.
  - Pull-quote: hero-size only at end of Story. No mid-section pull-quotes elsewhere.

CARDS
  - rounded-sm (not rounded-xl)
  - bg-white border border-[#E2E8F0]
  - one card pattern per page max — if Zones uses cards, Nearby cannot.

COMPONENT VOCABULARY (the only blessed primitives)
  Section, SectionHeader, Figure, PullQuote, ClusterRail, ClusterAside,
  ClusterLink, Fact, Hero, DisplayHeading (TBD)
```

That's the constraint list. ~30 lines.

---

## Recommended order of operations from here

1. **Erin reads this audit, agrees/redirects** (≤ 30 min).
2. **I implement the Nazaré drift fixes** as listed above, on the live page (no v3 fork). Estimate: 1–2 hours of focused work.
   - Move surf-protocol detail from Water Stories § iii to `/surfing` spoke
   - Expand timeline from 7 to 10-12 events
   - Drop `cream` background — collapse Zones/Day/Village to either paper or cool
   - Trim H2 size from 60px to 44px, see how it feels
   - Build `<DisplayHeading>` component, replace H2/H3 string usage
   - Add FACT size to codified tokens; SVG type stays as island
   - Fix drop-cap font fallback
   - Decide spoke set: 3 vs 4 vs Sanctuary-as-Local-merge
3. **Lock the style guide** above as `site/docs/legendary/style-guide.md`.
4. **Align the other 5 monuments to the rules**, one at a time. Each takes ~1 session of cleanup. Order suggested: Bondi (closest in tone) → Copacabana → Waikīkī → Brighton → Glass Beach. Pipeline / Malibu / Teahupoo are still in build phase and can be designed against the rules from the start.
5. **Then and only then** decide the Tier-2 pilot (Whitehaven per architecture doc) and Phase 0 plumbing.

The 61-file v2 framework stays — it's mostly fine. Don't extend it during cleanup; let it earn extension when the next monument's needs surface a real shared primitive.

## Open question for Erin

Is the spoke-set call (3 spokes Travel/Surfing/Sanctuary, with secular events folded into Travel + a thin "When to come" band on main) the right shape? Or does Nazaré genuinely earn a 4th `Local` spoke?

This is the only piece I'm not confident on without you weighing in.
