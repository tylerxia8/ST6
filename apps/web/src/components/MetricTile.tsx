interface MetricTileProps {
  label: string;
  value: string;
  helper: string;
  testId?: string;
}

export function MetricTile({ label, value, helper, testId }: MetricTileProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm" data-testid={testId}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{helper}</p>
    </div>
  );
}
