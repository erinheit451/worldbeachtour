/**
 * Pipeline → The North Shore (visiting spoke).
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

export default function PipelineNorthShorePage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage =
    pickImage(meta, "sunset_beach") ??
    pickImage(meta, "matsumoto") ??
    meta.images.hero;
  const matsumoto = pickImage(meta, "matsumoto");
  const sunsetBeach = pickImage(meta, "sunset_beach");
  const giovannis = pickImage(meta, "giovannis_shrimp");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="north-shore" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· The North Shore"
        title="The 7-Mile Miracle as a day-trip from Waikīkī"
        kicker="From the south-facing Waikīkī learn-to-surf beach, a one-hour drive north crosses the island to the 7-Mile Miracle — a stretch of Oʻahu's north-facing coast that holds six of the world's most famous surf breaks. This spoke covers how to actually do the drive, what to see, and what to eat along the way."
        image={heroImage}
      />

      {/* --- Getting there --- */}
      <Section id="getting-there" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Getting There"
          title="From Waikīkī to Haleʻiwa in one hour"
        />

        <div className="grid gap-8 md:grid-cols-2">
          <article>
            <h3 className={`${H3} mb-3`}>The drive</h3>
            <p className={BODY_SM}>
              From Waikīkī, take the <strong>H-1 West to H-2 North to
              Kamehameha Highway (Route 83)</strong>. 58 km, 60–75
              minutes in normal traffic, longer on weekends and
              holiday Tuesdays. The route is paved, signed, and
              uneventful. Rental car is essential; there is no
              direct bus from Waikīkī.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>Timing</h3>
            <p className={BODY_SM}>
              <strong>Leave Waikīkī by 8 a.m.</strong> for a full-day
              circuit. Arrival at Haleʻiwa by 9:15 puts you at
              Pipeline or Sunset for the prime late-morning surf
              session, with enough daylight for a Waimea swim in
              summer, a Laniākea turtle stop, and return to Waikīkī
              by 6–7 p.m.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>What season</h3>
            <p className={BODY_SM}>
              The North Shore surf season runs{" "}
              <strong>November through February</strong>. If you want
              to see the waves, go in winter. Summer (May–September)
              the North Shore is a quiet family-friendly destination
              with flat surf and swimmable water — a completely
              different experience worth seeing on its own terms.
            </p>
          </article>
          <article>
            <h3 className={`${H3} mb-3`}>Parking</h3>
            <p className={BODY_SM}>
              Parking at Pipeline (Ehukai Beach Park) is free but
              fills by 10 a.m. on contest days. Sunset Beach has a
              larger parking area. Laniākea has only roadside
              parking — be careful crossing Kamehameha Highway.
              Haleʻiwa has plenty of parking at Matsumoto's and the
              town center.
            </p>
          </article>
        </div>
      </Section>

      {/* --- The circuit --- */}
      <Section id="circuit" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· The Circuit"
          title="Six stops, west to east, in order"
          kicker="The canonical North Shore day-trip moves west to east along Kamehameha Highway, starting at Haleʻiwa and ending at Turtle Bay. Each stop is 5–15 minutes apart by car; the full circuit fills a day."
        />

        <div className="space-y-8 max-w-3xl">
          <StopCard
            n="1"
            name="Haleʻiwa"
            time="45 min"
            body="The historic North Shore town. Start here. **Matsumoto Shave Ice** (opened 1951, canonical Hawaiian shave ice — rainbow syrups over azuki beans with condensed milk) is the first stop most days. **Ted's Bakery** (the chocolate haupia pie). Haleʻiwa Farmers Market on Thursdays. Give the town 45 minutes to an hour before heading east."
          />
          <StopCard
            n="2"
            name="Laniākea (Turtle Beach)"
            time="20 min"
            body="A few kilometers east of Haleʻiwa. Hawaiian green sea turtles (honu) haul out on this beach daily. **Keep 10 meters' distance** — federal protection (they're threatened species) and municipal signs enforce it. Short stop: walk the 100-meter beach, see the turtles if they're there, continue."
          />
          <StopCard
            n="3"
            name="Waimea Bay"
            time="60–90 min"
            body="The big-wave companion break. Summer this is a beautiful family-swimmable bay with a 6-meter cliff-jumping rock (traditional since Hawaiian antiquity). Winter this is the Eddie Aikau Invitational venue, the home of Hawaiian paddle-in big-wave surfing. Full treatment in <ClusterLink to='the-eddie' />. Allow an hour plus a swim in summer."
          />
          <StopCard
            n="4"
            name="Pipeline / Ehukai Beach Park"
            time="90 min–2 hr"
            body="The reason you came. If it's winter and the waves are firing, you could spend the whole day here. Ehukai Beach Park has parking, restrooms, showers, lifeguards. Watch from the beach; don't swim during surf. December brings the Pipe Masters and the contest crowd."
          />
          <StopCard
            n="5"
            name="Sunset Beach"
            time="60 min"
            body="Two miles east of Pipeline. Different wave — larger, open-faced, not a barrel. Sunset is considered one of the hardest waves in the world to paddle out through. The Vans World Cup of Surfing is held here annually. The beach is broad and often less crowded than Pipeline; a good swimming alternative in summer."
          />
          <StopCard
            n="6"
            name="Turtle Bay Resort"
            time="Optional 90 min"
            body="The eastern anchor of the North Shore. The only major hotel on the strip. Two swimmable beaches on the resort property (public access). **Lei Lei's Bar & Grill** at the resort is the canonical North Shore dinner stop. If you're making the North Shore a two-day trip, Turtle Bay is where you stay."
          />
        </div>

        {sunsetBeach && (
          <Figure
            image={sunsetBeach}
            size="wide"
            tier="B"
            caption="Sunset Beach — two miles east of Pipeline. Broader beach, different wave (open-face rather than barrel), site of the Vans World Cup of Surfing. Often less crowded than Pipeline and a better swimming alternative in summer."
            className="mt-10"
          />
        )}
      </Section>

      {/* --- What to eat --- */}
      <Section id="eat" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· What to Eat"
          title="The canonical North Shore food stops"
        />

        {matsumoto && (
          <Figure
            image={matsumoto}
            size="wide"
            tier="B"
            caption="Matsumoto Shave Ice in Haleʻiwa — the Matsumoto family has operated the shop at this Kamehameha Highway location since 1951. Rainbow shave ice (strawberry, lemon, pineapple) over azuki beans and vanilla ice cream with condensed milk. The canonical North Shore food stop."
            className="mb-10"
          />
        )}

        <div className="grid gap-10 md:grid-cols-2">
          <EatCard
            name="Matsumoto Shave Ice"
            where="Haleʻiwa"
            body="Since 1951. Rainbow shave ice (strawberry, lemon, pineapple) over azuki beans with condensed milk and vanilla ice cream. **The canonical Hawaiian shave ice.** Queue can run 30 minutes in summer peak. $5–9. Cash preferred."
          />
          <EatCard
            name="Ted's Bakery"
            where="Sunset Beach area"
            body="A half-mile east of Sunset. **Chocolate haupia pie** (coconut custard over chocolate cream in a shortbread crust) is the reason to stop. Plate-lunch options (kalua pork, teriyaki chicken) for actual meals. $5–18."
          />
          <EatCard
            name="Giovanni's Shrimp Truck"
            where="Kahuku (east of Turtle Bay)"
            body="The original North Shore shrimp truck. Garlic shrimp plate (or spicy version) with white rice and macaroni salad. $15. Cash only. 15-minute queue common. There are now imitators — go to the original with the graffiti-covered white truck."
          />
          <EatCard
            name="Haleʻiwa Farmers Market"
            where="Haleʻiwa · Thursdays 2–6 p.m."
            body="Local produce, Hawaiian honey, small-batch hot sauces, poke from the market stand. The farmers-market day is worth planning the North Shore day around if it falls during your visit."
          />
          <EatCard
            name="Kahuku Superette"
            where="Kahuku"
            body="A small grocery store whose deli counter makes **some of the best poke on Oʻahu** — garlic shoyu ʻahi, limu shoyu, spicy. $14–18 a pound. Eat on the picnic table outside."
          />
          <EatCard
            name="Lei Lei's Bar & Grill"
            where="Turtle Bay Resort"
            body="Sunset-view dinner at Turtle Bay. Moderately upmarket — $30–50 entrees — but the sunset and the resort's ocean-facing golf course are the atmosphere you're paying for. The canonical North Shore dinner end to a day trip."
          />
        </div>

        {giovannis && (
          <Figure
            image={giovannis}
            size="wide"
            tier="B"
            caption="Spicy garlic shrimp from Giovanni's Shrimp Truck at Kahuku. The original North Shore shrimp truck plate — garlic shrimp, white rice, macaroni salad. $15, cash only. Eaten at a picnic table next to the truck."
            className="mt-10"
          />
        )}
      </Section>

      {/* --- Itineraries --- */}
      <Section id="itineraries" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· Itineraries"
          title="Three ways to do the North Shore"
        />
        <div className="grid gap-10 lg:grid-cols-3">
          <Itinerary
            days="Day trip from Waikīkī (12 hours)"
            body="Leave Waikīkī 8 a.m. Matsumoto's 9:30. Laniākea 10:15. Waimea swim 11. Pipeline / Ehukai midday through 2 p.m. Sunset Beach 3 p.m. Ted's Bakery 4 p.m. Giovanni's shrimp 5:30. Turtle Bay sunset at Lei Lei's. Back to Waikīkī by 9 p.m. **The canonical North Shore day.**"
          />
          <Itinerary
            days="Overnight at Turtle Bay"
            body="Drive up in the morning. North Shore day (as above) plus a dinner and night at Turtle Bay. Morning 2 (early): Waimea Valley hike, Pupukea Heiau (the ancient Hawaiian temple above Waimea), coastal path to the Ehukai Pillbox hike. Lunch in Haleʻiwa, drive back by mid-afternoon."
          />
          <Itinerary
            days="Pipe Masters contest week"
            body="December 8–28 waiting period. Most non-surf-community visitors are too overwhelmed by the scale and should choose a non-contest date instead. If you do go during Pipe Masters: **arrive by 8 a.m. to get parking**, bring water and sunscreen for a long day, be prepared for 5,000+ spectators on the sand. Watch the finals day if you can get the timing right."
          />
        </div>

        <ClusterAside>
          The Eddie Aikau Invitational at Waimea — a separate
          big-wave event that only runs on days with 20-foot faces,
          which means rarely — has its own spoke:{" "}
          <ClusterLink to="the-eddie" />.
        </ClusterAside>
        <ClusterAside>
          If the surfing itself — wave mechanics, Pipe Masters
          format, reef geometry — is what you came for, that's in{" "}
          <ClusterLink to="surfing" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="north-shore" />

      <SpokeProvenance
        bundle={bundle}
        note="Rates reflect 2026 USD. Restaurant names are reference points. Pipe Masters waiting period dates vary year-to-year; verify at worldsurfleague.com. Sea turtle viewing distances follow NOAA guidelines (keep 10 meters minimum)."
      />
    </LegendaryShell>
  );
}

function StopCard({
  n,
  name,
  time,
  body,
}: {
  n: string;
  name: string;
  time: string;
  body: string;
}) {
  return (
    <article className="border-l-2 border-[color:var(--beach-primary,#0B3D5C)] pl-6">
      <div className={`${EYEBROW} mb-2`}>
        {n} · {time}
      </div>
      <h3 className={`${H3} mb-2`}>{name}</h3>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}

function EatCard({
  name,
  where,
  body,
}: {
  name: string;
  where: string;
  body: string;
}) {
  return (
    <article>
      <div className="flex items-baseline gap-3 mb-3 flex-wrap">
        <h3 className={H3}>{name}</h3>
        <span className={EYEBROW}>{where}</span>
      </div>
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
