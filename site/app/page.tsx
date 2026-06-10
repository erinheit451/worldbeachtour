import type { Metadata } from "next";
import Link from "next/link";
import HeroRotator from "@/components/hero-rotator";
import SearchAutocomplete from "@/components/search-autocomplete";
import { getPublishedBeaches, topCountries } from "@/lib/published-beaches";

export const metadata: Metadata = {
  title: "World Beach Tour — Every beach on Earth, one real page at a time",
  description:
    "Search 228,612 beaches worldwide. Real history, real climate data, real local knowledge — not another list of 'top 10 beaches.'",
  openGraph: {
    title: "World Beach Tour",
    description:
      "Search 228,612 beaches worldwide. Real history, real climate data, real local knowledge.",
    type: "website",
  },
};

const TOTAL_BEACHES = 228612;
const COUNTRIES = 249;

const SIGNATURE_PICKS = [
  {
    slug: "copacabana-7",
    name: "Copacabana",
    where: "Rio de Janeiro, Brazil",
    image: "/copa/hero-aerial.jpg",
    blurb: "Four kilometers of arc, six postos, and the century of glamour built along it.",
  },
  {
    slug: "waikiki-beach-1",
    name: "Waikīkī",
    where: "Honolulu, Hawaiʻi",
    image: "/waikiki/hero-diamond-head.jpg",
    blurb: "Seven named breaks, Duke Kahanamoku's surfboard, and the overthrow two miles inland.",
  },
  {
    slug: "bondi-beach",
    name: "Bondi",
    where: "Sydney, Australia",
    image: "/bondi/hero-aerial.jpg",
    blurb: "4,500 rescues a year, the world's oldest surf lifesaving club, and Icebergs in winter.",
  },
  {
    slug: "praia-do-norte-6",
    name: "Praia do Norte",
    where: "Nazaré, Portugal",
    image: "/nazare/hero-big-wave.jpg",
    blurb: "A submarine canyon five kilometers offshore, focusing Atlantic swells into the tallest rideable waves on Earth.",
  },
];

const HERO_SLIDES = [
  {
    src: "/copa/hero-aerial.jpg",
    alt: "Copacabana, Rio de Janeiro at golden hour",
    caption: "Copacabana · Rio de Janeiro, Brazil",
  },
  {
    src: "/nazare/hero-big-wave.jpg",
    alt: "A surfer descending the face of a big wave at Nazaré",
    caption: "Praia do Norte · Nazaré, Portugal",
  },
  {
    src: "/bondi/hero-aerial.jpg",
    alt: "Bondi Beach from the air, with Icebergs pool at the southern end",
    caption: "Bondi · Sydney, Australia",
  },
];

const WRITING_NEXT = [
  ["Ipanema", "Rio de Janeiro, Brazil", "The other half of Rio's beach myth. Tom Jobim, the 1968 protest, the daily volleyball religion."],
  ["Pipeline", "Banzai, Oʻahu", "The most photographed wave on Earth. Also the deadliest."],
  ["Maya Bay", "Phi Phi Leh, Thailand", "From DiCaprio in 2000 to a four-year ecological closure. The recovery tourism studies now."],
  ["Whitehaven", "Whitsundays, Australia", "98% silica sand. Cool to walk on, squeaks underfoot, sits on the Great Barrier Reef."],
  ["Reynisfjara", "Vík, Iceland", "Black basalt, sneaker waves that have killed hikers, the columnar cliffs behind."],
];

const PAGE_CHECKLIST = [
  "Monthly climate normals (1991–2020)",
  "Tide, swell, and safety notes",
  "Archival photography, licensed and credited",
  "History, with dated citations",
  "Access, parking, and local logistics",
  "Who to trust locally",
];

const CONTRIBUTE_EMAIL = "erinrose451@gmail.com";

