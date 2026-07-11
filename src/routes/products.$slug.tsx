import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  getProduct,
  getCollection,
  productsInCollection,
} from "@/lib/catalog";
import { useShop, useTheme } from "@/lib/store";
import { SoapBar3D } from "@/components/immersive/SoapBar3D";
import { SplitText } from "@/components/immersive/SplitText";
import { Magnetic } from "@/components/immersive/Magnetic";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    const collection = getCollection(product.collection)!;
    const related = productsInCollection(product.collection).filter(
      (p) => p.slug !== product.slug,
    );
    return { product, collection, related };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — ${loaderData.collection.name} — Lenoraa` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — Lenoraa` },
          { property: "og:description", content: loaderData.product.tagline },
        ]
      : [{ title: "Product not found — Lenoraa" }],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="pt-40 text-center">
      <h1 className="text-display text-4xl">Not in the atelier</h1>
      <Link to="/" className="btn-lux mt-8">Return home</Link>
    </div>
  ),
});

function ProductPage() {
  const { product, collection, related } = Route.useLoaderData();
  const setTheme = useTheme((s) => s.setTheme);
  const addToCart = useShop((s) => s.addToCart);
  const toggleWishlist = useShop((s) => s.toggleWishlist);
  const markRecentlyViewed = useShop((s) => s.markRecentlyViewed);
  const saved = useShop((s) => s.wishlist.includes(product.slug));
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setTheme(collection.slug, product.ambience);
    markRecentlyViewed(product.slug);
  }, [collection.slug, product.slug, product.ambience, setTheme, markRecentlyViewed]);

  const handleAdd = () => {
    addToCart(product.slug);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div data-theme={collection.slug} className="relative">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <img
          src={collection.image}
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-20 blur-3xl"
        />
        <div className="absolute inset-0 bg-[color:var(--ivory)]/40" />
      </div>

      <section className="relative pt-32 pb-24">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:grid-cols-2 md:px-12">
          {/* Presentation */}
          <div className="sticky top-32 self-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <SoapBar3D>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="text-display text-3xl uppercase tracking-[0.3em] text-white/40 mix-blend-overlay">
                    Lenoraa
                  </div>
                  <div className="text-eyebrow text-white/60">{product.name}</div>
                </div>
              </SoapBar3D>
              <div
                className="mx-auto mt-[-20px] h-24 w-3/4 rounded-full opacity-40 blur-2xl"
                style={{ background: "var(--theme)" }}
              />
              {/* Orbiting benefit chips */}
              {product.benefits.map((b: string, i: number) => (
                <motion.div
                  key={b}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.2, duration: 1 }}
                  className="surface-glass absolute hidden rounded-full px-4 py-2 text-xs uppercase tracking-[0.24em] shadow-lg md:block"
                  style={{
                    top: `${15 + i * 30}%`,
                    [i % 2 ? "right" : "left"]: "-3rem",
                  }}
                >
                  {b}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Details */}
          <div>
            <Link
              to="/collections/$slug"
              params={{ slug: collection.slug }}
              className="text-eyebrow text-[color:var(--muted-foreground)] transition hover:text-[color:var(--gold)]"
            >
              ← {collection.name}
            </Link>
            <SplitText
              as="h1"
              text={product.name}
              className="text-display mt-6 text-6xl leading-[0.95] md:text-8xl"
            />
            <p className="mt-4 text-lg italic text-[color:var(--muted-foreground)]">
              {product.tagline}
            </p>
            <p className="mt-8 max-w-md text-base leading-relaxed">
              {product.description}
            </p>

            <div className="mt-10 flex items-baseline gap-6">
              <div className="text-display text-3xl">₹{product.price}</div>
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                100g · Cold-pressed
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <button onClick={handleAdd} className="btn-lux">
                  {added ? "Added ✓" : "Add to bag"}
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={() => toggleWishlist(product.slug)}
                  className="btn-ghost-lux"
                >
                  {saved ? "Saved ♥" : "Save"}
                </button>
              </Magnetic>
            </div>

            <div className="mt-16 space-y-10">
              <div>
                <div className="text-eyebrow mb-4 text-[color:var(--gold)]">
                  Ingredients
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((i: string) => (
                    <span
                      key={i}
                      className="rounded-full border border-[color:var(--border)] px-4 py-2 text-xs tracking-wide transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
                      data-lux-hover
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-eyebrow mb-4 text-[color:var(--gold)]">
                  Aromatic Notes
                </div>
                <p className="text-sm italic text-[color:var(--muted-foreground)]">
                  {product.notes}
                </p>
              </div>

              <div>
                <div className="text-eyebrow mb-4 text-[color:var(--gold)]">
                  Benefits
                </div>
                <ul className="space-y-3">
                  {product.benefits.map((b: string) => (
                    <li key={b} className="flex items-baseline gap-3 text-sm">
                      <span className="text-[color:var(--gold)]">✦</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-eyebrow mb-4 text-[color:var(--gold)]">
                  Ritual
                </div>
                <ol className="space-y-3 text-sm text-[color:var(--muted-foreground)]">
                  <li><span className="text-[color:var(--gold)] mr-2">01</span>Warm the bar between wet palms until fragrance rises.</li>
                  <li><span className="text-[color:var(--gold)] mr-2">02</span>Trace slow circles across the skin. Breathe.</li>
                  <li><span className="text-[color:var(--gold)] mr-2">03</span>Rinse in cool water. Pat dry. Notice.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="relative py-24">
          <div className="mx-auto max-w-[1400px] px-6 md:px-12">
            <div className="ornament-rule text-eyebrow mb-12">
              More from {collection.name}
            </div>
            <div className="grid gap-10 md:grid-cols-3">
              {related.map((p: typeof related[number]) => (
                <Link
                  key={p.slug}
                  to="/products/$slug"
                  params={{ slug: p.slug }}
                  data-theme={p.collection}
                  className="group block"
                  data-lux-hover
                >
                  <div className="soap-bar breathe shimmer-sweep transition-transform duration-1000 group-hover:scale-105">
                    <span className="soap-bar-shine" />
                    <span className="soap-bar-glow" />
                  </div>
                  <div className="mt-5 flex items-baseline justify-between">
                    <div className="text-display text-xl">{p.name}</div>
                    <div className="text-sm text-[color:var(--muted-foreground)]">
                      ₹{p.price}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
