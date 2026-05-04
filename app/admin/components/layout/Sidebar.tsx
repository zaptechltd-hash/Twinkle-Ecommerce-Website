"use client";
import { NAV_ITEMS } from "../data/data";
import Image from "next/image";

type SidebarProps = {
  active: string;
  sidebarOpen: boolean;
  unread: number;
  onNavigate: (id: string) => void;
  onToggle: () => void;
  onSignOut: () => void; 
};

export function Sidebar({ active, sidebarOpen, unread, onNavigate, onToggle, onSignOut }: SidebarProps) {
  return (
    <aside
      // ① Width: always w-14 on mobile; respects sidebarOpen from sm upward
      className={`flex-shrink-0 bg-[#faf8f5] border-r border-[#e8e5df] flex flex-col transition-all duration-300
        w-14 ${sidebarOpen ? "sm:w-44" : "sm:w-14"} z-30`}
      style={{ minHeight: "100vh", position: "sticky", top: 0 }}
    >
      {/* Logo */}
      <div className="py-5 border-b border-[#e8e5df] flex items-center justify-center">
        {/* Small icon — always visible on mobile; hidden on sm+ when sidebar is open */}
        <Image
          src="/logo.png"
          alt="TwinkleOfficial"
          width={36}
          height={18}
          className={sidebarOpen ? "sm:hidden" : ""}
        />
        {/* Full logo — only on sm+ when open */}
        {sidebarOpen && (
          <Image
            src="/logo.png"
            alt="TwinkleOfficial"
            width={100}
            height={50}
            className="hidden sm:block"
          />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              // ② Layout: always centered/icon-only on mobile; respects sidebarOpen from sm upward
              className={`relative w-full flex items-center gap-3 py-2.5 transition-all
                justify-center px-0
                ${sidebarOpen ? "sm:px-5 sm:justify-start" : ""}
                ${
                  isActive
                    ? "bg-white text-[#1a1916] border-r-2 border-[#1a1916]"
                    : "text-[#b4b2a9] hover:text-[#5f5e5a] hover:bg-white/60"
                }`}
            >
              <Icon
                size={16}
                strokeWidth={isActive ? 2 : 1.6}
                className="flex-shrink-0"
              />

              {/* ③ Label: always hidden on mobile; shown on sm+ only when open */}
              {sidebarOpen && (
                <span
                  className={`hidden sm:inline text-[10px] tracking-[0.15em] uppercase font-medium ${
                    isActive ? "text-[#1a1916]" : "text-[#888780]"
                  }`}
                >
                  {item.label}
                </span>
              )}

              {/* Notification badge */}
              {item.id === "notifications" && unread > 0 && (
                <span
                  className={`flex items-center justify-center rounded-full bg-[#1a1916] text-[#f5f2ed] font-medium leading-none flex-shrink-0
                    absolute top-1.5 right-1.5 w-1.5 h-1.5 text-[0px]
                    ${sidebarOpen ? "sm:static sm:ml-auto sm:w-4 sm:h-4 sm:text-[9px]" : ""}`}
                >
                  {sidebarOpen ? <span className="hidden sm:inline">{unread}</span> : ""}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      
  <button
        onClick={onSignOut}
        className={`border-t border-[#e8e5df] py-4 text-[#b4b2a9] hover:text-red-400 hover:bg-white/60 transition-colors
          text-center ${sidebarOpen ? "sm:px-5 sm:text-left" : ""}`}
      >
        <span className="text-[11px] tracking-[0.1em] uppercase">
          <span className={sidebarOpen ? "hidden sm:inline" : "hidden"}>Sign Out</span>
          <span className={sidebarOpen ? "sm:hidden" : ""}>→</span>
        </span>
      </button>
      {/* ④ Collapse toggle: always arrow-only on mobile */}
      
      <button
        onClick={onToggle}
        className={`border-t border-[#e8e5df] py-4 text-[#b4b2a9] hover:text-[#1a1916] hover:bg-white/60 transition-colors
          text-center ${sidebarOpen ? "sm:px-5 sm:text-left" : ""}`}
      >
        <span className="text-[11px] tracking-[0.1em] uppercase">
          {/* On mobile always show →; on sm+ respect sidebarOpen */}
          <span className={sidebarOpen ? "hidden sm:inline" : "hidden"}>← Collapse</span>
          <span className={sidebarOpen ? "sm:hidden" : ""}>→</span>
        </span>
      </button>
    </aside>
  );
}