/**
 * Copacabana — bespoke Tier 1 page. Legendary v2.
 *
 * Thesis:
 *   "The beach the world imagines when it imagines a beach. Most of what
 *    the world imagines is wrong. The real place is the better story."
 *
 * Fifth and final Tier 1 under the v2 design language. Tests the last
 * untried combination: ROMANTIC voice register + CLASSICAL display
 * pairing (DM Serif Display, same as Waikīkī and Brighton). The
 * cultural-ubiquity spike is unique in the Tier 1 set: Nazaré's spike
 * is physical (the canyon), Waikīkī's is political (the overthrow),
 * Brighton's is place-anatomy (two piers), Bondi's is origin-of-a-sport
 * (surf lifesaving). Copa's is reputation itself — the beach whose
 * spike is being famous.
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
} from "./copa/shared";

// ============================================================================
// STORY
// ============================================================================

function CopaStory({ bundle }: { bundle: LegendaryPageBundle }) {
  const paragraphs = [
    "Copacabana is the beach the rest of the world imagines when it imagines a beach, and it deserves that reputation and also undermines it in ways only Cariocas fully understand. Most of what the world imagines was assembled over a hundred years from a 1923 hotel, a 1933 Hollywood film, a 1940 Manhattan nightclub, a 1962 bossa nova recording, a 1970 Portuguese-mosaic redesign, and a 1978 Barry Manilow song that was about the nightclub, not the beach. The real place is the better story.",
    "The beach itself is **four kilometers of sand** arcing between two headlands — **Leme** at the north, the **Forte de Copacabana** at the south — with a wall of white buildings behind it, and behind them, the granite peaks that make Rio one of the only cities on Earth where mountain and ocean meet mid-neighborhood. Cristo Redentor is visible from the sand if you know where to look. At midday in February the sand reaches 60°C and children run on it and adults don't.",
    "Copa does **mass occasions** better than any beach on Earth. Two to three million people gather here every New Year's Eve dressed in white — a Yemanjá tradition borrowed from Candombl é. Pope Francis drew 3.7 million at World Youth Day in 2013. Madonna drew 1.6 million in 2024. Lady Gaga drew 2.1 million in 2025. On 30 December 2025, **Guinness certified Copacabana's Réveillon as the world's largest New Year's Eve celebration**. No other beach on Earth hosts this kind of night at this scale and does so reliably, year after year.",
    "And Copa does **ordinary mornings**. An old man with a metal detector works the tide line at 5 a.m. The colônia de pescadores at Posto 6 pulls nets in. Runners, swimmers, surfers, kiosk baristas opening the day. A beach this famous does not need to do anything to be itself. It is already happening.",
  ];

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
            color: var(--beach-primary, #1A1A1A);
          }
        `}</style>

        <PullQuote size="hero">
          The beach the world imagines when it imagines a beach. Most of
          what the world imagines is wrong. The real place is the better
          story.
        </PullQuote>
      </div>
    </section>
  );
}

// ============================================================================
// THE CALÇADÃO — spike explainer
// ============================================================================

function CalcadaoSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const mosaic = pickImage(bundle.meta, "mosaic");
  const detail = pickImage(bundle.meta, "mosaic_detail");
  const preExpansion = pickImage(bundle.meta, "pre_expansion");

  return (
    <Section id="calcadao" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· The Calçadão"
        title="Burle Marx's 1970 wave — four kilometers where no stretch repeats"
        kicker="The Portuguese-mosaic pavement that is now the single most recognizable image of Copacabana — the black-and-white wave running the length of the beach — is a specific design by a specific landscape architect commissioned for a specific 1970 land-reclamation project. It is 55 years old as a continuous form, not a centuries-old tradition."
      />

      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
        <div className="space-y-6">
          <h3 className={H3}>Before 1970 — a narrower beach</h3>
          <p className={BODY}>
            Until <strong>1970</strong> the Copacabana beach was
            roughly <strong>half its current width</strong>. Historic
            photographs from 1916 — preserved at the Instituto Moreira
            Salles — show waves breaking almost against the foundations
            of the buildings along what is now Avenida Atlântica. The
            promenade existed as a narrow sidewalk; it carried
            Portuguese-style black-and-white mosaic pavement (the{" "}
            <em>calçada portuguesa</em> tradition that arrived with
            19th-century Portuguese municipal engineers) but the
            pattern was a generic diamond-and-diamond scheme not
            specific to Copacabana.
          </p>

          {preExpansion && (
            <Figure
              image={preExpansion}
              size="wide"
              tier="B"
              datePrefix="1916"
              caption="Copacabana before 1970 — a much narrower beach, the Atlantic reaching almost to the building line. The 1970 land-reclamation project nearly doubled the sand and created the continuous promenade that Burle Marx was commissioned to redesign."
            />
          )}

          <h3 className={`${H3} mt-6`}>The 1970 reclamation</h3>
          <p className={BODY}>
            The <strong>1970 project</strong>, under Rio's then-military-
            government municipal administration, dredged the bay and
            extended the beach seaward by roughly{" "}
            <strong>50 meters</strong> — almost doubling the sand. The
            reclaimed zone created the conditions for a continuous
            4-km promenade with setback, landscaping, and — crucially
            — a wider paved surface than the pre-1970 sidewalk had
            allowed. The city commissioned{" "}
            <strong>Roberto Burle Marx</strong> (1909–1994) — the
            Brazilian landscape architect best known internationally
            for the Parque do Flamengo in Rio and for extensive work
            at Brasília — to design the new paving.
          </p>

          <h3 className={`${H3} mt-6`}>The wave pattern</h3>
          <p className={BODY}>
            Burle Marx's solution was a{" "}
            <strong>scale-shifting wave pattern</strong> running the
            entire four kilometers, executed in the Portuguese
            black-basalt-and-white-limestone mosaic tradition. The
            design's formal innovation: the wave's <strong>amplitude,
            wavelength, and orientation shift continuously along the
            beach</strong>, so that no specific 50-meter stretch
            repeats any other. Some sections have tight dense waves;
            others have long slow swells; the pattern near the
            Copacabana Palace runs at a different scale than the
            pattern at Posto 6 near the Fort. A visitor walking from
            Leme to the Forte experiences a single continuous design
            that is nonetheless different under your feet every few
            steps.
          </p>

          {mosaic && (
            <Figure
              image={mosaic}
              size="wide"
              tier="B"
              caption="The Calçadão — Burle Marx's 1970 wave design. The pattern shifts in amplitude and scale across the 4 km length; no 50-meter stretch repeats any other exactly."
            />
          )}

          <p className={BODY}>
            The paving is <strong>hand-laid</strong>. Each stone — the
            individual black-basalt cobbles and white-limestone cobbles
            are each roughly 5 cm across — is placed by hand by a team
            of Portuguese-tradition paviours called{" "}
            <em>calceteiros</em>. Rio's Prefeitura maintains a
            permanent team of approximately 40 calceteiros whose full-
            time job is Calçadão maintenance: lifted stones are
            reset, cracked stones replaced, entire sections
            occasionally rebuilt after heavy storm damage or
            subsurface work. The craft is disappearing in Portugal
            itself; Rio is one of the last places in the world where
            it is still practiced at scale.
          </p>

          {detail && (
            <Figure
              image={detail}
              size="wide"
              tier="B"
              caption="Calçadão detail. Each stone is roughly 5 cm across; the black cobbles are basalt, the white are limestone. The pattern is hand-laid and hand-maintained by a permanent municipal team of paviours (calceteiros)."
            />
          )}

          <p className={BODY}>
            The Calçadão is now <strong>the single most-recognizable
            single image of Copacabana</strong> in global visual
            culture — more so than the hotel, more so than the arc of
            the beach itself. It appears in every wedding photo, every
            tourism campaign, every film shot on location at the
            beach. Its status is unusual among public-works-era
            designs: most 1970 municipal-landscape commissions of
            comparable ambition have been partially or fully
            reconstructed. The Calçadão is exactly as Burle Marx
            specified it, fifty-five years later.
          </p>

          <ClusterAside>
            The full technical treatment of the Calçadão — the
            municipal calceteiros program, the pattern's mathematical
            structure, the 2016 Olympics-era conservation effort — is
            in <ClusterLink to="visiting" />.
          </ClusterAside>
        </div>

        <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
          <div className={`${EYEBROW} mb-5`}>· The Calçadão</div>
          <dl className="space-y-5">
            <Fact label="Length" value="4 km continuous" />
            <Fact label="Designed" value="1970" />
            <Fact label="Architect" value="Roberto Burle Marx" />
            <Fact label="Stone type" value="Basalt + limestone" />
            <Fact label="Individual stone size" value="~5 cm" />
            <Fact label="Municipal calceteiros" value="~40 full-time" />
            <Fact label="Pre-1970 beach width" value="~45 m" />
            <Fact label="Post-1970 beach width" value="~90 m" />
          </dl>
        </aside>
      </div>
    </Section>
  );
}

// ============================================================================
// CULTURAL UBIQUITY — secondary explainer (the spike itself)
// ============================================================================

function UbiquitySection({ bundle }: { bundle: LegendaryPageBundle }) {
  const palace = pickImage(bundle.meta, "palace");
  const flying = pickImage(bundle.meta, "flying_down_poster");
  const historic = pickImage(bundle.meta, "historic_1971");

  return (
    <Section id="ubiquity" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· Cultural Ubiquity"
        title="How a Rio de Janeiro beach became the beach in the world's imagination"
        kicker="The global Copacabana — the one most non-Brazilians carry in their heads — is an assembly of six specific cultural artifacts, produced between 1923 and 1978, most of them outside Rio. The real Copacabana and the imagined Copacabana are different things. Both are interesting."
      />

      <div className="space-y-10 max-w-3xl">
        <article>
          <h3 className={`${H3} mb-4`}>1 · The Copacabana Palace, 1923</h3>
          <p className={BODY}>
            The <strong>Copacabana Palace Hotel</strong> opened on 13
            August 1923 as Rio's first attempt at a European-standard
            luxury hotel. Architect <strong>Joseph Gire</strong>
            (French, also designed the Glória Hotel) produced a
            Beaux-Arts white-stone building aimed at attracting
            European royalty and the trans-Atlantic steamship tourist
            class to Rio. It worked. The hotel's guest list through
            the 1920s and 30s included Edward and Mrs Simpson, Orson
            Welles, Errol Flynn, Marlene Dietrich, Ava Gardner, and
            effectively every interwar Hollywood figure passing
            through South America. By 1935 the hotel had become
            synonymous with the beach behind it. The brand
            "Copacabana" — in any language, in any medium — traces
            largely to this one hotel.
          </p>
          {palace && (
            <Figure
              image={palace}
              size="wide"
              tier="B"
              caption="The Copacabana Palace — opened 1923, still operating as a Belmond luxury hotel. The white Beaux-Arts building that defined the beach's global brand."
              className="mt-6"
            />
          )}
        </article>

        <article>
          <h3 className={`${H3} mb-4`}>2 · Flying Down to Rio, 1933</h3>
          <p className={BODY}>
            <strong>RKO Pictures</strong>'s 1933 musical{" "}
            <em>Flying Down to Rio</em> — Fred Astaire and Ginger
            Rogers's first screen pairing — was a major Hollywood hit
            whose climactic "Carioca" number featured dancers on an
            airplane wing "flying down to Rio." The film was{" "}
            <strong>not shot on location</strong>; virtually all of it
            was filmed at RKO's Hollywood studio with painted
            backdrops and model airplanes. The film's image of Rio —
            glamorous, aerial, sun-soaked, faintly absurd — was
            effectively invented for the American audience. It was
            the single most-viewed film about Rio for an entire
            generation. When mid-century Americans said "Rio" or
            "Copacabana," they often meant what they had seen in
            Flying Down to Rio; what they were imagining was a
            Hollywood set.
          </p>
          {flying && (
            <Figure
              image={flying}
              size="wide"
              tier="B"
              datePrefix="1933"
              caption="Flying Down to Rio poster. The film was a Hollywood product end-to-end; the Rio it showed was painted-backdrop Rio. Its influence on the global imagination of Copacabana nonetheless exceeded most actual Rio productions of the era."
              className="mt-6"
            />
          )}
        </article>

        <article>
          <h3 className={`${H3} mb-4`}>3 · The Copacabana Nightclub, Manhattan, 1940</h3>
          <p className={BODY}>
            In <strong>November 1940</strong>, a nightclub opened at
            10 East 60th Street in Manhattan under the name{" "}
            <strong>Copacabana</strong>. It had no institutional
            connection to the Rio beach of the same name; the name
            was chosen by promoter <strong>Monte Proser</strong>{" "}
            because it evoked tropical-exotic glamour in the American
            imagination. The club became one of the key New York
            nightclubs of the 1940s–60s, hosting Frank Sinatra, Dean
            Martin, Sammy Davis Jr., and the early American careers
            of Brazilian performers including Carmen Miranda. Its
            decor — Brazilian-tropical-pastiche — bore no more
            resemblance to actual Rio than Flying Down to Rio had;
            but it was wildly successful, and it exported the word
            "Copacabana" into American colloquial English as a
            synonym for "tropical nightclub." This exportation is the
            root cause of the next artifact's confusion.
          </p>
        </article>

        <article>
          <h3 className={`${H3} mb-4`}>4 · "Copacabana (At the Copa)," Barry Manilow, 1978</h3>
          <p className={BODY}>
            <strong>Barry Manilow</strong>'s 1978 single{" "}
            <em>Copacabana (At the Copa)</em> — written with Jack
            Feldman and Bruce Sussman — is, after fifty years, among
            the most-recognized Copa-associated cultural artifacts
            globally. The song is specifically about the{" "}
            <strong>Manhattan nightclub</strong>, not the Rio beach.
            Its narrative — Lola, the showgirl; Tony, the bartender;
            Rico, who shot Tony — is set explicitly "at the Copa" on
            "the hottest spot north of Havana," which is to say:
            Manhattan at 60th Street. The confusion is nonetheless
            widespread. Large numbers of non-Brazilian listeners
            assume the song is about the Rio beach; significant
            travel-marketing material leans on the ambiguity.
            Manilow himself has repeatedly clarified — in interviews
            and in the 1985 TV-film adaptation — that the song is
            New York, not Rio. The clarifications have not overcome
            the lyric's memetic momentum. "At the Copa, Copacabana"
            is, for most of the world, a Rio lyric that is not
            actually a Rio lyric.
          </p>
        </article>

        {historic && (
          <Figure
            image={historic}
            size="wide"
            tier="B"
            datePrefix="1971"
            caption="Copacabana in 1971, one year after the Calçadão redesign. The new promenade is visible; the beach is at its modern width. The cultural-ubiquity machinery that built the global Copa brand — the Palace, Flying Down to Rio, the Manhattan nightclub — was by this point already in place."
          />
        )}

        <article>
          <h3 className={`${H3} mb-4`}>
            5 · The 1962 Girl from Ipanema and the bossa nova era
          </h3>
          <p className={BODY}>
            The only cultural artifact on this list that is
            genuinely Rio, genuinely of the period, and genuinely
            about the beach-neighborhood culture is the{" "}
            <strong>bossa nova</strong> movement of 1958–63. The
            music — <strong>Antônio Carlos Jobim</strong>,{" "}
            <strong>João Gilberto</strong>,{" "}
            <strong>Vinícius de Moraes</strong>,{" "}
            <strong>Astrud Gilberto</strong> — was composed, rehearsed,
            and performed in the bars and clubs of Copacabana and
            Ipanema: the <em>Bottles' Alley</em> (Beco das Garrafas),
            the Veloso (now the Garota de Ipanema), the Zum-Zum, the
            Little Club. The 1962 Jobim / de Moraes composition
            <em> Garota de Ipanema</em> (Girl from Ipanema) was
            written about a specific teenage girl walking past the
            Veloso bar on her way to the beach, and the beach in
            question is genuinely the Rio beach. The 1964 Getz /
            Gilberto album carried the music globally. Bossa nova is
            Copa's only genuinely domestic contribution to its own
            global image.
          </p>
          <ClusterAside>
            Full treatment of the bossa nova era — the specific venues,
            the composition histories, the musicians, and why Copa was
            specifically the neighborhood a new Brazilian music got
            made in — is in <ClusterLink to="bossa" />.
          </ClusterAside>
        </article>

        <article>
          <h3 className={`${H3} mb-4`}>
            6 · The modern megaevents — 2013 onward
          </h3>
          <p className={BODY}>
            The final layer of the Copa global image is twenty-first-
            century: the Rio 2016 Olympic beach volleyball finals at
            Copacabana, the 2013 Pope Francis World Youth Day Mass
            drawing 3.7 million, the annual Réveillon NYE now
            Guinness-certified, Madonna's 2024 concert (1.6 million),
            Lady Gaga's 2025 concert (2.1 million). The 21st-century
            Copa identity is as <strong>the global mass-event
            venue</strong> — a beach that can reliably host 2–4
            million people in a single night, which almost no other
            beach on Earth can. This modern layer is distinct from
            the mid-century Hollywood / nightclub / Manilow layer.
            It is Rio doing Rio at scale, not Rio imported through
            American pastiche.
          </p>
        </article>
      </div>
    </Section>
  );
}

// ============================================================================
// ZONES — the six postos
// ============================================================================

function ZonesSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const sign = pickImage(bundle.meta, "posto_5_sign");
  const panorama = pickImage(bundle.meta, "panorama");
  const zones: Zone[] = bundle.showcase.zones ?? [];

  return (
    <Section id="zones" className={CREAM} width="wide">
      <SectionHeader
        eyebrow="· The Postos"
        title="Six numbered lifeguard stations, six social zones"
        kicker="Cariocas navigate Copacabana by its lifeguard-station numbers. 'Meet me at Posto 2' means something specific. So does Posto 6. The numbers are not just geographic — they are demographic."
      />

      {panorama && (
        <Figure
          image={panorama}
          size="wide"
          tier="B"
          caption="The Copacabana arc — Leme at the far right (Posto 1), the Forte de Copacabana at the far left (past Posto 6). Four kilometers end-to-end. The postos are numbered along the curve."
          className="mb-12"
        />
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
              <div className="mt-4 border-l-2 border-[color:var(--beach-primary,#1A1A1A)] pl-4">
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[color:var(--beach-primary,#1A1A1A)] mb-1">
                  Local note
                </div>
                <p className={BODY_SM}>{z.notes}</p>
              </div>
            )}
          </article>
        ))}
      </div>

      {sign && (
        <Figure
          image={sign}
          size="wide"
          tier="B"
          caption="A Posto sign — the concrete lifeguard station numbers are the Cariocas' reference grid for the beach. Every locals' meetup on Copa references a posto number."
          className="mt-10"
        />
      )}
    </Section>
  );
}

// ============================================================================
// A DAY HERE
// ============================================================================

function DaySection({ bundle }: { bundle: LegendaryPageBundle }) {
  const day = bundle.showcase.day_in_time;
  const fishermen = pickImage(bundle.meta, "fishermen_dawn");
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
        title="Five a.m. fishermen to three a.m. kiosks — how the beach breathes"
      />

      {fishermen && (
        <Figure
          image={fishermen}
          size="wide"
          tier="B"
          caption="Posto 6 at dawn — the colônia de pescadores (fishing colony) still pulls nets here, a hundred meters from luxury condominium lobbies. One of Rio's last working urban fishing communities."
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
// LIVING PRACTICE — kiosks, soccer, beach volleyball
// ============================================================================

function LivingPracticeSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const kiosk = pickImage(bundle.meta, "eat_kiosk");
  const soccer = pickImage(bundle.meta, "beach_soccer_night");
  const olympics = pickImage(bundle.meta, "olympic_2016");

  return (
    <Section id="living" className={CREAM} width="wide">
      <SectionHeader
        eyebrow="· What the Beach Is For"
        title="Kiosks, football, beach volleyball, Olympic sand"
        kicker="Beyond the postcard, Copacabana is a working piece of Rio infrastructure — a free outdoor living room, a sports venue, a food-and-drink strip, a stage. What Cariocas do here on an ordinary Tuesday is different from what the tourist day-trippers do on a Saturday, and both layers are genuine."
      />

      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
        <div className="space-y-6">
          <h3 className={H3}>The kiosks</h3>
          <p className={BODY}>
            Along the Avenida Atlântica side of the Calçadão, at
            intervals of roughly 100 meters, are the{" "}
            <strong>quiosques</strong> — small permanent beach kiosks
            running fresh coconut water, beer (Brahma or Antarctica,
            R$8–12 a bottle), caipirinhas (R$15–25), simple grilled
            food, and a handful of tables and chairs. They have been a
            feature of the beach since the 1970s and are regulated and
            licensed by the Prefeitura. In the 2010s the Prefeitura
            ran a redesign program to replace the old wooden kiosks
            with modern uniform kiosks; the redesign was controversial
            — Cariocas preferred the mismatched informal aesthetic —
            and later modifications have softened the uniformity.
            Approximately <strong>60 kiosks</strong> operate along the
            4 km of Copacabana; they are the beach's default social
            infrastructure.
          </p>

          {kiosk && (
            <Figure
              image={kiosk}
              size="wide"
              tier="B"
              caption="A Copacabana kiosk. The ~60 quiosques along the 4 km strip are the beach's social infrastructure — beer, caipirinha, coconut water, grilled food, chairs and tables facing the sand."
            />
          )}

          <h3 className={`${H3} mt-10`}>Beach football and the Brazilian rhythm</h3>
          <p className={BODY}>
            Copa has had permanent beach-football facilities since the
            1970s. In the evening hours — 5 p.m. through roughly 9 p.m.
            — the beach's sand-court zone near Posto 2 fills with pickup
            and organized football. <strong>Altinho</strong> (the
            keep-the-ball-in-the-air circle game using all body parts
            except hands) is the canonical Copa football discipline
            and is played in informal groups all along the beach on
            any weekend afternoon. <strong>Beach soccer</strong>{" "}
            (ordinary football, but on sand, with modified rules) has
            international-league competition hosted periodically at
            Copa; the Brazilian national beach-soccer team has won
            more FIFA Beach Soccer World Cups than any other country
            and most of its senior players trained at Copa or
            Ipanema.
          </p>

          {soccer && (
            <Figure
              image={soccer}
              size="wide"
              tier="B"
              caption="Beach soccer at night under the floodlights. The Copa football culture runs evening hours most days of the year, peaking in summer."
            />
          )}

          <h3 className={`${H3} mt-10`}>Olympic sand</h3>
          <p className={BODY}>
            The <strong>Rio 2016 Olympics</strong> hosted the beach
            volleyball tournament at Copacabana in a temporary
            10,000-seat stadium built on the sand between Posto 2 and
            Posto 3. The stadium was dismantled after the Games but
            the beach-volleyball culture it catalyzed has persisted.
            Permanent beach-volleyball courts are set up year-round
            on the sand; Brazilian beach-volleyball pairs are
            traditionally among the world's strongest, and many
            senior pairs train here in the off-season. A visitor can
            watch pickup or semi-competitive beach volleyball at
            Copa most weekend afternoons for free.
          </p>

          {olympics && (
            <Figure
              image={olympics}
              size="wide"
              tier="B"
              datePrefix="Aug 2016"
              caption="The Olympic beach-volleyball stadium at Copacabana during the 2016 Games. The 10,000-seat temporary structure on the sand between Posto 2 and Posto 3. The stadium came down; the culture of beach volleyball at Copa persisted."
            />
          )}
        </div>

        <aside className="lg:sticky lg:top-24 rounded-sm border border-[#E7E2D4] bg-white p-7">
          <div className={`${EYEBROW} mb-5`}>· Living Practice</div>
          <dl className="space-y-5">
            <Fact label="Active kiosks" value="~60" />
            <Fact label="Kiosks regulated since" value="1970s" />
            <Fact label="Beach football courts" value="permanent" />
            <Fact label="Altinho canonical since" value="1970s" />
            <Fact label="Rio 2016 volleyball" value="temporary 10K stadium" />
            <Fact label="Permanent volleyball courts" value="year-round" />
            <Fact label="Fishing colony (Posto 6)" value="continuous" />
          </dl>
        </aside>
      </div>
    </Section>
  );
}

// ============================================================================
// HISTORY — 7 turning points
// ============================================================================

const HISTORY_KEEP = new Set([1892, 1923, 1933, 1962, 1970, 2013, 2025]);

function TimelineSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const all: TimelineEvent[] = bundle.showcase.timeline ?? [];
  const events = all.filter((e) => HISTORY_KEEP.has(e.year)).slice(0, 7);

  return (
    <Section id="history" className={PAPER}>
      <SectionHeader
        eyebrow="· History"
        title="From a tunnel in 1892 to a Guinness certificate in 2025"
        kicker="Seven dates that made Copa Copa, in order. Each is a subdivision, continuation, or inflection of the beach the others built."
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
                style={{ backgroundColor: "var(--beach-primary, #1A1A1A)" }}
              />
              <div className={`${EYEBROW} mb-2`}>{tag}</div>
              <h3 className={`${H3} mb-2`}>{ev.title}</h3>
              <p className={BODY_SM}>{ev.description}</p>
              {ev.wiki_url && (
                <a
                  href={ev.wiki_url}
                  target="_blank"
                  rel="noopener"
                  className="mt-2 inline-block text-xs font-mono uppercase tracking-wider text-[color:var(--beach-primary,#1A1A1A)] underline decoration-dotted underline-offset-4 hover:no-underline"
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

function CulturalFootprintSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const jobim = pickImage(bundle.meta, "music_jobim");
  const nye = pickImage(bundle.meta, "nye");

  return (
    <Section id="culture" className={PAPER} width="wide">
      <SectionHeader
        eyebrow="· In the Culture"
        title="Three layers, sixty years"
      />

      <div className="space-y-12 max-w-3xl">
        <article>
          <h3 className={`${H3} mb-4`}>
            Bossa nova — 1958–1964
          </h3>
          <p className={BODY}>
            The bossa nova era is Copa's most enduring homegrown
            cultural export. Between 1958 (the <em>Chega de
            Saudade</em> album) and 1964 (the <em>Getz/Gilberto</em>
            album), a small community of Rio musicians invented — in
            the apartments, bars, and small-capacity clubs of the
            Copacabana-and-Ipanema neighborhoods — a fundamentally
            new Brazilian popular-music form. <strong>Antônio Carlos
            Jobim</strong>, <strong>João Gilberto</strong>,{" "}
            <strong>Vinícius de Moraes</strong>, and{" "}
            <strong>Astrud Gilberto</strong> are the canonical names;{" "}
            <strong>Carlos Lyra</strong>,{" "}
            <strong>Roberto Menescal</strong>,{" "}
            <strong>Nara Leão</strong>, and <strong>Baden Powell</strong>{" "}
            were the inner circle. The 1962 Jobim / de Moraes
            composition <em>Garota de Ipanema</em> (Girl from
            Ipanema) is now the second most-recorded song in
            popular-music history after "Yesterday."
          </p>
          {jobim && (
            <Figure
              image={jobim}
              size="wide"
              tier="B"
              caption="Antônio Carlos Jobim. The Copa-Ipanema bossa nova scene is Copacabana's single most durable cultural export — a musical form invented in a specific neighborhood over a specific 6-year window."
              className="mt-6"
            />
          )}
        </article>

        <article>
          <h3 className={`${H3} mb-4`}>
            Stefan Zweig — Brazil: A Land of the Future (1941)
          </h3>
          <p className={BODY}>
            The Austrian writer <strong>Stefan Zweig</strong>, having
            fled Nazi Europe, settled in Petrópolis near Rio in 1940
            and published <em>Brazil: A Land of the Future</em> in
            1941 — a book-length affectionate portrait of the country
            including a long chapter on Rio and Copacabana. Zweig's
            portrait is almost uncritically enthusiastic about
            Brazil's racial mixing, its informal democracy, its
            future potential — qualities he saw in stark contrast to
            the Europe he had just escaped. The book was translated
            widely and shaped a generation of European intellectual
            opinion about Brazil, and specifically about Rio's beach
            culture, as an aspirational-cosmopolitan alternative to
            fascist Europe. Zweig died by suicide in February 1942,
            seven months after the book's publication; his
            Petrópolis house is now the Stefan Zweig House Museum.
            The book and the author's death together became a
            particular kind of cultural footnote in Rio's mid-century
            European image.
          </p>
        </article>

        <article>
          <h3 className={`${H3} mb-4`}>
            Réveillon and the twenty-first-century mass events
          </h3>
          <p className={BODY}>
            Copa's modern cultural identity is as{" "}
            <strong>the world's premier mass-event venue</strong>.
            The <strong>Réveillon</strong> — New Year's Eve — is the
            template. Cariocas have gathered at Copa on 31 December
            in large numbers since at least the 1940s; the practice
            of wearing white was borrowed from the Candomblé religion
            (offerings to Yemanjá, the orixá of the sea) in the mid-
            20th century; the fireworks on barges offshore became a
            municipal feature in the 1980s. Modern Réveillon
            attendance figures: <strong>2.5 million in 2015</strong>,
            <strong> 3 million in 2024</strong>. Guinness World Records
            formally certified the 2025 Réveillon as the world's
            largest NYE celebration in December 2025.
          </p>
          <p className={BODY}>
            The Réveillon has proven to be a template for other
            Copa mega-events: Pope Francis's 2013 World Youth Day
            Mass drew 3.7 million; the 2016 Olympic beach volleyball
            finals filled a 10,000-seat stadium every night for two
            weeks; Madonna's December 2024 free concert drew 1.6
            million; Lady Gaga's May 2025 free concert drew 2.1
            million. The pattern is consistent: Copa is the beach
            that can absorb a 1–3 million-person audience, feed them,
            host them, and return to normal by the next morning. Very
            few urban spaces on Earth have this logistical capacity;
            none is a beach.
          </p>
          {nye && (
            <Figure
              image={nye}
              size="wide"
              tier="B"
              caption="Réveillon — New Year's Eve at Copacabana. 2 to 3 million people dressed in white. Fireworks on barges offshore. Yemanjá offerings pushed out into the surf at midnight. Guinness-certified in 2025 as the world's largest New Year's Eve celebration."
              className="mt-6"
            />
          )}
          <ClusterAside>
            Full treatment of the Réveillon — the Yemanjá tradition,
            the logistics of a 3-million-person NYE, and how to
            actually be here that night — is in{" "}
            <ClusterLink to="reveillon" />.
          </ClusterAside>
        </article>
      </div>
    </Section>
  );
}

// ============================================================================
// HONEST CONTEXT — the favela above (dark)
// ============================================================================

function HonestContextSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const note = bundle.showcase.favela_note;
  const mirante = pickImage(bundle.meta, "context_mirante");
  if (!note) return null;
  const paragraphs = note.split("\n\n").filter(Boolean);

  return (
    <Section id="honest" className={DARK}>
      <div className="max-w-3xl">
        <div
          className="text-[11px] font-mono uppercase tracking-[0.3em] mb-4"
          style={{ color: "var(--beach-supporting, #F4F1EC)" }}
        >
          · The Hills Above
        </div>
        <h2 className={H2_DARK} style={{ fontFamily: DISPLAY_FF }}>
          The inequality is the view
        </h2>
        <p className="mt-5 text-lg italic text-[#94A3B8] font-serif">
          Luxury apartments facing the beach. Favela stairs climbing
          the hills behind them. The one contains the other in the
          same visual frame. This section is Copa's honest self-
          reckoning; the fuller treatment is in the Favela Above spoke.
        </p>
      </div>

      {mirante && (
        <Figure
          image={mirante}
          size="wide"
          tier="B"
          caption="The Mirante do Pavão-Pavãozinho — the public viewpoint at the top of the Plano Inclinado, looking down on Ipanema, Copa, Leme, and across to Sugarloaf. Most tourists never make it here."
          className="my-12"
        />
      )}

      <div className="space-y-6 max-w-3xl">
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
      name: "Ipanema & Leblon",
      distance: "adjoining south",
      blurb:
        "The two beaches south of Copa — Ipanema's Arpoador rock is 1 km south of Posto 6; Leblon is another 1.5 km past that. **Ipanema is the beach bossa nova was written about**; Leblon is the residential wealthy Rio's beach. Together the three — Copa, Ipanema, Leblon — are Rio's continuous 8 km South Zone shoreline. Do all three in a day.",
    },
    {
      name: "Pão de Açúcar (Sugarloaf)",
      distance: "3 km east",
      blurb:
        "The 396-meter granite monolith at the mouth of Guanabara Bay. The cable-car ride (1912 original, still running as the ** Bondinho do Pão de Açúcar** ) to the top is one of Rio's canonical non-beach experiences. Best at golden hour. 45 minutes total from Copa by bus.",
    },
    {
      name: "Cristo Redentor (Christ the Redeemer)",
      distance: "8 km west (by road)",
      blurb:
        "The 38-meter Art Deco statue atop Corcovado, 710 meters above Copa. Visible from the beach on most days. Reach by the cogwheel train from Cosme Velho (the historic route) or by van from Parque Lage. ~4 hours round-trip including travel. **Best visited at sunrise** to beat the afternoon clouds.",
    },
    {
      name: "Santa Teresa & Lapa",
      distance: "5 km west",
      blurb:
        "The two artsy hillside-and-downtown neighborhoods. **Santa Teresa** has the Bondinho tram, tiled artist studios, and views back toward Guanabara Bay. **Lapa** at the foot of the hill has the Escadaria Selarón tile staircase and the country's densest concentration of samba clubs — most nights of the week, from roughly 9 p.m. onward.",
    },
  ];
  return (
    <Section id="nearby" className={PAPER} width="wide">
      <SectionHeader
        eyebrow="· In the South Zone"
        title="Four places within thirty minutes"
      />
      <div className="grid gap-8 md:grid-cols-2">
        {places.map((p) => (
          <article
            key={p.name}
            className="rounded-sm border border-[#E2E8F0] bg-white p-7"
          >
            <div className={`${EYEBROW} mb-2`}>{p.distance}</div>
            <h3 className={`${H3} mb-3`}>{p.name}</h3>
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
      slug: "visiting",
      label: "Visiting Copa",
      subtitle:
        "Getting here, where to stay along the arc, what to eat at a kiosk, and the wider Rio itinerary a Copa trip fits inside.",
    },
    {
      slug: "reveillon",
      label: "Réveillon",
      subtitle:
        "The world's largest New Year's Eve — Yemanjá white clothing, the barge fireworks, and how to actually be here that night.",
    },
    {
      slug: "bossa",
      label: "Bossa Nova",
      subtitle:
        "The 1958–64 musical movement Copa's kiosks and clubs hosted: Jobim, Gilberto, Girl from Ipanema, the Beco das Garrafas.",
    },
    {
      slug: "favela",
      label: "The Favela Above",
      subtitle:
        "Cantagalo and Pavão-Pavãozinho, the UPP pacification arc, the Plano Inclinado elevator, and the inequality that is literally the view.",
    },
  ];
  return (
    <Section id="spokes" className={PAPER} width="wide">
      <div className={`${EYEBROW} mb-6`}>· Go Deeper</div>
      <h2 className={`${H2} mb-12 max-w-3xl`} style={{ fontFamily: DISPLAY_FF }}>
        Four pages for four ways in
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {spokes.map((s) => (
          <a
            key={s.slug}
            href={`/beaches/copacabana-7/${s.slug}`}
            className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#1A1A1A)] transition-colors"
          >
            <h3
              className={`${H3} mb-3 group-hover:text-[color:var(--beach-primary,#1A1A1A)]`}
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
          Calçadão technical detail follows the Instituto Moreira
          Salles photographic archive and the Prefeitura do Rio de
          Janeiro calceteiros program documentation. Bossa nova
          historical material from Ruy Castro's <em>Chega de Saudade</em>{" "}
          (Companhia das Letras, 1990) — the canonical Brazilian
          bossa nova history. Réveillon attendance figures from the
          Riotur / Prefeitura records and Guinness World Records
          certification (December 2025). UPP pacification material
          from the Instituto de Segurança Pública do Rio de Janeiro
          and contemporary Brazilian press coverage since 2009.
          Version v0.9. Corrections welcome, particularly from
          Cariocas on specific posto-culture detail and current-year
          kiosk operator changes.
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function CopaPage({
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
        tagline="The beach the world imagines when it imagines a beach. Most of what the world imagines is wrong. The real place is the better story."
        heroType="MONUMENT"
        primary={heroImage}
        version={composition.version}
        tier={composition.tier}
      />

      <ClusterRail current="main" beachName={composition.beach_name} />

      <CopaStory bundle={bundle} />
      <CalcadaoSection bundle={bundle} />
      <UbiquitySection bundle={bundle} />
      <ZonesSection bundle={bundle} />
      <DaySection bundle={bundle} />
      <LivingPracticeSection bundle={bundle} />
      <TimelineSection bundle={bundle} />
      <CulturalFootprintSection bundle={bundle} />
      <HonestContextSection bundle={bundle} />
      <NearbySection />
      <SpokeFooter />
      <PageProvenance bundle={bundle} />
    </LegendaryShell>
  );
}
