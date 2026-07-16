import { useEffect, useMemo, useState } from "react";

/**
 * Ambient always-on particle & light layer. Reads --theme from CSS, so it
 * automatically adapts when the world transforms.
 */
export function LivingEnvironment({ density = 22 }: { density?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const particles = useMemo(
    () =>
      Array.from({ length: density }, (_, i) => ({
        id: i,
        size: 4 + Math.random() * 14,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 18,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    [density],
  );
  const drifters = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        size: 10 + Math.random() * 22,
        top: Math.random() * 90,
        delay: Math.random() * 20,
        duration: 24 + Math.random() * 20,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Soft ambient wash */}
      <div
        className="absolute inset-0 opacity-60 transition-all duration-[1500ms]"
        style={{
          background:
            "radial-gradient(60% 45% at 15% 20%, color-mix(in oklab, var(--theme-soft) 60%, transparent), transparent 70%), radial-gradient(50% 40% at 85% 90%, color-mix(in oklab, var(--theme) 22%, transparent), transparent 70%)",
        }}
      />
      {/* Slow rotating light halo */}
      <div
        className="absolute top-[-30%] left-[-20%] h-[120vh] w-[120vh] rounded-full opacity-30 blur-3xl rotate-slow"
        style={{
          background:
            "conic-gradient(from 0deg, transparent, color-mix(in oklab, var(--theme) 40%, transparent), transparent 60%)",
        }}
      />
      {/* Particles are client-only to avoid SSR hydration mismatch */}
      {mounted &&
        particles.map((p) => (
          <span
            key={p.id}
            className="particle float-slow"
            style={{
              width: p.size,
              height: p.size,
              top: `${p.top}%`,
              left: `${p.left}%`,
              opacity: p.opacity,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      {mounted &&
        drifters.map((p) => (
          <span
            key={`d-${p.id}`}
            className="particle drift"
            style={{
              width: p.size,
              height: p.size,
              top: `${p.top}%`,
              left: 0,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
    </div>
  );
}
