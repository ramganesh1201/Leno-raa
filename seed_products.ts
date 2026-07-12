import { createClient } from '@supabase/supabase-js';
import { products } from './src/lib/catalog';
import fs from 'fs';
import path from 'path';

let envPath = path.resolve(process.cwd(), '.env');
const envFile = fs.readFileSync(envPath, 'utf8');
const envVars: any = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim().replace(/^['"]|['"]$/g, '');
    envVars[match[1].trim()] = val;
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log(`Seeding ${products.length} products...`);
  
  const mappedProducts = products.map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    skin_type: p.skinType,
    ingredients: p.ingredients,
    benefits: p.benefits,
    stock: 100
  }));

  const { data, error } = await supabase.from('products').upsert(mappedProducts);
  if (error) {
    console.error("Error seeding:", error);
  } else {
    console.log("Seeded successfully");
  }
}

seed();
