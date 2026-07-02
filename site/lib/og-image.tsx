import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

// Fonts are read from the source tree (same process.cwd()-relative pattern the
// site already uses for content/ and data/, so they resolve in the standalone
// deployment). rsync ships assets/; the deploy excludes only node_modules/.next.
const FONT_DIR = path.join(process.cwd(), "assets", "og-fonts");
const dmSerif = fs.readFileSync(path.join(FONT_DIR, "DMSerifDisplay-Regular.ttf"));
const inter = fs.readFileSync(path.join(FONT_DIR, "Inter-Regular.ttf"));
const interSemiBold = fs.readFileSync(path.join(FONT_DIR, "Inter-SemiBold.ttf"));

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

interface OgOptions {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

// A single branded 1200×630 card used site-wide. Deep-ocean gradient, DM Serif
// headline, sand-gold accents — matches the site's palette and type.
export function renderOgImage({ eyebrow, title, subtitle }: OgOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 72px",
          backgroundColor: "#082f49",
          backgroundImage:
            "linear-gradient(135deg, #082f49 0%, #0c4a6e 55%, #075985 100%)",
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        {/* sand-gold horizon accent at the base */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 10,
            backgroundImage: "linear-gradient(90deg, #facc15 0%, #fde047 100%)",
          }}
        />

        {/* wordmark */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#fde047",
            }}
          >
            World Beach Tour
          </div>
          <div style={{ width: 84, height: 4, backgroundColor: "#facc15", marginTop: 16 }} />
        </div>

        {/* headline block */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
          {eyebrow ? (
            <div
              style={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: 22,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#7dd3fc",
                marginBottom: 18,
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              fontFamily: "DM Serif Display",
              fontSize: title.length > 52 ? 62 : 76,
              lineHeight: 1.05,
              color: "#ffffff",
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: 30,
                lineHeight: 1.35,
                color: "#e0f2fe",
                marginTop: 26,
                maxWidth: 940,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* footer stat line */}
        <div
          style={{
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: 24,
            color: "#bae6fd",
          }}
        >
          worldbeachtour.com · the canonical page for every beach on Earth
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "DM Serif Display", data: dmSerif, weight: 400, style: "normal" },
        { name: "Inter", data: inter, weight: 400, style: "normal" },
        { name: "Inter", data: interSemiBold, weight: 600, style: "normal" },
      ],
    }
  );
}
