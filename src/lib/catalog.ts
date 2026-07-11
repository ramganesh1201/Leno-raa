import envRadiance from "@/assets/env-radiance.jpg";
import envCalm from "@/assets/env-calm.jpg";
import envNourish from "@/assets/env-nourish.jpg";
import envRelax from "@/assets/env-relax.jpg";
import envHerbal from "@/assets/env-herbal.jpg";

export type ThemeKey = "radiance" | "calm" | "nourish" | "relax" | "herbal";

export type AmbiencePreset =
  | "goldDust"
  | "mist"
  | "pollen"
  | "petals"
  | "leaves"
  | "smoke"
  | "cream"
  | "steam";

export interface Product {
  slug: string;
  name: string;
  collection: ThemeKey;
  price: number;
  tagline: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  notes: string;
  ambience: AmbiencePreset;
  /**
   * Optional product photograph. Drop a PNG / JPG / WEBP into
   * `src/assets/soaps/` matching the slug and import it here — the card
   * and product page will use it automatically, otherwise the crafted
   * CSS soap bar renders in its place.
   */
  image?: string;
}

export interface Collection {
  slug: ThemeKey;
  name: string;
  purpose: string;
  scene: string;
  environment: string;
  benefits: string[];
  image: string;
  eyebrow: string;
  ambience: AmbiencePreset;
}

export const collections: Collection[] = [
  {
    slug: "radiance",
    name: "Radiance",
    eyebrow: "Chapter I",
    purpose: "Reveal Your Natural Glow",
    scene: "Golden Sunrise",
    environment:
      "Warm sunlight breaks through citrus groves. Golden particles drift, awakening the skin.",
    benefits: [
      "Boosts skin radiance",
      "Helps reduce tan",
      "Supports brighter, more even skin tone",
    ],
    image: envRadiance,
    ambience: "goldDust",
  },
  {
    slug: "calm",
    name: "Calm & Clear",
    eyebrow: "Chapter II",
    purpose: "Gentle Care for Sensitive and Acne-Prone Skin",
    scene: "Aloe Water Garden",
    environment:
      "A cool green sanctuary. Water droplets suspend in still air, mint and aloe breathe softly.",
    benefits: [
      "Soothes irritated skin",
      "Hydrates and cools",
      "Improves texture",
      "Calms inflammation",
    ],
    image: envCalm,
    ambience: "mist",
  },
  {
    slug: "nourish",
    name: "Nourish",
    eyebrow: "Chapter III",
    purpose: "Deep Hydration and Skin Comfort",
    scene: "Milk & Honey Sanctuary",
    environment:
      "Cream cascades in golden light. Slow honey pours from an amber comb. Comfort in every drop.",
    benefits: [
      "Deeply moisturizing",
      "Nourishing",
      "Brightening",
      "Helps reduce dark spots",
    ],
    image: envNourish,
    ambience: "cream",
  },
  {
    slug: "relax",
    name: "Relax & Restore",
    eyebrow: "Chapter IV",
    purpose: "Everyday Self-Care",
    scene: "Lavender Twilight",
    environment:
      "Dusk falls over a lavender field. Petals drift, fireflies wake, the day exhales.",
    benefits: ["Relaxing aroma", "Calms the senses", "Softens the skin"],
    image: envRelax,
    ambience: "petals",
  },
  {
    slug: "herbal",
    name: "Herbal Legacy",
    eyebrow: "Chapter V",
    purpose: "Rooted in Ayurvedic Wisdom",
    scene: "Ancient Ayurvedic Garden",
    environment:
      "An old apothecary. Mortar and pestle, wooden shelves, herbs measured by hand for centuries.",
    benefits: [
      "Traditional herbal blend",
      "Supports skin health",
      "Helps maintain balance",
    ],
    image: envHerbal,
    ambience: "leaves",
  },
];

