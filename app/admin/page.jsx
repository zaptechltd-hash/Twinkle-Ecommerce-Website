"use client";
import { useState, useRef, useEffect } from "react";
import { STATS, ORDERS, PRODUCTS, CUSTOMERS, TRANSACTIONS, COUPONS, REVIEWS, NOTIFICATIONS, REVENUE_DATA, CATEGORY_DATA, NAV_ITEMS, STATUS_STYLES  } from './components/data/data'
import { TopBar } from './components/layout/TopBar'
import { Sidebar } from './components/layout/Sidebar'
import DashboardSection from "./components/sections/DashboardSection";
import OrdersSection from "./components/sections/OrdersSection";
import ProductsSection from './components/sections/ProductsSection'
import CustomersSection from './components/sections/CustomersSection'
import AnalyticsSection from "./components/sections/AnalyticsSection";
import CouponsSection from './components/sections/CouponsSection'
import NotificationsSection    from "./components/sections/NotificationsSection";
import SettingsSection from "./components/sections/SettingsSection";
import AdminGuard from "./components/AdminGuard";

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  const SECTIONS = {
    dashboard: <DashboardSection />,
    orders: <OrdersSection />,
    products: <ProductsSection />,
    customers: <CustomersSection />,
    // payments: <PaymentsSection />,
    analytics: <AnalyticsSection />,
    coupons: <CouponsSection />,
    notifications: <NotificationsSection />,
    settings: <SettingsSection />,
  };

  return (
     <AdminGuard>
    <div className="min-h-screen bg-stone-50 flex">
       <Sidebar
        active={active}
        sidebarOpen={sidebarOpen}
        unread={unread}
        onNavigate={setActive}
        onToggle={() => setSidebarOpen((o) => !o)}
      />

      <div className="flex-1 flex flex-col min-w-0">
         <TopBar
          active={active}
          unread={unread}
          onNotifClick={() => setActive("notifications")}
        />

        <main className="flex-1">
          {SECTIONS[active]}
        </main>
      </div>
    </div>
    </AdminGuard>
  );
}