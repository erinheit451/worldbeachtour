/**
 * Peniche → Visiting (travel spoke). Standalone page.
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

export default function PenicheVisitingPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage =
    pickImage(meta, "fortaleza") ?? pickImage(meta, "peninsula") ?? meta.images.hero;

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="visiting" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Visiting Peniche"
        title="Ninety minutes from Lisbon to the surf coast"
        kicker="Peniche is the practical base for any Silver Coast trip: closer to Lisbon than Nazaré, more infrastructure than São Martinho, and host to three parallel attractions (surf, fortress, Berlengas) that justify two to four nights."
        image={heroImage}
      />

      {/* --- Getting here --- */}
      <Section id="getting-here" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Getting Here"
          title="95 km from Lisbon, 50 km from Nazaré"
        />
        <div className="grid gap-8 md:grid-cols-2">
          <article>
            <h3 className={`${H3} mb-3`}>From Lisbon (LIS)</h3>
            <p className={BODY_SM}>
              95 km north via the A8 motorway; 70–85 minutes by car.
              Exit the A8 at Bombarral-Peniche and take the IP6 west.
              Rede Expressos direct buses run from Lisbon Sete Rios
              to Peniche, ~1h 45m, €10–14. Unlike Nazaré's strip,
              Peniche has a real urban bus station and is more
              accessible without a car.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>From Nazaré or São Martinho</h3>
            <p className={BODY_SM}>
              40–50 km south on the N242 / A8. 45 minutes by car.
              The natural Silver Coast combination: stay in Nazaré
              for the big-wave era, day-trip or overnight in Peniche
              for Supertubos and the Fortaleza, stop in São
              Martinho for a calm-water swim in between.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>Parking</h3>
            <p className={BODY_SM}>
              The old town has limited parking; use the municipal
              lots on the northern edge (Porto de Pesca) and walk in.
              Parking at Supertubos is free but fills by 10 a.m. on
              competition days during WSL week. Parking in Baleal
              fills faster — arrive early or park in Peniche and take
              the shuttle bus.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>On the ground</h3>
            <p className={BODY_SM}>
              The old town walks end-to-end in 20 minutes. A local
              bus links Peniche to Baleal every 30 minutes in summer.
              Rent a car for one day to do Berlengas logistics and
              the Cabo Carvoeiro lighthouse walk; the rest is
              walkable or bus-able.
            </p>
          </article>
        </div>
      </Section>

      {/* --- Stay --- */}
      <Section id="stay" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· Where to Stay"
          title="Three neighborhoods, three characters"
        />
        <div className="grid gap-8 md:grid-cols-3">
          <StayCard
            zone="Old town / Vila Velha"
            body="The historic core — cobblestone, the fortress, the working harbor. Mid-range pensões and small hotels (€70–140 / night). Best for travellers who want working-Portuguese-town character over beach convenience."
          />
          <StayCard
            zone="Supertubos / south coast"
            body="The surf-tourism strip between the old town and Supertubos. Surf hostels, mid-range hotels, and Airbnbs (€60–150). Closest to the competition beach. Book 4+ months ahead for WSL week."
          />
          <StayCard
            zone="Baleal"
            body="The surf-school hub, 3 km north. Surf camps, hostels, beachfront apartments (€50–200 depending on season and tier). Walk-out access to beginner breaks. Party-hostel register in summer; quieter in shoulder season."
          />
        </div>
      </Section>

      {/* --- Eat --- */}
      <Section id="eat" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· What to Eat"
          title="The working fishery still feeds the town"
        />
        <div className="grid gap-10 md:grid-cols-2">
          <EatCard
            name="Sardinha assada"
            range="€8–14 for six"
            body="Portugal's largest sardine fleet is based here. The fish grilled on Avenida do Mar charcoal grills were in the Atlantic twelve hours earlier. Peak fat content July–September. **The town's defining dish.**"
          />
          <EatCard
            name="Polvo à lagareiro"
            range="€18–28"
            body="Roast octopus — Peniche's rocky coast produces some of Portugal's best. Whole octopus slow-roasted with garlic, olive oil, and potato. Feeds two. Restaurante Marítimo does a canonical version."
          />
          <EatCard
            name="Bacalhau à brás at Nau dos Corvos"
            range="€20–28"
            body="Salt cod with shredded potato, egg, olives. The regional gold standard, served at the restaurant in the old fort near Cabo Carvoeiro. Atlantic sunset view; reservations useful."
          />
          <EatCard
            name="Ginjinha de Óbidos"
            range="€2–4 a shot"
            body="Sour cherry liqueur from Óbidos 25 km inland. Every Peniche bar serves it. The right after-dinner drink on a cold October Atlantic evening."
          />
        </div>
      </Section>

      {/* --- The Fortaleza as a visit --- */}
      <Section id="fortaleza-visit" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· The Fortaleza"
          title="How to actually visit the political-prison museum"
          kicker="The Centro Nacional de Resistência e Liberdade (the Fortaleza museum) is the single most important thing to do in Peniche. It is also the most demanding. A visitor who allocates 45 minutes leaves disappointed; one who allocates 2–3 hours leaves changed."
        />

        <div className="space-y-6 max-w-3xl">
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>
              <strong>Admission</strong>: €5 adult; €2.50 reduced;
              free under 12. Closed Mondays.
            </li>
            <li>
              <strong>Time budget</strong>: 2–3 hours for the main
              exhibition; add 30 minutes for the outer ramparts and
              the seaward cliffs.
            </li>
            <li>
              <strong>Language</strong>: Main interpretation is in
              Portuguese; the major panels have English translations;
              some prisoner-testimony audio recordings are
              Portuguese-only with English transcripts. Pick up the
              English self-guided brochure at the entrance.
            </li>
            <li>
              <strong>What to prioritize</strong>: the{" "}
              <em>segredo</em> (solitary confinement) wing, the
              reconstructed interrogation room, the tunnel Cunhal and
              the others escaped through in 1960. The permanent
              exhibition on the Estado Novo and its political prisoners
              is deliberately paced; don't rush.
            </li>
            <li>
              <strong>Best time to go</strong>: First thing in the
              morning or late afternoon. Midday buses bring tour
              groups that crowd the solitary-confinement wing. The
              museum rewards quiet.
            </li>
          </ul>
        </div>
      </Section>

      {/* --- Itineraries --- */}
      <Section id="itineraries" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· Itineraries"
          title="Three ways to use Peniche"
        />
        <div className="grid gap-10 lg:grid-cols-3">
          <Itinerary
            days="Day trip from Lisbon"
            body="Drive up via A8. Morning at the Fortaleza. Lunch on Avenida do Mar. Afternoon at Supertubos or Baleal (walk, not swim). Sunset at Cabo Carvoeiro. Drive back. 8–10 hours."
          />
          <Itinerary
            days="Two nights (default)"
            body="Day 1: arrive, old town, Fortaleza. Day 2: Baleal (maybe a surf lesson), Cabo Carvoeiro sunset, dinner Nau dos Corvos. Day 3: optional Berlengas boat trip if booked ahead, return."
          />
          <Itinerary
            days="Three nights, surf + deeper"
            body="Adds a Berlengas day (boat from harbor, Berlenga Grande hike + picnic), or a morning surf lesson + afternoon beach session if that's the visit's point. Can also extend to Nazaré / São Martinho as a Silver Coast loop."
          />
        </div>

        <ClusterAside>
          If the surf is the reason you're here — which break, what to
          expect your first lesson, the WSL week as a visitor — it's all
          in <ClusterLink to="surfing" />.
        </ClusterAside>
        <ClusterAside>
          If you're planning a Berlengas boat trip, the booking
          mechanics and the overnight-in-the-fort decision are in{" "}
          <ClusterLink to="berlengas" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="visiting" />

      <SpokeProvenance
        bundle={bundle}
        note="Rates and logistics reflect April 2026. Hotel and restaurant names are reference points. Verify Rede Expressos bus schedules before travel. Fortaleza opening hours and admission from the Centro Nacional de Resistência e Liberdade website; verify for holiday closures."
      />
    </LegendaryShell>
  );
}

function StayCard({ zone, body }: { zone: string; body: string }) {
  return (
    <article className="rounded-sm border border-[#E7E2D4] bg-white p-6">
      <h3 className={`${H3} mb-3`}>{zone}</h3>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}

function EatCard({
  name,
  range,
  body,
}: {
  name: string;
  range: string;
  body: string;
}) {
  return (
    <article>
      <div className="flex items-baseline gap-3 mb-3 flex-wrap">
        <h3 className={H3}>{name}</h3>
        <span className={EYEBROW}>{range}</span>
      </div>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}

function Itinerary({ days, body }: { days: string; body: string }) {
  return (
    <article className="rounded-sm border border-[#CBD5E1] bg-white p-7">
      <h3 className={`${H3} mb-4`}>{days}</h3>
      <p className={BODY_SM}>{body}</p>
    </article>
  );
}
