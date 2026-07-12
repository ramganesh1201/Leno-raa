import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useShop, useTheme, type CustomDesign } from "@/lib/store";
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
      { name: "description", content: "Design your own handcrafted soap. Shape, colour, ingredients, fragrance, packaging — all yours." },
    ],
  }),
  component: CustomizePage,
});

const SHAPES = ["Oval", "Round", "Square", "Petal"];
const COLORS = [
  { name: "Ivory", theme: "default" as const, val: "oklch(0.92 0.02 82)" },
  { name: "Rose", theme: "relax" as const, val: "oklch(0.78 0.13 20)" },
  { name: "Sage", theme: "calm" as const, val: "oklch(0.75 0.08 155)" },
  { name: "Amber", theme: "radiance" as const, val: "oklch(0.75 0.15 55)" },
  { name: "Charcoal", theme: "herbal" as const, val: "oklch(0.32 0.02 60)" },
  { name: "Cream", theme: "nourish" as const, val: "oklch(0.9 0.05 82)" },
];
const INGREDIENTS = ["Aloe", "Lavender", "Turmeric", "Honey", "Charcoal", "Rose", "Sandalwood", "Neem", "Menthol", "Goat Milk"];
const FRAGRANCES = ["Unscented", "Citrus", "Lavender", "Sandalwood", "Rose", "Vanilla", "Herbal"];
const TEXTURES = ["Smooth", "Exfoliating", "Creamy", "Layered"];
const PACKAGING = ["Kraft Sleeve", "Linen Wrap", "Wooden Box"];
const RIBBONS = ["None", "Gold", "Ivory", "Sage", "Rose"];

