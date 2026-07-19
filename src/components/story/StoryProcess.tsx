import { motion } from "framer-motion";
import { Reveal } from "@/components/immersive/Reveal";
import { SplitText } from "@/components/immersive/SplitText";
import { Leaf, Droplets, Droplet, Clock, CheckCircle, Package } from "lucide-react";

const processSteps = [
  {
    icon: Leaf,
    title: "Choose Ingredients",
    desc: "We ethically source the finest botanical extracts and butters.",
  },
  {
    icon: Droplets,
    title: "Blend Oils",
    desc: "Oils and lye are precisely mixed at the perfect temperature.",
  },
  {
    icon: Droplet,
    title: "Hand Pour",
    desc: "Each batch is carefully poured into custom wooden molds.",
  },
  {
    icon: Clock,
    title: "Cold Process Cure",
    desc: "Soaps rest for 4-6 weeks to harden and develop a rich lather.",
  },
  {
    icon: CheckCircle,
    title: "Quality Check",
    desc: "Every single bar is inspected, trimmed, and polished by hand.",
  },
  {
    icon: Package,
    title: "Delivered to You",
    desc: "Wrapped in sustainable packaging and shipped to your door.",
  },
];

export function StoryProcess() {
  return (
    <section className="relative py-24 md:py-32 bg-[color:var(--card)] border-b border-[color:var(--border)]/50">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 text-center">
        <Reveal preset="label" className="text-eyebrow text-[color:var(--gold)] mb-4">
          The Process
        </Reveal>
        <SplitText
          as="h2"
          text="How we make every soap."
          className="text-display text-4xl leading-tight mb-16 md:mb-24"
        />

        {/* Desktop: Grid / Mobile: Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative">
          {/* Subtle connecting line for desktop */}
          <div className="hidden lg:block absolute top-8 left-12 right-12 h-px bg-[color:var(--border)]" />

          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-[color:var(--background)] border border-[color:var(--border)] flex items-center justify-center text-[color:var(--gold)] mb-6 relative z-10 transition-transform duration-500 group-hover:scale-110">
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-serif font-medium mb-3">{step.title}</h3>
                <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed max-w-[200px]">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
