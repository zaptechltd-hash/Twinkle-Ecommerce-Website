// "use client";
// import { useState, useRef, useEffect } from "react";
// import { COUPONS } from '../data/data'
// import { SectionHeader } from "../layout/SectionHeader";
// import { Badge } from '../ui/Badge'
// import { Modal } from "../ui/Modal";
// import { FormField } from "../ui/FormField";

// export default function CouponsSection() {
//   const [showAdd, setShowAdd] = useState(false);
//   const [coupons, setCoupons] = useState(COUPONS);
//   const [newCoupon, setNewCoupon] = useState({ code: "", type: "Percentage", value: "", limit: "", expiry: "", status: "Active" });

//   function handleAdd() {
//     setCoupons((prev) => [{ ...newCoupon, uses: 0 }, ...prev]);
//     setShowAdd(false);
//     setNewCoupon({ code: "", type: "Percentage", value: "", limit: "", expiry: "", status: "Active" });
//   }

//   return (
//     <div>
//       <SectionHeader title="Coupons" subtitle="Discounts" action="+ New Coupon" onAction={() => setShowAdd(true)} />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {coupons.map((c, i) => (
//           <div key={i} className="border border-stone-100 p-5 hover:border-stone-300 transition-colors">
//             <div className="flex items-start justify-between mb-3">
//               <p className="font-mono text-[15px] tracking-[0.2em] text-stone-800">{c.code}</p>
//               <Badge status={c.status} />
//             </div>
//             <div className="grid grid-cols-2 gap-2">
//               {[
//                 ["Type", c.type],
//                 ["Value", c.value],
//                 ["Used / Limit", `${c.uses} / ${c.limit}`],
//                 ["Expires", c.expiry],
//               ].map(([k, v]) => (
//                 <div key={k}>
//                   <p className="text-[9px] tracking-[0.2em] text-stone-400 uppercase mb-0.5">{k}</p>
//                   <p className="text-[11px] text-stone-600">{v}</p>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-3 pt-3 border-t border-stone-50">
//               <div className="w-full bg-stone-100 h-1">
//                 <div className="bg-stone-800 h-1 transition-all" style={{ width: `${Math.min((c.uses / c.limit) * 100, 100)}%` }} />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {showAdd && (
//         <Modal title="Create Coupon" onClose={() => setShowAdd(false)}>
//           <FormField label="Coupon Code" value={newCoupon.code} onChange={(v) => setNewCoupon({ ...newCoupon, code: v.toUpperCase() })} />
//           <FormField label="Discount Type" value={newCoupon.type} onChange={(v) => setNewCoupon({ ...newCoupon, type: v })} options={["Percentage", "Fixed"]} />
//           <FormField label="Value (% or PKR)" value={newCoupon.value} onChange={(v) => setNewCoupon({ ...newCoupon, value: v })} />
//           <FormField label="Usage Limit" type="number" value={newCoupon.limit} onChange={(v) => setNewCoupon({ ...newCoupon, limit: v })} />
//           <FormField label="Expiry Date" type="date" value={newCoupon.expiry} onChange={(v) => setNewCoupon({ ...newCoupon, expiry: v })} />
//           <button
//             onClick={handleAdd}
//             className="w-full py-3 bg-stone-900 text-white text-[11px] tracking-[0.3em] uppercase hover:bg-stone-700 transition-colors mt-2"
//           >
//             Create Coupon
//           </button>
//         </Modal>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";

// ─── Coupon Data ──────────────────────────────────────────────────────────────

