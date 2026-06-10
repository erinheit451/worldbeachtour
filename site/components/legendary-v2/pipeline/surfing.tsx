/**
 * Pipeline → Surfing Pipeline (technical spoke).
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

export default function PipelineSurfingPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage =
    pickImage(meta, "barrel_jaws") ??
    pickImage(meta, "empty_wave") ??
    meta.images.hero;

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="surfing" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Surfing Pipeline"
        title="What it takes to ride the reef and why it keeps killing people"
        kicker="Pipeline is the most technically demanding barrel wave in elite surfing. The skill floor is absolute; the margin for error is measured in meters of reef. This spoke covers what the wave requires, what the Pipe Masters contest rewards, and why the fatalities are a structural feature of the break rather than incidental to it."
        image={heroImage}
      />

      {/* --- The skill floor --- */}
      <Section id="skill-floor" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· The Skill Floor"
          title="What a Pipeline surfer has to be able to do"
          kicker="Riding Pipeline at a recognizable level is, by elite-surfing community consensus, among the hardest things a surfer can do competitively. The skill requirements break into four layers."
        />

        <div className="space-y-6 max-w-3xl">
          <h3 className={H3}>1 · Read the swell</h3>
          <p className={BODY}>
            Pipeline's lineup is unusually technical to read. The
            three reef sections (First, Second, Third) produce
            different wave shapes at different swell sizes, and the
            peak can shift between reefs during a single session as
            the swell grows or ebbs. Adjacent breaks — Backdoor
            (right-breaking) and Off-the-Wall (left, next peak east)
            — share wave energy with Pipeline and take off from
            overlapping positions. A surfer reading the lineup
            correctly is, at any moment, judging: which peak will
            break, in which direction, from what depth, and whether
            to paddle for it or let it go.
          </p>

          <h3 className={`${H3} mt-6`}>2 · Take off late and deep</h3>
          <p className={BODY}>
            The technical signature of a good Pipeline ride is a
            <strong> late, deep takeoff</strong>. The surfer paddles
            into the wave from behind the peak — from a position
            closer to the breaking edge than at most breaks — and
            drops in on the face as the lip begins to throw. Doing
            this successfully puts the surfer in a position where
            the barrel will form around them on the fall, yielding
            the canonical deep-tube ride. Doing it unsuccessfully
            drops the surfer onto the reef from a height of 2–4
            meters, sometimes with the wave already collapsing
            on top.
          </p>

          <h3 className={`${H3} mt-6`}>3 · Hold the line inside the barrel</h3>
          <p className={BODY}>
            Once inside the barrel, the surfer's line is compressed
            between the wave's face (behind them, peeling) and the
            breaking lip (above and in front of them, closing the
            tube). The line must be <strong>high enough</strong> on
            the face that the surfer isn't caught by the bottom, and{" "}
            <strong>fast enough</strong> along the peel that the
            closing lip doesn't catch them. This is the specific
            technique that Pipeline specialists — Gerry Lopez, Kelly
            Slater, John John Florence — are known for. It is also
            the technique that is most difficult to learn: the only
            way to develop it is to practice it at Pipeline, which
            is in the nature of the break a scarce and dangerous
            learning environment.
          </p>

          <h3 className={`${H3} mt-6`}>4 · Exit before the close-out</h3>
          <p className={BODY}>
            The ride ends when the barrel either dissipates (the
            wave opens) or closes out (the lip catches the face).
            On a good ride the surfer exits through the opening
            end of the barrel, pumping down the wave face until it
            closes out naturally. On a bad ride the close-out
            happens first: the lip lands on the surfer and the
            ride ends in the impact zone. Exit timing — reading
            whether the barrel is going to open or close on your
            line — is what separates the elite from the
            near-elite. It is also the decision point where the
            fatalities most often originate.
          </p>
        </div>
      </Section>

      {/* --- The Pipe Masters in detail --- */}
      <Section id="pipe-masters-detail" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· The Pipe Masters"
          title="How the contest actually runs"
        />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6">
            <h3 className={H3}>Format</h3>
            <p className={BODY}>
              The contest is a <strong>WSL Championship Tour event</strong>,
              typically early December. Men's and women's CT events
              run in parallel, with the men's field traditionally
              around 32 athletes and the women's around 18. Format:
              single-elimination brackets of heats, two or three
              surfers per heat, each heat roughly 30–35 minutes of
              water time. Surfers score their two best waves in each
              heat on a 0–10 scale from a panel of five judges. The
              total determines heat winners, who advance.
            </p>

            <h3 className={`${H3} mt-6`}>The waiting period</h3>
            <p className={BODY}>
              The contest operates on a <strong>waiting period</strong>{" "}
              of up to three weeks. The contest director calls the
              heats on days when the forecast delivers sufficient
              swell and wind conditions at First Reef. Lay days —
              when conditions are insufficient — are typical; a 21-day
              waiting period often produces only 3–5 genuine contest
              days.
            </p>

            <h3 className={`${H3} mt-6`}>Scoring at Pipeline specifically</h3>
            <p className={BODY}>
              Pipeline rewards <strong>tube rides</strong> above
              almost all other scoring elements. A deep, committed
              barrel with a clean exit will score 9.0+ even without
              additional maneuvers. This is different from other CT
              breaks (Trestles, Bells) where aerial maneuvers and
              power turns dominate scoring. Judges are explicitly
              looking for barrel commitment — time spent inside the
              tube, depth, and the cleanness of the exit — as the
              primary scoring currency. This scoring structure
              rewards the specific skill Pipeline demands and is
              part of why Pipe Masters results are career-defining
              in a way other CT results are not.
            </p>

            <h3 className={`${H3} mt-6`}>Local priority</h3>
            <p className={BODY}>
              Pipeline has a <strong>pronounced local-water hierarchy</strong>.
              Native Hawaiian surfers and longtime North Shore
              residents have priority on waves that is enforced
              informally in the lineup. During free-surf sessions this
              affects wave selection meaningfully; during the
              contest, priority is formal and by contest rule, but
              local surfers in the field often benefit from their
              knowledge of specific peak positions that non-locals
              can't read as quickly. The North Shore's local-boy
              tradition is one of the real competitive advantages
              Hawaiian surfers have over visiting international
              competitors at Pipe Masters.
            </p>
          </div>

          <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
            <div className={`${EYEBROW} mb-5`}>· Pipe Masters</div>
            <dl className="space-y-5">
              <Fact label="First contest" value="1971" />
              <Fact label="Typical contest window" value="Dec 8–28" />
              <Fact label="Waiting period" value="21 days" />
              <Fact label="Typical contest days" value="3–5" />
              <Fact label="Men's field" value="~32" />
              <Fact label="Women's field (since 2020)" value="~18" />
              <Fact label="Kelly Slater wins" value="7" />
              <Fact label="Hawaiian world titles via" value="Pipe Masters: 1" />
            </dl>
          </aside>
        </div>
      </Section>

      {/* --- Backdoor and Off-the-Wall --- */}
      <Section id="adjacent" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· Backdoor and Off-the-Wall"
          title="The two adjacent breaks that extend Pipeline's reef"
        />

        <div className="grid gap-8 md:grid-cols-2">
          <article className="rounded-sm border border-[#E7E2D4] bg-white p-6">
            <h3 className={`${H3} mb-3`}>Backdoor</h3>
            <p className={BODY_SM}>
              The <strong>right-breaking wave</strong> from the same
              peak as Pipeline, emerging when the swell arrives at a
              more southwesterly angle. A regular-footed surfer
              (right foot back) rides Backdoor frontside — facing the
              wave face, able to see the closing lip — which makes
              the wave visually easier than Pipeline (which most
              regular-footed surfers ride backside). Backdoor is
              shorter, faster, and has a more forgiving shoulder
              than Pipeline, but the takeoff position is equally
              critical. On the right day a surfer can alternate
              Pipeline and Backdoor waves from the same sitting
              position.
            </p>
          </article>
          <article className="rounded-sm border border-[#E7E2D4] bg-white p-6">
            <h3 className={`${H3} mb-3`}>Off-the-Wall</h3>
            <p className={BODY_SM}>
              The <strong>next break east</strong>, roughly 200
              meters from Pipeline's peak. Also left-breaking, also
              hollow, also reef-bottom — but a separate wave on a
              separate reef section. Named for the concrete wall of
              a private property that fronts the beach at this peak.
              Off-the-Wall is frequently where the spillover crowd
              goes when Pipeline is too busy; on smaller days it
              can be a less competitive, equally technical
              alternative.
            </p>
          </article>
        </div>
      </Section>

      {/* --- Why the fatalities --- */}
      <Section id="fatalities-structural" className={PAPER}>
        <SectionHeader
          eyebrow="· The Deaths"
          title="Why the fatalities are structural, not accidental"
          kicker="Pipeline's death rate is not a function of bad luck or occasional misjudgment. The reef geometry makes certain classes of wipeout near-certain to injure severely, and the water-safety response — among the fastest in surfing — still cannot prevent some of those injuries from being fatal."
        />

        <div className="space-y-6 max-w-3xl">
          <h3 className={H3}>The reef-impact mechanism</h3>
          <p className={BODY}>
            A wipeout at mid-to-large Pipeline drops the surfer from
            2–4 meters onto a reef that sits 3 meters below the
            surface. The surfer can be driven <strong>face-first
            into the coral</strong> within 1–2 seconds of the
            wipeout, before the wave's mass is fully imposed on
            them. The reef-impact injuries most commonly seen at
            Pipeline are: concussion, cervical-spine trauma,
            multi-rib fractures, pneumothorax, and lacerating
            injuries from coral contact at speed. Any of these
            injuries combined with a subsequent hold-down can be
            fatal.
          </p>

          <h3 className={`${H3} mt-6`}>The hold-down mechanism</h3>
          <p className={BODY}>
            The secondary mechanism is hold-down drowning.
            Pipeline's sets arrive in trains of 3–5 waves roughly
            12–15 seconds apart. A hold-down from one wave ends as
            the next wave arrives; a concussed or injured surfer
            who surfaces into the next breaking face can experience
            a <strong>second hold-down before regaining control</strong>.
            Two-wave hold-downs at Pipeline are typically 25–40
            seconds total — long enough to cause drowning in a
            surfer already impaired by a reef-impact injury.
          </p>

          <h3 className={`${H3} mt-6`}>Water-safety limits</h3>
          <p className={BODY}>
            Pipeline has permanent jet-ski water-safety positioning
            during peak contest season and daily lifeguard staffing
            at Ehukai Beach Park. Response times from wipeout to
            jet-ski pickup are among the fastest of any big-wave
            break — typically under 60 seconds. <strong>This is not
            always fast enough</strong>. In the documented
            fatalities (Joyeux 2005, Watanabe 2007, Velilla 2021,
            Perry 2024 — though Perry's death was at a different
            beach, not Pipeline proper), the surfer was reached by
            rescue within operational target times; the injuries
            were already fatal.
          </p>

          <h3 className={`${H3} mt-6`}>What this means</h3>
          <p className={BODY}>
            Pipeline is, by any reasonable measure, the{" "}
            <strong>most dangerous contested break in
            professional surfing</strong>. Teahupoʻo (Tahiti) is more
            dangerous on any given wave — the reef is shallower and
            the wave's raw power is higher — but sees fewer surfers
            overall. Nazaré is more dangerous in terms of wave
            size, but tow-in protocol provides a rescue layer
            Pipeline's paddle-in culture does not. Pipeline's
            specific position — elite paddle-in break, shallow
            reef, high surfer density, visible-from-shore contest
            — puts it at the top of the professional-surfing
            fatality list. Surfers know this. They keep surfing it.
            The break is part of what the sport is.
          </p>
        </div>

        <ClusterAside>
          The geography of the wave itself — the reef mechanics, the
          three named reef sections, Backdoor and Off-the-Wall — is
          summarized on <ClusterLink to="main" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="surfing" />

      <SpokeProvenance
        bundle={bundle}
        note="Technical material follows Matt Warshaw's Encyclopedia of Surfing, the WSL competition records, and oral-history interviews with Gerry Lopez published in Surfer Magazine. Fatality detail reflects contemporary Honolulu Star-Advertiser and Pacific Daily News reporting. Judging-criteria description reflects current WSL scoring standards and may adjust season-to-season."
      />
    </LegendaryShell>
  );
}
