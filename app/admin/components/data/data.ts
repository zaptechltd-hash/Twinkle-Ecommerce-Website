export const STATS = [
  { label: "Total Revenue", value: "PKR 2,847,320", change: "+12.4%", up: true, icon: "₨" },
  { label: "Total Orders", value: "1,284", change: "+8.1%", up: true, icon: "📦" },
  { label: "Customers", value: "3,921", change: "+5.7%", up: true, icon: "👤" },
  { label: "Avg. Order Value", value: "PKR 2,218", change: "-2.3%", up: false, icon: "📊" },
];

export const ORDERS = [
  { id: "#TW-4821", customer: "Sara Noor", product: "Silk Night Set", amount: 4800, status: "Delivered", date: "Apr 14, 2026", items: 2 },
  { id: "#TW-4820", customer: "Fatima Khan", product: "Lace Robe", amount: 3200, status: "Processing", date: "Apr 14, 2026", items: 1 },
  { id: "#TW-4819", customer: "Ayesha Ali", product: "Cloud PJ Set", amount: 5600, status: "Shipped", date: "Apr 13, 2026", items: 3 },
  { id: "#TW-4818", customer: "Maria Ahmed", product: "Cotton Loungewear", amount: 2400, status: "Pending", date: "Apr 13, 2026", items: 1 },
  { id: "#TW-4817", customer: "Hina Malik", product: "Satin Night Set", amount: 6200, status: "Delivered", date: "Apr 12, 2026", items: 2 },
  { id: "#TW-4816", customer: "Nadia Raza", product: "Velvet Robe", amount: 7100, status: "Cancelled", date: "Apr 12, 2026", items: 1 },
  { id: "#TW-4815", customer: "Sana Javed", product: "Modal PJ Set", amount: 3900, status: "Shipped", date: "Apr 11, 2026", items: 2 },
  { id: "#TW-4814", customer: "Rida Qureshi", product: "Silk Sleep Shirt", amount: 2800, status: "Delivered", date: "Apr 11, 2026", items: 1 },
];

export const PRODUCTS = [
  { id: 1, name: "Silk Night Set", category: "Sets", price: 4800, stock: 34, sku: "TNS-001", status: "Active", sales: 128 },
  { id: 2, name: "Lace Robe", category: "Robes", price: 3200, stock: 12, sku: "TNR-002", status: "Active", sales: 97 },
  { id: 3, name: "Cloud PJ Set", category: "Sets", price: 5600, stock: 0, sku: "TNS-003", status: "Out of Stock", sales: 210 },
  { id: 4, name: "Cotton Loungewear", category: "Loungewear", price: 2400, stock: 56, sku: "TNL-004", status: "Active", sales: 74 },
  { id: 5, name: "Satin Night Set", category: "Sets", price: 6200, stock: 8, sku: "TNS-005", status: "Low Stock", sales: 186 },
  { id: 6, name: "Velvet Robe", category: "Robes", price: 7100, stock: 21, sku: "TNR-006", status: "Active", sales: 63 },
  { id: 7, name: "Modal PJ Set", category: "Sets", price: 3900, stock: 0, sku: "TNS-007", status: "Out of Stock", sales: 145 },
  { id: 8, name: "Silk Sleep Shirt", category: "Nightwear", price: 2800, stock: 44, sku: "TNN-008", status: "Active", sales: 89 },
];

export const CUSTOMERS = [
  { id: 1, name: "Sara Noor", email: "sara@gmail.com", orders: 12, spent: 48200, joined: "Jan 2026", status: "VIP" },
  { id: 2, name: "Fatima Khan", email: "fatima@gmail.com", orders: 7, spent: 22400, joined: "Feb 2026", status: "Regular" },
  { id: 3, name: "Ayesha Ali", email: "ayesha@gmail.com", orders: 19, spent: 71300, joined: "Dec 2025", status: "VIP" },
  { id: 4, name: "Maria Ahmed", email: "maria@gmail.com", orders: 3, spent: 8600, joined: "Mar 2026", status: "New" },
  { id: 5, name: "Hina Malik", email: "hina@gmail.com", orders: 9, spent: 31500, joined: "Jan 2026", status: "Regular" },
  { id: 6, name: "Nadia Raza", email: "nadia@gmail.com", orders: 5, spent: 17800, joined: "Feb 2026", status: "Regular" },
];

export const TRANSACTIONS = [
  { id: "TXN-8821", order: "#TW-4821", customer: "Sara Noor", amount: 4800, method: "JazzCash", status: "Completed", date: "Apr 14, 2026" },
  { id: "TXN-8820", order: "#TW-4820", customer: "Fatima Khan", amount: 3200, method: "EasyPaisa", status: "Pending", date: "Apr 14, 2026" },
  { id: "TXN-8819", order: "#TW-4819", customer: "Ayesha Ali", amount: 5600, method: "Card", status: "Completed", date: "Apr 13, 2026" },
  { id: "TXN-8818", order: "#TW-4818", customer: "Maria Ahmed", amount: 2400, method: "COD", status: "Pending", date: "Apr 13, 2026" },
  { id: "TXN-8817", order: "#TW-4817", customer: "Hina Malik", amount: 6200, method: "JazzCash", status: "Completed", date: "Apr 12, 2026" },
  { id: "TXN-8816", order: "#TW-4816", customer: "Nadia Raza", amount: 7100, method: "Card", status: "Refunded", date: "Apr 12, 2026" },
];

