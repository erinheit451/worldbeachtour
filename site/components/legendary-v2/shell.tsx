/**
 * <LegendaryShell> — the page wrapper for Tier 1 + Tier 2 pages.
 *
 * Injects the beach's per-page CSS custom properties (from composition.levers),
 * renders the sticky nav, wraps page content. Footer + byline rendered by
 * <Sources>, not here.
 *
 * See docs/legendary/components.md PART F.
 */

import type { ReactNode } from "react";
import type { Composition } from "./types";
import { themeStyleFromComposition } from "./theme";

interface LegendaryShellProps {
  composition: Composition;
  children: ReactNode;
}

export default function LegendaryShell({
  composition,
  children,
}: LegendaryShellProps) {
  const themeCss = themeStyleFromComposition(composition);

  return (
    <div
      data-tier={composition.tier}
      data-beach={composition.slug}
      data-voice={composition.levers.voice_register}
      className="bg-[#FAFAF7] text-volcanic-900 min-h-screen"
    >
      <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      {children}
    </div>
  );
}
