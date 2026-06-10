/**
 * São Martinho do Porto — Tier 3 page. Legendary v2.
 *
 * Initially built as "first Tier 2" — reclassified 2026-04-20 after
 * calibration. São Martinho is domestically-known in Portugal, named
 * in Nazaré's Nearby, researchable — but not internationally famous
 * and not known to any cross-border scene. That's Tier 3 under the
 * locked tier criteria: Tier 2 requires cross-border recognition
 * (international scene, regional travel press). The content shape
 * here turned out to be the right pilot for a rich Tier 3.
 *
 * Template this established (for Tier 3 with strong material):
 *   - 9 sections from the 11-section vocabulary — dropped: second
 *     deep-explainer, dropped: full 3-deep cultural footprint
 *   - ~2,300 words main prose
 *   - 7 images
 *   - 2 spokes chosen per-beach (Visiting + one earned audience guide)
 *   - Same design tokens / palette / ClusterRail primitives as Tier 1
 *
 * Thin-material Tier 3 pages use the same template with fewer sections
 * filled and shorter prose (~600–1,200 words, 2–3 images, 0–1 spokes).
 *
 * Thesis:
 *   "The almost-perfectly-circular Atlantic bay where a 900-year-old
 *    Cistercian fishery became the Silver Coast's family beach."
 */

import type { LegendaryPageBundle, TimelineEvent, Zone } from "./types";
import LegendaryShell from "./shell";
import Hero from "./sections/hero";
import Figure from "./primitives/figure";
import PullQuote from "./primitives/pull-quote";
import {
  BODY,
  BODY_DARK,
  BODY_SM,
  COOL,
  CREAM,
  DARK,
  DISPLAY_FF,
  EYEBROW,
  Fact,
  H2,
  H2_DARK,
  H3,
  PAPER,
  Section,
  SectionHeader,
  pickImage,
  renderInlineBold,
  renderInlineBoldDark,
} from "./nazare/shared";
import {
  ClusterAside,
  ClusterLink,
  ClusterRail,
} from "./sao-martinho/shared";

// ============================================================================
// STORY
// ============================================================================

function SmpStory({ bundle }: { bundle: LegendaryPageBundle }) {
  const paragraphs = (bundle.showcase.intro_text ?? "")
    .split("\n\n")
    .filter(Boolean);

  return (
    <section id="story" className={`${PAPER} border-b border-[#E2E8F0]`}>
      <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <div className={`${EYEBROW} mb-4`}>· Story</div>
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={`${BODY} mb-6 ${
              i === 0
                ? "first-letter:text-[120px] first-letter:float-left first-letter:leading-[0.85] first-letter:pr-3 first-letter:pt-1"
                : ""
            }`}
          >
            {renderInlineBold(p)}
          </p>
        ))}
        <style>{`
          #story p:first-of-type::first-letter {
            font-family: var(--display-family, var(--font-dm-serif-display));
            color: var(--beach-primary, #2B6F8C);
          }
        `}</style>

        <PullQuote size="hero">
          A 900-year-old Cistercian fishery became the Silver Coast's
          family beach. The geometry did most of the work.
        </PullQuote>
      </div>
    </section>
  );
}

// ============================================================================
// SHELL EXPLAINER — why the bay is shaped the way it is
// ============================================================================

function ShellExplainerSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const aerial = bundle.meta.images.hero;
  const boca = pickImage(bundle.meta, "coast_boca");
  const dinosaur = pickImage(bundle.meta, "dinosaur");

  return (
    <Section id="shell" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· The Shell-Shaped Bay"
        title="Why this specific stretch of the Portuguese Atlantic is swimmable"
        kicker="The Nazaré Canyon produces the largest surfable waves on Earth, ten kilometers north of here. São Martinho's bay is the exact opposite feature — a closed chamber that traps calm water on the same coastline. The geometry is not accidental."
      />

      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
        <div className="space-y-6">
          <h3 className={H3}>The geometry</h3>
          <p className={BODY}>
            The bay of São Martinho is almost a perfect circle — roughly{" "}
            <strong>2 kilometers in diameter</strong>, enclosed on three
            sides by Jurassic limestone cliffs that curve inward to
            leave only a narrow opening to the Atlantic. That opening —
            the <strong>Boca da Baía</strong> — is approximately{" "}
            <strong>200 meters wide</strong> at its narrowest, running
            roughly north-south between the two rocky headlands.
          </p>
          <p className={BODY}>
            The shape is the result of <strong>differential erosion</strong>{" "}
            of the surrounding sedimentary rock over millions of years.
            The cliffs enclosing the bay are Upper Jurassic limestone —
            around <strong>150 million years old</strong> — laid down
            when this stretch of Iberia was shallow coastal sea. Harder
            beds of the limestone (the two headlands) resisted erosion;
            softer beds (where the bay now sits) eroded faster. The
            Atlantic, working on the softer material for millennia,
            carved the circular cavity. The Boca is the narrow breach
            where the softer material extended to the coastline.
          </p>
          <p className={BODY}>
            The <strong>functional consequence</strong>: Atlantic swell
            that arrives at the Boca is largely blocked from entering
            the bay. What does get through refracts around the headlands
            and loses most of its energy. The inside of the bay, on a
            day when the outside coast is being hit by 3-meter surf, is
            a calm lagoon. The water temperature runs 2–3 °C warmer than
            the open Atlantic because the bay is shallow and slow to
            flush. Currents are mild. <strong>This is the only
            stretch of the Portuguese west coast where a non-swimmer
            can stand waist-deep in the Atlantic without anxiety</strong>.
          </p>

          {boca && (
            <Figure
              image={boca}
              size="wide"
              tier="B"
              caption="Looking out from the inside of the bay toward the Boca — the narrow 200-meter opening that keeps Atlantic swell out. December 2025."
              className="my-6"
            />
          )}

          <h3 className={`${H3} mt-6`}>Dinosaurs on the cliffs</h3>
          <p className={BODY}>
            The same Jurassic limestone that shapes the bay preserves
            another feature worth the walk: <strong>dinosaur trackways</strong>.
            The outer-facing cliffs of the northern headland contain a
            set of theropod footprints — meat-eating bipedal dinosaurs,
            roughly Jurassic in age — impressed into the limestone when
            it was soft marine mud. The largest prints are roughly{" "}
            <strong>35 cm across</strong>. They are visible at low tide
            along the exposed rock platform, best accessed from the
            Farol do Cabo do Ouivro trail with a local guide or in the
            company of someone who has been before. Portugal's Jurassic
            coast — which extends from Peniche through Lourinhã to
            Cabo Mondego — is one of the richest dinosaur-footprint
            regions in Europe. São Martinho is on it.
          </p>
        </div>

        <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
          <div className={`${EYEBROW} mb-5`}>· The Numbers</div>
          <dl className="space-y-5">
            <Fact label="Bay diameter" value="~2 km" />
            <Fact label="Boca width" value="~200 m" />
            <Fact label="Cliff age" value="~150 Myr" />
            <Fact label="Beach length" value="2.1 km" />
            <Fact label="Water temp (summer)" value="19–21 °C" />
            <Fact label="Water temp (winter)" value="14 °C" />
            <Fact label="Population (year-round)" value="~3,000" />
            <Fact label="Distance to Nazaré" value="10 km" />
            <Fact label="Distance to Lisbon" value="108 km" />
          </dl>
        </aside>
      </div>

      {dinosaur && (
        <Figure
          image={dinosaur}
          size="wide"
          tier="B"
          caption="A theropod dinosaur footprint in the Late Jurassic limestone of the bay's outer cliffs. Roughly 150 million years old. December 2025."
          className="mt-12"
        />
      )}

      <ClusterAside>
        The nearby beach whose canyon produces the exact opposite of
        this calm-bay geometry — the world's largest surfable wave — is{" "}
        <a
          href="/beaches/praia-do-norte-6"
          className="not-italic font-semibold text-[color:var(--beach-primary,#2B6F8C)] underline decoration-dotted underline-offset-4 hover:no-underline"
        >
          Nazaré (Praia do Norte) →
        </a>
      </ClusterAside>
    </Section>
  );
}

