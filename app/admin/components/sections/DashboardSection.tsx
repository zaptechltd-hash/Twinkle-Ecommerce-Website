"use client";

import { useState, useEffect, useRef } from "react";
import useOrderService from "../../../services/order/index";
import type {
  AnalyticsPeriod,
  AnalyticsResponse,
} from "../../../services/order/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const PERIODS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "year", label: "This year" },
];

const PERIOD_LABELS: Record<string, string> = {
  today: "Today",
  week: "This week",
  month: "This month",
  year: "This year",
};

const STOCK_ALERTS = [
  {
    level: "critical",
    title: "Linen Room Candle — Rose",
    msg: "Out of stock · 34 unfulfilled orders waiting",
  },
  {
    level: "critical",
    title: "Woven Storage Basket — Large",
    msg: "Out of stock · supplier lead time 14 days",
  },
  {
    level: "warning",
    title: "Clay Face Mask 100ml",
    msg: "3 units left · reorder threshold crossed",
  },
  {
    level: "warning",
    title: "Mini Ceramic Pot — Sage",
    msg: "7 units left · high daily sell-through",
  },
];

const ORDER_ALERTS = [
  {
    level: "critical",
    title: "#ORD-8801 — 3 days delayed",
    msg: "Priya Nair · awaiting courier pickup · customer contacted",
  },
  {
    level: "critical",
    title: "#ORD-8814 — Payment unconfirmed 48h",
    msg: "Omar Bakr · bank hold · manual review required",
  },
  {
    level: "warning",
    title: "#ORD-8827 — Return requested",
    msg: "James Rivera · item damaged · awaiting approval",
  },
  {
    level: "warning",
    title: "#ORD-8830 — Partially shipped",
    msg: "Clara Schulz · 1 item out of stock · notified",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pkr = (n: number) => "PKR " + n.toLocaleString("en-PK");

const fmtChange = (m?: {
  changePct: number | null;
  direction: string;
}): string => {
  if (!m) return "—";
  if (m.changePct === null) return m.direction === "up" ? "New ↑" : "—";
  return `${m.changePct > 0 ? "+" : ""}${m.changePct}% vs prev`;
};

const getDir = (m?: { direction: string }): "up" | "down" | "neutral" =>
  (m?.direction as "up" | "down" | "neutral") ?? "neutral";

// ─── Fill missing chart slots ─────────────────────────────────────────────────
// Ensures every slot for the selected period is present, padding with 0 where
// the backend returned no data (e.g. months with zero orders still appear).

function fillChartSlots(
  data: { label: string; orders: number }[],
  period: string,
): { label: string; orders: number }[] {
  const now = new Date();
  const slots: { label: string; orders: number }[] = [];
  const dataMap = new Map(data.map((d) => [d.label, d.orders]));

  if (period === "year") {
    // All 12 calendar months, always
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    months.forEach((m) => {
      slots.push({ label: m, orders: dataMap.get(m) ?? 0 });
    });
  } else if (period === "month") {
    // Every day of the current month
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const label = String(d);
      slots.push({ label, orders: dataMap.get(label) ?? 0 });
    }
  } else if (period === "week") {
    // Mon → Sun, always all 7 days
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    days.forEach((d) => {
      slots.push({ label: d, orders: dataMap.get(d) ?? 0 });
    });
  } else {
    // "today" — all 24 hours. Adjust the label format to match your API
    // (e.g. "9:00" vs "09:00"). Currently uses "H:00" (no leading zero).
    for (let h = 0; h < 24; h++) {
      const label = `${h}:00`;
      slots.push({ label, orders: dataMap.get(label) ?? 0 });
    }
  }

  return slots;
}

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
    dir === "up"
      ? "bg-[#eaf3de] text-[#3b6d11]"
      : dir === "down"
        ? "bg-[#fcebeb] text-[#a32d2d]"
        : "bg-[#f1efe8] text-[#5f5e5a]";
  return (
    <div className="bg-white border border-[#e8e5df] rounded-xl p-4">
      <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-2">
        {label}
      </p>
      {loading ? (
        <>
          <div className="h-6 w-32 bg-[#f1efe8] rounded-md animate-pulse mb-3" />
          <div className="h-5 w-20 bg-[#f1efe8] rounded-md animate-pulse" />
        </>
      ) : (
        <>
          <p className="text-xl font-medium text-[#1a1916] leading-none">
            {value}
          </p>
          <span
            className={`inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-md ${tagStyle}`}
          >
            {change}
          </span>
        </>
      )}
    </div>
  );
}

