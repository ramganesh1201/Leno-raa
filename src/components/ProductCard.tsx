import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useRef } from "react";
import type { Product } from "@/lib/catalog";
import { resolveImageUrl } from "@/lib/imageResolver";
import { useShop } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { user } = useAuth();
  const { wishlist: supabaseWishlist, toggleWishlist: toggleSupabaseWishlist } = useWishlist();

  const localToggleWishlist = useShop((s) => s.toggleWishlist);
  const localSaved = useShop((s) => s.wishlist.includes(product.slug));

  const saved = user ? supabaseWishlist.some((w) => w.product_id === product.id) : localSaved;

  const tiltRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    // Subtle luxury tilt — no exaggerated motion.
    el.style.transform = `perspective(1200px) rotateX(${-y * 4}deg) rotateY(${x * 5}deg) scale(1.01)`;
    el.style.setProperty("--shine-x", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--shine-y", `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => {
    const el = tiltRef.current;
    if (el) el.style.transform = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.1, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
      data-theme={product.collection}
    >
      <Link to="/products/$slug" params={{ slug: product.slug }} className="block" data-lux-hover>
        <div
          className="soap-bar-wrap aspect-[4/3] relative"
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          <div
            ref={tiltRef}
            className="card-tilt relative h-full w-full overflow-hidden rounded-[18px]"
            style={{
              background: product.image
                ? "color-mix(in oklab, var(--ivory) 92%, var(--theme-soft))"
                : undefined,
              boxShadow:
                "0 40px 80px -30px color-mix(in oklab, var(--theme-deep) 40%, transparent)",
            }}
          >
            {product.image ? (
              <>
                <img
                  src={resolveImageUrl(product.image)}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.03]"
                />
                <span className="soap-bar-glow" />
              </>
            ) : (
              <div className="soap-bar shimmer-sweep h-full w-full">
                <span className="soap-bar-shine" />
                <span className="soap-bar-glow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-display text-2xl uppercase tracking-[0.4em] text-white/40 mix-blend-overlay">
                    Lenoraa
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (user) {
                toggleSupabaseWishlist.mutate(product.id);
              } else {
                localToggleWishlist(product.slug);
              }
            }}
            disabled={toggleSupabaseWishlist.isPending}
            aria-label="Save"
            className="absolute top-4 right-4 z-10 grid h-9 w-9 max-md:h-12 max-md:w-12 place-items-center rounded-full bg-white/70 backdrop-blur transition hover:bg-white disabled:opacity-50 disabled:hover:bg-white/70"
            data-lux-hover
          >
            <span
              className={`text-lg ${saved ? "text-[color:var(--gold)]" : "text-[color:var(--charcoal)]/40"}`}
            >
              {saved ? "♥" : "♡"}
            </span>
          </button>
        </div>
        <div className="mt-6 flex items-baseline justify-between">
          <div>
            <div className="text-display text-2xl">{product.name || "Product Name"}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
              {product.tagline || "Collection Chapter"}
            </div>
          </div>
          <div className="text-sm tracking-widest text-[color:var(--foreground)]/70">
            ₹{product.price || "---"}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
