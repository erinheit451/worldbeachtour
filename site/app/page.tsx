import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "World Beach Tour — A single page, deeply, for every beach worth knowing",
  description:
    "The definitive internet home for every beach worth a week of your life. Two signature showcase pages — Copacabana and Waikīkī — plus a growing database of the world's coasts.",
  openGraph: {
    title: "World Beach Tour",
    description:
      "A single page, deeply, for every beach worth knowing. Signature showcases for Copacabana and Waikīkī; data-rich pages for the rest.",
    type: "website",
  },
};

function loadBeach(slug: string) {
  try {
    const data = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "data", "beaches", `${slug}.json`), "utf-8")
    );
    const meta = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "content", "beaches", slug, "meta.json"), "utf-8")
    );
    // Merge protected showcase content (if it exists — signature beaches only)
    const showcasePath = path.join(process.cwd(), "content", "beaches", slug, "showcase.json");
    if (fs.existsSync(showcasePath)) {
      data.showcase = JSON.parse(fs.readFileSync(showcasePath, "utf-8"));
    }
    return { data, meta };
  } catch {
    return null;
  }
}

function SignatureCard({
  slug,
  eyebrow,
  headline,
  blurb,
  heroUrl,
  heroAlt,
  accent,
}: {
  slug: string;
  eyebrow: string;
  headline: string;
  blurb: string;
  heroUrl: string;
  heroAlt: string;
  accent: "ocean" | "coral";
}) {
  const accentClasses =
    accent === "ocean"
      ? "from-ocean-900/90 via-ocean-900/40 to-transparent"
      : "from-rose-900/90 via-rose-900/40 to-transparent";
  return (
    <Link
      href={`/beaches/${slug}`}
      className="group relative block overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all"
    >
      <div className="relative h-[520px] sm:h-[620px]">
        <img
          src={heroUrl}
          alt={heroAlt}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${accentClasses}`} />
        <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10 text-white">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/70 mb-3">
            {eyebrow}
          </div>
          <h3 className="font-display text-4xl sm:text-5xl leading-[1.05] -tracking-[0.01em] max-w-md">
            {headline}
          </h3>
          <p className="mt-4 max-w-md text-[15px] text-white/85 leading-relaxed">{blurb}</p>
          <div className="mt-6 inline-flex items-center text-sm font-medium text-white group-hover:text-white/80">
            Read the page →
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const copa = loadBeach("copacabana-7");
  const waikiki = loadBeach("waikiki-beach-1");
  const bondi = loadBeach("bondi-beach");
  const nazare = loadBeach("praia-do-norte-6");

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/waikiki/panorama-night.jpg"
            alt="Waikīkī at night"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-volcanic-950/70 via-volcanic-950/50 to-white" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-32 sm:pt-32 sm:pb-40">
          <div className="text-[10px] font-mono uppercase tracking-[0.35em] text-white/80 mb-6">
            World Beach Tour
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[0.95] -tracking-[0.02em] max-w-3xl">
            A single page, deeply, for every beach worth knowing.
          </h1>
          <p className="mt-8 max-w-2xl text-lg sm:text-xl text-white/85 leading-relaxed">
            Most beach pages are written once and forgotten. We are writing the internet's best
            page on each beach that deserves one — structured data, verified history, honest
            context, archival photography, and the local knowledge that distinguishes the beach
            from the postcard.
          </p>
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/80">
            <span>
              <span className="font-mono text-white">228,000+</span>{" "}
              <span className="text-white/60">beaches tracked</span>
            </span>
            <span>
              <span className="font-mono text-white">4</span>{" "}
              <span className="text-white/60">signature pages (so far)</span>
            </span>
            <span>
              <span className="font-mono text-white">301</span>{" "}
              <span className="text-white/60">data-rich beach guides</span>
            </span>
          </div>
        </div>
      </section>

      {/* Signatures */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <header className="mb-12 max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-[0.3em] text-ocean-700 mb-4">
            · Signature Beaches
          </div>
          <h2 className="font-display text-4xl sm:text-5xl leading-[1.05] text-volcanic-900">
            Four beaches, told at full depth
          </h2>
          <p className="mt-5 text-lg italic text-volcanic-500">
            These are the kind of pages every iconic beach deserves. We are building the next
            wave of Tier 1 pages in public.
          </p>
        </header>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {copa && (
            <SignatureCard
              slug="copacabana-7"
              eyebrow="Rio de Janeiro · Brazil"
              headline="Copacabana — the beach the world imagines"
              blurb="Four kilometers of arc, six postos, the Burle Marx wave underfoot, and a century of Brazilian glamour. Plus the favela above that completes the view."
              heroUrl={copa.meta.images.hero.url}
              heroAlt={copa.meta.images.hero.title}
              accent="coral"
            />
          )}
          {waikiki && (
            <SignatureCard
              slug="waikiki-beach-1"
              eyebrow="Honolulu, Hawaiʻi · United States"
              headline="Waikīkī — the beach that taught the world how to beach"
              blurb="Seven named surf breaks, Duke Kahanamoku's leis, the 1893 overthrow two miles inland, and the Hawaiian place-names under the tourist grid."
              heroUrl={waikiki.meta.images.hero.url}
              heroAlt={waikiki.meta.images.hero.title}
              accent="ocean"
            />
          )}
          {bondi && (
            <SignatureCard
              slug="bondi-beach"
              eyebrow="Sydney · Australia"
              headline="Bondi — where Australia invented surf culture"
              blurb="Bondi Rescue's 4,500 rescues a year, the 1937 shark nets, the Icebergs pool at winter temperature, and the Gadigal country under it all."
              heroUrl={bondi.meta.images.hero.url}
              heroAlt={bondi.meta.images.hero.title}
              accent="ocean"
            />
          )}
          {nazare && (
            <SignatureCard
              slug="praia-do-norte-6"
              eyebrow="Nazaré · Portugal"
              headline="Nazaré — the canyon that made the biggest waves on Earth"
              blurb="A 5-km submarine canyon 500 m from shore, focusing Atlantic swells into the tallest rideable waves ever documented. And a 900-year-old fishing village above the break."
              heroUrl={nazare.meta.images.hero.url}
              heroAlt={nazare.meta.images.hero.title}
              accent="ocean"
            />
          )}
        </div>
      </section>

      {/* What we build */}
      <section className="bg-sand-50 border-y border-sand-200">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <header className="mb-12 max-w-3xl">
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-ocean-700 mb-4">
              · What's in a page
            </div>
            <h2 className="font-display text-3xl sm:text-4xl leading-tight text-volcanic-900">
              The anatomy of a signature beach page
            </h2>
          </header>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["Structured truth", "Monthly climate, tides, bathymetry, reef and hazard data — all sourced, dated, and kept fresh."],
              ["Local knowledge", "The named breaks, the zones locals use as coordinates, the beach-boy rates since 1950."],
              ["Real history", "12-18 timeline events per page, each with a Wikipedia citation. No invented anecdotes."],
              ["Honest context", "The inheritance the beach carries. The tension a travel guide usually elides."],
              ["Archival photography", "Wikimedia Commons, each image attributed and licensed visible on the page."],
              ["A single page, deeply", "No SEO sprawl. No dated price points. The longest page on this beach, written once and maintained."],
            ].map(([h, p]) => (
              <div key={h as string}>
                <h3 className="font-display text-lg text-volcanic-900 mb-2">{h}</h3>
                <p className="text-sm text-volcanic-700 leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next waves */}
      <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <header className="mb-12 max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-[0.3em] text-ocean-700 mb-4">
            · What's coming
          </div>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight text-volcanic-900">
            The next waves of signature beaches
          </h2>
        </header>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 text-sm">
          {[
            ["Next up", "Ipanema · Omaha · Maya Bay"],
            ["Wave 2", "Nazaré · Pipeline · South Beach"],
            ["Wave 3", "Navagio · Whitehaven · Reynisfjara · Maya Bay"],
            ["Wave 4", "Varkala · Coney Island · Glass Beach · Boulders"],
          ].map(([eyebrow, list]) => (
            <div key={eyebrow as string} className="rounded-xl border border-volcanic-100 p-5">
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-ocean-700 mb-2">
                {eyebrow}
              </div>
              <p className="text-volcanic-700 leading-relaxed">{list}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex gap-6">
          <Link
            href="/beaches"
            className="inline-flex items-center rounded-lg bg-volcanic-900 px-6 py-3 text-white text-sm font-medium hover:bg-volcanic-800 transition-colors"
          >
            Browse all beaches →
          </Link>
          <Link
            href="/regions"
            className="inline-flex items-center rounded-lg border border-volcanic-200 px-6 py-3 text-volcanic-700 text-sm font-medium hover:bg-volcanic-50 transition-colors"
          >
            Browse by region →
          </Link>
        </div>
      </section>
    </div>
  );
}
