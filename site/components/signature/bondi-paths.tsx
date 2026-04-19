/**
 * Bondi signature: Paths Through the Page. Visitor-type jump-nav.
 */

import { Section, SectionHeader } from "@/components/showcase/legendary-beach";

const PATHS = [
  {
    id: "surfer",
    label: "If you're here to surf",
    subtitle: "Board, wave, lineup, season.",
    anchors: [
      { text: "The Water — breaks, swells, tides", href: "#water" },
      { text: "Safety — rips and the red-and-yellow flags", href: "#safety" },
      { text: "Shark Country — the real context", href: "#sharks" },
      { text: "The Zones — south end is the surf end", href: "#postos" },
    ],
  },
  {
    id: "family",
    label: "If you're here with kids",
    subtitle: "Calm water, the Nippers program, where to stay.",
    anchors: [
      { text: "North Bondi — the family end", href: "#postos" },
      { text: "The Lifeguards — what to know", href: "#rescue" },
      { text: "Eat & Drink — ice cream, fish and chips", href: "#eat" },
      { text: "Where to stay", href: "#stay" },
    ],
  },
  {
    id: "cultural",
    label: "If you're here for the history",
    subtitle: "Gadigal country under the Australian beach myth.",
    anchors: [
      { text: "Country Before Colony (rock engravings)", href: "#country" },
      { text: "Gadigal country — the honest context", href: "#context" },
      { text: "Arc of the century — the timeline", href: "#history" },
      { text: "In the Culture — the 12 Bondi references", href: "#culture" },
    ],
  },
  {
    id: "repeat",
    label: "If you've been before",
    subtitle: "Past the obvious.",
    anchors: [
      { text: "The coastal walk to Coogee (6 km)", href: "#icebergs" },
      { text: "Icebergs pool in winter", href: "#icebergs" },
      { text: "The Ben Buckler engravings", href: "#country" },
      { text: "Manly / Coogee — the sideways comparisons", href: "#versus" },
    ],
  },
];

export default function BondiPaths() {
  return (
    <Section id="paths" className="bg-sand-50/60 border-y border-sand-200">
      <SectionHeader
        eyebrow="· Paths"
        title="Four ways to read this page"
        kicker="We wrote it for four different visitors. Pick yours and skim; come back for the rest."
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {PATHS.map((p) => (
          <article
            key={p.id}
            className="rounded-xl bg-white p-6 border border-volcanic-100 hover:border-ocean-200 transition-colors"
          >
            <h3 className="font-display text-lg text-volcanic-900 leading-tight mb-1">
              {p.label}
            </h3>
            <p className="text-xs italic text-volcanic-500 mb-4">{p.subtitle}</p>
            <ul className="space-y-2">
              {p.anchors.map((a) => (
                <li key={a.href + a.text}>
                  <a
                    href={a.href}
                    className="text-sm text-ocean-700 hover:text-ocean-900 hover:underline"
                  >
                    {a.text} →
                  </a>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
