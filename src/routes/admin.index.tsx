import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  AlertCircle,
  BarChart3,
  Clock,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function StatCard({ title, value, change, trend, icon: Icon, subtitle }: any) {
  const isPositive = trend === "up";

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
          <Icon size={20} />
        </div>
        {change && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              isPositive
                ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10"
                : "text-rose-600 bg-rose-50 dark:bg-rose-500/10"
            }`}
          >
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {change}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">{title}</h3>
        <div className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{value}</div>
        {subtitle && <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

function AdminDashboard() {
  // We fetch basic stats here. In a real scenario, this would be an RPC call or complex aggregation.
  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin_stats"],
    queryFn: async () => {
      const [ordersRes, usersRes, productsRes, recentOrdersRes] = await Promise.all([
        supabase.from("orders").select("total, order_status, payment_status, created_at"),
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("products").select("id, stock", { count: "exact" }),
        supabase
          .from("orders")
          .select("order_number, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      if (ordersRes.error) throw ordersRes.error;
      if (usersRes.error) throw usersRes.error;
      if (productsRes.error) throw productsRes.error;
      if (recentOrdersRes.error) throw recentOrdersRes.error;

      const orders = ordersRes.data || [];
      const totalRevenue = orders.reduce(
        (sum, o) => sum + (o.payment_status === "Verified" ? o.total : 0),
        0,
      );
      const pendingVerification = orders.filter(
        (o) => o.payment_status === "Awaiting Verification",
      ).length;
      const pendingOrders = orders.filter((o) =>
        ["Preparing", "Packed"].includes(o.order_status),
      ).length;

      const lowStock = (productsRes.data || []).filter((p) => p.stock < 10).length;

      // Group revenue by date for the last 7 days
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          revenue: 0,
          fullDate: d,
        };
      });

      orders.forEach((o) => {
        if (o.payment_status === "Verified") {
          const orderDate = new Date(o.created_at);
          const dayMatch = last7Days.find(
            (d) =>
              d.fullDate.getDate() === orderDate.getDate() &&
              d.fullDate.getMonth() === orderDate.getMonth(),
          );
          if (dayMatch) {
            dayMatch.revenue += o.total;
          }
        }
      });

      return {
        totalRevenue,
        ordersCount: orders.length,
        customersCount: usersRes.count || 0,
        productsCount: productsRes.count || 0,
        pendingVerification,
        pendingOrders,
        lowStock,
        recentActivity: recentOrdersRes.data || [],
        revenueChart: last7Days,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl border border-red-200 dark:border-red-800/30">
        <h3 className="font-bold mb-2">Error loading dashboard stats</h3>
        <p className="text-sm opacity-80">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-neutral-500 mt-1">Here's what's happening with your business today.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${stats?.totalRevenue.toLocaleString()}`}
          change="12.5"
          trend="up"
          icon={DollarSign}
        />
        <StatCard
          title="Total Orders"
          value={stats?.ordersCount}
          change="8.2"
          trend="up"
          icon={ShoppingBag}
        />
        <StatCard
          title="Total Customers"
          value={stats?.customersCount}
          change="2.4"
          trend="up"
          icon={Users}
        />
        <StatCard
          title="Pending Payments"
          value={stats?.pendingVerification}
          subtitle="Needs verification"
          icon={AlertCircle}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Package size={24} />
          </div>
          <div>
            <div className="text-sm text-neutral-500">Orders to Fulfill</div>
            <div className="text-xl font-bold">{stats?.pendingOrders} orders</div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <div className="text-sm text-neutral-500">Low Stock Alerts</div>
            <div className="text-xl font-bold">{stats?.lowStock} products</div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-sm text-neutral-500">Total Products</div>
            <div className="text-xl font-bold">{stats?.productsCount} items</div>
          </div>
        </div>
      </div>

      {/* Charts & Tables Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Revenue Overview (7 Days)</h2>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.revenueChart || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888888" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888888" }}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number) => [`₹${value}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold mb-6">Recent Activity</h2>
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {stats?.recentActivity?.length === 0 && (
              <div className="text-center text-sm text-neutral-500 py-10">No recent activity</div>
            )}
            {stats?.recentActivity?.map((activity: any, i: number) => (
              <div
                key={i}
                className="flex gap-4 relative before:absolute before:left-[11px] before:top-8 before:bottom-[-24px] before:w-px before:bg-neutral-200 dark:before:bg-neutral-800 last:before:hidden"
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 z-10 ring-4 ring-white dark:ring-neutral-900">
                  <ShoppingBag size={12} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">New order #{activity.order_number}</p>
                  <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
