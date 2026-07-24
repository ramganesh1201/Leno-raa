import { supabase } from './src/lib/supabase.ts';
async function test() {
  const { data } = await supabase.storage.getBucket('payment-proofs');
  console.log('Bucket Info:', data);
}
test();
