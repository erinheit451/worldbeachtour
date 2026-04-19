/**
 * Nazaré signature: Paths Through the Page. Visitor-type jump-nav.
 */

import { Section, SectionHeader } from "@/components/showcase/legendary-beach";

const PATHS = [
  {
    id: "surfer",
    label: "If you're here for the waves",
    subtitle: "Canyon physics, swell forecasting, where to watch.",
    anchors: [
      { text: "The Canyon (why the waves exist)", href: "#canyon" },
      { text: "The McNamara Era (world records)", href: "#mcnamara" },
      { text: "The Water (tides, wind, season)", href: "#water" },
      { text: "Zones — Praia do Norte viewpoint", href: "#postos" },
    ],
  },
  {
    id: "pilgrim",
    label: "If you're here for the village",
    subtitle: "900 years of Portuguese coastal life.",
    anchors: [
      { text: "The Village Beneath the Big Wave", href: "#village" },
      { text: "Zones — Sítio + Praia", href: "#postos" },
      { text: "Arc of the century — the Lenda onward", href: "#history" },
      { text: "Eat & drink — bacalhau, sardinha seca", href: "#eat" },
    ],
  },
  {
    id: "faith",
    label: "If you're here for the pilgrimage",
    subtitle: "The Marian sanctuary, the Festas, the 100K pilgrimage.",
    anchors: [
      { text: "Sítio — the cliff-top old town", href: "#postos" },
      { text: "Santuário de Nossa Senhora", href: "#village" },
      { text: "Festas da Senhora da Nazaré", href: "#calendar" },
      { text: "The Lenda in the timeline (1182)", href: "#history" },
    ],
  },
  {
    id: "day-trip",
    label: "If you're here for a day from Lisbon",
    subtitle: "The 90-minute priority list.",
    anchors: [
      { text: "How long do you need", href: "#planner" },
      { text: "Where to be in 3 hours", href: "#postos" },
      { text: "What to eat in 90 minutes", href: "#eat" },
      { text: "The Canyon in 4 paragraphs", href: "#canyon" },
    ],
  },
];

export default function NazarePaths() {
  return (
    <Section id="paths" className="bg-sand-50/60 border-y border-sand-200">
      <SectionHeader
        eyebrow="· Paths"
        title="Four ways to read this page"
        kicker="This is a village with four different audiences — surfers, villagers, pilgrims, day-trippers from Lisbon. Pick yours and skim first."
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
