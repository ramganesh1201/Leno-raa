import { motion } from "framer-motion";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AuthInput({ label, error, className = "", value, onChange, ...props }: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== "";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      className="relative mb-5"
    >
      <div
        className={`relative rounded-xl border bg-white/[0.03] transition-all duration-300 ease-out ${
          error
            ? "border-red-400/30 bg-red-400/5"
            : isFocused
              ? "border-[color:var(--gold)]/50 bg-white/[0.05] shadow-[0_0_15px_rgba(212,175,55,0.1)]"
              : "border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
        }`}
      >
        {/* Floating Label */}
        <label
          className={`pointer-events-none absolute left-4 transition-all duration-300 ease-out ${
            isFocused || hasValue
              ? "top-2 text-[10px] uppercase tracking-wider text-[color:var(--muted-foreground)]"
              : "top-1/2 -translate-y-1/2 text-sm text-[color:var(--muted-foreground)]"
          }`}
        >
          {label}
        </label>

        <input
          value={value}
          onChange={onChange}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`w-full bg-transparent px-4 pb-2 pt-6 text-sm text-[color:var(--foreground)] outline-none transition-opacity duration-300 ${
            isFocused || hasValue ? "opacity-100" : "opacity-0"
          } ${className}`}
          {...props}
        />
      </div>

      {/* Error state */}
      <motion.div
        initial={false}
        animate={{ opacity: error ? 1 : 0, height: error ? "auto" : 0 }}
        className="overflow-hidden"
      >
        <div className="mt-1.5 flex items-center space-x-1.5 px-1 text-xs text-red-400/80">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
