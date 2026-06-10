"use client";
import dynamic from "next/dynamic";

/**
 * Client-only wrapper for the Leaflet map. react-leaflet touches `window`
 * at module-scope via its `leaflet` dep, so we dynamic-import the inner
 * component with ssr:false to keep the static-export build happy.
 */
const CopaMapInner = dynamic(() => import("./copa-map-inner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[480px] rounded-xl bg-volcanic-100 flex items-center justify-center text-volcanic-400 text-sm">
      Loading map…
    </div>
  ),
});

export default function CopaMap() {
  return <CopaMapInner />;
}