export const products: Product[] = [
  {
    slug: "orange",
    name: "Orange",
    collection: "radiance",
    price: 420,
    tagline: "Sun in a bar",
    description:
      "Cold-pressed orange essential oil folded into a slow-cured base. Awakens dull skin with the brightness of a coastal morning.",
    ingredients: ["Sweet Orange Oil", "Vitamin C", "Cocoa Butter", "Coconut Oil"],
    benefits: ["Brightens complexion", "Rich in antioxidants", "Uplifting citrus aroma"],
    notes: "Top: sweet orange. Heart: bitter zest. Base: soft amber.",
    ambience: "goldDust",
  },
  {
    slug: "tomato",
    name: "Tomato",
    collection: "radiance",
    price: 440,
    tagline: "Ripe with lycopene",
    description:
      "An unexpected hero. Sun-ripened tomato pulp lends lycopene and gentle exfoliation for a clearer, calmer glow.",
    ingredients: ["Tomato Pulp", "Lycopene", "Rice Bran Oil", "Shea Butter"],
    benefits: ["Reduces tan", "Refines pores", "Antioxidant-rich"],
    notes: "Fresh, green, faintly sweet.",
    ambience: "pollen",
  },
  {
    slug: "manjistha",
    name: "Manjistha",
    collection: "radiance",
    price: 480,
    tagline: "Ayurveda's blood purifier",
    description:
      "The root prized by Ayurvedic physicians for luminous, even-toned skin. Steeped slowly, honored fully.",
    ingredients: ["Manjistha Root", "Turmeric", "Sandalwood", "Almond Oil"],
    benefits: ["Evens skin tone", "Reduces pigmentation", "Detoxifying"],
    notes: "Earthy, warm, faintly floral.",
    ambience: "goldDust",
  },
  {
    slug: "aloe-vera",
    name: "Aloe Vera",
    collection: "calm",
    price: 420,
    tagline: "Water made whole",
    description:
      "Fresh aloe gel harvested at dawn, folded into a cool, mild base. For skin that needs a quiet breath.",
    ingredients: ["Fresh Aloe Gel", "Cucumber Extract", "Glycerin", "Olive Oil"],
    benefits: ["Deeply hydrating", "Soothes redness", "Non-comedogenic"],
    notes: "Cucumber, green tea, still water.",
    ambience: "mist",
  },
  {
    slug: "sandalwood",
    name: "Sandalwood",
    collection: "calm",
    price: 520,
    tagline: "Devotional stillness",
    description:
      "Aged sandalwood ground to powder and infused into a creamy bar. Traditionally used to calm hot, reactive skin.",
    ingredients: ["Sandalwood Powder", "Rose Water", "Kaolin Clay", "Shea Butter"],
    benefits: ["Cools inflammation", "Reduces blemishes", "Meditative aroma"],
    notes: "Warm woods, temple smoke, honey.",
    ambience: "smoke",
  },
  {
    slug: "menthol",
    name: "Menthol",
    collection: "calm",
    price: 400,
    tagline: "First breath of morning",
    description:
      "Pure menthol crystals give a bracing, crystalline coolness. For summer skin and clear mornings.",
    ingredients: ["Menthol Crystals", "Peppermint Oil", "Aloe", "Coconut Oil"],
    benefits: ["Cooling effect", "Refreshes tired skin", "Awakens the senses"],
    notes: "Crushed mint, mountain air.",
    ambience: "steam",
  },
  {
    slug: "goat-milk",
    name: "Goat Milk",
    collection: "nourish",
    price: 520,
    tagline: "Ancient hydration",
    description:
      "Whole goat milk, gently blended cold. Naturally rich in fatty acids and lactic acid for velvet softness.",
    ingredients: ["Fresh Goat Milk", "Honey", "Oatmeal", "Almond Oil"],
    benefits: ["Deeply moisturizing", "Gentle exfoliation", "Barrier repair"],
    notes: "Cream, honey, faint vanilla.",
    ambience: "cream",
  },
  {
    slug: "liquorice",
    name: "Liquorice",
    collection: "nourish",
    price: 480,
    tagline: "Quiet brightness",
    description:
      "Liquorice root has been used for centuries to soften pigmentation and lend a natural glow. Slow, patient, effective.",
    ingredients: ["Liquorice Root", "Turmeric", "Milk Cream", "Sunflower Oil"],
    benefits: ["Reduces dark spots", "Evens skin tone", "Anti-inflammatory"],
    notes: "Sweet root, warm milk.",
    ambience: "pollen",
  },
  {
    slug: "lavender",
    name: "Lavender",
    collection: "relax",
    price: 460,
    tagline: "The day, exhaled",
    description:
      "French lavender essential oil, distilled at altitude. A single bar that turns a shower into a ceremony.",
    ingredients: ["Lavender Essential Oil", "Dried Lavender", "Shea Butter", "Coconut Oil"],
    benefits: ["Calms the senses", "Softens skin", "Aids restful sleep"],
    notes: "Fresh lavender, cedar, twilight air.",
    ambience: "petals",
  },
  {
    slug: "ayurvedic-herbal",
    name: "Ayurvedic Herbal",
    collection: "herbal",
    price: 540,
    tagline: "The old formula",
    description:
      "Neem, tulsi, turmeric, and manjistha, ground and blended by a formula passed through generations. Wellness as ritual.",
    ingredients: ["Neem", "Tulsi", "Turmeric", "Manjistha", "Sesame Oil"],
    benefits: ["Balances skin", "Antimicrobial", "Traditional wellness"],
    notes: "Green herbs, warm earth, incense.",
    ambience: "leaves",
  },
];

export const trustPillars = [
  { title: "Handcrafted", body: "Each bar poured, cut and cured by hand in small batches." },
  { title: "Natural Ingredients", body: "Botanicals sourced with intention, nothing synthetic." },
  { title: "Cold Process", body: "The traditional method that preserves nutrients and glycerin." },
  { title: "Gentle on Skin", body: "Formulated for sensitive skin, safe for daily use." },
  { title: "Made to Order", body: "Custom soaps for weddings, gifting and rituals." },
  { title: "Doctor Formulated", body: "Every formula reviewed by dermatology professionals." },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCollection = (slug: string) =>
  collections.find((c) => c.slug === slug);
export const productsInCollection = (slug: ThemeKey) =>
  products.filter((p) => p.collection === slug);
