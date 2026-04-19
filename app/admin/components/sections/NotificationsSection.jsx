"use client";

import { useState } from "react";

const NOTIFICATIONS = [
  { id: 1, type: "order",    read: false, message: "#ORD-8842 · Aisha Mirza placed an order for PKR 28,400", time: "2 minutes ago" },
  { id: 2, type: "payment",  read: false, message: "#ORD-8838 · PKR 10,892 payment cleared from James Rivera", time: "14 minutes ago" },
  { id: 3, type: "stock",    read: false, message: "Clay Face Mask 100ml has dropped to 3 units · reorder threshold crossed", time: "1 hour ago" },
  { id: 4, type: "review",   read: false, message: "Silk Night Slip received a 5-star review from Yuna Lee", time: "3 hours ago" },
  { id: 5, type: "order",    read: true,  message: "#ORD-8834 · Delivered to Yuna Lee · confirmed by courier", time: "5 hours ago" },
  { id: 6, type: "customer", read: true,  message: "Fatima Zahra created an account and completed first purchase", time: "Yesterday, 11:42 PM" },
  { id: 7, type: "payment",  read: true,  message: "#ORD-8801 · PKR 5,100 refunded to Priya Nair", time: "Yesterday, 6:15 PM" },
  { id: 8, type: "stock",    read: true,  message: "Velvet Robe — Noir · 48 units added to inventory", time: "Yesterday, 2:00 PM" },
];

const ICONS = { order: "◻", stock: "▣", review: "◐", payment: "◈", customer: "◯" };

export default function NotificationsSection() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

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
            <h1 className="serif text-[22px] font-normal tracking-tight text-[#1a1916]">Notifications</h1>
            <p className="text-[12px] text-[#b4b2a9] mt-0.5">Saturday, 18 April 2026</p>
          </div>
          <button
            onClick={markAllRead}
            className="text-[12px] font-medium px-4 py-1.5 rounded-lg bg-white border border-[#e8e5df] text-[#888780] hover:text-[#1a1916] transition-colors"
          >
            Mark All Read
          </button>
        </div>

        {/* Notification list */}
        <div>
          <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-3">Activity</p>

          <div className="bg-white border border-[#e8e5df] rounded-xl overflow-hidden flex flex-col">
            {notifs.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-4 px-4 py-3.5 border-b border-[#f1efe8] last:border-b-0 transition-colors ${
                  n.read ? "bg-white" : "bg-[#fafaf8]"
                }`}
              >
                <span className={`text-base mt-0.5 flex-shrink-0 ${n.read ? "text-[#b4b2a9]" : "text-[#5f5e5a]"}`}>
                  {ICONS[n.type] || "◉"}
                </span>

                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] leading-relaxed ${n.read ? "text-[#b4b2a9]" : "text-[#1a1916]"}`}>
                    {n.message}
                  </p>
                  <p className="text-[11px] text-[#b4b2a9] mt-0.5">{n.time}</p>
                </div>

                {!n.read && (
                  <button
                    onClick={() => setNotifs((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                    className="text-[10px] tracking-[0.08em] font-medium uppercase text-[#b4b2a9] hover:text-[#1a1916] transition-colors flex-shrink-0 mt-0.5"
                  >
                    Read
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}