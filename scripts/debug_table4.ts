import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: tables } = await supabase.from('tables').select('*');
  console.log('Table 4:', tables?.filter(t => t.table_number === 4));
  
  const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  const table4 = tables?.find(t => t.table_number === 4);
  console.log('Orders for Table 4:', orders?.filter(o => o.table_id === table4?.id));
}

main();
