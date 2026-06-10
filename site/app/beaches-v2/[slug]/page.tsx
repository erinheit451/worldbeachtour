/**
 * Legendary page v2 preview route.
 *
 * URL: /beaches-v2/<slug>
 * Renders any Tier 1 / Tier 2 beach through the new <LegendaryBeachV2> scaffold.
 * Reads composition.json + meta.json + showcase.json + data/<slug>.json.
 *
 * Preview route — existing /beaches/<slug> routes are unchanged.
 */

import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegendaryBeachV2 from "@/components/legendary-v2/legendary-beach-v2";
import NazareV2Page from "@/components/legendary-v2/nazare-v2";
import WaikikiV2Page from "@/components/legendary-v2/waikiki-v2";
import SaoMartinhoPage from "@/components/legendary-v2/sao-martinho-v2";
import PenichePage from "@/components/legendary-v2/peniche-v2";
import BrightonPage from "@/components/legendary-v2/brighton-v2";
import BondiPage from "@/components/legendary-v2/bondi-v2";
import CopaPage from "@/components/legendary-v2/copa-v2";
import PipelinePage from "@/components/legendary-v2/pipeline-v2";
import MalibuPage from "@/components/legendary-v2/malibu-v2";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

const CONTENT_DIR = path.join(process.cwd(), "content", "beaches");

function listSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((slug) => fs.existsSync(path.join(CONTENT_DIR, slug, "composition.json")));
}

export function generateStaticParams() {
  return listSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bundle = loadBundle(slug);
  if (!bundle) return {};
  const { composition, data } = bundle;
  const description =
    composition.spike_statement ??
    composition.subtitle ??
    `The canonical page about ${composition.beach_name}, ${data.admin_level_1}.`;
  return {
    title: `${composition.beach_name} — World Beach Tour`,
    description,
    alternates: {
      canonical: `https://worldbeachtour.com/beaches/${slug}`,
    },
    robots: { index: false, follow: true },
  };
}

export default async function LegendaryV2Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = loadBundle(slug);
  if (!bundle) notFound();
  if (slug === "praia-do-norte-6") {
    return <NazareV2Page bundle={bundle!} />;
  }
  if (slug === "waikiki-beach-1") {
    return <WaikikiV2Page bundle={bundle!} />;
  }
  if (slug === "sao-martinho-do-porto") {
    return <SaoMartinhoPage bundle={bundle!} />;
  }
  if (slug === "peniche") {
    return <PenichePage bundle={bundle!} />;
  }
  if (slug === "brighton-beach-1") {
    return <BrightonPage bundle={bundle!} />;
  }
  if (slug === "bondi-beach") {
    return <BondiPage bundle={bundle!} />;
  }
  if (slug === "copacabana-7") {
    return <CopaPage bundle={bundle!} />;
  }
  if (slug === "pipeline") {
    return <PipelinePage bundle={bundle!} />;
  }
  if (slug === "malibu") {
    return <MalibuPage bundle={bundle!} />;
  }
  return <LegendaryBeachV2 bundle={bundle!} />;
}
