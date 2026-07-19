import type { Product } from "@/lib/catalog";

// Mapping of Soap Name to Skin Type
export const skinTypeMap: Record<string, string> = {
  Menthol: "Combination / Oily",
  Orange: "Combination / Oily",
  "Goat Milk": "All Skin Types",
  Lavender: "Dry / Sensitive",
  "Aloe Vera": "Dry / Sensitive",
  Tomato: "Normal / Combination / Sensitive",
  Manjichandan: "All Skin Types",
  Charcoal: "Oily / Acne Prone",
  "Golden Nalpa Glow": "Dry / Normal",
  "Ayurvedic Herbal": "Sensitive / Oily",
  "Rose Blossom": "All Skin Types",
  "Golden Oats": "Ultra Sensitive / Kids",
  "Butter with Milk": "Ultra Sensitive / Kids",
  "Coffee Latte": "Oily / Acne Prone",
};

// Mapping of Skin Concern to an array of Soap Names
export const skinConcernMap: Record<string, string[]> = {
  "Dark Spots / Uneven Skin Tone": ["Golden Nalpa Glow", "Tomato", "Orange", "Manjichandan"],
  "Tan / Dull Skin": ["Golden Nalpa Glow", "Orange", "Tomato", "Manjichandan"],
  "Active Acne / Pimples": ["Charcoal", "Coffee Latte", "Ayurvedic Herbal"],
  "Oily Skin": ["Charcoal", "Coffee Latte", "Menthol"],
  "Closed Comedones / Congested Skin": ["Charcoal", "Coffee Latte"],
  "Large-looking Pores": ["Charcoal", "Menthol", "Coffee Latte"],
  "Acne Marks / Post-Acne Dullness": ["Golden Nalpa Glow", "Tomato", "Manjichandan"],
  "Sensitive / Redness-prone Skin": ["Aloe Vera", "Lavender", "Golden Oats"],
  "Ultra-Sensitive Skin / Kids": ["Golden Oats", "Butter with Milk"],
  "Dry / Dehydrated Skin": ["Goat Milk", "Aloe Vera", "Butter with Milk"],
  "Relaxation / Refreshing Bath": ["Rose Blossom", "Lavender", "Menthol"],
};

// Helper to normalize strings for comparison
const normalize = (str: string) => str.toLowerCase().trim();

/**
 * Given a product name, returns an array of its associated skin concerns.
 */
export function getProductConcerns(productName: string): string[] {
  const normalizedName = normalize(productName);
  const concerns: string[] = [];

  for (const [concern, soaps] of Object.entries(skinConcernMap)) {
    if (
      soaps.some(
        (soap) => normalize(soap) === normalizedName || normalizedName.includes(normalize(soap)),
      )
    ) {
      concerns.push(concern);
    }
  }
  return concerns;
}

/**
 * Given a product name, returns its mapped skin type, or null.
 */
export function getProductSkinType(productName: string): string | null {
  const normalizedName = normalize(productName);
  for (const [soap, type] of Object.entries(skinTypeMap)) {
    if (normalize(soap) === normalizedName || normalizedName.includes(normalize(soap))) {
      return type;
    }
  }
  return null;
}

export interface RecommendationResult {
  product: Product;
  score: number;
  sharedConcerns: string[];
  sharedSkinTypes: boolean;
}

/**
 * Evaluates the catalog and returns the top 4 recommendations for a given product
 * based on shared skin concerns, skin types, and collection membership.
 */
export function getRecommendations(
  currentProduct: Product,
  allProducts: Product[],
): RecommendationResult[] {
  const currentConcerns = getProductConcerns(currentProduct.name);
  const currentSkinType = getProductSkinType(currentProduct.name);

  const results: RecommendationResult[] = [];

  for (const product of allProducts) {
    // Exclude the currently viewed product
    if (product.id === currentProduct.id || product.slug === currentProduct.slug) {
      continue;
    }

    const concerns = getProductConcerns(product.name);
    const skinType = getProductSkinType(product.name);

    let score = 0;
    const sharedConcerns: string[] = [];

    // +3 points for every shared skin concern
    for (const concern of concerns) {
      if (currentConcerns.includes(concern)) {
        score += 3;
        sharedConcerns.push(concern);
      }
    }

    // +2 points for shared skin type
    const sharedSkinTypes = Boolean(currentSkinType && skinType && currentSkinType === skinType);
    if (sharedSkinTypes) {
      score += 2;
    }

    // +1 point for same collection (tie-breaker)
    if (product.collection === currentProduct.collection) {
      score += 1;
    }

    results.push({
      product,
      score,
      sharedConcerns,
      sharedSkinTypes,
    });
  }

  // Sort by highest score descending
  results.sort((a, b) => b.score - a.score);

  // Return top 4
  return results.slice(0, 4);
}
