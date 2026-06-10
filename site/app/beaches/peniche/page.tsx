import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PenichePage from "@/components/legendary-v2/peniche-v2";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Peniche — Portugal's surf capital, built around a 16th-century political prison",
  description:
    "The rocky peninsula 95 km north of Lisbon that hosts the WSL Championship Tour at Supertubos and the Salazar-era political prison at the Fortaleza. Plus the UNESCO biosphere archipelago of the Berlengas, ten kilometers offshore. Portugal's surf coast in one town.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/peniche",
  },
};

export default function Page() {
  const bundle = loadBundle("peniche");
  if (!bundle) notFound();
  return <PenichePage bundle={bundle!} />;
}
