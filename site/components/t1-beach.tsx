/**
 * T1Beach — the "Standard" page: a known beach (named + Wikidata) that has
 * identity but no editorial coverage from us yet.
 *
 * Per docs/template-specs.md, T1 = the full T0 field guide PLUS named context:
 * a stated "when to go" recommendation (generated deterministically from
 * best_months + climate — no LLM) and a grounded intro where real text exists.
 *
 * The flex principle is load-bearing here: the broad "any named Wikidata beach"
 * gate means many T1s are thin. Anything without real grounding stays dark, so
 * a thin beach degrades to a *rich T0*, never a hollow essay. T1Beach renders a
 * lead-in, then the full <StubBeach/> below.
 */

import StubBeach from "@/components/stub-beach";

const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_ABBR = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

type StubProps = Parameters<typeof StubBeach>[0];

interface T1Photo {
  url: string;
  thumb: string;
  license?: string | null;
  author_html?: string | null;
  title?: string | null;
}

interface T1Extras {
  name?: string | null;
  best_months?: string[] | null;
  climate?: {
    air_temp_high?: (number | null)[];
    rain_mm?: (number | null)[];
  };
  intro_text?: string | null;
  wikipedia_url?: string | null;
  photos?: T1Photo[] | null;
}

/** Collapse a set of month indices into contiguous [start,end] runs (wrapping Dec→Jan). */
function monthRuns(indices: number[]): [number, number][] {
  if (indices.length === 0) return [];
  const set = new Set(indices);
  if (set.size === 12) return [[0, 11]];
  const runs: [number, number][] = [];
  // find a gap to start after, so wrap-around joins correctly
  let start = 0;
  while (set.has(start) && start < 12) start++;
  if (start === 12) return [[0, 11]];
  for (let k = 0; k < 12; k++) {
    const i = (start + k) % 12;
    if (set.has(i)) {
      const runStart = i;
      let runEnd = i;
      let j = 1;
      while (set.has((i + j) % 12) && j < 12) {
        runEnd = (i + j) % 12;
        j++;
      }
      runs.push([runStart, runEnd]);
      k += j - 1;
    }
  }
  return runs;
}

function runLabel([a, b]: [number, number]): string {
  if (a === b) return MONTHS_FULL[a];
  return `${MONTHS_FULL[a]}–${MONTHS_FULL[b]}`;
}

/** Build a stated seasonal recommendation from best_months + air-temp reasoning. */
function whenToGo(extras: T1Extras): { window: string; reasoning: string | null } | null {
  const bm = extras.best_months;
  if (!bm || bm.length === 0) return null;
  const idx = bm
    .map((m) => MONTH_ABBR.indexOf(String(m).slice(0, 3).toLowerCase()))
    .filter((i) => i >= 0);
  if (idx.length === 0) return null;

  const runs = monthRuns(idx);
  const window = runs.map(runLabel).join(" and ");

  // Reasoning from air-temp highs across the recommended months.
  let reasoning: string | null = null;
  const highs = extras.climate?.air_temp_high;
  if (highs && highs.length === 12) {
    const temps = idx.map((i) => highs[i]).filter((t): t is number => t != null);
    if (temps.length) {
      const lo = Math.round(Math.min(...temps));
      const hi = Math.round(Math.max(...temps));
      const span = lo === hi ? `around ${lo}°C` : `${lo}–${hi}°C`;
      reasoning = `daytime highs of ${span}`;
      // Add a dryness note if rain data supports it.
      const rain = extras.climate?.rain_mm;
      if (rain && rain.length === 12) {
        const inWindow =
          idx.map((i) => rain[i]).filter((r): r is number => r != null);
        const outWindow = rain
          .filter((_, i) => !idx.includes(i))
          .filter((r): r is number => r != null);
        if (inWindow.length && outWindow.length) {
          const avgIn = inWindow.reduce((s, r) => s + r, 0) / inWindow.length;
          const avgOut = outWindow.reduce((s, r) => s + r, 0) / outWindow.length;
          if (avgIn < avgOut * 0.8) reasoning += ", and the drier half of the year";
        }
      }
    }
  }
  return { window, reasoning };
}

export default function T1Beach({
  data,
  neighbors,
}: {
  data: StubProps["data"];
  neighbors?: StubProps["neighbors"];
}) {
  const extras = data as unknown as T1Extras;
  const rec = whenToGo(extras);
  const intro = extras.intro_text && extras.intro_text.trim().length > 60
    ? extras.intro_text.trim()
    : null;
  const name = extras.name || "this beach";
  const hero = extras.photos && extras.photos.length > 0 ? extras.photos[0] : null;

  // Hand the gallery the remaining photos so the hero shot isn't repeated below.
  const dataForStub = hero
    ? ({ ...data, photos: (extras.photos || []).slice(1) } as typeof data)
    : data;

  // Nothing real to add above T0? Then don't — flex principle. Just render the
  // rich field guide. (Belt-and-suspenders: the route only sends named+wikidata
  // beaches here, but a thin one should never get a hollow lead.)
  const hasLead = !!(rec || intro);

  return (
    <div className="bg-[#FBF9F4]">
      {hero && (
        <section className="mx-auto max-w-5xl border-x border-volcanic-100 bg-volcanic-900">
          <figure className="relative aspect-[2/1] md:aspect-[21/9] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.url}
              alt={hero.title || `${name}`}
              className="w-full h-full object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 px-5 py-2 bg-gradient-to-t from-black/60 to-transparent">
              {hero.author_html && (
                <span
                  className="text-[10px] font-mono text-white/80 [&_a]:underline"
                  dangerouslySetInnerHTML={{
                    __html: `${hero.author_html} · ${hero.license || ""} · via Wikimedia Commons`,
                  }}
                />
              )}
            </figcaption>
          </figure>
        </section>
      )}
      {hasLead && (
        <section className="mx-auto max-w-5xl border-x border-volcanic-100 bg-white/40 px-8 md:px-12 pt-12 pb-10 border-b border-volcanic-100">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ocean-800 mb-5 flex items-center gap-3">
            <span className="inline-block w-6 h-px bg-ocean-800" />
            When to go
          </div>

          {rec ? (
            <div className="max-w-2xl">
              <p className="font-display text-3xl md:text-4xl leading-[1.1] text-volcanic-900 tracking-[-0.01em]">
                {rec.window}
              </p>
              <p className="text-[17px] text-volcanic-700 leading-[1.6] mt-4">
                The most reliable beach window at {name}
                {rec.reasoning ? ` — ${rec.reasoning}` : ""}. Derived from
                30-year monthly climate normals; conditions in any single year
                will vary.
              </p>
            </div>
          ) : (
            <p className="text-[17px] text-volcanic-600 leading-[1.6] max-w-2xl">
              We don&rsquo;t yet have a confident best-season call for {name}.
              See the month-by-month climate below.
            </p>
          )}

          {intro && (
            <p className="text-[17px] text-volcanic-700 leading-[1.7] mt-8 max-w-2xl border-t border-volcanic-100 pt-8">
              {intro}
            </p>
          )}
        </section>
      )}

      <StubBeach data={dataForStub} neighbors={neighbors} />
    </div>
  );
}
