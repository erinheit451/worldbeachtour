/**
 * Waikīkī — bespoke Tier 1 page. Legendary v2, revision 0.9.
 *
 * Thesis (spike):
 *   "Waikīkī is a royal beach that survived becoming a resort."
 *
 * The page argues continuity-through-rupture: the surfing tradition that
 * predates recorded history in these islands, the overthrow of the
 * Hawaiian Kingdom in 1893, and the global tourism industry that built
 * itself on top of a dispossessed royal estate are the same beach. The
 * beach is the continuity. Everything else is what happened to it.
 *
 * This is the second Tier 1 built under the v2 design language. It tests
 * whether the Nazaré vocabulary — tokens, palette, Section wrappers,
 * ClusterRail, ClusterAside — extracts across voice register (REVERENT
 * vs SEVERE), display pairing (CLASSICAL / DM Serif Display vs AUSTERE /
 * Barlow Condensed), hero type (LAYERED diptych vs SPIKE single), and
 * rupture type (political vs geological).
 *
 * Section palette (same rules as Nazaré):
 *   PAPER  (#FAFAF7): Story, History, Culture, Nearby, Spokes
 *   COOL   (#F1F5F9): The Overthrow, Duke (deep-explainers)
 *   CREAM  (#FAF6EF): Zones, Day, Beach Boys (place-anatomy)
 *   DARK   (#0F172A): Mālama Hawaiʻi (honest reckoning)
 */

import type {
  LegendaryPageBundle,
  SectionImage,
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
  ClusterRail,
  ClusterAside,
  ClusterLink,
  WAIKIKI_MAIN,
} from "./waikiki/shared";
import {
  SeaSurfSection,
  ComparisonSection,
  ThingsToKnowSection,
} from "./sections/standard-sections";

// ============================================================================
// STORY — 4 paragraphs, gestures, doesn't spoil
// ============================================================================

