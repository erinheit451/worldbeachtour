/**
 * <SectionDivider> — the horizontal punctuation between major sections.
 *
 * Tier 1: uses the beach's signature motif.svg.
 * Tier 2: uses the motif if present, else a rule line.
 * Tier 3+: rule line only.
 *
 * Max 5 appearances per page (enforced by done-ness CI).
 * See docs/legendary/components.md PART A for the contract.
 */

interface SectionDividerProps {
  motifPath?: string;
  variant?: "motif" | "rule" | "full-bleed";
  label?: string;
  className?: string;
}

export default function SectionDivider({
  motifPath,
  variant,
  label = "Section break",
  className = "",
}: SectionDividerProps) {
  const resolvedVariant = variant ?? (motifPath ? "motif" : "rule");

  if (resolvedVariant === "rule") {
    return (
      <div
        className={`mx-auto max-w-5xl px-6 my-16 ${className}`}
        role="separator"
        aria-label={label}
      >
        <hr className="border-0 border-t border-volcanic-200" />
      </div>
    );
  }

  if (resolvedVariant === "full-bleed") {
    return (
      <div
        className={`w-full my-24 ${className}`}
        role="separator"
        aria-label={label}
      >
        <div className="h-px bg-volcanic-300" />
      </div>
    );
  }

  // motif variant — uses the beach's signature SVG
  return (
    <div
      className={`mx-auto max-w-5xl px-6 my-20 flex justify-center ${className}`}
      role="separator"
      aria-label={label}
    >
      <div
        aria-hidden="true"
        className="h-10 opacity-70"
        style={{
          color: "var(--beach-primary, #475569)",
        }}
      >
        <img
          src={motifPath}
          alt=""
          className="h-full w-auto"
          style={{
            filter: "drop-shadow(0 0 0 currentColor)",
          }}
        />
      </div>
    </div>
  );
}
