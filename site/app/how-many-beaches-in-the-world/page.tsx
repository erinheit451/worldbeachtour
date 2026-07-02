import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/breadcrumbs";

// The canonical count from the World Beach Database (unique beaches after
// cross-source dedup). Kept in sync with the sitewide figure used on the home
// page and footer.
const TOTAL_BEACHES = 228612;
const COUNTRIES = 249;

// Verified live against the OpenStreetMap taginfo API on 2026-07-02. This drifts
// daily; the date is surfaced on-page so the figure stays honest.
const OSM_FEATURES = 246801;
const OSM_AS_OF = "July 2026";

const PAGE_URL = "https://worldbeachtour.com/how-many-beaches-in-the-world";

export const metadata: Metadata = {
  title:
    "How Many Beaches Are There in the World? 228,612 — and Why It's Complicated",
  description:
    "There's no single official count. The most complete cross-referenced database identifies 228,612 beaches across 249 countries — reconciling OpenStreetMap, EU and US registers, Wikidata and GeoNames.",
  alternates: { canonical: "/how-many-beaches-in-the-world" },
  openGraph: {
    title: "How Many Beaches Are There in the World?",
    description:
      "No single number exists — it depends what counts. The most complete cross-referenced database identifies 228,612 beaches across 249 countries. Here's how every credible figure compares.",
    type: "article",
    url: "/how-many-beaches-in-the-world",
  },
};

// ── Sources (rendered inline as superscript refs and in the Sources section) ──
const SOURCES: { id: string; label: string; url: string }[] = [
  { id: "wbt", label: "World Beach Tour — World Beach Database (2026 build)", url: "https://worldbeachtour.com/beaches" },
  { id: "osm", label: "OpenStreetMap taginfo — natural=beach", url: "https://taginfo.openstreetmap.org/tags/natural=beach" },
  { id: "eea", label: "European Environment Agency — European bathing water quality in 2024", url: "https://www.eea.europa.eu/en/analysis/publications/european-bathing-water-quality-in-2024" },
  { id: "epa", label: "US EPA — Beaches (BEACON / BEACH Act)", url: "https://www.epa.gov/beaches/epas-role-protecting-beaches" },
  { id: "blueflag", label: "Blue Flag — global programme", url: "https://www.blueflag.global/" },
  { id: "luijendijk", label: "Luijendijk et al. 2018, “The State of the World's Beaches,” Scientific Reports", url: "https://www.nature.com/articles/s41598-018-24630-6" },
  { id: "cassino", label: "Wikipedia — Praia do Cassino", url: "https://en.wikipedia.org/wiki/Praia_do_Cassino" },
  { id: "short", label: "Andrew Short — survey of Australian beaches", url: "https://www.batemansbaypost.com.au/story/8046534/meet-the-man-who-has-visited-every-beach-in-australia/" },
];

function Ref({ id }: { id: string }) {
  const idx = SOURCES.findIndex((s) => s.id === id);
  if (idx < 0) return null;
  return (
    <a
      href={`#source-${id}`}
      className="align-super text-[0.65em] font-mono text-ocean-600 hover:text-ocean-800 no-underline ml-0.5"
      aria-label={`Source ${idx + 1}`}
    >
      [{idx + 1}]
    </a>
  );
}

// ── The comparison table: every credible number and what it actually counts ──
const COUNTS: {
  source: string;
  measures: string;
  number: string;
  ref: string;
  emphasis?: boolean;
}[] = [
  { source: "OpenStreetMap (natural=beach)", measures: "Crowd-mapped beach features. One beach is often split into many segments, which inflates the count.", number: OSM_FEATURES.toLocaleString(), ref: "osm" },
  { source: "World Beach Tour", measures: "Unique beaches after de-duplicating and merging six sources — the most complete reconciled count.", number: TOTAL_BEACHES.toLocaleString(), ref: "wbt", emphasis: true },
  { source: "EU bathing waters (EEA)", measures: "Officially designated EU bathing sites. About two-thirds are coastal; the rest are lakes and rivers.", number: "21,848", ref: "eea" },
  { source: "US EPA (BEACON)", measures: "Monitored US coastal and Great Lakes beaches under the BEACH Act.", number: "6,000+", ref: "epa" },
  { source: "Blue Flag", measures: "Beaches certified for water quality, safety and environmental management.", number: "4,323", ref: "blueflag" },
  { source: "Luijendijk et al. (2018)", measures: "Not a count of beaches — the share of the world's ice-free shoreline that is sandy.", number: "31% sandy", ref: "luijendijk" },
];

