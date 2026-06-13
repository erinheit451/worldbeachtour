/**
 * Standard legendary sections — the generic, composition-driven section
 * library. These complete the <LegendaryBeachV2> renderer so a new Tier-1/2
 * beach needs only data (composition.json + showcase.json + meta.json), no
 * bespoke per-beach React component.
 *
 * Every section reads from the bundle and degrades gracefully: if the data
 * isn't there, the section renders nothing (the flex principle). Styling
 * follows the legendary design language — --beach-primary, --display-family,
 * generous rhythm, serif/mono eyebrows.
 */

import type { LegendaryPageBundle } from "../types";
import { SectionHeader } from "./story";

const MONTHS = ["", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

interface LeadImg { url: string; thumbnail?: string; title?: string; author?: string; license?: string }

/** Full-bleed-within-column lead figure — kills the "wall of text" problem by
 * giving each major section a visual opening, drawn from the gallery pool. */
function SectionLead({ img }: { img?: LeadImg }) {
  if (!img) return null;
  return (
    <figure className="relative mb-12 overflow-hidden rounded-sm" style={{ aspectRatio: "21 / 9" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img.url} alt={img.title || ""} className="w-full h-full object-cover" loading="lazy" />
      {img.author && (
        <figcaption className="absolute inset-x-0 bottom-0 px-3 py-1.5 bg-gradient-to-t from-black/60 to-transparent">
          <span className="text-[9px] font-mono text-white/75 [&_a]:underline" dangerouslySetInnerHTML={{ __html: `${img.author} · ${img.license || ""}` }} />
        </figcaption>
      )}
    </figure>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[11px] font-mono uppercase tracking-[0.3em] mb-3"
      style={{ color: "var(--beach-primary, #475569)" }}
    >
      {children}
    </div>
  );
}

// ── TIMELINE ────────────────────────────────────────────────────────────
export function TimelineSection({ bundle, lead }: { bundle: LegendaryPageBundle; lead?: LeadImg }) {
  const events = (bundle.showcase.timeline ?? [])
    .slice()
    .sort((a, b) => a.year - b.year);
  if (events.length === 0) return null;
  return (
    <section id="timeline" className="mx-auto max-w-3xl px-6 py-20 sm:py-24">
      <SectionLead img={lead} />
      <SectionHeader eyebrow="History" title="What happened here" />
      <ol className="relative border-l-2 mt-4" style={{ borderColor: "var(--beach-primary, #cbd5e1)" }}>
        {events.map((e, i) => (
          <li key={i} className="relative pl-8 pb-10 last:pb-0">
            <span
              className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full"
              style={{ background: "var(--beach-primary, #475569)" }}
            />
            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl text-volcanic-900" style={{ fontFamily: "var(--display-family)" }}>
                {e.year}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-volcanic-400">
                {e.event_type}
              </span>
            </div>
            <h3 className="font-display text-lg text-volcanic-900 mt-1">{e.title}</h3>
            <p className="text-[16px] text-volcanic-600 leading-[1.65] mt-1.5">{e.description}</p>
            {e.wiki_url && (
              <a href={e.wiki_url} target="_blank" rel="noopener" className="text-[13px] mt-2 inline-block hover:underline" style={{ color: "var(--beach-primary)" }}>
                Wikipedia →
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

// ── PLACE ANATOMY (zones + landmarks) ───────────────────────────────────
export function PlaceAnatomySection({ bundle, lead }: { bundle: LegendaryPageBundle; lead?: LeadImg }) {
  const zones = (bundle.showcase.zones ?? []).slice().sort(
    (a, b) => a.position_along_beach_pct - b.position_along_beach_pct
  );
  const landmarks = bundle.showcase.landmarks ?? [];
  if (zones.length === 0 && landmarks.length === 0) return null;
  return (
    <section id="place_anatomy" className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
      <SectionLead img={lead} />
      <SectionHeader eyebrow="Anatomy" title="The shape of the place" />
      {zones.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((z, i) => (
            <div key={i} className="border-t-2 pt-4" style={{ borderColor: "var(--beach-primary, #cbd5e1)" }}>
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-xl text-volcanic-900">{z.name}</h3>
                <span className="font-mono text-[10px] text-volcanic-400">{Math.round(z.position_along_beach_pct)}%</span>
              </div>
              <p className="text-[15px] text-volcanic-600 leading-[1.6] mt-2">{z.character}</p>
              {z.best_for && (
                <p className="text-[13px] mt-3"><span className="font-mono uppercase tracking-[0.1em] text-volcanic-400">Best for</span> <span className="text-volcanic-700">{z.best_for}</span></p>
              )}
              {z.notes && <p className="text-[13px] text-volcanic-500 italic mt-1">{z.notes}</p>}
            </div>
          ))}
        </div>
      )}
      {landmarks.length > 0 && (
        <div className="mt-12">
          <Eyebrow>Landmarks</Eyebrow>
          <div className="space-y-5 mt-3">
            {landmarks.map((l, i) => (
              <div key={i} className="border-l-2 pl-5" style={{ borderColor: "var(--beach-primary, #cbd5e1)" }}>
                <h3 className="font-display text-lg text-volcanic-900">
                  {l.name}
                  {l.year_built && <span className="text-volcanic-400 font-sans text-sm font-normal"> · {l.year_built}</span>}
                </h3>
                {(l.architect_or_designer || l.landmark_type) && (
                  <p className="text-[12px] font-mono uppercase tracking-[0.1em] text-volcanic-400 mt-0.5">
                    {[l.landmark_type, l.architect_or_designer].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="text-[15px] text-volcanic-600 leading-[1.6] mt-1.5">{l.description}</p>
                {l.wikipedia_url && (
                  <a href={l.wikipedia_url} target="_blank" rel="noopener" className="text-[13px] mt-1.5 inline-block hover:underline" style={{ color: "var(--beach-primary)" }}>Wikipedia →</a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ── DAY IN LIFE ─────────────────────────────────────────────────────────
export function DayInLifeSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const d = bundle.showcase.day_in_time;
  if (!d) return null;
  const slots: [string, string, string][] = [
    ["Dawn", d.dawn, "#fde68a"],
    ["Midday", d.midday, "#7dd3fc"],
    ["Golden hour", d.golden, "#fb923c"],
    ["Night", d.night, "#1e293b"],
  ];
  return (
    <section id="day_in_life" className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
      <SectionHeader eyebrow="A day here" title="From first light to dark" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {slots.filter(([, t]) => t).map(([label, text, color], i) => (
          <div key={i}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 rounded-full" style={{ background: color }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-volcanic-500">{label}</span>
            </div>
            <p className="text-[15px] text-volcanic-700 leading-[1.65]">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── CULTURE (cultural refs grouped by type) ─────────────────────────────
const REF_LABEL: Record<string, string> = {
  film: "Film", tv: "Television", music: "Music", literature: "Literature",
  historic: "History", brand: "Brand & advertising", other: "Other",
};
export function CultureSection({ bundle, lead }: { bundle: LegendaryPageBundle; lead?: LeadImg }) {
  const refs = bundle.showcase.cultural_refs ?? [];
  if (refs.length === 0) return null;
  const groups: Record<string, typeof refs> = {};
  for (const r of refs) (groups[r.ref_type] ??= []).push(r);
  return (
    <section id="culture" className="mx-auto max-w-3xl px-6 py-20 sm:py-24">
      <SectionLead img={lead} />
      <SectionHeader eyebrow="Culture" title="Where it shows up" />
      <div className="space-y-8">
        {Object.entries(groups).map(([type, items]) => (
          <div key={type}>
            <Eyebrow>{REF_LABEL[type] ?? type}</Eyebrow>
            <ul className="mt-3 space-y-4">
              {items.map((r, i) => (
                <li key={i} className="border-l-2 pl-4" style={{ borderColor: "var(--beach-primary, #e2e8f0)" }}>
                  <div className="font-display text-lg text-volcanic-900">
                    {r.title}
                    {r.year && <span className="text-volcanic-400 text-sm font-sans font-normal"> · {r.year}</span>}
                  </div>
                  {r.creator && <div className="text-[13px] text-volcanic-500">{r.creator}</div>}
                  {r.description && <p className="text-[15px] text-volcanic-600 leading-[1.6] mt-1">{r.description}</p>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── HONEST RECKONING ────────────────────────────────────────────────────
export function HonestReckoningSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const note = bundle.showcase.honest_reckoning_note ?? bundle.showcase.favela_note;
  if (!note) return null;
  const paras = note.split("\n\n").filter(Boolean);
  return (
    <section id="honest_reckoning" className="py-20 sm:py-24" style={{ background: "#15110d" }}>
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-[11px] font-mono uppercase tracking-[0.3em] mb-3 text-amber-200/70">
          The honest part
        </div>
        <div className="space-y-5">
          {paras.map((p, i) => (
            <p key={i} className="text-[18px] leading-[1.75] text-stone-200 font-serif">{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PLAN STACK (getting there + when + food + events) ───────────────────
export function PlanStackSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const { data, showcase } = bundle;
  const food = showcase.food_drink ?? [];
  const events = showcase.recurring_events ?? [];
  const hasGettingThere = data.nearest_airport || data.nearest_city;
  if (!hasGettingThere && food.length === 0 && events.length === 0) return null;
  return (
    <section id="plan_stack" className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
      <SectionHeader eyebrow="Plan" title="If you go" />
      <div className="grid gap-10 md:grid-cols-2">
        {hasGettingThere && (
          <div>
            <Eyebrow>Getting there</Eyebrow>
            <dl className="mt-3 space-y-2 text-[15px]">
              {data.nearest_airport && (
                <div className="flex justify-between gap-4 border-b border-volcanic-100 pb-2">
                  <dt className="text-volcanic-500">Nearest airport</dt>
                  <dd className="text-volcanic-900 text-right">{data.nearest_airport.name} ({data.nearest_airport.iata}) · {data.nearest_airport.distance_km.toFixed(0)} km</dd>
                </div>
              )}
              {data.nearest_city && (
                <div className="flex justify-between gap-4 border-b border-volcanic-100 pb-2">
                  <dt className="text-volcanic-500">Nearest town</dt>
                  <dd className="text-volcanic-900 text-right">{data.nearest_city}{data.nearest_city_distance_km != null ? ` · ${data.nearest_city_distance_km.toFixed(0)} km` : ""}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
        {events.length > 0 && (
          <div>
            <Eyebrow>When to go</Eyebrow>
            <ul className="mt-3 space-y-3">
              {events.map((e, i) => (
                <li key={i}>
                  <div className="font-display text-base text-volcanic-900">{e.name} <span className="text-volcanic-400 text-sm font-sans">· {e.when_text}</span></div>
                  <p className="text-[14px] text-volcanic-600 leading-[1.55]">{e.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {food.length > 0 && (
        <div className="mt-12">
          <Eyebrow>What to eat & drink</Eyebrow>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-3">
            {food.map((f, i) => (
              <div key={i} className="border-t border-volcanic-200 pt-3">
                <div className="font-display text-base text-volcanic-900">{f.name}</div>
                <p className="text-[14px] text-volcanic-600 leading-[1.55] mt-1">{f.description}</p>
                {f.where && <p className="text-[12px] text-volcanic-400 italic mt-1.5">{f.where}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ── COMPARISON (the moat — percentile rankings vs all 228K) ─────────────
interface Cmp { metric: string; text: string; detail?: string | null }
export function ComparisonSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const comparisons = (bundle.data as unknown as { comparisons?: Cmp[] }).comparisons ?? [];
  if (comparisons.length === 0) return null;
  return (
    <section id="comparison" className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
      <SectionHeader eyebrow="Compare" title="How it ranks" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {comparisons.map((c, i) => (
          <div key={i} className="border-t-2 pt-4" style={{ borderColor: "var(--beach-primary, #cbd5e1)" }}>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-volcanic-400 mb-2">{c.metric}</div>
            <div className="font-display text-[19px] leading-[1.2] text-volcanic-900">{c.text}</div>
            {c.detail && <div className="text-[13px] text-volcanic-500 mt-2">{c.detail}</div>}
          </div>
        ))}
      </div>
      <p className="text-[12px] text-volcanic-400 italic mt-4">Ranked against every beach in our database — 228,000+ worldwide.</p>
    </section>
  );
}

// ── GALLERY ─────────────────────────────────────────────────────────────
export function GallerySection({ bundle }: { bundle: LegendaryPageBundle }) {
  const gallery = bundle.meta.images?.gallery ?? [];
  if (gallery.length === 0) return null;
  return (
    <section id="gallery" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <SectionHeader eyebrow="Gallery" title="" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {gallery.map((g, i) => (
          <figure
            key={i}
            className={`group relative overflow-hidden bg-volcanic-100 ${i === 0 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-square"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.thumbnail ?? g.url} alt={g.title || "Photo"} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            {g.author && (
              <figcaption className="absolute inset-x-0 bottom-0 px-2 py-1 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] font-mono text-white/85 line-clamp-1 [&_a]:underline" dangerouslySetInnerHTML={{ __html: `${g.author} · ${g.license || ""}` }} />
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
