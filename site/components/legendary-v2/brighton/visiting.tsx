/**
 * Brighton → Visiting (travel spoke).
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

export default function BrightonVisitingPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage =
    pickImage(meta, "the_lanes") ?? pickImage(meta, "palace_pier") ?? meta.images.hero;
  const grand = pickImage(meta, "grand_hotel");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="visiting" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Visiting Brighton"
        title="The London day trip that built English seaside"
        kicker="Brighton is a city. Not a resort, not a village — a functioning 280,000-person city with a university, a Premier League football club, and the UK's largest Pride, that happens to have a 6 km seafront attached. Come here as you would come to any city, not as you would come to a beach."
        image={heroImage}
      />

      {/* --- Quick decisions --- */}
      <Section id="quick" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· Two-Minute Answers"
          title="When, where, how long"
        />
        <div className="grid gap-8 md:grid-cols-3">
          <article>
            <div className={`${EYEBROW} mb-2`}>When</div>
            <h3 className={`${H3} mb-3`}>
              Late May or September for the right weather
            </h3>
            <p className={BODY_SM}>
              Brighton's summer peak is mid-July through August — the
              Pride weekend (first weekend of August) is the absolute
              busiest. Late May and September give you working summer
              light and temperatures without the hotel premium. Winter
              is atmospheric and empty; come for the Regency architecture
              and long walks. Avoid New Year's Day; half the town is
              hungover.
            </p>
          </article>
          <article>
            <div className={`${EYEBROW} mb-2`}>Where</div>
            <h3 className={`${H3} mb-3`}>
              The Lanes for atmosphere, Kemptown for character
            </h3>
            <p className={BODY_SM}>
              The Lanes and North Laine neighborhoods — the medieval
              town core just inland from the seafront — are where
              you want to walk, eat, and shop. The seafront itself is
              for set-piece visits (Palace Pier, i360, the West Pier
              ruin) not for hanging out. Kemptown, a mile east of the
              Palace Pier, is where Brighton genuinely lives.
            </p>
          </article>
          <article>
            <div className={`${EYEBROW} mb-2`}>How long</div>
            <h3 className={`${H3} mb-3`}>
              Two nights as the default, one day works
            </h3>
            <p className={BODY_SM}>
              A London day-trip (~9 a.m. arrival, 6 p.m. departure)
              covers the seafront + Pavilion + one meal. Two nights
              gets you Kemptown, the Lanes, one decent restaurant, and
              either a Lewes day trip or a Seven Sisters walk. Three
              nights is correct if you want to attend something —
              Pride weekend, the Dome, Brighton Festival.
            </p>
          </article>
        </div>
      </Section>

      {/* --- Getting here --- */}
      <Section id="getting-here" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Getting Here"
          title="The Brighton Line, and why everyone uses it"
          kicker="Brighton was connected to London by railway in 1841 and has been accessible in under an hour ever since. The train is how 90% of London-based visitors arrive. Almost nobody drives."
        />

        <div className="grid gap-8 md:grid-cols-2">
          <article>
            <h3 className={`${H3} mb-3`}>From London</h3>
            <p className={BODY_SM}>
              <strong>Brighton Line trains from London Victoria</strong>
              run every 15 minutes, 50–70 minutes journey, £25–40 off-peak
              return with advance booking. The station at Brighton is a
              10-minute walk downhill to the seafront — there is
              essentially no reason to take a taxi. London Bridge and
              Blackfriars also have direct services (Thameslink) if you're
              arriving from north London or coming from Luton airport.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>From airports</h3>
            <p className={BODY_SM}>
              <strong>Gatwick (LGW)</strong> has direct trains to Brighton
              — 30 minutes, £10–15. This is by far the easiest Brighton
              airport. <strong>Heathrow (LHR)</strong> is 2 hours via
              the National Express coach directly to Brighton, or via
              London and train (longer but more flexible).{" "}
              <strong>London Luton</strong> connects via Thameslink
              (1h 50m, no change).
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>By car</h3>
            <p className={BODY_SM}>
              The M23/A23 from London is 90 km, 90–110 minutes in typical
              traffic, much worse on Friday afternoons. Brighton parking
              is notoriously expensive and tight; <strong>do not drive</strong>{" "}
              unless you have a specific reason. If you do, use the NCP
              Lanes or Churchill Square car parks (£25–35/day); don't
              rely on street parking in central Brighton.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>On the ground</h3>
            <p className={BODY_SM}>
              Central Brighton is walkable — from the station to the
              Palace Pier is 15 minutes downhill. The seafront runs six
              kilometers; walk it or use the Volks Electric Railway (1883,
              running from the Aquarium to Black Rock, £3 each way). The
              Brighton & Hove bus network is reliable; tap your contactless
              card, don't buy tickets. Uber works; black cabs are around.
            </p>
          </article>
        </div>
      </Section>

      {/* --- Where to stay --- */}
      <Section id="stay" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· Where to Stay"
          title="Four neighborhoods, four characters"
        />
        <div className="grid gap-8 md:grid-cols-2">
          <StayCard
            zone="The Lanes / North Laine"
            body="The medieval core. Narrow streets, boutique hotels (Artist Residence, The Grand, myhotel), good restaurants, walkable to everything. £150–350 per night. The default for first-time visitors who want to feel in-the-middle-of-it without seafront traffic noise."
          />
          <StayCard
            zone="Seafront / Kings Road"
            body="Regency stucco terraces facing the Channel. **The Grand Hotel** (site of the 1984 IRA bombing, rebuilt), the Royal Albion, the Queens Hotel. £180–400 per night. Sea-view premium is real; rooms without view are 25% cheaper and only marginally further from the water."
          />
          <StayCard
            zone="Kemptown"
            body="The gay village, a mile east of the Palace Pier. Regency terraces, steeper streets, the long-running LGBTQ+ hospitality scene. Smaller hotels and B&Bs (£100–250). Where you stay if Brighton's queer culture is the reason you came; also where many non-queer visitors stay because it's quieter, more residential, and more authentically Brighton than the seafront."
          />
          <StayCard
            zone="Hove"
            body="West of the main Brighton seafront. More residential, wider pavements, fewer pubs, a more leisured demographic. The Hove Esplanade has its own quieter beach and the beach-hut stretch is the postcard image most English tourism posters choose. £120–300 per night. Good for families; a ten-minute walk or three-minute bus ride into Brighton proper."
          />
        </div>
      </Section>

      {/* --- Eat --- */}
      <Section id="eat" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· What to Eat"
          title="Fish and chips, Regency dining, and the absurd breadth of Brighton's restaurants"
          kicker="Brighton has roughly 500 restaurants for a population of 280,000 — one of the highest restaurant-per-capita ratios in the UK. The range is comical: from £4 takeaway fish-and-chips on the Palace Pier to £120-tasting-menu-plus-wine in converted warehouses in Hove."
        />

        <div className="grid gap-10 md:grid-cols-2">
          <EatCard
            name="Palace Pier fish and chips"
            range="£10–14"
            body="Cod or haddock, thick-cut chips, salt, malt vinegar, mushy peas. Eaten standing on the pier while herring gulls try to steal them. **The canonical Brighton meal.** Not cheap, not remotely health food, absolutely correct."
          />
          <EatCard
            name="English's of Brighton"
            range="£40–80"
            body="Since 1945, in The Lanes. Dover sole, grilled sea bass, the oyster platter. White tablecloths, understated, the kind of restaurant where nothing visible has changed in forty years and everything on the plate is extremely good. The Brighton splurge."
          />
          <EatCard
            name="Bills / Middle Farm / the Laine cafés"
            range="£15–25"
            body="The mid-range Brighton brunch-and-lunch scene — Bills (founded at Lewes, expanded), Terre à Terre (vegetarian, the UK's best), Food for Friends, the North Laine cafés. Brighton's restaurant density is partly this layer."
          />
          <EatCard
            name="A pint at a Kemptown pub"
            range="£5–8 a pint"
            body="The Marlborough, The Queen's Arms, Charles Street Tap, The Stag — the long-running Kemptown LGBTQ+ pubs. Local ale, good food, a bench on the pavement. **The best reading of Brighton's social history happens at the Marlborough after 8 p.m.**"
          />
        </div>
      </Section>

      {/* --- The three set-piece visits --- */}
      <Section id="setpieces" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Three Set-Piece Visits"
          title="The Pavilion, the Pier, the Grand"
          kicker="Three specific buildings a visitor to Brighton for the first time should not skip. Each anchors a different Brighton story."
        />

        <div className="space-y-8 max-w-3xl">
          <SetpieceItem
            name="The Royal Pavilion"
            body="£18, 1.5 hours. The Indo-Islamic Mughal fantasy palace at the heart of the tourist town. Go in the morning; the interior is genuinely astonishing and it pays to have time to sit in the Banqueting Room with the chandelier dragon. The audio guide is useful. The full deep-dive treatment is in **the Pavilion spoke**."
          />
          <SetpieceItem
            name="The Palace Pier"
            body="Free entry, pay-as-you-go for rides. 45 minutes to 2 hours depending on how committed you are to the fairground. Walk to the end, come back with fish-and-chips, photograph the West Pier ruin from the Palace Pier's west side — the two-piers frame is the defining Brighton image."
          />
          <SetpieceItem
            name="The Grand Hotel"
            body="On Kings Road, directly on the seafront. The site of the 1984 IRA bombing; rebuilt and reopened in 1986. Walk past, stand on the pavement, read the small memorial plaque near the entrance. If you have time for afternoon tea at the Grand's conservatory restaurant, £35, the setting is the closest thing Brighton still has to its Regency-era leisured-class register."
          />
        </div>

        {grand && (
          <Figure
            image={grand}
            size="wide"
            tier="B"
            caption="The Grand Hotel on Kings Road. Rebuilt after the 1984 IRA bombing."
            className="mt-10"
          />
        )}
      </Section>

      {/* --- Itineraries --- */}
      <Section id="itineraries" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· Itineraries"
          title="Four ways to use the time"
        />
        <div className="grid gap-10 lg:grid-cols-2">
          <Itinerary
            days="London day trip (9 a.m. to 6 p.m.)"
            body="9 a.m. Victoria → arrive 10:15. Walk down to the seafront. Palace Pier until lunch. Fish-and-chips on the pier. Afternoon at the Pavilion (booking ahead saves the queue). 4 p.m. walk the Lanes. 5:30 train back to London."
          />
          <Itinerary
            days="Two nights, default"
            body="Day 1 afternoon: arrive, seafront walk to the West Pier ruin, dinner in The Lanes. Day 2: Pavilion morning, Kemptown afternoon, dinner at The Marlborough. Day 3: Brighton Museum or Lewes day trip, midday train back. Covers the set pieces at a human pace."
          />
          <Itinerary
            days="Pride weekend (first August weekend)"
            body="Book six months ahead. Parade Saturday morning from Kemptown to Preston Park (1 mile route, huge crowds — watch from Old Steine Gardens for the best view). Preston Park Pride festival through Saturday evening. Sunday recovery. Budget the weekend for Pride; do Pavilion another time."
          />
          <Itinerary
            days="Three nights, winter"
            body="Counter-intuitive but the right move for a certain kind of traveler. Empty seafront, atmospheric Regency architecture in winter light, long walks along the undercliff path toward Saltdean. Dinner at Terre à Terre. Seven Sisters walk on a clear day. Kemptown pubs at full local character without summer crowds."
          />
        </div>

        <ClusterAside>
          The Pavilion's full architectural treatment — interiors, Nash's
          design choices, the kitchen-as-theatre — is in{" "}
          <ClusterLink to="pavilion" />.
        </ClusterAside>
        <ClusterAside>
          Kemptown, Duke's Mound, the Pride weekend, and Brighton's queer
          history in depth are in <ClusterLink to="queer" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="visiting" />

      <SpokeProvenance
        bundle={bundle}
        note="Rates reflect 2026. Hotel and restaurant names are reference points. Train fares via Southern / Thameslink; verify at nationalrail.co.uk. Parking guidance reflects current Brighton & Hove City Council practice; verify before arrival as zones change."
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

function SetpieceItem({ name, body }: { name: string; body: string }) {
  return (
    <article className="border-l-2 border-[color:var(--beach-primary,#3A4E5C)] pl-6">
      <h3 className={`${H3} mb-2`}>{name}</h3>
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
