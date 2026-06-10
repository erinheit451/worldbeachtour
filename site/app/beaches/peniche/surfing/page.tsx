import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PenicheSurfPage from "@/components/legendary-v2/peniche/surfing";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Surfing Peniche — Supertubos, Baleal, and the WSL Championship Tour",
  description:
    "Which Peniche break matches which skill level, why Supertubos barrels the way it does, what the MEO Rip Curl Pro is like as a visitor, how to choose among 30+ Baleal surf schools, and how Peniche compares to Ericeira and Nazaré.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/peniche/surfing",
  },
};

export default function Page() {
  const bundle = loadBundle("peniche");
  if (!bundle) notFound();
  return <PenicheSurfPage bundle={bundle!} />;
}
