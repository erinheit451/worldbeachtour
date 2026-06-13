/**
 * Live instrument registry — the Tier-1 "data axis" live layer.
 *
 * Only beaches with a mapped buoy/tide station get true live feeds (the
 * "live-station map" DB gap). Huntington is the first, reusing the pilot's
 * NDBC/NOAA components. Others return null until they're mapped — the page
 * degrades to the season-surf climatology, which is site-wide.
 *
 * Same per-beach-registry pattern as the signature visuals.
 */

import type { LegendaryPageBundle } from "../types";
import { LiveConditions, PlanYourTrip } from "@/components/pilot/live-and-revenue";

function HuntingtonLive({ bundle }: { bundle: LegendaryPageBundle }) {
  const d = bundle.data;
  return (
    <section id="live_now" className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <div className="text-[11px] font-mono uppercase tracking-[0.3em] mb-6" style={{ color: "var(--beach-primary, #475569)" }}>
        Right now
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <LiveConditions />
        <PlanYourTrip
          city="Huntington Beach"
          lat={d.centroid_lat}
          lng={d.centroid_lng}
          iata={d.nearest_airport?.iata ?? "SNA"}
        />
      </div>
    </section>
  );
}

const LIVE: Record<string, (p: { bundle: LegendaryPageBundle }) => React.ReactNode> = {
  "huntington-city-beach": HuntingtonLive,
};

export function LiveInstrument({ bundle }: { bundle: LegendaryPageBundle }) {
  const Comp = LIVE[bundle.composition.slug];
  return Comp ? <>{Comp({ bundle })}</> : null;
}
