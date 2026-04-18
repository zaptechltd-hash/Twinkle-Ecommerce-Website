// // import { SectionHeader } from "../layout/SectionHeader";

// // export default function AnalyticsSection() {
// //   const MONTHLY = [
// //     { month: "Oct", orders: 98, customers: 312, revenue: 180000 },
// //     { month: "Nov", orders: 121, customers: 340, revenue: 220000 },
// //     { month: "Dec", orders: 178, customers: 391, revenue: 310000 },
// //     { month: "Jan", orders: 152, customers: 360, revenue: 270000 },
// //     { month: "Feb", orders: 164, customers: 374, revenue: 295000 },
// //     { month: "Mar", orders: 196, customers: 408, revenue: 340000 },
// //     { month: "Apr", orders: 161, customers: 392, revenue: 285000 },
// //   ];

// //   const maxRev = Math.max(...MONTHLY.map((m) => m.revenue));
// //   const maxOrd = Math.max(...MONTHLY.map((m) => m.orders));

// //   return (
// //     <div>
// //       <SectionHeader title="Analytics" subtitle="Reports" />

// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
// //         {/* Revenue trend */}
// //         <div className="border border-stone-100 p-6">
// //           <p className="text-[10px] tracking-[0.25em] text-stone-400 uppercase mb-1">Revenue Trend</p>
// //           <p className="text-lg font-light text-stone-800 mb-4">Oct 2025 – Apr 2026</p>
// //           <div className="flex items-end gap-2 h-36">
// //             {MONTHLY.map((m, i) => (
// //               <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
// //                 <div
// //                   className="w-full bg-stone-800 hover:bg-stone-600 transition-colors cursor-default rounded-sm"
// //                   style={{ height: `${(m.revenue / maxRev) * 100}%` }}
// //                   title={`PKR ${m.revenue.toLocaleString()}`}
// //                 />
// //                 <span className="text-[9px] tracking-[0.05em] text-stone-400">{m.month}</span>
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Orders trend */}
// //         <div className="border border-stone-100 p-6">
// //           <p className="text-[10px] tracking-[0.25em] text-stone-400 uppercase mb-1">Orders Trend</p>
// //           <p className="text-lg font-light text-stone-800 mb-4">Oct 2025 – Apr 2026</p>
// //           <div className="flex items-end gap-2 h-36">
// //             {MONTHLY.map((m, i) => (
// //               <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
// //                 <div
// //                   className="w-full bg-stone-300 hover:bg-stone-400 transition-colors cursor-default rounded-sm"
// //                   style={{ height: `${(m.orders / maxOrd) * 100}%` }}
// //                   title={`${m.orders} orders`}
// //                 />
// //                 <span className="text-[9px] tracking-[0.05em] text-stone-400">{m.month}</span>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Summary Table */}
// //       <div className="border border-stone-100 p-6">
// //         <p className="text-[10px] tracking-[0.25em] text-stone-400 uppercase mb-4">Monthly Summary</p>
// //         <div className="overflow-x-auto">
// //           <table className="w-full">
// //             <thead>
// //               <tr className="border-b border-stone-100">
// //                 {["Month", "Revenue", "Orders", "Customers", "Avg Order Value"].map((h) => (
// //                   <th key={h} className="text-left text-[9px] tracking-[0.2em] text-stone-400 uppercase pb-3 pr-4 font-normal">{h}</th>
// //                 ))}
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {MONTHLY.map((m) => (
// //                 <tr key={m.month} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
// //                   <td className="py-3 pr-4 text-[11px] text-stone-700 font-medium">{m.month}</td>
// //                   <td className="py-3 pr-4 text-[11px] text-stone-700">PKR {m.revenue.toLocaleString()}</td>
// //                   <td className="py-3 pr-4 text-[11px] text-stone-500">{m.orders}</td>
// //                   <td className="py-3 pr-4 text-[11px] text-stone-500">{m.customers}</td>
// //                   <td className="py-3 text-[11px] text-stone-500">PKR {Math.round(m.revenue / m.orders).toLocaleString()}</td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useState, useEffect, useRef } from "react";

// // ─── Data ─────────────────────────────────────────────────────────────────────

// const RANGE_DATA = {
//   week: {
//     labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//     curr: [112, 98, 134, 157, 138, 201, 176],
//     prev: [94, 102, 120, 141, 125, 178, 158],
//     revLabel: "This week",
//     prevLabel: "Last week",
//   },
//   month: {
//     labels: ["Apr 1", "Apr 7", "Apr 14", "Apr 21", "Apr 28"],
//     curr: [1140, 987, 1322, 1201, 1040],
//     prev: [980, 910, 1100, 990, 870],
//     revLabel: "This month",
//     prevLabel: "Last month",
//   },
//   quarter: {
//     labels: ["Jan", "Feb", "Mar", "Apr"],
//     curr: [3800, 4200, 4900, 5100],
//     prev: [3100, 3600, 4100, 4300],
//     revLabel: "This quarter",
//     prevLabel: "Last quarter",
//   },
//   year: {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//     curr: [3800, 4200, 4900, 5100, 4700, 5600, 5900, 4400, 4100, 4800, 5300, 6010],
//     prev: [2900, 3200, 3700, 3900, 3600, 4200, 4400, 3300, 3100, 3600, 4000, 4500],
//     revLabel: "This year",
//     prevLabel: "Last year",
//   },
// };

// const PRODUCTS = [
//   { name: "Silk Night Slip",    sold: 7230, rev: 354270000, margin: 62, stock: 48, velocity: 241 },
//   { name: "Velvet Robe",        sold: 5640, rev: 349680000, margin: 58, stock: 22, velocity: 188 },
//   { name: "Lace Trim Set",      sold: 4320, rev: 237600000, margin: 54, stock: 61, velocity: 144 },
//   { name: "Satin Pyjama",       sold: 3090, rev: 157590000, margin: 49, stock: 34, velocity: 103 },
//   { name: "Modal Lounge Set",   sold: 2070, rev:  95220000, margin: 51, stock: 89, velocity:  69 },
//   { name: "Gauze Nightdress",   sold: 1680, rev:  65520000, margin: 55, stock: 14, velocity:  56 },
//   { name: "Silk Kimono Robe",   sold: 1140, rev:  82080000, margin: 67, stock:  9, velocity:  38 },
//   { name: "Cashmere Lounge Top",sold:  660, rev:  53460000, margin: 71, stock:  5, velocity:  22 },
// ];

// const KARACHI_AREAS = [
//   { name: "DHA Phase 6",       orders: 1240, rev: 8.2, hrs: 2.1 },
//   { name: "Clifton",           orders:  980, rev: 6.4, hrs: 1.8 },
//   { name: "Gulshan-e-Iqbal",   orders:  820, rev: 5.1, hrs: 3.1 },
//   { name: "Bath Island",       orders:  610, rev: 3.8, hrs: 2.3 },
//   { name: "North Nazimabad",   orders:  480, rev: 2.9, hrs: 3.8 },
//   { name: "Bahria Town",       orders:  350, rev: 2.1, hrs: 4.4 },
// ];

// const TOP_CUSTOMERS = [
//   { init: "YL", name: "Yuna Lee",           orders: 14, spend: "PKR 214,800", badge: "VIP"   },
//   { init: "SA", name: "Sara Ahmed",          orders: 11, spend: "PKR 178,200", badge: "VIP"   },
//   { init: "LT", name: "Layla Tan",           orders:  9, spend: "PKR 141,400", badge: "Loyal" },
//   { init: "MK", name: "Mikael Koskinen",     orders:  7, spend: "PKR 98,700",  badge: "Loyal" },
//   { init: "OB", name: "Omar Bakr",           orders:  6, spend: "PKR 82,100",  badge: ""      },
// ];

// const FUNNEL_STEPS = [
//   { label: "Visitors",     val: 124800, pct: 100 },
//   { label: "Product view", val:  68640, pct:  55 },
//   { label: "Add to cart",  val:  29952, pct:  24 },
//   { label: "Checkout",     val:   9984, pct:   8 },
//   { label: "Purchased",    val:   4242, pct: 3.4 },
// ];

// const DROP_REASONS = [
//   { r: "High shipping cost", pct: 38 },
//   { r: "Just browsing",      pct: 27 },
//   { r: "Payment failed",     pct: 18 },
//   { r: "OOS at checkout",    pct: 11 },
//   { r: "Other",              pct:  6 },
// ];

// const PAY_METHODS = [
//   { m: "Jazz Cash",     rate: 94 },
//   { m: "EasyPaisa",    rate: 91 },
//   { m: "Credit Card",  rate: 87 },
//   { m: "Bank Transfer",rate: 74 },
//   { m: "COD",          rate: 68 },
// ];

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function SectionLabel({ children }) {
//   return (
//     <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-3">
//       {children}
//     </p>
//   );
// }

// function MetricCard({ label, value, badge, badgeDir }) {
//   const badgeStyle =
//     badgeDir === "up"   ? "bg-[#eaf3de] text-[#3b6d11]" :
//     badgeDir === "down" ? "bg-[#fcebeb] text-[#a32d2d]" :
//                           "bg-[#f1efe8] text-[#5f5e5a]";
//   return (
//     <div className="bg-white border border-[#e8e5df] rounded-xl p-4">
//       <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-2">{label}</p>
//       <p className="text-xl font-medium text-[#1a1916] leading-none">{value}</p>
//       {badge && (
//         <span className={`inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-md ${badgeStyle}`}>
//           {badge}
//         </span>
//       )}
//     </div>
//   );
// }

// function SegBar({ pct, color = "#1a1916" }) {
//   return (
//     <div className="h-2 bg-[#f1efe8] rounded-full overflow-hidden mt-1.5">
//       <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: color }} />
//     </div>
//   );
// }

// function RowItem({ children }) {
//   return (
//     <div className="flex items-center gap-3 py-2.5 border-b border-[#f5f2ed] last:border-0">
//       {children}
//     </div>
//   );
// }

// function Avatar({ initials }) {
//   return (
//     <div className="w-9 h-9 rounded-lg bg-[#f1efe8] flex items-center justify-center text-[11px] font-medium text-[#888780] flex-shrink-0">
//       {initials}
//     </div>
//   );
// }

// function Pill({ children, variant = "neutral" }) {
//   const styles = {
//     red:    "bg-[#fcebeb] text-[#a32d2d]",
//     amber:  "bg-[#faeeda] text-[#854f0b]",
//     green:  "bg-[#eaf3de] text-[#3b6d11]",
//     neutral:"bg-[#f1efe8] text-[#5f5e5a]",
//   };
//   return (
//     <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md ${styles[variant]}`}>
//       {children}
//     </span>
//   );
// }

// // ─── Chart wrapper using Chart.js ─────────────────────────────────────────────

// function useChart(canvasId, buildConfig, deps) {
//   const chartRef = useRef(null);
//   useEffect(() => {
//     if (typeof window === "undefined" || !window.Chart) return;
//     const canvas = document.getElementById(canvasId);
//     if (!canvas) return;
//     if (chartRef.current) chartRef.current.destroy();
//     chartRef.current = new window.Chart(canvas.getContext("2d"), buildConfig());
//     return () => { if (chartRef.current) chartRef.current.destroy(); };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, deps);
// }

// // ─── Section: Overview ────────────────────────────────────────────────────────

// function OverviewSection({ range, compareMode }) {
//   const d = RANGE_DATA[range];

//   useChart("revChart", () => ({
//     type: "bar",
//     data: {
//       labels: d.labels,
//       datasets: [
//         { label: d.revLabel, data: d.curr, backgroundColor: "#1a1916", borderRadius: 4, borderSkipped: false },
//         ...(compareMode ? [{ label: d.prevLabel, data: d.prev, backgroundColor: "rgba(180,178,169,0.45)", borderRadius: 4, borderSkipped: false, borderColor: "#888780", borderWidth: 1 }] : []),
//       ],
//     },
//     options: {
//       responsive: true, maintainAspectRatio: false,
//       plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => ` ${c.dataset.label}: ${c.raw.toLocaleString()} orders` } } },
//       scales: {
//         x: { grid: { display: false }, ticks: { color: "#b4b2a9", font: { size: 11, family: "DM Sans" } }, border: { display: false } },
//         y: { grid: { color: "#f1efe8" }, ticks: { color: "#b4b2a9", font: { size: 11, family: "DM Sans" } }, border: { display: false } },
//       },
//     },
//   }), [range, compareMode]);

//   useChart("seasonChart", () => ({
//     type: "line",
//     data: {
//       labels: ["J","F","M","A","M","J","J","A","S","O","N","D"],
//       datasets: [{ label: "Revenue (M PKR)", data: [31,38,43,51,47,56,59,44,41,48,53,60], borderColor: "#1a1916", tension: 0.4, pointRadius: 3, pointBackgroundColor: "#1a1916", fill: true, backgroundColor: "rgba(26,25,22,0.06)" }],
//     },
//     options: {
//       responsive: true, maintainAspectRatio: false,
//       plugins: { legend: { display: false } },
//       scales: {
//         x: { grid: { display: false }, ticks: { color: "#b4b2a9", font: { size: 10, family: "DM Sans" } }, border: { display: false } },
//         y: { grid: { color: "#f1efe8" }, ticks: { color: "#b4b2a9", font: { size: 10, family: "DM Sans" }, callback: (v) => v + "M" }, border: { display: false } },
//       },
//     },
//   }), []);

//   useChart("growthChart", () => ({
//     type: "line",
//     data: {
//       labels: ["W1","W2","W3","W4","W5","W6","W7","W8"],
//       datasets: [
//         { label: "This period", data: [820,910,870,1050,980,1140,1080,1240], borderColor: "#1a1916", tension: 0.4, pointRadius: 3, pointBackgroundColor: "#1a1916", fill: false },
//         ...(compareMode ? [{ label: "Prev period", data: [700,760,730,880,820,950,910,1020], borderColor: "#b4b2a9", tension: 0.4, pointRadius: 3, pointBackgroundColor: "#b4b2a9", borderDash: [5,5], fill: false }] : []),
//       ],
//     },
//     options: {
//       responsive: true, maintainAspectRatio: false,
//       plugins: { legend: { display: false } },
//       scales: {
//         x: { grid: { display: false }, ticks: { color: "#b4b2a9", font: { size: 10, family: "DM Sans" } }, border: { display: false } },
//         y: { grid: { color: "#f1efe8" }, ticks: { color: "#b4b2a9", font: { size: 10, family: "DM Sans" } }, border: { display: false } },
//       },
//     },
//   }), [compareMode]);

//   return (
//     <>
//       <SectionLabel>Revenue & orders · {d.revLabel.toLowerCase()}</SectionLabel>

//       {/* Metric cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
//         <MetricCard label="Revenue"        value="PKR 39.9M" badge="+18% vs last month" badgeDir="up" />
//         <MetricCard label="Total orders"   value="4,650"     badge="+310 vs last month" badgeDir="up" />
//         <MetricCard label="Avg order value"value="PKR 8,577" badge="+5% vs last month"  badgeDir="up" />
//         <MetricCard label="Conversion rate"value="3.4%"      badge="+0.3pp vs last month" badgeDir="up" />
//       </div>

//       {/* Revenue chart */}
//       <div className="bg-white border border-[#e8e5df] rounded-xl p-5 mb-4">
//         <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
//           <div>
//             <p className="text-[13px] font-medium text-[#1a1916]">Revenue over time</p>
//             <p className="text-[11px] text-[#b4b2a9]">{compareMode ? `${d.revLabel} vs ${d.prevLabel}` : `${d.revLabel} performance`}</p>
//           </div>
//           <div className="flex gap-3 text-[11px] text-[#5f5e5a]">
//             <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#1a1916]" />{d.revLabel}</span>
//             {compareMode && <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#b4b2a9]" />{d.prevLabel}</span>}
//           </div>
//         </div>
//         <div className="relative h-[220px]">
//           <canvas id="revChart" role="img" aria-label="Revenue over time chart">Revenue data across time periods.</canvas>
//         </div>
//       </div>

//       {/* Season + Growth */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
//           <p className="text-[13px] font-medium text-[#1a1916]">Seasonal trends</p>
//           <p className="text-[11px] text-[#b4b2a9] mb-4">Monthly revenue pattern · 12 months</p>
//           <div className="relative h-[160px]">
//             <canvas id="seasonChart" role="img" aria-label="Seasonal revenue trends">Seasonal revenue chart.</canvas>
//           </div>
//         </div>
//         <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
//           <p className="text-[13px] font-medium text-[#1a1916]">Orders growth</p>
//           <p className="text-[11px] text-[#b4b2a9] mb-4">Week-over-week order volume</p>
//           <div className="relative h-[160px]">
//             <canvas id="growthChart" role="img" aria-label="Orders growth chart">Orders growth chart.</canvas>
//           </div>
//         </div>
//       </div>

//       {/* Campaign impact */}
//       <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
//         <p className="text-[13px] font-medium text-[#1a1916]">Campaign impact</p>
//         <p className="text-[11px] text-[#b4b2a9] mb-4">Campaign days vs normal days performance</p>
//         <div className="grid grid-cols-3 gap-4">
//           {[
//             { label: "Revenue / day", camp: "PKR 2.1M", norm: "PKR 1.3M", uplift: "+62%" },
//             { label: "Orders / day",  camp: "187",       norm: "112",       uplift: "+67%" },
//             { label: "New customers", camp: "43",         norm: "11",         uplift: "+291%" },
//           ].map((c) => (
//             <div key={c.label}>
//               <p className="text-[11px] text-[#b4b2a9] mb-1">{c.label}</p>
//               <p className="text-base font-medium text-[#1a1916]">{c.camp}</p>
//               <p className="text-[11px] text-[#b4b2a9] mt-0.5">Campaign</p>
//               <p className="text-base font-medium text-[#888780] mt-2">{c.norm}</p>
//               <p className="text-[11px] text-[#b4b2a9] mt-0.5">Normal</p>
//               <Pill variant="green">{c.uplift} uplift</Pill>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

// // ─── Section: Products ────────────────────────────────────────────────────────

// function ProductsSection() {
//   useChart("bestChart", () => ({
//     type: "bar",
//     data: {
//       labels: PRODUCTS.map((p) => p.name),
//       datasets: [{ label: "Units sold", data: PRODUCTS.map((p) => p.sold), backgroundColor: "#1a1916", borderRadius: 4, borderSkipped: false }],
//     },
//     options: {
//       indexAxis: "y", responsive: true, maintainAspectRatio: false,
//       plugins: { legend: { display: false } },
//       scales: {
//         x: { grid: { color: "#f1efe8" }, ticks: { color: "#b4b2a9", font: { size: 10, family: "DM Sans" } }, border: { display: false } },
//         y: { grid: { display: false }, ticks: { color: "#5f5e5a", font: { size: 10, family: "DM Sans" } }, border: { display: false } },
//       },
//     },
//   }), []);

//   useChart("revProdChart", () => ({
//     type: "bar",
//     data: {
//       labels: PRODUCTS.map((p) => p.name),
//       datasets: [{ label: "Revenue (M PKR)", data: PRODUCTS.map((p) => Math.round(p.rev / 1000000)), backgroundColor: PRODUCTS.map((_, i) => i < 3 ? "#1a1916" : "#d3d1c7"), borderRadius: 4, borderSkipped: false }],
//     },
//     options: {
//       indexAxis: "y", responsive: true, maintainAspectRatio: false,
//       plugins: { legend: { display: false } },
//       scales: {
//         x: { grid: { color: "#f1efe8" }, ticks: { color: "#b4b2a9", font: { size: 10, family: "DM Sans" }, callback: (v) => v + "M" }, border: { display: false } },
//         y: { grid: { display: false }, ticks: { color: "#5f5e5a", font: { size: 10, family: "DM Sans" } }, border: { display: false } },
//       },
//     },
//   }), []);

//   const lowPerf = [
//     { name: "Modal Lounge Set",    pct: 28 },
//     { name: "Gauze Nightdress",    pct: 22 },
//     { name: "Cashmere Lounge Top", pct:  9 },
//   ];
//   const turnover = [
//     { name: "Silk Night Slip",  times: 8 },
//     { name: "Velvet Robe",      times: 6 },
//     { name: "Silk Kimono Robe", times: 5 },
//     { name: "Lace Trim Set",    times: 4 },
//   ];

//   return (
//     <>
//       <SectionLabel>Product performance deep dive</SectionLabel>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
//           <p className="text-[13px] font-medium text-[#1a1916]">Best sellers · units sold</p>
//           <p className="text-[11px] text-[#b4b2a9] mb-4">Ranked by volume this period</p>
//           <div className="relative h-[260px]">
//             <canvas id="bestChart" role="img" aria-label="Best sellers by units">Best sellers chart.</canvas>
//           </div>
//         </div>
//         <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
//           <p className="text-[13px] font-medium text-[#1a1916]">Revenue per product</p>
//           <p className="text-[11px] text-[#b4b2a9] mb-4">Total revenue contribution</p>
//           <div className="relative h-[260px]">
//             <canvas id="revProdChart" role="img" aria-label="Revenue per product">Product revenue chart.</canvas>
//           </div>
//         </div>
//       </div>

//       {/* Product health matrix */}
//       <div className="bg-white border border-[#e8e5df] rounded-xl p-5 mb-4">
//         <p className="text-[13px] font-medium text-[#1a1916]">Product health matrix</p>
//         <p className="text-[11px] text-[#b4b2a9] mb-4">Sales velocity vs stock level</p>
//         <div className="overflow-x-auto">
//           <table className="w-full text-[12px] min-w-[520px]">
//             <thead>
//               <tr className="border-b border-[#e8e5df]">
//                 {["Product","Sold / day","Stock left","Days to OOS","Margin","Action"].map((h) => (
//                   <th key={h} className={`pb-2 font-medium text-[#b4b2a9] ${h === "Product" ? "text-left" : "text-right last:text-center"}`}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {PRODUCTS.map((p) => {
//                 const daysOOS = Math.round(p.stock / (p.velocity / 30));
//                 const actionVariant = daysOOS < 7 ? "red" : daysOOS < 14 ? "amber" : "green";
//                 const actionLabel   = daysOOS < 7 ? "Reorder now" : daysOOS < 14 ? "Watch" : "Healthy";
//                 const daysColor     = daysOOS < 7 ? "text-[#a32d2d]" : daysOOS < 14 ? "text-[#854f0b]" : "text-[#3b6d11]";
//                 return (
//                   <tr key={p.name} className="border-b border-[#f5f2ed] last:border-0">
//                     <td className="py-2.5 pr-4 text-[#1a1916]">{p.name}</td>
//                     <td className="py-2.5 text-right text-[#5f5e5a]">{(p.velocity / 30).toFixed(1)}</td>
//                     <td className="py-2.5 text-right text-[#5f5e5a]">{p.stock}</td>
//                     <td className={`py-2.5 text-right font-medium ${daysColor}`}>{daysOOS}d</td>
//                     <td className="py-2.5 text-right text-[#5f5e5a]">{p.margin}%</td>
//                     <td className="py-2.5 text-center"><Pill variant={actionVariant}>{actionLabel}</Pill></td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
//           <p className="text-[13px] font-medium text-[#1a1916]">Low performers</p>
//           <p className="text-[11px] text-[#b4b2a9] mb-3">Below avg sell-through · consider discounting</p>
//           {lowPerf.map((p) => (
//             <RowItem key={p.name}>
//               <div className="flex-1">
//                 <p className="text-[12px] font-medium text-[#1a1916]">{p.name}</p>
//                 <SegBar pct={p.pct} color="#d3d1c7" />
//               </div>
//               <span className="text-[12px] font-medium text-[#a32d2d]">{p.pct}% ↓</span>
//             </RowItem>
//           ))}
//         </div>
//         <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
//           <p className="text-[13px] font-medium text-[#1a1916]">Stock turnover rate</p>
//           <p className="text-[11px] text-[#b4b2a9] mb-3">Times restocked in last 90 days</p>
//           {turnover.map((p) => (
//             <RowItem key={p.name}>
//               <div className="flex-1 text-[12px] text-[#1a1916]">{p.name}</div>
//               <div className="flex items-center gap-0.5">
//                 {Array.from({ length: p.times }).map((_, i) => (
//                   <span key={i} className="inline-block w-2 h-2 rounded-sm bg-[#1a1916]" />
//                 ))}
//               </div>
//               <span className="text-[12px] font-medium text-[#1a1916] min-w-[24px] text-right">{p.times}×</span>
//             </RowItem>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

// // ─── Section: Customers ───────────────────────────────────────────────────────

// function CustomersSection() {
//   useChart("custChart", () => ({
//     type: "bar",
//     data: {
//       labels: ["Nov","Dec","Jan","Feb","Mar","Apr"],
//       datasets: [
//         { label: "New",       data: [28,41,32,38,44,51], backgroundColor: "#1a1916", borderRadius: 4, stack: "s" },
//         { label: "Returning", data: [62,78,59,71,83,91], backgroundColor: "#d3d1c7", borderRadius: 4, stack: "s" },
//       ],
//     },
//     options: {
//       responsive: true, maintainAspectRatio: false,
//       plugins: { legend: { display: false } },
//       scales: {
//         x: { grid: { display: false }, ticks: { color: "#b4b2a9", font: { size: 11, family: "DM Sans" } }, border: { display: false }, stacked: true },
//         y: { grid: { color: "#f1efe8" }, ticks: { color: "#b4b2a9", font: { size: 11, family: "DM Sans" } }, border: { display: false }, stacked: true },
//       },
//     },
//   }), []);

//   useChart("clvChart", () => ({
//     type: "doughnut",
//     data: {
//       labels: ["High >PKR 200K","Mid PKR 50–200K","Low <PKR 50K"],
//       datasets: [{ data: [18,47,35], backgroundColor: ["#1a1916","#888780","#d3d1c7"], borderWidth: 0, hoverOffset: 4 }],
//     },
//     options: {
//       responsive: true, maintainAspectRatio: false, cutout: "72%",
//       plugins: { legend: { display: false } },
//     },
//   }), []);

//   return (
//     <>
//       <SectionLabel>Customer analytics</SectionLabel>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
//         <MetricCard label="Total customers"       value="4,120"     badge="+890 this year"    badgeDir="up" />
//         <MetricCard label="Returning rate"        value="61%"       badge="+4pp vs last year"  badgeDir="up" />
//         <MetricCard label="Avg. lifetime value"   value="PKR 124K"  badge="+12% vs last year"  badgeDir="up" />
//         <MetricCard label="Avg. orders / customer"value="13.3"      badge="Stable"             badgeDir="neutral" />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
//           <p className="text-[13px] font-medium text-[#1a1916]">New vs returning customers</p>
//           <p className="text-[11px] text-[#b4b2a9] mb-1">Monthly breakdown</p>
//           <div className="flex gap-3 mb-4 text-[11px] text-[#5f5e5a]">
//             <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#1a1916]" />New</span>
//             <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#d3d1c7]" />Returning</span>
//           </div>
//           <div className="relative h-[200px]">
//             <canvas id="custChart" role="img" aria-label="New vs returning customers stacked bar chart">Customer chart.</canvas>
//           </div>
//         </div>
//         <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
//           <p className="text-[13px] font-medium text-[#1a1916]">Customer lifetime value tiers</p>
//           <p className="text-[11px] text-[#b4b2a9] mb-4">By spending band</p>
//           <div className="relative h-[130px]">
//             <canvas id="clvChart" role="img" aria-label="CLV tier doughnut chart">CLV chart.</canvas>
//           </div>
//           <div className="mt-4 divide-y divide-[#f1efe8]">
//             {[
//               { label: "High >PKR 200K",  pct: "18%", color: "bg-[#1a1916]" },
//               { label: "Mid PKR 50–200K", pct: "47%", color: "bg-[#888780]" },
//               { label: "Low <PKR 50K",    pct: "35%", color: "bg-[#d3d1c7]" },
//             ].map((t) => (
//               <div key={t.label} className="flex items-center justify-between py-2">
//                 <div className="flex items-center gap-2">
//                   <span className={`w-2 h-2 rounded-sm ${t.color}`} />
//                   <span className="text-[12px] text-[#5f5e5a]">{t.label}</span>
//                 </div>
//                 <span className="text-[11px] font-medium text-[#1a1916]">{t.pct}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
//         <p className="text-[13px] font-medium text-[#1a1916]">Top customers</p>
//         <p className="text-[11px] text-[#b4b2a9] mb-2">By total spend this period</p>
//         {TOP_CUSTOMERS.map((c) => (
//           <RowItem key={c.name}>
//             <Avatar initials={c.init} />
//             <div className="flex-1">
//               <p className="text-[13px] font-medium text-[#1a1916]">{c.name}</p>
//               <p className="text-[11px] text-[#b4b2a9]">
//                 {c.orders} orders
//                 {c.badge && <> · <span className="text-[#854f0b] font-medium">{c.badge}</span></>}
//               </p>
//             </div>
//             <p className="text-[12px] font-medium text-[#1a1916]">{c.spend}</p>
//           </RowItem>
//         ))}
//       </div>
//     </>
//   );
// }

// // ─── Section: Funnel ──────────────────────────────────────────────────────────

// const FUNNEL_COLORS = ["#1a1916","#378add","#ef9f27","#e8c4b8","#639922"];

// function FunnelSection() {
//   return (
//     <>
//       <SectionLabel>Order funnel & conversion</SectionLabel>
//       <div className="bg-white border border-[#e8e5df] rounded-xl p-5 mb-4">
//         <p className="text-[13px] font-medium text-[#1a1916]">Conversion funnel</p>
//         <p className="text-[11px] text-[#b4b2a9] mb-4">Where users drop off · this month</p>
//         {FUNNEL_STEPS.map((step, i) => (
//           <div key={step.label} className="flex items-center gap-3 mb-2">
//             <div className="text-[12px] text-[#5f5e5a] min-w-[90px]">{step.label}</div>
//             <div className="flex-1 h-7 bg-[#f1efe8] rounded-lg overflow-hidden relative">
//               <div
//                 className="h-7 rounded-lg flex items-center px-3"
//                 style={{ width: `${step.pct}%`, background: FUNNEL_COLORS[i] }}
//               >
//                 <span className="text-[11px] font-medium" style={{ color: step.pct < 15 ? "#1a1916" : "white" }}>
//                   {step.val.toLocaleString()}
//                 </span>
//               </div>
//             </div>
//             <div className="text-[12px] font-medium text-[#888780] min-w-[36px] text-right">{step.pct}%</div>
//             {i > 0 && (
//               <div className="text-[11px] text-[#a32d2d] min-w-[40px] text-right">
//                 -{Math.round(100 - (step.val / FUNNEL_STEPS[i - 1].val) * 100)}%
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
//           <p className="text-[13px] font-medium text-[#1a1916]">Drop-off reasons</p>
//           <p className="text-[11px] text-[#b4b2a9] mb-3">Why users abandon at checkout</p>
//           {DROP_REASONS.map((r) => (
//             <div key={r.r} className="py-2 border-b border-[#f5f2ed] last:border-0">
//               <div className="flex justify-between text-[12px] mb-1">
//                 <span className="text-[#5f5e5a]">{r.r}</span>
//                 <span className="font-medium text-[#1a1916]">{r.pct}%</span>
//               </div>
//               <SegBar pct={r.pct} />
//             </div>
//           ))}
//         </div>
//         <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
//           <p className="text-[13px] font-medium text-[#1a1916]">Conversion by payment method</p>
//           <p className="text-[11px] text-[#b4b2a9] mb-3">Success rate per method</p>
//           {PAY_METHODS.map((m) => {
//             const color = m.rate > 85 ? "#639922" : m.rate > 75 ? "#ef9f27" : "#e24b4a";
//             const textColor = m.rate > 85 ? "text-[#3b6d11]" : m.rate > 75 ? "text-[#854f0b]" : "text-[#a32d2d]";
//             return (
//               <div key={m.m} className="py-2 border-b border-[#f5f2ed] last:border-0">
//                 <div className="flex justify-between text-[12px] mb-1">
//                   <span className="text-[#5f5e5a]">{m.m}</span>
//                   <span className={`font-medium ${textColor}`}>{m.rate}%</span>
//                 </div>
//                 <SegBar pct={m.rate} color={color} />
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// }

// // ─── Section: Location ────────────────────────────────────────────────────────

// function LocationSection() {
//   useChart("areaRevChart", () => ({
//     type: "bar",
//     data: {
//       labels: KARACHI_AREAS.map((a) => a.name.split(" ").slice(0, 2).join(" ")),
//       datasets: [{
//         label: "Revenue (M PKR)",
//         data: KARACHI_AREAS.map((a) => a.rev),
//         backgroundColor: ["#1a1916","#1a1916","#444441","#5f5e5a","#888780","#b4b2a9"],
//         borderRadius: 4, borderSkipped: false,
//       }],
//     },
//     options: {
//       responsive: true, maintainAspectRatio: false,
//       plugins: { legend: { display: false } },
//       scales: {
//         x: { grid: { display: false }, ticks: { color: "#b4b2a9", font: { size: 10, family: "DM Sans" } }, border: { display: false } },
//         y: { grid: { color: "#f1efe8" }, ticks: { color: "#b4b2a9", font: { size: 10, family: "DM Sans" }, callback: (v) => v + "M" }, border: { display: false } },
//       },
//     },
//   }), []);

//   const maxOrders = Math.max(...KARACHI_AREAS.map((a) => a.orders));

//   return (
//     <>
//       <SectionLabel>Location-based insights · Karachi</SectionLabel>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
//         <MetricCard label="Top area"       value="DHA Phase 6" badge="PKR 8.2M revenue"  badgeDir="up" />
//         <MetricCard label="Fastest delivery"value="Clifton"    badge="1.8h avg"           badgeDir="up" />
//         <MetricCard label="Highest AOV"    value="Bath Island" badge="PKR 14,200"         badgeDir="up" />
//         <MetricCard label="Growth area"    value="Gulshan"     badge="+41% MoM"           badgeDir="up" />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
//           <p className="text-[13px] font-medium text-[#1a1916]">Orders by area</p>
//           <p className="text-[11px] text-[#b4b2a9] mb-4">Volume · Karachi neighbourhoods</p>
//           {KARACHI_AREAS.map((a) => (
//             <div key={a.name} className="flex items-center gap-3 py-2 border-b border-[#f5f2ed] last:border-0">
//               <div className="flex-1">
//                 <p className="text-[12px] font-medium text-[#1a1916]">{a.name}</p>
//                 <SegBar pct={Math.round((a.orders / maxOrders) * 100)} />
//               </div>
//               <p className="text-[12px] font-medium text-[#1a1916] min-w-[40px] text-right">{a.orders}</p>
//             </div>
//           ))}
//         </div>
//         <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
//           <p className="text-[13px] font-medium text-[#1a1916]">Delivery performance</p>
//           <p className="text-[11px] text-[#b4b2a9] mb-4">Avg. delivery time by area (hours)</p>
//           {KARACHI_AREAS.sort((a, b) => a.hrs - b.hrs).map((a) => {
//             const color = a.hrs < 2.5 ? "#639922" : a.hrs < 3.5 ? "#ef9f27" : "#e24b4a";
//             return (
//               <div key={a.name} className="flex items-center gap-3 py-2 border-b border-[#f5f2ed] last:border-0">
//                 <div className="flex-1 text-[12px] text-[#5f5e5a]">{a.name}</div>
//                 <div className="w-28 h-1.5 bg-[#f1efe8] rounded-full overflow-hidden">
//                   <div className="h-1.5 rounded-full" style={{ width: `${Math.round((a.hrs / 4.4) * 100)}%`, background: color }} />
//                 </div>
//                 <div className="text-[12px] font-medium text-[#1a1916] min-w-[32px] text-right">{a.hrs}h</div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
//         <p className="text-[13px] font-medium text-[#1a1916]">Revenue by area</p>
//         <p className="text-[11px] text-[#b4b2a9] mb-4">This month · all zones</p>
//         <div className="relative h-[220px]">
//           <canvas id="areaRevChart" role="img" aria-label="Revenue by Karachi area bar chart">Area revenue chart.</canvas>
//         </div>
//       </div>
//     </>
//   );
// }

// // ─── Section: Inventory ───────────────────────────────────────────────────────

// function InventorySection() {
//   useChart("oosChart", () => ({
//     type: "bar",
//     data: {
//       labels: ["Silk Night Slip","Velvet Robe","Gauze Nightdress","Lace Trim Set","Cashmere Lounge Top"],
//       datasets: [{ label: "OOS events", data: [6,4,3,2,1], backgroundColor: "#e24b4a", borderRadius: 4, borderSkipped: false }],
//     },
//     options: {
//       responsive: true, maintainAspectRatio: false,
//       plugins: { legend: { display: false } },
//       scales: {
//         x: { grid: { display: false }, ticks: { color: "#b4b2a9", font: { size: 10, family: "DM Sans" } }, border: { display: false } },
//         y: { grid: { color: "#f1efe8" }, ticks: { color: "#b4b2a9", font: { size: 10, family: "DM Sans" } }, border: { display: false }, beginAtZero: true },
//       },
//     },
//   }), []);

//   const fast = [
//     { name: "Silk Night Slip",  vel: "8.1/day", variant: "red" },
//     { name: "Velvet Robe",      vel: "6.3/day", variant: "red" },
//     { name: "Silk Kimono Robe", vel: "1.3/day", variant: "amber" },
//   ];
//   const slow = [
//     { name: "Cashmere Lounge Top", vel: "0.7/day", action: "Discount" },
//     { name: "Modal Lounge Set",    vel: "2.3/day", action: "Discount" },
//     { name: "Gauze Nightdress",    vel: "1.9/day", action: "Bundle"   },
//   ];

//   return (
//     <>
//       <SectionLabel>Inventory insights</SectionLabel>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
//         <MetricCard label="Fast-moving SKUs" value="12"   badge="Need reorder soon"   badgeDir="up" />
//         <MetricCard label="Slow-moving SKUs" value="7"    badge="Consider discounting" badgeDir="down" />
//         <MetricCard label="Out of stock"     value="2"    badge="Revenue loss risk"    badgeDir="down" />
//         <MetricCard label="Avg days to OOS"  value="18.4d"badge="At current sell rate" badgeDir="neutral" />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
//           <p className="text-[13px] font-medium text-[#1a1916]">Fast-moving products</p>
//           <p className="text-[11px] text-[#b4b2a9] mb-3">High sell-through · reorder priority</p>
//           {fast.map((p) => (
//             <RowItem key={p.name}>
//               <div className="flex-1">
//                 <p className="text-[12px] font-medium text-[#1a1916]">{p.name}</p>
//                 <p className="text-[11px] text-[#b4b2a9]">{p.vel}</p>
//               </div>
//               <Pill variant={p.variant}>{p.variant === "red" ? "Reorder" : "Watch"}</Pill>
//             </RowItem>
//           ))}
//         </div>
//         <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
//           <p className="text-[13px] font-medium text-[#1a1916]">Slow-moving products</p>
//           <p className="text-[11px] text-[#b4b2a9] mb-3">Low velocity · reduce or discount</p>
//           {slow.map((p) => (
//             <RowItem key={p.name}>
//               <div className="flex-1">
//                 <p className="text-[12px] font-medium text-[#1a1916]">{p.name}</p>
//                 <p className="text-[11px] text-[#b4b2a9]">{p.vel}</p>
//               </div>
//               <Pill variant="amber">{p.action}</Pill>
//             </RowItem>
//           ))}
//         </div>
//       </div>

//       <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
//         <p className="text-[13px] font-medium text-[#1a1916]">Out-of-stock frequency</p>
//         <p className="text-[11px] text-[#b4b2a9] mb-4">Times gone OOS in last 90 days per product</p>
//         <div className="relative h-[200px]">
//           <canvas id="oosChart" role="img" aria-label="Out-of-stock frequency per product">OOS chart.</canvas>
//         </div>
//       </div>
//     </>
//   );
// }

// // ─── Main Analytics Page ──────────────────────────────────────────────────────

// const SECTIONS = [
//   { key: "overview",   label: "Overview"   },
//   { key: "products",   label: "Products"   },
//   { key: "customers",  label: "Customers"  },
//   { key: "funnel",     label: "Funnel"     },
//   { key: "location",   label: "Location"   },
//   { key: "inventory",  label: "Inventory"  },
// ] ;

// // type SectionKey = typeof SECTIONS[number]["key"];

// export default function AnalyticsDashboard() {
//   const [section,     setSection]     = useState("overview");
//   const [compareMode, setCompareMode] = useState(false);
//   const [range,       setRange]       = useState("month");
//   const [chartJsLoaded, setChartJsLoaded] = useState(false);

//   useEffect(() => {
//     if (typeof window !== "undefined" && (window).Chart) { setChartJsLoaded(true); return; }
//     const script = document.createElement("script");
//     script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
//     script.onload = () => setChartJsLoaded(true);
//     document.head.appendChild(script);
//   }, []);

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display&display=swap');
//         * { font-family: 'DM Sans', sans-serif; }
//         .serif { font-family: 'DM Serif Display', serif; }
//         .scrollbar-hide::-webkit-scrollbar { display: none; }
//         .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>

//       <div className="bg-[#f5f2ed] min-h-screen p-6 md:p-8 text-[#1a1916]">

//         {/* ── Top bar ── */}
//         <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
//           <div>
//             <h1 className="serif text-[22px] font-normal tracking-tight text-[#1a1916]">Analytics</h1>
//             <p className="text-[12px] text-[#b4b2a9] mt-0.5">Saturday, 18 April 2026</p>
//           </div>
//           <div className="flex items-center gap-3 flex-wrap">
//             {/* Compare toggle */}
//             <button
//               onClick={() => setCompareMode((v) => !v)}
//               className="flex items-center gap-2 text-[12px] text-[#5f5e5a]"
//             >
//               <span
//                 className="relative inline-flex w-9 h-5 rounded-full transition-colors"
//                 style={{ background: compareMode ? "#1a1916" : "#d3d1c7" }}
//               >
//                 <span
//                   className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all"
//                   style={{ left: compareMode ? "calc(100% - 18px)" : "2px" }}
//                 />
//               </span>
//               Compare mode
//             </button>

//             {/* Range */}
//             <select
//               value={range}
//               onChange={(e) => setRange(e.target.value)}
//               className="text-[12px] text-[#1a1916] bg-white border border-[#e8e5df] rounded-lg px-3 py-1.5 outline-none cursor-pointer"
//             >
//               <option value="week">This week</option>
//               <option value="month">This month</option>
//               <option value="quarter">This quarter</option>
//               <option value="year">This year</option>
//             </select>

//             {/* Category */}
//             <select className="text-[12px] text-[#1a1916] bg-white border border-[#e8e5df] rounded-lg px-3 py-1.5 outline-none cursor-pointer">
//               <option value="all">All categories</option>
//               <option value="silk">Silk</option>
//               <option value="velvet">Velvet</option>
//               <option value="modal">Modal</option>
//               <option value="cashmere">Cashmere</option>
//             </select>
//           </div>
//         </div>

//         {/* ── Section nav ── */}
//         <div className="flex gap-1.5 bg-white border border-[#e8e5df] rounded-xl p-1 mb-6 w-fit flex-wrap">
//           {SECTIONS.map((s) => (
//             <button
//               key={s.key}
//               onClick={() => setSection(s.key)}
//               className={`text-[12px] font-medium px-4 py-1.5 rounded-lg transition-all ${
//                 section === s.key ? "bg-[#1a1916] text-[#f5f2ed]" : "text-[#888780] hover:text-[#1a1916]"
//               }`}
//             >
//               {s.label}
//             </button>
//           ))}
//         </div>

//         {/* ── Sections ── */}
//         {chartJsLoaded && (
//           <>
//             {section === "overview"  && <OverviewSection  range={range} compareMode={compareMode} />}
//             {section === "products"  && <ProductsSection  />}
//             {section === "customers" && <CustomersSection />}
//             {section === "funnel"    && <FunnelSection    />}
//             {section === "location"  && <LocationSection  />}
//             {section === "inventory" && <InventorySection />}
//           </>
//         )}

//         {!chartJsLoaded && (
//           <div className="flex items-center justify-center h-64 text-[#b4b2a9] text-[13px]">
//             Loading charts…
//           </div>
//         )}
//       </div>
//     </>
//   );
// }