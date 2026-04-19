import fs from "fs";
import path from "path";
import Link from "next/link";
import Breadcrumbs from "@/components/breadcrumbs";

interface HubCurated {
  slug: string;
  name: string;
  country_code: string;
  lat: number;
  lng: number;
  color: string | null;
  regime: string | null;
  q_pct: number | null;
  f_pct: number | null;
  l_pct: number | null;
  description: string | null;
  story: string | null;
  showcase_rank: number | null;
  reference_photo_url: string | null;
  reference_photo_attribution: string | null;
  citations: string[];
}

interface SandHub {
  generated_at: string;
  curated: HubCurated[];
  categories: Record<string, string[]>;
}

const COLOR_SWATCHES: Record<string, string> = {
  black: "#1a1a1a",
  white: "#f4f3ef",
  pink: "#f7c6cf",
  golden: "#d9a04a",
  red: "#a94332",
  green: "#6b8e5a",
  orange: "#d97a3c",
  grey: "#7e7e78",
  tan: "#c7a373",
  brown: "#6b4a32",
  yellow: "#e8c96b",
  coral: "#e88a7a",
  rainbow: "linear-gradient(90deg,#d94a4a,#d97a3c,#e8c96b,#6b8e5a,#4a7bd9,#9a4ad9)",
};

const COLOR_HEADINGS: Record<string, string> = {
  black: "Black sand — volcanic basalt",
  white: "White sand — quartz or pure carbonate",
  pink: "Pink sand — foraminifera and coral",
  red: "Red sand — iron oxide",
  green: "Green sand — olivine",
  golden: "Golden sand — quartz with iron staining",
  orange: "Orange sand — oxidised feldspar and iron",
  grey: "Grey sand — mixed volcanic and granitic",
  tan: "Tan sand — biogenic + quartz mix",
  brown: "Brown sand — weathered basalt + organics",
  yellow: "Yellow sand — iron-stained quartz",
  coral: "Coral sand — reef carbonate",
  rainbow: "Multi-coloured sand — mixed sources",
};

function loadHub(): SandHub | null {
  const p = path.join(process.cwd(), "data", "sand_hub.json");
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

export const metadata = {
  title: "The geology of the world's beaches — sand, grain by grain",
  description:
    "Where the pink sand comes from. Why Whitehaven is 98% silica. How olivine ends up on a Hawaiian shore. A grain-level tour of the beaches on Earth.",
};

export default function SandHubPage() {
  const hub = loadHub();
  if (!hub) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-volcanic-500">Sand hub data not yet generated.</p>
      </div>
    );
  }

  const categoryEntries = Object.entries(hub.categories)
    .filter(([, slugs]) => slugs.length > 0)
    .sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs items={[{ label: "Sand & geology", href: "/sand" }]} />

      <header className="mb-12 mt-4">
        <p className="text-sm font-medium uppercase tracking-wider text-ocean-600">
          Sand &amp; geology
        </p>
        <h1 className="mt-1 font-display text-4xl leading-tight text-volcanic-900 sm:text-5xl">
          The geology of the world&apos;s beaches
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-volcanic-600">
          Every beach is a record of its watershed. The minerals, the colour, the
          grain size — all of it is the weathered story of the rocks upstream
          and the biology offshore. Here&apos;s a grain-level tour.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl text-volcanic-900">
          Featured sand stories
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hub.curated.slice(0, 12).map((b) => {
            const swatch = b.color ? COLOR_SWATCHES[b.color] : undefined;
            const isGradient = swatch?.startsWith("linear");
            return (
              <Link
                key={b.slug}
                href={`/sand/${b.slug}`}
                className="group block rounded-lg border border-volcanic-100 bg-white/50 p-5 transition hover:border-ocean-200 hover:shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className="inline-block h-6 w-6 rounded-full border border-volcanic-200"
                    style={
                      swatch
                        ? isGradient
                          ? { backgroundImage: swatch }
                          : { backgroundColor: swatch }
                        : { backgroundColor: "#bdb8ac" }
                    }
                    aria-hidden="true"
                  />
                  {b.showcase_rank && (
                    <span className="text-xs font-medium text-volcanic-400">
                      #{b.showcase_rank}
                    </span>
                  )}
                </div>
                <h3 className="mb-1 font-display text-lg text-volcanic-900 group-hover:text-ocean-700">
                  {b.name}
                </h3>
                <p className="mb-3 text-xs uppercase tracking-wider text-volcanic-400">
                  {b.country_code}
                  {b.color && ` · ${b.color}`}
                </p>
                {b.story && (
                  <p className="line-clamp-4 text-sm leading-relaxed text-volcanic-700">
                    {b.story}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl text-volcanic-900">
          Browse by sand colour
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {categoryEntries.map(([color, slugs]) => {
            const swatch = COLOR_SWATCHES[color] ?? "#bdb8ac";
            const isGradient = swatch.startsWith("linear");
            return (
              <div
                key={color}
                className="rounded-lg border border-volcanic-100 bg-white/50 p-5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className="inline-block h-6 w-6 rounded-full border border-volcanic-200"
                    style={
                      isGradient
                        ? { backgroundImage: swatch }
                        : { backgroundColor: swatch }
                    }
                    aria-hidden="true"
                  />
                  <h3 className="font-display text-lg text-volcanic-900">
                    {COLOR_HEADINGS[color] ?? color}
                  </h3>
                </div>
                <p className="mb-3 text-xs uppercase tracking-wider text-volcanic-400">
                  {slugs.length} {slugs.length === 1 ? "beach" : "beaches"}
                </p>
                <ul className="space-y-1 text-sm">
                  {slugs.slice(0, 5).map((slug) => (
                    <li key={slug}>
                      <Link
                        href={`/sand/${slug}`}
                        className="text-ocean-600 hover:underline"
                      >
                        {slug.replace(/-/g, " ")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-10 rounded-lg border border-volcanic-100 bg-volcanic-50/40 p-6">
        <h2 className="mb-3 font-display text-lg text-volcanic-900">
          How to read Q, F, L
        </h2>
        <p className="text-sm leading-relaxed text-volcanic-700">
          Q (quartz) is the survivor: weathered out of granite, extraordinarily
          stable, accumulates in low-latitude beaches through long sediment
          transport. F (feldspar) points to fresh crustal material — granite,
          diorite — eroded close to its source. L (lithic) is rock fragments,
          often volcanic or metamorphic, and dominates beaches near active
          margins. The ratio is a signature of what&apos;s upstream, and it
          changes over geologic time as climate and uplift shift.
        </p>
      </section>

      <p className="text-xs text-volcanic-400">
        Predicted regional composition from the{" "}
        <a
          href="https://doi.org/10.5281/zenodo.6471406"
          className="underline hover:text-ocean-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          GloPrSM model (Sharman et al., 2022)
        </a>
        . Curated geology drawn from Wikipedia and peer-reviewed sources;
        citations on each beach page. Generated{" "}
        {new Date(hub.generated_at).toLocaleString("en-US", {
          dateStyle: "long",
        })}
        .
      </p>
    </div>
  );
}
