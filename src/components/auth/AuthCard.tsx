import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
      className={`relative w-full max-w-md rounded-[22px] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {/* Ambient golden glow behind card */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-[22px] bg-[color:var(--gold)]/5 blur-2xl" />

      {/* Staggered children container */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
            },
          },
        }}
        className="flex flex-col"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
