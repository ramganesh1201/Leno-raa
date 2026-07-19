import { createFileRoute, Link } from "@tanstack/react-router";
import { useShop } from "@/lib/store";
import { productService } from "@/services/product.service";
import { motion } from "framer-motion";
import { resolveImageUrl } from "@/lib/imageResolver";
import { Clock, ShoppingBag, EyeOff, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/account/recently-viewed")({
  loader: async () => {
    const products = await productService.getProducts();
    return { products };
  },
  component: RecentlyViewed,
});

function RecentlyViewed() {
  const { products } = Route.useLoaderData();
  const recent = useShop((s) => s.recentlyViewed);
  const items = recent
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p);

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-glass rounded-[24px] p-16 text-center border border-[color:var(--border)] shadow-sm max-w-2xl mx-auto mt-12"
      >
        <div className="w-24 h-24 mx-auto mb-6 text-[color:var(--border)] opacity-50 flex items-center justify-center rounded-full border border-[color:var(--border)] shadow-inner">
          <EyeOff size={32} strokeWidth={1} />
        </div>
        <h2 className="text-display text-2xl mb-3">Explore our collections.</h2>
        <p className="text-[color:var(--muted-foreground)] mb-8">
          Your browsing history will appear here.
        </p>
        <Link
          to="/collections/$slug"
          params={{ slug: "radiance" }}
          className="btn-lux inline-flex justify-center"
        >
          Start Browsing
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="text-eyebrow text-[color:var(--muted-foreground)] mb-2">History</div>
          <h1 className="text-display text-3xl">Recently Viewed</h1>
        </div>
        <Link
          to="/collections/$slug"
          params={{ slug: "radiance" }}
          className="btn-ghost-lux hidden sm:inline-flex items-center gap-2"
        >
          Continue Shopping <ArrowRight size={14} />
        </Link>
      </div>

      <div className="relative -mx-6 px-6 md:mx-0 md:px-0">
        <div
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 scrollbar-hide"
          style={{ scrollPaddingLeft: "1.5rem", scrollPaddingRight: "1.5rem" }}
        >
          {items.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="snap-start shrink-0 w-[280px] md:w-[320px] flex flex-col group"
            >
              <Link
                to="/products/$slug"
                params={{ slug: p.slug }}
                className="block relative aspect-[4/5] rounded-[24px] overflow-hidden bg-black/5 dark:bg-white/5 shadow-sm border border-[color:var(--border)] group-hover:border-[color:var(--gold)]/30 transition-all duration-500"
              >
                {p.image ? (
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
                    src={resolveImageUrl(p.image)}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[color:var(--muted-foreground)]">
                    No Image
                  </div>
                )}

                <div className="absolute top-4 left-4 bg-[color:var(--background)]/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                  <Clock size={10} />{" "}
                  {i === 0 ? "Just now" : i === 1 ? "Earlier today" : "Previously"}
                </div>
              </Link>

              <div className="mt-6 flex flex-col items-center text-center">
                <div className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">
                  {p.collection || "Radiance"}
                </div>
                <Link
                  to="/products/$slug"
                  params={{ slug: p.slug }}
                  className="text-lg font-medium text-[color:var(--foreground)] hover:text-[color:var(--gold)] transition-colors"
                >
                  {p.name}
                </Link>
                <div className="text-sm font-medium mt-2">
                  ₹{new Intl.NumberFormat("en-IN").format(p.price)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Continue Shopping */}
      <div className="sm:hidden flex justify-center pb-8">
        <Link
          to="/collections/$slug"
          params={{ slug: "radiance" }}
          className="btn-lux w-full justify-center shadow-lg"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
