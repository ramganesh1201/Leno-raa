import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StickyPurchasePanelProps {
  productName: string;
  price: number;
  onAdd: () => void;
  onBuyNow: () => void;
  image?: string;
}

export function StickyPurchasePanel({
  productName,
  price,
  onAdd,
  onBuyNow,
  image,
}: StickyPurchasePanelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show panel when scrolled past ~800px (approximate hero height)
      if (window.scrollY > 800) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-[color:var(--border)] bg-[color:var(--background)]/85 px-4 md:px-4 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] backdrop-blur-2xl md:bottom-auto md:top-0 md:border-b md:border-t-0 md:shadow-[0_10px_40px_rgba(0,0,0,0.05)] md:pb-4 md:backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-2 md:px-12">
            <div className="hidden md:flex items-center gap-4">
              {image && (
                <img src={image} alt={productName} className="h-12 w-12 rounded-md object-cover" />
              )}
              <div>
                <div className="font-serif text-lg">{productName}</div>
                <div className="text-xs text-[color:var(--muted-foreground)]">₹{price}</div>
              </div>
            </div>

            <div className="flex w-full gap-3 md:w-auto items-center">
              <div className="md:hidden flex flex-col mr-2 w-1/3">
                <span className="text-[10px] text-[color:var(--muted-foreground)] uppercase tracking-widest">Total</span>
                <span className="text-xl">₹{price}</span>
              </div>
              <button
                onClick={onAdd}
                className="flex-1 rounded-full border border-[color:var(--border)] bg-transparent px-2 py-3 md:px-6 md:py-3 text-[11px] md:text-xs uppercase tracking-widest transition hover:border-[color:var(--foreground)] md:flex-none whitespace-nowrap"
              >
                Add to Bag
              </button>
              <button
                onClick={onBuyNow}
                className="flex-1 rounded-full bg-[color:var(--gold)] px-2 py-3 md:px-8 md:py-3 text-[11px] md:text-xs uppercase tracking-widest text-white transition hover:bg-yellow-600 md:flex-none whitespace-nowrap shadow-lg md:shadow-none"
              >
                Buy Now
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
