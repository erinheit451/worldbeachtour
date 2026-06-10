/**
 * Nazaré → Surfing Nazaré (Surf spoke). Standalone page.
 *
 * For surfers and surf-aware spectators. The main page explains the canyon
 * at a non-surfer register; this page is the applied version — what a
 * Nazaré swell looks like on a forecast, what wetsuit to wear, how the
 * tow-in protocol actually runs, the complete records anthology, and the
 * only big-wave comparison that makes sense (Jaws).
 */

import type { LegendaryPageBundle } from "../types";
import LegendaryShell from "../shell";
import Figure from "../primitives/figure";
import {
  BODY,
  BODY_SM,
  ClusterAside,
  ClusterLink,
  ClusterRail,
  COOL,
  EYEBROW,
  Fact,
  H3,
  PAPER,
  Section,
  SectionHeader,
  SpokeCrossNav,
  SpokeHero,
  SpokeProvenance,
  pickImage,
  renderInlineBold,
} from "./shared";

export default function NazareSurfingPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;

  const heroImage =
    pickImage(meta, "cliff_crowd_wave") ??
    pickImage(meta, "lighthouse_alt") ??
    meta.images.hero;

  const surferAction = pickImage(meta, "surfer_action");
  const lighthouseAlt = pickImage(meta, "lighthouse_alt");
  const shorebreak = pickImage(meta, "shorebreak_sitio");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="surfing" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Surfing Nazaré"
        title="What the wave looks like from inside the sport"
        kicker="You do not paddle into Nazaré. You are towed into it by a jet-ski travelling at fifty kilometers an hour, released at the exact moment the swell begins to peak, and then allowed to free-fall down a face the height of a six-story building."
        image={heroImage}
      />

      {/* --- How to read a swell --- */}
      <Section id="forecast" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Reading the Forecast"
          title="What makes a Nazaré day — and what doesn't"
          kicker="The canyon is only productive under a narrow set of conditions. Most winter days do not produce rideable waves. The ones that do, you can see coming three days out on a public forecast."
        />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6">
            <p className={BODY}>
              A Nazaré day requires four things to align:
            </p>
            <ol className={`${BODY} list-decimal pl-6 space-y-3`}>
              <li>
                <strong>A deep Atlantic low-pressure system</strong> — a winter
                storm centered northwest of the Azores, generating open-ocean
                groundswell with a fetch of several thousand kilometers.
              </li>
              <li>
                <strong>The swell direction must arrive from the W to NW</strong>{" "}
                (roughly 280°–320°). A northerly swell misses the canyon
                alignment; a southerly swell refracts against the headland
                and loses amplitude.
              </li>
              <li>
                <strong>Long period: 16 seconds or more</strong> between wave
                crests at the buoy. Short-period wind swell does not have
                the deep-water energy to survive the canyon-driven
                refraction process. The bigger the period, the bigger the
                wave that ultimately arrives at Praia do Norte.
              </li>
              <li>
                <strong>Light or moderate offshore wind</strong> — easterly,
                roughly 10–25 km/h. The wave face needs to be held up
                vertically for a tow-in surfer to ride it; strong onshore
                wind collapses the face early and makes the break
                unsurfable.
              </li>
            </ol>
            <p className={BODY}>
              When all four align — usually 15 to 20 times in a full
              October-to-February season — Nazaré produces the biggest
              rideable surf anywhere on Earth. When they don't, the break
              is either flat or messy. Reading a Nazaré forecast is
              reading for these specific conditions; gross wave-height
              forecasts are misleading here because the canyon amplifies
              only a narrow band of incoming swell.
            </p>
            <p className={BODY}>
              The canonical public forecasts: <strong>magicseaweed.com</strong>{" "}
              (Nazaré page), <strong>surfline.com</strong> (Nazaré Premium
              forecast is better than the free version), and the IPMA
              Portuguese marine model. Local surfers also consult the
              <strong> Ocean Prediction Center</strong>'s North Atlantic
              surface analysis for synoptic context. The WSL's Tow
              Surfing Challenge call goes out <strong>72 hours</strong>{" "}
              before an event — if you're trying to be here for a
              competition, watch WorldSurfLeague.com from mid-October on.
            </p>
          </div>

          <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
            <div className={`${EYEBROW} mb-5`}>· Swell Checklist</div>
            <dl className="space-y-5">
              <Fact label="Source storm" value="N Atlantic low" />
              <Fact label="Swell direction" value="W–NW (~300°)" />
              <Fact label="Swell period" value="≥ 16 s" />
              <Fact label="Wind" value="Offshore, 10–25 km/h" />
              <Fact label="Typical window" value="Oct–Feb" />
              <Fact label="Peak-size days / yr" value="15–20" />
              <Fact label="WSL call" value="72 h ahead" />
            </dl>
          </aside>
        </div>

        <ClusterAside>
          The underlying physics — why a 4-meter open-ocean swell becomes
          an 8-meter wave at Praia do Norte, and why the shoreward ramp
          throws the face vertical — is explained at non-specialist
          register on <ClusterLink to="main" />.
        </ClusterAside>
      </Section>

      {/* --- Wetsuit by month --- */}
      <Section id="wetsuit" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· What to Wear"
          title="Wetsuit guide, month by month"
          kicker="The Atlantic at Nazaré runs 14 °C in February and 19 °C in August. The wetsuit you wore at Ericeira two weeks ago is almost certainly not the right one for here."
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${EYEBROW} border-b border-[#CBD5E1]`}>
                <th className="py-3 pr-4">Month</th>
                <th className="py-3 pr-4">Water °C</th>
                <th className="py-3 pr-4">Air °C</th>
                <th className="py-3 pr-4">Suit</th>
                <th className="py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="text-[15px] text-volcanic-700">
              <WetsuitRow m="Jan" w="15" a="8–14" s="5/4 + booties + hood" n="Deep winter. Big-wave season peak. Serious cold." />
              <WetsuitRow m="Feb" w="14" a="8–15" s="5/4 + booties + hood" n="Coldest water of the year." />
              <WetsuitRow m="Mar" w="14" a="9–17" s="5/4 or 4/3 + booties" n="Transition month. Still cold." />
              <WetsuitRow m="Apr" w="14" a="10–18" s="4/3 + booties" n="Air warms fast, water doesn't." />
              <WetsuitRow m="May" w="15" a="12–20" s="4/3" n="Booties optional. Wave season ending." />
              <WetsuitRow m="Jun" w="17" a="15–22" s="3/2" n="Summer shore-break season begins at Praia da Nazaré." />
              <WetsuitRow m="Jul" w="18" a="16–24" s="3/2 or shorty" n="Warmest wetsuit layer of the year." />
              <WetsuitRow m="Aug" w="19" a="17–25" s="2 mm or shorty" n="Flat or small surf season. Practical wetsuit break." />
              <WetsuitRow m="Sep" w="19" a="16–24" s="3/2" n="Festa da Senhora week. Still swimmable at Praia da Nazaré." />
              <WetsuitRow m="Oct" w="18" a="14–21" s="4/3" n="Wave season starting. First serious swells mid-month." />
              <WetsuitRow m="Nov" w="16" a="11–17" s="4/3 + booties" n="Water drops fast. McNamara's 2011 ride was 1 November." />
              <WetsuitRow m="Dec" w="15" a="9–15" s="5/4 + booties" n="Full winter kit. Short days; surf the morning sessions." />
            </tbody>
          </table>
        </div>

        <p className={`${BODY_SM} mt-6 italic text-volcanic-500 max-w-3xl`}>
          Suit thicknesses are standard big-wave Atlantic specs (5/4 =
          5 mm torso / 4 mm limbs). Add a hood any time water is under
          15 °C if you're in the water more than an hour. Booties any
          time rocks are a consideration on launch, which at Praia do
          Norte is always.
        </p>
      </Section>

      {/* --- Tow operations --- */}
      <Section id="tow-ops" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· The Tow Protocol"
          title="Two jet-skis, one sled, ninety seconds"
          kicker="Every tow-in surfer at Nazaré is actually three people in the water: the surfer, the tow driver, and the rescue driver. Understanding the protocol is the difference between watching a ride and watching an operation."
        />

        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            At most big-wave breaks — Mavericks, Jaws on a clean day,
            Waimea Bay — a surfer can paddle into the wave. The wave is
            steep enough and shaped well enough that arm propulsion
            matches the takeoff speed. At Nazaré the wave face is moving
            too fast; human arms cannot catch it. The only way onto a
            Nazaré wave is to be <strong>towed in</strong>.
          </p>

          {surferAction && (
            <Figure
              image={surferAction}
              size="wide"
              tier="B"
              caption="A tow-in ride at Praia do Norte. The small white object visible behind and above the surfer is the rescue jet-ski, stationed roughly 100 meters outside the break."
            />
          )}

          <h3 className={`${H3} mt-8`}>The choreography</h3>
          <ol className={`${BODY} list-decimal pl-6 space-y-3`}>
            <li>
              <strong>Tow driver</strong> accelerates the surfer into the
              wave via a <strong>tow rope</strong> — a 15–20 meter line
              attached to the ski's stern. Target entry speed: 50 km/h
              matching the swell's advance.
            </li>
            <li>
              <strong>Release</strong> happens at the precise moment the
              swell begins to peak — too early and the surfer loses the
              wave; too late and the ski itself goes over the falls.
              Release is on the surfer's whistle or the driver's visual
              call, depending on team protocol.
            </li>
            <li>
              <strong>Rescue driver</strong>, stationed 100–200 meters
              outside the impact zone on a second ski, monitors the ride.
              A <strong>rescue sled</strong> — a buoyant platform — is
              strapped to the back of the rescue ski.
            </li>
            <li>
              On wipeout, the <strong>rescue ski enters the impact zone</strong>{" "}
              within seconds; the surfer grabs the sled as the ski exits
              the wave's breaking face. Target: from wipeout to sled
              pickup under <strong>90 seconds</strong> — the margin between
              an unconscious surfer who recovers and one who doesn't.
            </li>
            <li>
              Every serious big-wave surfer at Nazaré wears an{" "}
              <strong>inflatable flotation vest</strong> with a CO₂
              canister triggered by a ripcord. The vest is the last line
              of defense if the rescue ski cannot reach the surfer in
              time — it keeps an unconscious body face-up on the surface.
            </li>
          </ol>

          <h3 className={`${H3} mt-8`}>Who drives safety</h3>
          <p className={BODY}>
            There is a specific community of water-safety drivers who have
            built careers around this break. Names that recur on the
            events:
          </p>
          <ul className={`${BODY} list-disc pl-6 space-y-2`}>
            <li>
              <strong>Lucas Chianca ("Chumbo")</strong> — Brazilian, competes
              and drives safety; widely considered the best in the water on
              both sides of the role.
            </li>
            <li>
              <strong>Nic von Rupp</strong> — Portuguese; one of the core
              local big-wave surfers and frequent safety driver.
            </li>
            <li>
              <strong>Pedro "Scooby" Vianna</strong> — Brazilian, longtime
              resident safety driver for the McNamara and Gabeira teams.
            </li>
            <li>
              <strong>Kai Lenny</strong> — Hawaiian; both competes and
              works safety across the winter season.
            </li>
            <li>
              <strong>Garrett McNamara</strong> — still active; typically
              drives safety now rather than surfing.
            </li>
          </ul>
          <p className={BODY}>
            Most of them live in the village from October through
            February. They know each other's riding styles, each other's
            wipeout tendencies, each other's breathing capacity, and each
            other's wives and children. When a WSL Tow Challenge is
            called for a specific swell, the surfers don't draw teams; the
            teams are already teams, built over years in this water.
          </p>
        </div>
      </Section>

      {/* --- Records anthology --- */}
      <Section id="records" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· Records"
          title="The wave-height chronology"
          kicker="Every current big-wave world record — men's and women's, across all certifications — belongs to this beach. The list is short and it is all here."
        />

        <div className="space-y-10 max-w-3xl">
          <Record
            year="1 Nov 2011"
            name="Garrett McNamara"
            height="23.77 m (78 ft)"
            body="Towed into the wave during a rising winter swell by Portuguese safety driver Andrew Cotton. Certified by Guinness as the largest wave ever surfed. The photograph of McNamara at the base of the wave, with the Forte lighthouse visible on the cliff, is the single image that created the modern Nazaré big-wave era. Within six months Praia do Norte had a permanent water-taxi service and an international surf community."
          />
          <Record
            year="28 Jan 2013"
            name="Garrett McNamara"
            height="~30 m (disputed ~100 ft)"
            body="A second, larger ride. Estimated visually at close to 100 feet; never formally certified because the measurement standards at the time required photogrammetric analysis McNamara's team did not provide. Widely considered the largest wave McNamara ever rode, but it is not in the Guinness record."
          />
          <Record
            year="8 Nov 2017"
            name="Rodrigo Koxa"
            height="24.38 m (80 ft)"
            body="Brazilian surfer; broke McNamara's 2011 standing record. Certified by Guinness in 2018 following photogrammetric review. Koxa's ride was the first confirmation that Nazaré was producing bigger waves than anyone had ridden before — and that the 2011 ride had not been a one-off."
          />
          <Record
            year="29 Oct 2020"
            name="Sebastian Steudtner"
            height="26.21 m (86 ft) · ~28.6 m remeasured"
            body="German; currently the standing Guinness world record for the largest wave ever surfed. Subsequent photogrammetric re-analysis by a research team at the University of Alcalá in 2022 estimated the true height closer to 28.6 m. Steudtner is now one of the Nazaré-resident core big-wave group."
          />
          <Record
            year="11 Feb 2020"
            name="Maya Gabeira"
            height="22.4 m (73.5 ft)"
            body="Brazilian; currently the standing record for the largest wave ever ridden by a woman. Gabeira's line at Nazaré is a story in itself: she nearly drowned here in 2013, returned, rebuilt her technique, and set the women's world record first in 2018 (20.7 m) and extended it here in 2020. The 2020 wave was surfed on the same session — same swell window — as Steudtner's men's record."
          />
        </div>

        {lighthouseAlt && (
          <Figure
            image={lighthouseAlt}
            size="wide"
            tier="B"
            caption="Praia do Norte on a mid-sized day. The records above were all set on waves substantially larger than this."
            className="mt-12"
          />
        )}
      </Section>

      {/* --- The wipeout --- */}
      <Section id="wipeout" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· The Wipeout"
          title="What a Nazaré hold-down physically is"
          kicker="Two-wave hold-downs of 45 seconds or more are routine here. The inflatable vest is the margin."
        />

        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            A wipeout at Praia do Norte is not a single event. The wave
            breaks, the surfer is separated from the board, the surfer
            is driven under the surface and along the seabed for a
            distance that depends on the wave's energy. The problem is
            the <strong>second wave</strong>. Nazaré's sets arrive in
            trains of three to six, roughly fifteen to twenty seconds
            apart. A hold-down from the first wave ends as the next wave
            arrives, which means the surfer surfaces into the next
            breaking face and goes back down. Two-wave hold-downs of{" "}
            <strong>45 seconds or more</strong> are routine here.
          </p>
          <p className={BODY}>
            Two wipeouts define the sport's understanding of this break.
          </p>
          <p className={BODY}>
            <strong>October 2013 — Maya Gabeira.</strong> Towed into a
            wave estimated at around 25 meters. Separated from the board
            on take-off. Received two two-wave hold-downs. When Carlos
            Burle reached her on a jet-ski she was unconscious and
            floating face-down; he dragged her to the beach and
            administered CPR on the sand below the fortress. She survived
            with a broken fibula and nerve damage. Her return and
            eventual 2020 world record is the sport's most-studied arc
            of recovery from a near-fatal big-wave incident.
          </p>
          <p className={BODY}>
            <strong>5 January 2023 — Márcio Freire.</strong> Brazilian
            big-wave pioneer, age 47. One of the original Hawaiian
            paddle-in "Mad Dogs" group that first surfed Jaws without
            tow assistance in the early 2000s. Died at Praia do Norte
            during a freesurfing session on a mid-size swell. The
            immediate cause was drowning following a hold-down. It was
            the <strong>first fatality</strong> at Nazaré in big-wave
            surfing history. The surf community's relationship with
            this break was not the same afterwards. The Forte flew its
            flag at half-mast for a week.
          </p>
          <p className={BODY}>
            Freire's death did two things. It accelerated the adoption
            of the CO₂-triggered inflation vest as a required, not
            optional, piece of kit for anyone surfing Praia do Norte on
            a non-contest day. And it changed the conversation, inside
            the sport, about what kinds of days are worth surfing at
            all — a discussion that is still ongoing among the
            Nazaré-resident group.
          </p>
        </div>
      </Section>

      {/* --- Nazaré vs Jaws --- */}
      <Section id="vs-jaws" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· The Comparison"
          title="Nazaré vs. Jaws — the only useful one"
          kicker="Pipeline and Mavericks are different categories. The break that actually compares to Nazaré — same canyon-amplification mechanism, same tow-dominant register, same modern big-wave attention — is Pe'ahi, on Maui's north shore."
        />

        <div className="grid gap-10 md:grid-cols-2">
          <ComparisonCard
            name="Nazaré"
            location="Portugal · North Atlantic"
            rows={[
              ["Mechanism", "Canyon-focused swell (Canhão da Nazaré, 230 km / 5,000 m deep)"],
              ["Season", "Oct–Feb"],
              ["Record ridden", "26.21 m (Steudtner, 2020) · ~28.6 m remeasured"],
              ["Water temp", "14–19 °C — Atlantic cold"],
              ["Entry", "Tow-in exclusively"],
              ["Break character", "Thick, heavy, moving water; steep but not barrelling"],
              ["Hazards", "Two-wave hold-downs; canyon currents; onshore rocks"],
              ["Local community", "~30 core resident surfers Oct–Feb"],
            ]}
          />
          <ComparisonCard
            name="Jaws / Pe'ahi"
            location="Maui, Hawaii · North Pacific"
            rows={[
              ["Mechanism", "Reef + deep-water canyon offshore of Pe'ahi Bay"],
              ["Season", "Dec–Feb"],
              ["Record ridden", "~21 m (Kai Lenny, multiple 2021–2022)"],
              ["Water temp", "23–26 °C — tropical"],
              ["Entry", "Both tow-in and paddle-in (rare big-wave break where both work)"],
              ["Break character", "Hollow, barrelling wave; classic tube shape"],
              ["Hazards", "Reef at low tide; impact zone over shallow coral"],
              ["Local community", "~40 core resident surfers, Hawaiian core older than Nazaré's"],
            ]}
          />
        </div>

        <p className={`${BODY} mt-12 max-w-3xl`}>
          The two breaks are most usefully understood as the two ends of
          the big-wave spectrum. Jaws rewards barrel-riding technique and
          produces the most photogenic rides in the sport. Nazaré rewards
          drop-riding commitment and produces the biggest measurable
          waves. A surfer who can handle both is the short list the
          sport is currently working with.
        </p>

        {shorebreak && (
          <Figure
            image={shorebreak}
            size="wide"
            tier="B"
            caption="Praia do Norte shore break — the 95 m → 0 m bathymetric ramp compressed into a few hundred horizontal meters. Same mechanism that builds the outside wave."
            className="mt-12"
          />
        )}
      </Section>

      <SpokeCrossNav current="surfing" />

      <SpokeProvenance
        bundle={bundle}
        note="Swell-checklist thresholds reflect consensus among the Nazaré-resident group and published Magicseaweed / Surfline forecasting guides. Record heights are as certified by Guinness and, where applicable, post-ride photogrammetric remeasurement. Freire fatality details from Portuguese and Brazilian press coverage, January 2023. The wetsuit-by-month table is based on IPMA water-temperature normals and Nazaré surf-community practice."
      />
    </LegendaryShell>
  );
}

