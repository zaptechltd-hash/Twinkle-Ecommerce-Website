"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import useOrderService from "../../../services/order/index";
import type { AnalyticsPeriod, AnalyticsResponse } from "../../../services/order/types";

// ─── Static data (non-analytics) ─────────────────────────────────────────────

const RECENT_ORDERS = [
  { initials: "SA", name: "Sara Ahmed",      id: "#ORD-8841", amount: "PKR 31,360", status: "Delivered" },
  { initials: "MK", name: "Mikael Koskinen", id: "#ORD-8840", amount: "PKR 18,900", status: "Processing" },
  { initials: "LT", name: "Layla Tan",       id: "#ORD-8839", amount: "PKR 57,120", status: "Pending" },
  { initials: "JR", name: "James Rivera",    id: "#ORD-8838", amount: "PKR 10,892", status: "Delivered" },
  { initials: "PN", name: "Priya Nair",      id: "#ORD-8837", amount: "PKR 24,920", status: "Cancelled" },
  { initials: "OB", name: "Omar Bakr",       id: "#ORD-8836", amount: "PKR 43,400", status: "Processing" },
  { initials: "CS", name: "Clara Schulz",    id: "#ORD-8835", amount: "PKR 11,760", status: "Pending" },
  { initials: "YL", name: "Yuna Lee",        id: "#ORD-8834", amount: "PKR 86,800", status: "Delivered" },
];

const STOCK_ALERTS = [
  { level: "critical", title: "Linen Room Candle — Rose",     msg: "Out of stock · 34 unfulfilled orders waiting" },
  { level: "critical", title: "Woven Storage Basket — Large", msg: "Out of stock · supplier lead time 14 days" },
  { level: "warning",  title: "Clay Face Mask 100ml",         msg: "3 units left · reorder threshold crossed" },
  { level: "warning",  title: "Mini Ceramic Pot — Sage",      msg: "7 units left · high daily sell-through" },
];

const ORDER_ALERTS = [
  { level: "critical", title: "#ORD-8801 — 3 days delayed",          msg: "Priya Nair · awaiting courier pickup · customer contacted" },
  { level: "critical", title: "#ORD-8814 — Payment unconfirmed 48h", msg: "Omar Bakr · bank hold · manual review required" },
  { level: "warning",  title: "#ORD-8827 — Return requested",        msg: "James Rivera · item damaged · awaiting approval" },
  { level: "warning",  title: "#ORD-8830 — Partially shipped",       msg: "Clara Schulz · 1 item out of stock · notified" },
];

const PERIODS = [
  { key: "today", label: "Today" },
  { key: "week",  label: "This week" },
  { key: "month", label: "This month" },
  { key: "year",  label: "This year" },
];

const PERIOD_LABELS: Record<string, string> = {
  today: "Today",
  week:  "This week",
  month: "This month",
  year:  "This year",
};

const STATUS_STYLES: Record<string, { pill: string; dot: string }> = {
  Delivered:  { pill: "bg-[#eaf3de] text-[#3b6d11]", dot: "bg-[#639922]" },
  Processing: { pill: "bg-[#e6f1fb] text-[#185fa5]", dot: "bg-[#378add]" },
  Pending:    { pill: "bg-[#faeeda] text-[#854f0b]", dot: "bg-[#ef9f27]" },
  Cancelled:  { pill: "bg-[#fcebeb] text-[#a32d2d]", dot: "bg-[#e24b4a]" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pkr = (n: number) => "PKR " + n.toLocaleString("en-PK");

const fmtChange = (m?: { changePct: number | null; direction: string }): string => {
  if (!m) return "—";
  if (m.changePct === null) return m.direction === "up" ? "New ↑" : "—";
  return `${m.changePct > 0 ? "+" : ""}${m.changePct}% vs prev`;
};

const getDir = (m?: { direction: string }): "up" | "down" | "neutral" =>
  (m?.direction as "up" | "down" | "neutral") ?? "neutral";

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-3">
      {children}
    </p>
  );
}

