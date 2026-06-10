/**
 * Image CLI — Wikimedia Commons search + fetch with license capture.
 *
 *   npx tsx scripts/images.ts search "Malibu Surfrider Beach"
 *       List top candidates: title, author, license, dims, source URL.
 *
 *   npx tsx scripts/images.ts fetch <beach-slug> <manifest.json>
 *       Download files into public/<slug>/, write/merge into content/beaches/<slug>/meta.json.
 *
 * Manifest shape (role key → entry):
 *   {
 *     "hero": {
 *       "filename": "hero-beach.jpg",
 *       "source_url": "https://commons.wikimedia.org/wiki/File:Foo.jpg"
 *     },
 *     "section:first_point": {
 *       "filename": "first-point.jpg",
 *       "source_url": "https://commons.wikimedia.org/wiki/File:Bar.jpg"
 *     }
 *   }
 *
 * The script fills in title/author/license/dims from Commons.
 */
import { writeFile, readFile, mkdir, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { argv, exit } from "node:process";

const UA = "WorldBeachTour/1.0 (https://worldbeachtour.com; erinrose451@gmail.com)";
const API = "https://commons.wikimedia.org/w/api.php";

type Candidate = {
  title: string;
  filename: string;
  author: string;
  license: string;
  width: number;
  height: number;
  original_url: string;
  thumb_url: string;
  source_url: string;
};

async function apiGet(params: Record<string, string>): Promise<any> {
  const url = new URL(API);
  url.search = new URLSearchParams({ format: "json", origin: "*", ...params }).toString();
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`${r.status} ${url.toString()}`);
  return r.json();
}

function extractText(v: any): string {
  if (!v) return "";
  if (typeof v === "string") return v.replace(/<[^>]+>/g, "").trim();
  if (v.value !== undefined) return String(v.value).replace(/<[^>]+>/g, "").trim();
  if (v["*"]) return String(v["*"]).replace(/<[^>]+>/g, "").trim();
  return "";
}

async function getImageInfo(title: string): Promise<Candidate | null> {
  const j = await apiGet({
    action: "query",
    titles: title,
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "3840",
  });
  const pages = j?.query?.pages ?? {};
  const page = Object.values(pages)[0] as any;
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  const meta = info.extmetadata || {};
  return {
    title: extractText(meta.ObjectName) || title.replace(/^File:/, "").replace(/\.[^.]+$/, ""),
    filename: title.replace(/^File:/, ""),
    author: extractText(meta.Artist) || "Unknown",
    license: extractText(meta.LicenseShortName) || extractText(meta.License) || "Unknown",
    width: Number(info.width),
    height: Number(info.height),
    original_url: info.url,
    thumb_url: info.thumburl || info.url,
    source_url: info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(title)}`,
  };
}

async function cmdSearch(query: string, limit = 25): Promise<void> {
  const j = await apiGet({
    action: "query",
    list: "search",
    srsearch: query,
    srnamespace: "6",
    srlimit: String(limit),
  });
  const hits = j?.query?.search ?? [];
  if (!hits.length) {
    console.log("(no results)");
    return;
  }
  let shown = 0;
  for (const hit of hits) {
    if (shown >= 12) break;
    if (!/\.(jpe?g|png)$/i.test(hit.title)) continue;
    const info = await getImageInfo(hit.title);
    if (!info) continue;
    if (info.width < 1200) continue;
    console.log(
      `\n  ${info.title}\n` +
        `    file:    ${info.filename}\n` +
        `    author:  ${info.author}\n` +
        `    license: ${info.license}\n` +
        `    dims:    ${info.width}×${info.height}\n` +
        `    source:  ${info.source_url}`
    );
    shown++;
  }
  if (shown === 0) console.log("  (no image results meeting criteria)");
}

function titleFromSourceUrl(url: string): string {
  const m = url.match(/\/wiki\/(File:.+)$/);
  if (!m) throw new Error(`Cannot parse Commons URL: ${url}`);
  return decodeURIComponent(m[1]).replace(/_/g, " ");
}

async function download(url: string, dest: string): Promise<number> {
  await mkdir(dirname(dest), { recursive: true });
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 5000) throw new Error(`Response too small (${buf.length} bytes) — likely an error page`);
  await writeFile(dest, buf);
  return buf.length;
}

function setPath(obj: any, path: string[], value: any): void {
  let cur = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const k = path[i];
    if (typeof cur[k] !== "object" || cur[k] === null) cur[k] = {};
    cur = cur[k];
  }
  cur[path[path.length - 1]] = value;
}

async function cmdFetch(slug: string, manifestPath: string): Promise<void> {
  const manifest = JSON.parse(await readFile(manifestPath, "utf-8"));
  const metaPath = join("content", "beaches", slug, "meta.json");
  let meta: any;
  try {
    meta = JSON.parse(await readFile(metaPath, "utf-8"));
  } catch {
    meta = { tier: 1, showcase: true, lenses: [], custom: [], images: {} };
  }
  if (!meta.images) meta.images = {};

  const publicDir = join("public", slug);
  await mkdir(publicDir, { recursive: true });

  let ok = 0;
  let fail = 0;

  for (const [role, entry] of Object.entries<any>(manifest)) {
    const filename = entry.filename;
    const sourceUrl = entry.source_url;
    if (!filename || !sourceUrl) {
      console.log(`  [skip] ${role}: manifest needs filename + source_url`);
      fail++;
      continue;
    }
    const dest = join(publicDir, filename);
    try {
      const title = titleFromSourceUrl(sourceUrl);
      const info = await getImageInfo(title);
      if (!info) throw new Error("Commons returned no imageinfo");
      const existing = await stat(dest).catch(() => null);
      if (!existing || existing.size < 5000) {
        const bytes = await download(info.original_url, dest);
        console.log(`  [ok]   ${role} → ${filename} (${Math.round(bytes / 1024)}KB)`);
      } else {
        console.log(`  [skip] ${role} → ${filename} (already on disk)`);
      }
      const rec = {
        url: `/${slug}/${filename}`,
        title: entry.title || info.title,
        author: entry.author || info.author,
        license: entry.license || info.license,
        source_url: info.source_url,
        width: info.width,
        height: info.height,
        role,
      };
      if (role === "hero") {
        setPath(meta, ["images", "hero"], rec);
      } else if (role.startsWith("section:")) {
        const key = role.slice("section:".length);
        setPath(meta, ["images", "section", key], rec);
      } else {
        setPath(meta, ["images", role], rec);
      }
      ok++;
      await new Promise((r) => setTimeout(r, 400));
    } catch (e: any) {
      console.log(`  [FAIL] ${role}: ${e.message}`);
      fail++;
    }
  }

  await writeFile(metaPath, JSON.stringify(meta, null, 2));
  console.log(`\n${ok} ok, ${fail} fail. meta.json written → ${metaPath}`);
}

async function main() {
  const [, , cmd, ...rest] = argv;
  if (cmd === "search") {
    const q = rest.join(" ").trim();
    if (!q) throw new Error("usage: images.ts search <query>");
    await cmdSearch(q);
  } else if (cmd === "fetch") {
    const [slug, manifest] = rest;
    if (!slug || !manifest) throw new Error("usage: images.ts fetch <beach-slug> <manifest.json>");
    await cmdFetch(slug, manifest);
  } else {
    console.error("usage: images.ts <search|fetch> ...");
    exit(1);
  }
}

main().catch((e) => {
  console.error(e.message);
  exit(1);
});
