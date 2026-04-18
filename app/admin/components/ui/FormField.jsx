export function FormField({ label, type = "text", value, onChange, options }) {
  return (
    <div className="mb-4">
      <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1.5">{label}</label>
      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-stone-200 px-3 py-2.5 text-[12px] text-stone-700 outline-none focus:border-stone-500 transition-colors appearance-none bg-white"
        >
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-stone-200 px-3 py-2.5 text-[12px] text-stone-700 outline-none focus:border-stone-500 transition-colors"
        />
      )}
    </div>
  );
}
