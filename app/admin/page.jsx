"use client";
import { useState, useRef, useEffect } from "react";
import { STATS, ORDERS, PRODUCTS, CUSTOMERS, TRANSACTIONS, COUPONS, REVIEWS, NOTIFICATIONS, REVENUE_DATA, CATEGORY_DATA, NAV_ITEMS, STATUS_STYLES  } from './components/data/data'
// import { Badge } from './components/ui/Badge'
// import { Stars } from './components/ui/Stars'
// import { SearchBar } from './components/ui/SearchBar'
// import { Modal } from './components/ui/Modal'
// import { FormField } from './components/ui/FormField'
// import { Pagination } from './components/ui/Pagination'
// import { RevenueChart } from './components/charts/RevenueChart'
// import { DonutChart } from "./components/charts/DonutChart";
// import { SectionHeader } from "./components/layout/SectionHeader";
import { TopBar } from './components/layout/TopBar'
import { Sidebar } from './components/layout/Sidebar'
import DashboardSection from "./components/sections/DashboardSection";
import OrdersSection from "./components/sections/OrdersSection";
import ProductsSection from './components/sections/ProductsSection'
import CustomersSection from './components/sections/CustomersSection'
// import PaymentsSection from './components/sections/PaymentsSection'
import AnalyticsSection from "./components/sections/AnalyticsSection";
import CouponsSection from './components/sections/CouponsSection'
import NotificationsSection    from "./components/sections/NotificationsSection";
import SettingsSection from "./components/sections/SettingsSection";

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

        {/* Content */}
        {/* <main className="flex-1 px-6 md:px-8 py-8"> */}
        <main className="flex-1">
          {SECTIONS[active]}
        </main>
      </div>
    </div>
  );
}