export const COUPONS = [
  { code: "LAUNCH20", type: "Percentage", value: "20%", uses: 124, limit: 500, status: "Active", expiry: "May 30, 2026" },
  { code: "NIGHTOUT50", type: "Fixed", value: "PKR 500", uses: 88, limit: 200, status: "Active", expiry: "Apr 30, 2026" },
  { code: "VELVET15", type: "Percentage", value: "15%", uses: 200, limit: 200, status: "Expired", expiry: "Mar 31, 2026" },
  { code: "FIRSTBUY", type: "Percentage", value: "10%", uses: 341, limit: 1000, status: "Active", expiry: "Dec 31, 2026" },
];

export const REVIEWS = [
  { id: 1, customer: "Sara Noor", product: "Silk Night Set", rating: 5, comment: "Absolutely divine. The fabric is so soft and the fit is perfect.", date: "Apr 13, 2026", status: "Published" },
  { id: 2, customer: "Fatima Khan", product: "Lace Robe", rating: 4, comment: "Beautiful robe, very elegant. Slightly smaller than expected.", date: "Apr 12, 2026", status: "Published" },
  { id: 3, customer: "Ayesha Ali", product: "Cloud PJ Set", rating: 5, comment: "Best nightwear I have ever owned. So comfortable!", date: "Apr 11, 2026", status: "Pending" },
  { id: 4, customer: "Maria Ahmed", product: "Cotton Loungewear", rating: 3, comment: "Good quality but the color was slightly different from the photo.", date: "Apr 10, 2026", status: "Pending" },
  { id: 5, customer: "Hina Malik", product: "Satin Night Set", rating: 5, comment: "Gorgeous! Received so many compliments. Will order again.", date: "Apr 9, 2026", status: "Published" },
];

export const NOTIFICATIONS = [
  { id: 1, type: "order", message: "New order #TW-4821 placed by Sara Noor", time: "2 min ago", read: false },
  { id: 2, type: "stock", message: "Cloud PJ Set is out of stock", time: "1 hr ago", read: false },
  { id: 3, type: "review", message: "New review pending approval from Ayesha Ali", time: "3 hr ago", read: false },
  { id: 4, type: "payment", message: "Payment of PKR 5,600 received for #TW-4819", time: "5 hr ago", read: true },
  { id: 5, type: "customer", message: "New customer registered: Maria Ahmed", time: "1 day ago", read: true },
  { id: 6, type: "order", message: "Order #TW-4816 has been cancelled", time: "1 day ago", read: true },
];

export const REVENUE_DATA = [
  { month: "Oct", value: 180000 },
  { month: "Nov", value: 220000 },
  { month: "Dec", value: 310000 },
  { month: "Jan", value: 270000 },
  { month: "Feb", value: 295000 },
  { month: "Mar", value: 340000 },
  { month: "Apr", value: 285000 },
];

export const CATEGORY_DATA = [
  { name: "Sets", value: 42, color: "#292524" },
  { name: "Robes", value: 24, color: "#78716c" },
  { name: "Loungewear", value: 18, color: "#a8a29e" },
  { name: "Nightwear", value: 16, color: "#d6d3d1" },
];

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⬚" },
  { id: "orders", label: "Orders", icon: "◻" },
  { id: "products", label: "Products", icon: "▣" },
  { id: "customers", label: "Customers", icon: "◯" },
  // { id: "payments", label: "Payments", icon: "◈" },
  // { id: "analytics", label: "Analytics", icon: "▦" },
  { id: "coupons", label: "Coupons", icon: "◆" },
  { id: "settings", label: "Settings", icon: "⚙" },
];


export const STATUS_STYLES = {
  Delivered: "bg-stone-100 text-stone-700",
  Processing: "bg-amber-50 text-amber-700",
  Shipped: "bg-blue-50 text-blue-700",
  Pending: "bg-stone-50 text-stone-500",
  Cancelled: "bg-red-50 text-red-600",
  Active: "bg-emerald-50 text-emerald-700",
  "Out of Stock": "bg-red-50 text-red-600",
  "Low Stock": "bg-amber-50 text-amber-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Refunded: "bg-red-50 text-red-600",
  Published: "bg-emerald-50 text-emerald-700",
  VIP: "bg-stone-900 text-white",
  Regular: "bg-stone-100 text-stone-700",
  New: "bg-blue-50 text-blue-700",
  Expired: "bg-stone-100 text-stone-400",
};