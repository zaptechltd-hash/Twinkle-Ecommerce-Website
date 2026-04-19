"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const PRODUCTS = [
  {
    id: 1, name: "Silk Night Slip", price: 4900,
    images: ["/product1.jpg", "/product2.jpg"],
    fabric: "Silk", color: "Blush", colorHex: "#e8c4b8", tag: "New In",
    baseSold: 241, basePct: 92,
  },
  {
    id: 2, name: "Velvet Robe", price: 6200,
    images: ["/product3.jpg", "/product4.jpg"],
    fabric: "Velvet", color: "Noir", colorHex: "#2a2a2a", tag: "Best Seller",
    baseSold: 188, basePct: 74,
  },
  {
    id: 3, name: "Lace Trim Set", price: 5500,
    images: ["/product5.jpg", "/product6.jpg"],
    fabric: "Modal", color: "Blush", colorHex: "#e8c4b8", tag: "New In",
    baseSold: 144, basePct: 58,
  },
  {
    id: 4, name: "Satin Pyjama", price: 5100,
    images: ["/product7.jpg", "/product8.jpg"],
    fabric: "Satin", color: "Ivory", colorHex: "#f5f0e8", tag: null,
    baseSold: 103, basePct: 41,
  },
  {
    id: 5, name: "Modal Lounge Set", price: 4600,
    images: ["/product9.jpg", "/product10.jpg"],
    fabric: "Modal", color: "Stone", colorHex: "#b5a99a", tag: null,
    baseSold: 69, basePct: 28,
  },
  {
    id: 6, name: "Gauze Nightdress", price: 3900,
    images: ["/product11.jpg", "/product12.jpg"],
    fabric: "Cotton", color: "Ivory", colorHex: "#f5f0e8", tag: "Best Seller",
    baseSold: 56, basePct: 22,
  },
  {
    id: 7, name: "Silk Kimono Robe", price: 7200,
    images: ["/product1.jpg", "/product3.jpg"],
    fabric: "Silk", color: "Noir", colorHex: "#2a2a2a", tag: "Limited",
    baseSold: 38, basePct: 15,
  },
  {
    id: 8, name: "Cashmere Lounge Top", price: 8100,
    images: ["/product5.jpg", "/product7.jpg"],
    fabric: "Cashmere", color: "Stone", colorHex: "#b5a99a", tag: "New In",
    baseSold: 22, basePct: 9,
  },
];

const PERIOD_DATA = {
  today: {
    revenue: "PKR 1,344,780", revenueChange: "+12%", revenueDir: "up",
    orders: 138, ordersChange: "+8", ordersDir: "up",
    customers: 12, customersChange: "+3", customersDir: "up",
    aov: "PKR 9,746", aovChange: "Stable", aovDir: "neutral",
    delivered: 84, processing: 31, pending: 14, cancelled: 9,
    chartLabels: ["8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p"],
    chartData: [4, 7, 11, 9, 15, 18, 12, 14, 16, 10, 8, 14],
    productMultiplier: 1,
    payment: {
      paid:     { pct: 81, val: "PKR 1,089,272" },
      pending:  { pct: 13, val: "PKR 174,821" },
      refunded: { pct: 6,  val: "PKR 80,687" },
    },
  },
  week: {
    revenue: "PKR 9,554,580", revenueChange: "+9%", revenueDir: "up",
    orders: 1016, ordersChange: "+102", ordersDir: "up",
    customers: 89, customersChange: "+14", customersDir: "up",
    aov: "PKR 9,404", aovChange: "-2%", aovDir: "down",
    delivered: 721, processing: 148, pending: 92, cancelled: 55,
    chartLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    chartData: [112, 98, 134, 157, 138, 201, 176],
    productMultiplier: 7,
    payment: {
      paid:     { pct: 78, val: "PKR 7,452,573" },
      pending:  { pct: 14, val: "PKR 1,337,641" },
      refunded: { pct: 8,  val: "PKR 764,366" },
    },
  },
  month: {
    revenue: "PKR 39,882,000", revenueChange: "+18%", revenueDir: "up",
    orders: 4650, ordersChange: "+310", ordersDir: "up",
    customers: 341, customersChange: "+41", customersDir: "up",
    aov: "PKR 8,577", aovChange: "+5%", aovDir: "up",
    delivered: 3290, processing: 620, pending: 480, cancelled: 260,
    chartLabels: ["Apr 1", "Apr 7", "Apr 14", "Apr 17"],
    chartData: [1140, 987, 1322, 1201],
    productMultiplier: 30,
    payment: {
      paid:     { pct: 83, val: "PKR 33,101,860" },
      pending:  { pct: 11, val: "PKR 4,387,020" },
      refunded: { pct: 6,  val: "PKR 2,392,920" },
    },
  },
  year: {
    revenue: "PKR 513,975,900", revenueChange: "+31%", revenueDir: "up",
    orders: 54820, ordersChange: "+6,200", ordersDir: "up",
    customers: 4120, customersChange: "+890", customersDir: "up",
    aov: "PKR 9,376", aovChange: "+3%", aovDir: "up",
    delivered: 39400, processing: 7100, pending: 5200, cancelled: 3120,
    chartLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    chartData: [3800, 4200, 4900, 5100, 4700, 5600, 5900, 4400, 4100, 4800, 5300, 6010],
    productMultiplier: 365,
    payment: {
      paid:     { pct: 85, val: "PKR 436,879,515" },
      pending:  { pct: 10, val: "PKR 51,397,590" },
      refunded: { pct: 5,  val: "PKR 25,698,795" },
    },
  },
};

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
  { level: "warning",  title: "#ORD-8827 — Return requested",         msg: "James Rivera · item damaged · awaiting approval" },
  { level: "warning",  title: "#ORD-8830 — Partially shipped",        msg: "Clara Schulz · 1 item out of stock · notified" },
];

