import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { products, trustPillars } from "@/lib/catalog";
import { useTheme } from "@/lib/store";

import { ProductCard } from "@/components/ProductCard";
import { LuxuryEditorialCollections } from "@/components/home/LuxuryEditorialCollections";
import { SplitText } from "@/components/immersive/SplitText";
import { Reveal } from "@/components/immersive/Reveal";
import { Magnetic } from "@/components/immersive/Magnetic";
import heroIntro from "@/assets/hero-intro.png";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const setTheme = useTheme((s) => s.setTheme);
  useEffect(() => {
    setTheme("default");
  }, [setTheme]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const featured = products.slice(0, 3);
  return (
    <div className="relative">
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] items-center overflow-hidden pt-24"
      >
        <motion.img
          src={heroIntro}
          alt="Handcrafted soap resting above still water at golden hour"
          width={1920}
          height={1280}
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--ivory)]/40 via-transparent to-[color:var(--ivory)]" />
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 mx-auto grid w-full max-w-[1400px] gap-10 px-6 pb-24 md:px-12"
        >
          <Reveal preset="label" delay={0.1} className="text-eyebrow text-[color:var(--foreground)]/70">
            Est. Nature · Doctor Formulated
          </Reveal>
          <h1 className="text-display flex flex-col font-serif text-3xl md:text-4xl leading-[1.05] tracking-normal sm:text-4xl md:text-3xl md:text-4xl md:text-3xl md:text-4xl md:text-4xl md:text-3xl md:text-4xl md:max-w-[55%]">
            <Reveal preset="heading" delay={0.2} className="text-left">
              Nature
            </Reveal>
            <Reveal preset="heading" delay={0.4} className="text-left text-[color:var(--foreground)]/90">
              crafted into
            </Reveal>
            <Reveal preset="heading" delay={0.6} className="text-left">
              luxury.
            </Reveal>
          </h1>
          <Reveal as="p" preset="paragraph" delay={0.8} className="mt-8 max-w-lg text-lg leading-relaxed tracking-wide text-[color:var(--foreground)]/70">
            Five botanical chapters. Eleven handcrafted soaps. A slow, cold-processed
            ritual for the senses.
          </Reveal>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Magnetic>
              <Link to="/collections/$slug" params={{ slug: "radiance" }} className="btn-lux">
                Enter the world
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/customize" className="btn-ghost-lux">
                Design your soap
              </Link>
            </Magnetic>
          </motion.div>
        </motion.div>
      </section>

      <LuxuryEditorialCollections />

      {/* FEATURED */}
      <section className="relative py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="mb-16 text-center">
            <Reveal preset="label" className="text-eyebrow text-[color:var(--muted-foreground)]">
              Signature Bars
            </Reveal>
            <SplitText as="h2" text="The Atelier's Favourites" delay={0.1} className="text-display mt-4 text-3xl md:text-4xl md:text-4xl md:text-3xl md:text-4xl" />
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {featured.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* TRUST PILLARS */}
      <section className="relative py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="mb-16 max-w-2xl">
            <Reveal preset="label" className="text-eyebrow text-[color:var(--muted-foreground)]">
              The House of Lenoraa
            </Reveal>
            <SplitText as="h2" text="Why we pour by hand." delay={0.1} className="text-display mt-4 text-3xl md:text-4xl md:text-4xl md:text-3xl md:text-4xl" />
          </div>
          <div className="grid gap-px overflow-hidden rounded-md bg-[color:var(--border)] md:grid-cols-3">
            {trustPillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="group relative bg-[color:var(--card)] p-10 h-full">
                  <Reveal preset="label" delay={i * 0.1} className="text-eyebrow mb-6 text-[color:var(--gold)]">
                    0{i + 1}
                  </Reveal>
                  <Reveal preset="subheading" delay={i * 0.1 + 0.1} className="text-display text-2xl">{p.title}</Reveal>
                  <Reveal as="p" preset="paragraph" delay={i * 0.1 + 0.2} className="mt-3 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                    {p.body}
                  </Reveal>
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-[color:var(--gold)] transition-all duration-1000 group-hover:w-full" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
          <SplitText as="h2" text="Begin where the light is warmest." className="text-display text-4xl leading-tight md:text-4xl md:text-3xl md:text-4xl" />
          <Reveal as="p" preset="paragraph" delay={0.1} className="mt-6 text-[color:var(--muted-foreground)]">
            Step into the first chapter — the Radiance collection.
          </Reveal>
          <div className="mt-10 flex justify-center gap-3">
            <Magnetic>
              <Link to="/collections/$slug" params={{ slug: "radiance" }} className="btn-lux">
                Begin the ritual
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/customize" className="btn-ghost-lux">
                Design your own
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </div>
  );
}
