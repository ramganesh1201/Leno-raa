import { createFileRoute } from "@tanstack/react-router";
import { useAccount } from "@/lib/store";

export const Route = createFileRoute("/account/settings")({
  component: Settings,
});

function Settings() {
  const signOut = useAccount((s) => s.signOut);
  return (
    <div className="surface-glass rounded-md p-10">
      <div className="text-eyebrow text-[color:var(--muted-foreground)]">Settings</div>
      <div className="text-display mt-3 text-3xl">Preferences</div>
      <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">
        Email preferences, notifications and privacy controls.
      </p>
      <button onClick={signOut} className="btn-ghost-lux mt-8">Sign out</button>
    </div>
  );
}
