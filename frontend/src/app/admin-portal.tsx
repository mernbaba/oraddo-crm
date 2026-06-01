import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import {
  Shield,
  Menu,
  X,
  LayoutDashboard,
  Users,
  DollarSign,
  CreditCard,
  Tag,
  MessageSquare,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Search,
  Sparkles
} from "lucide-react";
import { AdminDashboard } from "./components/admin/admin-dashboard";
import { AdminUsers } from "./components/admin/admin-users";
import { AdminFinancials } from "./components/admin/admin-financials";
import { AdminPlans } from "./components/admin/admin-plans";
import { AdminCoupons } from "./components/admin/admin-coupons";
import { AdminQueries } from "./components/admin/admin-queries";
import { AdminSettings } from "./components/admin/admin-settings";

type AdminView = "dashboard" | "users" | "financials" | "plans" | "coupons" | "queries" | "settings";

export default function AdminPortal() {
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminInfo, setAdminInfo] = useState({ fullName: "Super Admin", email: "admin@company.com" });

  useEffect(() => {
    const storedAdmin = sessionStorage.getItem("adminData");
    if (storedAdmin) {
      try {
        const data = JSON.parse(storedAdmin);
        setAdminInfo({
          fullName: data.fullName || "Super Admin",
          email: data.email || "admin@company.com"
        });
      } catch (e) {
        console.error("Error parsing adminData", e);
      }
    }
  }, []);

  const getViewTitle = () => {
    const titles: Record<AdminView, { title: string; subtitle: string }> = {
      "dashboard": { title: "Super Admin Dashboard", subtitle: "Overview of platform metrics and analytics" },
      "users": { title: "User Management", subtitle: "Manage all platform users and their accounts" },
      "financials": { title: "Financial Management", subtitle: "Revenue, transactions, and financial analytics" },
      "plans": { title: "Subscription Plans", subtitle: "Manage pricing plans and user subscriptions" },
      "coupons": { title: "Coupon Management", subtitle: "Create and manage discount codes and promotions" },
      "queries": { title: "Inbound Queries", subtitle: "Manage customer inquiries and support tickets" },
      "settings": { title: "Admin Settings", subtitle: "Configure platform settings and preferences" },
    };
    return titles[currentView];
  };

  const menuItems = [
    { id: "dashboard" as AdminView, icon: LayoutDashboard, label: "Dashboard" },
    { id: "users" as AdminView, icon: Users, label: "Users" },
    { id: "financials" as AdminView, icon: DollarSign, label: "Financials" },
    { id: "plans" as AdminView, icon: CreditCard, label: "Plans" },
    { id: "coupons" as AdminView, icon: Tag, label: "Coupons" },
    { id: "queries" as AdminView, icon: MessageSquare, label: "Queries" },
    { id: "settings" as AdminView, icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0E9FF] via-white to-[#F0E9FF]">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-[#937CB4]/20 z-50 shadow-lg shadow-[#937CB4]/10">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-[#F0E9FF]"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[#422462] blur-xl opacity-40 animate-pulse"></div>
                <Shield className="h-8 w-8 text-[#422462] relative z-10" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#422462] via-[#5A4079] to-[#937CB4] bg-clip-text text-transparent">
                  Super Admin Portal
                </h1>
                <p className="text-xs text-[#5A4079]">Platform Management System</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A4079]" />
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43] text-sm"
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-[#F0E9FF]"
            >
              <Bell className="h-5 w-5 text-[#422462]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#422462]/10 to-[#5A4079]/10 border border-[#937CB4]/20">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#422462] to-[#5A4079] flex items-center justify-center text-white font-bold text-sm">
                SA
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-[#200B43]">{adminInfo.fullName}</p>
                <p className="text-xs text-[#5A4079]">{adminInfo.email}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-[#5A4079]" />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-white/80 backdrop-blur-xl border-r border-[#937CB4]/20 transition-transform duration-300 z-40 shadow-xl shadow-[#937CB4]/10 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full py-6">
          <nav className="flex-1 px-3 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  currentView === item.id
                    ? "bg-gradient-to-r from-[#422462] to-[#5A4079] text-white shadow-lg shadow-[#937CB4]/30"
                    : "text-[#422462] hover:bg-[#F0E9FF] hover:shadow-md"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                {currentView === item.id && (
                  <Sparkles className="h-4 w-4 ml-auto animate-pulse" />
                )}
              </button>
            ))}
          </nav>

          <div className="px-3 pt-6 border-t border-[#937CB4]/20">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-40 animate-pulse"></div>
                <Sparkles className="h-6 w-6 text-[#422462] relative z-10" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#422462] via-[#5A4079] to-[#937CB4] bg-clip-text text-transparent">
                {getViewTitle().title}
              </h2>
            </div>
            <p className="text-[#5A4079] ml-9">{getViewTitle().subtitle}</p>
          </div>

          {/* Content Views */}
          <div className="animate-fade-in">
            {currentView === "dashboard" && <AdminDashboard />}
            {currentView === "users" && <AdminUsers />}
            {currentView === "financials" && <AdminFinancials />}
            {currentView === "plans" && <AdminPlans />}
            {currentView === "coupons" && <AdminCoupons />}
            {currentView === "queries" && <AdminQueries />}
            {currentView === "settings" && <AdminSettings />}
          </div>
        </div>
      </main>
    </div>
  );
}
