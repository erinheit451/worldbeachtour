interface DataCardProps {
  label: string;
  value: string;
  unit?: string;
}

export default function DataCard({ label, value, unit }: DataCardProps) {
  return (
    <div className="not-prose inline-flex flex-col rounded-lg border border-volcanic-100 bg-volcanic-50/50 px-5 py-3.5 my-2 mr-2">
      <span className="text-xs font-medium uppercase tracking-wider text-volcanic-400">
        {label}
      </span>
      <span className="text-lg font-semibold text-volcanic-900 mt-0.5">
        {value}
        {unit && (
          <span className="text-sm font-normal text-volcanic-400 ml-1.5">
            {unit}
          </span>
        )}
      </span>
    </div>
  );
}
