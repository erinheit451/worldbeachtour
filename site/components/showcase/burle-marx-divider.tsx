/**
 * Burle Marx wave pavement pattern — black-and-white Portuguese-stone motif.
 * Used as section divider and signature site motif for Copacabana.
 */
export default function BurleMarxDivider({
  height = 48,
  invert = false,
}: {
  height?: number;
  invert?: boolean;
}) {
  const fg = invert ? "#F5F2EB" : "#1a1a1a";
  const bg = invert ? "#1a1a1a" : "#F5F2EB";
  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden"
      style={{ height, backgroundColor: bg }}
    >
      <svg
        viewBox="0 0 200 48"
        width="100%"
        height={height}
        preserveAspectRatio="none"
        role="presentation"
      >
        <defs>
          <pattern
            id="burle-marx-wave"
            x="0"
            y="0"
            width="40"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 24 C 10 8, 30 8, 40 24 C 50 40, 70 40, 80 24"
              fill="none"
              stroke={fg}
              strokeWidth="10"
              strokeLinecap="round"
            />
          </pattern>
        </defs>
        <rect width="200" height="48" fill="url(#burle-marx-wave)" />
      </svg>
    </div>
  );
}
