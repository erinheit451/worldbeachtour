/**
 * <Citation> — inline superscript reference to a source.
 *
 * Click scrolls to the corresponding Sources entry with a 3s highlight pulse.
 * Source collection happens at build time via a provider that walks
 * the page's MDX tree and assembles the bibliography in order-of-first-use.
 * See docs/legendary/components.md PART A.
 */

"use client";

import { useContext, useId } from "react";
import { CitationRegistryContext } from "../citation-registry";

interface CitationProps {
  source: string;                        // key: "wiki:Copacabana_Palace", "doi:...", "manual"
  label?: string;
}

export default function Citation({ source, label }: CitationProps) {
  const registry = useContext(CitationRegistryContext);
  const idSeed = useId();

  // Register the source; receive its 1-based index on the page
  const index = registry ? registry.registerSource(source, idSeed) : 0;

  return (
    <sup className="ml-[1px] mr-[1px]">
      <a
        href={`#source-${index}`}
        className="text-[0.7em] font-mono no-underline hover:underline"
        style={{ color: "var(--beach-primary, #0284c7)" }}
        aria-label={label ?? `Source ${index}`}
      >
        {index}
      </a>
    </sup>
  );
}
