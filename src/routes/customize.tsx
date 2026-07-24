import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useShop, type CustomDesign } from "@/lib/store";
import { SplitText } from "@/components/immersive/SplitText";
import { Reveal } from "@/components/immersive/Reveal";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";
import { useCustomizations } from "@/hooks/useCustomizations";
import { useCart } from "@/hooks/useCart";

export const Route = createFileRoute("/customize")({
  head: () => ({
    meta: [
      { title: "Custom Soap Studio — Lenoraa" },
      {
        name: "description",
        content:
          "Design your own handcrafted soap. Choose your skin type, core active, and fragrance.",
      },
    ],
  }),
  component: CustomizePage,
});

const SKIN_TYPES = ["Oily Skin", "Dry Skin", "Normal / Combination / Sensitive"];
const CORE_ACTIVES = ["Charcoal", "Orange", "Manjistha with Sandalwood", "Rose", "Menthol"];
const FRAGRANCES = ["Lavender", "Sandalwood", "Rose", "Orange Citrus", "Fragrance Free"];

const SKIN_TYPE_PRICES: Record<string, number> = {
  "Oily Skin": 5,
  "Dry Skin": 5,
  "Normal / Combination / Sensitive": 0,
};

const CORE_ACTIVE_PRICES: Record<string, number> = {
  Charcoal: 10,
  Orange: 5,
  "Manjistha with Sandalwood": 15,
  Rose: 15,
  Menthol: 5,
};

const FRAGRANCE_PRICES: Record<string, number> = {
  Lavender: 10,
  Sandalwood: 15,
  Rose: 10,
  "Orange Citrus": 5,
  "Fragrance Free": 0,
};

