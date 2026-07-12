import { createFileRoute } from "@tanstack/react-router";
import { useShop } from "@/lib/store";
import { productService } from "@/services/product.service";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/account/recently-viewed")({
  loader: async () => {
    const products = await productService.getProducts();
    return { products };
  },
  component: RecentlyViewed,
});

function RecentlyViewed() {
  const { products } = Route.useLoaderData();
  const recent = useShop((s) => s.recentlyViewed);
  const items = recent.map(slug => products.find(p => p.slug === slug)).filter((p): p is NonNullable<typeof p> => !!p);
  if (items.length === 0)
    return (
      <div className="surface-glass rounded-md p-10 text-center">
        <div className="text-eyebrow text-[color:var(--muted-foreground)]">Recently viewed</div>
        <div className="text-display mt-3 text-3xl">Nothing to remember yet</div>
      </div>
    );
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {items.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
    </div>
  );
}
