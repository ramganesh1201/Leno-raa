import { motion } from "framer-motion";

export function ProductSkeleton() {
  return (
    <div className="relative pt-32 pb-24">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:grid-cols-2 md:px-12">
        {/* Gallery Skeleton */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
            className="aspect-[4/5] md:aspect-square w-full rounded-[24px] bg-[color:var(--muted)]/50"
          />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 0.7 }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  repeatType: "reverse",
                  delay: i * 0.1,
                }}
                className="h-20 w-20 shrink-0 rounded-[12px] bg-[color:var(--muted)]/50"
              />
            ))}
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="mt-8 md:mt-0 space-y-8">
          <div className="space-y-4">
            <div className="h-4 w-24 rounded bg-[color:var(--muted)]/50" />
            <div className="h-10 w-3/4 rounded bg-[color:var(--muted)]/50" />
            <div className="h-6 w-1/2 rounded bg-[color:var(--muted)]/50" />
          </div>

          <div className="h-24 w-full rounded-2xl bg-[color:var(--muted)]/50" />

          <div className="space-y-4">
            <div className="h-14 w-full rounded-full bg-[color:var(--muted)]/50" />
            <div className="h-14 w-full rounded-full bg-[color:var(--muted)]/50" />
          </div>

          <div className="space-y-6 pt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-full border-b border-[color:var(--border)]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
