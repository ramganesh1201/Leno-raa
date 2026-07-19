import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { resolveImageUrl } from "@/lib/imageResolver";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  benefits?: React.ReactNode;
}

function GalleryImage({
  src,
  alt,
  isHero,
  benefits,
}: {
  src: string;
  alt: string;
  isHero: boolean;
  benefits?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const resolvedSrc = resolveImageUrl(src) || src;

  // Track this specific element's position in the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Cinematic interpolations
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const blur = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"],
  );
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, filter: blur }}
      className="relative w-full h-[70svh] md:h-[75vh] min-h-[400px] md:min-h-[500px] max-h-[900px] overflow-hidden rounded-none md:rounded-[24px] min-w-full md:min-w-0 snap-center md:snap-align-none shrink-0 bg-[color:var(--muted)]/20 shadow-xl mb-0 md:mb-12 flex items-center justify-center"
    >
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--background)]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--gold)]/20 border-t-[color:var(--gold)]" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--background)]">
          <span className="text-[color:var(--muted-foreground)]">Image not available</span>
        </div>
      )}

      <motion.img
        style={{ scale, y }}
        src={resolvedSrc}
        alt={alt}
        loading={isHero ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={isHero ? "high" : "auto"}
        width={800}
        height={1000}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        className={`absolute inset-0 h-full w-full object-cover origin-center transition-opacity duration-700 ${loaded && !error ? "opacity-100" : "opacity-0"}`}
      />

      {/* Subtle premium inner glow/shadow */}
      <div className="pointer-events-none absolute inset-0 rounded-[24px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] opacity-60 mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />

      {/* Floating Benefits overlay on the hero image */}
      {isHero && benefits}
    </motion.div>
  );
}

export function ProductGallery({ images, productName, benefits }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const scrollLeft = containerRef.current.scrollLeft;
    setActiveIndex(Math.round(scrollLeft / width));
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex flex-row md:flex-col w-full overflow-x-auto md:overflow-x-visible snap-x md:snap-none snap-mandatory md:snap-normal scrollbar-hide"
      >
        {images.map((img, idx) => (
          <GalleryImage
            key={`${img}-${idx}`}
            src={img}
            alt={`${productName} view ${idx + 1}`}
            isHero={idx === 0}
            benefits={idx === 0 ? benefits : undefined}
          />
        ))}
      </div>

      {/* Mobile Image Counter & Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:hidden flex-col items-center mt-4 mb-2 gap-4 px-6">
          <div className="bg-[color:var(--foreground)]/10 backdrop-blur-md px-3 py-1 rounded-full text-xs tracking-widest text-[color:var(--foreground)]/80 font-medium absolute bottom-20">
            {activeIndex + 1} / {images.length}
          </div>
          <div className="flex gap-2 justify-center">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (!containerRef.current) return;
                  containerRef.current.scrollTo({
                    left: containerRef.current.clientWidth * idx,
                    behavior: "smooth",
                  });
                }}
                className={`w-2 h-2 rounded-full transition-all ${idx === activeIndex ? "bg-[color:var(--gold)] w-6" : "bg-[color:var(--border)]"}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
