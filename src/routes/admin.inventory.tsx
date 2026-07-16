import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Search, Filter, AlertTriangle, Archive, RefreshCw, CheckCircle2 } from "lucide-react";
import { useAdminProductsActions } from "@/hooks/useAdminProducts";

export const Route = createFileRoute("/admin/inventory")({
  component: AdminInventoryPage,
});

function AdminInventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [localStock, setLocalStock] = useState<Record<string, number>>({});

  const { updateProduct } = useAdminProductsActions();

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin_inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("stock", { ascending: true });
      if (error) throw error;

      // Mock reserved stock for demonstration purposes since we don't have a reserved_stock column yet.
      return (data || []).map((p) => ({
        ...p,
        reserved_stock: Math.floor(Math.random() * (p.stock > 0 ? 3 : 1)), // Mock reserved
      }));
    },
  });

  const filteredProducts = (products || []).filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStock = true;
    if (stockFilter === "low") matchesStock = product.stock > 0 && product.stock <= 10;
    if (stockFilter === "out") matchesStock = product.stock === 0;
    if (stockFilter === "in") matchesStock = product.stock > 10;

    return matchesSearch && matchesStock;
  });

  const totalItems = products?.length || 0;
  const outOfStock = products?.filter((p) => p.stock === 0).length || 0;
  const lowStock = products?.filter((p) => p.stock > 0 && p.stock <= 10).length || 0;

  const handleUpdateStock = async (id: string) => {
    const newStock = localStock[id];
    if (newStock === undefined) return;

    try {
      await updateProduct.mutateAsync({
        id,
        updates: { stock: newStock },
      });
      alert("Stock updated successfully");
    } catch (e: any) {
      alert("Failed to update stock: " + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory Tracking</h1>
          <p className="text-neutral-500 mt-1">
            Monitor stock levels, reserved units, and availability.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold">{totalItems - outOfStock - lowStock}</div>
            <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
              In Stock
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold">{lowStock}</div>
            <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
              Low Stock (&le;10)
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <Archive size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold">{outOfStock}</div>
            <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
              Out of Stock
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-50 dark:bg-neutral-950/50">
          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="w-full sm:w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg py-2 px-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none appearance-none"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">All Stock Levels</option>
            <option value="in">In Stock (&gt;10)</option>
            <option value="low">Low Stock (1-10)</option>
            <option value="out">Out of Stock (0)</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 text-xs font-bold uppercase tracking-widest text-neutral-500">
                <th className="p-4">Product</th>
                <th className="p-4 text-center">Physical Stock</th>
                <th className="p-4 text-center">Reserved</th>
                <th className="p-4 text-center">Available Stock</th>
                <th className="p-4 text-right">Update</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-500">
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-10 bg-neutral-100 dark:bg-neutral-800 rounded w-full"
                        ></div>
                      ))}
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-neutral-500">
                    <Archive size={32} className="mx-auto mb-3 opacity-30" />
                    <p>No inventory records found.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const available = product.stock - product.reserved_stock;
                  let stockStatus = "in";
                  if (available <= 0) stockStatus = "out";
                  else if (available <= 10) stockStatus = "low";

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-neutral-900 dark:text-white">
                              {product.name}
                            </div>
                            {stockStatus === "out" && (
                              <span className="text-[10px] uppercase font-bold text-rose-500">
                                Out of Stock
                              </span>
                            )}
                            {stockStatus === "low" && (
                              <span className="text-[10px] uppercase font-bold text-amber-500">
                                Low Stock
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="font-mono text-sm">{product.stock}</div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="font-mono text-sm text-neutral-400">
                          {product.reserved_stock}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div
                          className={`font-mono font-bold text-sm ${
                            stockStatus === "out"
                              ? "text-rose-600"
                              : stockStatus === "low"
                                ? "text-amber-600"
                                : "text-emerald-600"
                          }`}
                        >
                          {available}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="number"
                            className="w-16 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded p-1 text-sm text-center outline-none focus:border-blue-500"
                            defaultValue={product.stock}
                            onChange={(e) =>
                              setLocalStock((prev) => ({
                                ...prev,
                                [product.id]: parseInt(e.target.value) || 0,
                              }))
                            }
                          />
                          <button
                            onClick={() => handleUpdateStock(product.id)}
                            disabled={updateProduct.isPending}
                            className="p-1.5 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors rounded disabled:opacity-50"
                            title="Update Stock"
                          >
                            <RefreshCw size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
