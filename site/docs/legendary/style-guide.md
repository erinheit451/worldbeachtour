# Legendary page style guide

Locked: 2026-04-29 — derived from `nazare-v2.tsx` rev 1.0.

This is a constraint list, not a spec. Each monument page is bespoke; these rules keep them from hodgepodging. **If a rule blocks something the page genuinely earns, the rule loses — but document why in the page header.**

## Display family

Every monument declares a `display_pairing` in `composition.json`. The shell injects `--display-family` as a CSS custom property; everything visual reads from that variable. Three pairings exist (`theme.ts`):

| Pairing | Family | Use for |
|---|---|---|
| AUSTERE | Barlow Condensed | Editorial monuments where the *place* is the subject (Nazaré, Bondi-likely) |
| CLASSICAL | DM Serif Display | Heritage / historic register (Brighton-likely, Waikīkī-likely) |
| VERNACULAR | Inter | Plain modern register (Glass Beach, T2 baseline) |

**Rule:** never use the Tailwind `font-display` class on anything that also has `style={DISPLAY_STYLE}`. The inline style wins; the class is a footgun. Use `style={DISPLAY_STYLE}` exclusively, where:

```tsx
const DISPLAY_STYLE: React.CSSProperties = {
  fontFamily: "var(--display-family, var(--font-barlow-condensed))",
};
```

The fallback in the inline style should match the family the page is *actually* designed against, not generic Inter — so a CLASSICAL page should fall back to DM Serif, not Inter.

## Type scale

Five sizes, codified at the top of every monument file:

| Token | Mobile · Desktop | Use |
|---|---|---|
| `H1` | text-5xl · text-7xl/8xl | Hero only — once per page |
| `H2` | text-[32px] · text-[44px] | Section headers |
| `H3` | text-[22px] | Sub-heads inside sections |
| `H4` | text-base | Micro-labels |
| `FACT_VALUE` | text-[26px] | Data display only (numbers in asides, callouts) |

**Forbidden:** `text-2xl`, `text-3xl`, `prose-lg`, ad-hoc `text-[N]px` in body copy. SVG diagrams may have their own type island (the cross-section in Nazaré uses 8–11px mono labels) — that's fine, they're diagrams.

## Body and eyebrow

| Token | Class |
|---|---|
| `BODY` | text-[19px] leading-[1.75] text-volcanic-700 |
| `BODY_DARK` | text-[18px] leading-[1.7] text-[#CBD5E1] (DARK sections only) |
| `BODY_SM` | text-sm leading-relaxed text-volcanic-700 (cards, captions, asides) |
| `EYEBROW` | text-[11px] font-mono uppercase tracking-[0.3em] text-[color:var(--beach-primary,#…)] |

**Rule:** one eyebrow per section, in the section header. Don't sprinkle them inside sections at smaller sizes.

## Section backgrounds — three only

| Token | Hex | Use |
|---|---|---|
| `PAPER` | `#FAFAF7` | Spine sections (Story, Timeline, Culture, When-to-come, Nearby, Spoke Footer) |
| `COOL` | `#F1F5F9` | Deep-explainer middle (Canyon, Water Stories, Zones, Day, Village) |
| `DARK` | `#0F172A` | Earned inversion — one per page maximum (Nazaré: "Village Beneath") |

**Cream `#FAF6EF` is dead.** It existed to differentiate Zones/Day/Village from Canyon/Water Stories, but a 4-color palette on a long page felt arbitrary. If three look monotonous, fix it with a divider treatment, not a 4th color.

## Section rhythm

- Padding: `py-20 sm:py-28` always.
- Width: pick **one** of `max-w-3xl` (narrow) / `max-w-6xl` (wide) / `max-w-7xl` (full) per section.
- Order: eyebrow → H2 → kicker (italic serif) → body. Don't invert.
- Pull-quote: hero size only, at end of Story. No mid-section pull-quotes elsewhere.

## Card patterns

**One card pattern per page.** If Zones uses bordered white cards in a grid, Nearby cannot use the same shape — switch to a divided horizontal list. Spoke Footer is always card-like, so it consumes the budget; pick one of {Zones, Nearby, anywhere-else} to match it.

Card defaults when used:
- `rounded-sm` (not `rounded-xl`)
- `bg-white border border-[#CBD5E1]`
- Body copy inside cards is always `BODY_SM`, never `BODY`.

## Component vocabulary

The blessed primitives. **Don't invent new ones during cleanup; let the next monument's needs surface a real shared primitive.**

- `Section`, `SectionHeader`
- `Figure`, `PullQuote`, `Citation` (in `primitives/`)
- `ClusterRail`, `ClusterAside`, `ClusterLink` (cross-spoke nav)
- `Hero` (with `heroType` MONUMENT | SPIKE | LAYERED | ABSENCE)
- `Fact` (data-display rows in asides)

## Spoke set

**Three spokes per monument, max.** Each spoke must read cold (a reader who never opens main can still get what they came for). The set is bespoke per beach — Nazaré earns Travel · Surfing · Sanctuary; Bondi will likely earn Travel · Surfing · Lifesaving-or-Gadigal; Brighton will likely earn Travel · Pavilion · Queer-history.

**A "Local / events" spoke is usually a smell** — fold seasonal rhythm and recurring-events into a thin "When to come" band on main, with deep-links into the spokes that already exist. Nazaré's `WhenToComeSection` is the reference.

## Honest reckoning

Every monument page is incomplete without the weight it carries. Nazaré's "Village Beneath" — the tourism-vs-fishery tension — is the reference. **One DARK section per page** named for the specific tension that beach earns:

- Nazaré: village priced out by tourism
- Bondi: Gadigal Country / colonial overlay
- Waikīkī: kingdom-overthrow / Hawaiian sovereignty
- Copacabana: favela / asfalto inequality
- Brighton: queer history / mods-and-rockers
- Pipeline / Malibu / Teahupoo: still earning their tension

The DARK section earns the inversion **only if** it's the strongest writing on the page after the Story. If it's a checkbox, cut it.

## File header

Every monument file starts with:

```tsx
/**
 * <Beach> — bespoke Tier 1 page. Legendary v2, revision X.Y.
 *
 * Thesis (spike):
 *   "<one-sentence thesis the page argues>"
 *
 * Section palette: PAPER (spine) · COOL (middle) · DARK (one earned inversion).
 * Display family: <AUSTERE | CLASSICAL | VERNACULAR>.
 *
 * Deviations from style-guide.md (if any), with why.
 */
```

If the page deviates from this guide, that's where the deviation gets named and justified. Silent drift is the failure mode.
