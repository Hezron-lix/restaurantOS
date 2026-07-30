import type { ToolContext } from './registry';
import { USER_ROLES } from '@/config/constants';

export async function getMenuItems(context: ToolContext, args: Record<string, any>) {
  try {
    // 1. Re-use existing role helper
    if (!USER_ROLES.includes(context.role as any)) {
      return { error: 'Unauthorized. Invalid role.' };
    }

    if (!context.restaurantId) {
      return { error: 'No restaurant context found.' };
    }

    // 2. Query menu items with an inner join to strictly enforce restaurant scoping
    let query = context.supabase
      .from('menu_items')
      .select(`
        id,
        name,
        description,
        price_cents,
        is_available,
        menu_categories!inner (
          name,
          restaurant_id
        )
      `)
      .eq('menu_categories.restaurant_id', context.restaurantId);

    // 3. Filters
    if (args.category) {
      // Use case-insensitive matching for category name
      query = query.ilike('menu_categories.name', `%${args.category}%`);
    }

    if (args.search) {
      // Search in name or description
      query = query.or(`name.ilike.%${args.search}%,description.ilike.%${args.search}%`);
    }

    if (args.availableOnly) {
      query = query.eq('is_available', true);
    }

    // 4. Sorting (uses integer price_cents)
    if (args.sortBy === 'price_desc') {
      query = query.order('price_cents', { ascending: false });
    } else if (args.sortBy === 'price_asc') {
      query = query.order('price_cents', { ascending: true });
    } else if (args.sortBy === 'name') {
      query = query.order('name', { ascending: true });
    } else {
      // Default fallback
      query = query.order('name', { ascending: true });
    }

    // 5. Limit (cap to a safe maximum)
    const limit = Math.min(Number(args.limit) || 20, 20);
    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // 6. Format output strictly for Copilot, flattening the category
    const formattedData = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      categoryName: item.menu_categories?.name,
      description: item.description,
      priceCents: item.price_cents,
      available: item.is_available,
      dietaryTags: [] // Honest limitation: schema currently does not support dietary tags
    }));

    return {
      success: true,
      data: formattedData
    };

  } catch (error: any) {
    return { error: error.message || 'Failed to fetch menu items.' };
  }
}
