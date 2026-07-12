import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AmbiencePreset, ThemeKey } from "./catalog";

export interface CustomDesign {
  id: string;
  name: string;
  shape: string;
  color: string;
  ingredients: string[];
  fragrance: string;
  texture: string;
  packaging: string;
  engraving: string;
  ribbon: string;
  giftBox: boolean;
  createdAt: number;
}

interface CartItem {
  slug: string;
  quantity: number;
  customId?: string;
}

interface ShopState {
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  savedDesigns: CustomDesign[];
  addToCart: (slug: string) => void;
  addCustomToCart: (design: CustomDesign) => void;
  removeFromCart: (slug: string) => void;
  setQuantity: (slug: string, q: number) => void;
  toggleWishlist: (slug: string) => void;
  markRecentlyViewed: (slug: string) => void;
  saveDesign: (d: CustomDesign) => void;
  deleteDesign: (id: string) => void;
  clearCart: () => void;
  clearAll: () => void;
}

export const useShop = create<ShopState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      recentlyViewed: [],
      savedDesigns: [],
      addToCart: (slug) =>
        set((s) => {
          const existing = s.cart.find((i) => i.slug === slug && !i.customId);
          if (existing)
            return {
              cart: s.cart.map((i) =>
                i.slug === slug && !i.customId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          return { cart: [...s.cart, { slug, quantity: 1 }] };
        }),
      addCustomToCart: (design) =>
        set((s) => ({
          cart: [
            ...s.cart,
            { slug: `custom-${design.id}`, quantity: 1, customId: design.id },
          ],
        })),
      removeFromCart: (slug) =>
        set((s) => ({ cart: s.cart.filter((i) => i.slug !== slug) })),
      setQuantity: (slug, q) =>
        set((s) => ({
          cart:
            q <= 0
              ? s.cart.filter((i) => i.slug !== slug)
              : s.cart.map((i) => (i.slug === slug ? { ...i, quantity: q } : i)),
        })),
      toggleWishlist: (slug) =>
        set((s) => ({
          wishlist: s.wishlist.includes(slug)
            ? s.wishlist.filter((w) => w !== slug)
            : [...s.wishlist, slug],
        })),
      markRecentlyViewed: (slug) =>
        set((s) => ({
          recentlyViewed: [slug, ...s.recentlyViewed.filter((x) => x !== slug)].slice(
            0,
            12,
          ),
        })),
      saveDesign: (d) =>
        set((s) => ({ savedDesigns: [d, ...s.savedDesigns].slice(0, 30) })),
      deleteDesign: (id) =>
        set((s) => ({ savedDesigns: s.savedDesigns.filter((d) => d.id !== id) })),
      clearCart: () => set({ cart: [] }),
      clearAll: () => set({ cart: [], wishlist: [], recentlyViewed: [], savedDesigns: [] }),
    }),
    { name: "lenoraa-shop" },
  ),
);

/* Local-only account (no backend). Persisted so the UI feels real. */
export interface LocalAccount {
  email: string;
  name: string;
  createdAt: number;
}

interface AccountState {
  account: LocalAccount | null;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
}

export const useAccount = create<AccountState>()(
  persist(
    (set) => ({
      account: null,
      signIn: (email, name) =>
        set({
          account: {
            email,
            name: name || email.split("@")[0],
            createdAt: Date.now(),
          },
        }),
      signOut: () => set({ account: null }),
    }),
    { name: "lenoraa-account" },
  ),
);

/* Global environment / world theme */
export interface WorldTheme {
  key: ThemeKey | "default";
  ambience: AmbiencePreset;
}

interface ThemeState {
  theme: ThemeKey | "default";
  ambience: AmbiencePreset;
  setTheme: (t: ThemeKey | "default", ambience?: AmbiencePreset) => void;
}

const defaultAmbience: Record<ThemeKey | "default", AmbiencePreset> = {
  default: "goldDust",
  radiance: "goldDust",
  calm: "mist",
  nourish: "cream",
  relax: "petals",
  herbal: "leaves",
};

export const useTheme = create<ThemeState>((set) => ({
  theme: "default",
  ambience: "goldDust",
  setTheme: (theme, ambience) =>
    set({ theme, ambience: ambience ?? defaultAmbience[theme] }),
}));
