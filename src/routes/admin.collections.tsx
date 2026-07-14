import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Edit3, Trash2, GripVertical, LayoutTemplate } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminCollections } from "@/hooks/useAdminCollections";

export const Route = createFileRoute("/admin/collections")({
  component: AdminCollectionsPage,
});

function AdminCollectionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { collections, isLoading, createCollection, updateCollection, deleteCollection } = useAdminCollections();
  
  const [editingCollection, setEditingCollection] = useState<any>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [featured, setFeatured] = useState(false);

  const openAddModal = () => {
    setEditingCollection(null);
    setName("");
    setSlug("");
    setFeatured(false);
    setIsAddModalOpen(true);
  };

  const openEditModal = (col: any) => {
    setEditingCollection(col);
    setName(col.name);
    setSlug(col.slug);
    setFeatured(col.featured || false);
    setIsAddModalOpen(true);
  };

  const handleSave = async () => {
    if (!name || !slug) return alert("Title and Slug are required.");
    try {
      if (editingCollection) {
        await updateCollection.mutateAsync({
          id: editingCollection.id,
          updates: { name, slug, featured }
        });
      } else {
        await createCollection.mutateAsync({ name, slug, featured });
      }
      setIsAddModalOpen(false);
    } catch (e: any) {
      alert("Error saving collection: " + e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this collection?")) {
      try {
        await deleteCollection.mutateAsync(id);
      } catch (e: any) {
        alert("Error deleting collection: " + e.message);
      }
    }
  };

  const filteredCollections = collections.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
          <p className="text-neutral-500 mt-1">Curate groups of products for marketing and discovery.</p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Create Collection</span>
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input 
              type="text" 
              placeholder="Search collections..."
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
                <th className="p-4">Collection Title</th>
                <th className="p-4">Slug URL</th>
                <th className="p-4">Products</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-500">
                    <div className="animate-pulse space-y-4">
                      {[1,2].map(i => <div key={i} className="h-10 bg-neutral-100 dark:bg-neutral-800 rounded w-full"></div>)}
                    </div>
                  </td>
                </tr>
              ) : filteredCollections.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-neutral-500">
                    <LayoutTemplate size={32} className="mx-auto mb-3 opacity-30" />
                    <p>No collections found.</p>
                  </td>
                </tr>
              ) : filteredCollections.map((col: any) => (
                <tr key={col.id} className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group">
                  <td className="p-4">
                    <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-grab active:cursor-grabbing">
                      <GripVertical size={16} />
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                        <LayoutTemplate size={18} />
                      </div>
                      <span className="font-medium text-neutral-900 dark:text-white">{col.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-mono text-neutral-500">/{col.slug}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium">{col.productsCount}</div>
                  </td>
                  <td className="p-4">
                    {col.featured ? (
                      <span className="inline-flex px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium text-neutral-500">
                        No
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(col)} className="p-1.5 text-neutral-400 hover:text-blue-500 transition-colors rounded">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(col.id)} className="p-1.5 text-neutral-400 hover:text-rose-500 transition-colors rounded">
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
                <h2 className="text-xl font-bold">{editingCollection ? 'Edit Collection' : 'New Collection'}</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                  Close
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug / URL</label>
                  <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 outline-none" placeholder="e.g. summer-essentials" />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="featured" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-4 h-4 rounded border-neutral-300" />
                  <label htmlFor="featured" className="text-sm font-medium">Feature on Homepage</label>
                </div>
              </div>
              <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex justify-end gap-3">
                <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 font-medium text-neutral-600 dark:text-neutral-300">Cancel</button>
                <button 
                  onClick={handleSave}
                  disabled={createCollection.isPending || updateCollection.isPending}
                  className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {createCollection.isPending || updateCollection.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
