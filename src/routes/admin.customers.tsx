import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Search, Shield, ShieldAlert, Mail, MapPin, ShoppingBag, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomersPage,
});

function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: customers,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin_customers"],
    queryFn: async () => {
      // Get all profiles and join with orders to calculate spending
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Customers query error:", error);
        throw new Error(error.message);
      }

      const { data: orders } = await supabase
        .from("orders")
        .select("id, user_id, total, payment_status, created_at");
      const { data: shipping } = await supabase
        .from("shipping_addresses")
        .select("order_id, city, state");

      return (profiles || []).map((p) => {
        const customerOrders = (orders || [])
          .filter((o: any) => o.user_id === p.id)
          .map((o: any) => ({
            ...o,
            shipping_addresses: (shipping || []).filter((s: any) => s.order_id === o.id),
          }));

        const verifiedOrders = customerOrders.filter((o: any) => o.payment_status === "Verified");
        const totalSpent = verifiedOrders.reduce((sum: number, o: any) => sum + o.total, 0);
        const lastOrder =
          customerOrders.length > 0
            ? customerOrders.reduce((latest: any, o: any) =>
                new Date(o.created_at) > new Date(latest.created_at) ? o : latest,
              )
            : null;

        // Extract latest location from their orders if possible
        let location = "Unknown";
        if (lastOrder && lastOrder.shipping_addresses && lastOrder.shipping_addresses.length > 0) {
          location = `${lastOrder.shipping_addresses[0].city}, ${lastOrder.shipping_addresses[0].state}`;
        }

        return {
          ...p,
          totalSpent,
          orderCount: customerOrders.length,
          verifiedOrderCount: verifiedOrders.length,
          lastOrderDate: lastOrder ? lastOrder.created_at : null,
          location,
        };
      });
    },
  });

  const filteredCustomers = (customers || []).filter(
    (c) =>
      (c.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-neutral-500 mt-1">
            Manage users, view purchase history, and update roles.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 text-xs font-bold uppercase tracking-widest text-neutral-500">
                <th className="p-4">Customer</th>
                <th className="p-4">Location</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="h-12 bg-neutral-100 dark:bg-neutral-800 rounded w-full"
                        ></div>
                      ))}
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-red-500">
                    <ShieldAlert size={32} className="mx-auto mb-3 opacity-50" />
                    <p className="font-bold">Error loading customers</p>
                    <p className="text-sm opacity-80 mt-1">{error?.message}</p>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-neutral-500">
                    <ShieldAlert size={32} className="mx-auto mb-3 opacity-30" />
                    <p>No customers found.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                          {(customer.full_name || customer.email || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                            {customer.full_name || "Guest"}
                            {customer.role === "admin" && (
                              <Shield size={12} className="text-blue-500" title="Admin User" />
                            )}
                          </div>
                          <div className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                            <Mail size={10} />
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                        <MapPin size={12} className="text-neutral-400" />
                        {customer.location}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium">{customer.orderCount}</div>
                      {customer.lastOrderDate && (
                        <div className="text-xs text-neutral-500">
                          Last: {new Date(customer.lastOrderDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-neutral-900 dark:text-white">
                        ₹{customer.totalSpent.toLocaleString()}
                      </div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 inline-block px-2 py-0.5 rounded-full mt-1">
                        {customer.verifiedOrderCount} verified
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                        View
                        <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
