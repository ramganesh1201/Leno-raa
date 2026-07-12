const fs = require('fs');

const data = {
  "orange": { price: 90, skinType: "Oily Skin", ingredients: ["Sweet Orange Oil", "Vitamin C (L-Ascorbic Acid)", "Coconut Oil", "Palm Oil", "Rice Bran Oil", "Sunflower Oil", "Mustard Oil", "Castor Oil"] },
  "tomato": { price: 90, skinType: "Normal Skin", ingredients: ["Tomato Lycopene Extract", "Fruit Acids", "Coconut Oil", "Palm Oil", "Rice Bran Oil", "Sunflower Oil", "Sweet Almond Oil", "Castor Oil"] },
  "manjichandan": { price: 100, skinType: "Oily Skin", ingredients: ["Manjistha Bark Powder", "Mysore Sandalwood Extract", "Coconut Oil", "Palm Oil", "Rice Bran Oil", "Sunflower Oil", "Mustard Oil", "Castor Oil"] },
  "charcoal": { price: 90, skinType: "Oily Skin", ingredients: ["Activated Charcoal", "Tea Tree Oil", "Coconut Oil", "Palm Oil", "Rice Bran Oil", "Sunflower Oil", "Mustard Oil", "Castor Oil"] },
  "rose blossom soap": { price: 90, skinType: "All Skin Types", ingredients: ["Rose Petal Powder", "Coconut Oil", "Palm Oil", "Rice Bran Oil", "Sunflower Oil", "Mustard Oil", "Castor Oil"] },
  "aloe-vera": { price: 90, skinType: "Dry Skin", ingredients: ["Organic Aloe Vera", "Eucalyptus Oil", "Olive Oil", "Coconut Oil", "Palm Oil", "Sweet Almond Oil", "Sesame Oil", "Cocoa Butter", "Castor Oil"] },
  "menthol": { price: 90, skinType: "Oily Skin", ingredients: ["Menthol Crystals", "Peppermint Oil", "Coconut Oil", "Palm Oil", "Rice Bran Oil", "Sunflower Oil", "Mustard Oil", "Castor Oil"] },
  "aloe-vera gel": { price: 80, skinType: "All Skin Types", ingredients: ["Pure Aloe Vera Extract", "Vitamin E", "Glycerin", "Purified Water", "Natural Preservative"] },
  "goat-milk": { price: 90, skinType: "Dry Skin", ingredients: ["Fresh Goat Milk", "Olive Oil", "Coconut Oil", "Palm Oil", "Sweet Almond Oil", "Sesame Oil", "Cocoa Butter", "Castor Oil"] },
  "butter with milk soap": { price: 120, skinType: "Normal Skin (Ideal for Babies & Sensitive Skin)", ingredients: ["Organic Shea Butter", "Cocoa Butter", "Coconut Oil", "Palm Oil", "Rice Bran Oil", "Sunflower Oil", "Sweet Almond Oil", "Castor Oil"] },
  "golden-oats soap": { price: 120, skinType: "Ultra Sensitive Skin (Suitable for Babies)", ingredients: ["Oats", "Raw Honey", "Coconut Oil", "Olive Oil", "Castor Oil", "Cocoa Butter"] },
  "lavender": { price: 90, skinType: "Dry Skin", ingredients: ["Bulgarian Lavender Oil", "Lavender Buds", "Olive Oil", "Coconut Oil", "Palm Oil", "Sweet Almond Oil", "Sesame Oil", "Cocoa Butter", "Castor Oil"] },
  "ayurvedic-herbal soap": { price: 90, skinType: "Normal Skin", ingredients: ["Mustha", "Triphala", "Madanaphala", "Karanja", "Aragwada", "Kutaja", "Sapthaparna", "Kustha", "Priyangu", "Daruharidra", "Coconut Oil", "Palm Oil", "Olive Oil", "Sesame Oil", "Neem Oil", "Castor Oil"] },
  "Golden Nalpa Glow": { price: 100, skinType: "Dry Skin", ingredients: ["Nalpamaradi Tailam", "Olive Oil", "Coconut Oil", "Palm Oil", "Sweet Almond Oil", "Sesame Oil", "Cocoa Butter", "Castor Oil"] },
  "coffeelatte soap": { price: 120, skinType: "Normal Skin", ingredients: ["Ground Coffee Beans", "Natural Caffeine", "Coconut Oil", "Palm Oil", "Castor Oil"] }
};

let content = fs.readFileSync('src/lib/catalog.ts', 'utf-8');

// Add skinType to Product interface
content = content.replace(
  /export interface Product \{([\s\S]*?)ingredients: string\[\];/m,
  'export interface Product {$1skinType?: string;\n  ingredients: string[];'
);

// Update each product
let output = [];
const lines = content.split('\n');
let inProduct = false;
let currentSlug = null;
let braceDepth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('export const products: Product[] = [')) {
    output.push(line);
    continue;
  }

  // Very simple state machine for the array
  const slugMatch = line.match(/slug:\s*"([^"]+)"/);
  if (slugMatch) {
    currentSlug = slugMatch[1];
  }

  if (currentSlug && data[currentSlug]) {
    const update = data[currentSlug];
    
    // Replace price
    if (line.match(/^\s*price:\s*\d+,/)) {
      output.push(line.replace(/price:\s*\d+,/, `price: ${update.price},`));
      
      // Inject skinType right after price
      output.push(`    skinType: "${update.skinType}",`);
      continue;
    }

    // Replace ingredients
    if (line.match(/^\s*ingredients:\s*\[.*\]/)) {
      output.push(`    ingredients: ${JSON.stringify(update.ingredients)},`);
      continue;
    }
  }

  output.push(line);
}

fs.writeFileSync('src/lib/catalog.ts', output.join('\n'));
console.log("Updated catalog.ts");
