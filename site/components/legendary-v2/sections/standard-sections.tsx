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
import { getSignature } from "../signatures";

function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    return m ? <strong key={i}>{m[1]}</strong> : <span key={i}>{part}</span>;
  });
}

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

// ── FACT RAIL (the monument numbers) ────────────────────────────────────
interface KeyFact { label: string; value: string; source?: string }
function FactRail({ facts }: { facts: KeyFact[] }) {
  if (!facts || facts.length === 0) return null;
  return (
    <aside className="my-12 border-y-2 py-6" style={{ borderColor: "var(--beach-primary, #cbd5e1)" }}>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-volcanic-400 mb-5">The numbers</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-7">
        {facts.map((f, i) => (
          <div key={i}>
            <div className="font-display text-[26px] leading-[1.05] text-volcanic-900" style={{ fontFamily: "var(--display-family)" }}>{f.value}</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-volcanic-400 mt-1.5">{f.label}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}

// ── THE SPIKE (real deep-explainer + signature visual + fact-rail) ──────
export function SpikeSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const { showcase, composition } = bundle;
  const explainer = (showcase as unknown as { spike_explainer?: string }).spike_explainer;
  const keyFacts = (showcase as unknown as { key_facts?: KeyFact[] }).key_facts ?? [];
  const Signature = getSignature(composition.slug);
  // Fall back to the old behaviour only if there's genuinely no authored spike.
  if (!explainer && !Signature && keyFacts.length === 0) return null;

  const paras = (explainer ?? "").split("\n\n").filter(Boolean);
  return (
    <section id="spike_deep_explainer" className="py-20 sm:py-28" style={{ background: "var(--beach-supporting, #f6f4ef)" }}>
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeader eyebrow="The spike" title={composition.spike_statement ?? composition.beach_name} />
        {Signature && (
          <div className="mb-12 border border-volcanic-100 bg-white/60 p-4 rounded-sm">
            <Signature />
          </div>
        )}
        {keyFacts.length > 0 && <FactRail facts={keyFacts} />}
        <div className="prose prose-lg max-w-none">
          {paras.map((p, i) => (
            <p key={i} className="text-volcanic-700 leading-[1.78] text-[19px] my-6">{renderInline(p)}</p>
          ))}
        </div>
      </div>
    </section>
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
  const pull = (bundle.showcase as unknown as { reckoning_pullquote?: string }).reckoning_pullquote;
  const paras = note.split("\n\n").filter(Boolean);
  return (
    <section id="honest_reckoning" className="py-20 sm:py-24" style={{ background: "#15110d" }}>
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-[11px] font-mono uppercase tracking-[0.3em] mb-3 text-amber-200/70">
          The honest part
        </div>
        {pull && (
          <blockquote className="font-display text-[28px] sm:text-[34px] leading-[1.2] text-amber-50 mb-10 max-w-2xl" style={{ fontFamily: "var(--display-family)" }}>
            &ldquo;{pull}&rdquo;
          </blockquote>
        )}
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
  const accessNote = (showcase as unknown as { access_note?: string }).access_note;
  const hasGettingThere = data.nearest_airport || data.nearest_city || accessNote;
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
            {accessNote && (
              <p className="text-[15px] text-volcanic-600 leading-[1.65] mt-4">{accessNote}</p>
            )}
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

// ── THINGS TO KNOW (derived hazards + authored rules/fees/etiquette) ────
interface TTKNote { label: string; note: string }
export function ThingsToKnowSection({ bundle }: { bundle: LegendaryPageBundle }) {
  const d = bundle.data as unknown as {
    waves?: { summary?: { character: string; biggest_month: string; calmest_month: string } };
    safety?: { shark_incidents_total?: number; lifeguard?: boolean };
    blue_flag?: boolean;
    water_quality?: { rating: string };
  };
  const authored: TTKNote[] = (bundle.showcase as unknown as { things_to_know?: TTKNote[] }).things_to_know ?? [];
  const items: TTKNote[] = [];

  // Derived — works on any beach with the data, no authoring needed.
  const w = d.waves?.summary;
  if (w && /Heavy|Exposed/.test(w.character)) {
    items.push({ label: "Surf & rip", note: `Powerful water — strongest around ${w.biggest_month}, gentlest in ${w.calmest_month}. Mind rip currents; this isn't a wade-in-anywhere beach.` });
  } else if (w && /Calm/.test(w.character)) {
    items.push({ label: "Swimming", note: `Usually calm water — among the gentler beaches for a swim.` });
  }
  if (d.safety?.shark_incidents_total === 0) {
    items.push({ label: "Sharks", note: "No incidents on record in the global shark-attack file." });
  } else if (typeof d.safety?.shark_incidents_total === "number" && d.safety.shark_incidents_total > 0) {
    items.push({ label: "Sharks", note: `${d.safety.shark_incidents_total} recorded incident${d.safety.shark_incidents_total === 1 ? "" : "s"} historically — check local signage.` });
  }
  if (d.safety?.lifeguard === false) items.push({ label: "Lifeguard", note: "No lifeguard service — swim within your limits." });
  if (d.blue_flag) items.push({ label: "Water quality", note: "Holds Blue Flag status for water quality and safety." });

  const all = [...authored, ...items];
  if (all.length === 0) return null;
  return (
    <section id="things_to_know" className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
      <SectionHeader eyebrow="Before you go" title="Things to know" />
      <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {all.map((t, i) => (
          <div key={i} className="flex gap-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-volcanic-400 w-28 shrink-0 pt-1">{t.label}</div>
            <p className="text-[15px] text-volcanic-700 leading-[1.6]">{t.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── SEA & SURF (wave climatology — serves surfers AND swim-safety) ──────
interface Waves {
  height_mean_m: (number | null)[];
  height_big_m: (number | null)[];
  period_mean_s: (number | null)[];
  summary: {
    annual_mean_m: number; biggest_month: string; biggest_month_m: number;
    calmest_month: string; calmest_month_m: number; typical_period_s: number | null;
    character: string;
  };
  source: string;
}
const WMONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
export function SeaSurfSection({ bundle, lead }: { bundle: LegendaryPageBundle; lead?: LeadImg }) {
  const w = (bundle.data as unknown as { waves?: Waves }).waves;
  if (!w) return null;
  const s = w.summary;
  const heights = w.height_mean_m;
  const bigs = w.height_big_m;
  const maxH = Math.max(1, ...heights.filter((h): h is number => h != null), ...bigs.filter((h): h is number => h != null));
  // Sheltered coves read "heavy" off open-water grid data — soften the claim.
  const swelly = s.typical_period_s != null && s.typical_period_s >= 8;
  return (
    <section id="sea_surf" className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
      <SectionLead img={lead} />
      <SectionHeader eyebrow="Sea & surf" title="What the water does" />
      <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] items-start">
        {/* Monthly wave-height chart */}
        <div>
          <svg viewBox="0 0 360 150" className="w-full h-auto">
            {heights.map((h, i) => {
              if (h == null) return null;
              const x = 10 + i * 29;
              const bh = (h / maxH) * 110;
              const big = bigs[i];
              return (
                <g key={i}>
                  {big != null && (
                    <rect x={x} y={120 - (big / maxH) * 110} width={18} height={(big / maxH) * 110} fill="var(--beach-primary,#0369a1)" opacity="0.18" />
                  )}
                  <rect x={x} y={120 - bh} width={18} height={bh} fill="var(--beach-primary,#0369a1)" opacity="0.65" />
                  <text x={x + 9} y={134} fontFamily="ui-monospace,monospace" fontSize="8" fill="#94a3b8" textAnchor="middle">{WMONTHS[i]}</text>
                </g>
              );
            })}
            <text x={10} y={12} fontFamily="ui-monospace,monospace" fontSize="8" fill="#94a3b8">metres (significant wave height)</text>
          </svg>
          <p className="text-[12px] text-volcanic-400 italic mt-2">
            Solid = typical monthly wave height; pale = the bigger days (90th pct).
            Offshore/regional swell from {w.source}; a sheltered cove may sit calmer than this.
          </p>
        </div>
        {/* Summary */}
        <div className="space-y-4">
          <div>
            <div className="font-display text-2xl text-volcanic-900 leading-tight">{s.character}</div>
          </div>
          <dl className="space-y-2 text-[15px]">
            <div className="flex justify-between border-b border-volcanic-100 pb-1.5"><dt className="text-volcanic-500">Typical wave height</dt><dd className="text-volcanic-900">{s.annual_mean_m} m</dd></div>
            <div className="flex justify-between border-b border-volcanic-100 pb-1.5"><dt className="text-volcanic-500">Biggest swell</dt><dd className="text-volcanic-900">{s.biggest_month} · {s.biggest_month_m} m</dd></div>
            <div className="flex justify-between border-b border-volcanic-100 pb-1.5"><dt className="text-volcanic-500">Calmest</dt><dd className="text-volcanic-900">{s.calmest_month} · {s.calmest_month_m} m</dd></div>
            {s.typical_period_s != null && (
              <div className="flex justify-between border-b border-volcanic-100 pb-1.5"><dt className="text-volcanic-500">Typical period</dt><dd className="text-volcanic-900">{s.typical_period_s} s {swelly ? "(groundswell)" : "(wind chop)"}</dd></div>
            )}
          </dl>
        </div>
      </div>
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

// ── BIBLIOGRAPHY (citations auto-compiled from source fields) ───────────
export function BibliographySection({ bundle }: { bundle: LegendaryPageBundle }) {
  const sh = bundle.showcase as unknown as {
    timeline?: { source?: string }[];
    landmarks?: { source?: string }[];
    cultural_refs?: { source?: string }[];
    key_facts?: { source?: string }[];
  };
  const counts = new Map<string, number>();
  const add = (s?: string) => {
    if (!s) return;
    const k = s.trim();
    if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
  };
  (sh.timeline ?? []).forEach((t) => add(t.source));
  (sh.landmarks ?? []).forEach((t) => add(t.source));
  (sh.cultural_refs ?? []).forEach((t) => add(t.source));
  (sh.key_facts ?? []).forEach((t) => add(t.source));
  const sources = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  if (sources.length === 0) return null;
  return (
    <section id="bibliography" className="mx-auto max-w-3xl px-6 py-16 border-t border-volcanic-100">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-volcanic-400 mb-5">Sources &amp; references</div>
      <ol className="space-y-2 list-decimal pl-5 marker:text-volcanic-300 marker:font-mono marker:text-[11px]">
        {sources.map(([src, n], i) => (
          <li key={i} className="text-[13px] text-volcanic-600 leading-[1.5]">
            {src}
            {n > 1 && <span className="text-volcanic-400"> · cited {n}×</span>}
          </li>
        ))}
      </ol>
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
