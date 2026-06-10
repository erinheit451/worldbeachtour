/**
 * Malibu → Gidget (deep-dive spoke).
 *
 * WRY primary — knowing, affectionate, unsentimental. The story is
 * genuinely charming AND the reason First Point is over-crowded now.
 * Both are true.
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

export default function MalibuGidgetPage({ bundle }: { bundle: LegendaryPageBundle }) {
  const { composition, meta } = bundle;
  const hero = pickImage(meta, "coastline_air") ?? meta.images.hero;
  const pier = pickImage(meta, "pier_sunset");
  const lineup = pickImage(meta, "surfer_lineup");
  const adamson = pickImage(meta, "adamson_house");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="gidget" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Gidget"
        title={`How a 5'1" teenager accidentally sold Malibu to the world`}
        kicker="The cultural explosion 1956–1975: Kathy Kohner's summer notebooks, her Austrian-émigré father's novel, Sandra Dee, the Beach Boys, and The Endless Summer — one continuous sales pitch that has not stopped."
        image={hero}
      />

      {/* Opener */}
      <Section id="opener" className={PAPER}>
        <div className={`${EYEBROW} mb-4`}>· Summer 1956</div>
        <p className={`${BODY} mb-6`}>
          In the summer of 1956, a fifteen-year-old from Brentwood started showing up at a stretch of sand north of Malibu Pier. Her name was <strong>Kathy Kohner</strong>. She was five foot one, curly-haired, Jewish, and not a stereotypical California blonde. <strong>Terry Tracy</strong> — everyone called him Tubesteak — looked at her the first afternoon she paddled out and nicknamed her <em>Gidget</em>, a portmanteau of <em>girl</em> and <em>midget</em>. She liked the name. She kept coming back.
        </p>
        <p className={`${BODY} mb-6`}>
          Kathy was a diarist the way some fifteen-year-olds are diarists: compulsively, in looping handwriting, in notebooks she left on the kitchen table. She wrote down what Tubesteak said. She wrote down what Moondoggie said. She wrote down who rode what wave and who was dating whom and which of the older boys was too full of himself and which was actually nice. She wrote down the slang. She did not imagine anyone reading it.
        </p>
        <p className={`${BODY} mb-6`}>
          Her father was <strong>Frederick Kohner</strong>. He was an Austrian-Jewish screenwriter who had fled the Nazis in 1938, landed in Hollywood, earned an Oscar nomination for <em>Mad About Music</em> that same year, and by the summer of 1956 was a working professional in his early fifties looking for the next project. He picked up one of the notebooks. He read it. Then he read the rest.
        </p>
        <p className={BODY}>
          What he did next changed surfing forever, and changed Malibu immediately and permanently. This is the story of how a mile of California sand became a global brand, told by way of a teenage girl who did not know she was being turned into a novel.
        </p>
      </Section>

      {/* The shack */}
      <Section id="shack" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Kathy and the shack"
          title="A thatched hut on First Point and the arrangement that became a novel"
        />

        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] items-start">
          <div className="space-y-6">
            <p className={BODY}>
              The Malibu of 1956 was a provincial break. Maybe thirty regulars on a good summer day. A <strong>grass shack</strong> at First Point — a literal thatched structure, built by Tubesteak and whoever felt like nailing a palm frond to a two-by-four, on the sand just up from the water — functioned as clubhouse, storage locker, and social headquarters. If you were in, you hung out there. If you were out, you didn&rsquo;t.
            </p>
            <p className={BODY}>
              Kathy was, technically, out. She was a teenage girl in a scene of men in their twenties. But she was persistent, earnest, funny, and she wanted to learn to surf, and one of the younger regulars — <strong>Bill Jensen</strong>, the real Moondoggie — lent her a board. Tubesteak tolerated her. The Kahuna — in the novel a single majestic figure, in life a composite of several older itinerant surfers who drifted through the point — tolerated her. <strong>Miki Dora</strong>, already the most-watched stylist on the wave at twenty-two, flickered around the edges of her summer and did not quite acknowledge her, which in Dora&rsquo;s case counted as acceptance.
            </p>
            <p className={BODY}>
              What she was actually doing out there was what every beginner does at First Point: getting pushed into soft peeling shoulders, standing up late, falling off, paddling back. The wave is famously forgiving. She was learning. She was also absorbing a vocabulary. <em>Bitchin&rsquo;. Woody. Tube. The Kahuna. Hang five. Going over the falls.</em> She wrote it all down. She did not think of herself as a reporter. She thought of herself as a teenager having the single best summer of her life in a place where adults had built a thatched hut and named her after her height.
            </p>
            <p className={BODY}>
              The arrangement the novel would later sentimentalize — the lone girl as mascot and little sister, tolerated, teased, gently protected — was the actual arrangement, as far as she was concerned. She would say so for the next seventy years. She wasn&rsquo;t being exploited. She wasn&rsquo;t suffering. She was having the time of her life among people she adored. What she would object to, eventually and mildly, was a specific thing: her father should have asked. He didn&rsquo;t ask. He just wrote it down.
            </p>
          </div>
          {lineup && (
            <Figure
              image={lineup}
              size="inline"
              caption="A surfer at Point Dume — the kind of California dawn Kathy Kohner was paddling into in the summers of 1956–59. The shack itself is long gone; a few storm winters took care of it."
            />
          )}
        </div>
      </Section>

      {/* Frederick Kohner */}
      <Section id="frederick" className={PAPER}>
        <SectionHeader
          eyebrow="· Frederick Kohner and the novel"
          title="An Austrian émigré ventriloquizing a California teenage girl"
        />

        <p className={`${BODY} mb-6`}>
          Frederick Kohner&rsquo;s biography matters to this story because the book he wrote could not have been written by a Californian. He was born in <strong>1905 in Teplitz</strong>, in what is now the Czech Republic, into a Jewish family. He got a doctorate in philology from the University of Vienna. He worked as a film critic and screenwriter in Berlin and Paris in the 1920s and 1930s, and in <strong>1938</strong>, with the world closing, he and his brother Paul got out to Hollywood. <em>The family that did not get out did not survive.</em> By 1938 he had an Oscar nomination in his first American year, for <em>Mad About Music</em>. He spent the next two decades as a working studio screenwriter, the kind whose credits are real but whose name is not a household one.
        </p>
        <p className={`${BODY} mb-6`}>
          By 1957 he was looking for a novel idea. He picked up Kathy&rsquo;s notebook. He read the slang. He read the scenes — Tubesteak at the shack, Moondoggie on a wave, the Kahuna dispensing wisdom, Gidget between them trying to keep up. He sat down and wrote <strong>&ldquo;Gidget: The Little Girl with Big Ideas&rdquo;</strong> in a blur that various accounts put at six weeks. Putnam published it in 1957. It sold <strong>two million copies</strong> almost immediately and was eventually translated into something like forty languages.
        </p>
        <p className={`${BODY} mb-6`}>
          The tone of the book is the thing that matters. Kohner wrote it in the first person, in Kathy&rsquo;s voice, using the slang he had mined from her notebooks. A fifty-two-year-old European immigrant, a survivor of the Nazi catastrophe, ventriloquizing a California teenage girl&rsquo;s voice by reading her summer diaries is, to put it plainly, one of the stranger literary arrangements of the twentieth century. It shouldn&rsquo;t have worked. It worked completely.
        </p>
        <p className={BODY}>
          What Kohner heard in the notebooks, and what he rendered in the novel, was an argument dressed as a story: that surfing was not just what the men were doing. <em>It was also what the girl watching them was doing.</em> It was a teenage girl&rsquo;s coming-of-age story as much as a surfer&rsquo;s story, and that frame — the girl on the beach, wanting in — was the frame that detonated the culture. Every surfer his age saw the wave. Kohner saw the whole beach, including the kid on it. That was the insight. That was what he put in the book. That was what sold two million copies.
        </p>
      </Section>

      {/* 1959 film */}
      <Section id="film" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· The 1959 film and Sandra Dee"
          title="Mickey Munoz in a wig, hang-fiving Sandra Dee's stunt work"
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] items-start">
          {adamson && (
            <Figure
              image={adamson}
              size="inline"
              caption="Adamson House. On the bluff above First Point, a small Gidget display lives among the California-history exhibits."
            />
          )}
          <div className="space-y-6">
            <p className={BODY}>
              Columbia Pictures bought the rights more or less immediately. <strong>&ldquo;Gidget&rdquo; (1959)</strong>, directed by Paul Wendkos, came out with <strong>Sandra Dee</strong> as the lead, James Darren as Moondoggie, and Cliff Robertson as the Big Kahuna. It was a hit. It launched three careers. It cemented Dee as the emblematic clean-cut American ingenue of her generation and made James Darren a teen-magazine face.
            </p>
            <p className={BODY}>
              The surfing, of course, was not Sandra Dee. Sandra Dee did not surf. The surfing was doubled. James Darren&rsquo;s board work was done by <strong>Miki Dora</strong>, who was already a Malibu fixture and who — in one of the more unlikely consulting arrangements in film history — showed up to the set to do the hard riding and kept quiet about it for the paycheck. Sandra Dee&rsquo;s surfing was doubled by <strong>Mickey Munoz</strong>, five feet four inches of goofyfoot waterman, <em>in a wig and a one-piece swimsuit</em>, hang-fiving across First Point in convincing imitation of a teenage girl. The image — Munoz in full drag, pulling off a clean nose ride while the camera boat tracks alongside — is one of the great visuals of the longboard era, and it deserves to live in anyone&rsquo;s memory of what Malibu actually was in 1959: a community small enough that the best stylists in the world would cheerfully wig up for a studio paycheck.
            </p>
            <p className={BODY}>
              The film spawned sequels. <em>Gidget Goes Hawaiian</em> (1961) with Deborah Walley. <em>Gidget Goes to Rome</em> (1963) with Cindy Carol. Then in <strong>1965</strong> ABC launched the <em>Gidget</em> television series, with a nineteen-year-old <strong>Sally Field</strong> in the title role — her first starring credit. The show ran a single season, was canceled, and became a syndication touchstone watched by roughly every American teenager in the late sixties.
            </p>
            <p className={BODY}>
              By 1965, Gidget was an American institution. Malibu was the name Americans associated with the word &ldquo;surfing,&rdquo; full stop, whether or not they had ever seen a wave, whether or not they lived within a thousand miles of salt water.
            </p>
          </div>
        </div>
      </Section>

      {/* Beach Boys / Endless Summer */}
      <Section id="music-and-endless" className={PAPER}>
        <SectionHeader
          eyebrow="· Beach Boys, Jan &amp; Dean, Endless Summer"
          title="A Hawthorne garage band selling surf culture back to a country that had no way of checking"
        />

        <p className={`${BODY} mb-6`}>
          The music track was running in parallel. In <strong>1961</strong>, in a garage in Hawthorne — fifteen miles inland, worth stating — Brian Wilson and his brothers and a cousin and a friend recorded a song called &ldquo;Surfin&rsquo;.&rdquo; <em>Not one of them surfed.</em> Dennis Wilson, the drummer, would eventually learn; the rest of them didn&rsquo;t bother. &ldquo;Surfin&rsquo;&rdquo; was followed in 1962 by &ldquo;Surfin&rsquo; Safari,&rdquo; which name-checked Malibu in the lyrics. &ldquo;Surfin&rsquo; U.S.A.&rdquo; arrived in 1963 and was essentially a rhymed inventory of California breaks, with Malibu at the top of the list.
        </p>
        <p className={`${BODY} mb-6`}>
          <strong>Jan and Dean</strong> — Jan Berry and Dean Torrence, also non-surfers, also from the Los Angeles inland suburbs — picked up the thread. &ldquo;Surf City&rdquo; in 1963, &ldquo;Ride the Wild Surf&rdquo; in 1964. The two defining surf-vocal acts of the early sixties were both Southern California garage products who did not surf, selling the idea of surf culture back to a country that had no way of checking whether the idea was accurate. It was, as commercial packaging, a triumph. It was also, as reportage, a fabrication. A benign one, but a fabrication.
        </p>
        <p className={`${BODY} mb-6`}>
          The corrective was happening in a different medium. <strong>Bruce Brown</strong>, who actually did surf, was making films — <em>Slippery When Wet</em> in 1958, <em>Barefoot Adventure</em> in 1960, a string of rented-hall travelogues that screened in high school auditoriums for audiences of a few hundred at a time. In <strong>1966</strong> he finished <em>The Endless Summer</em>, expanded it, four-walled it into a theatrical run, and watched it become a genuine crossover hit. It made real money. Critics took it seriously. For most non-surfers it was the first film about surfing they had ever seen that was actually about surfing.
        </p>
        <p className={BODY}>
          <em>The Endless Summer</em> footage kept coming back to Malibu. First Point was the home wave against which every foreign break in the film — Cape St. Francis, Pipeline, Mozambique — was implicitly measured. The pipeline was now complete. Gidget had given Malibu a story. The Beach Boys had given Malibu a song. <em>The Endless Summer</em> had given Malibu a documentary. By 1966, First Point was the reference point. If you surfed anywhere on earth and wanted to describe a long right-hander peeling off a cobblestone point, the shorthand was Malibu, and everyone knew what you meant, because they had all been watching the same film.
        </p>
      </Section>

      {/* What the wave was worth */}
      <Section id="what-it-cost" className={COOL}>
        <SectionHeader
          eyebrow="· What the wave was worth"
          title="A sequence of events, not a moral claim"
        />

        <p className={`${BODY} mb-6`}>
          The cost of all this is the thing the page has to look at honestly, because the page is being written in 2026 and the consequence is not an abstraction. Before 1957, First Point was a locals&rsquo; wave with maybe thirty regulars on a strong summer day. By 1965, it was crowded. By 1975, it was famously crowded. By 1985, it was the joke. By 2026, the crowd is the defining feature of the lineup.
        </p>
        <p className={`${BODY} mb-6`}>
          Every single one of those people is a downstream consequence of Frederick Kohner picking up his daughter&rsquo;s notebooks in 1957.
        </p>
        <p className={`${BODY} mb-6`}>
          That is not a moral claim. It is a sequence of events. Kohner reads the notebooks. The book sells two million copies. Columbia makes the film. Sandra Dee rides a wave that Mickey Munoz is actually riding. Brian Wilson, who has never surfed, writes &ldquo;Surfin&rsquo; U.S.A.&rdquo; and lists Malibu. Bruce Brown puts First Point in <em>The Endless Summer</em>. A kid in Nebraska decides he wants to learn to surf. He grows up. He moves to Los Angeles. He buys a longboard. He drives to Malibu. He paddles out. <em>He is in your way.</em>
        </p>
        <p className={`${BODY} mb-6`}>
          <strong>Miki Dora</strong>, who saw all of this happening in real time and hated all of it, spent the rest of his life screaming about it, variously with trunks-dropping, fistfights, contempt, and eventual flight to Europe on fraud warrants. He was not wrong about the phenomenon. He was also, visibly, part of the phenomenon — he was the stylist the photographs were of, he was the face in the magazines, he was the mystique.
        </p>
        <p className={`${BODY} mb-6`}>
          <strong>Kathy Kohner Zuckerman</strong>, the actual Gidget, took the other path. She is, at eighty-five, a gracious and cheerful woman. She has given hundreds of interviews — NPR, the LA Times, the New Yorker. There is a 2010 documentary, <em>Accidental Icon: The Real Gidget Story</em>, which is the best version of this history because it is told by the woman the history is about. She shows up at Malibu. She signs books. She is polite to people who approach her. She has said, many times and without apparent bitterness, that her father should have asked her first.
        </p>
        <p className={`${BODY} italic`}>
          Whether the whole thing is a tragedy or a comedy depends on where you are standing. If you are a teenage girl in 1957 whose father wrote down your summer and sold it to the world, it is probably a comedy. If you are in the water at First Point on a Saturday in July 2026, waiting for a wave behind seventy other people, it is probably a tragedy. Both are true. The beach contains both.
        </p>
      </Section>

      {/* Where to see Gidget now */}
      <Section id="where-now" className={PAPER}>
        <SectionHeader
          eyebrow="· Where to see Gidget now"
          title="Streaming, the Adamson House, and the hostess stand at Duke's"
        />

        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] items-start">
          <div className="space-y-6">
            <p className={BODY}>
              The 1959 film is streamable on the usual services and turns up on TCM regularly. It holds up better than it has any right to, mostly because of the surfing footage and because Sandra Dee is genuinely charming. Kohner&rsquo;s novel is in print in a Berkeley edition with a useful introduction; it reads fast and is, as a historical document, surprisingly sharp.
            </p>
            <p className={BODY}>
              <em>Accidental Icon: The Real Gidget Story</em> (2010) is the documentary to watch. It is Kathy Kohner Zuckerman&rsquo;s version, in her own words, and it corrects several of the myths in its own offhand way.
            </p>
            <p className={BODY}>
              The <strong>Adamson House</strong>, on the bluff just above First Point, keeps a small Gidget display among its California-history exhibits. The <strong>Malibu Historical Society</strong> runs occasional walking tours that take in First Point and the site of the original shack, though the shack itself has been gone for more than half a century — a few storm winters took care of it.
            </p>
            <p className={BODY}>
              Kathy Kohner Zuckerman herself worked for decades as a greeter and hostess at <strong>Duke&rsquo;s Malibu</strong>, the restaurant on the Pacific Coast Highway just north of the pier, and occasionally still turns up there. If you want to meet the woman who accidentally sold Malibu to the world, she has not been difficult to find. She has been standing at the hostess stand, under a painting of Duke Kahanamoku, greeting tourists by name. She has always been gracious about it. <em>That part, at least, is not a tragedy.</em>
            </p>
          </div>
          {pier && (
            <Figure
              image={pier}
              size="inline"
              caption="Malibu Pier at sunset. The Duke's Malibu deck is immediately north of this frame."
            />
          )}
        </div>
      </Section>

      <SpokeCrossNav current="gidget" />
      <SpokeProvenance
        bundle={bundle}
        note="Source material: Frederick Kohner, 'Gidget: The Little Girl with Big Ideas' (Putnam, 1957); Kathy Kohner Zuckerman interviews (NPR Fresh Air 2009, LA Times archival); 'Accidental Icon: The Real Gidget Story' (dir. Brian Gillogly, 2010); Matt Warshaw, 'Encyclopedia of Surfing' Kohner/Tracy/Dora entries; Bruce Brown distribution records for 'The Endless Summer.' Corrections welcome, particularly on Mickey Munoz wig-and-board-work contemporaneous accounts and on Malibu Surfing Association institutional memory."
      />
    </LegendaryShell>
  );
}
