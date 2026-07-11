
# Lenoraa — Immersive Luxury Upgrade Plan

Preserve all existing routes, catalog, cart, wishlist, customization, and business logic. This is an experience/interaction/animation upgrade layered on top.

## 1. Global environment engine
- Extend `ThemeProvider` + `useTheme` store to accept a per-product theme (id, palette, particles, ambience preset) — not just collection.
- Product pages call `setTheme(product.environment)` on mount; theme persists across cart/wishlist/checkout so entire site inherits the last-viewed soap world.
- Smooth 1.2s CSS-variable interpolation on `--theme`, `--theme-soft`, `--theme-deep`, `--ambient-fog`, `--ambient-glow`.
- New `AmbienceLayer` component (replaces `LivingEnvironment`) driven by a preset map: `leaves | petals | steam | smoke | pollen | goldDust | lavenderMist`. Each preset ships its own drift/float/opacity params + optional SVG sprite.

## 2. Cinematic global chrome
- Cursor: `LuxuryCursor` component — soft blurred dot + magnetic trailing ring + particle burst on click; auto-hides on touch and `prefers-reduced-motion`.
- Route transitions: `PageTransition` wrapper using framer-motion `AnimatePresence` with foam/liquid wipe overlay keyed on pathname.
- Scroll: install `lenis` for smooth scroll; parallax sections via framer-motion `useScroll` + `useTransform`.
- Buttons: upgrade `.btn-lux` with liquid sweep, magnetic hover (JS hook `useMagnetic`), letter-splitting on hover.
- Typography: `SplitText` component (per-char reveal with stagger + subtle rotate/blur) used on all H1/H2. `CountUp` for numbers.
- `Reveal` wrapper for sections (parallax + scale + blur-in on scroll).

## 3. Navigation upgrade
- Rebuild `SiteHeader`: Home / Collections (mega-menu) / Customize / Story / Saved / Bag / Account.
- Collections mega-menu: glass panel with 5 collection tiles, hover previews the environment.
- Account dropdown: guest state (Login / Sign up) vs signed-in stub (Profile / Orders / Addresses / Wishlist / Saved Designs / Recently Viewed / Settings / Logout). Since backend is skipped, account is local-only using Zustand + localStorage; routes render placeholder screens styled premium. `/auth/login`, `/auth/signup`, `/auth/forgot`, `/account`, `/account/orders`, `/account/addresses`, `/account/saved-designs`, `/account/recently-viewed`, `/account/settings`.
- Track `recentlyViewed` in store on product page mount.

## 4. Homepage revival
- Persistent ambience always animating (fog SVG drift, light-ray sweep, floating ingredients per active theme).
- Hero: split-text headline, magnetic CTA, parallax hero image, subtle mouse-tilt.
- Add scroll-driven scenes between existing sections (ingredients showcase, craftsmanship reel, collection portal grid with per-tile environment preview on hover).

## 5. Product experience
- On product route enter: setTheme(product.env), scroll-driven "soap enters the scene" hero, floating ingredient chips orbiting soap bar with framer-motion, 3D tilt on the soap bar (mouse parallax), engraving glow.
- Sticky ingredient rail, benefit reveal, ritual steps section, related soaps carousel — all inheriting theme.
- Product cards: glass reflection sweep, 3D tilt on hover, ingredient particles escaping on hover, magnetic, shadow morph.

## 6. Custom Soap Studio (`/customize`)
- Interactive studio: shape / base color / ingredients (multi-select) / fragrance / texture / packaging / engraving text / ribbon / gift box.
- Live preview: CSS/SVG soap bar updates instantly (color mix + texture overlay + engraving text), rotate via drag, zoom, lighting slider.
- Save design → localStorage → shows under Account › Saved Designs. Add-to-bag creates a custom line item.

## 7. Cart / Wishlist / Story
- Cart & wishlist adopt current theme, keep ambience, cards use new premium style, checkout summary panel with glass + gold accents. (Checkout stays local — no backend.)
- Story page: cinematic timeline (pinned scroll sections, ingredient reveals, craftsmanship steps, sustainability, interactive ingredient hover cards).

## 8. Loading & transitions
- Route loader overlay: foam/logo morph shown during `AnimatePresence` transition + initial suspense fallback.

## 9. Performance & a11y
- Lazy-load `LuxuryCursor`, `AmbienceLayer` heavy presets, and studio via dynamic import.
- Respect `prefers-reduced-motion` — disable particles, cursor, scroll smoothing, split-text stagger.
- Adaptive particle density based on `navigator.hardwareConcurrency` and viewport.
- Preserve SSR safety (mount guards).

## Technical notes
- Add deps: `lenis`, `@studio-freight/hamo` (optional), no new heavy 3D libs (kept as CSS/SVG per v1 decision).
- New files under `src/components/immersive/` (Cursor, AmbienceLayer, PageTransition, SplitText, Reveal, Magnetic, CountUp, SoapBar3D), `src/routes/customize.tsx`, `src/routes/auth.*.tsx`, `src/routes/account.*.tsx`.
- Extend `src/lib/catalog.ts` with `environment` preset per product; extend `src/lib/store.ts` with `account`, `recentlyViewed`, `savedDesigns`, `customLineItems`.
- Keep all existing product data, slugs, routes, cart/wishlist behaviors intact.

## Out of scope (per prior v1 choices)
- Real backend/auth/payments (account is local-only, checkout stays local).
- WebGL/R3F 3D scenes (staying on generated 2D + CSS/Framer motion).
