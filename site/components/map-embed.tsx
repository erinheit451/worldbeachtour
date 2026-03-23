"use client";

interface MapEmbedProps {
  lat: number;
  lng: number;
  name: string;
}

export default function MapEmbed({ lat, lng, name }: MapEmbedProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-100 h-64 flex items-center justify-center">
      <p className="text-gray-500 text-sm">
        Map: {name} ({lat.toFixed(4)}, {lng.toFixed(4)})
      </p>
    </div>
  );
}
