"use client";
import { NAV_ITEMS } from "../data/data";
import Image from "next/image";
type SidebarProps = {
  active: string;
  sidebarOpen: boolean;
  unread: number;
  onNavigate: (id: string) => void;
  onToggle: () => void;
};

export function Sidebar({ active, sidebarOpen, unread, onNavigate, onToggle }: SidebarProps) {
  return (
    <aside
      className={`flex-shrink-0 bg-white border-r border-stone-100 flex flex-col transition-all duration-300 ${sidebarOpen ? "w-56" : "w-14"} z-30`}
      style={{ minHeight: "100vh", position: "sticky", top: 0 }}
    >
      {/* Logo */}
      <div className={`py-6 border-b border-stone-100 flex items-center  justify-center`}>
        {/* <div className="w-7 h-7 bg-stone-900 flex-shrink-0" />
        {sidebarOpen && (
          <p className="text-[11px] tracking-[0.2em] text-stone-800 uppercase font-medium">Twinkle</p>
        )} */}
        <Image src="/logo.png" alt="TwinkleOfficial" width={sidebarOpen ? 100 : 40} height={sidebarOpen ? 50 :20} />
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 py-2.5 transition-all ${sidebarOpen ? "px-5" : "justify-center px-0"} ${active === item.id ? "bg-stone-50 text-stone-900" : "text-stone-400 hover:text-stone-600 hover:bg-stone-50"}`}
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {sidebarOpen && (
              <span className="text-[10px] tracking-[0.2em] uppercase">{item.label}</span>
            )}
            {!sidebarOpen && item.id === "notifications" && unread > 0 && (
              <span className="absolute right-1 top-1 w-1.5 h-1.5 bg-stone-800 rounded-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className={`border-t border-stone-100 py-4 text-stone-300 hover:text-stone-600 transition-colors ${sidebarOpen ? "px-5 text-left" : "text-center"}`}
      >
        <span className="text-xs">{sidebarOpen ? "← Collapse" : "→"}</span>
      </button>
    </aside>
  );
}