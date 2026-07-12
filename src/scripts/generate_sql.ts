import { products } from '../lib/catalog';
import fs from 'fs';
import path from 'path';

let sql = `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ui_metadata JSONB DEFAULT '{}'::jsonb;\n\n`;

sql += products.map(p => {
  const description = p.description.replace(/'/g, "''");
  const name = p.name.replace(/'/g, "''");
  
  const ui_metadata = JSON.stringify({
    tagline: p.tagline,
    skinType: p.skinType,
    collection: p.collection,
    ingredients: p.ingredients,
    benefits: p.benefits,
    notes: p.notes,
    ambience: p.ambience,
    accentColor: p.accentColor,
    bgTint: p.bgTint,
    image: p.image,
    images: p.images
  }).replace(/'/g, "''");

  return `INSERT INTO public.products (id, slug, name, description, price, stock, ui_metadata) VALUES ('${p.id}', '${p.slug}', '${name}', '${description}', ${p.price}, 100, '${ui_metadata}'::jsonb) ON CONFLICT (slug) DO UPDATE SET ui_metadata = EXCLUDED.ui_metadata;`;
}).join('\n');

fs.writeFileSync(path.join(process.cwd(), 'src/scripts/seed_products.sql'), sql);
console.log('SQL generated successfully.');
