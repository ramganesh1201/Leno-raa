import envRadiance from "@/assets/env-radiance.jpg";
import envCalm from "@/assets/env-calm.jpg";
import envNourish from "@/assets/env-nourish.jpg";
import envRelax from "@/assets/env-relax.jpg";
import envHerbal from "@/assets/env-herbal.jpg";
import lavender from "@/assets/soaps/lavender.jpeg";
import menthol from "@/assets/soaps/menthol.jpeg";
import aloeVera from "@/assets/soaps/aloeVera.jpeg";
import tomato from "@/assets/soaps/tomato.jpeg";
import orange from "@/assets/soaps/orange.jpeg";
import buttermilk from "@/assets/soaps/buttersoap.jpeg";
import oats from "@/assets/soaps/oats.jpeg";
import aloeveragel from "@/assets/soaps/aloeveragel.jpeg";
import charcoal from "@/assets/soaps/charcoal.jpeg";
import nalpamaradhi from "@/assets/soaps/nalpamaradhi.jpeg";
import manji from "@/assets/soaps/manji.jpeg";
import goatmilk from "@/assets/soaps/goatmilk.jpeg";
import ayuherbal from "@/assets/soaps/ayuherbal.jpeg";
import coffeelatte from "@/assets/soaps/coffee.png";

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
  id: string;
  slug: string;
  name: string;
  collection: ThemeKey;
  price: number;
  tagline: string;
  description: string;
  skinType?: string;
  ingredients: string[];
  benefits: string[];
  notes: string;
  ambience: AmbiencePreset;
  /** Primary accent color for UI elements (buttons, stars, borders) */
  accentColor: string;
  /** Subtle tint applied to the glass overlays and background */
  bgTint: string;
  image?: string;
  images?: string[];
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
    id: "6c9ea8ff-cc0b-4e25-bd27-e0c22d0c60df",
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
    id: "36e288e1-a593-4b5e-81d4-c7f35aeec87c",
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
    id: "8a42c7c0-955c-4fcb-a04a-1ceec3661e50",
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
    id: "862dc82a-ca52-4650-82c0-0e8a3f5e5b0c",
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
    id: "1e01b40e-7d37-4590-9969-49701132e42c",
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
    id: "0eb17f12-063c-4717-b42b-6b883278946d",
    name: "Orange",
    collection: "radiance",
    price: 90,
    skinType: "Oily Skin",
    tagline: "Sun in a bar",
    image: orange,
    description:
      "Cold-pressed orange essential oil folded into a slow-cured base. Awakens dull skin with the brightness of a coastal morning.",
    ingredients: ["Sweet Orange Oil","Vitamin C (L-Ascorbic Acid)","Coconut Oil","Palm Oil","Rice Bran Oil","Sunflower Oil","Mustard Oil","Castor Oil"],
    benefits: ["Brightens complexion", "Rich in antioxidants", "Uplifting citrus aroma"],
    notes: "Top: sweet orange. Heart: bitter zest. Base: soft amber.",
    ambience: "goldDust",
    accentColor: "#d97706", // Amber
    bgTint: "rgba(217, 119, 6, 0.05)",
  },
  {
    slug: "tomato",
    id: "5427b42c-3e23-4370-b87f-05b54bb41e3f",
    name: "Tomato",
    collection: "radiance",
    price: 90,
    skinType: "Normal Skin",
    tagline: "Ripe with lycopene",
    image: tomato,
    description:
      "An unexpected hero. Sun-ripened tomato pulp lends lycopene and gentle exfoliation for a clearer, calmer glow.",
    ingredients: ["Tomato Lycopene Extract","Fruit Acids","Coconut Oil","Palm Oil","Rice Bran Oil","Sunflower Oil","Sweet Almond Oil","Castor Oil"],
    benefits: ["Reduces tan", "Refines pores", "Antioxidant-rich"],
    notes: "Fresh, green, faintly sweet.",
    ambience: "pollen",
    accentColor: "#dc2626", // Natural Red
    bgTint: "rgba(220, 38, 38, 0.03)",
  },
  {
    slug: "manjichandan",
    id: "0364ad8f-a8d0-4018-8fe6-1e5c010bbc1a",
    name: "Manjichandan",
    collection: "radiance",
    price: 100,
    skinType: "Oily Skin",
    tagline: "Ayurveda's blood purifier",
    image: manji,
    description:
      "The root prized by Ayurvedic physicians for luminous, even-toned skin. Steeped slowly, honored fully.",
    ingredients: ["Manjistha Bark Powder","Mysore Sandalwood Extract","Coconut Oil","Palm Oil","Rice Bran Oil","Sunflower Oil","Mustard Oil","Castor Oil"],
    benefits: ["Evens skin tone", "Reduces pigmentation", "Detoxifying"],
    notes: "Earthy, warm, faintly floral.",
    ambience: "goldDust",
    accentColor: "#b45309",
    bgTint: "rgba(180, 83, 9, 0.04)",
  },
  {
    slug: "charcoal",
    id: "0d29f902-18ca-4236-943d-528acb25cef9",
    name: "Charcoal",
    collection: "radiance", // Putting it here for mock
    price: 90,
    skinType: "Oily Skin",
    tagline: "Deep volcanic cleanse",
    image: charcoal,
    description:
      "Activated bamboo charcoal draws out impurities like a magnet, while mineral-rich clays refine pores.",
    ingredients: ["Activated Charcoal","Tea Tree Oil","Coconut Oil","Palm Oil","Rice Bran Oil","Sunflower Oil","Mustard Oil","Castor Oil"],
    benefits: ["Deeply purifying", "Balances oils", "Refines pores"],
    notes: "Cold stone, smoke, fresh earth.",
    ambience: "smoke",
    accentColor: "#334155", // Graphite
    bgTint: "rgba(15, 23, 42, 0.15)", // Darker tint for Charcoal
  },
  {
    slug: "rose blossom soap",
    id: "6a88095e-2d96-464e-9ff0-d29466167e03",
    name: "Rose Blossom Soap",
    collection: "calm",
    price: 90,
    skinType: "All Skin Types",
    tagline: "Petals in the rain",
    image: lavender, // Reusing image placeholder
    description:
      "Rose essential oil and petals, blended into a gentle base. For skin that needs a soft touch and a floral embrace.",
    ingredients: ["Rose Petal Powder","Coconut Oil","Palm Oil","Rice Bran Oil","Sunflower Oil","Mustard Oil","Castor Oil"],
    benefits: ["Soothes sensitive skin", "Hydrates deeply", "Calming aroma"],
    notes: "Fresh rose, soft rain, subtle musk.",
    ambience: "petals",
    accentColor: "#be185d", // Deep rose
    bgTint: "rgba(190, 24, 93, 0.04)",
  },
  {
    slug: "aloe-vera",
    id: "8434437e-1c59-4c56-bcbd-09cbe50f223e",
    name: "Aloe Vera",
    collection: "calm",
    price: 90,
    skinType: "Dry Skin",
    tagline: "Water made whole",
    image: aloeVera,
    description:
      "Fresh aloe gel harvested at dawn, folded into a cool, mild base. For skin that needs a quiet breath.",
    ingredients: ["Organic Aloe Vera","Eucalyptus Oil","Olive Oil","Coconut Oil","Palm Oil","Sweet Almond Oil","Sesame Oil","Cocoa Butter","Castor Oil"],
    benefits: ["Deeply hydrating", "Soothes redness", "Non-comedogenic"],
    notes: "Cucumber, green tea, still water.",
    ambience: "mist",
    accentColor: "#15803d", // Green
    bgTint: "rgba(21, 128, 61, 0.04)",
  },
  {
    slug: "menthol",
    id: "0b1cdaf5-61d0-4412-9a73-d3687b9fad31",
    name: "Menthol",
    collection: "calm",
    price: 90,
    skinType: "Oily Skin",
    tagline: "First breath of morning",
    image: menthol,
    description:
      "Pure menthol crystals give a bracing, crystalline coolness. For summer skin and clear mornings.",
    ingredients: ["Menthol Crystals","Peppermint Oil","Coconut Oil","Palm Oil","Rice Bran Oil","Sunflower Oil","Mustard Oil","Castor Oil"],
    benefits: ["Cooling effect", "Refreshes tired skin", "Awakens the senses"],
    notes: "Crushed mint, mountain air.",
    ambience: "steam",
    accentColor: "#0369a1", // Ice blue
    bgTint: "rgba(3, 105, 161, 0.04)",
  },
  {
    slug: "aloe-vera gel",
    id: "5175244d-6a5f-4e55-bc36-8d4f3f4e4ae2",
    name: "Aloe Vera Gel",
    collection: "calm",
    price: 80,
    skinType: "All Skin Types",
    tagline: "Soothing hydration",
    image: aloeveragel,
    description:
      "Pure aloe vera gel, harvested fresh and blended into a gentle base. Ideal for calming sun-exposed or irritated skin.",
    ingredients: ["Pure Aloe Vera Extract","Vitamin E","Glycerin","Purified Water","Natural Preservative"],
    benefits: ["Deeply hydrating", "Soothes redness", "Non-comedogenic"],
    notes: "Cucumber, green tea, still water.",
    ambience: "mist",
    accentColor: "#15803d", // Green
    bgTint: "rgba(21, 128, 61, 0.04)",
  },
  {
    slug: "goat-milk",
    id: "d4edf043-98aa-4364-ab8d-a2a174f073ca",
    name: "Goat Milk",
    collection: "nourish",
    price: 90,
    skinType: "Dry Skin",
    tagline: "Ancient hydration",
    image: goatmilk,
    description:
      "Whole goat milk, gently blended cold. Naturally rich in fatty acids and lactic acid for velvet softness.",
    ingredients: ["Fresh Goat Milk","Olive Oil","Coconut Oil","Palm Oil","Sweet Almond Oil","Sesame Oil","Cocoa Butter","Castor Oil"],
    benefits: ["Deeply moisturizing", "Gentle exfoliation", "Barrier repair"],
    notes: "Cream, honey, faint vanilla.",
    ambience: "cream",
    accentColor: "#d4b068", // Honey cream
    bgTint: "rgba(250, 245, 235, 0.3)",
  },
  {
    slug: "butter with milk soap",
    id: "4e96fdee-e424-45f0-9766-b6a8c8fc5d01",
    name: "Butter with Milk Soap",
    collection: "nourish",
    price: 120,
    skinType: "Normal Skin (Ideal for Babies & Sensitive Skin)",
    tagline: "Velvet touch",
    image: buttermilk, // Reusing image placeholder
    description:
      "A rich blend of butter and milk for skin that craves deep hydration. Smooth, creamy, and indulgent.",
    ingredients: ["Organic Shea Butter","Cocoa Butter","Coconut Oil","Palm Oil","Rice Bran Oil","Sunflower Oil","Sweet Almond Oil","Castor Oil"],
    benefits: ["Deeply moisturizing", "Softens skin", "Rich in vitamins"],
    notes: "Creamy, nutty, soft vanilla.",
    ambience: "cream",
    accentColor: "#d97706", // Golden cream
    bgTint: "rgba(217, 119, 6, 0.05)",
  },
  {
    slug: "golden-oats soap",
    id: "fa444c4d-7320-4a3f-846c-3b9be0182229",
    name: "Golden Oats Soap",
    collection: "nourish",
    price: 120,
    skinType: "Ultra Sensitive Skin (Suitable for Babies)",
    tagline: "Soothing grains",
    image: oats, // Reusing image placeholder
    description:
      "Oatmeal and honey blended into a creamy base. Gentle exfoliation and soothing hydration for sensitive skin.",
    ingredients: ["Oats","Raw Honey","Coconut Oil","Olive Oil","Castor Oil","Cocoa Butter"],
    benefits: ["Soothes irritation", "Gentle exfoliation", "Moisturizes deeply"],
    notes: "Warm oats, honey, soft cream.",
    ambience: "cream",
    accentColor: "#f59e0b", // Warm oat
    bgTint: "rgba(245, 158, 11, 0.04)",
  },
  {
    slug: "lavender",
    id: "bfe7a2e3-9564-45a9-9d21-3cd8338d4d48",
    name: "Lavender",
    collection: "relax",
    price: 90,
    skinType: "Dry Skin",
    tagline: "The day, exhaled",
    image: lavender,
    description:
      "French lavender essential oil, distilled at altitude. A single bar that turns a shower into a ceremony.",
    ingredients: ["Bulgarian Lavender Oil","Lavender Buds","Olive Oil","Coconut Oil","Palm Oil","Sweet Almond Oil","Sesame Oil","Cocoa Butter","Castor Oil"],
    benefits: ["Calms the senses", "Softens skin", "Aids restful sleep"],
    notes: "Fresh lavender, cedar, twilight air.",
    ambience: "petals",
    accentColor: "#7e22ce", // Purple
    bgTint: "rgba(126, 34, 206, 0.04)",
  },
  {
    slug: "ayurvedic-herbal soap",
    id: "d7af75b6-acf3-4f67-9464-28068197c5a8",
    name: "Ayurvedic Herbal Soap",
    collection: "herbal",
    price: 90,
    skinType: "Normal Skin",
    tagline: "The old formula",
    image: ayuherbal, // Reusing placeholder
    description:
      "Neem, tulsi, turmeric, and manjistha, ground and blended by a formula passed through generations. Wellness as ritual.",
    ingredients: ["Mustha","Triphala","Madanaphala","Karanja","Aragwada","Kutaja","Sapthaparna","Kustha","Priyangu","Daruharidra","Coconut Oil","Palm Oil","Olive Oil","Sesame Oil","Neem Oil","Castor Oil"],
    benefits: ["Balances skin", "Antimicrobial", "Traditional wellness"],
    notes: "Green herbs, warm earth, incense.",
    ambience: "leaves",
    accentColor: "#166534", // Deep green
    bgTint: "rgba(22, 101, 52, 0.05)",
  },
  {
    slug: "Golden Nalpa Glow",
    id: "5df2c1fc-4811-4d2a-874f-8e3b702c6e3c",
    name: "Golden Nalpa Glow",
    collection: "radiance",
    price: 100,
    skinType: "Dry Skin",
    tagline: "Ayurvedic radiance",
    image: nalpamaradhi,
    description:
      "A luxurious blend of saffron, turmeric, and manjistha. A bar that honors the skin's natural glow.",
    ingredients: ["Nalpamaradi Tailam","Olive Oil","Coconut Oil","Palm Oil","Sweet Almond Oil","Sesame Oil","Cocoa Butter","Castor Oil"],
    benefits: ["Brightens complexion", "Evens skin tone", "Rich in antioxidants"],
    notes: "Warm saffron, golden honey, soft earth.",
    ambience: "goldDust",
    accentColor: "#b45309", // Golden
    bgTint: "rgba(180, 83, 9, 0.04)",
  },
  {
    slug: "coffeelatte soap",
    id: "b4d8cc9d-0c79-4224-b363-cfe38421199e",
    name: "Coffee Latte Soap",
    collection: "nourish",
    price: 120,
    skinType: "Normal Skin",
    tagline: "Morning awakening",
    image: coffeelatte,
    description:
      "Freshly ground Arabica beans provide invigorating exfoliation while caffeine stimulates and tightens.",
    ingredients: ["Ground Coffee Beans","Natural Caffeine","Coconut Oil","Palm Oil","Castor Oil"],
    benefits: ["Exfoliating", "Stimulates circulation", "Rich aroma"],
    notes: "Roasted beans, dark chocolate, vanilla.",
    ambience: "steam",
    accentColor: "#78350f", // Brown
    bgTint: "rgba(120, 53, 15, 0.05)",
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
export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getProductById(id: string | undefined | null): Product | undefined {
  if (!id) return undefined;
  return products.find((p) => p.id === id);
}
export const productsInCollection = (slug: ThemeKey) =>
  products.filter((p) => p.collection === slug);
