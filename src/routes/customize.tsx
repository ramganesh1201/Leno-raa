import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useShop, type CustomDesign } from "@/lib/store";
import { SplitText } from "@/components/immersive/SplitText";
import { Reveal } from "@/components/immersive/Reveal";
import { Magnetic } from "@/components/immersive/Magnetic";
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

  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);

  const price = 480;
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

        <div className="mt-16 grid gap-10 md:gap-16 md:grid-cols-[1.1fr_1fr]">
          {/* Preview */}
          <div className="sticky top-32 self-start">
            <div className="relative">
              {/* Luxury Minimal Preview */}
              <div className="relative aspect-[4/5] w-full max-w-[400px] mx-auto overflow-hidden shadow-2xl transition-all duration-700 bg-[color:var(--foreground)] rounded-2xl flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent mix-blend-overlay" />
                <div className="text-center p-8 z-10">
                  <div className="text-[color:var(--background)] font-light text-2xl tracking-[0.3em] uppercase opacity-90">
                    {coreActive}
                  </div>
                  <div className="text-[color:var(--gold)] text-xs uppercase tracking-widest mt-6 pt-6 border-t border-[color:var(--background)]/20">
                    Bespoke Formulation
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-baseline justify-between">
                <div>
                  <div className="text-display text-3xl">{name}</div>
                  <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)] mt-2">
                    {skinType}
                  </div>
                </div>
                <div className="text-display text-2xl">₹{price}</div>
              </div>
              <div className="mt-8 flex flex-col md:flex-row flex-wrap gap-3 w-full md:w-auto">
                <Magnetic>
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
                        setTimeout(() => setSaved(false), 2000);
                      } catch (err) {
                        console.error("Failed to save customization:", err);
                      }
                    }}
                    className="btn-ghost-lux w-full md:w-auto justify-center"
                  >
                    {saved ? "Saved ♥" : isSaving ? "Saving..." : "Save design"}
                  </button>
                </Magnetic>
                <Magnetic>
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
                            estimated_price: price,
                          });
                          await addToCart.mutateAsync({
                            productId: null,
                            quantity: 1,
                            customizationId: custom.id,
                          });
                        } else if (saveLocalDesign && addLocalCustom) {
                          const d = buildDesign();
                          saveLocalDesign(d);
                          addLocalCustom(d);
                        }
                        setAdded(true);
                        setTimeout(() => setAdded(false), 2000);
                      } catch (err) {
                        console.error("Failed to add to cart:", err);
                      }
                    }}
                    className="btn-lux w-full md:w-auto justify-center"
                  >
                    {added ? "Added ✓" : isAdding ? "Adding..." : "Add to bag"}
                  </button>
                </Magnetic>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-12 pb-24">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          data-lux-hover
          className={`flex items-center justify-between rounded-xl border p-5 text-sm font-medium transition-all ${
            value === o
              ? "border-[color:var(--gold)] bg-[color:var(--gold)]/5 text-[color:var(--foreground)]"
              : "border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:border-[color:var(--gold)]/50"
          }`}
        >
          {o}
          {value === o && <span className="w-2 h-2 rounded-full bg-[color:var(--gold)]" />}
        </button>
      ))}
    </div>
  );
}
