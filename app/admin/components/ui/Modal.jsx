export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-7 py-5 border-b border-stone-100">
          <p className="text-[11px] tracking-[0.25em] text-stone-800 uppercase">{title}</p>
          <button onClick={onClose} className="text-[10px] tracking-[0.2em] text-stone-400 uppercase hover:text-stone-700 transition-colors">
            Close ✕
          </button>
        </div>
        <div className="px-7 py-6">{children}</div>
      </div>
    </div>
  );
}