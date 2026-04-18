"use client";
import { useState, useEffect, useRef } from "react";

// ─── Paste your real imports once you drop this into your project ──────────────
// import { SectionHeader } from "../layout/SectionHeader";
// import { SearchBar } from '../ui/SearchBar';
// import { CUSTOMERS } from '../data/data';
// import { Badge } from '../ui/Badge';
// import { Pagination } from "../ui/Pagination";

// ─── Sample data (remove when using your real CUSTOMERS import) ───────────────
const CUSTOMERS = [
  { id:1,  name:"Sara Ahmed",          email:"sara.ahmed@gmail.com",      orders:14, spent:214800, joined:"Jan 2024", status:"Active",   tier:"VIP"   },
  { id:2,  name:"Mikael Koskinen",     email:"mikael.k@outlook.com",      orders:11, spent:178200, joined:"Mar 2024", status:"Active",   tier:"VIP"   },
  { id:3,  name:"Layla Tan",           email:"layla.tan@icloud.com",      orders:9,  spent:141400, joined:"Feb 2024", status:"Active",   tier:"Loyal" },
  { id:4,  name:"James Rivera",        email:"jrivera@gmail.com",         orders:7,  spent:98700,  joined:"Apr 2024", status:"Active",   tier:"Loyal" },
  { id:5,  name:"Priya Nair",          email:"priya.nair@yahoo.com",      orders:6,  spent:82100,  joined:"Jun 2024", status:"Inactive", tier:""      },
  { id:6,  name:"Omar Bakr",           email:"omar.bakr@gmail.com",       orders:5,  spent:63400,  joined:"Jul 2024", status:"Active",   tier:""      },
  { id:7,  name:"Clara Schulz",        email:"c.schulz@web.de",           orders:4,  spent:47040,  joined:"Aug 2024", status:"Active",   tier:""      },
  { id:8,  name:"Yuna Lee",            email:"yuna.lee@kakao.com",        orders:3,  spent:35280,  joined:"Sep 2024", status:"Inactive", tier:""      },
  { id:9,  name:"Arjun Mehta",         email:"arjun.mehta@gmail.com",     orders:2,  spent:18900,  joined:"Oct 2024", status:"Active",   tier:""      },
  { id:10, name:"Fatima Al-Rashid",    email:"fatima.alr@hotmail.com",    orders:1,  spent:6200,   joined:"Nov 2024", status:"Blocked",  tier:""      },
  { id:11, name:"Kenji Watanabe",      email:"kenji.w@docomo.ne.jp",      orders:8,  spent:112000, joined:"Dec 2023", status:"Active",   tier:"Loyal" },
  { id:12, name:"Aisha Patel",         email:"aisha.patel@gmail.com",     orders:12, spent:196000, joined:"Nov 2023", status:"Active",   tier:"VIP"   },
];

// ─── Inline sub-components (matching dashboard theme) ─────────────────────────

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-3">
      {children}
    </p>
  );
}

