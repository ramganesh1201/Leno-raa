import { createFileRoute } from "@tanstack/react-router";
import { useShop } from "@/lib/store";
import { getProduct } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/account/recently-viewed")({
  component: RecentlyViewed,
});

function RecentlyViewed() {
  const recent = useShop((s) => s.recentlyViewed);
  const items = recent.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p);
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
