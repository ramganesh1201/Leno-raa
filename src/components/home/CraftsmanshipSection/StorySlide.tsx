import { motion } from "framer-motion";
import { CraftsmanshipSlide } from "./data";
import { SplitText } from "@/components/immersive/SplitText";

interface StoryProps {
  slide: CraftsmanshipSlide;
  index: number;
}

export function StoryText({ slide, index }: StoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col text-left"
    >
      <div className="text-eyebrow text-[color:var(--gold)] mb-4 md:mb-6">
        0{index + 1}
      </div>
      
      <SplitText
        key={slide.id + "-title"}
        as="h3"
        text={slide.title}
        className="text-display text-3xl md:text-4xl mb-4 leading-tight"
      />

      <p className="text-[color:var(--muted-foreground)] text-sm md:text-[15px] leading-relaxed">
        {slide.description}
      </p>
    </motion.div>
  );
}

export function StoryImage({ slide }: Omit<StoryProps, "index">) {
  return (
    <motion.img
      key={slide.id + "-img"}
      src={slide.image}
      alt={slide.title}
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

