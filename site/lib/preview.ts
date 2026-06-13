/**
 * Preview-route data loader — reads the 20-beach validation bundles produced by
 * `scripts/export_preview_samples.py` into `site/data/preview/<slug>.json`.
 *
 * This is the dev harness for designing/approving the T0 (Stub) and T1
 * (Standard) every-beach templates against real, deliberately-diverse data.
 * Not part of the public build — gated under /preview.
 */

import fs from "fs";
import path from "path";

const PREVIEW_DIR = path.join(process.cwd(), "data", "preview");

export type PreviewTier = "T0" | "T1";

export interface PreviewBundle {
  // Loosely typed: the JSON carries the full StubData shape plus the
  // tier-gate fields. The components own the strict shapes.
  data: Record<string, unknown> & {
    slug: string;
    name: string | null;
    wikidata_id?: string | null;
  };
  neighbors: { slug: string; name: string; distance_km: number; has_wiki: boolean }[];
}

export interface PreviewManifestEntry {
  slug: string;
  name: string | null;
  tier_gate: PreviewTier;
  completeness: number | null;
  neighbors: number;
}

/**
 * The tier gate, per the 2026-06-13 decisions:
 *   T1 ("page with a voice")  ⇔  has a Wikidata id AND has a name
 *   T0 ("field guide")        ⇔  everything else (incl. unnamed-but-wikidata)
 *
 * Single source of truth for the preview; mirrors the rule that will land in
 * lib/tier.ts for production.
 */
export function previewTier(data: PreviewBundle["data"]): PreviewTier {
  const hasWikidata = !!data.wikidata_id;
  const hasName = !!(data.name && String(data.name).trim());
  return hasWikidata && hasName ? "T1" : "T0";
}

export function getPreviewSlugs(): string[] {
  if (!fs.existsSync(PREVIEW_DIR)) return [];
  return fs
    .readdirSync(PREVIEW_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .map((f) => f.replace(/\.json$/, ""));
}

export function getPreviewBundle(slug: string): PreviewBundle | null {
  const p = path.join(PREVIEW_DIR, `${slug}.json`);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf-8")) as PreviewBundle;
}

export function getPreviewManifest(): PreviewManifestEntry[] {
  const p = path.join(PREVIEW_DIR, "_manifest.json");
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, "utf-8")) as PreviewManifestEntry[];
}
