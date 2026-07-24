import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useShop } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useNotifications } from "@/hooks/useNotifications";
import { collections, getProductCollections } from "@/lib/catalog";
import { resolveImageUrl } from "@/lib/imageResolver";
import { productService } from "@/services/product.service";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Reveal } from "@/components/immersive/Reveal";
import {
  Heart,
  ShoppingBag,
  User,
  Search,
  Bell,
  Check,
  MapPin,
  Package,
  Settings,
  Sparkles,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Home,
  Droplets,
  BookOpen,
  Leaf,
  Instagram,
  Facebook,
  Mail,
  Phone,
} from "lucide-react";
import { businessConfig } from "@/config/business";

export function SiteHeader() {
  const { user, signOut: authSignOut, isLoading: isAuthLoading } = useAuth();
  const { cart: supabaseCart } = useCart();
  const { wishlist: supabaseWishlist } = useWishlist();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const localCart = useShop((s) => s.cart);
  const localWishlist = useShop((s) => s.wishlist);

  const cartCount = user
    ? supabaseCart.reduce((a, c) => a + c.quantity, 0)
    : localCart.reduce((a, c) => a + c.quantity, 0);

  const wishCount = user ? supabaseWishlist.length : localWishlist.length;
  const { profile, isLoading: isProfileLoading } = useProfile();
  const loading = isAuthLoading || (user && isProfileLoading);
  const displayName = profile?.full_name || user?.user_metadata?.full_name;

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<null | "collections" | "account" | "notifications">(
    null,
  );
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState(0);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileCollectionsOpen, setIsMobileCollectionsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const searchResults = useMemo(() => {
    return searchQuery
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            getProductCollections(p).some((c) =>
              c.toLowerCase().includes(searchQuery.toLowerCase()),
            ) ||
            p.ingredients.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase())),
        )
      : [];
  }, [searchQuery, products]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
    setOpenMenu(null);
    setMobileMenuOpen(false);
    setIsSearchHovered(false);
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Prevent body scroll and scale background when mobile menu is open
  useEffect(() => {
    let scrollY = window.scrollY;

    if (mobileMenuOpen || isMobileSearchOpen) {
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      if (mobileMenuOpen) {
        const mainEl = document.querySelector("main");
        const footerEl = document.querySelector("footer");
        [mainEl, footerEl].forEach((el) => {
          if (el) {
            el.style.transform = "scale(0.96) translateY(4px)";
            el.style.filter = "blur(10px) brightness(0.85)";
            el.style.transition = "all 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
            el.style.transformOrigin = "top center";
          }
        });
      }
    } else {
      const topStr = document.body.style.top;
      if (topStr && topStr.includes("-")) {
        scrollY = parseInt(topStr || "0") * -1;
      }
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (topStr && topStr.includes("-")) {
        window.scrollTo(0, scrollY);
      }
      const mainEl = document.querySelector("main");
      const footerEl = document.querySelector("footer");
      [mainEl, footerEl].forEach((el) => {
        if (el) {
          el.style.transform = "";
          el.style.filter = "";
        }
      });
    }
    
    return () => {
      if (document.body.style.position === "fixed") {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
        const mainEl = document.querySelector("main");
        const footerEl = document.querySelector("footer");
        [mainEl, footerEl].forEach((el) => {
          if (el) {
            el.style.transform = "";
            el.style.filter = "";
          }
        });
      }
    };
  }, [mobileMenuOpen, isMobileSearchOpen]);

  return (
    <header
      ref={menuRef}
      className={`fixed top-0 z-50 w-full transition-all duration-700 h-[60px] flex items-center md:h-auto md:block ${
        scrolled
          ? "bg-[color:var(--ivory)]/80 backdrop-blur-md shadow-sm border-b border-[color:var(--border)] py-0 md:py-3"
          : "bg-transparent py-0 md:py-6"
      }`}
    >
      {/* MOBILE NAVBAR */}
      <div className="flex md:hidden items-center justify-between w-full h-[72px] px-6 relative pt-[var(--safe-top,0px)]">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="nav-icon-btn group -ml-2 p-2"
          aria-label="Open menu"
          data-lux-hover
        >
          <Menu size={28} strokeWidth={1.5} className="transition-colors duration-250" />
        </button>
        <Link
          to="/"
          className="text-display text-3xl tracking-wide text-[color:var(--foreground)] absolute left-1/2 -translate-x-1/2"
          data-lux-hover
        >
          Lenoraa
        </Link>
        <div className="flex items-center gap-1 -mr-2">
          <button
            className="nav-icon-btn group p-2"
            aria-label="Search"
            data-lux-hover
            onClick={() => {
              setIsMobileSearchOpen(true);
              setTimeout(() => mobileSearchInputRef.current?.focus(), 100);
            }}
          >
            <Search size={28} strokeWidth={1.5} className="transition-colors duration-250" />
          </button>
          <Link
            to="/cart"
            className="flex nav-icon-btn group relative p-2"
            aria-label="Bag"
            data-lux-hover
          >
            <ShoppingBag size={28} strokeWidth={1.5} className="transition-colors duration-250" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[color:var(--gold)] text-[10px] font-bold text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* DESKTOP NAVBAR */}
      <div className="mx-auto hidden md:flex w-full max-w-[1500px] items-center justify-between px-12 relative">
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
          {/* MOBILE SEARCH BUTTON */}
          {/* Handled in MOBILE NAVBAR above */}

          {/* DESKTOP SEARCH WRAPPER */}
          <div
            className="relative items-center justify-end h-11 w-11 hidden md:flex"
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
                        navigate({
                          to: "/products/$slug",
                          params: { slug: searchResults[searchIndex].slug },
                        });
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
                                {product.image && (
                                  <img
                                    src={resolveImageUrl(product.image)}
                                    alt={product.name}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-sm font-medium text-[color:var(--foreground)]">
                                  {product.name}
                                </div>
                                <div className="text-[10px] uppercase tracking-wider text-[color:var(--foreground)]/50">
                                  {product.collection}
                                </div>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="p-4 text-center">
                            <div className="text-sm text-[color:var(--foreground)] font-medium">
                              No soaps found
                            </div>
                            <div className="text-xs text-[color:var(--foreground)]/60 mt-1">
                              Try another ingredient or collection.
                            </div>
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
            {wishCount > 0 && <span className="nav-badge">{wishCount}</span>}
            <span className="nav-tooltip">Saved</span>
          </Link>

          {user && (
            <button
              onClick={() => setOpenMenu((m) => (m === "notifications" ? null : "notifications"))}
              className="hidden sm:flex nav-icon-btn group"
              aria-label="Notifications"
              data-lux-hover
            >
              <Bell size={20} strokeWidth={1.5} className="transition-colors duration-250" />
              {unreadCount > 0 && (
                <span className="nav-badge bg-[color:var(--gold)] text-white">{unreadCount}</span>
              )}
              <span className="nav-tooltip">Updates</span>
            </button>
          )}

          <Link to="/cart" className="flex nav-icon-btn group" aria-label="Bag" data-lux-hover>
            <ShoppingBag size={20} strokeWidth={1.5} className="transition-colors duration-250" />
            {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
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
                    {loading
                      ? `👤 Loading...`
                      : user
                        ? `👤 ${displayName || "Guest"}`
                        : `👤 Sign In`}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => {
                if (!user) {
                  navigate({ to: "/auth/login" });
                } else {
                  setOpenMenu((m) => (m === "account" ? null : "account"));
                }
              }}
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
                      src={resolveImageUrl(c.image)}
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

      {/* Notifications dropdown */}
      <AnimatePresence>
        {openMenu === "notifications" && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="surface-menu absolute right-24 top-full mt-3 w-80 max-h-96 overflow-y-auto rounded-md p-6 md:right-32"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-display text-xl">Notifications</div>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAsRead.mutate()}
                  className="text-xs uppercase tracking-[0.1em] text-[color:var(--gold)] transition hover:text-[color:var(--foreground)] flex items-center gap-1"
                >
                  <Check size={14} /> Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="text-sm text-[color:var(--muted-foreground)] text-center py-6">
                You have no notifications.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-md transition-colors ${n.is_read ? "" : "bg-black/5 dark:bg-white/5"}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm text-[color:var(--foreground)]">
                        {n.title}
                      </div>
                      {!n.is_read && (
                        <button
                          onClick={() => markAsRead.mutate(n.id)}
                          className="h-2 w-2 rounded-full bg-[color:var(--gold)]"
                          aria-label="Mark as read"
                        />
                      )}
                    </div>
                    <p className="text-xs text-[color:var(--muted-foreground)] leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account dropdown */}
      <AnimatePresence>
        {openMenu === "account" && user && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-6 top-full mt-4 w-[320px] rounded-[20px] surface-glass border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl md:right-12 overflow-hidden flex flex-col z-50"
          >
            {loading ? (
              <div className="animate-pulse p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-[color:var(--foreground)]/10"></div>
                  <div>
                    <div className="h-4 w-24 bg-[color:var(--foreground)]/10 rounded mb-2"></div>
                    <div className="h-3 w-32 bg-[color:var(--foreground)]/10 rounded"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 bg-[color:var(--foreground)]/5 rounded"></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center gap-4 px-6 pt-6 pb-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--gold)]/10 text-[color:var(--gold)] border border-[color:var(--gold)]/20 shadow-sm">
                    <User size={22} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-display text-lg tracking-wide truncate text-[color:var(--foreground)]">
                      {displayName || "Guest"}
                    </div>
                    <div className="text-xs text-[color:var(--muted-foreground)] truncate mt-0.5">
                      {profile?.email || user.email}
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-[color:var(--border)] to-transparent opacity-50 my-1" />

                <ul className="flex flex-col px-3 py-2 space-y-0.5">
                  {[
                    { to: "/account", label: "My Profile", icon: User },
                    { to: "/account/orders", label: "My Orders", icon: Package },
                    { to: "/account/addresses", label: "Addresses", icon: MapPin },
                    { to: "/wishlist", label: "Wishlist", icon: Heart },
                    { to: "/account/saved-designs", label: "Saved Designs", icon: Sparkles },
                    { to: "/account/settings", label: "Settings", icon: Settings },
                  ].map(({ to, label, icon: Icon }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        onClick={() => setOpenMenu(null)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-[color:var(--foreground)]/5 hover:text-[color:var(--gold)] text-[color:var(--foreground)] text-sm font-medium"
                      >
                        <Icon
                          size={16}
                          strokeWidth={1.5}
                          className="text-[color:var(--muted-foreground)]"
                        />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-[color:var(--border)] to-transparent opacity-50 my-1" />

                <div className="px-3 pb-3 pt-1">
                  <button
                    onClick={async () => {
                      await authSignOut.mutateAsync();
                      setOpenMenu(null);
                    }}
                    disabled={authSignOut.isPending}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 text-[color:var(--muted-foreground)] text-sm font-medium"
                  >
                    <LogOut size={16} strokeWidth={1.5} />
                    {authSignOut.isPending ? "Signing out..." : "Sign Out"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Fullscreen Search */}
      {typeof document !== "undefined" ? createPortal(
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-[color:var(--ivory)] flex flex-col md:hidden"
          >
            <div className="flex items-center border-b border-[color:var(--border)] px-4 py-4 gap-3 bg-[color:var(--ivory)]/90 backdrop-blur-md">
              <Search size={20} className="text-[color:var(--muted-foreground)]" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search soaps, ingredients..."
                className="flex-1 bg-transparent border-none outline-none text-base text-[color:var(--foreground)] placeholder:text-[color:var(--foreground)]/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-2 -mr-2 text-[color:var(--foreground)]"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-[color:var(--ivory)]">
              {searchQuery ? (
                <div className="flex flex-col gap-2">
                  <div className="text-xs uppercase tracking-wider text-[color:var(--muted-foreground)] mb-2 font-medium">
                    Results
                  </div>
                  {searchResults.length > 0 ? (
                    searchResults.map((product) => (
                      <Link
                        key={product.slug}
                        to="/products/$slug"
                        params={{ slug: product.slug }}
                        onClick={() => {
                          setIsMobileSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-4 p-3 rounded-xl transition-colors hover:bg-[color:var(--foreground)]/5 active:bg-[color:var(--foreground)]/10"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-[color:var(--cream)] shrink-0">
                          {product.image && (
                            <img
                              src={resolveImageUrl(product.image)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-base font-medium text-[color:var(--foreground)]">
                            {product.name}
                          </div>
                          <div className="text-[11px] uppercase tracking-wider text-[color:var(--foreground)]/50 mt-1">
                            {product.collection}
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <div className="text-base text-[color:var(--foreground)] font-medium">
                        No soaps found
                      </div>
                      <div className="text-sm text-[color:var(--foreground)]/60 mt-2">
                        Try another ingredient or collection.
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-6 pt-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-[color:var(--muted-foreground)] mb-3 font-medium">
                      Suggested Collections
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {collections.slice(0, 4).map((c) => (
                        <Link
                          key={c.slug}
                          to="/collections/$slug"
                          params={{ slug: c.slug }}
                          onClick={() => setIsMobileSearchOpen(false)}
                          className="px-4 py-2 rounded-full border border-[color:var(--border)] text-sm text-[color:var(--foreground)]/80 active:bg-[color:var(--foreground)]/5"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-[color:var(--muted-foreground)] mb-3 font-medium">
                      Trending Soaps
                    </div>
                    <div className="flex flex-col gap-2">
                      {products.slice(0, 3).map((product) => (
                        <Link
                          key={product.slug}
                          to="/products/$slug"
                          params={{ slug: product.slug }}
                          onClick={() => setIsMobileSearchOpen(false)}
                          className="flex items-center gap-4 p-2 rounded-xl active:bg-[color:var(--foreground)]/5"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-[color:var(--cream)] shrink-0">
                            {product.image && (
                              <img
                                src={resolveImageUrl(product.image)}
                                alt={product.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-[color:var(--foreground)]">
                              {product.name}
                            </div>
                            <div className="text-[10px] uppercase tracking-wider text-[color:var(--foreground)]/50 mt-0.5">
                              {product.collection}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      ) : null}

      {/* Mobile Hamburger Menu Drawer */}
      {typeof document !== "undefined" ? createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-[70] w-[90vw] max-w-[400px] bg-[color:var(--ivory)] rounded-r-[24px] shadow-[20px_0_50px_rgba(0,0,0,0.15)] flex flex-col md:hidden overflow-hidden bg-gradient-to-br from-[color:var(--ivory)] to-[color:var(--cream)]"
            >
              {/* Subtle ambient floating particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <motion.div
                  animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/4 left-1/4 w-32 h-32 bg-[color:var(--gold)]/10 rounded-full blur-3xl"
                />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-4 border-b border-[color:var(--border)] relative z-10 bg-[color:var(--ivory)]/50 backdrop-blur-md">
                <div className="flex flex-col">
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-display text-3xl tracking-wide text-[color:var(--foreground)]"
                  >
                    Lenoraa
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)] mt-1"
                  >
                    Handcrafted Botanical Soaps
                  </motion.span>
                </div>
                <motion.button
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  whileTap={{ scale: 0.85, rotate: 90 }}
                  transition={{ type: "spring", damping: 20 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-[color:var(--foreground)] rounded-full transition-colors active:bg-[color:var(--foreground)]/5 flex items-center justify-center min-w-[48px] min-h-[48px]"
                >
                  <X size={28} strokeWidth={1.5} />
                </motion.button>
              </div>

              {/* Main Navigation List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
                    },
                  }}
                  className="flex flex-col p-4 gap-1 relative z-10"
                >
                  {/* Home */}
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  >
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 p-3 rounded-2xl transition-all active:scale-[0.98] active:bg-[color:var(--foreground)]/5 group relative overflow-hidden"
                    >
                      {pathname === "/" && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[color:var(--gold)] rounded-r-full"
                        />
                      )}
                      <div className="w-10 h-10 rounded-full bg-[color:var(--cream)] border border-[color:var(--border)] flex items-center justify-center shrink-0 group-active:border-[color:var(--gold)]/30 transition-colors">
                        <Home
                          size={18}
                          strokeWidth={1.5}
                          className="text-[color:var(--foreground)] group-active:text-[color:var(--gold)]"
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-display text-2xl text-[color:var(--foreground)] group-active:text-[color:var(--gold)] transition-colors">
                          Home
                        </span>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-[color:var(--muted-foreground)] opacity-50 group-active:opacity-100 group-active:text-[color:var(--gold)] transition-all transform group-active:translate-x-1"
                      />
                    </Link>
                  </motion.div>

                  {/* Collections Accordion */}
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                    className="flex flex-col"
                  >
                    <button
                      onClick={() => setIsMobileCollectionsOpen(!isMobileCollectionsOpen)}
                      className="flex items-center gap-4 p-3 rounded-2xl transition-all active:scale-[0.98] active:bg-[color:var(--foreground)]/5 group relative w-full text-left"
                    >
                      {pathname.includes("/collections") && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[color:var(--gold)] rounded-r-full"
                        />
                      )}
                      <div className="w-10 h-10 rounded-full bg-[color:var(--cream)] border border-[color:var(--border)] flex items-center justify-center shrink-0 group-active:border-[color:var(--gold)]/30 transition-colors">
                        <Droplets
                          size={18}
                          strokeWidth={1.5}
                          className="text-[color:var(--foreground)] group-active:text-[color:var(--gold)]"
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-display text-2xl text-[color:var(--foreground)] group-active:text-[color:var(--gold)] transition-colors">
                          Collections
                        </span>
                        <span className="text-[12px] text-[color:var(--muted-foreground)]">
                          Explore Botanical Chapters
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isMobileCollectionsOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown
                          size={18}
                          strokeWidth={1.5}
                          className="text-[color:var(--muted-foreground)] opacity-50"
                        />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isMobileCollectionsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pl-[3.25rem] flex flex-col gap-1 border-l border-[color:var(--border)]/50 ml-8 mt-1 mb-2 py-2">
                            {collections.map((c, idx) => (
                              <motion.div
                                key={c.slug}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                              >
                                <Link
                                  to="/collections/$slug"
                                  params={{ slug: c.slug }}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex flex-col justify-center py-2 px-3 rounded-lg transition-colors active:bg-[color:var(--foreground)]/5 group/link"
                                >
                                  <span className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)] group-active/link:text-[color:var(--gold)] transition-colors">
                                    Chapter{" "}
                                    {["I", "II", "III", "IV", "V", "VI", "VII"][idx] || idx + 1}
                                  </span>
                                  <span className="text-lg text-[color:var(--foreground)] font-medium">
                                    {c.name}
                                  </span>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Customize */}
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  >
                    <Link
                      to="/customize"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 p-3 rounded-2xl transition-all active:scale-[0.98] active:bg-[color:var(--foreground)]/5 group relative overflow-hidden"
                    >
                      {pathname === "/customize" && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[color:var(--gold)] rounded-r-full"
                        />
                      )}
                      <div className="w-10 h-10 rounded-full bg-[color:var(--cream)] border border-[color:var(--border)] flex items-center justify-center shrink-0 group-active:border-[color:var(--gold)]/30 transition-colors">
                        <Sparkles
                          size={18}
                          strokeWidth={1.5}
                          className="text-[color:var(--foreground)] group-active:text-[color:var(--gold)]"
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-display text-2xl text-[color:var(--foreground)] group-active:text-[color:var(--gold)] transition-colors">
                          Customize
                        </span>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-[color:var(--muted-foreground)] opacity-50 group-active:opacity-100 group-active:text-[color:var(--gold)] transition-all transform group-active:translate-x-1"
                      />
                    </Link>
                  </motion.div>

                  {/* Story */}
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  >
                    <Link
                      to="/story"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 p-3 rounded-2xl transition-all active:scale-[0.98] active:bg-[color:var(--foreground)]/5 group relative overflow-hidden"
                    >
                      {pathname === "/story" && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[color:var(--gold)] rounded-r-full"
                        />
                      )}
                      <div className="w-10 h-10 rounded-full bg-[color:var(--cream)] border border-[color:var(--border)] flex items-center justify-center shrink-0 group-active:border-[color:var(--gold)]/30 transition-colors">
                        <BookOpen
                          size={18}
                          strokeWidth={1.5}
                          className="text-[color:var(--foreground)] group-active:text-[color:var(--gold)]"
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-display text-2xl text-[color:var(--foreground)] group-active:text-[color:var(--gold)] transition-colors">
                          Story
                        </span>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-[color:var(--muted-foreground)] opacity-50 group-active:opacity-100 group-active:text-[color:var(--gold)] transition-all transform group-active:translate-x-1"
                      />
                    </Link>
                  </motion.div>

                  <div className="h-px w-full bg-[color:var(--border)]/50 my-2" />

                  {/* Wishlist */}
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  >
                    <Link
                      to="/wishlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 p-3 rounded-2xl transition-all active:scale-[0.98] active:bg-[color:var(--foreground)]/5 group relative overflow-hidden"
                    >
                      {pathname === "/wishlist" && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[color:var(--gold)] rounded-r-full"
                        />
                      )}
                      <div className="w-10 h-10 rounded-full bg-[color:var(--cream)] border border-[color:var(--border)] flex items-center justify-center shrink-0 group-active:border-[color:var(--gold)]/30 transition-colors">
                        <Heart
                          size={18}
                          strokeWidth={1.5}
                          className="text-[color:var(--foreground)] group-active:text-[color:var(--gold)]"
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-display text-xl text-[color:var(--foreground)] group-active:text-[color:var(--gold)] transition-colors">
                          Wishlist
                        </span>
                      </div>
                    </Link>
                  </motion.div>

                  {/* Cart */}
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  >
                    <Link
                      to="/cart"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 p-3 rounded-2xl transition-all active:scale-[0.98] active:bg-[color:var(--foreground)]/5 group relative overflow-hidden"
                    >
                      {pathname === "/cart" && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[color:var(--gold)] rounded-r-full"
                        />
                      )}
                      <div className="w-10 h-10 rounded-full bg-[color:var(--cream)] border border-[color:var(--border)] flex items-center justify-center shrink-0 group-active:border-[color:var(--gold)]/30 transition-colors relative">
                        <ShoppingBag
                          size={18}
                          strokeWidth={1.5}
                          className="text-[color:var(--foreground)] group-active:text-[color:var(--gold)]"
                        />
                        {cartCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--gold)] text-[10px] text-white">
                            {cartCount}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-display text-xl text-[color:var(--foreground)] group-active:text-[color:var(--gold)] transition-colors">
                          Cart
                        </span>
                      </div>
                    </Link>
                  </motion.div>

                  {/* Account */}
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  >
                    {!user ? (
                      <Link
                        to="/auth/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-4 p-3 rounded-2xl transition-all active:scale-[0.98] active:bg-[color:var(--foreground)]/5 group relative overflow-hidden"
                      >
                        <div className="w-10 h-10 rounded-full bg-[color:var(--cream)] border border-[color:var(--border)] flex items-center justify-center shrink-0 group-active:border-[color:var(--gold)]/30 transition-colors">
                          <User
                            size={18}
                            strokeWidth={1.5}
                            className="text-[color:var(--foreground)] group-active:text-[color:var(--gold)]"
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <span className="text-display text-xl text-[color:var(--foreground)] group-active:text-[color:var(--gold)] transition-colors">
                            Sign In / Register
                          </span>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        to="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-4 p-3 rounded-2xl transition-all active:scale-[0.98] active:bg-[color:var(--foreground)]/5 group relative overflow-hidden"
                      >
                        {pathname.includes("/account") && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[color:var(--gold)] rounded-r-full"
                          />
                        )}
                        <div className="w-10 h-10 rounded-full bg-[color:var(--cream)] border border-[color:var(--border)] flex items-center justify-center shrink-0 group-active:border-[color:var(--gold)]/30 transition-colors">
                          <User
                            size={18}
                            strokeWidth={1.5}
                            className="text-[color:var(--foreground)] group-active:text-[color:var(--gold)]"
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <span className="text-display text-xl text-[color:var(--foreground)] group-active:text-[color:var(--gold)] transition-colors">
                            {displayName || "My Profile"}
                          </span>
                          <span className="text-[12px] text-[color:var(--muted-foreground)]">
                            Manage your details
                          </span>
                        </div>
                      </Link>
                    )}
                  </motion.div>
                </motion.div>

                {/* Featured Collection */}
                {collections.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="px-6 pb-6 relative z-10"
                  >
                    <div className="text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)] mb-3 pl-1">
                      Featured
                    </div>
                    <Link
                      to="/collections/$slug"
                      params={{ slug: collections[0].slug }}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] shadow-sm active:scale-[0.98] transition-all group overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--cream)] to-transparent pointer-events-none opacity-50" />
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex flex-col">
                          <span className="text-display text-xl text-[color:var(--foreground)] group-active:text-[color:var(--gold)] transition-colors">
                            {collections[0].name}
                          </span>
                          <span className="text-[11px] uppercase tracking-widest text-[color:var(--muted-foreground)] line-clamp-1 mt-1">
                            {collections[0].eyebrow}
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[color:var(--background)] border border-[color:var(--border)] flex items-center justify-center shrink-0 group-active:bg-[color:var(--gold)] group-active:text-[color:var(--background)] transition-colors">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Compact Inline Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="py-4 px-6 border-t border-[color:var(--border)] bg-[color:var(--ivory)] flex items-center justify-between relative z-10 text-[9px] uppercase tracking-widest text-[color:var(--muted-foreground)]"
              >
                <span>🌿 Natural</span>
                <span className="w-1 h-1 rounded-full bg-[color:var(--border)]"></span>
                <span>🧼 Cold Processed</span>
                <span className="w-1 h-1 rounded-full bg-[color:var(--border)]"></span>
                <span>🇮🇳 India</span>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative mt-32 border-t border-[color:var(--border)] bg-[color:var(--cream)]/60 py-12 md:py-20">
      <div className="mx-auto grid max-w-[1400px] gap-8 md:gap-16 px-6 md:grid-cols-4 md:px-12">
        {/* Brand / Company */}
        <div className="mb-4 md:mb-0">
          <Reveal preset="subheading" className="text-display text-3xl mb-4">
            Lenoraa
          </Reveal>
          <ul className="space-y-3 text-sm text-[color:var(--muted-foreground)]">
            <li>
              <Link to="/about" className="transition hover:text-[color:var(--gold)]">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/story" className="transition hover:text-[color:var(--gold)]">
                Our Story
              </Link>
            </li>
            <li>
              <Link
                to="/collections/$slug"
                params={{ slug: "radiance" }}
                className="transition hover:text-[color:var(--gold)]"
              >
                Collections
              </Link>
            </li>
            <li>
              <Link to="/customize" className="transition hover:text-[color:var(--gold)]">
                Customize
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <Reveal preset="label" className="text-eyebrow mb-4 text-[color:var(--muted-foreground)]">
            Customer Support
          </Reveal>
          <ul className="space-y-3 text-sm text-[color:var(--muted-foreground)]">
            <li>
              <Link to="/privacy" className="transition hover:text-[color:var(--gold)]">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="transition hover:text-[color:var(--gold)]">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="transition hover:text-[color:var(--gold)]">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link to="/refunds" className="transition hover:text-[color:var(--gold)]">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition hover:text-[color:var(--gold)]">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <Reveal preset="label" className="text-eyebrow mb-4 text-[color:var(--muted-foreground)]">
            Contact
          </Reveal>
          <ul className="space-y-3 text-sm text-[color:var(--muted-foreground)]">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <a
                href={`mailto:${businessConfig.email}`}
                className="transition hover:text-[color:var(--gold)]"
              >
                {businessConfig.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <a
                href={`tel:${businessConfig.phone}`}
                className="transition hover:text-[color:var(--gold)]"
              >
                {businessConfig.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{businessConfig.address}</span>
            </li>
          </ul>
        </div>

        {/* Social & Newsletter */}
        <div>
          <Reveal preset="label" className="text-eyebrow mb-4 text-[color:var(--muted-foreground)]">
            Connect
          </Reveal>
          <div className="flex gap-4 mb-8 text-[color:var(--muted-foreground)]">
            {businessConfig.socialLinks.instagram && (
              <a
                href={businessConfig.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-[color:var(--gold)]"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {businessConfig.socialLinks.facebook && (
              <a
                href={businessConfig.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-[color:var(--gold)]"
              >
                <Facebook className="h-5 w-5" />
              </a>
            )}
          </div>

          <Reveal preset="label" className="text-eyebrow mb-4 text-[color:var(--muted-foreground)]">
            Newsletter
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
      <div className="mx-auto mt-12 max-w-[1400px] px-6 text-xs uppercase tracking-[0.28em] text-[color:var(--muted-foreground)] md:px-12">
        © {new Date().getFullYear()} {businessConfig.name} · Crafted by hand
      </div>
    </footer>
  );
}
