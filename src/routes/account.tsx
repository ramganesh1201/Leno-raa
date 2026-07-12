import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { SplitText } from "@/components/immersive/SplitText";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — Lenoraa" }, { name: "description", content: "Manage your Lenoraa account." }] }),
  component: AccountLayout,
});

function AccountLayout() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Wait for initial auth check before showing logged out state
  if (isAuthLoading) {
    return <div className="min-h-screen" />; // Blank/loading screen while checking auth
  }

  if (!user) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center pt-32">
        <div className="surface-glass max-w-md rounded-md p-10 text-center">
          <SplitText as="h1" text="Sign in to continue" className="text-display text-4xl" />
          <p className="mt-4 text-sm text-[color:var(--muted-foreground)]">
            Your rituals, orders and saved designs live here.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/auth/login" className="btn-lux">Sign in</Link>
            <Link to="/auth/signup" className="btn-ghost-lux">Create account</Link>
          </div>
        </div>
      </div>
    );
  }

  // Use profile name if available, otherwise user metadata, otherwise fallback
  const displayName = profile?.full_name || user.user_metadata?.full_name || "Guest";

  const nav = [
    ["/account", "Profile"],
    ["/account/orders", "Orders"],
    ["/account/addresses", "Addresses"],
    ["/account/saved-designs", "Saved designs"],
    ["/account/recently-viewed", "Recently viewed"],
    ["/account/settings", "Settings"],
  ] as const;

  return (
    <div className="relative pt-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="text-eyebrow text-[color:var(--muted-foreground)]">Atelier</div>
        <SplitText as="h1" text={`Hello, ${displayName}`} className="text-display mt-3 text-3xl md:text-4xl md:text-4xl md:text-3xl md:text-4xl" />

        <div className="mt-12 grid gap-12 md:grid-cols-[220px_1fr]">
          <aside className="md:sticky md:top-32 md:self-start">
            <ul className="space-y-3 text-sm">
              {nav.map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`block border-l-2 pl-4 py-1 transition ${pathname === to ? "border-[color:var(--gold)] text-[color:var(--gold)]" : "border-transparent text-[color:var(--muted-foreground)] hover:text-[color:var(--gold)]"}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
