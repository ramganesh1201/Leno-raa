import { Star, CheckCircle2 } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  count: number;
  onReviewsClick: () => void;
}

export function RatingStars({ rating, count, onReviewsClick }: RatingStarsProps) {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-4 mt-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(rating)
                ? "fill-[color:var(--gold)] text-[color:var(--gold)]"
                : "fill-transparent text-[color:var(--border)]"
            }`}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="font-medium">{rating.toFixed(1)}</span>
        <button
          onClick={onReviewsClick}
          className="text-[color:var(--muted-foreground)] underline decoration-[color:var(--border)] underline-offset-4 transition hover:text-[color:var(--gold)] hover:decoration-[color:var(--gold)]"
        >
          ({count} Review{count === 1 ? "" : "s"})
        </button>
      </div>
    </div>
  );
}
