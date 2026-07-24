import { PaymentProofImage } from "@/components/admin/PaymentProofImage";
import { FullscreenViewer } from "@/components/ui/FullscreenViewer";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAdminPayments } from "@/hooks/useOrders";
import {
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ExternalLink,
  Download,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPaymentsPage,
});

function AdminPaymentsPage() {
  const { payments, isLoading, verifyPayment } = useAdminPayments();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("awaiting verification");
  const [selectedProof, setSelectedProof] = useState<any | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredPayments = payments.filter((payment: any) => {
    const matchesSearch =
      payment.order?.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.utr_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.order?.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      payment.verification_status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleVerify = async (orderId: string, proofId: string, isApproved: boolean) => {
    let reason = "";
    if (!isApproved) {
      reason =
        prompt("Please provide a reason for rejection (e.g. Blurred image, UTR mismatch):") ||
        "Invalid payment proof";
    }
    await verifyPayment.mutateAsync({ orderId, proofId, isApproved, rejectionReason: reason });
    setSelectedProof(null);
  };

  const handleRequestNew = async (orderId: string, proofId: string) => {
    const reason =
      prompt("Reason for requesting new screenshot:") || "Please upload a clearer screenshot.";
    await verifyPayment.mutateAsync({
      orderId,
      proofId,
      isApproved: false,
      rejectionReason: reason,
    });
    setSelectedProof(null);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
        <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment Verification</h1>
          <p className="text-neutral-500 mt-1">
            Review customer payment screenshots and approve orders.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search UTR, order, email..."
              className="w-full sm:w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="w-full sm:w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg py-2 px-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="awaiting verification">Pending Review</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
            <option value="all">All Payments</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPayments.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <CheckCircle2
              size={48}
              className="mx-auto text-neutral-300 dark:text-neutral-700 mb-4"
            />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white">All caught up!</h3>
            <p className="text-neutral-500 mt-1">No payments match your current filters.</p>
          </div>
        ) : (
          filteredPayments.map((payment: any) => (
            <div
              key={payment.id}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col hover:border-blue-500/50 transition-colors cursor-pointer"
              onClick={() => setSelectedProof(payment)}
            >
              <div className="h-48 bg-neutral-100 dark:bg-neutral-800 relative group overflow-hidden">
                <PaymentProofImage
                  src={payment.screenshot_url}
                  alt="Payment Proof"
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon className="text-white" size={32} />
                </div>
                <div className="absolute top-2 right-2">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium border backdrop-blur-md ${
                      payment.verification_status === "verified"
                        ? "bg-emerald-500/20 text-emerald-100 border-emerald-500/30"
                        : payment.verification_status === "rejected"
                          ? "bg-rose-500/20 text-rose-100 border-rose-500/30"
                          : "bg-amber-500/20 text-amber-100 border-amber-500/30"
                    }`}
                  >
                    {payment.verification_status}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold">{payment.order?.order_number}</div>
                  <div className="font-bold text-blue-600 dark:text-blue-400">
                    ₹{payment.order?.total}
                  </div>
                </div>
                <div className="text-xs text-neutral-500 mb-1">
                  UTR:{" "}
                  <span className="text-neutral-900 dark:text-neutral-200 font-medium">
                    {payment.utr_number}
                  </span>
                </div>
                <div className="text-xs text-neutral-500 mb-4">
                  {new Date(payment.uploaded_at).toLocaleString()}
                </div>

                {payment.verification_status === "pending" && (
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerify(payment.order_id, payment.id, true);
                      }}
                      className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 py-2 rounded-lg text-xs font-medium transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerify(payment.order_id, payment.id, false);
                      }}
                      className="bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 py-2 rounded-lg text-xs font-medium transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {selectedProof && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProof(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-neutral-900 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
            >
              {/* Image Viewer */}
              <div className="flex-1 bg-black relative flex items-center justify-center p-4">
                <PaymentProofImage
                  src={selectedProof.screenshot_url}
                  alt="Payment Proof"
                  className="max-w-full max-h-full object-contain cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                  onClick={() => setIsFullscreen(true)}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <a
                    href={selectedProof.screenshot_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-md transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink size={20} />
                  </a>
                  <a
                    href={selectedProof.screenshot_url}
                    download={`UTR_${selectedProof.utr_number}.png`}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-md transition-colors"
                    title="Download"
                  >
                    <Download size={20} />
                  </a>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="w-full md:w-96 flex flex-col border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                  <h3 className="font-bold text-lg">Payment Details</h3>
                  <button
                    onClick={() => setSelectedProof(null)}
                    className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">
                      Status
                    </div>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs uppercase tracking-widest font-medium border ${
                        selectedProof.verification_status === "verified"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : selectedProof.verification_status === "rejected"
                            ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      }`}
                    >
                      {selectedProof.verification_status}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">
                      Order Total
                    </div>
                    <div className="text-3xl font-bold text-neutral-900 dark:text-white">
                      ₹{selectedProof.order?.total}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                      <div>
                        <div className="text-xs text-neutral-500 mb-1">Order Number</div>
                        <div className="font-medium">{selectedProof.order?.order_number}</div>
                      </div>
                      <div>
                        <div className="text-xs text-neutral-500 mb-1">UTR Number</div>
                        <div className="font-medium font-mono">{selectedProof.utr_number}</div>
                      </div>
                      <div>
                        <div className="text-xs text-neutral-500 mb-1">Submitted</div>
                        <div className="text-sm">
                          {new Date(selectedProof.uploaded_at).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                        Customer
                      </div>
                      <div className="text-sm">
                        <div>{selectedProof.order?.shipping_addresses?.[0]?.full_name}</div>
                        <div className="text-neutral-500">
                          {selectedProof.order?.profiles?.email}
                        </div>
                        <div className="text-neutral-500">
                          {selectedProof.order?.shipping_addresses?.[0]?.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedProof.verification_status === "pending" && (
                  <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                    <button
                      onClick={() => handleVerify(selectedProof.order_id, selectedProof.id, true)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-3 font-medium transition-colors"
                    >
                      Approve Payment
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          handleVerify(selectedProof.order_id, selectedProof.id, false)
                        }
                        className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 rounded-lg py-2 text-sm font-medium transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleRequestNew(selectedProof.order_id, selectedProof.id)}
                        className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 rounded-lg py-2 text-sm font-medium transition-colors"
                      >
                        Request New Image
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <FullscreenViewer
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        src={selectedProof?.screenshot_url || ""}
        downloadName={selectedProof ? `UTR_${selectedProof.utr_number}.png` : undefined}
      />
    </div>
  );
}
