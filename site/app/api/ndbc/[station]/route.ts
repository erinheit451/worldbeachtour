/**
 * Server-side proxy for NOAA NDBC realtime buoy data.
 *
 * NDBC's realtime2 .txt endpoint sends no CORS headers, so a browser fetch is
 * blocked. We fetch it server-side and relay the raw text. Requires a server
 * (route handlers don't run under `output: "export"`) — i.e. this goes live
 * with the ISR/standalone migration. In `next dev` it works now.
 */

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ station: string }> }
) {
  const { station } = await params;
  if (!/^[0-9a-zA-Z]{4,6}$/.test(station)) {
    return new Response("bad station", { status: 400 });
  }
  try {
    const upstream = await fetch(
      `https://www.ndbc.noaa.gov/data/realtime2/${station}.txt`,
      { cache: "no-store", headers: { "User-Agent": "worldbeachtour/1.0" } }
    );
    if (!upstream.ok) {
      return new Response(`upstream ${upstream.status}`, { status: 502 });
    }
    const text = await upstream.text();
    return new Response(text, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=600",
      },
    });
  } catch {
    return new Response("fetch failed", { status: 502 });
  }
}