const PERIODS = [
  { key: "today", label: "Today" },
  { key: "week",  label: "This week" },
  { key: "month", label: "This month" },
  { key: "year",  label: "This year" },
];

const PERIOD_LABELS = { today: "Today", week: "This week", month: "This month", year: "This year" };

const STATUS_STYLES = {
  Delivered:  { pill: "bg-[#eaf3de] text-[#3b6d11]", dot: "bg-[#639922]" },
  Processing: { pill: "bg-[#e6f1fb] text-[#185fa5]", dot: "bg-[#378add]" },
  Pending:    { pill: "bg-[#faeeda] text-[#854f0b]", dot: "bg-[#ef9f27]" },
  Cancelled:  { pill: "bg-[#fcebeb] text-[#a32d2d]", dot: "bg-[#e24b4a]" },
};

const FABRIC_ICONS = { Silk: "🕯", Velvet: "🧴", Modal: "🧺", Satin: "✨", Cotton: "🌿", Cashmere: "☁️" };

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-3">
      {children}
    </p>
  );
}

function MetricCard({ label, value, change, dir }) {
  const tagStyle =
    dir === "up"   ? "bg-[#eaf3de] text-[#3b6d11]" :
    dir === "down" ? "bg-[#fcebeb] text-[#a32d2d]" :
                     "bg-[#f1efe8] text-[#5f5e5a]";
  return (
    <div className="bg-white border border-[#e8e5df] rounded-xl p-4">
      <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-2">{label}</p>
      <p className="text-xl font-medium text-[#1a1916] leading-none">{value}</p>
      <span className={`inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-md ${tagStyle}`}>{change}</span>
    </div>
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

function AlertCard({ level, title, msg }) {
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

function BarChart({ labels, data }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.Chart) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new window.Chart(ctx, {
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
          tooltip: {
            callbacks: { label: (c) => ` ${c.raw} orders` }
          },
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
              padding: 4 
            },
            border: { display: false },
            beginAtZero: true,
          },
        },
        layout: { padding: 0 },
      },
    });

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [labels, data]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────

function DonutChart({ paid, pending, refunded }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.Chart) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new window.Chart(ctx, {
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
          tooltip: { callbacks: { label: (c) => ` ${c.raw}%` } },
        },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [paid, pending, refunded]);

  return <canvas ref={canvasRef} />;
}

// ─── Product thumbnail with next/image + emoji fallback ───────────────────────

