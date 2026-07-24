import envRadiance from "@/assets/env-radiance.webp";
import envCalm from "@/assets/env-calm.webp";
import envNourish from "@/assets/env-nourish.webp";
import envRelax from "@/assets/env-relax.webp";
import envHerbal from "@/assets/env-herbal.webp";
import lavender from "@/assets/soaps/lavender.webp";
import menthol from "@/assets/soaps/menthol.webp";
import aloeVera from "@/assets/soaps/aloeVera.webp";
import tomato from "@/assets/soaps/tomato.webp";
import orange from "@/assets/soaps/orange.webp";
import buttermilk from "@/assets/soaps/buttersoap.webp";
import oats from "@/assets/soaps/oats.webp";
import aloeveragel from "@/assets/soaps/aloeveragel.webp";
import charcoal from "@/assets/soaps/charcoal.webp";
import nalpamaradhi from "@/assets/soaps/nalpamaradhi.webp";
import manji from "@/assets/soaps/manji.webp";
import goatmilk from "@/assets/soaps/goatmilk.webp";
import ayuherbal from "@/assets/soaps/ayuherbal.webp";
import coffeelatte from "@/assets/soaps/coffee.webp";

export type ThemeKey = "radiance" | "calm" | "nourish" | "relax" | "herbal";

export type AmbiencePreset =
  "goldDust" | "mist" | "pollen" | "petals" | "leaves" | "smoke" | "cream" | "steam";

export interface Product {
  id: string;
  slug: string;
  name: string;
  collection: ThemeKey;
  collections?: ThemeKey[];
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

export function getProductCollections(product: Product): ThemeKey[] {
  if (product.collections?.length) {
    return [...new Set(product.collections)];
  }
  return product.collection ? [product.collection] : [];
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
    id: "8c7921a2-ffb7-4a0f-bce6-3e421035be26",
    name: "Nourish & Hydrate",
    eyebrow: "Chapter III",
    purpose: "Deep Moisture for Dry and Mature Skin",
    scene: "Milk & Honey Bath",
    environment:
      "Thick, warm steam rolling over white marble. A rich, heavy calm settles into the bones.",
    benefits: ["Deeply moisturizes", "Softens skin", "Helps restore skin barrier"],
    image: envNourish,
    ambience: "steam",
  },
  {
    slug: "relax",
    id: "888636ba-d464-4112-9214-419ab07e86e3",
    name: "Relax & Rejuvenate",
    eyebrow: "Chapter IV",
    purpose: "Unwind the Senses",
    scene: "Lavender Twilight",
    environment:
      "A purple dusk falling over a quiet field. The air is cool, still, and heavy with rest.",
    benefits: ["Calming aromatherapy", "Relieves stress", "Prepares for sleep"],
    image: envRelax,
    ambience: "smoke",
  },
  {
    slug: "herbal",
    id: "721de0a5-24d1-4389-9a70-7607a7a58a9e",
    name: "Herbal Healing",
    eyebrow: "Chapter V",
    purpose: "Ancient Remedies for Skin Health",
    scene: "Ancient Apothecary",
    environment:
      "An old apothecary. Mortar and pestle, wooden shelves, herbs measured by hand for centuries.",
    benefits: ["Traditional herbal blend", "Supports skin health", "Helps maintain balance"],
    image: envHerbal,
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

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
