/**
 * <MarginNote> — audience-tagged sidebar annotation.
 *
 * At build time the remark-margin-notes plugin tags each MarginNote with
 * `anchorParagraph` (the preceding paragraph's stable id). At render time
 * the <MarginalizedProse> layout pulls MarginNote nodes out of the inline
 * position and renders them in the sidebar (desktop) or as inline
 * collapsibles (tablet + mobile).
 *
 * This component is the rendering half. The plugin is at
 * scripts/mdx/remark-margin-notes.ts (pending).
 *
 * See docs/legendary/marginalia.md for the full contract.
 */

"use client";

import { useId, type ReactNode } from "react";
import { AUDIENCE_LABELS, type Audience } from "../types";

interface MarginNoteProps {
  audience: Audience;
  id?: string;
  anchorParagraph?: string;
  layout?: "sidebar" | "inline-collapsible";  // set by MarginalizedProse
  children: ReactNode;
}

export default function MarginNote({
  audience,
  id,
  layout = "sidebar",
  children,
}: MarginNoteProps) {
  const autoId = useId();
  const noteId = id ?? `margin-${autoId}`;
  const label = AUDIENCE_LABELS[audience] ?? audience;

  if (layout === "inline-collapsible") {
    return (
      <details
        className="my-4 border-y border-dashed py-3"
        style={{
          borderColor:
            "color-mix(in srgb, var(--beach-supporting, #94a3b8) 30%, transparent)",
        }}
        id={noteId}
      >
        <summary className="cursor-pointer flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-mono text-volcanic-600">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: "var(--beach-supporting, #94a3b8)" }}
            aria-hidden="true"
          />
          {label}
          <span className="ml-auto text-volcanic-400">▸</span>
        </summary>
        <div className="mt-3 text-sm text-volcanic-600 leading-[1.55]">
          {children}
        </div>
      </details>
    );
  }

  // sidebar layout — rendered by MarginalizedProse into the gutter column
  return (
    <aside
      id={noteId}
      role="complementary"
      aria-label={`Margin note: ${label}`}
      tabIndex={0}
      className="group border-l-2 pl-4 py-1 my-6 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-r-sm"
      style={{
        borderColor: "var(--beach-supporting, #94a3b8)",
      }}
    >
      <div className="text-[10px] uppercase tracking-[0.15em] font-mono mb-1"
        style={{ color: "var(--beach-supporting, #64748b)" }}
      >
        {label}
      </div>
      <div className="text-[14px] leading-[1.55] text-volcanic-600">
        {children}
      </div>
    </aside>
  );
}
