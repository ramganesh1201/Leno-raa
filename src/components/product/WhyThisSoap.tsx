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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 text-left md:text-center">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="surface-glass p-5 md:p-8 rounded-2xl flex flex-row md:flex-col items-start md:items-center gap-4 md:gap-0 group transition-colors hover:border-[color:var(--gold)]/30"
              >
                <div className="shrink-0 mx-0 md:mx-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-[color:var(--gold)]/10 flex items-center justify-center text-[color:var(--gold)] mb-0 md:mb-6 transition-transform duration-500 group-hover:scale-110">
                  <Icon className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-serif text-lg md:text-xl mb-1 md:mb-3">{f.title}</h3>
                  <p className="text-xs md:text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
