export function SearchBar({ placeholder, value, onChange }) {
  return (
    <div className="relative mb-5">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 text-xs">⌕</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-8 pr-4 py-2.5 text-[12px] border border-stone-200 text-stone-700 outline-none focus:border-stone-400 transition-colors placeholder:text-stone-300 tracking-wide"
      />
    </div>
  );
}