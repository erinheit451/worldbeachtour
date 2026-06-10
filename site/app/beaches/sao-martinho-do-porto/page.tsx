import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SaoMartinhoPage from "@/components/legendary-v2/sao-martinho-v2";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "São Martinho do Porto — the shell-shaped bay of the Portuguese Silver Coast",
  description:
    "Portugal's almost-perfectly-circular Atlantic bay: 2 km across, a 200-meter opening to the open ocean, and the calmest swimmable water on the country's west coast. A 900-year-old Cistercian fishery that became the Silver Coast's family beach, ten kilometers south of Nazaré.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/sao-martinho-do-porto",
  },
};

export default function Page() {
  const bundle = loadBundle("sao-martinho-do-porto");
  if (!bundle) notFound();
  return <SaoMartinhoPage bundle={bundle!} />;
}
