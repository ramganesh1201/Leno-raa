import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { SplitText } from "@/components/immersive/SplitText";
import { Reveal } from "@/components/immersive/Reveal";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { ordersService } from "@/services/orders.service";

export const Route = createFileRoute("/payment/$orderId")({
  component: PaymentPage,
});

function PaymentPage() {
  const { orderId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { uploadProof } = useOrders();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: order, isLoading: isOrderLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersService.getOrderById(orderId),
    enabled: !!orderId && !!user,
  });

  const { data: siteSettings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").single();
      if (error && error.code !== "PGRST116") throw error; // PGRST116 is no rows returned
      return data;
    },
  });

  useEffect(() => {
    if (!user) {
      navigate({ to: "/auth/login" });
    }
  }, [user, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!["image/jpeg", "image/png", "image/jpg"].includes(selected.type)) {
      setError("Please upload a valid image file (JPG or PNG).");
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB.");
      return;
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !utrNumber) {
      setError("Please provide both the UTR number and a payment screenshot.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await uploadProof.mutateAsync({
        orderId,
        utrNumber,
        file,
      });
      navigate({ to: `/order-success/${orderId}` });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload payment proof. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOrderLoading || isSettingsLoading) {
    return (
      <div className="relative pt-32 text-center h-screen flex items-center justify-center">
        <div className="text-[color:var(--muted-foreground)] tracking-widest text-sm uppercase">
          Loading Payment Details...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="relative pt-32 text-center h-screen flex flex-col items-center justify-center">
        <h2 className="text-display text-2xl mb-4">Order Not Found</h2>
        <p className="text-[color:var(--muted-foreground)]">We couldn't locate this order.</p>
      </div>
    );
  }

  return (
    <div className="relative pt-32 pb-40 min-h-screen">
      <div className="mx-auto max-w-[800px] px-4 sm:px-6">
        <div className="text-center mb-12">
          <Reveal preset="label" className="text-eyebrow text-[color:var(--gold)]">
            Final Step
          </Reveal>
          <SplitText
            as="h1"
            text="Complete Your Payment"
            delay={0.1}
            className="text-display mt-3 text-3xl md:text-4xl"
          />
          <Reveal
            as="p"
            preset="paragraph"
            delay={0.2}
            className="mt-4 text-[color:var(--muted-foreground)]"
          >
            Please complete the payment using any UPI application and upload the payment screenshot
            below.
          </Reveal>
        </div>

        <div className="surface-glass p-8 md:p-12 rounded-[20px] border border-[color:var(--border)] shadow-xl relative overflow-hidden">
          {/* Order Summary Ribbon */}
          <div className="absolute top-0 left-0 right-0 bg-black/5 dark:bg-white/5 p-4 border-b border-[color:var(--border)] flex justify-between items-center px-8">
            <span className="text-sm font-medium">Order: {order.order_number}</span>
            <span className="text-lg font-semibold text-[color:var(--gold)]">₹{order.total}</span>
          </div>

          <div className="pt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left: QR Code */}
            <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[color:var(--border)] pb-10 md:pb-0 md:pr-10">
              <h3 className="text-display text-xl mb-6 text-center">Scan to Pay</h3>

              <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 mb-6 w-56 h-56 flex items-center justify-center overflow-hidden">
                {siteSettings?.upi_qr_url ? (
                  <img
                    src={siteSettings.upi_qr_url}
                    alt="UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-400 p-4 text-center border-2 border-dashed border-gray-200">
                    <AlertCircle size={32} className="mb-2 opacity-50" />
                    <span className="text-xs">
                      QR Code
                      <br />
                      Not Configured
                    </span>
                  </div>
                )}
              </div>

              <div className="text-center w-full max-w-[240px]">
                {siteSettings?.merchant_name && (
                  <p className="text-sm font-medium text-[color:var(--foreground)] mb-3">
                    {siteSettings.merchant_name}
                  </p>
                )}
                <div className="flex items-center justify-between gap-2 bg-black/5 dark:bg-white/5 py-3 px-4 rounded-full">
                  <span className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] shrink-0">
                    UPI
                  </span>
                  <span
                    className="font-medium tracking-wide truncate max-w-[120px]"
                    title={siteSettings?.upi_id || "Not configured"}
                  >
                    {siteSettings?.upi_id || "Not configured"}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(siteSettings?.upi_id || "")}
                    className="text-[color:var(--gold)] hover:text-white transition-colors shrink-0"
                    title="Copy UPI ID"
                    disabled={!siteSettings?.upi_id}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Upload Form */}
            <div className="flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">
                    UTR / Transaction ID *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 123456789012"
                    className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-lg p-3 text-[color:var(--foreground)] focus:border-[color:var(--gold)] focus:outline-none transition-colors"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">
                    Payment Screenshot *
                  </label>

                  {!previewUrl ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[color:var(--border)] rounded-lg p-8 text-center cursor-pointer hover:border-[color:var(--gold)] transition-colors flex flex-col items-center justify-center bg-black/5 dark:bg-white/5"
                    >
                      <UploadCloud className="w-10 h-10 text-[color:var(--muted-foreground)] mb-4" />
                      <p className="text-sm text-[color:var(--foreground)] mb-1">
                        Click to upload screenshot
                      </p>
                      <p className="text-xs text-[color:var(--muted-foreground)]">
                        JPG, PNG (max 10MB)
                      </p>
                    </div>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border border-[color:var(--border)]">
                      <img
                        src={previewUrl}
                        alt="Screenshot Preview"
                        className="w-full h-auto max-h-64 object-contain bg-black/5"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 hover:bg-red-500 transition-colors backdrop-blur-md"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/jpg"
                    className="hidden"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !file || !utrNumber}
                  className="btn-lux w-full justify-center text-lg py-4 flex items-center gap-2 mt-4 shadow-lg"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <CheckCircle2 size={20} /> I've Paid
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
