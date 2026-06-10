/**
 * Bondi — bespoke Tier 1 page. Legendary v2, revision 1.0.
 *
 * Thesis (spike):
 *   "Bondi is Australia's image of itself — one kilometer of sand that
 *    taught the world surf-lifesaving. The Gadigal land it sits on was
 *    never ceded. Both things are present-tense."
 *
 * Section palette: PAPER (spine) · COOL (middle) · DARK (Honest Context).
 * Display family: AUSTERE (Barlow Condensed). Voice: WRY.
 *
 * Aligned to docs/legendary/style-guide.md (2026-04-29). Drop-cap,
 * typography tokens, and three-background palette inherit from
 * `./nazare/shared`.
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
} from "./bondi/shared";

// ============================================================================
// STORY
// ============================================================================

function BondiStory() {
  const paragraphs = [
    "Bondi Beach is Australia's identity-image beach — a one-kilometer crescent of gold sand at Sydney's eastern edge where the city's apartment blocks end and the Pacific begins with almost no transition. This is where the Australian beach myth lives in its densest form: the lifesavers in their red-and-yellow caps, the Icebergs winter-swim club plunging into the ocean pool at the southern headland, the morning runners on the Bondi-to-Coogee coastal walk, and — overhead and underfoot — the cultural machinery that has made the word \"Bondi\" legible across the world.",
    "The beach is short by Australian standards. Only a kilometer from headland to headland. But it is wide — up to 90 meters of sand at low tide — and it curves almost perfectly, which is what makes it photograph so well. **Ben Buckler** at the north, **Mackenzie's Point** at the south. Above each sits a suburb that operates as a social zone the way Copacabana's *postos* do in Rio. Which rock you walk toward, which end of the sand you settle on, tells a local exactly what kind of day you are planning to have.",
    "Australia invented **surf lifesaving** — the organized, uniformed volunteer service that patrols beaches — at this beach in the first decade of the 20th century. The **Bondi Surf Bathers' Life Saving Club**, founded in 1906, is the oldest such club in the world. On the Sunday afternoon of 6 February 1938 — known ever since as **Black Sunday** — a series of rogue waves struck the crowded beach; three hundred people were rescued here in four hours and five drowned. Bondi Rescue, the Australian television program running since 2006 and syndicated into more than a hundred countries, has turned the lifeguards of this beach into global figures. The red-and-yellow flags, and the people in the caps between them, are the single most recognizable Australian image that is neither a kangaroo nor the Opera House.",
    "Bondi is on **Gadigal country**, unceded land of the Eora nation. Aboriginal rock engravings — kangaroos, marine animals, a whale — still exist on the cliff top at North Bondi, unmarked and accessible. The sand below them has not been reclaimed; it has been here since the Last Glacial Maximum. The Gadigal people were fishing, diving, and carving this headland for **at least 20,000 years** before Captain Cook sailed past in 1770. Australia's Bondi is 240 years old. The place it sits on is significantly older.",
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
            font-family: var(--display-family, var(--font-barlow-condensed));
            color: var(--beach-supporting, #0D3B5C);
          }
        `}</style>

        <PullQuote size="hero">
          Bondi is Australia's image of itself. It taught the world
          surf-lifesaving. The Gadigal land it sits on was never ceded.
          Both things are present-tense.
        </PullQuote>
      </div>
    </section>
  );
}

// ============================================================================
// SURF LIFESAVING — spike explainer
// ============================================================================

function LifesavingSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const historic = pickImage(bundle.meta, "historic_1937");
  const club = pickImage(bundle.meta, "surf_life_saving_club");
  const boats = pickImage(bundle.meta, "sls_boats_racing");

  return (
    <Section id="lifesaving" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· Surf Lifesaving"
        title="How one Sydney beach invented a global sport, a global uniform, and a global TV format"
        kicker="Australia invented surf lifesaving at Bondi in 1906. The red-and-yellow flags that now mark safe swimming on every English-speaking beach in the world — Cornwall to Cape Town to Kuta Beach — are an Australian export. The people who wear the caps at Bondi today are the lineal descendants of the volunteer watermen who trained on this sand a hundred and twenty years ago."
      />

      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
        <div className="space-y-6">
          <h3 className={H3}>Before 1906 — why the sport had to be invented</h3>
          <p className={BODY}>
            Daylight swimming at Bondi was illegal until <strong>1903</strong>.
            For most of the Victorian era, swimming in the ocean during
            daylight was prohibited in New South Wales on decency grounds;
            the ban was challenged publicly in 1902 by{" "}
            <strong>William Gocher</strong>, a newspaper editor who
            deliberately swam at Manly in midday and invited arrest. The
            law was amended in 1903 to permit daylight swimming if
            "neck-to-knee" costumes were worn. Within two years Bondi had
            become a mass-participation beach for the first time in its
            history.
          </p>
          <p className={BODY}>
            It was also immediately a <strong>drowning beach</strong>. The
            Pacific surf at Bondi is genuine Pacific surf — rip currents,
            shorebreak, outside sets — and the 1903–1906 weekend crowds
            had no clue. Published drowning figures for the Sydney
            eastern beaches in those years are not precise but were
            understood by contemporary Sydney press as an urgent public-
            safety problem. Local watermen — surfers, spear-fishers,
            beach residents — organized informal voluntary patrols.
          </p>
          <p className={BODY}>
            On <strong>21 February 1906</strong>, a group of these
            watermen formalized themselves as the{" "}
            <strong>Bondi Surf Bathers' Life Saving Club</strong>. It is
            the <strong>oldest surf lifesaving club in the world</strong>.
            The Bronte and Manly clubs followed within the same year.
            The sport — the volunteer-patrol model, the uniform, the
            reel-and-line rescue apparatus, the national competition
            circuit — expanded out from Bondi through the Sydney eastern
            beaches to the Australian national scheme that is now run by
            <strong> Surf Life Saving Australia</strong>. Approximately{" "}
            <strong>314 SLS clubs</strong> operate on the Australian coast
            today; Bondi's is number one in the register.
          </p>

          {club && (
            <Figure
              image={club}
              size="wide"
              tier="B"
              caption="The Bondi Surf Bathers' Life Saving Club building — the 1936 Art Deco clubhouse at the northern end of the beach. The 1906 founding predates the building by thirty years; the club originally met in the Pavilion and in temporary shelters."
            />
          )}

          <h3 className={`${H3} mt-10`}>6 February 1938 — Black Sunday</h3>
          <p className={BODY}>
            The defining single day in Bondi's surf-lifesaving history.
            On the afternoon of Sunday <strong>6 February 1938</strong>,
            with an estimated <strong>35,000 people on the sand</strong>,
            a series of three unusually large waves struck the central
            beach within a short period. The first wave washed a
            sandbank out from under the waders standing on it. The
            subsequent waves drove the panicked crowd back, then sucked
            a section of the shorebreak out to sea on the return. An
            estimated <strong>250–300 people</strong> were suddenly in
            the water at depths they could not manage.
          </p>
          <p className={BODY}>
            What happened in the following four hours is the origin
            event of modern surf rescue. Every Bondi SBLSC lifesaver on
            the beach, plus members of the Bondi Surf Club, North Bondi,
            Bronte, Tamarama, and Waverley clubs who had been watching
            from the shore or had raced in from adjacent beaches —
            roughly 80 volunteer rescuers total — went in. They pulled
            people out on reels and lines, on rescue tubes, and under
            their own arms. The final rescued count was roughly{" "}
            <strong>300 people</strong>. Five people drowned — all
            weak or non-swimmers who had been sucked too far out before
            the rescues could reach them.
          </p>
          <p className={BODY}>
            The immediate consequence was that surf lifesaving had
            demonstrated, in a single afternoon and on a beach already
            identified with the sport, a rescue capability no other
            country could match. The global press coverage of Black
            Sunday made the Australian surf-lifesaving system a point
            of national pride and exported the <strong>red-and-yellow
            cap</strong> and the <strong>swim-between-the-flags</strong>{" "}
            rule to other English-speaking coastlines. A generation of
            subsequent beach-safety infrastructure — everywhere from
            Cornish Coastguard RNLI beach lifeguards to the English-
            speaking Caribbean — descends directly from what happened
            at Bondi that Sunday afternoon.
          </p>

          {historic && (
            <Figure
              image={historic}
              size="wide"
              tier="B"
              datePrefix="1937"
              caption="Bondi in 1937, one year before Black Sunday. The Bondi Pavilion (1928) is visible center; the beach is at typical weekend-summer density. The volunteer surf lifesavers — in their red-and-yellow caps — had by this point been patrolling here every weekend for thirty-one years."
            />
          )}

          <h3 className={`${H3} mt-10`}>Modern operation — and Bondi Rescue</h3>
          <p className={BODY}>
            Bondi today is patrolled by <strong>two overlapping
            services</strong>. The <strong>volunteer surf lifesavers</strong>{" "}
            of the Bondi SBLSC (red-and-yellow caps, weekends October
            through April, unpaid) are the original 1906 institution.
            The <strong>professional lifeguards</strong> (blue caps,
            seven days a week year-round, paid employees of Waverley
            Council) were added in the 1990s as beach attendance grew
            beyond what a volunteer weekend patrol could safely cover.
            The two services work side by side; the lifeguards take
            point on weekday patrols, the volunteers dominate summer
            weekends and holiday periods.
          </p>
          <p className={BODY}>
            The <strong>Bondi Rescue</strong> television program —
            made by Cordell Jigsaw Productions, airing since 2006 on
            Network Ten, syndicated into more than 100 countries — has
            turned the professional lifeguards into global figures.
            The show follows the lifeguard team through real rescues,
            medical emergencies, and the chronic comedy of managing a
            beach that receives up to 40,000 visitors on a peak
            summer day. Across its run it has documented approximately{" "}
            <strong>4,500 rescues per year</strong> at Bondi — a
            number that predates the TV era and has remained broadly
            stable for decades. The show is a TV format that some
            critics have found exploitative of people's worst
            moments; it is also, internally, the best-documented
            public record of what lifeguarding at a major urban beach
            actually involves.
          </p>

          {boats && (
            <Figure
              image={boats}
              size="wide"
              tier="B"
              caption="Surf boat racing — an SLS competition discipline still contested at Bondi and around Australian beaches. The teak-hulled boats, the beach-start sprint into the surf, the return through shore break, are a direct inheritance from the rescue-boat practice the 1906 clubs used."
            />
          )}
        </div>

        <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
          <div className={`${EYEBROW} mb-5`}>· The Record</div>
          <dl className="space-y-5">
            <Fact label="Daylight swimming legalized" value="1903" />
            <Fact label="Bondi SBLSC founded" value="1906" />
            <Fact label="Black Sunday" value="6 Feb 1938" />
            <Fact label="Rescued on Black Sunday" value="~300" />
            <Fact label="Drowned on Black Sunday" value="5" />
            <Fact label="Bondi Rescue premiered" value="2006" />
            <Fact label="Rescues per year today" value="~4,500" />
            <Fact label="SLS clubs in Australia" value="~314" />
          </dl>
        </aside>
      </div>

      <ClusterAside>
        Full operational treatment — the volunteer/professional split,
        the specific rescue apparatus, what it takes to qualify, and
        the Bondi Rescue show as ethics and as training program — is in{" "}
        <ClusterLink to="lifesaving" />.
      </ClusterAside>
    </Section>
  );
}

// ============================================================================
// GADIGAL COUNTRY — secondary explainer
// ============================================================================

function GadigalSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const engraving = pickImage(bundle.meta, "emu_rock_engraving");

  return (
    <Section id="gadigal" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· Gadigal Country"
        title="What was here for sixty-five thousand years before this beach was a beach"
        kicker="Bondi is unceded Gadigal land. Aboriginal rock engravings still sit on the North Bondi clifftop — kangaroos, marine animals, a whale — accessible, unmarked, older than any European memory of this coast. The beach is two hundred and forty years old as a European place. What it sits on is significantly older."
      />

      <div className="space-y-6 max-w-3xl">
        <h3 className={H3}>Sixty-five thousand years</h3>
        <p className={BODY}>
          Aboriginal and Torres Strait Islander peoples have lived in
          what is now Australia for <strong>at least 65,000 years</strong>,
          possibly longer. The <strong>Gadigal</strong> (or Cadigal)
          people of the coastal strip between Bondi and what is now
          Sydney Harbour were one clan of the wider{" "}
          <strong>Eora Nation</strong> — a coastal grouping of related
          clans whose territory covered roughly the stretch of coast
          from Botany Bay north to Pittwater. The word{" "}
          <strong>Bondi</strong> itself is an anglicization of an Eora
          word — probably <em>boondi</em>, meaning either "water
          breaking over rocks" or "a place where a flight of nullas
          (throwing sticks) took place," depending on the elder you
          ask. Both readings are attested in 19th-century records.
        </p>

        {engraving && (
          <Figure
            image={engraving}
            size="wide"
            tier="B"
            caption="An Aboriginal rock engraving at North Bondi — one of several that still exist on the clifftop above the beach. The age of these specific engravings is not precisely dated but they are consistent with the ~1,500-year-old Sydney regional engraving tradition, which in turn is a continuation of a carving practice that goes back substantially further."
          />
        )}

        <h3 className={`${H3} mt-10`}>1788 and what followed</h3>
        <p className={BODY}>
          British colonization began in <strong>January 1788</strong>{" "}
          with the arrival of the First Fleet at Sydney Cove —{" "}
          <strong>seven kilometers west of this beach</strong>. The
          consequences for the Eora were catastrophic on a timeframe
          that has no parallel in most colonization histories.{" "}
          <strong>Within two years, smallpox had killed roughly half
          of the Eora population.</strong> Within five, the remaining
          Gadigal had been largely displaced from the harbour lands
          by settler occupation. The specific brutality of Australian
          colonization — the <strong>1788–1920s Frontier Wars</strong>,
          the <strong>Stolen Generations</strong> of government child
          removal (1910s–1970s), and the legal fiction of{" "}
          <em>terra nullius</em> ("empty land") that denied Aboriginal
          sovereignty until the <strong>1992 Mabo High Court
          decision</strong> — is documented in AIATSIS (the Australian
          Institute of Aboriginal and Torres Strait Islander Studies)
          and the National Museum of Australia.
        </p>
        <p className={BODY}>
          <strong>There was never a treaty.</strong> Australia is one
          of the only Commonwealth countries never to have concluded
          one with its Indigenous peoples. The 2017{" "}
          <strong>Uluru Statement from the Heart</strong> — a
          consensus document produced by a First Nations Constitutional
          Convention — requested three reforms: a constitutionally-
          recognized Voice (advisory body) to Parliament, a treaty-
          making Makarrata process, and a truth-telling commission. The
          October <strong>2023 referendum</strong> on the Voice
          specifically <strong>failed 60-40 against</strong>. The
          legal and political conversation about Indigenous
          sovereignty, land rights, and reconciliation is unfinished
          and ongoing.
        </p>

        <h3 className={`${H3} mt-10`}>What's here now</h3>
        <p className={BODY}>
          At Bondi specifically, Aboriginal presence did not disappear
          and is not invisible if you know what you are looking at.
          The <strong>rock engravings at the Ben Buckler clifftop</strong>{" "}
          are the most direct physical testimony — a half-dozen carved
          figures on a weathered sandstone platform, reached by a
          short walk north from the North Bondi SLSC, unsignposted
          because Waverley Council chose after community consultation
          to keep them so. The <strong>Bondi Rescue</strong>{" "}
          production team has Gadigal cultural consultants on
          retainer. <strong>Waverley Council formally acknowledged
          Bondi as Gadigal country</strong> in official proceedings
          in 2016; the acknowledgment is read before every Council
          meeting. The annual <strong>Yabun Festival</strong> on
          Gadigal land in central Sydney every January 26 (Invasion
          Day / Australia Day — the date itself is contested) is the
          largest ongoing public Aboriginal cultural event in the
          country.
        </p>

        <ClusterAside>
          Full Gadigal-and-Eora treatment — the specific clans, the
          Bondi rock engraving locations, the Uluru Statement arc and
          the 2023 referendum in detail, and how to visit an
          Australian beach that was never ceded — is in{" "}
          <ClusterLink to="gadigal" />.
        </ClusterAside>
      </div>
    </Section>
  );
}

// ============================================================================
// ZONES
// ============================================================================

function ZonesSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const crowd = pickImage(bundle.meta, "bondi_crowd");
  const zones: Zone[] = bundle.showcase.zones ?? [];

  return (
    <Section id="zones" className={CREAM} width="wide">
      <SectionHeader
        eyebrow="· The Three Ends"
        title="North, Central, South — each a different Bondi"
        kicker="One kilometer of sand, three named stretches, three different demographic and behavioral codes that every Sydney local reads at a glance."
      />

      {crowd && (
        <Figure
          image={crowd}
          size="wide"
          tier="B"
          caption="Central Bondi on a summer weekend. The red-and-yellow flags mark the lifeguarded swimming zone; the attendance can reach 40,000+ on the peak days of January."
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
              <div className="mt-4 border-l-2 border-[color:var(--beach-primary,#D9B66B)] pl-4">
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[color:var(--beach-primary,#B8913A)] mb-1">
                  Local note
                </div>
                <p className={BODY_SM}>{z.notes}</p>
              </div>
            )}
          </article>
        ))}
      </div>

      <ClusterAside>
        Practical logistics — getting from the CBD, where to stay, the
        6 km Bondi-to-Coogee coastal walk, and where to eat — are in{" "}
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
  const morning = pickImage(bundle.meta, "bondi_early_morning");
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
        title="Dawn runners to the Pavilion at night — hour by hour in January"
      />

      {morning && (
        <Figure
          image={morning}
          size="wide"
          tier="B"
          caption="Bondi early morning — the beach at roughly 6 a.m. before the summer crowds arrive. The Bondi-to-Bronte coastal path is busier at this hour than a non-local visitor expects."
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
// ICEBERGS & COASTAL WALK — living-practice section
// ============================================================================

function IcebergsSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const pool = pickImage(bundle.meta, "icebergs_pool");
  const view = pickImage(bundle.meta, "icebergs_view");
  const walk = pickImage(bundle.meta, "coastal_walk");
  const sculpture = pickImage(bundle.meta, "sculpture_by_sea");

  return (
    <Section id="icebergs" className={CREAM} width="wide">
      <SectionHeader
        eyebrow="· Icebergs and the Coastal Walk"
        title="The southern-end infrastructure that makes Bondi Bondi"
        kicker="Two institutions bracket the southern end of the beach: the Icebergs Club winter-swim ritual, founded 1929 and operating every Sunday of every winter since; and the Bondi-to-Coogee coastal walk, six kilometers of clifftop path that has been Sydney's most-used outdoor leisure infrastructure since it was formally connected in the 1990s."
      />

      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
        <div className="space-y-6">
          <h3 className={H3}>The Icebergs — since 1929</h3>
          <p className={BODY}>
            In 1929 a group of Bondi lifesavers decided they needed a
            way to keep their winter fitness up through the Australian
            off-season (May–September). They formed the{" "}
            <strong>Bondi Icebergs Winter Swimming Club</strong> and
            made a vow: a member must swim in the open-air sea pool
            at the southern end of the beach{" "}
            <strong>three out of every four Sundays, between May and
            September, for five consecutive years</strong>. If you
            miss one too many, you're out. The club has been running
            this structure continuously since 1929.
          </p>
          <p className={BODY}>
            The <strong>Icebergs pool</strong> itself — a concrete
            rock pool built into the southern headland below the club's
            1920s clubhouse, filled by Pacific swell washing over its
            seaward wall — is the beach's most-photographed single
            object. Turquoise against the black basalt, open-air,
            flooded daily by the incoming tide, it is publicly
            accessible for a modest admission fee outside club hours.
            Swimming laps in it while a winter swell crashes over the
            outer wall and sprays you is one of the genuinely unusual
            Australian-beach experiences.
          </p>
          {pool && (
            <Figure
              image={pool}
              size="wide"
              tier="B"
              caption="The Icebergs pool — concrete saltwater rock pool on the southern headland, flooded by every incoming tide. Publicly swimmable (modest admission) outside dedicated Icebergs Club hours."
            />
          )}

          <h3 className={`${H3} mt-10`}>The Icebergs Club and restaurant</h3>
          <p className={BODY}>
            The <strong>Icebergs Dining Room</strong> — the Italian
            restaurant that sits above the pool with floor-to-ceiling
            glass looking straight down into it and out to the ocean —
            is one of Sydney's half-dozen architecturally canonical
            restaurants. Opened in its current form 2002 after a
            substantial clubhouse renovation, run by chef{" "}
            <strong>Monty Koludrovic</strong> and group{" "}
            <strong>Maurice Terzini</strong>. The Italian menu is
            serious (antipasti, hand-made pasta, whole grilled fish
            from the market). Bookings open 30 days ahead and go fast.
            It is the closest thing Sydney has to a restaurant with a
            view of an ocean pool that was built by the lifesavers who
            invented the sport your evening is built around.
          </p>
          {view && (
            <Figure
              image={view}
              size="wide"
              tier="B"
              caption="The Icebergs Dining Room at golden hour — the floor-to-ceiling glass looks directly down into the pool and out past it to the Pacific. Opened in its current form in 2002; the building has been on the site since the 1920s clubhouse era."
            />
          )}

          <h3 className={`${H3} mt-10`}>The Bondi-to-Coogee coastal walk</h3>
          <p className={BODY}>
            The clifftop path from Bondi's south end — starting at
            the Icebergs Club — runs <strong>six kilometers south</strong>{" "}
            through Tamarama, Bronte, Clovelly, Gordons Bay, and ends
            at Coogee. It is one of the great short urban coastal
            walks in the world: rocky headlands, a half-dozen smaller
            beaches most visitors never see, a couple of genuine cliff
            dives, and — through the southern sections — views back
            north toward the distant Bondi crescent. Allow{" "}
            <strong>two to three hours</strong> at walking pace, plus
            time for a swim or two. A single bus route (the 400) runs
            the return from Coogee.
          </p>
          {walk && (
            <Figure
              image={walk}
              size="wide"
              tier="B"
              caption="The Bondi-to-Coogee coastal walk — 6 km of clifftop path through Tamarama, Bronte, and Clovelly. Sydney's most-used urban coastal walking infrastructure."
            />
          )}

          <h3 className={`${H3} mt-10`}>Sculpture by the Sea — every October</h3>
          <p className={BODY}>
            Since <strong>1997</strong>, the first three weeks of
            <strong> October</strong> convert the coastal walk between
            Bondi and Tamarama into the{" "}
            <strong>Sculpture by the Sea</strong> open-air exhibition —
            around a hundred sculptures installed along the clifftop
            by Australian and international artists, free to the
            public, 500,000+ visitors across its three-week run. It
            is one of the world's largest outdoor sculpture
            exhibitions by attendance. The works are commissioned,
            site-specific, and rotate yearly; some stay on permanent
            loan. If you are in Sydney in October, this is the
            genuine reason to come to Bondi that week.
          </p>
          {sculpture && (
            <Figure
              image={sculpture}
              size="wide"
              tier="B"
              caption="Sculpture by the Sea — the annual October exhibition running since 1997 along the Bondi-to-Tamarama coastal walk. Free, outdoor, ~100 works per year, ~500,000 visitors."
            />
          )}
        </div>

        <aside className="lg:sticky lg:top-24 rounded-sm border border-[#E7E2D4] bg-white p-7">
          <div className={`${EYEBROW} mb-5`}>· The Southern End</div>
          <dl className="space-y-5">
            <Fact label="Icebergs Club founded" value="1929" />
            <Fact label="Winter swim rule" value="3-of-4 Sundays" />
            <Fact label="Dining Room opened" value="2002" />
            <Fact label="Coastal walk distance" value="6 km" />
            <Fact label="Walk duration" value="2–3 hours" />
            <Fact label="Sculpture by the Sea founded" value="1997" />
            <Fact label="Sculptures per year" value="~100" />
            <Fact label="SxS annual visitors" value="~500,000" />
          </dl>
        </aside>
      </div>
    </Section>
  );
}

// ============================================================================
// HISTORY — seven turning points
// ============================================================================

const HISTORY_KEEP = new Set([-20000, 1788, 1882, 1906, 1929, 2006, 2023]);
// Note: Black Sunday is 1938; showcase JSON has the year wrong (1929).
// Using 1906 (SLS founding) + 1929 (Icebergs) to carry the early 20th c.;
// Black Sunday gets full treatment in Lifesaving section above.

function TimelineSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const all: TimelineEvent[] = bundle.showcase.timeline ?? [];
  const events = all.filter((e) => HISTORY_KEEP.has(e.year)).slice(0, 7);

  return (
    <Section id="history" className={PAPER}>
      <SectionHeader
        eyebrow="· History"
        title="From 20,000 BCE to the 2023 referendum"
        kicker="The seven dates that made Bondi Bondi, in order. Each is a subdivision, variation, or turning point on the beach the others produced."
      />

      <ol className="space-y-10 border-l-2 border-[#CBD5E1] pl-8">
        {events.map((ev, i) => {
          const y = ev.year < 0 ? `${-ev.year} BCE` : String(ev.year);
          const tag = [y, ev.month ? monthName(ev.month) : null, ev.event_type]
            .filter(Boolean)
            .join(" · ");
          return (
            <li key={`${ev.year}-${i}`} className="relative">
              <span
                className="absolute -left-[35px] top-2 w-3 h-3 rounded-full"
                style={{ backgroundColor: "var(--beach-supporting, #0D3B5C)" }}
              />
              <div className={`${EYEBROW} mb-2`}>{tag}</div>
              <h3 className={`${H3} mb-2`}>{ev.title}</h3>
              <p className={BODY_SM}>{ev.description}</p>
              {ev.wiki_url && (
                <a
                  href={ev.wiki_url}
                  target="_blank"
                  rel="noopener"
                  className="mt-2 inline-block text-xs font-mono uppercase tracking-wider text-[color:var(--beach-supporting,#0D3B5C)] underline decoration-dotted underline-offset-4 hover:no-underline"
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
  const pavilion = pickImage(bundle.meta, "pavilion");

  return (
    <Section id="culture" className={PAPER} width="wide">
      <SectionHeader
        eyebrow="· In the Culture"
        title="Three cultural objects Bondi put into the world"
      />

      <div className="space-y-12">
        <article>
          <h3 className={`${H3} mb-4`}>
            Bondi Rescue (2006–present) — the surf-lifeguard reality format
          </h3>
          <p className={BODY}>
            Since 2006 the television program <em>Bondi Rescue</em> has
            followed the Waverley Council professional lifeguards
            through their days at the beach — real rescues, real
            medical emergencies, the chronic comedy of managing an
            urban beach that receives up to 40,000 visitors on the
            peak Saturdays of January. The show is a straightforward
            documentary-style production — no contrived setups, no
            manufactured rivalries — and it has been syndicated into
            more than <strong>100 countries</strong>. The run is
            approaching two decades without a drop in viewership. The
            show's durability has become a study-object in itself: a
            straightforwardly useful public-information program
            (demonstrating beach-safety principles) that happens to
            function also as engaging television. The Bondi lifeguards
            who have been on the show since its first season — Bruce
            "Hoppo" Hopkins, Kerrbox, Maxi, Whippet, Hutchy — are
            recognizable figures across Australia and in English-
            speaking countries that pick up the syndication.
          </p>
        </article>

        {pavilion && (
          <Figure
            image={pavilion}
            size="wide"
            tier="B"
            caption="The Bondi Pavilion — opened 1928, refurbished 2022. The Beaux-Arts beachfront building that carried the community-hall, changing-room, and public-entertainment functions for a century and that still does, post-restoration."
          />
        )}

        <article>
          <h3 className={`${H3} mb-4`}>
            Puberty Blues (1981) — the Australian beach novel
          </h3>
          <p className={BODY}>
            <strong>Kathy Lette</strong> and <strong>Gabrielle Carey</strong>'s
            1979 novel <em>Puberty Blues</em> — filmed by{" "}
            <strong>Bruce Beresford</strong> in 1981, remade as a
            Network Ten television series in 2012–2014 — is the
            defining Australian beach-culture literary text. Set at
            the Sydney eastern beaches (Cronulla in the original
            novel, spread across the inventory including Bondi in
            the film and series), it follows two teenage girls
            negotiating the violently gendered Australian surf
            subculture of the 1970s. The book's clear-eyed cruelty
            about what Australian beach masculinity asks of women was
            unusual at publication and is still considered the
            beginning of a certain kind of honest Australian-
            adolescent writing. Tim Winton's own beach novels, Helen
            Garner's Sydney-based fiction, every Tim Rogers lyric
            descending from this tradition — all of it owes something
            to the Lette-Carey model.
          </p>
        </article>

        <article>
          <h3 className={`${H3} mb-4`}>
            The Pavilion, Sculpture by the Sea, and the Bondi 2000
          </h3>
          <p className={BODY}>
            The beach's third cultural layer is <strong>visual-arts
            infrastructure</strong>. The <strong>Bondi Pavilion</strong>{" "}
            (1928) has been a municipal community-hall-and-public-
            baths building for almost a century; after a 2022
            restoration it is the local exhibition and performance
            venue and hosts the <strong>Bondi Short Film Festival</strong>{" "}
            annually. <strong>Sculpture by the Sea</strong> (since
            1997) occupies the Bondi-to-Tamarama coastal walk each
            October. The <strong>2000 Sydney Olympic beach volleyball
            tournament</strong> was held at Bondi in a specially-
            constructed 10,000-seat stadium on the sand — an Olympic
            event in a city-park-beach, a combination no Games had
            staged before and few have since. The Games left Bondi
            briefly and vividly as a global venue; what remained
            afterwards was the memory of the beach at full capacity
            for the first time, and a generation of Sydney locals
            with a specific Olympics-era relationship to this
            specific sand.
          </p>
        </article>
      </div>
    </Section>
  );
}

// ============================================================================
// HONEST CONTEXT — Gadigal reckoning (from favela_note)
// ============================================================================

function HonestContextSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const note = bundle.showcase.favela_note;
  if (!note) return null;
  const paragraphs = note.split("\n\n").filter(Boolean);

  return (
    <Section id="honest" className={DARK}>
      <div className="max-w-3xl">
        <div
          className="text-[11px] font-mono uppercase tracking-[0.3em] mb-4"
          style={{ color: "var(--beach-primary, #D9B66B)" }}
        >
          · What the Postcard Doesn't Show
        </div>
        <h2 className={H2_DARK} style={{ fontFamily: DISPLAY_FF }}>
          Unceded land, a failed referendum, and what comes next
        </h2>
        <p className="mt-5 text-lg italic text-[#94A3B8] font-serif">
          Australia's identity-image beach is on land taken from the
          Gadigal people of the Eora Nation. The legal, political, and
          moral work of that sentence is not finished. What follows
          are the specifics.
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
      name: "Sydney CBD",
      distance: "8 km west",
      blurb:
        "The 333 bus from Bondi Junction takes 25 minutes to the city centre. The **Opera House** and the **Harbour Bridge** are 10 minutes apart on foot from Circular Quay. Half a day to do both properly. A full CBD day adds the **Art Gallery of NSW** (free admission), the **Royal Botanic Garden**, and — genuinely worth it — the **Museum of Contemporary Art** at The Rocks.",
    },
    {
      name: "Coogee",
      distance: "6 km south (end of the coastal walk)",
      blurb:
        "The other end of the Bondi-to-Coogee coastal walk. Smaller, quieter, more residential. The McIver's Ladies' Baths at the southern end of Coogee beach is a women-and-children-only ocean pool dating to 1876 — one of the last of its kind. A more relaxed afternoon than Bondi Central.",
    },
    {
      name: "Taronga Zoo",
      distance: "Ferry from Circular Quay",
      blurb:
        "Australia's best-sited zoo — across the harbour from the CBD, reached by ferry, with views back across the water to the Opera House and Bridge. Strong native-animal collections (koala, kangaroo, Tasmanian devil). Half-day visit; the ferry component is the best part.",
    },
    {
      name: "Manly",
      distance: "30 min ferry from Circular Quay",
      blurb:
        "The other Sydney beach-on-a-headland. Manly was where William Gocher's 1902 daylight-swimming protest happened — the legal precursor to Bondi's surf-lifesaving era. Now: a more resort-like beach than Bondi, with a longer boardwalk and a shorter drive from the ferry terminal. Worth a day if you have time for a second Sydney beach.",
    },
  ];
  return (
    <Section id="nearby" className={PAPER} width="wide">
      <SectionHeader
        eyebrow="· On Sydney's Eastern Edge"
        title="Four places within an hour"
      />
      <div className="divide-y divide-[#CBD5E1] border-y border-[#CBD5E1]">
        {places.map((p) => (
          <article
            key={p.name}
            className="grid gap-4 py-8 md:grid-cols-[200px_1fr] md:gap-10"
          >
            <div>
              <div className={`${EYEBROW} mb-2`}>{p.distance}</div>
              <h3 className={H3}>{p.name}</h3>
            </div>
            <p className={BODY}>{renderInlineBold(p.blurb)}</p>
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
      label: "Visiting Bondi",
      subtitle:
        "Getting to Bondi from Sydney CBD, the 6 km coastal walk, where to stay, what to eat, and Icebergs as the anchor destination.",
    },
    {
      slug: "lifesaving",
      label: "Surf Lifesaving",
      subtitle:
        "The 1906 founding of the sport, the 1938 Black Sunday rescue in detail, the modern volunteer/professional operation, and Bondi Rescue as both TV show and training program.",
    },
    {
      slug: "gadigal",
      label: "Gadigal Country",
      subtitle:
        "The Eora Nation, the Bondi rock engravings, the Uluru Statement arc and the 2023 referendum, and how to visit an Australian beach that was never ceded.",
    },
  ];
  return (
    <Section id="spokes" className={PAPER} width="wide">
      <div className={`${EYEBROW} mb-6`}>· Go Deeper</div>
      <h2 className={`${H2} mb-12 max-w-3xl`} style={{ fontFamily: DISPLAY_FF }}>
        Three pages for three ways in
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {spokes.map((s) => (
          <a
            key={s.slug}
            href={`/beaches/bondi-beach/${s.slug}`}
            className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#D9B66B)] transition-colors"
          >
            <h3
              className={`${H3} mb-3 group-hover:text-[color:var(--beach-primary,#B8913A)]`}
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
          Surf-lifesaving historical material follows Surf Life Saving
          Australia's published centenary documentation and the Bondi
          SBLSC archive. Black Sunday 1938 detail from contemporary
          press accounts reproduced in the SLSA archive and from Tony
          Saunders's <em>Black Sunday</em> (Mitchell Beazley, 1988).
          Gadigal and Eora material follows AIATSIS published
          scholarship, the Yarra / Eora map of Aboriginal Australia,
          and the Uluru Statement from the Heart (2017). Version v0.9.
          Corrections particularly welcome on Gadigal-specific framing,
          on the exact attribution of Bondi's rock engravings, and on
          current-decade Waverley Council acknowledgments.
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function BondiPage({
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
        tagline="Australia's image of itself. One kilometer of sand. A hundred years of surf-lifesaving. Sixty-five thousand years of Gadigal country under it."
        heroType="MONUMENT"
        primary={heroImage}
        version={composition.version}
        tier={composition.tier}
      />

      <ClusterRail current="main" beachName={composition.beach_name} />

      <BondiStory />
      <LifesavingSection bundle={bundle} />
      <GadigalSection bundle={bundle} />
      <ZonesSection bundle={bundle} />
      <DaySection bundle={bundle} />
      <IcebergsSection bundle={bundle} />
      <TimelineSection bundle={bundle} />
      <CulturalFootprintSection bundle={bundle} />
      <HonestContextSection bundle={bundle} />
      <NearbySection />
      <SpokeFooter />
      <PageProvenance bundle={bundle} />
    </LegendaryShell>
  );
}