const FAQS: { q: string; a: React.ReactNode; plain: string }[] = [
  {
    q: "What country has the most beaches?",
    a: (
      <>
        Australia is the most-cited answer. Coastal geomorphologist Andrew Short,
        who systematically surveyed the entire country, counted{" "}
        <strong>11,761 mainland beaches</strong> (more than 12,000 including
        islands).<Ref id="short" /> Indonesia and the Philippines, with tens of
        thousands of islands, may have more in absolute terms, but no one has
        counted them the way Short counted Australia.
      </>
    ),
    plain:
      "Australia is the most-cited answer: coastal scientist Andrew Short counted 11,761 mainland beaches (12,000+ with islands). Island nations like Indonesia and the Philippines may have more, but none have been counted as systematically.",
  },
  {
    q: "How many beaches are in the United States?",
    a: (
      <>
        There is no single official count. The US EPA monitors{" "}
        <strong>more than 6,000</strong> coastal and Great Lakes beaches under the
        BEACH Act;<Ref id="epa" /> counts of "public beaches" run lower (around
        5,500) and depend entirely on the definition used.
      </>
    ),
    plain:
      "No single official count exists. The EPA monitors more than 6,000 coastal and Great Lakes beaches; public-beach counts run around 5,500 depending on definition.",
  },
  {
    q: "What is the longest beach in the world?",
    a: (
      <>
        Praia do Cassino in southern Brazil is widely recognized as the longest
        continuous beach, cited between <strong>212 and 254 km</strong> depending
        on where you decide it ends.<Ref id="cassino" /> The range itself is a
        good illustration of why "how many beaches" has no exact answer.
      </>
    ),
    plain:
      "Praia do Cassino in southern Brazil, cited between 212 and 254 km depending on where it is measured to end.",
  },
  {
    q: "What percentage of the world's coastline is sandy?",
    a: (
      <>
        A 2018 satellite study led by Arjen Luijendijk found that{" "}
        <strong>31% of the world's ice-free shoreline is sandy</strong>.
        <Ref id="luijendijk" /> The same study found roughly a quarter of sandy
        beaches are eroding and another quarter are growing — the coastline is
        literally moving, which is part of why a fixed count is impossible.
      </>
    ),
    plain:
      "About 31% of the world's ice-free shoreline is sandy (Luijendijk et al., 2018). The study also found ~24% of sandy beaches are eroding and ~28% accreting.",
  },
  {
    q: "How many Blue Flag beaches are there?",
    a: (
      <>
        The Blue Flag programme certified <strong>4,323 beaches</strong> in its
        2025 season, across more than 50 countries, with Spain, Greece and Italy
        leading.<Ref id="blueflag" /> Blue Flag is a quality certification, not a
        census — it captures a tiny, wealthy-nation-skewed slice of the world's
        beaches.
      </>
    ),
    plain:
      "4,323 beaches were Blue Flag certified in 2025 across 50+ countries, led by Spain, Greece and Italy. It is a quality certification, not a census.",
  },
  {
    q: "Why do different sources give such different numbers?",
    a: (
      <>
        Because they measure different things. A certification programme counts a
        few thousand managed swimming beaches; a government register counts
        designated bathing sites; a crowd map counts mapped features (and splits
        one beach into many). None of them is counting "every beach on Earth."
        World Beach Tour's figure is the one that reconciles them.
      </>
    ),
    plain:
      "Each source measures a different subset: certifications count managed swimming beaches, registers count designated sites, crowd maps count mapped features. None counts every beach; World Beach Tour reconciles them.",
  },
];

