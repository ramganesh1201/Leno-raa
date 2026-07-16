import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Plus, Search, Filter, Edit3, Trash2, EyeOff, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminProductsActions } from "@/hooks/useAdminProducts";

export const Route = createFileRoute("/admin/products")({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");

  const { createProduct, updateProduct, deleteProduct } = useAdminProductsActions();

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin_products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const filteredProducts = (products || []).filter(
    (product: any) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category_id?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setPrice("");
    setStock("");
    setDescription("");
    setSlug("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setDescription(product.description || "");
    setSlug(product.slug);
    setIsAddModalOpen(true);
  };

  const handleSave = async () => {
    if (!name || !price || !stock || !slug)
      return alert("Please fill required fields (Name, Slug, Price, Stock)");

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          updates: {
            name,
            slug,
            price: parseFloat(price),
            stock: parseInt(stock),
            description,
          },
        });
      } else {
        await createProduct.mutateAsync({
          name,
          slug,
          price: parseFloat(price),
          stock: parseInt(stock),
          description,
          status: "active",
          featured: false,
          new_arrival: false,
          rating: 0,
          review_count: 0,
          seo_metadata: {},
        });
      }
      setIsAddModalOpen(false);
    } catch (e: any) {
      alert("Error saving product: " + e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct.mutateAsync(id);
      } catch (e: any) {
        alert("Error deleting product: " + e.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-neutral-500 mt-1">Manage your catalog, inventory, and pricing.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={openAddModal}
            className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
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
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
              <Filter size={16} />
              <span>Category</span>
            </button>
            <button className="px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
              <Filter size={16} />
              <span>Status</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse hidden md:table">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 text-xs font-bold uppercase tracking-widest text-neutral-500">
                <th className="p-4 w-12"></th>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
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
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-neutral-500">
                    <Package size={32} className="mx-auto mb-3 opacity-30" />
                    <p>No products found.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-neutral-200 dark:border-neutral-700">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-full h-full p-2 text-neutral-300" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-neutral-900 dark:text-white">
                        {product.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-neutral-500">
                        {product.category || "Uncategorized"}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium">₹{product.price}</div>
                    </td>
                    <td className="p-4">
                      <div
                        className={`text-sm ${product.stock < 10 ? "text-rose-600 font-bold" : "text-neutral-500"}`}
                      >
                        {product.stock} in stock
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        Published
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-neutral-400 hover:text-blue-500 transition-colors rounded"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-4 p-4">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-full"
                  ></div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-12 text-center text-neutral-500">
                <Package size={32} className="mx-auto mb-3 opacity-30" />
                <p>No products found.</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900 shadow-sm flex gap-4 items-start"
                >
                  <div className="w-16 h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-neutral-200 dark:border-neutral-700 flex-shrink-0">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-full h-full p-3 text-neutral-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-neutral-900 dark:text-white truncate">
                      {product.name}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {product.category || "Uncategorized"}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <div className="text-sm font-medium">₹{product.price}</div>
                      <div
                        className={`text-xs ${product.stock < 10 ? "text-rose-600 font-bold" : "text-neutral-500"}`}
                      >
                        · {product.stock} in stock
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1.5 text-neutral-400 hover:text-blue-500 transition-colors rounded bg-neutral-50 dark:bg-neutral-800"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-500 transition-colors rounded bg-neutral-50 dark:bg-neutral-800"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal Mock */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl custom-scrollbar flex flex-col"
            >
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center sticky top-0 bg-white dark:bg-neutral-900 z-10">
                <h2 className="text-xl font-bold">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                >
                  <span>Close</span>
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Slug (URL friendly)</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 outline-none"
                  ></textarea>
                </div>
              </div>
              <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 mt-auto flex justify-end gap-3 sticky bottom-0">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-medium text-neutral-600 dark:text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={createProduct.isPending || updateProduct.isPending}
                  className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {createProduct.isPending || updateProduct.isPending
                    ? "Saving..."
                    : "Save Product"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
