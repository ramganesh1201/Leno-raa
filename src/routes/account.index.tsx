import { createFileRoute } from "@tanstack/react-router";
import { useAccount } from "@/lib/store";

export const Route = createFileRoute("/account/")({
  component: ProfilePage,
});

function ProfilePage() {
  const account = useAccount((s) => s.account)!;
  return (
    <div className="surface-glass rounded-md p-10">
      <div className="text-eyebrow text-[color:var(--muted-foreground)]">Profile</div>
      <div className="text-display mt-3 text-3xl">{account.name}</div>
      <div className="text-sm text-[color:var(--muted-foreground)]">{account.email}</div>
      <div className="mt-6 text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
        Member since {new Date(account.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
