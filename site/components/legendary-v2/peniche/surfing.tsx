/**
 * Peniche → Surfing Peniche (surf spoke). Standalone page.
 */

import type { LegendaryPageBundle } from "../types";
import LegendaryShell from "../shell";
import Figure from "../primitives/figure";
import {
  BODY,
  BODY_SM,
  COOL,
  CREAM,
  EYEBROW,
  Fact,
  H3,
  PAPER,
  Section,
  SectionHeader,
  SpokeHero,
  SpokeProvenance,
  pickImage,
  renderInlineBold,
} from "../nazare/shared";
import {
  ClusterAside,
  ClusterLink,
  ClusterRail,
  SpokeCrossNav,
} from "./shared";

export default function PenicheSurfPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage =
    pickImage(meta, "supertubos_wave") ??
    pickImage(meta, "wsl_event") ??
    meta.images.hero;
  const molhe = pickImage(meta, "molhe_supertubos");
  const wsl = pickImage(meta, "wsl_event");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="surfing" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Surfing Peniche"
        title="Five breaks, three skill levels, one WSL event"
        kicker="Peniche's peninsula funnels swell onto six kilometers of coastline from every compass direction. Which break you surf depends on the wind, the swell, your skill, and whether the WSL has the town booked that week."
        image={heroImage}
      />

      {/* --- The break matrix --- */}
      <Section id="break-matrix" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Where to Surf"
          title="Which break for which day, which level"
          kicker="Peniche's four main surfable beaches cover the skill spectrum from first-lesson to tour-level competition. The peninsula's shape means one of them is almost always working."
        />

        <div className="grid gap-8 md:grid-cols-2">
          <BreakCard
            level="Expert"
            name="Supertubos (Praia do Medão)"
            body="The country's marquee break. Hollow, fast-peeling sand-bottom barrels on SW–SSW swell, 12s+ period. Paddle-out is a gauntlet; take-off zone is shallow and unforgiving. WSL Championship Tour event here every October. **Not a beginner break** under any conditions."
          />
          <BreakCard
            level="Intermediate–Advanced"
            name="Praia do Baleal Sul"
            body="The south-facing beach of the Baleal peninsula, 3 km north of Peniche proper. Faster and more hollow than Baleal Norte; picks up north swell as well as west. Good step-up from beginner conditions once you can read lineups."
          />
          <BreakCard
            level="Beginner–Intermediate"
            name="Praia do Baleal Norte"
            body="The classic Portuguese first-lesson beach — north-facing, protected from prevailing SW swell, consistently small and manageable. Most of Peniche's 30+ surf schools operate here. Summer lineups are crowded with learners; paddle respectfully."
          />
          <BreakCard
            level="Variable"
            name="Consolação"
            body="7 km south of Supertubos. Better in summer when Supertubos is small; can be inconsistent but is a usable intermediate alternative when the main break is flat. The reef section on the north side is advanced only."
          />
        </div>

        {molhe && (
          <Figure
            image={molhe}
            size="wide"
            tier="B"
            caption="Praia do Molhe Leste and Supertubos — the coastline the WSL event moves between depending on which break is working on a competition day."
            className="mt-12"
          />
        )}
      </Section>

      {/* --- Surf schools --- */}
      <Section id="schools" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· Choosing a School"
          title="Thirty-plus schools on the peninsula — what makes the difference"
          kicker="Peniche and Baleal together host one of the densest concentrations of surf schools in Europe. Price range is tight (€35–55 per group lesson, €70–120 per private). What varies is ratio, instructor quality, and whether you'll be in a group of five or fifteen."
        />

        <div className="space-y-6 max-w-3xl">
          <h3 className={H3}>What to look for</h3>
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>
              <strong>Ratio 1:4 or better.</strong> Group lessons scaling
              to 6+ students per instructor are common in peak summer
              and sacrifice learning quality.
            </li>
            <li>
              <strong>ISA certification</strong> — International Surfing
              Association certification is the global standard.
              Portuguese national certification (through the Federação
              Portuguesa de Surf) is also acceptable.
            </li>
            <li>
              <strong>Soft-top boards for first lessons</strong>. Schools
              that start first-timers on hard boards are prioritizing
              their equipment costs over your safety.
            </li>
            <li>
              <strong>Multi-day packages</strong>. Five-day learn-to-surf
              packages at Baleal run €180–300 depending on level and
              includes gear. The incremental cost per lesson drops
              significantly vs booking one-off.
            </li>
          </ul>

          <h3 className={`${H3} mt-6`}>Surf camps at Baleal</h3>
          <p className={BODY}>
            Peniche's surf-camp industry is largely concentrated at
            Baleal. The format: 3–7 night packages combining
            accommodation (hostel or shared apartment), daily lessons,
            equipment, and usually meals. Pricing €300–900 per week
            depending on tier. <strong>Peniche Surf Camp</strong>{" "}
            (operating since 1996), <strong>Baleal Surf Camp</strong>,
            and <strong>Surf's Up Peniche</strong> are the three
            longest-operating. Many more have opened since 2015; check
            recent reviews, particularly for instructor quality and
            accommodation upkeep.
          </p>
        </div>
      </Section>

      {/* --- WSL week --- */}
      <Section id="wsl-week" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· The WSL Event"
          title="What it's like to be here during the Rip Curl Pro"
          kicker="The MEO Rip Curl Pro Portugal runs in October — typically a 10-day window during which the event can call heats on any day conditions allow. Being in Peniche during WSL week is a specific experience."
        />

        {wsl && (
          <Figure
            image={wsl}
            size="wide"
            tier="B"
            caption="The WSL event at Supertubos — public beach viewing, broadcast compound, sponsor activation area. The daily viewing experience for a visitor during competition week."
            className="mb-10"
          />
        )}

        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6">
            <h3 className={H3}>Viewing from the beach</h3>
            <p className={BODY}>
              Supertubos is a public beach; WSL events do not fence
              off the viewing area. Spectators set up on the sand
              behind the competition zone. The beach fills during
              decisive finals heats; an hour before the scheduled
              start of the women's or men's final you want to be in
              position. Finals days draw <strong>15–25,000
              spectators</strong>. The vibe is festival-adjacent —
              sponsor activations, food trucks, DJs between heats.
            </p>
            <h3 className={`${H3} mt-6`}>The two-day rhythm</h3>
            <p className={BODY}>
              The event's daily "Heats On / Lay Day" call is
              announced on the WSL app the night before and
              confirmed at 6:30 a.m. on the competition morning. A
              lay day is a rest day — no heats — and is called when
              conditions don't meet the competition standard. Lay
              days are common in 10-day windows; expect 3–5 of them.
              A visitor booking lodging during WSL week should
              budget for 2–3 realistic competition days, not 10.
            </p>
            <h3 className={`${H3} mt-6`}>Watching from home vs the beach</h3>
            <p className={BODY}>
              The WSL's live broadcast and commentary are genuinely
              better information than the on-beach experience; you
              see every wave up close, you hear scoring explained.
              <strong> The on-beach experience is for the atmosphere,
              not the surfing itself.</strong> The right use of WSL
              week as a visitor: watch the morning heats from the
              beach, leave by lunch, watch the afternoon final at a
              café with the broadcast on — most bars show it during
              competition week.
            </p>
          </div>

          <aside className="lg:sticky lg:top-24 rounded-sm border border-[#E7E2D4] bg-white p-7">
            <div className={`${EYEBROW} mb-5`}>· WSL Week Numbers</div>
            <dl className="space-y-5">
              <Fact label="Event window" value="10 days, October" />
              <Fact label="Competition days" value="~5 of 10" />
              <Fact label="Lay days" value="~4 of 10" />
              <Fact label="Peak attendance" value="15–25K" />
              <Fact label="Hotel premium" value="+40–80%" />
              <Fact label="Book ahead" value="4–6 months" />
              <Fact label="Live coverage" value="worldsurfleague.com" />
            </dl>
          </aside>
        </div>
      </Section>

      {/* --- Peniche vs Ericeira vs Nazaré --- */}
      <Section id="compared" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· The Portuguese Surf Triangle"
          title="Peniche vs Ericeira vs Nazaré"
          kicker="Portugal's three canonical surf destinations sit within 80 kilometers of each other on the Silver Coast. They serve different audiences and different wave types. A visiting surfer who knows the distinctions books more productive trips."
        />

        <div className="grid gap-8 md:grid-cols-3">
          <CompareCard
            name="Peniche"
            location="Silver Coast"
            points={[
              "Hollow beach breaks",
              "WSL Championship Tour host",
              "Sand-bottom, shifts seasonally",
              "Advanced at Supertubos / beginner at Baleal",
              "Working fishing town + surf industry",
            ]}
          />
          <CompareCard
            name="Ericeira"
            location="40 km south of Peniche"
            points={[
              "World Surfing Reserve (2011)",
              "Seven consecutive reef breaks",
              "Reef breaks (more consistent, more dangerous)",
              "Intermediate–advanced across most breaks",
              "Smaller, more intimate surf town",
            ]}
          />
          <CompareCard
            name="Nazaré"
            location="50 km north of Peniche"
            points={[
              "Canyon-driven big-wave",
              "World record waves (26 m+)",
              "Tow-in exclusively",
              "Expert only (dangerous for everyone else)",
              "Village that became globally famous"
            ]}
          />
        </div>

        <ClusterAside>
          Non-surfing trip-planning — getting here, where to stay, what
          to eat, the Fortaleza and the lace museum — is in{" "}
          <ClusterLink to="visiting" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="surfing" />

      <SpokeProvenance
        bundle={bundle}
        note="Break classification and skill guidance reflects current consensus among the Peniche-resident surf-school community. School names are reference points, not endorsements; verify current ratings before booking. WSL event schedule per worldsurfleague.com. Break conditions change with swell and sand — a break that's perfect one week can be flat the next."
      />
    </LegendaryShell>
  );
}

function BreakCard({
  level,
  name,
  body,
}: {
  level: string;
  name: string;
  body: string;
}) {
  return (
    <article className="rounded-sm border border-[#CBD5E1] bg-white p-7">
      <div className={`${EYEBROW} mb-2`}>{level}</div>
      <h3 className={`${H3} mb-3`}>{name}</h3>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}

function CompareCard({
  name,
  location,
  points,
}: {
  name: string;
  location: string;
  points: string[];
}) {
  return (
    <article className="rounded-sm border border-[#E2E8F0] bg-white p-7">
      <div className={`${EYEBROW} mb-2`}>{location}</div>
      <h3 className={`${H3} mb-4`}>{name}</h3>
      <ul className="text-[14px] text-volcanic-700 leading-relaxed space-y-2 list-disc pl-4">
        {points.map((pt, i) => (
          <li key={i}>{pt}</li>
        ))}
      </ul>
    </article>
  );
}
