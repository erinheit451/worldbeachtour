import Link from "next/link";
import { getPreviewManifest } from "@/lib/preview";

export const metadata = {
  title: "Template preview — every-beach page validation set",
  robots: { index: false, follow: false },
};

export default function PreviewIndex() {
  const manifest = getPreviewManifest();
  const t1 = manifest.filter((m) => m.tier_gate === "T1");
  const t0 = manifest.filter((m) => m.tier_gate === "T0");

  return (
    <div className="bg-[#FBF9F4] min-h-screen">
      <div className="mx-auto max-w-3xl px-8 py-16">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral-500 mb-3">
          Internal · noindex · template validation
        </div>
        <h1 className="font-display text-4xl text-volcanic-900 mb-3">
          The every-beach page — 20-sample walk
        </h1>
        <p className="text-volcanic-600 mb-2 leading-relaxed">
          The T0 (Stub) and T1 (Standard) templates, rendered against the
          deliberately-diverse validation set. Tier gate:{" "}
          <strong>T1 = named&nbsp;+&nbsp;Wikidata</strong>; everything else T0.
        </p>
        <p className="text-volcanic-500 text-sm mb-10">
          {t1.length} T1 · {t0.length} T0 · {manifest.length} total
        </p>

        <Section title={`T1 — Standard (named + Wikidata) · ${t1.length}`} rows={t1} />
        <Section title={`T0 — Stub (field guide) · ${t0.length}`} rows={t0} />
      </div>
    </div>
  );
}

function Section({
  title,
  rows,
}: {
  title: string;
  rows: ReturnType<typeof getPreviewManifest>;
}) {
  return (
    <section className="mb-12">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ocean-800 mb-4 flex items-center gap-3">
        <span className="inline-block w-6 h-px bg-ocean-800" />
        {title}
      </h2>
      <ul className="divide-y divide-volcanic-100 border-y border-volcanic-100">
        {rows.map((m) => (
          <li key={m.slug}>
            <Link
              href={`/preview/${m.slug}`}
              className="flex items-baseline justify-between gap-4 py-3 px-2 hover:bg-white/60 transition-colors"
            >
              <span className="font-display text-lg text-volcanic-900">
                {m.name || (
                  <span className="text-volcanic-400 italic">
                    unnamed · {m.slug}
                  </span>
                )}
              </span>
              <span className="font-mono text-xs text-volcanic-400 whitespace-nowrap">
                {m.completeness != null ? `${m.completeness}% data` : "—"} ·{" "}
                {m.neighbors} nearby
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
