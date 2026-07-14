import { createClient } from '@supabase/supabase-js';

// We can extract url and key from .env using process.env, but we need dotenv.
// Let's just hardcode them for this quick test script.
const supabaseUrl = 'https://ymcsufhrrushqzzobppo.supabase.co';
const supabaseKey = 'sb_publishable_ZfmOPq7piE3QFcMVmb0IrA_1v2nTEQ9';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing foreign keys...");
  const res3 = await supabase.rpc('get_foreign_keys');
  // Since we don't have rpc, let's just query from information_schema
  // supabase JS client cannot query information_schema directly easily without rpc or postgrest.
  // Wait, let's just query a single row of `orders` and see what's in it, then query `auth.users`.
  const resOrder = await supabase.from('orders').select('*').limit(1);
  console.log("Single Order:", resOrder.data);

  // If we can't join profiles, maybe we can join users?
  // Supabase postgrest doesn't expose auth.users to public schema by default.
  // The correct way to join profiles from orders if they aren't linked is to manually link them, OR fix the schema.
  const resProfile = await supabase.from('profiles').select('*').limit(1);
  console.log("Single Profile:", resProfile.data);

}

test().catch(console.error);
