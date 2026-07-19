import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { useShop, useTheme } from "@/lib/store";
import { productService } from "@/services/product.service";
import { resolveImageUrl } from "@/lib/imageResolver";
import { SplitText } from "@/components/immersive/SplitText";
import { Reveal } from "@/components/immersive/Reveal";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, Heart, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Lenoraa" },
      { name: "description", content: "Review your selected Lenoraa handcrafted soaps." },
    ],
  }),
  loader: async () => {
    const products = await productService.getProducts();
    return { products };
  },
  component: CartPage,
});

function ImageLoader({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full bg-black/5 dark:bg-white/5 overflow-hidden">
      {!loaded && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-black/10 dark:bg-white/10"
        />
      )}
      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        onLoad={() => setLoaded(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function CartPage() {
  const { user } = useAuth();
  const { cart: supabaseCart, isLoading, updateQuantity, removeFromCart } = useCart();
  const { toggleWishlist } = useWishlist();
  const { products } = Route.useLoaderData();

  const localCartRaw = useShop((s) => s.cart);
  const localUpdateQuantity = useShop((s) => s.setQuantity);
  const localRemoveFromCart = useShop((s) => s.removeFromCart);

  const setTheme = useTheme((s) => s.setTheme);
  const navigate = useNavigate();

  useEffect(() => {
    setTheme("default");
  }, [setTheme]);

  const localCart = localCartRaw.map((item) => {
    if (item.customId) {
      const design = useShop.getState().savedDesigns.find((d) => d.id === item.customId);
      return {
        id: item.slug,
        quantity: item.quantity,
        customization: design
          ? {
              preview_image: null,
              estimated_price: 480,
              shape: design.shape,
              fragrance: design.fragrance,
              base_soap: design.texture,
              ingredients: design.ingredients,
              packaging: design.packaging,
            }
          : null,
      };
    }
    const product = products.find((p) => p.slug === item.slug);
    return {
      id: item.slug,
      quantity: item.quantity,
      product: product,
    };
  });

  const cart = user ? supabaseCart : localCart;

  const subtotal = cart.reduce((a, i) => {
    const price = i.product?.price || i.customization?.estimated_price || 0;
    return a + price * i.quantity;
  }, 0);

  const cartQuantity = cart.reduce((a, i) => a + i.quantity, 0);

  // Get 3 recommendations excluding items in cart
  const recommendations = useMemo(() => {
    const inCartIds = cart.map((i) => i.product?.id).filter(Boolean);
    const available = products.filter((p) => !inCartIds.includes(p.id));
    // Shuffle and pick 3
    return [...available].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [cart, products]);

  const handleCheckout = () => {
    if (!user) {
      navigate({ to: "/auth/login" });
      return;
    }
    if (cart.length === 0) return;
    navigate({ to: "/checkout" });
  };

  const handleSaveForLater = (itemId: string, productId?: string) => {
    if (user && productId) {
      toggleWishlist.mutate(productId);
      removeFromCart.mutate(itemId);
    } else {
      if (user) removeFromCart.mutate(itemId);
      else localRemoveFromCart(itemId);
    }
  };

  if (user && isLoading) {
    return (
      <div className="relative pt-32 text-center h-screen flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-[color:var(--muted-foreground)] tracking-widest text-sm uppercase"
        >
          Loading your ritual...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative pt-32 pb-40 min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-12">
        <Reveal preset="label" className="text-eyebrow text-[color:var(--muted-foreground)]">
          {cartQuantity > 0
            ? `Your Ritual — ${cartQuantity} ${cartQuantity === 1 ? "Handmade Soap" : "Handmade Soaps"}`
            : "Your Ritual"}
        </Reveal>
        <SplitText
          as="h1"
          text={cartQuantity > 0 ? "Ready for Checkout" : "The Ritual"}
          delay={0.1}
          className="text-display mt-3 text-3xl md:text-4xl"
        />

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-24 text-center max-w-md mx-auto"
          >
            <div className="w-32 h-32 mx-auto mb-8 text-[color:var(--border)] opacity-50 flex items-center justify-center rounded-full border border-[color:var(--border)]">
              <ShoppingBag size={48} strokeWidth={1} />
            </div>
            <h2 className="text-display text-2xl mb-4">Your ritual hasn't begun.</h2>
            <p className="text-[color:var(--muted-foreground)] mb-10">
              Discover our collection of cold-pressed, handcrafted soaps to start your journey.
            </p>
            <Link
              to="/collections/$slug"
              params={{ slug: "radiance" }}
              className="btn-lux w-full justify-center"
            >
              Browse Collection
            </Link>
          </motion.div>
        ) : (
          <div className="mt-16 flex flex-col lg:flex-row gap-10 md:gap-16 relative">
            <div className="flex-1 w-full">
              <ul className="flex flex-col gap-6">
                <AnimatePresence initial={false}>
                  {cart.map((item) => {
                    const product =
                      item.product ||
                      products.find((p) => p.id === (item as any).product_id) ||
                      products.find((p) => p.slug === (item as any).product_id);
                    const custom = item.customization;

                    const price = product?.price || custom?.estimated_price || 0;
                    let name = "Custom Design";
                    if (product) name = product.name;
                    else if (custom) name = `Custom ${custom.fragrance || "Soap"}`;

                    const image =
                      product?.image ||
                      product?.image_url ||
                      product?.cover_image ||
                      product?.images?.[0] ||
                      product?.ui_metadata?.image ||
                      custom?.preview_image;

                    return (
                      <motion.li
                        layout
                        key={item.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{
                          opacity: 0,
                          y: -20,
                          height: 0,
                          scale: 0.95,
                          padding: 0,
                          margin: 0,
                          overflow: "hidden",
                        }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-row gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl md:rounded-[20px] surface-glass border border-[color:var(--border)] hover:border-[color:var(--gold)]/30 transition-colors duration-500"
                      >
                        <div className="h-28 sm:h-40 w-28 sm:w-[140px] flex-shrink-0 rounded-[12px] overflow-hidden bg-black/5 relative">
                          {image ? (
                            <ImageLoader src={resolveImageUrl(image)} alt={name} />
                          ) : (
                            <div className="soap-bar h-full w-full flex items-center justify-center text-xs text-[color:var(--muted-foreground)]">
                              <span className="soap-bar-shine" />
                              Bespoke
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex flex-col md:flex-row justify-between items-start gap-1 md:gap-0">
                            <div>
                              <div className="text-display text-lg md:text-2xl text-[color:var(--foreground)] leading-tight">
                                {name}
                              </div>
                              {product ? (
                                <div className="text-[10px] md:text-xs uppercase tracking-[0.24em] text-[color:var(--gold)] mt-1">
                                  {product.collection}
                                </div>
                              ) : null}
                            </div>
                            <div className="text-left md:text-right">
                              <div className="text-base md:text-lg tracking-widest text-[color:var(--foreground)] font-medium">
                                ₹{new Intl.NumberFormat("en-IN").format(price * item.quantity)}
                              </div>
                            </div>
                          </div>

                          <div className="my-2 md:my-4 text-xs text-[color:var(--muted-foreground)] hidden md:flex flex-wrap gap-x-4 gap-y-2">
                            {product ? (
                              <>
                                <span className="flex items-center gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-[color:var(--gold)]" />{" "}
                                  90g Bar
                                </span>
                                {product.ui_metadata?.skin_type && (
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-[color:var(--gold)]" />{" "}
                                    {product.ui_metadata.skin_type}
                                  </span>
                                )}
                                {product.ingredients && product.ingredients[0] && (
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-[color:var(--gold)]" />{" "}
                                    {product.ingredients[0]}
                                  </span>
                                )}
                              </>
                            ) : custom ? (
                              <>
                                {custom.skin_type && (
                                  <span>
                                    <span className="opacity-60">Skin Type:</span>{" "}
                                    {custom.skin_type}
                                  </span>
                                )}
                                {custom.core_active && (
                                  <span>
                                    <span className="opacity-60">Active:</span> {custom.core_active}
                                  </span>
                                )}
                                {custom.fragrance && (
                                  <span>
                                    <span className="opacity-60">Fragrance:</span>{" "}
                                    {custom.fragrance}
                                  </span>
                                )}

                                {custom.shape && custom.shape !== "Legacy" && (
                                  <span>
                                    <span className="opacity-60">Shape:</span> {custom.shape}
                                  </span>
                                )}
                                {custom.base_soap && custom.base_soap !== "Legacy" && (
                                  <span>
                                    <span className="opacity-60">Base:</span> {custom.base_soap}
                                  </span>
                                )}
                                {custom.ingredients && custom.ingredients.length > 0 && (
                                  <span className="truncate max-w-[200px]">
                                    <span className="opacity-60">Extracts:</span>{" "}
                                    {custom.ingredients.join(", ")}
                                  </span>
                                )}
                              </>
                            ) : null}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                            <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-full p-1 border border-[color:var(--border)]">
                              <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "var(--gold)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  if (user)
                                    updateQuantity.mutate({
                                      id: item.id,
                                      quantity: item.quantity - 1,
                                    });
                                  else localUpdateQuantity(item.id, item.quantity - 1);
                                }}
                                className="w-12 h-12 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-colors hover:text-black"
                                aria-label="Decrease"
                                disabled={user ? updateQuantity.isPending : false}
                              >
                                <Minus size={14} />
                              </motion.button>
                              <span className="w-10 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "var(--gold)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  if (user)
                                    updateQuantity.mutate({
                                      id: item.id,
                                      quantity: item.quantity + 1,
                                    });
                                  else localUpdateQuantity(item.id, item.quantity + 1);
                                }}
                                className="w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-colors hover:text-black"
                                aria-label="Increase"
                                disabled={user ? updateQuantity.isPending : false}
                              >
                                <Plus size={14} />
                              </motion.button>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleSaveForLater(item.id, product?.id)}
                                className="flex items-center gap-1.5 py-3 md:py-0 text-xs uppercase tracking-[0.1em] text-[color:var(--muted-foreground)] transition hover:text-[color:var(--gold)]"
                              >
                                <Heart size={14} />
                                <span className="hidden sm:inline">Save for later</span>
                              </button>
                              <div className="w-px h-3 bg-[color:var(--border)] hidden sm:block" />
                              <button
                                onClick={() => {
                                  if (user) removeFromCart.mutate(item.id);
                                  else localRemoveFromCart(item.id);
                                }}
                                className="flex items-center gap-1.5 py-3 md:py-0 text-xs uppercase tracking-[0.1em] text-[color:var(--muted-foreground)] transition hover:text-red-500"
                              >
                                <Trash2 size={14} />
                                <span className="hidden sm:inline">Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>

              <div className="mt-12 flex justify-start">
                <Link
                  to="/collections/$slug"
                  params={{ slug: "radiance" }}
                  className="flex items-center gap-2 text-sm uppercase tracking-widest text-[color:var(--foreground)] hover:text-[color:var(--gold)] transition-colors"
                >
                  <ArrowLeft size={16} /> Continue Shopping
                </Link>
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="mt-24 pt-16 border-t border-[color:var(--border)]">
                  <h3 className="text-display text-2xl mb-8">You may also love</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((p, idx) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                      >
                        <ProductCard product={p} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full lg:w-[380px] shrink-0">
              <div className="fixed md:sticky bottom-0 md:bottom-auto left-0 md:left-auto top-auto md:top-32 w-full md:w-auto z-[100] md:z-auto surface-glass bg-[color:var(--background)]/90 backdrop-blur-xl md:bg-transparent px-4 pt-4 pb-[calc(16px+var(--safe-bottom,0px))] md:p-8 rounded-none rounded-t-2xl md:rounded-none md:rounded-[20px] border-t border-b-0 border-l-0 border-r-0 md:border md:border-[color:var(--border)] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:shadow-xl">
                <h2 className="text-display mb-8 text-2xl hidden md:block">Order Summary</h2>

                <div className="space-y-4 border-b border-[color:var(--border)] pb-6 text-sm tracking-widest text-[color:var(--muted-foreground)] hidden md:block">
                  <div className="flex justify-between">
                    <span>Items ({cartQuantity})</span>
                    <span className="text-[color:var(--foreground)]">
                      ₹{new Intl.NumberFormat("en-IN").format(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-[color:var(--foreground)]">₹50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Included</span>
                  </div>
                </div>

                <div className="mt-0 md:mt-6 mb-3 md:mb-0 flex justify-between items-center md:items-end">
                  <span className="text-sm tracking-widest uppercase text-[color:var(--muted-foreground)]">
                    Total
                  </span>
                  <span className="text-xl md:text-2xl tracking-widest text-[color:var(--foreground)] font-medium">
                    ₹{new Intl.NumberFormat("en-IN").format(subtotal + 50)}
                  </span>
                </div>

                <div className="mt-8 space-y-3 hidden md:block">
                  <div className="flex items-center gap-2 text-xs text-[color:var(--muted-foreground)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--gold)] shrink-0" />
                    Luxury packaging included
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[color:var(--muted-foreground)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--gold)] shrink-0" />
                    Estimated delivery: 3-5 days
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[color:var(--muted-foreground)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--gold)] shrink-0" />
                    Manual payment process
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="btn-lux mt-0 md:mt-10 w-full justify-center py-4 md:py-3 shadow-lg hover:shadow-[color:var(--gold)]/20"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
