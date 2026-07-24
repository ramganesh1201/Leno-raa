import { useState } from "react";
import { Star, CheckCircle2, Clock, Trash2, Edit2 } from "lucide-react";
import { SplitText } from "../immersive/SplitText";
import { motion, AnimatePresence } from "framer-motion";
import { ReviewComposer, ReviewSubmitData } from "./ReviewComposer";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";
import { createPortal } from "react-dom";
import { resolveImageUrl } from "@/lib/imageResolver";

interface CustomerReviewsProps {
  productName: string;
  productId: string;
}

export function CustomerReviews({ productName, productId }: CustomerReviewsProps) {
  const [sort, setSort] = useState("Newest");
  const [visibleCount, setVisibleCount] = useState(3);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { reviews, isLoading, submitReview, editReview, deleteReview } = useReviews(productId);

  const approvedReviews = reviews.filter(r => r.status === "approved");

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, reviews.length));
  };

  const handleReviewSubmit = async (data: ReviewSubmitData) => {
    if (!user) {
      alert("Please log in to submit a review.");
      return;
    }
    try {
      await submitReview.mutateAsync({
        ...data,
        userId: user.id,
      });
      alert("Thank you for your review! It has been submitted for moderation.");
    } catch (e) {
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleReviewEdit = async (reviewId: string, data: ReviewSubmitData) => {
    if (!user) return;
    try {
      await editReview.mutateAsync({
        id: reviewId,
        userId: user.id,
        rating: data.rating,
        title: data.title,
        review_text: data.review_text,
        is_anonymous: data.is_anonymous,
        existing_images: data.existing_images || [],
        new_images: data.images,
      });
      setEditingReviewId(null);
      alert("Review updated and submitted for moderation.");
    } catch (e) {
      alert("Failed to update review. Please try again.");
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Delete this review? This action cannot be undone.")) return;
    
    setIsDeleting(reviewId);
    try {
      await deleteReview.mutateAsync(reviewId);
    } catch (e) {
      alert("Failed to delete review. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Calculate average rating strictly from approved reviews
  const averageRating =
    approvedReviews.length > 0
      ? (approvedReviews.reduce((acc, curr) => acc + curr.rating, 0) / approvedReviews.length).toFixed(1)
      : "0.0";

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    // Keep pending reviews at the top for the user
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (b.status === 'pending' && a.status !== 'pending') return 1;
    
    if (sort === "Newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sort === "Highest Rated") return b.rating - a.rating;
    if (sort === "Lowest Rated") return a.rating - b.rating;
    return 0;
  });

  return (
    <section id="reviews" className="py-16 md:py-24 border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div
          className="md:hidden flex justify-between items-center mb-6 cursor-pointer border-b border-[color:var(--border)] pb-4"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <SplitText as="h2" text="Customer Reviews" className="text-display text-3xl" />
          <span
            className="text-2xl transition-transform duration-300"
            style={{ transform: isMobileOpen ? "rotate(180deg)" : "none" }}
          >
            +
          </span>
        </div>
        <div
          className={`grid md:grid-cols-[300px_1fr] gap-10 md:gap-16 ${!isMobileOpen ? "hidden md:grid" : ""}`}
        >
          {/* Summary */}
          {approvedReviews.length > 0 ? (
            <div>
              <SplitText
                as="h2"
                text="Customer Reviews"
                className="text-display text-3xl mb-6 hidden md:block"
              />
              <div className="flex items-end gap-4 mb-8">
                <div className="text-6xl font-serif text-[color:var(--gold)]">{averageRating}</div>
                <div className="pb-2">
                  <div className="flex text-[color:var(--gold)] mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-4 w-4 ${s <= Math.round(Number(averageRating)) ? "fill-[color:var(--gold)] text-[color:var(--gold)]" : "fill-transparent text-[color:var(--border)]"}`} />
                    ))}
                  </div>
                  <div className="text-sm text-[color:var(--muted-foreground)]">
                    Based on {approvedReviews.length} review{approvedReviews.length === 1 ? "" : "s"}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = approvedReviews.filter((r) => Math.round(r.rating) === star).length;
                  const percentage = approvedReviews.length > 0 ? (count / approvedReviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-sm">
                      <div className="w-12 text-[color:var(--muted-foreground)]">{star} Stars</div>
                      <div className="flex-1 h-1.5 bg-[color:var(--muted)]/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[color:var(--gold)] rounded-full transition-all duration-1000"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <SplitText
                as="h2"
                text="Customer Reviews"
                className="text-display text-3xl mb-6 hidden md:block"
              />
              <div className="text-[color:var(--muted-foreground)] py-8 border border-[color:var(--border)] rounded-2xl p-6 md:p-8 bg-[color:var(--muted)]/10 text-center md:text-left">
                <p className="text-xl font-serif mb-3 text-[color:var(--foreground)]">Be the first to share your experience.</p>
                <p className="text-sm leading-relaxed mb-6 max-w-sm mx-auto md:mx-0">Your insights help the Lenoraa community discover the magic of our products.</p>
                <button 
                  onClick={() => document.getElementById('review-composer')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-xs uppercase tracking-widest text-[color:var(--gold)] font-medium hover:text-[color:var(--foreground)] transition-colors"
                >
                  Write a Review →
                </button>
              </div>
            </div>
          )}

          {/* Review List */}
          <div>
            <div className="flex justify-between items-center mb-6 md:mb-8 pb-4 border-b border-[color:var(--border)]">
              <div className="text-sm font-medium">{reviews.length} Reviews</div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-sm text-[color:var(--muted-foreground)] outline-none cursor-pointer focus:text-[color:var(--gold)]"
              >
                <option>Newest</option>
                <option>Highest Rated</option>
                <option>Lowest Rated</option>
              </select>
            </div>

            <div className="space-y-8 md:space-y-10">
              <AnimatePresence mode="popLayout">
                {sortedReviews.slice(0, visibleCount).map((review) => (
                  <motion.div
                    key={review.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className={`group ${isDeleting === review.id ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {editingReviewId === review.id ? (
                       <ReviewComposer 
                          onSubmit={(data) => handleReviewEdit(review.id, data)}
                          initialData={review}
                          onCancel={() => setEditingReviewId(null)}
                       />
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex text-[color:var(--gold)] mb-2">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`h-3 w-3 ${s <= review.rating ? "fill-[color:var(--gold)]" : "fill-transparent text-[color:var(--border)]"}`}
                                />
                              ))}
                            </div>
                            <div className="flex items-center flex-wrap gap-2 text-sm">
                              <span className="font-medium">
                                {!review.is_anonymous 
                                  ? (review.profiles?.full_name || review.profiles?.email?.split('@')[0] || (review.verified_purchase ? "Verified Customer" : "Customer"))
                                  : "Anonymous"}
                              </span>
                              {review.verified_purchase && (
                                <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-green-600/80">
                                  <CheckCircle2 className="h-3 w-3" /> Verified Buyer
                                </span>
                              )}
                              {review.status === 'pending' && user?.id === review.user_id && (
                                <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[color:var(--gold)] ml-2 bg-[color:var(--gold)]/10 px-2 py-0.5 rounded-full">
                                  <Clock className="h-3 w-3" /> Pending Approval
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-xs text-[color:var(--muted-foreground)]">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                            
                            {user?.id === review.user_id && review.status !== 'pending' && (
                              <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                  onClick={() => setEditingReviewId(review.id)}
                                  className="p-2 -m-2 text-[color:var(--muted-foreground)] hover:text-[color:var(--gold)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                  title="Edit Review"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(review.id)}
                                  className="p-2 -m-2 text-[color:var(--muted-foreground)] hover:text-red-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                  title="Delete Review"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {review.title && (
                          <h4 className="font-serif text-lg text-[color:var(--foreground)] mb-1 mt-2 pr-12">
                            {review.title}
                          </h4>
                        )}
                        <p className="text-sm leading-relaxed text-[color:var(--muted-foreground)] mb-2 md:mb-4 max-w-2xl mt-1">
                          {review.review_text}
                        </p>

                        {review.review_images && review.review_images.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {review.review_images.map((img, i) => (
                              <button 
                                key={i} 
                                onClick={() => setFullscreenImage(resolveImageUrl(img))} 
                                className="w-16 h-16 rounded-md overflow-hidden border border-[color:var(--border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--gold)]"
                              >
                                <img src={resolveImageUrl(img)} alt="Review attachment" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <div className="space-y-10 animate-pulse">
                  {[1, 2].map((i) => (
                    <div key={`skel-${i}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="h-3 w-20 bg-[color:var(--muted)]/50 rounded mb-2" />
                          <div className="h-4 w-32 bg-[color:var(--muted)]/50 rounded" />
                        </div>
                        <div className="h-3 w-16 bg-[color:var(--muted)]/50 rounded" />
                      </div>
                      <div className="space-y-2 mb-4 mt-4">
                        <div className="h-4 w-full max-w-2xl bg-[color:var(--muted)]/50 rounded" />
                        <div className="h-4 w-3/4 bg-[color:var(--muted)]/50 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {visibleCount < reviews.length && (
              <button
                onClick={handleLoadMore}
                className="mt-8 md:mt-12 w-full py-4 min-h-[44px] rounded-full border border-[color:var(--border)] text-sm uppercase tracking-widest transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
              >
                Load More Reviews
              </button>
            )}

            <div id="review-composer">
              <ReviewComposer productName={productName} onSubmit={handleReviewSubmit} />
            </div>
          </div>
        </div>
      </div>

      {fullscreenImage &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90">
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-6 right-6 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors min-h-[44px] min-w-[44px]"
            >
              <CheckCircle2 className="h-6 w-6 opacity-0 hidden" />
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <img
                src={fullscreenImage}
                alt="Fullscreen Review"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
