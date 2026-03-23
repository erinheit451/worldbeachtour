"use client";

interface MapEmbedProps {
  lat: number;
  lng: number;
  name: string;
}

export default function MapEmbed({ lat, lng, name }: MapEmbedProps) {
  const latStr = typeof lat === "number" ? lat.toFixed(4) : String(lat ?? "");
  const lngStr = typeof lng === "number" ? lng.toFixed(4) : String(lng ?? "");

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-100 h-64 flex items-center justify-center">
      <p className="text-gray-500 text-sm">
        Map: {name} ({latStr}, {lngStr})
      </p>
    </div>
  );
}
