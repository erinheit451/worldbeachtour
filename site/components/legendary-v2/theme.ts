/**
 * Theme helpers for the legendary-v2 scaffold.
 *
 * A page injects its beach's levers as CSS custom properties via inline
 * <style> at the root of <LegendaryShell>. This file produces that CSS
 * from a Composition object.
 */

import type { Composition, DisplayPairing } from "./types";

const DISPLAY_FAMILIES: Record<DisplayPairing, string> = {
  CLASSICAL:
    "var(--font-dm-serif-display), 'GT Sectra Display', Georgia, serif",
  AUSTERE:
    "var(--font-barlow-condensed), 'Barlow Condensed', 'Oswald', 'Impact', sans-serif",
  VERNACULAR:
    "var(--font-inter), 'Helvetica Neue', Arial, sans-serif",
};

const DISPLAY_TRACKING: Record<DisplayPairing, string> = {
  CLASSICAL: "-0.015em",
  AUSTERE: "-0.03em",
  VERNACULAR: "0em",
};

export function themeStyleFromComposition(composition: Composition): string {
  const { primary_color, supporting_color, display_pairing } = composition.levers;
  return `
:root {
  --beach-primary: ${primary_color};
  --beach-supporting: ${supporting_color};
  --display-family: ${DISPLAY_FAMILIES[display_pairing]};
  --display-tracking: ${DISPLAY_TRACKING[display_pairing]};
}
`.trim();
}

export { DISPLAY_FAMILIES };
