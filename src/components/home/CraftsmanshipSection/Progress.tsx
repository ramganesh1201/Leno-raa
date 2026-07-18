import { motion } from "framer-motion";

interface ProgressProps {
  currentIndex: number;
  total: number;
  duration: number; // in ms
  isPaused: boolean;
}

export function Progress({ currentIndex, total, duration, isPaused }: ProgressProps) {
  return (
    <div className="w-full max-w-[200px]">
      <div className="flex justify-between text-xs tracking-widest text-[color:var(--muted-foreground)] mb-3 font-medium">
        <span>0{currentIndex + 1}</span>
        <span>0{total}</span>
      </div>
      <div className="h-0.5 w-full bg-[color:var(--border)] overflow-hidden relative">
        <motion.div
          key={currentIndex}
          initial={{ width: "0%" }}
          animate={{ width: isPaused ? "auto" : "100%" }}
          transition={{ 
            duration: duration / 1000, 
            ease: "linear",
          }}
          className="h-full bg-[color:var(--gold)] absolute top-0 left-0"
        />
      </div>
    </div>
  );
}
