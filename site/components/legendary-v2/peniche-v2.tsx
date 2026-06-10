/**
 * Peniche — bespoke Tier 2 page. Legendary v2.
 *
 * First actual Tier 2 (São Martinho reclassified to Tier 3 on
 * 2026-04-20). Peniche earns Tier 2 through cross-border recognition:
 * the WSL Championship Tour knows Supertubos; European political-history
 * audiences know the Fortaleza. Not globally-famous enough to be Tier 1
 * (a random educated American may never have heard of it), but
 * regionally and scene-famous enough that the page has a real audience.
 *
 * Thesis (spike):
 *   "Portugal's surf capital, built on top of a 16th-century fortress
 *    that became the country's most-infamous political prison."
 *
 * Tier 2 template (three parallel Peniche stories the page threads):
 *   - Supertubos as the Portuguese competition wave
 *   - The Fortaleza as the Salazar prison + museum
 *   - The Berlengas as the offshore biosphere reserve
 *
 * Section count: 10 (dropped the second deep-explainer vs Tier 1, but
 * added 3 topic-specific short explainer sections). ~3,500 words main,
 * 7 images, 3 earned spokes.
 */

import type {
  LegendaryPageBundle,
  TimelineEvent,
  Zone,
} from "./types";
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
} from "./peniche/shared";

// ============================================================================
// STORY
// ============================================================================

