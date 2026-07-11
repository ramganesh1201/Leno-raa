import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAccount, useShop } from "@/lib/store";
import { collections } from "@/lib/catalog";

export function SiteHeader() {
  const cartCount = useShop((s) => s.cart.reduce((a, c) => a + c.quantity, 0));
  const wishCount = useShop((s) => s.wishlist.length);
  const account = useAccount((s) => s.account);
  const signOut = useAccount((s) => s.signOut);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<null | "collections" | "account">(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpenMenu(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header
      ref={menuRef}
      className={`fixed top-0 z-50 w-full transition-all duration-700 ${
        scrolled ? "surface-glass py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 md:px-12">
        <Link
          to="/"
          className="text-display text-2xl tracking-wide text-[color:var(--foreground)]"
          data-lux-hover
        >
          Lenoraa
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-eyebrow text-[color:var(--foreground)]/70 transition hover:text-[color:var(--gold)]"
          >
            Home
          </Link>
          <button
            onClick={() => setOpenMenu((m) => (m === "collections" ? null : "collections"))}
            className="text-eyebrow text-[color:var(--foreground)]/70 transition hover:text-[color:var(--gold)]"
            data-lux-hover
          >
            Collections
          </button>
          <Link
            to="/customize"
            className="text-eyebrow text-[color:var(--foreground)]/70 transition hover:text-[color:var(--gold)]"
          >
            Customize
          </Link>
          <Link
            to="/story"
            className="text-eyebrow text-[color:var(--foreground)]/70 transition hover:text-[color:var(--gold)]"
          >
            Story
          </Link>
        </nav>
        <div className="flex items-center gap-6 text-xs uppercase tracking-[0.24em]">
          <Link
            to="/wishlist"
            className="hidden sm:inline transition hover:text-[color:var(--gold)]"
          >
            Saved{" "}
            {wishCount > 0 && (
              <sup className="text-[color:var(--gold)]">{wishCount}</sup>
            )}
          </Link>
          <Link to="/cart" className="transition hover:text-[color:var(--gold)]">
            Bag{" "}
            {cartCount > 0 && (
              <sup className="text-[color:var(--gold)]">{cartCount}</sup>
            )}
          </Link>
          <button
            onClick={() => setOpenMenu((m) => (m === "account" ? null : "account"))}
            className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--border)] bg-white/40 text-[10px] uppercase tracking-[0.2em] transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
            aria-label="Account"
            data-lux-hover
          >
            {account ? account.name.slice(0, 2).toUpperCase() : "IN"}
          </button>
        </div>
      </div>

      {/* Collections mega menu */}
      <AnimatePresence>
        {openMenu === "collections" && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="surface-menu absolute inset-x-6 top-full mt-4 rounded-md p-8 md:inset-x-12"
          >
            <div className="grid gap-6 md:grid-cols-5">
              {collections.map((c) => (
                <Link
                  key={c.slug}
                  to="/collections/$slug"
                  params={{ slug: c.slug }}
                  data-theme={c.slug}
                  className="group relative overflow-hidden rounded-md"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(closest-side, color-mix(in oklab, var(--theme) 40%, transparent), transparent)",
                        mixBlendMode: "soft-light",
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <div className="text-eyebrow text-white/60">{c.eyebrow}</div>
                      <div className="text-display mt-1 text-2xl">{c.name}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account dropdown */}
      <AnimatePresence>
        {openMenu === "account" && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="surface-menu absolute right-6 top-full mt-3 w-72 rounded-md p-6 md:right-12"
          >
            {account ? (
              <div>
                <div className="text-eyebrow text-[color:var(--muted-foreground)]">
                  Signed in
                </div>
                <div className="text-display mt-2 text-2xl">{account.name}</div>
                <div className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                  {account.email}
                </div>
                <ul className="mt-6 space-y-3 text-sm">
                  {[
                    ["/account", "Profile"],
                    ["/account/orders", "Orders"],
                    ["/account/addresses", "Addresses"],
                    ["/wishlist", "Wishlist"],
                    ["/account/saved-designs", "Saved designs"],
                    ["/account/recently-viewed", "Recently viewed"],
                    ["/account/settings", "Settings"],
                  ].map(([to, label]) => (
                    <li key={to}>
                      <Link
                        to={to}
                        className="block transition hover:text-[color:var(--gold)]"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    signOut();
                    setOpenMenu(null);
                  }}
                  className="mt-6 text-xs uppercase tracking-[0.28em] text-[color:var(--muted-foreground)] transition hover:text-[color:var(--gold)]"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div>
                <div className="text-eyebrow text-[color:var(--muted-foreground)]">
                  Welcome
                </div>
                <div className="text-display mt-2 text-2xl">The atelier awaits</div>
                <p className="mt-2 text-xs text-[color:var(--muted-foreground)]">
                  Sign in to save designs, track orders and continue rituals.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <Link to="/auth/login" className="btn-lux justify-center">
                    Sign in
                  </Link>
                  <Link to="/auth/signup" className="btn-ghost-lux justify-center">
                    Create account
                  </Link>
                  <Link
                    to="/auth/forgot"
                    className="text-center text-xs uppercase tracking-[0.28em] text-[color:var(--muted-foreground)] transition hover:text-[color:var(--gold)]"
                  >
                    Forgot password
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative mt-32 border-t border-[color:var(--border)] bg-[color:var(--cream)]/60 py-20">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:grid-cols-4 md:px-12">
        <div>
          <div className="text-display text-3xl">Lenoraa</div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[color:var(--muted-foreground)]">
            Nature crafted into luxury. Handmade soaps, doctor-formulated,
            cold-processed in small batches.
          </p>
        </div>
        <div>
          <div className="text-eyebrow mb-4 text-[color:var(--muted-foreground)]">
            Collections
          </div>
          <ul className="space-y-2 text-sm">
            {collections.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/collections/$slug"
                  params={{ slug: c.slug }}
                  className="capitalize transition hover:text-[color:var(--gold)]"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-eyebrow mb-4 text-[color:var(--muted-foreground)]">
            World
          </div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/story" className="transition hover:text-[color:var(--gold)]">Our Story</Link></li>
            <li><Link to="/customize" className="transition hover:text-[color:var(--gold)]">Custom Soap Studio</Link></li>
            <li><Link to="/cart" className="transition hover:text-[color:var(--gold)]">Bag</Link></li>
            <li><Link to="/wishlist" className="transition hover:text-[color:var(--gold)]">Saved</Link></li>
            <li><Link to="/account" className="transition hover:text-[color:var(--gold)]">Account</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-eyebrow mb-4 text-[color:var(--muted-foreground)]">
            Newsletter
          </div>
          <p className="mb-4 text-sm text-[color:var(--muted-foreground)]">
            Letters from the atelier. New rituals, seasonal releases.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input
              type="email"
              required
              placeholder="your@email"
              className="flex-1 border border-[color:var(--border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[color:var(--gold)]"
            />
            <button className="btn-lux !py-3 !px-5">Join</button>
          </form>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-[1400px] px-6 text-xs uppercase tracking-[0.28em] text-[color:var(--muted-foreground)] md:px-12">
        © {new Date().getFullYear()} Lenoraa · Crafted by hand
      </div>
    </footer>
  );
}
