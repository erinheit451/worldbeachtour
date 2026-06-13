"use client";

/**
 * LensReorder — the adaptive shell for Tier-1 pages.
 *
 * Takes the page's reorderable body sections (already server-rendered nodes)
 * and lets the visitor pick a lens (Surf / Family / Photographer / …). The
 * lens floats its relevant sections to the top — the pilot's signature move,
 * applied to the full editorial + data section set. The section NODES are
 * server-rendered RSC payloads; this client component only controls their order,
 * so the heavy content stays on the server.
 */

import { useMemo, useState } from "react";
import {
  Waves, Sun, Users, Camera, Mountain, BookOpen,
} from "lucide-react";

export interface ReorderItem {
  id: string;
  node: React.ReactNode;
}

interface Lens {
  id: string;
  label: string;
  icon: React.ReactNode;
  /** section ids to float to the top, in priority order */
  emphasize: string[];
}

const LENSES: Lens[] = [
  { id: "story", label: "The story", icon: <BookOpen className="h-4 w-4" />, emphasize: ["story", "spike_deep_explainer", "culture", "timeline", "honest_reckoning"] },
  { id: "surf", label: "Surf", icon: <Waves className="h-4 w-4" />, emphasize: ["sea_surf", "things_to_know", "comparison", "plan_stack"] },
  { id: "swim", label: "Swim & family", icon: <Users className="h-4 w-4" />, emphasize: ["things_to_know", "sea_surf", "plan_stack", "day_in_life"] },
  { id: "photo", label: "Photography", icon: <Camera className="h-4 w-4" />, emphasize: ["gallery", "day_in_life", "place_anatomy"] },
  { id: "nature", label: "Nature", icon: <Mountain className="h-4 w-4" />, emphasize: ["place_anatomy", "sea_surf", "comparison", "honest_reckoning"] },
  { id: "plan", label: "Plan a trip", icon: <Sun className="h-4 w-4" />, emphasize: ["plan_stack", "things_to_know", "sea_surf", "day_in_life"] },
];

function orderFor(emphasize: string[], ids: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const e of emphasize) if (ids.includes(e) && !seen.has(e)) { out.push(e); seen.add(e); }
  for (const id of ids) if (!seen.has(id)) out.push(id);
  return out;
}

export default function LensReorder({ items }: { items: ReorderItem[] }) {
  const ids = useMemo(() => items.map((i) => i.id), [items]);
  const [active, setActive] = useState<string>("story");
  const order = useMemo(() => {
    const lens = LENSES.find((l) => l.id === active);
    return lens ? orderFor(lens.emphasize, ids) : ids;
  }, [active, ids]);
  const byId = useMemo(() => new Map(items.map((i) => [i.id, i.node])), [items]);

  return (
    <div>
      <div className="sticky top-0 z-40 -mx-px border-y border-volcanic-100 bg-white/85 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-3 flex items-center gap-2 overflow-x-auto">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-volcanic-400 shrink-0 mr-1">I&rsquo;m here for</span>
          {LENSES.map((lens) => {
            const on = lens.id === active;
            return (
              <button
                key={lens.id}
                onClick={() => setActive(lens.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                  on ? "text-white shadow-sm" : "border-volcanic-200 bg-white text-volcanic-600 hover:border-volcanic-300"
                }`}
                style={on ? { background: "var(--beach-primary, #0f172a)", borderColor: "var(--beach-primary, #0f172a)" } : undefined}
              >
                {lens.icon}
                {lens.label}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        {order.map((id) => (
          <div key={id}>{byId.get(id)}</div>
        ))}
      </div>
    </div>
  );
}
