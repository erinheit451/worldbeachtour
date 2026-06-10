/**
 * Server-side loader for the full legendary page bundle (composition,
 * meta, showcase, data). Used by [slug]/page.tsx and by Nazaré spoke
 * routes.
 */

import fs from "fs";
import path from "path";
import type {
  LegendaryPageBundle,
  Composition,
  BeachMeta,
  Showcase,
  BeachData,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "beaches");
const DATA_DIR = path.join(process.cwd(), "data", "beaches");

export function loadBundle(slug: string): LegendaryPageBundle | null {
  const dir = path.join(CONTENT_DIR, slug);
  const compositionPath = path.join(dir, "composition.json");
  const metaPath = path.join(dir, "meta.json");
  const showcasePath = path.join(dir, "showcase.json");
  const dataPath = path.join(DATA_DIR, `${slug}.json`);

  if (!fs.existsSync(compositionPath)) return null;
  if (!fs.existsSync(metaPath)) return null;
  if (!fs.existsSync(dataPath)) return null;

  const composition: Composition = JSON.parse(
    fs.readFileSync(compositionPath, "utf-8")
  );
  const meta: BeachMeta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  const showcase: Showcase = fs.existsSync(showcasePath)
    ? JSON.parse(fs.readFileSync(showcasePath, "utf-8"))
    : {};
  const data: BeachData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  return { composition, meta, showcase, data };
}
