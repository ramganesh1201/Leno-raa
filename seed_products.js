import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Read env
let envPath = path.resolve(process.cwd(), ".env");
const envFile = fs.readFileSync(envPath, "utf8");
const envVars = {};
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim().replace(/^['"]|['"]$/g, "");
    envVars[match[1].trim()] = val;
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Parse products
const catalog = fs.readFileSync("./src/lib/catalog.ts", "utf8");
const productsBlock = catalog.substring(catalog.indexOf("export const products: Product[] = ["));
const productMatches = [
  ...productsBlock.matchAll(
    /id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*collection:\s*"([^"]+)",\s*price:\s*(\d+),\s*tagline:\s*"([^"]+)",\s*description:\s*"([^"]+)",/g,
  ),
];

const parsedProducts = productMatches.map((m) => ({
  id: m[1],
  slug: m[2],
  name: m[3],
  description: m[7],
  price: parseInt(m[5]),
  stock: 100,
}));

async function seed() {
  console.log(`Seeding ${parsedProducts.length} products...`);
  const { data, error } = await supabase.from("products").upsert(parsedProducts);
  if (error) {
    console.error("Error seeding:", error);
  } else {
    console.log("Seeded successfully");
  }
}
seed();
