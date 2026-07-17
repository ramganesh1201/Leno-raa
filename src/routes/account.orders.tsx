import { createFileRoute, Link } from "@tanstack/react-router";
import { useOrders } from "@/hooks/useOrders";
import { motion } from "framer-motion";
import { resolveImageUrl } from "@/lib/imageResolver";
import { Package, Clock, CheckCircle2, Truck, CreditCard, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/account/orders")({
  component: OrdersPage,
});

function OrderTimeline({ status, paymentStatus }: { status: string; paymentStatus: string }) {
  const steps = [
    { id: "placed", label: "Placed", icon: Package },
    {
      id: "payment",
      label: paymentStatus === "Verified" ? "Paid" : "Payment Pending",
      icon: CreditCard,
    },
    { id: "preparing", label: "Preparing", icon: Clock },
    { id: "shipped", label: "Shipped", icon: Truck },
    { id: "delivered", label: "Delivered", icon: CheckCircle2 },
  ];

  let currentStepIndex = 0;
  if (status === "Delivered") currentStepIndex = 4;
  else if (status === "Shipped") currentStepIndex = 3;
  else if (status === "Preparing") currentStepIndex = 2;
  else if (paymentStatus === "Verified") currentStepIndex = 1;

  return (
    <div className="relative mt-8 pt-8 border-t border-[color:var(--border)] hidden md:block">
      <div className="absolute top-12 left-6 right-6 h-px bg-[color:var(--border)] -z-10" />
      <div className="flex justify-between">
        {steps.map((step, idx) => {
          const isActive = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-3 bg-[color:var(--background)] px-2"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-500 ${
                  isActive
                    ? "border-[color:var(--gold)] bg-[color:var(--gold)]/10 text-[color:var(--gold)]"
                    : "border-[color:var(--border)] bg-[color:var(--background)] text-[color:var(--muted-foreground)]"
                }`}
              >
                <step.icon size={14} />
              </div>
              <div
                className={`text-xs uppercase tracking-widest ${isActive ? "text-[color:var(--foreground)]" : "text-[color:var(--muted-foreground)]"}`}
              >
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrdersPage() {
  const { orders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 w-full bg-[color:var(--foreground)]/5 rounded-[24px]"></div>
        <div className="h-48 w-full bg-[color:var(--foreground)]/5 rounded-[24px]"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-glass rounded-[24px] p-16 text-center border border-[color:var(--border)] shadow-sm max-w-2xl mx-auto mt-12"
      >
        <div className="w-24 h-24 mx-auto mb-6 text-[color:var(--border)] opacity-50 flex items-center justify-center rounded-full border border-[color:var(--border)]">
          <Package size={32} strokeWidth={1} />
        </div>
        <h2 className="text-display text-2xl mb-3">No handcrafted soaps ordered yet.</h2>
        <p className="text-[color:var(--muted-foreground)] mb-8">
          When you complete a ritual, its record will appear here.
        </p>
        <Link
          to="/collections/$slug"
          params={{ slug: "radiance" }}
          className="btn-lux inline-flex justify-center"
        >
          Explore collections
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="text-eyebrow text-[color:var(--muted-foreground)] mb-2">History</div>
          <h1 className="text-display text-3xl">Your Orders</h1>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order: any, idx: number) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="surface-glass border border-[color:var(--border)] p-6 md:p-8 rounded-[24px] hover:border-[color:var(--gold)]/30 transition-colors duration-500 shadow-sm"
          >
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">
                  Order <span className="text-[color:var(--foreground)]">{order.order_number}</span>
                </div>
                <div className="text-sm text-[color:var(--muted-foreground)]">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 md:gap-8">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-1.5">
                    Total
                  </div>
                  <div className="text-sm font-medium text-[color:var(--foreground)]">
                    ₹{order.total}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-1.5">
                    Status
                  </div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-medium bg-[color:var(--gold)]/10 text-[color:var(--gold)] border border-[color:var(--gold)]/20">
                    {order.order_status}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-1.5">
                    Payment
                  </div>
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-medium border ${
                      order.payment_status === "Verified"
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : order.payment_status === "Rejected"
                          ? "bg-red-500/10 text-red-500 border-red-500/20"
                          : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    }`}
                  >
                    {order.payment_status}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-[color:var(--border)]">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-black/10 dark:bg-white/10 rounded-lg overflow-hidden flex-shrink-0 border border-[color:var(--border)]">
                    {(() => {
                      const itemImage =
                        item.product?.image ||
                        item.product?.image_url ||
                        item.product?.cover_image ||
                        item.product?.images?.[0] ||
                        item.product?.ui_metadata?.image ||
                        item.customization?.preview_image;
                      return itemImage ? (
                        <img
                          src={resolveImageUrl(itemImage)}
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-[color:var(--muted-foreground)] uppercase tracking-widest">
                          Custom
                        </div>
                      );
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[color:var(--foreground)] truncate">
                      {item.product?.name || "Custom Design"}
                    </div>
                    <div className="text-xs text-[color:var(--muted-foreground)] mt-1 tracking-wider">
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-[color:var(--foreground)] tracking-widest">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col md:flex-row flex-wrap justify-end gap-3 md:gap-4">
              <Link
                to="/account/orders/$orderId"
                params={{ orderId: order.id }}
                className="text-xs uppercase tracking-widest text-[color:var(--foreground)] hover:text-[color:var(--gold)] transition-colors flex items-center gap-1 font-medium justify-center md:justify-start p-3 md:p-0 border md:border-none border-[color:var(--border)] rounded-lg md:rounded-none"
              >
                View Details
              </Link>
              {(order.payment_status === "Pending" || order.payment_status === "Rejected") && (
                <Link
                  to="/payment/$orderId"
                  params={{ orderId: order.id }}
                  className="text-xs uppercase tracking-widest text-[color:var(--gold)] hover:text-[color:var(--foreground)] transition-colors flex items-center gap-1 font-medium justify-center md:justify-start p-3 md:p-0 border md:border-none border-[color:var(--gold)] rounded-lg md:rounded-none"
                >
                  Complete Payment <ChevronRight size={14} />
                </Link>
              )}
              {order.payment_status === "Awaiting Verification" && (
                <Link
                  to="/order-success/$orderId"
                  params={{ orderId: order.id }}
                  className="text-xs uppercase tracking-widest text-[color:var(--gold)] hover:text-[color:var(--foreground)] transition-colors flex items-center gap-1 font-medium justify-center md:justify-start p-3 md:p-0 border md:border-none border-[color:var(--gold)] rounded-lg md:rounded-none"
                >
                  Check Status <ChevronRight size={14} />
                </Link>
              )}
            </div>

            <OrderTimeline status={order.order_status} paymentStatus={order.payment_status} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
