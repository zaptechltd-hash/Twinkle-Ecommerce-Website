
"use client";
import { useState, useEffect, useCallback } from "react";
import { TopBar } from './components/layout/TopBar'
import { Sidebar } from './components/layout/Sidebar'
import DashboardSection from "./components/sections/DashboardSection";
import OrdersSection from "./components/sections/OrdersSection";
import ProductsSection from './components/sections/ProductsSection'
import CustomersSection from './components/sections/CustomersSection'
import AnalyticsSection from "./components/sections/AnalyticsSection";
import CouponsSection from './components/sections/CouponsSection'
import NotificationsSection from "./components/sections/NotificationsSection";
import SettingsSection from "./components/sections/SettingsSection";
import AdminGuard from "./components/AdminGuard";
import useNotificationService from "../services/Notifications/index";
import useAuthService from "../services/auth/index";
import { getRefreshToken, clearTokens } from "../utils/token";

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { adminLogout } = useAuthService();
  const [adminUser, setAdminUser] = useState(null);

useEffect(() => {
  const stored = localStorage.getItem("adminUser");
  if (stored) setAdminUser(JSON.parse(stored));
}, []);

const handleSignOut = async () => {
  const refreshToken = getRefreshToken();
  try {
    await adminLogout(refreshToken);
  } finally {
    clearTokens();
    localStorage.removeItem("adminUser");  
    window.location.href = "/admin/login";
  }
};

  const { getNotifications } = useNotificationService();

  const fetchUnread = useCallback(async () => {
    const res = await getNotifications();
    if (res) setUnreadCount(res.unreadCount);
  }, []);

  useEffect(() => {
    fetchUnread();
    const id = setInterval(fetchUnread, 30_000);
    return () => clearInterval(id);
  }, [fetchUnread]);

  const SECTIONS = {
    dashboard:     <DashboardSection />,
    orders:        <OrdersSection />,
    products:      <ProductsSection />,
    customers:     <CustomersSection />,
    analytics:     <AnalyticsSection />,
    coupons:       <CouponsSection />,
    notifications: (
      <NotificationsSection onCountChange={setUnreadCount} />
    ),
    settings:      <SettingsSection />,
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-stone-50 flex">
        <Sidebar
          active={active}
          sidebarOpen={sidebarOpen}
          unread={unreadCount}
          onNavigate={setActive}
          onToggle={() => setSidebarOpen((o) => !o)}
          onSignOut={handleSignOut}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar
            active={active}
            unread={unreadCount}
            onNotifClick={() => setActive("notifications")}
            adminUser={adminUser}
          />
          <main className="flex-1">
            {SECTIONS[active]}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}