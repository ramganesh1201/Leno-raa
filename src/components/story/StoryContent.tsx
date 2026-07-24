import { motion } from "framer-motion";
import { Reveal } from "@/components/immersive/Reveal";
import { SplitText } from "@/components/immersive/SplitText";
import envNourish from "@/assets/env-nourish.webp";
import envCalm from "@/assets/env-calm.webp";

export function StoryContent() {
  return (
    <div className="bg-[color:var(--background)]">
      {/* Section 1: Who We Are */}
      <section className="relative py-24 md:py-32 border-b border-[color:var(--border)]/50">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="order-2 md:order-1 flex flex-col justify-center">
              <Reveal preset="label" className="text-eyebrow text-[color:var(--gold)] mb-4">
                Who We Are
              </Reveal>
              <SplitText
                as="h2"
                text="A return to authentic skincare."
                className="text-display text-4xl leading-tight mb-6"
              />
              <Reveal
                as="p"
                preset="paragraph"
                delay={0.1}
                className="text-[color:var(--muted-foreground)] text-base leading-relaxed mb-4"
              >
                Lenoraa is an artisanal skincare studio dedicated to crafting the finest
                cold-processed soaps. We believe that true luxury lies in patience, quality, and an
                unwavering respect for natural ingredients.
              </Reveal>
              <Reveal
                as="p"
                preset="paragraph"
                delay={0.2}
                className="text-[color:var(--muted-foreground)] text-base leading-relaxed"
              >
                By stripping away synthetic detergents and mass-production shortcuts, we create
                products that actively nourish, heal, and restore the skin's delicate barrier.
              </Reveal>
            </div>

            <div className="order-1 md:order-2 w-full">
              <motion.img
                src={envNourish}
                alt="Lenoraa ingredients"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="w-full aspect-[4/3] md:aspect-square object-cover rounded-2xl shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Why We Started */}
      <section className="relative py-24 md:py-32 border-b border-[color:var(--border)]/50">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="order-1 w-full">
              <motion.img
                src={envCalm}
                alt="Lenoraa handmade soap"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="w-full aspect-[4/3] md:aspect-[4/5] object-cover rounded-2xl shadow-sm"
              />
            </div>

            <div className="order-2 flex flex-col justify-center">
              <Reveal preset="label" className="text-eyebrow text-[color:var(--gold)] mb-4">
                Why We Started
              </Reveal>
              <SplitText
                as="h2"
                text="Because your skin deserves better."
                className="text-display text-4xl leading-tight mb-6"
              />
              <Reveal
                as="p"
                preset="paragraph"
                delay={0.1}
                className="text-[color:var(--muted-foreground)] text-base leading-relaxed mb-6"
              >
                Modern skincare has become dominated by harsh chemicals, artificial fragrances, and
                rushed manufacturing. We started Lenoraa to offer an alternative: a conscious,
                handmade approach that prioritizes long-term skin health.
              </Reveal>

              <ul className="space-y-4">
                {[
                  "100% handmade in small batches",
                  "Completely natural and chemical-conscious",
                  "Crafted with care, never rushed",
                ].map((item, index) => (
                  <Reveal
                    as="li"
                    key={index}
                    delay={0.2 + index * 0.1}
                    className="flex items-center gap-4 text-sm font-medium"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[color:var(--gold)]" />
                    {item}
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
