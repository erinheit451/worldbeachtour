import type { MetadataRoute } from "next";

const BASE_URL = "https://worldbeachtour.com";

// Native robots route (replaces the static public/robots.txt so it stays in
// sync with the app). Note: /beaches-v2 is intentionally NOT disallowed — those
// preview pages carry a `noindex` meta tag, and crawlers must be allowed to
// fetch them to see it and drop them from the index. /preview and /pilot are
// scratch routes never meant to be indexed.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/preview", "/pilot"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
