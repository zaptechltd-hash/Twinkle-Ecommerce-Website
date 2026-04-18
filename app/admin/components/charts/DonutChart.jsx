export function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const slices = data.map((d) => {
    const start = (cumulative / total) * 360;
    cumulative += d.value;
    const end = (cumulative / total) * 360;
    return { ...d, start, end };
  });

  function describeArc(cx, cy, r, startAngle, endAngle) {
    const toRad = (deg) => ((deg - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  }

  return (
    <div className="flex items-center gap-6 mt-4">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {slices.map((s, i) => (
          <path key={i} d={describeArc(60, 60, 50, s.start, s.end)} fill={s.color} stroke="white" strokeWidth="2" />
        ))}
        <circle cx="60" cy="60" r="30" fill="white" />
      </svg>
      <div className="flex flex-col gap-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-[11px] text-stone-500 tracking-wide">{d.name}</span>
            <span className="text-[11px] font-medium text-stone-700 ml-auto pl-4">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
