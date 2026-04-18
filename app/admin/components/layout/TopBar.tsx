"use client";
import { NAV_ITEMS } from "../data/data";

type TopBarProps = {
  active: string;
  unread: number;
  onNotifClick: () => void;
};

export function TopBar({ active, unread, onNotifClick }: TopBarProps) {
  return (
    <header className="bg-white border-b border-stone-100 px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
      <div>
        <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase">TwinkleOfficial</p>
        <p className="text-[15px] font-light tracking-[0.15em] text-stone-800 uppercase mt-0.5">
          {NAV_ITEMS.find((n) => n.id === active)?.label}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:block relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 text-xs">⌕</span>
          <input
            type="text"
            placeholder="Quick search..."
            className="pl-8 pr-4 py-2 text-[11px] border border-stone-200 text-stone-600 outline-none focus:border-stone-400 transition-colors placeholder:text-stone-300 w-48"
          />
        </div>

        <button
          onClick={onNotifClick}
          className="relative w-8 h-8 flex items-center justify-center hover:bg-stone-100 transition-colors"
        >
          <span className="text-stone-500 text-base">◉</span>
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-stone-800 text-white text-[8px] flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-medium">
            AU
          </div>
          <div className="hidden md:block">
            <p className="text-[10px] text-stone-700 tracking-wide">Admin User</p>
            <p className="text-[9px] text-stone-400 tracking-[0.1em] uppercase">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}