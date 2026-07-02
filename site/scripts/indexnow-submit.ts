/**
 * IndexNow submission — instant-indexing ping for Bing, Yandex, Seznam, and
 * other IndexNow participants (Google does NOT use IndexNow; it discovers via
 * the sitemap + Search Console).
 *
 * Usage:
 *   npx tsx scripts/indexnow-submit.ts            # submit every canonical URL
 *   npx tsx scripts/indexnow-submit.ts <url> ...  # submit only the given URLs
 *
 * The key file public/<KEY>.txt must be live at https://worldbeachtour.com/<KEY>.txt
 * (deploy first) — IndexNow fetches it to prove ownership.
 */
import fs from "fs";
import path from "path";
import { getAllBeachSlugs, getBeachData } from "../lib/beaches";
import { getCountries, getStatesByCountry } from "../lib/regions";

const HOST = "worldbeachtour.com";
const BASE_URL = `https://${HOST}`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

// The IndexNow key is public by design (served at /<key>.txt for ownership
// verification). Its single source of truth is the key file in public/, so we
// read it from there rather than duplicating the value in code.
function loadKey(): string {
  const publicDir = path.join(__dirname, "..", "public");
  const keyFile = fs.readdirSync(publicDir).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
  if (!keyFile) {
    throw new Error("No IndexNow key file (public/<32-hex>.txt) found.");
  }
  return keyFile.replace(/\.txt$/, "");
}

const KEY = loadKey();

function allUrls(): string[] {
  const urls = [
    `${BASE_URL}/`,
    `${BASE_URL}/beaches`,
    `${BASE_URL}/regions`,
    `${BASE_URL}/sand`,
  ];
  const slugs = getAllBeachSlugs();
  for (const slug of slugs) urls.push(`${BASE_URL}/beaches/${slug}`);
  for (const slug of slugs) {
    if (getBeachData(slug)?.sand) urls.push(`${BASE_URL}/sand/${slug}`);
  }
  for (const { code } of getCountries()) {
    const country = code.toLowerCase();
    urls.push(`${BASE_URL}/regions/${country}`);
    for (const { state } of getStatesByCountry(code)) {
      urls.push(`${BASE_URL}/regions/${country}/${state.toLowerCase().replace(/\s+/g, "-")}`);
    }
  }
  return urls;
}

async function main() {
  const cliUrls = process.argv.slice(2);
  const urlList = cliUrls.length > 0 ? cliUrls : allUrls();

  // IndexNow accepts up to 10,000 URLs per request.
  const batches: string[][] = [];
  for (let i = 0; i < urlList.length; i += 10000) {
    batches.push(urlList.slice(i, i + 10000));
  }

  for (const [i, batch] of batches.entries()) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: `${BASE_URL}/${KEY}.txt`,
        urlList: batch,
      }),
    });
    // 200 or 202 = accepted. 403 = key not found (deploy the key file first).
    console.log(`batch ${i + 1}/${batches.length}: ${batch.length} urls → HTTP ${res.status} ${res.statusText}`);
    if (!res.ok) {
      const body = await res.text();
      console.error(body.slice(0, 500));
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
