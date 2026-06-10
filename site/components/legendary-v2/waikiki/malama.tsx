/**
 * Waikīkī → Mālama Hawaiʻi (honest-reckoning spoke). Standalone page.
 *
 * The thematic counterweight. Sovereignty, ongoing cost, respectful
 * engagement, ʻōlelo Hawaiʻi basics, named Hawaiian institutions,
 * Hōkūleʻa. The register shifts darker where the content earns it
 * (the overthrow deep-dive, the housing statistics) and stays lighter
 * where the content is practical (language primer, how to visit).
 */

import { type ReactNode } from "react";
import type { LegendaryPageBundle } from "../types";
import LegendaryShell from "../shell";
import Figure from "../primitives/figure";
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
  H2_DARK,
  H3,
  PAPER,
  Section,
  SectionHeader,
  SpokeHero,
  SpokeProvenance,
  pickImage,
  renderInlineBold,
  renderInlineBoldDark,
} from "../nazare/shared";
import {
  ClusterAside,
  ClusterLink,
  ClusterRail,
  SpokeCrossNav,
} from "./shared";

export default function WaikikiMalamaPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage =
    pickImage(meta, "iolani_palace") ??
    pickImage(meta, "liliuokalani") ??
    meta.images.hero;

  const lili = pickImage(meta, "liliuokalani");
  const natatorium = pickImage(meta, "natatorium");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="malama" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Mālama Hawaiʻi"
        title="The Hawaiian ground you are standing on"
        kicker="Mālama — to care for, to protect, to steward. Not a souvenir word. Not a resort slogan. A Hawaiian principle with legal and ceremonial weight. The beach you are visiting sits on land that was taken from a sovereign people. This page is the part you cannot get from a resort concierge."
        image={heroImage}
      />

      {/* --- What mālama means --- */}
      <Section id="what-malama-means" className={PAPER}>
        <SectionHeader
          eyebrow="· The Word"
          title="What mālama means, and why it is not interchangeable with 'care'"
        />

        <div className="space-y-6">
          <p className={BODY}>
            <strong>Mālama</strong> is one of the most-used words in
            contemporary Hawaiian public life. Visitors see it on state
            agency names ("Mālama Maunakea," "Mālama Hawaiʻi"), on
            environmental campaigns, on resort pamphlets about "mālama
            your resort stay" — which is why it is often dismissed as
            marketing rhetoric. It is not. Mālama is a Hawaiian verb and
            concept with specific dimensions:
          </p>
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>
              <strong>To care for</strong> — the first-order translation,
              but the care implied is active: feeding, tending,
              maintaining, not passive affection.
            </li>
            <li>
              <strong>To protect</strong> — from harm, from erosion, from
              exploitation. Mālama is used in the context of watersheds
              (<em>mālama i ka wai</em>), fisheries, and sacred sites.
            </li>
            <li>
              <strong>To serve as steward</strong> — a mālama relationship
              is not ownership. It is a custodial responsibility
              undertaken on behalf of future generations. The principle
              is closer to the Latin <em>fiduciary</em> than to
              "caretaking."
            </li>
            <li>
              <strong>To honor ancestral obligation</strong> — mālama
              carries genealogical weight. You mālama places and things
              because your ancestors did, and because your descendants
              will need them.
            </li>
          </ul>
          <p className={BODY}>
            When Hawaiian cultural practitioners, scholars, and sovereignty
            activists use the word <em>mālama</em>, they mean this set of
            obligations together. When a visitor "mālama Waikīkī" in the
            Hawaiian sense — rather than in the resort brochure sense —
            the visitor is doing specific things: respecting the water,
            respecting the people who belong here, learning some of their
            language, understanding how they lost the land, and spending
            money in ways that benefit Hawaiian rather than mainland
            owners. This page is an attempt to make that practical.
          </p>
        </div>
      </Section>

      {/* --- The overthrow in depth (DARK) --- */}
      <OverthrowDeepDive bundle={bundle} />

      {/* --- Hawaiian Homestead + housing crisis --- */}
      <Section id="homestead" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· What the Overthrow Still Costs"
          title="The Hawaiian Homes Commission Act and the house that was never built"
          kicker="The material consequences of the overthrow are not historical. They are measured every year in the waiting list for Hawaiian homestead, the houselessness statistics of Native Hawaiians, and the share of the state's GDP that comes from an industry built on land that was stolen."
        />

        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] items-start">
          <div className="space-y-6">
            <p className={BODY}>
              In <strong>1920</strong>, twenty-two years after annexation,
              the U.S. Congress passed the <strong>Hawaiian Homes
              Commission Act</strong> — a partial acknowledgment that
              something was owed to Native Hawaiians for the loss of
              their kingdom. The Act set aside roughly{" "}
              <strong>200,000 acres</strong> of the former Crown and
              Government lands as Hawaiian Home Lands, to be leased
              (for $1 a year for 99 years) to Native Hawaiians of at
              least <strong>50% blood quantum</strong>. The law was
              championed by Prince <strong>Jonah Kūhiō
              Kalanianaʻole</strong>, who served as Hawaiʻi's
              non-voting delegate to Congress from 1903 until his
              death in 1922.
            </p>
            <p className={BODY}>
              The Act was, on paper, the largest reparations program in
              U.S. history for an Indigenous people. In practice it has
              never been funded adequately. The <strong>Department of
              Hawaiian Home Lands (DHHL)</strong> has budgets that have
              not kept pace with inflation for decades. The infrastructure
              costs of bringing roads, water, and power to the
              homestead lots — which must be done before a lease can be
              awarded — have consistently exceeded available funds. The
              result is a waiting list.
            </p>
            <p className={BODY}>
              The Hawaiian homestead waiting list, as of 2024, contains{" "}
              <strong>roughly 28,000 names</strong>. Average wait time
              from application to lease award is <strong>30+
              years</strong>. People die waiting. Many of the applicants
              on the list are the children and grandchildren of earlier
              applicants who never received their lease. A class-action
              lawsuit — <em>Kalima v. State of Hawaiʻi</em> — resulted
              in a 2020 ruling that the state owed waiting-list
              beneficiaries over <strong>$328 million</strong> in
              damages; payouts are ongoing and inadequate.
            </p>
            <p className={BODY}>
              Meanwhile, <strong>Native Hawaiians have the highest
              rates of homelessness</strong> — the state term is
              "houselessness" — in the state whose kingdom they used to
              govern. The ratio of Native Hawaiian to non-Native
              houselessness on Oʻahu runs roughly 3 to 1. Native
              Hawaiians are approximately 20% of Hawaiʻi's population
              and approximately 40% of the state's unsheltered
              population. Waikīkī sidewalks at 4 a.m., particularly on
              the Kūhiō Avenue side, make this visible to any visitor
              who walks them.
            </p>
          </div>

          <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
            <div className={`${EYEBROW} mb-5`}>· The Numbers</div>
            <dl className="space-y-5">
              <Fact label="Homestead Act passed" value="1920" />
              <Fact label="Lands set aside" value="~200,000 ac" />
              <Fact label="Blood-quantum threshold" value="50%" />
              <Fact label="Waiting list (2024)" value="~28,000" />
              <Fact label="Average wait" value="30+ years" />
              <Fact label="Kalima damages (2020)" value="$328 M" />
              <Fact label="Native Hawaiian houselessness" value="~3× state avg" />
              <Fact label="Share of unsheltered on Oʻahu" value="~40%" />
            </dl>
          </aside>
        </div>
      </Section>

      {/* --- Sovereignty today --- */}
      <Section id="sovereignty" className={CREAM}>
        <SectionHeader
          eyebrow="· Sovereignty Today"
          title="Three things most visitors don't know happen every day in Hawaiʻi"
        />

        <div className="space-y-6">
          <h3 className={H3}>The Office of Hawaiian Affairs</h3>
          <p className={BODY}>
            <strong>The Office of Hawaiian Affairs (OHA)</strong>, created
            by the 1978 Hawaiʻi State Constitutional Convention, is a
            semi-autonomous state agency whose trustees are elected by
            Native Hawaiians. Its mandate is to "better the conditions of
            Native Hawaiians." It controls roughly{" "}
            <strong>$600 million</strong> in trust funds derived from
            revenues on the former Crown and Government lands (what
            became known as the "ceded lands" after annexation). OHA is
            the principal institutional voice of Native Hawaiian
            interests in contemporary Hawaiʻi politics, though its
            legitimacy is contested by sovereignty activists who argue
            that working within the state framework tacitly accepts the
            overthrow.
          </p>

          <h3 className={`${H3} mt-6`}>The Akaka Bill arc (2000–2010)</h3>
          <p className={BODY}>
            Between 2000 and 2010, Senator Daniel Akaka introduced
            successive versions of the <strong>Native Hawaiian
            Government Reorganization Act</strong>, which would have
            established a federally-recognized Native Hawaiian governing
            entity — the same legal status as federally-recognized
            American Indian tribes and Alaska Natives. The bill passed
            the House in 2000 and 2007 but failed in the Senate each
            time, typically defeated on filibusters. It was never
            enacted. The consequence is that Native Hawaiians remain the
            only major Indigenous group in the United States without
            federal recognition of a sovereign governing entity.
          </p>

          <h3 className={`${H3} mt-6`}>Aloha ʻĀina — the contemporary land movement</h3>
          <p className={BODY}>
            <em>Aloha ʻĀina</em> — "love of the land" — is the umbrella
            term for contemporary Native Hawaiian land-rights organizing.
            Its most visible recent campaigns include the{" "}
            <strong>Maunakea protests</strong> (2014–2019) against the
            Thirty Meter Telescope's proposed siting on the Big Island's
            sacred summit, the continuing effort to return{" "}
            <strong>Kahoʻolawe</strong> (the island used by the U.S.
            Navy as a bombing range 1941–1990) to Native Hawaiian
            control, and ongoing litigation over water rights,
            shoreline access, and cultural sites. The movement is
            diverse — there is no single Aloha ʻĀina position — but it
            is the organized force that Hawaiian public life turns to
            when sovereign-rights questions enter the policy arena.
          </p>
        </div>
      </Section>

      {/* --- ʻŌlelo Hawaiʻi primer --- */}
      <Section id="olelo" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· ʻŌlelo Hawaiʻi"
          title="Ten words that will change how you visit"
          kicker="Hawaiian — ʻōlelo Hawaiʻi — is one of two official state languages (alongside English). Learning ten words before you arrive is a gesture of respect that locals notice. The language was nearly lost in the 20th century; the ongoing revival is one of the genuinely-successful Indigenous-language movements in the world."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <WordCard
            word="Aloha"
            pron="ah-LOW-hah"
            gloss="Hello, goodbye, love, breath, presence. The word contains ha (breath) — giving aloha is sharing breath. Don't use it as 'cheers.' Use it to begin and end a real greeting."
          />
          <WordCard
            word="Mahalo"
            pron="mah-HAH-lo"
            gloss="Thank you. Said sincerely. 'Mahalo nui loa' — thank you very much — is appropriate for meaningful gestures."
          />
          <WordCard
            word="ʻOhana"
            pron="oh-HAH-nah"
            gloss="Family, including chosen family and community. Not just blood relation. Used for the social network that mālama extends across."
          />
          <WordCard
            word="Kōkua"
            pron="koh-KOO-ah"
            gloss="Help, assistance, cooperative labor. 'Mahalo for your kōkua' is the standard way to thank someone for assistance. Heard on every bus, shuttle, and beach concession."
          />
          <WordCard
            word="Mauka / Makai"
            pron="MOW-kah / mah-KAI"
            gloss="Toward the mountain / toward the sea. Hawaiian directions are relative to water, not compass points. Hawaiians will give you directions this way."
          />
          <WordCard
            word="Pau"
            pron="POW"
            gloss="Finished, done, complete. 'Pau hana' — after work, end of the workday. 'I'm pau with my lunch' — I'm done eating."
          />
          <WordCard
            word="ʻĀina"
            pron="EYE-nah"
            gloss="Land, but more specifically that which feeds. The land that sustains. 'Aloha ʻĀina' — love of the land, the contemporary sovereignty movement's name."
          />
          <WordCard
            word="Kapu"
            pron="KAH-poo"
            gloss="Forbidden, sacred, set apart. Historically a legal / ceremonial status. Today it often means 'no trespassing' on cultural sites."
          />
          <WordCard
            word="Keiki / Kupuna"
            pron="KAY-kee / koo-POO-nah"
            gloss="Child / elder. Used routinely. 'Kupuna' is honorific — priority seating at every public event."
          />
          <WordCard
            word="A hui hou"
            pron="ah HOO-ee HO"
            gloss="Until we meet again. The Hawaiian farewell. Meaningful; used when you're leaving and expect to return."
          />
        </div>

        <div className="mt-12 border-l-2 border-[color:var(--beach-supporting,#1E5F74)] pl-6 max-w-3xl">
          <div className={`${EYEBROW} mb-3`}>· Kahakō and ʻokina — why the marks matter</div>
          <p className={BODY}>
            The <strong>kahakō</strong> (macron, as in Waikīkī's two long
            <em> ī</em>s) marks a vowel that's held longer. The{" "}
            <strong>ʻokina</strong> (the apostrophe-like glottal stop, as
            in Hawaiʻi or Liliʻuokalani) marks a consonant pause
            between vowels. <strong>They are letters, not decoration.</strong>
            Hawaiʻi without the ʻokina is, linguistically, a different
            word. "Liliuokalani" without the ʻokina is not the queen's
            name. When a visitor's device doesn't support the diacritics,
            that's a technical limitation — but when a publication or
            resort chooses not to use them, that's an editorial choice
            worth noticing.
          </p>
        </div>
      </Section>

      {/* --- How to visit respectfully --- */}
      <Section id="how-to-visit" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· How to Visit Respectfully"
          title="Twelve specific things — not vibes"
          kicker="Most 'mālama the land' resort brochures reduce respect to a sentiment. The below are concrete actions. Do as many of them as you can."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Practice
            n="1"
            title="Tour ʻIolani Palace"
            body="$26.95, 2 miles inland from Waikīkī. The only royal palace on U.S. soil. The tour includes the room where Queen Liliʻuokalani was imprisoned in 1895. Do it early in your trip, not last — the rest of the visit reads differently after."
          />
          <Practice
            n="2"
            title="Go to the free Hula Mound performance at Kūhiō Beach"
            body="Tuesdays, Thursdays, Saturdays at 6 p.m. Hosted by Hawaiian cultural practitioners (not resort staff). Free. Leave a tip for the performers."
          />
          <Practice
            n="3"
            title="Buy from Hawaiian-owned businesses"
            body="NAHHA (Native Hawaiian Hospitality Association) maintains a directory at nahha.com. Hawaiian-owned restaurants, lei sellers, surf schools, and guiding services exist; you have to know to look for them."
          />
          <Practice
            n="4"
            title="Learn the words above — and use them"
            body="Say 'mahalo' to your server, 'kōkua' when asking for help, 'aloha' when greeting. Not as performance. As a minimum."
          />
          <Practice
            n="5"
            title="Visit the Bishop Museum"
            body="The Hawaiian national museum. Polynesian Hall is the definitive exhibit of pre-contact Pacific culture. $29; 6 miles from Waikīkī. A half-day visit."
          />
          <Practice
            n="6"
            title="Respect kapu signs"
            body="If you see a sign saying Kapu — do not cross it. It usually marks a cultural site, burial ground, or access restriction. Serious consequences are legal; informal consequences are cultural."
          />
          <Practice
            n="7"
            title="Do not take lava rocks, sand, or coral"
            body="Beyond the cultural issue: it's a federal and state offense. Lava rocks in particular carry serious kapu (the legend of Pele's curse is a tourism-industry corollary to a real Hawaiian belief about land). Every mail room in Hawaiʻi has boxes of lava rocks sent back by guilty tourists."
          />
          <Practice
            n="8"
            title="Reef-safe sunscreen, always"
            body="Hawaiʻi Act 104 bans the sale of sunscreens containing oxybenzone or octinoxate. Bring zinc or titanium mineral sunscreen. Better: a rash guard."
          />
          <Practice
            n="9"
            title="Tip Hawaiian service workers generously"
            body="The cost of living in Hawaiʻi is the highest in the United States; service-industry wages are low. 20% is the floor, not the ceiling."
          />
          <Practice
            n="10"
            title="Consume Hawaiian media"
            body="Watch Hōkūleʻa's voyages (Polynesian Voyaging Society, YouTube). Listen to slack-key guitar (Gabby Pahinui is the canonical name). Read Haunani-Kay Trask's 'From a Native Daughter.' These are introductions to the contemporary Hawaiian intellectual tradition."
          />
          <Practice
            n="11"
            title="Attend — don't just watch — cultural events"
            body="If you're in Hilo during Merrie Monarch Week (April), the broadcast is visible everywhere. If you're on Oʻahu during the Prince Lot Hula Festival (July), attend. Pay for tickets. Leave a donation."
          />
          <Practice
            n="12"
            title="Acknowledge the land"
            body="Before leaving, in whatever way is meaningful to you, acknowledge that you visited Hawaiian land. A private thought is enough. The point is not performance; the point is that you came, and you noticed, and you will not misremember Hawaiʻi as a state that's always been one."
          />
        </div>
      </Section>

      {/* --- Hōkūleʻa --- */}
      <Section id="hokulea" className={PAPER}>
        <SectionHeader
          eyebrow="· Hōkūleʻa"
          title="The canoe that sailed to Tahiti without instruments and proved the Polynesians had always known"
        />

        <div className="space-y-6">
          <p className={BODY}>
            In <strong>1975</strong>, a group of Native Hawaiian sailors
            and the newly-founded <strong>Polynesian Voyaging Society</strong>{" "}
            built a double-hulled sailing canoe and named it{" "}
            <strong>Hōkūleʻa</strong> — "Star of Gladness" — after the
            star (Arcturus) used for navigation to Hawaiʻi. The canoe was
            built in the pre-contact tradition: no engine, no GPS, no
            compass. Traditional Polynesian navigation uses the stars at
            night, the sun by day, the directions and shapes of ocean
            swells, the flight paths of land-finding birds, and a
            mental-map discipline memorized across generations.
          </p>
          <p className={BODY}>
            On <strong>1 May 1976</strong>, Hōkūleʻa sailed from Oʻahu
            to Tahiti — 2,400 nautical miles — navigated entirely by{" "}
            <strong>Mau Piailug</strong>, a master navigator from
            Satawal, a tiny island in Micronesia where traditional
            non-instrument navigation had survived. The voyage proved
            what Polynesian oral tradition had always maintained and
            Western academics had long doubted: that the Pacific
            migrations from Tahiti and the Marquesas to Hawaiʻi
            (centuries before European contact) were deliberate,
            repeatable, astronomical, and founded on navigational
            knowledge of real precision.
          </p>
          <p className={BODY}>
            Since 1976, Hōkūleʻa has made{" "}
            <strong>a dozen voyages across the Pacific and one
            circumnavigation of the world</strong> (the Mālama Honua
            Worldwide Voyage, 2013–2017 — "to care for our island
            Earth"). The canoe is typically docked at Sand Island near
            downtown Honolulu when not on voyage; visitors can
            occasionally see it up close. The Polynesian Voyaging
            Society trains new generations of Hawaiian navigators and
            builds new voyaging canoes. <strong>Nainoa Thompson</strong>,
            Mau Piailug's Hawaiian apprentice and now a senior
            navigator in his own right, is one of the central figures
            of the contemporary Hawaiian Renaissance.
          </p>
          <p className={BODY}>
            Hōkūleʻa is the opposite of a museum piece. It is an active,
            working boat that sails regularly, teaches regularly, and
            embodies — as directly as anything physical can — the
            survival of Polynesian navigational knowledge through the
            rupture. If the contemporary Hawaiian cultural project has a
            single flagship, this is it.
          </p>
        </div>

        {natatorium && (
          <Figure
            image={natatorium}
            size="wide"
            tier="B"
            caption="The Waikīkī War Memorial Natatorium — a 1927 Beaux-Arts saltwater pool honoring Hawaiians who served in WWI, including Duke Kahanamoku. Closed since 1979. Hawaiʻi's most beautiful ruin. Its chronic disrepair is a fair proxy for Hawaiian civic investment — the state has debated a $30M restoration for forty years without executing."
            className="mt-10"
          />
        )}
      </Section>

      {/* --- Named resources --- */}
      <Section id="resources" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· Named"
          title="Where to go deeper — after you leave Waikīkī"
        />

        <div className="grid gap-8 md:grid-cols-2">
          <ResourceCard
            kind="Museum"
            name="Bishop Museum"
            body="The Hawaiian national museum. Polynesian Hall holds the definitive collection of pre-contact Hawaiian material culture. Research library is open to the public. bishopmuseum.org"
          />
          <ResourceCard
            kind="Palace"
            name="ʻIolani Palace"
            body="The only royal palace on U.S. soil. Self-guided or guided tours; the guided tour includes the queen's imprisonment room. iolanipalace.org"
          />
          <ResourceCard
            kind="Voyaging Canoe"
            name="Polynesian Voyaging Society / Hōkūleʻa"
            body="Educational programs, occasional public tours of the canoe when in port, school visits. pvshawaii.com"
          />
          <ResourceCard
            kind="University"
            name="UH Mānoa Hawaiian Studies (Kamakakūokalani Center)"
            body="The flagship academic center for Hawaiian studies. Free public lectures; the Hawaiʻinuiākea School publishes Hawaiian-language scholarship. kualiʻi.manoa.hawaii.edu"
          />
          <ResourceCard
            kind="Book"
            name="Haunani-Kay Trask — 'From a Native Daughter'"
            body="The foundational contemporary Native Hawaiian sovereignty essay collection. Required reading for anyone engaging seriously with Hawaiian public life."
          />
          <ResourceCard
            kind="Hula Festival"
            name="Merrie Monarch Festival"
            body="Annual hula championship, Easter week, Hilo. Attendance is aspirational (tickets hard to come by); the broadcasts are free and available on most Hawaiian hotel TVs. merriemonarch.com"
          />
          <ResourceCard
            kind="Organization"
            name="Office of Hawaiian Affairs (OHA)"
            body="State agency; trustees elected by Native Hawaiians. Programs, advocacy, grants. oha.org"
          />
          <ResourceCard
            kind="Directory"
            name="Native Hawaiian Hospitality Association (NaHHA)"
            body="Directory of Hawaiian-owned tourism businesses. Use this to find Hawaiian-owned surf schools, guiding services, restaurants, and lodging. nahha.com"
          />
        </div>

        <ClusterAside>
          The surfing tradition that survived this history — taught to
          visitors on the same beach by descendants of the beach boys —
          is in <ClusterLink to="surf" />.
        </ClusterAside>
        <ClusterAside>
          Practical trip logistics, where to stay, what to eat, and how
          to not die on the rocks are in <ClusterLink to="visiting" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="malama" />

      <SpokeProvenance
        bundle={bundle}
        note="Overthrow detail follows U.S. Public Law 103-150 (1993), the Blount Report (1893), the Newlands Resolution (1898), and the Kuʻe Petitions in the U.S. National Archives. Hawaiian Homes Commission statistics draw on the 2024 DHHL annual report and the Kalima v. State of Hawaiʻi class action (2020 ruling). Sovereignty movement detail from Silva (2004) 'Aloha Betrayed' and Trask (1993, 1999) 'From a Native Daughter.' ʻŌlelo Hawaiʻi orthography follows the Hawaiian Dictionary (Pukui & Elbert, revised ed.). Corrections on Hawaiian-language framings, specific programs, and current waiting-list statistics are welcome — these numbers update continuously."
      />
    </LegendaryShell>
  );
}

