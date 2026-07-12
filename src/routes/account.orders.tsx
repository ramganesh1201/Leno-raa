import { createFileRoute, Link } from "@tanstack/react-router";
import { useOrders } from "@/hooks/useOrders";

export const Route = createFileRoute("/account/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const { orders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div className="surface-glass rounded-md p-10 animate-pulse">
        <div className="h-6 w-32 bg-[color:var(--foreground)]/10 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-24 w-full bg-[color:var(--foreground)]/5 rounded"></div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="surface-glass rounded-md p-10 text-center">
        <div className="text-eyebrow text-[color:var(--muted-foreground)]">Orders</div>
        <div className="text-display mt-3 text-3xl">No orders yet</div>
        <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">
          When you complete a ritual, its record will appear here.
        </p>
        <Link to="/" className="btn-lux mt-8 inline-flex">Explore collections</Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="surface-glass rounded-md p-10">
        <div className="text-eyebrow text-[color:var(--muted-foreground)]">Orders</div>
        <div className="text-display mt-3 text-3xl">Order History</div>

        <div className="mt-10 space-y-8">
          {orders.map((order: any) => (
            <div key={order.id} className="border border-[color:var(--border)] p-8 rounded-md">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 border-b border-[color:var(--border)] pb-6 mb-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-1">
                    Order #{order.id.split('-')[0].toUpperCase()}
                  </div>
                  <div className="text-sm">Placed on {new Date(order.created_at).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-6">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-1">Total</div>
                    <div className="text-sm font-medium">₹{order.total}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-1">Status</div>
                    <div className="text-sm font-medium text-[color:var(--gold)]">{order.order_status}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-1">Payment</div>
                    <div className="text-sm font-medium">{order.payment_status}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-black/5 rounded-md overflow-hidden flex-shrink-0">
                      {item.product?.image || item.customization?.preview_image ? (
                        <img src={item.product?.image || item.customization?.preview_image} alt="Product" className="w-full h-full object-cover" />
                      ) : (
                        <div className="soap-bar w-full h-full"><span className="soap-bar-shine"></span></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.product?.name || "Custom Design"}</div>
                      <div className="text-xs text-[color:var(--muted-foreground)]">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-sm font-medium">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
              
              {order.address && (
                <div className="mt-8 pt-6 border-t border-[color:var(--border)] text-xs text-[color:var(--muted-foreground)]">
                  <span className="uppercase tracking-widest block mb-2">Shipping to:</span>
                  {order.address.name}, {order.address.address}, {order.address.city}, {order.address.state} {order.address.zipcode}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
