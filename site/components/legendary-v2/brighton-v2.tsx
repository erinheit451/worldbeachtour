/**
 * Brighton — bespoke Tier 1 page. Legendary v2.
 *
 * Thesis (spike):
 *   "Brighton is a grey-sky pebble beach. Three centuries of English
 *    people came here to be somebody else for a weekend. The town is
 *    what they built."
 *
 * Third Tier 1 built under the v2 design language. Tests WRY voice
 * register (dry, knowing, slightly self-aware British humor) and the
 * two-piers place-anatomy spike archetype — which is different from
 * Nazaré's canyon-physics spike and Waikīkī's political-rupture spike.
 * CLASSICAL display pairing (DM Serif Display) carries over from
 * Waikīkī.
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
} from "./brighton/shared";

// ============================================================================
// STORY
// ============================================================================

function BrightonStory() {
  const paragraphs = [
    "Brighton is a grey-sky beach. That is the first thing to know. The sea is **English Channel cold** most of the year. The beach is pebble, not sand, and the pebbles hurt your feet. It rains. The pier neon looks best in drizzle. If you arrived here expecting tropical seaside, you misread the postcard — this is specifically British seaside, and specifically British seaside is its own long, weird, wonderful thing.",
    "Brighton began as Brighthelmstone, a fishing village on the Sussex coast. In **1754** a Lewes physician named Richard Russell published a Latin dissertation arguing that drinking and bathing in seawater cured scrofula, and the medical fashion that followed him effectively invented the modern seaside holiday. A few decades later the Prince of Wales — the future George IV — fell in love with the place, built an **Indo-Islamic pleasure palace** here with onion domes and chinoiserie interiors, and turned a fishing village into the louche English answer to Biarritz.",
    "Two piers were built after the railway arrived from London in 1841. The **West Pier** opened in 1866, the **Palace Pier** in 1899 — Victorian iron fairy-tales standing in the Channel. The Palace Pier still runs fairground rides and sells doughnuts. The West Pier burned twice in 2003 and 2004, collapsed progressively over a decade, and its skeleton is still out there in the water. Brighton chose to keep the ruin rather than dismantle it. It is the most-photographed wrecked structure in the south of England.",
    "What makes Brighton Brighton is not the sea. Three centuries of English people came here to write novels, shoot films, be gay, do drugs, start bands, get divorces, hold party conferences, plot against governments, and be somebody else for a weekend. The town is the accumulation of what they built around a beach that, as a beach, is only pebbles.",
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
            color: var(--beach-primary, #3A4E5C);
          }
        `}</style>

        <PullQuote size="hero">
          Brighton is a grey-sky pebble beach. Three centuries of English
          people came here to be somebody else for a weekend. The town is
          what they built.
        </PullQuote>
      </div>
    </section>
  );
}

// ============================================================================
// THE TWO PIERS — spike deep-explainer
// ============================================================================

function TwoPiersSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const palace = pickImage(bundle.meta, "palace_pier");
  const ruin = pickImage(bundle.meta, "west_pier_ruin");
  const fire = pickImage(bundle.meta, "west_pier_fire_2003");
  const i360 = pickImage(bundle.meta, "i360");

  return (
    <Section id="piers" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· The Two Piers"
        title="One working, one a burnt skeleton in the sea"
        kicker="Brighton had two Victorian iron piers. One of them you can still walk out onto and eat doughnuts. The other was set alight in 2003 — nobody was ever charged — and its skeleton has been there ever since. The image of the two piers together is the single most photographed thing in the south of England."
      />

      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] items-start">
        <div className="space-y-6">
          <h3 className={H3}>The West Pier · 1866–2003</h3>
          <p className={BODY}>
            The West Pier opened in <strong>1866</strong>, designed by{" "}
            <strong>Eugenius Birch</strong> — the Victorian pier engineer
            whose name is attached to half a dozen surviving British
            seaside structures. It was considered the most elegant iron
            pier ever built in Britain: 340 meters out into the Channel,
            with a pavilion, a concert hall, a landing stage for pleasure
            steamers from Margate and Brighton. The ironwork was filigreed
            — Moorish arches, cast-iron lamp standards, a bandstand mid-
            way. It was the architectural masterpiece of British Victorian
            seaside engineering.
          </p>
          <p className={BODY}>
            It was also, by the late 20th century, <strong>derelict</strong>.
            Maintenance costs had outstripped the Pier's revenue for
            decades; the 1987 Great Storm tore away significant sections;
            the pier was closed to the public in 1975. For nearly thirty
            years it stood in the sea as a fenced-off ruin, visible from
            the promenade, ignored by most of Brighton except a small
            preservation trust trying to raise restoration funds.
          </p>

          {ruin && (
            <Figure
              image={ruin}
              size="wide"
              tier="B"
              caption="The West Pier skeleton — photographed from the promenade. What remains is roughly the central pavilion frame; the pier-head collapsed in 2002, the main walkway in stages through 2003–2004."
            />
          )}

          <p className={BODY}>
            On <strong>28 March 2003</strong>, the West Pier caught fire.
            No cause was ever officially determined. A second fire
            followed in May 2003, a third in December 2004, and
            progressive storm-driven collapses through 2010. What's there
            now is the charred iron frame of the central pavilion —
            about 15% of the original structure — still standing in the
            sea roughly 200 meters offshore. Brighton had a decision to
            make about whether to dismantle or keep it. The town kept it.
            The ruin is now its most-photographed landmark, and the i360
            observation tower was built in 2016 on the exact patch of
            shoreline where the pier's entrance used to be — a
            deliberate siting, so that the i360 and the ruin share the
            same frame.
          </p>

          {fire && (
            <Figure
              image={fire}
              size="wide"
              tier="B"
              datePrefix="28 Mar 2003"
              caption="The West Pier fire. The cause was never officially determined. Brighton's most famous single photograph of the 21st century."
            />
          )}

          <h3 className={`${H3} mt-10`}>The Palace Pier · 1899–present</h3>
          <p className={BODY}>
            The Palace Pier — formally the Brighton Marine Palace and
            Pier — opened in <strong>1899</strong>, thirty-three years
            after the West. It was the second of Brighton's Victorian
            piers and, in several respects, the more commercially
            pragmatic of the two: wider, structurally simpler, designed
            for the mass-market railway tourist rather than the
            steamer-pleasure-cruise clientele of the West Pier's earliest
            years. Fairground rides and slot machines arrived by the
            1930s; they are still there. Candy-floss, doughnuts,
            fish-and-chips kiosks, the screaming carousel horses, the
            pier-end concert hall that still does weekend tribute bands.
            It is working seaside in the straight Victorian sense —
            loud, profitable, unembarrassed.
          </p>

          {palace && (
            <Figure
              image={palace}
              size="wide"
              tier="B"
              caption="The Palace Pier, 2023. The only surviving working pier in Brighton, and one of a handful still operating in Britain."
            />
          )}

          <p className={BODY}>
            The Palace Pier has lost its own pieces to the sea. The 1987
            Great Storm took its concert hall entirely — the tail end of
            the pier that had held the big-name Victorian and interwar
            variety shows was ripped off in the hurricane-force winds and
            fell into the Channel. The end of the pier today is the
            shorter version that was rebuilt through the late 1980s and
            early 1990s, without the original concert hall's domes and
            minarets. Old postcards still in circulation, from pre-1987
            Brighton, show the pier long enough to look almost
            Edwardian; the pier you see today is Victorian at the
            landward end, 1990s at the seaward.
          </p>

          <h3 className={`${H3} mt-10`}>The i360 · 2016–present</h3>
          <p className={BODY}>
            In <strong>2016</strong> the British Airways i360 opened on
            the seafront directly next to the West Pier ruin. A
            162-metre steel pole with a glass observation pod that
            rises and falls. Designed by <strong>Marks Barfield</strong>
            — the team behind the London Eye, with whom it is often
            compared, though the i360 has proven substantially less
            loved. It cost £46 million and has been in financial
            administration at various points since opening. Brighton,
            with characteristic wry self-awareness, has mostly decided
            to get on with it — the tower is now visually paired with
            the West Pier skeleton in essentially every sunset
            photograph taken on the seafront. The two structures,
            together, are the image of contemporary Brighton.
          </p>

          {i360 && (
            <Figure
              image={i360}
              size="wide"
              tier="B"
              caption="The i360 tower — 162 m steel pole, glass observation pod, British Airways branding. Built 2016 on the patch of shoreline where the West Pier's entrance used to stand. Not universally loved; unquestionably now part of the skyline."
            />
          )}
        </div>

        <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
          <div className={`${EYEBROW} mb-5`}>· Pier Numbers</div>
          <dl className="space-y-5">
            <Fact label="West Pier opened" value="1866" />
            <Fact label="West Pier closed" value="1975" />
            <Fact label="First fire" value="28 Mar 2003" />
            <Fact label="West Pier designer" value="Eugenius Birch" />
            <Fact label="Palace Pier opened" value="1899" />
            <Fact label="Palace Pier lost concert hall" value="1987 storm" />
            <Fact label="i360 opened" value="2016" />
            <Fact label="i360 height" value="162 m" />
          </dl>
        </aside>
      </div>
    </Section>
  );
}

// ============================================================================
// ROYAL PAVILION — secondary explainer
// ============================================================================

function PavilionSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const pavilion = pickImage(bundle.meta, "royal_pavilion");

  return (
    <Section id="pavilion" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· The Pavilion"
        title="George IV's Indo-Islamic fantasy, and why it is here"
        kicker="The Royal Pavilion is not a typical royal building. It was built by a prince who wanted a fishing village, refashioned as a Regency pleasure resort, transformed into an Indo-Islamic pleasure palace. It is possibly the oddest royal building in Britain. That it exists at all is the key to why Brighton became Brighton."
      />

      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] items-start">
        <div className="space-y-6">
          <p className={BODY}>
            In <strong>1783</strong> the Prince of Wales — the future{" "}
            <strong>George IV</strong>, then twenty-one, still
            dissolute, still decades from the throne he would briefly
            occupy — visited Brighton on a doctor's recommendation. The
            Russellian seawater cure was at its Regency-era peak; the
            Prince liked it, or at least liked being away from London.
            He rented a farmhouse on the Steine, the grassy open space
            where Brighton's fishermen had once dried nets. He came
            back. He kept coming back. Within a decade he had
            commissioned the construction of a substantial classical
            villa on the site.
          </p>
          <p className={BODY}>
            The first version of the Pavilion, built 1787 by Henry
            Holland, was neo-classical and unremarkable. The Prince
            tired of it. Over the next thirty years he commissioned a
            sequence of architects to elaborate — first a Chinese
            interior, then a set of Indian-inspired exterior features.
            Finally in <strong>1815</strong> he appointed{" "}
            <strong>John Nash</strong> — later the architect of Regent
            Street and Regent's Park — to redesign the whole thing.
            Nash's commission was to produce a building that looked{" "}
            <strong>as Indian as possible on the outside</strong> and{" "}
            <strong>as Chinese as possible on the inside</strong>,
            specifications the Regent personally dictated.
          </p>
          <p className={BODY}>
            The completed building in <strong>1822</strong> is: an
            Indo-Islamic Mughal fantasy of <strong>onion domes</strong>,
            <strong> minarets</strong>, and <strong>chhatris</strong> on
            the outside; the interior a chinoiserie opera set of{" "}
            <strong>gilded dragons</strong>, lotus-flower chandeliers,
            red-and-gold banqueting chambers, and a cast-iron palm-tree
            Great Kitchen the size of a parish church. It is not
            subtle. It was not intended to be.
          </p>

          {pavilion && (
            <Figure
              image={pavilion}
              size="wide"
              tier="B"
              caption="The Royal Pavilion — the Indo-Islamic Mughal exterior Nash designed for George IV. The onion domes, the chhatris, the minarets. It looks like nothing else in England because it is supposed to."
              className="my-6"
            />
          )}

          <h3 className={`${H3} mt-6`}>Why it matters for Brighton</h3>
          <p className={BODY}>
            The Pavilion was not incidentally important to Brighton. It
            was the reason the town became what it became. Where the
            future George IV spent his money, England's leisured class
            followed. The first generation of elite visitors — dukes,
            ambassadors, the fashionable London crowd — came to
            Brighton in the 1810s and 1820s specifically because the
            Regent was here. The Brighton Pavilion season drove demand
            for Regency architecture along the seafront and in the
            Lanes; most of the white stucco terraces that still face
            the water were built during this thirty-year royal
            window. By the time the railway arrived in 1841 and made
            Brighton accessible to the London middle class, the
            physical city they arrived at — the seafront terraces, the
            garden squares of Kemptown and Brunswick, the main
            promenade — had already been built by Regency aristocrats.
          </p>
          <p className={BODY}>
            The Pavilion was sold by Queen Victoria in <strong>1850</strong>{" "}
            — she found the building uncongenial and the town
            insufficiently private — to the Brighton Town Commissioners
            for £50,000. The building has been municipal property ever
            since. It is open to the public, admission around £18, and
            remains one of the most-visited royal buildings in Britain
            despite no longer being royal.
          </p>

          <ClusterAside>
            The full architectural and historical treatment of the
            Pavilion — Nash's design choices, the kitchen-as-theatre
            innovation, the Regency interior restoration since 1982, and
            why George IV wanted exactly this building — is in{" "}
            <ClusterLink to="pavilion" />.
          </ClusterAside>
        </div>

        <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
          <div className={`${EYEBROW} mb-5`}>· The Pavilion</div>
          <dl className="space-y-5">
            <Fact label="Commissioned" value="1815" />
            <Fact label="Completed" value="1822" />
            <Fact label="Architect" value="John Nash" />
            <Fact label="Style" value="Indo-Saracenic" />
            <Fact label="Sold to Brighton" value="1850" />
            <Fact label="Admission" value="£18" />
            <Fact label="Annual visitors" value="~400,000" />
          </dl>
        </aside>
      </div>
    </Section>
  );
}

// ============================================================================
// ZONES
// ============================================================================

function ZonesSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const pebble = pickImage(bundle.meta, "pebble_beach");
  const zones: Zone[] = bundle.showcase.zones ?? [];

  return (
    <Section id="zones" className={CREAM} width="wide">
      <SectionHeader
        eyebrow="· Six Stretches, One Seafront"
        title="Walk east, walk west — Brighton changes every two hundred meters"
        kicker="The six-kilometer Brighton & Hove seafront is not one beach. It is a sequence of named stretches that serve different crowds and carry different histories. A visitor who only walks between the two piers has seen ten percent of it."
      />

      {pebble && (
        <Figure
          image={pebble}
          size="wide"
          tier="B"
          caption="Brighton beach — pebble, not sand. Locals call it 'only pebbles' with a specific shrug. The pebbles hurt your feet; they are also the reason the beach has not eroded in two centuries."
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
              <div className="mt-4 border-l-2 border-[color:var(--beach-primary,#3A4E5C)] pl-4">
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[color:var(--beach-primary,#3A4E5C)] mb-1">
                  Local note
                </div>
                <p className={BODY_SM}>{z.notes}</p>
              </div>
            )}
          </article>
        ))}
      </div>

      <ClusterAside>
        The queer-capital side of the east end of the seafront — the
        Duke's Mound naturist beach (UK's first, 1980), Kemptown's pub
        and club geography, the Pride weekend as a visitor — is in{" "}
        <ClusterLink to="queer" />.
      </ClusterAside>
    </Section>
  );
}

// ============================================================================
// A DAY HERE
// ============================================================================

function DaySection({ bundle }: { bundle: LegendaryPageBundle }) {
  const day = bundle.showcase.day_in_time;
  const sunset = pickImage(bundle.meta, "sunset_pier");
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
        title="Dawn runners to neon fish-and-chips — hour by hour, in September"
      />

      {sunset && (
        <Figure
          image={sunset}
          size="wide"
          tier="B"
          caption="Brighton sunset with the Palace Pier. Brighton's golden hour is short, hard, and catches the Regency stucco at a very specific angle."
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
// HISTORY — 7 turning points
// ============================================================================

const HISTORY_KEEP = new Set([1754, 1815, 1841, 1866, 1899, 1984, 2003]);

function TimelineSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const all: TimelineEvent[] = bundle.showcase.timeline ?? [];
  const events = all.filter((e) => HISTORY_KEEP.has(e.year)).slice(0, 7);

  return (
    <Section id="history" className={PAPER}>
      <SectionHeader
        eyebrow="· History"
        title="Seven dates that made Brighton Brighton"
        kicker="A 1754 medical thesis, a Regency prince's taste in onion domes, a railway, two Victorian piers, an IRA bomb, and a 2003 fire."
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
                style={{ backgroundColor: "var(--beach-primary, #3A4E5C)" }}
              />
              <div className={`${EYEBROW} mb-2`}>{tag}</div>
              <h3 className={`${H3} mb-2`}>{ev.title}</h3>
              <p className={BODY_SM}>{ev.description}</p>
              {ev.wiki_url && (
                <a
                  href={ev.wiki_url}
                  target="_blank"
                  rel="noopener"
                  className="mt-2 inline-block text-xs font-mono uppercase tracking-wider text-[color:var(--beach-primary,#3A4E5C)] underline decoration-dotted underline-offset-4 hover:no-underline"
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
// CULTURAL FOOTPRINT — three deeper
// ============================================================================

function CulturalFootprintSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const modScooter = pickImage(bundle.meta, "mod_scooter_rally");
  const grandHotel = pickImage(bundle.meta, "grand_hotel");

  return (
    <Section id="culture" className={PAPER} width="wide">
      <SectionHeader
        eyebrow="· In the Culture"
        title="Three cultural events Brighton exported to the world"
      />

      <div className="space-y-12">
        <article>
          <h3 className={`${H3} mb-4`}>
            Brighton Rock (1938) — the razor blade under the pier
          </h3>
          <p className={BODY}>
            <strong>Graham Greene</strong>'s 1938 novel is the single
            most influential literary rendering of Brighton and, by
            extension, of English seaside noir. The book — which
            follows the Catholic teenage gangster <strong>Pinkie
            Brown</strong> through a murder and its aftermath among
            the Brighton razor gangs of the 1930s — takes its title
            from the peppermint stick with 'BRIGHTON' running through
            its middle, the candy still sold on the seafront. Greene
            wrote it partly as an argument with himself about Catholic
            grace and damnation, partly as a portrait of a specific
            Brighton subculture (the race-track gangs of the 1920s
            and 30s, the so-called 'boys' with bicycle chains and
            razors) that actually existed. The 1947 Boulting Brothers
            film of the novel, with Richard Attenborough as Pinkie,
            was shot on location. Brighton's reputation as a slightly
            dangerous, slightly glamorous, specifically English
            seaside destination is Greene's invention as much as the
            Regent's. The Royal Albion Hotel on the seafront — where
            several scenes are set — still trades partly on the
            novel's recognition.
          </p>
        </article>

        <article>
          <h3 className={`${H3} mb-4`}>
            Mods vs Rockers, 1964 — and Quadrophenia's long tail
          </h3>
          <p className={BODY}>
            On the <strong>Whitsun bank holiday of 1964</strong>, Mod
            scooter gangs and Rocker motorbike gangs converged on
            Brighton's Madeira Drive and the Aquarium terraces for
            what the newspapers called, with some exaggeration, a
            pitched battle. The actual violence was less dramatic than
            the photographs suggested — most of the damage was to
            deckchairs — but the images ran in every British paper.
            The Mods-vs-Rockers moral panic became the defining
            British youth-culture moment of the decade, and the
            Brighton seafront became, by association, the canonical
            British youth-rebellion setting. Pete Townshend of{" "}
            <strong>The Who</strong> had been at the 1964 clashes; his
            1973 rock opera <em>Quadrophenia</em> — about a Mod called
            Jimmy — ends on Brighton Beach. The 1979 film version,
            shot on location on Brighton Beach and in Kemptown,
            hard-wired Brighton into British cinema canon. Every scene
            of the bike chase along the promenade, every shot of
            Jimmy on the pebbles, was filmed within walking distance
            of the Palace Pier.
          </p>
          {modScooter && (
            <Figure
              image={modScooter}
              size="wide"
              tier="B"
              caption="A Mod scooter rally — not specifically the 1964 Brighton incident, but representative of the visual culture that made Quadrophenia, and Brighton, canonical."
              className="mt-6"
            />
          )}
        </article>

        <article>
          <h3 className={`${H3} mb-4`}>
            Brighton as political stage — from the 1984 bomb to the
            Pride parades
          </h3>
          <p className={BODY}>
            Brighton has been the site of several of post-war British
            politics's most dramatic moments. In the early hours of{" "}
            <strong>12 October 1984</strong>, during the Conservative
            Party conference, an IRA bomb planted by{" "}
            <strong>Patrick Magee</strong> detonated in the Grand
            Hotel on Kings Road. Prime Minister{" "}
            <strong>Margaret Thatcher</strong> was in her bathroom;
            she survived. <strong>Five others died</strong>, including
            Deputy Chief Whip Sir Anthony Berry and the wife of the
            Cabinet Secretary. The Grand was rebuilt and reopened two
            years later; the IRA's statement afterwards — "Today we
            were unlucky, but remember we only have to be lucky once"
            — is still studied in British security-service training.
            A decade later, in 1992, Brighton held its first{" "}
            <strong>Pride parade</strong>. By the 2010s, Brighton &
            Hove Pride had become the <strong>largest Pride in the
            United Kingdom</strong>, drawing 400,000+ participants
            across the first August weekend. Brighton's move from Tory
            conference city to queer-capital city happened in the
            same two decades. The town holds both histories without
            obvious contradiction.
          </p>
          {grandHotel && (
            <Figure
              image={grandHotel}
              size="wide"
              tier="B"
              caption="The Grand Hotel on Kings Road — rebuilt after the 1984 IRA bombing. The bomb killed five and very nearly killed Margaret Thatcher. Most British Conservative politicians of a certain age still have a view on that night."
              className="mt-6"
            />
          )}
        </article>
      </div>
    </Section>
  );
}

// ============================================================================
// HONEST CONTEXT — Kemptown / queer Brighton as the honest-reckoning
// ============================================================================

function HonestContextSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const note = bundle.showcase.favela_note;
  const kemptown = pickImage(bundle.meta, "kemptown");
  if (!note) return null;
  const paragraphs = note.split("\n\n").filter(Boolean);

  return (
    <Section id="honest" className={DARK}>
      <div className="max-w-3xl">
        <div
          className="text-[11px] font-mono uppercase tracking-[0.3em] mb-4"
          style={{ color: "var(--beach-supporting, #8B5A3C)" }}
        >
          · The Other Brighton
        </div>
        <h2 className={H2_DARK} style={{ fontFamily: DISPLAY_FF }}>
          The half of Brighton the Palace Pier doesn't show
        </h2>
        <p className="mt-5 text-lg italic text-[#94A3B8] font-serif">
          Kemptown is a mile east of the Palace Pier. It is not an
          extension of the tourist seafront — it is a specific
          neighborhood with a specific history, and it is the reason
          Brighton became Brighton. The pier-and-fish-and-chips
          Brighton is ten percent of the town. This is the other
          ninety.
        </p>
      </div>

      {kemptown && (
        <Figure
          image={kemptown}
          size="wide"
          tier="B"
          caption="A Kemptown street scene. Regency terraces, jet-black iron lamp posts, rainbow flags, pre-war pub signage. This is where Brighton gets interesting."
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
      name: "The Seven Sisters",
      distance: "20 km east",
      blurb:
        "Seven chalk cliffs rolling into the English Channel east of Eastbourne. The most-photographed coastal cliffs in England, visible at the end of the Sussex Heritage Coast walk. The headland — **Cuckmere Haven** — is one of the last undeveloped river mouths on the south coast. Ninety minutes by car from Brighton; easier by train to Seaford plus bus.",
    },
    {
      name: "Lewes",
      distance: "12 km north-east",
      blurb:
        "The Sussex county town where Richard Russell first wrote his seawater-cure thesis in 1754. Norman castle, medieval streets, the Bloomsbury-associated Charleston farmhouse 5 km out, and — every 5 November — the **Lewes Bonfire** night, by some accounts the largest Guy Fawkes celebration in England. Fifteen minutes by train from Brighton.",
    },
    {
      name: "Devil's Dyke",
      distance: "10 km north",
      blurb:
        "The deepest dry valley in Britain — a chalk cleft in the South Downs, roughly 100 metres deep, visible from the A23 as you approach Brighton. National Trust land. A half-day walk from the city bus terminus or a 15-minute drive; picnic country, kite-flying, the view south toward the Channel is the opening shot of most English-countryside films.",
    },
    {
      name: "Arundel",
      distance: "35 km west",
      blurb:
        "The medieval castle town in West Sussex, seat of the Duke of Norfolk. **Arundel Castle** is one of the longest continuously-inhabited private residences in England (since the 11th century). Half-day trip from Brighton by train; the castle grounds and the Fitzalan Chapel are the core. Pairs well with Chichester and the South Downs.",
    },
  ];
  return (
    <Section id="nearby" className={PAPER} width="wide">
      <SectionHeader
        eyebrow="· On the Sussex Coast"
        title="Four places within an hour"
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
// SPOKES FOOTER
// ============================================================================

function SpokeFooter() {
  const spokes = [
    {
      slug: "visiting",
      label: "Visiting Brighton",
      subtitle:
        "The London day-trip vs the weekend, where to stay, where to eat, and how to use a grey-sky pebble beach as a holiday.",
    },
    {
      slug: "pavilion",
      label: "The Royal Pavilion",
      subtitle:
        "George IV's Indo-Islamic pleasure palace — the architecture, the interiors, the kitchen, and the Regency history behind Britain's oddest royal building.",
    },
    {
      slug: "queer",
      label: "Queer Brighton",
      subtitle:
        "Kemptown, Duke's Mound, eighty years of British gay culture on this seafront, and why Brighton became the UK's queer capital.",
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
            href={`/beaches/brighton-beach-1/${s.slug}`}
            className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#3A4E5C)] transition-colors"
          >
            <h3
              className={`${H3} mb-3 group-hover:text-[color:var(--beach-primary,#3A4E5C)]`}
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
          Historical material on the Pavilion follows the Royal Pavilion
          & Museums Trust published documentation. Pier material draws on
          the West Pier Trust archives and contemporary press coverage
          of the 2003 fires (cause never officially determined).
          Graham Greene's <em>Brighton Rock</em> and its film
          adaptations, Quadrophenia's 1964 Mods-vs-Rockers
          reconstruction, and the 1984 IRA bombing are treated from the
          standard published scholarship. Queer-Brighton material from
          the Brighton Ourstory Project and the Royal Pavilion Museum's
          dedicated LGBTQ+ history programme. Version v0.9. Corrections
          welcome, particularly on Pavilion-interior detail and on
          current-decade Kemptown venue status.
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function BrightonPage({
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
    pickImage(meta, "west_pier_ruin") ??
    pickImage(meta, "palace_pier") ??
    undefined;

  return (
    <LegendaryShell composition={composition}>
      <Hero
        beachName={composition.beach_name}
        location={location}
        tagline="A grey-sky pebble beach where three centuries of English people came to be somebody else for a weekend."
        heroType="LAYERED"
        primary={primary}
        secondary={secondary}
        version={composition.version}
        tier={composition.tier}
      />

      <ClusterRail current="main" beachName={composition.beach_name} />

      <BrightonStory />
      <TwoPiersSection bundle={bundle} />
      <PavilionSection bundle={bundle} />
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
