import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, Download, ExternalLink } from "lucide-react";

interface FullscreenViewerProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
  downloadName?: string;
}

export function FullscreenViewer({
  isOpen,
  onClose,
  src,
  alt = "Fullscreen Image",
  downloadName,
}: FullscreenViewerProps) {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset scale when closed
      setTimeout(() => setScale(1), 300);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.max(prev - 0.5, 0.5));
  };

  const resetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(1);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center select-none"
          onClick={() => {
            if (!isDragging) onClose();
          }}
        >
          {/* Controls */}
          <div
            className="absolute top-4 right-4 flex items-center gap-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex bg-white/10 rounded-lg backdrop-blur-md overflow-hidden mr-4">
              <button
                onClick={handleZoomOut}
                className="p-2.5 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
                disabled={scale <= 0.5}
                aria-label="Zoom out"
              >
                <ZoomOut size={20} />
              </button>
              <button
                onClick={resetZoom}
                className="px-3 text-white text-sm font-medium hover:bg-white/20 transition-colors border-x border-white/10"
                title="Reset zoom"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                className="p-2.5 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
                disabled={scale >= 4}
                aria-label="Zoom in"
              >
                <ZoomIn size={20} />
              </button>
            </div>

            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-md transition-colors"
              title="Open in new tab"
            >
              <ExternalLink size={20} />
            </a>

            {downloadName && (
              <a
                href={src}
                download={downloadName}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-md transition-colors"
                title="Download image"
              >
                <Download size={20} />
              </a>
            )}

            <button
              onClick={onClose}
              className="p-2.5 bg-white/10 hover:bg-red-500/80 text-white rounded-lg backdrop-blur-md transition-colors ml-2"
              aria-label="Close fullscreen"
            >
              <X size={20} />
            </button>
          </div>

          {/* Draggable Image */}
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <motion.img
              src={src}
              alt={alt}
              drag
              dragConstraints={{ top: -500, bottom: 500, left: -500, right: 500 }}
              dragElastic={0.1}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => {
                // Short timeout to prevent immediate click registration after drag ends
                setTimeout(() => setIsDragging(false), 100);
              }}
              animate={{ scale }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="max-w-[90vw] max-h-[90vh] object-contain cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
              draggable={false} // Prevent default browser drag
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
