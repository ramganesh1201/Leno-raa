import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAdminOrders } from "@/hooks/useOrders";
import { Search, Filter, XCircle, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  const { orders, isLoading, isError, error, verifyPayment, updateStatus } = useAdminOrders();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order: any) => {
      const matchesSearch =
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.shipping_addresses?.[0]?.full_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        order.shipping_addresses?.[0]?.phone.includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" ||
        order.order_status.toLowerCase() === statusFilter.toLowerCase() ||
        order.payment_status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleVerify = async (orderId: string, proofId: string, isApproved: boolean) => {
    let reason = "";
    if (!isApproved) {
      reason = prompt("Please provide a reason for rejection:") || "Invalid payment proof";
    }
    await verifyPayment.mutateAsync({ orderId, proofId, isApproved, rejectionReason: reason });
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (
    orderId: string,
    currentStatus: string,
    currentNotes: string,
    currentCourier: string,
    currentTracking: string,
  ) => {
    const newStatus = prompt(
      "Enter new order status (Preparing, Packed, Shipped, Delivered, Cancelled):",
      currentStatus,
    );
    if (!newStatus) return;
    const newNotes = prompt("Internal Notes:", currentNotes || "") || "";
    const newCourier = prompt("Courier Name:", currentCourier || "") || "";
    const newTracking = prompt("Tracking Number:", currentTracking || "") || "";

    await updateStatus.mutateAsync({
      orderId,
      status: newStatus,
      notes: newNotes,
      courier: newCourier,
      tracking: newTracking,
    });
    setSelectedOrder(null);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
        <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
          <p className="text-neutral-500 mt-1">Review, process, and track customer orders.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)]"
              size={16}
            />
            <input
              type="text"
              placeholder="Search orders, names, phones..."
              className="w-full sm:w-64 bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-full py-2 pl-10 pr-4 text-sm focus:border-[color:var(--gold)] focus:outline-none transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)]"
              size={16}
            />
            <select
              className="w-full sm:w-48 bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-full py-2 pl-10 pr-4 text-sm focus:border-[color:var(--gold)] focus:outline-none transition-colors appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="awaiting verification">Awaiting Verification</option>
              <option value="verified">Verified (Payment)</option>
              <option value="rejected">Rejected (Payment)</option>
              <option value="preparing">Preparing</option>
              <option value="shipped">Shipped</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse hidden md:table">
            <thead>
              <tr className="border-b border-[color:var(--border)] bg-black/5 dark:bg-white/5 text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]">
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isError ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-red-500">
                    <p className="font-bold">Error loading orders</p>
                    <p className="text-sm opacity-80 mt-1">
                      {(error as any)?.message || "Unknown error"}
                    </p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[color:var(--muted-foreground)]">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order: any) => (
                  <tr
                    key={order.id}
                    className="border-b border-[color:var(--border)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="p-4">
                      <div className="font-medium">{order.order_number}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-sm">
                        {order.shipping_addresses?.[0]?.full_name || order.profiles?.full_name}
                      </div>
                      <div className="text-xs text-[color:var(--muted-foreground)]">
                        {order.shipping_addresses?.[0]?.phone}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium tracking-wide">
                        ₹{new Intl.NumberFormat("en-IN").format(order.total)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium border ${
                          order.payment_status === "Verified"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : order.payment_status === "Rejected"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : order.payment_status === "Awaiting Verification"
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium bg-[color:var(--gold)]/10 text-[color:var(--gold)] border border-[color:var(--gold)]/20">
                        {order.order_status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-[color:var(--gold)] hover:underline text-xs tracking-widest uppercase">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-4 p-4">
            {isError ? (
              <div className="p-8 text-center text-red-500">
                <p className="font-bold">Error loading orders</p>
                <p className="text-sm opacity-80 mt-1">
                  {(error as any)?.message || "Unknown error"}
                </p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-[color:var(--muted-foreground)]">
                No orders found matching your criteria.
              </div>
            ) : (
              filteredOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="border border-[color:var(--border)] rounded-xl p-4 bg-white dark:bg-neutral-900 shadow-sm flex flex-col gap-3 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold">{order.order_number}</div>
                      <div className="text-xs text-[color:var(--muted-foreground)]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-medium tracking-wide">
                      ₹{new Intl.NumberFormat("en-IN").format(order.total)}
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-sm">
                      {order.shipping_addresses?.[0]?.full_name || order.profiles?.full_name}
                    </div>
                    <div className="text-xs text-[color:var(--muted-foreground)]">
                      {order.shipping_addresses?.[0]?.phone}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium border ${
                        order.payment_status === "Verified"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : order.payment_status === "Rejected"
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : order.payment_status === "Awaiting Verification"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      }`}
                    >
                      {order.payment_status}
                    </span>
                    <span className="inline-flex px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium bg-[color:var(--gold)]/10 text-[color:var(--gold)] border border-[color:var(--gold)]/20">
                      {order.order_status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl relative custom-scrollbar"
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <XCircle size={24} />
              </button>

              <div className="p-8 md:p-10">
                <div className="mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-6">
                  <div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">
                    Order Details
                  </div>
                  <h2 className="text-3xl font-bold">{selectedOrder.order_number}</h2>
                  <div className="mt-4 flex gap-3">
                    <span className="inline-flex px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                      {selectedOrder.order_status}
                    </span>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium border ${
                        selectedOrder.payment_status === "Verified"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : selectedOrder.payment_status === "Rejected"
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : selectedOrder.payment_status === "Awaiting Verification"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      }`}
                    >
                      Payment: {selectedOrder.payment_status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                        Customer & Shipping
                      </h3>
                      <div className="text-sm space-y-2 text-neutral-700 dark:text-neutral-300">
                        <p>
                          <span className="opacity-60 w-20 inline-block">Name:</span>{" "}
                          <span className="font-medium">
                            {selectedOrder.shipping_addresses?.[0]?.full_name}
                          </span>
                        </p>
                        <p>
                          <span className="opacity-60 w-20 inline-block">Email:</span>{" "}
                          {selectedOrder.profiles?.email}
                        </p>
                        <p>
                          <span className="opacity-60 w-20 inline-block">Phone:</span>{" "}
                          {selectedOrder.shipping_addresses?.[0]?.phone}
                        </p>
                        <p>
                          <span className="opacity-60 w-20 inline-block align-top">Address:</span>{" "}
                          <span className="inline-block w-[calc(100%-5rem)]">
                            {selectedOrder.shipping_addresses?.[0]?.address},{" "}
                            {selectedOrder.shipping_addresses?.[0]?.city},{" "}
                            {selectedOrder.shipping_addresses?.[0]?.state}{" "}
                            {selectedOrder.shipping_addresses?.[0]?.pincode}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {selectedOrder.order_items?.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-sm bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800"
                          >
                            <div>
                              <div className="font-medium text-neutral-900 dark:text-white">
                                {item.product?.name || "Custom Soap"}
                              </div>
                              <div className="text-xs text-neutral-500">
                                Qty: {item.quantity} x ₹
                                {new Intl.NumberFormat("en-IN").format(item.price)}
                              </div>
                            </div>
                            <div className="font-medium tracking-wide">
                              ₹{new Intl.NumberFormat("en-IN").format(item.quantity * item.price)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-sm space-y-2">
                        <div className="flex justify-between text-neutral-500">
                          <span>Subtotal</span>
                          <span>
                            ₹{new Intl.NumberFormat("en-IN").format(selectedOrder.subtotal)}
                          </span>
                        </div>
                        <div className="flex justify-between text-neutral-500">
                          <span>Shipping</span>
                          <span>
                            ₹{new Intl.NumberFormat("en-IN").format(selectedOrder.shipping_cost)}
                          </span>
                        </div>
                        <div className="flex justify-between font-medium text-lg pt-2 border-t border-neutral-200 dark:border-neutral-800 mt-2 text-neutral-900 dark:text-white">
                          <span>Total</span>
                          <span>₹{new Intl.NumberFormat("en-IN").format(selectedOrder.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                        Payment Verification
                      </h3>
                      {selectedOrder.payment_proofs?.[0] ? (
                        <div className="space-y-4">
                          <PaymentProofImage url={selectedOrder.payment_proofs[0].screenshot_url} />
                          <div className="text-sm bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                            <p>
                              <span className="opacity-60 text-neutral-500">UTR Number:</span>{" "}
                              <span className="font-medium tracking-wide">
                                {selectedOrder.payment_proofs[0].utr_number}
                              </span>
                            </p>
                            <p className="mt-1">
                              <span className="opacity-60 text-neutral-500">Uploaded:</span>{" "}
                              {new Date(
                                selectedOrder.payment_proofs[0].uploaded_at,
                              ).toLocaleString()}
                            </p>
                          </div>

                          {selectedOrder.payment_status === "Awaiting Verification" && (
                            <div className="flex gap-4 pt-2">
                              <button
                                onClick={() =>
                                  handleVerify(
                                    selectedOrder.id,
                                    selectedOrder.payment_proofs[0].id,
                                    true,
                                  )
                                }
                                disabled={verifyPayment.isPending}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-full text-sm font-medium transition-colors"
                              >
                                Approve Payment
                              </button>
                              <button
                                onClick={() =>
                                  handleVerify(
                                    selectedOrder.id,
                                    selectedOrder.payment_proofs[0].id,
                                    false,
                                  )
                                }
                                disabled={verifyPayment.isPending}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-full text-sm font-medium transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-neutral-500 italic bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg text-center border border-neutral-200 dark:border-neutral-800">
                          No payment proof uploaded yet.
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                        Admin Actions
                      </h3>
                      <div className="space-y-4">
                        <div className="text-sm bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg space-y-2 border border-neutral-200 dark:border-neutral-800">
                          <p>
                            <span className="opacity-60 text-neutral-500 w-16 inline-block">
                              Courier:
                            </span>{" "}
                            {selectedOrder.courier_name || "N/A"}
                          </p>
                          <p>
                            <span className="opacity-60 text-neutral-500 w-16 inline-block">
                              Tracking:
                            </span>{" "}
                            {selectedOrder.tracking_number || "N/A"}
                          </p>
                          <p>
                            <span className="opacity-60 text-neutral-500 w-16 inline-block">
                              Notes:
                            </span>{" "}
                            {selectedOrder.internal_notes || "None"}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              selectedOrder.id,
                              selectedOrder.order_status,
                              selectedOrder.internal_notes,
                              selectedOrder.courier_name,
                              selectedOrder.tracking_number,
                            )
                          }
                          className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg py-3 font-medium hover:opacity-90 transition-opacity"
                        >
                          Update Status & Tracking
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PaymentProofImage({ url }: { url: string }) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadUrl() {
      try {
        if (!url) {
          setError(true);
          return;
        }

        // If it's already a signed URL or not a supabase storage URL, use directly
        if (
          url.includes("?token=") ||
          (url.startsWith("http") && !url.includes("/storage/v1/object/public/"))
        ) {
          setSignedUrl(url);
          return;
        }

        // Parse Supabase public URL to extract bucket and path
        const match = url.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)$/);

        if (match) {
          const bucket = match[1];
          const path = match[2];

          const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, 60 * 60);

          if (error || !data) {
            console.error("Failed to sign url:", error);
            setError(true);
          } else {
            setSignedUrl(data.signedUrl);
          }
        } else if (!url.startsWith("http")) {
          // If stored as raw path: "payment-proofs/abc/def.png"
          const parts = url.split("/");
          const bucket = parts[0];
          const path = parts.slice(1).join("/");
          const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, 60 * 60);
          if (data?.signedUrl) {
            setSignedUrl(data.signedUrl);
          } else {
            setError(true);
          }
        } else {
          // Fallback if we can't parse it
          setSignedUrl(url);
        }
      } catch (err) {
        console.error("Error loading image:", err);
        setError(true);
      }
    }
    loadUrl();
  }, [url]);

  if (error) {
    return (
      <div className="w-full h-48 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-sm text-neutral-500 rounded-xl border border-neutral-200 dark:border-neutral-800 italic">
        Payment proof unavailable
      </div>
    );
  }

  if (!signedUrl) {
    return (
      <div className="w-full h-48 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-xl" />
    );
  }

  return (
    <a
      href={signedUrl}
      target="_blank"
      rel="noreferrer"
      className="block relative group border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:border-blue-500 transition-colors"
    >
      <img
        src={signedUrl}
        alt="Proof"
        className="w-full h-auto max-h-48 object-cover bg-neutral-100 dark:bg-neutral-800"
        onError={() => setError(true)}
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <ExternalLink className="text-white" size={24} />
      </div>
    </a>
  );
}
