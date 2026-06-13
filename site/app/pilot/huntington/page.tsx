import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import HuntingtonPilot, { type HuntingtonData } from "@/components/pilot/huntington-pilot";

export const metadata: Metadata = {
  title: "Huntington Beach — Surf City USA, season by season | Adaptive pilot",
  description:
    "One adaptive page for every visitor to Huntington Beach: surfable beach break (W swell in winter, SW in summer), fair swimming, true over-water sunsets, 90% quartz sand, live buoy + tide feeds, and trip planning — all from the data.",
};

function loadData(): HuntingtonData {
  const file = path.join(process.cwd(), "data", "beaches", "huntington-city-beach.json");
  const raw = fs.readFileSync(file, "utf-8");
  return JSON.parse(raw) as HuntingtonData;
}

export default function Page() {
  const data = loadData();
  return <HuntingtonPilot data={data} />;
}
