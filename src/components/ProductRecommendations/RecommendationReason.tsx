import type { RecommendationResult } from "@/lib/recommendations";

interface RecommendationReasonProps {
  result: RecommendationResult;
}

export function RecommendationReason({ result }: RecommendationReasonProps) {
  const { score, sharedConcerns, sharedSkinTypes, product } = result;

  // If score is low or no specific strong match, show generic
  if (score === 0 || (!sharedConcerns.length && !sharedSkinTypes)) {
    return (
      <div className="mt-3 text-xs leading-relaxed text-[color:var(--muted-foreground)]">
        Suitable for similar skin needs
      </div>
    );
  }

  return (
    <div className="mt-3 text-[11px] leading-relaxed text-[color:var(--muted-foreground)] border-t border-[color:var(--border)]/30 pt-3">
      {sharedConcerns.length > 0 && (
        <div className="mb-1">
          <span className="font-medium text-[color:var(--foreground)]/70">Shared concerns:</span>{" "}
          {sharedConcerns.join(", ")}
        </div>
      )}
      {sharedSkinTypes && product.skinType && (
        <div>
          Recommended for <span className="text-[color:var(--gold)]">{product.skinType}</span>
        </div>
      )}
    </div>
  );
}
