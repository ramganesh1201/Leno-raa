import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import { loadEnv } from 'vite';

const env = loadEnv('development', process.cwd(), '');
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function main() {
  const { data, error } = await supabase.from('products').select('slug, ui_metadata');
  if (error) {
    console.error(error);
    return;
  }
  console.log(JSON.stringify(data.filter(d => JSON.stringify(d).includes('/src/assets/')).map(d => ({slug: d.slug, image: d.ui_metadata?.image})), null, 2));
}
main();
