const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
let envFile = '';
try { envFile = fs.readFileSync('.env', 'utf8'); } catch(e) {}
try { if(!envFile) envFile = fs.readFileSync('.env.local', 'utf8'); } catch(e) {}

const urlMatch = envFile.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (urlMatch && keyMatch) {
  const supabase = createClient(urlMatch[1], keyMatch[1]);
  supabase.from('products').select('slug, price').then(({ data, error }) => {
    if (error) console.error("Error:", error);
    else console.log("Products in DB:", data);
  });
} else {
  console.log("No Supabase env vars found.");
}
