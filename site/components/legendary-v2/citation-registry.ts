/**
 * Citation registry — shared context that collects <Citation> usages
 * across an MDX tree so the Sources component can render them
 * in order-of-first-use.
 *
 * Per-page singleton, provided by <LegendaryShell>.
 */

"use client";

import { createContext } from "react";

export interface CitationRegistry {
  registerSource: (sourceKey: string, seed: string) => number;
  getOrderedSources: () => string[];
}

export const CitationRegistryContext = createContext<CitationRegistry | null>(null);

/**
 * Simple in-memory implementation. For server-rendered pages, we
 * collect citations during the render pass and emit them into the
 * Sources component via a parallel walk. (Client-side: the registry
 * is re-hydrated on mount.)
 */
export function createCitationRegistry(): CitationRegistry {
  const ordered: string[] = [];
  const indexOf = new Map<string, number>();

  return {
    registerSource(key: string) {
      const existing = indexOf.get(key);
      if (existing !== undefined) return existing;
      ordered.push(key);
      const idx = ordered.length;
      indexOf.set(key, idx);
      return idx;
    },
    getOrderedSources() {
      return [...ordered];
    },
  };
}
