import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { useState } from "react";
import { Check } from "lucide-react";

interface AuthButtonProps extends HTMLMotionProps<"button"> {
  isLoading?: boolean;
  isSuccess?: boolean;
  loadingText?: string;
  successText?: string;
  children: React.ReactNode;
}

export function AuthButton({
  isLoading,
  isSuccess,
  loadingText = "Entering your atelier",
  successText = "Welcome Back",
  children,
  className = "",
  disabled,
  ...props
}: AuthButtonProps) {
  return (
    <motion.button
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ scale: disabled || isLoading || isSuccess ? 1 : 1.01 }}
      whileTap={{ scale: disabled || isLoading || isSuccess ? 1 : 0.98 }}
      disabled={disabled || isLoading || isSuccess}
      className={`relative mt-8 flex w-full items-center justify-center overflow-hidden rounded-full bg-[color:var(--foreground)] px-8 py-3.5 text-sm tracking-wide text-[color:var(--background)] transition-all duration-300 ease-out disabled:opacity-70 ${className}`}
      {...props}
    >
      {/* Subtle hover light sweep */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out hover:translate-x-full" />

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-2"
          >
            <Check className="h-4 w-4" />
            <span>{successText}</span>
          </motion.div>
        ) : isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-3"
          >
            {/* Very thin premium circular loader */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="h-4 w-4 rounded-full border-[1px] border-[color:var(--background)]/20 border-t-[color:var(--background)]"
            />
            <span>{loadingText}</span>
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
