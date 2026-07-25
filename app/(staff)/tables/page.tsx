import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TableGrid } from "@/components/tables/TableGrid";

export default async function TablesPage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from("profiles")
    .select("restaurant_id")
    .eq("id", user.id)
    .single();

  if (!profile?.restaurant_id) redirect('/onboarding');

  const { data: tables } = await supabase
    .from("tables")
    .select("id, table_number, capacity, status")
    .eq("restaurant_id", profile.restaurant_id)
    .order("table_number", { ascending: true });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Table Management</h1>
        <p className="text-zinc-400 mt-1 text-sm">Select a table to open an order or view status.</p>
      </div>

      {!tables || tables.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 rounded-xl border border-white/5">
          <p className="text-zinc-400">No tables configured for this restaurant.</p>
        </div>
      ) : (
        <TableGrid tables={tables as { id: string; table_number: number; capacity: number; status: "AVAILABLE" | "SEATED" | "PREPARING" | "READY" | "DIRTY" | "RESERVED" | "CLEANING" }[]} />
      )}
    </div>
  );
}