function WaikikiStory() {
  const paragraphs = [
    "Waikīkī is two miles of Pacific sand on the leeward shore of Oʻahu, anchored at the eastern end by the volcanic crater of **Diamond Head** and at the western end by the 1928 canal that drained the wetlands that used to be here. The Hawaiian word means \"spouting water\" — a reference to the springs and streams that once fed this stretch of coast, now buried under what became the template for every tropical beach destination on Earth.",
    "The land on which Waikīkī sits was a royal estate of the **Hawaiian Kingdom**, a sovereign nation-state with treaties with the United States, Britain, France, and Japan. That kingdom was overthrown in **January 1893** by a committee of American businessmen backed by U.S. Marines. The islands were annexed in 1898 without a treaty. The Royal Hawaiian Hotel, which opened on this sand in 1927 and gave the neighborhood its pink-stucco identity, sits on former Crown Lands.",
    "The sport that made Waikīkī globally famous is older than the kingdom that the United States dismantled. **Heʻe nalu** — surfing — was practiced by Hawaiian royalty on the breaks offshore of this beach for centuries before the first Westerner arrived. **Duke Paoa Kahanamoku**, Hawaiian, Olympic gold in 1912 and 1920, taught the rest of the world what the Ali'i had been doing here for a thousand years. He did so while his country was under foreign occupation.",
    "Waikīkī today is a beach of layers that do not always talk to each other. Two million visitors a year. Thirty thousand hotel rooms in two kilometers. A surfing tradition that predates recorded history. A statue of Duke on Kalākaua Avenue with fresh leis every morning. The canoes still launching off Kūhiō Beach at dawn.",
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
            color: var(--beach-primary, #1E5F74);
          }
        `}</style>

        <PullQuote size="hero">
          Waikīkī is a royal beach that survived becoming a resort.
        </PullQuote>
      </div>
    </section>
  );
}

// ============================================================================
// THE OVERTHROW — deep-explainer 1 (the rupture)
// ============================================================================

function OverthrowSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const lili = pickImage(bundle.meta, "liliuokalani");
  const palace = pickImage(bundle.meta, "iolani_palace");

  return (
    <Section id="overthrow" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· The Overthrow · 1893"
        title="What Waikīkī was before it was Waikīkī"
        kicker="Every postcard of this beach is an inheritance of a specific political event. The event has a date, a set of names, a legal record, and a formal U.S. Congressional apology. None of that is ancient history; the apology was signed in 1993."
      />

      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
        <div className="space-y-6">
          <h3 className={H3}>A recognized nation-state</h3>
          <p className={BODY}>
            The <strong>Hawaiian Kingdom</strong> — founded by{" "}
            <strong>Kamehameha I</strong> in 1795 when he unified the islands
            after the Battle of Nuʻuanu fought in the valley directly behind
            this beach — was a sovereign nation-state with formal
            international standing. It had signed treaties with the United
            States (1849), Britain (1851), France (1857), Germany, Belgium,
            Denmark, Italy, Japan, and a dozen other powers. Its monarchs
            sent ambassadors to European courts. Its currency was issued on
            the gold standard. Its constitution was English-language
            bilingual with Hawaiian. By the 1880s it was a member of the
            Universal Postal Union.
          </p>
          <p className={BODY}>
            By the time <strong>Queen Liliʻuokalani</strong> ascended the
            throne in January 1891, American and European planter families —
            descended largely from the Protestant missionary settlers of the
            1820s — controlled most of the sugar and pineapple industry. Her
            attempt in early 1893 to promulgate a new constitution restoring
            voting rights to Native Hawaiians that had been stripped by the
            earlier Bayonet Constitution of 1887 was the proximate trigger
            for what happened next.
          </p>

          {lili && (
            <Figure
              image={lili}
              size="wide"
              tier="B"
              caption="Queen Liliʻuokalani, photographed ca. 1891 by James J. Williams. She was the last sovereign of the Hawaiian Kingdom."
              className="my-8"
            />
          )}

          <h3 className={H3}>The coup</h3>
          <p className={BODY}>
            On <strong>17 January 1893</strong>, a group of thirteen American
            and European businessmen, calling themselves the{" "}
            <strong>Committee of Safety</strong>, declared the Hawaiian
            monarchy abolished. They were backed by <strong>162 U.S.
            Marines</strong> from the USS <em>Boston</em>, landed that day
            at Honolulu Harbour under the orders of U.S. Minister{" "}
            <strong>John L. Stevens</strong>. The Marines deployed at
            strategic positions around the palace and the government
            buildings — a display of force rather than engagement; they
            did not fire.
          </p>
          <p className={BODY}>
            The queen, advised that armed resistance would lead to the
            deaths of her people, yielded her authority in a formal written
            protest addressed to the United States government. She expected
            that the U.S., upon investigation, would restore her kingdom.
            President <strong>Grover Cleveland</strong> did investigate —
            commissioning the <strong>Blount Report</strong>, which
            concluded that the overthrow was illegal and called it "an act
            of war committed with the participation of a diplomatic
            representative of the United States and without authority of
            Congress." Cleveland urged restoration. The Senate refused.
          </p>
          <p className={BODY}>
            Five years later, in <strong>July 1898</strong>, and after
            Cleveland had left office, Congress annexed Hawaiʻi via a joint
            resolution — the <strong>Newlands Resolution</strong> — which
            bypassed the treaty process that had failed. The{" "}
            <strong>Kuʻe Petitions</strong>, signed by{" "}
            <strong>21,269 Native Hawaiians</strong> (more than half the
            indigenous population of the kingdom) explicitly protesting
            annexation, were delivered to the U.S. Senate. They are
            preserved in the U.S. National Archives. Annexation passed
            anyway.
          </p>

          {palace && (
            <Figure
              image={palace}
              size="wide"
              tier="B"
              caption="ʻIolani Palace — the only royal palace on U.S. soil. The queen was imprisoned here under house arrest from January 1895, following a failed counter-revolution, for eight months. The palace is two miles inland from the sand of Waikīkī."
              className="my-8"
            />
          )}

          <h3 className={H3}>The apology</h3>
          <p className={BODY}>
            On <strong>23 November 1993</strong>, the 100th anniversary of
            the overthrow, President Clinton signed{" "}
            <strong>Public Law 103-150</strong>: the Apology Resolution.
            Congress formally apologized for "the overthrow of the Kingdom
            of Hawaiʻi on January 17, 1893" and acknowledged that Native
            Hawaiians <em>"never directly relinquished their claims to
            their inherent sovereignty as a people over their national
            lands."</em> The resolution has no binding legal force. It is
            a statement of historical fact.
          </p>
          <p className={BODY}>
            What this means for the Waikīkī a visitor experiences: the
            beach in front of the Royal Hawaiian Hotel and the Moana
            Surfrider sits on former Crown Lands — the trust holding
            established for the maintenance of the Hawaiian monarchy and
            the support of the Hawaiian people. After the overthrow, those
            lands passed to the Republic of Hawaiʻi (1894), then to the
            United States at annexation (1898), then to the State of
            Hawaiʻi at statehood (1959). They remain contested. The
            Hawaiian homestead waiting list — for a program created in
            1920 to return a portion of these lands to Native Hawaiian
            families — is <strong>decades long</strong>. More on that in
            the <ClusterLink to="malama" /> spoke.
          </p>
        </div>

        <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
          <div className={`${EYEBROW} mb-5`}>· The Record</div>
          <dl className="space-y-5">
            <Fact label="Kingdom founded" value="1795" />
            <Fact label="Overthrow" value="17 Jan 1893" />
            <Fact label="U.S. Marines landed" value="162" />
            <Fact label="Kuʻe Petition signatures" value="21,269" />
            <Fact label="% of indigenous population" value="~58%" />
            <Fact label="Annexation (joint resolution)" value="1898" />
            <Fact label="Statehood" value="1959" />
            <Fact label="U.S. Apology Resolution" value="1993" />
          </dl>
          <p className="mt-6 text-xs italic text-volcanic-500 leading-relaxed">
            Sources: Blount Report (1893); Morgan Report (1894); Newlands
            Resolution (1898); U.S. Public Law 103-150 (1993); Kuʻe
            Petitions, U.S. National Archives.
          </p>
        </aside>
      </div>
    </Section>
  );
}

// ============================================================================
// DUKE AND THE REINTRODUCTION — deep-explainer 2 (continuity / export)
// ============================================================================

function DukeSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const duke1920s = pickImage(bundle.meta, "duke_1920s");
  const dukeStatue = pickImage(bundle.meta, "duke_statue");
  const dukeAmelia = pickImage(bundle.meta, "duke_amelia");
  const canoesPainting = pickImage(bundle.meta, "canoe_surfing_painting");

  return (
    <Section id="duke" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· Duke · 1912"
        title="How a Hawaiian Olympian taught the planet to surf"
        kicker="Duke Paoa Kahanamoku was born three years before his country was overthrown. By the time he was twenty-two he had won Olympic gold in Stockholm and made his hometown beach into the most-watched stretch of sand on Earth. The sport he exported had been practiced on this exact water for a thousand years."
      />

      <div className="space-y-6 max-w-3xl">
        <h3 className={H3}>What surfing was before 1820</h3>
        <p className={BODY}>
          In the Hawaiian islands before sustained Western contact,{" "}
          <strong>heʻe nalu</strong> — "wave sliding" — was the most
          important athletic and spiritual practice of the{" "}
          <strong>Aliʻi</strong>, the chiefly class. The best breaks were
          reserved for nobility; commoners surfed on less-prized waves.
          Oral tradition records specific chiefs by specific wave at
          Waikīkī — <strong>Kalanikūpule</strong> on one break,{" "}
          <strong>Kamehameha I</strong> on another. The boards were{" "}
          <em>koa</em> wood, sometimes fifteen feet long, individually
          shaped by the rider and ceremonially blessed. Surfing was
          indistinguishable from religious practice; it was a way of
          maintaining relationship with the ocean gods.
        </p>

        {canoesPainting && (
          <Figure
            image={canoesPainting}
            size="wide"
            tier="B"
            datePrefix="ca. 1890"
            caption="D. Howard Hitchcock — 'Canoe Surfing, Waikiki.' The practice of riding outrigger canoes down the same waves modern surfers ride today is continuous from pre-contact through to the beach boys era into the current canoe clubs working this water."
            className="my-8"
          />
        )}

        <h3 className={H3}>The near-extinction</h3>
        <p className={BODY}>
          American Protestant missionaries began arriving in Hawaiʻi in
          1820. Their view of surfing — naked bodies, men and women
          together in the water, connected to an Indigenous religious
          framework they sought to replace — was that it should be
          discouraged. Simultaneously, introduced diseases collapsed the
          Hawaiian population: from roughly 400,000 at the time of Cook's
          arrival in 1778 to under 40,000 by the 1890s — a ninety percent
          loss in a century. A small-population culture cannot maintain
          an extensive cultural practice. By 1890 surfing was not extinct
          but it was close. There were fewer than a hundred active
          surfers in the islands.
        </p>

        <h3 className={H3}>Duke</h3>
        <p className={BODY}>
          <strong>Duke Paoa Kahanamoku</strong> was born on{" "}
          <strong>24 August 1890</strong> — three years before the
          overthrow — to a Native Hawaiian family living in the Kakaʻako
          neighborhood of Honolulu. His father was named for Prince{" "}
          <em>Duke</em> of Edinburgh, who had visited the islands in
          1869; the name passed to the son. He grew up swimming and
          surfing at Waikīkī. By his late teens he was known among the
          local Hawaiian and haole watermen as extraordinary in the
          water.
        </p>

        {duke1920s && (
          <Figure
            image={duke1920s}
            size="wide"
            tier="B"
            datePrefix="ca. 1920"
            caption="Duke Kahanamoku with his koa-wood surfboard. His favored board measured approximately 16 feet and was shaped for the long, sloping Waikīkī waves he had ridden since childhood."
            className="my-8"
          />
        )}

        <p className={BODY}>
          At the <strong>1912 Stockholm Olympics</strong>, Duke won gold in
          the 100-meter freestyle, setting a world record. He won gold
          again in the same event at <strong>Antwerp in 1920</strong>,
          along with silver in the 4×200m relay and a third medal in
          1924 at Paris. He was, in the 1910s and 20s, the most famous
          Hawaiian in the world — and one of the few Indigenous athletes
          of his generation to achieve global fame.
        </p>
        <p className={BODY}>
          The Olympic platform was the vehicle for something else. Duke
          used his swimming tours to put on{" "}
          <strong>surfing demonstrations</strong>. On{" "}
          <strong>24 December 1914</strong> at Freshwater Beach, Sydney,
          he performed the first-ever surfing demonstration witnessed by
          an Australian audience — a ride that is now commemorated with
          a statue on that beach and treated as the birth of Australian
          surfing. He did the same in Southern California (Corona del
          Mar, Newport, Balboa) through the 1910s and 20s. Every modern
          Australian surf club and every modern California surfing
          tradition descends, directly, from these demonstrations.
        </p>

        {dukeAmelia && (
          <Figure
            image={dukeAmelia}
            size="wide"
            tier="B"
            datePrefix="ca. 1935"
            caption="Amelia Earhart and Duke Kahanamoku in Hawaiʻi. In the 1930s Duke had become the official greeter of visiting dignitaries and celebrities — a role he performed until his death in 1968. He is probably the most-photographed Hawaiian of the 20th century."
            className="my-8"
          />
        )}

        <h3 className={H3}>The beach boys of Waikīkī</h3>
        <p className={BODY}>
          Duke was the face. The transmission mechanism was a community of
          Hawaiian watermen — <strong>the beach boys of Waikīkī</strong>{" "}
          — who worked the hotels (the Moana from 1901, the Outrigger
          Canoe Club from 1908, the Royal Hawaiian from 1927) as surf
          instructors, lifeguards, canoe captains, and general
          ambassadors of the Hawaiian ocean to the arriving tourists. The
          names — <strong>Panama Dave</strong>,{" "}
          <strong>Steamboat Mokuahi</strong>,{" "}
          <strong>Tom Blake</strong>,{" "}
          <strong>Rabbit Kekai</strong>,{" "}
          <strong>Blue Makua</strong>,{" "}
          <strong>Sally Hale</strong> — are remembered locally in ways
          that rarely translate outside Hawaiʻi. What they did was teach
          several decades of foreign visitors how to surf and how to
          paddle a Hawaiian outrigger. They are the reason the template
          of "tropical beach plus local instructor" exists globally in
          the form it does.
        </p>
        <p className={BODY}>
          The <strong>Outrigger Canoe Club</strong>, founded in 1908 on
          the sand between the Moana Hotel and the Royal Hawaiian, was
          explicit about its purpose: <em>"the reviving of the ancient
          Hawaiian sports."</em> It is still operating on the same beach.
          Its members still surf and paddle the same breaks. The beach
          boys tradition continues today, in the form of the canoe
          captains working Kūhiō Beach each dawn, the surf-school
          instructors on the Gray's Beach sand, and the organized
          catamaran sails launching from the Royal Hawaiian stretch each
          afternoon.
        </p>

        {dukeStatue && (
          <Figure
            image={dukeStatue}
            size="wide"
            tier="B"
            caption="The bronze statue of Duke Kahanamoku on Kalākaua Avenue, installed 2002. Every morning the statue receives fresh leis — the flowers are replaced silently, by unnamed Honoluluans, before the first tourists arrive."
            className="my-8"
          />
        )}

        <p className={BODY}>
          Duke died in 1968 at age 77. His ashes were scattered in the
          Pacific off Waikīkī by his friends and the beach boys. The
          statue on Kalākaua Avenue was installed in 2002. It depicts him
          arms-outstretched in front of a longboard — a welcoming
          gesture, the posture of{" "}
          <strong>aloha</strong> — and it is, arguably, the most
          photographed single object in Hawaiʻi. The leis that appear on
          it are not maintained by the hotel, or the city, or Parks and
          Recreation. They are replaced every morning by the people who
          live here, out of gratitude for what a Hawaiian man from this
          beach did for Hawaiʻi's place in the world.
        </p>
      </div>

      <ClusterAside>
        How to actually take a first surfing lesson at Waikīkī —
        where to go, which surf schools to consider, what to expect
        your first day — is in <ClusterLink to="surf" />.
      </ClusterAside>
    </Section>
  );
}

// ============================================================================
// ZONES — six beaches, one name
// ============================================================================

function ZonesSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const aerial = pickImage(bundle.meta, "aerial_iss_hawaii");
  const zones: Zone[] = bundle.showcase.zones ?? [];

  return (
    <Section id="zones" className={CREAM} width="wide">
      <SectionHeader
        eyebrow="· Six Beaches, One Name"
        title="What the map calls Waikīkī is actually six beaches"
        kicker="From the Ala Wai canal at the ʻEwa end to the Kapiʻolani park under Diamond Head is two miles. The beach is continuous. The experience of each stretch is not."
      />

      {aerial && (
        <Figure
          image={aerial}
          size="wide"
          tier="B"
          caption="Waikīkī and Honolulu seen from the International Space Station, photographed by astronaut Scott Kelly. Diamond Head's crater is the round feature at right; the Ala Wai Canal cuts diagonally across the frame below the strip of beach."
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
              <div className="mt-4 border-l-2 border-[color:var(--beach-primary,#1E5F74)] pl-4">
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[color:var(--beach-primary,#1E5F74)] mb-1">
                  Local note
                </div>
                <p className={BODY_SM}>{z.notes}</p>
              </div>
            )}
          </article>
        ))}
      </div>

      <ClusterAside>
        Where to stay, how to get to the airport, what to eat, and which
        beach matches which traveller is in <ClusterLink to="visiting" />.
      </ClusterAside>
    </Section>
  );
}

// ============================================================================
// A DAY HERE — atmospheric vignettes
// ============================================================================

function DaySection({ bundle }: { bundle: LegendaryPageBundle }) {
  const day = bundle.showcase.day_in_time;
  const night = pickImage(bundle.meta, "panorama_arc");
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
        title="What it actually feels like, hour by hour"
      />

      {night && (
        <Figure
          image={night}
          size="wide"
          tier="B"
          caption="Waikīkī at night, 10-second exposure — photograph by davidpinter. The Hilton Hawaiian Village Friday fireworks light the western end of the bay; Diamond Head is visible on the horizon to the east."
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
// THE BEACH BOYS — living practice
// ============================================================================

function BeachBoysSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const canoes = pickImage(bundle.meta, "canoes_waikiki");
  const helumoa = pickImage(bundle.meta, "helumoa_historic_painting");
  const moanaHotel = pickImage(bundle.meta, "moana_hotel");

  return (
    <Section id="beach-boys" className={CREAM} width="wide">
      <SectionHeader
        eyebrow="· The Beach Boys"
        title="The institution that carries the tradition — still daily, on this sand"
        kicker="In every surf-tourism beach around the world there is a local waterman who teaches foreigners. The pattern was invented here, by specific Hawaiian men, for specific reasons, in a specific decade of the 20th century. The work is still being done on the same beach."
      />

      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
        <div className="space-y-6">
          <p className={BODY}>
            The beach boys of Waikīkī were a loose occupational community
            of Hawaiian watermen who worked the shoreline between the
            Moana Hotel and the Royal Hawaiian from approximately 1910
            onward. They were <strong>surf instructors, canoe captains,
            catamaran crews, lifeguards, hula musicians, and
            occasionally — through their introductions and informal
            adoption — Hawaiian cultural ambassadors</strong> for the
            foreign visitors who had begun arriving on Matson steamships
            from San Francisco.
          </p>

          {helumoa && (
            <Figure
              image={helumoa}
              size="wide"
              tier="B"
              datePrefix="ca. 1895"
              caption="Charles Furneaux — 'Diamond Head, Waikiki Beach, and Helumoa.' Helumoa was the coconut grove royal compound on what is now the Royal Hawaiian Hotel site. The compound was in continuous royal use from the time of Kamehameha I until the overthrow."
            />
          )}

          <p className={BODY}>
            The occupation is older than the hotels that formalized it.
            It grows out of the <strong>koʻa</strong> — a pre-contact
            Hawaiian custom in which a family or community claimed
            responsibility for a specific stretch of reef and the fishing
            and surfing rights on it. When Westerners began arriving in
            the 19th century, the watermen of that particular stretch
            were already the people who knew the reefs, the currents,
            the breaks, and the dangers. The beach boys of Waikīkī in
            1920 were the descendants of the koʻa-holders of 1820.
          </p>

          {moanaHotel && (
            <Figure
              image={moanaHotel}
              size="wide"
              tier="B"
              caption="The Moana Hotel, opened 1901 — the first major tourist hotel on Waikīkī. Beaux-Arts architecture; still operating as the Moana Surfrider. The banyan tree on its courtyard (planted 1904) has hosted broadcasts of the 'Hawaii Calls' radio show since 1935."
            />
          )}

          <h3 className={`${H3} mt-6`}>The institution</h3>
          <p className={BODY}>
            The <strong>Outrigger Canoe Club</strong>, founded 1908 by
            journalist Alexander Hume Ford together with a group of
            Hawaiian and haole watermen, was the formalization. Its
            founding documents list "the reviving of the ancient Hawaiian
            sports" as its explicit purpose. Duke Kahanamoku was an early
            member. It is still a private club — membership is
            difficult — and its clubhouse still sits on the sand at
            Waikīkī between the Halekulani and the Royal Hawaiian. Its
            annual canoe regatta on the Fourth of July has been run
            every year since 1908.
          </p>
          <p className={BODY}>
            The equivalent institution for non-members is the{" "}
            <strong>Hawaiian Canoe Association</strong>, which runs
            regattas across the summer months at Waikīkī, Keʻehi, and
            other Oʻahu beaches. The six-person outrigger canoe is the
            oldest continuously-used Hawaiian technology on this stretch
            of water. The canoes you see being pulled down the sand at
            Kūhiō Beach at dawn are a direct lineal practice with the
            canoes Kamehameha I beached here in 1795.
          </p>

          {canoes && (
            <Figure
              image={canoes}
              size="wide"
              tier="B"
              caption="Outrigger canoes and surfers at Waikīkī Beach — photograph by Charles O'Rear for the National Archives. The canoe-surf shuttles still run daily: six paddlers, one captain at the helm, one wave caught, a two-minute ride back to shore. Four dollars per rider in 2026."
              className="my-6"
            />
          )}

          <h3 className={H3}>Who is still doing this work</h3>
          <p className={BODY}>
            In 2026, the canoe clubs that run daily operations on Waikīkī
            are the Outrigger Canoe Club (private), the{" "}
            <strong>Hui Nalu Canoe Club</strong> (founded 1908 as the
            "Hawaiian" counter-club to the more haole-heavy Outrigger),
            and the <strong>Waikīkī Beach Services</strong> concessions
            that lease space in front of the major hotels. The surf
            schools — dozens of them — are concentrated around Gray's
            Beach and the Royal Hawaiian stretch, operating informally
            on the beach and formally through hotel partnerships. Many
            of the instructors are Native Hawaiian; some are Hawaiian
            cultural practitioners who also teach hula and ʻōlelo
            Hawaiʻi (the Hawaiian language). The work is real work. It
            is also, for many of them, an inheritance.
          </p>
        </div>

        <aside className="lg:sticky lg:top-24 rounded-sm border border-[#E7E2D4] bg-white p-7">
          <div className={`${EYEBROW} mb-5`}>· The Work</div>
          <dl className="space-y-5">
            <Fact label="Outrigger Canoe Club founded" value="1908" />
            <Fact label="Hui Nalu Canoe Club founded" value="1908" />
            <Fact label="Canoe shuttle ride" value="$4, 2 min" />
            <Fact label="Paddlers per canoe" value="6 + captain" />
            <Fact label="Surf schools on the strip" value="~40" />
            <Fact label="Duke Kahanamoku's first medal" value="1912" />
            <Fact label="Continuous practice since" value="Pre-contact" />
          </dl>
        </aside>
      </div>
    </Section>
  );
}

// ============================================================================
// HISTORY — seven turning points
// ============================================================================

const HISTORY_KEEP = new Set([1795, 1893, 1901, 1912, 1927, 1959, 1993]);

function TimelineSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const all: TimelineEvent[] = bundle.showcase.timeline ?? [];
  const events = all.filter((e) => HISTORY_KEEP.has(e.year)).slice(0, 7);

  return (
    <Section id="history" className={PAPER}>
      <SectionHeader
        eyebrow="· History"
        title="Seven dates that made Waikīkī Waikīkī"
        kicker="Every other event in this beach's recorded history is a subdivision of one of these seven."
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
                style={{ backgroundColor: "var(--beach-primary, #1E5F74)" }}
              />
              <div className={`${EYEBROW} mb-2`}>{tag}</div>
              <h3 className={`${H3} mb-2`}>{ev.title}</h3>
              <p className={BODY_SM}>{ev.description}</p>
              {ev.wiki_url && (
                <a
                  href={ev.wiki_url}
                  target="_blank"
                  rel="noopener"
                  className="mt-2 inline-block text-xs font-mono uppercase tracking-wider text-[color:var(--beach-primary,#1E5F74)] underline decoration-dotted underline-offset-4 hover:no-underline"
                >
                  Wikipedia →
                </a>
              )}
            </li>
          );
        })}
      </ol>

      <ClusterAside>
        The full story of the 1893 overthrow — and what the U.S. Apology
        Resolution of 1993 did and did not settle — is treated at length
        in <ClusterLink to="malama" />.
      </ClusterAside>
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
  const royalCourtyard = pickImage(bundle.meta, "royal_hawaiian_courtyard");

  return (
    <Section id="culture" className={PAPER} width="wide">
      <SectionHeader
        eyebrow="· In the Culture"
        title="Three cultural objects that built and rebuilt the image of Waikīkī"
      />

      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] items-start">
        <div className="space-y-12">
          <article>
            <h3 className={`${H3} mb-4`}>
              Blue Hawaii (1961) and Hawaii Five-O (1968) — the Hollywood
              era
            </h3>
            <p className={BODY}>
              The Hollywood version of Waikīkī was largely constructed
              between 1961 and 1980. Elvis Presley's <em>Blue Hawaii</em>,
              filmed at Waikīkī and Hanauma Bay in spring 1961, was the
              second-highest-grossing film of that year; it presented
              Hawaiʻi to the post-war American middle class as a
              destination that was genuinely foreign-feeling but still
              domestically accessible (flights from Los Angeles had
              become affordable through the late 1950s as Pan Am jet
              service expanded). The film <strong>doubled tourism to
              Hawaiʻi</strong> within five years of its release. Seven
              years later, Jack Lord's silhouette against the Ilikai
              penthouse in the opening credits of{" "}
              <em>Hawaii Five-O</em> became Waikīkī's global television
              image for the next twelve years of the show's run —
              shifting American television's idea of "the tropics" from
              backlot sets to real Hawaiian locations. Every U.S. city
              with local-news travel segments in the 1970s assumed its
              audience knew the Ilikai penthouse by sight.
            </p>
          </article>

          <article>
            <h3 className={`${H3} mb-4`}>
              The Hawaiian Renaissance (1970s–present) — cultural revival
            </h3>
            <p className={BODY}>
              In the 1970s a generation of Native Hawaiian musicians,
              scholars, and activists launched what is now called the{" "}
              <strong>Hawaiian Renaissance</strong>. The revival had
              multiple strands:{" "}
              <strong>Hōkūleʻa</strong>, the double-hulled traditional
              voyaging canoe, was built and launched in 1975, and sailed
              from Hawaiʻi to Tahiti by traditional non-instrument
              navigation in 1976 — proving that pre-contact Polynesian
              wayfinding had been astronomical, reliable, and
              reproducible. The{" "}
              <strong>Merrie Monarch Festival</strong>, founded 1963 in
              Hilo and named for King David Kalākaua, became the annual
              championship of Hawaiian <strong>hula</strong> and the
              institutional backbone of hula's survival. The Hawaiian
              language, once on the edge of extinction (fluent speakers
              numbered only a few thousand by the 1970s), was
              re-established in the <strong>Pūnana Leo</strong> language
              immersion schools from 1983 onward. These movements did
              not begin at Waikīkī. They happen at Waikīkī now — the
              sunset hula performances at the Kūhiō Beach Hula Mound,
              the slack-key guitar evenings at House Without a Key, the
              Merrie Monarch week broadcasts visible in every hotel
              room — because Waikīkī is where the tourism traffic is
              and because making the culture visible to visitors is
              part of the project.
            </p>
          </article>

          <article>
            <h3 className={`${H3} mb-4`}>
              The Duke statue (2002) — the ongoing quiet pilgrimage
            </h3>
            <p className={BODY}>
              The bronze Duke Kahanamoku statue on Kalākaua Avenue at
              Kūhiō Beach was installed in 2002, thirty-four years after
              Duke's death. It receives fresh leis every morning. The
              leis are not a Parks-and-Recreation program or a hotel
              concession. They are brought by individual{" "}
              <strong>Honoluluans</strong> — sometimes before dawn,
              often before first light, always silently — and placed
              without ceremony around the statue's neck and on the
              longboard behind it. By 9 a.m. the statue is fully
              garlanded; by noon, with the sun on it, the flowers have
              begun to wilt; by dusk, the previous day's leis have been
              taken away and the cycle begins again. It is arguably the
              most-photographed single object in Hawaiʻi, and it is
              also, quietly, a modern Hawaiian ritual. The statue is
              not a tourist object; the flowers are not performed for
              visitors. The statue is a Hawaiian man on a Hawaiian
              beach, and Hawaiians bring him flowers.
            </p>
          </article>
        </div>

        {royalCourtyard && (
          <Figure
            image={royalCourtyard}
            size="wide"
            tier="B"
            caption="The courtyard of the Royal Hawaiian, the 'Pink Palace of the Pacific' — opened 1927 on former Crown Lands. Spanish-Moorish architecture by Warren and Wetmore (also responsible for Grand Central Terminal and the Helmsley Building in New York). The postcard image of Waikīkī for most of the 20th century originates with this building's exterior."
            className="lg:sticky lg:top-24"
          />
        )}
      </div>
    </Section>
  );
}

// ============================================================================
// MĀLAMA HAWAIʻI — honest reckoning (uses existing favela_note content)
// ============================================================================

function MalamaSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const natatorium = pickImage(bundle.meta, "natatorium");
  const note =
    bundle.showcase.favela_note ?? bundle.showcase.honest_reckoning_note;
  if (!note) return null;
  const paragraphs = note.split("\n\n").filter(Boolean);

  return (
    <Section id="malama" className={DARK}>
      <div className="max-w-3xl">
        <div
          className="text-[11px] font-mono uppercase tracking-[0.3em] mb-4"
          style={{ color: "var(--beach-supporting, #E8B4B8)" }}
        >
          · Mālama Hawaiʻi
        </div>
        <h2 className={H2_DARK} style={{ fontFamily: DISPLAY_FF }}>
          What the postcard doesn't show
        </h2>
        <p className="mt-5 text-lg italic text-[#94A3B8] font-serif">
          <em>Mālama</em> — to care for, to protect, to serve. A Hawaiian
          principle with legal and ceremonial weight, not a slogan. The
          beach you are visiting sits on land that was taken. How you
          visit it matters.
        </p>
      </div>

      {natatorium && (
        <Figure
          image={natatorium}
          size="wide"
          tier="B"
          caption="The Waikīkī War Memorial Natatorium at sunrise — a Beaux-Arts saltwater pool built in 1927 to honor Hawaiians who served in WWI, including Duke Kahanamoku. Closed since 1979 for structural reasons. Hawaiʻi's most beautiful ruin; a proposed restoration has been discussed for forty years without resolution. The state of the Natatorium is a fair proxy for the state of Hawaiian civic investment."
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
// NEARBY — five places within an hour
// ============================================================================

function NearbySection() {
  const places = [
    {
      name: "ʻIolani Palace",
      distance: "2 miles inland",
      blurb:
        "The only royal palace on U.S. soil. Built 1882 by King David Kalākaua, occupied by the Hawaiian monarchy until the 1893 overthrow, then used as the capitol of the Territory and State of Hawaiʻi until 1969. You can tour the room where Queen Liliʻuokalani was held under house arrest in 1895. Admission $26.95. Go early in the day; the ground-floor galleries include the original throne room restored to 1893 condition.",
    },
    {
      name: "Diamond Head (Lēʻahi)",
      distance: "Eastern end of Waikīkī",
      blurb:
        "The 232,000-year-old volcanic tuff crater visible from every Waikīkī postcard. The summit trail is 1.6 miles round trip, switchbacks through a military-era tunnel, and emerges at a 760-foot pillbox observation post with an uninterrupted view back down the beach. Entry $5; reservations required. Go at sunrise; the west-facing summit is warmer in afternoon light but brighter before the trades pick up.",
    },
    {
      name: "Pearl Harbor / USS Arizona Memorial",
      distance: "10 miles west",
      blurb:
        "The U.S. Navy base attacked by Imperial Japan on 7 December 1941. The USS Arizona Memorial — a white concrete structure built over the sunken battleship in 1962 — is one of the most-visited national monuments in the country. Free; timed-entry tickets required; Bus 20 runs directly from Waikīkī. The Pacific Aviation Museum on Ford Island and the USS Missouri (the battleship on which Japan formally surrendered) are separate admissions.",
    },
    {
      name: "Lanikai Beach",
      distance: "30 minutes east",
      blurb:
        "On the windward side of Oʻahu — past the Pali. Calm, turquoise, with the Mokulua Islands offshore. Probably the most-photographed beach in Hawaiʻi after Waikīkī itself, and in every respect the opposite: residential neighborhood, street parking only, no hotels, no commerce. Walk at sunrise or after 4 p.m. for light; mid-day the small beach is crowded with the thirty cars that fit on the street.",
    },
    {
      name: "The North Shore — Pipeline, Waimea, Sunset",
      distance: "1 hour north",
      blurb:
        "The 7-mile stretch of Oʻahu's northern coast that hosts the world's marquee winter big-wave surf events — the **Billabong Pipeline Masters**, the **Eddie Aikau Big Wave Invitational** at Waimea Bay — from November through February. Pipeline's wave is one of surfing's iconic barrels; Waimea is where paddle-in big-wave surfing was effectively invented in the 1950s. Worth a day trip even in summer, when the waves are small, for Matsumoto's shave ice in Haleʻiwa, the shrimp trucks at Kahuku, and the raw scale of the coastline.",
    },
  ];
  return (
    <Section id="nearby" className={PAPER} width="wide">
      <SectionHeader
        eyebrow="· On Oʻahu"
        title="Five places within an hour"
        kicker="Waikīkī is the visitor's default base. The rest of Oʻahu is why Oʻahu is interesting."
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
      label: "Visiting Waikīkī",
      subtitle:
        "Getting here, where to stay on a strip of 30,000 rooms, what to eat, visitor safety, three itineraries.",
    },
    {
      slug: "surf",
      label: "Learning to Surf",
      subtitle:
        "The beach the world learns to surf on. Which school, which break, how to take your first lesson — and what the beach boys tradition actually requires of a visitor.",
    },
    {
      slug: "malama",
      label: "Mālama Hawaiʻi",
      subtitle:
        "The full story of the overthrow, sovereignty today, Hawaiian language and homestead, and how to visit Waikīkī without flattening a living kingdom into a backdrop.",
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
            href={`${WAIKIKI_MAIN}/${s.slug}`}
            className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#1E5F74)] transition-colors"
          >
            <h3
              className={`${H3} mb-3 group-hover:text-[color:var(--beach-primary,#1E5F74)]`}
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
          Hawaiian orthography — with kahakō (macron) and ʻokina (glottal)
          — is used throughout. Historical material on the overthrow
          follows the U.S. Blount Report (1893), the Morgan Report (1894),
          the Newlands Resolution (1898), and U.S. Public Law 103-150 (the
          1993 Apology Resolution). Duke Kahanamoku biographical detail
          draws on Hall (1994) <em>Memories of Duke</em> and the Bishop
          Museum archives. Named Hawaiian historical figures follow
          standard Hawaiian-language spellings. The Hawaiian cultural
          material is researched; where the page describes living
          practice (the Merrie Monarch Festival, the Hula Mound
          performances, the Outrigger Canoe Club's regatta), visitors
          are encouraged to experience those programs as they are run by
          Hawaiian cultural practitioners. Corrections welcome,
          particularly on ʻōlelo Hawaiʻi framing and on named practices.
          Version v0.9.
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function WaikikiV2Page({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta, data } = bundle;
  const location = [data.admin_level_1, data.country_code]
    .filter(Boolean)
    .join(", ");

  const primaryHero = meta.images.hero;
  const secondaryHero =
    pickImage(meta, "duke_1920s") ??
    pickImage(meta, "canoes_waikiki") ??
    undefined;

  return (
    <LegendaryShell composition={composition}>
      <Hero
        beachName={composition.beach_name}
        location={location}
        tagline="A royal beach that survived becoming a resort."
        heroType="LAYERED"
        primary={primaryHero}
        secondary={secondaryHero}
        version={composition.version}
        tier={composition.tier}
      />

      <ClusterRail current="main" beachName={composition.beach_name} />

      <WaikikiStory />
      <OverthrowSection bundle={bundle} />
      <DukeSection bundle={bundle} />
      <ZonesSection bundle={bundle} />
      <DaySection bundle={bundle} />
      <BeachBoysSection bundle={bundle} />
      <TimelineSection bundle={bundle} />
      <CulturalFootprintSection bundle={bundle} />
      <MalamaSection bundle={bundle} />

      {/* Data axis — the fusion: generic conditions modules onto bespoke editorial */}
      <SeaSurfSection bundle={bundle} />
      <ComparisonSection bundle={bundle} />
      <ThingsToKnowSection bundle={bundle} />

      <NearbySection />
      <SpokeFooter />
      <PageProvenance bundle={bundle} />
    </LegendaryShell>
  );
}
