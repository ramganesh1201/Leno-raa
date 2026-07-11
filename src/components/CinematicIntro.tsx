import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import heroIntro from "@/assets/hero-intro.jpg";

const KEY = "lenoraa-intro-seen";

export function CinematicIntro() {
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem(KEY);
    if (!seen) setVisible(true);
    setReady(true);
    if (!seen) {
      const t = setTimeout(() => {
        sessionStorage.setItem(KEY, "1");
        setVisible(false);
      }, 4800);
      return () => clearTimeout(t);
    }
  }, []);

  if (!ready) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0a0906] text-[color:var(--ivory)]"
        >
          <motion.img
            src={heroIntro}
            alt=""
            aria-hidden
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.55 }}
            transition={{ duration: 4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0906]/70 via-transparent to-[#0a0906]/90" />

          {/* Drifting particles */}
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50, x: Math.random() * window.innerWidth }}
              animate={{
                opacity: [0, 0.9, 0],
                y: -window.innerHeight * 0.6,
              }}
              transition={{
                duration: 5 + Math.random() * 4,
                delay: Math.random() * 2,
                repeat: Infinity,
              }}
              className="absolute bottom-0 h-1 w-1 rounded-full bg-[color:var(--gold-soft,#e6c98a)]"
              style={{ boxShadow: "0 0 12px currentColor" }}
            />
          ))}

          <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.5em" }}
              transition={{ duration: 2.2, delay: 1 }}
              className="text-eyebrow text-[color:var(--gold-soft,#e6c98a)]"
            >
              Est. Nature
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, delay: 1.4 }}
              className="text-display text-6xl sm:text-8xl md:text-9xl"
            >
              Lenoraa
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ duration: 1.4, delay: 2.6 }}
              className="text-sm tracking-[0.35em] uppercase text-white/70"
            >
              Nature Crafted Into Luxury
            </motion.p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 3.6 }}
              onClick={() => {
                sessionStorage.setItem(KEY, "1");
                setVisible(false);
              }}
              className="mt-6 text-xs tracking-[0.4em] uppercase text-white/50 transition hover:text-[color:var(--gold-soft,#e6c98a)]"
            >
              Enter the world
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
