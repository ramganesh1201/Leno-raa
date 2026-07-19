import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { SplitText } from "@/components/immersive/SplitText";
import { motion, AnimatePresence } from "framer-motion";
import { User, Package, MapPin, Heart, Sparkles, Clock, Settings } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — Lenoraa" },
      { name: "description", content: "Manage your Lenoraa account." },
    ],
  }),
  component: AccountLayout,
});

export function AccountShell({
  children,
  requireAuth = true,
}: {
  children: React.ReactNode;
  requireAuth?: boolean;
}) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.role === "admin") {
      navigate({ to: "/admin" });
    }
  }, [profile, navigate]);

  if (isAuthLoading || isProfileLoading || profile?.role === "admin") {
    return <div className="min-h-screen" />;
  }

  if (requireAuth && !user) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center pt-32">
        <div className="surface-glass max-w-md rounded-[24px] p-10 text-center border border-[color:var(--border)] shadow-2xl">
          <SplitText as="h1" text="Sign in to continue" className="text-display text-4xl" />
          <p className="mt-4 text-sm text-[color:var(--muted-foreground)]">
            Your rituals, orders and saved designs live here.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/auth/login" className="btn-lux">
              Sign in
            </Link>
            <Link to="/auth/signup" className="btn-ghost-lux">
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Guest";

  const nav = [
    { to: "/account", label: "Profile", icon: User },
    { to: "/account/orders", label: "Orders", icon: Package },
    { to: "/account/addresses", label: "Addresses", icon: MapPin },
    { to: "/wishlist", label: "Wishlist", icon: Heart },
    { to: "/account/saved-designs", label: "Saved Designs", icon: Sparkles },
    { to: "/account/recently-viewed", label: "Recently Viewed", icon: Clock },
    { to: "/account/settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <div className="relative pt-32 pb-40 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid gap-12 md:grid-cols-[240px_1fr] items-start">
          <aside className="md:sticky md:top-32 w-full pb-6 md:pb-0">
            <ul className="grid md:flex md:flex-col grid-cols-2 md:grid-cols-none gap-3 md:gap-2">
              {nav.map(({ to, label, icon: Icon }) => {
                const isActive = pathname === to || pathname.startsWith(to + "/");
                // exception for exact match on /account
                const isActuallyActive =
                  to === "/account"
                    ? pathname === "/account" || pathname === "/account/"
                    : isActive;

                return (
                  <li key={to} className="relative">
                    <Link
                      to={to}
                      className={`relative z-10 flex flex-col md:flex-row items-start md:items-center justify-center md:justify-start gap-3 p-4 md:px-4 md:py-3 rounded-2xl md:rounded-xl transition-all duration-300 border md:border-none ${
                        isActuallyActive
                          ? "text-[color:var(--gold)] bg-[color:var(--gold)]/5 md:bg-transparent border-[color:var(--gold)]/30 md:border-transparent"
                          : "text-[color:var(--foreground)] hover:text-[color:var(--gold)] bg-[color:var(--background)] md:bg-transparent border-[color:var(--border)] md:border-transparent shadow-sm md:shadow-none"
                      }`}
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.5}
                        className={
                          isActuallyActive
                            ? "text-[color:var(--gold)]"
                            : "text-[color:var(--muted-foreground)]"
                        }
                      />
                      <span className="text-sm font-medium tracking-wide mt-1 md:mt-0">
                        {label}
                      </span>
                    </Link>
                    {isActuallyActive && (
                      <motion.div
                        layoutId="account-nav-active"
                        className="absolute inset-0 bg-[color:var(--gold)]/10 border border-[color:var(--gold)]/20 rounded-xl hidden md:block"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </aside>

          <main className="min-w-0 w-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

function AccountLayout() {
  return (
    <AccountShell requireAuth={true}>
      <Outlet />
    </AccountShell>
  );
}
