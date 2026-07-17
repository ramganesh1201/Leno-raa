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
      className="relative w-full h-[60vh] md:h-[75vh] min-h-[400px] md:min-h-[500px] max-h-[900px] overflow-hidden rounded-[16px] md:rounded-[24px] min-w-[85vw] md:min-w-0 snap-center md:snap-align-none shrink-0 bg-[color:var(--muted)]/20 shadow-xl mb-0 md:mb-12 mr-4 md:mr-0 last:mr-0 md:last:mr-0 md:last:mb-0 flex items-center justify-center"
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
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        className={`absolute -top-[10%] left-0 h-[120%] w-full object-cover origin-center transition-opacity duration-700 ${loaded && !error ? "opacity-100" : "opacity-0"}`}
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
  // If the product has few images, we might want to duplicate them or rely on the storytelling sequence
  // But for now, we just map over whatever images are provided.
  return (
    <div className="flex flex-row md:flex-col w-full overflow-x-auto md:overflow-x-visible snap-x md:snap-none snap-mandatory md:snap-normal custom-scrollbar pb-4 md:pb-0">
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
  );
}
