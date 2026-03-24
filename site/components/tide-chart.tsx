export default function TideChart() {
  return (
    <div className="not-prose rounded-xl border border-ocean-100 bg-ocean-50/50 p-5 my-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-ocean-500 text-lg">🌊</span>
        <h4 className="text-sm font-semibold text-ocean-800">Tidal Information</h4>
      </div>
      <p className="text-sm text-ocean-600">
        Live tide data for this beach will be available when our NOAA and global tide model integration is complete.
        Check local tide charts before planning water activities.
      </p>
    </div>
  );
}
