"use client";
import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

type PinType = "posto" | "landmark" | "restaurant" | "hotel" | "viewpoint" | "metro";

interface Pin {
  type: PinType;
  name: string;
  description: string;
  lat: number;
  lng: number;
  url?: string;
}

const TYPE_META: Record<PinType, { label: string; color: string }> = {
  posto:      { label: "Postos",       color: "#0ea5e9" },
  landmark:   { label: "Landmarks",    color: "#dc2626" },
  restaurant: { label: "Restaurants",  color: "#f59e0b" },
  hotel:      { label: "Hotels",       color: "#8b5cf6" },
  viewpoint:  { label: "Viewpoints",   color: "#10b981" },
  metro:      { label: "Metro",        color: "#64748b" },
};

const PINS: Pin[] = [
  // POSTOS
  { type: "posto", name: "Posto 1 — Leme", description: "Quiet end, families, dawn walks.", lat: -22.9596, lng: -43.1694 },
  { type: "posto", name: "Posto 2", description: "Default tourist beach day.", lat: -22.9650, lng: -43.1720 },
  { type: "posto", name: "Posto 3", description: "Volleyball + futevolei nets.", lat: -22.9708, lng: -43.1788 },
  { type: "posto", name: "Posto 4", description: "Mixed, political, progressive.", lat: -22.9745, lng: -43.1830 },
  { type: "posto", name: "Posto 5", description: "Sunset drinks, transition zone.", lat: -22.9795, lng: -43.1865 },
  { type: "posto", name: "Posto 6 — Fort end", description: "Surfers, fishermen, surf break.", lat: -22.9860, lng: -43.1900 },

  // LANDMARKS
  { type: "landmark", name: "Copacabana Palace", description: "Art Deco hotel, opened 1923. Social axis of the arc.", lat: -22.9677, lng: -43.1760, url: "https://en.wikipedia.org/wiki/Copacabana_Palace" },
  { type: "landmark", name: "Forte de Copacabana", description: "1914 fort + museum + Confeitaria Colombo café with the cleanest view of the arc.", lat: -22.9880, lng: -43.1887, url: "https://en.wikipedia.org/wiki/Fort_Copacabana" },
  { type: "landmark", name: "Calçadão (Burle Marx)", description: "The 4 km black-and-white Portuguese wave pavement.", lat: -22.9770, lng: -43.1830 },

  // HOTELS
  { type: "hotel", name: "Belmond Copacabana Palace", description: "Luxury, 1923. Av. Atlântica 1702.", lat: -22.9677, lng: -43.1760, url: "https://www.belmond.com/hotels/south-america/brazil/rio-de-janeiro/belmond-copacabana-palace/" },
  { type: "hotel", name: "Fairmont Rio de Janeiro", description: "Luxury, southern Copa end. Av. Atlântica 4240.", lat: -22.9840, lng: -43.1870 },
  { type: "hotel", name: "Miramar Hotel by Windsor", description: "Upscale, Leme end. Av. Atlântica 3668.", lat: -22.9800, lng: -43.1855 },
  { type: "hotel", name: "Windsor Atlantica", description: "Mid-range, oceanfront. Av. Atlântica 1020.", lat: -22.9620, lng: -43.1710 },
  { type: "hotel", name: "Hotel Arena Copacabana", description: "Mid-range. Av. Atlântica 2064.", lat: -22.9723, lng: -43.1795 },

  // RESTAURANTS
  { type: "restaurant", name: "Cervantes", description: "Sandwich institution since 1955. Pineapple + roast pork.", lat: -22.9642, lng: -43.1771 },
  { type: "restaurant", name: "Pérgula — Copacabana Palace", description: "Poolside Italian + Brazilian at the Palace.", lat: -22.9677, lng: -43.1760 },
  { type: "restaurant", name: "Cipriani — Copacabana Palace", description: "Fine-dining Italian at the Palace.", lat: -22.9677, lng: -43.1760 },
  { type: "restaurant", name: "Confeitaria Colombo — Fort", description: "Branch of 1894 Rio confeitaria, inside Forte. Best view.", lat: -22.9882, lng: -43.1889 },

  // VIEWPOINTS
  { type: "viewpoint", name: "Mirante do Pavão-Pavãozinho", description: "Hilltop public viewpoint. Reached via free Plano Inclinado from Ipanema Metro. The best view in the South Zone.", lat: -22.9835, lng: -43.1985 },
  { type: "viewpoint", name: "Pão de Açúcar / Sugarloaf", description: "Cable-car summit looking east at Copacabana. 395m above sea level.", lat: -22.9487, lng: -43.1567 },
  { type: "viewpoint", name: "Arpoador Rock", description: "The rock between Copa and Ipanema. Western sunset spot.", lat: -22.9886, lng: -43.1925 },

  // METRO — Line 1
  { type: "metro", name: "Cardeal Arcoverde (M)", description: "Line 1. Leme end of Copa.", lat: -22.9669, lng: -43.1800 },
  { type: "metro", name: "Siqueira Campos (M)", description: "Line 1. Central Copa.", lat: -22.9697, lng: -43.1850 },
  { type: "metro", name: "Cantagalo (M)", description: "Line 1. Posto 5–6 end. Free Plano Inclinado to Mirante.", lat: -22.9820, lng: -43.1900 },
];

