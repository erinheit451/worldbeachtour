/**
 * Nazaré cluster — shared tokens, primitives, and spoke-layout chrome.
 *
 * Used by: nazare-v2.tsx (main), nazare/travel.tsx, nazare/surfing.tsx,
 * nazare/pilgrimage.tsx. One vocabulary across all four pages of the
 * cluster.
 *
 * Typography rules (locked 2026-04-29 — see docs/legendary/style-guide.md):
 *   - five heading sizes (H1 hero / H2 / H3 / H4 / FACT_VALUE for data display)
 *   - two body sizes (BODY 19px/1.75 / BODY_SM short-form)
 *   - one eyebrow treatment (mono, 11px, uppercase, tracking-[0.3em])
 *   - never stamp `font-display` AND `style={fontFamily: DISPLAY_FF}` — the
 *     style wins and the class is a footgun. Use the inline style only.
 *
 * Palette rules (locked 2026-04-29 — three backgrounds):
 *   PAPER (#FAFAF7): spine — Story, Timeline, Culture, Nearby, Spokes
 *   COOL  (#F1F5F9): middle — Canyon, Water Stories, Zones, Day, Village
 *   DARK  (#0F172A): one earned inversion per page (e.g. "Village Beneath")
 *   CREAM is deprecated; the export below aliases to COOL so no import breaks.
 *
 * Display family (AUSTERE pairing default): Barlow Condensed, loaded in app/layout.tsx
 */

import type { ReactNode } from "react";
import { Fragment } from "react";
import type { SectionImage, LegendaryPageBundle } from "../types";

// ============================================================================
// Typography tokens
// ============================================================================

export const EYEBROW =
  "text-[11px] font-mono uppercase tracking-[0.3em] text-[color:var(--beach-primary,#2B3E50)]";
export const H2 =
  "text-[32px] sm:text-[44px] leading-[0.95] -tracking-[0.01em] text-volcanic-900 uppercase";
export const H2_DARK =
  "text-[32px] sm:text-[44px] leading-[0.95] -tracking-[0.01em] text-[#F1F5F9] uppercase";
export const H3 =
  "text-[22px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em]";
export const H3_DARK =
  "text-[22px] leading-tight text-[#F1F5F9] uppercase -tracking-[0.01em]";
export const H4 = "text-base text-volcanic-900 uppercase tracking-wide";
export const FACT_VALUE =
  "text-[26px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em]";
export const BODY = "text-[19px] leading-[1.75] text-volcanic-700";
export const BODY_DARK = "text-[18px] leading-[1.7] text-[#CBD5E1]";
export const BODY_SM = "text-sm leading-relaxed text-volcanic-700";

export const PAPER = "bg-[#FAFAF7]";
export const COOL = "bg-[#F1F5F9]";
/** @deprecated alias to COOL — cream is dead per style-guide.md (2026-04-29) */
export const CREAM = COOL;
export const DARK = "bg-[#0F172A]";

export const DISPLAY_FF = "var(--display-family, var(--font-barlow-condensed))";
export const DISPLAY_STYLE: React.CSSProperties = { fontFamily: DISPLAY_FF };

// ============================================================================
// Primitives
// ============================================================================

export function Section({
  id,
  children,
  className = "",
  width = "narrow",
}: {
  id: string;
  children: ReactNode;
  className?: string;
  width?: "narrow" | "wide" | "full";
}) {
  const inner =
    width === "wide"
      ? "mx-auto max-w-6xl px-6 py-20 sm:py-28"
      : width === "full"
      ? "mx-auto max-w-7xl px-6 py-20 sm:py-28"
      : "mx-auto max-w-3xl px-6 py-20 sm:py-28";
  return (
    <section id={id} className={className}>
      <div className={inner}>{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  kicker,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  kicker?: string;
  dark?: boolean;
}) {
  return (
    <header className="mb-12 max-w-3xl">
      <div
        className={`${EYEBROW} mb-4`}
        style={dark ? { color: "var(--beach-supporting, #D4A574)" } : undefined}
      >
        {eyebrow}
      </div>
      <h2 className={dark ? H2_DARK : H2} style={DISPLAY_STYLE}>
        {title}
      </h2>
      {kicker && (
        <p
          className={`mt-5 text-lg italic font-serif max-w-2xl ${
            dark ? "text-[#94A3B8]" : "text-volcanic-500"
          }`}
        >
          {kicker}
        </p>
      )}
    </header>
  );
}

export function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={`${EYEBROW} mb-1`}>{label}</dt>
      <dd className={FACT_VALUE} style={DISPLAY_STYLE}>
        {value}
      </dd>
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================

export function renderInlineBold(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) return <strong key={i}>{m[1]}</strong>;
    return <span key={i}>{part}</span>;
  });
}

