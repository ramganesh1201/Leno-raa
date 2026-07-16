import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { products, type Product } from "@/lib/catalog";
import { SplitText } from "@/components/immersive/SplitText";
import { Magnetic } from "@/components/immersive/Magnetic";
import { useShop } from "@/lib/store";

// We curate a few products for the showcase
const signatureProduct = products.find((p) => p.slug === "orange")!;
const curatedProducts = products.filter((p) =>
  ["aloe-vera", "goat-milk", "lavender"].includes(p.slug),
);

function LuxuryProductCard({
  product,
  isSignature = false,
  index = 0,
}: {
  product: Product;
  isSignature?: boolean;
  index?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const toggleWishlist = useShop((s) => s.toggleWishlist);
  const saved = useShop((s) => s.wishlist.includes(product.slug));

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col ${isSignature ? "md:col-span-2 md:row-span-2" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-theme={product.collection}
    >
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block h-full w-full overflow-hidden rounded-[24px] bg-[color:var(--card)] p-6 md:p-10 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_color-mix(in_oklab,var(--theme)_40%,transparent)]"
        data-lux-hover
      >
        {/* Soft Background Glow on Hover */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-1000 group-hover:opacity-10"
          style={{
            background: "radial-gradient(circle at 50% 50%, var(--theme) 0%, transparent 80%)",
          }}
        />

        {/* Glass Overlay on Hover */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] opacity-0 transition-opacity duration-700 group-hover:opacity-100 z-10 pointer-events-none" />

        <div
          className={`relative z-20 flex h-full flex-col ${isSignature ? "md:flex-row md:items-center md:gap-16" : "gap-8"}`}
        >
          {/* Product Image Wrapper - Reduced size, lots of whitespace */}
          <div
            className={`relative flex items-center justify-center ${isSignature ? "w-full md:w-1/2 aspect-square" : "w-full aspect-[4/5]"} mx-auto p-8`}
          >
            {product.image ? (
              <motion.img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain filter drop-shadow-2xl"
                animate={{
                  scale: isHovered ? 1.15 : 1,
                  y: isHovered ? -15 : 0,
                }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
            ) : (
              <div className="soap-bar shimmer-sweep h-full w-full max-w-[70%]">
                <span className="soap-bar-shine" />
                <span className="soap-bar-glow" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className={`flex flex-col ${isSignature ? "w-full md:w-1/2" : "w-full"}`}>
            <div className="text-eyebrow mb-2 text-[color:var(--theme)]">{product.collection}</div>
            <h3
              className={`text-display ${isSignature ? "text-3xl md:text-4xl" : "text-3xl md:text-4xl"}`}
            >
              {product.name}
            </h3>
            <p className="mt-4 text-sm text-[color:var(--muted-foreground)] tracking-wide">
              {product.tagline}
            </p>

            {isSignature ? (
              <div className="mt-8 flex flex-col gap-3 transition-opacity duration-500 group-hover:opacity-0">
                <div className="flex items-center gap-4 text-sm text-[color:var(--foreground)]">
                  <span className="font-medium">₹{product.price}</span>
                  <span className="h-4 w-px bg-[color:var(--foreground)]/20" />
                  <span className="text-[color:var(--muted-foreground)]">{product.skinType}</span>
                </div>
                <div className="flex gap-2">
                  <span className="h-px w-8 bg-[color:var(--foreground)]/20 self-center" />
                  <span className="text-xs uppercase tracking-widest text-[color:var(--foreground)]/50">
                    {product.ingredients[0]}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-8 flex gap-2 transition-opacity duration-500 group-hover:opacity-0">
                <span className="h-px w-8 bg-[color:var(--foreground)]/20 self-center" />
                <span className="text-xs uppercase tracking-widest text-[color:var(--foreground)]/50">
                  {product.ingredients[0]}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* INTERACTIVE PREVIEW OVERLAY (Revealed on hover) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-30 flex flex-col justify-end p-8 md:p-12 pointer-events-none"
            >
              <div className="flex flex-col gap-6 w-full max-w-sm ml-auto bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[color:var(--theme)] mb-1">
                    Fragrance Notes
                  </div>
                  <div className="text-sm font-medium leading-relaxed">{product.notes}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-[color:var(--theme)] mb-1">
                    Key Ingredients
                  </div>
                  <div className="text-sm leading-relaxed text-[color:var(--foreground)]/80">
                    {product.ingredients.slice(0, 3).join(" · ")}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-[color:var(--theme)] mb-1">
                    Skin Benefits
                  </div>
                  <div className="text-sm leading-relaxed text-[color:var(--foreground)]/80">
                    {product.benefits[0]}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-[color:var(--theme)]">
                  Explore full ritual <span aria-hidden>→</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.slug);
          }}
          className="absolute top-6 right-6 z-40 grid h-10 w-10 place-items-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 transition-colors hover:bg-white hover:text-black"
          data-lux-hover
        >
          <span
            className={`text-xl ${saved ? "text-[color:var(--gold)]" : "text-[color:var(--foreground)]/40"}`}
          >
            {saved ? "♥" : "♡"}
          </span>
        </button>
      </Link>
    </motion.div>
  );
}

export function LuxuryCollectionShowcase() {
  return (
    <section className="relative py-40 overflow-hidden bg-[color:var(--background)]">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-24 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-eyebrow text-[color:var(--muted-foreground)] mb-6"
          >
            Curated Showcase
          </motion.div>
          <SplitText
            as="h2"
            text="The Artisanal Collection"
            className="text-display text-3xl md:text-4xl md:text-3xl md:text-4xl md:text-4xl md:text-3xl md:text-4xl lg:text-3xl md:text-4xl md:text-4xl md:text-3xl md:text-4xl tracking-tight"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-8 max-w-xl text-lg text-[color:var(--muted-foreground)] leading-relaxed"
          >
            A cinematic journey through our most requested formulations. Cold-processed, cured for
            weeks, and poured by hand.
          </motion.p>
        </div>

        {/* Asymmetric Masonry / Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          <LuxuryProductCard product={signatureProduct} isSignature={true} index={0} />

          <div className="md:col-span-1 flex flex-col gap-6 md:gap-10">
            {curatedProducts.slice(0, 2).map((product, i) => (
              <LuxuryProductCard key={product.slug} product={product} index={i + 1} />
            ))}
          </div>

          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-6 md:mt-0">
            {/* We can feature one more product in a wide format to complete the masonry look */}
            <div className="hidden md:block">
              {/* Decorative empty space or quote for editorial feel */}
              <div className="h-full flex flex-col justify-center p-12 border-l border-[color:var(--border)]">
                <div className="text-2xl text-display leading-snug text-[color:var(--foreground)]/60">
                  "A soap is a small thing. So is a morning. So is skin. We treat all three as
                  sacred."
                </div>
              </div>
            </div>
            <LuxuryProductCard product={curatedProducts[2]} index={3} />
          </div>
        </div>

        {/* Luxury CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-32 flex justify-center"
        >
          <Magnetic>
            <Link
              to="/collections/$slug"
              params={{ slug: "radiance" }}
              className="group relative inline-flex items-center gap-4 text-lg text-[color:var(--foreground)] transition-colors hover:text-[color:var(--theme,var(--gold))]"
            >
              <span className="uppercase tracking-[0.25em]">Discover the Collection</span>
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--border)] transition-all duration-500 group-hover:border-[color:var(--theme,var(--gold))] group-hover:bg-[color:var(--theme,var(--gold))]/10">
                <span className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </span>
              <span className="absolute -bottom-2 left-0 h-[1px] w-0 bg-[color:var(--theme,var(--gold))] transition-all duration-700 ease-out group-hover:w-full" />
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