const INITIAL_COUPONS = [
  {
    code: "SILK20",
    type: "Percentage",
    value: "20%",
    uses: 341,
    limit: 500,
    expiry: "2026-05-30",
    status: "Active",
  },
  {
    code: "NOIR15",
    type: "Percentage",
    value: "15%",
    uses: 188,
    limit: 250,
    expiry: "2026-04-22",
    status: "Active",
  },
  {
    code: "VELVET500",
    type: "Fixed",
    value: "PKR 500",
    uses: 97,
    limit: 200,
    expiry: "2026-06-15",
    status: "Active",
  },
  {
    code: "NEWCUST10",
    type: "Percentage",
    value: "10%",
    uses: 203,
    limit: null,
    expiry: null,
    status: "Active",
  },
  {
    code: "BLUSH25",
    type: "Fixed",
    value: "PKR 250",
    uses: 56,
    limit: 100,
    expiry: "2026-04-20",
    status: "Active",
  },
  {
    code: "WINTER22",
    type: "Percentage",
    value: "22%",
    uses: 119,
    limit: 150,
    expiry: "2025-12-31",
    status: "Expired",
  },
];

const FILTERS = ["All", "Active", "Expired", "Percentage", "Fixed"];

const STATUS_STYLES = {
  Active:  { pill: "bg-[#eaf3de] text-[#3b6d11]", dot: "bg-[#639922]" },
  Expired: { pill: "bg-[#fcebeb] text-[#a32d2d]", dot: "bg-[#e24b4a]" },
  Paused:  { pill: "bg-[#faeeda] text-[#854f0b]", dot: "bg-[#ef9f27]" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-1">
      {children}
    </p>
  );
}

