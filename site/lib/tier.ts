/**
 * Tier computation — single source of truth for "how richly this beach renders".
 *
 * Returns 0-3 in **architecture-doc numbering** (docs/beach-page-architecture.md):
 *
 *   T3 — Monument     hand-curated, full Legendary treatment
 *   T2 — Featured     dominant-lens MDX expansion, may have one subpage
 *   T1 — Standard     auto-generated facts page, no subpages, no lens depth
 *   T0 — Stub         honest-minimal, "help us enrich" block
 *
 * The legacy meta.json `tier` field uses a different numbering and is
 * inconsistently populated; this function is now the source of truth.
 */

import type { BeachData, BeachMeta } from "./beaches";

/**
 * Hand-curated Tier 3 monuments — the 8 Legendary v2 pages with bespoke
 * page.tsx + composition.json. Promotion to T3 is editorial, not data-driven.
 */
export const MONUMENT_SLUGS: ReadonlySet<string> = new Set([
  "bondi-beach",
  "brighton-beach-1",
  "copacabana-7",
  "malibu",
  "pipeline",
  "praia-do-norte-6",
  "teahupoo",
  "waikiki-beach-1",
]);

/**
 * Editorial Tier 2 promotions — beaches with multi-lens MDX depth where the
 * data-driven notability signal is missing or wrong. Each entry is a beach
 * we've already written ≥ 1 substantive non-overview lens for. The list
 * shrinks as the notability backfill catches up.
 */
export const FEATURED_SLUGS: ReadonlySet<string> = new Set([
  "reynisfjara",
  "glass-beach-4",
  "sao-martinho-do-porto",
]);

export type Tier = 0 | 1 | 2 | 3;

/**
 * Compute a beach's tier from its slug + data signals + meta intent.
 *
 * Order:
 *   1. Hand-override (MONUMENT_SLUGS) → T3
 *   2. Has its own composition.json + bespoke page → T2 (sao-martinho, glass-beach)
 *   3. Notability ≥ 30 → T2
 *   4. Notability ≥ 15 OR wikipedia_url present → T1
 *   5. Otherwise → T0
 */
export function computeTier(
  slug: string,
  data: BeachData | null,
  meta: BeachMeta | null
): Tier {
  if (MONUMENT_SLUGS.has(slug)) return 3;
  if (FEATURED_SLUGS.has(slug)) return 2;

  // Legacy meta.tier === 3 in our schema means "has spokes / featured".
  // The legacy 1 was used as monument intent, but those are already in
  // MONUMENT_SLUGS above so we ignore that branch here.
  if (meta?.tier === 3) return 2;

  // An authored showcase bundle (composition.json + showcase.json) is, by
  // definition, a Featured page — the assembler stamps meta.tier === 2 on
  // every one. Treat that as the source of truth so the lens/spoke routes
  // and adaptive depth un-gate for the whole authored cohort, regardless of
  // the data-driven notability signal below (rule 2 in the header).
  if (meta?.tier === 2) return 2;

  // Stubs are explicit in the meta — content that's known-thin.
  if (meta?.tier === 0) return 0;

  const notability = data?.notability_score ?? 0;
  const hasWiki = !!data?.wikipedia_url;

  if (notability >= 30) return 2;
  if (notability >= 15 || hasWiki) return 1;
  return 0;
}

export function tierLabel(tier: Tier): string {
  return ["Stub", "Standard", "Featured", "Monument"][tier];
}

/**
 * Sort key for "monuments first" ordering on listing pages.
 * Within a tier, callers should fall back to alphabetical name comparison.
 */
export function tierRank(tier: Tier): number {
  return [4, 3, 2, 1][tier]; // T3=1 (best), T0=4 (worst)
}
