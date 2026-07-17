import { useState } from "react";
import { Star, CheckCircle2 } from "lucide-react";
import { SplitText } from "../immersive/SplitText";
import { motion, AnimatePresence } from "framer-motion";
import { ReviewComposer } from "./ReviewComposer";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";

interface CustomerReviewsProps {
  productName: string;
  productId: string;
}

export function CustomerReviews({ productName, productId }: CustomerReviewsProps) {
  const [sort, setSort] = useState("Newest");
  const [visibleCount, setVisibleCount] = useState(3);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useAuth();

  const { reviews, isLoading, submitReview } = useReviews(productId);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, reviews.length));
  };

  const handleReviewSubmit = async (rating: number, content: string) => {
    if (!user) {
      alert("Please log in to submit a review.");
      return;
    }

    try {
      await submitReview.mutateAsync({
        rating,
        comment: content,
        userId: user.id,
      });
      alert("Thank you for your review! It has been submitted for moderation.");
    } catch (e) {
      alert("Failed to submit review. Please try again.");
    }
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === "Newest")
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sort === "Highest Rated") return b.rating - a.rating;
    if (sort === "Lowest Rated") return a.rating - b.rating;
    return 0;
  });

  return (
    <section id="reviews" className="py-24 border-t border-[color:var(--border)]">
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
          className={`grid md:grid-cols-[300px_1fr] gap-16 ${!isMobileOpen ? "hidden md:grid" : ""}`}
        >
          {/* Summary */}
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
                    <Star key={s} className="h-4 w-4 fill-[color:var(--gold)]" />
                  ))}
                </div>
                <div className="text-sm text-[color:var(--muted-foreground)]">
                  Based on {reviews.length} reviews
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-sm">
                    <div className="w-12 text-[color:var(--muted-foreground)]">{star} Stars</div>
                    <div className="flex-1 h-1.5 bg-[color:var(--muted)]/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[color:var(--gold)] rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review List */}
          <div>
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[color:var(--border)]">
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

            <div className="space-y-10">
              <AnimatePresence>
                {sortedReviews.slice(0, visibleCount).map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="group"
                  >
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
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">
                            {review.profiles?.full_name || "Anonymous"}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-green-600/80">
                            <CheckCircle2 className="h-3 w-3" /> Verified Buyer
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-[color:var(--muted-foreground)]">
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-[color:var(--muted-foreground)] mb-4 max-w-2xl mt-4">
                      {review.comment}
                    </p>
                  </motion.div>
                ))}
                {reviews.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-sm text-[color:var(--muted-foreground)]">
                    No reviews yet. Be the first to share your experience.
                  </div>
                )}
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
                className="mt-12 w-full py-4 rounded-full border border-[color:var(--border)] text-sm uppercase tracking-widest transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
              >
                Load More Reviews
              </button>
            )}

            <ReviewComposer productName={productName} onSubmit={handleReviewSubmit} />
          </div>
        </div>
      </div>
    </section>
  );
}
