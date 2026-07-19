import heroIntro from "@/assets/hero-intro.png";
import envRadiance from "@/assets/env-radiance.jpg";
import envCalm from "@/assets/env-calm.jpg";
import envHerbal from "@/assets/env-herbal.jpg";
import envNourish from "@/assets/env-nourish.jpg";
import envRelax from "@/assets/env-relax.jpg";

export interface CraftsmanshipSlide {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const craftsmanshipSlides: CraftsmanshipSlide[] = [
  {
    id: "handcrafted",
    title: "Handcrafted",
    description: "Each bar is poured, cut and cured by hand with meticulous attention to detail.",
    image: heroIntro,
  },
  {
    id: "natural-ingredients",
    title: "Natural Ingredients",
    description:
      "We source only the finest botanical extracts, pure essential oils, and rich plant butters.",
    image: envRadiance,
  },
  {
    id: "cold-process",
    title: "Cold Process",
    description:
      "A slow method that retains naturally occurring glycerin to deeply moisturize your skin.",
    image: envCalm,
  },
  {
    id: "gentle-on-skin",
    title: "Gentle on Skin",
    description: "Free from harsh detergents and synthetic hardeners, ensuring a soothing lather.",
    image: envHerbal,
  },
  {
    id: "made-to-order",
    title: "Artisanal Wrapping",
    description: "Every soap is hand-wrapped in sustainable packaging, perfect for gifting.",
    image: envNourish,
  },
  {
    id: "doctor-formulated",
    title: "Doctor Formulated",
    description:
      "Expertly balanced recipes designed to nourish, heal, and protect your skin barrier.",
    image: envRelax,
  },
];
