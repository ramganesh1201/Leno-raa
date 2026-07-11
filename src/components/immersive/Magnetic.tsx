import { useRef, type ReactNode, type ElementType } from "react";

/**
 * Wraps a child element in a magnetic-hover container. Cursor gently pulls
 * the child toward it, then springs back on leave.
 */
export function Magnetic({
  children,
  strength = 0.35,
  as: Tag = "span",
  className,
}: {
  children: ReactNode;
  strength?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate3d(0, 0, 0)";
  };

  const Comp = Tag as unknown as "span";
  return (
    <Comp
      ref={ref as unknown as React.Ref<HTMLSpanElement>}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.5s cubic-bezier(.22,1,.36,1)", display: "inline-block" }}
      data-lux-hover
    >
      {children}
    </Comp>
  );
}
