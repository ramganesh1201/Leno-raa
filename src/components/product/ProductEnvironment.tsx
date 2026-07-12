import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Product } from "@/lib/catalog";

interface ProductEnvironmentProps {
  product: Product;
  collectionImage: string;
  children: ReactNode;
}

export function ProductEnvironment({ product, collectionImage, children }: ProductEnvironmentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative min-h-screen"
      style={{
        // Override the global accent color with this product's specific accent
        "--gold": product.accentColor,
        // Optional: define a local dynamic accent if needed by specific components
        "--dynamic-accent": product.accentColor,
      } as React.CSSProperties}
    >
      {/* Dynamic Background Image & Tints */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Base Environment Image */}
        <motion.img
          key={collectionImage}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={collectionImage}
          alt=""
          aria-hidden
          className="h-full w-full object-cover blur-2xl"
        />
        
        {/* Product-Specific Base Tint */}
        <div 
          className="absolute inset-0 mix-blend-multiply transition-colors duration-1000"
          style={{ backgroundColor: product.bgTint }}
        />
        
        {/* Soft lighting shift overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[color:var(--background)]/40 via-transparent to-[color:var(--background)]/80 transition-colors duration-1000"
        />

        {/* Dynamic Glow radiating from the center */}
        <div 
          className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 h-[80vh] w-[80vw] rounded-full blur-[120px] opacity-20 transition-colors duration-1000"
          style={{ background: `radial-gradient(circle, ${product.accentColor}, transparent 70%)` }}
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
