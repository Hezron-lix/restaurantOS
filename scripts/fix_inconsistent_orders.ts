import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: tables } = await supabase.from('tables').select('*');
  const { data: orders } = await supabase.from('orders').select('*');
  
  if (!tables || !orders) return;

  for (const order of orders) {
    const table = tables.find(t => t.id === order.table_id);
    if (!table) continue;

    // Rule: once a table is cleaned (AVAILABLE), order should change to billed
    if (table.status === 'AVAILABLE' && (order.status === 'SERVED' || order.status === 'READY' || order.status === 'PREPARING')) {
      console.log(`Fixing order ${order.id}: Table is AVAILABLE, so changing order to BILLED`);
      await supabase.from('orders').update({ status: 'BILLED' }).eq('id', order.id);
    }
  }
}

main();