function CustomizePage() {
  const saveLocalDesign = useShop((s) => s.saveDesign);
  const addLocalCustom = useShop((s) => s.addCustomToCart);

  const authHook = useAuth() || {};
  const { user, isLoading: isAuthLoading } = authHook;

  const customHook = useCustomizations() || {};
  const { addCustomization } = customHook;

  const cartHook = useCart() || {};
  const { addToCart } = cartHook;

  const [skinType, setSkinType] = useState(SKIN_TYPES[0]);
  const [coreActive, setCoreActive] = useState(CORE_ACTIVES[0]);
  const [fragrance, setFragrance] = useState(FRAGRANCES[0]);
  const [quantity, setQuantity] = useState(6);

  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);

  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  const unitPrice =
    120 +
    (SKIN_TYPE_PRICES[skinType] || 0) +
    (CORE_ACTIVE_PRICES[coreActive] || 0) +
    (FRAGRANCE_PRICES[fragrance] || 0);
  const price = unitPrice * quantity;
  const name = "Bespoke Ritual";

  const buildDesign = (): CustomDesign => ({
    id: Math.random().toString(36).slice(2, 10),
    name,
    skin_type: skinType,
    core_active: coreActive,
    fragrance,
    shape: "Legacy",
    color: "Legacy",
    packaging: "Legacy",
    createdAt: Date.now(),
  });

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-32">
        <div className="text-sm uppercase tracking-widest text-[color:var(--muted-foreground)] animate-pulse">
          Loading Studio...
        </div>
      </div>
    );
  }

  const isSaving = addCustomization?.isPending || false;
  const isAdding = addToCart?.isPending || false;

  return (
    <div className="relative pt-32">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <Reveal preset="label" className="text-eyebrow text-[color:var(--muted-foreground)]">
          The Studio
        </Reveal>
        <SplitText
          as="h1"
          text="Design your own ritual."
          delay={0.1}
          className="text-display mt-3 text-3xl md:text-4xl"
        />
        <Reveal
          as="p"
          preset="paragraph"
          delay={0.2}
          className="mt-4 max-w-xl text-[color:var(--muted-foreground)]"
        >
          Every choice reshapes the atmosphere. Select your perfect combination.
        </Reveal>

        <div className="mt-10 md:mt-16 grid gap-8 md:gap-16 md:grid-cols-[1.1fr_1fr]">
          {/* Preview */}
          <div className="relative md:sticky md:top-32 md:self-start">
            <div className="relative">
              {/* Luxury Minimal Preview */}
              <div className="relative h-[260px] md:h-auto md:aspect-[4/5] w-full max-w-[400px] mx-auto overflow-hidden shadow-xl md:shadow-2xl transition-all duration-700 bg-[color:var(--foreground)] rounded-[2rem] md:rounded-2xl flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent mix-blend-overlay" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={coreActive}
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.4 }}
                    className="text-center p-8 z-10"
                  >
                    <div className="text-[color:var(--background)] font-light text-2xl tracking-[0.3em] uppercase opacity-90">
                      {coreActive}
                    </div>
                    <div className="text-[color:var(--gold)] text-xs uppercase tracking-widest mt-6 pt-6 border-t border-[color:var(--background)]/20">
                      Bespoke Formulation
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-8 flex flex-col md:flex-row md:items-baseline md:justify-between gap-4 md:gap-0">
                <div>
                  <div className="text-display text-3xl md:text-3xl">{name}</div>
                  <div className="text-[10px] md:text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)] mt-2">
                    {skinType} · {coreActive}
                  </div>
                  <div className="md:hidden text-sm text-[color:var(--muted-foreground)] mt-4 leading-relaxed pr-4">
                    A personalized botanical blend designed for {skinType.toLowerCase()}.
                    Handcrafted with {coreActive.toLowerCase()} and {fragrance.toLowerCase()}.
                  </div>
                </div>
                <div className="hidden md:block text-display text-2xl">
                  ₹{new Intl.NumberFormat("en-IN").format(price)}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-6 flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <span className="text-sm uppercase tracking-widest text-[color:var(--muted-foreground)]">
                    Quantity
                  </span>
                  <div className="flex items-center gap-4 border border-[color:var(--border)] rounded-full px-4 py-1 w-fit bg-[color:var(--background)]">
                    <button
                      onClick={() => setQuantity((q) => Math.max(6, q - 1))}
                      className="text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors p-1"
                      disabled={quantity <= 6}
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-[color:var(--foreground)]">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors p-1"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[color:var(--gold)] mt-2">
                  Custom soaps are handcrafted in small batches. The minimum order quantity is 6 soaps.
                </p>
              </div>

              <div className="mt-8 hidden md:flex flex-col md:flex-row flex-wrap gap-3 w-full md:w-auto">

                  <button
                    disabled={isSaving}
                    onClick={async () => {
                      try {
                        if (user && addCustomization) {
                          await addCustomization.mutateAsync({
                            base_soap: "Legacy",
                            shape: "Legacy",
                            size: "Legacy",
                            color: "Legacy",
                            packaging: "Legacy",
                            skin_type: skinType,
                            core_active: coreActive,
                            fragrance: fragrance,
                            essential_oils: [],
                            ingredients: [],
                            engraving_text: null,
                            gift_wrap: false,
                            preview_image: null,
                            notes: null,
                            estimated_price: price,
                          });
                        } else if (saveLocalDesign) {
                          saveLocalDesign(buildDesign());
                        }
                        setSaved(true);
                        const tid = setTimeout(() => setSaved(false), 2000);
                        timeoutRefs.current.push(tid);
                      } catch (err) {
                        console.error("Failed to save customization:", err);
                      }
                    }}
                    className="btn-ghost-lux w-full md:w-auto justify-center"
                  >
                    {saved ? "Saved ♥" : isSaving ? "Saving..." : "Save design"}
                  </button>


                  <button
                    disabled={isAdding}
                    onClick={async () => {
                      try {
                        if (user && addCustomization && addToCart) {
                          const custom = await addCustomization.mutateAsync({
                            base_soap: "Legacy",
                            shape: "Legacy",
                            size: "Legacy",
                            color: "Legacy",
                            packaging: "Legacy",
                            skin_type: skinType,
                            core_active: coreActive,
                            fragrance: fragrance,
                            essential_oils: [],
                            ingredients: [],
                            engraving_text: null,
                            gift_wrap: false,
                            preview_image: null,
                            notes: null,
                            estimated_price: unitPrice,
                          });
                          await addToCart.mutateAsync({
                            productId: null,
                            quantity: quantity,
                            customizationId: custom.id,
                          });
                        } else if (saveLocalDesign && addLocalCustom) {
                          const d = buildDesign();
                          saveLocalDesign(d);
                          // For local custom, it adds 1. We don't have quantity arg in addLocalCustom, so we just call it 'quantity' times
                          for(let i=0; i<quantity; i++) addLocalCustom(d);
                        }
                        setAdded(true);
                        const tid = setTimeout(() => setAdded(false), 2000);
                        timeoutRefs.current.push(tid);
                      } catch (err) {
                        console.error("Failed to add to cart:", err);
                      }
                    }}
                    className="btn-lux w-full md:w-auto justify-center"
                  >
                    {added ? "Added ✓" : isAdding ? "Adding..." : "Add to bag"}
                  </button>

              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-10 md:space-y-12 pb-32 md:pb-24">
            <Section title="Target Skin Type">
              <Chips options={SKIN_TYPES} value={skinType} onChange={setSkinType} />
            </Section>

            <Section title="Core Natural Flavour / Active">
              <Chips options={CORE_ACTIVES} value={coreActive} onChange={setCoreActive} />
            </Section>

            <Section title="Fragrance / Essential Oils">
              <Chips options={FRAGRANCES} value={fragrance} onChange={setFragrance} />
            </Section>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-between bg-[color:var(--background)]/85 backdrop-blur-2xl border-t border-[color:var(--border)] px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
          <span className="text-[10px] text-[color:var(--muted-foreground)] uppercase tracking-[0.2em] mb-0.5">
            Total
          </span>
          <span className="text-display text-xl">
            ₹{new Intl.NumberFormat("en-IN").format(price)}
          </span>
        </div>
        <button
          disabled={isAdding}
          onClick={async () => {
            try {
              if (user && addCustomization && addToCart) {
                const custom = await addCustomization.mutateAsync({
                  base_soap: "Legacy",
                  shape: "Legacy",
                  size: "Legacy",
                  color: "Legacy",
                  packaging: "Legacy",
                  skin_type: skinType,
                  core_active: coreActive,
                  fragrance: fragrance,
                  essential_oils: [],
                  ingredients: [],
                  engraving_text: null,
                  gift_wrap: false,
                  preview_image: null,
                  notes: null,
                  estimated_price: unitPrice,
                });
                await addToCart.mutateAsync({
                  productId: null,
                  quantity: quantity,
                  customizationId: custom.id,
                });
              } else if (saveLocalDesign && addLocalCustom) {
                const d = buildDesign();
                saveLocalDesign(d);
                for(let i=0; i<quantity; i++) addLocalCustom(d);
              }
              setAdded(true);
              const tid = setTimeout(() => setAdded(false), 2000);
              timeoutRefs.current.push(tid);
            } catch (err) {
              console.error("Failed to add to cart:", err);
            }
          }}
          className="btn-lux w-[180px] justify-center shadow-lg"
        >
          {added ? "Added ✓" : isAdding ? "Adding..." : "Add to bag"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <Reveal preset="label" className="text-eyebrow mb-6 text-[color:var(--gold)]">
        {title}
      </Reveal>
      {children}
    </div>
  );
}

function Chips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          data-lux-hover
          className={`flex items-center justify-between rounded-2xl md:rounded-xl border p-5 md:p-5 text-sm font-medium transition-all shadow-sm md:shadow-none ${
            value === o
              ? "border-[color:var(--gold)] bg-[color:var(--gold)]/5 text-[color:var(--foreground)] ring-1 ring-[color:var(--gold)]/20 md:ring-0"
              : "border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:border-[color:var(--gold)]/50 bg-[color:var(--background)]"
          }`}
        >
          {o}
          {value === o && <span className="w-2 h-2 rounded-full bg-[color:var(--gold)]" />}
        </button>
      ))}
    </div>
  );
}
