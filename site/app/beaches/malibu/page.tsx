import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MalibuPage from "@/components/legendary-v2/malibu-v2";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "Surfrider Beach (Malibu) — the mile of sand that became a language",
  description:
    "The three-point cobblestone right-hander where the longboard canon was written, modern surf culture was packaged for the world, and the Clean Water Act grew teeth. First Point, Miki Dora, Gidget, the Beach Boys, the Endless Summer, Humaliwo, and the Surfrider Foundation — one honest telling of Malibu's wave.",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/malibu",
  },
};

export default function Page() {
  const bundle = loadBundle("malibu");
  if (!bundle) notFound();
  return <MalibuPage bundle={bundle!} />;
}