function MetricCard({
  label,
  value,
  change,
  dir,
  loading,
}: {
  label: string;
  value: string;
  change: string;
  dir: "up" | "down" | "neutral";
  loading?: boolean;
}) {
  const tagStyle =
    dir === "up"   ? "bg-[#eaf3de] text-[#3b6d11]" :useOrderService
    dir === "down" ? "bg-[#fcebeb] text-[#a32d2d]" :
                     "bg-[#f1efe8] text-[#5f5e5a]";
  return (
    <div className="bg-white border border-[#e8e5df] rounded-xl p-4">
      <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-2">{label}</p>
      {loading ? (
        <>
          <div className="h-6 w-32 bg-[#f1efe8] rounded-md animate-pulse mb-3" />
          <div className="h-5 w-20 bg-[#f1efe8] rounded-md animate-pulse" />
        </>
      ) : (
        <>
          <p className="text-xl font-medium text-[#1a1916] leading-none">{value}</p>
          <span className={`inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-md ${tagStyle}`}>
            {change}
          </span>
        </>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function AlertCard({ level, title, msg }: { level: string; title: string; msg: string }) {
  const isCritical = level === "critical";
  return (
    <div className={`flex gap-3 rounded-xl border p-3 ${isCritical ? "bg-[#fff5f5] border-[#f09595]" : "bg-[#fffbf2] border-[#fac775]"}`}>
      <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${isCritical ? "bg-[#e24b4a]" : "bg-[#ef9f27]"}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className={`inline-block text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md ${isCritical ? "bg-[#fcebeb] text-[#a32d2d]" : "bg-[#faeeda] text-[#854f0b]"}`}>
            {isCritical ? "Critical" : "Warning"}
          </span>
          <p className="text-[13px] font-medium text-[#1a1916] leading-snug">{title}</p>
        </div>
        <p className="text-[12px] text-[#5f5e5a] leading-relaxed">{msg}</p>
      </div>
    </div>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function BarChart({ labels, data }: { labels: string[]; data: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).Chart) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new (window as any).Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: "#1a1916",
          borderRadius: 4,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c: any) => ` ${c.raw} orders` } },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11, family: "DM Sans" }, color: "#b4b2a9", padding: 4 },
            border: { display: false },
          },
          y: {
            grid: { color: "#f1efe8" },
            ticks: { font: { size: 11, family: "DM Sans" }, color: "#b4b2a9", padding: 4 },
            border: { display: false },
            beginAtZero: true,
          },
        },
        layout: { padding: 0 },
      },
    });

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [labels, data]);

  return <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />;
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────

function DonutChart({ paid, pending, refunded }: { paid: number; pending: number; refunded: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).Chart) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new (window as any).Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Paid", "Pending", "Refunded"],
        datasets: [{
          data: [paid, pending, refunded],
          backgroundColor: ["#1a1916", "#ef9f27", "#e24b4a"],
          borderWidth: 0,
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "74%",
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c: any) => ` ${c.raw}%` } },
        },
      },
    });

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [paid, pending, refunded]);

  return <canvas ref={canvasRef} />;
}

// ─── Skeleton loaders ─────────────────────────────────────────────────────────

