/**
 * Waikīkī signature section: Paths Through the Page.
 *
 * A reader-type navigation. Different audiences want different things from
 * this page. This is a ~30-second section that lets them jump to the parts
 * that serve them. Sits high on the page, right after the Story.
 */

import { Section, SectionHeader } from "@/components/showcase/legendary-beach";

interface Path {
  id: string;
  label: string;
  subtitle: string;
  anchors: { text: string; href: string }[];
}

const PATHS: Path[] = [
  {
    id: "surfer",
    label: "If you're here to surf",
    subtitle: "Board, wave, lineup, season.",
    anchors: [
      { text: "The 7 named breaks", href: "#breaks" },
      { text: "The Water (swell seasons)", href: "#water" },
      { text: "Duke & the beach boys", href: "#duke" },
      { text: "Safety — rips, reef, jellyfish", href: "#safety" },
    ],
  },
  {
    id: "family",
    label: "If you're here with kids",
    subtitle: "Calm water, stroller access, where to stay.",
    anchors: [
      { text: "Kūhiō Beach (safe swimming)", href: "#postos" },
      { text: "Duke Kahanamoku Beach (Hilton lagoon)", href: "#postos" },
      { text: "Eat & Drink — shave ice, plate lunch", href: "#eat" },
      { text: "Where to stay (tier by zone)", href: "#stay" },
    ],
  },
  {
    id: "cultural",
    label: "If you're here for the history",
    subtitle: "The kingdom under the tourist strip.",
    anchors: [
      { text: "Reading the Land (Hawaiian names)", href: "#placenames" },
      { text: "Duke & the beach boys", href: "#duke" },
      { text: "Monarchy & Memory", href: "#monarchy" },
      { text: "Mālama (stewardship today)", href: "#malama" },
      { text: "The kingdom beneath", href: "#context" },
    ],
  },
  {
    id: "repeat",
    label: "If you've been before",
    subtitle: "Past the obvious. Where locals go.",
    anchors: [
      { text: "Reading the Land", href: "#placenames" },
      { text: "The Natatorium (the ruin)", href: "#viewback" },
      { text: "Kāhala / neighbor-island itinerary", href: "#stay" },
      { text: "Pop culture references", href: "#culture" },
    ],
  },
];

export default function WaikikiPaths() {
  return (
    <Section id="paths" className="bg-sand-50/60 border-y border-sand-200">
      <SectionHeader
        eyebrow="· Paths"
        title="Four ways to read this page"
        kicker="We wrote it for four different visitors. Pick yours and skim — come back for the rest."
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
