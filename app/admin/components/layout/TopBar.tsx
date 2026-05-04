

"use client";
import { Bell } from "lucide-react";

type TopBarProps = {
  active: string;
  unread: number;
  onNotifClick: () => void;
  adminUser: { email: string } | null;
};

export function TopBar({ active, unread, onNotifClick, adminUser }: TopBarProps) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display&display=swap');
        .topbar-serif { font-family: 'DM Serif Display', serif; }
        .topbar-search::placeholder { color: #b4b2a9; }
        .topbar-search:focus { border-color: #1a1916; outline: none; }
      `}</style>

      <header className="bg-[#faf8f5] border-b border-[#e8e5df] px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        {/* Left — brand + page title */}
        <div>
          <p className="text-[9px] tracking-[0.25em] text-[#b4b2a9] uppercase font-medium">
            {/* TwinkleOfficial */}
          </p>
        </div>

        {/* Right — search + notif + avatar */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button
            onClick={onNotifClick}
            className="relative w-8 h-8 flex items-center justify-center bg-white border border-[#e8e5df] rounded-lg hover:border-[#1a1916] transition-colors"
          >
            <Bell size={15} strokeWidth={1.6} className="text-[#888780]" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1a1916] text-[#f5f2ed] text-[8px] font-medium flex items-center justify-center leading-none">
                {unread}
              </span>
            )}
          </button>

         <div className="w-8 h-8 rounded-lg bg-[#1a1916] text-[#f5f2ed] text-[10px] font-medium flex items-center justify-center flex-shrink-0">
  {adminUser?.email?.[0]?.toUpperCase() ?? "A"}  {/* ← dynamic initial */}
</div>
<div className="hidden md:block">
  <p className="text-[11px] font-medium text-[#1a1916] tracking-wide leading-tight">
    {adminUser?.email ?? "Admin"}  {/* ← dynamic email */}
  </p>
  <p className="text-[9px] text-[#b4b2a9] tracking-[0.12em] uppercase leading-tight mt-0.5">
    Super Admin
  </p>
</div>
        </div>
      </header>
    </>
  );
}