function StatusPill({ status }) {
  const styles = {
    Active:   { pill: "bg-[#eaf3de] text-[#3b6d11]", dot: "bg-[#639922]" },
    Inactive: { pill: "bg-[#faeeda] text-[#854f0b]", dot: "bg-[#ef9f27]" },
    Blocked:  { pill: "bg-[#fcebeb] text-[#a32d2d]", dot: "bg-[#e24b4a]" },
  };
  const s = styles[status] || styles.Inactive;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-md ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function TierBadge({ tier }) {
  if (!tier) return null;
  const s = tier === "VIP"
    ? "bg-[#1a1916] text-[#f5f2ed]"
    : "bg-[#f1efe8] text-[#5f5e5a]";
  return (
    <span className={`inline-block text-[9px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded ${s}`}>
      {tier}
    </span>
  );
}

function MetricCard({ label, value, badge, badgeDir }) {
  const badgeStyle =
    badgeDir === "up"   ? "bg-[#eaf3de] text-[#3b6d11]" :
    badgeDir === "down" ? "bg-[#fcebeb] text-[#a32d2d]" :
                          "bg-[#f1efe8] text-[#5f5e5a]";
  return (
    <div className="bg-white border border-[#e8e5df] rounded-xl p-4">
      <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-2">{label}</p>
      <p className="text-xl font-medium text-[#1a1916] leading-none">{value}</p>
      {badge && (
        <span className={`inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-md ${badgeStyle}`}>
          {badge}
        </span>
      )}
    </div>
  );
}

function Avatar({ name, size = "sm" }) {
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const dim = size === "lg" ? "w-11 h-11 text-[13px]" : "w-8 h-8 text-[10px]";
  return (
    <div className={`${dim} rounded-full bg-[#1a1916] text-[#f5f2ed] flex items-center justify-center font-medium flex-shrink-0`}>
      {initials}
    </div>
  );
}

// ─── Sparkline bar (mini spend bar) ───────────────────────────────────────────
function SpendBar({ spent, max }) {
  const pct = Math.round((spent / max) * 100);
  return (
    <div className="h-1 bg-[#f1efe8] rounded-full w-16 overflow-hidden">
      <div className="h-1 bg-[#1a1916] rounded-full transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

// ─── Detail drawer / slide-over ───────────────────────────────────────────────
function CustomerDrawer({ customer, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!customer) return null;
  const aov = Math.round(customer.spent / customer.orders);

  const stats = [
    { label: "Total orders",    value: customer.orders },
    { label: "Total spent",     value: `PKR ${customer.spent.toLocaleString()}` },
    { label: "Member since",    value: customer.joined },
    { label: "Avg. order value",value: `PKR ${aov.toLocaleString()}` },
  ];

  const orderHistory = [
    { id: "#ORD-8841", date: "Apr 14, 2026", amount: `PKR ${Math.round(aov * 1.2).toLocaleString()}`, status: "Delivered" },
    { id: "#ORD-8720", date: "Mar 28, 2026", amount: `PKR ${Math.round(aov * 0.9).toLocaleString()}`, status: "Delivered" },
    { id: "#ORD-8601", date: "Mar 10, 2026", amount: `PKR ${Math.round(aov * 1.1).toLocaleString()}`, status: "Delivered" },
  ];

  const orderStatusStyle = {
    Delivered:  { pill: "bg-[#eaf3de] text-[#3b6d11]", dot: "bg-[#639922]" },
    Processing: { pill: "bg-[#e6f1fb] text-[#185fa5]", dot: "bg-[#378add]" },
    Pending:    { pill: "bg-[#faeeda] text-[#854f0b]", dot: "bg-[#ef9f27]" },
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity "
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-[360px] bg-[#f5f2ed] z-50 shadow-2xl flex flex-col overflow-y-auto"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Drawer header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e8e5df] bg-white">
          <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9]">Customer detail</p>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#f1efe8] flex items-center justify-center text-[#888780] hover:bg-[#e8e5df] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Profile */}
        <div className="p-5 bg-white border-b border-[#e8e5df]">
          <div className="flex items-center gap-4 mb-4">
            <Avatar name={customer.name} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[14px] font-medium text-[#1a1916]">{customer.name}</p>
                <TierBadge tier={customer.tier} />
              </div>
              <p className="text-[11px] text-[#b4b2a9] mt-0.5 truncate">{customer.email}</p>
            </div>
          </div>
          <StatusPill status={customer.status} />
        </div>

        {/* Stats grid */}
        <div className="p-5">
          <SectionLabel>Overview</SectionLabel>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {stats.map(({ label, value }) => (
              <div key={label} className="bg-white border border-[#e8e5df] rounded-xl p-3">
                <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-1">{label}</p>
                <p className="text-[14px] font-medium text-[#1a1916] leading-none">{value}</p>
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <SectionLabel>Recent orders</SectionLabel>
          <div className="bg-white border border-[#e8e5df] rounded-xl overflow-hidden">
            {orderHistory.map((o, i) => {
              const s = orderStatusStyle[o.status] || orderStatusStyle.Delivered;
              return (
                <div key={o.id} className={`flex items-center gap-3 p-3 ${i < orderHistory.length - 1 ? "border-b border-[#f5f2ed]" : ""}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-[#1a1916]">{o.id}</p>
                    <p className="text-[10px] text-[#b4b2a9]">{o.date}</p>
                  </div>
                  <p className="text-[11px] font-medium text-[#1a1916]">{o.amount}</p>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md ${s.pill}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {o.status}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-5 flex gap-2">
            <button className="flex-1 text-[11px] font-medium py-2 rounded-lg bg-[#1a1916] text-[#f5f2ed] hover:bg-[#333] transition-colors">
              Send message
            </button>
            <button className="flex-1 text-[11px] font-medium py-2 rounded-lg bg-white border border-[#e8e5df] text-[#5f5e5a] hover:bg-[#f1efe8] transition-colors">
              Block customer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const PER_PAGE = 8;
const SORT_OPTIONS = [
  { value: "spent-desc",  label: "Highest spend" },
  { value: "spent-asc",   label: "Lowest spend"  },
  { value: "orders-desc", label: "Most orders"   },
  { value: "name-asc",    label: "Name A–Z"      },
];
const STATUS_FILTERS = ["All", "Active", "Inactive", "Blocked"];

export default function CustomersSection() {
  const [search,   setSearch]   = useState("");
  const [page,     setPage]     = useState(1);
  const [selected, setSelected] = useState(null);
  const [sort,     setSort]     = useState("spent-desc");
  const [statusF,  setStatusF]  = useState("All");

  // Filter
  let filtered = CUSTOMERS.filter((c) => {
    const q = search.toLowerCase();
    const matchQ = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    const matchS = statusF === "All" || c.status === statusF;
    return matchQ && matchS;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sort === "spent-desc")  return b.spent  - a.spent;
    if (sort === "spent-asc")   return a.spent  - b.spent;
    if (sort === "orders-desc") return b.orders - a.orders;
    if (sort === "name-asc")    return a.name.localeCompare(b.name);
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const maxSpend   = Math.max(...CUSTOMERS.map((c) => c.spent));

  // Reset page when filter/sort changes
  useEffect(() => { setPage(1); }, [search, statusF, sort]);

  // Summary metrics
  const activeCount   = CUSTOMERS.filter((c) => c.status === "Active").length;
  const totalRevenue  = CUSTOMERS.reduce((s, c) => s + c.spent, 0);
  const avgOrderValue = Math.round(totalRevenue / CUSTOMERS.reduce((s, c) => s + c.orders, 0));
  const vipCount      = CUSTOMERS.filter((c) => c.tier === "VIP").length;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display&display=swap'); * { font-family: 'DM Sans', sans-serif; } .serif { font-family: 'DM Serif Display', serif; }`}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif",  }} className="bg-[#f5f2ed] min-h-screen p-6 md:p-8 text-[#1a1916">

        {/* ── Header ── */}
        <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
          <div>
            <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-0.5">Management</p>
            <h1 className="text-[22px] font-normal tracking-tight text-[#1a1916]" style={{ fontFamily: "'DM Serif Display', serif" }}>Customers</h1>
          </div>
          <button className="text-[11px] font-medium px-4 py-2 rounded-lg bg-[#1a1916] text-[#f5f2ed] hover:bg-[#333] transition-colors">
            Export CSV
          </button>
        </div>

        {/* ── Summary metrics ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <MetricCard label="Total customers"    value={CUSTOMERS.length}           badge={`${activeCount} active`}            badgeDir="up"     />
          <MetricCard label="Total revenue"      value={`PKR ${(totalRevenue/1000000).toFixed(1)}M`} badge="+12% vs last month" badgeDir="up"     />
          <MetricCard label="Avg. order value"   value={`PKR ${avgOrderValue.toLocaleString()}`}     badge="Stable"             badgeDir="neutral"/>
          <MetricCard label="VIP customers"      value={vipCount}                   badge="Top spenders"                       badgeDir="neutral" />
        </div>

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-3 flex-wrap mb-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b4b2a9]" width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-[12px] bg-white border border-[#e8e5df] rounded-xl text-[#1a1916] placeholder-[#b4b2a9] outline-none focus:border-[#888780] transition-colors"
            />
          </div>

          {/* Status filter */}
          <div className="flex gap-1 bg-white border border-[#e8e5df] rounded-xl p-1">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusF(s)}
                className={`text-[11px] font-medium px-3 py-1 rounded-lg transition-all ${statusF === s ? "bg-[#1a1916] text-[#f5f2ed]" : "text-[#888780] hover:text-[#1a1916]"}`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-[11px] text-[#1a1916] bg-white border border-[#e8e5df] rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* ── Table ── */}
        <div className="bg-white border border-[#e8e5df] rounded-xl overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f1efe8]">
                  {["Customer", "Email", "Orders", "Total spent", "Joined", "Status", ""].map((h) => (
                    <th key={h} className="text-left text-[9px] tracking-[0.15em] uppercase text-[#b4b2a9] font-normal pb-3 pt-4 px-4 last:pr-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-[12px] text-[#b4b2a9]">
                      No customers match this filter
                    </td>
                  </tr>
                ) : (
                  paginated.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-[#f9f8f6] hover:bg-[#faf9f7] transition-colors cursor-pointer group"
                      onClick={() => setSelected(c)}
                    >
                      {/* Name + avatar */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={c.name} />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[12px] font-medium text-[#1a1916]">{c.name}</span>
                              <TierBadge tier={c.tier} />
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Email */}
                      <td className="px-4 py-3 text-[11px] text-[#888780] whitespace-nowrap">{c.email}</td>
                      {/* Orders */}
                      <td className="px-4 py-3 text-[12px] font-medium text-[#1a1916]">{c.orders}</td>
                      {/* Spend + bar */}
                      <td className="px-4 py-3">
                        <p className="text-[12px] font-medium text-[#1a1916] mb-1">PKR {c.spent.toLocaleString()}</p>
                        <SpendBar spent={c.spent} max={maxSpend} />
                      </td>
                      {/* Joined */}
                      <td className="px-4 py-3 text-[11px] text-[#b4b2a9] whitespace-nowrap">{c.joined}</td>
                      {/* Status */}
                      <td className="px-4 py-3"><StatusPill status={c.status} /></td>
                      {/* CTA */}
                      <td className="px-3 py-3">
                        <span className="text-[10px] tracking-wide text-[#b4b2a9] group-hover:text-[#1a1916] uppercase underline underline-offset-2 transition-colors whitespace-nowrap">
                          View →
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#f1efe8]">
              <p className="text-[11px] text-[#b4b2a9]">
                Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#888780] hover:bg-[#f1efe8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-7 h-7 rounded-lg text-[11px] font-medium transition-all ${n === page ? "bg-[#1a1916] text-[#f5f2ed]" : "text-[#888780] hover:bg-[#f1efe8]"}`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#888780] hover:bg-[#f1efe8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2L8.5 6l-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Slide-over drawer ── */}
      <CustomerDrawer customer={selected} onClose={() => setSelected(null)} />
    </>
  );
}