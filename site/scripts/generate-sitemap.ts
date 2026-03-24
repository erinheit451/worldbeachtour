/**
 * Post-build script: generates sitemap.xml from the static export.
 * Run after `next build`: npx tsx scripts/generate-sitemap.ts
 */
import fs from "fs";
import path from "path";

const BASE_URL = "https://worldbeachtour.com";
const OUT_DIR = path.join(__dirname, "..", "out");

function collectPages(dir: string, base = ""): string[] {
  const urls: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.posix.join(base, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith("_") || entry.name === "__next") continue;
      urls.push(...collectPages(path.join(dir, entry.name), rel));
    } else if (entry.name.endsWith(".html") && !entry.name.startsWith("_")) {
      if (entry.name === "index.html") {
        urls.push(base ? `/${base}` : "/");
      } else if (entry.name === "404.html") {
        continue;
      } else {
        const route = rel.replace(/\.html$/, "");
        urls.push(`/${route}`);
      }
    }
  }
  return urls;
}

const urls = collectPages(OUT_DIR).sort();

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${BASE_URL}${url}</loc>
    <changefreq>${url === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${url === "/" ? "1.0" : url.split("/").length <= 3 ? "0.8" : "0.6"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(OUT_DIR, "sitemap.xml"), xml);
console.log(`Generated sitemap.xml with ${urls.length} URLs`);
