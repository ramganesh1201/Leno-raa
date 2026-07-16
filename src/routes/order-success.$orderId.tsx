import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { ordersService } from "@/services/orders.service";
import { SplitText } from "@/components/immersive/SplitText";
import { Reveal } from "@/components/immersive/Reveal";
import { CheckCircle2, Clock, Package, Truck, Home } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/order-success/$orderId")({
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const { orderId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersService.getOrderById(orderId),
    enabled: !!orderId && !!user,
  });

  useEffect(() => {
    if (!user) {
      navigate({ to: "/auth/login" });
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="relative pt-32 text-center h-screen flex items-center justify-center">
        <div className="text-[color:var(--muted-foreground)] tracking-widest text-sm uppercase">
          Loading Order...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="relative pt-32 text-center h-screen flex flex-col items-center justify-center">
        <h2 className="text-display text-2xl mb-4">Order Not Found</h2>
        <Link to="/" className="btn-lux">
          Return to Home
        </Link>
      </div>
    );
  }

  const timelineSteps = [
    { label: "Order Created", status: "completed", icon: <CheckCircle2 size={24} /> },
    {
      label: "Payment Verification",
      status:
        order.payment_status === "Verified"
          ? "completed"
          : order.payment_status === "Rejected"
            ? "error"
            : "current",
      icon: <Clock size={24} />,
    },
    {
      label: "Preparing",
      status: ["Preparing", "Packed", "Shipped", "Delivered"].includes(order.order_status)
        ? "completed"
        : order.order_status === "Preparing"
          ? "current"
          : "pending",
      icon: <Package size={24} />,
    },
    {
      label: "Packed",
      status: ["Packed", "Shipped", "Delivered"].includes(order.order_status)
        ? "completed"
        : order.order_status === "Packed"
          ? "current"
          : "pending",
      icon: <Package size={24} />,
    },
    {
      label: "Shipped",
      status: ["Shipped", "Delivered"].includes(order.order_status)
        ? "completed"
        : order.order_status === "Shipped"
          ? "current"
          : "pending",
      icon: <Truck size={24} />,
    },
    {
      label: "Delivered",
      status: order.order_status === "Delivered" ? "completed" : "pending",
      icon: <Home size={24} />,
    },
  ];

  return (
    <div className="relative pt-32 pb-40 min-h-screen">
      <div className="mx-auto max-w-[800px] px-4 sm:px-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.1 }}
          className="w-24 h-24 mx-auto mb-8 bg-[color:var(--gold)]/10 text-[color:var(--gold)] rounded-full flex items-center justify-center"
        >
          <CheckCircle2 size={48} strokeWidth={1.5} />
        </motion.div>

        <Reveal preset="label" className="text-eyebrow text-[color:var(--gold)]">
          Thank you
        </Reveal>
        <SplitText
          as="h1"
          text="Order Submitted"
          delay={0.2}
          className="text-display mt-3 text-3xl md:text-5xl"
        />

        <Reveal
          as="p"
          preset="paragraph"
          delay={0.3}
          className="mt-6 text-[color:var(--muted-foreground)] text-lg max-w-lg mx-auto"
        >
          Your payment proof has been uploaded. We usually verify payments within 30 minutes during
          business hours.
        </Reveal>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 surface-glass p-8 rounded-[20px] border border-[color:var(--border)] text-left"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[color:var(--border)] pb-6 mb-8 gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-1">
                Order Number
              </div>
              <div className="text-xl font-medium tracking-wide">{order.order_number}</div>
            </div>
            <div className="sm:text-right">
              <div className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-1">
                Payment Status
              </div>
              <div className="text-xl font-medium tracking-wide text-[color:var(--gold)]">
                {order.payment_status}
              </div>
            </div>
          </div>

          <h3 className="text-display text-xl mb-8">Order Status</h3>

          <div className="relative">
            {/* Vertical line for desktop */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[color:var(--border)] hidden md:block" />

            <div className="space-y-8">
              {timelineSteps.map((step, idx) => {
                const isCompleted = step.status === "completed";
                const isCurrent = step.status === "current";
                const isPending = step.status === "pending";
                const isError = step.status === "error";

                return (
                  <div key={idx} className="flex items-start gap-4 relative md:pl-2">
                    <div
                      className={`
                      w-12 h-12 rounded-full flex items-center justify-center z-10 shrink-0
                      ${
                        isCompleted
                          ? "bg-[color:var(--gold)] text-white"
                          : isCurrent
                            ? "bg-black text-white dark:bg-white dark:text-black border-2 border-[color:var(--gold)]"
                            : isError
                              ? "bg-red-500 text-white"
                              : "bg-black/5 dark:bg-white/5 text-[color:var(--muted-foreground)] border border-[color:var(--border)]"
                      }
                    `}
                    >
                      {step.icon}
                    </div>
                    <div className="pt-3">
                      <h4
                        className={`text-lg tracking-wide ${isPending ? "text-[color:var(--muted-foreground)]" : "text-[color:var(--foreground)]"}`}
                      >
                        {step.label}
                      </h4>
                      {step.label === "Payment Verification" && isCurrent && (
                        <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
                          Awaiting admin review.
                        </p>
                      )}
                      {step.label === "Payment Verification" && isError && (
                        <p className="text-sm text-red-500 mt-1">
                          Payment rejected. Check details.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="mt-12 flex justify-center gap-4">
          <Link
            to="/account/orders"
            className="btn-lux bg-transparent border border-[color:var(--border)] text-[color:var(--foreground)] hover:bg-black/5"
          >
            View My Orders
          </Link>
          <Link to="/collections/$slug" params={{ slug: "radiance" }} className="btn-lux">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
