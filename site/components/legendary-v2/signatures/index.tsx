/**
 * Signature registry — maps a beach slug to its bespoke signature visual.
 *
 * The ~25-35% of marquee beaches whose spike is intrinsically visual/spatial
 * register a component here; the rest ride the upgraded generic template with
 * no entry. The renderer looks the slug up and renders it inside the spike
 * section (the visual argument for the spike).
 */

import type { ComponentType } from "react";
import NavagioFrame from "./navagio-frame";

export const SIGNATURES: Record<string, ComponentType> = {
  "navagio-1": NavagioFrame,
};

export function getSignature(slug: string): ComponentType | null {
  return SIGNATURES[slug] ?? null;
}
