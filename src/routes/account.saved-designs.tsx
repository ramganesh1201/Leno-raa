import { createFileRoute } from "@tanstack/react-router";
import { useShop } from "@/lib/store";

export const Route = createFileRoute("/account/saved-designs")({
  component: SavedDesigns,
});

function SavedDesigns() {
  const designs = useShop((s) => s.savedDesigns);
  const deleteDesign = useShop((s) => s.deleteDesign);
  if (designs.length === 0)
    return (
      <div className="surface-glass rounded-md p-10 text-center">
        <div className="text-eyebrow text-[color:var(--muted-foreground)]">Saved designs</div>
        <div className="text-display mt-3 text-3xl">Your studio is quiet</div>
        <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">Design your first custom soap in the Studio.</p>
      </div>
    );
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {designs.map((d) => (
        <div key={d.id} className="surface-glass rounded-md p-6">
          <div className="text-display text-2xl">{d.name}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
            {d.shape} · {d.color} · {d.fragrance}
          </div>
          <div className="mt-3 text-xs text-[color:var(--muted-foreground)]">
            Ingredients: {d.ingredients.join(", ") || "—"}
          </div>
          <button onClick={() => deleteDesign(d.id)} className="mt-6 text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)] hover:text-[color:var(--gold)]">
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
