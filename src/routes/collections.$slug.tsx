import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  getCollection,
  productsInCollection,
  collections,
  type ThemeKey,
} from "@/lib/catalog";
import { useTheme } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { SplitText } from "@/components/immersive/SplitText";
import { Reveal } from "@/components/immersive/Reveal";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const collection = getCollection(params.slug);
    if (!collection) throw notFound();
    return { collection };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.collection.name} — Lenoraa` },
          {
            name: "description",
            content: `${loaderData.collection.purpose}. ${loaderData.collection.environment}`,
          },
          { property: "og:title", content: `${loaderData.collection.name} — Lenoraa` },
          { property: "og:description", content: loaderData.collection.purpose },
        ]
      : [{ title: "Not found — Lenoraa" }],
  }),
  component: CollectionPage,
  notFoundComponent: () => (
    <div className="pt-40 text-center">
      <h1 className="text-display text-4xl">Chapter not found</h1>
      <Link to="/" className="btn-lux mt-8">Return home</Link>
    </div>
  ),
});

function CollectionPage() {
  const { collection } = Route.useLoaderData();
  const setTheme = useTheme((s) => s.setTheme);
  const items = productsInCollection(collection.slug);
  const otherChapters = collections.filter((c) => c.slug !== collection.slug);

  useEffect(() => {
    setTheme(collection.slug as ThemeKey, collection.ambience);
    // Environment persists after leaving the page until another soap is chosen.
  }, [collection.slug, collection.ambience, setTheme]);

  return (
    <div data-theme={collection.slug} className="relative">
      {/* Cinematic environment */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden pt-24">
        <motion.img
          key={collection.slug}
          src={collection.image}
          alt={collection.name}
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[color:var(--ivory)]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 50% at 50% 100%, color-mix(in oklab, var(--theme) 35%, transparent), transparent 70%)",
          }}
        />
        
        {/* Localized Readability Layer */}
        {(() => {
          const isBright = ["radiance", "calm", "nourish"].includes(collection.slug as string);
          const overlayOpacity = isBright ? 0.6 : 0.25;
          return (
            <div 
              className="absolute bottom-0 left-0 w-full md:w-[70%] h-[70%] pointer-events-none"
              style={{
                background: `radial-gradient(100% 100% at 0% 100%, rgba(0,0,0,${overlayOpacity}) 0%, rgba(0,0,0,0) 100%)`,
                backdropFilter: "blur(8px)",
                maskImage: "radial-gradient(100% 100% at 0% 100%, black 20%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(100% 100% at 0% 100%, black 20%, transparent 100%)"
              }}
            />
          );
        })()}

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-20 text-[color:var(--ivory)] md:px-12">
          <Reveal preset="label" delay={0.1} className="text-eyebrow text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
            {collection.eyebrow} · {collection.scene}
          </Reveal>
          <SplitText
            as="h1"
            text={collection.name}
            delay={0.2}
            className="text-display mt-6 max-w-[14ch] text-5xl md:text-6xl lg:text-7xl leading-[0.95] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
          />
          <Reveal as="p" preset="paragraph" delay={0.3} className="mt-6 max-w-lg text-lg text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
            {collection.environment}
          </Reveal>
        </div>
      </section>

      {/* Purpose */}
      <section className="relative py-32">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:grid-cols-[1fr_1.4fr] md:px-12">
          <div>
            <Reveal preset="label" className="text-eyebrow text-[color:var(--muted-foreground)]">
              Purpose
            </Reveal>
            <SplitText as="h2" text={collection.purpose} delay={0.1} className="text-display mt-4 text-4xl leading-tight md:text-3xl md:text-4xl" />
          </div>
          <ul className="space-y-6">
            {collection.benefits.map((b: string, i: number) => (
              <li key={b} className="flex items-start gap-6 border-b border-[color:var(--border)] pb-6">
                <Reveal preset="label" delay={i * 0.1} className="text-eyebrow mt-2 text-[color:var(--gold)]">
                  0{i + 1}
                </Reveal>
                <Reveal preset="subheading" delay={i * 0.1 + 0.1} className="text-display text-2xl md:text-3xl">{b}</Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Products */}
      <section className="relative py-16">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Reveal preset="label" className="ornament-rule text-eyebrow mb-16">The Bars</Reveal>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Chapter navigation */}
      <section className="relative py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Reveal preset="label" className="text-eyebrow mb-8 text-[color:var(--muted-foreground)]">
            Continue the journey
          </Reveal>
          <div className="grid gap-4 md:grid-cols-4">
            {otherChapters.map((c) => (
              <Link
                key={c.slug}
                to="/collections/$slug"
                params={{ slug: c.slug }}
                className="group relative aspect-[4/5] overflow-hidden rounded-md"
              >
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover transition-transform duration-1500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <Reveal preset="label" className="text-eyebrow text-white/60">{c.eyebrow}</Reveal>
                  <Reveal preset="subheading" delay={0.1} className="text-display mt-2 text-2xl">{c.name}</Reveal>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