function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Active;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function TypeBadge({ type }) {
  return (
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
        type === "Percentage"
          ? "bg-[#e6f1fb] text-[#185fa5]"
          : "bg-[#f1efe8] text-[#5f5e5a]"
      }`}
    >
      {type}
    </span>
  );
}

function UsageBar({ uses, limit }) {
  if (!limit) {
    return (
      <div className="h-[3px] bg-[#f1efe8] rounded-full w-full">
        <div className="h-[3px] bg-[#1a1916] rounded-full w-[40%]" />
      </div>
    );
  }
  const pct = Math.min(Math.round((uses / limit) * 100), 100);
  const barColor =
    pct >= 90 ? "bg-[#e24b4a]" : pct >= 70 ? "bg-[#ef9f27]" : "bg-[#1a1916]";
  return (
    <div className="h-[3px] bg-[#f1efe8] rounded-full w-full">
      <div
        className={`h-[3px] rounded-full transition-all duration-300 ${barColor}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function MetricCard({ label, value, badge, badgeStyle }) {
  return (
    <div className="bg-white border border-[#e8e5df] rounded-xl p-4 flex-1 min-w-[120px]">
      <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-2">
        {label}
      </p>
      <p className="text-xl font-medium text-[#1a1916] leading-none">{value}</p>
      <span className={`inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-md ${badgeStyle}`}>
        {badge}
      </span>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function FormField({ label, id, type = "text", placeholder, children }) {
  return (
    <div>
      <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-1.5">
        {label}
      </p>
      {children ?? (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className="w-full bg-white border border-[#e8e5df] rounded-[10px] px-3 py-2.5 text-[13px] text-[#1a1916] outline-none focus:border-[#1a1916] transition-colors"
        />
      )}
    </div>
  );
}

function CreateModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    code: "",
    type: "Percentage",
    value: "",
    limit: "",
    expiry: "",
  });

  function handleSubmit() {
    if (!form.code.trim() || !form.value.trim()) return;
    onAdd({
      code: form.code.toUpperCase(),
      type: form.type,
      value: form.value,
      uses: 0,
      limit: form.limit ? parseInt(form.limit) : null,
      expiry: form.expiry || null,
      status: "Active",
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1916]/45 p-4">
      <div className="bg-[#f5f2ed] rounded-2xl p-7 w-full max-w-[420px]">
        <div className="flex items-center justify-between mb-5">
          <p
            className="text-[18px] font-normal text-[#1a1916]"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            New Coupon
          </p>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-[#e8e5df] bg-white text-[#888780] flex items-center justify-center text-base hover:bg-[#f1efe8] transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <FormField label="Coupon Code" id="f-code" placeholder="e.g. SUMMER20">
            <input
              type="text"
              placeholder="e.g. SUMMER20"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="w-full bg-white border border-[#e8e5df] rounded-[10px] px-3 py-2.5 text-[13px] text-[#1a1916] outline-none focus:border-[#1a1916] transition-colors font-medium tracking-wider"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-2.5">
            <FormField label="Type">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-white border border-[#e8e5df] rounded-[10px] px-3 py-2.5 text-[13px] text-[#1a1916] outline-none focus:border-[#1a1916] transition-colors appearance-none"
              >
                <option>Percentage</option>
                <option>Fixed</option>
              </select>
            </FormField>
            <FormField label="Value">
              <input
                type="text"
                placeholder={form.type === "Percentage" ? "e.g. 20%" : "e.g. PKR 500"}
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="w-full bg-white border border-[#e8e5df] rounded-[10px] px-3 py-2.5 text-[13px] text-[#1a1916] outline-none focus:border-[#1a1916] transition-colors"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <FormField label="Usage Limit">
              <input
                type="number"
                placeholder="100 (or leave blank)"
                value={form.limit}
                onChange={(e) => setForm({ ...form, limit: e.target.value })}
                className="w-full bg-white border border-[#e8e5df] rounded-[10px] px-3 py-2.5 text-[13px] text-[#1a1916] outline-none focus:border-[#1a1916] transition-colors"
              />
            </FormField>
            <FormField label="Expiry Date">
              <input
                type="date"
                value={form.expiry}
                onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                className="w-full bg-white border border-[#e8e5df] rounded-[10px] px-3 py-2.5 text-[13px] text-[#1a1916] outline-none focus:border-[#1a1916] transition-colors"
              />
            </FormField>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-[#1a1916] text-[#f5f2ed] text-[12px] font-medium rounded-[10px] hover:bg-[#2e2d29] transition-colors mt-1"
          >
            Create Coupon
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Coupon Card ──────────────────────────────────────────────────────────────

function CouponCard({ coupon, onToggle }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const usesDisplay = coupon.limit
    ? `${coupon.uses} / ${coupon.limit}`
    : `${coupon.uses} / ∞`;

  const pct = coupon.limit
    ? Math.min(Math.round((coupon.uses / coupon.limit) * 100), 100)
    : null;

  return (
    <div className="bg-white border border-[#e8e5df] rounded-[14px] p-5 flex flex-col gap-3.5 hover:border-[#c9c6be] transition-colors">

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[15px] font-medium tracking-[0.14em] text-[#1a1916]">
            {coupon.code}
          </p>
          <p className="text-[11px] text-[#b4b2a9] mt-1">Created by admin</p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <TypeBadge type={coupon.type} />
          <StatusPill status={coupon.status} />
        </div>
      </div>

      {/* Value + Expiry */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-[#f9f8f5] rounded-[10px] px-3 py-2.5">
          <p className="text-[9px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-1">
            Discount
          </p>
          <p className="text-[17px] font-medium text-[#1a1916]">{coupon.value}</p>
        </div>
        <div className="bg-[#f9f8f5] rounded-[10px] px-3 py-2.5">
          <p className="text-[9px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-1">
            Expires
          </p>
          <p className="text-[13px] font-medium text-[#1a1916]">
            {coupon.expiry ?? "∞ No limit"}
          </p>
        </div>
      </div>

      {/* Usage */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9]">
            Redemptions
          </p>
          <p className="text-[11px] font-medium text-[#1a1916]">
            {usesDisplay}
            {pct !== null && (
              <span className="text-[#b4b2a9] ml-1.5">· {pct}%</span>
            )}
          </p>
        </div>
        <UsageBar uses={coupon.uses} limit={coupon.limit} />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-0.5">
        <button
          onClick={handleCopy}
          className={`flex-1 text-[11px] font-medium py-2 rounded-[9px] border border-[#e8e5df] bg-white transition-colors ${
            copied ? "text-[#3b6d11]" : "text-[#1a1916] hover:bg-[#f5f2ed]"
          }`}
        >
          {copied ? "Copied!" : "Copy code"}
        </button>
        <button
          onClick={onToggle}
          className={`flex-1 text-[11px] font-medium py-2 rounded-[9px] border border-[#e8e5df] bg-white transition-colors hover:bg-[#f5f2ed] ${
            coupon.status === "Active" ? "text-[#a32d2d]" : "text-[#3b6d11]"
          }`}
        >
          {coupon.status === "Active" ? "Pause" : "Reactivate"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CouponsSection() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  function handleAdd(newCoupon) {
    setCoupons((prev) => [newCoupon, ...prev]);
  }

  function handleToggle(index) {
    setCoupons((prev) =>
      prev.map((c, i) =>
        i !== index
          ? c
          : { ...c, status: c.status === "Active" ? "Paused" : "Active" }
      )
    );
  }

  const filtered = coupons.filter((c) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Active") return c.status === "Active";
    if (activeFilter === "Expired") return c.status === "Expired";
    if (activeFilter === "Percentage") return c.type === "Percentage";
    if (activeFilter === "Fixed") return c.type === "Fixed";
    return true;
  });

  const totalUses = coupons.reduce((sum, c) => sum + c.uses, 0);
  const activeCount = coupons.filter((c) => c.status === "Active").length;
  const expiringSoon = coupons.filter((c) => {
    if (!c.expiry) return false;
    const diff = (new Date(c.expiry) - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'DM Serif Display', serif; }
      `}</style>

      <div className="bg-[#f5f2ed] min-h-screen p-6 md:p-8 text-[#1a1916]">

        {/* ── Top bar ── */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <SectionLabel>Promotions</SectionLabel>
            <h1
              className="text-[22px] font-normal tracking-tight text-[#1a1916] serif"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Coupons
            </h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#f5f2ed] bg-[#1a1916] rounded-xl px-4 py-2.5 hover:bg-[#2e2d29] transition-colors"
          >
            <span className="text-base leading-none -mt-px">+</span> New Coupon
          </button>
        </div>

        {/* ── Metric cards ── */}
        <div className="mb-6">
          <SectionLabel>Overview</SectionLabel>
          <div className="flex flex-wrap gap-3">
            <MetricCard
              label="Total coupons"
              value={coupons.length}
              badge={`${activeCount} active`}
              badgeStyle="bg-[#eaf3de] text-[#3b6d11]"
            />
            <MetricCard
              label="Total redemptions"
              value={totalUses.toLocaleString()}
              badge="this month"
              badgeStyle="bg-[#e6f1fb] text-[#185fa5]"
            />
            <MetricCard
              label="Savings given"
              value="PKR 284K"
              badge="–3% AOV impact"
              badgeStyle="bg-[#faeeda] text-[#854f0b]"
            />
            <MetricCard
              label="Expiring soon"
              value={expiringSoon}
              badge="within 7 days"
              badgeStyle={expiringSoon > 0 ? "bg-[#fcebeb] text-[#a32d2d]" : "bg-[#f1efe8] text-[#5f5e5a]"}
            />
          </div>
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${
                activeFilter === f
                  ? "bg-[#1a1916] text-[#f5f2ed]"
                  : "bg-[#f5f2ed] text-[#888780] hover:bg-[#ede9e3] hover:text-[#1a1916]"
              }`}
            >
              {f}
              <span className={`ml-1.5 text-[10px] ${activeFilter === f ? "opacity-60" : "opacity-50"}`}>
                {f === "All"
                  ? coupons.length
                  : f === "Active"
                  ? coupons.filter((c) => c.status === "Active").length
                  : f === "Expired"
                  ? coupons.filter((c) => c.status === "Expired").length
                  : f === "Percentage"
                  ? coupons.filter((c) => c.type === "Percentage").length
                  : coupons.filter((c) => c.type === "Fixed").length}
              </span>
            </button>
          ))}
        </div>

        {/* ── Coupon grid ── */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-[#e8e5df] rounded-xl p-10 text-center text-[13px] text-[#b4b2a9]">
            No coupons match this filter
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((coupon, i) => (
              <CouponCard
                key={coupon.code + i}
                coupon={coupon}
                onToggle={() => {
                  const realIndex = coupons.indexOf(coupon);
                  handleToggle(realIndex);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <CreateModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
    </>
  );
}