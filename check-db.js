import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

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

async function checkDb() {
  console.log("Checking products table...");
  const { data: products, error: pErr } = await supabase.from("products").select("*").limit(5);
  console.log("Products error:", pErr);
  console.log("Products count/data:", products?.length, products);
}

checkDb();
