/**
 * Nazaré (Praia do Norte) — bespoke Tier 1 page. Legendary v2, revision 1.0.
 *
 * Thesis (spike):
 *   "The canyon made the village. 900 years later it made the village famous
 *    for something else. It's still the same village."
 *
 * Section palette (post-2026-04-29 audit — three backgrounds, no cream):
 *   PAPER (#FAFAF7): Story, Timeline, Culture, Nearby, Spokes — the spine
 *   COOL  (#F1F5F9): Canyon, Water Stories, Zones, Day, Village — middle
 *   DARK  (#0F172A): Village Beneath — earned inversion, one per page
 *
 * Typography rules (from style guide lock-in 2026-04-29):
 *   Headings: H2 44px, H3 22px, H4 base. FACT 26px is data-display only.
 *   Body: BODY 19px, BODY_SM sm. EYEBROW 11px mono uppercase.
 *   Display family: var(--display-family) — Barlow Condensed for AUSTERE.
 *   We do NOT also stamp `font-display` on these strings — the inline style
 *   wins and the class is a footgun if the inline is ever removed.
 */

import type { ReactNode } from "react";
import type { LegendaryPageBundle, SectionImage, TimelineEvent, Zone } from "./types";
import LegendaryShell from "./shell";
import Hero from "./sections/hero";
import Figure from "./primitives/figure";
import PullQuote from "./primitives/pull-quote";
import {
  ClusterRail,
  ClusterAside,
  ClusterLink,
} from "./nazare/shared";

// ----------------------------------------------------------------------------
// Typography tokens — codified
// ----------------------------------------------------------------------------

const EYEBROW =
  "text-[11px] font-mono uppercase tracking-[0.3em] text-[color:var(--beach-primary,#2B3E50)]";
const H2 =
  "text-[32px] sm:text-[44px] leading-[0.95] -tracking-[0.01em] text-volcanic-900 uppercase";
const H2_DARK =
  "text-[32px] sm:text-[44px] leading-[0.95] -tracking-[0.01em] text-[#F1F5F9] uppercase";
const H3 = "text-[22px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em]";
const H3_DARK =
  "text-[22px] leading-tight text-[#F1F5F9] uppercase -tracking-[0.01em]";
const H4 = "text-base text-volcanic-900 uppercase tracking-wide";
const FACT_VALUE =
  "text-[26px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em]";
const BODY = "text-[19px] leading-[1.75] text-volcanic-700";
const BODY_DARK = "text-[18px] leading-[1.7] text-[#CBD5E1]";
const BODY_SM = "text-sm leading-relaxed text-volcanic-700";

const DISPLAY_STYLE: React.CSSProperties = {
  fontFamily: "var(--display-family, var(--font-barlow-condensed))",
};

const PAPER = "bg-[#FAFAF7]";
const COOL = "bg-[#F1F5F9]";
const DARK = "bg-[#0F172A]";

// ----------------------------------------------------------------------------
// Wrappers
// ----------------------------------------------------------------------------

function Section({
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

function SectionHeader({
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

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function renderInlineBold(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) return <strong key={i}>{m[1]}</strong>;
    return <span key={i}>{part}</span>;
  });
}

function pickImage(
  meta: LegendaryPageBundle["meta"],
  role: string
): SectionImage | undefined {
  return meta.images?.section?.[role];
}

// ============================================================================
// STORY — shorter, gestures without spoiling
// ============================================================================

function NazareStory() {
  const paragraphs = [
    "Nazaré is a fishing village on the Portuguese Atlantic coast where the seabed drops five thousand meters straight down less than a kilometer from shore. For most of 900 years the village worked the sardine fishery that the canyon's cold upwelling feeds, and nobody outside Portugal had heard the name.",
    "Then in November 2011 a Hawaiian surfer named **Garrett McNamara** was towed into a wave at **Praia do Norte** — the beach directly below the Sítio cliff — and the photograph of a speck at the base of a 78-foot wall of water, with a white lighthouse visible at the cliff's edge, became one of the most-reproduced images in surfing history. In the fifteen years since, Nazaré has become the site of every current big-wave world record, the subject of three seasons of HBO documentary, and the centerpiece of Portugal's international tourism campaign.",
    "None of the 900 years stopped. The fishermen still sail. The fishermen's widows still dry sardines on wooden racks on the village beach. The **sete saias** — the seven-skirt dress of Nazarené women — is in a 2023 UNESCO Intangible Cultural Heritage file. The Marian pilgrimage every September 8 still draws close to 100,000 people to the cliff-top sanctuary that was built in 1377 around a statue the legend says stopped a nobleman's horse from plunging into the Atlantic in 1182.",
    "This page is about the canyon that did both things. It is also about the village that is still the village.",
  ];

  return (
    <section id="story" className={`${PAPER} border-b border-[#E2E8F0]`}>
      <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <div className={`${EYEBROW} mb-4`}>· Story</div>
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={`${BODY} mb-6 ${
              i === 0
                ? "first-letter:text-[120px] first-letter:float-left first-letter:leading-[0.85] first-letter:pr-3 first-letter:pt-1 first-letter:uppercase first-letter:font-semibold"
                : ""
            }`}
            style={
              i === 0
                ? ({
                    ["--tw-prose-body" as string]: "inherit",
                    fontFamily: undefined,
                  } as React.CSSProperties)
                : undefined
            }
          >
            {renderInlineBold(p)}
          </p>
        ))}
        <style>{`
          #story p:first-of-type::first-letter {
            font-family: var(--display-family, var(--font-barlow-condensed));
            color: var(--beach-primary, #2B3E50);
          }
        `}</style>

        <PullQuote size="hero">
          The canyon made the village. 900 years later it made the village famous
          for something else. It's still the same village.
        </PullQuote>
      </div>
    </section>
  );
}

// ============================================================================
// CANYON — physics + ecosystem + fishery continuity (the thesis activation)
// ============================================================================

function CanyonSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const drone = pickImage(bundle.meta, "drone_headland");
  const shorebreak = pickImage(bundle.meta, "shorebreak_sitio");

  return (
    <>
      {drone && (
        <Figure
          image={drone}
          size="full-bleed"
          tier="B"
          caption="The Sítio headland from offshore. The Nazaré Canyon begins roughly 500 meters off the sand visible at bottom-left and runs five kilometers straight down to the Iberian Abyssal Plain."
          className="mb-0"
        />
      )}
      <Section id="canyon" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· The Canyon"
          title="The same canyon makes the wave and feeds the village"
          kicker="A 230-kilometer submarine trench begins 500 meters off this beach. It produces the world's largest surfable wave. It has also, for nine centuries, fed the fishery the village lived on. One feature, two gifts, one village."
        />

        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] items-start">
          <div className="space-y-6">
            <h3 className={H3}>The mechanism that makes the wave</h3>
            <p className={BODY}>
              The <strong>Nazaré Canyon</strong> — <em>Canhão da Nazaré</em> — is
              one of the largest submarine canyons in Europe. Its shoreward head
              begins approximately <strong>500 meters</strong> off the coast at
              Praia do Norte and runs west for 230 km, plunging to{" "}
              <strong>5,000 meters</strong> at its terminus. Submarine canyons
              exist off many coastlines. What makes this one produce waves no
              other does is two features of its geometry.
            </p>
            <p className={BODY}>
              <strong>Swell refraction along the canyon axis.</strong> When a
              winter Atlantic swell arrives from the northwest, part of the wave
              front crosses the canyon's north rim and continues over the
              shallow shelf. The other part runs down the canyon axis through
              much deeper water. Deep water is fast; shallow is slow. The two
              halves re-converge near the shore <em>in phase</em>. Amplitudes
              add. A 4-meter open-ocean swell becomes, at the break, an 8-meter
              wave.
            </p>
            <p className={BODY}>
              <strong>The bathymetric ramp at the canyon head.</strong> The
              seafloor rises from 95 meters to the beach within roughly 500
              horizontal meters. Water arriving from the deep canyon has all
              the speed and mass of deep-ocean water, and when it hits the ramp
              it has nowhere to go but up. The wave face rears, the crest
              folds. Researchers at the <strong>University of Lisbon</strong>{" "}
              and Portugal's <strong>IPMA</strong> (Instituto Português do Mar
              e da Atmosfera) published the mechanism in 2013.
            </p>

            <CanyonCrossSection />

            <h3 className={`${H3} mt-12`}>The mechanism that feeds the village</h3>
            <p className={BODY}>
              The canyon is not only a wave factory. It is one of the most
              biologically productive features on the Iberian coast. Submarine
              canyons are <strong>nutrient pumps</strong> — cold, nutrient-rich
              deep water is driven up the canyon walls by interaction with the
              continental current, fertilising the photic zone above. The
              upwelling supports pelagic shoals — sardine, mackerel, horse
              mackerel — and the predators that follow them.{" "}
              <strong>Sperm whales</strong> feed on squid in the canyon's mid-
              depths year-round; they are visible offshore most months.{" "}
              <strong>Blue sharks</strong> and{" "}
              <strong>short-finned pilot whales</strong> work the edges.
            </p>
            <p className={BODY}>
              This productivity is why there has been a fishing port on this
              headland since the 12th century. The{" "}
              <strong>arte xávega</strong> — the beach-seine method in which
              enormous nets were rowed out and then dragged back by teams of
              oxen (later, tractors) hauling from the sand — was Nazaré's
              industry for 400 years. The catch was divided by a formal share
              system: a share to the boat owner, shares to the{" "}
              <em>companha</em> (the crew), and a share set aside as the{" "}
              <em>quinhão dos pobres</em> — the portion of the poor. Portuguese
              fishing fleets reached Newfoundland for cod in the 1490s, and
              Nazaré was one of the coastal ports that salted and dried the
              catch. The <em>estendal</em> — the wooden racks where sardines
              still dry on the village beach — is the living descendant of
              that 500-year salt-fishery practice.
            </p>
            <p className={BODY}>
              The canyon produced the fishery. The fishery produced the
              village. Eight hundred years later the same canyon produced the
              wave that made the village globally famous.{" "}
              <strong>
                Two gifts from one feature of the Earth, separated by almost
                all of recorded Portuguese history, landing in the same
                kilometer of sand.
              </strong>
            </p>

            <h3 className={`${H3} mt-12`}>What kind of feature this is</h3>
            <p className={BODY}>
              Submarine canyons are not rare in the abstract — the Atlantic
              margin is lined with them. What's unusual about Nazaré is its{" "}
              <strong>size combined with its nearshore position</strong>. The
              canyon is comparable to California's Monterey Canyon (which feeds
              the Mavericks big-wave break) in length, and far exceeds it in
              depth. Its head is closer to shore than almost any comparable
              canyon on Earth. Geologically it was cut during sea-level lowstands
              in the late Miocene and Pliocene, roughly{" "}
              <strong>20–24 million years ago</strong>, by a combination of
              ancient rivers and repeated mass-flow events (undersea landslides
              and turbidity currents). It is still active; small slumps of the
              canyon walls occur continuously, and the larger ones generate
              minor tsunamis recorded on tide gauges up the Portuguese coast.
              The canyon is part of the plumbing of the{" "}
              <strong>1755 Lisbon earthquake and tsunami</strong> — one of
              Europe's defining natural disasters — which is believed to have
              been amplified by canyon-related bathymetry along this stretch of
              coast.
            </p>
          </div>

          <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
            <div className={`${EYEBROW} mb-5`}>· The Numbers</div>
            <dl className="space-y-5">
              <Fact label="Canyon length" value="230 km" />
              <Fact label="Maximum depth" value="5,000 m" />
              <Fact label="Depth at canyon head" value="95 m" />
              <Fact label="Canyon head to shore" value="~500 m" />
              <Fact label="Age" value="~24 million yrs" />
              <Fact label="Current record wave" value="26.21 m (2020)" />
              <Fact label="Same wave, post-ride remeasure" value="~28.6 m" />
              <Fact label="Peak-size days per year" value="15–20" />
              <Fact label="Atlantic fishery, feeding" value="since ~1100 AD" />
            </dl>
            <p className="mt-6 text-xs italic text-volcanic-500 leading-relaxed">
              Sources: IPMA; Oliveira et al. 2013 <em>JGR: Oceans</em>; WSL
              Big Wave Awards; Guinness; University of Alcalá remeasurement;
              Portuguese Hydrographic Institute.
            </p>
          </aside>
        </div>

        {shorebreak && (
          <Figure
            image={shorebreak}
            size="wide"
            tier="B"
            caption="Shore break at the base of the Sítio cliff — the 95 m → 0 m ramp compressed into a few hundred horizontal meters. The same ramp that throws the winter wave also drives the upwelling that feeds the sardines."
            className="mt-12"
          />
        )}
      </Section>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={`${EYEBROW} mb-1`}>{label}</dt>
      <dd className={FACT_VALUE} style={DISPLAY_STYLE}>
        {value}
      </dd>
    </div>
  );
}

