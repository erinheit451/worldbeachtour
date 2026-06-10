/**
 * Pipeline cluster — shared cluster chrome.
 *
 * Tier 1. SEVERE voice register (shared with Nazaré), AUSTERE display
 * pairing (Barlow Condensed). The register and typography match
 * Nazaré's because both beaches deal with elite surf at scale-of-risk:
 * the SEVERE register acknowledges that surfers die at these breaks.
 *
 * Three earned spokes:
 *   - Surfing (technical spike-applied spoke — Pipeline vs Backdoor,
 *     the Pipe Masters, wave mechanics, fatalities in detail)
 *   - North Shore (universal visiting spoke — the 7-Mile Miracle
 *     circuit from Haleʻiwa to Sunset; Matsumoto's, Ted's, the drive)
 *   - The Eddie (deep-dive — Waimea Bay, Eddie Aikau, the paddle-in
 *     big-wave tradition distinct from Pipeline's reef-barrel tradition)
 */

import { Fragment, type ReactNode } from "react";
import { EYEBROW } from "../nazare/shared";

export const PIPELINE_MAIN = "/beaches/pipeline";

export const PIPELINE_SPOKES = {
  surfing: {
    slug: "surfing",
    label: "Surfing Pipeline",
    subtitle:
      "How the wave actually works, the Pipe Masters contest as the WSL Championship Tour's season-opener, the reef mechanics, and the fatalities that are part of the break's identity.",
  },
  "north-shore": {
    slug: "north-shore",
    label: "The North Shore",
    subtitle:
      "The 7-Mile Miracle — from Haleʻiwa through Chun's Reef, Laniākea, Waimea, and Sunset to Turtle Bay. The full North Shore circuit as a day-trip from Waikīkī.",
  },
  "the-eddie": {
    slug: "the-eddie",
    label: "The Eddie",
    subtitle:
      "Waimea Bay, Eddie Aikau, and the paddle-in big-wave tradition. The Eddie Aikau Invitational — which only runs on days that satisfy the 20-foot face minimum, and has only run 10 times since 1985.",
  },
  malama: {
    slug: "malama",
    label: "Mālama North Shore",
    subtitle:
      "The Hawaiian sacred sites of the 7-Mile Miracle — Puʻu o Mahuka Heiau, Waimea Valley, the named Hawaiian places under the English surf-break names — and how to visit Hawaiian land respectfully.",
  },
} as const;

export type PipelineSpoke = keyof typeof PIPELINE_SPOKES;

export function ClusterRail({
  current,
  beachName,
}: {
  current: "main" | PipelineSpoke;
  beachName: string;
}) {
  const items: Array<{ key: "main" | PipelineSpoke; label: string; href: string }> = [
    { key: "main", label: beachName, href: PIPELINE_MAIN },
    { key: "surfing", label: "Surfing", href: `${PIPELINE_MAIN}/surfing` },
    { key: "north-shore", label: "The North Shore", href: `${PIPELINE_MAIN}/north-shore` },
    { key: "the-eddie", label: "The Eddie", href: `${PIPELINE_MAIN}/the-eddie` },
    { key: "malama", label: "Mālama", href: `${PIPELINE_MAIN}/malama` },
  ];
  return (
    <nav aria-label="Page cluster" className="border-b border-[#E2E8F0] bg-[#FAFAF7]">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono uppercase tracking-[0.3em] flex-wrap">
          {items.map((it, i) => (
            <Fragment key={it.key}>
              {i > 0 && <span className="text-volcanic-300" aria-hidden="true">·</span>}
              {it.key === current ? (
                <span className="text-[color:var(--beach-primary,#0B3D5C)]">{it.label}</span>
              ) : (
                <a href={it.href} className="text-volcanic-500 hover:text-[color:var(--beach-primary,#0B3D5C)] transition-colors">
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

export function ClusterAside({
  children,
  label = "Also in Pipeline",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <aside className="my-12 not-prose pl-5 border-l-2 border-[color:var(--beach-primary,#0B3D5C)]/40">
      <div className={`${EYEBROW} mb-2 opacity-70`}>· {label}</div>
      <p className="text-[15px] text-volcanic-600 leading-relaxed italic max-w-2xl">{children}</p>
    </aside>
  );
}

export function ClusterLink({
  to,
  label,
}: {
  to: "main" | PipelineSpoke;
  label?: string;
}) {
  const href = to === "main" ? PIPELINE_MAIN : `${PIPELINE_MAIN}/${to}`;
  const defaultLabel = to === "main" ? "the main page" : PIPELINE_SPOKES[to].label;
  return (
    <a
      href={href}
      className="not-italic font-semibold text-[color:var(--beach-primary,#0B3D5C)] underline decoration-dotted underline-offset-4 hover:no-underline"
    >
      {label ?? defaultLabel} →
    </a>
  );
}

export function SpokeCrossNav({ current }: { current: PipelineSpoke }) {
  const others = (Object.keys(PIPELINE_SPOKES) as PipelineSpoke[]).filter(
    (k) => k !== current
  );
  return (
    <section className="bg-[#FAFAF7]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className={`${EYEBROW} mb-6`}>· Keep Reading</div>
        <h2
          className="text-[32px] sm:text-[44px] leading-[0.95] -tracking-[0.01em] text-volcanic-900 uppercase mb-12 max-w-3xl"
          style={{ fontFamily: "var(--display-family, var(--font-barlow-condensed))" }}
        >
          The rest of Pipeline
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <a
            href={PIPELINE_MAIN}
            className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#0B3D5C)] transition-colors"
          >
            <div className={`${EYEBROW} mb-2`}>· Back to main</div>
            <h3
              className="font-display text-[22px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em] mb-3 group-hover:text-[color:var(--beach-primary,#0B3D5C)]"
              style={{ fontFamily: "var(--display-family, var(--font-barlow-condensed))" }}
            >
              Pipeline →
            </h3>
            <p className="text-sm leading-relaxed text-volcanic-700">
              The proving-ground wave. The Pipe Masters. The reef. The deaths.
            </p>
          </a>
          {others.map((k) => {
            const s = PIPELINE_SPOKES[k];
            return (
              <a
                key={k}
                href={`${PIPELINE_MAIN}/${s.slug}`}
                className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#0B3D5C)] transition-colors"
              >
                <div className={`${EYEBROW} mb-2`}>· Companion spoke</div>
                <h3
                  className="font-display text-[22px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em] mb-3 group-hover:text-[color:var(--beach-primary,#0B3D5C)]"
                  style={{ fontFamily: "var(--display-family, var(--font-barlow-condensed))" }}
                >
                  {s.label} →
                </h3>
                <p className="text-sm leading-relaxed text-volcanic-700">{s.subtitle}</p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
