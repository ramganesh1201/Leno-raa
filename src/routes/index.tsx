import { createFileRoute, Link, defer, Await } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, Suspense } from "react";
import { useTheme } from "@/lib/store";
import { productService } from "@/services/product.service";

import { ProductCard } from "@/components/ProductCard";
import { LuxuryEditorialCollections } from "@/components/home/LuxuryEditorialCollections";
import { SplitText } from "@/components/immersive/SplitText";
import { Reveal } from "@/components/immersive/Reveal";
import { CraftsmanshipSection } from "@/components/home/CraftsmanshipSection";
import { Magnetic } from "@/components/immersive/Magnetic";
import heroIntro from "@/assets/hero-intro.png";

export const Route = createFileRoute("/")({
  loader: () => {
    const productsPromise = productService.getProducts();
    const catalogPromise = import("@/lib/catalog").then((m) => m.trustPillars);
    return {
      deferredData: defer(
        Promise.all([productsPromise, catalogPromise]).then(([products, trustPillars]) => ({
          products,
          trustPillars,
        })),
      ),
    };
  },
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

  const { deferredData } = Route.useLoaderData();

  return (
    <div className="relative">
      {/* HERO */}
      {/* DESKTOP HERO */}
      <section
        ref={heroRef}
        className="relative hidden md:flex min-h-[100svh] items-center overflow-hidden pt-24"
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
          className="relative z-10 mx-auto grid w-full max-w-[1400px] gap-10 px-12 pb-24"
        >
          <Reveal
            preset="label"
            delay={0.1}
            className="text-eyebrow text-[color:var(--foreground)]/70 text-left"
          >
            Est. Nature · Doctor Formulated
          </Reveal>
          <h1 className="text-display flex flex-col font-serif text-4xl items-start leading-[1.05] tracking-normal max-w-[55%]">
            <Reveal preset="heading" delay={0.2} className="text-left">
              Nature
            </Reveal>
            <Reveal
              preset="heading"
              delay={0.4}
              className="text-left text-[color:var(--foreground)]/90"
            >
              crafted into
            </Reveal>
            <Reveal preset="heading" delay={0.6} className="text-left">
              luxury.
            </Reveal>
          </h1>
          <Reveal
            as="p"
            preset="paragraph"
            delay={0.8}
            className="mt-8 max-w-lg text-lg leading-relaxed tracking-wide text-[color:var(--foreground)]/70 text-left"
          >
            Five botanical chapters. Eleven handcrafted soaps. A slow, cold-processed ritual for the
            senses.
          </Reveal>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-row flex-wrap gap-4 w-auto"
          >
            <Magnetic>
              <Link
                to="/collections/$slug"
                params={{ slug: "radiance" }}
                className="btn-lux w-auto justify-center"
              >
                Enter the world
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/customize" className="btn-ghost-lux w-auto justify-center">
                Design your soap
              </Link>
            </Magnetic>
          </motion.div>
        </motion.div>
      </section>

      {/* MOBILE HERO */}
      <section className="relative flex md:hidden min-h-[100dvh] flex-col items-center justify-between pt-[calc(72px+var(--safe-top,0px)+32px)] pb-[calc(var(--safe-bottom,0px)+32px)] px-6 overflow-hidden bg-gradient-to-b from-[color:var(--ivory)] to-[color:var(--ivory)]">
        <div className="flex flex-col items-center text-center w-full relative z-10 space-y-4">
          <Reveal preset="label" delay={0.1} className="text-eyebrow text-[color:var(--foreground)]/70">
            Est. Nature · Doctor Formulated
          </Reveal>
          <h1 className="text-display flex flex-col font-serif text-[44px] leading-[1.05] tracking-normal items-center">
            <Reveal preset="heading" delay={0.2}>
              Nature
            </Reveal>
            <Reveal preset="heading" delay={0.3} className="text-[color:var(--foreground)]/90">
              crafted into
            </Reveal>
            <Reveal preset="heading" delay={0.4}>
              luxury.
            </Reveal>
          </h1>
          <Reveal as="p" preset="paragraph" delay={0.5} className="max-w-[280px] text-[16px] leading-relaxed tracking-wide text-[color:var(--foreground)]/70">
            Five botanical chapters. Eleven handcrafted soaps. A slow, cold-processed ritual.
          </Reveal>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex-1 w-full flex items-center justify-center my-8 max-h-[45vh]"
        >
          <img
            src={heroIntro}
            alt="Handcrafted soap"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex flex-col gap-4 relative z-10"
        >
          <Link
            to="/collections/$slug"
            params={{ slug: "radiance" }}
            className="btn-lux"
          >
            Enter the world
          </Link>
          <Link to="/customize" className="btn-ghost-lux">
            Design your soap
          </Link>
        </motion.div>
      </section>

      <Suspense fallback={null}>
        <Await promise={deferredData}>
          {({ products, trustPillars }) => {
            const featured = products.slice(0, 3);
            return (
              <>
                <LuxuryEditorialCollections />

                {/* FEATURED */}
                <section className="relative py-32">
                  <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                    <div className="mb-16 text-center">
                      <Reveal
                        preset="label"
                        className="text-eyebrow text-[color:var(--muted-foreground)]"
                      >
                        Signature Bars
                      </Reveal>
                      <SplitText
                        as="h2"
                        text="The Atelier's Favourites"
                        delay={0.1}
                        className="text-display mt-4 text-4xl"
                      />
                    </div>
                    <div className="grid gap-4 md:gap-10 grid-cols-1 md:grid-cols-3">
                      {featured.map((p, i) => (
                        <ProductCard key={p.slug} product={p} index={i} />
                      ))}
                    </div>
                  </div>
                </section>

                {/* TRUST PILLARS - REDESIGNED */}
                <CraftsmanshipSection />

                {/* CTA */}
                <section className="relative py-32">
                  <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
                    <SplitText
                      as="h2"
                      text="Begin where the light is warmest."
                      className="text-display text-4xl leading-tight"
                    />
                    <Reveal
                      as="p"
                      preset="paragraph"
                      delay={0.1}
                      className="mt-6 text-[color:var(--muted-foreground)]"
                    >
                      Step into the first chapter — the Radiance collection.
                    </Reveal>
                    <div className="mt-10 flex justify-center gap-3 flex-col md:flex-row w-full md:w-auto">
                      <Magnetic>
                        <Link
                          to="/collections/$slug"
                          params={{ slug: "radiance" }}
                          className="btn-lux w-full md:w-auto justify-center"
                        >
                          Begin the ritual
                        </Link>
                      </Magnetic>
                      <Magnetic>
                        <Link
                          to="/customize"
                          className="btn-ghost-lux w-full md:w-auto justify-center"
                        >
                          Design your own
                        </Link>
                      </Magnetic>
                    </div>
                  </div>
                </section>
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
