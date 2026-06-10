/**
 * <DataCallout> — inline data point as a small stat card.
 *
 * For numbers that deserve emphasis but don't warrant a full data-science
 * section. Two variants: inline (beside prose) and strip (row of callouts).
 * See docs/legendary/components.md PART A.
 */

interface DataCalloutProps {
  label: string;
  value: string;
  unit?: string;
  source?: string;
  variant?: "inline" | "strip";
  className?: string;
}

export default function DataCallout({
  label,
  value,
  unit,
  source,
  variant = "inline",
  className = "",
}: DataCalloutProps) {
  const isStrip = variant === "strip";

  return (
    <div
      className={`not-prose ${isStrip ? "py-4" : "inline-block align-baseline mx-2 my-2 px-3"} ${className}`}
    >
      <div className="text-[10px] uppercase tracking-[0.15em] text-volcanic-500 font-mono mb-1">
        {label}
      </div>
      <div
        className={`font-display ${
          isStrip ? "text-[36px] leading-[1]" : "text-[28px] leading-[1]"
        } text-volcanic-900`}
        style={{ fontFamily: "var(--display-family, var(--font-serif))" }}
      >
        {value}
        {unit && (
          <span className="text-[0.6em] ml-1 text-volcanic-500 font-sans tracking-normal">
            {unit}
          </span>
        )}
      </div>
      {source && (
        <div className="text-[10px] italic text-volcanic-400 mt-1">{source}</div>
      )}
    </div>
  );
}
