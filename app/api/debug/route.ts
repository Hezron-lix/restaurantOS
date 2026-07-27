import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: orders, error: oErr } = await supabase.from('orders').select('id, total_cents, order_items(id, quantity)').eq('status', 'BILLED').limit(5);
    
    // Check if order items exist without the foreign key mapping
    const { data: rawItems, error: iErr } = await supabase.from('order_items').select('*').limit(5);

    return NextResponse.json({ orders, oErr, rawItems, iErr });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}
