import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/addresses")({
  component: () => (
    <div className="surface-glass rounded-md p-10">
      <div className="text-eyebrow text-[color:var(--muted-foreground)]">Addresses</div>
      <div className="text-display mt-3 text-3xl">No addresses saved</div>
      <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">
        Add a shipping address for a smoother checkout ritual.
      </p>
      <button className="btn-ghost-lux mt-8">Add address</button>
    </div>
  ),
});