// ----------------------------------------------------------------------------
// Dark-register deep-dive on the overthrow
// ----------------------------------------------------------------------------

function OverthrowDeepDive({ bundle }: { bundle: LegendaryPageBundle }) {
  const lili = pickImage(bundle.meta, "liliuokalani");

  return (
    <Section id="overthrow" className={DARK}>
      <div className="max-w-3xl">
        <div
          className="text-[11px] font-mono uppercase tracking-[0.3em] mb-4"
          style={{ color: "var(--beach-primary, #E8B4B8)" }}
        >
          · The Overthrow · 1893 (detail)
        </div>
        <h2 className={H2_DARK} style={{ fontFamily: DISPLAY_FF }}>
          What Queen Liliʻuokalani actually wrote
        </h2>
        <p className="mt-5 text-lg italic text-[#94A3B8] font-serif">
          The main page summarizes the overthrow. This section gives
          the queen's own words and the two U.S. government reports
          that established — contemporaneously — that the coup was
          illegal.
        </p>
      </div>

      {lili && (
        <Figure
          image={lili}
          size="wide"
          tier="B"
          caption="Queen Liliʻuokalani, photographed ca. 1891 by James J. Williams. Last sovereign of the Hawaiian Kingdom; author of Hawaiʻi's Story by Hawaiʻi's Queen (1898); songwriter of Aloha ʻOe; prisoner in ʻIolani Palace from January 1895 for eight months."
          className="my-12"
        />
      )}

      <div className="space-y-6 max-w-3xl">
        <h3
          className="font-display text-[22px] leading-tight text-[#F1F5F9] uppercase -tracking-[0.01em] mt-10"
          style={{ fontFamily: DISPLAY_FF }}
        >
          The queen's protest
        </h3>
        <p className={BODY_DARK}>
          On <strong className="text-[#F1F5F9] font-semibold">17 January
          1893</strong>, under the guns of the USS <em>Boston</em>,
          Liliʻuokalani yielded her authority in a written protest
          addressed not to the Committee of Safety but to the United
          States government:
        </p>
        <blockquote className="border-l-2 border-[color:var(--beach-primary,#E8B4B8)] pl-6 my-6">
          <p className="text-[17px] leading-[1.75] text-[#E2E8F0] italic font-serif">
            "I, Liliʻuokalani, by the grace of God and under the
            Constitution of the Hawaiian Kingdom Queen, do hereby
            solemnly protest against any and all acts done against
            myself and the constitutional government of the Hawaiian
            Kingdom by certain persons claiming to have established a
            provisional government of and for this Kingdom.
          </p>
          <p className="mt-4 text-[17px] leading-[1.75] text-[#E2E8F0] italic font-serif">
            That I yield to the superior force of the United States of
            America whose minister plenipotentiary, His Excellency John
            L. Stevens, has caused United States troops to be landed at
            Honolulu and declared that he would support the said
            provisional government.
          </p>
          <p className="mt-4 text-[17px] leading-[1.75] text-[#E2E8F0] italic font-serif">
            Now to avoid any collision of armed forces, and perhaps the
            loss of life, I do this under protest and impelled by said
            force yield my authority until such time as the Government
            of the United States shall, upon facts being presented to
            it, undo the action of its representatives and reinstate me
            in the authority which I claim as the constitutional
            sovereign of the Hawaiian Islands."
          </p>
          <cite className="block mt-4 text-[12px] uppercase tracking-widest text-[#94A3B8] not-italic">
            — Queen Liliʻuokalani, 17 January 1893
          </cite>
        </blockquote>
        <p className={BODY_DARK}>
          The expectation that the United States government would{" "}
          <em className="text-[#F1F5F9]">undo the action of its
          representatives</em> was not naive. Twenty years earlier it
          would have been the ordinary course of American foreign
          policy. But the political winds of 1893 ran against her.
        </p>

        <h3
          className="font-display text-[22px] leading-tight text-[#F1F5F9] uppercase -tracking-[0.01em] mt-10"
          style={{ fontFamily: DISPLAY_FF }}
        >
          The Blount Report — March 1893
        </h3>
        <p className={BODY_DARK}>
          Newly-inaugurated President{" "}
          <strong className="text-[#F1F5F9]">Grover Cleveland</strong>{" "}
          dispatched former Congressman{" "}
          <strong className="text-[#F1F5F9]">James H. Blount</strong>{" "}
          to Hawaiʻi as a special commissioner. Blount arrived in March
          1893 and conducted extensive interviews across political
          factions — the provisional government, the deposed
          Hawaiian royals, American residents, and Native Hawaiian
          leaders. His report, delivered to Congress in July 1893,
          concluded that the overthrow had been <em>"an act of war,
          committed with the participation of a diplomatic
          representative of the United States and without authority of
          Congress, with our troops occupying the grounds and
          dominating the city."</em> Cleveland accepted the Blount
          Report and called for the restoration of the Queen.
        </p>
        <p className={BODY_DARK}>
          The U.S. Senate refused. The Senate's own investigation —
          the <strong className="text-[#F1F5F9]">Morgan Report</strong>{" "}
          of February 1894 — reached the opposite conclusion, a result
          that historians overwhelmingly attribute to Senator Morgan's
          personal annexationist politics rather than the evidence. The
          two reports disagreed on central facts. The later Morgan
          Report was the one the Senate chose to believe. The queen
          was not restored.
        </p>

        <h3
          className="font-display text-[22px] leading-tight text-[#F1F5F9] uppercase -tracking-[0.01em] mt-10"
          style={{ fontFamily: DISPLAY_FF }}
        >
          What the 1993 Apology Resolution acknowledged
        </h3>
        <p className={BODY_DARK}>
          One hundred years to the day after Liliʻuokalani's yielding,
          President Clinton signed <strong className="text-[#F1F5F9]">
          Public Law 103-150</strong> — the Apology Resolution. Signed
          23 November 1993. The resolution acknowledged specifically:
        </p>
        <ul className={`${BODY_DARK} list-disc pl-6 space-y-3 max-w-2xl`}>
          <li>
            That the overthrow "was illegal and was conducted with the
            active participation of agents and citizens of the United
            States, with the support of the United States Minister."
          </li>
          <li>
            That the indigenous Hawaiian people "never directly
            relinquished their claims to their inherent sovereignty as
            a people over their national lands to the United States."
          </li>
          <li>
            That "the long-range economic and social changes in Hawaiʻi
            over the nineteenth and early twentieth centuries have
            been devastating to the population and to the health and
            well-being of the Hawaiian people."
          </li>
          <li>
            That the resolution offered the apology "as a first step
            toward reconciliation" — explicitly leaving the matter of
            further reconciliation open to future action.
          </li>
        </ul>
        <p className={BODY_DARK}>
          The resolution has no binding legal force. It is a statement
          of historical fact. But it is the most specific
          acknowledgment the United States has ever made about what
          happened in Honolulu on 17 January 1893 — and, by extension,
          about the ground on which the Royal Hawaiian Hotel, the
          Moana Surfrider, and the rest of Waikīkī's beachfront now
          stand.
        </p>
      </div>
    </Section>
  );
}

