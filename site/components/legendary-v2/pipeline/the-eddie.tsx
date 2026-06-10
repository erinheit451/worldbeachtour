/**
 * Pipeline → The Eddie (Waimea + Eddie Aikau deep-dive spoke).
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

export default function PipelineEddiePage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage =
    pickImage(meta, "eddie_aikau") ?? meta.images.hero;
  const eddieImg = pickImage(meta, "eddie_aikau");
  const waimeaValley = pickImage(meta, "waimea_valley");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="the-eddie" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· The Eddie"
        title="Waimea Bay, Eddie Aikau, and the paddle-in big-wave tradition"
        kicker="Five kilometers west of Pipeline is a bay that hosts a different kind of surf — open-faced big waves, paddle-in rather than tow-in, rooted in Hawaiian watermen tradition. Its signature event is an invitational contest named for a man who died in 1978 trying to save other surfers. It has only been held ten times since 1985."
        image={heroImage}
      />

      {/* --- Who Eddie was --- */}
      <Section id="eddie" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Eddie Aikau · 1946–1978"
          title="The Native Hawaiian lifeguard and big-wave surfer the event is named for"
          kicker="Before the contest, before the 'Eddie would go' slogan, before the t-shirts: a specific man from a specific family lived on this coast, saved hundreds of lives, and died at sea in 1978 attempting another rescue. Understanding the Eddie means understanding him first."
        />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6">
            <h3 className={H3}>The lifeguard</h3>
            <p className={BODY}>
              <strong>Edward Ryon Makuahanai 'Eddie' Aikau</strong>
              was born in Kahului, Maui, in <strong>1946</strong>,
              and moved with his family to Oʻahu in the early
              1950s. He grew up in Chinatown, Honolulu, then moved
              to the North Shore as a teenager. In 1968, at age 22,
              he was hired as <strong>Waimea Bay's first lifeguard</strong>{" "}
              — the first person paid to work this beach in that
              capacity. At the time, the North Shore big-wave
              season was considered effectively un-lifeguardable.
              The official municipal position was that experienced
              surfers accepted the risk; what happened to them was
              not a public-safety matter.
            </p>
            <p className={BODY}>
              Aikau rejected this premise. Over the <strong>ten years
              1968–1978</strong>, he is credited with{" "}
              <strong>over 500 documented rescues</strong> at Waimea
              and adjacent North Shore beaches, including rescues
              in conditions in which the Honolulu Fire Department
              lifeguards had formally refused to enter the water.
              The phrase <strong>"Eddie would go"</strong> — later
              shortened to a slogan — originally meant, very
              literally: Eddie Aikau will attempt the rescue that
              other lifeguards judge too dangerous. He did. Every
              reliable account is that he meant it, and did it, as
              a matter of personal ethics about his responsibility
              to the people in his water.
            </p>

            {eddieImg && (
              <Figure
                image={eddieImg}
                size="wide"
                tier="B"
                datePrefix="Feb 2016"
                caption="The Eddie Aikau Big Wave Invitational at Waimea Bay, 2016 — the first running of the contest in seven years. Attendance exceeds the bay's capacity; the event is a cultural landmark far beyond surfing."
              />
            )}

            <h3 className={`${H3} mt-10`}>The surfer</h3>
            <p className={BODY}>
              Eddie was also, independent of his lifeguard work,
              <strong> one of the dominant North Shore big-wave
              surfers of the 1970s</strong>. He won the Duke
              Kahanamoku Invitational Surfing Championships in
              1977 — the most prestigious Hawaiian surf contest of
              the pre-ASP era. He was known for paddling into
              waves others would not, riding the largest Waimea
              days under his own power, and maintaining a clean
              traditional Hawaiian longboard style at a time when
              the sport was being re-defined by shorter-board
              shortboarders. His contest style was not flashy; his
              free-surfing style was unmistakable.
            </p>

            <h3 className={`${H3} mt-10`}>The Hōkūleʻa</h3>
            <p className={BODY}>
              In <strong>March 1978</strong>, Eddie joined the crew
              of the Polynesian Voyaging Society's traditional
              double-hulled voyaging canoe{" "}
              <strong>Hōkūleʻa</strong> for what was planned as its
              first Tahiti-to-Hawaiʻi return voyage using
              non-instrument traditional navigation. The departure
              from Hawaiʻi was on 16 March 1978. Twelve hours into
              the voyage, in heavy seas roughly 15 miles south of
              Molokaʻi, the Hōkūleʻa swamped and capsized. The
              fifteen-person crew clung to the overturned hulls
              through the night.
            </p>
            <p className={BODY}>
              At dawn the canoe had drifted without rescue. Eddie
              — the experienced big-water Hawaiian in the crew —
              took a surfboard and{" "}
              <strong>paddled alone toward Lānaʻi</strong>,
              approximately 12 nautical miles away, to seek help.
              He was last seen paddling into the channel. The
              remaining crew was rescued later that day by a
              Hawaiian Air Lines jet that spotted the canoe. Eddie
              was not among them. Massive search-and-rescue
              efforts over the following week — among the largest
              Hawaiian civilian searches ever mounted —{" "}
              <strong>never recovered his body</strong>. He is
              presumed to have drowned within a day of his
              departure.
            </p>
            <p className={BODY}>
              He was <strong>31 years old</strong>.
            </p>
          </div>

          <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
            <div className={`${EYEBROW} mb-5`}>· Eddie's Record</div>
            <dl className="space-y-5">
              <Fact label="Born" value="May 1946, Maui" />
              <Fact label="Waimea lifeguard" value="1968–1978" />
              <Fact label="Documented rescues" value="500+" />
              <Fact label="Duke Kahanamoku winner" value="1977" />
              <Fact label="Hōkūleʻa voyage" value="Mar 1978" />
              <Fact label="Age at death" value="31" />
              <Fact label="Body recovered" value="Never" />
              <Fact label="Eddie Invitational inaugurated" value="1985" />
            </dl>
          </aside>
        </div>
      </Section>

      {/* --- The invitational --- */}
      <Section id="invitational" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· The Invitational"
          title="A contest that only runs when the waves are big enough — which means almost never"
          kicker="The Eddie Aikau Big Wave Invitational is an unusual contest: not held on a schedule, not guaranteed in any given year, and only run when the bay delivers minimum 20-foot open-face waves. It has only run ten times since 1985. Its rarity is the point."
        />

        <div className="space-y-6 max-w-3xl">
          <h3 className={H3}>The contest's rule</h3>
          <p className={BODY}>
            The Eddie has a <strong>single hard condition</strong>:
            it runs only when Waimea Bay delivers a minimum of{" "}
            <strong>20-foot open-face waves</strong> (roughly 6 m)
            — a condition that has typically required a genuine
            open-ocean North Pacific storm system to deliver a
            multi-day swell. The waiting period opens in early
            December and runs through late February. In any given
            year, conditions meeting the threshold may occur zero,
            one, or two times. Meeting the threshold on a day when
            the contest's invited field (28 men, plus women's
            field added in the 2022 era) is available is a
            further coordination challenge.
          </p>

          <h3 className={`${H3} mt-6`}>Ten runs in forty years</h3>
          <p className={BODY}>
            Since the contest's inauguration in December 1985, the
            Eddie has run <strong>only ten times</strong> through
            2024:
          </p>
          <ul className={`${BODY} list-disc pl-6 space-y-2`}>
            <li><strong>1986</strong> — inaugural running; winner: Clyde Aikau (Eddie's younger brother)</li>
            <li><strong>1990</strong> — winner: Keone Downing</li>
            <li><strong>1999</strong> — winner: Noah Johnson</li>
            <li><strong>2001</strong> — winner: Ross Clarke-Jones</li>
            <li><strong>2002</strong> — winner: Kelly Slater</li>
            <li><strong>2004</strong> — winner: Bruce Irons</li>
            <li><strong>2009</strong> — winner: Greg Long</li>
            <li><strong>2016</strong> — winner: John John Florence</li>
            <li><strong>2023</strong> — winner: Luke Shepardson (Waimea lifeguard; the hometown surfer)</li>
            <li><strong>2024</strong> — winner: Landon McNamara</li>
          </ul>
          <p className={BODY}>
            Between these runs, entire years and sometimes multiple
            consecutive years pass without the contest being held.
            The gap between 2016 and 2023 — seven years — is the
            longest contest drought in the event's history; the
            gap between 2009 and 2016 was nearly as long. The
            contest is <strong>defined by its waiting, not its
            running</strong>.
          </p>

          <h3 className={`${H3} mt-6`}>Paddle-in only</h3>
          <p className={BODY}>
            The Eddie is <strong>paddle-in only</strong> — tow-in
            surfing is prohibited. This distinguishes it from
            Nazaré's modern big-wave contests (tow-in required) and
            from the general 21st-century big-wave discipline
            (which has largely migrated toward tow-in for waves
            over roughly 40 feet). The Eddie's paddle-in rule
            preserves the Hawaiian big-wave tradition of the
            1950s–70s, when paddle-in was the only method available
            and the sport's vocabulary was built around it. It is
            also what makes the 20-foot ceiling meaningful:
            surfers must be physically strong enough to catch the
            wave under their own power.
          </p>
        </div>
      </Section>

      {/* --- Waimea beyond the contest --- */}
      <Section id="waimea-beyond" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· Waimea Beyond the Contest"
          title="Summer bay, winter arena, always a Hawaiian sacred site"
        />

        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            Waimea Bay has a completely different character across
            the seasons. In <strong>summer (May–September)</strong>{" "}
            it is a placid family swimming beach with a famous 6-meter
            cliff-jumping rock that has been used by generations of
            Hawaiians and visitors; the bay is often completely
            glassy, the water turquoise, lifeguards on standard
            duty. Families picnic on the grass above the sand.
          </p>
          <p className={BODY}>
            In <strong>winter (November–March)</strong> the bay is
            closed to swimmers and becomes the arena for big-wave
            surfing. The shoreline break can reach 4–6 meters on
            ordinary winter days; the offshore peak, 20+ feet
            (6+ meters) open-face on Eddie-level days. The
            spectator culture is substantial: Waimea attracts
            2,000–5,000 spectators on ordinary big-wave days, more
            on contest days. The viewing is from the grass slope
            above the bay.
          </p>
          <p className={BODY}>
            The bay is also a <strong>Hawaiian sacred site</strong>.{" "}
            <strong>Waimea Valley</strong>, the inland continuation
            of the bay, contains at least seventeen archaeological
            sites including <strong>Hale o Lono Heiau</strong> (a
            traditional Hawaiian temple) and a system of{" "}
            <em>loʻi kalo</em> (terraced taro fields) that were in
            continuous use from pre-contact Hawaiʻi until the late
            19th century. The valley is now administered as a
            nature reserve and cultural-heritage site by{" "}
            <strong>Hiʻipaka LLC</strong>, a Hawaiian-family-owned
            nonprofit, which operates guided cultural walks. A
            visitor to Waimea Bay who has time for the valley gets
            a much fuller picture of the place than the contest
            context alone provides.
          </p>

          <h3 className={`${H3} mt-6`}>What you can actually do there</h3>
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>
              <strong>Summer: swim in the bay, jump off the rock</strong>.
              The cliff jump is a rite of passage. The rock is
              lower than it looks; confirm the lifeguard considers
              it safe before attempting it.
            </li>
            <li>
              <strong>Winter: watch from the grass slope</strong>.
              Do not enter the water. Waimea's winter shorebreak
              is lethal for non-expert swimmers.
            </li>
            <li>
              <strong>Waimea Valley cultural walk</strong> — 45 min
              guided walk or self-guided loop; $25. The Hawaiian
              archaeological sites are unusually intact for a
              Oʻahu cultural-heritage site this accessible.
            </li>
            <li>
              <strong>Hiʻipaka Waterfall</strong> — at the head of
              the valley, a 14-meter plunge pool. Swimming is
              permitted. The hike in is short and largely paved.
            </li>
          </ul>

          {waimeaValley && (
            <Figure
              image={waimeaValley}
              size="wide"
              tier="B"
              caption="Waimea Valley inland of the bay — the Hawaiian sacred-site valley with 78+ documented archaeological sites, active loʻi kalo terraces, and Hale o Lono Heiau. Currently administered by the Hawaiian-owned nonprofit Hiʻipaka LLC."
              className="my-8"
            />
          )}
        </div>

        <ClusterAside>
          Pipeline's technical treatment — the reef, the barrel
          mechanics, the Pipe Masters — is in{" "}
          <ClusterLink to="surfing" />. The full North Shore day-
          trip circuit that includes Waimea Bay as one stop is in{" "}
          <ClusterLink to="north-shore" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="the-eddie" />

      <SpokeProvenance
        bundle={bundle}
        note="Eddie Aikau biographical material follows Stuart Holmes Coleman's Eddie Would Go (Mutual Publishing, 2001) — the canonical biography. Hōkūleʻa voyage detail from the Polynesian Voyaging Society's archive. Contest history from the Eddie Aikau Foundation and the World Surf League. Hiʻipaka / Waimea Valley visitor information via waimeavalley.net. Eddie's 31-year-old age-at-death is per his family's published memorial."
      />
    </LegendaryShell>
  );
}
