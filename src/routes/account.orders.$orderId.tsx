import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { ordersService } from "@/services/orders.service";
import { SplitText } from "@/components/immersive/SplitText";
import { Reveal } from "@/components/immersive/Reveal";
import { ArrowLeft, ExternalLink, Image as ImageIcon } from "lucide-react";
import { resolveImageUrl } from "@/lib/imageResolver";

export const Route = createFileRoute("/account/orders/$orderId")({
  component: OrderDetailsPage,
});

function OrderDetailsPage() {
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
      <div className="space-y-6 animate-pulse mt-12">
        <div className="h-48 w-full bg-[color:var(--foreground)]/5 rounded-[24px]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mt-12 text-center p-12 surface-glass rounded-[24px] border border-[color:var(--border)]">
        <h2 className="text-display text-2xl mb-4">Order Not Found</h2>
        <Link to="/account/orders" className="btn-lux inline-flex">
          Back to Orders
        </Link>
      </div>
    );
  }

  const shipping = order.shipping_addresses?.[0];
  const proof = order.payment_proofs?.[0];

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/account/orders"
          className="flex items-center gap-2 text-sm uppercase tracking-widest text-[color:var(--muted-foreground)] hover:text-[color:var(--gold)] transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <div className="text-eyebrow text-[color:var(--muted-foreground)] mb-2">
              Order Details
            </div>
            <h1 className="text-display text-3xl">{order.order_number}</h1>
          </div>
          <div className="flex gap-3">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs uppercase tracking-widest font-medium border ${
                order.payment_status === "Verified"
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : order.payment_status === "Rejected"
                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                    : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              }`}
            >
              {order.payment_status}
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs uppercase tracking-widest font-medium bg-[color:var(--gold)]/10 text-[color:var(--gold)] border border-[color:var(--gold)]/20">
              {order.order_status}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="surface-glass p-8 rounded-[24px] border border-[color:var(--border)] shadow-sm">
            <h3 className="text-display text-xl mb-6">Items Ordered</h3>
            <div className="space-y-4">
              {order.order_items?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-[color:var(--border)]"
                >
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
                    ₹{new Intl.NumberFormat("en-IN").format(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {(order.payment_status === "Pending" || order.payment_status === "Rejected") && (
            <div className="surface-glass p-8 rounded-[24px] border border-[color:var(--border)] shadow-sm flex justify-between items-center bg-[color:var(--gold)]/5 border-[color:var(--gold)]/30">
              <div>
                <h3 className="text-display text-xl mb-2 text-[color:var(--gold)]">
                  Payment Required
                </h3>
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  Please complete your payment to process this order.
                </p>
              </div>
              <Link
                to="/payment/$orderId"
                params={{ orderId: order.id }}
                className="btn-lux shrink-0"
              >
                Complete Payment
              </Link>
            </div>
          )}

          {proof && (
            <div className="surface-glass p-8 rounded-[24px] border border-[color:var(--border)] shadow-sm">
              <h3 className="text-display text-xl mb-6 flex items-center gap-2">
                <ImageIcon size={20} /> Payment Proof
              </h3>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <a
                  href={proof.screenshot_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block shrink-0 border border-[color:var(--border)] rounded-xl overflow-hidden hover:border-[color:var(--gold)] transition-colors relative group"
                >
                  <img
                    src={proof.screenshot_url}
                    alt="Payment Proof"
                    className="w-48 h-auto object-cover bg-black/5"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ExternalLink className="text-white" size={24} />
                  </div>
                </a>
                <div className="space-y-4 flex-1">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-1">
                      UTR Number
                    </div>
                    <div className="text-sm font-medium tracking-wide">{proof.utr_number}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-1">
                      Uploaded On
                    </div>
                    <div className="text-sm">{new Date(proof.uploaded_at).toLocaleString()}</div>
                  </div>
                  {proof.rejection_reason && order.payment_status === "Rejected" && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg mt-4">
                      <div className="text-xs uppercase tracking-widest text-red-500 mb-1">
                        Reason for Rejection
                      </div>
                      <div className="text-sm text-red-500">{proof.rejection_reason}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="surface-glass p-8 rounded-[24px] border border-[color:var(--border)] shadow-sm">
            <h3 className="text-display text-xl mb-6">Order Summary</h3>
            <div className="space-y-4 border-b border-[color:var(--border)] pb-6 text-sm tracking-widest text-[color:var(--muted-foreground)]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[color:var(--foreground)]">
                  ₹{new Intl.NumberFormat("en-IN").format(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-[color:var(--foreground)]">
                  ₹{new Intl.NumberFormat("en-IN").format(order.shipping_cost)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[color:var(--gold)]">
                  <span>Discount</span>
                  <span>-₹{new Intl.NumberFormat("en-IN").format(order.discount)}</span>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-between items-end">
              <span className="text-sm tracking-widest uppercase text-[color:var(--muted-foreground)]">
                Total
              </span>
              <span className="text-2xl tracking-widest text-[color:var(--foreground)] font-medium">
                ₹{new Intl.NumberFormat("en-IN").format(order.total)}
              </span>
            </div>
          </div>

          <div className="surface-glass p-8 rounded-[24px] border border-[color:var(--border)] shadow-sm">
            <h3 className="text-display text-xl mb-6">Shipping Address</h3>
            {shipping ? (
              <div className="text-sm space-y-1 text-[color:var(--muted-foreground)] leading-relaxed">
                <div className="text-[color:var(--foreground)] font-medium tracking-wide mb-2">
                  {shipping.full_name}
                </div>
                <div>{shipping.address}</div>
                <div>
                  {shipping.city}, {shipping.state} {shipping.pincode}
                </div>
                <div className="pt-2 mt-2 border-t border-[color:var(--border)] flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest opacity-60">Phone:</span>{" "}
                  {shipping.phone}
                </div>
              </div>
            ) : (
              <div className="text-sm text-[color:var(--muted-foreground)]">
                No shipping information available.
              </div>
            )}

            {(order.courier_name || order.tracking_number) && (
              <div className="mt-6 pt-6 border-t border-[color:var(--border)] space-y-3">
                <h4 className="text-xs uppercase tracking-widest text-[color:var(--gold)]">
                  Shipping Details
                </h4>
                {order.courier_name && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[color:var(--muted-foreground)]">Courier</span>
                    <span>{order.courier_name}</span>
                  </div>
                )}
                {order.tracking_number && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[color:var(--muted-foreground)]">Tracking No.</span>
                    <span>{order.tracking_number}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
