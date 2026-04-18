
"use client";

import { useState, useMemo } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

// Product catalogue — swap `icon` for a real image path when available
const PRODUCT_CATALOGUE = {
  "Silk Night Slip":      { icon: "🕯", color: "#e8c4b8", price: 4900, fabric: "Silk" },
  "Velvet Robe":          { icon: "🧴", color: "#2a2a2a", price: 6200, fabric: "Velvet" },
  "Lace Trim Set":        { icon: "🧺", color: "#e8c4b8", price: 5500, fabric: "Modal" },
  "Satin Pyjama":         { icon: "✨", color: "#f5f0e8", price: 5100, fabric: "Satin" },
  "Modal Lounge Set":     { icon: "🧺", color: "#b5a99a", price: 4600, fabric: "Modal" },
  "Gauze Nightdress":     { icon: "🌿", color: "#f5f0e8", price: 3900, fabric: "Cotton" },
  "Silk Kimono Robe":     { icon: "🕯", color: "#2a2a2a", price: 7200, fabric: "Silk" },
  "Cashmere Lounge Top":  { icon: "☁️", color: "#b5a99a", price: 8100, fabric: "Cashmere" },
};

const RAW_ORDERS = [
  {
    id: "#ORD-8841", customer: "Sara Ahmed",      contact: "sara@email.com",    date: "18 Apr 2026, 10:32",
    dateKey: "today",  payment: "Paid",   status: "Delivered",  note: "Please wrap as a gift",
    products: [{ name: "Silk Night Slip", qty: 1 }, { name: "Lace Trim Set", qty: 1 }, { name: "Velvet Robe", qty: 1 }],
  },
  {
    id: "#ORD-8840", customer: "Mikael Koskinen", contact: "mikael@email.com",  date: "18 Apr 2026, 09:15",
    dateKey: "today",  payment: "COD",    status: "Processing", note: "",
    products: [{ name: "Velvet Robe", qty: 1 }, { name: "Silk Kimono Robe", qty: 1 }],
  },
  {
    id: "#ORD-8839", customer: "Layla Tan",       contact: "layla@email.com",   date: "17 Apr 2026, 22:48",
    dateKey: "week",   payment: "Paid",   status: "Pending",    note: "Leave at door, no bell",
    products: [{ name: "Silk Night Slip", qty: 2 }, { name: "Satin Pyjama", qty: 1 }, { name: "Lace Trim Set", qty: 1 }],
  },
  {
    id: "#ORD-8838", customer: "James Rivera",    contact: "james@email.com",   date: "17 Apr 2026, 18:05",
    dateKey: "week",   payment: "Paid",   status: "Delivered",  note: "",
    products: [{ name: "Gauze Nightdress", qty: 1 }],
  },
  {
    id: "#ORD-8837", customer: "Priya Nair",      contact: "priya@email.com",   date: "17 Apr 2026, 14:30",
    dateKey: "week",   payment: "Failed", status: "Cancelled",  note: "Payment failed, will retry",
    products: [{ name: "Cashmere Lounge Top", qty: 1 }, { name: "Modal Lounge Set", qty: 1 }],
  },
  {
    id: "#ORD-8836", customer: "Omar Bakr",       contact: "omar@email.com",    date: "17 Apr 2026, 11:22",
    dateKey: "week",   payment: "COD",    status: "Processing", note: "Fragile items — handle with care",
    products: [{ name: "Silk Kimono Robe", qty: 1 }, { name: "Velvet Robe", qty: 2 }, { name: "Silk Night Slip", qty: 1 }, { name: "Gauze Nightdress", qty: 1 }],
  },
  {
    id: "#ORD-8835", customer: "Clara Schulz",    contact: "clara@email.com",   date: "16 Apr 2026, 20:10",
    dateKey: "week",   payment: "Paid",   status: "Pending",    note: "",
    products: [{ name: "Lace Trim Set", qty: 1 }],
  },
  {
    id: "#ORD-8834", customer: "Yuna Lee",        contact: "yuna@email.com",    date: "16 Apr 2026, 17:45",
    dateKey: "week",   payment: "Paid",   status: "Delivered",  note: "Anniversary gift, please include card",
    products: [{ name: "Silk Kimono Robe", qty: 1 }, { name: "Cashmere Lounge Top", qty: 1 }, { name: "Velvet Robe", qty: 1 }, { name: "Silk Night Slip", qty: 2 }, { name: "Satin Pyjama", qty: 1 }],
  },
  {
    id: "#ORD-8833", customer: "Aisha Malik",     contact: "aisha@email.com",   date: "16 Apr 2026, 14:00",
    dateKey: "week",   payment: "COD",    status: "Shipped",    note: "",
    products: [{ name: "Silk Night Slip", qty: 1 }, { name: "Gauze Nightdress", qty: 1 }],
  },
  {
    id: "#ORD-8832", customer: "Tomas Novak",     contact: "tomas@email.com",   date: "10 Apr 2026, 10:30",
    dateKey: "week",   payment: "Paid",   status: "Shipped",    note: "Express delivery requested",
    products: [{ name: "Cashmere Lounge Top", qty: 1 }, { name: "Velvet Robe", qty: 1 }, { name: "Modal Lounge Set", qty: 1 }],
  },
  {
    id: "#ORD-8831", customer: "Elif Yilmaz",     contact: "elif@email.com",    date: "Feb 15, 2026, 19:55",
    dateKey: "year",   payment: "Failed", status: "Cancelled",  note: "Card declined",
    products: [{ name: "Silk Kimono Robe", qty: 1 }],
  },
  {
    id: "#ORD-8830", customer: "Rania Hassan",    contact: "rania@email.com",   date: "Jan 10, 2026, 15:10",
    dateKey: "year",   payment: "Paid",   status: "Processing", note: "",
    products: [{ name: "Gauze Nightdress", qty: 1 }, { name: "Modal Lounge Set", qty: 1 }],
  },
];

