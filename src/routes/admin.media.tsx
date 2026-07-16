import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  UploadCloud,
  Search,
  Trash2,
  Link as LinkIcon,
  Image as ImageIcon,
  FileVideo,
  File,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/admin/media")({
  component: AdminMediaPage,
});

function AdminMediaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedFile, setSelectedFile] = useState<any>(null);

  // Mock media files
  const [mediaFiles] = useState([
    {
      id: 1,
      name: "hero-banner-main.jpg",
      type: "image",
      size: "1.2 MB",
      date: "2024-05-10",
      url: "https://placehold.co/1920x1080/1a1a1a/ffffff?text=Hero",
    },
    {
      id: 2,
      name: "rose-clay-soap-1.jpg",
      type: "image",
      size: "450 KB",
      date: "2024-05-11",
      url: "https://placehold.co/800x800/f5e6e6/000000?text=Rose+Clay",
    },
    {
      id: 3,
      name: "lavender-dream-1.jpg",
      type: "image",
      size: "520 KB",
      date: "2024-05-11",
      url: "https://placehold.co/800x800/e6e6fa/000000?text=Lavender",
    },
    {
      id: 4,
      name: "brand-video-720p.mp4",
      type: "video",
      size: "15.4 MB",
      date: "2024-05-12",
      url: "#",
    },
    {
      id: 5,
      name: "upi-qr-code.png",
      type: "image",
      size: "120 KB",
      date: "2024-05-15",
      url: "https://placehold.co/400x400/ffffff/000000?text=QR",
    },
  ]);

  const filteredMedia = mediaFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeTab === "all" || file.type === activeTab;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
          <p className="text-neutral-500 mt-1">
            Manage all your product images, banners, and videos in one place.
          </p>
        </div>

        <button className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
          <UploadCloud size={16} />
          <span>Upload Files</span>
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
              placeholder="Search files..."
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${activeTab === "all" ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("image")}
              className={`flex-1 px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${activeTab === "image" ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
            >
              Images
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`flex-1 px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${activeTab === "video" ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
            >
              Videos
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredMedia.map((file) => (
              <div
                key={file.id}
                className="group relative aspect-square rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => setSelectedFile(file)}
              >
                {file.type === "image" ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 bg-neutral-100 dark:bg-neutral-800 transition-transform group-hover:scale-105">
                    <FileVideo size={48} />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium truncate">{file.name}</p>
                  <p className="text-neutral-300 text-[10px]">{file.size}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredMedia.length === 0 && (
            <div className="py-20 text-center text-neutral-500">
              <File size={48} className="mx-auto mb-4 opacity-20" />
              <p>No media files found.</p>
            </div>
          )}
        </div>
      </div>

      {/* File Details Sidebar / Modal */}
      <AnimatePresence>
        {selectedFile && (
          <div
            className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedFile(null)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md h-full bg-white dark:bg-neutral-900 shadow-2xl border-l border-neutral-200 dark:border-neutral-800 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50 dark:bg-neutral-950/50">
                <h2 className="font-bold text-lg">File Details</h2>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white text-sm font-medium"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                  {selectedFile.type === "image" ? (
                    <img
                      src={selectedFile.url}
                      alt={selectedFile.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <FileVideo size={64} className="text-neutral-400" />
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">
                      File Name
                    </label>
                    <div className="text-sm font-medium break-all">{selectedFile.name}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">
                        Type
                      </label>
                      <div className="text-sm capitalize">{selectedFile.type}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">
                        Size
                      </label>
                      <div className="text-sm">{selectedFile.size}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">
                        Uploaded
                      </label>
                      <div className="text-sm">
                        {new Date(selectedFile.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">
                      Public URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={selectedFile.url}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 text-xs font-mono outline-none"
                      />
                      <button className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-neutral-600 dark:text-neutral-300">
                        <LinkIcon size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 flex justify-end">
                <button className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-sm font-medium transition-colors">
                  <Trash2 size={16} />
                  Delete File
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
