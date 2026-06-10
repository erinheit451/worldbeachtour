/**
 * <Figure> — image with caption + Tier A/B photographic treatment.
 *
 * Tier A (editorial-graded): no inset frame, standard caption.
 * Tier B (archival): 1px inset frame in supporting color at 40% opacity,
 *                    caption italicised-date-prefixed when datePrefix provided.
 * See docs/legendary/components.md PART A.
 */

import type { ReactNode } from "react";
import type { SectionImage, PhotoTier } from "../types";

interface FigureProps {
  image?: SectionImage;                 // if provided, overrides individual fields
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  tier?: PhotoTier;
  author?: string;
  license?: string;
  sourceUrl?: string;
  size?: "inline" | "wide" | "full-bleed";
  caption?: ReactNode;
  datePrefix?: string;                  // e.g. "1916" for archival framing
  priority?: boolean;
  className?: string;
}

export default function Figure({
  image,
  src,
  alt,
  width,
  height,
  tier,
  author,
  license,
  sourceUrl,
  size = "wide",
  caption,
  datePrefix,
  priority = false,
  className = "",
}: FigureProps) {
  if (!image && !src) return null;

  const resolvedSrc = image?.url ?? src ?? "";
  const resolvedAlt = alt ?? image?.title ?? "";
  // Default to "B" (archival Wikimedia) when tier not specified — honest
  // fallback for meta.json files that predate the Tier A/B field.
  const resolvedTier: PhotoTier = tier ?? image?.tier ?? "B";
  const resolvedAuthor = author ?? image?.author;
  const resolvedLicense = license ?? image?.license ?? "";
  const resolvedSourceUrl = sourceUrl ?? image?.source_url;
  const resolvedWidth = width ?? image?.width;
  const resolvedHeight = height ?? image?.height;

  if (!resolvedSrc) return null;

  const sizeClasses: Record<typeof size, string> = {
    inline: "max-w-[50%] my-4",
    wide: "w-full my-8",
    "full-bleed": "w-screen relative left-1/2 right-1/2 -mx-[50vw] my-12",
  };

  const frameStyle =
    resolvedTier === "B"
      ? {
          padding: "1px",
          background:
            "color-mix(in srgb, var(--beach-supporting, #94a3b8) 40%, transparent)",
        }
      : undefined;

  return (
    <figure className={`not-prose ${sizeClasses[size]} ${className}`}>
      <div style={frameStyle} className="overflow-hidden rounded-sm">
        <img
          src={resolvedSrc}
          alt={resolvedAlt}
          width={resolvedWidth}
          height={resolvedHeight}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="w-full h-auto block"
        />
      </div>
      <figcaption className="mt-2 text-[13px] leading-[1.5] text-volcanic-500">
        {datePrefix && resolvedTier === "B" ? (
          <>
            <em className="font-serif">{datePrefix}.</em>{" "}
          </>
        ) : null}
        {caption ?? resolvedAlt}
        {(resolvedAuthor || resolvedLicense) && (
          <span className="ml-2 text-volcanic-400 uppercase tracking-wider text-[10px]">
            ·{" "}
            {resolvedSourceUrl ? (
              <a
                href={resolvedSourceUrl}
                target="_blank"
                rel="noopener"
                className="underline decoration-dotted underline-offset-2 hover:text-volcanic-600"
              >
                {resolvedAuthor ?? resolvedLicense}
              </a>
            ) : (
              <>
                {resolvedAuthor && `${resolvedAuthor} · `}
                {resolvedLicense}
              </>
            )}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
