/**
 * Malibu → First Point (deep-dive spoke).
 *
 * REVERENT primary register, WRY shifts. The wave as physics argument.
 */

import type { LegendaryPageBundle } from "../types";
import LegendaryShell from "../shell";
import Figure from "../primitives/figure";
import {
  BODY,
  BODY_SM,
  COOL,
  CREAM,
  DISPLAY_FF,
  EYEBROW,
  H3,
  PAPER,
  Section,
  SectionHeader,
  SpokeHero,
  SpokeProvenance,
  pickImage,
} from "../nazare/shared";
import { ClusterAside, ClusterLink, ClusterRail, SpokeCrossNav } from "./shared";

export default function MalibuFirstPointPage({ bundle }: { bundle: LegendaryPageBundle }) {
  const { composition, meta } = bundle;
  const hero = pickImage(meta, "pier_sunset") ?? meta.images.hero;
  const longboard = pickImage(meta, "longboard_trim");
  const lineup = pickImage(meta, "surfer_lineup");
  const coastline = pickImage(meta, "coastline_aerial");
  const adamson = pickImage(meta, "adamson_house");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="first-point" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· First Point"
        title="The wave is an argument about what surfing should be"
        kicker="Cobblestone, slowness, the south-swell window, and eighty years of a longboard canon written against a single peeling right."
        image={hero}
      />

      {/* Opener */}
      <Section id="opener" className={PAPER}>
        <div className={`${EYEBROW} mb-4`}>· From the rock</div>
        <p className={`${BODY} mb-6`}>
          You paddle out past the Adamson House, past the tiled dome catching morning light above the lagoon, past the State Park lifeguard tower, and you keep paddling until you are sitting up near <strong>the rock</strong> about forty yards north of the Malibu Pier. The rock is not a landmark anyone names on a map. It is <em>the</em> rock. You find it by counting pelicans, by lining up the pier&rsquo;s fifth piling with the bluff, by watching where the first longboarder of the morning stops paddling and turns around.
        </p>
        <p className={`${BODY} mb-6`}>
          The first set walks in from the southwest. You can see it coming for a long time because First Point is slow. Not slow in the pejorative sense. Slow in the sense that the cobblestone below you is doing geometry — refracting the south swell around the headland, bending it, stretching it, handing it back to the inside as a shoulder that peels toward the pier at the pace of a relaxed conversation. The drop is nothing. You will barely notice the drop. The trim is everything. You stand and the wave re-forms, and then it re-forms again, and then a third time across the length of the cobble, and you walk forward on your nine-six because that is what the wave has asked you to do since 1947.
        </p>
        <p className={BODY}>
          First Point is not a difficulty problem. It is an aesthetic one. The wave is an argument about what surfing should be. A surfer riding First Point is riding an opinion.
        </p>
      </Section>

      {/* Cobblestone geology */}
      <Section id="cobblestone" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Cobblestone geology"
          title="A pile of round rocks that everything downstream rests on"
        />

        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] items-start">
          <div className="space-y-6">
            <p className={BODY}>
              Everything downstream at First Point — the canon, the crowd, the eighty years of argument — rests on a pile of round rocks. <strong>Malibu Creek</strong> drains the Santa Monica Mountains: a steep, burnable, thirteen-hundred-foot watershed that funnels sediment toward the Pacific through Malibu Canyon. For roughly ten thousand years the creek has been carrying cobble out of the hills, tumbling it smooth on its way down, and fanning it in a submerged ramp that angles away from the headland at the mouth. The ramp is what makes the wave.
            </p>
            <p className={BODY}>
              Compare the bottom to <strong>Zuma</strong>, eight miles up the coast, or <strong>Leo Carrillo</strong> further north. Both are Malibu-adjacent. Both have none of this. Zuma is sand, with everything sand implies — shifting banks, closeouts, the short-period peaky surf that rewards a shortboard and a thick wetsuit. First Point&rsquo;s cobble is the opposite: a smooth bed, a predictable refraction, a bottom that does not reconfigure itself with every swell. When the south swell meets cobble it bends the same way it bent last August and the August before. <em>The wave remembers its own shape because the bottom does not move week to week.</em> That reliability is the reason Bob Simmons could design a board in 1947 specifically for this wave.
            </p>
            <p className={BODY}>
              The cobblestone moves, but on geological time. In the winter of 1982–83 an El Niño of historic violence rearranged the stones. Locals who surfed the point before and after say the wave changed — the inside section tightened, the shoulder grew slightly faster across one stretch, the pocket moved a few yards. Ask a regular who started in the seventies and the conversation will eventually divide into &ldquo;before &rsquo;83&rdquo; and &ldquo;after &rsquo;83&rdquo; the way historians talk about pre-Cambrian and Cambrian.
            </p>
            <p className={BODY}>
              The <strong>2013 Malibu Lagoon Restoration Project</strong> — completed after a multi-year fight that pitted water-quality advocates against surfers watching bulldozers yards from the break — re-engineered the lagoon, the creek mouth channels, the marsh hydrology. It did not touch the cobblestone. The ramp that makes the wave is older than any argument about it, and the restoration, for all its contention, left the rocks alone.
            </p>
          </div>
          {coastline && (
            <Figure
              image={coastline}
              size="inline"
              caption="The Malibu coast from above. The cobblestone shelf that makes First Point runs along the headland at the creek mouth."
            />
          )}
        </div>
      </Section>

      {/* South swell window */}
      <Section id="south-swell" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· South-swell window"
          title="Seven thousand miles, ten to fourteen days, one clean morning"
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] items-start">
          {lineup && (
            <Figure
              image={lineup}
              size="inline"
              caption="A perfect summer dawn, minutes up the coast from First Point. Morning offshore, water glass, the first longboarder paddling out."
            />
          )}
          <div className="space-y-6">
            <p className={BODY}>
              First Point wants a south swell. <strong>April through October</strong>, the Southern Hemisphere&rsquo;s winter storms — deep low-pressure systems spinning off New Zealand, pinwheeling across the Tasman, marching up from the Ross Sea and the edge of the Antarctic ice — push energy north across the Pacific. A swell generated south of New Zealand will travel something like seven thousand miles to reach Malibu. It will take roughly ten to fourteen days. It arrives smoothed, sorted, long-period: the ocean&rsquo;s equivalent of a long vowel held until it rings.
            </p>
            <p className={BODY}>
              The forecast lines every Malibu regular has memorized read the same. <strong>Three to six feet. Sixteen to eighteen second period. 180–200° direction. Morning offshore. Light south wind filling in by late morning.</strong> The southwest quadrant of the swell window threads past Point Conception and Point Dume and meets the cobblestone at the exact angle the ramp was built to receive. Second Point needs a little more size to connect. Third Point needs more still. But First Point will take a shoulder-high southwest and translate it into a ride that runs long enough for the trim to matter.
            </p>
            <p className={BODY}>
              The offshore is gift geography. The Santa Monica Mountains rise immediately behind the beach and block the prevailing afternoon onshore flow for most of the morning. A summer dawn at Malibu has the mountains still cool, the water still glass, the air pushing gently off the land until the thermal gradient flips and the westerly fills. The window from first light to roughly 11am is the window everyone is paddling for.
            </p>
            <p className={`${BODY} italic`}>
              A perfect summer dawn at First Point is an easy thing to describe and a harder one to earn. The rock is where you sit. The glass is where you sit on. The pelicans fly a line so low the wing tips touch the back of the swell. The first longboarder of the morning paddles out from the lagoon side with a white board under one arm and a ponytail trailing, and he does not look at you, and he does not need to.
            </p>
          </div>
        </div>
      </Section>

      {/* Longboard canon */}
      <Section id="longboard-canon" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· The longboard canon"
          title="The wave dictates the craft"
          kicker="Simmons, Quigg, Kivlin, Velzy, Jacobs, Weber, Carson, Munoz, Dora — a named lineage of shapers and stylists who iterated against the same peeling right for eighty years."
        />

        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] items-start">
          <div className="space-y-6">
            <p className={BODY}>
              In <strong>1947</strong> Bob Simmons — Caltech-trained, one-armed, a mathematician about boards more than an artist — began shaping lighter balsa craft in collaboration with <strong>Joe Quigg</strong> and <strong>Matt Kivlin</strong> that could actually work the slow peel at First Point. The older redwood planks from the twenties and thirties were too heavy, too unresponsive, too committed to their own straight lines for a wave that asked a rider to walk the deck and re-find the pocket three times across a ride. What Simmons, Quigg, and Kivlin produced — collectively, iteratively, over the late forties and early fifties — became known as the <strong>Malibu chip</strong>. It was lighter. It was more maneuverable. It was shaped for this wave.
            </p>
            <p className={BODY}>
              Through the fifties the design refined in shops up and down the coast. <strong>Dale Velzy</strong> — the first man to open a surf shop as a commercial storefront, in Manhattan Beach in 1949 — shaped for Malibu. <strong>Hap Jacobs</strong> shaped for Malibu. <strong>Dewey Weber</strong>, the former Buster Brown child model who became the first surfer to brand his own boards as consumer products, earned the nickname <em>Little Man on Wheels</em> at First Point and took the Malibu peel as his design reference. Each shaper iterated against the same wave. &ldquo;Malibu board&rdquo; became a shaper&rsquo;s term of art — it still is, in 2026, in shops from Encinitas to Ericeira.
            </p>
            <p className={BODY}>
              The riding evolved in parallel. <strong>Lance Carson</strong>&rsquo;s trim — the relaxed, upright posture, the hand trailing just off the rail, the hang-five that feels like a pause rather than a maneuver — became the visual vocabulary for what a longboarder is supposed to look like. Every longboarder since, in every country, is in conversation with Carson whether they know it or not. <strong>Mickey Munoz</strong>, five-foot-four, invented the <em>Quasimodo</em> (crouched, one arm forward, the inside of a barrel mimed on a wave that had no barrel to speak of) and the <em>El Spontaneo</em> at this wave. <strong>Miki Dora</strong> rode First Point as if the rest of the world had never invented effort — the cat on a hot foamed roof, as the old description goes, unhurried, flowing, making the wave look like an accompaniment to his own decisions rather than a force that required responding to.
            </p>
            <p className={BODY}>
              The shortboard revolution of the late sixties briefly broke the canon. Longboards disappeared from beaches for most of the seventies. But the wave kept peeling, and in the nineties the longboard returned, and when it returned First Point was still the reference. <strong>Joel Tudor</strong> rode it with a reverence that verged on re-enactment. Tyler Warren, Kassia Meador, Alex Knost — the modern log crew — paddled out at Malibu not because it offered the best wave of any given day but because surfing a nine-six at First Point is a <em>pilgrimage</em>. It is where the template was written. Every serious longboarder eventually arrives.
            </p>
          </div>
          {longboard && (
            <Figure
              image={longboard}
              size="inline"
              caption="Trim, hand off the rail, the hang-five as pause rather than maneuver. The visual vocabulary Lance Carson set at First Point in the early 1960s is still the template."
            />
          )}
        </div>
      </Section>

      {/* Contest history */}
      <Section id="contests" className={PAPER}>
        <SectionHeader
          eyebrow="· The three points contest history"
          title="1963, 1967, 2010 — three moments that organized the canon"
        />

        <p className={`${BODY} mb-6`}>
          The <strong>Malibu Invitational</strong> began in 1963. Lance Carson, Miki Dora, Mike Doyle, Johnny Fain — the Little Prince of Malibu, wiry, seventeen, already Dora&rsquo;s principal rival — traded First Point on contest day in front of judges sitting in beach chairs on the sand. The point had been a performance venue informally for a decade, but 1963 marked the moment the performance was formalized: scored, ranked, awarded.
        </p>
        <p className={`${BODY} mb-6`}>
          In <strong>1967</strong>, during the Malibu Invitational, Dora rode a wave and midway through dropped his trunks. The gesture was not a stunt in the modern sense. It was a thesis. Dora&rsquo;s reading of what was happening to the beach — the contest-ification, the commodification, the arrival of Gidget&rsquo;s long tail as consumer surf culture — condensed into one act on one wave. The gesture became founding scripture for surf anti-commercialism. Formal contests at Malibu largely absented themselves for the following decade. The <strong>Malibu Surfing Association</strong>, founded in 1961 and still the organizing body of the local scene today, carried the contest tradition forward in a lower-key register — club events, a longstanding Call-to-the-Wall format, an institutional memory that predates most of the spectators.
        </p>
        <p className={BODY}>
          The bigger recognition arrived in <strong>2010</strong>. The Save The Waves Coalition designated Surfrider Beach — the First, Second, and Third Points collectively — as the world&rsquo;s first <strong>World Surfing Reserve</strong>. The designation is not a zoning instrument. It has no legal teeth. What it has is heritage: a formal declaration that this mile of coast and the wave it produces belong to the cultural record of surfing the way Cooperstown belongs to baseball. The plaque at the lagoon side of the parking lot is the only sign most visitors will notice. It is enough.
        </p>
      </Section>

      {/* What it feels like now — WRY shift */}
      <Section id="now" className={COOL}>
        <SectionHeader
          eyebrow="· What it feels like now"
          title="The lineup reflects every year of eighty"
        />

        <p className={`${BODY} mb-6`}>
          Here is the honest look. On a clean summer morning in 2026, First Point will hold roughly fifty to seventy surfers in the water at the peak of the south-swell tide. The wave can politely accommodate about ten. The math does not reconcile and never will. What you see from the bluff above the pier looks less like a lineup and more like a <em>freeway merge</em>: a dense, slow-moving traffic jam of bodies on logs, every wave peeled upon by three or four riders at once, shoulder-hopping in a format Miki Dora would have recognized and complained about with the same words he used in 1967.
        </p>
        <p className={`${BODY} mb-6`}>
          The etiquette is specific and unwritten. The priority comes from the rock — the person deepest and closest to the peak has the wave. The priority is also sometimes ignored. Mid-wave drop-ins, Dora&rsquo;s unhappy inheritance, are a negotiation rather than a violation. Regulars who have surfed the point for thirty years have the deference that comes with longevity. Visitors who do not know this arrive at First Point the way tourists arrive at any sacred site — respectfully, hopefully, slightly wrong in posture — and are corrected by the water itself within about twenty minutes.
        </p>
        <p className={`${BODY} mb-6`}>
          The serious longboard crew, the riders who have spent years watching the point, know when to leave. When First Point is a carnival, Third Point on a bigger south will often be carrying three surfers instead of thirty. Point Dume further north, County Line up at the Ventura border, El Porto down toward the South Bay — each is a release valve. The wave remains the wave. But the lineup reflects every year of the eighty since Simmons and Quigg and Kivlin first shaped for it, and in 2026 the weight of those eighty years is a physical thing you paddle through.
        </p>
        <p className={`${BODY} italic`}>
          The honest advice, if you want to actually surf First Point and not merely be in the ocean at Malibu: arrive at first light on a weekday in mid-May or late September, bring a nine-six that you know how to walk, and bring an ego sized for the people who were here before you.
        </p>
      </Section>

      {/* How to visit */}
      <Section id="visit" className={PAPER}>
        <SectionHeader
          eyebrow="· How to visit respectfully"
          title="Park at the lagoon, do not walk the Colony side"
        />

        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] items-start">
          <div className="space-y-6">
            <p className={BODY}>
              Park in the <strong>Malibu Lagoon State Park lot</strong> — the one on the lagoon side, signed from PCH — for twelve to fifteen dollars depending on season. Metered spaces on Pacific Coast Highway above the break work if the lot is full; read the tow signs. The best viewing bench is on the bluff above the break just south of the Adamson House, looking down-coast toward the pier. The <strong>Adamson House</strong> itself, the Rindge-Adamson family&rsquo;s 1929 Malibu-Potteries-tiled landmark, operates as a California State Historic Monument and is the cheapest history lesson on the entire coast. Tours run most days; the docents know more than most books.
            </p>
            <p className={BODY}>
              <strong>Do not walk the Colony side.</strong> The fence line west of Third Point is the Malibu Colony&rsquo;s private boundary and the enforcement on it is real. Dogs are not permitted on the State Beach. Trash goes in with you and out with you — the lagoon&rsquo;s tidewater goby and steelhead populations are actively endangered and the State Park staff are not merely nagging.
            </p>
            <p className={BODY}>
              The <strong>Surfrider Foundation&rsquo;s Malibu chapter</strong> runs beach cleanups most months; check surfrider.org/malibu for the current schedule. <strong>Do not surf within seventy-two hours of rain.</strong> The bacterial load in the creek after storm flow is measurable, severe, and the reason Heal the Bay&rsquo;s annual Beach Bummer report has historically ranked Surfrider among California&rsquo;s worst. The stomach illness is not hypothetical.
            </p>
            <ClusterAside label="Go deeper">
              For the water-quality fight itself — the Surfrider Foundation&rsquo;s founding, the lagoon restoration, the decades of litigation that grew the Clean Water Act&rsquo;s teeth — see the <ClusterLink to="surfrider-foundation" />.
              For the 2,000-year Chumash history buried under the parking lot you just drove into, see the <ClusterLink to="humaliwo" />.
              First Point is the wave. It is also a place with people in it, and under it, and before it.
            </ClusterAside>
          </div>
          {adamson && (
            <Figure
              image={adamson}
              size="inline"
              caption="The Adamson House, 1929. The cheapest history lesson on the entire coast."
            />
          )}
        </div>
      </Section>

      <SpokeCrossNav current="first-point" />
      <SpokeProvenance
        bundle={bundle}
        note="Wave mechanics and cobblestone geology from published surf-science references and Malibu Creek watershed hydrology studies. Longboard canon from Matt Warshaw's Encyclopedia of Surfing and History of Surfing, and from Joel Tudor/Malibu Surfing Association oral histories."
      />
    </LegendaryShell>
  );
}
