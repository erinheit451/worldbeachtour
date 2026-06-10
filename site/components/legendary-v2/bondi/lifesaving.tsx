/**
 * Bondi → Surf Lifesaving (spike-applied spoke).
 * Absorbs Black-Sunday and Bondi-Rescue material.
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

export default function BondiLifesavingPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage =
    pickImage(meta, "sls_boats_racing") ??
    pickImage(meta, "surf_life_saving_club") ??
    meta.images.hero;
  const historic = pickImage(meta, "historic_1937");
  const club = pickImage(meta, "surf_life_saving_club");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="lifesaving" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Surf Lifesaving"
        title="The sport, the rescue service, and the TV show — all three started here"
        kicker="Australia invented surf lifesaving in 1906. The red-and-yellow caps you see on any English-speaking beach trace directly to what happened at Bondi. The story the show Bondi Rescue tells every week is the modern continuation of the 120-year-old institution this spoke is about."
        image={heroImage}
      />

      {/* --- Origin --- */}
      <Section id="origin" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· 1906 Origin"
          title="How a handful of Sydney watermen formalized a service the world now uses"
        />

        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            Daylight swimming in the ocean was illegal in New South
            Wales until <strong>1903</strong>. The reversal came after
            the newspaper editor <strong>William Gocher</strong>{" "}
            deliberately swam at Manly in midday and invited arrest
            (they did not arrest him). Legislation followed; by 1905,
            Sydney's eastern beaches — Bondi, Bronte, Tamarama,
            Manly, Coogee — were receiving weekend crowds that
            included large numbers of complete non-swimmers stepping
            into the Pacific for the first time in their lives. The
            drowning numbers became a public-safety crisis within
            eighteen months.
          </p>
          <p className={BODY}>
            On <strong>21 February 1906</strong>, a group of Bondi
            watermen — including surfers, spear-fishers, and beach
            residents — formalized themselves as the{" "}
            <strong>Bondi Surf Bathers' Life Saving Club</strong>. The
            founding committee included{" "}
            <strong>John Bond</strong> (first club captain),{" "}
            <strong>William John ("Happy") Eyre</strong>, and{" "}
            <strong>Arthur "Flossie" Lewis</strong> — names that still
            appear on the SBLSC's board of founding members.
            Approximately 30 men signed up in the first week; the
            club's first rescue, using the belt-and-line gear the
            founders had adapted from British fishing-village
            coastguard practice, was in March 1906.
          </p>
          <p className={BODY}>
            By <strong>1907</strong>, Bronte, North Bondi, Manly, and
            Coogee had copied the model and founded their own clubs.
            By <strong>1915</strong>, Sydney's entire eastern beaches
            circuit was patrolled every weekend by volunteer
            lifesavers in color-coded caps. By <strong>1924</strong>{" "}
            the national body — now called <strong>Surf Life Saving
            Australia</strong> — had absorbed all Australian clubs
            under a single rulebook, training scheme, and
            competition circuit. Approximately{" "}
            <strong>314 clubs</strong> operate today along the
            Australian coast; Bondi's is number one in the register
            and is still the canonical institutional reference.
          </p>

          {club && (
            <Figure
              image={club}
              size="wide"
              tier="B"
              caption="The Bondi Surf Bathers' Life Saving Club — the 1936 Art Deco clubhouse building at the north end of the beach. The 1906 founding predates this building by 30 years; the club originally met in the Pavilion and in temporary shelters."
            />
          )}
        </div>
      </Section>

      {/* --- Black Sunday --- */}
      <Section id="black-sunday" className={DARK_SECTION()}>
        <div className="max-w-3xl">
          <div
            className="text-[11px] font-mono uppercase tracking-[0.3em] mb-4"
            style={{ color: "var(--beach-primary, #D9B66B)" }}
          >
            · 6 February 1938 · Black Sunday
          </div>
          <h2
            className="text-[32px] sm:text-[44px] leading-[0.95] -tracking-[0.01em] text-[#F1F5F9] uppercase"
            style={{ fontFamily: "var(--display-family, var(--font-barlow-condensed))" }}
          >
            The afternoon the service became a sport
          </h2>
          <p className="mt-5 text-lg italic text-[#94A3B8] font-serif">
            Thirty-five thousand on the sand. Three waves. Three
            hundred rescued. Five drowned. The defining day of
            Australian surf lifesaving and the origin of the
            international swim-between-the-flags rule.
          </p>
        </div>

        <div className="mt-12 space-y-6 max-w-3xl">
          <h3
            className="font-display text-[22px] leading-tight text-[#F1F5F9] uppercase -tracking-[0.01em]"
            style={{ fontFamily: "var(--display-family, var(--font-barlow-condensed))" }}
          >
            The afternoon
          </h3>
          <p className="text-[18px] leading-[1.7] text-[#CBD5E1]">
            Sunday <strong className="text-[#F1F5F9]">6 February 1938</strong>{" "}
            was a high-summer Sydney day — 32 °C, clear skies, a light
            onshore breeze. Bondi had an estimated{" "}
            <strong className="text-[#F1F5F9]">35,000 people on the
            sand</strong>, among the largest weekend crowds the beach
            had ever carried. The SBLSC patrol on duty — approximately
            80 volunteer lifesavers from Bondi and neighboring clubs —
            had flagged the central swimming area between the two
            rescue-boat stations. The beach was operating at what
            passed in 1938 for standard summer density.
          </p>
          <p className="text-[18px] leading-[1.7] text-[#CBD5E1]">
            At approximately <strong className="text-[#F1F5F9]">3 p.m.</strong>,
            a set of three larger-than-normal waves — later
            characterized variously as rogue set waves, as the leading
            edge of a distant unseasonal swell, or (in some later
            analyses) as a small localized seiche — struck the
            central beach. The first wave washed a sandbank out from
            under the waders standing on it, suddenly dropping
            several hundred people from knee-deep to neck-deep water.
            The second wave drove the panicked crowd backward toward
            the beach. The third — the largest of the set — pulled
            the resulting shorebreak water back out to sea on a strong
            return current, dragging an estimated{" "}
            <strong className="text-[#F1F5F9]">250–300 people</strong>{" "}
            into the depth beyond the breakers.
          </p>

          <h3
            className="font-display text-[22px] leading-tight text-[#F1F5F9] uppercase -tracking-[0.01em] mt-10"
            style={{ fontFamily: "var(--display-family, var(--font-barlow-condensed))" }}
          >
            Four hours
          </h3>
          <p className="text-[18px] leading-[1.7] text-[#CBD5E1]">
            The rescue effort that followed lasted approximately{" "}
            <strong className="text-[#F1F5F9]">four hours</strong> and
            involved roughly 80 volunteer rescuers. The primary rescue
            apparatus of the 1930s was the{" "}
            <strong className="text-[#F1F5F9]">reel, line, and belt</strong>:
            a beach-mounted wooden reel paid out 400+ meters of
            rope; a swimmer wearing a canvas-and-cork belt attached to
            the line swam out to a drowning victim, got the belt under
            the victim's arms, and was hauled back by a team hauling
            the reel on the sand. Bondi's two reel stations worked
            continuously through the afternoon. The additional rescue
            boats (4-person oared surf boats, a direct descendant of
            British fishing-village coastguard vessels) worked the
            outer impact zone.
          </p>
          <p className="text-[18px] leading-[1.7] text-[#CBD5E1]">
            The final count: approximately{" "}
            <strong className="text-[#F1F5F9]">300 people rescued</strong>,{" "}
            <strong className="text-[#F1F5F9]">5 drowned</strong> — all
            weak or non-swimmers who had been pulled too far out
            before the rescuers could reach them. In a disaster that
            would in a less-organized beach have killed dozens, the
            Bondi SBLSC's 32-year-old operational infrastructure
            demonstrated what volunteer surf lifesaving could do at
            scale under pressure.
          </p>

          <h3
            className="font-display text-[22px] leading-tight text-[#F1F5F9] uppercase -tracking-[0.01em] mt-10"
            style={{ fontFamily: "var(--display-family, var(--font-barlow-condensed))" }}
          >
            What changed
          </h3>
          <p className="text-[18px] leading-[1.7] text-[#CBD5E1]">
            Black Sunday became the <strong className="text-[#F1F5F9]">most
            reported-on rescue in international press of the 1930s</strong>.
            Within eighteen months, surf lifesaving clubs patterned
            on the Australian model had been established at Cape
            Town, Durban, Muizenberg, and Cornish Coastguard beaches
            in the UK. The{" "}
            <strong className="text-[#F1F5F9]">swim-between-the-flags</strong>{" "}
            rule — which the SBLSC had been using since the 1910s but
            had never exported formally — became the international
            standard beach-safety protocol it remains today. The
            red-and-yellow cap, chosen because those are the two
            most-visible colors against both ocean water and tan
            sand, became the global uniform of volunteer beach
            lifeguards.
          </p>
          {historic && (
            <Figure
              image={historic}
              size="wide"
              tier="B"
              datePrefix="1937"
              caption="Bondi in 1937, one year before Black Sunday. The Bondi Pavilion visible center; the beach at typical weekend density. The SBLSC had been patrolling here every weekend for 31 years by the time of the 1938 event."
              className="my-8"
            />
          )}
        </div>
      </Section>

      {/* --- Modern operation --- */}
      <Section id="modern" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· Modern Operation"
          title="The two services, the gear, the daily rhythm"
          kicker="Bondi in 2026 is patrolled by two overlapping services that work side by side across seven days a week. The red-and-yellow caps are still volunteers. The blue caps are paid. Both are on duty, and between them they perform roughly 4,500 rescues a year."
        />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6 max-w-3xl">
            <h3 className={H3}>Volunteer lifesavers (red-and-yellow)</h3>
            <p className={BODY}>
              The <strong>Bondi SBLSC</strong> maintains a weekend
              volunteer patrol from <strong>October through April</strong>{" "}
              every year. Approximately 180 active patrolling members
              currently. Patrols run 8 a.m. to 6 p.m. Saturday and
              Sunday in peak season; shorter rotations in the shoulder
              months. Every patrolling volunteer is{" "}
              <strong>Bronze Medallion-qualified</strong> — a 40+ hour
              training program covering rescue, resuscitation, CPR,
              and first aid. Senior volunteers carry additional IRB
              (inflatable rescue boat) and beach-management
              qualifications.
            </p>

            <h3 className={`${H3} mt-6`}>Professional lifeguards (blue)</h3>
            <p className={BODY}>
              The <strong>Waverley Council Beach Services</strong> —
              the professional lifeguards — operate{" "}
              <strong>seven days a week, year-round</strong>, with
              12–15 lifeguards on duty during the peak season. They
              are Waverley Council employees; base salary around
              AUD $75,000, senior lifeguards higher. Every professional
              is Bronze-qualified plus holds additional qualifications
              in advanced first aid, vehicle rescue, IRB driver, and
              (for senior staff) incident command. The professional
              service was expanded in the 1990s when beach attendance
              grew beyond what volunteer weekend patrols could safely
              cover on mid-week summer days.
            </p>

            <h3 className={`${H3} mt-6`}>The rescue gear</h3>
            <ul className={`${BODY} list-disc pl-6 space-y-3`}>
              <li>
                <strong>Rescue tubes</strong> — the flexible foam
                flotation device trailed by a line. The Baywatch-era
                replacement for the 1906 cork belt. Still the default
                rescuer-to-victim tool.
              </li>
              <li>
                <strong>IRBs (inflatable rescue boats)</strong> —
                outboard-motored zodiacs that handle rescues beyond
                the surf zone. Introduced in Australia in the 1960s;
                the Bondi fleet runs 4 boats in rotation.
              </li>
              <li>
                <strong>Rescue boards</strong> — longboard-like hard
                boards the professional lifeguards use for fast
                response inside the surf zone.
              </li>
              <li>
                <strong>Jet-skis with sleds</strong> — for heavy-surf
                rescue; the tow-in big-wave equipment that Nazaré
                uses for tow-in surfing was, in its early days,
                adapted from Australian lifesaving-service jet-ski
                rescue protocols.
              </li>
              <li>
                <strong>Drones</strong> — the Bondi service has run
                drone surveillance since 2018; drones now drop
                inflatable rescue pods to swimmers in distress outside
                the surf zone, which is a genuine 21st-century
                addition to the rescue inventory.
              </li>
            </ul>
          </div>

          <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
            <div className={`${EYEBROW} mb-5`}>· Numbers</div>
            <dl className="space-y-5">
              <Fact label="Rescues per year (Bondi)" value="~4,500" />
              <Fact label="Volunteer patrol members" value="~180" />
              <Fact label="Professional lifeguards" value="12–15" />
              <Fact label="Peak weekend visitors" value="40,000+" />
              <Fact label="Volunteer patrol season" value="Oct–Apr" />
              <Fact label="Professional service" value="365 days/yr" />
              <Fact label="Beach drone deployment since" value="2018" />
              <Fact label="Bronze Medallion training" value="40+ hours" />
            </dl>
          </aside>
        </div>
      </Section>

      {/* --- Bondi Rescue --- */}
      <Section id="bondi-rescue" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· Bondi Rescue"
          title="The TV show, the ethics, and what it is for"
        />

        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            <em>Bondi Rescue</em> premiered on Network Ten in{" "}
            <strong>2006</strong>, produced by{" "}
            <strong>Cordell Jigsaw Productions</strong>. The format
            was straightforward: camera crews embedded with the
            Waverley Council professional lifeguards for the peak
            summer months, following them through rescues, medical
            emergencies, minor crime (wallet theft is the canonical
            Bondi summer crime), and the chronic comedy of managing
            a beach that receives 40,000 visitors on a Saturday. The
            show has run continuously since — approaching 20 seasons
            — and is syndicated in <strong>more than 100 countries</strong>.
          </p>

          <h3 className={H3}>The lifeguards as characters</h3>
          <p className={BODY}>
            The long-running Bondi Rescue figures — <strong>Bruce
            "Hoppo" Hopkins</strong>,{" "}
            <strong>Anthony "Harries" Carroll</strong>,{" "}
            <strong>Trent "Maxi" Maxwell</strong>,{" "}
            <strong>Kerrbox</strong>, Whippet, Hutchy, Jesse — are
            recognizable figures across Australia and in English-
            speaking countries. The show's consistency of personnel
            (most of the named lifeguards have been on the show
            since its first or second seasons) has produced a
            character continuity that scripted television struggles
            to match. Hoppo runs the team; Harries is the
            emotionally-open one; Maxi is the surf-champion one.
            This level of personality consistency is what turns a
            workplace documentary into something viewers return to.
          </p>

          <h3 className={`${H3} mt-6`}>The ethics question</h3>
          <p className={BODY}>
            The show documents, by design, people having among the
            worst moments of their lives — drownings, heart attacks,
            drug overdoses, minor-crime arrests. The Australian
            Commercial Television Code of Practice and internal
            Cordell Jigsaw policies require informed consent from
            rescued individuals before footage airs, and the show has
            demonstrably blurred or cut footage in cases where
            consent was refused. That said: the show is on television
            for entertainment, its ratings depend on drama, and the
            line between documentary public-safety education and
            exploitative spectacle is genuinely ambiguous. This is
            worth naming rather than glossing over.
          </p>

          <h3 className={`${H3} mt-6`}>As training material</h3>
          <p className={BODY}>
            Inside the surf-lifesaving industry globally,{" "}
            <em>Bondi Rescue</em> has become an{" "}
            <strong>unexpectedly important training resource</strong>.
            The show's library of real rescues — with tide conditions,
            victim behavior, rescuer decisions, and outcomes all
            visible on camera — is used in SLS Bronze Medallion
            instruction in Australia, in RNLI beach-lifeguard training
            in the UK, and in equivalent programs in South Africa and
            New Zealand. A TV show made for mass entertainment has
            become, in parallel, one of the single largest public
            archives of beach-rescue technique. The surf-lifesaving
            community has mixed feelings about this — it is not the
            archive they would have chosen to compile — but it is
            genuinely useful.
          </p>
        </div>

        <ClusterAside>
          Main-page context — the beach itself, the Gadigal country
          under it, the Icebergs Club at the south end — is in{" "}
          <ClusterLink to="main" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="lifesaving" />

      <SpokeProvenance
        bundle={bundle}
        note="Founding-era SBLSC detail from the Bondi SBLSC centennial archive (2006) and Surf Life Saving Australia's official history. Black Sunday reconstruction from Tony Saunders's Black Sunday (Mitchell Beazley, 1988) and contemporary Sydney Morning Herald reporting 7–10 February 1938. Modern operational detail from Waverley Council Beach Services and from several Bondi Rescue season recap documents. Rescue numbers are published annually; verify current figures at slsnsw.com.au."
      />
    </LegendaryShell>
  );
}

// Local DARK_SECTION helper — inline wrapper for the Black Sunday block
function DARK_SECTION() {
  return "bg-[#0F172A]";
}
