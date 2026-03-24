"use client";

interface MapEmbedProps {
  lat: number;
  lng: number;
  name: string;
}

export default function MapEmbed({ lat, lng, name }: MapEmbedProps) {
  const latStr = typeof lat === "number" ? lat.toFixed(4) : String(lat ?? "");
  const lngStr = typeof lng === "number" ? lng.toFixed(4) : String(lng ?? "");
  const latNum = typeof lat === "number" ? lat : 0;
  const lngNum = typeof lng === "number" ? lng : 0;

  // Use OpenStreetMap tile embed for a real map without JS overhead
  const zoom = 13;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lngNum - 0.02},${latNum - 0.01},${lngNum + 0.02},${latNum + 0.01}&layer=mapnik&marker=${latNum},${lngNum}`;

  return (
    <div className="not-prose rounded-xl overflow-hidden border border-volcanic-100 my-6">
      <iframe
        src={embedUrl}
        className="w-full h-64 sm:h-80"
        style={{ border: 0 }}
        loading="lazy"
        title={`Map of ${name}`}
        aria-label={`Map showing location of ${name} at ${latStr}, ${lngStr}`}
      />
      <div className="bg-volcanic-50 px-4 py-2 flex items-center justify-between text-xs text-volcanic-400">
        <span>{name}</span>
        <span>{latStr}, {lngStr}</span>
      </div>
    </div>
  );
}