function CanyonCrossSection() {
  // Simple bathymetric cross-section SVG, shore on the left, abyss on the right.
  return (
    <figure className="my-8 rounded-sm bg-white border border-[#CBD5E1] p-6">
      <svg viewBox="0 0 820 280" className="w-full h-auto" aria-label="Cross-section of the Nazaré Canyon from shore to abyss">
        {/* Sea surface */}
        <line x1="0" y1="40" x2="820" y2="40" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="8" y="32" fontSize="10" fontFamily="var(--font-jetbrains-mono)" fill="#475569" letterSpacing="2">
          SEA SURFACE · 0 m
        </text>

        {/* Shore → ramp → canyon head → abyss */}
        <path
          d="M 0 40 L 90 40 L 120 42 L 150 55 L 175 135 L 205 150 L 260 160 L 340 170 L 420 200 L 520 230 L 620 248 L 820 258 Z"
          fill="#0F172A"
          fillOpacity="0.9"
        />
        {/* Ramp highlight */}
        <path
          d="M 120 42 L 150 55 L 175 135"
          stroke="#D4A574"
          strokeWidth="3"
          fill="none"
        />
        <text x="180" y="95" fontSize="11" fontFamily="var(--font-jetbrains-mono)" fill="#D4A574" letterSpacing="1.5">
          THE 95-METER RAMP
        </text>
        <text x="180" y="110" fontSize="10" fontFamily="var(--font-jetbrains-mono)" fill="#94A3B8">
          500 m horizontal · 95 m vertical
        </text>

        {/* Canyon head label */}
        <line x1="175" y1="135" x2="175" y2="260" stroke="#94A3B8" strokeDasharray="2 3" strokeWidth="0.75" />
        <text x="185" y="200" fontSize="10" fontFamily="var(--font-jetbrains-mono)" fill="#64748B" letterSpacing="1.5">
          CANYON HEAD
        </text>
        <text x="185" y="214" fontSize="9" fontFamily="var(--font-jetbrains-mono)" fill="#94A3B8">
          95 m below surface
        </text>

        {/* Abyss label */}
        <text x="550" y="265" fontSize="10" fontFamily="var(--font-jetbrains-mono)" fill="#94A3B8" letterSpacing="1.5">
          ↘ 5,000 m · IBERIAN ABYSSAL PLAIN
        </text>

        {/* Beach */}
        <rect x="0" y="28" width="90" height="14" fill="#D4A574" />
        <text x="20" y="22" fontSize="9" fontFamily="var(--font-jetbrains-mono)" fill="#78350F" letterSpacing="1.5">
          PRAIA DO NORTE
        </text>

        {/* Lighthouse atop cliff stub */}
        <rect x="70" y="14" width="6" height="14" fill="#B91C1C" />
        <text x="45" y="10" fontSize="8" fontFamily="var(--font-jetbrains-mono)" fill="#475569" letterSpacing="1.5">
          FORTE / LIGHTHOUSE
        </text>
      </svg>
      <figcaption className="mt-3 text-[13px] leading-[1.5] text-volcanic-500">
        Schematic west-east cross-section (not to scale). The canyon head is
        less than half a kilometer off the beach; the deep terminus sits on
        the Iberian Abyssal Plain, 230 km offshore.
      </figcaption>
    </figure>
  );
}

// ============================================================================
// WATER STORIES — three beats: the inflection, the wipeout, the safety op
// ============================================================================

function WaterStoriesSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const lightAlt = pickImage(bundle.meta, "lighthouse_alt");
  const surfer = pickImage(bundle.meta, "surfer_action");
  const crowd = pickImage(bundle.meta, "cliff_crowd_wave");

  return (
    <Section id="water" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· Water Stories"
        title="Three things that happen on a 26-meter wave"
        kicker="The records are a spreadsheet. What the surfers are actually doing in the water is — by an order of magnitude — the most dangerous thing anyone does in sport."
      />

      <div className="space-y-16">
        {/* --- The Inflection --- */}
        <article>
          <div className={`${EYEBROW} mb-3`}>i · The Inflection</div>
          <h3 className={`${H3} mb-5`}>From a local bodyboarder's email, 2005</h3>
          <p className={`${BODY} mb-5`}>
            The modern Nazaré era begins with an email from a Nazarené
            bodyboarder named <strong>Dino Casimiro</strong> to the Hawaiian
            big-wave surfer <strong>Garrett McNamara</strong>. Casimiro had
            grown up watching the winter sets break below the Sítio cliff and
            understood, without any technical background, that something
            unusual was happening in the water offshore. He sent a series of
            photographs with the note that McNamara might want to come take a
            look. McNamara ignored the first several. He eventually replied.
            He flew out in 2010 to see for himself.
          </p>
          <p className={`${BODY} mb-5`}>
            On <strong>1 November 2011</strong>, McNamara was towed by jet-ski
            into a wave at Praia do Norte later measured by Guinness at 23.77
            meters (78 feet) — at that moment the largest wave ever surfed
            under any recognized standard. The photograph of McNamara as a
            speck at the base of the wave, with the Forte lighthouse visible
            on the cliff beside it, went globally viral within a week. Within
            six months Praia do Norte had a permanent water-taxi service, a
            jet-ski launch at the fortress, camera drones on every swell day,
            and a European big-wave community that had never previously
            existed. The email was the beginning of all of it.
          </p>
          {lightAlt && (
            <Figure
              image={lightAlt}
              size="wide"
              tier="B"
              caption="Praia do Norte on a mid-sized swell day. Surfers are visible offshore; crowd at the fortress ramparts."
            />
          )}
        </article>

        <div className="h-px bg-[#CBD5E1] max-w-md" />

        {/* --- The Wipeout --- */}
        <article>
          <div className={`${EYEBROW} mb-3`}>ii · The Wipeout</div>
          <h3 className={`${H3} mb-5`}>What a Nazaré hold-down physically is</h3>
          <p className={`${BODY} mb-5`}>
            A wipeout at Praia do Norte is not a single event. The wave breaks,
            the surfer is separated from the board, the surfer is driven under
            the surface and along the seabed for a distance that depends on
            the wave's energy. The problem is the <strong>second wave</strong>.
            The sets here arrive in trains of three to six, roughly
            fifteen-to-twenty seconds apart. A hold-down from the first wave
            ends as the next wave arrives, which means the surfer surfaces
            into the next breaking face and goes back down. Two-wave hold-downs
            of <strong>45 seconds or more</strong> are routine at Nazaré.
            This is why every serious big-wave surfer at this break wears an
            inflatable <strong>flotation vest</strong> with a CO₂ canister
            triggered by a ripcord — the vest is the difference between a
            90-second unconscious rescue and a drowning.
          </p>
          <p className={`${BODY} mb-5`}>
            Two wipeouts define the sport's understanding of Nazaré.
          </p>
          <p className={`${BODY} mb-5`}>
            In October 2013, Brazilian surfer <strong>Maya Gabeira</strong> was
            towed into a wave estimated at around 25 meters and separated from
            her board on take-off. She received two two-wave hold-downs. When
            fellow surfer Carlos Burle reached her on a jet-ski she was
            unconscious and floating face-down; he dragged her to the beach
            and administered CPR on the sand below the fortress. She survived
            with a broken fibula and nerve damage. She returned, rebuilt her
            technique, and in 2018 set the women's world record at Nazaré at
            20.7 meters; she extended it in 2020 to 22.4 meters. The wave that
            nearly killed her is the one her career is now built on.
          </p>
          <p className={BODY}>
            On <strong>5 January 2023</strong>, Brazilian big-wave pioneer{" "}
            <strong>Márcio Freire</strong> — one of the original Hawaiian
            paddle-in "Mad Dogs" group that first surfed Jaws without tow
            assistance in the early 2000s — died at Praia do Norte during a
            freesurfing session. He was 47. He was attempting a tow-in ride
            during an unusually clean mid-size swell. The exact mechanism of
            his death is not public, but the immediate cause was drowning
            following a hold-down. It was the{" "}
            <strong>first fatality</strong> at Nazaré in big-wave surfing
            history. The Forte flew its flag at half-mast for a week. The
            surf-community's relationship with this break was not the same
            afterwards.
          </p>
        </article>

        <div className="h-px bg-[#CBD5E1] max-w-md" />

        {/* --- The Safety Operation --- short reference, applied detail lives on /surfing --- */}
        <article>
          <div className={`${EYEBROW} mb-3`}>iii · The Water-Safety Operation</div>
          <h3 className={`${H3} mb-5`}>Nobody paddles in at Nazaré</h3>
          <p className={BODY}>
            The wave face moves too fast for human arms — every ride here is a
            jet-ski tow at roughly 50 km/h, released at the moment the swell
            peaks. Each surfer is shadowed by a second ski with a rescue sled,
            keyed to the same 90-second wipeout-to-pickup margin that
            separates an unconscious surfer who recovers from one who
            doesn't. There is a small permanent water-safety community —
            Brazilian, Portuguese, Hawaiian — who live here October through
            February and run as paired teams.{" "}
            <ClusterLink to="surfing" /> for the full tow protocol, the
            wetsuit-by-month chart, the records anthology, and the only
            big-wave comparison that makes sense (Jaws).
          </p>
          {surfer && (
            <Figure
              image={surfer}
              size="wide"
              tier="B"
              caption="A tow-in ride at Praia do Norte. The small white object visible behind and above the surfer is the rescue jet-ski."
              className="mt-6"
            />
          )}
        </article>
      </div>

      <ClusterAside>
        Applied forecasting, wetsuit by month, the complete records
        anthology, and the only big-wave comparison that actually makes
        sense (Jaws) all live in <ClusterLink to="surfing" />.
      </ClusterAside>
    </Section>
  );
}

// ============================================================================
// ZONES — lighter, orient the reader in space
// ============================================================================

function ZonesSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const grandePlage = pickImage(bundle.meta, "grande_plage_aerial");
  const zones: Zone[] = bundle.showcase.zones ?? [];

  return (
    <Section id="zones" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· Three Beaches Under One Name"
        title="The map says Nazaré. The ground says something else."
        kicker="Nazaré looks like one coastal town. On arrival it is three distinct places — two beaches and a clifftop — with three different oceans and three different purposes."
      />

      {grandePlage && (
        <Figure
          image={grandePlage}
          size="wide"
          tier="B"
          caption="Praia da Nazaré — the village beach, the working fishery side of the headland. Calm, lifeguarded, family-safe. This is not the beach that the records are broken on."
          className="mb-12"
        />
      )}

      <div className="grid gap-8 md:grid-cols-3">
        {zones.map((z) => (
          <article
            key={z.zone_code}
            className="rounded-sm border border-[#CBD5E1] bg-white p-6"
          >
            <div className={`${EYEBROW} mb-3`}>{z.zone_code}</div>
            <h3 className={`${H3} mb-3`}>{z.name}</h3>
            <p className={`${BODY_SM} mb-4`}>{z.character}</p>
            {z.best_for && (
              <div className="mb-3">
                <div className={`${EYEBROW} mb-1`}>Best for</div>
                <p className={BODY_SM}>{z.best_for}</p>
              </div>
            )}
            {z.notes && (
              <div className="mt-4 border-l-2 border-[#B91C1C] pl-4">
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#B91C1C] mb-1">
                  Take care
                </div>
                <p className={BODY_SM}>{z.notes}</p>
              </div>
            )}
          </article>
        ))}
      </div>

      <ClusterAside>
        Full visitor-safety breakdown — rip currents, the Forte cliff
        edge, swell-day traffic, cold-water exposure — plus where to
        stay and eat lives in <ClusterLink to="travel" />.
      </ClusterAside>
    </Section>
  );
}

// ============================================================================
// DAY — atmospheric color, now light (palette correction)
// ============================================================================

