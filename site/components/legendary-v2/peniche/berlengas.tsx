/**
 * Peniche → The Berlengas (deep-dive spoke). Standalone page.
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

export default function PenicheBerlengasPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage =
    pickImage(meta, "berlengas") ?? meta.images.hero;

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="berlengas" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· The Berlengas"
        title="The UNESCO biosphere archipelago ten kilometers offshore"
        kicker="A 40-minute boat ride from Peniche harbor, a permit-limited daily cap on visitors, a 17th-century island fortress operating as a basic guesthouse, and some of the last breeding colonies of Atlantic seabirds on the Iberian coast."
        image={heroImage}
      />

      {/* --- The geology + ecology --- */}
      <Section id="what-it-is" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· What It Is"
          title="Precambrian granite, Atlantic endemics, 550 million years of isolation"
          kicker="The Berlengas are geologically unrelated to the Peniche peninsula. They are the exposed tops of an ancient granite ridge that has been an island throughout the Quaternary — which means their biota has evolved in relative isolation."
        />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6">
            <p className={BODY}>
              The archipelago is three small islands —{" "}
              <strong>Berlenga Grande</strong> (78 hectares, the only
              inhabitable one), <strong>Estelas</strong>, and{" "}
              <strong>Farilhões</strong> — plus associated rocks and
              shallow banks. Geologically they are{" "}
              <strong>Precambrian granite</strong>, roughly{" "}
              <strong>550 million years old</strong> — among the
              oldest exposed rock in Portugal and an entirely
              different lithology from the Jurassic limestone of the
              Peniche peninsula ten kilometers east. The islands
              were above sea level during the entire Pleistocene;
              they have never been connected to mainland Iberia in
              any evolutionarily meaningful timeframe.
            </p>
            <p className={BODY}>
              That isolation has produced{" "}
              <strong>endemic species</strong>. The Berlengas thrift
              (<em>Armeria berlengensis</em>) is a small flowering
              plant found nowhere else. The islands host one of the
              Atlantic's last significant{" "}
              <strong>Bulwer's petrel</strong> breeding colonies
              (~500 pairs; a pelagic seabird that spends most of its
              life at sea and comes ashore only to nest). Mainland
              Portugal's largest <strong>shag / European cormorant</strong>{" "}
              colony (~200 pairs) is here. The surrounding waters
              hold some of the healthiest subtidal macroalgal forests
              on the Portuguese coast and the clearest Atlantic
              visibility available for diving.
            </p>
            <p className={BODY}>
              Designated a <strong>Portuguese natural reserve in 1981</strong>,
              upgraded to a <strong>UNESCO Biosphere Reserve in 2011</strong>,
              the archipelago is under tight visitor management. Daily
              visitor caps during peak season protect the nesting
              colonies and the delicate dune vegetation; the permit
              system is the mechanism that keeps the islands in the
              state you came to see.
            </p>
          </div>

          <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
            <div className={`${EYEBROW} mb-5`}>· The Reserve</div>
            <dl className="space-y-5">
              <Fact label="Distance from Peniche" value="10 km" />
              <Fact label="Berlenga Grande area" value="78 ha" />
              <Fact label="Granite age" value="~550 Myr" />
              <Fact label="Reserve since" value="1981" />
              <Fact label="UNESCO Biosphere since" value="2011" />
              <Fact label="Bulwer's petrel pairs" value="~500" />
              <Fact label="Daily visitor cap (summer)" value="~400" />
              <Fact label="Boat crossing" value="~40 min" />
            </dl>
          </aside>
        </div>
      </Section>

      {/* --- Getting there --- */}
      <Section id="boat" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· How to Get There"
          title="The boat from Peniche harbor and the permit system"
          kicker="Access to Berlenga Grande is by boat from Peniche, with numerical limits enforced through advance-booking concessions. In July and August the daily cap is reached most days; in shoulder seasons, availability is usually walk-up."
        />

        <div className="space-y-6 max-w-3xl">
          <h3 className={H3}>The licensed operators</h3>
          <p className={BODY}>
            Several licensed boat operators run daily summer trips
            between Peniche harbor and Berlenga Grande. The canonical
            names:
          </p>
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>
              <strong>Viamar</strong> — the long-established
              passenger-ferry operator. €20–25 adult round trip.
              Larger boat, more stable in rough seas. Runs 3–5
              departures daily in peak summer.
            </li>
            <li>
              <strong>Berlenga Turismo</strong> — smaller, faster
              RIB-style boats. Shorter crossing (25–30 min vs 40+
              for the ferry), but rougher ride and wetter on windy
              days. €30–40 round trip.
            </li>
            <li>
              <strong>Cabo Avelar Pessoa</strong> — traditional
              fishing-vessel-style operator with longer, more
              scenic routes including coastal-cave tours around the
              island before landing. €30–45 depending on package.
            </li>
          </ul>

          <h3 className={`${H3} mt-6`}>Booking ahead</h3>
          <p className={BODY}>
            In <strong>July and August</strong>, the island's daily
            visitor cap (~400 visitors) is reached on most weekdays
            and essentially all weekends. Book{" "}
            <strong>2–4 weeks ahead</strong> through the operator
            websites. In <strong>May–June and September–October</strong>,
            walk-up bookings at the harbor ticket office the morning
            of are usually fine. The boat service runs{" "}
            <strong>May through September</strong>; there is no
            scheduled winter service.
          </p>

          <h3 className={`${H3} mt-6`}>The crossing</h3>
          <p className={BODY}>
            The Atlantic between Peniche and the Berlengas is an open-
            ocean channel with genuine wave exposure. On calm days
            the crossing is pleasant. On <strong>rough days
            (onshore wind ≥ 25 knots)</strong> operators may cancel;
            you get a full refund. On intermediate days, the ride is
            bumpy and seasickness is common. <strong>Take a
            Dramamine an hour before boarding</strong> if you are
            prone to motion sickness; the boats do not carry them.
            Don't plan a heavy breakfast.
          </p>
        </div>
      </Section>

      {/* --- On the island --- */}
      <Section id="on-the-island" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· On the Island"
          title="What to do with four hours (or one night) on Berlenga Grande"
        />

        <div className="space-y-6 max-w-3xl">
          <h3 className={H3}>The standard day visit</h3>
          <p className={BODY}>
            A typical day-visit arrival at 10 a.m. and return at 4 p.m.
            gives you <strong>roughly 5 hours on the island</strong>.
            The canonical sequence:
          </p>
          <ol className={`${BODY} list-decimal pl-6 space-y-3`}>
            <li>
              <strong>The Forte de São João Baptista</strong> — the
              17th-century Portuguese fortress on a small rocky
              outcrop connected to the main island by a stone
              causeway. Walk across, explore the ramparts, see the
              guesthouse interior if not fully occupied.
            </li>
            <li>
              <strong>The island walking loop</strong> — a marked
              roughly-2-hour circuit covering the major viewpoints,
              the lighthouse at the south end, the bird-cliff
              observation platforms, and the central valley. The
              trail is well-marked but not paved; wear grip-soled
              shoes.
            </li>
            <li>
              <strong>Lunch at the island café</strong> — the one
              restaurant near the dock. Limited menu (seafood, fresh
              catch, Portuguese salads); moderately priced for a
              captive-market restaurant. Reservations useful in
              July–August.
            </li>
            <li>
              <strong>A swim</strong> — the Carreiro do Mosteiro
              beach, a small cove with clear Atlantic water. Water
              temperature 16–19 °C in summer; colder than mainland
              beaches because the deeper surrounding water doesn't
              warm up.
            </li>
            <li>
              <strong>Return boat</strong> — catch it. The last
              return runs at 5 p.m. or 6 p.m. in peak season; miss
              it and you're sleeping in the fort whether you planned
              to or not.
            </li>
          </ol>

          <h3 className={`${H3} mt-6`}>Overnight in the fort</h3>
          <p className={BODY}>
            The <strong>Forte de São João Baptista guesthouse</strong>{" "}
            — operated as a basic-level hostel-style accommodation
            by a local concessionaire — offers some of the most
            unusual overnight-lodging you can book in Europe.{" "}
            <strong>Roughly 20 beds, shared rooms, minimal
            amenities, reservations open in January and fill within
            weeks for the July–August window.</strong> You sleep
            inside a 17th-century Portuguese fortress, the Atlantic
            on three sides, the lighthouse sweeping the island all
            night, the seabird colonies audible at dawn. Cost is
            modest (€25–45 per person per night) but the experience
            is logistically challenging — you bring all your food
            except breakfast, the bathrooms are basic, the
            electricity comes from island-scale solar and may be
            intermittent.
          </p>
          <p className={BODY}>
            Worth it if you are prepared. Not worth it if you are
            expecting hotel amenities.
          </p>

          <h3 className={`${H3} mt-6`}>Diving and kayaking</h3>
          <p className={BODY}>
            The shallow-water perimeter of Berlenga Grande has some
            of the <strong>clearest diving visibility on the
            Portuguese coast</strong> — 10–15 m on good days. Several
            licensed operators (Haliotis Dive Center, Acualand) run
            day-trips from Peniche harbor with boat transfer, two
            tank dives, and return. €80–110. Kayak rentals are
            available on the island for paddling the cave-and-arch
            system on the western cliffs; €15–25 per hour. These are
            the most interesting non-beach activities on the
            archipelago.
          </p>
        </div>
      </Section>

      {/* --- What not to do --- */}
      <Section id="rules" className={PAPER}>
        <SectionHeader
          eyebrow="· Reserve Rules"
          title="What the permit system expects of you"
          kicker="Breaking these rules is not theoretical — the Portuguese nature-reserve authority (ICNF) has wardens on the island during peak season, and fines are routinely issued."
        />

        <div className="space-y-6">
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>
              <strong>Stay on marked paths.</strong> The island's
              vegetation — including the endemic thrift — is
              fragile. Off-trail walking damages it.
            </li>
            <li>
              <strong>Do not approach seabird colonies.</strong> The
              observation platforms are placed at non-disturbing
              distances. Flushing a nesting petrel or shag is a
              federal wildlife offense.
            </li>
            <li>
              <strong>No drones.</strong> Banned for the nesting
              disturbance they cause.
            </li>
            <li>
              <strong>No collecting.</strong> Shells, plants, rocks,
              fossils — none of it leaves the island. The same
              principle that protects Hawaiian lava rocks applies
              here.
            </li>
            <li>
              <strong>Pack out what you pack in.</strong> Basic
              wilderness-use ethic. The island's waste-handling
              infrastructure cannot absorb day-tripper scale.
            </li>
            <li>
              <strong>Swimming is permitted only at Carreiro do
              Mosteiro.</strong> The rest of the island's coast is
              dangerous rocky shoreline; do not snorkel off the
              path.
            </li>
          </ul>
        </div>

        <ClusterAside>
          Main-page context — the Peniche peninsula, the Fortaleza
          history, the surf-tour inheritance that all of this sits
          alongside — is in <ClusterLink to="main" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="berlengas" />

      <SpokeProvenance
        bundle={bundle}
        note="Ecological data from ICNF (Instituto da Conservação da Natureza e das Florestas) and the UNESCO Biosphere Reserve documentation. Boat operator schedules and pricing from operator websites; verify for the current season. Fort guesthouse availability from the Câmara Municipal de Peniche; book through the licensed concessionaire when reservations open each January."
      />
    </LegendaryShell>
  );
}