// ============================================================================
// Local sub-components
// ============================================================================

function WetsuitRow({
  m,
  w,
  a,
  s,
  n,
}: {
  m: string;
  w: string;
  a: string;
  s: string;
  n: string;
}) {
  return (
    <tr className="border-b border-[#E2E8F0]">
      <td className="py-3 pr-4 font-mono text-[13px] uppercase tracking-wider text-volcanic-500">
        {m}
      </td>
      <td className="py-3 pr-4 font-mono text-[13px]">{w} °C</td>
      <td className="py-3 pr-4 font-mono text-[13px]">{a}</td>
      <td className="py-3 pr-4 font-semibold">{s}</td>
      <td className="py-3 text-[14px] text-volcanic-600">{n}</td>
    </tr>
  );
}

function Record({
  year,
  name,
  height,
  body,
}: {
  year: string;
  name: string;
  height: string;
  body: string;
}) {
  return (
    <article className="border-l-2 border-[color:var(--beach-primary,#2B3E50)] pl-6">
      <div className={`${EYEBROW} mb-2`}>{year}</div>
      <h3 className={`${H3} mb-2`}>{name}</h3>
      <div className="text-[17px] font-semibold text-volcanic-800 mb-3">
        {height}
      </div>
      <p className={BODY_SM}>{renderInlineBold(body)}</p>
    </article>
  );
}

function ComparisonCard({
  name,
  location,
  rows,
}: {
  name: string;
  location: string;
  rows: [string, string][];
}) {
  return (
    <article className="rounded-sm border border-[#E2E8F0] bg-white p-7">
      <div className={`${EYEBROW} mb-2`}>{location}</div>
      <h3 className={`${H3} mb-5`}>{name}</h3>
      <dl className="space-y-4">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className={`${EYEBROW} mb-1`}>{k}</dt>
            <dd className="text-[15px] text-volcanic-700 leading-relaxed">{v}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
