import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/account/orders")({
  component: () => (
    <div className="surface-glass rounded-md p-10 text-center">
      <div className="text-eyebrow text-[color:var(--muted-foreground)]">Orders</div>
      <div className="text-display mt-3 text-3xl">No orders yet</div>
      <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">
        When you complete a ritual, its record will appear here.
      </p>
      <Link to="/" className="btn-lux mt-8 inline-flex">Explore collections</Link>
    </div>
  ),
});
