/**
 * São Martinho do Porto → Visiting (Travel spoke). Standalone page.
 *
 * Tier 2 spoke — ~1,500 words, 3 images, practical register.
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

export default function SmpVisitingPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage = pickImage(meta, "beach_summer") ?? meta.images.hero;
  const houses = pickImage(meta, "houses");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="visiting" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Visiting São Martinho"
        title="How to use the bay"
        kicker="São Martinho is the easy Silver Coast day — a half-hour off the A8, 108 kilometers from Lisbon, ten kilometers south of Nazaré. Most visitors come for an afternoon. A full night gives you the village after the day-trippers leave."
        image={heroImage}
      />

      {/* --- Getting here --- */}
      <Section id="getting-here" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Getting Here"
          title="Lisbon 108 km south, Nazaré 10 km north"
          kicker="São Martinho sits between Lisbon and Porto on the A8 motorway. Most visitors drive. The Linha do Oeste railway — the 1887 line that put the town on the Portuguese summer-resort map — no longer runs passenger service to this stop."
        />

        <div className="grid gap-8 md:grid-cols-2">
          <article>
            <h3 className={`${H3} mb-3`}>From Lisbon (LIS airport)</h3>
            <p className={BODY_SM}>
              108 km north via the A8 motorway. Drive time 75–90 minutes
              depending on traffic. Exit the A8 at either Caldas da
              Rainha Norte (12 km east of São Martinho) or the Alcobaça
              / Nazaré exit (slightly shorter but via winding road).
              Rede Expressos buses run from Lisbon Sete Rios to São
              Martinho via Caldas da Rainha; ~2 hours, €12–15, fewer
              departures than the Lisbon–Nazaré express.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>From Nazaré</h3>
            <p className={BODY_SM}>
              10 km south on the N242. 15 minutes by car. This is the
              standard combination: stay in Nazaré for the big-wave
              village atmosphere, day-trip to São Martinho for a
              swimmable beach afternoon. Local bus service between the
              two towns runs several times a day in summer, less
              frequently in winter.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>Parking</h3>
            <p className={BODY_SM}>
              Street parking on Avenida Marginal is free and generally
              available outside peak summer Saturdays. The municipal
              lot at the southern end of the beach handles overflow.
              In August, arrive before 10 a.m. or after 5 p.m.; midday
              parking is tight.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>On foot</h3>
            <p className={BODY_SM}>
              The village is walkable end-to-end in 15 minutes. The
              beach promenade runs the length of Avenida Marginal; the
              uphill walk to the northern headland (Farol do Cabo do
              Ouivro) is 25 minutes and worth doing at sunset.
            </p>
          </article>
        </div>
      </Section>

      {/* --- Where to stay --- */}
      <Section id="stay" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· Where to Stay"
          title="A small set of good options"
          kicker="São Martinho has roughly a dozen hotels and as many small pensões. No international chain properties. The inventory is small, Portuguese-owned, and almost entirely family-run."
        />

        <div className="grid gap-8 md:grid-cols-3">
          <StayCard
            name="Hotels on the beach"
            character="A handful of mid-range hotels along Avenida Marginal with direct views of the bay. Hotel Concha — the oldest operating hotel in town, opened in the 1890s — and Hotel Parque Verde are the two canonical names. €110–180 per night in high season."
          />
          <StayCard
            name="Inland pensões and B&Bs"
            character="Smaller guest houses on the streets a block or two off the beachfront. Generally cheaper (€60–110 per night), family-run, no elevator, simple breakfast included. Verify English availability if it matters to you; many hosts are Portuguese-first."
          />
          <StayCard
            name="Quintas and Airbnb"
            character="Rural-tourism properties on the hills above the bay and short-term rentals in the village core. Better value in the shoulder seasons (May, October). Portugal's short-term-rental licensing (registration number required) is enforced here; verify the listing is legal before booking."
          />
        </div>

        {houses && (
          <Figure
            image={houses}
            size="wide"
            tier="B"
            caption="The tile-fronted houses of the village core — late-19th- and early-20th-century Portuguese seaside vernacular. The hotel inventory lives mostly in this architectural layer."
            className="mt-12"
          />
        )}
      </Section>

      {/* --- Eat --- */}
      <Section id="eat" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· What to Eat"
          title="The Silver Coast seafood tradition, unhurried"
        />

        <div className="grid gap-10 md:grid-cols-2">
          <EatCard
            name="Caldeirada de peixe"
            range="€15–22"
            body="Portuguese fish stew — the São Martinho version uses the bay's own small fleet's catch. Typically served at the table in a clay pot for two or more. **Tasca do Júlio** and **Retiro do Mar** are the anchor names."
          />
          <EatCard
            name="Sardinha assada"
            range="€8–14 for six"
            body="Grilled sardines. The regional favorite. Peak fat content July through September. The charcoal grills on Avenida Marginal smoke continuously in summer. Order with boiled potato and pimento salad."
          />
          <EatCard
            name="Pastel de nata at the praça"
            range="€1.50"
            body="Portugal's national pastry — custard tart in a crisp pastry shell. **Pastelaria A Marquesa** on the main square bakes them fresh every morning and they are, objectively, very good. Eat standing at the counter with an espresso (bica)."
          />
          <EatCard
            name="Local wine"
            range="€3–6 a glass"
            body="The Silver Coast is in Portugal's central-west wine region. Look for Obidos DOC whites with seafood; Lourinhã DOC brandies after dinner — Lourinhã is one of only three wine regions in the world classified specifically for brandy production."
          />
        </div>
      </Section>

      {/* --- Itineraries --- */}
      <Section id="itineraries" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Itineraries"
          title="Three ways to use the bay"
        />

        <div className="grid gap-10 lg:grid-cols-3">
          <Itinerary
            days="Afternoon from Nazaré"
            body="Drive down from Nazaré at 11 a.m. Lunch at Retiro do Mar. Afternoon at the beach. Walk up to the Farol at 5 p.m. Drive back before dinner. The standard Silver Coast combination."
          />
          <Itinerary
            days="One overnight"
            body="Arrive afternoon, check into a beachfront hotel. Dinner at Tasca do Júlio. Morning swim in the bay before the day-trippers arrive (the bay is at its calmest 7–10 a.m.). Coffee at Pastelaria A Marquesa on the praça. Drive to Alcobaça for the monastery by midday."
          />
          <Itinerary
            days="Two nights, deeper"
            body="Day 1: São Martinho. Day 2: Alcobaça monastery in the morning, Óbidos for the afternoon. Day 3: return to São Martinho for a last beach day before driving back to Lisbon. Adds Cistercian history and medieval Portugal to a bay-only trip."
          />
        </div>

        <ClusterAside>
          If the calm-water aspect is the reason you're considering
          São Martinho — families with young children, first-time
          ocean swimmers — <ClusterLink to="family" /> has the full
          treatment.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="visiting" />

      <SpokeProvenance
        bundle={bundle}
        note="Rates reflect 2026. Hotel names are reference points, not endorsements. Short-term rental legal status changes frequently in Portugal; verify registration number on any booking. Bus schedules via Rede Expressos (rede-expressos.pt)."
      />
    </LegendaryShell>
  );
}

function StayCard({ name, character }: { name: string; character: string }) {
  return (
    <article className="rounded-sm border border-[#E7E2D4] bg-white p-6">
      <h3 className={`${H3} mb-3`}>{name}</h3>
      <p className={BODY_SM}>{character}</p>
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
