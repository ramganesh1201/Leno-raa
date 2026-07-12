import { Leaf, Droplets, Sun, Timer, FlaskConical, Snowflake } from "lucide-react";
import { motion } from "framer-motion";

export function WhyThisSoap({ collection }: { collection: string }) {
  // We can vary the icons based on collection to feel more personalized, or use standard luxury claims
  const features = [
    {
      icon: Timer,
      title: "45-Day Cure",
      desc: "Slow cured to preserve natural glycerin and ensure a long-lasting bar.",
    },
    {
      icon: Droplets,
      title: "Cold Processed",
      desc: "Crafted without heat to protect the delicate botanical oils and extracts.",
    },
    {
      icon: Snowflake,
      title: "Pure Base",
      desc: "Formulated without synthetic hardeners, detergents, or foaming agents.",
    },
    {
      icon: Leaf,
      title: "Small Batches",
      desc: "Hand-poured and cut in small batches for uncompromised quality control.",
    },
  ];

  return (
    <section className="py-24 border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 text-center">
        <h2 className="text-display text-3xl mb-16">Why This Soap</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div 
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="surface-glass p-8 rounded-2xl text-center group transition-colors hover:border-[color:var(--gold)]/30"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-[color:var(--gold)]/10 flex items-center justify-center text-[color:var(--gold)] mb-6 transition-transform duration-500 group-hover:scale-110">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl mb-3">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
