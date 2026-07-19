import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { resolveImageUrl } from "@/lib/imageResolver";
import { X, ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  benefits?: React.ReactNode;
}

export function ProductGallery({ images, productName, benefits }: ProductGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Handle keyboard in fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
      if (e.key === "ArrowLeft") scrollTo(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
      if (e.key === "ArrowRight") scrollTo(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, selectedIndex, images.length, scrollTo]);

  // Lock body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  return (
    <div className="relative w-full flex flex-col gap-4">
      {/* Main Carousel */}
      <div className="relative rounded-[24px] overflow-hidden bg-[color:var(--muted)]/20 shadow-xl border border-[color:var(--border)] group">
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative flex-[0_0_100%] min-w-0 aspect-[4/5] w-full flex items-center justify-center p-4 md:p-8"
                onClick={() => setIsFullscreen(true)}
              >
                <div className="relative w-full h-full">
                  <GalleryImage src={img} alt={`${productName} view ${idx + 1}`} isHero={idx === 0} />
                </div>
                
                {/* Floating Benefits overlay on the hero image */}
                {idx === 0 && benefits}
              </div>
            ))}
          </div>
        </div>

        {/* Zoom Hint */}
        <button 
          onClick={() => setIsFullscreen(true)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[color:var(--background)]/80 backdrop-blur border border-[color:var(--border)] flex items-center justify-center text-[color:var(--foreground)] opacity-0 group-hover:opacity-100 transition-opacity z-10"
          aria-label="View Fullscreen"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x px-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`relative flex-[0_0_80px] h-[100px] rounded-xl overflow-hidden border-2 transition-all snap-start bg-[color:var(--muted)]/20 ${
                idx === selectedIndex ? "border-[color:var(--gold)] opacity-100" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <GalleryImage src={img} alt={`Thumbnail ${idx + 1}`} isHero={false} isThumbnail={true} />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal (Rendered at top level via Portal) */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col"
              onClick={() => setIsFullscreen(false)}
            >
              {/* Top Controls */}
              <div className="absolute top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-start z-[10000] pointer-events-none safe-top">
                <div className="text-white/80 text-sm font-medium tracking-widest uppercase mt-3">
                  {selectedIndex + 1} / {images.length}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreen(false);
                  }}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors pointer-events-auto shadow-lg backdrop-blur-md"
                  aria-label="Close fullscreen"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Main Image Area */}
              <div className="flex-1 w-full h-full flex items-center justify-center p-4 md:p-12 overflow-hidden pointer-events-none">
                <div 
                  className="w-full h-full flex items-center justify-center relative pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GalleryImage 
                    src={images[selectedIndex]} 
                    alt={productName} 
                    isHero={true} 
                    isFullscreen={true} 
                  />
                </div>
              </div>
              
              {/* Fullscreen Thumbnails */}
              {images.length > 1 && (
                <div 
                  className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 px-4 z-[10000] safe-bottom"
                  onClick={(e) => e.stopPropagation()}
                >
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollTo(idx);
                      }}
                      className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all bg-white/5 ${
                        idx === selectedIndex ? "border-white opacity-100 scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "border-transparent opacity-40 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <GalleryImage src={img} alt={`Thumbnail ${idx + 1}`} isHero={false} isThumbnail={true} />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

function GalleryImage({
  src,
  alt,
  isHero,
  isThumbnail = false,
  isFullscreen = false,
}: {
  src: string;
  alt: string;
  isHero: boolean;
  isThumbnail?: boolean;
  isFullscreen?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const resolvedSrc = resolveImageUrl(src) || src;

  return (
    <>
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-[color:var(--muted)]/50 animate-pulse" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--muted)]/20">
          <span className="text-[color:var(--muted-foreground)] text-xs">Image unavailable</span>
        </div>
      )}

      <img
        src={resolvedSrc}
        alt={alt}
        loading={isHero ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={isHero ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${loaded && !error ? "opacity-100" : "opacity-0"} ${
          isThumbnail ? "object-cover" : isFullscreen ? "object-contain" : "object-contain"
        } ${isFullscreen ? "cursor-zoom-in active:cursor-zoom-out" : ""}`}
      />
    </>
  );
}