// ----------------------------------------------------------------------------
// Local sub-components
// ----------------------------------------------------------------------------

function WordCard({
  word,
  pron,
  gloss,
}: {
  word: string;
  pron: string;
  gloss: string;
}) {
  return (
    <article className="rounded-sm border border-[#E2E8F0] bg-white p-6">
      <div className="flex items-baseline gap-3 mb-2">
        <h3 className={H3}>{word}</h3>
        <span className="text-[12px] font-mono text-volcanic-400 uppercase tracking-wider">
          {pron}
        </span>
      </div>
      <p className={BODY_SM}>{gloss}</p>
    </article>
  );
}

function Practice({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <article className="border-l-2 border-[color:var(--beach-supporting,#1E5F74)] pl-6">
      <div className={`${EYEBROW} mb-2`}>{n}</div>
      <h3 className={`${H3} mb-2`}>{title}</h3>
      <p className={BODY_SM}>{body}</p>
    </article>
  );
}

function ResourceCard({
  kind,
  name,
  body,
}: {
  kind: string;
  name: string;
  body: string;
}) {
  return (
    <article className="rounded-sm border border-[#E7E2D4] bg-white p-7">
      <div className={`${EYEBROW} mb-2`}>{kind}</div>
      <h3 className={`${H3} mb-3`}>{name}</h3>
      <p className={BODY_SM}>{body}</p>
    </article>
  );
}
