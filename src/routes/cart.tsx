import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { useShop, useTheme } from "@/lib/store";
import { getProduct, getProductById } from "@/lib/catalog";
import { SplitText } from "@/components/immersive/SplitText";
import { Reveal } from "@/components/immersive/Reveal";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Lenoraa" },
      { name: "description", content: "Review your selected Lenoraa handcrafted soaps." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { user } = useAuth();
  const { cart: supabaseCart, isLoading, updateQuantity, removeFromCart } = useCart();
  const { createOrder } = useOrders();
  
  const localCartRaw = useShop((s) => s.cart);
  const localUpdateQuantity = useShop((s) => s.setQuantity);
  const localRemoveFromCart = useShop((s) => s.removeFromCart);
  
  const setTheme = useTheme((s) => s.setTheme);
  const navigate = useNavigate();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);

  useEffect(() => {
    setTheme("default");
  }, [setTheme]);

  const localCart = localCartRaw.map(item => {
    if (item.customId) {
      const design = useShop.getState().savedDesigns.find(d => d.id === item.customId);
      return {
        id: item.slug,
        quantity: item.quantity,
        customization: design ? { preview_image: null, estimated_price: 480 } : null,
      };
    }
    const product = getProduct(item.slug);
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

  const handleCheckout = async () => {
    if (!user) {
      navigate({ to: "/account" });
      return;
    }
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    try {
      const order = await createOrder.mutateAsync({
        addressId: null,
        subtotal,
        shipping: 50,
      });
      setOrderComplete(order);
    } catch (e) {
      console.error(e);
      alert("Please login to place an order.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (user && isLoading) {
    return (
      <div className="relative pt-32 text-center h-screen">
        <p className="text-[color:var(--muted-foreground)]">Loading your bag...</p>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="relative pt-32 pb-40">
        <div className="mx-auto max-w-[800px] px-6 text-center">
          <SplitText as="h1" text="Order Reserved" delay={0.1} className="text-display mt-3 text-4xl" />
          <Reveal as="p" preset="paragraph" delay={0.2} className="mt-6 text-[color:var(--muted-foreground)] text-lg">
            Your order #{orderComplete.id.slice(0, 8).toUpperCase()} has been saved securely.
          </Reveal>
          
          <div className="mt-12 p-8 border border-[color:var(--border)] bg-black/5 rounded-[12px] text-left">
            <h2 className="text-display text-2xl mb-6">Complete Your Payment</h2>
            <p className="text-[color:var(--muted-foreground)] mb-6">
              To maintain our bespoke quality, we process payments manually. Please contact our artisan team on WhatsApp to complete your payment of <strong>₹{orderComplete.total}</strong>.
            </p>
            <div className="flex gap-4">
              <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="btn-lux w-full text-center">
                Pay via WhatsApp
              </a>
              <Link to="/account/orders" className="btn-lux w-full text-center bg-transparent border border-[color:var(--border)] text-[color:var(--foreground)] hover:bg-black/5">
                View My Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-32 pb-40">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <Reveal preset="label" className="text-eyebrow text-[color:var(--muted-foreground)]">Your bag</Reveal>
        <SplitText as="h1" text="The Ritual" delay={0.1} className="text-display mt-3 text-3xl md:text-4xl" />

        {cart.length === 0 ? (
          <div className="mt-24 text-center">
            <Reveal as="p" preset="paragraph" delay={0.2} className="text-[color:var(--muted-foreground)]">
              Your bag is quiet. Begin with a chapter.
            </Reveal>
            <Link
              to="/collections/$slug"
              params={{ slug: "radiance" }}
              className="btn-lux mt-8"
            >
              Enter Radiance
            </Link>
          </div>
        ) : (
          <div className="mt-16 grid gap-16 md:grid-cols-[1.5fr_1fr]">
            <ul className="divide-y divide-[color:var(--border)]">
              {cart.map((item) => {
                const product = item.product || getProductById(item.product_id) || getProduct(item.product_id);
                const custom = item.customization;
                
                const price = product?.price || custom?.estimated_price || 0;
                let name = "Custom Design";
                if (product) name = product.name;
                else if (custom) name = `Custom ${custom.fragrance || "Soap"}`;

                const image = product?.image || custom?.preview_image;

                return (
                  <li key={item.id} className="flex gap-6 py-8">
                    <div className="h-28 w-32 flex-shrink-0 rounded-[12px] overflow-hidden bg-black/5">
                      {image ? (
                        <img src={image} alt={name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="soap-bar h-full w-full"><span className="soap-bar-shine" /></div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="text-display text-2xl">{name}</div>
                        {product ? (
                          <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                            {product.tagline}
                          </div>
                        ) : custom ? (
                          <div className="mt-1 flex flex-col gap-1 text-xs text-[color:var(--muted-foreground)]">
                            <div><span className="opacity-60">Shape:</span> {custom.shape}</div>
                            <div><span className="opacity-60">Base:</span> {custom.soap_base}</div>
                            {custom.ingredients && custom.ingredients.length > 0 && (
                              <div className="truncate"><span className="opacity-60">Extracts:</span> {custom.ingredients.join(", ")}</div>
                            )}
                            <div><span className="opacity-60">Packaging:</span> {custom.packaging}</div>
                          </div>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-[color:var(--border)]">
                          <button
                            onClick={() => {
                              if (user) updateQuantity.mutate({ id: item.id, quantity: item.quantity - 1 });
                              else localUpdateQuantity(item.id, item.quantity - 1);
                            }}
                            className="px-3 py-2 transition hover:text-[color:var(--gold)]"
                            aria-label="Decrease"
                            disabled={user ? updateQuantity.isPending : false}
                          >
                            −
                          </button>
                          <span className="w-10 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => {
                              if (user) updateQuantity.mutate({ id: item.id, quantity: item.quantity + 1 });
                              else localUpdateQuantity(item.id, item.quantity + 1);
                            }}
                            className="px-3 py-2 transition hover:text-[color:var(--gold)]"
                            aria-label="Increase"
                            disabled={user ? updateQuantity.isPending : false}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            if (user) removeFromCart.mutate(item.id);
                            else localRemoveFromCart(item.id);
                          }}
                          className="text-xs uppercase tracking-[0.1em] text-[color:var(--muted-foreground)] transition hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm tracking-widest text-[color:var(--foreground)]">₹{price * item.quantity}</div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="self-start border border-[color:var(--border)] p-8">
              <h2 className="text-display mb-6 text-2xl">Summary</h2>
              <div className="space-y-4 border-b border-[color:var(--border)] pb-6 text-sm tracking-widest text-[color:var(--muted-foreground)]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated at next step</span>
                </div>
              </div>
              <div className="mt-6 flex justify-between text-lg tracking-widest text-[color:var(--foreground)]">
                <span>Total</span>
                <span>₹{subtotal}</span>
              </div>
              <button 
                onClick={handleCheckout} 
                disabled={isCheckingOut}
                className="btn-lux mt-10 w-full"
              >
                {isCheckingOut ? "Preparing..." : "Place Order (Manual Payment)"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
