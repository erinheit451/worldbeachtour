/**
 * Malibu — bespoke Tier 1 page. Legendary v2.
 *
 * Thesis (spike):
 *   "The three-point cobblestone right-hander where the longboard canon
 *    was written, modern surf culture was packaged for the world, and
 *    the Clean Water Act grew teeth."
 *
 * Seventh Tier 1 built under the v2 design language. First Tier 1 built
 * via the research-brief → image CLI → prose-subagent pipeline. WRY
 * voice register (Malibu performs its own myth and the page is in on
 * the joke), CLASSICAL display pairing (DM Serif Display) matching
 * Brighton and Waikīkī.
 *
 * Voice shifts within the page: REVERENT for the wave itself (the
 * longboard canon deserves cathedral language), SEVERE for the
 * honest-reckoning section (Humaliwo, water, Colony, localism).
 */

import type { LegendaryPageBundle, Zone } from "./types";
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
  H3_DARK,
  H4,
  PAPER,
  Section,
  SectionHeader,
  pickImage,
  renderInlineBold,
  renderInlineBoldDark,
} from "./nazare/shared";
import { ClusterAside, ClusterLink, ClusterRail } from "./malibu/shared";

// ============================================================================
// STORY
// ============================================================================

function MalibuStory() {
  const paragraphs = [
    "Malibu has been performing itself since 1957, and the performance has not stopped for a single summer. This is the three-point cobblestone right-hander where the **longboard canon** was written, where modern surf culture was packaged for export, and where the **Clean Water Act grew the teeth** it had been waiting thirty years to grow. A mile of sand at the mouth of Malibu Creek that accidentally became a language the rest of the planet now speaks.",
    "The shorthand is absurd when you list it out. A 5'1\" Brentwood teenager named **Kathy Kohner** spent the summers of 1956 through 1959 riding First Point in a one-piece and keeping a notebook. Her Austrian-emigré father read the notebook and wrote a novel. The novel sold two million copies. Columbia made a film. Then two more films. Then a TV show with Sally Field. Meanwhile a Hawthorne garage band called the **Beach Boys** released three albums between 1961 and 1963 that name-checked Malibu until \"Malibu\" no longer described a place so much as a posture. Bruce Brown pointed a 16mm camera at First Point and cut *The Endless Summer*. **Miki Dora** trimmed the inside so cleanly that every longboarder since has been quoting him without knowing it. In August 1984, three surfers incorporated a nonprofit in response to a proposed breakwater, and within seven years the **Surfrider Foundation** had filed the largest Clean Water Act citizen suit in history.",
    "Under all of it is a different story. Two thousand years before Dora came down from the bluff and slid across First Point on a balsa board, the **Ventureño Chumash** at **Humaliwo** — the village whose name the Spanish filed down into the word *Malibu* — had already named the place for the sound of the wave. The wave was never undiscovered. It had a name. That name is still its name, under a Spanish-mouthed layer of pronunciation. The archaeological site, CA-LAN-264, is registered immediately adjacent to the lagoon and the First Point parking lot. Every surfer here parks on top of it.",
    "That is the résumé. The wave itself is calmer than the résumé, and older, and — if you know where to stand on the bluff at six in the morning — genuinely beautiful in the way the résumé is not. So look at the wave.",
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
            color: var(--beach-primary, #8E5A3C);
          }
        `}</style>

        <PullQuote size="hero">
          The three-point cobblestone right-hander where the longboard canon
          was written, modern surf culture was packaged for the world, and
          the Clean Water Act grew teeth.
        </PullQuote>
      </div>
    </section>
  );
}

// ============================================================================
// QUICK FACTS
// ============================================================================

function QuickFactsSection() {
  const facts: Array<{ label: string; value: string }> = [
    { label: "Coordinates", value: "34.04° N, 118.68° W" },
    { label: "Length", value: "~1 mile (3 points)" },
    { label: "Substrate", value: "Cobblestone + sand" },
    { label: "Swell window", value: "S / SW · Apr–Oct" },
    { label: "Ideal wave", value: "3–6 ft · 16–18 sec" },
    { label: "Water temp", value: "14–19°C year-round" },
    { label: "Crowd, summer AM", value: "50–70 surfers" },
    { label: "World Surfing Reserve", value: "2010 · first ever" },
  ];
  return (
    <Section id="quick-facts" className={PAPER} width="wide">
      <div className={`${EYEBROW} mb-8`}>· Quick facts</div>
      <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((f) => (
          <Fact key={f.label} label={f.label} value={f.value} />
        ))}
      </dl>
    </Section>
  );
}

// ============================================================================
// THE WAVE — REVERENT shift
// ============================================================================

function TheWaveSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const longboard = pickImage(bundle.meta, "longboard_trim");
  const lineup = pickImage(bundle.meta, "surfer_lineup");

  return (
    <Section id="the-wave" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· The wave"
        title="Cobblestone, slowness, and the board the wave asked for"
        kicker="First Point is a cobblestone point break, which is a tidy geological way of saying that Malibu Creek has spent the last several thousand years washing river rock down out of the Santa Monica Mountains and depositing it, stone by stone, into a submerged ramp that angles out from the headland. The ramp is the wave."
      />

      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] items-start">
        <div className="space-y-6">
          <p className={BODY}>
            Nothing else at Malibu is the wave. The sand on the inside is
            incidental, the pier is a reference point, the mountains are a
            windbreak — but the cobblestone ramp is the architecture, and it
            is the only reason any of this exists.
          </p>
          <p className={BODY}>
            When a south or southwest swell generated in the Southern
            Hemisphere — the season runs <strong>April through October</strong>,
            with the cleanest pulses in June and July — reaches that ramp at
            the correct angle, the swell refracts across the cobblestone and
            peels north toward the pier as a long, shoulder-high, tapered
            right. It does not close out. It is almost impossible to make
            it close out. The shoulder travels across the stones at a pace
            that is, famously and accurately, <em>slow</em>. Slow here is a
            mechanical description, not a complaint. The wave&rsquo;s face
            moves at a speed that rewards a surfer who can trim a long board
            along the pocket rather than one who needs to generate thrust
            through short, violent turns.
          </p>
          <p className={BODY}>
            The wave dictates the board. This is the fact that produced
            everything downstream. In <strong>1947</strong>, three shapers
            — <strong>Bob Simmons</strong>, <strong>Joe Quigg</strong>, and{" "}
            <strong>Matt Kivlin</strong> — began building lighter balsa
            boards specifically for First Point. The boards became known as
            Malibu chips. The name survived the era. A &ldquo;Malibu
            board&rdquo; is a shaper term now, in workshops from Biarritz
            to Byron Bay, and it means a specific silhouette the wave at
            First Point asked for seventy-nine years ago.
          </p>
          <p className={BODY}>
            The second gift of the geography is the wind. The{" "}
            <strong>Santa Monica Mountains</strong> block the prevailing
            afternoon onshores until mid-morning, which opens a window —
            offshore at dawn, sideshore by nine, soft-onshore by noon — that
            on a good June swell can hold glassy conditions until almost
            eleven.
          </p>
          <p className={BODY}>
            The dark side is hydrology. Malibu Creek drains a watershed
            that includes the Tapia wastewater plant&rsquo;s historic
            discharge zone, decades of hillside septic, and the lagoon
            behind First Point. The creek mouth empties directly into the
            surf zone. After any winter rain, the inside section becomes a
            bacterial plume, and{" "}
            <strong>Heal the Bay</strong> has listed Surfrider Beach among
            California&rsquo;s most polluted stretches of coast more years
            than anyone on the point would care to count. The wave and the
            pollution come from the same watershed. They are not separable,
            and the page that tries to separate them is lying.
          </p>
          <ClusterAside label="Go deeper">
            The full geology — cobblestone, the 1983 El Niño rearranging the
            bottom, the south-swell forecast lines every regular has
            memorized — is in the <ClusterLink to="first-point" label="First Point spoke" />.
            The watershed fight lives at the{" "}
            <ClusterLink to="surfrider-foundation" label="Surfrider Foundation spoke" />.
          </ClusterAside>
        </div>

        <div className="space-y-8">
          {longboard && (
            <Figure
              image={longboard}
              size="inline"
              caption="Trim, not thrust. The wave dictates the board, and the board's silhouette has survived almost eighty years."
            />
          )}
          {lineup && (
            <Figure
              image={lineup}
              size="inline"
              caption="A perfect summer dawn, minutes up the coast from First Point. Offshore until nine, glass until eleven."
            />
          )}
        </div>
      </div>
    </Section>
  );
}

// ============================================================================
// COBBLESTONE REFRACTION — visual mechanics explainer (Nazaré-canyon equivalent)
// ============================================================================

function CobblestoneExplainerSection() {
  return (
    <Section id="cobblestone-mechanics" className={CREAM} width="wide">
      <SectionHeader
        eyebrow="· The mechanics"
        title="How a pile of round rocks makes a mile of wave"
        kicker="Every other California point break is a rock shelf, a sandbar, or a reef. First Point is a cobble ramp — a sheet of water-tumbled Santa Monica Mountain stone deposited by Malibu Creek over ten thousand years into a shallow, consistent bottom contour angled away from the headland. The wave is a refraction event, not a break event."
      />

      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] items-start">
        <div className="rounded-sm border border-[#E7E2D4] bg-white p-8">
          <svg
            viewBox="0 0 640 320"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            role="img"
            aria-label="Top-down diagram showing southwest swell lines bending around the Malibu headland and peeling north toward the pier."
          >
            {/* Water */}
            <rect x="0" y="0" width="640" height="320" fill="#F1F5F9" />
            {/* Land */}
            <path
              d="M 0 250 L 120 240 L 200 220 L 270 200 L 330 195 L 400 210 L 470 230 L 540 240 L 640 245 L 640 320 L 0 320 Z"
              fill="#8E5A3C"
              fillOpacity="0.2"
              stroke="#8E5A3C"
              strokeWidth="1.5"
            />
            {/* Cobblestone ramp — underwater */}
            <path
              d="M 250 220 Q 310 230 380 240 T 500 248"
              fill="none"
              stroke="#8E5A3C"
              strokeWidth="2"
              strokeDasharray="4 3"
              opacity="0.7"
            />
            <text x="360" y="268" fontFamily="monospace" fontSize="9" fill="#8E5A3C" letterSpacing="1">
              COBBLESTONE RAMP (submerged)
            </text>

            {/* Incoming swell lines — straight from SW */}
            {[0, 1, 2, 3, 4].map((i) => (
              <path
                key={i}
                d={`M ${20 + i * 30} ${80 + i * 8} Q ${200 + i * 20} ${130 + i * 6} ${420 + i * 20} ${160 + i * 4}`}
                fill="none"
                stroke="#64748B"
                strokeWidth="1.2"
                opacity={0.45 - i * 0.05}
              />
            ))}
            {/* Refracted / peeling wave — bending around the point */}
            <path
              d="M 270 195 Q 340 210 410 215 T 540 220"
              fill="none"
              stroke="#8E5A3C"
              strokeWidth="2.5"
            />
            <path
              d="M 280 185 Q 350 200 420 205 T 560 212"
              fill="none"
              stroke="#8E5A3C"
              strokeWidth="2"
              opacity="0.7"
            />
            <path
              d="M 290 175 Q 360 190 430 195 T 580 204"
              fill="none"
              stroke="#8E5A3C"
              strokeWidth="1.5"
              opacity="0.5"
            />

            {/* Labels */}
            <text x="30" y="60" fontFamily="monospace" fontSize="10" fill="#64748B" letterSpacing="1">
              SW SWELL · 180–200°
            </text>
            <text x="30" y="74" fontFamily="monospace" fontSize="9" fill="#64748B" letterSpacing="0.5">
              (April–October, long period)
            </text>

            {/* Pier */}
            <line x1="540" y1="245" x2="585" y2="225" stroke="#475569" strokeWidth="3" />
            <circle cx="585" cy="225" r="3" fill="#475569" />
            <text x="545" y="278" fontFamily="monospace" fontSize="9" fill="#475569" letterSpacing="1">
              MALIBU PIER
            </text>

            {/* Creek mouth arrow */}
            <path d="M 205 260 L 205 225" stroke="#2563EB" strokeWidth="1.4" markerEnd="url(#arr)" />
            <defs>
              <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 z" fill="#2563EB" />
              </marker>
            </defs>
            <text x="155" y="282" fontFamily="monospace" fontSize="9" fill="#2563EB" letterSpacing="0.5">
              MALIBU CREEK
            </text>
            <text x="155" y="294" fontFamily="monospace" fontSize="8" fill="#2563EB" letterSpacing="0.5">
              (sediment source)
            </text>

            {/* Peel arrow */}
            <path d="M 310 175 L 530 195" stroke="#8E5A3C" strokeWidth="1.5" strokeDasharray="2 2" markerEnd="url(#arr2)" />
            <defs>
              <marker id="arr2" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
                <path d="M0,0 L7,3.5 L0,7 z" fill="#8E5A3C" />
              </marker>
            </defs>
            <text x="340" y="162" fontFamily="monospace" fontSize="10" fill="#8E5A3C" letterSpacing="1">
              PEEL · west → east
            </text>

            {/* Points */}
            <circle cx="270" cy="200" r="3" fill="#0F172A" />
            <text x="245" y="186" fontFamily="monospace" fontSize="9" fill="#0F172A">THIRD</text>
            <circle cx="335" cy="198" r="3" fill="#0F172A" />
            <text x="320" y="184" fontFamily="monospace" fontSize="9" fill="#0F172A">SECOND</text>
            <circle cx="420" cy="215" r="3" fill="#0F172A" />
            <text x="400" y="200" fontFamily="monospace" fontSize="9" fill="#0F172A">FIRST</text>
          </svg>
          <p className="mt-4 text-xs italic text-volcanic-500 leading-relaxed">
            Top-down schematic. SW swell lines arrive at a shallow angle to the headland; the submerged cobblestone ramp (dashed) refracts the lines, bending them around the point and pushing them back toward the pier as a peeling right. Malibu Creek (blue arrow) delivers the cobble that makes the ramp. Each point — Third, Second, First — sits along the same shelf, progressively south, closer to the creek mouth and more consistent on smaller swells.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className={H3} style={{ fontFamily: DISPLAY_FF }}>The three mechanical facts</h3>
          <div>
            <div className={`${EYEBROW} mb-1`}>· One · Sediment</div>
            <p className={BODY_SM}>
              Malibu Creek carries cobble out of the mountains. Ten thousand years of sediment delivery built the ramp. The 2013 Lagoon Restoration did not touch it.
            </p>
          </div>
          <div>
            <div className={`${EYEBROW} mb-1`}>· Two · Refraction</div>
            <p className={BODY_SM}>
              SW swell lines hit the ramp at a shallow angle and bend. Bending stretches the wave face and slows its peel rate. The physics is why the wave is &ldquo;slow.&rdquo;
            </p>
          </div>
          <div>
            <div className={`${EYEBROW} mb-1`}>· Three · Consistency</div>
            <p className={BODY_SM}>
              Cobble does not reconfigure week to week. The wave breaks the same way it broke last summer. A wave that remembers its own shape can be designed against.
            </p>
          </div>
          <p className={`${BODY_SM} italic border-l-2 pl-4 border-[color:var(--beach-primary,#8E5A3C)]/50 mt-4`}>
            The 1983 El Niño was the one historical exception. Storm force rearranged the stones. Every old-timer on the point divides the wave&rsquo;s memory into &ldquo;before &rsquo;83&rdquo; and &ldquo;after &rsquo;83.&rdquo;
          </p>
        </div>
      </div>
    </Section>
  );
}

// ============================================================================
// ZONES — six-stretch place anatomy
// ============================================================================

function ZonesSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const zones: Zone[] = bundle.showcase.zones ?? [];
  const adamson = pickImage(bundle.meta, "adamson_house");

  return (
    <Section id="zones" className={PAPER} width="wide">
      <SectionHeader
        eyebrow="· Six stretches, one mile"
        title="Park at the lagoon, walk east to Third Point"
        kicker="Malibu Lagoon State Beach plus the three points plus the pier is a continuous mile of shoreline with six distinct zones. A visitor who only stands at the pier has seen fifteen percent of it."
      />

      {adamson && (
        <Figure
          image={adamson}
          size="wide"
          caption="Adamson House, 1929. The tile-crusted California State Historic Monument on Vaquero Hill between the lagoon and First Point. The cheapest history lesson on the coast."
          className="mb-12"
        />
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {zones.map((z) => (
          <article
            key={z.zone_code}
            className="rounded-sm border border-[#E7E2D4] bg-white p-6"
          >
            <div className={`${EYEBROW} mb-3`}>{z.zone_code}</div>
            <h3 className={`${H3} mb-3`} style={{ fontFamily: DISPLAY_FF }}>{z.name}</h3>
            <p className={`${BODY_SM} mb-4`}>{z.character}</p>
            {z.best_for && (
              <div className="mb-3">
                <div className={`${EYEBROW} mb-1`}>Best for</div>
                <p className={BODY_SM}>{z.best_for}</p>
              </div>
            )}
            {z.notes && (
              <div className="mt-4 border-l-2 border-[color:var(--beach-primary,#8E5A3C)] pl-4">
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[color:var(--beach-primary,#8E5A3C)] mb-1">
                  Local note
                </div>
                <p className={BODY_SM}>{z.notes}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}

// ============================================================================
// DAY IN TIME
// ============================================================================

function DaySection({ bundle }: { bundle: LegendaryPageBundle }) {
  const day = bundle.showcase.day_in_time;
  const sunset = pickImage(bundle.meta, "malibu_sunset");
  if (!day) return null;

  const vignettes = [
    { slot: "Dawn · 5:45–8:30am", text: day.dawn },
    { slot: "Midday · 11–3", text: day.midday },
    { slot: "Golden · 6–7:30pm", text: day.golden },
    { slot: "Night · after 9", text: day.night },
  ];

  return (
    <Section id="day" className={CREAM} width="wide">
      <SectionHeader
        eyebrow="· A day here"
        title="Dawn surfers to pier neon, hour by hour"
      />

      {sunset && (
        <Figure
          image={sunset}
          size="wide"
          caption="Malibu sunset. Golden-hour Malibu is a specific frequency of orange that Bruce Brown filmed in 1966 and Instagram has been trying to replicate since."
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
// CULTURAL FOOTPRINT
// ============================================================================

function CulturalFootprintSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const pch = pickImage(bundle.meta, "pch");

  return (
    <Section id="cultural-footprint" className={PAPER} width="wide">
      <SectionHeader
        eyebrow="· Cultural footprint"
        title="The list is almost embarrassing"
      />

      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] items-start">
        <div className="space-y-6">
          <p className={BODY}>
            Frederick Kohner&rsquo;s <em>Gidget: The Little Girl with Big Ideas</em>{" "}
            (1957) and its four sequels. Columbia&rsquo;s 1959 film{" "}
            <em>Gidget</em> with Sandra Dee, followed by{" "}
            <em>Gidget Goes Hawaiian</em> (1961) and{" "}
            <em>Gidget Goes to Rome</em> (1963). The ABC series from 1965 to
            1966 with a nineteen-year-old Sally Field. The Beach Boys&rsquo;{" "}
            <em>Surfin&rsquo;</em> (1961), <em>Surfin&rsquo; Safari</em> (1962),
            and <em>Surfin&rsquo; U.S.A.</em> (1963), the last of which
            catalogues Malibu by name on the first chorus. Jan and Dean&rsquo;s{" "}
            <em>Surf City</em> (1963) and <em>Ride the Wild Surf</em> (1964).
          </p>
          <p className={BODY}>
            Bruce Brown&rsquo;s three films — <em>Slippery When Wet</em> (1958),{" "}
            <em>Barefoot Adventure</em> (1960), and the one that colonized a
            generation, <em>The Endless Summer</em> (1966). Greg MacGillivray
            and Jim Freeman&rsquo;s <em>Five Summer Stories</em> (1972).
            William Finnegan&rsquo;s <em>Barbarian Days</em> (2015), which won
            the Pulitzer and whose Malibu chapters are the most honest
            English-language prose anyone has written about the place. Matt
            Warshaw&rsquo;s <em>Encyclopedia of Surfing</em> and{" "}
            <em>History of Surfing</em> (2010), where the Malibu entry is the
            reference everyone else borrows from.
          </p>
          <p className={BODY}>
            The shaper vocabulary is Malibu&rsquo;s. The{" "}
            <strong>Malibu chip</strong>, after the 1947 Simmons-Quigg-Kivlin
            boards; the <strong>Malibu board</strong> silhouette that survived
            into the 2020s; the <strong>Malibu Surfing Association</strong>,
            founded 1961 and still paddling out. Craig Stecyk and Glen E.
            Friedman made the photographs. <strong>Dewey Weber</strong> turned
            his own name into the first surfboard brand — the commercial
            prototype was Malibu&rsquo;s, too.
          </p>
          <p className={BODY}>
            The archetypes are Malibu&rsquo;s. <strong>Gidget. Moondoggie. The
            Kahuna. The Black Knight.</strong> Four nicknames that became
            American shorthand before most of America could place the beach on
            a map.
          </p>
          <p className={BODY}>
            Here is the observation with teeth. The beach sold an image of
            California to America so successfully that most of America still
            thinks California looks like <em>this mile</em>. It does not.
            California has 840 miles of coast; this is one of them. But the
            pier, the palms, the longboard peeling glass-smooth toward the
            Adamson House tiles — that is the image, and it has held the frame
            for seventy years.
          </p>
          <ClusterAside label="The full cultural arc">
            Kathy Kohner, her father&rsquo;s novel, the 1959 film, the Beach
            Boys, and <em>The Endless Summer</em> as one continuous sales
            pitch — at the <ClusterLink to="gidget" label="Gidget spoke" />.
          </ClusterAside>
        </div>
        {pch && (
          <Figure
            image={pch}
            size="inline"
            caption="Pacific Coast Highway at Malibu. The road May Rindge lost at the US Supreme Court in 1923. Every image of Malibu since has assumed it is there."
          />
        )}
      </div>
    </Section>
  );
}

// ============================================================================
// LONGBOARD LINEAGE — expanded from the original Miki Dora section
// ============================================================================

function LongboardLineageSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const coastline = pickImage(bundle.meta, "coastline_aerial");
  const longboard = pickImage(bundle.meta, "longboard_trim");

  return (
    <Section id="lineage" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· The longboard lineage"
        title="Four generations on the same wave"
        kicker="First Point has produced named surfers continuously for seventy-nine years — shapers, stylists, rivals, exiles, revivalists. The lineage is specific, visible, and arguably the most densely canonized of any surf break on Earth."
      />

      <div className="grid gap-10 lg:grid-cols-2 mb-16">
        {coastline && (
          <Figure
            image={coastline}
            size="inline"
            caption="The Malibu coastline from above. The same cobblestone shelf has produced four generations of named stylists."
          />
        )}
        {longboard && (
          <Figure
            image={longboard}
            size="inline"
            caption="The stance. Hand off the rail, trim over thrust, the hang-five as a pause rather than a maneuver — Lance Carson set the template and every longboarder since has been quoting it."
          />
        )}
      </div>

      <div className="space-y-10">
        {/* Generation 1 */}
        <article>
          <div className={`${EYEBROW} mb-2`}>· Generation 1 · 1947–1959</div>
          <h3 className={H3} style={{ fontFamily: DISPLAY_FF }}>The shapers who answered the wave</h3>
          <p className={`${BODY} mt-4`}>
            <strong>Bob Simmons</strong> (1919–1954) — Caltech-trained, one-armed, a mathematician about boards more than an artist. Died surfing Windansea, age 35. <strong>Joe Quigg</strong> (1925–2023) and <strong>Matt Kivlin</strong> — Simmons&rsquo;s collaborators, the other two thirds of the team that produced the Malibu chip in 1947. <strong>Dale Velzy</strong> opened the first commercial surf storefront in Manhattan Beach in 1949 and shaped for Malibu from day one. <strong>Hap Jacobs</strong> — the shop Velzy-Jacobs that carried the Malibu aesthetic through the fifties. This generation&rsquo;s accomplishment was not riding. It was the craft. They put the tools in the water that the next three generations would use.
          </p>
        </article>

        {/* Generation 2 */}
        <article>
          <div className={`${EYEBROW} mb-2`}>· Generation 2 · 1958–1973</div>
          <h3 className={H3} style={{ fontFamily: DISPLAY_FF }}>The stylists who defined the wave</h3>
          <p className={`${BODY} mt-4`}>
            <strong>Miki Dora</strong> (1934–2002) — the Black Knight, the most photographed surfer of the era, the man whose trim line every longboarder has been copying without attribution since. Brilliant, contradictory, corrupt; credit-card fraud across three continents, France 1995, Montecito 2002. <strong>Lance Carson</strong> (b. 1942) — the other defining stylist. The hang-five as pause. The relaxed upright posture. The hand trailing just off the rail. If you have ever watched a longboarder and thought <em>that is what one looks like</em>, you were watching a Carson echo. <strong>Mickey Munoz</strong> (b. 1937) — five foot four, goofyfoot, inventor of the Quasimodo and El Spontaneo, Sandra Dee&rsquo;s wig-wearing stunt double in the 1959 <em>Gidget</em>. <strong>Johnny Fain</strong> (b. 1945) — the Little Prince of Malibu, Dora&rsquo;s principal rival, on-wave fistfights through the mid-sixties, the soap opera that First Point localism inherited. <strong>Dewey Weber</strong> (1938–1993) — the Little Man on Wheels, a former Buster Brown child model who became the first surfer to turn his own name into a surfboard brand.
          </p>
        </article>

        {/* Generation 3 */}
        <article>
          <div className={`${EYEBROW} mb-2`}>· Generation 3 · 1970s–1980s · the shortboard years</div>
          <h3 className={H3} style={{ fontFamily: DISPLAY_FF }}>The enforcement era and its bridge figure</h3>
          <p className={`${BODY} mt-4`}>
            The shortboard revolution of the late sixties broke the longboard canon. Longboards vanished from First Point for most of a decade. The wave kept peeling. Into that gap stepped <strong>Allen Sarlo</strong> (b. 1959) — the bridge figure between Dora&rsquo;s Malibu and the modern lineup, a dominant shortboarder through the mid-seventies and into the eighties, and the embodied figure of the point&rsquo;s enforcement culture during those years. The localism that had been an undercurrent in Dora&rsquo;s era became explicit: who belonged in the water, who didn&rsquo;t, and what happened if you were in the wrong category. The question was not resolved. It was simply absorbed back into the wave when the next generation arrived and changed the instrument.
          </p>
        </article>

        {/* Generation 4 */}
        <article>
          <div className={`${EYEBROW} mb-2`}>· Generation 4 · 1990s–present · the log revival</div>
          <h3 className={H3} style={{ fontFamily: DISPLAY_FF }}>The pilgrimage crew</h3>
          <p className={`${BODY} mt-4`}>
            In the nineties the longboard returned. When it returned, First Point was still the reference. <strong>Joel Tudor</strong> (b. 1976) rode it with a reverence that verged on re-enactment — every Carson trim and Munoz hang-five visible in his posture. <strong>Kassia Meador</strong>, <strong>Alex Knost</strong>, <strong>Tyler Warren</strong>, <strong>CJ Nelson</strong> — the modern log crew paddled out at Malibu not because it offered the best wave of any given day but because surfing a nine-six at First Point is a <em>pilgrimage</em>. It is where the template was written. The scene at First Point in 2026 is a living conversation between four generations: the shapers&rsquo; craft, the stylists&rsquo; trim, the enforcement era&rsquo;s inheritance, and the revivalists who arrived to quote all of them. Every clean summer morning the lineup contains all four at once.
          </p>
        </article>
      </div>
    </Section>
  );
}

// ============================================================================
// HISTORY — visual timeline
// ============================================================================

type TimelineRow = { year: string; event: string; tag?: string };

function HistorySection({ bundle }: { bundle: LegendaryPageBundle }) {
  const creek = pickImage(bundle.meta, "malibu_creek");
  const rows: TimelineRow[] = [
    { year: "1892", event: "Frederick Hastings Rindge buys Rancho Topanga Malibu Sequit — 13,315 acres of Mexican land grant — for about $300,000. The ownership lineage every modern Malibu deed traces back to.", tag: "land" },
    { year: "1905", event: "Rindge dies. May Knight Rindge inherits and spends three decades waging one of California's longest private-land legal campaigns.", tag: "land" },
    { year: "1923", event: "The US Supreme Court rules against May Rindge; PCH construction through the ranch follows through the late 1920s.", tag: "infrastructure" },
    { year: "1926", event: "The Malibu Pier, originally the Rindge family's private freight landing, opens to public fishing. The Malibu Colony begins leasing beachfront parcels to Hollywood figures.", tag: "infrastructure" },
    { year: "1928", event: "Adamson House completed on Vaquero Hill between First Point and the lagoon — Rhoda Rindge Adamson's Malibu-Potteries-tiled landmark.", tag: "architecture" },
    { year: "1947", event: "Bob Simmons, Joe Quigg, and Matt Kivlin begin shaping the 'Malibu chip' — the lighter balsa board designed specifically for First Point's slow peel.", tag: "surf" },
    { year: "1956", event: "Kathy Kohner begins summers at the First Point shack. Terry 'Tubesteak' Tracy nicknames her Gidget.", tag: "culture" },
    { year: "1957", event: "Frederick Kohner publishes Gidget: The Little Girl with Big Ideas. Two million copies, forty languages.", tag: "culture" },
    { year: "1959", event: "Columbia's Gidget, with Sandra Dee. Mickey Munoz doubles Dee in a wig; Miki Dora doubles James Darren.", tag: "culture" },
    { year: "1961–63", event: "The Beach Boys' three-album run — Surfin', Surfin' Safari, Surfin' U.S.A. — names Malibu into the American vocabulary.", tag: "culture" },
    { year: "1966", event: "Bruce Brown's The Endless Summer reaches national theatrical release. First Point becomes the reference point against which all other global breaks are measured.", tag: "culture" },
    { year: "1967", event: "Dora drops his trunks mid-wave during the Malibu Invitational in protest of contest-ification. Founding scripture of surf anti-commercialism.", tag: "surf" },
    { year: "1983", event: "An El Niño of historic violence rearranges First Point's cobblestones. Locals mark the break 'before '83' and 'after '83.'", tag: "geology" },
    { year: "1984", event: "Glen Henning, Tom Pratte, and Lance Carson incorporate the Surfrider Foundation in response to a proposed breakwater at First Point.", tag: "activism" },
    { year: "1991", event: "Surfrider Foundation v. Louisiana-Pacific — at the time the largest Clean Water Act citizen suit in US history. The template for the modern coastal lawsuit is written.", tag: "law" },
    { year: "1995", event: "Miki Dora, after two decades as an international fugitive on fraud charges, is arrested in France and extradited.", tag: "culture" },
    { year: "2002", event: "Miki Dora dies of pancreatic cancer in Montecito. Obituaries in the LA Times, NYT, and Surfer canonize him as surfing's patron anti-saint.", tag: "culture" },
    { year: "2010", event: "Save The Waves Coalition designates Surfrider Beach the world's first World Surfing Reserve.", tag: "heritage" },
    { year: "2013", event: "Malibu Lagoon Restoration Project completes after a contentious multi-year fight. Bulldozers yards from the lineup.", tag: "ecology" },
    { year: "2018", event: "The Woolsey Fire burns to the edge of the Malibu coast. Ash and debris flows degrade First Point water for months.", tag: "ecology" },
  ];

  return (
    <Section id="history" className={PAPER} width="wide">
      <SectionHeader
        eyebrow="· History"
        title="1892 to 2018, in twenty pieces"
        kicker="The chronology matters because the story only makes sense when the ownership, the architecture, the surf, the culture, the activism, and the ecology are laid next to each other on the same axis."
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] items-start">
        {creek && (
          <Figure
            image={creek}
            size="inline"
            caption="Malibu Creek. Carries cobble down from the Santa Monica Mountains — the sediment source that built the wave, and the watershed that carries Tapia discharge, hillside septic, and post-fire ash to the surf zone."
          />
        )}
        <ul className="space-y-5">
          {rows.map((r) => (
            <li key={r.year} className="grid grid-cols-[95px_1fr] gap-4 items-start">
              <div
                className="font-display text-[22px] leading-none text-[color:var(--beach-primary,#8E5A3C)] uppercase -tracking-[0.01em]"
                style={{ fontFamily: DISPLAY_FF }}
              >
                {r.year}
              </div>
              <div className={BODY_SM}>
                <span>{r.event}</span>
                {r.tag && (
                  <span className="ml-2 text-[10px] font-mono uppercase tracking-[0.2em] text-volcanic-400">
                    · {r.tag}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

// ============================================================================
// THREE POINTS (wave-geography detail)
// ============================================================================

function ThreePointsSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const pier = pickImage(bundle.meta, "pier_sunset");

  return (
    <Section id="three-points" className={COOL} width="wide">
      <SectionHeader
        eyebrow="· The three points"
        title="First, Second, Third — stacked south to north on the same shelf"
        kicker="The three points sit along the same submerged cobblestone shelf. You can walk First to Third in ten minutes along the sand. The wave each one produces is, nonetheless, genuinely different, and locals sort them in a hierarchy that tracks swell size rather than prestige."
      />

      <div className="grid gap-8 md:grid-cols-3 mb-12">
        <PointCard
          label="First Point"
          position="Southernmost, just north of Malibu Pier"
          blurb="The wave of the canon. The slowest, longest, most forgiving, most crowded. Breaks on almost any south swell April–October. The longboard wave. Sixty surfers on a clean Saturday, without remorse."
        />
        <PointCard
          label="Second Point"
          position="Middle of the three"
          blurb="Shorter, steeper, faster. Needs four feet minimum to turn on. Rewards a shorter board and commitment to the drop over negotiation of the trim. Historically the shortboard escape from First Point."
        />
        <PointCard
          label="Third Point"
          position="Northernmost, closest to the Malibu Colony fence"
          blurb="Needs the biggest south swell of the three to connect. When a real pulse arrives — six feet, long period — Third holds up past the Colony decks. Least ridden, partly because of conditions, partly because of the fence."
        />
      </div>

      {pier && (
        <Figure
          image={pier}
          size="wide"
          caption="Malibu Pier at sunset. The southern anchor of the three points and the reference point for everything north."
        />
      )}
    </Section>
  );
}

function PointCard({
  label,
  position,
  blurb,
}: {
  label: string;
  position: string;
  blurb: string;
}) {
  return (
    <div className="rounded-sm border border-[#E2E8F0] bg-white p-7">
      <div className={`${EYEBROW} mb-2`}>· Point</div>
      <h3
        className="font-display text-[26px] leading-tight text-volcanic-900 uppercase -tracking-[0.01em] mb-2"
        style={{ fontFamily: DISPLAY_FF }}
      >
        {label}
      </h3>
      <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-volcanic-500 mb-4">
        {position}
      </div>
      <p className={BODY_SM}>{blurb}</p>
    </div>
  );
}

// ============================================================================
// HONEST RECKONING — SEVERE shift, dark section
// ============================================================================

function HonestReckoningSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const tomol = pickImage(bundle.meta, "chumash_tomol");
  const logo = pickImage(bundle.meta, "surfrider_logo");
  const woolsey = pickImage(bundle.meta, "woolsey_satellite");

  return (
    <section id="honest-reckoning" className={DARK}>
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className={`${EYEBROW} mb-4`} style={{ color: "var(--beach-supporting, #C98B5F)" }}>
          · Honest reckoning
        </div>
        <h2 className={`${H2_DARK} max-w-3xl`} style={{ fontFamily: DISPLAY_FF }}>
          Four uncomfortable truths this page will not route around
        </h2>
        <p className="mt-5 text-lg italic font-serif max-w-2xl text-[#94A3B8]">
          The register shifts. Humaliwo, the water, the Colony, the lineup,
          and Dora folded into all of it — the facts are not decorative.
        </p>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] items-start mt-16">
          <div className="space-y-8">
            {tomol && (
              <Figure
                image={tomol}
                size="inline"
                caption="A Chumash tomol — the sewn-plank canoe, the oldest plank-built watercraft documented in North America. The maritime tradition predates every other element of the story on this page."
              />
            )}
            {woolsey && (
              <Figure
                image={woolsey}
                size="inline"
                caption="The 2018 Woolsey Fire, from NASA's MISR instrument. The entire Malibu Creek watershed burned; winter ash flowed down to the surf zone."
              />
            )}
            {logo && (
              <Figure
                image={logo}
                size="inline"
                caption="The Surfrider Foundation's logo. A Malibu fight, a global nonprofit, a creek mouth that is still one of California's most polluted."
              />
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h3 className={H3_DARK} style={{ fontFamily: DISPLAY_FF }}>
                Humaliwo
              </h3>
              <p className={`${BODY_DARK} mt-4`}>
                The Chumash word means &ldquo;where the surf sounds loudly,&rdquo; and the village it named sat at the mouth of Malibu Creek for at least two thousand years. <strong className="text-white">&ldquo;Malibu&rdquo; is a Spanish corruption of Humaliwo.</strong> The archaeological site, CA-LAN-264, is registered immediately adjacent to the lagoon and the First Point parking lot — which is to say, beneath and around and under the asphalt where every surfer in this essay parked. Frederick Rindge&rsquo;s 1892 purchase is the ownership lineage every modern deed in the zip code traces back to, and it erased a continuous occupation older than most things Europeans like to call old.{" "}
                <ClusterLink to="humaliwo" label="The Humaliwo spoke" /> treats the village on its own terms.
              </p>
            </div>

            <div>
              <h3 className={H3_DARK} style={{ fontFamily: DISPLAY_FF }}>
                The water
              </h3>
              <p className={`${BODY_DARK} mt-4`}>
                For decades, Malibu Creek has carried <strong className="text-white">Tapia wastewater plant</strong> discharge and hillside septic leachate directly across First Point. Heal the Bay has repeatedly listed Surfrider Beach among California&rsquo;s most polluted, and the listings are not historical footnotes — they are recent. The lagoon restoration of 2013, fought bitterly on both sides, was an attempt to re-engineer the hydrology; whether it worked depends on whom you ask and what the last storm did. The Surfrider Foundation was incorporated in 1984 specifically because of the water at First Point.{" "}
                <ClusterLink to="surfrider-foundation" label="The Surfrider spoke" /> traces the full lineage from breakwater fight to <em>Louisiana-Pacific</em> to the present.
              </p>
            </div>

            <div>
              <h3 className={H3_DARK} style={{ fontFamily: DISPLAY_FF }}>
                The Colony
              </h3>
              <p className={`${BODY_DARK} mt-4`}>
                Surfrider Beach is a public California state beach. The <strong className="text-white">Malibu Colony</strong>, founded 1926 on leased Rindge land and home since to Gloria Swanson, Gary Cooper, Barbra Streisand, and the rotating roster of whoever Hollywood is currently buying beach houses for — abuts Third Point. Colony owners have spent the better part of a century testing the California Coastal Act: signage, fence placements, guards, the whole repertoire of soft-access denial. The state has won more of these fights than it has lost, but the fights do not stop. You can walk the wet sand. You should.
              </p>
            </div>

            <div>
              <h3 className={H3_DARK} style={{ fontFamily: DISPLAY_FF }}>
                Localism
              </h3>
              <p className={`${BODY_DARK} mt-4`}>
                From roughly 1975 into the late 1980s, First Point was a territorially enforced wave. <strong className="text-white">Allen Sarlo</strong> is the bridge figure between Dora&rsquo;s Malibu and the modern lineup, and he personified the enforcement era. The unresolved question — which the point has not resolved and is not going to in this paragraph — is who belongs in the water at a wave that was marketed to the entire planet seventy years ago and now has an international lineup every summer morning. And Dora folds into this too: the figure most associated with Malibu was, by any accounting that takes the evidence seriously, a con artist and a man whose recorded views on race do not survive clean inspection in 2026.
              </p>
            </div>

            <p className={`${BODY_DARK} pt-4 italic`}>
              Four paragraphs. You cannot love this wave honestly without reckoning with them. The rest of the page proceeds on that basis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// NEARBY
// ============================================================================

function NearbySection({ bundle }: { bundle: LegendaryPageBundle }) {
  const lagoon = pickImage(bundle.meta, "lagoon");

  return (
    <Section id="nearby" className={PAPER} width="wide">
      <SectionHeader
        eyebrow="· Nearby"
        title="The mile around the mile"
        kicker="Malibu is twenty miles of coast between Las Flores Canyon and Leo Carrillo. First Point is one point on it. These are the places you can walk or short-drive from the Lagoon lot."
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] items-start">
        {lagoon && (
          <Figure
            image={lagoon}
            size="inline"
            caption="Malibu Lagoon State Beach. The estuary behind First Point, the hydrological heart of the break, and the most-argued-about hundred yards of wetland in Southern California."
          />
        )}
        <div className="space-y-6">
          <NearbyItem
            label="Adamson House"
            blurb="On the bluff above First Point. 1929, Malibu Potteries tile throughout, California State Historic Monument, docent-led tours most days. The cheapest history lesson on the entire coast."
          />
          <NearbyItem
            label="Malibu Lagoon State Park"
            blurb="Behind First Point. Restored 2013 after a contentious multi-year fight; endangered tidewater goby and steelhead populations; the parking lot here ($12–15) is where most surfers start. Adjacent to CA-LAN-264."
          />
          <NearbyItem
            label="Malibu Pier"
            blurb="1905 originally as Rindge family freight, 1926 public. The southern anchor of the three points. Restaurants, sport-fishing charters, the Malibu Farm operations on the deck."
          />
          <NearbyItem
            label="Point Dume"
            blurb="Eight miles north. Headland, tidepools, better-than-First-Point surf on certain swells, and Zuma Beach just beyond. Where locals go when First is mobbed."
          />
          <NearbyItem
            label="Duke's Malibu"
            blurb="Five minutes up PCH. Oceanfront restaurant named for Duke Kahanamoku. Kathy Kohner Zuckerman has been a hostess here for decades and sometimes still is."
          />
          <NearbyItem
            label="Leo Carrillo State Park"
            blurb="Twenty minutes north. The opposite geology — sand-bottom beach breaks, tide pools, the Malibu Colony's negative image. The northern end of the Rindge grant."
          />
        </div>
      </div>
    </Section>
  );
}

function NearbyItem({ label, blurb }: { label: string; blurb: string }) {
  return (
    <div>
      <h3 className={`${H3} mb-2`} style={{ fontFamily: DISPLAY_FF }}>
        {label}
      </h3>
      <p className={BODY_SM}>{blurb}</p>
    </div>
  );
}

// ============================================================================
// SOURCES — visible, not buried
// ============================================================================

function SourcesSection() {
  const groups: Array<{ title: string; items: string[] }> = [
    {
      title: "Surf history and the longboard canon",
      items: [
        "Matt Warshaw — Encyclopedia of Surfing (2003) and The History of Surfing (2010). Malibu, Dora, Carson, Munoz, and Fain entries.",
        "William Finnegan — Barbarian Days (2015, Pulitzer Prize). Malibu chapters.",
        "Craig Stecyk & Drew Kampion — Dora Lives: The Authorized Story of Miki Dora (T. Adler Books, 2005).",
        "LA Times / NYT / Surfer obituaries of Miki Dora (Jan 2002), Tubesteak Tracy (2012), and Dewey Weber (1993).",
      ],
    },
    {
      title: "Gidget and the cultural explosion",
      items: [
        "Frederick Kohner — Gidget: The Little Girl with Big Ideas (Putnam, 1957) and sequels.",
        "Brian Gillogly (dir.) — Accidental Icon: The Real Gidget Story (2010 documentary).",
        "Kathy Kohner Zuckerman interview archive — NPR Fresh Air (2009), LA Times retrospectives, New Yorker.",
        "Bruce Brown production and distribution records for The Endless Summer (1966).",
      ],
    },
    {
      title: "Surfrider Foundation and water quality",
      items: [
        "Surfrider Foundation organizational history (surfrider.org/about) and annual reports.",
        "Surfrider Foundation v. Louisiana-Pacific Corp. and Simpson Paper Co. (N.D. Cal. 1991) settlement filings.",
        "Heal the Bay annual Beach Report Cards (1991–present).",
        "California State Parks Malibu Lagoon Restoration Project (2005–2013) planning and monitoring documentation.",
        "Las Virgenes Municipal Water District — Tapia Water Reclamation Facility public records.",
      ],
    },
    {
      title: "Humaliwo, the Chumash, and the Rindge grant",
      items: [
        "Chester D. King — Evolution of Chumash Society (Garland, 1990).",
        "CA-LAN-264 site records and UCLA Fowler Museum archival materials.",
        "Santa Ynez Band of Chumash Indians — official cultural publications.",
        "Wishtoyo Chumash Foundation — cultural village resources and programming.",
        "California State Archives — Rancho Topanga Malibu Sequit grant chain of title and Rindge family litigation.",
      ],
    },
  ];

  return (
    <Section id="sources" className={PAPER}>
      <SectionHeader
        eyebrow="· Sources"
        title="What this page is built on"
        kicker="A page about a beach that has been written about as much as any beach on Earth has a responsibility to cite the sources it stands on. This is a short version; the spokes list their own."
      />

      <div className="space-y-10">
        {groups.map((g) => (
          <div key={g.title}>
            <h3 className={`${H3} mb-3`} style={{ fontFamily: DISPLAY_FF }}>
              {g.title}
            </h3>
            <ul className="space-y-2 list-disc list-inside marker:text-[color:var(--beach-primary,#8E5A3C)]">
              {g.items.map((it, i) => (
                <li key={i} className={BODY_SM}>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ============================================================================
// SPOKE FOOTER
// ============================================================================

function SpokeFooter() {
  const spokes = [
    { slug: "first-point", label: "First Point", subtitle: "The wave itself — cobblestone geology, south-swell window, longboard canon, and how crowded First Point actually is in 2026." },
    { slug: "gidget", label: "Gidget", subtitle: "Kathy Kohner's 1956 summer, her father's novel, Sandra Dee, the Beach Boys, The Endless Summer — how a 5'1\" teenager accidentally sold Malibu to the world." },
    { slug: "humaliwo", label: "Humaliwo", subtitle: "The Chumash village before \"Malibu,\" CA-LAN-264 under the parking lot, the Rindge land grant, and what to do with all of that as a visitor." },
    { slug: "surfrider-foundation", label: "Surfrider Foundation", subtitle: "1984, three surfers, a proposed breakwater. Forty-two years later, the largest coastal-protection nonprofit on Earth — still fighting the Tapia fight at home." },
  ];
  return (
    <Section id="spokes" className={CREAM} width="wide">
      <div className={`${EYEBROW} mb-6`}>· Go deeper</div>
      <h2 className={`${H2} mb-12 max-w-3xl`} style={{ fontFamily: DISPLAY_FF }}>
        Four pages for four ways in
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {spokes.map((s) => (
          <a
            key={s.slug}
            href={`/beaches/malibu/${s.slug}`}
            className="group block rounded-sm border border-[#E2E8F0] bg-white p-7 hover:border-[color:var(--beach-primary,#8E5A3C)] transition-colors"
          >
            <h3
              className={`${H3} mb-3 group-hover:text-[color:var(--beach-primary,#8E5A3C)]`}
              style={{ fontFamily: DISPLAY_FF }}
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

// ============================================================================
// PAGE PROVENANCE
// ============================================================================

function PageProvenance({ bundle }: { bundle: LegendaryPageBundle }) {
  return (
    <section className="border-t border-[#E2E8F0] bg-[#FAFAF7]">
      <div className="mx-auto max-w-3xl px-6 py-12 text-sm text-volcanic-500 leading-relaxed">
        <div className={`${EYEBROW} mb-4`}>· About this page</div>
        <p className="text-[13px] leading-[1.65]">
          <strong>
            Written by {bundle.composition.byline.replace("Written by ", "")}.
          </strong>{" "}
          First Tier 1 built via the research-brief → image-CLI → prose-subagent
          pipeline. The brief lives at
          <em> site/docs/legendary/briefs/malibu.json</em>; prose drafts at
          <em> site/docs/legendary/drafts/malibu-*.md</em>. Voice register WRY
          (primary) with REVERENT shifts for the wave mechanics and SEVERE
          shifts for the honest reckoning and Humaliwo. Images sourced from
          Wikimedia Commons with license metadata captured at fetch time;
          see each figure caption for attribution. Version v
          {bundle.composition.version}. Corrections welcome, particularly on
          Ventureño etymology and contemporary Chumash tribal nomenclature;
          on 1991 Surfrider v. Louisiana-Pacific settlement specifics; on
          Malibu Surfing Association institutional history; and on current-
          decade First Point lineup dynamics.
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function MalibuPage({
  bundle,
}: {
  bundle: LegendaryPageBundle;
}) {
  const { composition, meta, data } = bundle;
  const location = [data.admin_level_1, data.country_code]
    .filter(Boolean)
    .join(", ");

  const primary = meta.images.hero;
  const secondary =
    pickImage(meta, "pier_sunset") ??
    pickImage(meta, "coastline_aerial") ??
    undefined;

  return (
    <LegendaryShell composition={composition}>
      <Hero
        beachName={composition.beach_name}
        location={location}
        tagline="The mile of California sand that accidentally became a language the rest of the planet now speaks."
        heroType="LAYERED"
        primary={primary}
        secondary={secondary}
        version={composition.version}
        tier={composition.tier as 1 | 2}
      />

      <ClusterRail current="main" beachName={composition.beach_name} />

      <MalibuStory />
      <QuickFactsSection />
      <TheWaveSection bundle={bundle} />
      <CobblestoneExplainerSection />
      <ZonesSection bundle={bundle} />
      <DaySection bundle={bundle} />
      <CulturalFootprintSection bundle={bundle} />
      <LongboardLineageSection bundle={bundle} />
      <HistorySection bundle={bundle} />
      <ThreePointsSection bundle={bundle} />
      <HonestReckoningSection bundle={bundle} />
      <NearbySection bundle={bundle} />
      <SourcesSection />
      <SpokeFooter />
      <PageProvenance bundle={bundle} />
    </LegendaryShell>
  );
}
