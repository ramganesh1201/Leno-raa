import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Star,
  ThumbsUp,
  MessageSquare,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  BadgeCheck,
} from "lucide-react";
import { useAdminReviews } from "@/hooks/useReviews";

export const Route = createFileRoute("/admin/reviews")({
  component: AdminReviewsPage,
});

function AdminReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  const { reviews, isLoading, updateReviewStatus, deleteReview } = useAdminReviews();

  const filteredReviews = (reviews || []).filter((review: any) => {
    const customerName = !review.is_anonymous
      ? review.profiles?.full_name || review.profiles?.email || "Guest"
      : "Anonymous (Guest)";
    const productName = review.products?.name || "Unknown Product";
    const comment = review.review_text || "";
    const title = review.title || "";

    const matchesSearch =
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      await updateReviewStatus.mutateAsync({ id, status });
    } catch (e: any) {
      alert("Failed to update status: " + e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview.mutateAsync(id);
      } catch (e: any) {
        alert("Failed to delete review: " + e.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Product Reviews</h1>
          <p className="text-neutral-500 mt-1">
            Moderate customer feedback and feature top reviews.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search reviews..."
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === "pending" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("approved")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === "approved" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
            >
              Approved
            </button>
            <button
              onClick={() => setStatusFilter("rejected")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === "rejected" ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
            >
              Rejected
            </button>
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === "all" ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
            >
              All
            </button>
          </div>
        </div>

        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {isLoading ? (
            <div className="p-12 text-center text-neutral-500 animate-pulse">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
              <p>Loading reviews...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="p-12 text-center text-neutral-500">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
              <p>No reviews match your filters.</p>
            </div>
          ) : (
            filteredReviews.map((review: any) => (
              <div
                key={review.id}
                className="p-6 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="w-full md:w-64 shrink-0 space-y-2">
                  <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    {!review.is_anonymous
                      ? review.profiles?.full_name || review.profiles?.email || "Guest"
                      : "Anonymous (Guest)"}
                    {review.verified_purchase && (
                      <BadgeCheck size={16} className="text-blue-500" title="Verified Purchase" />
                    )}
                  </div>
                  <div className="text-sm text-neutral-500">
                    {review.products?.name || "Unknown Product"}
                  </div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={
                          star <= review.rating
                            ? "fill-current"
                            : "text-neutral-200 dark:text-neutral-700"
                        }
                      />
                    ))}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  {review.title && (
                    <h4 className="font-semibold text-neutral-900 dark:text-white">
                      {review.title}
                    </h4>
                  )}
                  <p className="text-neutral-700 dark:text-neutral-300 italic">
                    "{review.review_text}"
                  </p>
                  
                  {review.review_images && review.review_images.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {review.review_images.map((img: string, idx: number) => (
                        <div key={idx} className="w-16 h-16 rounded border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                          <img src={img} alt="Review attachment" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex flex-wrap gap-2 w-full md:w-auto mt-4 md:mt-0">
                  {review.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(review.id, "approved")}
                        disabled={updateReviewStatus.isPending}
                        className="flex-1 md:flex-none px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <ShieldCheck size={16} /> Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(review.id, "rejected")}
                        disabled={updateReviewStatus.isPending}
                        className="flex-1 md:flex-none px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <ShieldAlert size={16} /> Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={deleteReview.isPending}
                    className="flex-1 md:flex-none p-1.5 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
