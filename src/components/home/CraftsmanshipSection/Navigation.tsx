import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationProps {
  onPrev: () => void;
  onNext: () => void;
  isPaused: boolean;
  setIsPaused: (v: boolean) => void;
}

export function Navigation({ onPrev, onNext, isPaused, setIsPaused }: NavigationProps) {
  return (
    <div 
      className="flex items-center gap-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <button
        onClick={onPrev}
        className="group flex items-center gap-3 text-sm uppercase tracking-widest text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--gold)]"
        aria-label="Previous slide"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] transition-colors group-hover:border-[color:var(--gold)]">
          <ArrowLeft className="h-4 w-4" />
        </div>
        <span className="hidden md:block">Previous</span>
      </button>

      <div className="h-px w-12 bg-[color:var(--border)] md:w-24" />

      <button
        onClick={onNext}
        className="group flex items-center gap-3 text-sm uppercase tracking-widest text-[color:var(--foreground)] transition-colors hover:text-[color:var(--gold)]"
        aria-label="Next slide"
      >
        <span className="hidden md:block">Next</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--gold)] text-[color:var(--background)] transition-transform group-hover:scale-105 shadow-md">
          <ArrowRight className="h-4 w-4" />
        </div>
      </button>
    </div>
  );
}
