import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PenicheBerlengasPage from "@/components/legendary-v2/peniche/berlengas";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "The Berlengas — the UNESCO biosphere archipelago off Peniche",
  description:
    "Three small granite islands ten kilometers off the Portuguese coast. UNESCO Biosphere Reserve since 2011. How to book the permit-limited boat, what to do on the island, whether to sleep in the 17th-century fort, and the rules the Portuguese nature authority enforces.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/peniche/berlengas",
  },
};

export default function Page() {
  const bundle = loadBundle("peniche");
  if (!bundle) notFound();
  return <PenicheBerlengasPage bundle={bundle!} />;
}