function ProductThumb({ product }) {
  const [imgError, setImgError] = useState(false);
  const icon = FABRIC_ICONS[product.fabric] || "🛍";

  if (imgError) {
    return (
      <div className="w-14 h-14 rounded-xl bg-[#f5f2ed] flex items-center justify-center text-2xl flex-shrink-0">
        {icon}
      </div>
    );
  }

  return (
    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#f5f2ed]">
      <Image
        src={product.images[0]}
        alt={product.name}
        fill
        sizes="56px"
        className="object-cover"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [period, setPeriod]               = useState("today");
  const [orderFilter, setOrderFilter]     = useState("All");
  const [chartJsLoaded, setChartJsLoaded] = useState(false);

  const d           = PERIOD_DATA[period];
  const periodLabel = PERIOD_LABELS[period];

  useEffect(() => {
    if (typeof window !== "undefined" && window.Chart) { setChartJsLoaded(true); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    script.onload = () => setChartJsLoaded(true);
    document.head.appendChild(script);
  }, []);

  const filteredOrders =
    orderFilter === "All" ? RECENT_ORDERS : RECENT_ORDERS.filter((o) => o.status === orderFilter);

  const orderCounts = {
    All:        RECENT_ORDERS.length,
    Delivered:  RECENT_ORDERS.filter((o) => o.status === "Delivered").length,
    Processing: RECENT_ORDERS.filter((o) => o.status === "Processing").length,
    Pending:    RECENT_ORDERS.filter((o) => o.status === "Pending").length,
    Cancelled:  RECENT_ORDERS.filter((o) => o.status === "Cancelled").length,
  };

  const statusBoxes = [
    { label: "Delivered",  val: d.delivered,  bg: "bg-[#eaf3de]", txt: "text-[#3b6d11]", sub: "text-[#639922]" },
    { label: "Processing", val: d.processing, bg: "bg-[#e6f1fb]", txt: "text-[#185fa5]", sub: "text-[#378add]" },
    { label: "Pending",    val: d.pending,    bg: "bg-[#faeeda]", txt: "text-[#854f0b]", sub: "text-[#ef9f27]" },
    { label: "Cancelled",  val: d.cancelled,  bg: "bg-[#fcebeb]", txt: "text-[#a32d2d]", sub: "text-[#e24b4a]" },
  ];

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
            <p className="text-[12px] text-[#b4b2a9] mt-0.5">Saturday, 18 April 2026</p>
          </div>
          <div className="flex gap-1.5 bg-white border border-[#e8e5df] rounded-xl p-1">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`text-[12px] font-medium px-4 py-1.5 rounded-lg transition-all ${
                  period === p.key ? "bg-[#1a1916] text-[#f5f2ed]" : "text-[#888780] hover:text-[#1a1916]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Metric cards ── */}
        <div className="mb-6">
          <SectionLabel>Overview · {periodLabel}</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard label="Revenue"          value={d.revenue}   change={`${d.revenueChange} vs prev`}   dir={d.revenueDir} />
            <MetricCard label="Total orders"     value={d.orders}    change={`${d.ordersChange} vs prev`}    dir={d.ordersDir} />
            <MetricCard label="New customers"    value={d.customers} change={`${d.customersChange} vs prev`} dir={d.customersDir} />
            <MetricCard label="Avg. order value" value={d.aov}       change={d.aovChange}                    dir={d.aovDir} />
          </div>
        </div>

        {/* ── Order status breakdown ── */}
        <div className="mb-6">
          <SectionLabel>Order status · {periodLabel}</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {statusBoxes.map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
                <p className={`text-[26px] font-medium ${s.txt} leading-none`}>{s.val.toLocaleString()}</p>
                <p className={`text-[12px] mt-1.5 font-medium ${s.sub}`}>{s.label}</p>
                <p className="text-[11px] text-[#888780] mt-0.5">{periodLabel}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Chart + Payment ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

          <div className="md:col-span-2 bg-white border border-[#e8e5df] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] font-medium text-[#1a1916]">Orders over time</p>
              <p className="text-[11px] text-[#b4b2a9]">{periodLabel}</p>
            </div>
            <div className="relative h-[220px] overflow-hidden">
              {chartJsLoaded && <BarChart labels={d.chartLabels} data={d.chartData} />}
            </div>
          </div>

          {/* Payment status — fully reactive to period filter */}
          <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
            <p className="text-[13px] font-medium text-[#1a1916] mb-1">Payment status</p>
            <p className="text-[11px] text-[#b4b2a9] mb-3">By transaction · {periodLabel}</p>
            <div className="relative h-[130px]">
              {chartJsLoaded && (
                <DonutChart
                  paid={d.payment.paid.pct}
                  pending={d.payment.pending.pct}
                  refunded={d.payment.refunded.pct}
                />
              )}
            </div>
            <div className="mt-4 divide-y divide-[#f1efe8]">
              {[
                { label: "Paid",     color: "bg-[#1a1916]", data: d.payment.paid },
                { label: "Pending",  color: "bg-[#ef9f27]", data: d.payment.pending },
                { label: "Refunded", color: "bg-[#e24b4a]", data: d.payment.refunded },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-sm ${row.color}`} />
                    <span className="text-[12px] text-[#5f5e5a]">{row.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-medium text-[#1a1916]">{row.data.val}</span>
                    <span className="text-[11px] text-[#b4b2a9] ml-1.5">{row.data.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent Orders + Top Products — side by side on desktop ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* Recent Orders */}
          <div className="bg-white border border-[#e8e5df] rounded-xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <p className="text-[13px] font-medium text-[#1a1916]">Recent orders</p>
              <div className="flex gap-1 flex-wrap">
                {["All", "Delivered", "Processing", "Pending", "Cancelled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setOrderFilter(s)}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all ${
                      orderFilter === s
                        ? "bg-[#1a1916] text-[#f5f2ed]"
                        : "bg-[#f5f2ed] text-[#888780] hover:bg-[#ede9e3]"
                    }`}
                  >
                    {s}
                    <span className={`ml-1 text-[10px] ${orderFilter === s ? "opacity-60" : "opacity-50"}`}>
                      {orderCounts[s]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 divide-y divide-[#f5f2ed] overflow-auto scrollbar-hide">
              {filteredOrders.length === 0 ? (
                <p className="text-[12px] text-[#b4b2a9] py-6 text-center">No orders match this filter</p>
              ) : (
                filteredOrders.map((o, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#f1efe8] flex items-center justify-center text-[11px] font-medium text-[#888780] flex-shrink-0">
                      {o.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#1a1916] truncate">{o.name}</p>
                      <p className="text-[11px] text-[#b4b2a9]">{o.id}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[12px] font-medium text-[#1a1916]">{o.amount}</p>
                      <StatusPill status={o.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white border border-[#e8e5df] rounded-xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] font-medium text-[#1a1916]">Top selling products</p>
              <p className="text-[11px] text-[#b4b2a9]">Units sold · {periodLabel}</p>
            </div>
            <div className="flex-1 divide-y divide-[#f5f2ed] overflow-auto scrollbar-hide">
              {PRODUCTS.map((p) => {
                const sold   = Math.round(p.baseSold * d.productMultiplier);
                const rev    = Math.round(p.price * sold);
                const revStr =
                  rev >= 1_000_000
                    ? `PKR ${(rev / 1_000_000).toFixed(1)}M`
                    : `PKR ${rev.toLocaleString()}`;

                return (
                  <div key={p.id} className="flex items-center gap-3 py-3">
                    <ProductThumb product={p} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-[13px] font-medium text-[#1a1916]">{p.name}</p>
                        {p.tag && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#f1efe8] text-[#5f5e5a]">
                            {p.tag}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <p className="text-[11px] text-[#b4b2a9]">{p.fabric}</p>
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full border border-black/10 flex-shrink-0"
                          style={{ background: p.colorHex }}
                        />
                        <p className="text-[11px] text-[#b4b2a9]">{p.color} · PKR {p.price.toLocaleString()}</p>
                      </div>
                      <div className="h-1 bg-[#f1efe8] rounded-full w-full mt-2">
                        <div className="h-1 bg-[#1a1916] rounded-full" style={{ width: `${p.basePct}%` }} />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-[12px] font-medium text-[#1a1916]">{sold.toLocaleString()} sold</p>
                      <p className="text-[11px] text-[#b4b2a9]">{revStr}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Alerts row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-medium text-[#1a1916]">Stock alerts</p>
              <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md bg-[#fcebeb] text-[#a32d2d]">
                {STOCK_ALERTS.filter((a) => a.level === "critical").length} critical
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {STOCK_ALERTS.map((a, i) => <AlertCard key={i} {...a} />)}
            </div>
          </div>

          <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-medium text-[#1a1916]">Order alerts</p>
              <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md bg-[#fcebeb] text-[#a32d2d]">
                {ORDER_ALERTS.filter((a) => a.level === "critical").length} critical
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {ORDER_ALERTS.map((a, i) => <AlertCard key={i} {...a} />)}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}