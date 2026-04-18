export function RevenueChart({ data }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2 h-40 mt-4">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <div
            className="w-full bg-stone-900 hover:bg-stone-700 transition-colors cursor-default"
            style={{ height: `${(d.value / max) * 100}%` }}
            title={`PKR ${d.value.toLocaleString()}`}
          />
          <span className="text-[9px] tracking-[0.1em] text-stone-400 uppercase">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

