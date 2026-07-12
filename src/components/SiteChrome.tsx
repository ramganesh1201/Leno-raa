import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useShop } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useCart } from "@/hooks/useCart";
import { collections, products } from "@/lib/catalog";
import { useNavigate } from "@tanstack/react-router";
import { Reveal } from "@/components/immersive/Reveal";
import { Heart, ShoppingBag, User, Search } from "lucide-react";

export function SiteHeader() {
  const { user, signOut: authSignOut, isLoading: isAuthLoading } = useAuth();
  const { cart: supabaseCart } = useCart();
  const localCart = useShop((s) => s.cart);
  const cartCount = user 
    ? supabaseCart.reduce((a, c) => a + c.quantity, 0)
    : localCart.reduce((a, c) => a + c.quantity, 0);
  const wishCount = useShop((s) => s.wishlist.length);
  const { profile, isLoading: isProfileLoading } = useProfile();
  const loading = isAuthLoading || (user && isProfileLoading);
  const displayName = profile?.full_name || user?.user_metadata?.full_name;
  
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<null | "collections" | "account">(null);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState(0);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const searchResults = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.ingredients.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];
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
    setIsSearchHovered(false);
    setIsSearchFocused(false);
    setSearchQuery("");
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
        scrolled ? "bg-[color:var(--ivory)]/80 backdrop-blur-md shadow-sm border-b border-[color:var(--border)] py-3" : "bg-transparent py-6"
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
            className={`text-sm font-medium tracking-wide transition hover:text-[color:var(--gold)] ${pathname === "/" ? "text-[color:var(--gold)] border-b border-[color:var(--gold)]" : "text-[color:var(--foreground)]/70"}`}
          >
            Home
          </Link>
          <button
            onClick={() => setOpenMenu((m) => (m === "collections" ? null : "collections"))}
            className={`text-sm font-medium tracking-wide transition hover:text-[color:var(--gold)] ${pathname.startsWith("/collections") ? "text-[color:var(--gold)] border-b border-[color:var(--gold)]" : "text-[color:var(--foreground)]/70"}`}
            data-lux-hover
          >
            Collections
          </button>
          <Link
            to="/customize"
            className={`text-sm font-medium tracking-wide transition hover:text-[color:var(--gold)] ${pathname.startsWith("/customize") ? "text-[color:var(--gold)] border-b border-[color:var(--gold)]" : "text-[color:var(--foreground)]/70"}`}
          >
            Customize
          </Link>
          <Link
            to="/story"
            className={`text-sm font-medium tracking-wide transition hover:text-[color:var(--gold)] ${pathname.startsWith("/story") ? "text-[color:var(--gold)] border-b border-[color:var(--gold)]" : "text-[color:var(--foreground)]/70"}`}
          >
            Story
          </Link>
        </nav>
        <div className="flex items-center gap-4 relative">
          {/* SEARCH WRAPPER */}
          <div 
            className="relative flex items-center justify-end h-11 w-11"
            onMouseEnter={() => setIsSearchHovered(true)}
            onMouseLeave={() => setIsSearchHovered(false)}
          >
            <AnimatePresence>
              {(isSearchHovered || isSearchFocused) && (
                <motion.div
                  initial={{ width: 44, opacity: 0 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 44, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 surface-glass rounded-full border border-[color:var(--border)] shadow-xl overflow-visible z-20 flex items-center h-11 pointer-events-auto"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search soaps..."
                    className="w-full bg-transparent border-none outline-none pl-4 pr-12 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--foreground)]/40"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchIndex(0);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                         setIsSearchFocused(false);
                         setIsSearchHovered(false);
                         searchInputRef.current?.blur();
                      }
                      if (e.key === "ArrowDown") {
                         e.preventDefault();
                         setSearchIndex((i) => Math.min(i + 1, searchResults.length - 1));
                      }
                      if (e.key === "ArrowUp") {
                         e.preventDefault();
                         setSearchIndex((i) => Math.max(i - 1, 0));
                      }
                      if (e.key === "Enter" && searchResults[searchIndex]) {
                         e.preventDefault();
                         navigate({ to: "/products/$slug", params: { slug: searchResults[searchIndex].slug } });
                         setIsSearchFocused(false);
                         setIsSearchHovered(false);
                         setSearchQuery("");
                      }
                    }}
                  />
                  
                  {/* DROPDOWN */}
                  <AnimatePresence>
                    {(isSearchFocused || isSearchHovered) && searchQuery && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-[calc(100%+8px)] right-0 w-80 surface-glass rounded-xl border border-[color:var(--border)] shadow-2xl p-2 flex flex-col gap-1 z-50"
                      >
                        {searchResults.length > 0 ? (
                          searchResults.slice(0, 6).map((product, idx) => (
                            <Link 
                              key={product.slug}
                              to="/products/$slug"
                              params={{ slug: product.slug }}
                              onClick={() => {
                                setIsSearchFocused(false);
                                setIsSearchHovered(false);
                                setSearchQuery("");
                              }}
                              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${idx === searchIndex ? "bg-[color:var(--ivory)]/60" : "hover:bg-[color:var(--ivory)]/40"}`}
                            >
                              <div className="w-10 h-10 rounded-md overflow-hidden bg-[color:var(--cream)]">
                                {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-sm font-medium text-[color:var(--foreground)]">{product.name}</div>
                                <div className="text-[10px] uppercase tracking-wider text-[color:var(--foreground)]/50">{product.collection}</div>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="p-4 text-center">
                            <div className="text-sm text-[color:var(--foreground)] font-medium">No soaps found</div>
                            <div className="text-xs text-[color:var(--foreground)]/60 mt-1">Try another ingredient or collection.</div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              className="absolute right-0 z-30 flex nav-icon-btn group"
              aria-label="Search"
              data-lux-hover
              onClick={() => {
                setIsSearchFocused(true);
                searchInputRef.current?.focus();
              }}
            >
              <Search size={20} strokeWidth={1.5} className="transition-colors duration-250" />
            </button>
          </div>
          
          <Link
            to="/wishlist"
            className="hidden sm:flex nav-icon-btn group"
            aria-label="Saved"
            data-lux-hover
          >
            <Heart 
              size={20} 
              strokeWidth={1.5} 
              className="transition-colors duration-250"
              fill={wishCount > 0 ? "currentColor" : "none"}
            />
            <span className="nav-tooltip">Saved</span>
          </Link>
          
          <Link 
            to="/cart" 
            className="flex nav-icon-btn group"
            aria-label="Bag"
            data-lux-hover
          >
            <ShoppingBag size={20} strokeWidth={1.5} className="transition-colors duration-250" />
            {cartCount > 0 && (
              <span className="nav-badge">{cartCount}</span>
            )}
            <span className="nav-tooltip">Bag</span>
          </Link>
          
          {/* PROFILE WRAPPER */}
          <div 
            className="relative flex items-center justify-end h-11 w-11"
            onMouseEnter={() => setIsProfileHovered(true)}
            onMouseLeave={() => setIsProfileHovered(false)}
          >
            <AnimatePresence>
              {isProfileHovered && (
                <motion.div
                  initial={{ width: 44, opacity: 0 }}
                  animate={{ width: user ? 140 : 130, opacity: 1 }}
                  exit={{ width: 44, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 h-11 surface-glass rounded-full border border-[color:var(--border)] flex items-center overflow-hidden z-20 pointer-events-none shadow-sm"
                >
                  <div className="w-full text-[10px] uppercase tracking-[0.2em] text-[color:var(--foreground)] pl-5 pr-12 whitespace-nowrap overflow-hidden text-left">
                    {loading ? `👤 Loading...` : user ? `👤 ${displayName || "Guest"}` : `👤 Sign In`}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setOpenMenu((m) => (m === "account" ? null : "account"))}
              className="absolute right-0 z-30 flex nav-icon-btn group"
              aria-label="Account"
              data-lux-hover
            >
              <User size={20} strokeWidth={1.5} className="transition-colors duration-250" />
            </button>
          </div>
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
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 w-16 bg-[color:var(--foreground)]/10 rounded mb-4"></div>
                <div className="h-8 w-40 bg-[color:var(--foreground)]/10 rounded mb-2"></div>
                <div className="h-3 w-32 bg-[color:var(--foreground)]/10 rounded mb-6"></div>
              </div>
            ) : user ? (
              <div>
                <div className="text-eyebrow text-[color:var(--muted-foreground)]">
                  Signed in
                </div>
                <div className="text-display mt-2 text-2xl">{displayName || "Guest"}</div>
                <div className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                  {profile?.email || user.email}
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
                  onClick={async () => {
                    await authSignOut.mutateAsync();
                    setOpenMenu(null);
                  }}
                  className="mt-6 text-xs uppercase tracking-[0.28em] text-[color:var(--muted-foreground)] transition hover:text-[color:var(--gold)] flex items-center"
                  disabled={authSignOut.isPending}
                >
                  {authSignOut.isPending ? "Signing out..." : "Sign out"}
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
          <Reveal preset="subheading" className="text-display text-3xl">Lenoraa</Reveal>
          <Reveal as="p" preset="paragraph" delay={0.1} className="mt-4 max-w-xs text-sm leading-relaxed text-[color:var(--muted-foreground)]">
            Nature crafted into luxury. Handmade soaps, doctor-formulated,
            cold-processed in small batches.
          </Reveal>
        </div>
        <div>
          <Reveal preset="label" className="text-eyebrow mb-4 text-[color:var(--muted-foreground)]">
            Collections
          </Reveal>
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
          <Reveal preset="label" className="text-eyebrow mb-4 text-[color:var(--muted-foreground)]">
            World
          </Reveal>
          <ul className="space-y-2 text-sm">
            <li><Link to="/story" className="transition hover:text-[color:var(--gold)]">Our Story</Link></li>
            <li><Link to="/customize" className="transition hover:text-[color:var(--gold)]">Custom Soap Studio</Link></li>
            <li><Link to="/cart" className="transition hover:text-[color:var(--gold)]">Bag</Link></li>
            <li><Link to="/wishlist" className="transition hover:text-[color:var(--gold)]">Saved</Link></li>
            <li><Link to="/account" className="transition hover:text-[color:var(--gold)]">Account</Link></li>
          </ul>
        </div>
        <div>
          <Reveal preset="label" className="text-eyebrow mb-4 text-[color:var(--muted-foreground)]">
            Newsletter
          </Reveal>
          <Reveal as="p" preset="paragraph" delay={0.1} className="mb-4 text-sm text-[color:var(--muted-foreground)]">
            Letters from the atelier. New rituals, seasonal releases.
          </Reveal>
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
