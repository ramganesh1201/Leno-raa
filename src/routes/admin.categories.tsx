import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Edit3, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mock categories for now. Later this will fetch from a categories table.
  const [categories] = useState([
    { id: 1, name: "Cold Process Soaps", description: "Handcrafted natural soaps.", itemsCount: 12, status: "Active" },
    { id: 2, name: "Glycerin Soaps", description: "Gentle and moisturizing.", itemsCount: 8, status: "Active" },
    { id: 3, name: "Luxury Gift Sets", description: "Perfect for gifting.", itemsCount: 4, status: "Active" },
    { id: 4, name: "Custom Soaps", description: "Personalized skin care.", itemsCount: 2, status: "Active" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-neutral-500 mt-1">Organize your products into categories.</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input 
              type="text" 
              placeholder="Search categories..."
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
                <th className="p-4 w-10"></th>
                <th className="p-4">Category Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Products</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group">
                  <td className="p-4">
                    <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-grab active:cursor-grabbing">
                      <GripVertical size={16} />
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                        <ImageIcon size={18} />
                      </div>
                      <span className="font-medium text-neutral-900 dark:text-white">{category.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-neutral-500">{category.description}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium">{category.itemsCount}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {category.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-neutral-400 hover:text-blue-500 transition-colors rounded">
                        <Edit3 size={16} />
                      </button>
                      <button className="p-1.5 text-neutral-400 hover:text-rose-500 transition-colors rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
                <h2 className="text-xl font-bold">New Category</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                  Close
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input type="text" className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea rows={3} className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 outline-none"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category Image</label>
                  <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-8 text-center text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors">
                    Upload an image
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex justify-end gap-3">
                <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 font-medium text-neutral-600 dark:text-neutral-300">Cancel</button>
                <button className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-2 rounded-lg font-medium">Save</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
