/**
 * Waikīkī → Learning to Surf (Surf spoke). Standalone page.
 *
 * The beach the world learns to surf on. First-timer register, not
 * expert. Thematic companion to the Duke section on main — you are being
 * taught by a lineal descendant of a specific Hawaiian tradition.
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

export default function WaikikiSurfPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta } = bundle;
  const heroImage =
    pickImage(meta, "canoes_waikiki") ??
    pickImage(meta, "duke_statue") ??
    meta.images.hero;

  const canoesPainting = pickImage(meta, "canoe_surfing_painting");
  const duke1920s = pickImage(meta, "duke_1920s");

  return (
    <LegendaryShell composition={composition}>
      <ClusterRail current="surf" beachName={composition.beach_name} />

      <SpokeHero
        eyebrow="· Learning to Surf"
        title="The first wave of the rest of your life"
        kicker="A two-hour lesson at Waikīkī is the most common first encounter with the sport of surfing on Earth. You will be taught by a Hawaiian waterman whose occupation is older than the hotel you are staying at. Don't waste the lesson."
        image={heroImage}
      />

      {/* --- Why Waikīkī --- */}
      <Section id="why" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Why Waikīkī"
          title="Why this specific beach is the world's first-lesson beach"
          kicker="Every factor that makes Nazaré the planet's most dangerous wave (deep water, steep face, cold, big, fast) is reversed at Waikīkī. It is the beginner-friendly edge case in the surfing world, and it has been for a hundred years."
        />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6">
            <p className={BODY}>
              Waikīkī's surf is produced by Pacific swells refracting
              around the east (Diamond Head) and west (Barbers Point)
              ends of Oʻahu before breaking over a <strong>shallow coral
              reef shelf</strong> that extends 200–400 meters offshore.
              The geometry does four beginner-friendly things at once:
            </p>
            <ul className={`${BODY} list-disc pl-6 space-y-3`}>
              <li>
                <strong>Waves are small year-round</strong> — 1 to 3 feet
                most days, 4–6 feet on the biggest south-swell summer
                days. Compared to the North Shore's 15–30 foot winter
                waves, Waikīkī is a different ocean.
              </li>
              <li>
                <strong>The waves are long and slow</strong> — a single
                wave at Canoes can produce a 15-second ride, enough time
                for a first-time surfer to pop up, find their balance,
                and fall off gracefully.
              </li>
              <li>
                <strong>The water is warm</strong> — 23 °C winter to 27 °C
                summer. No wetsuit required at any point in the year;
                shorts or a swimsuit and a rash guard is the right kit.
              </li>
              <li>
                <strong>The paddle-out is easy</strong> — shallow water
                off the beach, no rocks, no currents worth mentioning in
                the beginner zones. You can walk your board out to
                waist-deep water and start from there.
              </li>
            </ul>
            <p className={BODY}>
              The combination means that a first-time surfer at Waikīkī
              has <strong>a reasonable chance of standing up on their
              first wave</strong>. At most surf beaches in the world,
              that's impossible — the wave is too fast, too short, or too
              hollow for a beginner's pop-up. Waikīkī forgives.
            </p>
          </div>

          <aside className="lg:sticky lg:top-24 rounded-sm border border-[#CBD5E1] bg-white p-7">
            <div className={`${EYEBROW} mb-5`}>· First-Lesson Conditions</div>
            <dl className="space-y-5">
              <Fact label="Typical wave size" value="1–3 ft" />
              <Fact label="Water temperature" value="23–27 °C" />
              <Fact label="Wetsuit needed" value="Never" />
              <Fact label="Paddle-out depth" value="Waist-deep" />
              <Fact label="Best beginner break" value="Canoes" />
              <Fact label="Ride length (avg)" value="10–15 s" />
              <Fact label="Surf schools on the strip" value="~40" />
              <Fact label="Continuous teaching since" value="~1910" />
            </dl>
          </aside>
        </div>
      </Section>

      {/* --- The beginner breaks --- */}
      <Section id="breaks" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· Where the Lessons Happen"
          title="Four breaks where every first-timer starts"
          kicker="Waikīkī has ten named surf breaks along its two-mile reef. Four of them are where every beginner surf school takes every first-lesson student, every day of the year."
        />

        <div className="grid gap-8 md:grid-cols-2">
          <BreakCard
            name="Canoes"
            who="The default beginner break"
            body="The long, slow wave directly in front of the Duke Kahanamoku statue on Kūhiō Beach. Named for the outrigger canoes that ride it daily. 1–3 ft, long rides, very forgiving. This is where 80% of first lessons happen."
          />
          <BreakCard
            name="Queen's"
            who="Slightly more advanced beginner / early intermediate"
            body="Directly next to Canoes, to the ʻEwa (west) side. Named for Queen Liliʻuokalani, whose beach house stood at the shoreline before the Waikīkī Wall was built. Faster wave, steeper take-off, second-lesson territory."
          />
          <BreakCard
            name="Pops / Publics"
            who="Uncrowded beginner"
            body="In front of the Halekulani / Gray's Beach stretch. Slightly further paddle-out than Canoes. Less crowded because the surf schools mostly stay east at Canoes. A quieter option for a second or third session."
          />
          <BreakCard
            name="Walls"
            who="Absolute beginner / body-boarding"
            body="The shorebreak at Kūhiō Beach against the concrete Waikīkī Wall. Calmer than the outside breaks because the Wall blocks larger waves. Kids bodyboard here; surf schools use it for the absolute-first-wave lesson before paddling out to Canoes."
          />
        </div>

        {canoesPainting && (
          <Figure
            image={canoesPainting}
            size="wide"
            tier="B"
            datePrefix="ca. 1890"
            caption="D. Howard Hitchcock — 'Canoe Surfing, Waikiki.' The outrigger canoes in this painting are still being ridden daily on the same wave, by crews launching from the same stretch of sand, 130+ years later."
            className="mt-10"
          />
        )}
      </Section>

      {/* --- Choosing a school --- */}
      <Section id="school" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· Choosing a School"
          title="How to pick a surf school — and the questions most first-timers don't ask"
          kicker="There are roughly forty surf schools operating along Waikīkī. Their price range is tight ($75–150 for a group lesson; $125–250 for private). The thing that varies is quality of instruction."
        />

        <div className="space-y-6 max-w-3xl">
          <h3 className={H3}>What a reputable school looks like</h3>
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>
              <strong>Instructor-to-student ratio of 1:3 or better</strong> for
              group lessons. Anything over 1:4 means the instructor
              can't actually watch you in the water. If the school quotes
              "up to 6 students per instructor," walk away.
            </li>
            <li>
              <strong>Soft-top foam boards</strong> — 9 feet for first
              lesson, 10+ for smaller adults, 8 feet for kids. Hard-top
              fiberglass boards are for your second lesson, not your
              first. They will cut you.
            </li>
            <li>
              <strong>On-sand instruction before the water</strong>.
              The first 15–20 minutes should be on the beach, practicing
              the pop-up on a stationary board. Schools that rush you
              into the water are optimizing for session volume, not your
              success.
            </li>
            <li>
              <strong>A Hawaiian or local instructor when possible</strong>.
              Most Waikīkī schools employ Hawaiian and locally-born
              instructors; the beach boys tradition runs through the
              whole industry. An instructor who grew up surfing this
              reef will teach you better than an instructor who came from
              the mainland three summers ago.
            </li>
            <li>
              <strong>Kamaʻāina rates if you qualify</strong>. Hawaiʻi
              residents and military get reduced rates; if you have a
              local ID, ask.
            </li>
          </ul>

          <h3 className={`${H3} mt-6`}>Questions worth asking before you book</h3>
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>"What's your ratio today?"</li>
            <li>"Is my instructor Hawaiian or local?"</li>
            <li>"Do you teach etiquette — priority rules, lineup respect?"</li>
            <li>"If I pop up on my first wave, will you get photos? Who owns them?"</li>
            <li>"What break will we be at?" (Expect Canoes for first lesson.)</li>
          </ul>

          <h3 className={`${H3} mt-6`}>Red flags</h3>
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>
              Hotel concierge pressure to book through a specific desk —
              the concierge may be on commission. Schools not listed with
              the hotel are often better.
            </li>
            <li>
              "Guaranteed to stand up" marketing. Good instruction
              maximises your chance; it doesn't guarantee. Schools that
              promise it are usually overloading groups.
            </li>
            <li>
              Kalākaua sidewalk hustlers offering lessons — they're
              almost always uncertified, uninsured, and working outside
              the Waikīkī Beach Services concessions. Avoid.
            </li>
          </ul>
        </div>
      </Section>

      {/* --- Your first lesson --- */}
      <Section id="lesson" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· The Lesson Itself"
          title="What a first lesson actually is, minute by minute"
          kicker="A two-hour slot. Fifteen minutes on the sand, ninety in the water, fifteen to debrief and shower. If it runs differently than this, ask why."
        />

        <div className="space-y-6 max-w-3xl">
          <LessonStep
            t="0–5 min"
            what="Greeting, waiver, gear fit"
            body="You meet your instructor, sign the liability waiver (yes, real; yes, you should read it), get fitted for a rash guard and a soft-top foam board that the school carries down for you."
          />
          <LessonStep
            t="5–20 min"
            what="On-sand instruction"
            body="The pop-up sequence on a stationary board on the sand: paddle position, push up, pull the front knee to the chest, plant both feet, stand, hands low. You will do this six to ten times on the sand before going in. If your instructor skips this step, remind them it's the point of the lesson."
          />
          <LessonStep
            t="20–45 min"
            what="Paddling out to the break"
            body="Walk with the board to the water, paddle lying flat (small strokes, rhythm), duck under the small inside waves as you go. At a beginner break like Canoes the paddle is 3–5 minutes in shallow water. Your instructor swims alongside."
          />
          <LessonStep
            t="45–105 min"
            what="Catching waves"
            body="Your instructor positions you, tells you which wave, gives you a push at the right moment. You paddle three strokes, pop up. On your first wave you will probably stand up — briefly — before falling. You will catch 8–12 waves in a 60-minute water session; most beginners stand on 3–5 of them."
          />
          <LessonStep
            t="105–120 min"
            what="Paddle in, debrief"
            body="Catch a last wave into the beach, walk the board back to the school's rack. The instructor tells you what you did well and what needs work. If photos were included, you collect the files. Tip the instructor $10–20 per person; this is standard."
          />
        </div>
      </Section>

      {/* --- Lineup etiquette --- */}
      <Section id="etiquette" className={COOL} width="wide">
        <SectionHeader
          eyebrow="· Lineup Etiquette"
          title="How to not be the tourist the locals roll their eyes at"
          kicker="The surf etiquette rules at Waikīkī are the same ones used in every surf break in the world. They are not optional. A first-time surfer who follows them gets welcomed; one who doesn't gets, at best, ignored."
        />

        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            Waikīkī is famously crowded. On a Saturday morning at Canoes
            you may be in the water with 60 other surfers and 4 outrigger
            canoes. The rules are what keep it from turning into
            collision chaos.
          </p>
          <h3 className={H3}>The priority rules</h3>
          <ol className={`${BODY} list-decimal pl-6 space-y-3`}>
            <li>
              <strong>The surfer closest to the peak has priority.</strong>{" "}
              When a wave breaks, the person closest to where the wave is
              peaking owns it. Everyone else gets out of the way.
            </li>
            <li>
              <strong>Don't drop in.</strong> If someone is already up and
              riding, you do not take off on the same wave in front of
              them. This is the cardinal offense in surfing. Doing it
              repeatedly will get you shouted at; doing it aggressively
              can get the lifeguards' attention.
            </li>
            <li>
              <strong>Paddle wide, not through, the lineup.</strong> Paddle
              out around the break, not through it. If you paddle through
              someone's ride, you'll spoil the wave and collide.
            </li>
            <li>
              <strong>Apologize if you mess up.</strong> Surfers are
              forgiving of a genuine mistake that's acknowledged; they're
              not forgiving of denial.
            </li>
            <li>
              <strong>Outrigger canoes have absolute right-of-way.</strong>{" "}
              They are heavy, fast, and cannot stop. If you see a canoe
              bearing down, paddle out of the way aggressively.
            </li>
          </ol>

          <h3 className={`${H3} mt-6`}>On being welcomed</h3>
          <p className={BODY}>
            Waikīkī's lineup is famously more welcoming than, say, the
            North Shore's — because Waikīkī's culture was built around
            teaching outsiders to surf. The beach boys tradition means
            that locals here are accustomed to first-timers and
            generally patient. But <strong>the patience is
            conditional</strong> on the visitor doing the minimum:
            observing the rules, acknowledging the host, not treating
            the ocean as a resort amenity. Hawaiian surfers refer to
            outsider surfers who respect local protocol as "cool
            haoles." It is not, in this context, an insult.
          </p>
        </div>
      </Section>

      {/* --- The beach boys tradition --- */}
      <Section id="tradition" className={CREAM} width="wide">
        <SectionHeader
          eyebrow="· The Beach Boys Tradition"
          title="What it means that you are being taught by a Hawaiian man"
          kicker="The Waikīkī surf school you booked through your hotel concierge is not a tourism convenience. It is the descendant of a specific Hawaiian institution that began in the 1910s and has continued on this sand for every year since."
        />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6">
            <p className={BODY}>
              The <strong>beach boys of Waikīkī</strong> were a community of
              Hawaiian watermen who began working the shoreline as surf
              instructors, canoe captains, and ambassadors of the Hawaiian
              ocean around 1910. The names — <strong>Panama Dave</strong>,{" "}
              <strong>Steamboat Mokuahi</strong>,{" "}
              <strong>Rabbit Kekai</strong>,{" "}
              <strong>Blue Makua</strong>, <strong>Sally Hale</strong>,{" "}
              <strong>Tom Blake</strong> — are remembered locally in ways
              that rarely translate outside Hawaiʻi. What they did was
              teach several decades of foreign visitors how to surf, how
              to paddle a Hawaiian outrigger, and how to behave in this
              water. The template of "tropical beach plus local surfing
              instructor" exists globally in the form it does because of
              them.
            </p>
            <p className={BODY}>
              The <strong>Outrigger Canoe Club</strong> (founded 1908) was
              the institutional home. The club's founding documents list
              "the reviving of the ancient Hawaiian sports" as its
              explicit purpose. Duke Kahanamoku was a member. Duke's
              Olympic-fame tours through the 1910s and 1920s did the
              global broadcasting; the beach boys did the daily one-on-one
              work at home. Both were the same project.
            </p>
            <p className={BODY}>
              The instructor who teaches your first lesson is, in
              occupational genealogy, a <strong>lineal descendant</strong>{" "}
              of that tradition. Many — not all — are Native Hawaiian.
              Some are Hawaiian cultural practitioners who also teach
              hula and ʻōlelo Hawaiʻi. Some are second- or third-generation
              Hawaiian watermen whose fathers taught visitors at the
              Royal Hawaiian in the 1970s. The work is real work to
              them, and it is also, for many, an inheritance.
            </p>
            <p className={BODY}>
              What this requires of you as a first-time student:{" "}
              <strong>show up, listen, tip generously, do not treat the
              instructor as a service worker</strong>. Ask their name.
              Ask where they're from. Ask what the Hawaiian word for
              the wave you just rode is (<em>nalu</em>). If you stand up
              on your first wave, thank them for it. The exchange
              between a Hawaiian instructor and a mainland visitor is
              one of the last remaining contexts in which the mainland
              visitor can be actively taught by a Hawaiian person on
              Hawaiian terms. Use it well.
            </p>
          </div>

          {duke1920s && (
            <Figure
              image={duke1920s}
              size="wide"
              tier="B"
              datePrefix="ca. 1920"
              caption="Duke Kahanamoku with his 16-foot koa-wood board. The beach boys tradition you are encountering today is continuous with Duke's era — same beach, same reef, same institutional culture."
              className="lg:sticky lg:top-24"
            />
          )}
        </div>
      </Section>

      {/* --- Beyond the first lesson --- */}
      <Section id="beyond" className={PAPER} width="wide">
        <SectionHeader
          eyebrow="· After the First Lesson"
          title="What to try next, if you caught the bug"
        />

        <div className="space-y-6 max-w-3xl">
          <p className={BODY}>
            If the first lesson went well and you want another Waikīkī
            day in the water, the options are (roughly in order of
            commitment):
          </p>
          <ul className={`${BODY} list-disc pl-6 space-y-3`}>
            <li>
              <strong>Longboard rental ($30–50/hr)</strong> — same soft-top
              boards from most surf schools, without the instructor. Rent
              for an hour, paddle out to Walls or Canoes, practice
              pop-ups on your own. Only do this if your first lesson
              went well and you can paddle safely.
            </li>
            <li>
              <strong>Second lesson with a different focus</strong> — work
              on a specific skill (turns, paddling technique, reading the
              wave). Many schools offer "progression lessons" at the
              same price as beginner.
            </li>
            <li>
              <strong>Private coach ($150–250/hr)</strong> — one-on-one
              with a senior instructor at a less-crowded break. The best
              value if you're in Hawaiʻi for four days and want to make
              real progress.
            </li>
            <li>
              <strong>Outrigger canoe ride ($4 per person, Waikīkī
              Beach Services)</strong> — not technically surfing, but a
              once-in-a-lifetime experience. Six paddlers and a captain;
              you catch one wave, ride it two minutes back to the beach.
              The canoe is the oldest continuously-used Hawaiian
              technology on this water.
            </li>
            <li>
              <strong>Stand-up paddleboard (SUP) rental</strong> — flat
              water days at Kūhiō Beach's engineered lagoon. Easier than
              surfing, different skill, mostly fitness-focused.
            </li>
            <li>
              <strong>The North Shore (winter only)</strong> — if you got
              confident at Waikīkī in your week, the North Shore breaks
              (Haleʻiwa, Chun's Reef) are the next step. Most are beyond
              beginner level but <strong>Puaena Point at Haleʻiwa</strong>{" "}
              is a legitimate intermediate break in summer. Do not
              attempt Pipeline or Waimea under any circumstances.
            </li>
          </ul>
        </div>

        <ClusterAside>
          Waikīkī is where the world learns; Nazaré is where the world's
          best surf. The applied forecasting, tow mechanics, and records
          at the opposite end of the sport live on the{" "}
          <a
            href="/beaches/praia-do-norte-6/surfing"
            className="not-italic font-semibold text-[color:var(--beach-supporting,#1E5F74)] underline decoration-dotted underline-offset-4 hover:no-underline"
          >
            Nazaré Surfing spoke →
          </a>
        </ClusterAside>
        <ClusterAside>
          If understanding who is teaching you matters — the overthrow
          context behind the beach boys tradition, the Hawaiian cultural
          ground you're standing on — it's in <ClusterLink to="malama" />.
        </ClusterAside>
      </Section>

      <SpokeCrossNav current="surf" />

      <SpokeProvenance
        bundle={bundle}
        note="Lesson economics and operational detail reflect the 2026 Waikīkī surf-school market. Break names and beginner-break consensus follow standard Oʻahu surfing literature and the practice of the resident beach-school community. The beach boys historical detail draws on the Outrigger Canoe Club archives and Hall (1994) Memories of Duke. Reef-safe sunscreen and lineup etiquette guidance reflects current Hawaiʻi surf-community norms."
      />
    </LegendaryShell>
  );
}

function BreakCard({
  name,
  who,
  body,
}: {
  name: string;
  who: string;
  body: string;
}) {
  return (
    <article className="rounded-sm border border-[#CBD5E1] bg-white p-7">
      <div className={`${EYEBROW} mb-2`}>{who}</div>
      <h3 className={`${H3} mb-3`}>{name}</h3>
      <p className={BODY_SM}>{body}</p>
    </article>
  );
}

function LessonStep({
  t,
  what,
  body,
}: {
  t: string;
  what: string;
  body: string;
}) {
  return (
    <article className="border-l-2 border-[color:var(--beach-supporting,#1E5F74)] pl-6">
      <div className={`${EYEBROW} mb-1`}>{t}</div>
      <h3 className={`${H3} mb-2`}>{what}</h3>
      <p className={BODY_SM}>{body}</p>
    </article>
  );
}
