import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface InteractiveIngredientsProps {
  ingredients: string[];
}

export function InteractiveIngredients({ ingredients }: InteractiveIngredientsProps) {
  // A simple mapping to provide short mock descriptions for known ingredients
  // In a real app, this would come from the database
  const getDesc = (name: string) => {
    const map: Record<string, string> = {
      "Sweet Orange Oil": "Brightens and uplifts dull skin.",
      "Vitamin C": "Powerful antioxidant for a radiant glow.",
      "Cocoa Butter": "Deeply moisturizes and softens.",
      "Coconut Oil": "Provides a rich, creamy lather.",
      "Tomato Pulp": "Rich in antioxidants that brighten tired skin.",
      Lycopene: "Protects against environmental stressors.",
      "Rice Bran Oil": "Soothes and hydrates gently.",
      "Shea Butter": "Locks in moisture for all-day softness.",
      "Manjistha Root": "Traditionally used to even skin tone.",
      Turmeric: "Reduces inflammation and adds a golden glow.",
      Sandalwood: "Cools and calms reactive skin.",
      "Almond Oil": "Rich in Vitamin E for nourishment.",
      "Fresh Aloe Gel": "Instantly cools and hydrates.",
      "Cucumber Extract": "Refreshes and reduces puffiness.",
      Glycerin: "Draws moisture deep into the skin.",
      "Olive Oil": "A classic, gentle moisturizer.",
      "Sandalwood Powder": "Provides gentle physical exfoliation.",
      "Rose Water": "Balances skin pH and soothes.",
      "Kaolin Clay": "Gently draws out impurities.",
      "Menthol Crystals": "Provides an icy, awakening sensation.",
      "Peppermint Oil": "Stimulates and refreshes.",
      "Fresh Goat Milk": "Rich in lactic acid for gentle renewal.",
      Honey: "A natural humectant that draws in moisture.",
      Oatmeal: "Soothes dry, itchy, or irritated skin.",
      "Liquorice Root": "Helps fade dark spots naturally.",
      "Milk Cream": "Adds luxurious, fatty hydration.",
      "Sunflower Oil": "Lightweight, non-comedogenic moisture.",
      "Lavender Essential Oil": "Calms the mind and the skin.",
      "Dried Lavender": "Offers a mild, botanical scrub.",
      Neem: "Nature's antibacterial powerhouse.",
      Tulsi: "Purifies and protects.",
      "Sesame Oil": "A traditional, warming Ayurvedic base.",
    };
    return map[name] || "Botanical extract for healthy skin.";
  };

  return (
    <div className="flex flex-row md:flex-wrap gap-3 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory md:snap-none scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
      {ingredients.map((i) => (
        <motion.div
          key={i}
          whileHover={{ y: -4, scale: 1.02 }}
          className="group relative cursor-default overflow-hidden shrink-0 snap-start rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-5 py-3 shadow-sm transition-colors hover:border-[color:var(--gold)]/50 hover:bg-[color:var(--gold)]/5"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-[color:var(--gold)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="text-sm font-medium tracking-wide">{i}</span>
          </div>

          <div className="grid grid-rows-[0fr] transition-all duration-300 ease-in-out group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <div className="pt-2 text-xs leading-relaxed text-[color:var(--muted-foreground)]">
                {getDesc(i)}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