function AlertCard({
  level,
  title,
  msg,
}: {
  level: string;
  title: string;
  msg: string;
}) {
  const isCritical = level === "critical";
  return (
    <div
      className={`flex gap-3 rounded-xl border p-3 ${isCritical ? "bg-[#fff5f5] border-[#f09595]" : "bg-[#fffbf2] border-[#fac775]"}`}
    >
      <div
        className={`w-1 self-stretch rounded-full flex-shrink-0 ${isCritical ? "bg-[#e24b4a]" : "bg-[#ef9f27]"}`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span
            className={`inline-block text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md ${isCritical ? "bg-[#fcebeb] text-[#a32d2d]" : "bg-[#faeeda] text-[#854f0b]"}`}
          >
            {isCritical ? "Critical" : "Warning"}
          </span>
          <p className="text-[13px] font-medium text-[#1a1916] leading-snug">
            {title}
          </p>
        </div>
        <p className="text-[12px] text-[#5f5e5a] leading-relaxed">{msg}</p>
      </div>
    </div>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function BarChart({ labels, data }: { labels: string[]; data: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).Chart) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new (window as any).Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: "#1a1916",
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
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
            ticks: {
              font: { size: 11, family: "DM Sans" },
              color: "#b4b2a9",
              padding: 4,
            },
            border: { display: false },
          },
          y: {
            grid: { color: "#f1efe8" },
            ticks: {
              font: { size: 11, family: "DM Sans" },
              color: "#b4b2a9",
              padding: 4,
            },
            border: { display: false },
            beginAtZero: true,
          },
        },
        layout: { padding: 0 },
      },
    });
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [labels, data]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}

