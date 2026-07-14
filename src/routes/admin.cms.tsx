import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GripVertical, Save, Edit3, Power, PowerOff, LayoutTemplate, Image as ImageIcon, MessageSquare, MonitorPlay, Tags } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/cms")({
  component: AdminCMSPage,
});

function AdminCMSPage() {
  const [sections, setSections] = useState([
    { id: "hero", title: "Hero Banner", type: "Hero", active: true, icon: ImageIcon },
    { id: "announcement", title: "Announcement Bar", type: "Text", active: true, icon: MessageSquare },
    { id: "featured_collections", title: "Featured Collections", type: "Grid", active: true, icon: LayoutTemplate },
    { id: "featured_products", title: "Best Sellers", type: "Slider", active: true, icon: Tags },
    { id: "video_campaign", title: "Brand Video", type: "Video", active: false, icon: MonitorPlay },
    { id: "testimonials", title: "Customer Reviews", type: "Slider", active: true, icon: MessageSquare },
  ]);

  const toggleSection = (id: string) => {
    setSections(s => s.map(sec => sec.id === id ? { ...sec, active: !sec.active } : sec));
  };

  const [activeEditor, setActiveEditor] = useState<string | null>("hero");

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Homepage CMS</h1>
          <p className="text-neutral-500 mt-1">Manage the structure and content of your storefront homepage.</p>
        </div>
        <button className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
          <Save size={18} />
          Publish Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sections List (Reorderable conceptually) */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-4 h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4 px-2">Page Layout (Drag to Reorder)</h2>
          <div className="space-y-2">
            {sections.map((section) => (
              <div 
                key={section.id} 
                className={`group flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  activeEditor === section.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50'
                }`}
                onClick={() => setActiveEditor(section.id)}
              >
                <div className="cursor-grab active:cursor-grabbing p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200" onClick={(e) => e.stopPropagation()}>
                  <GripVertical size={16} />
                </div>
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center text-neutral-500 border border-neutral-100 dark:border-neutral-700">
                  <section.icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-neutral-900 dark:text-white truncate">{section.title}</div>
                  <div className="text-xs text-neutral-500">{section.type} Section</div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleSection(section.id); }}
                  className={`p-1.5 rounded-md transition-colors ${section.active ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100' : 'text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200'}`}
                  title={section.active ? "Disable Section" : "Enable Section"}
                >
                  {section.active ? <Power size={14} /> : <PowerOff size={14} />}
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-medium text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
            + Add New Section
          </button>
        </div>

        {/* Section Editor */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col h-[calc(100vh-200px)]">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 rounded-t-2xl flex items-center gap-3">
            <Edit3 className="text-blue-500" size={24} />
            <div>
              <h2 className="text-xl font-bold">{sections.find(s => s.id === activeEditor)?.title} Editor</h2>
              <p className="text-xs text-neutral-500 mt-1">Make changes below and click save.</p>
            </div>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
            {activeEditor === 'hero' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Headline</label>
                  <input type="text" className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors" defaultValue="Nature's Purest Essence." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subheadline</label>
                  <textarea rows={3} className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors" defaultValue="Handcrafted luxury soaps made with organic ingredients for a mindful bathing ritual."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Button Text</label>
                  <input type="text" className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors" defaultValue="Explore the Collection" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Button Link</label>
                  <input type="text" className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors" defaultValue="/collections/all" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Background Image</label>
                  <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-8 text-center text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors flex flex-col items-center gap-2">
                    <ImageIcon size={32} className="opacity-50" />
                    Upload new background image (1920x1080 recommended)
                  </div>
                </div>
              </motion.div>
            )}

            {activeEditor === 'announcement' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Announcement Text</label>
                  <input type="text" className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors" defaultValue="Free shipping on orders over ₹1500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Background Color</label>
                  <input type="color" className="w-full h-12 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-1 outline-none cursor-pointer" defaultValue="#1a1a1a" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Text Color</label>
                  <input type="color" className="w-full h-12 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-1 outline-none cursor-pointer" defaultValue="#ffffff" />
                </div>
              </motion.div>
            )}

            {activeEditor !== 'hero' && activeEditor !== 'announcement' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-neutral-500 text-center space-y-4">
                <LayoutTemplate size={48} className="opacity-20" />
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-white">Dynamic Section</h3>
                  <p className="text-sm mt-1 max-w-sm">This section pulls content automatically based on your products and collections configuration.</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
