export default function WaterQualityWidget() {
  return (
    <div className="not-prose rounded-xl border border-reef-100 bg-reef-50/50 p-5 my-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-reef-600 text-lg">🧪</span>
        <h4 className="text-sm font-semibold text-reef-800">Water Quality</h4>
      </div>
      <p className="text-sm text-reef-600">
        Water quality monitoring data for this beach will be integrated from EU Bathing Water Directive
        and EPA BEACON datasets. See the environment section for available quality information.
      </p>
    </div>
  );
}
