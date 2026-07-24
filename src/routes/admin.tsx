import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useAdminRealtime } from "@/hooks/useAdminRealtime";
import {
  LayoutDashboard,
  ShoppingBag,
  CheckSquare,
  Package,
  Tags,
  LayoutTemplate,
  Users,
  Archive,
  Star,
  Ticket,
  BarChart3,
  Edit3,
  Image as ImageIcon,
  Settings,
  User,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Lenoraa Admin Dashboard" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user, signOut, isLoading: isAuthLoading } = useAuth();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Enable global realtime updates for all admin queries
  useAdminRealtime();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  if (isAuthLoading || isProfileLoading || profile?.role !== "admin") {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-sm tracking-widest uppercase">
        Verifying Clearance...
      </div>
    );
  }

  const menuGroups = [
    {
      title: "Core",
      items: [
        { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
        { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
        { label: "Payments", to: "/admin/payments", icon: CheckSquare },
      ],
    },
    {
      title: "Catalog",
      items: [
        { label: "Products", to: "/admin/products", icon: Package },
        { label: "Categories", to: "/admin/categories", icon: Tags },
        { label: "Collections", to: "/admin/collections", icon: LayoutTemplate },
      ],
    },
    {
      title: "Management",
      items: [
        { label: "Customers", to: "/admin/customers", icon: Users },
        { label: "Inventory", to: "/admin/inventory", icon: Archive },
        { label: "Reviews", to: "/admin/reviews", icon: Star },
        { label: "Coupons", to: "/admin/coupons", icon: Ticket },
      ],
    },
    {
      title: "Storefront",
      items: [
        { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
        { label: "Homepage CMS", to: "/admin/cms", icon: Edit3 },
        { label: "Media Library", to: "/admin/media", icon: ImageIcon },
      ],
    },
    {
      title: "System",
      items: [
        { label: "Settings", to: "/admin/settings", icon: Settings },
        { label: "Profile", to: "/admin/profile", icon: User },
      ],
    },
  ];

  return (
    <div
      className={`min-h-screen font-sans ${isDarkMode ? "dark bg-neutral-950 text-neutral-100" : "bg-neutral-50 text-neutral-900"}`}
    >
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-50 
        transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto custom-scrollbar
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 bg-white dark:bg-neutral-900 z-10">
          <Link to="/admin" className="font-serif text-xl tracking-widest font-bold">
            LENORAA
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} className="text-neutral-500" />
          </button>
        </div>

        <div className="p-4 space-y-8 pb-20">
          {menuGroups.map((group, idx) => (
            <div key={idx}>
              <div className="px-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
                {group.title}
              </div>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.to || (item.to !== "/admin" && pathname.startsWith(item.to));
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white"
                        }`}
                      >
                        <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm text-neutral-500">
              <span className="font-serif tracking-wider font-medium">Lenoraa Admin</span>
              <span>/</span>
              <span className="capitalize">{pathname.split("/")[2] || "Dashboard"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden sm:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search anything (CMD+K)..."
                className="w-64 bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700 transition-shadow"
              />
            </div>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <NotificationDropdown />

            <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800 mx-1 sm:mx-2"></div>

            <button
              onClick={() => {
                signOut.mutate();
                navigate({ to: "/" });
              }}
              className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-neutral-50 dark:bg-neutral-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
