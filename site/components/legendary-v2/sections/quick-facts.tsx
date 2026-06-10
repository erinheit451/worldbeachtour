/**
 * <QuickFactsStrip> — 5–7 data points immediately under the hero.
 *
 * See docs/legendary/components.md PART B.
 */

interface QuickFact {
  label: string;
  value: string;
  source?: string;
}

interface QuickFactsStripProps {
  facts: QuickFact[];
  tier: 1 | 2;
}

export default function QuickFactsStrip({ facts, tier }: QuickFactsStripProps) {
  if (facts.length === 0) return null;
  if (facts.length > 7) {
    console.warn(`QuickFactsStrip: ${facts.length} facts exceeds max of 7. Truncating.`);
  }
  const shown = facts.slice(0, 7);

  return (
    <section
      className="border-b bg-white"
      style={{
        borderBottomColor:
          "color-mix(in srgb, var(--beach-primary, #475569) 40%, transparent)",
        borderBottomWidth: "2px",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-6 sm:py-8">
        <dl
          className={`grid gap-y-4 gap-x-6 md:gap-x-8 grid-cols-2 ${
            shown.length <= 5
              ? `sm:grid-cols-${shown.length}`
              : "sm:grid-cols-3 md:grid-cols-" + shown.length
          }`}
        >
          {shown.map((f) => (
            <div key={f.label}>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-volcanic-500">
                {f.label}
              </dt>
              <dd
                className="mt-1 font-display text-2xl leading-[1] text-volcanic-900"
                style={{ fontFamily: "var(--display-family, var(--font-serif))" }}
              >
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
