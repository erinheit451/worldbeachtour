/**
 * Pipeline — bespoke Tier 1 page. Legendary v2.
 *
 * Thesis (spike):
 *   "Pipeline is where elite surfing's reputations are made and broken.
 *    More surfers have died here than at any other contest break on
 *    Earth. Both things are consequences of the same reef."
 *
 * Sixth Tier 1 under the v2 design language. SEVERE voice register
 * (shared with Nazaré) + AUSTERE display pairing (Barlow Condensed,
 * also shared with Nazaré) — a deliberate pairing: Pipeline and Nazaré
 * are the two elite-big-wave breaks of the cluster set, and they share
 * the register that acknowledges fatalities without aestheticizing
 * them.
 */

import type {
  LegendaryPageBundle,
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
} from "./pipeline/shared";

// ============================================================================
// STORY
// ============================================================================

function PipelineStory({ bundle }: { bundle: LegendaryPageBundle }) {
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
            color: var(--beach-primary, #0B3D5C);
          }
        `}</style>

        <PullQuote size="hero">
          Pipeline is where elite surfing's reputations are made and
          broken. More surfers have died here than at any other contest
          break on Earth. Both things are consequences of the same reef.
        </PullQuote>
      </div>
    </section>
  );
}

// ============================================================================
// THE WAVE — spike explainer
// ============================================================================

function TheWaveSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const barrel = pickImage(bundle.meta, "barrel_jaws");
  const empty = pickImage(bundle.meta, "empty_wave");

  return (
    <Section id="the-wave" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· The Wave"
        title="Why a specific finger of reef produces a specific shape no other break in the world produces"
        kicker="Pipeline's wave is not generically 'big' or generically 'hollow.' It has a specific geometry that derives from a specific piece of coral, which rises from deep water in a specific way. Understanding the mechanism is understanding why the break matters."
      />

      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
        <div className="space-y-6">
          <h3 className={H3}>The reef</h3>
          <p className={BODY}>
            The bottom under Pipeline is <strong>coral reef</strong> —
            not sand. A finger of reef, oriented roughly perpendicular
            to the shore, rises from a depth of approximately{" "}
            <strong>40 meters</strong> offshore to within{" "}
            <strong>3 meters</strong> of the surface at the break.
            This geometry is what produces the wave's signature
            shape. Unlike a sand-bottom beach break (Supertubos in
            Peniche, for example) whose bathymetry shifts seasonally,
            Pipeline's reef is <strong>fixed</strong>. The wave that
            broke over this reef in 1971 is the wave that breaks over
            it in 2026 — same peak position, same angle, same length
            of ride.
          </p>
          <p className={BODY}>
            There are in fact <strong>three named reef sections</strong>{" "}
            at Pipeline, each breaking at different swell sizes:
          </p>
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>
              <strong>First Reef</strong> — the canonical Pipeline
              wave, breaking on swell sizes from roughly 2 to 4
              meters (6–12 feet). The contest break. Most photographed.
            </li>
            <li>
              <strong>Second Reef</strong> — further offshore, breaking
              on swells of 4 to 6 meters (12–20 feet). Fewer surfers
              ride it; those who do are exclusively elite big-wave.
            </li>
            <li>
              <strong>Third Reef</strong> — deep water, breaks on
              swells 6+ meters (20 feet+). Genuine big-wave territory;
              rarely ridden.
            </li>
          </ul>

          {barrel && (
            <Figure
              image={barrel}
              size="wide"
              tier="B"
              caption="Escaping the jaws of a Banzai Pipeline wave. The reef forces the lip to throw perpendicular to the face, producing the hollow barrel Pipeline is famous for. Timing the exit is the single most-studied technique in elite surfing."
            />
          )}

          <h3 className={`${H3} mt-10`}>The barrel mechanic</h3>
          <p className={BODY}>
            A Pacific groundswell arriving at Pipeline encounters the
            reef finger obliquely. The shallow bottom forces the wave
            to <strong>compress vertically</strong> — water displaced
            from the wave trough must rise into the wave face — while
            the reef's orientation causes the wave to <strong>peel</strong>{" "}
            left along the reef's edge. The combination produces
            Pipeline's distinctive mechanics:
          </p>
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>
              The <strong>lip throws</strong> nearly perpendicular to
              the wave face — unusually vertical for a surfable wave —
              producing a <strong>tall hollow barrel</strong> with
              genuine interior space. On the right swell, a 2-meter
              wave at Pipeline has a barrel large enough to stand
              inside comfortably; a 4-meter wave barrel can swallow
              two surfers side-by-side.
            </li>
            <li>
              The <strong>peel speed</strong> is very fast — the wave
              is moving laterally along the reef at 25–35 km/h. A
              surfer must enter the barrel at matching speed, hold a
              line through the tube, and exit before the tube closes.
            </li>
            <li>
              The <strong>ride length</strong> is short by
              big-wave-break standards — typically 4 to 8 seconds,
              rarely over 10. What makes the ride count is not
              duration but the density of what happens inside it.
            </li>
          </ul>

          {empty && (
            <Figure
              image={empty}
              size="wide"
              tier="B"
              caption="An empty Pipeline wave forming. The barrel's vertical throw and the peeling left-hand line are both visible; no surfer on this wave."
            />
          )}

          <h3 className={`${H3} mt-10`}>Backdoor and Off-the-Wall</h3>
          <p className={BODY}>
            Pipeline proper breaks <strong>left</strong> — the wave
            peels toward the north, and a regular-footed surfer
            (right foot back) rides it backside while a goofy-footed
            surfer (left foot back) rides it frontside. Two adjacent
            breaks extend the same reef-and-swell system:
          </p>
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>
              <strong>Backdoor</strong> — the right-breaking wave that
              emerges from the same peak as Pipeline when the swell is
              coming from a more south-westerly angle. Ridden
              frontside by regular-foot surfers, backside by goofys.
              Technically on the same reef; practically a different
              wave.
            </li>
            <li>
              <strong>Off-the-Wall</strong> — the next break east
              (roughly 200 meters), also on reef, also left-breaking,
              also hollow but at a different angle. Shares crowding
              with Pipeline on peak days.
            </li>
          </ul>
          <p className={BODY}>
            A surfer at Pipeline on a good day is negotiating three
            distinct waves on the same stretch of reef. Reading the
            lineup — which peak will break where, which direction
            to take off — is a skill that takes years to acquire.
          </p>
        </div>

        <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
          <div className={`${EYEBROW} mb-5`}>· The Break</div>
          <dl className="space-y-5">
            <Fact label="Bottom" value="Coral reef" />
            <Fact label="Reef depth at break" value="~3 m" />
            <Fact label="Reef outer depth" value="~40 m" />
            <Fact label="Break direction" value="Left" />
            <Fact label="Peel speed" value="25–35 km/h" />
            <Fact label="Typical ride length" value="4–8 s" />
            <Fact label="Peak season" value="Nov–Feb" />
            <Fact label="Named reef sections" value="First / Second / Third" />
          </dl>
        </aside>
      </div>
    </Section>
  );
}

// ============================================================================
// THE PIPE MASTERS — secondary explainer
// ============================================================================

function PipeMastersSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const masters = pickImage(bundle.meta, "pipe_masters");
  const slater = pickImage(bundle.meta, "kelly_slater");
  const jjf = pickImage(bundle.meta, "john_john_florence");
  const medina = pickImage(bundle.meta, "gabriel_medina");
  const moore = pickImage(bundle.meta, "carissa_moore");

  return (
    <Section id="pipe-masters" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· The Pipe Masters"
        title="The annual contest that is, in career-weight terms, the most important surfing event in the world"
        kicker="Since 1971, the Pipe Masters has been held at Pipeline every December. Under various sponsor names — Hang Ten, Gotcha, Billabong, Vans, Lexus — the contest has remained the season-opener of the WSL Championship Tour and the single event whose results most shape elite surfing reputations."
      />

      <div className="space-y-6 max-w-3xl">
        <h3 className={H3}>The contest</h3>
        <p className={BODY}>
          The <strong>Pipe Masters</strong> is a one-stop WSL
          Championship Tour event held annually at Pipeline, usually
          in <strong>early December</strong>, during a waiting period
          that opens on approximately December 8 and runs up to
          three weeks. The contest waits for the right swell —
          typically a North Pacific system producing 2–4 meter
          waves at First Reef — and then runs heats through the
          2–3 days the swell holds. Men's and women's CT events
          have run in parallel since 2020.
        </p>
        <p className={BODY}>
          Winning a Pipe Masters is a{" "}
          <strong>career-defining credential</strong>. The list of
          champions maps closely onto surfing's all-time greats:{" "}
          <strong>Gerry Lopez</strong> (1972, 1973 — "Mr Pipeline"),{" "}
          <strong>Tom Carroll</strong> (1983, 1987, 1991),{" "}
          <strong>Derek Ho</strong> (1986, 1993 — the first Hawaiian
          world champion), <strong>Sunny Garcia</strong> (multiple
          90s wins), <strong>Kelly Slater</strong> (7 times, across
          two decades — the most in the event's history),{" "}
          <strong>Andy Irons</strong> (2002, 2003, 2006),{" "}
          <strong>John John Florence</strong> (Hawaiian-born, Pipe
          Masters 2014, 2016 — multiple-time world champion),{" "}
          <strong>Gabriel Medina</strong> (2018, 2021 — Brazilian,
          multiple-time world champion). The contest's 55-year run
          is effectively a continuous ranking of elite surfing's
          generational leaders.
        </p>

        {masters && (
          <Figure
            image={masters}
            size="wide"
            tier="B"
            datePrefix="Dec 2012"
            caption="The Vans Triple Crown Billabong Pipe Masters — Joel Parkinson during the 2012 contest. The public beach-viewing culture that surrounds the contest is substantial: spectator numbers reach 5,000-plus on decisive heat days."
          />
        )}

        <h3 className={`${H3} mt-10`}>Why it matters more than any other stop</h3>
        <p className={BODY}>
          The WSL Championship Tour visits 8–11 breaks per year
          depending on the season — Trestles, Bells Beach,
          Margaret River, Teahupoʻo, Jeffreys Bay, Supertubos,
          Fiji, and others. Pipe Masters carries disproportionate
          weight among these for four reasons:
        </p>
        <ol className={`${BODY} list-decimal pl-6 space-y-3`}>
          <li>
            <strong>It opens the season.</strong> A Pipe Masters win
            is the first result on the board, and it establishes the
            year's top contenders while setting the narrative for the
            ten months that follow.
          </li>
          <li>
            <strong>The wave is the wave.</strong> Most CT breaks are
            quality waves that sometimes reward performance surfing.
            Pipeline rewards <strong>specific tube-riding technique</strong>{" "}
            at a higher scoring ceiling than other breaks. A Pipe
            Masters trophy implies a technical standard the
            competitor cleared at the sport's hardest venue.
          </li>
          <li>
            <strong>The North Shore attention economy.</strong> The
            Pipe Masters is broadcast live and is the single
            most-watched surf-contest broadcast of the year. Sponsorship
            deals, endorsement contracts, and career trajectories pivot
            on Pipe Masters performance in ways other contests don't
            match.
          </li>
          <li>
            <strong>Pipeline-local bias.</strong> The North Shore has
            a genuinely-Hawaiian surf culture with its own hierarchy,
            and Hawaiian-born surfers historically have an edge at
            Pipe Masters that reflects local-water knowledge. A
            mainland or European surfer winning at Pipe Masters means
            something technical; a Hawaiian winning means something
            cultural. Derek Ho's 1993 world title — built on a Pipe
            Masters win — is still celebrated as the first world
            title by a Hawaiian.
          </li>
        </ol>

        <div className="grid gap-10 md:grid-cols-2 mt-10">
          {slater && (
            <Figure
              image={slater}
              size="wide"
              tier="B"
              caption="Kelly Slater surfing Pipeline. Seven Pipe Masters wins across three decades (1992, 1994, 1995, 1996, 1999, 2008, 2013) — the most in the event's history. Eleven-time WSL world champion."
            />
          )}
          {jjf && (
            <Figure
              image={jjf}
              size="wide"
              tier="B"
              caption="John John Florence — Hawaiian-born, raised in a family home directly fronting Pipeline. Pipe Masters 2014 and 2016. Two-time WSL world champion (2016, 2017). The defining local-boy Pipeline surfer of the current era."
            />
          )}
          {medina && (
            <Figure
              image={medina}
              size="wide"
              tier="B"
              caption="Gabriel Medina — Brazilian, three-time WSL world champion (2014, 2018, 2021), two-time Pipe Masters winner (2018, 2021). The current-era Brazilian-dominant competitor at Pipeline."
            />
          )}
          {moore && (
            <Figure
              image={moore}
              size="wide"
              tier="B"
              caption="Carissa Moore (left) and Coco Ho. Moore is Hawaiian-born, five-time WSL world champion, 2021 Olympic gold medalist — and the canonical face of the women's Championship Tour since the 2020 era when the women's event began running at Pipe Masters in parallel with the men's."
            />
          )}
        </div>
      </div>
    </Section>
  );
}

// ============================================================================
// ZONES — the North Shore context around Pipeline
// ============================================================================

function ZonesSection() {
  const zones = [
    {
      code: "HALEIWA",
      name: "Haleʻiwa",
      character:
        "The historic North Shore town at the western end of the 7-Mile Miracle. Matsumoto Shave Ice (1951), Ted's Bakery, Haleʻiwa Farmers Market. A working small town; where North Shore locals actually live and shop. Start here.",
    },
    {
      code: "LANIAKEA",
      name: "Laniākea (Turtle Beach)",
      character:
        "A kilometer east of Haleʻiwa. Named for the Hawaiian green sea turtles (honu) that haul out on the sand to bask. Municipal signs mark a 10-meter approach distance; respect the distance. Not a surfing beach — a turtle-watching beach.",
    },
    {
      code: "WAIMEA",
      name: "Waimea Bay",
      character:
        "The big-wave companion break to Pipeline. Breaks on much larger open-face waves when the swell is 20+ feet. Home of the Eddie Aikau Big Wave Invitational, which only runs on days that satisfy the 20-foot minimum — 10 times since 1985. Summer it is a placid family swimming beach; winter it is Hawaiian big-wave surfing's spiritual home.",
    },
    {
      code: "PIPELINE",
      name: "Pipeline / Ehukai Beach Park",
      character:
        "The proving-ground wave. The contest break. First Reef, Second Reef, Third Reef. Backdoor breaks right off the same peak. Off-the-Wall is next wave east.",
    },
    {
      code: "SUNSET",
      name: "Sunset Beach",
      character:
        "Two miles east of Pipeline. Larger, more open-face wave than Pipeline; different wave mechanics (not a barrel break). Sunset is considered one of the hardest waves in the world to paddle out through during peak season because the shifting peaks make entry timing treacherous. Vans World Cup of Surfing is held here.",
    },
    {
      code: "TURTLE_BAY",
      name: "Turtle Bay",
      character:
        "The eastern end of the 7-Mile Miracle. The Turtle Bay Resort is the only major hotel on the North Shore and the operational anchor for North Shore surf tourism. Calmer waters, family-swimmable on the protected beach side. The end of the North Shore circuit.",
    },
  ];

  return (
    <Section id="zones" className={CREAM} width="wide">
      <SectionHeader
        eyebrow="· The 7-Mile Miracle"
        title="Pipeline is one break among six on this coast"
        kicker="The seven-mile stretch of Oʻahu's North Shore from Haleʻiwa to Turtle Bay holds at least six named surf breaks, each with distinct wave mechanics and each with its own competitive calendar. Pipeline is the most famous; it is not the whole story."
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {zones.map((z) => (
          <article
            key={z.code}
            className="rounded-sm border border-[#E7E2D4] bg-white p-6"
          >
            <div className={`${EYEBROW} mb-3`}>{z.code}</div>
            <h3 className={`${H3} mb-3`}>{z.name}</h3>
            <p className={BODY_SM}>{z.character}</p>
          </article>
        ))}
      </div>

      <ClusterAside>
        Full North Shore circuit — the day-trip from Waikīkī, the
        canonical food stops, the drive rhythm, where to pull over —
        is in <ClusterLink to="north-shore" />.
      </ClusterAside>
    </Section>
  );
}

// ============================================================================
// A DAY HERE
// ============================================================================

function DaySection() {
  const vignettes = [
    {
      slot: "Dawn",
      text:
        "The Pipe Masters contest waiting-period call comes at **6:45 a.m.** — whether the heats will run that day or go on hold. The elite surfers are already at the beach doing warmup paddles. The water-safety team — jet-skis, rescue boards, lifeguards — is in position by 6 a.m. On non-contest mornings, the pre-dawn water is claimed by free-surfers; by 7 a.m. the beach has its first spectators setting up camp chairs.",
    },
    {
      slot: "Midday",
      text:
        "Midday at Pipeline during the contest is a densely-packed spectator event. Five thousand-plus people on the sand on decisive heat days. Sponsor compounds, food trucks, live broadcast crew, celebrity guests. Off-contest midday: the beach is moderately populated with spectators watching free-surf sessions from 20 meters behind the waterline. The waves themselves never pause for the time of day.",
    },
    {
      slot: "Golden",
      text:
        "The late-afternoon swell on a north-facing beach catches the sun low behind the water, producing the characteristic **golden-barrel photography** that fills most Pipeline publications. Surfers continue to ride. The contest, if running that day, is usually on a finals-heat schedule by now. The crowds hold.",
    },
    {
      slot: "Night",
      text:
        "Pipeline is not a night-surf break. By sunset the water has emptied. The spectators dissipate to Haleʻiwa for dinner; the elite surfers to their North Shore rental houses. Ehukai Beach Park itself empties completely by 9 p.m. The only sound is the wave still breaking 100 meters offshore, audible but invisible.",
    },
  ];

  return (
    <Section id="day" className={CREAM} width="wide">
      <SectionHeader
        eyebrow="· A Day Here"
        title="Dawn patrol to dusk, during the December contest window"
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

function TimelineSection() {
  const events = [
    {
      year: "~1958",
      tag: "cultural",
      title: "The wave is named",
      body: "Legendary Hawaiian surfer Phil Edwards (or, by some accounts, Hawaii-based filmmakers John Severson and Bruce Brown) rides the break for the first documented surfing session. The name 'Banzai Pipeline' is coined shortly after by Bruce Brown — 'Banzai' for the Japanese warrior-cry and 'Pipeline' for the cylindrical barrel shape.",
    },
    {
      year: "1964",
      tag: "cultural",
      title: "The Endless Summer",
      body: "Bruce Brown's canonical 1964 surf documentary features Pipeline footage and makes the break visually legible to an international audience for the first time. The film is credited with catalyzing the 1960s-70s surf-tourism expansion of the North Shore.",
    },
    {
      year: "1971",
      tag: "sport",
      title: "First Pipe Masters",
      body: "Hang Ten sponsors the first Pipe Masters contest. Jeff Hakman wins. The contest has run every year since, under various sponsor names, and has been a WSL Championship Tour stop continuously since the formal WSL structure began in the 1970s.",
    },
    {
      year: "1978",
      tag: "historic",
      title: "Eddie Aikau disappears",
      body: "Eddie Aikau, Native Hawaiian big-wave surfer and longtime North Shore lifeguard, is lost at sea during an attempted rescue during the Hōkūleʻa voyaging canoe's capsize near Molokaʻi. The phrase 'Eddie would go' — referring to his willingness to attempt rescues in conditions other lifeguards refused — becomes the North Shore big-wave ethos. The Eddie Aikau Invitational at Waimea, inaugurated 1985, carries his name.",
    },
    {
      year: "1999",
      tag: "sport",
      title: "Kelly Slater's North Shore sweep",
      body: "Kelly Slater wins the Vans Triple Crown of Surfing — Haleʻiwa, Sunset, and Pipe Masters all in the same winter. His fifth Pipe Masters win. Establishes him as the dominant Pipeline surfer of his generation.",
    },
    {
      year: "2005",
      tag: "historic",
      title: "Malik Joyeux dies at Pipeline",
      body: "Tahitian surfer Malik Joyeux, 25, drowns after being driven into the reef during a free-surf session. The first elite-level fatality at the contest break. His death catalyzes significant improvements in Pipeline water-safety infrastructure, including permanent jet-ski rescue positioning during peak season.",
    },
    {
      year: "2010",
      tag: "historic",
      title: "Andy Irons dies",
      body: "Three-time WSL world champion and three-time Pipe Masters winner Andy Irons dies in a Dallas hotel room at age 32, returning home to Kauaʻi from the 2010 Rip Curl Pro Search Puerto Rico. Cardiac arrest with toxicological factors. The surfing community's multi-year reckoning with the death — and with the mental-health and addiction context it surfaced — is canonically treated in the 2018 documentary Andy Irons: Kissed by God.",
    },
    {
      year: "2014",
      tag: "sport",
      title: "John John Florence wins Pipe Masters",
      body: "Hawaiian-born John John Florence wins his first Pipe Masters, surfing from the family beach house directly fronting the break where he had learned as a child. Wins again 2016. Two-time WSL world champion (2016, 2017). The current generation's canonical local-boy Pipeline surfer.",
    },
    {
      year: "2024",
      tag: "historic",
      title: "Tamayo Perry lost to shark attack",
      body: "Tamayo Perry, 49 — Hawaiian-born, 2001 Pipe Masters semi-finalist, longtime North Shore lifeguard, and the canonical Blue Crush (2002) surfing-stunt-double — is killed by a shark at Mālaekahana, 4 miles north of Pipeline. The North Shore holds a paddle-out ceremony that draws several thousand surfers and locals. The most widely-mourned North Shore loss of the decade.",
    },
  ];

  return (
    <Section id="history" className={PAPER}>
      <SectionHeader
        eyebrow="· History"
        title="Nine moments that made Pipeline what it is"
      />

      <ol className="space-y-10 border-l-2 border-[#CBD5E1] pl-8">
        {events.map((ev, i) => (
          <li key={i} className="relative">
            <span
              className="absolute -left-[35px] top-2 w-3 h-3 rounded-full"
              style={{ backgroundColor: "var(--beach-primary, #0B3D5C)" }}
            />
            <div className={`${EYEBROW} mb-2`}>
              {ev.year} · {ev.tag}
            </div>
            <h3 className={`${H3} mb-2`}>{ev.title}</h3>
            <p className={BODY_SM}>{ev.body}</p>
          </li>
        ))}
      </ol>

      <ClusterAside>
        The Eddie Aikau story — and the full Waimea big-wave
        tradition it anchors — is its own spoke:{" "}
        <ClusterLink to="the-eddie" />.
      </ClusterAside>
    </Section>
  );
}

// ============================================================================
// CULTURAL FOOTPRINT
// ============================================================================

function CulturalFootprintSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const jamie = pickImage(bundle.meta, "jamie_obrien");

  return (
    <Section id="culture" className={PAPER} width="wide">
      <SectionHeader
        eyebrow="· In the Culture"
        title="Four layers that built the Pipeline mythology"
      />

      <div className="space-y-12 max-w-3xl">
        <article>
          <h3 className={`${H3} mb-4`}>
            The Endless Summer (1964) and surf film
          </h3>
          <p className={BODY}>
            Bruce Brown's <em>The Endless Summer</em> (1964) is the
            canonical surf documentary. Its Pipeline footage —
            specifically, footage of Mike Hynson and Robert August
            riding the reef during the 1963 winter — is among the
            first widely-distributed images of the break and
            effectively <strong>introduced Pipeline to a global
            audience</strong>. Every subsequent Pipeline film —
            Morning of the Earth (1971), North Shore (1987), Blue
            Crush (2002), Riding Giants (2004), and the currently-
            running HBO series <em>100 Foot Wave</em>'s periodic
            Pipeline episodes — traces its visual vocabulary to
            Brown's 1964 work. The Endless Summer is also the
            film that named the 'Banzai Pipeline' formally; before
            1964, the break had no universally-accepted name in
            surf media.
          </p>
        </article>

        <article>
          <h3 className={`${H3} mb-4`}>
            Blue Crush (2002) and the mainstream surf film
          </h3>
          <p className={BODY}>
            John Stockwell's <em>Blue Crush</em> (Universal, 2002) —
            starring Kate Bosworth as a North Shore surfer training
            for the Pipe Masters — is the most commercially
            successful Pipeline-based Hollywood production. The film
            was shot on location at Pipeline and Sunset, using
            Hawaiian local surfers as stunt doubles (most notably{" "}
            <strong>Tamayo Perry</strong>, who doubled the surfing
            sequences and who would go on to become a longtime North
            Shore lifeguard until his death by shark attack in 2024).
            Blue Crush's commercial success — approximately $54
            million worldwide box office against a $25M budget — is
            meaningful because it established Pipeline as a
            mass-audience visual reference in a way earlier surf
            films (which were genre productions for surf audiences)
            had not.
          </p>
        </article>

        <article>
          <h3 className={`${H3} mb-4`}>
            The Volcom House and the Pipeline economy
          </h3>
          <p className={BODY}>
            The <strong>Volcom House</strong> — a single-family beach
            house directly fronting Pipeline, on Ke Nui Road —
            has been, since the late 1990s, owned and operated by
            the Volcom surf-apparel brand as a company-sponsored
            athlete residence. Its lanai is the canonical Pipeline
            contest-watching location; its interior has hosted every
            Pipe Masters winner of the last 25 years; it is the
            single most-photographed private residence in surfing.
            The Volcom House is the physical anchor of a broader{" "}
            <strong>sponsorship economy</strong> that the Pipeline
            attention has generated: Rip Curl, Quiksilver, Billabong,
            Hurley, Vans, Lexus, and Red Bull all maintain
            permanent North Shore infrastructure during contest
            season. Approximately 4,000 people live year-round in
            the Pūpūkea / Sunset / Pipeline neighborhoods; during
            December's contest window, temporary population triples.
            The contest is a cultural event; it is also a specific
            economic one.
          </p>
        </article>

        <article>
          <h3 className={`${H3} mb-4`}>
            The Pipeline locals — Lopez, Ho, O'Brien, Johnson, Perry
          </h3>
          <p className={BODY}>
            Beyond the WSL-Tour competitor layer, Pipeline has a
            community of <strong>longtime local watermen</strong>{" "}
            who are the cultural spine of the break. Among them:
          </p>
          <ul className={`${BODY} list-disc pl-6 space-y-3 mb-5`}>
            <li>
              <strong>Gerry Lopez</strong> — 'Mr Pipeline.'
              Japanese-Hawaiian, born 1948 in Honolulu, won the 1972
              and 1973 Pipe Masters, invented the cool-surfer
              stance and hair-back reading of the wave that defines
              1970s Pipeline iconography. Still active in shaping
              and in a reduced-volume Big Island surfing life; his
              board designs (the Lightning Bolt surfboards,
              1970s-canonical) are museum objects.
            </li>
            <li>
              <strong>Derek Ho</strong> — Hawaiian, 1964–2020. The
              1993 Pipe Masters winner and the{" "}
              <strong>first Hawaiian WSL world champion</strong>{" "}
              (1993). Still celebrated on the North Shore as the
              local boy who closed the gap between Hawaiian
              recognition and the international competitive
              hierarchy. Died on 16 July 2020 of a heart attack at
              age 55, mourned by a substantial paddle-out ceremony
              at Pipeline.
            </li>
            <li>
              <strong>Jamie O'Brien</strong> — Pūpūkea-raised,
              Hawaiian-and-Portuguese descent, <strong>2004 Pipe
              Masters winner</strong>. Retired from contest surfing
              in 2008 to focus on free-surfing and now one of
              YouTube's most-watched surf creators, running the
              'JOB' channel. His Pipeline content — including
              signature stunts (riding Pipeline in a storm trooper
              costume, on a doorboard, in flippers) — has exposed
              the wave to an audience the WSL broadcast does not
              reach.
            </li>
            <li>
              <strong>Jack Johnson</strong> — Pūpūkea-raised,
              competed at Pipeline as a teenager before a 1992
              surf-injury near-death experience turned him toward
              music. His songs (Brushfire Fairytales 2001, In
              Between Dreams 2005) have carried a specific
              North-Shore-surfer-casual aesthetic into mainstream
              American music. He still lives on the North Shore.
            </li>
            <li>
              <strong>Tamayo Perry</strong> — Hawaiian, 1974–2024.
              2001 Pipe Masters semi-finalist; primary surf-stunt
              double for <em>Blue Crush</em> (2002); longtime North
              Shore lifeguard. Killed by a shark at Mālaekahana
              in June 2024. The paddle-out ceremony at Pipeline
              following his death drew several thousand mourners —
              the largest such gathering in recent North Shore
              memory.
            </li>
          </ul>
          {jamie && (
            <Figure
              image={jamie}
              size="wide"
              tier="B"
              caption="Jamie O'Brien — Pipeline-raised free-surfer, 2004 Pipe Masters winner, and one of YouTube's most-watched surf creators. His content exposes Pipeline to audiences the WSL broadcast does not reach."
            />
          )}
          <p className={BODY}>
            The <strong>Da Hui Backdoor Shootout</strong> — an
            invitational contest run annually at Backdoor /
            Pipeline by the Da Hui (Hui O He'e Nalu) Hawaiian
            surfer organization, since 1976 — is the local
            counterpoint to the international WSL-branded Pipe
            Masters. The Da Hui event is specifically{" "}
            <strong>Hawaiian-led</strong>: the invitation list is
            controlled by Hawaiian watermen, entry is free or
            minimal-cost, broadcasts are local, and the prize
            structure rewards local-water knowledge. It is the
            event at which the North Shore's local hierarchy is
            annually reasserted independent of the global surf
            industry's branding priorities. If you are at Pipeline
            in January or February and see a contest running that
            doesn't look like the WSL Pipe Pro, it is probably the
            Backdoor Shootout.
          </p>
        </article>
      </div>
    </Section>
  );
}

// ============================================================================
// FATALITIES — dark honest section
// ============================================================================

function FatalitiesSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const note = bundle.showcase.favela_note;
  if (!note) return null;
  const paragraphs = note.split("\n\n").filter(Boolean);

  return (
    <Section id="fatalities" className={DARK}>
      <div className="max-w-3xl">
        <div
          className="text-[11px] font-mono uppercase tracking-[0.3em] mb-4"
          style={{ color: "var(--beach-supporting, #D9A441)" }}
        >
          · The Deaths
        </div>
        <h2 className={H2_DARK} style={{ fontFamily: DISPLAY_FF }}>
          More surfers have died here than at any other contest break
        </h2>
        <p className="mt-5 text-lg italic text-[#94A3B8] font-serif">
          Pipeline's reef is unforgiving in a specific way. This
          section names the surfers the break has taken. It belongs
          on the page.
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
      name: "Waikīkī",
      distance: "56 km south",
      blurb:
        "The calm-water south-facing beach where the world learns to surf. Opposite end of Oʻahu's surf spectrum from Pipeline — Waikīkī is where first lessons happen; Pipeline is where careers are finished. Together they are Oʻahu's surf coast.",
      href: "/beaches/waikiki-beach-1",
    },
    {
      name: "Waimea Bay",
      distance: "5 km west",
      blurb:
        "The paddle-in big-wave companion break to Pipeline. Home of the Eddie Aikau Invitational. Different wave mechanics (open face, not a barrel). Hawaiian big-wave surfing's spiritual home. Full treatment in the **The Eddie** spoke.",
      href: null,
    },
    {
      name: "Haleʻiwa Town",
      distance: "12 km west",
      blurb:
        "The historic North Shore town. Matsumoto Shave Ice, Ted's Bakery, the Haleʻiwa Farmers Market. A working small town that the North Shore surf community actually shops at. Start or end your North Shore day here.",
      href: null,
    },
    {
      name: "Pearl Harbor / USS Arizona",
      distance: "47 km south",
      blurb:
        "The U.S. Navy base attacked by Japan on 7 December 1941. The USS Arizona Memorial over the sunken battleship is one of the most-visited American national monuments. Two hours total; timed-entry tickets required; a half-day's drive from Pipeline.",
      href: null,
    },
  ];
  return (
    <Section id="nearby" className={PAPER} width="wide">
      <SectionHeader
        eyebrow="· On Oʻahu"
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
                  className="hover:text-[color:var(--beach-primary,#0B3D5C)] transition-colors"
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
// SPOKES FOOTER + PROVENANCE
// ============================================================================

function SpokeFooter() {
  const spokes = [
    {
      slug: "surfing",
      label: "Surfing Pipeline",
      subtitle:
        "How the wave actually works, the Pipe Masters contest in detail, Backdoor and Off-the-Wall, and the fatalities that are part of the break's identity.",
    },
    {
      slug: "north-shore",
      label: "The North Shore",
      subtitle:
        "The 7-Mile Miracle — from Haleʻiwa through Laniākea, Waimea, Pipeline, Sunset, to Turtle Bay. The canonical Oʻahu surf-coast day-trip.",
    },
    {
      slug: "the-eddie",
      label: "The Eddie",
      subtitle:
        "Waimea Bay, Eddie Aikau's life and loss, the paddle-in big-wave tradition, and the Invitational that has only run ten times since 1985.",
    },
    {
      slug: "malama",
      label: "Mālama North Shore",
      subtitle:
        "The Hawaiian sacred sites along the 7-Mile Miracle — Puʻu o Mahuka Heiau, Waimea Valley, and the Hawaiian place names under the English surf-break names.",
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
            href={`/beaches/pipeline/${s.slug}`}
            className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#0B3D5C)] transition-colors"
          >
            <h3 className={`${H3} mb-3 group-hover:text-[color:var(--beach-primary,#0B3D5C)]`}>
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
          Pipe Masters historical material follows the World Surf
          League championship archives and Matt Warshaw's{" "}
          <em>Encyclopedia of Surfing</em>. Fatality detail from
          contemporary Pacific Daily News and Honolulu Star-Advertiser
          reporting. Reef-mechanics discussion follows the USGS Pacific
          Islands Water Science Center bathymetric survey of the Ehukai
          reef (2015). Tamayo Perry's death (June 2024) is drawn from
          the Hawaii News Now and Surfer Magazine obituaries. Version
          v0.9. Corrections particularly welcome on current-year Pipe
          Pro results and on the evolving shark-attack / water-safety
          protocol at the 7-Mile Miracle.
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function PipelinePage({
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
        tagline="The wave elite surfing's reputations are made and broken on. More surfers have died here than at any other contest break on Earth."
        heroType="MONUMENT"
        primary={heroImage}
        version={composition.version}
        tier={composition.tier}
      />

      <ClusterRail current="main" beachName={composition.beach_name} />

      <PipelineStory bundle={bundle} />
      <TheWaveSection bundle={bundle} />
      <PipeMastersSection bundle={bundle} />
      <ZonesSection />
      <DaySection />
      <TimelineSection />
      <CulturalFootprintSection bundle={bundle} />
      <FatalitiesSection bundle={bundle} />
      <NearbySection />
      <SpokeFooter />
      <PageProvenance bundle={bundle} />
    </LegendaryShell>
  );
}
