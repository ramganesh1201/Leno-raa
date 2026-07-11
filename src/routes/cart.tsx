import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { getProduct } from "@/lib/catalog";
import { useShop, useTheme } from "@/lib/store";

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
  const cart = useShop((s) => s.cart);
  const setQuantity = useShop((s) => s.setQuantity);
  const removeFromCart = useShop((s) => s.removeFromCart);
  const setTheme = useTheme((s) => s.setTheme);

  useEffect(() => {
    setTheme("default");
  }, [setTheme]);

  const items = cart
    .map((c) => ({ ...c, product: getProduct(c.slug) }))
    .filter((c) => c.product);
  const subtotal = items.reduce(
    (a, i) => a + (i.product?.price ?? 0) * i.quantity,
    0,
  );

  return (
    <div className="relative pt-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <div className="text-eyebrow text-[color:var(--muted-foreground)]">Your bag</div>
        <h1 className="text-display mt-3 text-5xl md:text-7xl">The Ritual</h1>

        {items.length === 0 ? (
          <div className="mt-24 text-center">
            <p className="text-[color:var(--muted-foreground)]">
              Your bag is quiet. Begin with a chapter.
            </p>
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
              {items.map(({ product, quantity }) => (
                <li
                  key={product!.slug}
                  data-theme={product!.collection}
                  className="flex gap-6 py-8"
                >
                  <div className="soap-bar h-28 w-32 flex-shrink-0">
                    <span className="soap-bar-shine" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        to="/products/$slug"
                        params={{ slug: product!.slug }}
                        className="text-display text-2xl transition hover:text-[color:var(--gold)]"
                      >
                        {product!.name}
                      </Link>
                      <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                        {product!.tagline}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-[color:var(--border)]">
                        <button
                          onClick={() => setQuantity(product!.slug, quantity - 1)}
                          className="px-3 py-2 transition hover:text-[color:var(--gold)]"
                          aria-label="Decrease"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm">{quantity}</span>
                        <button
                          onClick={() => setQuantity(product!.slug, quantity + 1)}
                          className="px-3 py-2 transition hover:text-[color:var(--gold)]"
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(product!.slug)}
                        className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)] transition hover:text-[color:var(--gold)]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-display self-start text-xl">
                    ₹{product!.price * quantity}
                  </div>
                </li>
              ))}
            </ul>

            <aside className="surface-glass sticky top-32 h-fit rounded-md p-8">
              <div className="text-eyebrow mb-6 text-[color:var(--muted-foreground)]">
                Summary
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[color:var(--muted-foreground)]">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <div className="my-6 h-px bg-[color:var(--border)]" />
              <div className="flex justify-between text-lg">
                <span className="text-display">Total</span>
                <span className="text-display">₹{subtotal}</span>
              </div>
              <button className="btn-lux mt-8 w-full justify-center">
                Continue to checkout
              </button>
              <p className="mt-4 text-center text-xs text-[color:var(--muted-foreground)]">
                Secure payment · Free returns
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
