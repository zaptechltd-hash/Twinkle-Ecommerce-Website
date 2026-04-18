export function Pagination({ total, perPage, page, onPage }) {
  const pages = Math.ceil(total / perPage);
  return (
    <div className="flex items-center justify-between mt-5 pt-4 border-t border-stone-100">
      <p className="text-[10px] tracking-wide text-stone-400">
        Showing {Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)} of {total}
      </p>
      <div className="flex gap-1">
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-8 h-8 text-[11px] transition-all ${p === page ? "bg-stone-900 text-white" : "text-stone-500 hover:bg-stone-100"}`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