function StatusBoxSkeleton() {
  return (
    <div className="bg-[#f1efe8] rounded-xl p-4 animate-pulse">
      <div className="h-8 w-16 bg-[#e8e5df] rounded-md mb-2" />
      <div className="h-3 w-20 bg-[#e8e5df] rounded-md" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-[220px] flex items-end gap-2 px-2">
      {[40, 65, 45, 80, 55, 90, 70, 60, 75, 50, 85, 65].map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-[#f1efe8] rounded-t-sm animate-pulse"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [period, setPeriod]           = useState<string>("today");
  const [orderFilter, setOrderFilter] = useState<string>("All");
  const [chartJsLoaded, setChartJsLoaded] = useState(false);

  // ── Analytics state ───────────────────────────────────────────────────────
  const { getAnalytics } = useOrderService();
  const [analytics, setAnalytics]             = useState<AnalyticsResponse | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError]   = useState<string | null>(null);

  // ── Load Chart.js ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Chart) {
      setChartJsLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    script.onload = () => setChartJsLoaded(true);
    document.head.appendChild(script);
  }, []);

  // ── Fetch analytics on period change ─────────────────────────────────────
  useEffect(() => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);

    getAnalytics({ period: period as AnalyticsPeriod })
      .then((res) => {
        if (res) setAnalytics(res);
        else setAnalyticsError("Failed to load analytics.");
      })
      .catch(() => setAnalyticsError("Failed to load analytics."))
      .finally(() => setAnalyticsLoading(false));
  }, [period]);

  // ── Derived values ────────────────────────────────────────────────────────
  const periodLabel = PERIOD_LABELS[period];

  const revenueVal   = analytics ? pkr(analytics.revenue.value)      : "—";
  const ordersVal    = analytics ? String(analytics.orders.value)     : "—";
  const customersVal = analytics ? String(analytics.newCustomers.value) : "—";
  const aovVal       = analytics ? pkr(analytics.aov.value)           : "—";

  const chartLabels = analytics?.chart.map((p) => p.label) ?? [];
  const chartData   = analytics?.chart.map((p) => p.orders) ?? [];

  const payPaid   = analytics?.paymentBreakdown.find((p) => p.status === "Paid");
  const payUnpaid = analytics?.paymentBreakdown.find((p) => p.status === "Unpaid");
  const payFailed = analytics?.paymentBreakdown.find((p) => p.status === "Failed");

  const getCount = (s: string) =>
    analytics?.statusBreakdown.find((x) => x.status === s)?.count ?? 0;

  const statusBoxes = [
    { label: "Delivered",  val: getCount("Delivered"),  bg: "bg-[#eaf3de]", txt: "text-[#3b6d11]", sub: "text-[#639922]" },
    { label: "Processing", val: getCount("Processing"), bg: "bg-[#e6f1fb]", txt: "text-[#185fa5]", sub: "text-[#378add]" },
    { label: "Pending",    val: getCount("Pending"),    bg: "bg-[#faeeda]", txt: "text-[#854f0b]", sub: "text-[#ef9f27]" },
    { label: "Cancelled",  val: getCount("Cancelled"),  bg: "bg-[#fcebeb]", txt: "text-[#a32d2d]", sub: "text-[#e24b4a]" },
  ];

  // ── Orders filter (uses static RECENT_ORDERS — replace with API later) ──
  const filteredOrders =
    orderFilter === "All"
      ? RECENT_ORDERS
      : RECENT_ORDERS.filter((o) => o.status === orderFilter);

  const orderCounts: Record<string, number> = {
    All:        RECENT_ORDERS.length,
    Delivered:  RECENT_ORDERS.filter((o) => o.status === "Delivered").length,
    Processing: RECENT_ORDERS.filter((o) => o.status === "Processing").length,
    Pending:    RECENT_ORDERS.filter((o) => o.status === "Pending").length,
    Cancelled:  RECENT_ORDERS.filter((o) => o.status === "Cancelled").length,
  };

  // ── Today's date label ────────────────────────────────────────────────────
  const todayLabel = new Date().toLocaleDateString("en-PK", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
    timeZone: "Asia/Karachi",
  });

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
            <h1 className="serif text-[22px] font-normal tracking-tight text-[#1a1916]">Dashboard</h1>
            <p className="text-[12px] text-[#b4b2a9] mt-0.5">{todayLabel}</p>
          </div>
          <div className="flex gap-1.5 bg-white border border-[#e8e5df] rounded-xl p-1">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`text-[12px] font-medium px-4 py-1.5 rounded-lg transition-all ${
                  period === p.key
                    ? "bg-[#1a1916] text-[#f5f2ed]"
                    : "text-[#888780] hover:text-[#1a1916]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Error banner ── */}
        {analyticsError && (
          <div className="mb-6 bg-[#fff5f5] border border-[#f09595] text-[#a32d2d] text-[13px] rounded-xl px-4 py-3">
            {analyticsError}
          </div>
        )}

        {/* ── Metric cards ── */}
        <div className="mb-6">
          <SectionLabel>Overview · {periodLabel}</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              label="Revenue"
              value={revenueVal}
              change={fmtChange(analytics?.revenue)}
              dir={getDir(analytics?.revenue)}
              loading={analyticsLoading}
            />
            <MetricCard
              label="Total orders"
              value={ordersVal}
              change={fmtChange(analytics?.orders)}
              dir={getDir(analytics?.orders)}
              loading={analyticsLoading}
            />
            <MetricCard
              label="New customers"
              value={customersVal}
              change={fmtChange(analytics?.newCustomers)}
              dir={getDir(analytics?.newCustomers)}
              loading={analyticsLoading}
            />
            <MetricCard
              label="Avg. order value"
              value={aovVal}
              change={fmtChange(analytics?.aov)}
              dir={getDir(analytics?.aov)}
              loading={analyticsLoading}
            />
          </div>
        </div>

        {/* ── Order status breakdown ── */}
        <div className="mb-6">
          <SectionLabel>Order status · {periodLabel}</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {analyticsLoading
              ? Array.from({ length: 4 }).map((_, i) => <StatusBoxSkeleton key={i} />)
              : statusBoxes.map((s) => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
                    <p className={`text-[26px] font-medium ${s.txt} leading-none`}>
                      {s.val.toLocaleString()}
                    </p>
                    <p className={`text-[12px] mt-1.5 font-medium ${s.sub}`}>{s.label}</p>
                    <p className="text-[11px] text-[#888780] mt-0.5">{periodLabel}</p>
                  </div>
                ))}
          </div>
        </div>

        {/* ── Chart + Payment ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

          {/* Bar chart */}
          <div className="md:col-span-2 bg-white border border-[#e8e5df] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] font-medium text-[#1a1916]">Orders over time</p>
              <p className="text-[11px] text-[#b4b2a9]">{periodLabel}</p>
            </div>
            <div className="relative h-[220px] overflow-hidden">
              {analyticsLoading
                ? <ChartSkeleton />
                : chartJsLoaded && <BarChart labels={chartLabels} data={chartData} />}
            </div>
          </div>

          {/* Payment status */}
          <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
            <p className="text-[13px] font-medium text-[#1a1916] mb-1">Payment status</p>
            <p className="text-[11px] text-[#b4b2a9] mb-3">By transaction · {periodLabel}</p>

            <div className="relative h-[130px]">
              {analyticsLoading
                ? <div className="h-full w-full rounded-full bg-[#f1efe8] animate-pulse" style={{ borderRadius: "50%" }} />
                : chartJsLoaded && (
                    <DonutChart
                      paid={payPaid?.pct ?? 0}
                      pending={payUnpaid?.pct ?? 0}
                      refunded={payFailed?.pct ?? 0}
                    />
                  )}
            </div>

            <div className="mt-4 divide-y divide-[#f1efe8]">
              {[
                { label: "Paid",     color: "bg-[#1a1916]", row: payPaid },
                { label: "Pending",  color: "bg-[#ef9f27]", row: payUnpaid },
                { label: "Refunded", color: "bg-[#e24b4a]", row: payFailed },
              ].map(({ label, color, row }) => (
                <div key={label} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-sm ${color}`} />
                    <span className="text-[12px] text-[#5f5e5a]">{label}</span>
                  </div>
                  <div className="text-right">
                    {analyticsLoading ? (
                      <div className="h-3 w-24 bg-[#f1efe8] rounded animate-pulse" />
                    ) : (
                      <>
                        <span className="text-[11px] font-medium text-[#1a1916]">
                          {row ? pkr(row.value) : "—"}
                        </span>
                        <span className="text-[11px] text-[#b4b2a9] ml-1.5">
                          {row?.pct ?? 0}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent orders ── */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <SectionLabel>Recent orders</SectionLabel>
            {/* Filter tabs */}
            <div className="flex gap-1 flex-wrap">
              {["All", "Delivered", "Processing", "Pending", "Cancelled"].map((f) => (
                <button
                  key={f}
                  onClick={() => setOrderFilter(f)}
                  className={`text-[11px] font-medium px-3 py-1 rounded-lg transition-all ${
                    orderFilter === f
                      ? "bg-[#1a1916] text-[#f5f2ed]"
                      : "bg-white border border-[#e8e5df] text-[#888780] hover:text-[#1a1916]"
                  }`}
                >
                  {f}
                  <span className="ml-1 opacity-60">
                    {orderCounts[f]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#e8e5df] rounded-xl overflow-hidden">
            <div className="divide-y divide-[#f1efe8]">
              {filteredOrders.length === 0 ? (
                <div className="px-5 py-8 text-center text-[13px] text-[#b4b2a9]">
                  No orders match this filter.
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div key={order.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#faf9f7] transition-colors">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-[#1a1916] text-[#f5f2ed] flex items-center justify-center text-[11px] font-medium flex-shrink-0">
                      {order.initials}
                    </div>
                    {/* Name + ID */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#1a1916] truncate">{order.name}</p>
                      <p className="text-[11px] text-[#b4b2a9]">{order.id}</p>
                    </div>
                    {/* Amount */}
                    <p className="text-[13px] font-medium text-[#1a1916] hidden sm:block">{order.amount}</p>
                    {/* Status */}
                    <StatusPill status={order.status} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Alerts ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

          {/* Stock alerts */}
          <div>
            <SectionLabel>Stock alerts</SectionLabel>
            <div className="space-y-2">
              {STOCK_ALERTS.map((a, i) => (
                <AlertCard key={i} level={a.level} title={a.title} msg={a.msg} />
              ))}
            </div>
          </div>

          {/* Order alerts */}
          <div>
            <SectionLabel>Order alerts</SectionLabel>
            <div className="space-y-2">
              {ORDER_ALERTS.map((a, i) => (
                <AlertCard key={i} level={a.level} title={a.title} msg={a.msg} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}