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
    // Disabled exaggerated magnetic translation as per luxury interaction specs.
    // The cursor light tracks over this element instead.
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
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