export function renderInlineBoldDark(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m)
      return (
        <strong key={i} className="text-[#F1F5F9] font-semibold">
          {m[1]}
        </strong>
      );
    return <span key={i}>{part}</span>;
  });
}

export function pickImage(
  meta: LegendaryPageBundle["meta"],
  role: string
): SectionImage | undefined {
  return meta.images?.section?.[role];
}

// ============================================================================
// Spoke layout chrome — breadcrumb + cross-spoke footer
// ============================================================================

export const SPOKE_INDEX = {
  travel: {
    slug: "travel",
    label: "Visiting Nazaré",
    subtitle:
      "Getting there, where to stay, what to eat, visitor safety, itineraries.",
  },
  surfing: {
    slug: "surfing",
    label: "Surfing Nazaré",
    subtitle:
      "Forecasting, wetsuits, tow mechanics, records anthology, Jaws comparison.",
  },
  sanctuary: {
    slug: "sanctuary",
    label: "The Sanctuary",
    subtitle:
      "The Lenda of 1182, the Santuário, the Festas, the 900-year pilgrimage on the Sítio clifftop.",
  },
} as const;

export type SpokeKey = keyof typeof SPOKE_INDEX;

/**
 * Cluster rail — shows the four pages of the cluster with the current one
 * highlighted. Sits directly under the hero on every page of the cluster.
 * Replaces the old SpokeBreadcrumb.
 */
