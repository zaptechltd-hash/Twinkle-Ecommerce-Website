// "use client";
// import { NAV_ITEMS } from "../data/data";

// type TopBarProps = {
//   active: string;
//   unread: number;
//   onNotifClick: () => void;
// };

// export function TopBar({ active, unread, onNotifClick }: TopBarProps) {
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display&display=swap');
//         .topbar-serif { font-family: 'DM Serif Display', serif; }
//         .topbar-search::placeholder { color: #b4b2a9; }
//         .topbar-search:focus { border-color: #1a1916; outline: none; }
//       `}</style>

//       <header className="bg-[#faf8f5] border-b border-[#e8e5df] px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
//         {/* Left — brand + page title */}
//         <div>
//           <p className="text-[9px] tracking-[0.25em] text-[#b4b2a9] uppercase font-medium">
//             {/* TwinkleOfficial */}
//           </p>
//           {/* <p className="topbar-serif text-[17px] font-normal tracking-tight text-[#1a1916] mt-0.5">
//             {NAV_ITEMS.find((n) => n.id === active)?.label}
//           </p> */}
//         </div>

//         {/* Right — search + notif + avatar */}
//         <div className="flex items-center gap-3">
//           {/* Search */}
//           {/* <div className="hidden md:block relative">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b4b2a9] text-[13px] pointer-events-none">
//               ⌕
//             </span>
//             <input
//               type="text"
//               placeholder="Quick search…"
//               className="topbar-search pl-8 pr-4 py-2 text-[11px] font-medium bg-white border border-[#e8e5df] rounded-lg text-[#1a1916] w-48 transition-colors"
//             />
//           </div> */}

//           {/* Notification bell */}
//           <button
//             onClick={onNotifClick}
//             className="relative w-8 h-8 flex items-center justify-center bg-white border border-[#e8e5df] rounded-lg hover:border-[#1a1916] transition-colors"
//           >
//             <span className="text-[#888780] text-[13px] leading-none">◉</span>
//             {unread > 0 && (
//               <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1a1916] text-[#f5f2ed] text-[8px] font-medium flex items-center justify-center leading-none">
//                 {unread}
//               </span>
//             )}
//           </button>

//           {/* Avatar */}
//           <div className="flex items-center gap-2.5">
//             <div className="w-8 h-8 rounded-lg bg-[#1a1916] text-[#f5f2ed] text-[10px] font-medium flex items-center justify-center flex-shrink-0">
//               AU
//             </div>
//             <div className="hidden md:block">
//               <p className="text-[11px] font-medium text-[#1a1916] tracking-wide leading-tight">
//                 Admin User
//               </p>
//               <p className="text-[9px] text-[#b4b2a9] tracking-[0.12em] uppercase leading-tight mt-0.5">
//                 Super Admin
//               </p>
//             </div>
//           </div>
//         </div>
//       </header>
//     </>
//   );
// }

"use client";
import { Bell } from "lucide-react";

type TopBarProps = {
  active: string;
  unread: number;
  onNotifClick: () => void;
};

export function TopBar({ active, unread, onNotifClick }: TopBarProps) {
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

          {/* Avatar */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a1916] text-[#f5f2ed] text-[10px] font-medium flex items-center justify-center flex-shrink-0">
              AU
            </div>
            <div className="hidden md:block">
              <p className="text-[11px] font-medium text-[#1a1916] tracking-wide leading-tight">
                Admin User
              </p>
              <p className="text-[9px] text-[#b4b2a9] tracking-[0.12em] uppercase leading-tight mt-0.5">
                Super Admin
              </p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}