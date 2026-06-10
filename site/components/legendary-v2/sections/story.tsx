/**
 * <Story> — the page's opening editorial prose.
 * 400–800 words. Drop cap on first paragraph. First pull-quote after ¶2
 * is conventionally the spike statement.
 *
 * See docs/legendary/components.md PART B.
 */

import type { ReactNode } from "react";
import PullQuote from "../primitives/pull-quote";

interface StoryProps {
  text: string;
  pullQuote?: {
    text: string;
    attribution?: string;
  };
  tier: 1 | 2;
}

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) return <strong key={i}>{m[1]}</strong>;
    return <span key={i}>{part}</span>;
  });
}

export default function Story({ text, pullQuote, tier }: StoryProps) {
  const paragraphs = text.split("\n\n").filter(Boolean);

  return (
    <section
      id="story"
      className="mx-auto max-w-3xl px-6 py-20 sm:py-28"
    >
      <SectionHeader eyebrow="Story" title="" />
      <div className="prose prose-lg max-w-none prose-p:text-volcanic-700 prose-p:leading-[1.75] prose-p:text-[19px] prose-p:my-6">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={
              i === 0
                ? "first-letter:font-display first-letter:text-[96px] first-letter:float-left first-letter:leading-[0.8] first-letter:pr-3 first-letter:pt-2"
                : ""
            }
            style={
              i === 0
                ? {
                    ["--first-letter-color" as "color"]:
                      "var(--beach-primary, #475569)",
                  }
                : undefined
            }
          >
            {renderInline(p)}
          </p>
        ))}
      </div>
      {pullQuote && (
        <PullQuote size="hero" attribution={pullQuote.attribution}>
          {pullQuote.text}
        </PullQuote>
      )}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  kicker,
}: {
  eyebrow?: string;
  title?: string;
  kicker?: string;
}) {
  if (!eyebrow && !title && !kicker) return null;
  return (
    <header className="mb-10 max-w-3xl">
      {eyebrow && (
        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-volcanic-500 mb-3"
          style={{ color: "var(--beach-primary, #475569)" }}
        >
          {eyebrow}
        </div>
      )}
      {title && (
        <h2
          className="font-display text-[40px] sm:text-[48px] leading-[1.05] text-volcanic-900"
          style={{ fontFamily: "var(--display-family, var(--font-serif))" }}
        >
          {title}
        </h2>
      )}
      {kicker && (
        <p className="mt-5 text-lg italic text-volcanic-500 font-serif">
          {kicker}
        </p>
      )}
    </header>
  );
}
