import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MenuManager } from "@/components/menu/MenuManager";

export default async function MenuPage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from("profiles")
    .select("restaurant_id, role")
    .eq("id", user.id)
    .single();

  if (!profile?.restaurant_id) redirect('/onboarding');
  
  // Fetch categories and items
  const { data: categoriesData } = await supabase
    .from("menu_categories")
    .select("id, name, description, display_order")
    .eq("restaurant_id", profile.restaurant_id)
    .order("display_order", { ascending: true });

  const categories = categoriesData || [];

  const { data: itemsData } = await supabase
    .from("menu_items")
    .select("id, category_id, name, description, price_cents, is_available")
    .in("category_id", categories.map(c => c.id))
    .order("name", { ascending: true });

  const items = itemsData || [];

  // Group items by category
  const categoriesWithItems = categories.map(cat => ({
    ...cat,
    items: items.filter(item => item.category_id === cat.id)
  }));

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Menu Management</h1>
        <p className="text-zinc-400 mt-1 text-sm">Create and organize your menu categories and items.</p>
      </div>

      <MenuManager restaurantId={profile.restaurant_id} categories={categoriesWithItems} />
    </div>
  );
}
