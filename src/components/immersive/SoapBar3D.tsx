import { useRef, type ReactNode } from "react";

/**
 * A styled soap bar with subtle 3D tilt following the cursor. Purely CSS/JS —
 * no WebGL. Content (engraving, chips) can be children.
 */
export function SoapBar3D({
  children,
  className,
  intensity = 12,
  aspect = "aspect-square",
}: {
  children?: ReactNode;
  className?: string;
  intensity?: number;
  aspect?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const wrap = wrapRef.current;
    const bar = barRef.current;
    if (!wrap || !bar) return;
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    bar.style.transform = `perspective(900px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) scale(1.03)`;
    bar.style.setProperty("--shine-x", `${(x + 0.5) * 100}%`);
    bar.style.setProperty("--shine-y", `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => {
    const bar = barRef.current;
    if (bar) bar.style.transform = "";
  };

  return (
    <div
      ref={wrapRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`soap-bar-wrap ${aspect} ${className ?? ""}`}
      data-lux-hover
    >
      <div
        ref={barRef}
        className="soap-bar breathe relative h-full w-full transition-transform duration-500 ease-out"
      >
        <span className="soap-bar-shine" />
        <span className="soap-bar-glow" />
        {children}
      </div>
    </div>
  );
}
