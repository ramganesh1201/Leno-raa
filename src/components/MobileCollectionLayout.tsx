import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Reveal } from "@/components/immersive/Reveal";
import { SplitText } from "@/components/immersive/SplitText";
import { Button } from "@/components/ui/button";
import {
  Filter,
  ArrowDownUp,
  Heart,
  ShoppingBag,
  Leaf,
  Droplets,
  Sparkles,
  Hand,
  Star,
} from "lucide-react";
import type { Product } from "@/lib/catalog";
import { useState, useMemo, memo } from "react";
import { resolveImageUrl } from "@/lib/imageResolver";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";

export const MobileCollectionLayout = memo(function MobileCollectionLayout({
  collection,
  items,
  otherChapters,
  ratingsMap,
}: {
  collection: any;
  items: Product[];
  otherChapters: any[];
  ratingsMap?: Record<string, { avg: number; count: number }>;
}) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Recommended");

  const filteredItems = useMemo(() => {
    let result = items;

    if (activeFilter !== "All") {
      const searchTerms = activeFilter.toLowerCase().replace(" skin", "").split(" ");
      result = result.filter((p) => {
        const text = [p.name, p.tagline, p.description, p.skinType, ...(p.benefits || [])]
          .join(" ")
          .toLowerCase();
        return searchTerms.some((term) => text.includes(term));
      });
    }

    result = [...result];
    if (sortOption === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [activeFilter, sortOption, items]);

  return (
    <div className="pb-32">
      {/* 1. Immersive Collection Hero (50dvh) */}
      <section className="relative flex h-[50dvh] items-end overflow-hidden pt-24 pb-8 px-5">
        <motion.img
          key={collection.slug}
          src={resolveImageUrl(collection.image)}
          alt={collection.name}
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Soft Environmental Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="relative z-10 w-full text-white">
          <Reveal preset="label" className="text-eyebrow text-white/80 mb-2">
            Chapter {collection.eyebrow?.replace("Chapter ", "")}
          </Reveal>
          <SplitText
            as="h1"
            text={collection.name}
            delay={0.1}
            className="text-display text-4xl leading-[1.1]"
          />
          <div className="mt-6 flex gap-3">
            <Button className="rounded-full bg-white text-black hover:bg-white/90 px-6 font-medium border-0">
              Shop Collection
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-white/30 bg-black/20 backdrop-blur-md text-white hover:bg-white/20 px-6 font-medium"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Collection Story */}
      <section className="px-5 py-10 text-center border-b border-[color:var(--border)]">
        <p className="text-lg text-[color:var(--foreground)] font-serif max-w-[30ch] mx-auto leading-relaxed">
          Inspired by calming botanicals and crafted to restore balance naturally.
        </p>
      </section>

      {/* 3. Collection Highlights */}
      <section className="px-5 py-8">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Leaf, title: "Botanical", desc: "Pure ingredients" },
            { icon: Droplets, title: "Hydration", desc: "Deep moisture" },
            { icon: Hand, title: "Handmade", desc: "Cold processed" },
            { icon: Sparkles, title: "Natural Glow", desc: "Restores balance" },
          ].map((Highlight, i) => (
            <Reveal
              key={i}
              delay={i * 0.1}
              className="bg-[color:var(--muted)]/30 border border-[color:var(--border)] p-4 rounded-xl flex flex-col gap-2"
            >
              <Highlight.icon className="w-5 h-5 text-[color:var(--theme)]" />
              <div>
                <h4 className="font-medium text-sm text-[color:var(--foreground)]">
                  {Highlight.title}
                </h4>
                <p className="text-xs text-[color:var(--muted-foreground)] mt-0.5">
                  {Highlight.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4. Quick Category Filters */}
      <section className="px-5 py-4 overflow-hidden">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-5 px-5 snap-x">
          {["All", "Best Sellers", "New", "Dry Skin", "Sensitive Skin", "Oily Skin"].map(
            (filter, i) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`snap-start whitespace-nowrap px-5 py-2 rounded-full text-sm transition-colors font-medium ${activeFilter === filter ? "bg-[color:var(--foreground)] text-[color:var(--background)] border border-[color:var(--foreground)]" : "bg-[color:var(--muted)]/50 text-[color:var(--foreground)] border border-[color:var(--border)]"}`}
              >
                {filter}
              </button>
            ),
          )}
        </div>
      </section>

      {/* 5. Featured & 6. All Products Grid */}
      <section className="px-5 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-serif text-[color:var(--foreground)]">The Collection</h3>
          <span className="text-xs text-[color:var(--muted-foreground)] uppercase tracking-widest">
            {filteredItems.length} items
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10">
          {filteredItems.map((p: Product) => (
            <Link
              key={p.slug}
              to="/products/$slug"
              params={{ slug: p.slug }}
              className="group flex flex-col active:scale-[0.98] transition-transform duration-300"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[color:var(--muted)]/30 mb-4 shadow-sm group-active:shadow-md transition-shadow">
                <img
                  src={resolveImageUrl(p.image)}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 active:bg-white/40 transition-colors cursor-pointer"
                >
                  <Heart className="w-4 h-4" />
                </div>
              </div>
              <div className="flex flex-col flex-1">
                {ratingsMap?.[p.id]?.count ? (
                  <div className="flex items-center gap-1 mb-1.5">
                    <Star className="w-3 h-3 fill-[color:var(--foreground)] text-[color:var(--foreground)]" />
                    <span className="text-[10px] font-medium tracking-wide text-[color:var(--foreground)]">
                      {ratingsMap[p.id].avg} <span className="opacity-60">({ratingsMap[p.id].count})</span>
                    </span>
                  </div>
                ) : (
                  <div className="mb-1.5 text-[9px] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
                    New
                  </div>
                )}
                <h4 className="text-sm font-medium text-[color:var(--foreground)] line-clamp-2 leading-snug">
                  {p.name}
                </h4>
                <div className="mt-auto pt-2 flex items-center justify-between">
                  <span className="text-sm font-serif text-[color:var(--foreground)]">
                    ₹{new Intl.NumberFormat("en-IN").format(p.price)}
                  </span>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="w-7 h-7 rounded-full bg-[color:var(--foreground)] text-[color:var(--background)] flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Ingredients & Benefits */}
      <section className="px-5 py-12 bg-[color:var(--muted)]/20 mt-4 border-y border-[color:var(--border)]">
        <h3 className="text-xl font-serif text-[color:var(--foreground)] mb-6 text-center">
          Botanical Synergy
        </h3>
        <div className="flex flex-col gap-4">
          <div className="bg-[color:var(--background)]/50 p-5 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[color:var(--theme)]/10 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-[color:var(--theme)]" />
            </div>
            <div>
              <h4 className="font-medium text-[color:var(--foreground)]">Cold Pressed Oils</h4>
              <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
                Preserving essential nutrients and vitamins for maximum skin benefit.
              </p>
            </div>
          </div>
          <div className="bg-[color:var(--background)]/50 p-5 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[color:var(--theme)]/10 flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5 text-[color:var(--theme)]" />
            </div>
            <div>
              <h4 className="font-medium text-[color:var(--foreground)]">Deep Hydration</h4>
              <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
                Locks in moisture without stripping your skin's natural barrier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Related Collections */}
      <section className="py-12 border-t border-[color:var(--border)]">
        <h3 className="text-xl font-serif text-[color:var(--foreground)] mb-6 px-5">
          You may also love
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide px-5 snap-x">
          {otherChapters.map(
            (c: { slug: string; image: string; name: string; eyebrow?: string }) => (
              <Link
                key={c.slug}
                to="/collections/$slug"
                params={{ slug: c.slug }}
                className="group relative w-[70vw] shrink-0 aspect-[4/5] overflow-hidden rounded-2xl snap-center"
              >
                <img
                  src={resolveImageUrl(c.image)}
                  alt={c.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="text-[10px] uppercase tracking-widest text-white/70 mb-1 block">
                    {c.eyebrow}
                  </span>
                  <h4 className="text-2xl font-serif leading-tight">{c.name}</h4>
                </div>
              </Link>
            ),
          )}
        </div>
      </section>

      {/* 10. Sticky Bottom Actions */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center bg-[color:var(--foreground)] backdrop-blur-xl border border-[color:var(--border)] rounded-full px-2 py-2 shadow-2xl">
        <Drawer>
          <DrawerTrigger asChild>
            <button className="flex flex-col items-center justify-center w-16 h-12 text-[color:var(--background)]/70 hover:text-[color:var(--background)] transition-colors">
              <Filter className="w-5 h-5 mb-1" />
              <span className="text-[9px] uppercase tracking-wider font-medium">Filter</span>
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Filter By Category</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 flex flex-col gap-2">
              {["All", "Best Sellers", "New", "Dry Skin", "Sensitive Skin", "Oily Skin"].map(
                (f) => (
                  <DrawerClose asChild key={f}>
                    <button
                      onClick={() => setActiveFilter(f)}
                      className={`py-3 px-4 rounded-xl text-left font-medium transition-colors ${activeFilter === f ? "bg-[color:var(--theme)] text-white" : "bg-[color:var(--muted)]/30 text-[color:var(--foreground)]"}`}
                    >
                      {f}
                    </button>
                  </DrawerClose>
                ),
              )}
            </div>
          </DrawerContent>
        </Drawer>
        <div className="w-[1px] h-6 bg-[color:var(--background)]/20" />
        <Drawer>
          <DrawerTrigger asChild>
            <button className="flex flex-col items-center justify-center w-16 h-12 text-[color:var(--background)]/70 hover:text-[color:var(--background)] transition-colors">
              <ArrowDownUp className="w-5 h-5 mb-1" />
              <span className="text-[9px] uppercase tracking-wider font-medium">Sort</span>
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Sort Products</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 flex flex-col gap-2">
              {["Recommended", "Price: Low to High", "Price: High to Low"].map((s) => (
                <DrawerClose asChild key={s}>
                  <button
                    onClick={() => setSortOption(s)}
                    className={`py-3 px-4 rounded-xl text-left font-medium transition-colors ${sortOption === s ? "bg-[color:var(--theme)] text-white" : "bg-[color:var(--muted)]/30 text-[color:var(--foreground)]"}`}
                  >
                    {s}
                  </button>
                </DrawerClose>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
        <div className="w-[1px] h-6 bg-[color:var(--background)]/20" />
        <Link
          to="/wishlist"
          className="flex flex-col items-center justify-center w-16 h-12 text-[color:var(--background)]/70 hover:text-[color:var(--background)] transition-colors"
        >
          <Heart className="w-5 h-5 mb-1" />
          <span className="text-[9px] uppercase tracking-wider font-medium">Saved</span>
        </Link>
        <div className="w-[1px] h-6 bg-[color:var(--background)]/20" />
        <Link
          to="/cart"
          className="flex flex-col items-center justify-center w-16 h-12 text-[color:var(--gold)] hover:text-[color:var(--gold)] transition-colors relative"
        >
          <ShoppingBag className="w-5 h-5 mb-1" />
          <span className="text-[9px] uppercase tracking-wider font-medium">Cart</span>
          <span className="absolute top-1 right-3.5 w-2 h-2 bg-[color:var(--background)] rounded-full" />
        </Link>
      </div>
    </div>
  );
});
