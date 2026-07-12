import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTheme } from "@/lib/store";
import { SplitText } from "@/components/immersive/SplitText";
import { Reveal } from "@/components/immersive/Reveal";
import heroIntro from "@/assets/hero-intro.png";
import envHerbal from "@/assets/env-herbal.jpg";
import envNourish from "@/assets/env-nourish.jpg";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "The Atelier — Lenoraa" },
      {
        name: "description",
        content:
          "Doctor-formulated. Handcrafted. Cold-processed. The philosophy behind every Lenoraa bar.",
      },
      { property: "og:title", content: "The Atelier — Lenoraa" },
      { property: "og:description", content: "Nature crafted into luxury." },
    ],
  }),
  component: Story,
});

const chapters = [
  {
    eyebrow: "Chapter one",
    title: "The philosophy",
    body: "Skin is a living archive. It records the seasons, the weather, the days we forgot to rest. We formulate for that skin — not the airbrushed kind. Each Lenoraa bar begins with a doctor's brief and ends only when it earns its place in a morning ritual.",
    image: heroIntro,
  },
  {
    eyebrow: "Chapter two",
    title: "The hands",
    body: "There are no robotic lines here. Every batch is measured, stirred, poured, cut and cured by hand. Small batches make imperfections. We keep the ones that mean something.",
    image: envNourish,
  },
  {
    eyebrow: "Chapter three",
    title: "The old way",
    body: "Cold process is slow — six weeks to cure, longer to age. It preserves the glycerin, the essential oils, the botanical actives that heat would destroy. We chose patience because your skin does too.",
    image: envHerbal,
  },
];

function Story() {
  const setTheme = useTheme((s) => s.setTheme);
  useEffect(() => setTheme("default"), [setTheme]);
  return (
    <div className="relative">
      <section className="relative flex min-h-[80svh] items-center overflow-hidden pt-24">
        <img
          src={heroIntro}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--ivory)]/40 via-transparent to-[color:var(--ivory)]" />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
          <Reveal preset="label" className="text-eyebrow">
            The Atelier
          </Reveal>
          <SplitText
            as="h1"
            text="The old ways, held with new hands."
            delay={0.1}
            className="text-display mt-4 max-w-[14ch] text-4xl md:text-3xl md:text-4xl leading-[0.95] md:text-3xl md:text-4xl md:text-4xl md:text-3xl md:text-4xl"
          />
        </div>
      </section>

      {chapters.map((c, i) => (
        <section key={c.title} className="relative py-24">
          <div
            className={`mx-auto grid max-w-[1400px] items-center gap-16 px-6 md:grid-cols-2 md:px-12 ${
              i % 2 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <motion.img
              src={c.image}
              alt=""
              initial={{ opacity: 0, scale: 1.1 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.6 }}
              className="aspect-[4/5] rounded-md object-cover"
            />
            <div>
              <Reveal preset="label" className="text-eyebrow text-[color:var(--gold)]">{c.eyebrow}</Reveal>
              <SplitText as="h2" text={c.title} delay={0.1} className="text-display mt-4 text-4xl leading-tight md:text-4xl md:text-3xl md:text-4xl" />
              <Reveal as="p" preset="paragraph" delay={0.2} className="mt-6 max-w-md text-base leading-relaxed text-[color:var(--foreground)]/80">
                {c.body}
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      <section className="relative py-32">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-12">
          <Reveal preset="label" className="ornament-rule text-eyebrow mb-10">A closing thought</Reveal>
          <SplitText as="h2" text='"A bar of soap should feel like something someone loved into being."' delay={0.1} className="text-display text-4xl leading-tight md:text-4xl md:text-3xl md:text-4xl" />
          <Reveal as="p" preset="paragraph" delay={0.2} className="mt-8 text-sm uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
            — The Founder
          </Reveal>
        </div>
      </section>
    </div>
  );
}
