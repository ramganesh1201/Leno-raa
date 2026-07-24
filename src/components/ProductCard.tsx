import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useRef, memo } from "react";
import type { Product } from "@/lib/catalog";
import { resolveImageUrl } from "@/lib/imageResolver";
import { useShop } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { Star } from "lucide-react";

function getSkinType(productName: string): string | null {
  if (!productName) return null;
  const name = productName.toLowerCase();
  if (name.includes("menthol")) return "Combination / Oily";
  if (name.includes("orange")) return "Combination / Oily";
  if (name.includes("goat milk")) return "All Skin Types";
  if (name.includes("lavender")) return "Dry / Sensitive";
  if (name.includes("aloe vera")) return "Dry / Sensitive";
  if (name.includes("tomato")) return "Normal / Combination / Sensitive";
  if (name.includes("manjichandan")) return "All Skin Types";
  if (name.includes("charcoal")) return "Oily / Acne Prone";
  if (name.includes("nalpa glow")) return "Dry / Normal";
  if (name.includes("ayurvedic herbal")) return "Sensitive / Oily";
  if (name.includes("rose blossom")) return "All Skin Types";
  if (name.includes("golden oats")) return "Ultra Sensitive / Kids";
  if (name.includes("butter with milk")) return "Ultra Sensitive / Kids";
  if (name.includes("coffee latte")) return "Oily / Acne Prone";
  return null;
}

function SkinTypeBadge({ type }: { type: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-md shadow-sm border border-white/40 px-3 py-1.5 rounded-full flex items-center justify-center pointer-events-none">
      <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium text-[color:var(--foreground)]/80 leading-none pt-px">
        {type}
      </span>
    </div>
  );
}

export const ProductCard = memo(function ProductCard({
  product,
  index = 0,
  rating,
  reviewCount,
}: {
  product: Product;
  index?: number;
  rating?: number;
  reviewCount?: number;
}) {
  const { user } = useAuth();
  const { wishlist: supabaseWishlist, toggleWishlist: toggleSupabaseWishlist } = useWishlist();

  const localToggleWishlist = useShop((s) => s.toggleWishlist);
  const localSaved = useShop((s) => s.wishlist.includes(product.slug));

  const saved = user ? supabaseWishlist.some((w) => w.product_id === product.id) : localSaved;

  const skinType = getSkinType(product.name);

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
      {/* MOBILE LAYOUT */}
      <Link to="/products/$slug" params={{ slug: product.slug }} className="block md:hidden">
        <div
          className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-md"
          style={{
            background: product.image
              ? "color-mix(in oklab, var(--ivory) 92%, var(--theme-soft))"
              : "var(--ivory)",
          }}
        >
          {product.image ? (
            <img
              src={resolveImageUrl(product.image)}
              alt={`Lenoraa ${product.name} Handcrafted Soap for ${skinType || "All Skin Types"}`}
              loading="lazy"
              decoding="async"
              width={400}
              height={500}
              className="h-full w-full object-cover transition-transform duration-500 active:scale-[0.98]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-display text-lg uppercase tracking-[0.3em] text-[color:var(--foreground)]/20">
                Lenoraa
              </span>
            </div>
          )}

          {/* Skin Type Badge */}
          {skinType && (
            <div className="absolute top-3 left-3 z-10">
              <SkinTypeBadge type={skinType} />
            </div>
          )}

          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (user) {
                toggleSupabaseWishlist.mutate(product.id);
              } else {
                localToggleWishlist(product.slug);
              }
            }}
            aria-label="Save"
            className="absolute top-3 right-3 z-10 grid h-[44px] w-[44px] place-items-center rounded-full bg-white/80 backdrop-blur-md shadow-sm active:scale-95 transition-transform cursor-pointer"
          >
            <span
              className={`text-xl leading-none pt-0.5 ${saved ? "text-[color:var(--gold)]" : "text-[color:var(--charcoal)]/40"}`}
            >
              {saved ? "♥" : "♡"}
            </span>
          </div>
        </div>

        <div className="mt-4 px-1 flex flex-col items-center text-center">
          <div className="text-display text-[22px] leading-tight text-[color:var(--foreground)]">
            {product.name || "Product Name"}
          </div>
          {reviewCount && reviewCount > 0 ? (
            <div className="mt-1.5 flex items-center justify-center gap-1">
              <Star className="w-3 h-3 fill-[color:var(--foreground)] text-[color:var(--foreground)]" />
              <span className="text-[10px] font-medium tracking-wide text-[color:var(--foreground)]">
                {rating} ({reviewCount})
              </span>
            </div>
          ) : (
            <div className="mt-1.5 text-[10px] uppercase tracking-[0.25em] text-[color:var(--muted-foreground)]">
              New
            </div>
          )}
          <div className="mt-1.5 text-[10px] uppercase tracking-[0.25em] text-[color:var(--muted-foreground)]">
            {product.tagline || "Collection Chapter"}
          </div>
          <div className="mt-2 text-[14px] tracking-widest text-[color:var(--foreground)]/90 font-medium">
            ₹{product.price ? new Intl.NumberFormat("en-IN").format(product.price) : "---"}
          </div>
        </div>
      </Link>

      {/* DESKTOP LAYOUT */}
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="hidden md:block"
        data-lux-hover
      >
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
                  alt={`Lenoraa ${product.name} Handcrafted Soap for ${skinType || "All Skin Types"}`}
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={500}
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

          {/* Skin Type Badge */}
          {skinType && (
            <div className="absolute top-4 left-4 z-10">
              <SkinTypeBadge type={skinType} />
            </div>
          )}

          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (user) {
                toggleSupabaseWishlist.mutate(product.id);
              } else {
                localToggleWishlist(product.slug);
              }
            }}
            aria-label="Save"
            className="absolute top-4 right-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/70 backdrop-blur transition hover:bg-white cursor-pointer"
            data-lux-hover
          >
            <span
              className={`text-lg ${saved ? "text-[color:var(--gold)]" : "text-[color:var(--charcoal)]/40"}`}
            >
              {saved ? "♥" : "♡"}
            </span>
          </div>
        </div>
        <div className="mt-6 flex items-baseline justify-between">
          <div>
            <div className="text-display text-2xl">{product.name || "Product Name"}</div>
            {reviewCount && reviewCount > 0 ? (
              <div className="mt-1.5 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-[color:var(--foreground)] text-[color:var(--foreground)]" />
                <span className="text-xs font-medium tracking-wide text-[color:var(--foreground)]">
                  {rating} <span className="text-[color:var(--muted-foreground)] ml-0.5">({reviewCount})</span>
                </span>
              </div>
            ) : (
              <div className="mt-1.5 text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                New
              </div>
            )}
            <div className="mt-1.5 text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
              {product.tagline || "Collection Chapter"}
            </div>
          </div>
          <div className="text-sm tracking-widest text-[color:var(--foreground)]/70">
            ₹{product.price ? new Intl.NumberFormat("en-IN").format(product.price) : "---"}
          </div>
        </div>
      </Link>
    </motion.div>
  );
});
