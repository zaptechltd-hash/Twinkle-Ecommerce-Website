// "use client";

// import { useState, useEffect, useCallback } from "react";
// // import useNotificationService from "@/services/notifications/useNotificationService";
// import useNotificationService from "../../../services/Notifications/index";
// import type { Notification, NotificationType } from "../../../services/Notifications/types";

// const ICONS: Record<NotificationType, string> = {
//   order:    "◻",
//   stock:    "▣",
//   review:   "◐",
//   payment:  "◈",
//   customer: "◯",
// };

// function timeAgo(iso: string): string {
//   const diff  = Date.now() - new Date(iso).getTime();
//   const mins  = Math.floor(diff / 60_000);
//   const hours = Math.floor(diff / 3_600_000);
//   const days  = Math.floor(diff / 86_400_000);
//   if (mins  <  1) return "Just now";
//   if (mins  < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
//   if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
//   if (days  <  2) return "Yesterday";
//   return new Date(iso).toLocaleDateString("en-PK", { day: "numeric", month: "short" });
// }

// export default function NotificationsSection() {
//   const { getNotifications, markRead, markAllRead } = useNotificationService();

//   const [notifs,  setNotifs]  = useState<Notification[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error,   setError]   = useState<string | null>(null);

//   const fetchNotifications = useCallback(async () => {
//     const res = await getNotifications();
//     if (res) {
//       setNotifs(res.data);
//       setUnreadCount(res.unreadCount);
//       setError(null);
//     } else {
//       setError("Failed to load notifications");
//     }
//     setLoading(false);
//   }, []);

//   // Initial fetch + poll every 30s
//   useEffect(() => {
//     fetchNotifications();
//     const id = setInterval(fetchNotifications, 30_000);
//     return () => clearInterval(id);
//   }, [fetchNotifications]);

//   const handleMarkRead = async (id: string) => {
//     await markRead(id);
//     setNotifs((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
//     );
//     setUnreadCount((c) => Math.max(0, c - 1));
//   };

//   const handleMarkAllRead = async () => {
//     await markAllRead();
//     setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
//     setUnreadCount(0);
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display&display=swap');
//         * { font-family: 'DM Sans', sans-serif; }
//         .serif { font-family: 'DM Serif Display', serif; }
//       `}</style>

//       <div className="bg-[#f5f2ed] min-h-screen p-6 md:p-8 text-[#1a1916]">

//         {/* Top bar */}
//         <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
//           <div>
//             <h1 className="serif text-[22px] font-normal tracking-tight text-[#1a1916] flex items-center gap-2">
//               Notifications
//               {unreadCount > 0 && (
//                 <span className="text-[11px] font-medium bg-[#1a1916] text-white px-2 py-0.5 rounded-full">
//                   {unreadCount}
//                 </span>
//               )}
//             </h1>
//             <p className="text-[12px] text-[#b4b2a9] mt-0.5">
//               {new Date().toLocaleDateString("en-PK", {
//                 weekday: "long",
//                 day: "numeric",
//                 month: "long",
//                 year: "numeric",
//               })}
//             </p>
//           </div>
//           <button
//             onClick={handleMarkAllRead}
//             disabled={unreadCount === 0}
//             className="text-[12px] font-medium px-4 py-1.5 rounded-lg bg-white border border-[#e8e5df] text-[#888780] hover:text-[#1a1916] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
//           >
//             Mark All Read
//           </button>
//         </div>

//         {/* States */}
//         {loading && (
//           <p className="text-[12px] text-[#b4b2a9] text-center py-12">Loading…</p>
//         )}
//         {error && (
//           <p className="text-[12px] text-red-400 text-center py-12">{error}</p>
//         )}

//         {/* List */}
//         {!loading && !error && (
//           <div>
//             <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-3">
//               Activity
//             </p>

//             {notifs.length === 0 ? (
//               <div className="bg-white border border-[#e8e5df] rounded-xl px-6 py-12 text-center">
//                 <p className="text-[13px] text-[#b4b2a9]">
//                   All caught up — no notifications yet.
//                 </p>
//               </div>
//             ) : (
//               <div className="bg-white border border-[#e8e5df] rounded-xl overflow-hidden flex flex-col">
//                 {notifs.map((n) => (
//                   <div
//                     key={n.id}
//                     className={`flex items-start gap-4 px-4 py-3.5 border-b border-[#f1efe8] last:border-b-0 transition-colors ${
//                       n.read ? "bg-white" : "bg-[#fafaf8]"
//                     }`}
//                   >
//                     <span className={`text-base mt-0.5 flex-shrink-0 ${n.read ? "text-[#b4b2a9]" : "text-[#5f5e5a]"}`}>
//                       {ICONS[n.type] ?? "◉"}
//                     </span>