export function ClusterRail({
  current,
  beachName,
  mainHref = "/beaches/praia-do-norte-6",
}: {
  current: "main" | SpokeKey;
  beachName: string;
  mainHref?: string;
}) {
  const items: Array<{
    key: "main" | SpokeKey;
    label: string;
    href: string;
  }> = [
    { key: "main", label: beachName, href: mainHref },
    {
      key: "travel",
      label: "Visiting",
      href: `${mainHref}/travel`,
    },
    {
      key: "surfing",
      label: "Surfing",
      href: `${mainHref}/surfing`,
    },
    {
      key: "sanctuary",
      label: "The Sanctuary",
      href: `${mainHref}/sanctuary`,
    },
  ];

  return (
    <nav
      aria-label="Page cluster"
      className="border-b border-[#E2E8F0] bg-[#FAFAF7]"
    >
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono uppercase tracking-[0.3em] flex-wrap">
          {items.map((it, i) => (
            <Fragment key={it.key}>
              {i > 0 && (
                <span className="text-volcanic-300" aria-hidden="true">
                  ·
                </span>
              )}
              {it.key === current ? (
                <span className="text-[color:var(--beach-primary,#2B3E50)]">
                  {it.label}
                </span>
              ) : (
                <a
                  href={it.href}
                  className="text-volcanic-500 hover:text-[color:var(--beach-primary,#2B3E50)] transition-colors"
                >
                  {it.label}
                </a>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
}

/**
 * Inline contextual aside — a margin-note-style editorial pointer to
 * another page in the cluster. Sits at a natural transition inside a
 * section. Italic, muted, not a button.
 */
export function ClusterAside({
  children,
  label = "Also in Nazaré",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <aside className="my-12 not-prose pl-5 border-l-2 border-[color:var(--beach-primary,#2B3E50)]/40">
      <div className={`${EYEBROW} mb-2 opacity-70`}>· {label}</div>
      <p className="text-[15px] text-volcanic-600 leading-relaxed italic max-w-2xl">
        {children}
      </p>
    </aside>
  );
}

/**
 * Inline link to another page in the cluster. Used inside ClusterAside
 * copy (and occasionally inline in body prose).
 */
export function ClusterLink({
  to,
  label,
  mainHref = "/beaches/praia-do-norte-6",
}: {
  to: "main" | SpokeKey;
  label?: string;
  mainHref?: string;
}) {
  const href = to === "main" ? mainHref : `${mainHref}/${to}`;
  const defaultLabel =
    to === "main" ? "the main page" : SPOKE_INDEX[to].label;
  return (
    <a
      href={href}
      className="not-italic font-semibold text-[color:var(--beach-primary,#2B3E50)] underline decoration-dotted underline-offset-4 hover:no-underline"
    >
      {label ?? defaultLabel} →
    </a>
  );
}

export function SpokeCrossNav({
  current,
  mainHref = "/beaches/praia-do-norte-6",
}: {
  current: SpokeKey;
  mainHref?: string;
}) {
  const others = (Object.keys(SPOKE_INDEX) as SpokeKey[]).filter(
    (k) => k !== current
  );
  return (
    <Section id="keep-reading" className={PAPER} width="wide">
      <div className={`${EYEBROW} mb-6`}>· Keep Reading</div>
      <h2
        className={`${H2} mb-12 max-w-3xl`}
        style={{ fontFamily: DISPLAY_FF }}
      >
        The rest of Nazaré
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        <a
          href={mainHref}
          className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#2B3E50)] transition-colors"
        >
          <div className={`${EYEBROW} mb-2`}>· Back to the main page</div>
          <h3
            className={`${H3} mb-3 group-hover:text-[color:var(--beach-primary,#2B3E50)]`}
          >
            Nazaré (Praia do Norte) →
          </h3>
          <p className={BODY_SM}>
            The canyon, the village, the wave — the full argument that this
            cluster sits inside.
          </p>
        </a>
        {others.map((k) => {
          const s = SPOKE_INDEX[k];
          return (
            <a
              key={k}
              href={`${mainHref}/${s.slug}`}
              className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#2B3E50)] transition-colors"
            >
              <div className={`${EYEBROW} mb-2`}>· Companion spoke</div>
              <h3
                className={`${H3} mb-3 group-hover:text-[color:var(--beach-primary,#2B3E50)]`}
              >
                {s.label} →
              </h3>
              <p className={BODY_SM}>{s.subtitle}</p>
            </a>
          );
        })}
      </div>
    </Section>
  );
}

// ============================================================================
// Spoke hero — tier-1-lite, ~60vh
// ============================================================================

export function SpokeHero({
  eyebrow,
  title,
  kicker,
  image,
}: {
  eyebrow: string;
  title: string;
  kicker?: string;
  image: SectionImage;
}) {
  return (
    <section className="relative h-[60vh] min-h-[440px] w-full overflow-hidden bg-black">
      <img
        src={image.thumbnail || image.url}
        alt={image.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/70 mb-4">
            {eyebrow}
          </p>
          <h1
            className="font-display text-5xl sm:text-7xl lg:text-[84px] leading-[0.95] -tracking-[0.02em] text-white uppercase max-w-4xl"
            style={{ fontFamily: DISPLAY_FF }}
          >
            {title}
          </h1>
          {kicker && (
            <p className="mt-6 max-w-2xl text-lg sm:text-xl text-white/85 font-serif italic">
              {kicker}
            </p>
          )}
        </div>
      </div>
      <div className="absolute bottom-3 right-4 text-[10px] max-w-[50%] text-right text-white/45">
        {image.title}
        {image.author ? ` · ${image.author}` : ""} · {image.license}
      </div>
    </section>
  );
}

// ============================================================================
// Page provenance footer
// ============================================================================

export function SpokeProvenance({
  bundle,
  note,
}: {
  bundle: LegendaryPageBundle;
  note: string;
}) {
  return (
    <section className="border-t border-[#E2E8F0] bg-[#FAFAF7]">
      <div className="mx-auto max-w-3xl px-6 py-10 text-sm text-volcanic-500 leading-relaxed">
        <div className={`${EYEBROW} mb-3`}>· About this spoke</div>
        <p className="text-[13px] leading-[1.65]">
          <strong>
            Written by {bundle.composition.byline.replace("Written by ", "")}.
          </strong>{" "}
          {note} Corrections welcome, especially on Portuguese-language framings
          and on the named practices of Nazaré. Version v0.9.
        </p>
      </div>
    </section>
  );
}
