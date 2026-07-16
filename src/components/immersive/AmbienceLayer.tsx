import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/lib/store";
import type { AmbiencePreset } from "@/lib/catalog";

interface PresetConfig {
  count: number;
  minSize: number;
  maxSize: number;
  duration: [number, number];
  opacity: [number, number];
  shape: "dot" | "leaf" | "petal" | "smoke" | "steam" | "cream";
  color: string; // CSS var expression
  blur?: number;
  vertical?: boolean;
}

const PRESETS: Record<AmbiencePreset, PresetConfig> = {
  goldDust: {
    count: 18,
    minSize: 1.5,
    maxSize: 3.5,
    duration: [18, 34],
    opacity: [0.18, 0.55],
    shape: "dot",
    color: "color-mix(in oklab, var(--gold) 80%, white)",
    blur: 0.6,
  },
  pollen: {
    count: 14,
    minSize: 2,
    maxSize: 5,
    duration: [22, 40],
    opacity: [0.15, 0.5],
    shape: "dot",
    color: "color-mix(in oklab, var(--theme) 70%, white)",
    blur: 1.2,
  },
  mist: {
    count: 6,
    minSize: 260,
    maxSize: 520,
    duration: [55, 90],
    opacity: [0.05, 0.11],
    shape: "smoke",
    color: "color-mix(in oklab, var(--theme-soft) 92%, white)",
    blur: 50,
  },
  smoke: {
    count: 7,
    minSize: 220,
    maxSize: 420,
    duration: [45, 80],
    opacity: [0.06, 0.14],
    shape: "smoke",
    color: "color-mix(in oklab, var(--theme-deep) 55%, black)",
    blur: 60,
  },
  steam: {
    count: 8,
    minSize: 160,
    maxSize: 320,
    duration: [30, 55],
    opacity: [0.07, 0.16],
    shape: "steam",
    color: "color-mix(in oklab, var(--theme-soft) 92%, white)",
    blur: 40,
    vertical: true,
  },
  petals: {
    count: 12,
    minSize: 8,
    maxSize: 18,
    duration: [26, 46],
    opacity: [0.25, 0.65],
    shape: "petal",
    color: "color-mix(in oklab, var(--theme) 55%, white)",
  },
  leaves: {
    count: 10,
    minSize: 10,
    maxSize: 22,
    duration: [28, 50],
    opacity: [0.22, 0.55],
    shape: "leaf",
    color: "color-mix(in oklab, var(--theme) 60%, black)",
  },
  cream: {
    count: 9,
    minSize: 80,
    maxSize: 180,
    duration: [34, 60],
    opacity: [0.06, 0.14],
    shape: "cream",
    color: "color-mix(in oklab, var(--theme-soft) 92%, white)",
    blur: 30,
  },
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/**
 * Always-on immersive layer. Renders particles/mist/leaves based on the
 * current world ambience preset, plus a slow rotating light halo. Reads CSS
 * theme tokens so it inherits every product/collection world.
 */
export function AmbienceLayer() {
  const ambience = useTheme((s) => s.ambience);
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [density, setDensity] = useState(1);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);

    // Adaptive quality
    const cores = (navigator as { hardwareConcurrency?: number }).hardwareConcurrency ?? 4;
    const isSmall = window.innerWidth < 720;
    setDensity(cores >= 8 && !isSmall ? 1 : cores >= 4 ? 0.7 : 0.45);

    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const cfg = PRESETS[ambience];
  const items = useMemo(() => {
    if (!mounted) return [];
    const total = Math.max(3, Math.round(cfg.count * density));
    return Array.from({ length: total }, (_, i) => {
      const size = rand(cfg.minSize, cfg.maxSize);
      return {
        id: `${ambience}-${i}`,
        size,
        top: rand(-10, 100),
        left: rand(-5, 105),
        opacity: rand(cfg.opacity[0], cfg.opacity[1]),
        duration: rand(cfg.duration[0], cfg.duration[1]),
        delay: rand(0, 20),
        rotate: rand(-45, 45),
      };
    });
  }, [ambience, cfg, density, mounted]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Ambient wash — smoothly transitions between worlds */}
      <div
        className="absolute inset-0 opacity-70 transition-all duration-[1600ms] ease-out"
        style={{
          background:
            "radial-gradient(65% 45% at 12% 18%, color-mix(in oklab, var(--theme-soft) 65%, transparent), transparent 70%), radial-gradient(55% 45% at 88% 92%, color-mix(in oklab, var(--theme) 22%, transparent), transparent 70%)",
        }}
      />
      {/* Time-of-day tint layered on top — subtle and always present */}
      <div
        className="absolute inset-0 transition-all duration-[2400ms] ease-out"
        style={{
          background:
            "linear-gradient(180deg, var(--tod-wash) 0%, transparent 55%), radial-gradient(80% 50% at 50% 100%, var(--tod-tint), transparent 70%)",
        }}
      />
      {/* Slow rotating light halo */}
      <div
        className="absolute -left-[20%] -top-[30%] h-[120vh] w-[120vh] rounded-full opacity-25 blur-3xl rotate-slow"
        style={{
          background:
            "conic-gradient(from 0deg, transparent, color-mix(in oklab, var(--theme) 35%, transparent), transparent 60%)",
        }}
      />
      {/* Light ray sweep */}
      <div className="light-ray absolute inset-0 opacity-25 mix-blend-overlay" />

      {!reducedMotion &&
        mounted &&
        items.map((p) => {
          const style: React.CSSProperties = {
            width: p.size,
            height: p.size,
            top: `${p.top}%`,
            left: `${p.left}%`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            background: cfg.color,
            filter: cfg.blur ? `blur(${cfg.blur}px)` : undefined,
            transform: `rotate(${p.rotate}deg)`,
          };
          const cls =
            cfg.shape === "petal"
              ? "ambient-petal petal-drift"
              : cfg.shape === "leaf"
                ? "ambient-leaf leaf-drift"
                : cfg.shape === "smoke"
                  ? "ambient-blob smoke-drift"
                  : cfg.shape === "steam"
                    ? "ambient-blob steam-rise"
                    : cfg.shape === "cream"
                      ? "ambient-blob cream-drift"
                      : "ambient-dot dot-float";
          return <span key={p.id} className={cls} style={style} />;
        })}
    </div>
  );
}
