const fs = require("fs");
let c = fs.readFileSync("src/services/product.service.ts", "utf8");

c = c.replace(
  /return \{\n\s+id: ([a-zA-Z]+)\.id,\n\s+slug: ([a-zA-Z]+)\.slug,[\s\S]*?\} as Product;/g,
  (match, p1) => {
    return `// Validate and sanitize data types
    const sanitizedPrice = typeof ${p1}.price === 'number' ? ${p1}.price : parseInt(String(${p1}.price).replace(/[^\\d]/g, '')) || 0;
    const sanitizedSkinType = typeof meta.skinType === 'string' ? meta.skinType : "";
    
    let sanitizedIngredients: string[] = [];
    if (Array.isArray(meta.ingredients)) {
      sanitizedIngredients = meta.ingredients;
    } else if (typeof meta.ingredients === 'string') {
      sanitizedIngredients = meta.ingredients.split(',').map(s => s.trim()).filter(Boolean);
    }

    return {
      id: ${p1}.id,
      slug: ${p1}.slug,
      name: ${p1}.name,
      description: ${p1}.description || "",
      price: sanitizedPrice,
      tagline: meta.tagline || "",
      skinType: sanitizedSkinType,
      collection: meta.collection ?? collections[0] ?? null,
      collections,
      ingredients: sanitizedIngredients,
      benefits: meta.benefits || [],
      notes: meta.notes || "",
      ambience: meta.ambience || "mist",
      accentColor: meta.accentColor || "#000",
      bgTint: meta.bgTint || "transparent",
      image: meta.image || "",
      images: meta.images || [],
    } as Product;`;
  },
);

fs.writeFileSync("src/services/product.service.ts", c);