//                     <div className="flex-1 min-w-0">
//                       <p className={`text-[12px] leading-relaxed ${n.read ? "text-[#b4b2a9]" : "text-[#1a1916]"}`}>
//                         {n.message}
//                       </p>
//                       <p className="text-[11px] text-[#b4b2a9] mt-0.5">
//                         {timeAgo(n.createdAt)}
//                       </p>
//                     </div>

//                     {!n.read && (
//                       <button
//                         onClick={() => handleMarkRead(n.id)}
//                         className="text-[10px] tracking-[0.08em] font-medium uppercase text-[#b4b2a9] hover:text-[#1a1916] transition-colors flex-shrink-0 mt-0.5"
//                       >
//                         Read
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import useNotificationService from "../../../services/Notifications/index";
import type { Notification, NotificationType } from "../../../services/Notifications/types";

const ICONS: Record<NotificationType, string> = {
  order:    "◻",
  stock:    "▣",
  review:   "◐",
  payment:  "◈",
  customer: "◯",
};

function timeAgo(iso: string): string {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  <  1) return "Just now";
  if (mins  < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days  <  2) return "Yesterday";
  return new Date(iso).toLocaleDateString("en-PK", { day: "numeric", month: "short" });
}

type Props = {
  onCountChange?: (count: number) => void;
};

export default function NotificationsSection({ onCountChange }: Props) {
  const { getNotifications, markRead, markAllRead } = useNotificationService();

  const [notifs,     setNotifs]     = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    const res = await getNotifications();
    if (res) {
      setNotifs(res.data);
      setUnreadCount(res.unreadCount);
      onCountChange?.(res.unreadCount);
      setError(null);
    } else {
      setError("Failed to load notifications");
    }
    setLoading(false);
  }, [onCountChange]);

  // Initial fetch + poll every 30s
  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  const handleMarkRead = async (id: string) => {
    await markRead(id);
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((c) => {
      const next = Math.max(0, c - 1);
      onCountChange?.(next);
      return next;
    });
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    onCountChange?.(0);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'DM Serif Display', serif; }
      `}</style>

      <div className="bg-[#f5f2ed] min-h-screen p-6 md:p-8 text-[#1a1916]">

        {/* Top bar */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="serif text-[22px] font-normal tracking-tight text-[#1a1916] flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="text-[11px] font-medium bg-[#1a1916] text-white px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-[12px] text-[#b4b2a9] mt-0.5">
              {new Date().toLocaleDateString("en-PK", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="text-[12px] font-medium px-4 py-1.5 rounded-lg bg-white border border-[#e8e5df] text-[#888780] hover:text-[#1a1916] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Mark All Read
          </button>
        </div>

        {/* States */}
        {loading && (
          <p className="text-[12px] text-[#b4b2a9] text-center py-12">Loading…</p>
        )}
        {error && (
          <p className="text-[12px] text-red-400 text-center py-12">{error}</p>
        )}

        {/* List */}
        {!loading && !error && (
          <div>
            <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-3">
              Activity
            </p>

            {notifs.length === 0 ? (
              <div className="bg-white border border-[#e8e5df] rounded-xl px-6 py-12 text-center">
                <p className="text-[13px] text-[#b4b2a9]">
                  All caught up — no notifications yet.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-[#e8e5df] rounded-xl overflow-hidden flex flex-col">
                {notifs.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-4 px-4 py-3.5 border-b border-[#f1efe8] last:border-b-0 transition-colors ${
                      n.read ? "bg-white" : "bg-[#fafaf8]"
                    }`}
                  >
                    <span className={`text-base mt-0.5 flex-shrink-0 ${n.read ? "text-[#b4b2a9]" : "text-[#5f5e5a]"}`}>
                      {ICONS[n.type] ?? "◉"}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className={`text-[12px] leading-relaxed ${n.read ? "text-[#b4b2a9]" : "text-[#1a1916]"}`}>
                        {n.message}
                      </p>
                      <p className="text-[11px] text-[#b4b2a9] mt-0.5">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>

                    {!n.read && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        className="text-[10px] tracking-[0.08em] font-medium uppercase text-[#b4b2a9] hover:text-[#1a1916] transition-colors flex-shrink-0 mt-0.5"
                      >
                        Read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}