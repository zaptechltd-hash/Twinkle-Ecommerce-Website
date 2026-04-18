"use client";
import { useState, useRef, useEffect } from "react";
import { NOTIFICATIONS } from '../data/data'
import { SectionHeader } from "../layout/SectionHeader";

export default function NotificationsSection() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const ICONS = { order: "◻", stock: "▣", review: "◐", payment: "◈", customer: "◯" };

  return (
    <div>
      <SectionHeader title="Notifications" subtitle="Activity" action="Mark All Read" onAction={markAllRead} />

      <div className="flex flex-col gap-2">
        {notifs.map((n) => (
          <div
            key={n.id}
            className={`flex items-start gap-4 p-4 border transition-colors ${n.read ? "border-stone-50 bg-white" : "border-stone-100 bg-stone-50"}`}
          >
            <span className="text-stone-400 text-base mt-0.5 flex-shrink-0">{ICONS[n.type] || "◉"}</span>
            <div className="flex-1">
              <p className={`text-[11px] tracking-wide leading-relaxed ${n.read ? "text-stone-400" : "text-stone-700"}`}>{n.message}</p>
              <p className="text-[10px] text-stone-300 mt-0.5">{n.time}</p>
            </div>
            {!n.read && (
              <button
                onClick={() => setNotifs((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                className="text-[9px] tracking-[0.2em] text-stone-400 uppercase hover:text-stone-700 transition-colors flex-shrink-0"
              >
                Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}