
import { Heart, ShoppingBag, CreditCard } from "lucide-react";
import { useState } from "react";

interface ProductActionsProps {
  onAdd: () => void;
  onSave: () => void;
  isSaved: boolean;
  onBuyNow: () => void;
  isAdding?: boolean;
  isSaving?: boolean;
}

export function ProductActions({
  onAdd,
  onSave,
  isSaved,
  onBuyNow,
  isAdding,
  isSaving,
}: ProductActionsProps) {
  const [buying, setBuying] = useState(false);

  const handleAdd = () => {
    onAdd();
  };

  const handleBuyNow = () => {
    setBuying(true);
    setTimeout(() => {
      onBuyNow();
      setBuying(false);
    }, 800); // Simulate processing
  };

  return (
    <div className="mt-8 flex flex-col gap-4 w-full">
      <div className="flex gap-3 w-full">
        <button
          onClick={handleAdd}
          disabled={isAdding}
          className="relative flex-1 flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-[color:var(--foreground)] text-sm uppercase tracking-widest text-[color:var(--background)] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-80 disabled:hover:scale-100"
        >
          {isAdding ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[color:var(--background)]/20 border-t-[color:var(--background)]" />
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" /> Add to Bag
            </span>
          )}
        </button>

        <button
          onClick={onSave}
          disabled={isSaving}
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] bg-transparent transition-all hover:border-[color:var(--gold)] disabled:opacity-50 ${
            isSaved
              ? "text-red-500 border-red-500/30 bg-red-500/5"
              : "text-[color:var(--foreground)]"
          }`}
        >
          <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      <button
        onClick={handleBuyNow}
        disabled={buying}
        className="relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[color:var(--gold)] text-sm uppercase tracking-widest text-white shadow-lg shadow-[color:var(--gold)]/20 transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
      >
        {buying ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        ) : (
          <span className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Buy Now
          </span>
        )}
      </button>

      {/* Delivery Info */}
      <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-2 text-[11px] uppercase tracking-wider text-[color:var(--muted-foreground)] opacity-80">
        <span className="flex items-center gap-2">
          <span className="text-[color:var(--gold)]">✓</span> Free Shipping
        </span>
        <span className="flex items-center gap-2">
          <span className="text-[color:var(--gold)]">✓</span> Delivery in 2–4 Days
        </span>
        <span className="flex items-center gap-2">
          <span className="text-[color:var(--gold)]">✓</span> Easy Returns
        </span>
        <span className="flex items-center gap-2">
          <span className="text-[color:var(--gold)]">✓</span> Secure Payment
        </span>
      </div>
    </div>
  );
}
