import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NazarePilgrimagePage from "@/components/legendary-v2/nazare/pilgrimage";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "The Sanctuary of Nazaré — the Lenda, the Santuário, the 8 September Festas",
  description:
    "The 900-year Marian tradition on the Sítio clifftop — the Lenda da Nazaré, the Santuário de Nossa Senhora da Nazaré consecrated 1377, the Ermida da Memória, and the Festas da Senhora that still draws ~100,000 pilgrims every 8 September.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/praia-do-norte-6/sanctuary",
  },
};

export default function Page() {
  const bundle = loadBundle("praia-do-norte-6");
  if (!bundle) notFound();
  return <NazarePilgrimagePage bundle={bundle!} />;
}
