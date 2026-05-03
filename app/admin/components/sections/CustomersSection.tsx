"use client";
import { useState, useEffect, useCallback } from "react";
import useOrderService from "../../../services/order/index";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Customer {
  email:       string;
  name:        string;
  totalOrders: number;
  totalSpent:  number;
  joined:      string;
}

interface Meta {
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PER_PAGE = 8;

const SORT_OPTIONS = [
  { value: "spent-desc",  label: "Highest spend" },
  { value: "spent-asc",   label: "Lowest spend"  },
  { value: "orders-desc", label: "Most orders"   },
  { value: "name-asc",    label: "Name A–Z"      },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "lg" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const dim = size === "lg" ? "w-11 h-11 text-[13px]" : "w-8 h-8 text-[10px]";
  return (
    <div
      className={`${dim} rounded-full bg-[#1a1916] text-[#f5f2ed] flex items-center justify-center font-medium flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

function SpendBar({ spent, max }: { spent: number; max: number }) {
  const pct = max > 0 ? Math.round((Number(spent) / Number(max)) * 100) : 0;
  return (
    <div className="h-1 bg-[#f1efe8] rounded-full w-16 overflow-hidden">
      <div
        className="h-1 bg-[#1a1916] rounded-full transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  badge,
  badgeDir,
}: {
  label:     string;
  value:     string | number;
  badge?:    string;
  badgeDir?: "up" | "down" | "neutral";
}) {
  const badgeStyle =
    badgeDir === "up"
      ? "bg-[#eaf3de] text-[#3b6d11]"
      : badgeDir === "down"
      ? "bg-[#fcebeb] text-[#a32d2d]"
      : "bg-[#f1efe8] text-[#5f5e5a]";
  return (
    <div className="bg-white border border-[#e8e5df] rounded-xl p-4">
      <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-2">
        {label}
      </p>
      <p className="text-xl font-medium text-[#1a1916] leading-none">{value}</p>
      {badge && (
        <span className={`inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-md ${badgeStyle}`}>
          {badge}
        </span>
      )}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-[#f9f8f6] animate-pulse">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 bg-[#f1efe8] rounded-md w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CustomersSection() {
  const { getCustomers, loading, error } = useOrderService();

  const [customers,   setCustomers]   = useState<Customer[]>([]);
  const [meta,        setMeta]        = useState<Meta>({ total: 0, page: 1, limit: PER_PAGE, totalPages: 1 });
  const [page,        setPage]        = useState(1);
  const [sort,        setSort]        = useState("spent-desc");
  const [search,      setSearch]      = useState("");
  const [searchInput, setSearchInput] = useState("");

  // ── Single fetch ──────────────────────────────────────────────────────────
  // const fetchCustomers = useCallback(async () => {
  //   const res = await getCustomers({
  //     page,
  //     limit: PER_PAGE,
  //     sort:  sort as any,
  //     ...(search ? { search } : {}),
  //   });
  //   if (res) {
  //     setCustomers(res.data);
  //     setMeta(res.meta);
  //   }
  // }, [page, sort, search]);

  const fetchCustomers = useCallback(async () => {
  const res = await getCustomers({
    page,
    limit: PER_PAGE,
    sort:  sort as any,
    ...(search ? { search } : {}),
  });
  
  console.log("getCustomers res:", res);        // ← ADD THIS
  console.log("customers state:", customers);   // ← ADD THIS

  if (res) {
    setCustomers(res.data);
    setMeta(res.meta);
  }
}, [page, sort, search]);
  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  // ── Debounced search ──────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ── Metrics — computed directly from loaded customers ─────────────────────
  const totalRevenue  = customers.reduce((s, c) => s + Number(c.totalSpent),  0);
  const totalOrders   = customers.reduce((s, c) => s + Number(c.totalOrders), 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const topSpender    = [...customers].sort((a, b) => Number(b.totalSpent) - Number(a.totalSpent))[0];
  const maxSpend      = customers.length > 0 ? Math.max(...customers.map((c) => Number(c.totalSpent))) : 1;

  // ── Export CSV ────────────────────────────────────────────────────────────
  function exportCSV() {
    const rows = [["Name", "Email", "Orders", "Total Spent (PKR)", "Joined"]];
    customers.forEach((c) =>
      rows.push([c.name, c.email, String(c.totalOrders), String(c.totalSpent), c.joined])
    );
    const csv  = rows.map((r) => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.href     = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    link.download = "customers.csv";
    link.click();
  }

  const totalPages = meta.totalPages;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display&display=swap');`}</style>

      <div
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        className="bg-[#f5f2ed] min-h-screen p-6 md:p-8 text-[#1a1916]"
      >
        {/* ── Header ── */}
        <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
          <div>
            <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-0.5">
              Management
            </p>
            <h1
              className="text-[22px] font-normal tracking-tight text-[#1a1916]"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Customers
            </h1>
          </div>
          <button
            onClick={exportCSV}
            className="text-[11px] font-medium px-4 py-2 rounded-lg bg-[#1a1916] text-[#f5f2ed] hover:bg-[#333] transition-colors"
          >
            Export CSV
          </button>
        </div>

        {/* ── Metrics ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <MetricCard
            label="Total customers"
            value={meta.total}
            badge={`${meta.total} total`}
            badgeDir="neutral"
          />
          <MetricCard
            label="Total revenue"
           value={
  totalRevenue >= 1_000_000
    ? `PKR ${(totalRevenue / 1_000_000).toFixed(1)}M`
    : totalRevenue >= 1_000
    ? `PKR ${(totalRevenue / 1_000).toFixed(1)}K`
    : `PKR ${totalRevenue.toLocaleString()}`
}
            badge="From all orders"
            badgeDir="up"
          />
          <MetricCard
            label="Avg. order value"
            value={`PKR ${avgOrderValue.toLocaleString()}`}
            badge="Across all orders"
            badgeDir="neutral"
          />
          <MetricCard
            label="Top spender"
            value={topSpender ? topSpender.name.split(" ")[0] : "—"}
            badge={topSpender ? `PKR ${Number(topSpender.totalSpent).toLocaleString()}` : undefined}
            badgeDir="neutral"
          />
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-[#fcebeb] text-[#a32d2d] text-[12px]">
            Failed to load customers. Please check your connection and try again.
          </div>
        )}

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-3 flex-wrap mb-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b4b2a9]"
              width="13" height="13" viewBox="0 0 16 16" fill="none"
            >
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-[12px] bg-white border border-[#e8e5df] rounded-xl text-[#1a1916] placeholder-[#b4b2a9] outline-none focus:border-[#888780] transition-colors"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="text-[11px] text-[#1a1916] bg-white border border-[#e8e5df] rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* ── Table ── */}
        <div className="bg-white border border-[#e8e5df] rounded-xl overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f1efe8]">
                  {["Customer", "Email", "Orders", "Total spent", "Joined", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[9px] tracking-[0.15em] uppercase text-[#b4b2a9] font-normal pb-3 pt-4 px-4 last:pr-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(PER_PAGE)].map((_, i) => <SkeletonRow key={i} />)
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[12px] text-[#b4b2a9]">
                      No customers match this filter
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr
                      key={c.email}
                      className="border-b border-[#f9f8f6] hover:bg-[#faf9f7] transition-colors cursor-pointer group"
                    >
                      {/* Name + avatar */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={c.name} />
                          <span className="text-[12px] font-medium text-[#1a1916]">{c.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 text-[11px] text-[#888780] whitespace-nowrap">
                        {c.email}
                      </td>

                      {/* Orders */}
                      <td className="px-4 py-3 text-[12px] font-medium text-[#1a1916]">
                        {c.totalOrders}
                      </td>

                      {/* Spend + bar */}
                      <td className="px-4 py-3">
                        <p className="text-[12px] font-medium text-[#1a1916] mb-1">
                          PKR {Number(c.totalSpent).toLocaleString()}
                        </p>
                        <SpendBar spent={Number(c.totalSpent)} max={maxSpend} />
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3 text-[11px] text-[#b4b2a9] whitespace-nowrap">
                        {c.joined}
                      </td>

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
                Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, meta.total)} of {meta.total}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#888780] hover:bg-[#f1efe8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-7 h-7 rounded-lg text-[11px] font-medium transition-all ${
                      n === page ? "bg-[#1a1916] text-[#f5f2ed]" : "text-[#888780] hover:bg-[#f1efe8]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#888780] hover:bg-[#f1efe8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M4.5 2L8.5 6l-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}