function makeIcon(color: string, label: string) {
  return L.divIcon({
    className: "copa-pin",
    html: `<div style="
      width: 28px; height: 28px; border-radius: 50%;
      background: ${color}; border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.35);
      color: white; font-size: 11px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    ">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

const ARC_LINE: [number, number][] = [
  [-22.9600, -43.1687],
  [-22.9650, -43.1720],
  [-22.9700, -43.1770],
  [-22.9760, -43.1830],
  [-22.9820, -43.1880],
  [-22.9870, -43.1910],
];

export default function CopaMapInner() {
  const [active, setActive] = useState<Record<PinType, boolean>>({
    posto: true,
    landmark: true,
    restaurant: true,
    hotel: true,
    viewpoint: true,
    metro: false,
  });

  const visiblePins = useMemo(() => PINS.filter((p) => active[p.type]), [active]);

  const labelFor = (p: Pin): string => {
    if (p.type === "posto") {
      const m = p.name.match(/Posto (\d)/);
      return m ? m[1] : "•";
    }
    if (p.type === "metro") return "M";
    if (p.type === "hotel") return "H";
    if (p.type === "restaurant") return "R";
    if (p.type === "viewpoint") return "V";
    return "◆";
  };

  return (
    <div className="not-prose">
      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.keys(TYPE_META) as PinType[]).map((t) => {
          const m = TYPE_META[t];
          const isOn = active[t];
          const count = PINS.filter((p) => p.type === t).length;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setActive((a) => ({ ...a, [t]: !a[t] }))}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                isOn ? "bg-white border-volcanic-200 text-volcanic-900" : "bg-volcanic-50 border-volcanic-100 text-volcanic-400"
              }`}
            >
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: isOn ? m.color : "#cbd5e1" }} />
              {m.label} <span className="font-mono text-[10px] opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl overflow-hidden border border-volcanic-200" style={{ height: "480px" }}>
        <MapContainer
          center={[-22.9740, -43.1820] as [number, number]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={ARC_LINE} pathOptions={{ color: "#fbbf24", weight: 5, opacity: 0.7 }} />
          {visiblePins.map((p, i) => (
            <Marker
              key={`${p.type}-${i}`}
              position={[p.lat, p.lng] as [number, number]}
              icon={makeIcon(TYPE_META[p.type].color, labelFor(p))}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.45 }}>{p.description}</div>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener" style={{ fontSize: 11, color: "#0284c7", marginTop: 6, display: "inline-block" }}>
                      More →
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <p className="mt-3 text-xs text-volcanic-400 italic">
        Map data © OpenStreetMap contributors. The yellow line traces the 4 km arc from Leme to the Fort. Toggle categories above to filter pins.
      </p>
    </div>
  );
}