// ============================================================================
// ZONES
// ============================================================================

function ZonesSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const summer = pickImage(bundle.meta, "beach_summer");
  const zones: Zone[] = bundle.showcase.zones ?? [];

  return (
    <Section id="zones" className={CREAM} width="wide">
      <SectionHeader
        eyebrow="· Three Parts of the Bay"
        title="The beach, the headland, the estuary"
        kicker="The bay reads as one continuous shoreline from the Avenida Marginal. On the ground it's three distinct places with three different purposes."
      />

      {summer && (
        <Figure
          image={summer}
          size="wide"
          tier="B"
          caption="The bay's inside curve at full attendance — Portuguese families, striped beach tents (tendas), the same summer practice the town has seen for a hundred and thirty years."
          className="mb-12"
        />
      )}

      <div className="grid gap-8 md:grid-cols-3">
        {zones.map((z) => (
          <article
            key={z.zone_code}
            className="rounded-sm border border-[#E7E2D4] bg-white p-6"
          >
            <div className={`${EYEBROW} mb-3`}>{z.zone_code}</div>
            <h3 className={`${H3} mb-3`}>{z.name}</h3>
            <p className={`${BODY_SM} mb-4`}>{z.character}</p>
            {z.best_for && (
              <div className="mb-3">
                <div className={`${EYEBROW} mb-1`}>Best for</div>
                <p className={BODY_SM}>{z.best_for}</p>
              </div>
            )}
            {z.notes && (
              <div className="mt-4 border-l-2 border-[color:var(--beach-primary,#2B6F8C)] pl-4">
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[color:var(--beach-primary,#2B6F8C)] mb-1">
                  Local note
                </div>
                <p className={BODY_SM}>{z.notes}</p>
              </div>
            )}
          </article>
        ))}
      </div>

      <ClusterAside>
        The practical side — where to stay, what to eat, how to
        structure a day around the bay — is in{" "}
        <ClusterLink to="visiting" />.
      </ClusterAside>
    </Section>
  );
}

// ============================================================================
// A DAY HERE
// ============================================================================

function DaySection({ bundle }: { bundle: LegendaryPageBundle }) {
  const day = bundle.showcase.day_in_time;
  const sunset = pickImage(bundle.meta, "sunset");
  if (!day) return null;

  const vignettes = [
    { slot: "Dawn", text: day.dawn },
    { slot: "Midday", text: day.midday },
    { slot: "Golden", text: day.golden },
    { slot: "Night", text: day.night },
  ];

  return (
    <Section id="day" className={CREAM} width="wide">
      <SectionHeader
        eyebrow="· A Day Here"
        title="The Portuguese family beach day, still"
      />

      {sunset && (
        <Figure
          image={sunset}
          size="wide"
          tier="B"
          caption="Sunset over the bay, November. The southwest-facing shore catches the winter light for a long hour."
          className="mb-10"
        />
      )}

      <div className="grid gap-10 md:grid-cols-2">
        {vignettes.map((v) => (
          <div key={v.slot}>
            <div className={`${EYEBROW} mb-3`}>{v.slot}</div>
            <p className={BODY}>{renderInlineBold(v.text)}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ============================================================================
// HISTORY
// ============================================================================

function TimelineSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const events: TimelineEvent[] = bundle.showcase.timeline ?? [];

  return (
    <Section id="history" className={PAPER}>
      <SectionHeader
        eyebrow="· History"
        title="Seven points from the Romans to the dunes"
        kicker="The bay has been a functioning harbor for two thousand years. The seven dates below are the ones that shaped the São Martinho a visitor meets today."
      />

      <ol className="space-y-10 border-l-2 border-[#CBD5E1] pl-8">
        {events.map((ev, i) => {
          const yearLabel =
            ev.year < 0 ? `${-ev.year} BCE` : String(ev.year);
          const tag = [
            yearLabel,
            ev.month ? monthName(ev.month) : null,
            ev.event_type,
          ]
            .filter(Boolean)
            .join(" · ");
          return (
            <li key={`${ev.year}-${i}`} className="relative">
              <span
                className="absolute -left-[35px] top-2 w-3 h-3 rounded-full"
                style={{ backgroundColor: "var(--beach-primary, #2B6F8C)" }}
              />
              <div className={`${EYEBROW} mb-2`}>{tag}</div>
              <h3 className={`${H3} mb-2`}>{ev.title}</h3>
              <p className={BODY_SM}>{ev.description}</p>
              {ev.wiki_url && (
                <a
                  href={ev.wiki_url}
                  target="_blank"
                  rel="noopener"
                  className="mt-2 inline-block text-xs font-mono uppercase tracking-wider text-[color:var(--beach-primary,#2B6F8C)] underline decoration-dotted underline-offset-4 hover:no-underline"
                >
                  Wikipedia →
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

function monthName(m: number): string {
  return (
    [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][m - 1] ?? ""
  );
}

// ============================================================================
// CULTURE
// ============================================================================

function CulturalFootprintSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const houses = pickImage(bundle.meta, "houses");
  const windmill = pickImage(bundle.meta, "windmill");

  return (
    <Section id="culture" className={PAPER} width="wide">
      <SectionHeader
        eyebrow="· In the Culture"
        title="Three inheritances that still define the town"
      />

      <div className="space-y-12">
        <article>
          <h3 className={`${H3} mb-4`}>The Cistercians of Alcobaça, since 1153</h3>
          <p className={BODY}>
            São Martinho's modern identity is younger than its economy.
            From the mid-12th century until the dissolution of
            Portuguese religious orders in 1834, the bay and its
            fisheries were worked under the jurisdiction of the{" "}
            <strong>Cistercian monastery at Alcobaça</strong> — a
            monastery whose founding charter (granted by King Afonso
            Henriques in 1153) ceded the monks a vast coastal territory
            known as the <em>Coutos de Alcobaça</em>. The Cistercians
            built salt pans, organized the fishing fleet, codified the
            share system that distributed the catch among the
            village's families, and for six hundred years were the
            institution the bay answered to. The municipal boundary of
            Alcobaça today — which still includes São Martinho, Nazaré,
            and a dozen other towns — <strong>follows the old couto
            lines</strong>. When you visit the UNESCO-listed Alcobaça
            monastery twenty kilometers inland and see the full extent
            of the medieval land grant painted on the cloister walls,
            you are looking at the jurisdictional geometry that made
            São Martinho what it became.
          </p>
        </article>

        {houses && (
          <Figure
            image={houses}
            size="wide"
            tier="B"
            caption="The tile-fronted houses of the village core — late-19th- and early-20th-century Portuguese seaside vernacular, built in the generation after the 1887 railway arrived."
          />
        )}

        <article>
          <h3 className={`${H3} mb-4`}>The 1887 railway — Portugal's first seaside resort</h3>
          <p className={BODY}>
            The railway that reached São Martinho in <strong>1887</strong>{" "}
            — the Linha do Oeste, connecting Lisbon to Leiria via the
            Silver Coast — was the second transformation. Within a
            generation the village's economy shifted from fishing and
            salt to <strong>summer tourism for the Portuguese middle
            class</strong>. The tile-fronted two-story houses that still
            line Avenida Marginal are the architecture of that
            transformation — Portuguese seaside vernacular built between
            approximately 1890 and 1930, roughly contemporary with
            Nice's Promenade des Anglais and Brighton's early-Victorian
            squares. São Martinho is <strong>one of the oldest
            continuously-operating seaside resorts in Portugal</strong>.
            Most of its current visitor infrastructure dates to that
            period; most of its current vacationers are
            fourth-generation descendants of the families who built
            it.
          </p>
        </article>

        <article>
          <h3 className={`${H3} mb-4`}>The windmills and the working hinterland</h3>
          <p className={BODY}>
            The hills immediately inland from the bay carry the town's
            third visible inheritance: a set of{" "}
            <strong>traditional Portuguese windmills</strong> (<em>moinhos
            de vento</em>) that ground grain for the coastal settlements
            from the 17th through the early 20th centuries. Several
            still stand, restored or semi-restored; one or two still
            turn on windy days. They are the reminder that São Martinho
            was never only a beach — it was the coastal face of an
            agricultural hinterland that extended inland to Alcobaça
            and beyond, and that hinterland is still there. Drive ten
            minutes inland and you are in Portuguese wine country:
            the Bairrada is a half-hour north, the Óbidos micro-region
            is a half-hour south, and the <strong>DOC Lourinhã</strong>{" "}
            — one of only three wine regions in the world formally
            classified for brandy production — is twenty minutes south.
          </p>
        </article>

        {windmill && (
          <Figure
            image={windmill}
            size="wide"
            tier="B"
            caption="A traditional windmill on the hills above the bay — 17th- to 19th-century Portuguese coastal agricultural technology. The hinterland São Martinho served as a port for."
          />
        )}
      </div>
    </Section>
  );
}

// ============================================================================
// HONEST CONTEXT
// ============================================================================

function HonestContextSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const note =
    bundle.showcase.favela_note ?? bundle.showcase.honest_reckoning_note;
  if (!note) return null;
  const paragraphs = note.split("\n\n").filter(Boolean);

  return (
    <Section id="honest" className={DARK}>
      <div className="max-w-3xl">
        <div
          className="text-[11px] font-mono uppercase tracking-[0.3em] mb-4"
          style={{ color: "var(--beach-supporting, #D8B97E)" }}
        >
          · What the Postcard Doesn't Show
        </div>
        <h2 className={H2_DARK} style={{ fontFamily: DISPLAY_FF }}>
          The quieter pressures on a quieter bay
        </h2>
        <p className="mt-5 text-lg italic text-[#94A3B8] font-serif">
          São Martinho is, unlike Nazaré, not a beach in crisis. But
          every Portuguese coastal town carries similar strains at
          different magnitudes. The ones here are worth naming.
        </p>
      </div>

      <div className="mt-12 space-y-6 max-w-3xl">
        {paragraphs.map((p, i) => (
          <p key={i} className={BODY_DARK}>
            {renderInlineBoldDark(p)}
          </p>
        ))}
      </div>
    </Section>
  );
}

// ============================================================================
// NEARBY
// ============================================================================

function NearbySection() {
  const places = [
    {
      name: "Nazaré",
      distance: "10 km north",
      blurb:
        "The big-wave capital. Same coast, opposite character. Nazaré's Praia do Norte is where the world's largest surfable waves break in winter; the village is where the 900-year Marian pilgrimage happens every September 8. A half-day from São Martinho; a full cluster of its own.",
      href: "/beaches/praia-do-norte-6",
    },
    {
      name: "Alcobaça Monastery",
      distance: "12 km inland",
      blurb:
        "The 12th-century Cistercian monastery whose monks ran the São Martinho bay for six centuries. UNESCO World Heritage site. Inside: **the tombs of Dom Pedro I and Inês de Castro**, facing each other — the central tragedy of medieval Portuguese literature. The monastery is the inland institutional anchor that São Martinho is the coastal face of.",
      href: null,
    },
    {
      name: "Óbidos",
      distance: "25 km south",
      blurb:
        "The walled medieval town given as a wedding gift by Dom Dinis to his queen in the 13th century and retained as the queens' property of Portugal for 650 years. Walk the ramparts; drink the **ginjinha** — sour cherry liqueur served in a chocolate cup you eat afterwards.",
      href: null,
    },
    {
      name: "Peniche & Supertubos",
      distance: "45 km south",
      blurb:
        "Portugal's WSL Championship Tour surf break — the **MEO Pro** runs here each October. Fast, hollow, barrelling beach break that produces some of the cleanest tubes in Europe. The Berlengas Islands (a nature reserve 10 km offshore) are worth a boat day if you stay overnight.",
      href: null,
    },
  ];
  return (
    <Section id="nearby" className={PAPER} width="wide">
      <SectionHeader
        eyebrow="· On the Silver Coast"
        title="Four places within an hour"
      />
      <div className="grid gap-8 md:grid-cols-2">
        {places.map((p) => (
          <article
            key={p.name}
            className="rounded-sm border border-[#E2E8F0] bg-white p-7"
          >
            <div className={`${EYEBROW} mb-2`}>{p.distance}</div>
            {p.href ? (
              <h3 className={`${H3} mb-3`}>
                <a
                  href={p.href}
                  className="hover:text-[color:var(--beach-primary,#2B6F8C)] transition-colors"
                >
                  {p.name} →
                </a>
              </h3>
            ) : (
              <h3 className={`${H3} mb-3`}>{p.name}</h3>
            )}
            <p className={BODY_SM}>{renderInlineBold(p.blurb)}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

// ============================================================================
// SPOKES FOOTER
// ============================================================================

function SpokeFooter() {
  const spokes = [
    {
      slug: "visiting",
      label: "Visiting São Martinho",
      subtitle:
        "Getting here from Lisbon (108 km) or Nazaré (10 km), where to stay, what to eat, and how to work the bay into a Silver Coast itinerary.",
    },
    {
      slug: "family",
      label: "For Families",
      subtitle:
        "The most swimmable calm-water beach on the Portuguese Atlantic. Why this bay works for young children, what to bring, what to do on rainy days.",
    },
  ];
  return (
    <Section id="spokes" className={PAPER} width="wide">
      <div className={`${EYEBROW} mb-6`}>· Go Deeper</div>
      <h2
        className={`${H2} mb-12 max-w-3xl`}
        style={{ fontFamily: DISPLAY_FF }}
      >
        Two pages for two ways in
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {spokes.map((s) => (
          <a
            key={s.slug}
            href={`/beaches/sao-martinho-do-porto/${s.slug}`}
            className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#2B6F8C)] transition-colors"
          >
            <h3
              className={`${H3} mb-3 group-hover:text-[color:var(--beach-primary,#2B6F8C)]`}
            >
              {s.label} →
            </h3>
            <p className={BODY_SM}>{s.subtitle}</p>
          </a>
        ))}
      </div>
    </Section>
  );
}

function PageProvenance({ bundle }: { bundle: LegendaryPageBundle }) {
  return (
    <section className="border-t border-[#E2E8F0] bg-[#FAFAF7]">
      <div className="mx-auto max-w-3xl px-6 py-12 text-sm text-volcanic-500 leading-relaxed">
        <div className={`${EYEBROW} mb-4`}>· About this page</div>
        <p className="text-[13px] leading-[1.65]">
          <strong>
            Written by {bundle.composition.byline.replace("Written by ", "")}.
          </strong>{" "}
          Historical material on the Coutos de Alcobaça follows Gonçalves
          (1989) <em>O Mosteiro de Alcobaça e a Costa</em>. Jurassic
          footprint material draws on the Lourinhã Museum's fieldwork
          catalogue for the region. Climate and ocean data from IPMA
          (Instituto Português do Mar e da Atmosfera). Images from
          Wikimedia Commons, per-image attribution in-line. Version v0.9.
          Corrections welcome, particularly on specific named-practice
          detail at the estendal of Salir do Porto and the current status
          of the Jurassic footprint guided-visit program.
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function SaoMartinhoPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta, data } = bundle;
  const location = [data.admin_level_1, data.country_code]
    .filter(Boolean)
    .join(", ");
  const heroImage = meta.images.hero;

  return (
    <LegendaryShell composition={composition}>
      <Hero
        beachName={composition.beach_name}
        location={location}
        tagline="The shell-shaped bay on the Portuguese Atlantic. A 900-year-old Cistercian fishery that became the Silver Coast's family beach."
        heroType="MONUMENT"
        primary={heroImage}
        version={composition.version}
        tier={composition.tier}
      />

      <ClusterRail current="main" beachName={composition.beach_name} />

      <SmpStory bundle={bundle} />
      <ShellExplainerSection bundle={bundle} />
      <ZonesSection bundle={bundle} />
      <DaySection bundle={bundle} />
      <TimelineSection bundle={bundle} />
      <CulturalFootprintSection bundle={bundle} />
      <HonestContextSection bundle={bundle} />
      <NearbySection />
      <SpokeFooter />
      <PageProvenance bundle={bundle} />
    </LegendaryShell>
  );
}