// Auto-compute amount + items count from products
const ORDERS = RAW_ORDERS.map((o) => ({
  ...o,
  amount: o.products.reduce((s, p) => s + (PRODUCT_CATALOGUE[p.name]?.price ?? 0) * p.qty, 0),
  items:  o.products.reduce((s, p) => s + p.qty, 0),
}));

const STATUSES  = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const DATE_TABS = [
  { key: "all",   label: "All" },
  { key: "today", label: "Today" },
  { key: "week",  label: "This Week" },
  { key: "year",  label: "This Year" },
];
const PER_PAGE = 6;

// ─── Style maps ───────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  Delivered:  { pill: "bg-[#eaf3de] text-[#3b6d11]", dot: "bg-[#639922]" },
  Processing: { pill: "bg-[#e6f1fb] text-[#185fa5]", dot: "bg-[#378add]" },
  Pending:    { pill: "bg-[#faeeda] text-[#854f0b]", dot: "bg-[#ef9f27]" },
  Cancelled:  { pill: "bg-[#fcebeb] text-[#a32d2d]", dot: "bg-[#e24b4a]" },
  Shipped:    { pill: "bg-[#ede9f7] text-[#4a3b9c]", dot: "bg-[#7c6fd4]" },
};

const PAYMENT_STYLES = {
  Paid:   "bg-[#eaf3de] text-[#3b6d11]",
  COD:    "bg-[#faeeda] text-[#854f0b]",
  Failed: "bg-[#fcebeb] text-[#a32d2d]",
};

// ─── Reusable primitives ──────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-3">
      {children}
    </p>
  );
}

