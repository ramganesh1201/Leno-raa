import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/lib/store";
import { SplitText } from "@/components/immersive/SplitText";
import { Reveal } from "@/components/immersive/Reveal";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Lenoraa" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { user } = useAuth();
  const { cart, isLoading } = useCart();
  const { createOrder } = useOrders();
  const setTheme = useTheme((s) => s.setTheme);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTheme("default");
    if (!user && !isLoading) {
      navigate({ to: "/auth/login" });
    }
  }, [setTheme, user, isLoading, navigate]);

  const subtotal = cart.reduce((a, i) => {
    const price = i.product?.price || i.customization?.calculated_price || 0;
    return a + price * i.quantity;
  }, 0);

  const cartQuantity = cart.reduce((a, i) => a + i.quantity, 0);
  const shippingCost = 50;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      const order = await createOrder.mutateAsync({
        shippingDetails: formData,
        subtotal,
        shipping_cost: shippingCost,
      });
      navigate({ to: `/payment/${order.id}` });
    } catch (error) {
      console.error(error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="relative pt-32 text-center h-screen flex items-center justify-center">
        <div className="text-[color:var(--muted-foreground)] tracking-widest text-sm uppercase">Loading...</div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="relative pt-32 pb-40 min-h-screen text-center">
        <h2 className="text-display text-2xl mb-4">Your bag is empty.</h2>
        <Link to="/cart" className="btn-lux inline-flex">Return to Bag</Link>
      </div>
    );
  }

  return (
    <div className="relative pt-32 pb-40 min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-12">
        <Reveal preset="label" className="text-eyebrow text-[color:var(--muted-foreground)]">
          Secure Checkout
        </Reveal>
        <SplitText as="h1" text="Shipping Details" delay={0.1} className="text-display mt-3 text-3xl md:text-4xl" />

        <div className="mt-16 flex flex-col lg:flex-row gap-16 relative">
          <div className="flex-1 w-full">
            <form onSubmit={handleSubmit} className="space-y-6 surface-glass p-8 rounded-[20px] border border-[color:var(--border)]">
              <div className="space-y-4">
                <h3 className="text-display text-xl mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Full Name</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-lg p-3 text-[color:var(--foreground)] focus:border-[color:var(--gold)] focus:outline-none transition-colors"
                      value={formData.full_name}
                      onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Phone Number</label>
                    <input 
                      required
                      type="tel"
                      className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-lg p-3 text-[color:var(--foreground)] focus:border-[color:var(--gold)] focus:outline-none transition-colors"
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <h3 className="text-display text-xl mb-4 pt-4 border-t border-[color:var(--border)] mt-8">Delivery Address</h3>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Street Address</label>
                  <input 
                    required
                    type="text"
                    className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-lg p-3 text-[color:var(--foreground)] focus:border-[color:var(--gold)] focus:outline-none transition-colors"
                    value={formData.address}
                    onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">City</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-lg p-3 text-[color:var(--foreground)] focus:border-[color:var(--gold)] focus:outline-none transition-colors"
                      value={formData.city}
                      onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">State</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-lg p-3 text-[color:var(--foreground)] focus:border-[color:var(--gold)] focus:outline-none transition-colors"
                      value={formData.state}
                      onChange={e => setFormData(p => ({ ...p, state: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">PIN Code</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-lg p-3 text-[color:var(--foreground)] focus:border-[color:var(--gold)] focus:outline-none transition-colors"
                      value={formData.pincode}
                      onChange={e => setFormData(p => ({ ...p, pincode: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-8">
                <button type="submit" disabled={isSubmitting} className="btn-lux w-full justify-center text-lg py-4">
                  {isSubmitting ? "Processing..." : "Continue to Payment"}
                </button>
              </div>
            </form>

            <div className="mt-8">
              <Link to="/cart" className="flex items-center gap-2 text-sm uppercase tracking-widest text-[color:var(--foreground)] hover:text-[color:var(--gold)] transition-colors">
                <ArrowLeft size={16} /> Return to Cart
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-[380px] shrink-0">
            <div className="sticky top-32 surface-glass p-8 rounded-[20px] border border-[color:var(--border)] shadow-xl">
              <h2 className="text-display mb-8 text-2xl">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => {
                  const product = item.product;
                  const price = product?.price || item.customization?.calculated_price || 0;
                  const name = product?.name || "Custom Design";
                  return (
                    <div key={item.id} className="flex justify-between items-center text-sm border-b border-[color:var(--border)] pb-4 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <div className="text-[color:var(--foreground)] font-medium">{name}</div>
                        <div className="text-xs text-[color:var(--muted-foreground)]">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-[color:var(--foreground)]">₹{price * item.quantity}</div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4 border-t border-[color:var(--border)] pt-6 text-sm tracking-widest text-[color:var(--muted-foreground)]">
                <div className="flex justify-between">
                  <span>Subtotal ({cartQuantity} items)</span>
                  <span className="text-[color:var(--foreground)]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-[color:var(--foreground)]">₹{shippingCost}</span>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between items-end border-t border-[color:var(--border)] pt-6">
                <span className="text-sm tracking-widest uppercase text-[color:var(--muted-foreground)]">Total</span>
                <span className="text-2xl tracking-widest text-[color:var(--foreground)] font-medium">₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