function DonutChart({
  paid,
  pending,
  refunded,
  cancelled,
}: {
  paid: number;
  pending: number;
  refunded: number;
  cancelled: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).Chart) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new (window as any).Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Paid", "Unpaid", "Failed", "Cancelled"],
        datasets: [
          {
            data: [paid, pending, refunded, cancelled],
            backgroundColor: ["#1a1916", "#ef9f27", "#e24b4a", "#b4b2a9"],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
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
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [paid, pending, refunded]);

  return <canvas ref={canvasRef} />;
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

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
  const [period, setPeriod] = useState<string>("today");
  const [chartJsLoaded, setChartJsLoaded] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  // ── getAnalytics from hook ────────────────────────────────────────────────
  const orderService = useOrderService();
  const getAnalytics = orderService.getAnalytics;

  // ── Load Chart.js once ────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Chart) {
      setChartJsLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    script.onload = () => setChartJsLoaded(true);
    document.head.appendChild(script);
  }, []);

  // ── Fetch analytics whenever period tab changes ───────────────────────────
  useEffect(() => {
    let cancelled = false;

    setAnalyticsLoading(true);
    setAnalyticsError(null);

    getAnalytics({ period: period as AnalyticsPeriod })
      .then((res) => {
        if (cancelled) return;
        if (res) setAnalytics(res);
        else setAnalyticsError("No data returned from server.");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[AdminDashboard] analytics fetch failed:", err);
        setAnalyticsError("Failed to load analytics. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setAnalyticsLoading(false);
      });

    // Cleanup: ignore stale responses if user switches period quickly
    return () => {
      cancelled = true;
    };
  }, [period]);

  // ── Derived display values ────────────────────────────────────────────────
  const periodLabel = PERIOD_LABELS[period];

  const revenueVal = analytics ? pkr(analytics.revenue.value) : "—";
  const ordersVal = analytics ? String(analytics.orders.value) : "—";
  const customersVal = analytics ? String(analytics.newCustomers.value) : "—";
  const aovVal = analytics ? pkr(analytics.aov.value) : "—";

  // Fill in all slots for the period so empty months/days/hours still render
  const filledChart = analytics ? fillChartSlots(analytics.chart, period) : [];
  const chartLabels = filledChart.map((p) => p.label);
  const chartData = filledChart.map((p) => p.orders);

  const payPaid = analytics?.paymentBreakdown.find((p) => p.status === "Paid");
const payUnpaid = analytics?.paymentBreakdown.find(
  (p) => p.status === "Unpaid",
);
const payFailed = analytics?.paymentBreakdown.find(
  (p) => p.status === "Failed",
);
const payCancelled = analytics?.paymentBreakdown.find(
  (p) => p.status === "Cancelled",
);
  const getCount = (s: string) =>
    analytics?.statusBreakdown.find((x) => x.status === s)?.count ?? 0;

  const statusBoxes = [
    {
      label: "Delivered",
      val: getCount("Delivered"),
      bg: "bg-[#eaf3de]",
      txt: "text-[#3b6d11]",
      sub: "text-[#639922]",
    },
    {
      label: "Processing",
      val: getCount("Processing"),
      bg: "bg-[#e6f1fb]",
      txt: "text-[#185fa5]",
      sub: "text-[#378add]",
    },
    {
      label: "Pending",
      val: getCount("Pending"),
      bg: "bg-[#faeeda]",
      txt: "text-[#854f0b]",
      sub: "text-[#ef9f27]",
    },
    {
      label: "Cancelled",
      val: getCount("Cancelled"),
      bg: "bg-[#fcebeb]",
      txt: "text-[#a32d2d]",
      sub: "text-[#e24b4a]",
    },
  ];

  const todayLabel = new Date().toLocaleDateString("en-PK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
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
            <h1 className="serif text-[22px] font-normal tracking-tight text-[#1a1916]">
              Dashboard
            </h1>
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
          <div className="mb-6 bg-[#fff5f5] border border-[#f09595] text-[#a32d2d] text-[13px] rounded-xl px-4 py-3 flex items-center justify-between gap-4">
            <span>{analyticsError}</span>
            <button
              onClick={() => {
                setAnalyticsError(null);
                setPeriod((p) => p + " ");
                setTimeout(() => setPeriod((p) => p.trim()), 0);
              }}
              className="text-[11px] font-medium underline underline-offset-2 flex-shrink-0"
            >
              Retry
            </button>
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
              ? Array.from({ length: 4 }).map((_, i) => (
                  <StatusBoxSkeleton key={i} />
                ))
              : statusBoxes.map((s) => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
                    <p
                      className={`text-[26px] font-medium ${s.txt} leading-none`}
                    >
                      {s.val.toLocaleString()}
                    </p>
                    <p className={`text-[12px] mt-1.5 font-medium ${s.sub}`}>
                      {s.label}
                    </p>
                    <p className="text-[11px] text-[#888780] mt-0.5">
                      {periodLabel}
                    </p>
                  </div>
                ))}
          </div>
        </div>

        {/* ── Chart + Payment ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Bar chart */}
          <div className="md:col-span-2 bg-white border border-[#e8e5df] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] font-medium text-[#1a1916]">
                Orders over time
              </p>
              <p className="text-[11px] text-[#b4b2a9]">{periodLabel}</p>
            </div>
            <div className="relative h-[220px] overflow-hidden">
              {analyticsLoading ? (
                <ChartSkeleton />
              ) : chartJsLoaded ? (
                <BarChart labels={chartLabels} data={chartData} />
              ) : (
                <div className="h-full flex items-center justify-center text-[13px] text-[#b4b2a9]">
                  Loading chart…
                </div>
              )}
            </div>
          </div>

          {/* Payment status */}
          <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
            <p className="text-[13px] font-medium text-[#1a1916] mb-1">
              Payment status
            </p>
            <p className="text-[11px] text-[#b4b2a9] mb-3">
              By transaction · {periodLabel}
            </p>
            <div className="relative h-[130px]">
              {analyticsLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-[130px] h-[130px] rounded-full bg-[#f1efe8] animate-pulse" />
                </div>
              ) : (
                chartJsLoaded && (
                  <DonutChart
  paid={payPaid?.pct ?? 0}
  pending={payUnpaid?.pct ?? 0}
  refunded={payFailed?.pct ?? 0}
  cancelled={payCancelled?.pct ?? 0}
/>
                )
              )}
            </div>
            <div className="mt-4 divide-y divide-[#f1efe8]">
              {[
                { label: "Paid", color: "bg-[#1a1916]", row: payPaid },
                { label: "Unpaid", color: "bg-[#ef9f27]", row: payUnpaid },
                { label: "Failed", color: "bg-[#e24b4a]", row: payFailed },
                { label: "Cancelled", color: "bg-[#b4b2a9]", row: payCancelled },
              ].map(({ label, color, row }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2"
                >
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
      </div>
    </>
  );
}
