import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  benefits?: React.ReactNode;
}

function GalleryImage({ src, alt, isHero, benefits }: { src: string, alt: string, isHero: boolean, benefits?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track this specific element's position in the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Cinematic interpolations
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const blur = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]);
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, filter: blur }}
      className="relative w-full h-[75vh] min-h-[500px] max-h-[900px] overflow-hidden rounded-[24px] bg-[color:var(--muted)]/20 shadow-xl mb-12 last:mb-0"
    >
      <motion.img
        style={{ scale, y }}
        src={src}
        alt={alt}
        className="absolute -top-[10%] left-0 h-[120%] w-full object-cover origin-center"
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
    <div className="flex flex-col w-full">
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