function DaySection({ bundle }: { bundle: LegendaryPageBundle }) {
  const day = bundle.showcase.day_in_time;
  const sunset = pickImage(bundle.meta, "cliff_sunset");
  if (!day) return null;

  const vignettes = [
    { slot: "Dawn", text: day.dawn },
    { slot: "Midday", text: day.midday },
    { slot: "Golden", text: day.golden },
    { slot: "Night", text: day.night },
  ];

  return (
    <Section id="day" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· A Day Here"
        title="What it feels like, hour by hour, in December"
      />

      {sunset && (
        <Figure
          image={sunset}
          size="wide"
          tier="B"
          caption="The Sítio cliff at sunset. December through March the money session is the 4 p.m. hour; the copper light on the wave faces is the signature of every famous Nazaré photograph."
          className="mb-10"
        />
      )}

      <div className="grid gap-10 md:grid-cols-2">
        {vignettes.map((v) => (
          <div key={v.slot}>
            <div className={`${EYEBROW} mb-3`}>{v.slot}</div>
            <p className={BODY}>{renderInlineBold(v.text)}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ============================================================================
// VILLAGE — the people section (Move 3)
// ============================================================================

function VillageSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const funicular = pickImage(bundle.meta, "funicular");
  const santuario = pickImage(bundle.meta, "santuario");
  const sitio = pickImage(bundle.meta, "sitio_town");
  const praiaN = pickImage(bundle.meta, "praia_do_norte");

  return (
    <Section id="village" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· The Village"
        title="Arte xávega, seven skirts, and the people who still work this water"
        kicker="The fishery is older than the country it sits in. The practices that made Nazaré Nazaré are not in a museum."
      />

      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
        <div className="space-y-6">
          <h3 className={H3}>Arte xávega — the 400-year method</h3>
          <p className={BODY}>
            Before jet-skis, before wetsuits, before the name of this village
            was known outside Portugal, Nazaré fished by the{" "}
            <strong>arte xávega</strong> — a beach-seine method in which an
            enormous net was rowed out in a long open boat, circled around a
            sardine shoal, and then dragged back to the sand by teams of{" "}
            <strong>oxen</strong> (replaced in the 20th century by tractors)
            pulling from ropes attached to both ends of the net. The arte
            xávega required the whole village: six to ten men in the boat,
            twenty or more on the beach, the ox-teams, the women who sorted
            the catch at the shoreline. It worked here because the
            canyon-driven upwelling brought sardine shoals close enough to
            shore to be netted from the beach.
          </p>
          <p className={BODY}>
            The catch was divided by a formal share system called{" "}
            <em>repartição</em>. One share went to the{" "}
            <em>mestre</em> (the boat's master), multiple shares to the{" "}
            <em>companha</em> (the working crew), a share to the boat owner
            for the vessel's depreciation, and a portion — the{" "}
            <em>quinhão dos pobres</em>, the poor's share — reserved for
            widows, the disabled, and the village's poorest families. The
            share system is a reason the village has a particular texture:
            for centuries the fishery was not a private industry; it was a
            communally-distributed one.
          </p>

          {praiaN && (
            <Figure
              image={praiaN}
              size="wide"
              tier="B"
              caption="Praia da Nazaré — the village beach where the arte xávega ran for four centuries. The wooden estendal racks are visible at the shoreline; the method that built this economy ended in the 1970s but the nets still come in on the same sand."
            />
          )}

          <h3 className={`${H3} mt-6`}>
            The estendal — how a sardine actually dries
          </h3>
          <p className={BODY}>
            Walk the Praia da Nazaré between June and October and the
            single most-photographed practice of this village is in progress
            in front of you. Sardines are{" "}
            <strong>split along the belly</strong> (not gutted — the backbone
            is left in), brined briefly in salt water,{" "}
            <strong>dry-salted</strong>, and laid skin-side-down on wooden
            racks — the <em>estendal</em> — on the open sand. The racks are
            oriented along an east-west axis so that the Atlantic wind and
            the afternoon sun both reach the fish faces. The drying cycle is
            two to three days in the hot months, five to seven in early
            autumn, and ends when the fish snaps cleanly between the fingers.
            The finished product is the <em>sardinha seca</em>: intensely
            salty, grilled over charcoal, eaten whole with the head on and
            the fingers.
          </p>
          <p className={BODY}>
            The women who work the estendal — almost all over 60, almost all
            in the traditional seven-skirt dress — are working, not
            performing. The practice was submitted by the Portuguese Ministry
            of Culture in 2023 as a candidate for UNESCO Intangible Cultural
            Heritage of Humanity, along with the dress. If you stop to watch,
            the etiquette is: buy sardines if you eat fish, ask before taking
            photographs, do not photograph the women's faces without eye
            contact. This is someone's afternoon, not a museum diorama.
          </p>

          <h3 className={`${H3} mt-6`}>The seven-skirt dress — corrected</h3>
          <p className={BODY}>
            The tourist-brochure explanation of the <em>sete saias</em> is
            that Nazarené women wore seven skirts "one for each day of the
            week." This is almost certainly apocryphal. The working
            explanation is more prosaic and more specific to the headland: a
            woman working the beach in December on the Portuguese Atlantic
            needed <strong>wind layers</strong> against the onshore gusts,
            <strong> cushions</strong> to kneel on the sand while sorting
            catch, <strong>fabric to bundle</strong> fish and firewood as she
            walked back up to the village, and insulation against the cold
            spray on an unprotected cliff. Seven layers of cotton and wool
            did the whole job. The seven became symbolic after it became
            practical — the number was canonised in Rafael Bordalo Pinheiro's
            ceramic figurines in the 1880s, which fixed the image of the
            Nazarené fisherwoman in the national imagination.
          </p>
        </div>

        <div className="space-y-8 lg:sticky lg:top-24">
          {santuario && (
            <Figure
              image={santuario}
              size="wide"
              tier="B"
              caption="Santuário de Nossa Senhora da Nazaré — the 14th-century Marian sanctuary on the Sítio clifftop. The pilgrimage every 8 September is 900 years continuous."
            />
          )}
          {sitio && (
            <Figure
              image={sitio}
              size="wide"
              tier="B"
              caption="Sítio, the upper town, 120 meters above the fishery."
            />
          )}
          {funicular && (
            <Figure
              image={funicular}
              size="wide"
              tier="B"
              caption="The Funicular da Nazaré, 1889. 318 meters of inclined rail; 120 meters of vertical rise in two minutes."
            />
          )}
        </div>
      </div>

      <div className="mt-16 border-t border-[#CBD5E1] pt-10">
        <div className={`${EYEBROW} mb-4`}>· Named</div>
        <p className={`${BODY} max-w-3xl`}>
          People who show up on this page by name, each for a specific
          reason: <strong>Dom Fuas Roupinho</strong>, the 12th-century
          nobleman whose horse stopped at the cliff (the founding legend);{" "}
          <strong>Rafael Bordalo Pinheiro</strong>, the 19th-century
          caricaturist and ceramicist who made the fisherwomen figures that
          fixed the village's national image (Fábrica de Faianças das Caldas
          da Rainha, still in operation);{" "}
          <strong>Manuel Guimarães</strong>, who shot a neorealist film here
          in 1952 that is preserved at Cinemateca Portuguesa;{" "}
          <strong>Amália Rodrigues</strong>, whose 1954 recording of{" "}
          <em>O Barco Negro</em> is the canonical Nazaré fado;{" "}
          <strong>Fernando Pessoa</strong>, who visited and referenced the
          coast in his ocean-inflected writing;{" "}
          <strong>Dino Casimiro</strong>, the Nazarené bodyboarder whose
          2005 email to Garrett McNamara began the modern big-wave era;{" "}
          <strong>Garrett McNamara</strong>, <strong>Sebastian Steudtner</strong>,{" "}
          <strong>Maya Gabeira</strong>, <strong>Kai Lenny</strong>,{" "}
          <strong>Justine Dupont</strong>, <strong>Michelle des Bouillons</strong>,{" "}
          <strong>Lucas Chianca</strong>, <strong>Nic von Rupp</strong>,{" "}
          <strong>Pedro "Scooby" Vianna</strong> — the adopted Nazarenés of
          the surf community, resident October to February;{" "}
          <strong>Márcio Freire</strong>, who died in this water in January
          2023.{" "}
          <em>
            The fisher and municipal community of Nazaré is under-represented
            in English-language sources; the Visiting and Sanctuary spokes
            will carry named interviews.
          </em>
        </p>
      </div>

      <ClusterAside>
        The practical side of the village — where to eat, estendal
        etiquette, what to order, where to stay — is in{" "}
        <ClusterLink to="travel" />. The 900-year pilgrimage side — the
        Lenda, the Santuário, the 8 September Festas — is in{" "}
        <ClusterLink to="sanctuary" />.
      </ClusterAside>
    </Section>
  );
}

// ============================================================================
// HISTORY — turning points (post-audit: expanded from 7 to 11)
// ============================================================================

// Match by year + first words of title so we can keep two events from the
// same year (2017 has both Museu opening and Koxa's record).
const HISTORY_KEEP: Array<{ year: number; titleStarts?: string }> = [
  { year: 1182 },
  { year: 1377 },
  { year: 1577 },
  { year: 1912 },
  { year: 1968 },
  { year: 2005 },
  { year: 2011 },
  { year: 2017, titleStarts: "Museu" },
  { year: 2020 },
  { year: 2021 },
  { year: 2023 },
];

function TimelineSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const all: TimelineEvent[] = bundle.showcase.timeline ?? [];
  const events = HISTORY_KEEP.flatMap(({ year, titleStarts }) =>
    all.filter(
      (e) =>
        e.year === year &&
        (!titleStarts || (e.title ?? "").toLowerCase().startsWith(titleStarts.toLowerCase()))
    )
  );

  return (
    <Section id="history" className={PAPER}>
      <SectionHeader
        eyebrow="· History"
        title="Eleven turning points"
        kicker="The 900-year shape of Nazaré in eleven beats — the canyon-that-fed-the-village, the canyon-that-made-it-globally-famous, and the eight things in between."
      />

      <ol className="space-y-10 border-l-2 border-[#CBD5E1] pl-8">
        {events.map((ev, i) => {
          const tag = [
            String(ev.year),
            ev.month ? monthName(ev.month) : null,
            ev.event_type,
          ]
            .filter(Boolean)
            .join(" · ");
          return (
            <li key={`${ev.year}-${i}`} className="relative">
              <span
                className="absolute -left-[35px] top-2 w-3 h-3 rounded-full"
                style={{ backgroundColor: "var(--beach-primary, #2B3E50)" }}
              />
              <div className={`${EYEBROW} mb-2`}>{tag}</div>
              <h3 className={`${H3} mb-2`}>{ev.title}</h3>
              <p className={BODY_SM}>{ev.description}</p>
              {ev.wiki_url && (
                <a
                  href={ev.wiki_url}
                  target="_blank"
                  rel="noopener"
                  className="mt-2 inline-block text-xs font-mono uppercase tracking-wider text-[color:var(--beach-primary,#2B3E50)] underline decoration-dotted underline-offset-4 hover:no-underline"
                >
                  Wikipedia →
                </a>
              )}
            </li>
          );
        })}
      </ol>

      <ClusterAside>
        The full Lenda of 1182 — Dom Fuas Roupinho, the horse, the
        cliff-edge miracle — plus the Santuário's 1377 consecration and
        the 8 September Festas are the subject of{" "}
        <ClusterLink to="sanctuary" />.
      </ClusterAside>
    </Section>
  );
}

function monthName(m: number): string {
  return (
    [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][m - 1] ?? ""
  );
}

// ============================================================================
// CULTURE — three deeper, not nine flashed
// ============================================================================

function CulturalFootprintSection() {
  return (
    <Section id="culture" className={PAPER}>
      <SectionHeader
        eyebrow="· In the Culture"
        title="The three cultural objects that are actually doing the work"
      />

      <div className="space-y-12">
        <article>
          <h3 className={`${H3} mb-4`}>
            Bordalo Pinheiro's ceramic figurines, 1884 — still being made
          </h3>
          <p className={BODY}>
            In 1884 the Portuguese caricaturist and ceramicist{" "}
            <strong>Rafael Bordalo Pinheiro</strong>, working from his new
            factory at Caldas da Rainha (<em>Fábrica de Faianças das Caldas
            da Rainha</em>), produced a series of small ceramic figurines of
            Nazarené fisherwomen in the seven-skirt dress — and by doing so,
            fixed the image of the Portuguese coastal woman in the national
            imagination for the next 140 years. The figures you see in every
            Portuguese souvenir shop — brown-skinned, weathered, a basket on
            the head, the seven layered skirts — are direct lineal
            descendants. The factory is still operating. The figurines are
            still being pressed in the same molds. The image of the Nazaré
            fisherwoman that a foreign tourist buys in 2026 is the same
            image a Porto schoolchild was taught to admire in 1890. Very few
            places on Earth have an export that durable, that continuous, or
            that specific to one village of women.
          </p>
        </article>

        <article>
          <h3 className={`${H3} mb-4`}>
            O Barco Negro, 1954 — the fado that named the village
          </h3>
          <p className={BODY}>
            Portuguese fado — the national song form — has a sub-genre called
            <strong> fado do mar</strong> (sea fado), concerned with the
            emotional weight of fishing-village life and specifically with
            the <em>saudade</em> of wives whose husbands went to sea and did
            not return. The canonical recording of this sub-genre is Amália
            Rodrigues's 1954 version of <em>O Barco Negro</em> — "The Black
            Boat" — written by David Mourão-Ferreira with music by Caco
            Velho. The lyrics describe a Nazarené widow watching for the
            black boat that will bring her husband's body back. The song
            made Nazaré's specific grief legible to Portuguese listeners in
            a way no other cultural artifact has done. It was sung at the
            funeral of every Portuguese fisherman for forty years. When
            Manuel Guimarães shot his 1952 neorealist film <em>Nazaré</em>{" "}
            — preserved at Cinemateca Portuguesa — he used fado do mar as
            the soundtrack. This is what Nazaré sounded like before it
            became what it is now.
          </p>
        </article>

        <article>
          <h3 className={`${H3} mb-4`}>
            100 Foot Wave + the tourism poster, 2011–present
          </h3>
          <p className={BODY}>
            Since 2011 Nazaré has been Portugal's international cover image.
            The country's tourism agency, <strong>Turismo de Portugal</strong>,
            built the whole of its international advertising campaign around
            a single composition: wave, lighthouse, fortress, impossible
            scale. HBO's <em>100 Foot Wave</em> (Chris Smith, 2021) ran three
            seasons and won four Primetime Emmy Awards. The WSL Tow Surfing
            Challenge has been held here annually since 2022. Dana Brown's
            2024 <em>Rise of the Giants</em> centered the current generation
            of women big-wave surfers and premiered at Tribeca. The photograph
            that did all of this — McNamara against the wave with the Forte
            visible — is now one of the most-reproduced single images in the
            history of sport. The contemporary Nazaré is the first cultural
            artifact in the village's history that is made <em>about</em>{" "}
            Nazaré by people from everywhere else. The fisherwomen's figures
            were made by a Portuguese man. The fado was sung by a Portuguese
            woman. The documentary is American. The difference matters.
          </p>
        </article>
      </div>
    </Section>
  );
}

// ============================================================================
// VILLAGE BENEATH — don't touch (strongest writing on the page)
// ============================================================================

function VillageBeneathSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const note =
    bundle.showcase.favela_note ?? bundle.showcase.honest_reckoning_note;
  if (!note) return null;
  const paragraphs = note.split("\n\n").filter(Boolean);

  return (
    <Section id="village-beneath" className={DARK}>
      <div className="max-w-3xl">
        <div
          className="text-[11px] font-mono uppercase tracking-[0.3em] mb-4"
          style={{ color: "var(--beach-supporting, #D4A574)" }}
        >
          · The Village Beneath the Wave
        </div>
        <h2 className={H2_DARK} style={DISPLAY_STYLE}>
          What the tourism numbers cost
        </h2>
        <p className="mt-5 text-lg italic text-[#94A3B8] font-serif">
          Every legendary page is incomplete without the weight it carries.
          For Nazaré, that weight is a 900-year-old working fishery priced
          out of the village it built.
        </p>
      </div>

      <div className="mt-12 space-y-6 max-w-3xl">
        {paragraphs.map((p, i) => (
          <p key={i} className={BODY_DARK}>
            {renderInline(p)}
          </p>
        ))}
      </div>
    </Section>
  );
}

function renderInline(text: string): ReactNode[] {
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

// ============================================================================
// WHEN — thin seasonal band (folds Festas, surf season, WSL Tow Challenge into
// one paragraph instead of inflating to a 4th "Local" spoke)
// ============================================================================

function WhenToComeSection() {
  return (
    <Section id="when" className={PAPER}>
      <div className={`${EYEBROW} mb-4`}>· When to come</div>
      <h2 className={`${H2} mb-8`} style={DISPLAY_STYLE}>
        Four seasons, four versions of the village
      </h2>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className={`${EYEBROW} mb-2`}>Oct–Feb · Big-wave season</div>
          <p className={BODY}>
            Spectator weather. The Forte fills on swell-day mornings; the WSL
            Tow Challenge calls a 72-hour window when the forecast aligns.
            This is the Nazaré that the photographs are of — and the only
            time to actually see it work. Forecast windows live on{" "}
            <ClusterLink to="surfing" />.
          </p>
        </div>
        <div>
          <div className={`${EYEBROW} mb-2`}>Mar–Jun · Empty-village season</div>
          <p className={BODY}>
            The swells are gone, the buses haven&rsquo;t arrived, the
            light is long. The fishery still works. The funicular still runs
            every ten minutes. The version of Nazaré that the locals like.
          </p>
        </div>
        <div>
          <div className={`${EYEBROW} mb-2`}>Jul–Aug · Domestic summer</div>
          <p className={BODY}>
            Portuguese family beach holiday — Praia da Nazaré crowds with
            umbrellas, the Avenida Marginal kiosks run late, the estendal
            puts out twice as much fish. Practical guidance lives on{" "}
            <ClusterLink to="travel" />.
          </p>
        </div>
        <div>
          <div className={`${EYEBROW} mb-2`}>Sep 8 · Festas da Senhora</div>
          <p className={BODY}>
            Close to 100,000 pilgrims to the Sítio sanctuary for the oldest
            continuously-celebrated Marian pilgrimage in Iberia — processions
            from the Ermida da Memória, folkloric performances, fireworks.
            The whole story — the 1182 Lenda, Dom Fuas, the 14th-century
            Santuário — lives on <ClusterLink to="sanctuary" />.
          </p>
        </div>
      </div>
    </Section>
  );
}

// ============================================================================
// NEARBY — Silver Coast context (Move 4)
// ============================================================================

function NearbySection() {
  const places = [
    {
      name: "São Martinho do Porto",
      distance: "10 km north",
      blurb:
        "The Atlantic's most perfectly-shaped natural harbor — an almost-closed circular bay with a narrow opening to the sea. Calm water year-round. The anti-Nazaré: families, paddle-boards, a rose-pink sunset view that Tripadvisor has decided is the point. Visit in the morning before coach tours arrive.",
    },
    {
      name: "Alcobaça",
      distance: "15 km inland",
      blurb:
        "The 12th-century Cistercian monastery of Santa Maria de Alcobaça — a UNESCO World Heritage site and one of the most important Gothic buildings in Iberia. Inside: the tombs of **Dom Pedro I and Inês de Castro**, facing each other — the central tragedy of medieval Portuguese literature. If you read one thing before you visit, read Camões's account of the murder of Inês in Canto III of *Os Lusíadas*.",
    },
    {
      name: "Peniche",
      distance: "50 km south",
      blurb:
        "Nazaré's pair, the one no one mentions. Peniche hosts the WSL MEO Pro — the country's World Championship Tour event at **Supertubos**, a beach break that produces some of the cleanest barrels in Europe. Nazaré is the poster for Portuguese surfing; Peniche is the factory. Fifteen years ago Portugal was a minor European surf destination. Today it is the surfing capital of the continent. Both coasts did that work.",
    },
    {
      name: "Óbidos",
      distance: "25 km south",
      blurb:
        "The walled medieval town given as a wedding gift by Dom Dinis to his queen in the 13th century and retained as the queens' property of Portugal for 650 years thereafter. Walk the ramparts. Drink the **ginjinha** — sour cherry liqueur served in a small chocolate cup that you eat afterwards. The most-photographed small town in Portugal.",
    },
    {
      name: "Batalha",
      distance: "25 km inland",
      blurb:
        "The Monastery of Batalha — a UNESCO-listed late-Gothic / Manueline masterpiece commissioned in 1385 to commemorate Portugal's victory over Castile at the Battle of Aljubarrota. The Manueline style — a Portuguese decorative architecture of rope-twists and sea motifs — begins here. If you came to Portugal for the age-of-discoveries story, this building is where the country's self-image as an Atlantic maritime power was first put in stone.",
    },
  ];
  return (
    <Section id="nearby" className={PAPER} width="wide">
      <SectionHeader
        eyebrow="· On the Silver Coast"
        title="The coast Nazaré is the middle of"
        kicker="Costa de Prata carries most of Portugal's pre-Discoveries cultural history. Five places within an hour, ordered roughly south-to-north along the coast."
      />
      <div className="divide-y divide-[#CBD5E1] border-y border-[#CBD5E1]">
        {places.map((p) => (
          <article
            key={p.name}
            className="grid gap-4 py-8 md:grid-cols-[200px_1fr] md:gap-10"
          >
            <div>
              <div className={`${EYEBROW} mb-2`}>{p.distance}</div>
              <h3 className={H3}>{p.name}</h3>
            </div>
            <p className={BODY}>{renderInlineBold(p.blurb)}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

// ============================================================================
// SPOKES
// ============================================================================

function SpokeFooter() {
  const spokes = [
    {
      slug: "travel",
      label: "Visiting Nazaré",
      subtitle:
        "Planning a trip — getting there, where to stay, what to eat, visitor safety.",
    },
    {
      slug: "surfing",
      label: "Surfing Nazaré",
      subtitle:
        "Canyon physics applied — forecasting, wetsuits, tow operations, records anthology, the Jaws comparison.",
    },
    {
      slug: "sanctuary",
      label: "The Sanctuary",
      subtitle:
        "The Lenda of 1182, the Santuário, the Ermida da Memória, and the Festas da Senhora every 8 September.",
    },
  ];

  return (
    <Section id="spokes" className={PAPER} width="wide">
      <div className={`${EYEBROW} mb-6`}>· Go Deeper</div>
      <h2 className={`${H2} mb-12 max-w-3xl`} style={DISPLAY_STYLE}>
        Three pages for three ways in
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {spokes.map((s) => (
          <a
            key={s.slug}
            href={`/beaches/praia-do-norte-6/${s.slug}`}
            className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#2B3E50)] transition-colors"
          >
            <h3
              className={`${H3} mb-3 group-hover:text-[color:var(--beach-primary,#2B3E50)]`}
            >
              {s.label} →
            </h3>
            <p className={BODY_SM}>{s.subtitle}</p>
          </a>
        ))}
      </div>
    </Section>
  );
}

function PageProvenance({ bundle }: { bundle: LegendaryPageBundle }) {
  return (
    <section className="border-t border-[#E2E8F0] bg-[#FAFAF7]">
      <div className="mx-auto max-w-3xl px-6 py-12 text-sm text-volcanic-500 leading-relaxed">
        <div className={`${EYEBROW} mb-4`}>· About this page</div>
        <p className="text-[13px] leading-[1.65]">
          <strong>
            Written by{" "}
            {bundle.composition.byline.replace("Written by ", "")}.
          </strong>{" "}
          Canyon physics: Oliveira et al. (2013), <em>JGR: Oceans</em>;
          University of Lisbon; IPMA. Big-wave measurements: WSL Big Wave
          Awards, Guinness, University of Alcalá remeasurement.
          Ethnographic detail on the arte xávega and estendal follows the
          regional fisheries literature; the sete-saias reading is a
          working correction of the "one for each day" tourist explanation
          and follows the preponderance of textile-history evidence.
          Márcio Freire's death on 5 January 2023 is named because the
          page cannot cover this break seriously without it. The fisher
          and municipal community of Nazaré is under-represented in
          English-language sources; the Travel and Local spokes will
          correct this with named interviews. Version v0.9. Corrections
          welcome — particularly on Portuguese-language framings and on
          the named practices of the estendal.
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function NazareV2Page({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta, data } = bundle;
  const location = [data.admin_level_1, data.country_code]
    .filter(Boolean)
    .join(", ");
  const heroImage = pickImage(meta, "cliff_crowd_wave") ?? meta.images.hero;

  return (
    <LegendaryShell composition={composition}>
      <Hero
        beachName={composition.beach_name}
        location={location}
        tagline="The canyon made the village. 900 years later it made the village famous for something else. It's still the same village."
        heroType="SPIKE"
        primary={heroImage}
        version={composition.version}
        tier={composition.tier}
      />

      <ClusterRail current="main" beachName={composition.beach_name} />

      <NazareStory />
      <CanyonSection bundle={bundle} />
      <WaterStoriesSection bundle={bundle} />
      <ZonesSection bundle={bundle} />
      <DaySection bundle={bundle} />
      <VillageSection bundle={bundle} />
      <TimelineSection bundle={bundle} />
      <CulturalFootprintSection />
      <VillageBeneathSection bundle={bundle} />
      <WhenToComeSection />
      <NearbySection />
      <SpokeFooter />
      <PageProvenance bundle={bundle} />
    </LegendaryShell>
  );
}
