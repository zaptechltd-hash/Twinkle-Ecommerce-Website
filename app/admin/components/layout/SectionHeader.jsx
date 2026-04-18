export function SectionHeader({ title, subtitle, action, onAction }) {
  return (
    <div className="flex items-end justify-between mb-7">
      <div>
        <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase mb-1">{subtitle}</p>
        <h2 className="text-xl font-light tracking-[0.15em] text-stone-800 uppercase">{title}</h2>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="text-[10px] tracking-[0.25em] text-stone-500 uppercase border border-stone-200 px-4 py-2 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all"
        >
          {action}
        </button>
      )}
    </div>
  );
}
