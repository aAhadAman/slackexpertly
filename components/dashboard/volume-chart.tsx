export function VolumeChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const labels = ["7w", "6w", "5w", "4w", "3w", "2w", "1w", "Now"];
  return (
    <div>
      <div className="flex h-40 items-end gap-2">
        {data.map((v, i) => (
          <div key={i} className="group flex flex-1 flex-col items-center gap-2">
            <div className="relative flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400 transition-all group-hover:from-brand-700 group-hover:to-brand-500"
                style={{ height: `${(v / max) * 100}%` }}
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-foreground px-1.5 py-0.5 text-[10px] font-medium text-background opacity-0 transition-opacity group-hover:opacity-100">
                  {v}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-muted-2">{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