export default function HowManyBeachesPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.plain },
    })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How Many Beaches Are There in the World?",
    description:
      "There is no single official count. The most complete cross-referenced database identifies 228,612 beaches across 249 countries.",
    mainEntityOfPage: PAGE_URL,
    author: { "@id": "https://worldbeachtour.com/#organization" },
    publisher: { "@id": "https://worldbeachtour.com/#organization" },
    about: "Global count of beaches",
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqJsonLd, articleJsonLd]) }}
      />

      <Breadcrumbs items={[{ label: "How many beaches are there?" }]} />

      {/* Hero + direct answer */}
      <header className="mb-10">
        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-volcanic-400 mb-3">
          Beach facts
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-volcanic-900 -tracking-[0.01em] leading-[1.1]">
          How many beaches are there in the world?
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-volcanic-700">
          There is no single official count — the answer depends on what you count
          as a beach. The most complete cross-referenced database identifies{" "}
          <strong className="text-sand-700 font-display">
            {TOTAL_BEACHES.toLocaleString()}
          </strong>{" "}
          distinct beaches across {COUNTRIES} countries.<Ref id="wbt" /> Credible
          estimates range from about <strong>4,300</strong> certified beaches to
          over <strong>{OSM_FEATURES.toLocaleString()}</strong> mapped coastal
          features — and the true physical number is effectively uncountable.
        </p>
      </header>

      {/* Comparison table */}
      <section className="mb-12">
        <h2 className="font-display text-2xl text-volcanic-900 mb-2">
          Every credible number, and what it actually counts
        </h2>
        <p className="text-volcanic-500 mb-5 leading-relaxed">
          The reason the internet can&rsquo;t agree on a number is that each
          authority is measuring something different.
        </p>
        <div className="overflow-x-auto border border-volcanic-100">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-volcanic-100 bg-volcanic-50">
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-volcanic-500">Source</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-volcanic-500">What it counts</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-volcanic-500 text-right whitespace-nowrap">Number</th>
              </tr>
            </thead>
            <tbody>
              {COUNTS.map((row) => (
                <tr
                  key={row.source}
                  className={`border-b border-volcanic-100 last:border-0 align-top ${row.emphasis ? "bg-sand-50" : ""}`}
                >
                  <td className="px-4 py-3 font-medium text-volcanic-900 whitespace-nowrap">
                    {row.source}
                    <Ref id={row.ref} />
                  </td>
                  <td className="px-4 py-3 text-volcanic-600 leading-relaxed">
                    {row.measures}
                  </td>
                  <td className={`px-4 py-3 text-right font-display text-lg whitespace-nowrap ${row.emphasis ? "text-sand-700" : "text-volcanic-900"}`}>
                    {row.number}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-volcanic-500 leading-relaxed">
          World Beach Tour&rsquo;s {TOTAL_BEACHES.toLocaleString()} sits exactly
          where a real count should: lower than raw OpenStreetMap (because we merge
          the segments that map one beach as many) and higher than any single
          register (because we combine all of them). It is the only published
          figure that reconciles the others.
        </p>
      </section>

      {/* Why there's no single answer */}
      <section className="mb-12">
        <h2 className="font-display text-2xl text-volcanic-900 mb-4">
          Why there is no single answer
        </h2>

        <h3 className="font-display text-xl text-volcanic-900 mt-6 mb-2">
          What even counts as a beach?
        </h3>
        <p className="text-volcanic-700 leading-relaxed">
          There is no agreed definition. A geomorphologist calls a beach a
          wave-deposited accumulation of loose sediment — but that sediment can be
          sand, shingle, pebble, cobble or shell. OpenStreetMap&rsquo;s{" "}
          <span className="font-mono text-sm">natural=beach</span> tag includes
          shingle and pebble shores; most people picturing golden sand do not.
          Then there is named versus unnamed: gazetteers and certification
          programmes only capture <em>named, notable, or managed</em> beaches,
          missing the vast majority of the world&rsquo;s unnamed coves and strands.
          And &ldquo;beach&rdquo; isn&rsquo;t only marine — lake, reservoir and
          river beaches qualify under most definitions, which is why the US
          count is dominated by the Great Lakes.
        </p>

        <h3 className="font-display text-xl text-volcanic-900 mt-6 mb-2">
          Where does one beach end and the next begin?
        </h3>
        <p className="text-volcanic-700 leading-relaxed">
          This is the coastline paradox applied to beaches. A single continuous
          arc of sand can be recorded as one beach or split into dozens of
          segments at every headland, river mouth or town boundary. That is
          exactly why OpenStreetMap lists {OSM_FEATURES.toLocaleString()}{" "}
          <em>features</em>{" "}<Ref id="osm" /> while the number of{" "}
          <em>distinct</em> beaches is lower. Even the &ldquo;longest beach&rdquo;
          title is unstable: Praia do Cassino in Brazil is cited anywhere from 212
          to 254 km depending on measurement resolution.<Ref id="cassino" />
        </p>

        <h3 className="font-display text-xl text-volcanic-900 mt-6 mb-2">
          Beaches move
        </h3>
        <p className="text-volcanic-700 leading-relaxed">
          Beaches appear and disappear with tides, storms and sediment supply. The
          2018 satellite study of the world&rsquo;s shorelines found that about a
          quarter of sandy beaches are actively eroding and another quarter are
          growing.<Ref id="luijendijk" /> The coastline is literally moving, so any
          honest answer is a <em>range anchored to a definition</em>, not a single
          decimal number.
        </p>
      </section>

      {/* The tiers of counting */}
      <section className="mb-12">
        <h2 className="font-display text-2xl text-volcanic-900 mb-4">
          Five ways to count, five different answers
        </h2>
        <p className="text-volcanic-500 mb-5 leading-relaxed">
          From the narrowest, strictest definition to the broadest — each is a
          legitimate answer to a slightly different question.
        </p>
        <ol className="space-y-4">
          {[
            { n: "4,323", t: "Certified beaches", d: "Beaches a programme like Blue Flag has vetted for water quality and safety. The strictest, smallest answer." },
            { n: "~28,000", t: "Officially designated & monitored", d: "Government-registered bathing beaches — 21,848 in the EU plus 6,000+ monitored in the US. Still only wealthy, regulated coastlines." },
            { n: "tens of thousands", t: "Named beaches", d: "Beaches with a toponym recorded in gazetteers like GeoNames and Wikidata — notable enough to have earned a name." },
            { n: TOTAL_BEACHES.toLocaleString(), t: "All mapped & de-duplicated", d: "Every beach we can identify across six sources, merged so each is counted once. World Beach Tour's number — the most comprehensive count assembled." },
            { n: "uncountable", t: "Every physical beach on Earth", d: "31% of the world's shoreline is sandy, constantly shifting. At this definition the true number is effectively infinite." },
          ].map((tier, i) => (
            <li key={i} className="flex gap-4 border border-volcanic-100 bg-white px-5 py-4">
              <div className="font-display text-xl text-sand-700 whitespace-nowrap min-w-[7rem]">
                {tier.n}
              </div>
              <div>
                <div className="font-display text-lg text-volcanic-900 leading-tight">{tier.t}</div>
                <div className="text-volcanic-600 text-sm mt-1 leading-relaxed">{tier.d}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Methodology */}
      <section className="mb-12">
        <h2 className="font-display text-2xl text-volcanic-900 mb-4">
          How we counted {TOTAL_BEACHES.toLocaleString()}
        </h2>
        <p className="text-volcanic-700 leading-relaxed">
          The World Beach Database is built by merging six independent sources —
          OpenStreetMap and Overture Maps, the EU bathing-water register, the US
          EPA&rsquo;s BEACON system, Wikidata, GeoNames and Blue Flag. The same
          beach usually appears in several of them, and a single beach is often
          mapped as many fragments. So every record is run through a
          de-duplication step that merges entries within 500 metres of each other
          when their names match closely, collapsing the duplicates and segments
          into one beach.
        </p>
        <p className="text-volcanic-700 leading-relaxed mt-4">
          What survives is {TOTAL_BEACHES.toLocaleString()} unique beaches across{" "}
          {COUNTRIES} countries, each then enriched with climate, tide,
          protected-area and sand-mineralogy data. We don&rsquo;t claim this is
          every beach on Earth — no honest source can. We claim it is the most
          comprehensive count anyone has assembled, and the only one that
          reconciles the numbers above.<Ref id="wbt" /> You can{" "}
          <Link href="/beaches" className="text-ocean-700 hover:text-ocean-800 underline underline-offset-2">
            browse the beaches
          </Link>{" "}
          or explore them{" "}
          <Link href="/regions" className="text-ocean-700 hover:text-ocean-800 underline underline-offset-2">
            by country
          </Link>
          .
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="font-display text-2xl text-volcanic-900 mb-5">
          Related questions
        </h2>
        <div className="divide-y divide-volcanic-100 border-t border-volcanic-100">
          {FAQS.map((f, i) => (
            <div key={i} className="py-5">
              <h3 className="font-display text-lg text-volcanic-900 mb-2">{f.q}</h3>
              <p className="text-volcanic-700 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sources */}
      <section className="border-t border-volcanic-100 pt-8">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-volcanic-500 mb-4">
          Sources
        </h2>
        <ol className="space-y-2 text-sm text-volcanic-500">
          {SOURCES.map((s, i) => (
            <li key={s.id} id={`source-${s.id}`} className="scroll-mt-24">
              <span className="font-mono text-volcanic-400 mr-2">[{i + 1}]</span>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-ocean-700 hover:text-ocean-800 underline underline-offset-2"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-volcanic-400 leading-relaxed">
          OpenStreetMap feature count verified live via taginfo, {OSM_AS_OF}; it
          drifts as the map is edited. Blue Flag figure is the 2025 season. EU
          designated bathing waters are the 2024 season.
        </p>
      </section>
    </div>
  );
}
