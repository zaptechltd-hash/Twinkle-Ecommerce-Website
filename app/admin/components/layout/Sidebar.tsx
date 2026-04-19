// "use client";
// import { NAV_ITEMS } from "../data/data";
// import Image from "next/image";

// type SidebarProps = {
//   active: string;
//   sidebarOpen: boolean;
//   unread: number;
//   onNavigate: (id: string) => void;
//   onToggle: () => void;
// };

// export function Sidebar({ active, sidebarOpen, unread, onNavigate, onToggle }: SidebarProps) {
//   return (
//     <aside
//       className={`flex-shrink-0 bg-[#faf8f5] border-r border-[#e8e5df] flex flex-col transition-all duration-300 ${sidebarOpen ? "w-56" : "w-14"} z-30`}
//       style={{ minHeight: "100vh", position: "sticky", top: 0 }}
//     >
//       {/* Logo */}
//       <div className="py-5 border-b border-[#e8e5df] flex items-center justify-center">
//         <Image
//           src="/logo.png"
//           alt="TwinkleOfficial"
//           width={sidebarOpen ? 100 : 36}
//           height={sidebarOpen ? 50 : 18}
//         />
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 py-3">
//         {NAV_ITEMS.map((item) => {
//           const isActive = active === item.id;
//           return (
//             <button
//               key={item.id}
//               onClick={() => onNavigate(item.id)}
//               className={`relative w-full flex items-center gap-3 py-2.5 transition-all ${
//                 sidebarOpen ? "px-5" : "justify-center px-0"
//               } ${
//                 isActive
//                   ? "bg-white text-[#1a1916] border-r-2 border-[#1a1916]"
//                   : "text-[#b4b2a9] hover:text-[#5f5e5a] hover:bg-white/60"
//               }`}
//             >
//               <span className="text-[15px] flex-shrink-0 leading-none">{item.icon}</span>

//               {sidebarOpen && (
//                 <span
//                   className={`text-[10px] tracking-[0.15em] uppercase font-medium ${
//                     isActive ? "text-[#1a1916]" : "text-[#888780]"
//                   }`}
//                 >
//                   {item.label}
//                 </span>
//               )}

//               {/* Notification badge */}
//               {item.id === "notifications" && unread > 0 && (
//                 <span
//                   className={`flex items-center justify-center rounded-full bg-[#1a1916] text-[#f5f2ed] font-medium leading-none flex-shrink-0 ${
//                     sidebarOpen
//                       ? "ml-auto text-[9px] w-4 h-4"
//                       : "absolute top-1.5 right-1.5 w-1.5 h-1.5 text-[0px]"
//                   }`}
//                 >
//                   {sidebarOpen ? unread : ""}
//                 </span>
//               )}
//             </button>
//           );
//         })}
//       </nav>

//       {/* Collapse toggle */}
//       <button
//         onClick={onToggle}
//         className={`border-t border-[#e8e5df] py-4 text-[#b4b2a9] hover:text-[#1a1916] hover:bg-white/60 transition-colors ${
//           sidebarOpen ? "px-5 text-left" : "text-center"
//         }`}
//       >
//         <span className="text-[11px] tracking-[0.1em] uppercase">
//           {sidebarOpen ? "← Collapse" : "→"}
//         </span>
//       </button>
//     </aside>
//   );
// }

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
      className={`flex-shrink-0 bg-[#faf8f5] border-r border-[#e8e5df] flex flex-col transition-all duration-300 ${sidebarOpen ? "w-56" : "w-14"} z-30`}
      style={{ minHeight: "100vh", position: "sticky", top: 0 }}
    >
      {/* Logo */}
      <div className="py-5 border-b border-[#e8e5df] flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="TwinkleOfficial"
          width={sidebarOpen ? 100 : 36}
          height={sidebarOpen ? 50 : 18}
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon; // capitalize so JSX treats it as a component, not a string tag
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative w-full flex items-center gap-3 py-2.5 transition-all ${
                sidebarOpen ? "px-5" : "justify-center px-0"
              } ${
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

              {sidebarOpen && (
                <span
                  className={`text-[10px] tracking-[0.15em] uppercase font-medium ${
                    isActive ? "text-[#1a1916]" : "text-[#888780]"
                  }`}
                >
                  {item.label}
                </span>
              )}

              {/* Notification badge */}
              {item.id === "notifications" && unread > 0 && (
                <span
                  className={`flex items-center justify-center rounded-full bg-[#1a1916] text-[#f5f2ed] font-medium leading-none flex-shrink-0 ${
                    sidebarOpen
                      ? "ml-auto text-[9px] w-4 h-4"
                      : "absolute top-1.5 right-1.5 w-1.5 h-1.5 text-[0px]"
                  }`}
                >
                  {sidebarOpen ? unread : ""}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className={`border-t border-[#e8e5df] py-4 text-[#b4b2a9] hover:text-[#1a1916] hover:bg-white/60 transition-colors ${
          sidebarOpen ? "px-5 text-left" : "text-center"
        }`}
      >
        <span className="text-[11px] tracking-[0.1em] uppercase">
          {sidebarOpen ? "← Collapse" : "→"}
        </span>
      </button>
    </aside>
  );
}