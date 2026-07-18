import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import type { Product } from "@/lib/catalog";
import { getRecommendations, type RecommendationResult } from "@/lib/recommendations";
import { ProductCard } from "@/components/ProductCard";
import { SplitText } from "@/components/immersive/SplitText";
import { Reveal } from "@/components/immersive/Reveal";
import { RecommendationReason } from "./RecommendationReason";

interface ProductRecommendationsProps {
  currentProduct: Product;
}

export function ProductRecommendations({ currentProduct }: ProductRecommendationsProps) {
  const { data: allProducts = [] } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => productService.getProducts(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);

  useEffect(() => {
    if (allProducts.length > 0) {
      setRecommendations(getRecommendations(currentProduct, allProducts));
    }
  }, [allProducts, currentProduct]);

  if (recommendations.length === 0) return null;

  return (
    <section className="relative py-12 md:py-32 border-t border-[color:var(--border)]/50 bg-[color:var(--background)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 md:mb-16"
        >
          <Reveal preset="label" className="text-eyebrow text-[color:var(--gold)] mb-2 md:mb-4">
            Recommended for Similar Skin Concerns
          </Reveal>
          <SplitText
            as="h2"
            text="You May Also Like"
            className="text-display text-4xl leading-tight"
          />
        </motion.div>

        {/* Desktop: 4 col grid, Tablet: 2 col grid, Mobile: horizontal scroll */}
        <div className="flex md:grid overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-6 md:mx-0 px-6 md:px-0 snap-x snap-mandatory md:snap-none hide-scrollbar gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {recommendations.map((result, index) => (
            <motion.div
              key={result.product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="w-[68vw] min-w-[200px] max-w-[240px] md:w-auto md:min-w-0 md:max-w-none flex-shrink-0 snap-start flex flex-col"
            >
              <ProductCard product={result.product} index={index} />
              <RecommendationReason result={result} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
