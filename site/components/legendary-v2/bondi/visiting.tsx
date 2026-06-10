/**
 * Bondi → Visiting (travel spoke).
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

export default function BondiVisitingPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage =
    pickImage(meta, "coastal_walk") ??
    pickImage(meta, "bondi_early_morning") ??
    meta.images.hero;
  const icebergs = pickImage(meta, "icebergs_view");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="visiting" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Visiting Bondi"
        title="A Sydney bus ride to Australia's identity beach"
        kicker="Bondi is 25 minutes from Sydney Central Station on a single bus. You can do it in an afternoon, a day, or two nights. The beach rewards all three registers — but in different ways."
        image={heroImage}
      />

      {/* --- Getting here --- */}
      <Section id="getting-here" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Getting Here"
          title="From anywhere in Sydney"
        />
        <div className="grid gap-8 md:grid-cols-2">
          <article>
            <h3 className={`${H3} mb-3`}>From Sydney CBD</h3>
            <p className={BODY_SM}>
              The <strong>333 bus</strong> runs direct from Circular
              Quay via Bondi Junction to Bondi Beach — 45–60 minutes
              depending on traffic, tap an Opal card, $5–6 each way.
              Alternative: train to <strong>Bondi Junction</strong>{" "}
              station (any eastern-suburbs train from Central, ~15
              minutes) then the 333 or 380 bus down the hill (10
              minutes). Uber from the CBD is $30–50 depending on
              traffic.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>From Sydney Airport (SYD)</h3>
            <p className={BODY_SM}>
              Uber is $60–80, 30–40 minutes. No direct bus; the train
              via Central + 333 bus is cheaper but slower (1h 15m).
              Most visitors take a taxi or rideshare from the airport
              and switch to bus or walking thereafter.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>Parking</h3>
            <p className={BODY_SM}>
              <strong>Don't drive to Bondi.</strong> Parking is tight,
              metered, expensive ($7–10 per hour), and heavily
              enforced. Weekend summer parking on Campbell Parade and
              the adjacent streets is genuinely difficult. If you must
              drive, use the <strong>Bondi Beach Public Car Park</strong>{" "}
              under the Campbell Parade end of the beach.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>On foot</h3>
            <p className={BODY_SM}>
              The beach is 1 km end to end. The coastal walk adds 6 km
              south to Coogee. Bondi Junction (with its shops and the
              train station) is 1.5 km uphill. Comfortable shoes
              matter more than a lot of visitors expect.
            </p>
          </article>
        </div>
      </Section>

      {/* --- Stay --- */}
      <Section id="stay" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· Where to Stay"
          title="Four options, different registers"
        />
        <div className="grid gap-8 md:grid-cols-2">
          <StayCard
            zone="On Campbell Parade (direct seafront)"
            body="**QT Bondi**, **Adina Apartment Hotel**, **Bondi Beach House**. Mid-range to upper-mid ($250–500 AUD/night). Direct sea views; you walk out of the lobby onto the beach. The premium is real."
          />
          <StayCard
            zone="Bondi Junction (uphill)"
            body="**Meriton Suites**, **Travelodge**, the Crowne Plaza. Cheaper ($180–320). A 10-minute bus or 20-minute downhill walk to the beach; you gain a train station and full shopping. Best if you're doing multi-day Sydney with Bondi as one part."
          />
          <StayCard
            zone="Boutique / designer (North Bondi)"
            body="Smaller hotels and luxury rentals along the quieter north end. **The Collaroy** style — Airbnbs in 1930s Art Deco apartment blocks with headland views. $200–600 per night depending on size and season."
          />
          <StayCard
            zone="The wider eastern suburbs"
            body="If Bondi is too crowded or expensive, **Coogee** (at the south end of the coastal walk) has more affordable hotel stock with a similar beach character; **Paddington** / **Double Bay** offer residential elegance a short bus ride from both the CBD and Bondi."
          />
        </div>
      </Section>

      {/* --- Eat --- */}
      <Section id="eat" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· What to Eat"
          title="Icebergs, brunch, and the Australian café century"
          kicker="Sydney's restaurant and café culture is among the best in the world, and Bondi has a disproportionate share of it. The options below are the canonical ones; the full inventory is ten times this."
        />
        <div className="grid gap-10 md:grid-cols-2">
          <EatCard
            name="Icebergs Dining Room"
            range="$80–160 AUD"
            body="The Italian restaurant above the Icebergs pool. Pasta, whole grilled fish, antipasti, floor-to-ceiling glass directly over the ocean. **The Bondi splurge.** Book 30 days ahead."
          />
          <EatCard
            name="Sean's Panorama"
            range="$90–170 AUD"
            body="Seasonal Australian menu, local produce, 4-course prix fixe. Sean Moran has run the place since 1993; it is where Sydney food-writer generations have been trained. Bondi Road, a few blocks inland. Booking essential."
          />
          <EatCard
            name="Lox Stock & Barrel + Bill's"
            range="$25–45"
            body="The Bondi brunch canon. Avocado on sourdough, egg-shakshuka, acai bowls, long blacks. Both on Glenayr Avenue, both packed on weekend mornings. Go early (7–8 a.m.) or late (after 11) to skip the queue."
          />
          <EatCard
            name="A cheap lunch on Campbell Parade"
            range="$15–25"
            body="The Bondi takeaway scene — **Hurricane's Grill** for ribs, **Il Mulino** for pasta, **Bondi Pizza**, the fish-and-chips kiosks. Eaten on the promenade wall looking out at the beach. The low-brow Bondi is genuinely good; don't feel obligated to do only the fancy end."
          />
        </div>
      </Section>

      {/* --- The coastal walk --- */}
      <Section id="coastal-walk" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· The Coastal Walk"
          title="Six kilometers south to Coogee — Sydney's great urban walk"
        />
        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            The <strong>Bondi-to-Coogee coastal walk</strong> is a 6 km
            clifftop path that runs from the southern end of Bondi
            through <strong>Tamarama</strong>,{" "}
            <strong>Bronte</strong>, <strong>Clovelly</strong>,{" "}
            <strong>Gordons Bay</strong>, ending at{" "}
            <strong>Coogee</strong>. Allow 2–3 hours at walking pace.
            The path is paved, unshaded in significant stretches, and
            requires respectable walking shoes. Water and sunscreen
            are not optional in summer.
          </p>
          <p className={BODY}>
            The walk's canonical breaks: <strong>Bronte</strong> has a
            protected ocean pool and a café culture worth 45 minutes
            sitting at one of the open-air places above the beach.{" "}
            <strong>Clovelly</strong> is snorkelable on calm days —
            the narrow rock-bottomed bay is one of Sydney's few reef
            environments reachable without a boat.{" "}
            <strong>Gordons Bay</strong> has an even quieter rock pool
            and almost no visitor traffic. <strong>Coogee</strong>
            itself is a smaller, more residential beach with the{" "}
            <strong>McIver's Ladies' Baths</strong> at its southern
            end — a women-and-children-only ocean pool dating to 1876,
            one of the last of its kind.
          </p>
          <p className={BODY}>
            Return to Bondi is via the <strong>400 bus</strong> from
            Coogee (runs every 10 minutes, 20 minutes to Bondi
            Junction, change to 333 or walk down). The walk is done
            south-to-Coogee for preference because the Bondi-end
            coffee options are substantially better than Coogee's.
          </p>
        </div>
      </Section>

      {/* --- Icebergs destination --- */}
      <Section id="icebergs-visit" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· Icebergs as Destination"
          title="How to actually use the pool and the restaurant"
        />
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6 max-w-3xl">
            <p className={BODY}>
              The <strong>Icebergs pool</strong> is open to the public
              outside club hours for a modest admission ($7–8 AUD,
              children cheaper). Hours are typically{" "}
              <strong>6 a.m. to 7 p.m.</strong> in summer, earlier
              close in winter. The pool closes completely every{" "}
              <strong>Thursday</strong> for cleaning. Bring a towel
              and a swim cap if you have long hair; the club provides
              neither.
            </p>
            <p className={BODY}>
              The <strong>Icebergs Dining Room</strong> upstairs is a
              separate booking. Lunch sittings at 12:30 and 2:30; the
              dinner service is from 6:30 p.m. Price is genuine —
              $140–200 per person with wine. Worth the reservation
              effort for the setting alone; the food is also good.
            </p>
            <p className={BODY}>
              The <strong>Icebergs Club bar</strong> between the pool
              and the restaurant is cheaper, open to the public
              without reservation, and has the same view. Beers and
              basic bar food. If the Dining Room booking is
              impossible or the budget wrong, this is the alternative
              that gives you 80% of the experience for 20% of the
              cost.
            </p>
          </div>
          {icebergs && (
            <Figure
              image={icebergs}
              size="wide"
              tier="B"
              caption="The Icebergs pool from the restaurant lanai. The sequence that matters: swim in the pool, clean up, eat at the bar or Dining Room, watch the light change on the Pacific."
              className="lg:sticky lg:top-24"
            />
          )}
        </div>
      </Section>

      {/* --- Itineraries --- */}
      <Section id="itineraries" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· Itineraries"
          title="Three Bondi templates"
        />
        <div className="grid gap-10 md:grid-cols-3">
          <Itinerary
            days="Half-day from the CBD"
            body="10 a.m. bus to Bondi. Walk the beach end-to-end. Coffee at Speedos Café at North Bondi. Icebergs pool swim + lunch at the bar. 3 p.m. bus back. The minimum correct Bondi day."
          />
          <Itinerary
            days="Full day including the coastal walk"
            body="9 a.m. arrive. Morning swim at Central Bondi. 11 a.m. start the coastal walk south. Lunch at Bronte (Three Blue Ducks). Continue to Coogee. 4 p.m. bus back to Bondi. Sunset at Icebergs. Dinner at Sean's Panorama. ~12 hours on foot."
          />
          <Itinerary
            days="One night, weekend"
            body="Day 1 afternoon: arrive, swim, cocktail at Icebergs Club. Dinner Sean's. Day 2: dawn walk on the coastal path (Bondi to Bronte return, 90 minutes), breakfast at Bill's, Icebergs pool swim, lunch, last swim, leave by 4 p.m. The right format for a Sydney weekender."
          />
        </div>

        <ClusterAside>
          The surf-lifesaving side — what the red-and-yellow caps
          actually do, how Bondi Rescue works as television AND
          training, the full Black Sunday 1938 account — is in{" "}
          <ClusterLink to="lifesaving" />.
        </ClusterAside>
        <ClusterAside>
          How to visit Gadigal country respectfully — the rock
          engravings, the Uluru Statement context, and acknowledging
          unceded land — is in <ClusterLink to="gadigal" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="visiting" />

      <SpokeProvenance
        bundle={bundle}
        note="Rates reflect 2026 AUD. Hotel and restaurant names are reference points. Transport / Opal card via Transport for NSW (transportnsw.info). Icebergs pool hours via icebergs.com.au; verify before visiting as club-member-only hours shift seasonally."
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
    <article className="rounded-sm border border-[#E7E2D4] bg-white p-7">
      <h3 className={`${H3} mb-4`}>{days}</h3>
      <p className={BODY_SM}>{body}</p>
    </article>
  );
}
