import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "div";
  delay?: number;
  stagger?: number;
  once?: boolean;
  gold?: ReactNode;
}

/**
 * Splits text into word / character reveal with subtle blur + rotation.
 * Falls back to a static heading when the user prefers reduced motion.
 */
export function SplitText({
  text,
  className,
  as: Tag = "h2",
  delay = 0,
  stagger = 0.025,
  once = true,
}: Props) {
  const reduced = useReducedMotion();
  if (reduced) {
    const StaticTag = Tag;
    return <StaticTag className={className}>{text}</StaticTag>;
  }
  const words = text.split(" ");
  const MotionTag = motion[Tag] as typeof motion.h2;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-15%" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {Array.from(word).map((char, ci) => (
            <motion.span
              key={ci}
              className="inline-block"
              variants={{
                hidden: {
                  opacity: 0,
                  y: "0.6em",
                  filter: "blur(8px)",
                  rotate: -4,
                },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  rotate: 0,
                  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {char}
            </motion.span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </MotionTag>
  );
}
