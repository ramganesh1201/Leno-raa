import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { useShop, useTheme } from "@/lib/store";
import { productService } from "@/services/product.service";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { resolveImageUrl } from "@/lib/imageResolver";
import {
  Heart,
  ShoppingBag,
  Sparkles,
  X,
  HeartCrack,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { AccountShell } from "@/routes/account";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Saved — Lenoraa" },
      { name: "description", content: "Bars you've saved for later." },
    ],
  }),
  loader: async () => {
    const products = await productService.getProducts();
    return { products };
  },
  component: Wishlist,
});

function WishlistCard({ product, onRemove }: { product: any; onRemove: () => void }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const addLocalCart = useShop((s) => s.addToCart);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      if (user) {
        await addToCart.mutateAsync({ product_id: product.id, quantity: 1, price: product.price });
      } else {
        addLocalCart({ product, quantity: 1, price: product.price });
      }
      toast.success("Added to your bag");
    } catch (e) {
      toast.error("Failed to add to bag");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      className="group surface-glass rounded-[24px] border border-[color:var(--border)] overflow-hidden shadow-sm hover:border-[color:var(--gold)]/30 hover:shadow-md transition-all duration-500 relative flex flex-col h-full"
    >
      <button
        onClick={onRemove}
        className="absolute top-4 right-4 z-20 w-8 h-8 bg-[color:var(--background)]/80 backdrop-blur-md rounded-full flex items-center justify-center text-[color:var(--muted-foreground)] hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
      >
        <X size={14} />
      </button>

      <div className="relative aspect-[4/5] bg-black/5 dark:bg-white/5 overflow-hidden">
        {(() => {
          const itemImage =
            product.image ||
            product.image_url ||
            product.cover_image ||
            product.images?.[0] ||
            product.ui_metadata?.image;
          return itemImage ? (
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
              src={resolveImageUrl(itemImage)}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[color:var(--muted-foreground)]">
              No Image
            </div>
          );
        })()}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1 bg-[color:var(--foreground)] text-[color:var(--background)] py-3 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-[color:var(--gold)] transition-colors flex items-center justify-center gap-2 shadow-xl"
          >
            {isAdding ? (
              "Adding..."
            ) : (
              <>
                <ShoppingBag size={14} /> Quick Add
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-black/5 dark:to-white/5">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-1">
                {product.collection || "Radiance"}
              </div>
              <Link
                to="/products/$slug"
                params={{ slug: product.slug }}
                className="text-lg font-medium text-[color:var(--foreground)] hover:text-[color:var(--gold)] transition-colors"
              >
                {product.name}
              </Link>
            </div>
            <div className="text-sm font-medium">₹{product.price}</div>
          </div>
          <p className="text-sm text-[color:var(--muted-foreground)] line-clamp-2 mt-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <Link
          to="/customize"
          search={{ base: product.slug }}
          className="mt-6 flex items-center gap-2 text-xs uppercase tracking-widest text-[color:var(--gold)] hover:text-[color:var(--foreground)] transition-colors font-medium w-max"
        >
          <Sparkles size={14} /> Customize
        </Link>
      </div>
    </motion.div>
  );
}

type SortOption = "newest" | "oldest" | "price-asc" | "price-desc" | "collection";

function Wishlist() {
  const { user } = useAuth();
  const { wishlist: supabaseWishlist, toggleWishlist } = useWishlist();
  const localWishlist = useShop((s) => s.wishlist);
  const toggleLocalWishlist = useShop((s) => s.toggleWishlist);
  const setTheme = useTheme((s) => s.setTheme);
  const { products } = Route.useLoaderData();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  useEffect(() => setTheme("default"), [setTheme]);

  const baseItems = user
    ? supabaseWishlist
        .map((w) => w.product || products.find((p) => p.id === (w as any).product_id))
        .filter((p): p is NonNullable<typeof p> => !!p)
    : localWishlist
        .map((slug) => products.find((p) => p.slug === slug))
        .filter((p): p is NonNullable<typeof p> => !!p);

  const filteredAndSortedItems = useMemo(() => {
    let result = [...baseItems];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.collection && p.collection.toLowerCase().includes(q)),
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "collection":
        result.sort((a, b) => (a.collection || "").localeCompare(b.collection || ""));
        break;
      case "oldest":
        result.reverse();
        break;
      case "newest":
      default:
        // Already in newest-first order typically, but we'll leave as is
        break;
    }

    return result;
  }, [baseItems, searchQuery, sortBy]);

  const handleRemove = (product: any) => {
    if (user) {
      toggleWishlist.mutate(product.id);
    } else {
      toggleLocalWishlist(product.slug);
    }
  };

  return (
    <AccountShell requireAuth={false}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-6">
          <div>
            <div className="text-eyebrow text-[color:var(--muted-foreground)] mb-2 uppercase tracking-widest text-xs">
              Atelier
            </div>
            <h1 className="text-display text-3xl">Saved Rituals</h1>
            <div className="text-sm text-[color:var(--muted-foreground)] mt-2 font-medium">
              {baseItems.length} Saved {baseItems.length === 1 ? "Soap" : "Soaps"}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {baseItems.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="surface-glass rounded-[24px] p-16 text-center border border-[color:var(--border)] shadow-sm w-full mt-12"
            >
              <div className="w-24 h-24 mx-auto mb-6 text-[color:var(--border)] opacity-50 flex items-center justify-center rounded-full border border-[color:var(--border)] shadow-inner">
                <Heart size={32} strokeWidth={1} className="text-red-500/50" />
              </div>
              <h2 className="text-display text-2xl mb-3">
                You haven't discovered your ritual yet.
              </h2>
              <p className="text-[color:var(--muted-foreground)] mb-10 max-w-md mx-auto">
                Explore our handcrafted collection and save your favourite soaps.
              </p>
              <Link
                to="/collections/$slug"
                params={{ slug: "radiance" }}
                className="btn-lux inline-flex justify-center shadow-lg"
              >
                Browse Collection
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Top Summary & Filters */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-[color:var(--border)]">
                <div className="flex items-center gap-2 text-sm text-[color:var(--muted-foreground)]">
                  <span className="w-2 h-2 rounded-full bg-[color:var(--gold)]"></span>
                  Last saved:{" "}
                  <span className="font-medium text-[color:var(--foreground)]">
                    {baseItems[0]?.name || "Recently"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)]"
                    />
                    <input
                      type="text"
                      placeholder="Search wishlist..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 bg-[color:var(--background)] border border-[color:var(--border)] pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-[color:var(--gold)] outline-none transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <SlidersHorizontal
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)]"
                    />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="w-full sm:w-auto bg-[color:var(--background)] border border-[color:var(--border)] pl-10 pr-8 py-2.5 rounded-xl text-sm focus:border-[color:var(--gold)] outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="price-asc">Price (Low to High)</option>
                      <option value="price-desc">Price (High to Low)</option>
                      <option value="collection">Collection</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[color:var(--muted-foreground)]">
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L5 5L9 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {filteredAndSortedItems.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-[color:var(--muted-foreground)]">
                    No rituals match your search.
                  </p>
                </div>
              ) : (
                <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence>
                    {filteredAndSortedItems.map((p) => (
                      <WishlistCard key={p.slug} product={p} onRemove={() => handleRemove(p)} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AccountShell>
  );
}
