import { useState } from "react";
import { Star, ThumbsUp, CheckCircle2 } from "lucide-react";
import { SplitText } from "../immersive/SplitText";
import { motion, AnimatePresence } from "framer-motion";
import { ReviewComposer } from "./ReviewComposer";

interface CustomerReviewsProps {
  productName: string;
}

export function CustomerReviews({ productName }: CustomerReviewsProps) {
  const [sort, setSort] = useState("Most Helpful");
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Mock Reviews
  const reviews = [
    {
      id: 1,
      name: "Eleanor V.",
      rating: 5,
      date: "2 weeks ago",
      verified: true,
      title: "Absolutely transformative",
      content: `I've been using the ${productName} bar for a month now. The lather is incredibly rich and it doesn't strip my skin at all. The fragrance fills my bathroom even when I'm not using it.`,
      helpful: 24,
    },
    {
      id: 2,
      name: "Marcus T.",
      rating: 5,
      date: "1 month ago",
      verified: true,
      title: "Premium quality",
      content: "You can feel the craftsmanship. It lasts much longer than typical artisan soaps and the packaging was beautiful.",
      helpful: 12,
    },
    {
      id: 3,
      name: "Sarah M.",
      rating: 4,
      date: "2 months ago",
      verified: true,
      title: "Lovely scent, very gentle",
      content: "Very gentle on my sensitive skin. Leaves a subtle scent that isn't overpowering.",
      helpful: 5,
    },
    {
      id: 4,
      name: "Jessica P.",
      rating: 5,
      date: "3 months ago",
      verified: true,
      title: "Worth every penny",
      content: "I was hesitant about the price, but this soap is on another level. The texture and the way it leaves my skin feeling is unmatched.",
      helpful: 8,
    },
    {
      id: 5,
      name: "David L.",
      rating: 5,
      date: "3 months ago",
      verified: false,
      title: "Incredible aroma",
      content: "The scent profile is so complex and natural. It doesn't smell artificial at all. Will definitely be repurchasing.",
      helpful: 2,
    }
  ];

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 2, reviews.length));
      setIsLoadingMore(false);
    }, 1500); // Simulate network delay
  };

  const handleReviewSubmit = () => {
    // In a real app, we'd add the new review to the top of the list
    alert("Thank you for your review! It has been submitted for moderation.");
  };

  return (
    <section id="reviews" className="py-24 border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid md:grid-cols-[300px_1fr] gap-16">
          
          {/* Summary */}
          <div>
            <SplitText as="h2" text="Customer Reviews" className="text-display text-3xl mb-6" />
            <div className="flex items-end gap-4 mb-8">
              <div className="text-6xl font-serif text-[color:var(--gold)]">4.8</div>
              <div className="pb-2">
                <div className="flex text-[color:var(--gold)] mb-1">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4 fill-[color:var(--gold)]" />)}
                </div>
                <div className="text-sm text-[color:var(--muted-foreground)]">Based on 248 reviews</div>
              </div>
            </div>
            
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <div className="w-12 text-[color:var(--muted-foreground)]">{star} Stars</div>
                  <div className="flex-1 h-1.5 bg-[color:var(--muted)]/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[color:var(--gold)] rounded-full"
                      style={{ width: star === 5 ? "85%" : star === 4 ? "12%" : star === 3 ? "3%" : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review List */}
          <div>
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[color:var(--border)]">
              <div className="text-sm font-medium">248 Reviews</div>
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-sm text-[color:var(--muted-foreground)] outline-none cursor-pointer focus:text-[color:var(--gold)]"
              >
                <option>Most Helpful</option>
                <option>Newest</option>
                <option>Highest Rated</option>
                <option>Lowest Rated</option>
              </select>
            </div>

            <div className="space-y-10">
              <AnimatePresence>
                {reviews.slice(0, visibleCount).map((review) => (
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
                            <Star key={s} className={`h-3 w-3 ${s <= review.rating ? "fill-[color:var(--gold)]" : "fill-transparent text-[color:var(--border)]"}`} />
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{review.name}</span>
                          {review.verified && (
                            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-green-600/80">
                              <CheckCircle2 className="h-3 w-3" /> Verified
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-[color:var(--muted-foreground)]">{review.date}</div>
                    </div>
                    <h4 className="font-serif text-lg mb-2">{review.title}</h4>
                    <p className="text-sm leading-relaxed text-[color:var(--muted-foreground)] mb-4 max-w-2xl">
                      {review.content}
                    </p>
                    <button className="flex items-center gap-2 text-xs text-[color:var(--muted-foreground)] transition hover:text-[color:var(--gold)]">
                      <ThumbsUp className="h-3 w-3" /> Helpful ({review.helpful})
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Skeleton Loaders */}
              {isLoadingMore && (
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
                      <div className="h-6 w-48 bg-[color:var(--muted)]/50 rounded mb-2" />
                      <div className="space-y-2 mb-4">
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
                disabled={isLoadingMore}
                className="mt-12 w-full py-4 rounded-full border border-[color:var(--border)] text-sm uppercase tracking-widest transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] disabled:opacity-50"
              >
                {isLoadingMore ? "Loading..." : "Load More Reviews"}
              </button>
            )}

            <ReviewComposer productName={productName} onSubmit={handleReviewSubmit} />
          </div>
        </div>
      </div>
    </section>
  );
}
