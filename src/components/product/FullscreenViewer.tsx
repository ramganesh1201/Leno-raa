import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface FullscreenViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export function FullscreenViewer({ images, initialIndex, onClose }: FullscreenViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setScale(1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setScale(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
    >
      {/* Top Bar */}
      <div className="absolute top-0 flex w-full justify-between p-6 z-10">
        <div className="text-sm tracking-widest text-white/50 uppercase">
          {currentIndex + 1} / {images.length}
        </div>
        <button
          onClick={onClose}
          className="rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20 hover:scale-105"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-6 z-10 rounded-full bg-white/5 p-4 text-white backdrop-blur-md transition hover:bg-white/10 hover:scale-105 md:left-12"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 z-10 rounded-full bg-white/5 p-4 text-white backdrop-blur-md transition hover:bg-white/10 hover:scale-105 md:right-12"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Image Area */}
      <div 
        className="relative h-full w-full overflow-hidden flex items-center justify-center cursor-zoom-in"
        onClick={() => setScale(scale === 1 ? 1.5 : 1)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`View ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: scale }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            drag={scale > 1}
            dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
            className="max-h-[90vh] max-w-[90vw] object-contain transition-transform"
          />
        </AnimatePresence>
      </div>
      
      {/* Hint */}
      {scale === 1 && (
        <div className="absolute bottom-10 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-white/70 backdrop-blur-md">
          <ZoomIn className="h-3 w-3" /> Click to zoom
        </div>
      )}
    </motion.div>
  );
}
