/**
 * <Sources> — the page's colophon + provenance footer.
 *
 * First-draft rendering: simple version. Renders byline, version,
 * photography-status, and a list of data sources.
 *
 * See docs/legendary/components.md PART B.
 */

import type { Composition } from "../types";

interface SourcesProps {
  composition: Composition;
  tideSource?: string;
  climateSource?: string;
  lastReviewed?: string;
  doneness?: {
    declared_version: string;
    final_version: string;
  };
}

export default function Sources({
  composition,
  tideSource,
  climateSource,
  lastReviewed = "2026-04-19",
  doneness,
}: SourcesProps) {
  const version = doneness?.final_version ?? composition.version;
  const hasDowngrade =
    doneness && doneness.final_version !== doneness.declared_version;

  const photoStatus = composition.photography_grading_status ?? "tier_b_only";
  const photoStatusLabel = {
    tier_a_commissioned: "Editorial-graded (Tier A)",
    tier_b_only: "Archival, original tone (Tier B — Wikimedia Commons)",
    hybrid: "Hybrid (Tier A + Tier B, labelled per image)",
  }[photoStatus];

  return (
    <section
      id="sources"
      className="border-t bg-[#F0EEE8] py-16 mt-20"
      style={{ borderColor: "var(--color-rule, #E5E5E5)" }}
    >
      <div className="mx-auto max-w-5xl px-6">
        <div
          className="text-[11px] font-mono uppercase tracking-[0.3em] text-volcanic-600 mb-4"
          style={{ color: "var(--beach-primary)" }}
        >
          Colophon · Provenance
        </div>
        <h2
          className="font-display text-3xl text-volcanic-900 mb-10"
          style={{ fontFamily: "var(--display-family, var(--font-serif))" }}
        >
          Where this page comes from
        </h2>

        <dl className="grid gap-6 md:grid-cols-2 text-sm text-volcanic-700 leading-relaxed">
          <div>
            <dt className="font-display text-base text-volcanic-900 mb-1">
              Geography, facilities
            </dt>
            <dd>
              OpenStreetMap (ODbL) for geometry and facility tags within 500 m
              of the beach centroid. GeoNames for city/airport distances.
            </dd>
          </div>
          <div>
            <dt className="font-display text-base text-volcanic-900 mb-1">
              Climate &amp; ocean
            </dt>
            <dd>{climateSource ?? "Open-Meteo ERA5 + Marine archive, 2014–2023 monthly normals."}</dd>
          </div>
          {tideSource && (
            <div>
              <dt className="font-display text-base text-volcanic-900 mb-1">
                Tides
              </dt>
              <dd>{tideSource}</dd>
            </div>
          )}
          <div>
            <dt className="font-display text-base text-volcanic-900 mb-1">
              Photography
            </dt>
            <dd>{photoStatusLabel}. Each image licensed per its own terms; attribution visible inline.</dd>
          </div>
          <div>
            <dt className="font-display text-base text-volcanic-900 mb-1">
              History &amp; culture
            </dt>
            <dd>
              Every factual claim is linked to its source in the prose above.
              Wikipedia citations inline. Non-wiki sources named where relevant.
            </dd>
          </div>
          <div>
            <dt className="font-display text-base text-volcanic-900 mb-1">
              Editorial voice
            </dt>
            <dd>
              Register: <em>{composition.levers.voice_register.toLowerCase()}</em>.
              Written to pass a local&apos;s nod test; corrections welcome.
            </dd>
          </div>
        </dl>

        <div
          className="mt-12 pt-8 border-t flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          style={{ borderColor: "var(--color-rule, #E5E5E5)" }}
        >
          <div>
            <div className="text-sm text-volcanic-700">{composition.byline}</div>
            <div className="text-xs text-volcanic-500 mt-1">
              Last reviewed {lastReviewed}
            </div>
          </div>
          <div className="text-xs font-mono text-volcanic-500 sm:text-right">
            <span>
              {hasDowngrade && (
                <span className="text-volcanic-600 mr-2">
                  v{doneness!.declared_version} declared
                </span>
              )}
              v{version} — {version.startsWith("1.") ? "reference-grade" : "in editorial development toward v1.0"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
