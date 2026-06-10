/**
 * Pipeline → Mālama North Shore (honest-reckoning expansion spoke).
 *
 * Parallel to Waikīkī's Mālama Hawaiʻi spoke. Treats the Hawaiian
 * sovereignty and sacred-site dimension of the North Shore — which
 * Pipeline's surf-tourism identity overlays without replacing.
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

export default function PipelineMalamaPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage =
    pickImage(meta, "waimea_valley") ?? meta.images.hero;
  const waimeaValley = pickImage(meta, "waimea_valley");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="malama" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Mālama North Shore"
        title="What the 7-Mile Miracle is called when you say it in Hawaiian"
        kicker="Every named surf break on this coast sits on a Hawaiian place with a Hawaiian name, a Hawaiian history, and in many cases a Hawaiian sacred purpose older than anyone currently alive. Pipeline is the surf name. The land has been under continuous Hawaiian cultural responsibility for approximately 1,200 years. This spoke treats the North Shore in that register."
        image={heroImage}
      />

      {/* --- What Mālama means --- */}
      <Section id="what-malama" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· The Word"
          title="Mālama, and why the Pipeline page uses it"
          kicker="The Waikīkī cluster has a Mālama Hawaiʻi spoke — that spoke introduces the term in detail. This spoke assumes you've read it or you know the word. Here the mālama work is specifically the North Shore."
        />

        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            <strong>Mālama</strong> — Hawaiian verb: to care for, to
            protect, to serve as steward, to honor ancestral
            obligation. Not a resort slogan. A concept with legal and
            ceremonial weight in Hawaiian practice. When a Hawaiian
            cultural practitioner speaks of mālama in the context of
            the North Shore, they mean: the specific stretch of coast
            from Kaʻena Point around through Mokulēʻia, Haleʻiwa,
            Laniākea, Waimea, Pūpūkea (the Pipeline / Sunset
            neighborhoods), Kawela Bay, Kahuku, and Kuilima / Turtle
            Bay has been under continuous Hawaiian cultural
            stewardship for approximately <strong>1,200 years</strong>.
            The stewardship did not end in 1778 or 1893 or 1959. It
            continues; it overlaps the surf-tourism economy; it is a
            layer many visitors never encounter because they are not
            looking for it.
          </p>
          <p className={BODY}>
            What follows is an introduction to what a visitor can see
            if they do look for it, and how to look for it without
            causing harm.
          </p>

          <ClusterAside>
            If you haven't read the Waikīkī Mālama spoke, that's
            where the longer treatment of the Hawaiian Kingdom
            overthrow, the Uluru Statement parallel, and the
            general "how to visit Hawaiian land respectfully" frame
            sits. Start there:{" "}
            <a
              href="/beaches/waikiki-beach-1/malama"
              className="not-italic font-semibold text-[color:var(--beach-primary,#0B3D5C)] underline decoration-dotted underline-offset-4 hover:no-underline"
            >
              Mālama Hawaiʻi (Waikīkī) →
            </a>
          </ClusterAside>
        </div>
      </Section>

      {/* --- Puʻu o Mahuka Heiau --- */}
      <Section id="heiau" className={PAPER}>
        <SectionHeader
          eyebrow="· Puʻu o Mahuka"
          title="The largest heiau on Oʻahu sits on the ridge above Pipeline"
          kicker="A ten-minute drive up the hill from Pūpūkea — the residential neighborhood directly above Pipeline — is the largest ancient Hawaiian temple complex on Oʻahu. Most visitors never go there. It is free, it is open, and it is one of the important Hawaiian sites in the islands."
        />

        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            <strong>Puʻu o Mahuka Heiau</strong> — 'Hill of Escape' —
            is a National Historic Landmark and the{" "}
            <strong>largest surviving heiau (Hawaiian temple)
            on Oʻahu</strong>. The complex covers roughly{" "}
            <strong>2 acres</strong> of stone-walled enclosures on a
            ridge at 300 feet elevation, with unobstructed views
            north to Waimea Bay, east along the coast to Sunset, and
            across the Pacific. Construction is dated to the{" "}
            <strong>17th century</strong>; the site was in continuous
            ceremonial use from construction until approximately 1819
            — the year Hawaiian traditional religious practice was
            formally ended by Kamehameha II in the{" "}
            <strong>ʻAi Noa</strong> (free-eating) abolition of the
            kapu system.
          </p>
          <p className={BODY}>
            Puʻu o Mahuka was a <strong>luakini heiau</strong> — a
            temple of the highest class, reserved for human and
            animal sacrifice and for the most consequential
            ceremonial work in the Hawaiian religious system. Its
            historical ceremonial director of record is the
            high-priest kahuna <strong>Kaʻopulupulu</strong>, who in
            1782 warned the Oʻahu chief Kahahana against entering
            into conflict with Maui and was killed (with his son
            Kahulupue) when Kahahana rejected the warning. The heiau
            was thus the center of political-religious counsel on
            Oʻahu in the decades leading up to Kamehameha I's
            1795 unification.
          </p>
          <p className={BODY}>
            <strong>What you can see today</strong>: the stone walls
            remain substantially intact. A paved interpretive trail
            circles the complex; Hawaiian State Parks signage
            explains the site's ceremonial structure. Visitors are{" "}
            <strong>expected not to enter the interior of the
            stone enclosures</strong>, which remain consecrated
            space. <strong>Do not remove stones.</strong>{" "}
            <strong>Do not leave offerings unless you know what
            you are doing</strong> — specifically, do not leave
            rocks wrapped in ti leaves, which is a common tourist
            practice that Hawaiian cultural practitioners
            overwhelmingly oppose. The appropriate visitor
            posture is quiet, respectful, brief.
          </p>
          <p className={BODY}>
            <strong>How to get there</strong>: from Pipeline or
            Sunset, drive up Pūpūkea Road for approximately
            1.2 miles (2 km). The turnoff is signed. Small parking
            area; no admission fee. Allow 30 minutes. Open daylight
            hours.
          </p>
        </div>
      </Section>

      {/* --- Waimea Valley --- */}
      <Section id="waimea-valley" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· Waimea Valley"
          title="The sacred valley inland of the bay"
          kicker="Waimea Bay's Eddie Aikau story is the spoke. The valley inland of the bay carries a different, older story — the full Waimea Valley is one of the most archaeologically rich Hawaiian sites in the islands, and it is currently managed by a Hawaiian-owned nonprofit on specifically cultural-stewardship terms."
        />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6">
            <p className={BODY}>
              <strong>Waimea Valley</strong> runs roughly{" "}
              <strong>3 miles</strong> inland from Waimea Bay,
              following the Waimea River up into the Koʻolau
              mountain range. The valley was under Hawaiian
              residential and ceremonial occupation from
              approximately <strong>1,100 years ago</strong> until
              the late 19th century, when post-contact depopulation
              and plantation-era land reorganization removed most of
              the traditional community. What remains is a genuinely
              unusual archaeological and cultural record:
            </p>
            <ul className={`${BODY} list-disc pl-6 space-y-3`}>
              <li>
                <strong>At least 78 documented archaeological sites</strong>{" "}
                — heiaus, houseplatforms, agricultural terraces,
                burials, a fishpond, a sweatlodge.
              </li>
              <li>
                <strong>Hale o Lono Heiau</strong> — a temple
                specifically consecrated to Lono, the Hawaiian god
                of agriculture and peace, in contrast to the
                war-oriented Puʻu o Mahuka on the ridge above. Lono
                heiau are considerably rarer than war-temple
                sites; this is one of the best-preserved in the
                islands.
              </li>
              <li>
                <strong>Active loʻi kalo (taro terraces)</strong> —
                the stepped irrigated fields that fed Hawaiian
                settlements for centuries. The valley's loʻi are
                currently in cultural-restoration use by Hawaiian
                educators and agricultural practitioners.
              </li>
              <li>
                <strong>A 45-foot waterfall pool</strong> at the
                valley head (Waihī Falls, locally 'Waimea Falls').
                Swimmable. Not the reason the valley is important,
                but the point most visitors remember.
              </li>
            </ul>

            {waimeaValley && (
              <Figure
                image={waimeaValley}
                size="wide"
                tier="B"
                caption="Waimea Valley — the sacred inland counterpart to the Bay. Over 78 documented Hawaiian archaeological sites, active loʻi kalo terraces in cultural-restoration use, and Hale o Lono Heiau. Managed by the Hawaiian-owned nonprofit Hiʻipaka LLC."
              />
            )}

            <h3 className={`${H3} mt-6`}>Who manages it</h3>
            <p className={BODY}>
              Waimea Valley is currently administered by{" "}
              <strong>Hiʻipaka LLC</strong>, a Hawaiian-family-owned
              nonprofit that holds the valley in trust under a
              long-term lease from the Office of Hawaiian Affairs
              (OHA). This is structurally unusual for a major
              Hawaiian cultural-heritage site: most are
              state-managed through the Department of Land and
              Natural Resources. Waimea Valley is the major
              exception — Hawaiian management of a Hawaiian sacred
              site, with the admission economy ($25 adult) flowing
              to a Hawaiian nonprofit rather than to state general
              funds or private operators.
            </p>
            <p className={BODY}>
              Hiʻipaka runs{" "}
              <strong>guided cultural walks</strong> (45 min,
              included in admission) led by Hawaiian cultural
              practitioners who are themselves genealogically
              connected to the valley. The walks are the right way
              to visit. Self-guided is permitted and useful but
              misses the interpretation.
            </p>
          </div>

          <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
            <div className={`${EYEBROW} mb-5`}>· The Valley</div>
            <dl className="space-y-5">
              <Fact label="Continuous Hawaiian use" value="~1,100 yrs" />
              <Fact label="Archaeological sites" value="78+" />
              <Fact label="Primary heiau" value="Hale o Lono" />
              <Fact label="Administered by" value="Hiʻipaka LLC" />
              <Fact label="Trust holder" value="OHA lease" />
              <Fact label="Admission" value="$25 adult" />
              <Fact label="Waterfall height" value="~45 ft" />
              <Fact label="Guided walk duration" value="45 min" />
            </dl>
          </aside>
        </div>
      </Section>

      {/* --- The Hawaiian place names --- */}
      <Section id="place-names" className={PAPER}>
        <SectionHeader
          eyebrow="· The Names"
          title="The Hawaiian place names under the surf break names"
          kicker="Every stretch of this coast has a Hawaiian name that predates the English 'Pipeline' / 'Sunset' / 'Laniākea' / 'Haleʻiwa' vocabulary by centuries. Some of the English names are Hawaiian (Laniākea, Haleʻiwa, Kahuku); others are English overlays. Knowing the Hawaiian names is part of knowing what you are visiting."
        />

        <div className="space-y-6 max-w-3xl">
          <h3 className={H3}>Pipeline / Ehukai</h3>
          <p className={BODY}>
            The beach park is called <strong>Ehukai</strong>
            — 'seaspray' or, more literally, 'sea-foam.' The name
            predates the surf-break name by centuries and is still
            the correct name on all Hawaiian-language maps and
            municipal signage. 'Pipeline' is a 1961 surf-media
            coinage (by Phil Edwards / Bruce Brown, depending on
            account) describing the wave shape. The surf-break
            name is <strong>Banzai Pipeline</strong>; the beach
            name is <strong>Ehukai</strong>; locals use both
            depending on whether they're talking about the water
            or the sand.
          </p>

          <h3 className={`${H3} mt-6`}>Pūpūkea</h3>
          <p className={BODY}>
            The residential neighborhood behind Pipeline is{" "}
            <strong>Pūpūkea</strong> — 'white shell.' The name
            refers to a specific variety of native Hawaiian land
            snail (<em>Achatinella</em>) that once occupied the
            forested ridges above the coast; the species is now
            critically endangered, with fewer than 5,000
            individuals remaining across all of Oʻahu. The
            neighborhood's name is a reminder of what the Hawaiian
            upland ecosystem was before agricultural clearing and
            introduced species collapsed it.
          </p>

          <h3 className={`${H3} mt-6`}>Waimea</h3>
          <p className={BODY}>
            <strong>Waimea</strong> — 'reddish water.' Named for
            the red soil of the valley, visible in the river's
            outflow when heavy rain mobilizes it. The name is one
            of several Waimeas across the Hawaiian islands — Kauaʻi
            has a Waimea, the Big Island has a Waimea — because the
            phenomenon is not unique to Oʻahu. Local context
            distinguishes 'Waimea Bay' (Oʻahu) from 'Waimea Canyon'
            (Kauaʻi) from 'Waimea Town' (Big Island). Use the
            local context.
          </p>

          <h3 className={`${H3} mt-6`}>Laniākea</h3>
          <p className={BODY}>
            <strong>Laniākea</strong> — literally 'the wide sky'
            or 'far-reaching sky.' The tourist-famous Turtle Beach
            name is the Hawaiian name; no translation required.
            The beach's association with sea turtles (honu) is
            a <strong>very recent phenomenon</strong> — the
            turtles began hauling out here in substantial numbers
            only since approximately 2000, after Hawaiian green
            sea turtles came off the federal endangered-species
            designation as threatened. The cultural-historical
            name is older than the turtle-beach association.
          </p>

          <h3 className={`${H3} mt-6`}>Haleʻiwa</h3>
          <p className={BODY}>
            <strong>Haleʻiwa</strong> — 'home of the ʻiwa bird'
            (the great frigatebird). The pre-plantation-era
            village name. The town retained the name through the
            19th-century plantation period and through the
            20th-century surf-tourism rewriting of the coast. You
            are saying a real Hawaiian place name every time you
            order at Matsumoto Shave Ice.
          </p>
        </div>
      </Section>

      {/* --- How to visit --- */}
      <Section id="how-to-visit" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· How to Visit"
          title="Seven specific practices"
          kicker="The Waikīkī Mālama spoke has twelve practices. These seven are specifically about North Shore visitor conduct and extend rather than replace the Waikīkī ones."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Practice
            n="1"
            title="Tour Waimea Valley on a guided cultural walk"
            body="The Hiʻipaka-led interpretation is the right way to encounter a Hawaiian sacred valley. 45 minutes, included with admission. Ask your guide about their family connection to the valley; most will tell you."
          />
          <Practice
            n="2"
            title="Visit Puʻu o Mahuka Heiau"
            body="Free, 30-minute visit, ridge above Pipeline. Do not enter the interior enclosures. Do not leave rock-and-ti-leaf offerings. Quiet, respectful, brief. This is a consecrated site still in use for some ceremonial purposes."
          />
          <Practice
            n="3"
            title="Respect the 10-meter turtle distance at Laniākea"
            body="Federal law protects Hawaiian green sea turtles. Municipal signs at Laniākea mark the 10-meter approach distance. Violations are fined. The turtles are not set dressing; they are threatened species resting."
          />
          <Practice
            n="4"
            title="Buy from Hawaiian-owned businesses on the North Shore"
            body="Matsumoto Shave Ice (Matsumoto family since 1951), Haleʻiwa Store Lots tenants that are Hawaiian-owned, some of the Kahuku Superette produce, the farmer's-market stalls. Ask. The provenance matters for where money ends up."
          />
          <Practice
            n="5"
            title="Do not climb on the Waimea cliff rock without understanding its cultural context"
            body="The 6-meter jumping rock at Waimea Bay is a legitimate site for cliff-jumping — this is a continuous Hawaiian practice that predates Western contact — but it is also a site specific individuals have died at. Respect the lifeguard's judgment on whether the day is safe. Do not treat it as a pure thrill-stop."
          />
          <Practice
            n="6"
            title="Learn the Hawaiian place names"
            body="Ehukai (Pipeline beach), Pūpūkea (neighborhood), Waimea (the bay), Laniākea (Turtle Beach), Haleʻiwa (town). Using the Hawaiian names is a small gesture of respect and a meaningful one to Hawaiian listeners."
          />
          <Practice
            n="7"
            title="Do not photograph Hawaiian ceremonial practice without explicit permission"
            body="If you encounter cultural practitioners at Puʻu o Mahuka or Waimea Valley in ceremonial context — offering leaves, chants, mele, or the lighting of candles — do not photograph. Step back, observe quietly, move on. This is not a photo opportunity."
          />
        </div>

        <ClusterAside>
          The deeper treatment of Hawaiian sovereignty — the 1893
          overthrow, the Uluru-Statement-parallel, Hawaiian
          language, and the wider Hawaiian cultural-visitor
          framework — is on the Waikīkī Mālama spoke:{" "}
          <a
            href="/beaches/waikiki-beach-1/malama"
            className="not-italic font-semibold text-[color:var(--beach-primary,#0B3D5C)] underline decoration-dotted underline-offset-4 hover:no-underline"
          >
            Mālama Hawaiʻi →
          </a>
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="malama" />

      <SpokeProvenance
        bundle={bundle}
        note="Puʻu o Mahuka Heiau historical detail follows the Hawaiʻi State Parks interpretive materials and Samuel Kamakau's Ka Poʻe Kahiko (Bishop Museum Press, 1964). Waimea Valley material from Hiʻipaka LLC's published cultural-interpretation program and the Bernice P. Bishop Museum's archaeological surveys of the valley (most recent comprehensive survey: 2012). Place-name etymologies follow the Hawaiian Dictionary (Pukui & Elbert, revised ed.). Pūpūkea land-snail ecology from the Hawaii Invertebrate Program (DLNR). Corrections welcome, particularly from Hawaiian cultural practitioners on current ceremonial protocol at Puʻu o Mahuka and on appropriate visitor guidance around Waimea Valley's most-sensitive sites."
      />
    </LegendaryShell>
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
    <article className="border-l-2 border-[color:var(--beach-primary,#0B3D5C)] pl-6">
      <div className={`${EYEBROW} mb-2`}>{n}</div>
      <h3 className={`${H3} mb-2`}>{title}</h3>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}
