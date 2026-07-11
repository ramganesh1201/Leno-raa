import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { getProduct } from "@/lib/catalog";
import { useShop, useTheme } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Saved — Lenoraa" },
      { name: "description", content: "Bars you've saved for later." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const wishlist = useShop((s) => s.wishlist);
  const setTheme = useTheme((s) => s.setTheme);
  useEffect(() => setTheme("default"), [setTheme]);

  const items = wishlist.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <div className="relative pt-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="text-eyebrow text-[color:var(--muted-foreground)]">Saved</div>
        <h1 className="text-display mt-3 text-5xl md:text-7xl">Kept for later</h1>

        {items.length === 0 ? (
          <div className="mt-24 text-center">
            <p className="text-[color:var(--muted-foreground)]">
              You haven't saved any bars yet.
            </p>
            <Link to="/" className="btn-lux mt-8">Explore</Link>
          </div>
        ) : (
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {items.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
