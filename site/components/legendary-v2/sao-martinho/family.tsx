/**
 * São Martinho do Porto → For Families (audience-guide spoke).
 *
 * Tier 2 spoke — targeted audience guide. The bay's calm-water identity
 * is specific enough that families deserve a dedicated page.
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

export default function SmpFamilyPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage = pickImage(meta, "beach_summer") ?? meta.images.hero;
  const boca = pickImage(meta, "coast_boca");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="family" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· For Families"
        title="The calm-water bay the coastline otherwise doesn't provide"
        kicker="Portuguese families have been bringing children to São Martinho's bay for a hundred and thirty years. The reason is geographic: the bay is the only stretch of the Portuguese west coast where the Atlantic stops behaving like the Atlantic."
        image={heroImage}
      />

      {/* --- Why this bay for children --- */}
      <Section id="why" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Why This Bay"
          title="The geography that makes this a child's beach"
          kicker="Most of Portugal's west coast is closed to young children for a reason — the Atlantic here is cold, rip-current-prone, and fast-changing. São Martinho is a geographic exception built into the rock."
        />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6">
            <p className={BODY}>
              Four features of the bay's geometry produce its
              calm-water identity:
            </p>
            <ul className={`${BODY} list-disc pl-6 space-y-3`}>
              <li>
                <strong>The Boca — the 200-meter-wide opening</strong> — is
                narrow enough that Atlantic swell is largely blocked.
                What does get through refracts around the headlands
                and loses most of its energy.
              </li>
              <li>
                <strong>The inside of the bay shelves gently</strong>.
                Wading depth extends 30–50 meters offshore in most
                places. A small child can walk out and still touch
                bottom at chin depth; the same is not true at open
                Atlantic beaches like Nazaré or Peniche.
              </li>
              <li>
                <strong>Water temperature runs 2–3 °C warmer</strong> than
                the open Atlantic because the bay is shallow and slow
                to flush. Summer highs of 20–21 °C are genuinely
                swimmable. Open Atlantic water at the same latitude is
                17–18 °C and feels much colder.
              </li>
              <li>
                <strong>Almost no surf</strong>. The bay has a small
                shorebreak on the inside curve but no meaningful wave
                activity. Children can play in knee-deep water without
                being knocked down every thirty seconds.
              </li>
            </ul>
            <p className={BODY}>
              The result: <strong>the bay is the default family beach
              for Portuguese families in a 200-kilometer radius</strong>.
              Lisbon families drive up for the day; Leiria and Caldas da
              Rainha families summer here. Foreign visitors are still a
              minority in São Martinho compared to Nazaré. The beach
              identity is still Portuguese-family-first.
            </p>
          </div>

          <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
            <div className={`${EYEBROW} mb-5`}>· Family-Beach Numbers</div>
            <dl className="space-y-5">
              <Fact label="Water temp (July–Aug)" value="19–21 °C" />
              <Fact label="Peak wave height (inside bay)" value="< 0.5 m" />
              <Fact label="Lifeguard season" value="Jun–Sep" />
              <Fact label="Wading distance" value="30–50 m" />
              <Fact label="Swimmable year" value="May–Oct" />
              <Fact label="UV index (summer noon)" value="8–10" />
              <Fact label="Open Atlantic next door" value="Not swimmable" />
            </dl>
          </aside>
        </div>

        {boca && (
          <Figure
            image={boca}
            size="wide"
            tier="B"
            caption="The Boca — the 200-meter opening to the Atlantic. Atlantic swell meets this narrow gap and mostly doesn't make it through. The calm-water interior is the consequence."
            className="mt-12"
          />
        )}
      </Section>

      {/* --- What to bring --- */}
      <Section id="bring" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· What to Bring"
          title="The practical kit for a São Martinho family day"
        />

        <div className="space-y-6 max-w-3xl">
          <h3 className={H3}>For the beach</h3>
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>
              <strong>Mineral sunscreen</strong>, reef-friendly. Portugal's
              summer UV is stronger than most Northern European and
              northern-U.S. visitors expect. Bring zinc or titanium
              dioxide; apply liberally to children, reapply every two
              hours.
            </li>
            <li>
              <strong>A sun tent or umbrella</strong>. Portuguese families
              typically set up striped traditional beach tents (<em>tendas</em>)
              that you can rent by the day from the concessions on
              Avenida Marginal. €10–15 per day. Bringing your own works
              too.
            </li>
            <li>
              <strong>Rash guard shirts for children</strong>. More
              effective than sunscreen alone for long beach days.
            </li>
            <li>
              <strong>Water shoes (optional)</strong>. The bay is sandy;
              water shoes are not strictly needed. Useful if children
              are sensitive to the occasional pebble in the shorebreak.
            </li>
            <li>
              <strong>A picnic lunch</strong>. Portuguese families
              traditionally eat on the beach — bread, cheese, presunto
              (cured ham), fresh fruit, grilled-sardine takeaway from
              the Avenida Marginal grills. Cheaper and better than
              restaurant food.
            </li>
          </ul>

          <h3 className={`${H3} mt-6`}>For the children</h3>
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>
              <strong>Swim flotation for ages 3–6</strong>. The bay is
              calm but it is still open water; arm bands or a flotation
              vest for younger children are a reasonable precaution.
            </li>
            <li>
              <strong>Sand toys</strong>. Available at kiosks on Avenida
              Marginal for a few euros; reasonable Portuguese-made
              buckets, shovels, moulds.
            </li>
            <li>
              <strong>A paddle-boat or kayak rental</strong> — the bay's
              calm water makes these safe and workable for children 6+
              with a parent. Rentals run €10–20 per hour from the
              concessions at the northern end of the beach.
            </li>
          </ul>
        </div>
      </Section>

      {/* --- Rainy days --- */}
      <Section id="rainy" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· If It Rains"
          title="Four options when the bay day is off"
          kicker="Portugal's Silver Coast gets roughly 100 mm of rain per month from November through February. If you're here in the shoulder seasons and a rainy day arrives, the region has good indoor-activity options within a half-hour drive."
        />

        <div className="grid gap-8 md:grid-cols-2">
          <IndoorCard
            name="Alcobaça Monastery"
            distance="12 km"
            body="The 12th-century UNESCO-listed Cistercian monastery that owned the São Martinho bay for six centuries. Children 8+ can follow a guided tour; younger children benefit from the scale (the nave is 106 meters long). **The tombs of Pedro and Inês** — the central tragedy of medieval Portuguese literature — face each other at the transept. €7.50 adult, free for children under 12."
          />
          <IndoorCard
            name="Batalha Monastery"
            distance="25 km"
            body="Manueline-Gothic monastery commemorating Portugal's 1385 victory over Castile. The Unfinished Chapels (Capelas Imperfeitas) are the most dramatic single architectural feature in Portugal, open to the sky, almost unchanged since 1533. UNESCO World Heritage. €7 adult."
          />
          <IndoorCard
            name="Óbidos walled town"
            distance="25 km"
            body="Medieval walled town. Walk the ramparts even in light rain — they are covered in places. **Ginjinha** (cherry liqueur) served in chocolate cups at every bar in town is, objectively, a rainy-afternoon Portuguese tradition. Quieter than the summer; more atmospheric in winter rain."
          />
          <IndoorCard
            name="Lourinhã Dinosaur Museum"
            distance="30 km south"
            body="The regional natural-history museum at the center of Portugal's Jurassic dinosaur-footprint country (including São Martinho's own outer-cliff footprints). Real fossil skeletons, active paleontological research programs, family-friendly exhibits. €6 adult."
          />
        </div>
      </Section>

      {/* --- Beyond the bay for teens --- */}
      <Section id="teens" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· For Older Children and Teens"
          title="When the calm bay stops being enough"
          kicker="The same calm water that makes São Martinho ideal for a five-year-old makes it uninteresting for a fourteen-year-old. Four nearby options extend the day when the bay is too mild."
        />

        <div className="space-y-6 max-w-3xl">
          <ul className={`${BODY} list-disc pl-6 space-y-4`}>
            <li>
              <strong>Walk up to the Farol (lighthouse)</strong>. The
              northern headland trail is 25 minutes uphill; the
              teenage child gets panoramic photographs from the top.
              Do it at sunset.
            </li>
            <li>
              <strong>Dinosaur footprints at low tide</strong>. The
              outer-cliff Jurassic trackways become visible when the
              tide recedes from the rock platform at the base of the
              northern headland. A local guide is recommended;
              alternatively, Lourinhã Museum (30 km south) runs
              periodic led walks. This is genuinely unusual for a
              family beach.
            </li>
            <li>
              <strong>Day trip to Nazaré for big-wave watching</strong>.
              If you're here October through February, the Nazaré
              cliff at Praia do Norte is 15 minutes north and shows,
              on a swell day, the largest surfable waves on Earth. A
              teenage child will remember this.{" "}
              <ClusterLink to="main" label="The Nazaré main page" />.
            </li>
            <li>
              <strong>Stand-up paddleboard rental</strong>. The bay's
              calm water makes SUP workable for 10+. Rentals on the
              north end of the beach, €15–25 per hour.
            </li>
            <li>
              <strong>Kayak the bay perimeter</strong>. Two-person
              kayaks rent from the same concessions. A teen + parent
              can paddle the full 2 km perimeter in an hour,
              including a stop at the Salir do Porto estuary for
              birdwatching.
            </li>
          </ul>
        </div>

        <ClusterAside>
          Trip-planning basics — getting here, where to stay, where to
          eat — are in <ClusterLink to="visiting" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="family" />

      <SpokeProvenance
        bundle={bundle}
        note="UV and water-temperature figures from IPMA. Lifeguard season and beach-safety guidance from the Instituto de Socorros a Náufragos (ISN). Local operator names and prices current as of 2026 but not exhaustively verified; check on arrival. Dinosaur-footprint access at São Martinho requires tide-sensitive timing and, ideally, a guide — the Lourinhã Museum can advise."
      />
    </LegendaryShell>
  );
}

function IndoorCard({
  name,
  distance,
  body,
}: {
  name: string;
  distance: string;
  body: string;
}) {
  return (
    <article className="rounded-sm border border-[#E7E2D4] bg-white p-7">
      <div className={`${EYEBROW} mb-2`}>{distance}</div>
      <h3 className={`${H3} mb-3`}>{name}</h3>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}
