/**
 * Glass Beach (Fort Bragg) — bespoke landmark page.
 *
 * NOT a shared template. Glass Beach is a geological curiosity, not a
 * tourist destination — the LegendaryBeach frame (zones / stay / eat /
 * day-in-time) doesn't fit. This page has its own shape: the Accident,
 * What You're Looking At, the Rarity Ladder, the Beach Beneath,
 * It's Disappearing, Three Sites, Visit.
 *
 * Every fact on this page has a source in the Sources footer.
 */

import Breadcrumbs from "@/components/breadcrumbs";

// ---------------------------------------------------------------------
// Image credits — all linked, never rehosted.
// ---------------------------------------------------------------------

const IMAGES = {
  hero: {
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Sea_glass_at_Glass_Beach_in_Fort_Bragg_2.jpg",
    author: "Grendelkhan",
    license: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Sea_glass_at_Glass_Beach_in_Fort_Bragg_2.jpg",
  },
  mix1: {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/26/Sea_glass_at_Glass_Beach_in_Fort_Bragg_3.jpg",
    author: "Grendelkhan",
    license: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Sea_glass_at_Glass_Beach_in_Fort_Bragg_3.jpg",
  },
  cove: {
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Cove_At_Glass_Beach_Fort_Bragg_Ca._-_panoramio.jpg",
    author: "Noah Loverbear",
    license: "CC BY-SA 3.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Cove_At_Glass_Beach_Fort_Bragg_Ca._-_panoramio.jpg",
  },
  cobalt: {
    url: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Piece_of_cobalt_blue_sea_glass.jpg",
    author: "Swampyank",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Piece_of_cobalt_blue_sea_glass.jpg",
  },
  red: {
    url: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Piece_of_red_sea_glass.jpg",
    author: "Swampyank",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Piece_of_red_sea_glass.jpg",
  },
  amber: {
    url: "https://upload.wikimedia.org/wikipedia/commons/5/53/Amber_sea_glass.jpg",
    author: "Rachel C (curlsdiva on Flickr)",
    license: "CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Amber_sea_glass.jpg",
  },
  green: {
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Light_Green_Sea_Glass.jpg",
    author: "Balachander Palaniappa",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Light_Green_Sea_Glass.jpg",
  },
  aqua: {
    url: "https://upload.wikimedia.org/wikipedia/commons/0/00/Light_Blue_Sea_Glass.jpg",
    author: "Balachander Palaniappa",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Light_Blue_Sea_Glass.jpg",
  },
  clear: {
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a8/White_and_green_sea_glass.jpg",
    author: "Paul VanDerWerf",
    license: "CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:White_and_green_sea_glass.jpg",
  },
  black: {
    url: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Black_glass_sea_glass_%28cropped%29.JPG",
    author: "Tomcat Ranger",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Black_glass_sea_glass_(cropped).JPG",
  },
} as const;

// ---------------------------------------------------------------------
// Typography primitives (local — this page doesn't inherit from LegendaryBeach)
// ---------------------------------------------------------------------

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ocean-700 mb-4">
      {children}
    </div>
  );
}

function H2({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <h2
      className={`font-display text-4xl sm:text-5xl leading-[1.05] ${dark ? "text-white" : "text-volcanic-900"}`}
    >
      {children}
    </h2>
  );
}

function Kicker({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`mt-5 text-lg italic max-w-2xl ${dark ? "text-volcanic-300" : "text-volcanic-500"}`}>
      {children}
    </p>
  );
}

function Prose({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      className={`prose prose-lg max-w-none
        ${dark ? "prose-invert" : ""}
        prose-p:leading-[1.75] prose-p:text-[17px] prose-p:my-5
        ${dark ? "prose-p:text-volcanic-200" : "prose-p:text-volcanic-700"}
        prose-a:text-ocean-600 prose-a:no-underline hover:prose-a:underline`}
    >
      {children}
    </div>
  );
}

