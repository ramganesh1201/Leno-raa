import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useShop, useTheme } from "@/lib/store";
import { productService } from "@/services/product.service";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { ProductCard } from "@/components/ProductCard";
import { SplitText } from "@/components/immersive/SplitText";
import { Reveal } from "@/components/immersive/Reveal";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Saved — Lenoraa" },
      { name: "description", content: "Bars you've saved for later." },
    ],
  }),
  loader: async () => {
    const products = await productService.getProducts();
    return { products };
  },
  component: Wishlist,
});

function Wishlist() {
  const { user } = useAuth();
  const { wishlist: supabaseWishlist } = useWishlist();
  const localWishlist = useShop((s) => s.wishlist);
  const setTheme = useTheme((s) => s.setTheme);
  const { products } = Route.useLoaderData();
  
  useEffect(() => setTheme("default"), [setTheme]);

  const items = user 
    ? supabaseWishlist.map(w => w.product || products.find(p => p.id === (w as any).product_id)).filter((p): p is NonNullable<typeof p> => !!p)
    : localWishlist.map(slug => products.find(p => p.slug === slug)).filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <div className="relative pt-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <Reveal preset="label" className="text-eyebrow text-[color:var(--muted-foreground)]">Saved</Reveal>
        <SplitText as="h1" text="Kept for later" delay={0.1} className="text-display mt-3 text-3xl md:text-4xl md:text-3xl md:text-4xl md:text-4xl md:text-3xl md:text-4xl" />

        {items.length === 0 ? (
          <div className="mt-24 text-center">
            <Reveal as="p" preset="paragraph" delay={0.2} className="text-[color:var(--muted-foreground)]">
              You haven't saved any bars yet.
            </Reveal>
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
