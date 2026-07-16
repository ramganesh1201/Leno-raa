import { Link } from "@tanstack/react-router";
import { Reveal } from "../immersive/Reveal";

interface ProductRecommendationsProps {
  title: string;
  products: any[];
}

export function ProductRecommendations({ title, products }: ProductRecommendationsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="relative py-24 border-t border-[color:var(--border)] overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <Reveal preset="label" className="ornament-rule text-eyebrow mb-12">
          {title}
        </Reveal>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex overflow-x-auto pb-8 snap-x scrollbar-hide md:grid md:grid-cols-4 md:gap-10 md:overflow-visible md:pb-0 md:snap-none -mx-6 px-6 md:mx-0 md:px-0 gap-6">
          {products.map((p) => (
            <Link
              key={p.slug}
              to="/products/$slug"
              params={{ slug: p.slug }}
              data-theme={p.collection}
              className="group block w-[280px] shrink-0 snap-center md:w-auto"
              data-lux-hover
            >
              <div className="aspect-[4/5] relative overflow-hidden rounded-[18px]">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="soap-bar breathe shimmer-sweep h-full w-full transition-transform duration-1000 group-hover:scale-105">
                    <span className="soap-bar-shine" />
                    <span className="soap-bar-glow" />
                  </div>
                )}
                {/* Subtle gradient overlay at bottom for text contrast if needed */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
              <div className="mt-5 flex items-baseline justify-between">
                <div>
                  <div className="text-display text-xl">{p.name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)] mt-1">
                    {p.collection}
                  </div>
                </div>
                <div className="text-sm text-[color:var(--muted-foreground)]">₹{p.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
