import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Edit3, Trash2, Ticket, Power, PowerOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminCoupons } from "@/hooks/useAdminCoupons";

export const Route = createFileRoute("/admin/coupons")({
  component: AdminCouponsPage,
});

function AdminCouponsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { coupons, isLoading, createCoupon, updateCoupon, deleteCoupon } = useAdminCoupons();

  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [code, setCode] = useState("");
  const [type, setType] = useState("percentage");
  const [value, setValue] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const openAddModal = () => {
    setEditingCoupon(null);
    setCode("");
    setType("percentage");
    setValue("");
    setMinOrder("");
    setMaxDiscount("");
    setUsageLimit("");
    setExpiryDate("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (col: any) => {
    setEditingCoupon(col);
    setCode(col.code);
    setType(col.type);
    setValue(col.value.toString());
    setMinOrder(col.min_order_amount?.toString() || "");
    setMaxDiscount(col.max_discount_amount?.toString() || "");
    setUsageLimit(col.usage_limit?.toString() || "");
    setExpiryDate(col.expires_at ? col.expires_at.split("T")[0] : "");
    setIsAddModalOpen(true);
  };

  const handleSave = async () => {
    if (!code || !value) return alert("Code and Value are required.");
    const couponData = {
      code,
      type,
      value: parseFloat(value),
      min_order_amount: minOrder ? parseFloat(minOrder) : null,
      max_discount_amount: maxDiscount ? parseFloat(maxDiscount) : null,
      usage_limit: usageLimit ? parseInt(usageLimit) : null,
      expires_at: expiryDate ? new Date(expiryDate).toISOString() : null,
      is_active: true,
    };

    try {
      if (editingCoupon) {
        await updateCoupon.mutateAsync({
          id: editingCoupon.id,
          updates: couponData,
        });
      } else {
        await createCoupon.mutateAsync(couponData);
      }
      setIsAddModalOpen(false);
    } catch (e: any) {
      alert("Error saving coupon: " + e.message);
    }
  };

  const toggleCoupon = async (id: string, currentStatus: boolean) => {
    try {
      await updateCoupon.mutateAsync({ id, updates: { is_active: !currentStatus } });
    } catch (e: any) {
      alert("Error toggling coupon: " + e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCoupon.mutateAsync(id);
      } catch (e: any) {
        alert("Error deleting coupon: " + e.message);
      }
    }
  };

  const filteredCoupons = (coupons || []).filter((c: any) =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupons & Discounts</h1>
          <p className="text-neutral-500 mt-1">Create promo codes to boost sales.</p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search codes..."
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 text-xs font-bold uppercase tracking-widest text-neutral-500">
                <th className="p-4">Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Conditions</th>
                <th className="p-4">Usage</th>
                <th className="p-4">Expiry</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-500">
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-10 bg-neutral-100 dark:bg-neutral-800 rounded w-full"
                        ></div>
                      ))}
                    </div>
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-neutral-500">
                    <Ticket size={32} className="mx-auto mb-3 opacity-30" />
                    <p>No coupons found.</p>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon: any) => (
                  <tr
                    key={coupon.id}
                    className={`border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${!coupon.is_active ? "opacity-50 grayscale" : ""}`}
                  >
                    <td className="p-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg font-mono font-bold text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700">
                        <Ticket size={14} className="text-neutral-400" />
                        {coupon.code}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                        {coupon.type === "percentage"
                          ? `${coupon.value}% OFF`
                          : `₹${coupon.value} OFF`}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm space-y-1">
                        <div className="text-neutral-500">
                          Min:{" "}
                          <span className="font-medium text-neutral-900 dark:text-white">
                            ₹{coupon.min_order_amount || 0}
                          </span>
                        </div>
                        {coupon.max_discount_amount && (
                          <div className="text-neutral-500">
                            Max Disc:{" "}
                            <span className="font-medium text-neutral-900 dark:text-white">
                              ₹{coupon.max_discount_amount}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium">
                        {coupon.times_used || 0}{" "}
                        {coupon.usage_limit ? `/ ${coupon.usage_limit}` : "uses"}
                      </div>
                      {coupon.usage_limit && (coupon.times_used || 0) >= coupon.usage_limit && (
                        <div className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-1">
                          Limit Reached
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        {coupon.expires_at
                          ? new Date(coupon.expires_at).toLocaleDateString()
                          : "Never"}
                      </div>
                      {coupon.expires_at && new Date(coupon.expires_at) < new Date() && (
                        <div className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-1">
                          Expired
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleCoupon(coupon.id, coupon.is_active)}
                        className={`inline-flex px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold border transition-colors flex items-center gap-1 ${
                          coupon.is_active
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-neutral-100 text-neutral-500 border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        }`}
                      >
                        {coupon.is_active ? <Power size={12} /> : <PowerOff size={12} />}
                        {coupon.is_active ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(coupon)}
                          className="p-1.5 text-neutral-400 hover:text-blue-500 transition-colors rounded"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-500 transition-colors rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal Mock */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 w-full max-w-lg overflow-y-auto rounded-2xl shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {editingCoupon ? "Edit Coupon" : "Create Coupon"}
                </h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                >
                  Close
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 font-mono uppercase outline-none"
                    placeholder="e.g. SUMMER20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 outline-none"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Value</label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Min Order Amount (₹)</label>
                    <input
                      type="number"
                      value={minOrder}
                      onChange={(e) => setMinOrder(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 outline-none"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Discount (₹)</label>
                    <input
                      type="number"
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 outline-none"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Usage Limit</label>
                    <input
                      type="number"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 outline-none"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 outline-none text-neutral-500"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex justify-end gap-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-medium text-neutral-600 dark:text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={createCoupon.isPending || updateCoupon.isPending}
                  className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {createCoupon.isPending || updateCoupon.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
