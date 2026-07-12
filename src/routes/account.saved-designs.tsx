import { createFileRoute, Link } from "@tanstack/react-router";
import { useCustomizations } from "@/hooks/useCustomizations";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useShop } from "@/lib/store";

export const Route = createFileRoute("/account/saved-designs")({
  component: SavedDesignsPage,
});

function SavedDesignsPage() {
  const { user } = useAuth();
  
  // Use Supabase if authenticated, fallback to local store if not
  const { customizations, isLoading, deleteCustomization } = useCustomizations();
  const { addToCart } = useCart();
  
  const localDesigns = useShop((s) => s.savedDesigns);
  const localDelete = useShop((s) => s.deleteDesign);
  const localAddToCart = useShop((s) => s.addCustomToCart);

  if (user && isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="surface-glass rounded-md p-6 h-48 animate-pulse bg-white/5"></div>
        <div className="surface-glass rounded-md p-6 h-48 animate-pulse bg-white/5"></div>
      </div>
    );
  }

  const designs = user ? customizations : localDesigns;

  if (!designs || designs.length === 0) {
    return (
      <div className="surface-glass rounded-md p-10 text-center">
        <div className="text-eyebrow text-[color:var(--muted-foreground)]">Saved designs</div>
        <div className="text-display mt-3 text-3xl">Your studio is quiet</div>
        <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">Design your first custom soap in the Studio.</p>
        <Link to="/customize" className="btn-lux mt-8 inline-flex">Open Studio</Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="surface-glass rounded-md p-10">
        <div className="text-eyebrow text-[color:var(--muted-foreground)]">Studio</div>
        <div className="text-display mt-3 text-3xl mb-8">Saved Designs</div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {designs.filter(Boolean).map((d: any) => {
            const isLocal = !user;
            const id = isLocal ? d.id : d.id;
            const name = isLocal ? d.name : d.notes || "Custom Design";
            const shape = d.shape || "Oval";
            const color = d.color || "Ivory";
            const fragrance = d.fragrance || "Unscented";
            const ingredients = d.ingredients || [];
            
            return (
              <div key={id} className="border border-[color:var(--border)] p-6 rounded-md flex flex-col justify-between">
                <div>
                  <div className="text-display text-2xl">{name}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                    {shape} · {color} · {fragrance}
                  </div>
                  <div className="mt-4 text-xs text-[color:var(--muted-foreground)]">
                    Ingredients: {ingredients.length > 0 ? ingredients.join(", ") : "—"}
                  </div>
                  {!isLocal && d.notes && (
                    <div className="mt-2 text-xs text-[color:var(--foreground)] italic">"{d.notes}"</div>
                  )}
                  {!isLocal && (
                    <div className="mt-4 text-sm font-medium">Estimated: ₹{d.estimated_price}</div>
                  )}
                </div>
                
                <div className="mt-8 flex justify-between items-end border-t border-[color:var(--border)] pt-4">
                  <button 
                    onClick={() => {
                      if (isLocal) {
                        localAddToCart(d);
                      } else {
                        addToCart.mutate({ productId: null, quantity: 1, customizationId: id });
                      }
                    }} 
                    disabled={!isLocal && addToCart.isPending}
                    className="text-xs uppercase tracking-widest text-[color:var(--foreground)] hover:text-[color:var(--gold)] transition"
                  >
                    {!isLocal && addToCart.isPending ? "Adding..." : "Add to Bag"}
                  </button>
                  <button 
                    onClick={() => isLocal ? localDelete(id) : deleteCustomization.mutate(id)} 
                    className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] hover:text-red-500 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