export default function HomePage() {
  const all = getPublishedBeaches();
  const top = topCountries(8);
  const defaults = [
    all.find((b) => b.slug === "copacabana-7"),
    all.find((b) => b.slug === "waikiki-beach-1"),
    all.find((b) => b.slug === "bondi-beach"),
    all.find((b) => b.slug === "praia-do-norte-6"),
  ].filter(Boolean) as ReturnType<typeof getPublishedBeaches>;

  return (
    <div className="bg-white">
      {/* HERO — search-forward, rotating, headline first */}
      <section className="relative">
        <div className="relative h-[70vh] min-h-[560px] sm:min-h-[620px] overflow-hidden">
          <HeroRotator slides={HERO_SLIDES} />
          {/* readability gradient — left-darker so right side stays photographic */}
          <div className="absolute inset-0 bg-gradient-to-r from-volcanic-950/85 via-volcanic-950/55 to-volcanic-950/15" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-volcanic-950/70 to-transparent" />

          <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col">
            <div className="flex-1" />
            <div className="mx-auto w-full max-w-7xl px-6 pb-10 sm:pb-14">
              <div className="max-w-3xl">
                <h1 className="font-display text-white text-[40px] leading-[0.96] sm:text-6xl lg:text-[72px] -tracking-[0.02em]">
                  Every beach on Earth,
                  <br />
                  <span className="italic text-ocean-100">one real page at a time.</span>
                </h1>
                <p className="mt-6 max-w-xl text-base sm:text-lg text-white/85 leading-relaxed">
                  Search {TOTAL_BEACHES.toLocaleString()} beaches worldwide. Real history, real climate data, real
                  local knowledge — not another list of &ldquo;top 10 beaches.&rdquo;
                </p>

                <div className="mt-8 max-w-2xl">
                  <SearchAutocomplete
                    index={all}
                    total={TOTAL_BEACHES}
                    defaultSuggestions={defaults}
                    variant="hero"
                  />
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/75 font-mono">
                  <span>
                    <span className="text-white">{TOTAL_BEACHES.toLocaleString()}</span> beaches
                  </span>
                  <span className="text-white/30">·</span>
                  <span>
                    <span className="text-white">{COUNTRIES}</span> countries
                  </span>
                  <span className="text-white/30">·</span>
                  <span>
                    <span className="text-white">{all.length}</span> in-depth guides
                  </span>
                  <span className="text-white/30">·</span>
                  <span>updated weekly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE PORTALS — find by name / browse by region / editor's picks */}
      <section className="bg-volcanic-50">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <header className="mb-12 max-w-3xl">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-volcanic-900 -tracking-[0.015em]">
              Find your beach three ways.
            </h2>
            <p className="mt-4 text-[17px] text-volcanic-600 leading-relaxed">
              However you think about the coast, start here.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Portal 1 — search */}
            <div className="rounded-2xl bg-white ring-1 ring-volcanic-200 p-7 flex flex-col">
              <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] font-mono text-ocean-700 mb-3">
                <span>By name</span>
              </div>
              <h3 className="font-display text-2xl text-volcanic-900 mb-2">Search the database</h3>
              <p className="text-[14px] text-volcanic-600 leading-relaxed mb-5">
                Live results from {all.length} in-depth guides, with the full {TOTAL_BEACHES.toLocaleString()}-beach
                database one click away.
              </p>
              <SearchAutocomplete
                index={all}
                total={TOTAL_BEACHES}
                defaultSuggestions={defaults}
                variant="panel"
              />
              <div className="mt-auto pt-5 text-[12px] text-volcanic-500">
                Try: Copacabana · Bondi · or your hometown
              </div>
            </div>

            {/* Portal 2 — browse by region */}
            <div className="rounded-2xl bg-white ring-1 ring-volcanic-200 p-7 flex flex-col">
              <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] font-mono text-ocean-700 mb-3">
                <span>By region</span>
              </div>
              <h3 className="font-display text-2xl text-volcanic-900 mb-2">Pick a country</h3>
              <p className="text-[14px] text-volcanic-600 leading-relaxed mb-5">
                {COUNTRIES} coastal countries and territories. Start with the ones we&apos;ve covered most.
              </p>
              <ul className="space-y-1.5">
                {top.map((c) => (
                  <li key={c.code}>
                    <Link
                      href={`/regions/${c.code.toLowerCase()}`}
                      className="flex items-center justify-between py-1 text-[14px] text-volcanic-800 hover:text-ocean-700 transition-colors group"
                    >
                      <span className="font-medium">{c.name}</span>
                      <span className="text-[12px] text-volcanic-400 font-mono group-hover:text-ocean-700">
                        {c.count} guide{c.count === 1 ? "" : "s"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-5">
                <Link
                  href="/regions"
                  className="text-[13px] font-medium text-ocean-700 hover:underline"
                >
                  See all {COUNTRIES} regions →
                </Link>
              </div>
            </div>

            {/* Portal 3 — editor's picks */}
            <div className="rounded-2xl bg-volcanic-950 text-white p-7 flex flex-col">
              <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] font-mono text-ocean-300 mb-3">
                <span>Editor&apos;s picks</span>
              </div>
              <h3 className="font-display text-2xl mb-2">Start with these four</h3>
              <p className="text-[14px] text-white/70 leading-relaxed mb-5">
                The longest, deepest pages we&apos;ve written — top to bottom, every claim sourced.
              </p>
              <ul className="space-y-3">
                {SIGNATURE_PICKS.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/beaches/${p.slug}`}
                      className="flex items-center gap-3 group"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-12 w-16 rounded object-cover ring-1 ring-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-display text-[16px] leading-tight group-hover:text-ocean-200 transition-colors">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-white/50 font-mono uppercase tracking-[0.1em] mt-0.5 truncate">
                          {p.where}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF — one row of four signature pages */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <header className="mb-10 max-w-3xl">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-volcanic-900 -tracking-[0.015em]">
            What a finished page looks like.
          </h2>
          <p className="mt-4 text-[17px] text-volcanic-600 leading-relaxed">
            Four beaches we&apos;ve written top to bottom. Every claim dated, every photo credited, every page open
            to public revision.
          </p>
        </header>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SIGNATURE_PICKS.map((p) => (
            <Link
              key={p.slug}
              href={`/beaches/${p.slug}`}
              className="group block rounded-xl overflow-hidden ring-1 ring-volcanic-200 hover:ring-volcanic-900 transition-all bg-white"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-5">
                <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-ocean-700">{p.where}</div>
                <h3 className="font-display text-xl text-volcanic-900 mt-1.5 mb-2">{p.name}</h3>
                <p className="text-[13px] text-volcanic-600 leading-snug">{p.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/beaches"
            className="inline-flex items-center text-[14px] font-medium text-volcanic-900 hover:text-ocean-700 transition-colors"
          >
            See all {all.length} in-depth guides →
          </Link>
        </div>
      </section>

      {/* WHAT'S ON A PAGE */}
      <section className="bg-sand-50 border-y border-sand-200/70">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-volcanic-900 -tracking-[0.015em]">
                Not &ldquo;beautiful.&rdquo; <span className="italic">Specific.</span>
              </h2>
              <p className="mt-5 text-[17px] text-volcanic-700 leading-relaxed">
                Travel sites tell you the beach is stunning. We tell you the sea-surface temperature by month, the
                name the lifeguards actually use for each tower, who built the promenade in what year, and what the
                locals know about the rip currents.
              </p>
              <p className="mt-4 text-[15px] text-volcanic-600 leading-relaxed">
                Every number dated. Every quote sourced. Every photo credited. Pages are living documents — we
                update them when the coast changes, and so can you.
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-white ring-1 ring-sand-200 p-7">
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ocean-700 mb-5">
                  On every signature page
                </div>
                <ul className="space-y-3">
                  {PAGE_CHECKLIST.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] text-volcanic-800">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-ocean-600">
                        <path
                          d="m5 12 5 5L20 7"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION + CONTRIBUTE */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-volcanic-900 -tracking-[0.015em]">
              Beaches are public.
              <br />
              <span className="text-volcanic-500">Their pages shouldn&apos;t be owned by the same three travel sites.</span>
            </h2>
            <p className="mt-6 text-[17px] text-volcanic-700 leading-relaxed max-w-xl">
              We&apos;re building the canonical page for every beach on Earth — slowly, carefully, in the open. If you
              know a coast better than the internet does, we want to hear from you.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-3">
            <a
              href={`mailto:${CONTRIBUTE_EMAIL}?subject=Suggest a beach`}
              className="rounded-xl bg-volcanic-900 text-white px-6 py-5 hover:bg-volcanic-700 transition-colors group"
            >
              <div className="font-display text-lg">Suggest a beach →</div>
              <div className="text-[13px] text-white/70 mt-1">
                Tell us about a beach we should write up next.
              </div>
            </a>
            <a
              href={`mailto:${CONTRIBUTE_EMAIL}?subject=Correction`}
              className="rounded-xl bg-white ring-1 ring-volcanic-200 px-6 py-5 hover:ring-volcanic-900 transition-colors"
            >
              <div className="font-display text-lg text-volcanic-900">Submit a correction →</div>
              <div className="text-[13px] text-volcanic-600 mt-1">
                Spotted something wrong? Help us fix it.
              </div>
            </a>
            <a
              href={`mailto:${CONTRIBUTE_EMAIL}?subject=Adopt a beach`}
              className="rounded-xl bg-white ring-1 ring-volcanic-200 px-6 py-5 hover:ring-volcanic-900 transition-colors"
            >
              <div className="font-display text-lg text-volcanic-900">Adopt a beach near you →</div>
              <div className="text-[13px] text-volcanic-600 mt-1">
                Be the local voice on a coast you know.
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* WRITING NEXT */}
      <section className="bg-volcanic-50 border-t border-volcanic-100">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <header className="mb-10 max-w-3xl">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-volcanic-900 -tracking-[0.015em]">
              Writing next.
            </h2>
            <p className="mt-4 text-[17px] text-volcanic-600 leading-relaxed">
              In research this quarter. Each page goes into public revision once the first draft is up.
            </p>
          </header>

          <div className="border-t border-volcanic-200">
            {WRITING_NEXT.map(([name, where, blurb]) => (
              <div
                key={name}
                className="grid gap-2 lg:grid-cols-12 lg:gap-8 lg:items-baseline border-b border-volcanic-200 py-6"
              >
                <div className="lg:col-span-3 font-display text-xl sm:text-2xl text-volcanic-900 -tracking-[0.015em]">
                  {name}
                </div>
                <div className="lg:col-span-3 font-mono text-[12px] uppercase tracking-[0.18em] text-volcanic-500">
                  {where}
                </div>
                <div className="lg:col-span-6 text-[14px] sm:text-[15px] text-volcanic-700 leading-relaxed">
                  {blurb}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
