import { motion } from "framer-motion";
import { Reveal } from "@/components/immersive/Reveal";
import { SplitText } from "@/components/immersive/SplitText";
import { Check } from "lucide-react";

const differentiators = [
  {
    title: "Handmade",
    desc: "Crafted entirely by human hands from start to finish."
  },
  {
    title: "Natural Ingredients",
    desc: "Formulated with 100% plant-based oils and botanical extracts."
  },
  {
    title: "Small Batch Production",
    desc: "Made in limited quantities to ensure uncompromising quality."
  },
  {
    title: "Dermatologist Reviewed",
    desc: "Clinically vetted formulas that protect the skin barrier."
  }
];

export function StoryDifferentiators() {
  return (
    <section className="relative py-24 md:py-32 bg-[color:var(--background)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        
        <div className="text-center mb-16 md:mb-24">
          <Reveal preset="label" className="text-eyebrow text-[color:var(--gold)] mb-4">
            The Difference
          </Reveal>
          <SplitText
            as="h2"
            text="What sets Lenoraa apart."
            className="text-display text-4xl leading-tight"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {differentiators.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-[color:var(--card)] border border-[color:var(--border)] shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col items-start transition-colors hover:border-[color:var(--gold)]/30"
            >
              <div className="w-10 h-10 rounded-full bg-[color:var(--gold)]/10 text-[color:var(--gold)] flex items-center justify-center mb-6">
                <Check className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="font-serif text-xl mb-3">{item.title}</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