function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function PaymentBadge({ payment }) {
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${PAYMENT_STYLES[payment] || ""}`}>
      {payment}
    </span>
  );
}

function Initials({ name }) {
  const letters = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-lg bg-[#f1efe8] flex items-center justify-center text-[10px] font-medium text-[#888780] flex-shrink-0">
      {letters}
    </div>
  );
}

// ─── Product row inside modal ─────────────────────────────────────────────────

function ProductRow({ name, qty }) {
  const info = PRODUCT_CATALOGUE[name] || { icon: "🛍", color: "#f1efe8", price: 0, fabric: "" };
  const lineTotal = info.price * qty;

  return (
    <div className="flex items-center gap-3 bg-[#f9f8f6] border border-[#e8e5df] rounded-xl px-3 py-2.5">
      {/*
        Thumbnail — currently renders an emoji placeholder with the product's
        accent colour. Replace the <div> with an <img> when you have real assets:

        <img
          src={`/products/${name.toLowerCase().replace(/ /g, "-")}.jpg`}
          alt={name}
          className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-black/5"
        />
      */}
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center text-lg flex-shrink-0 border border-black/5"
        style={{ backgroundColor: info.color + "44" }}
      >
        {info.icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1a1916] truncate">{name}</p>
        <p className="text-[11px] text-[#b4b2a9]">{info.fabric} · PKR {info.price.toLocaleString()} each</p>
      </div>

      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-[11px] font-medium bg-[#f1efe8] text-[#5f5e5a] px-2 py-0.5 rounded-md">
          Qty: {qty}
        </span>
        <span className="text-[11px] font-medium text-[#1a1916]">
          PKR {lineTotal.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

// ─── Order Detail / Edit Modal ────────────────────────────────────────────────

function OrderModal({ order, onClose, onStatusChange }) {
  const [editing, setEditing] = useState(false);

  const orderTotal = order.products.reduce(
    (s, p) => s + (PRODUCT_CATALOGUE[p.name]?.price ?? 0) * p.qty,
    0
  );

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">

          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] mb-1">
                {editing ? "Edit Order" : "Order Details"}
              </p>
              <h2 className="text-xl font-medium text-[#1a1916]">{order.id}</h2>
            </div>
            <div className="flex items-center gap-2">
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-[#e8e5df] text-[#888780] hover:bg-[#1a1916] hover:text-[#f5f2ed] hover:border-[#1a1916] transition-all"
                >
                  Edit
                </button>
              )}
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg bg-[#f1efe8] flex items-center justify-center text-[#5f5e5a] hover:bg-[#e8e5df] transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            {[
              ["Customer",     <span className="font-medium">{order.customer}</span>],
              ["Contact",      <span className="text-[#185fa5]">{order.contact}</span>],
              ["Date & Time",  order.date],
              ["Payment",      <PaymentBadge payment={order.payment} />],
              ["Order Total",  <span className="font-medium">PKR {orderTotal.toLocaleString()}</span>],
              ["Items",        `${order.items} item${order.items !== 1 ? "s" : ""}`],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] mb-1">{label}</p>
                <div className="text-[13px] text-[#1a1916]">{val}</div>
              </div>
            ))}
          </div>

          {/* Products */}
          <div className="mb-5">
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] mb-3">Products Ordered</p>
            <div className="flex flex-col gap-2">
              {order.products.map((p, i) => (
                <ProductRow key={i} name={p.name} qty={p.qty} />
              ))}
            </div>
            {/* Total line */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e8e5df]">
              <p className="text-[11px] font-medium text-[#5f5e5a]">Order Total</p>
              <p className="text-[13px] font-medium text-[#1a1916]">PKR {orderTotal.toLocaleString()}</p>
            </div>
          </div>

          {/* Customer note */}
          <div className="mb-5">
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] mb-2">Customer Note</p>
            {order.note ? (
              <div className="bg-[#faeeda] border border-[#fac775] rounded-lg px-3 py-2.5 text-[12px] text-[#854f0b] leading-relaxed">
                {order.note}
              </div>
            ) : (
              <p className="text-[12px] text-[#b4b2a9] italic">No notes added</p>
            )}
          </div>

          {/* Status */}
          <div className="border-t border-[#f1efe8] pt-4">
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] mb-2">Order Status</p>
            <div className="mb-3"><StatusPill status={order.status} /></div>
            {editing && (
              <div className="flex flex-wrap gap-2">
                {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => { onStatusChange(order.id, s); onClose(); }}
                    className={`text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-all ${
                      s === order.status
                        ? "bg-[#1a1916] text-[#f5f2ed] border-[#1a1916]"
                        : "border-[#e8e5df] text-[#5f5e5a] hover:bg-[#1a1916] hover:text-[#f5f2ed] hover:border-[#1a1916]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Bulk Action Bar ──────────────────────────────────────────────────────────

function BulkBar({ count, onAction, onClear }) {
  return (
    <div className="bg-[#1a1916] rounded-xl px-4 py-3 flex items-center gap-2 flex-wrap mb-3">
      <span className="text-[12px] font-medium text-[#f5f2ed] mr-1">
        {count} order{count !== 1 ? "s" : ""} selected
      </span>
      {[
        { label: "Mark Shipped",    key: "Shipped" },
        { label: "Mark Processing", key: "Processing" },
        { label: "Mark Delivered",  key: "Delivered" },
      ].map((a) => (
        <button
          key={a.key}
          onClick={() => onAction(a.key)}
          className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-white/20 text-[#f5f2ed] bg-white/10 hover:bg-white/20 transition-all"
        >
          {a.label}
        </button>
      ))}
      <button
        onClick={() => onAction("cancel")}
        className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-[#f09595]/50 text-[#f09595] bg-white/5 hover:bg-[#e24b4a]/20 transition-all"
      >
        Cancel Orders
      </button>
      <button onClick={onClear} className="ml-auto text-white/40 hover:text-white/70 text-xl leading-none transition-colors">×</button>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1916] text-[#f5f2ed] text-[12px] font-medium px-5 py-2.5 rounded-xl z-[200] shadow-lg pointer-events-none">
      {message}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrderManagement() {
  const [orders, setOrders]         = useState(ORDERS);
  const [dateTab, setDateTab]       = useState("all");
  const [activeStatus, setStatus]   = useState("All");
  const [search, setSearch]         = useState("");
  const [payFilter, setPayFilter]   = useState("All");
  const [dateSort, setDateSort]     = useState("desc");
  const [page, setPage]             = useState(1);
  const [selected, setSelected]     = useState(new Set());
  const [modalOrder, setModalOrder] = useState(null);
  const [toast, setToast]           = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const resetPage = () => setPage(1);
  const changeStatus  = (s) => { setStatus(s);  resetPage(); setSelected(new Set()); };
  const changeDateTab = (k) => { setDateTab(k); resetPage(); setSelected(new Set()); };

  // ── Filtered list ──
  const filtered = useMemo(() => {
    let d = [...orders];
    // date tab: "week" includes today's orders too
    if (dateTab === "today") d = d.filter((o) => o.dateKey === "today");
    else if (dateTab === "week") d = d.filter((o) => o.dateKey === "today" || o.dateKey === "week");
    else if (dateTab === "year") d = d.filter((o) => o.dateKey === "year" || o.dateKey === "week" || o.dateKey === "today");
    if (activeStatus !== "All") d = d.filter((o) => o.status === activeStatus);
    if (payFilter !== "All")    d = d.filter((o) => o.payment === payFilter);
    if (search)                 d = d.filter((o) =>
      o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search)
    );
    d.sort((a, b) => dateSort === "desc" ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id));
    return d;
  }, [orders, dateTab, activeStatus, payFilter, search, dateSort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const pageSlice  = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  // ── Stats (always over ALL orders regardless of filter) ──
  const stats = useMemo(() => ({
    total:     orders.length,
    pending:   orders.filter((o) => o.status === "Pending").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    revenue:   orders.reduce((a, o) => a + o.amount, 0),
  }), [orders]);

  const revenueStr = stats.revenue >= 1_000_000
    ? `PKR ${(stats.revenue / 1_000_000).toFixed(1)}M`
    : `PKR ${stats.revenue.toLocaleString()}`;

  // ── Selection helpers ──
  const toggleRow   = (id) => setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll   = (chk) => setSelected((p) => { const n = new Set(p); pageSlice.forEach((o) => chk ? n.add(o.id) : n.delete(o.id)); return n; });
  const allChecked  = pageSlice.length > 0 && pageSlice.every((o) => selected.has(o.id));
  const someChecked = pageSlice.some((o) => selected.has(o.id));

  // ── Status updates ──
  const updateStatus = (id, status) =>
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));

  const bulkAction = (key) => {
    const ids = [...selected];
    const newStatus = key === "cancel" ? "Cancelled" : key;
    setOrders((prev) => prev.map((o) => ids.includes(o.id) ? { ...o, status: newStatus } : o));
    showToast(`${ids.length} order${ids.length !== 1 ? "s" : ""} marked as ${newStatus}`);
    setSelected(new Set());
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'DM Serif Display', serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="bg-[#f5f2ed] min-h-screen p-6 md:p-8 text-[#1a1916]">

        {/* ── Top bar ── */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="serif text-[22px] font-normal tracking-tight">Order Management</h1>
            <p className="text-[12px] text-[#b4b2a9] mt-0.5">Saturday, 18 April 2026</p>
          </div>

          {/* Date period switcher — identical pattern to dashboard */}
          <div className="flex gap-1.5 bg-white border border-[#e8e5df] rounded-xl p-1">
            {DATE_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => changeDateTab(t.key)}
                className={`text-[12px] font-medium px-4 py-1.5 rounded-lg transition-all ${
                  dateTab === t.key
                    ? "bg-[#1a1916] text-[#f5f2ed]"
                    : "text-[#888780] hover:text-[#1a1916]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="mb-6">
          <SectionLabel>Overview</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Orders", value: stats.total,     color: "text-[#1a1916]" },
              { label: "Pending",      value: stats.pending,   color: "text-[#854f0b]" },
              { label: "Delivered",    value: stats.delivered, color: "text-[#3b6d11]" },
              { label: "Revenue",      value: revenueStr,      color: "text-[#1a1916]" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-[#e8e5df] rounded-xl p-4">
                <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-2">{s.label}</p>
                <p className={`text-xl font-medium leading-none ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Orders table card ── */}
        <div className="bg-white border border-[#e8e5df] rounded-xl p-5">

          {/* Search + dropdowns */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b4b2a9] text-sm select-none">⌕</span>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                placeholder="Search by order ID or customer…"
                className="w-full pl-8 pr-3 py-2 text-[12px] border border-[#e8e5df] rounded-xl bg-white text-[#1a1916] placeholder-[#b4b2a9] outline-none focus:border-[#1a1916] transition-colors"
              />
            </div>
            <select
              value={payFilter}
              onChange={(e) => { setPayFilter(e.target.value); resetPage(); }}
              className="text-[12px] px-3 py-2 border border-[#e8e5df] rounded-xl bg-white text-[#5f5e5a] outline-none"
            >
              {["All", "Paid", "COD", "Failed"].map((p) => (
                <option key={p} value={p}>{p === "All" ? "All payments" : p}</option>
              ))}
            </select>
            <select
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value)}
              className="text-[12px] px-3 py-2 border border-[#e8e5df] rounded-xl bg-white text-[#5f5e5a] outline-none"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>

          {/* Status tabs */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => changeStatus(s)}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${
                  activeStatus === s
                    ? "bg-[#1a1916] text-[#f5f2ed]"
                    : "bg-[#f5f2ed] text-[#888780] hover:text-[#1a1916]"
                }`}
              >
                {s}
                <span className={`ml-1.5 text-[10px] ${activeStatus === s ? "opacity-60" : "opacity-50"}`}>
                  {s === "All" ? orders.length : orders.filter((o) => o.status === s).length}
                </span>
              </button>
            ))}
          </div>

          {/* Bulk bar */}
          {selected.size > 0 && (
            <BulkBar count={selected.size} onAction={bulkAction} onClear={() => setSelected(new Set())} />
          )}

          {/* Select-all row */}
          <div className="flex items-center gap-2 mb-3">
            <label className="flex items-center gap-2 text-[11px] text-[#b4b2a9] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allChecked}
                ref={(el) => { if (el) el.indeterminate = someChecked && !allChecked; }}
                onChange={(e) => toggleAll(e.target.checked)}
                className="accent-[#1a1916] w-3.5 h-3.5"
              />
              Select all visible
            </label>
            <span className="ml-auto text-[11px] text-[#b4b2a9]">
              {filtered.length} order{filtered.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-[#e8e5df]">
                  {["", "Order", "Customer", "Date", "Items", "Amount", "Payment", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-[9px] tracking-[0.18em] uppercase text-[#b4b2a9] font-medium pb-3 pr-4 last:pr-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f2ed]">
                {pageSlice.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-[12px] text-[#b4b2a9]">
                      No orders match your filters
                    </td>
                  </tr>
                ) : pageSlice.map((order) => (
                  <tr
                    key={order.id}
                    className={`transition-colors ${selected.has(order.id) ? "bg-[#f5f2f0]" : "hover:bg-[#fafaf8]"}`}
                  >
                    <td className="py-3 pr-3 w-5">
                      <input
                        type="checkbox"
                        checked={selected.has(order.id)}
                        onChange={() => toggleRow(order.id)}
                        className="accent-[#1a1916] w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-[12px] font-medium text-[#1a1916]">{order.id}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Initials name={order.customer} />
                        <div>
                          <p className="text-[12px] font-medium text-[#1a1916]">{order.customer}</p>
                          <p className="text-[10px] text-[#b4b2a9]">{order.contact}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-[11px] text-[#5f5e5a] whitespace-nowrap">{order.date}</span>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <span className="text-[12px] text-[#5f5e5a]">{order.items}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-[12px] font-medium text-[#1a1916]">PKR {order.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <PaymentBadge payment={order.payment} />
                    </td>
                    <td className="py-3 pr-4">
                      <StatusPill status={order.status} />
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setModalOrder(order)}
                          className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg border border-[#e8e5df] text-[#5f5e5a] hover:bg-[#1a1916] hover:text-[#f5f2ed] hover:border-[#1a1916] transition-all"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setModalOrder(order)}
                          className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg bg-[#faeeda] text-[#854f0b] border border-transparent hover:bg-[#1a1916] hover:text-[#f5f2ed] transition-all"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
            <p className="text-[11px] text-[#b4b2a9]">
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1}–{Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={safePage === 1}
                onClick={() => setPage((p) => p - 1)}
                className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-[#e8e5df] text-[#5f5e5a] disabled:opacity-30 disabled:cursor-not-allowed transition-all enabled:hover:bg-[#1a1916] enabled:hover:text-[#f5f2ed] enabled:hover:border-[#1a1916]"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`text-[11px] font-medium w-8 h-8 rounded-lg transition-all ${
                    n === safePage ? "bg-[#1a1916] text-[#f5f2ed]" : "text-[#5f5e5a] hover:bg-[#f1efe8]"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                disabled={safePage === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-[#e8e5df] text-[#5f5e5a] disabled:opacity-30 disabled:cursor-not-allowed transition-all enabled:hover:bg-[#1a1916] enabled:hover:text-[#f5f2ed] enabled:hover:border-[#1a1916]"
              >
                →
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Modal ── */}
      {modalOrder && (
        <OrderModal
          order={modalOrder}
          onClose={() => setModalOrder(null)}
          onStatusChange={(id, status) => {
            updateStatus(id, status);
            showToast(`${id} → ${status}`);
          }}
        />
      )}

      {/* ── Toast ── */}
      <Toast message={toast} />
    </>
  );
}