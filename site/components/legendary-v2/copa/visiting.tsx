/**
 * Copacabana → Visiting (travel spoke).
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

export default function CopaVisitingPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage =
    pickImage(meta, "panorama") ??
    pickImage(meta, "golden_hour") ??
    meta.images.hero;
  const sugarloaf = pickImage(meta, "sugarloaf_night");
  const caipirinha = pickImage(meta, "eat_caipirinha");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="visiting" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Visiting Copacabana"
        title="How to do a Rio trip that uses the beach without being trapped by it"
        kicker="Copa is the default Rio base for good reasons: it has more hotel stock than any other Rio neighborhood, it has the best metro connections to the rest of the city, and it is the beach you probably came to see. It is also the most touristed neighborhood in Rio and not the only place you should go. Both things at once."
        image={heroImage}
      />

      {/* --- Getting here --- */}
      <Section id="getting-here" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Getting Here"
          title="From GIG airport, from anywhere in Rio"
        />

        <div className="grid gap-8 md:grid-cols-2">
          <article>
            <h3 className={`${H3} mb-3`}>From Galeão (GIG) airport</h3>
            <p className={BODY_SM}>
              Rio's international airport is on Ilha do Governador,
              approximately 30 km from Copa. Taxi or Uber is the
              standard (R$80–150 depending on traffic, 45–75
              minutes). The <strong>Premium Express bus 2018</strong>{" "}
              runs direct from the airport to Copa via Ipanema, R$22,
              75–90 minutes. <strong>Don't take regular city buses
              with luggage</strong>; they are not luggage-friendly and
              Rio airport-adjacent crime (mostly opportunistic theft)
              is real.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>From Santos Dumont (SDU) domestic airport</h3>
            <p className={BODY_SM}>
              Rio's downtown domestic airport is 8 km from Copa, 20
              minutes by taxi (R$40–70). Faster and cheaper than
              Galeão but receives only domestic (mostly São Paulo
              shuttle) flights.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>Metro</h3>
            <p className={BODY_SM}>
              Rio's Metro Line 1 has three Copacabana stations:{" "}
              <strong>Cardeal Arcoverde</strong> (north end, Posto 2
              area), <strong>Siqueira Campos</strong> (middle, Posto 4
              area), <strong>Cantagalo</strong> (south end, near Posto
              6 and the Favela spoke's Plano Inclinado). The metro is
              efficient, safe, and the main way to reach Ipanema, the
              Central do Brasil for the Cristo Redentor train, and
              downtown Rio.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>On the ground</h3>
            <p className={BODY_SM}>
              Copa is walkable end-to-end in about 50 minutes on the
              Calçadão, faster on Avenida Atlântica's car-side
              sidewalk. Uber is cheap and reliable (R$8–15 within
              Copa). City buses run frequent routes along Atlântica.
              Taxis are metered (amarelinho); yellow-with-blue-stripe
              cabs are official.
            </p>
          </article>
        </div>
      </Section>

      {/* --- Stay --- */}
      <Section id="stay" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· Where to Stay"
          title="Five positions on the arc, five characters"
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <StayCard
            zone="The Copacabana Palace (heritage)"
            body="The 1923 Belmond property at Avenida Atlântica 1702. Old-world luxury; the only Rio hotel that does afternoon tea in a vaulted Beaux-Arts ballroom. **R$3,000–8,000 / night** depending on season. Worth the rate for a single anniversary night; not for a week."
          />
          <StayCard
            zone="Modern luxury"
            body="The **Fairmont Rio**, **Belmond Copacabana Palace**, **Sofitel Ipanema**. Upper-mid ($400–1,000 / night equivalent). Pool, ocean view, room service. The business-and-honeymoon tier."
          />
          <StayCard
            zone="Mid-range along the arc"
            body="**Windsor**, **Atlântico Hotel**, **Ipanema Plaza**, **Orla Hotel**. $150–350. The working Rio hotel stock. Book the ocean view; rooms without view are substantially cheaper and only 5 minutes further from the water."
          />
          <StayCard
            zone="Apartment rentals"
            body="Short-term rental apartments on Avenida Atlântica, Rua Barata Ribeiro (one block inland), and Rua Domingos Ferreira. $100–300 / night for 1–2 bedroom. Verify the building is in a safe block and that the listing has Brazilian short-term-rental registration."
          />
          <StayCard
            zone="Ipanema / Leblon"
            body="The beach next door — generally pricier, quieter, wealthier. The canonical bossa nova Rio. Five-minute bus or 30-minute walk to Copa. If you want to combine cultural Rio with quieter nights, Ipanema is the right base."
          />
          <StayCard
            zone="Leme (Posto 1)"
            body="The quiet north end of the beach — residential, shorter hotel strip, closer to Sugarloaf. Generally cheaper and considerably less-touristed than central Copa. Best for travelers who want to wake up on Copa without being in the center of it."
          />
        </div>
      </Section>

      {/* --- Eat --- */}
      <Section id="eat" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· What to Eat"
          title="Kiosk to churrascaria, along the spectrum"
        />

        <div className="grid gap-10 md:grid-cols-2">
          <EatCard
            name="Caipirinha at a kiosk"
            range="R$15–25"
            body="Cachaça, muddled lime, sugar, ice. The Brazilian national cocktail. Drink it where Brazilians drink it — sitting at a quiosque on the Calçadão, facing the ocean, at 4 p.m. **R$25 is the going rate**; anything over R$40 is tourist markup."
          />
          <EatCard
            name="Churrasco rodízio"
            range="R$150–350 per person"
            body="Brazilian barbecue. Continuous-service cuts at your table until you flip the card. **Churrascaria Palace** on Rua Rodolfo Dantas (1-block inland from Avenida Atlântica), Fogo de Chão, Porcão Rio's. Go hungry; pace yourself."
          />
          <EatCard
            name="Moqueca or peixe grelhado"
            range="R$80–160"
            body="Brazilian fish stew (moqueca) or whole grilled fish at a seafront restaurant. **Marius Degustare** has the Copa-standard seafood rodízio; **Siri** (Ipanema) and **Azumi** at Posto 6 are the quieter Copa-area alternatives. Portuguese-language menus are common but English is usually available."
          />
          <EatCard
            name="Boteco food"
            range="R$40–80"
            body="The Brazilian neighborhood-bar food: pastéis (fried pockets), coxinha (chicken croquette), salgadinhos, cold beer served in 600ml garrafas. **Pavão Azul** in Copa (Rua Hilário de Gouveia), Boteco Belmonte. The Brazilian working-class lunch and happy hour."
          />
        </div>

        {caipirinha && (
          <Figure
            image={caipirinha}
            size="wide"
            tier="B"
            caption="Caipirinha at a Copa kiosk. Cachaça, lime, sugar, ice. R$15–25. Drink it facing the ocean; this is what the beach is for."
            className="mt-10"
          />
        )}
      </Section>

      {/* --- The wider Rio --- */}
      <Section id="wider-rio" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Beyond Copa"
          title="The Rio trip Copa fits inside"
          kicker="Most first-time Rio visitors make the mistake of staying at Copa and not leaving the beach. The beach is good; the city around it is better. Allocate your days."
        />

        {sugarloaf && (
          <Figure
            image={sugarloaf}
            size="wide"
            tier="B"
            caption="Pão de Açúcar (Sugarloaf) at night — 396 meters of granite at the mouth of Guanabara Bay. The 1912 cable car to the summit is one of Rio's non-beach canonicals. 3 km from Copa; 45 minutes round-trip by bus."
            className="mb-10"
          />
        )}

        <div className="grid gap-8 md:grid-cols-2">
          <SideTripCard
            name="Cristo Redentor"
            time="Half-day, 4–5 hours total"
            body="The 38-meter statue on Corcovado, 710 meters above the beach. Reach via the cogwheel train from **Cosme Velho** (40-minute train ride, then short walk). **Go at sunrise** (first train 8 a.m. at peak) to beat the afternoon cloud and the tour-bus crowds."
          />
          <SideTripCard
            name="Pão de Açúcar (Sugarloaf)"
            time="3 hours"
            body="The cable-car ride from Praia Vermelha up to the summit via the intermediate Morro da Urca. 1912 original line; two linked cable cars. **Go at golden hour** for the light on the bay. R$150 adult round-trip."
          />
          <SideTripCard
            name="Santa Teresa & Lapa"
            time="Evening"
            body="The hillside artists' neighborhood (Santa Teresa) and the downtown samba district (Lapa). Take the **Bondinho tram** up Santa Teresa; walk the **Escadaria Selarón** down to Lapa; sample a samba club (Carioca da Gema, Rio Scenarium, Democráticus). Saturday or Sunday night peaks."
          />
          <SideTripCard
            name="Jardim Botânico"
            time="2–3 hours"
            body="The 1808 Royal Botanical Garden — 140 hectares of palms, bromeliads, orchids, and the canonical imperial-era avenue of royal palms. A break from the beach intensity. 15 minutes from Copa by Uber. Morning visit beats the afternoon heat."
          />
          <SideTripCard
            name="Museu do Amanhã (Museum of Tomorrow)"
            time="Half-day including the harbor"
            body="Santiago Calatrava's 2015 building at Rio's Porto Maravilha waterfront — a future-oriented science museum. Worth the trip for the architecture alone. Combine with the AquaRio aquarium (largest in South America) and the **MAR** museum. The revitalized harbor district is one of the best Rio days a non-beach day offers."
          />
          <SideTripCard
            name="A favela visit, done right"
            time="Half-day"
            body="Not by random tour operator. Go via the **Plano Inclinado** from General Osório metro up to the Mirante do Pavão-Pavãozinho viewpoint (free, 2-minute ride). Or book a community-led tour through **Favela Inc** or similar cooperatives. Full guidance in the <ClusterLink to='favela' /> spoke."
          />
        </div>
      </Section>

      {/* --- Itineraries --- */}
      <Section id="itineraries" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· Itineraries"
          title="Four ways to structure a Rio-with-Copa trip"
        />
        <div className="grid gap-10 md:grid-cols-2">
          <Itinerary
            days="Cruise port day (8 hours)"
            body="Transit from pier to Copa (45 min). Morning on the beach. Lunch at a kiosk. Afternoon at Sugarloaf or a Santa Teresa tram ride. Back to the ship by 4 p.m. Rushed; skip Cristo."
          />
          <Itinerary
            days="Three nights — Rio compact"
            body="Day 1: arrive, beach afternoon, kiosk sunset dinner. Day 2: Cristo at dawn, Jardim Botânico midmorning, Copa beach afternoon, Lapa samba night. Day 3: Sugarloaf, Ipanema/Leblon walk, last dinner at Marius. The minimum functional Rio trip."
          />
          <Itinerary
            days="Five nights — Rio deeper"
            body="The 3-night template + a Plano Inclinado / favela morning + a Museu do Amanhã harbor-district day + one full Copa beach day with no agenda. The right length for a first Rio visit."
          />
          <Itinerary
            days="Réveillon week"
            body="Arrive 28–29 December. Book accommodation four months ahead minimum. Day-by-day pacing matters: don't party four nights in a row before the 31st. Full NYE guidance in the <ClusterLink to='reveillon' /> spoke."
          />
        </div>

        <ClusterAside>
          If you're visiting at New Year's Eve, the full Réveillon
          guide — white clothing, barge fireworks, Yemanjá offerings,
          how to survive 3 million people on 4 km of sand — is in{" "}
          <ClusterLink to="reveillon" />.
        </ClusterAside>
        <ClusterAside>
          If the bossa nova era is why you came, the full musical-
          history treatment — specific venues, specific recordings,
          specific Rio addresses you can still visit — is in{" "}
          <ClusterLink to="bossa" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="visiting" />

      <SpokeProvenance
        bundle={bundle}
        note="Rates reflect 2026 Brazilian Real. Hotel and restaurant names are reference points. Metro fares and airport bus routes via MetroRio and Premium Auto Ônibus. Safety guidance reflects current Rio conditions; the South Zone (including all of Copa) is substantially safer than most Rio peripheral neighborhoods, but ordinary urban precautions apply — don't flash valuables at the beach, use Uber rather than hailing on-street at night."
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

function SideTripCard({
  name,
  time,
  body,
}: {
  name: string;
  time: string;
  body: string;
}) {
  return (
    <article className="rounded-sm border border-[#CBD5E1] bg-white p-7">
      <div className={`${EYEBROW} mb-2`}>{time}</div>
      <h3 className={`${H3} mb-3`}>{name}</h3>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}

function Itinerary({ days, body }: { days: string; body: string }) {
  return (
    <article className="rounded-sm border border-[#E2E8F0] bg-white p-7">
      <h3 className={`${H3} mb-4`}>{days}</h3>
      <p className={BODY_SM}>{body}</p>
    </article>
  );
}
