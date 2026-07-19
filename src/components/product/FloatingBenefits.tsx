import { motion } from "framer-motion";
import type { Product } from "@/lib/catalog";

interface FloatingBenefitsProps {
  product?: Product | null;
  benefits?: string[];
}

export function FloatingBenefits({ product, benefits: staticBenefits }: FloatingBenefitsProps) {
  // If static benefits are provided (like from LuxuryEditorialCollections), use them directly
  if (staticBenefits && Array.isArray(staticBenefits)) {
    if (staticBenefits.length === 0) return null;
    const positions = [
      "top-[20%] left-[12%] sm:top-[25%] sm:left-[18%]",
      "bottom-[25%] right-[10%] sm:bottom-[30%] sm:right-[15%]",
      "top-[50%] left-[10%] sm:top-[45%] sm:left-[12%]",
    ];
    return (
      <div className="absolute inset-0 pointer-events-none z-20">
        {staticBenefits.slice(0, 3).map((b: string, i: number) => (
          <motion.div
            key={b}
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: 1,
              y: [0, -4, 0], // Smooth idle floating
            }}
            transition={{
              opacity: { delay: 0.3 + i * 0.15, duration: 0.8 },
              y: {
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              },
            }}
            className={`absolute ${positions[i % positions.length]} ${
              i >= 3 ? "hidden sm:flex" : "flex"
            } pointer-events-auto items-center surface-glass rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-[9px] sm:text-xs font-medium uppercase tracking-[0.15em] text-[color:var(--foreground)] shadow-[0_8px_30px_rgba(0,0,0,0.1)] backdrop-blur-md border border-white/20 whitespace-nowrap transition-all duration-500 hover:brightness-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]`}
          >
            <span className="text-[color:var(--gold)] mr-1.5 sm:mr-2">✦</span> {b}
          </motion.div>
        ))}
      </div>
    );
  }

  if (!product) return null;

  // Generate a diverse list of badges based on product data
  const generateBadges = (): string[] => {
    const badges = new Set<string>();

    // Core qualities
    badges.add("Handmade");
    badges.add("100% Natural");
    badges.add("Cruelty Free");

    // Dynamic Product data
    if (product?.skinType) badges.add(product.skinType);

    // Add up to 2 benefits
    if (product?.benefits && Array.isArray(product.benefits) && product.benefits.length > 0) {
      product.benefits.slice(0, 2).forEach((b) => {
        if (b) badges.add(b);
      });
    }

    // Add up to 2 key ingredients
    if (
      product?.ingredients &&
      Array.isArray(product.ingredients) &&
      product.ingredients.length > 0
    ) {
      product.ingredients.slice(0, 2).forEach((i) => {
        if (i) badges.add(i);
      });
    }

    return Array.from(badges).slice(0, 3); // Keep it to 3 floating badges
  };

  const badges = generateBadges();

  if (badges.length === 0) return null;

  // Predefined safe coordinates that slightly overlap the product image edges 
  // instead of floating in the far corners.
  const positions = [
    "top-[20%] left-[12%] sm:top-[25%] sm:left-[18%]",
    "bottom-[25%] right-[10%] sm:bottom-[30%] sm:right-[15%]",
    "top-[50%] left-[10%] sm:top-[45%] sm:left-[12%]",
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {badges.map((b: string, i: number) => (
        <motion.div
          key={b}
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: 1,
            y: [0, -4, 0], // Smooth idle floating
          }}
          transition={{
            opacity: { delay: 0.3 + i * 0.15, duration: 0.8 },
            y: {
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            },
          }}
          className={`absolute ${positions[i % positions.length]} ${
            i >= 3 ? "hidden sm:flex" : "flex"
          } pointer-events-auto items-center surface-glass rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-[9px] sm:text-xs font-medium uppercase tracking-[0.15em] text-[color:var(--foreground)] shadow-[0_8px_30px_rgba(0,0,0,0.1)] backdrop-blur-md border border-white/20 whitespace-nowrap transition-all duration-500 hover:brightness-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]`}
        >
          <span className="text-[color:var(--gold)] mr-1.5 sm:mr-2">✦</span> {b}
        </motion.div>
      ))}
    </div>
  );
}
