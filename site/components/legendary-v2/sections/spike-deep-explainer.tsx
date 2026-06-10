/**
 * <SpikeDeepExplainer> — the signature section of a Tier 1 page.
 *
 * Densest editorial + visual content. On Tier 1, claims ≥30% of
 * content-section real estate after the hero.
 *
 * First-draft rendering: consumes prose from a string (not yet MDX with
 * marginalia) + an optional lead image. Upgrade path: once
 * <MarginalizedProse> + remark plugin land, swap to that for full
 * margin-note support.
 *
 * See docs/legendary/components.md PART B.
 */

import type { ReactNode } from "react";
import type { SectionImage } from "../types";
import Figure from "../primitives/figure";
import { SectionHeader } from "./story";

interface SpikeDeepExplainerProps {
  title: string;
  kicker?: string;
  prose: string;                     // paragraphs joined by \n\n
  leadImage?: SectionImage;
  supportingImages?: SectionImage[]; // for inline figures every N paragraphs
  tier: 1 | 2;
  children?: ReactNode;              // escape hatch for richer MDX content
}

export default function SpikeDeepExplainer({
  title,
  kicker,
  prose,
  leadImage,
  supportingImages = [],
  tier,
  children,
}: SpikeDeepExplainerProps) {
  const paragraphs = prose.split("\n\n").filter(Boolean);

  // Interleave supporting images every 3 paragraphs
  const interleavedBlocks: ReactNode[] = [];
  paragraphs.forEach((p, i) => {
    interleavedBlocks.push(
      <p
        key={`p-${i}`}
        className="text-volcanic-700 leading-[1.75] text-[19px] my-6"
      >
        {p}
      </p>
    );
    const imageIdx = Math.floor((i + 1) / 3) - 1;
    if ((i + 1) % 3 === 0 && supportingImages[imageIdx]) {
      interleavedBlocks.push(
        <Figure
          key={`img-${imageIdx}`}
          image={supportingImages[imageIdx]}
          size="wide"
        />
      );
    }
  });

  return (
    <section
      id="spike"
      className="py-24 sm:py-32"
      style={{
        background:
          "color-mix(in srgb, var(--beach-primary, #475569) 4%, transparent)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mx-auto">
          <SectionHeader eyebrow="The Spike" title={title} kicker={kicker} />
        </div>

        {leadImage && (
          <div className="mb-16">
            <Figure image={leadImage} size="full-bleed" />
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          {children ?? interleavedBlocks}
        </div>
      </div>
    </section>
  );
}
