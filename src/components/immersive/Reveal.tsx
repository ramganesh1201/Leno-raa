import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export type RevealPreset = "heading" | "subheading" | "paragraph" | "label";

export function Reveal({
  children,
  preset = "paragraph",
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  preset?: RevealPreset;
  delay?: number;
  className?: string;
  as?: "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "li";
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[Tag] as any;

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  const getVariants = () => {
    switch (preset) {
      case "heading":
        return {
          hidden: { opacity: 0, y: 35, scale: 0.95, filter: "blur(8px)", rotateX: 3 },
          show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", rotateX: 0, transition: { duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] } },
        };
      case "subheading":
        return {
          hidden: { opacity: 0, y: 25, scale: 0.98, filter: "blur(6px)" },
          show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] } },
        };
      case "label":
        return {
          hidden: { opacity: 0, y: 10 },
          show: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] } },
        };
      case "paragraph":
      default:
        return {
          hidden: { opacity: 0, y: 15, scale: 0.99 },
          show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } },
        };
    }
  };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-20%" }}
      variants={getVariants()}
    >
      {children}
    </MotionTag>
  );
}
