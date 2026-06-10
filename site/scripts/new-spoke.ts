/**
 * Scaffold a new spoke for a Tier 1 legendary beach cluster.
 *
 *   npx tsx scripts/new-spoke.ts <beach-slug> <spoke-slug> "<Spoke Label>" "<Subtitle sentence.>" <type>
 *
 * Example:
 *   npx tsx scripts/new-spoke.ts malibu first-point "First Point" "The longboard wave that invented modern surf culture, from Gidget to Miki Dora." deep_dive
 *
 * Creates (idempotent — will not overwrite existing files):
 *   - site/components/legendary-v2/<beach>/<spoke>.tsx   stub component
 *   - site/app/beaches/<beach>/<spoke>/page.tsx          route file with metadata
 *   - appends spoke entry to content/beaches/<beach>/composition.json
 *
 * Prints the exact snippets to paste into the cluster's shared.tsx
 * (spokes map entry + ClusterRail item + SpokeCrossNav grid-cols update).
 */
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { argv, exit } from "node:process";

type SpokeType = "audience_guide" | "deep_dive" | "honest_reckoning_expansion";

function pascal(s: string): string {
  return s.replace(/(^|[-_])([a-z])/g, (_, __, c) => c.toUpperCase());
}

async function exists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const [, , beach, spoke, label, subtitle, type] = argv;
  if (!beach || !spoke || !label || !subtitle || !type) {
    console.error(
      'usage: new-spoke.ts <beach-slug> <spoke-slug> "<Label>" "<Subtitle>" <audience_guide|deep_dive|honest_reckoning_expansion>'
    );
    exit(1);
  }
  const spokeType = type as SpokeType;

  const compPath = join("components", "legendary-v2", beach, `${spoke}.tsx`);
  const routePath = join("app", "beaches", beach, spoke, "page.tsx");
  const compositionPath = join("content", "beaches", beach, "composition.json");

  // 1. composition.json — append spoke if absent
  const compJson = JSON.parse(await readFile(compositionPath, "utf-8"));
  if (!Array.isArray(compJson.spokes)) compJson.spokes = [];
  if (!compJson.spokes.some((s: any) => s.slug === spoke)) {
    compJson.spokes.push({ slug: spoke, type: spokeType });
    await writeFile(compositionPath, JSON.stringify(compJson, null, 2) + "\n");
    console.log(`  [ok]   composition.json += ${spoke} (${spokeType})`);
  } else {
    console.log(`  [skip] composition.json already has ${spoke}`);
  }

  // 2. component stub
  if (!(await exists(compPath))) {
    await mkdir(join("components", "legendary-v2", beach), { recursive: true });
    const componentName = `${pascal(beach)}${pascal(spoke)}Page`;
    const stub = `/**
 * ${pascal(beach)} cluster — ${label} (${spokeType.replace(/_/g, " ")}).
 *
 * ${subtitle}
 */
"use client";

import type { BundleShape } from "../load-bundle";
import { Section, SectionHeader, EYEBROW, H2, BODY } from "../nazare/shared";
import { ClusterRail, SpokeCrossNav } from "./shared";

export default function ${componentName}({ bundle }: { bundle: BundleShape }) {
  return (
    <article className="bg-[#FAFAF7] text-volcanic-900">
      <ClusterRail current="${spoke}" beachName="${pascal(beach)}" />
      <header className="border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className={\`\${EYEBROW} mb-4\`}>· ${pascal(beach)} spoke · ${spokeType.replace(/_/g, " ")}</div>
          <h1
            className="font-display text-[56px] sm:text-[84px] leading-[0.9] -tracking-[0.01em] text-volcanic-900 uppercase"
            style={{ fontFamily: "var(--display-family, var(--font-barlow-condensed))" }}
          >
            ${label}
          </h1>
          <p className={\`\${BODY} mt-6 max-w-2xl\`}>${subtitle}</p>
        </div>
      </header>

      <Section>
        <SectionHeader eyebrow="Section one" title="TODO" />
        <p className={BODY}>Replace this with the first section's prose.</p>
      </Section>

      <SpokeCrossNav current="${spoke}" />
    </article>
  );
}
`;
    await writeFile(compPath, stub);
    console.log(`  [ok]   wrote ${compPath}`);
  } else {
    console.log(`  [skip] ${compPath} exists`);
  }

  // 3. route file
  if (!(await exists(routePath))) {
    await mkdir(join("app", "beaches", beach, spoke), { recursive: true });
    const componentName = `${pascal(beach)}${pascal(spoke)}Page`;
    const route = `import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ${componentName} from "@/components/legendary-v2/${beach}/${spoke}";
import { loadBundle } from "@/components/legendary-v2/load-bundle";

export const metadata: Metadata = {
  title: "${label} — TODO title",
  description:
    "${subtitle}",
  alternates: {
    canonical: "https://worldbeachtour.com/beaches/${beach}/${spoke}",
  },
};

export default function Page() {
  const bundle = loadBundle("${beach}");
  if (!bundle) notFound();
  return <${componentName} bundle={bundle!} />;
}
`;
    await writeFile(routePath, route);
    console.log(`  [ok]   wrote ${routePath}`);
  } else {
    console.log(`  [skip] ${routePath} exists`);
  }

  // 4. print paste-in snippets for shared.tsx
  const railLine = `    { key: "${spoke}", label: "${label}", href: \`\${${beach.toUpperCase()}_MAIN}/${spoke}\` },`;
  const spokesEntry = `  "${spoke}": {
    slug: "${spoke}",
    label: "${label}",
    subtitle:
      "${subtitle}",
  },`;

  console.log(`
-----------------------------------------------------------
PASTE into components/legendary-v2/${beach}/shared.tsx:

  Inside ${beach.toUpperCase()}_SPOKES (or equivalent) object:

${spokesEntry}

  Inside ClusterRail items array:

${railLine}

  Inside SpokeCrossNav — update the grid to account for the new spoke
  (e.g. grid-cols-4 → grid-cols-5, or keep 2-up/3-up responsive).

  Also update app/beaches-v2/[slug]/page.tsx if there's a dynamic branch
  for this beach — make sure the cluster continues to route correctly.
-----------------------------------------------------------
`);
}

main().catch((e) => {
  console.error(e.message);
  exit(1);
});
