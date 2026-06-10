/**
 * <PullQuote> — editorial call-out in display typography.
 *
 * The first pull-quote on a Tier 1 page is (by convention) the spike
 * statement, rendered at `size="hero"` with centred, larger typography.
 * See docs/legendary/components.md PART A.
 */

import type { ReactNode } from "react";

interface PullQuoteProps {
  children: ReactNode;
  attribution?: string;
  size?: "default" | "hero";
  className?: string;
}

export default function PullQuote({
  children,
  attribution,
  size = "default",
  className = "",
}: PullQuoteProps) {
  const isHero = size === "hero";

  return (
    <aside
      className={`${isHero ? "my-20 mx-auto max-w-3xl text-center" : "my-10 border-l-4 pl-6"} ${className}`}
      style={!isHero ? { borderColor: "var(--beach-primary, #0284c7)" } : undefined}
    >
      <blockquote
        className={`${
          isHero
            ? "font-display text-[32px] sm:text-[42px] leading-[1.2] -tracking-[0.01em]"
            : "font-display text-2xl sm:text-3xl leading-[1.2]"
        } text-volcanic-900`}
        style={{ fontFamily: "var(--display-family, var(--font-serif))" }}
      >
        <span aria-hidden="true" className="pr-1 opacity-60">
          {isHero ? "" : "\u201C"}
        </span>
        {children}
        <span aria-hidden="true" className="pl-1 opacity-60">
          {isHero ? "" : "\u201D"}
        </span>
      </blockquote>
      {attribution && (
        <cite
          className={`mt-3 block text-xs uppercase tracking-widest text-volcanic-500 not-italic ${
            isHero ? "text-center" : ""
          }`}
        >
          — {attribution}
        </cite>
      )}
    </aside>
  );
}
