import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useShop, useTheme, type CustomDesign } from "@/lib/store";
import { SoapBar3D } from "@/components/immersive/SoapBar3D";
import { SplitText } from "@/components/immersive/SplitText";
import { Magnetic } from "@/components/immersive/Magnetic";

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
  const saveDesign = useShop((s) => s.saveDesign);
  const addCustom = useShop((s) => s.addCustomToCart);

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

  useEffect(() => setTheme(color.theme), [color, setTheme]);

  const toggleIngredient = (i: string) =>
    setIngredients((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));

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

  const price = 480 + ingredients.length * 30 + (giftBox ? 200 : 0);

  const radius =
    shape === "Round" ? "9999px" : shape === "Square" ? "12px" : shape === "Petal" ? "70% 30% 60% 40% / 50% 50% 50% 50%" : "40% 60% 40% 60% / 50%";

  return (
    <div className="relative pt-32">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <div className="text-eyebrow text-[color:var(--muted-foreground)]">The Studio</div>
        <SplitText as="h1" text="Design your own ritual." className="text-display mt-3 text-5xl md:text-7xl" />
        <p className="mt-4 max-w-xl text-[color:var(--muted-foreground)]">
          Every choice reshapes the atmosphere. Watch the world respond as you build.
        </p>

        <div className="mt-16 grid gap-16 md:grid-cols-[1.1fr_1fr]">
          {/* Preview */}
          <div className="sticky top-32 self-start">
            <div className="relative" style={{ perspective: 1000 }}>
              <SoapBar3D>
                <div
                  className="absolute inset-6 flex items-center justify-center"
                  style={{
                    borderRadius: radius,
                    background: `radial-gradient(120% 80% at 30% 20%, color-mix(in oklab, white 60%, ${color.val}) 0%, transparent 55%), ${color.val}`,
                    boxShadow: "inset 0 2px 12px rgba(255,255,255,0.35), inset 0 -12px 32px rgba(0,0,0,0.15)",
                    transition: "all 0.8s cubic-bezier(.22,1,.36,1)",
                  }}
                >
                  <div className="text-display text-2xl uppercase tracking-[0.3em] text-white/70 mix-blend-overlay">
                    {engraving.slice(0, 12)}
                  </div>
                </div>
              </SoapBar3D>
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
                  <div className="text-display text-3xl">{name}</div>
                  <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                    {shape} · {texture} · {fragrance}
                  </div>
                </div>
                <div className="text-display text-2xl">₹{price}</div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic>
                  <button
                    onClick={() => { saveDesign(buildDesign()); setSaved(true); setTimeout(() => setSaved(false), 2000); }}
                    className="btn-ghost-lux"
                  >
                    {saved ? "Saved ♥" : "Save design"}
                  </button>
                </Magnetic>
                <Magnetic>
                  <button
                    onClick={() => { const d = buildDesign(); saveDesign(d); addCustom(d); setAdded(true); setTimeout(() => setAdded(false), 2000); }}
                    className="btn-lux"
                  >
                    {added ? "Added ✓" : "Add to bag"}
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
      <div className="text-eyebrow mb-4 text-[color:var(--gold)]">{title}</div>
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
