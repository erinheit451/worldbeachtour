export default function WeatherWidget() {
  return (
    <div className="not-prose rounded-xl border border-ocean-100 bg-ocean-50/50 p-5 my-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-ocean-500 text-lg">☀️</span>
        <h4 className="text-sm font-semibold text-ocean-800">Weather</h4>
      </div>
      <p className="text-sm text-ocean-600">
        Historical climate averages and live forecasts for this beach are coming soon.
        See the travel section above for seasonal guidance.
      </p>
    </div>
  );
}
