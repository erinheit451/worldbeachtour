/**
 * Nazaré → The Sanctuary (Pilgrimage spoke). Standalone page.
 *
 * The third audience that actually earns a Nazaré spoke: the 900-year
 * Marian tradition centered on the Sítio clifftop. The Santuário predates
 * the modern surf era by 829 years and still draws more pilgrims on one
 * September day than the WSL draws in a full season.
 *
 * This is also the thematic counterweight to Surfing — the "village is
 * still the village" pole of the main page's thesis.
 */

import type { LegendaryPageBundle } from "../types";
import LegendaryShell from "../shell";
import Figure from "../primitives/figure";
import {
  BODY,
  BODY_SM,
  ClusterAside,
  ClusterLink,
  ClusterRail,
  CREAM,
  EYEBROW,
  Fact,
  H3,
  PAPER,
  Section,
  SectionHeader,
  SpokeCrossNav,
  SpokeHero,
  SpokeProvenance,
  pickImage,
} from "./shared";

export default function NazarePilgrimagePage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;

  const heroImage =
    pickImage(meta, "santuario") ??
    pickImage(meta, "sitio_town") ??
    meta.images.hero;

  const sitio = pickImage(meta, "sitio_town");
  const santuario = pickImage(meta, "santuario");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="sanctuary" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· The Sanctuary"
        title="The older story on the same clifftop"
        kicker="Eight hundred and twenty-nine years before Garrett McNamara rode the 2011 wave, a nobleman's horse stopped at the edge of this cliff. The chapel built on the spot is still here. The pilgrimage is still 100,000 people a year."
        image={heroImage}
      />

      {/* --- The Lenda --- */}
      <Section id="lenda" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· The Legend — 1182"
          title="The horse that stopped at the edge"
          kicker="Every Portuguese schoolchild learns this story. It is the founding event of the town of Nazaré and the reason the clifftop of Sítio is a sacred site."
        />

        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] items-start">
          <div className="space-y-6">
            <p className={BODY}>
              The <strong>Lenda da Nazaré</strong> is told in every
              Portuguese primary-school textbook, in the stained glass of
              the Santuário, and in the bronze relief carved into the wall
              of the small memorial chapel that stands on the exact spot
              where the events took place. In outline:
            </p>
            <p className={BODY}>
              On a morning in September 1182,{" "}
              <strong>Dom Fuas Roupinho</strong> — the Portuguese
              nobleman who served as Alcaide-mor (military governor) of
              the nearby castle at Porto de Mós, and a member of the Order
              of the Knights Templar under Afonso Henriques, Portugal's
              first king — was hunting deer on the heath above the
              Sítio cliff. A heavy Atlantic fog rolled in. Following a
              deer into the mist, Dom Fuas's horse galloped at full speed
              toward what he did not know was the cliff edge.
            </p>
            <p className={BODY}>
              At the moment when the horse's forelegs should have gone
              over the drop, it stopped. Dom Fuas, recognising that only
              divine intervention could have stopped a galloping horse at
              a cliff edge in fog, dismounted. Near the cliff's edge he
              found a small grotto containing an ancient wooden statue
              of the Virgin Mary nursing the infant Jesus — a Marian
              icon the local fishermen had been venerating quietly for
              some decades. Dom Fuas gave thanks and ordered the
              construction of a larger sanctuary on the spot. That
              sanctuary — rebuilt and expanded over nine centuries — is
              the Santuário de Nossa Senhora da Nazaré.
            </p>
            <p className={BODY}>
              The story has the shape of a dozen medieval Iberian Marian
              legends — a nobleman, a mist, a horse, a miracle. It is
              also unusual in one respect: it names a specific
              historically verifiable person (Dom Fuas Roupinho of Porto
              de Mós, who is in the Portuguese military records of the
              1170s), a specific date window, and a specific geographic
              spot that anyone can still visit. The little memorial
              chapel — the <strong>Ermida da Memória</strong> — is built
              directly over the grotto. The statue described in the
              legend is reported to be inside the Santuário's main altar,
              where it is displayed to pilgrims several times a year.
            </p>
            <p className={BODY}>
              Whether the horse actually stopped at the cliff or the
              story was shaped later around an older local Marian cult
              is unprovable at this distance. What is provable is that
              by the <strong>14th century</strong> the shrine was already
              one of the most-visited pilgrimage sites in Iberia, that
              the current Santuário building was consecrated in 1377
              under King Ferdinand I, and that the pilgrimage every 8
              September has been celebrated without interruption for at
              least seven hundred years.
            </p>
          </div>

          <aside className="lg:sticky lg:top-24 rounded-sm border border-[#E7E2D4] bg-white p-7">
            <div className={`${EYEBROW} mb-5`}>· The Clifftop Triad</div>
            <dl className="space-y-5">
              <Fact label="The grotto · pre-1182" value="Ermida da Memória" />
              <Fact label="The Marian statue" value="Nossa Senhora da Nazaré" />
              <Fact label="The current church" value="Santuário — 1377" />
              <Fact label="Annual pilgrimage" value="8 September" />
              <Fact label="Annual attendance" value="~100,000" />
              <Fact label="Continuous since" value="~14th century" />
            </dl>
          </aside>
        </div>

        {sitio && (
          <Figure
            image={sitio}
            size="wide"
            tier="B"
            caption="Sítio, the upper town — the Portuguese pilgrimage village that has sat on this clifftop for eight centuries. The Santuário is visible at the far end of the square; the Ermida da Memória sits above the cliff edge itself."
            className="mt-12"
          />
        )}
      </Section>

      {/* --- The Santuário --- */}
      <Section id="santuario" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· The Sanctuary · 1377"
          title="Santuário de Nossa Senhora da Nazaré"
          kicker="The church is the third building to stand on the spot. The statue inside is older than the church, the village, and possibly older than Portugal itself."
        />

        {santuario && (
          <Figure
            image={santuario}
            size="wide"
            tier="B"
            caption="Santuário de Nossa Senhora da Nazaré — the 14th-century Marian sanctuary consecrated under King Ferdinand I in 1377 and expanded repeatedly through the 17th and 18th centuries. The interior is baroque; the surrounding square is the ceremonial center of the pilgrimage."
            className="mb-12"
          />
        )}

        <div className="space-y-6 max-w-3xl">
          <h3 className={H3}>The building</h3>
          <p className={BODY}>
            The current Santuário was consecrated in <strong>1377</strong>{" "}
            under King Ferdinand I of Portugal, built on the site of an
            earlier 13th-century chapel that had itself replaced the
            original 12th-century structure from Dom Fuas Roupinho's
            time. The 1377 structure is the Gothic core. The building has
            been expanded and redecorated repeatedly since — the baroque
            gilt-work of the interior, the blue-and-white azulejos tile
            panels in the side chapels, the marble altar housing the
            statue — most of it dating to the 17th and 18th centuries. It
            is free to enter. A small attached museum, displaying
            ex-voto offerings from nine centuries of pilgrims —
            hand-carved wax body parts, silver hearts, photographs,
            embroidered panels — costs €2.
          </p>

          <h3 className={`${H3} mt-8`}>The statue</h3>
          <p className={BODY}>
            The <strong>Nossa Senhora da Nazaré</strong> is a small wooden
            carving of the Virgin nursing the infant Jesus, identified by
            local tradition as a <strong>4th-century Byzantine icon</strong>.
            The tradition holds that the statue was brought to Iberia
            during the Muslim conquests of the 8th century by a Greek
            monk fleeing Constantinople. Academic Marian scholarship
            disagrees with the 4th-century dating — stylistic analysis
            places the carving more plausibly in the 12th or 13th
            century, contemporary with the building of the first chapel.
            But the sanctuary's official tradition is maintained, and the
            statue's age is not the point of its veneration.
          </p>
          <p className={BODY}>
            The statue is not displayed continuously. It is kept in a
            niche above the main altar and is brought out several times a
            year for processions and on request for pilgrim groups. The
            two most important appearances are <strong>8 September</strong>{" "}
            (the Marian feast day of the Nativity of Mary, which is the
            feast day the Santuário honors) and <strong>Easter Sunday</strong>.
          </p>

          <h3 className={`${H3} mt-8`}>Visiting the church</h3>
          <p className={BODY}>
            Daily Mass is said at 7 a.m., 10 a.m., and 6 p.m. (5 p.m. in
            winter); Sunday Mass at 8 a.m., 10 a.m., 11:30 a.m., and 6 p.m.
            The church is open to visitors outside Mass times. Modest
            dress is expected — covered shoulders, no shorts above the
            knee. Photography without flash is permitted in the nave;
            the altar area is typically restricted during services.
          </p>
        </div>
      </Section>

      {/* --- Ermida da Memória --- */}
      <Section id="ermida" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· The Memory Chapel"
          title="Ermida da Memória — the spot itself"
        />

        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            A two-minute walk from the Santuário, along the cliff
            promenade toward the ocean, stands a small square building
            with a blue-and-white tile-work dome: the{" "}
            <strong>Ermida da Memória</strong>, the Memory Chapel. It is
            built directly over the grotto where, according to the
            Lenda, Dom Fuas Roupinho's horse stopped. Inside, on the
            wall opposite the entrance, a carved stone relief depicts
            the scene: the mist, the horse, the cliff edge, the rider
            frozen in astonishment.
          </p>
          <p className={BODY}>
            The current Ermida is small, essentially a pilgrim's chapel
            rather than a church. It is the <strong>third structure</strong>{" "}
            on the site — the first was put up immediately after the
            miracle in 1182; the second, a larger stone chapel, was
            built by King Manuel I in 1517; the present building dates
            to 1758 and was redecorated in the 19th century. It is
            usually unlocked during daylight hours. The floor is
            covered in small ex-voto tiles left by pilgrims, each
            inscribed with a name and a year.
          </p>
          <p className={BODY}>
            Standing in the Ermida and looking through the doorway you
            can see the cliff edge, the Atlantic beyond it, and — on
            big-wave days — the surfers in the water below. This is
            the one spot in Nazaré where the village's two narratives
            meet spatially: the 12th-century miracle chapel, and the
            21st-century big-wave break, visible at the same time from
            the same doorway.
          </p>
        </div>
      </Section>

      {/* --- Festas da Senhora --- */}
      <Section id="festas" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· The Festas · 8 September"
          title="One hundred thousand pilgrims, one week"
          kicker="The Festas da Senhora da Nazaré is the annual Marian pilgrimage. It is one of the oldest continuously-celebrated Marian feasts in Iberia — older than the country that organizes it."
        />

        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            The feast day itself is <strong>8 September</strong> — the
            Nativity of Mary in the Catholic liturgical calendar. The
            festival week runs from the Saturday before to the Sunday
            after. Attendance across the week approaches{" "}
            <strong>100,000 people</strong>, which is comparable to the
            entire annual big-wave-season surf crowd but concentrated
            in seven days.
          </p>

          <h3 className={`${H3} mt-8`}>The structure of the week</h3>
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>
              <strong>Saturday (opening):</strong> the statue is brought
              out of its niche above the main altar and placed in a
              processional float. Evening Mass. Fireworks over the
              Atlantic from the Forte headland.
            </li>
            <li>
              <strong>Sunday–Tuesday:</strong> daily pilgrim Masses,
              increasing in attendance. Folkloric performances in the
              square — traditional <em>ranchos folclóricos</em> from
              surrounding villages, each in regional dress. The
              village restaurants run extended hours; pilgrim-rate
              prices.
            </li>
            <li>
              <strong>Wednesday night:</strong> the{" "}
              <em>procissão das velas</em> — the candle procession. The
              statue travels from the Santuário down the cliffside path
              to the lower village at sunset, carried on a float
              accompanied by thousands of pilgrims holding candles. It
              is the most visually striking event of the week.
            </li>
            <li>
              <strong>8 September (the feast day itself):</strong>{" "}
              pontifical Mass in the Santuário at 10 a.m.; the main
              procession at 4 p.m. traverses the Sítio streets with the
              Marian float, the village's ranchos, multiple Portuguese
              dioceses' pilgrim groups, and the diocesan brass bands.
            </li>
            <li>
              <strong>Closing Sunday:</strong> final pilgrim Mass; the
              statue is returned to the altar niche; the week ends
              with a final fireworks display after the evening Mass.
            </li>
          </ul>

          <h3 className={`${H3} mt-10`}>If you're coming for the Festas</h3>
          <p className={BODY}>
            Book accommodation <strong>four to six months</strong> ahead
            for the week of 8 September. Hotel rates triple. Parking in
            the village is impractical; take the bus from Lisbon or
            park outside and walk. Dress modestly for any Mass inside
            the Santuário. Do not photograph the statue during the
            processions without explicit permission from the diocese.
            Cover your head inside the church if you are a Catholic
            woman — locals take this seriously and will notice.
          </p>
          <p className={BODY}>
            The Festas are a religious event. They are also, for this
            village, the single most important week of the year — more
            important than the peak big-wave day, than the WSL Tow
            Challenge, than the Carnaval. If you want to understand why
            Nazaré is the village it is, come here in September before
            you come here in February.
          </p>
        </div>
      </Section>

      {/* --- Sítio as sacred landscape --- */}
      <Section id="landscape" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· The Clifftop"
          title="Reading Sítio as a sacred landscape"
          kicker="Most pilgrimage sites are a single building. Sítio is a landscape. Walking it in the right order is the pilgrimage."
        />

        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            A pilgrim arriving in the lower village — Praia — takes the
            1889 funicular up to Sítio. The ascent is not incidental;
            the 120-meter vertical rise from the fishing port to the
            clifftop is the body's preparation for the liturgical
            geography that follows. Medieval pilgrims climbed the
            175-step Capuchinhos stairway, and many still do.
          </p>
          <p className={BODY}>
            From the top of the funicular the walk is short and the
            sequence is fixed:
          </p>
          <ol className={`${BODY} list-decimal pl-6 space-y-3`}>
            <li>
              <strong>Santuário de Nossa Senhora da Nazaré</strong> — at
              the end of the long central square. The pilgrim enters,
              lights a candle, approaches the main altar, kneels, says
              the prayer they came to say. The statue is in its niche
              above the altar.
            </li>
            <li>
              <strong>The square itself</strong> — the Praça Sousa Oliveira
              — with the ex-voto museum attached to the Santuário. Here
              the pilgrim reads, in wax body parts and silver hearts
              and embroidered panels, the pains that brought other
              pilgrims here across nine centuries. This is not
              decoration; it is the village's collective medical
              history rendered as prayer.
            </li>
            <li>
              <strong>The walk to the Ermida da Memória</strong> — 400
              meters along the cliff-edge promenade, the Atlantic
              visible throughout, the Forte de São Miguel Arcanjo
              visible in the distance. In winter the big-wave sets can
              be heard from this path.
            </li>
            <li>
              <strong>The Ermida itself</strong> — the pilgrim enters the
              small square building, faces the carved scene of the
              miracle, and looks out through the doorway to the cliff
              edge a few meters away. The view is the point. This is
              the spot.
            </li>
            <li>
              <strong>Return via the Miradouro do Sítio</strong> — the
              cliff-top belvedere with the best view along the
              coastline in either direction. The pilgrim's descent
              completes the visit.
            </li>
          </ol>
          <p className={BODY}>
            Walked in reverse, or skipped, or treated as five separate
            tourist stops, the clifftop reads as a somewhat unusual
            small Portuguese town with a nice view. Walked in this
            sequence it reads as what it is: a landscape that has been
            worked liturgically for 900 years.
          </p>
        </div>

        <ClusterAside>
          The 900-year Marian tradition and the 2011 big-wave rupture are
          the two halves of the same argument — the continuity of this
          village through the attention event. That argument is the whole
          of <ClusterLink to="main" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="sanctuary" />

      <SpokeProvenance
        bundle={bundle}
        note="Historical material on the Lenda, the Santuário's 1377 consecration, and the structural history of the Ermida follows the Portuguese ecclesiastical archives published in Rodrigues (2014) Nazaré: Santuário e Lenda. Dating of the Nossa Senhora statue reflects current academic consensus, which diverges from the sanctuary's own 4th-century tradition; both are reported. Mass times and festival program verified with the Santuário office for the 2026 calendar."
      />
    </LegendaryShell>
  );
}