function PenicheStory({ bundle }: { bundle: LegendaryPageBundle }) {
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
            font-family: var(--display-family, var(--font-barlow-condensed));
            color: var(--beach-primary, #0A4D68);
          }
        `}</style>

        <PullQuote size="hero">
          Portugal's surf capital, built around a 16th-century fortress
          that Salazar used as a political prison.
        </PullQuote>
      </div>
    </section>
  );
}

// ============================================================================
// SUPERTUBOS — the surf story
// ============================================================================

function SupertubosSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const supertubos = pickImage(bundle.meta, "supertubos_wave");
  const molhe = pickImage(bundle.meta, "molhe_supertubos");
  const wsl = pickImage(bundle.meta, "wsl_event");

  return (
    <Section id="supertubos" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· Supertubos"
        title="Why Peniche is the Portuguese surf capital"
        kicker="A barrelling beach break four kilometers south of the old town that has hosted the world's top surfers every October since 2009. The wave is the reason Peniche is on the global surfing map."
      />

      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
        <div className="space-y-6">
          <p className={BODY}>
            <strong>Supertubos</strong> — formally Praia do Medão,
            colloquially "the super tubes" — is a{" "}
            <strong>sand-bottom beach break</strong> on the southern
            coast of the Peniche peninsula that produces some of the
            cleanest, hollowest waves in Europe on a south-southwest
            swell. The wave is not canyon-amplified like Nazaré; it is
            produced by the much more ordinary mechanism of Atlantic
            swell meeting a shallow, gently-sloping sandy seabed at
            the right angle. What makes it exceptional is
            consistency: Peniche's peninsula geography funnels
            southwest swells onto this beach with remarkable
            reliability across the year.
          </p>

          {supertubos && (
            <Figure
              image={supertubos}
              size="wide"
              tier="B"
              caption="Supertubos on a clean south-southwest day — the hollow, fast-peeling barrel the beach is named for. The WSL Championship Tour books this break in October because the autumn swell window maximises the chance of getting this conditions window on a competition day."
            />
          )}

          <h3 className={`${H3} mt-6`}>Why the WSL comes here</h3>
          <p className={BODY}>
            The WSL Championship Tour — the top 34 men and 18 women
            surfers on the planet — has held an event at Supertubos
            every October since 2009. The event has gone through
            several sponsorship names (ASP Rip Curl Pro Search, Rip
            Curl Pro Portugal, and since 2022 the <strong>MEO Rip Curl
            Pro Portugal</strong>) but the break and the window have
            been stable. The choice of Supertubos is not accidental.
            It is one of relatively few high-performance beach breaks
            on the tour circuit that consistently delivers at the
            time of year the circuit visits Europe; the only serious
            competitor for the Portugal stop in the tour's planning
            has been Ericeira, 40 km south, which has a different
            wave character and is rarely selected for the same
            competition slot.
          </p>

          {wsl && (
            <Figure
              image={wsl}
              size="wide"
              tier="B"
              caption="The WSL Rip Curl Pro event at Peniche — a tour stop that has run every October since 2009 and is now branded the MEO Rip Curl Pro Portugal. Public beach-viewing; crowds of 15–25,000 on final days."
            />
          )}

          <h3 className={`${H3} mt-6`}>Who else surfs here</h3>
          <p className={BODY}>
            Outside the WSL event's 10-day competition window, Supertubos
            is a serious break that draws <strong>elite recreational
            surfers and touring professionals</strong> from across
            Europe — especially French, Spanish, Basque, and Moroccan
            surfers who know the October-to-April season is the
            productive window. It is not a beginner break. First-time
            surfers learn at Baleal (on the north coast of the
            peninsula), at Consolação (a few kilometers south), or
            sometimes at Praia do Baleal Sul on smaller days.
            Attempting Supertubos without the skills to handle a
            hollow, fast, shallow-water takeoff is the single most
            common way visiting surfers get hurt at Peniche.
          </p>

          {molhe && (
            <Figure
              image={molhe}
              size="wide"
              tier="B"
              caption="Praia do Molhe Leste (foreground) and Supertubos (distance) — the stretch of coast the WSL event shares between the practice and competition sites."
            />
          )}
        </div>

        <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
          <div className={`${EYEBROW} mb-5`}>· The Break</div>
          <dl className="space-y-5">
            <Fact label="Break type" value="Beach break, sand" />
            <Fact label="Best swell" value="SW to SSW" />
            <Fact label="Best period" value="≥ 12 s" />
            <Fact label="Peak season" value="Oct–Mar" />
            <Fact label="Water temp (winter)" value="14–16 °C" />
            <Fact label="Water temp (summer)" value="18–19 °C" />
            <Fact label="Skill level" value="Advanced" />
            <Fact label="WSL event" value="October annually" />
          </dl>
          <p className="mt-6 text-xs italic text-volcanic-500 leading-relaxed">
            Beginner breaks are at Baleal (3 km north) and Consolação
            (7 km south). See the Surfing spoke for the full school +
            break matrix.
          </p>
        </aside>
      </div>

      <ClusterAside>
        Full surf-audience treatment — which school, which break for
        which level, the WSL week as a visitor, the inevitable comparison
        to Ericeira and Nazaré — is in <ClusterLink to="surfing" />.
      </ClusterAside>
    </Section>
  );
}

// ============================================================================
// FORTALEZA — the political-prison story (DARK register)
// ============================================================================

function FortalezaSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const fort = pickImage(bundle.meta, "fortaleza");

  return (
    <Section id="fortaleza" className={DARK}>
      <div className="max-w-3xl">
        <div
          className="text-[11px] font-mono uppercase tracking-[0.3em] mb-4"
          style={{ color: "var(--beach-supporting, #F4A261)" }}
        >
          · The Fortaleza · 1557–Today
        </div>
        <h2 className={H2_DARK} style={{ fontFamily: DISPLAY_FF }}>
          What the old fortress was used for
        </h2>
        <p className="mt-5 text-lg italic text-[#94A3B8] font-serif">
          Every coastal Portuguese town of a certain age has a
          16th-century fortress. Peniche's is different. Under the
          Salazar dictatorship (1926–1974), this building was the
          regime's most-feared political prison. The visitor who skips
          it misses the single most serious thing in the town.
        </p>
      </div>

      {fort && (
        <Figure
          image={fort}
          size="wide"
          tier="B"
          caption="Fortaleza de Peniche — 16th-century Atlantic fortress; the Salazar regime's primary political prison 1934–1974; now the Centro Nacional de Resistência e Liberdade (National Centre for Resistance and Freedom)."
          className="my-12"
        />
      )}

      <div className="space-y-6 max-w-3xl">
        <h3
          className="font-display text-[22px] leading-tight text-[#F1F5F9] uppercase -tracking-[0.01em] mt-10"
          style={{ fontFamily: DISPLAY_FF }}
        >
          The original building
        </h3>
        <p className={BODY_DARK}>
          The fortress was commissioned in <strong className="text-[#F1F5F9]">1557</strong>{" "}
          by King João III as an Atlantic coastal defense against
          English and Barbary corsair raids. Construction continued
          through the 17th century, including major expansion under
          João IV during the Portuguese Restoration War against
          Spain. The basic pentagonal plan — bastions, dry moat,
          seaward-facing artillery platforms — reads as standard
          Iberian post-medieval military architecture. Through the
          18th and 19th centuries the fortress served as a military
          barracks, later as a temporary holding facility for
          colonial-era prisoners transported to and from African
          Portuguese territories.
        </p>

        <h3
          className="font-display text-[22px] leading-tight text-[#F1F5F9] uppercase -tracking-[0.01em] mt-10"
          style={{ fontFamily: DISPLAY_FF }}
        >
          1934: conversion to political prison
        </h3>
        <p className={BODY_DARK}>
          In <strong className="text-[#F1F5F9]">1934</strong>, eight
          years into the Salazar regime, the fortress was converted
          into the <strong className="text-[#F1F5F9]">Estado Novo</strong>'s
          primary installation for political prisoners. The{" "}
          <strong className="text-[#F1F5F9]">PIDE</strong> — Polícia
          Internacional e de Defesa do Estado, the regime's secret
          police — used Peniche to detain, interrogate, and hold
          opponents of the regime for the next forty years. The
          detainees included:
        </p>
        <ul className={`${BODY_DARK} list-disc pl-6 space-y-3 max-w-2xl`}>
          <li>
            <strong className="text-[#F1F5F9]">Portuguese Communist
            Party leaders and cadres</strong> — the party was banned
            and operated underground; PCP organizing was the regime's
            principal target.
          </li>
          <li>
            <strong className="text-[#F1F5F9]">Trade-union organizers</strong>{" "}
            from the industrial belts around Lisbon and Porto.
          </li>
          <li>
            <strong className="text-[#F1F5F9]">Anti-colonial-war resisters</strong>{" "}
            — soldiers who refused to fight in Angola, Mozambique, and
            Guinea-Bissau, and civilians who organized against the
            wars.
          </li>
          <li>
            <strong className="text-[#F1F5F9]">Journalists, writers,
            academics</strong> — anyone the regime's censorship
            apparatus identified as a threat.
          </li>
        </ul>
        <p className={BODY_DARK}>
          Torture was documented. Deaths were documented. The Peniche
          regime of solitary confinement cells — the notorious{" "}
          <em>segredo</em> wing — was specifically designed to break
          political prisoners through isolation, and did so. The
          museum at the fortress today displays the cells, the
          interrogation rooms, and the names of the people held in
          them.
        </p>

        <h3
          className="font-display text-[22px] leading-tight text-[#F1F5F9] uppercase -tracking-[0.01em] mt-10"
          style={{ fontFamily: DISPLAY_FF }}
        >
          1960: the escape
        </h3>
        <p className={BODY_DARK}>
          On <strong className="text-[#F1F5F9]">3 January 1960</strong>,
          ten PCP prisoners — including party general secretary{" "}
          <strong className="text-[#F1F5F9]">Álvaro Cunhal</strong> —
          escaped the fortress through a tunnel-and-rope operation
          that had been prepared in secret for months. The escape
          involved bribing guards, tunneling through a basement wall
          into a sewer that exited at the fortress's outer ditch, and
          lowering the prisoners down the fortress's seaward wall on
          ropes to waiting boats. The escape was one of the
          <strong className="text-[#F1F5F9]"> Cold War's famous
          European prison breaks</strong>. Cunhal reached Moscow via
          France and Romania; he continued leading the PCP from
          exile until the 1974 Carnation Revolution, when he returned
          to Portugal and served in the post-dictatorship
          governments. The escape is dramatized in several Portuguese
          books and in the 2016 film <em>O Muro</em>. It is the
          defining Peniche story of the 20th century.
        </p>

        <h3
          className="font-display text-[22px] leading-tight text-[#F1F5F9] uppercase -tracking-[0.01em] mt-10"
          style={{ fontFamily: DISPLAY_FF }}
        >
          The museum today
        </h3>
        <p className={BODY_DARK}>
          The Fortaleza opened as a museum of Portuguese political
          resistance in <strong className="text-[#F1F5F9]">1984</strong>,
          ten years after the Carnation Revolution. The current
          installation — the <strong className="text-[#F1F5F9]">Centro
          Nacional de Resistência e Liberdade</strong> (CNRL,
          established 2017) — is the main institutional home for
          Portugal's ongoing accounting of the Estado Novo. Admission
          is €5; it closes on Mondays. A visitor who is interested in
          20th-century European political history — not just the
          Portuguese side of it — should plan two to three hours here.
          The specific cells, the interrogation apparatus, the
          prisoner testimony recordings, the tunnel through which
          Cunhal escaped — all are preserved and interpreted. It is
          not a comfortable museum. It is an important one.
        </p>
      </div>
    </Section>
  );
}

// ============================================================================
// ZONES
// ============================================================================

function ZonesSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const litoral = pickImage(bundle.meta, "litoral");
  const zones: Zone[] = bundle.showcase.zones ?? [];

  return (
    <Section id="zones" className={CREAM} width="wide">
      <SectionHeader
        eyebrow="· Four Parts of the Peninsula"
        title="Supertubos, Baleal, the Old Town, Cabo Carvoeiro"
        kicker="Peniche looks compact on a map. On the ground it's four distinct places with four different purposes — and most visitors only see one or two of them."
      />

      {litoral && (
        <Figure
          image={litoral}
          size="wide"
          tier="B"
          caption="Jurassic limestone cliffs on the Peniche peninsula's outer coast — the geological feature that makes this a rocky headland rather than a sandy bay."
          className="mb-12"
        />
      )}

      <div className="grid gap-8 md:grid-cols-2">
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
              <div className="mt-4 border-l-2 border-[color:var(--beach-primary,#0A4D68)] pl-4">
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[color:var(--beach-primary,#0A4D68)] mb-1">
                  Local note
                </div>
                <p className={BODY_SM}>{z.notes}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}

// ============================================================================
// A DAY HERE
// ============================================================================

function DaySection({ bundle }: { bundle: LegendaryPageBundle }) {
  const day = bundle.showcase.day_in_time;
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
        title="What's happening at six a.m. and what's happening at ten p.m."
      />

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
        title="Eight points from 1557 to 2009"
        kicker="The peninsula's shape was set by the Lisbon earthquake. Its fortress was built against English pirates and repurposed against Portuguese dissidents. Its current identity was set by one WSL booking decision in 2009."
      />

      <ol className="space-y-10 border-l-2 border-[#CBD5E1] pl-8">
        {events.map((ev, i) => {
          const tag = [
            String(ev.year),
            ev.month ? monthName(ev.month) : null,
            ev.event_type,
          ]
            .filter(Boolean)
            .join(" · ");
          return (
            <li key={`${ev.year}-${i}`} className="relative">
              <span
                className="absolute -left-[35px] top-2 w-3 h-3 rounded-full"
                style={{ backgroundColor: "var(--beach-primary, #0A4D68)" }}
              />
              <div className={`${EYEBROW} mb-2`}>{tag}</div>
              <h3 className={`${H3} mb-2`}>{ev.title}</h3>
              <p className={BODY_SM}>{ev.description}</p>
              {ev.wiki_url && (
                <a
                  href={ev.wiki_url}
                  target="_blank"
                  rel="noopener"
                  className="mt-2 inline-block text-xs font-mono uppercase tracking-wider text-[color:var(--beach-primary,#0A4D68)] underline decoration-dotted underline-offset-4 hover:no-underline"
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
// CULTURAL FOOTPRINT
// ============================================================================

function CulturalFootprintSection() {
  return (
    <Section id="culture" className={PAPER}>
      <SectionHeader
        eyebrow="· In the Culture"
        title="Three inheritances that shape a working town"
      />

      <div className="space-y-10">
        <article>
          <h3 className={`${H3} mb-4`}>
            Álvaro Cunhal and the 1960 escape
          </h3>
          <p className={BODY}>
            The single most-dramatized Peniche story is Cunhal's
            escape. It appears in Portuguese school textbooks, in at
            least half a dozen memoirs and novels (including Cunhal's
            own memoirs, written under the pseudonym Manuel Tiago),
            in the 2016 film <em>O Muro</em>, and in the ongoing
            curriculum of the Fortaleza museum. For a Portuguese
            person of the generation now aged 60+, the Peniche
            escape is a shared national memory; for younger
            Portuguese it is a history-class chapter. For a visitor
            from outside Portugal, it is the best entry point to
            understanding what the Estado Novo was and what it cost
            to oppose it.
          </p>
        </article>

        <article>
          <h3 className={`${H3} mb-4`}>
            Peniche bobbin lace — a 17th-century craft still practiced
          </h3>
          <p className={BODY}>
            Parallel to the surf and political-prison narratives,
            Peniche has been one of Portugal's two canonical
            <strong> bobbin-lace (renda de bilros)</strong> towns
            since the 17th century. The technique — where dozens of
            wound bobbins are manipulated by hand over a pinned
            pattern on a padded cushion — was brought to the coast
            from Flanders during the Iberian Union period and
            naturalized into Portuguese coastal women's craft work.
            The <strong>Escola de Rendas de Bilros</strong> in Peniche
            is one of the few institutional homes keeping the
            tradition active. The Museu de Peniche, inside the
            fortress, has a substantial lace collection. A small
            number of remaining workshops along Rua Alexandre
            Herculano still produce lace for sale; buyer respect for
            craft time and pricing is appropriate.
          </p>
        </article>

        <article>
          <h3 className={`${H3} mb-4`}>
            The surf era (2009–present) and Peniche as a global brand
          </h3>
          <p className={BODY}>
            Since the WSL booking in 2009, Peniche has been present
            in international surf media in a way no other Portuguese
            town — not even Nazaré — has been. The annual October
            event brings hundreds of international media workers to
            the town; the footage of Gabriel Medina, Filipe Toledo,
            Kelly Slater, John John Florence, Italo Ferreira
            competing at Supertubos has been watched by millions of
            people who could not have pointed to Portugal on a map
            five years earlier. The Portuguese tourism agency has
            leaned into this: <em>Visit Portugal</em> promotional
            material since roughly 2015 has featured Peniche and
            Ericeira as the country's "surf coast" almost as
            prominently as Lisbon and the Algarve. The effect on the
            town has been mixed — more outside capital, more
            housing pressure, a more anglophone-friendly hospitality
            scene, but also a level of economic resilience that the
            declining fishery alone would not sustain.
          </p>
        </article>
      </div>
    </Section>
  );
}

// ============================================================================
// BERLENGAS
// ============================================================================

function BerlengasSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const berlengas = pickImage(bundle.meta, "berlengas");

  return (
    <Section id="berlengas" className={CREAM} width="wide">
      <SectionHeader
        eyebrow="· The Berlengas"
        title="The UNESCO biosphere reserve ten kilometers offshore"
        kicker="Three small islands visible from the peninsula's cliffs on a clear day. Portugal's first nature reserve (1981) and a UNESCO Biosphere Reserve (2011). Permit-limited access by boat from the Peniche harbor."
      />

      {berlengas && (
        <Figure
          image={berlengas}
          size="wide"
          tier="B"
          caption="The Arquipélago das Berlengas — Berlenga Grande (the largest island, with the fortified 17th-century monastery), Estelas, and Farilhões. Some of the last breeding colonies of Atlantic seabirds on the Portuguese coast."
          className="mb-10"
        />
      )}

      <div className="space-y-6 max-w-3xl">
        <p className={BODY}>
          The <strong>Arquipélago das Berlengas</strong> is three
          small islands — Berlenga Grande (the main island), Estelas,
          and Farilhões — and the surrounding shallow banks, ten
          kilometers off the Peniche peninsula. Geologically, they
          are the exposed tops of a Precambrian granite ridge that
          runs under the sea between the mainland and the islands —
          remarkably ancient rock (roughly <strong>550 million
          years</strong>), among the oldest exposed in Portugal and a
          distinct lithology from the Jurassic limestone of the
          peninsula itself. The islands were never connected to the
          mainland during any Quaternary sea-level low, which has
          produced a fauna and flora with a significant share of{" "}
          <strong>endemic species</strong>.
        </p>

        <h3 className={`${H3} mt-6`}>What's protected</h3>
        <p className={BODY}>
          The Berlengas were designated a{" "}
          <strong>Portuguese natural reserve in 1981</strong> and
          elevated to a <strong>UNESCO Biosphere Reserve in 2011</strong>.
          The ecological highlights the protection is for:
        </p>
        <ul className={`${BODY} list-disc pl-6 space-y-3`}>
          <li>
            <strong>Bulwer's petrel</strong> breeding colony — one of
            the last significant Atlantic colonies of this pelagic
            seabird. Population ~500 pairs.
          </li>
          <li>
            <strong>Shag (European cormorant) colony</strong> — ~200
            pairs, the largest in mainland Portugal.
          </li>
          <li>
            <strong>Armeria berlengensis</strong> — the Berlengas
            thrift, a small flowering plant endemic to Berlenga
            Grande, found nowhere else.
          </li>
          <li>
            <strong>Shallow-water marine habitats</strong> — including
            some of the healthiest subtidal macroalgal forests on the
            Portuguese coast.
          </li>
        </ul>

        <h3 className={`${H3} mt-6`}>What's on Berlenga Grande</h3>
        <p className={BODY}>
          The main island has four things a visitor notices:
        </p>
        <ul className={`${BODY} list-disc pl-6 space-y-3`}>
          <li>
            <strong>The Forte de São João Baptista</strong> — a small
            17th-century island fortress, now operated as a basic
            guesthouse. Sleeping in the fort, surrounded by open
            Atlantic, is a specific experience you cannot replicate
            elsewhere on the Portuguese coast. Reservations open
            months ahead and fill.
          </li>
          <li>
            <strong>A marked walking loop</strong> around the island
            (~2 hours), including the Carreiro do Mosteiro viewpoint
            and the small lighthouse at the south end.
          </li>
          <li>
            <strong>One café-restaurant</strong> near the boat dock —
            limited menu, reasonable seafood, closes when the last
            return boat leaves.
          </li>
          <li>
            <strong>Snorkeling and diving sites</strong> off the
            island's shallow-water perimeter — the clearest Atlantic
            water in mainland Portugal; visibility 10–15 m on good
            days. Several licensed dive operators run trips from
            Peniche harbor.
          </li>
        </ul>

        <ClusterAside>
          How to actually book a Berlengas boat trip — which operator,
          how the permit system works, what to bring for the crossing,
          and the two-or-three-hour vs overnight decision — is in{" "}
          <ClusterLink to="berlengas" />.
        </ClusterAside>
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
      distance: "50 km north",
      blurb:
        "The big-wave capital. The opposite of Peniche's high-performance beach-break world: Nazaré is canyon-driven 20-meter waves, tow-in surfing, and a 900-year fishing village. Together the two towns are Portugal's surf coast.",
      href: "/beaches/praia-do-norte-6",
    },
    {
      name: "São Martinho do Porto",
      distance: "40 km north",
      blurb:
        "The almost-perfectly-circular calm-water bay — the Silver Coast family beach. The opposite end of the Atlantic-exposure spectrum from Supertubos. Ten kilometers south of Nazaré; ideal for a mid-coast rest day.",
      href: "/beaches/sao-martinho-do-porto",
    },
    {
      name: "Óbidos",
      distance: "25 km east",
      blurb:
        "The walled medieval town given as a wedding gift by King Dinis to his queen in the 13th century. Walk the ramparts; drink ginjinha in a chocolate cup. 15 minutes from Peniche; the default rainy-day destination.",
      href: null,
    },
    {
      name: "Ericeira",
      distance: "50 km south",
      blurb:
        "Europe's first **World Surfing Reserve** (designated 2011) — a 4 km stretch of coast with seven consecutive quality surf breaks. The other Portuguese surf town, with a different character: Ericeira is a village of narrow streets and family restaurants; Peniche is a larger working harbor.",
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
                  className="hover:text-[color:var(--beach-primary,#0A4D68)] transition-colors"
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
// SPOKES + PROVENANCE
// ============================================================================

function SpokeFooter() {
  const spokes = [
    {
      slug: "surfing",
      label: "Surfing Peniche",
      subtitle:
        "Which break for which level, why Supertubos barrels, the MEO Rip Curl Pro week as a visitor, the Baleal surf-camp inventory, and the Ericeira comparison.",
    },
    {
      slug: "visiting",
      label: "Visiting Peniche",
      subtitle:
        "Getting from Lisbon (95 km), where to stay, what to eat, and the Fortaleza as a serious afternoon.",
    },
    {
      slug: "berlengas",
      label: "The Berlengas",
      subtitle:
        "How to book the permit-limited boat trip, what the bird colony and the 17th-century fortress are actually like, and whether the overnight stay in the fort is worth it.",
    },
  ];
  return (
    <Section id="spokes" className={PAPER} width="wide">
      <div className={`${EYEBROW} mb-6`}>· Go Deeper</div>
      <h2
        className={`${H2} mb-12 max-w-3xl`}
        style={{ fontFamily: DISPLAY_FF }}
      >
        Three pages for three ways in
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {spokes.map((s) => (
          <a
            key={s.slug}
            href={`/beaches/peniche/${s.slug}`}
            className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#0A4D68)] transition-colors"
          >
            <h3
              className={`${H3} mb-3 group-hover:text-[color:var(--beach-primary,#0A4D68)]`}
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
          Historical material on the Fortaleza and the 1960 escape
          follows the Centro Nacional de Resistência e Liberdade's
          published curriculum and Cunhal's own memoirs (published
          under the pseudonym Manuel Tiago). Fishery statistics from
          the Portuguese Directorate-General for Natural Resources
          (DGRM). Surf-event history from WSL records. Berlengas
          ecological data from ICNF and the UNESCO Biosphere Reserve
          documentation. Images from Wikimedia Commons, per-image
          attribution in meta.json. Version v0.9. Corrections
          welcome, particularly on current boat-operator status to
          the Berlengas and on the lace-workshop inventory.
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function PenichePage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta, data } = bundle;
  const location = [data.admin_level_1, data.country_code]
    .filter(Boolean)
    .join(", ");

  const primary = meta.images.hero;
  const secondary =
    pickImage(meta, "supertubos_wave") ??
    pickImage(meta, "peninsula") ??
    undefined;

  return (
    <LegendaryShell composition={composition}>
      <Hero
        beachName={composition.beach_name}
        location={location}
        tagline="Portugal's surf capital, built around a 16th-century fortress that Salazar used as his most-feared political prison."
        heroType="LAYERED"
        primary={primary}
        secondary={secondary}
        version={composition.version}
        tier={composition.tier}
      />

      <ClusterRail current="main" beachName={composition.beach_name} />

      <PenicheStory bundle={bundle} />
      <SupertubosSection bundle={bundle} />
      <FortalezaSection bundle={bundle} />
      <ZonesSection bundle={bundle} />
      <DaySection bundle={bundle} />
      <TimelineSection bundle={bundle} />
      <CulturalFootprintSection />
      <BerlengasSection bundle={bundle} />
      <NearbySection />
      <SpokeFooter />
      <PageProvenance bundle={bundle} />
    </LegendaryShell>
  );
}