function CustomizePage() {
  const setTheme = useTheme((s) => s.setTheme);
  const saveLocalDesign = useShop((s) => s.saveDesign);
  const addLocalCustom = useShop((s) => s.addCustomToCart);
  
  const authHook = useAuth() || {};
  const { user, isLoading: isAuthLoading } = authHook;
  
  const customHook = useCustomizations() || {};
  const { addCustomization } = customHook;
  
  const cartHook = useCart() || {};
  const { addToCart } = cartHook;

  const [shape, setShape] = useState(SHAPES[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [ingredients, setIngredients] = useState<string[]>(["Lavender"]);
  const [fragrance, setFragrance] = useState(FRAGRANCES[2]);
  const [texture, setTexture] = useState(TEXTURES[0]);
  const [packaging, setPackaging] = useState(PACKAGING[0]);
  const [engraving, setEngraving] = useState("Lenoraa");
  const [ribbon, setRibbon] = useState(RIBBONS[1]);
  const [giftBox, setGiftBox] = useState(false);
  const [name, setName] = useState("My Ritual");
  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (color?.theme) setTheme(color.theme);
  }, [color, setTheme]);

  const toggleIngredient = (i: string) =>
    setIngredients((cur) => {
      const current = cur || [];
      return current.includes(i) ? current.filter((x) => x !== i) : [...current, i];
    });

  const buildDesign = (): CustomDesign => ({
    id: Math.random().toString(36).slice(2, 10),
    name,
    shape,
    color: color.name,
    ingredients,
    fragrance,
    texture,
    packaging,
    engraving,
    ribbon,
    giftBox,
    createdAt: Date.now(),
  });

  const price = 480 + (ingredients || []).length * 30 + (giftBox ? 200 : 0);

  const radius =
    shape === "Round" ? "9999px" : shape === "Square" ? "12px" : shape === "Petal" ? "70% 30% 60% 40% / 50% 50% 50% 50%" : "40% 60% 40% 60% / 50%";

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
        <Reveal preset="label" className="text-eyebrow text-[color:var(--muted-foreground)]">The Studio</Reveal>
        <SplitText as="h1" text="Design your own ritual." delay={0.1} className="text-display mt-3 text-3xl md:text-4xl md:text-3xl md:text-4xl md:text-4xl md:text-3xl md:text-4xl" />
        <Reveal as="p" preset="paragraph" delay={0.2} className="mt-4 max-w-xl text-[color:var(--muted-foreground)]">
          Every choice reshapes the atmosphere. Watch the world respond as you build.
        </Reveal>

        <div className="mt-16 grid gap-16 md:grid-cols-[1.1fr_1fr]">
          {/* Preview */}
          <div className="sticky top-32 self-start">
            <div className="relative">
              {/* 2D Soap Preview */}
              <div 
                className="relative aspect-[4/5] w-full max-w-[400px] mx-auto overflow-hidden shadow-2xl transition-all duration-700"
                style={{ 
                  background: color?.val || "var(--background)", 
                  borderRadius: radius 
                }}
              >
                {/* 3D-like Highlights */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent mix-blend-overlay" />
                <div className="absolute bottom-0 right-0 h-1/2 w-1/2 bg-gradient-to-tl from-black/10 to-transparent mix-blend-multiply" />
                
                {/* Brand Imprint */}
                <div className="absolute inset-0 flex items-center justify-center mix-blend-overlay opacity-60">
                  <div className="rotate-[-45deg] text-2xl tracking-[0.3em] font-light">{engraving || ""}</div>
                </div>
              </div>

              {/* Extras indicators */}
              {giftBox && (
                <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded bg-[color:var(--border)] shadow-xl rotate-12 flex items-center justify-center">
                  <span className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]">Gift Box</span>
                </div>
              )}
              {ribbon !== "None" && (
                <div
                  className="mx-auto mt-4 h-2 w-1/2 rounded"
                  style={{
                    background:
                      ribbon === "Gold" ? "var(--gold)" :
                      ribbon === "Ivory" ? "var(--ivory)" :
                      ribbon === "Sage" ? "oklch(0.75 0.08 155)" :
                      "oklch(0.78 0.13 20)",
                  }}
                />
              )}
              <div className="mt-8 flex items-baseline justify-between">
                <div>
                  <div className="text-display text-3xl">{name || "Custom Design"}</div>
                  <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                    {shape} · {texture} · {fragrance}
                  </div>
                </div>
                <div className="text-display text-2xl">₹{price}</div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic>
                  <button
                    disabled={isSaving}
                    onClick={async () => { 
                      try {
                        if (user && addCustomization) {
                          await addCustomization.mutateAsync({
                            soap_base: "Standard",
                            shape: shape || "Oval",
                            size: "Standard",
                            color: color?.name || "Ivory",
                            fragrance: fragrance || "Unscented",
                            essential_oils: [],
                            ingredients: ingredients || [],
                            packaging: packaging || "Kraft Sleeve",
                            engraving_text: engraving || null,
                            gift_wrap: giftBox || false,
                            preview_image: null,
                            notes: name || "My Ritual",
                            estimated_price: price
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
                    className="btn-ghost-lux"
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
                            soap_base: "Standard",
                            shape: shape || "Oval",
                            size: "Standard",
                            color: color?.name || "Ivory",
                            fragrance: fragrance || "Unscented",
                            essential_oils: [],
                            ingredients: ingredients || [],
                            packaging: packaging || "Kraft Sleeve",
                            engraving_text: engraving || null,
                            gift_wrap: giftBox || false,
                            preview_image: null,
                            notes: name || "My Ritual",
                            estimated_price: price
                          });
                          await addToCart.mutateAsync({ productId: null, quantity: 1, customizationId: custom.id });
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
                    className="btn-lux"
                  >
                    {added ? "Added ✓" : isAdding ? "Adding..." : "Add to bag"}
                  </button>
                </Magnetic>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-10 pb-24">
            <Section title="Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                className="w-full border-b border-[color:var(--border)] bg-transparent py-3 text-lg outline-none focus:border-[color:var(--gold)]"
              />
            </Section>

            <Section title="Shape">
              <Chips options={SHAPES} value={shape} onChange={setShape} />
            </Section>

            <Section title="Base Colour">
              <div className="flex flex-wrap gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c)}
                    data-lux-hover
                    className={`group flex items-center gap-3 rounded-full border px-3 py-2 text-xs uppercase tracking-[0.24em] transition ${color.name === c.name ? "border-[color:var(--gold)] text-[color:var(--gold)]" : "border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:border-[color:var(--gold)]"}`}
                  >
                    <span className="h-5 w-5 rounded-full" style={{ background: c.val }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Ingredients">
              <Chips options={INGREDIENTS} value={ingredients} onChange={toggleIngredient} multi />
            </Section>

            <Section title="Fragrance">
              <Chips options={FRAGRANCES} value={fragrance} onChange={setFragrance} />
            </Section>

            <Section title="Texture">
              <Chips options={TEXTURES} value={texture} onChange={setTexture} />
            </Section>

            <Section title="Engraving">
              <input
                value={engraving}
                onChange={(e) => setEngraving(e.target.value)}
                maxLength={12}
                className="w-full border-b border-[color:var(--border)] bg-transparent py-3 text-lg outline-none focus:border-[color:var(--gold)]"
              />
            </Section>

            <Section title="Packaging">
              <Chips options={PACKAGING} value={packaging} onChange={setPackaging} />
            </Section>

            <Section title="Ribbon">
              <Chips options={RIBBONS} value={ribbon} onChange={setRibbon} />
            </Section>

            <Section title="Gift box">
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" checked={giftBox} onChange={(e) => setGiftBox(e.target.checked)} className="h-4 w-4 accent-[color:var(--gold)]" />
                Add wooden gift box (+₹200)
              </label>
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
      <Reveal preset="label" className="text-eyebrow mb-4 text-[color:var(--gold)]">{title}</Reveal>
      {children}
    </div>
  );
}

function Chips({
  options,
  value,
  onChange,
  multi,
}: {
  options: string[];
  value: string | string[];
  onChange: (v: string) => void;
  multi?: boolean;
}) {
  const active = (o: string) => (multi ? (value as string[]).includes(o) : value === o);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          data-lux-hover
          className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] transition ${active(o) ? "border-[color:var(--gold)] bg-[color:var(--gold)]/10 text-[color:var(--gold)]" : "border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:border-[color:var(--gold)]"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
