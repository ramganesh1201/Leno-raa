import { useEffect, useRef, useState } from "react";

/**
 * Minimal luxury cursor: small elegant dot with a subtle outline ring that
 * gently scales on interactive elements. No oversized blobs, no trails.
 * Auto-disables on touch / reduced motion / small screens so it never covers
 * button text on mobile.
 */
export function LuxuryCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 1024;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (touch || small || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("has-lux-cursor");
    return () => document.documentElement.classList.remove("has-lux-cursor");
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest("a, button, [data-lux-hover]");
      ring.classList.toggle("is-hover", !!interactive);
      
      const btn = target?.closest(".btn-lux, .btn-ghost-lux, .nav-icon-btn") as HTMLElement;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        btn.style.setProperty("--x", `${e.clientX - rect.left}px`);
        btn.style.setProperty("--y", `${e.clientY - rect.top}px`);
      }
    };

    const tick = () => {
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={ringRef} className="lux-cursor-ring" aria-hidden />
      <div ref={dotRef} className="lux-cursor-dot" aria-hidden />
    </>
  );
}