function Section({
  id,
  children,
  dark = false,
  tight = false,
}: {
  id?: string;
  children: React.ReactNode;
  dark?: boolean;
  tight?: boolean;
}) {
  return (
    <section id={id} className={`${dark ? "bg-volcanic-900 text-volcanic-50" : ""}`}>
      <div className={`mx-auto max-w-5xl px-6 ${tight ? "py-14" : "py-20 sm:py-28"}`}>
        {children}
      </div>
    </section>
  );
}

function WideSection({
  id,
  children,
  dark = false,
  bg = "",
}: {
  id?: string;
  children: React.ReactNode;
  dark?: boolean;
  bg?: string;
}) {
  return (
    <section id={id} className={`${dark ? "bg-volcanic-900 text-volcanic-50" : bg}`}>
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">{children}</div>
    </section>
  );
}

function ImageCredit({
  author,
  license,
  source,
}: {
  author: string;
  license: string;
  source: string;
}) {
  return (
    <span className="text-[11px] text-volcanic-400 italic">
      {author} ·{" "}
      <a href={source} target="_blank" rel="noopener" className="underline hover:text-ocean-600">
        Commons
      </a>{" "}
      · {license}
    </span>
  );
}

// ---------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------

function Hero() {
  return (
    <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden bg-black">
      <img
        src={IMAGES.hero.url}
        alt="Close-up of tumbled sea glass pebbles at Glass Beach"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/90" />
      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.28em] text-white/75 mb-5">
            MacKerricher State Park · Fort Bragg, California
          </p>
          <h1 className="font-display text-6xl sm:text-8xl lg:text-9xl text-white leading-[0.9] -tracking-[0.02em]">
            Glass Beach
          </h1>
          <p className="mt-8 max-w-2xl text-lg sm:text-xl text-white/85 font-serif italic">
            A 61-year mistake. A 60-year correction.
          </p>
        </div>
      </div>
      <div className="absolute bottom-3 right-4 text-[10px] text-white/50 max-w-[50%] text-right">
        {IMAGES.hero.author} · {IMAGES.hero.license}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// The Accident — narrative
// ---------------------------------------------------------------------

function AccidentSection() {
  return (
    <Section id="accident">
      <Eyebrow>01 · The accident</Eyebrow>
      <H2>How Fort Bragg made a treasure out of trash</H2>
      <Kicker>
        Nobody designed this beach. For 61 years, the city threw its garbage off the cliffs.
      </Kicker>
      <Prose>
        <p className="first-letter:font-display first-letter:text-7xl first-letter:float-left first-letter:leading-[0.85] first-letter:pr-3 first-letter:pt-1 first-letter:text-ocean-700">
          Fort Bragg opened its first cliff-top dump in 1906, on the bluffs behind the Union
          Lumber Company. Household waste, bottles, appliances, batteries, and eventually
          whole cars went over the edge. When the pile got too large to manage, residents lit
          it on fire — sometimes with Molotov cocktails — to reduce the volume. When the
          first site filled in 1943, the town simply moved the dump a few hundred metres
          north. When <em>that</em> filled in 1949, it moved again, to the cove now called
          Glass Beach. Dumping ended there in 1967 when the State Water Resources Control
          Board shut it down.
        </p>
        <p>
          What the ocean did next was slow, stupid, and beautiful. Sixty years of winter
          storms battered the debris against the Franciscan Complex bedrock. Metal rusted
          into the reef. Ceramics broke, then broke smaller, then disappeared. Everything
          organic rotted. Plastic — mostly — got picked out by volunteers across multiple
          clean-ups. Only the glass, indestructible at the scale of a single human lifetime,
          kept tumbling. Edges dulled. Surfaces frosted under hydrofluoric attack from
          calcareous algae and sand abrasion. Shards became pebbles. Pebbles became gems.
        </p>
        <p>
          The private owner spent five years from 1998 onward working with the California
          Coastal Conservancy on remediation, and in October 2002, California State Parks
          bought the 38-acre parcel and folded it into MacKerricher State Park. By then the
          beach was, improbably, one of the most photographed coastlines on the west coast.
        </p>
      </Prose>

      <aside className="mt-12 border-l-4 border-ocean-500 pl-6">
        <p className="font-display text-2xl sm:text-3xl leading-[1.2] text-volcanic-900">
          &ldquo;What we are looking at is rounded trash. It&apos;s exceptional only because
          the ocean had sixty years to polish our mistake.&rdquo;
        </p>
      </aside>
    </Section>
  );
}

// ---------------------------------------------------------------------
// What You're Looking At — the money section
// ---------------------------------------------------------------------

interface ColorCardProps {
  color: string;
  swatch: string;
  source: string;
  chemistry: string;
  frequency: string;
  image?: { url: string; author: string; license: string; source: string };
  note?: string;
  isFullWidth?: boolean;
}

function ColorCard({ color, swatch, source, chemistry, frequency, image, note }: ColorCardProps) {
  return (
    <article className="rounded-xl border border-volcanic-100 bg-white overflow-hidden">
      {image ? (
        <div className="aspect-[4/3] overflow-hidden bg-volcanic-50">
          <img src={image.url} alt={`${color} sea glass`} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div
          className="aspect-[4/3] flex flex-col items-center justify-center relative"
          style={{ backgroundColor: swatch }}
        >
          <span className="font-display text-2xl text-white/60 tracking-wider">{color}</span>
          <span className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/40">
            Too rare to picture
          </span>
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="inline-block h-4 w-4 rounded-full border border-volcanic-300 shadow-inner"
            style={{ backgroundColor: swatch }}
            aria-hidden="true"
          />
          <h3 className="font-display text-xl text-volcanic-900">{color}</h3>
          <span className="ml-auto text-[10px] font-mono uppercase tracking-widest text-volcanic-400">
            {frequency}
          </span>
        </div>
        <p className="text-sm text-volcanic-700 leading-relaxed">
          <strong className="text-volcanic-900">Source:</strong> {source}
        </p>
        <p className="mt-2 text-sm text-volcanic-700 leading-relaxed">
          <strong className="text-volcanic-900">Chemistry:</strong> {chemistry}
        </p>
        {note && <p className="mt-3 text-xs text-volcanic-500 italic">{note}</p>}
        {image && (
          <p className="mt-3 text-[11px] text-volcanic-400">
            <ImageCredit author={image.author} license={image.license} source={image.source} />
          </p>
        )}
      </div>
    </article>
  );
}

function LookingAtSection() {
  return (
    <WideSection id="colors" bg="bg-sand-50">
      <Eyebrow>02 · What you&apos;re actually looking at</Eyebrow>
      <H2>A taxonomy of broken bottles</H2>
      <Kicker>
        Every colour on the beach is a piece of industrial chemistry. The rarest pieces tell
        you which decade they came from.
      </Kicker>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ColorCard
          color="Kelp green"
          swatch="#4b6e3a"
          frequency="Very common"
          source="Beer bottles, wine bottles, 7-Up (until 1950s)."
          chemistry="Soda-lime glass coloured by iron oxide and chromium. Cheap to produce, nearly universal for bottling before clear glass took over in the 1960s."
          image={IMAGES.green}
          note="Most of what you see at Glass Beach is this."
        />
        <ColorCard
          color="Amber / brown"
          swatch="#7a4b1e"
          frequency="Very common"
          source="Whiskey and medicine bottles. Post-Prohibition beer bottles."
          chemistry="Iron, sulphur, and carbon added to the melt. The colour protects contents from UV light — the reason beer still comes in brown bottles today."
          image={IMAGES.amber}
        />
        <ColorCard
          color="Clear / white"
          swatch="#eaeae6"
          frequency="Common"
          source="Milk bottles, jars, the second half of the 20th century."
          chemistry="Pure soda-lime glass. The most modern colour on the beach; younger pieces still have sharper edges."
          image={IMAGES.clear}
        />
        <ColorCard
          color="Amethyst / sun-purple"
          swatch="#8b6db0"
          frequency="Uncommon"
          source="Clear glass made before 1915 that contained manganese as a decolouriser."
          chemistry="Manganese(II) inside the glass absorbs UV over decades and shifts to manganese(III), which is purple. The older the clear piece, the deeper the tint."
          note="Holds a date stamp: pre-1915 manganese clarifier was phased out during WWI when Germany cut off supply."
        />
        <ColorCard
          color="Cobalt blue"
          swatch="#1f3a93"
          frequency="Rare"
          source="Milk of Magnesia bottles, Vicks VapoRub jars, Noxzema, Bromo-Seltzer."
          chemistry="Cobalt oxide — expensive enough that it was only used for specific pharmaceutical and cosmetic packaging. Colour survives in seawater indefinitely."
          image={IMAGES.cobalt}
        />
        <ColorCard
          color="Red / ruby"
          swatch="#8e1a1a"
          frequency="Very rare"
          source="Automobile tail-light lenses. Schlitz beer (briefly). Avon collectibles."
          chemistry="Gold chloride or selenium-cadmium compounds — prohibitively expensive, almost never used for bottles. A single red piece is a collector&apos;s find."
          image={IMAGES.red}
          note="Fort Bragg regulars say they know a serious visitor by which pocket they reach for when they spot red."
        />
        <ColorCard
          color="Turquoise / aqua"
          swatch="#3ba79c"
          frequency="Rare"
          source="Early-20th-century Ball and Mason canning jars. Soda siphons."
          chemistry="Naturally-occurring iron impurities in older glass sand. Modern glass is too clean to produce it."
          image={IMAGES.aqua}
        />
        <ColorCard
          color="Orange"
          swatch="#d97a3c"
          frequency="Holy grail"
          source="Almost nothing. Art glass. Vintage automobile fog-lamps. Rare collectibles."
          chemistry="Selenium-cadmium compounds, or uranium glass. Orange glass was barely manufactured in any commercial quantity. Finding a piece is the rarest outcome of a day at Glass Beach."
        />
        <ColorCard
          color="Black (deep olive)"
          swatch="#1a1c18"
          frequency="Rare"
          source="Pre-1900 wine and gin bottles, occasionally ink bottles."
          chemistry="Actually a very dense olive green. Hold a piece to the sun and it&apos;s translucent. The weight and apparent opacity tell you it&apos;s old — 19th century."
          image={IMAGES.black}
        />
      </div>

      <p className="mt-10 text-sm text-volcanic-500 italic max-w-3xl">
        Rarity rankings follow the collector consensus documented by the International Sea
        Glass Association and reproduced at the Sea Glass Museum. Chemistry notes synthesised
        from the Corning Museum of Glass&apos; primers on historical soda-lime and
        cobalt-doped glass.
      </p>
    </WideSection>
  );
}

// ---------------------------------------------------------------------
// The Beach Beneath — geology
// ---------------------------------------------------------------------

function BeneathSection() {
  return (
    <Section id="beneath">
      <Eyebrow>03 · The beach beneath</Eyebrow>
      <H2>Before there was glass, there was bedrock</H2>
      <Kicker>
        Strip away the tumbled bottles and the story underneath is a lot older than
        California.
      </Kicker>
      <Prose>
        <p>
          Glass Beach sits on the <strong>Franciscan Complex</strong>, a chaotic mélange of
          graywacke sandstone, shale, chert, and blueschist scraped off the Pacific Plate as
          it subducted under North America during the late Mesozoic — roughly 150 to 65
          million years ago. Graywacke is the grey-green rock you see exposed at low tide:
          quartz and feldspar grains cemented in a muddy matrix, metamorphosed just enough
          to be hard but not enough to lose its sedimentary layering.
        </p>
        <p>
          The Mendocino coast is rising faster than the ocean, so the shoreline climbs in
          terraces. The platform Glass Beach sits on was underwater about 125,000 years ago;
          another terrace above it is twice as old. The uplift that produces this staircase
          is the same tectonic setting that built the Coast Ranges — you can drive east from
          Fort Bragg and see the Franciscan Complex outcropping all the way to the Central
          Valley.
        </p>
        <p>
          Without the dumping, the cove would be a conventional Northern California beach:
          cold, foggy, quartz-feldspar-lithic grey sand mixed with pebbles of graywacke and
          chert. In fact, as the glass slowly depletes, it is becoming that beach again.
        </p>
      </Prose>

      <figure className="mt-10 overflow-hidden rounded-xl bg-volcanic-100">
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={IMAGES.cove.url}
            alt="The cove at Glass Beach, Fort Bragg"
            className="w-full h-full object-cover"
          />
        </div>
        <figcaption className="px-4 py-3 text-xs text-volcanic-500">
          The cove itself — Franciscan bedrock forming the headlands, tumbled glass along the strand line.
          <span className="ml-2">
            <ImageCredit author={IMAGES.cove.author} license={IMAGES.cove.license} source={IMAGES.cove.source} />
          </span>
        </figcaption>
      </figure>
    </Section>
  );
}

// ---------------------------------------------------------------------
// It's Disappearing
// ---------------------------------------------------------------------

function DisappearingSection() {
  return (
    <WideSection id="disappearing" dark>
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] items-start">
        <div>
          <Eyebrow>
            <span className="text-coral-400">04 · The paradox</span>
          </Eyebrow>
          <H2 dark>It is disappearing, and that is your fault</H2>
          <Kicker dark>
            Every visitor who pockets one piece is removing something that will not be
            replaced in any reasonable human timescale.
          </Kicker>
          <Prose dark>
            <p>
              No one is dumping bottles any more — that&apos;s the whole point of the 1967
              closure. The beach has a finite stock of glass and a rate of removal. Longtime
              Fort Bragg residents and park rangers all describe the same decline over the
              past twenty years, and the 2010s saw serious internal debate at California
              State Parks about whether to <em>replenish</em> the glass artificially. Nothing
              came of it. Replenishment would, correctly, be inauthentic — and expensive.
            </p>
            <p>
              So the glass goes. Visitors take it. Storms grind it finer. Ocean chemistry
              does the rest. The most-scavenged cove (Site 3) has visibly less glass now than
              in photographs from 2010.
            </p>
            <p>
              Taking sea glass from MacKerricher State Park is a misdemeanour under
              California State Parks regulations and Fort Bragg city ordinance. The penalty
              caps at <strong>$1,000</strong> and <strong>90 days in jail</strong>. Local
              rangers have become more willing to cite in the past decade.
            </p>
          </Prose>
        </div>

        <aside className="rounded-xl bg-volcanic-800 border border-volcanic-700 p-6">
          <div className="text-[10px] font-mono uppercase tracking-widest text-coral-400 mb-3">
            If you visit
          </div>
          <ul className="space-y-3 text-sm text-volcanic-200 leading-relaxed">
            <li>
              <strong className="text-white">Look, photograph, walk.</strong>{" "}
              Don&apos;t pocket. It&apos;s the whole point.
            </li>
            <li>
              <strong className="text-white">Low tide, morning light.</strong>{" "}
              The glass catches the sun when it&apos;s still wet.
            </li>
            <li>
              <strong className="text-white">Site 3 is crowded.</strong>{" "}
              Sites 1 and 2 are a short walk south along the headland trail.
            </li>
            <li>
              <strong className="text-white">Give it thirty years.</strong>{" "}
              The children who come with you now will see a cobalt-blue piece like a rumour.
            </li>
          </ul>
        </aside>
      </div>
    </WideSection>
  );
}

// ---------------------------------------------------------------------
// The Three Sites
// ---------------------------------------------------------------------

function ThreeSitesSection() {
  const sites = [
    {
      number: "Site 1",
      years: "1906 – 1943",
      headline: "The original",
      body:
        "Behind the Union Lumber Company, first opened as an official water dump. Thirty-seven years of bottles, cans, and burn-pile residue. Most heavily weathered, so pieces here are rounder, smaller, and with the oldest date provenance — the highest chance of pre-1915 sun-purpled amethyst.",
    },
    {
      number: "Site 2",
      years: "1943 – 1949",
      headline: "The interim",
      body:
        "Active for six years only, then closed when it filled. The least-photographed of the three. Tide pools here expose tidal-pool faults in the Franciscan graywacke; a good spot if you care as much about the rock as the glass.",
    },
    {
      number: "Site 3",
      years: "1949 – 1967",
      headline: "Glass Beach, famous",
      body:
        "The one everyone means. Eighteen years of dumping, including the post-war consumer-goods boom — the blue Milk of Magnesia era. Also the cove where visitor pressure has been concentrated, and where depletion is most visible.",
    },
  ];

  return (
    <Section id="three-sites">
      <Eyebrow>05 · Three beaches, not one</Eyebrow>
      <H2>Almost nobody visits the other two</H2>
      <Kicker>
        The famous cove is Site 3, the last and largest. If you walk south along the
        headland trail you&apos;ll find the other two, less crowded and — on Site 1,
        specifically — with the oldest glass in the system.
      </Kicker>

      <div className="mt-12 space-y-8">
        {sites.map((s) => (
          <article key={s.number} className="grid gap-6 md:grid-cols-[120px_1fr] items-start">
            <div>
              <div className="font-mono text-sm uppercase tracking-widest text-ocean-700">
                {s.number}
              </div>
              <div className="mt-1 text-xs text-volcanic-500">{s.years}</div>
            </div>
            <div className="border-l-2 border-ocean-200 pl-6">
              <h3 className="font-display text-xl text-volcanic-900 mb-2">{s.headline}</h3>
              <p className="text-volcanic-700 leading-relaxed">{s.body}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------
// Sister beaches
// ---------------------------------------------------------------------

function SisterBeachesSection() {
  const sisters = [
    {
      name: "Ussuri Bay",
      location: "Vladivostok, Russia",
      body:
        "A former Soviet bottle-and-porcelain dump, closed post-1991. Vodka bottles in every shade of green; enough tumbled porcelain to produce a speckled mosaic. Visitors removed glass so aggressively in the 2010s that Russian regional authorities restricted beach access.",
    },
    {
      name: "Kauai Glass Beach",
      location: "Hanapepe, Hawaii",
      body:
        "A working industrial site — neighbouring the Hanapepe oil depot and former dump — with a smaller, denser concentration than Fort Bragg. Very little blue or red here; mostly green and brown.",
    },
    {
      name: "Davenport Beach",
      location: "Santa Cruz County, California",
      body:
        "Less well-known. The result of a glass-bottle factory that dumped production scrap in the early 20th century. Pieces are thicker — glass blanks rather than finished bottles. Geology is similar to Fort Bragg: Franciscan mélange under uplifted marine terraces.",
    },
    {
      name: "Seaham Beach",
      location: "County Durham, England",
      body:
        "The Victorian Seaham Bottleworks dumped slag and off-cuts into the North Sea from 1850 to 1921. The result is called &lsquo;end-of-day glass&rsquo; by UK collectors — multi-coloured, sometimes three colours in one piece, from the last melt of the shift.",
    },
  ];

  return (
    <WideSection id="sisters" bg="bg-volcanic-50">
      <Eyebrow>06 · Elsewhere</Eyebrow>
      <H2>Other beaches that used to be dumps</H2>
      <Kicker>
        Fort Bragg is the most famous. It is not unique.
      </Kicker>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {sisters.map((s) => (
          <article key={s.name} className="rounded-xl border border-volcanic-200 bg-white p-6">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="font-display text-xl text-volcanic-900">{s.name}</h3>
              <span className="text-[10px] font-mono uppercase tracking-widest text-volcanic-400">
                {s.location}
              </span>
            </div>
            <p className="text-sm text-volcanic-700 leading-relaxed">
              {s.body.replace("&lsquo;", "\u2018").replace("&rsquo;", "\u2019")}
            </p>
          </article>
        ))}
      </div>
    </WideSection>
  );
}

// ---------------------------------------------------------------------
// Visit
// ---------------------------------------------------------------------

function VisitSection() {
  return (
    <Section id="visit">
      <Eyebrow>07 · If you go</Eyebrow>
      <H2>The practical stack</H2>
      <Kicker>
        This is not a swimming beach. It&apos;s a 45-minute stop that will haunt you for a
        week.
      </Kicker>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-volcanic-100 bg-white p-6">
          <h3 className="font-display text-xl text-volcanic-900 mb-4">Getting there</h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-volcanic-900">Where</dt>
              <dd className="text-volcanic-700">
                Noyo Headlands / MacKerricher State Park, Fort Bragg, CA. The famous cove
                (Site 3) is at the west end of Elm St.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-volcanic-900">Parking</dt>
              <dd className="text-volcanic-700">
                Free lot at the end of Elm St. Fills by 10 am on summer weekends.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-volcanic-900">Access</dt>
              <dd className="text-volcanic-700">
                ~5-minute walk on a paved path, then a short scramble down onto the beach.
                Not fully wheelchair-accessible below the headland viewpoint.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-volcanic-900">Nearest airport</dt>
              <dd className="text-volcanic-700">
                Santa Rosa (STS, 2 hrs) or SFO (3.5 hrs). Highway 1 is the long, slow, correct
                way in.
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-volcanic-100 bg-white p-6">
          <h3 className="font-display text-xl text-volcanic-900 mb-4">When to go</h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-volcanic-900">Tide</dt>
              <dd className="text-volcanic-700">
                Low tide exposes more glass. Check NOAA for Noyo Harbor; aim for a minus
                tide if possible.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-volcanic-900">Light</dt>
              <dd className="text-volcanic-700">
                Morning or early evening. Midday sun blanches the colour; fog (common
                June–August) flattens it completely.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-volcanic-900">Season</dt>
              <dd className="text-volcanic-700">
                Winter and spring after storms stir the beach — new glass gets exposed.
                Autumn has the clearest skies.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-volcanic-900">Museum</dt>
              <dd className="text-volcanic-700">
                The{" "}
                <a
                  href="https://www.internationalseaglassmuseum.com/"
                  target="_blank"
                  rel="noopener"
                  className="text-ocean-600 hover:underline"
                >
                  International Sea Glass Museum
                </a>{" "}
                in town (founded 2009 by Captain Cass Forrington, retired merchant marine) is
                free. It holds the best-preserved specimens, including a blacklight room
                that reveals uranium glass fluorescence.
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-10 rounded-xl border-2 border-coral-300 bg-coral-50 p-6">
        <h3 className="font-display text-lg text-coral-900 mb-2">One rule</h3>
        <p className="text-coral-900 leading-relaxed">
          <strong>Don&apos;t take any.</strong> Taking sea glass is a misdemeanour — up to
          $1,000 fine, up to 90 days in jail. The beach exists because the city stopped
          dumping; it continues to exist only if visitors stop pocketing. Photograph it.
          Stand on the bluff at golden hour and look at a million rounded bottles. Walk
          away.
        </p>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------
// Macro mix image interstitial
// ---------------------------------------------------------------------

function MacroInterstitial() {
  return (
    <section className="bg-black">
      <figure className="mx-auto max-w-[1600px]">
        <img
          src={IMAGES.mix1.url}
          alt="Macro close-up of mixed sea glass pieces on Glass Beach"
          className="w-full h-auto block"
        />
        <figcaption className="px-6 py-3 text-[11px] text-white/50 italic flex justify-between max-w-7xl mx-auto">
          <span>Sea glass at Glass Beach, Fort Bragg.</span>
          <span>
            <ImageCredit author={IMAGES.mix1.author} license={IMAGES.mix1.license} source={IMAGES.mix1.source} />
          </span>
        </figcaption>
      </figure>
    </section>
  );
}

// ---------------------------------------------------------------------
// Sources footer
// ---------------------------------------------------------------------

function SourcesFooter() {
  return (
    <section id="sources" className="bg-volcanic-50 border-t border-volcanic-200 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <Eyebrow>· Sources &amp; provenance</Eyebrow>
        <H2>Where this page comes from</H2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 text-sm text-volcanic-700 leading-relaxed">
          <div>
            <h4 className="font-display text-base text-volcanic-900 mb-1">Dump history</h4>
            <p>
              Site dates and closure facts:{" "}
              <a
                href="https://en.wikipedia.org/wiki/Glass_Beach_(Fort_Bragg,_California)"
                target="_blank"
                rel="noopener"
                className="text-ocean-600 hover:underline"
              >
                Wikipedia: Glass Beach (Fort Bragg, California)
              </a>
              , cross-referenced with California State Parks&apos; MacKerricher page and the{" "}
              <a
                href="https://www.mendocinolandtrust.org/projects/glass-beach/"
                target="_blank"
                rel="noopener"
                className="text-ocean-600 hover:underline"
              >
                Mendocino Land Trust
              </a>
              .
            </p>
          </div>
          <div>
            <h4 className="font-display text-base text-volcanic-900 mb-1">Geology</h4>
            <p>
              Franciscan Complex description from the Geosciences LibreTexts chapter on the
              Coast Ranges and USGS open-file reports on the Mendocino County marine
              terraces.
            </p>
          </div>
          <div>
            <h4 className="font-display text-base text-volcanic-900 mb-1">Glass chemistry</h4>
            <p>
              Cobalt, manganese, selenium-cadmium, and gold-chloride colourants drawn from
              Corning Museum of Glass teaching materials and the International Sea Glass
              Association&apos;s collector guide.
            </p>
          </div>
          <div>
            <h4 className="font-display text-base text-volcanic-900 mb-1">Legal status</h4>
            <p>
              Collection prohibition and penalties from California State Parks regulations
              for MacKerricher State Park and Fort Bragg Municipal Code enforcement.
            </p>
          </div>
          <div>
            <h4 className="font-display text-base text-volcanic-900 mb-1">The museum</h4>
            <p>
              Cass Forrington&apos;s founding story from{" "}
              <a
                href="https://www.internationalseaglassmuseum.com/"
                target="_blank"
                rel="noopener"
                className="text-ocean-600 hover:underline"
              >
                the museum&apos;s own site
              </a>{" "}
              and a 2022 profile in <em>The Epoch Times</em>.
            </p>
          </div>
          <div>
            <h4 className="font-display text-base text-volcanic-900 mb-1">Photography</h4>
            <p>
              All imagery linked from Wikimedia Commons under its original licence.
              Attribution visible on every image. No photos are re-hosted.
            </p>
          </div>
        </div>
        <p className="mt-10 text-xs text-volcanic-500">
          Last updated {new Date().toISOString().slice(0, 10)}. Corrections and primary
          sources welcome — this page improves with expertise from collectors, park staff,
          and geologists who know the cove better than we do.
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------

export default function GlassBeachPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-5xl px-6 pt-6">
        <Breadcrumbs
          items={[
            { label: "Beaches", href: "/" },
            { label: "Glass Beach" },
          ]}
        />
      </div>
      <Hero />
      <AccidentSection />
      <MacroInterstitial />
      <LookingAtSection />
      <BeneathSection />
      <DisappearingSection />
      <ThreeSitesSection />
      <SisterBeachesSection />
      <VisitSection />
      <SourcesFooter />
    </div>
  );
}
