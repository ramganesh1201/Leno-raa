import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { collections, products, trustPillars } from "@/lib/catalog";
import { useTheme } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { SplitText } from "@/components/immersive/SplitText";
import { Reveal } from "@/components/immersive/Reveal";
import { Magnetic } from "@/components/immersive/Magnetic";
import heroIntro from "@/assets/hero-intro.jpg";

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
          <motion.div
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.28em" }}
            transition={{ duration: 1.6, delay: 0.4 }}
            className="text-eyebrow text-[color:var(--foreground)]/70"
          >
            Est. Nature · Doctor Formulated
          </motion.div>
          <SplitText
            as="h1"
            text="Nature crafted into luxury."
            delay={0.5}
            stagger={0.03}
            className="text-display max-w-[16ch] text-6xl leading-[0.95] sm:text-7xl md:text-[8.5rem]"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.4 }}
            className="max-w-md text-base leading-relaxed text-[color:var(--foreground)]/70"
          >
            Five botanical chapters. Eleven handcrafted soaps. A slow, cold-processed
            ritual for the senses.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.7 }}
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 0.5], y: [10, 0, 10] }}
          transition={{ delay: 2, duration: 3, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-eyebrow text-[color:var(--muted-foreground)]"
        >
          Scroll ↓
        </motion.div>
      </section>

      {/* MANIFESTO */}
      <section className="relative py-32">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
          <div className="ornament-rule text-eyebrow mb-10">Our Vow</div>
          <SplitText
            as="h2"
            text="A soap is a small thing. So is a morning. So is skin. We treat all three as sacred."
            className="text-display text-4xl leading-tight md:text-6xl"
          />
        </div>
      </section>

      {/* COLLECTIONS AS CHAPTERS */}
      <section className="relative py-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="mb-20 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="text-eyebrow mb-4 text-[color:var(--muted-foreground)]">
                Five Chapters
              </div>
              <SplitText as="h2" text="The Collections" className="text-display text-5xl md:text-7xl" />
            </div>
            <p className="max-w-md text-[color:var(--muted-foreground)]">
              Each collection is a world. Choose the mood, and the atelier will meet you
              there.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {collections.map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.08} className={i % 3 === 0 ? "md:col-span-2" : ""}>
                <div data-theme={c.slug}>
                  <Link
                    to="/collections/$slug"
                    params={{ slug: c.slug }}
                    className="group relative block overflow-hidden rounded-md"
                    data-lux-hover
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={c.image}
                        alt={c.name}
                        loading="lazy"
                        width={1600}
                        height={1000}
                        className="h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div
                        className="absolute inset-0 opacity-0 transition-opacity duration-1000 group-hover:opacity-100"
                        style={{
                          background:
                            "radial-gradient(60% 60% at 50% 50%, color-mix(in oklab, var(--theme) 40%, transparent), transparent 70%)",
                          mixBlendMode: "soft-light",
                        }}
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-8 text-[color:var(--ivory)] md:p-12">
                      <div className="text-eyebrow mb-3 text-white/70">{c.eyebrow}</div>
                      <h3 className="text-display text-4xl md:text-6xl">{c.name}</h3>
                      <p className="mt-3 max-w-md text-sm text-white/75">{c.purpose}</p>
                      <div className="mt-6 inline-flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[color:var(--gold-soft,#e6c98a)] transition group-hover:gap-6">
                        Enter <span aria-hidden>→</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="relative py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="mb-16 text-center">
            <div className="text-eyebrow text-[color:var(--muted-foreground)]">
              Signature Bars
            </div>
            <SplitText as="h2" text="The Atelier's Favourites" className="text-display mt-4 text-5xl md:text-6xl" />
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
            <div className="text-eyebrow text-[color:var(--muted-foreground)]">
              The House of Lenoraa
            </div>
            <SplitText as="h2" text="Why we pour by hand." className="text-display mt-4 text-5xl md:text-6xl" />
          </div>
          <div className="grid gap-px overflow-hidden rounded-md bg-[color:var(--border)] md:grid-cols-3">
            {trustPillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="group relative bg-[color:var(--card)] p-10 h-full">
                  <div className="text-eyebrow mb-6 text-[color:var(--gold)]">
                    0{i + 1}
                  </div>
                  <div className="text-display text-2xl">{p.title}</div>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                    {p.body}
                  </p>
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
          <SplitText as="h2" text="Begin where the light is warmest." className="text-display text-4xl leading-tight md:text-6xl" />
          <p className="mt-6 text-[color:var(--muted-foreground)]">
            Step into the first chapter — the Radiance collection.
          </p>
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
