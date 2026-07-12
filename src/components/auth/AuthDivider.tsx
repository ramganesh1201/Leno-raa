import { motion } from "framer-motion";

export function AuthDivider() {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      className="my-8 flex items-center justify-center space-x-4"
    >
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
        or continue with email
      </span>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </motion.div>
  );
}
