import test from 'node:test';
import assert from 'node:assert/strict';
import { getMenuItems } from '../lib/ai/tools/menu';
import type { ToolContext } from '../lib/ai/tools/registry';
import { USER_ROLES } from '../config/constants';

// Helper to create a mock Supabase client that tracks query builder calls
function createMockSupabase(mockData: any[] = [], mockError: any = null) {
  const queryLog: any = {
    selectArgs: [],
    eqArgs: [],
    ilikeArgs: [],
    orArgs: [],
    orderArgs: [],
    limitArgs: []
  };

  const chainObj = {
    select: (arg: string) => { queryLog.selectArgs.push(arg); return chainObj; },
    eq: (col: string, val: any) => { queryLog.eqArgs.push({ col, val }); return chainObj; },
    ilike: (col: string, val: any) => { queryLog.ilikeArgs.push({ col, val }); return chainObj; },
    or: (arg: string) => { queryLog.orArgs.push(arg); return chainObj; },
    order: (col: string, opts: any) => { queryLog.orderArgs.push({ col, opts }); return chainObj; },
    limit: (val: number) => { queryLog.limitArgs.push(val); return chainObj; },
    then: (resolve: any) => resolve({ data: mockData, error: mockError })
  };

  const supabase = {
    from: (table: string) => {
      queryLog.table = table;
      return chainObj;
    }
  };

  return { supabase: supabase as any, queryLog };
}

test('🤖 AI Tool: getMenuItems Unit Tests', async (t) => {
  const baseContext: ToolContext = {
    userId: 'user-1',
    role: 'waiter',
    restaurantId: 'rest-1',
    supabase: null as any
  };

  await t.test('1. Security: Restaurant scoping', async () => {
    const { supabase, queryLog } = createMockSupabase();
    await getMenuItems({ ...baseContext, supabase }, {});
    
    assert.equal(queryLog.table, 'menu_items');
    assert.deepEqual(queryLog.eqArgs[0], { col: 'menu_categories.restaurant_id', val: 'rest-1' }, 'Must enforce restaurant_id via RLS eq');
    assert.ok(queryLog.selectArgs[0].includes('menu_categories!inner'), 'Must use inner join to guarantee scoping');
  });

  await t.test('2 & 11. Most expensive available item & price sorting using integer cents', async () => {
    const { supabase, queryLog } = createMockSupabase();
    await getMenuItems({ ...baseContext, supabase }, { sortBy: 'price_desc', limit: 1, availableOnly: true });
    
    const isAvailEq = queryLog.eqArgs.find((a: any) => a.col === 'is_available');
    assert.deepEqual(isAvailEq, { col: 'is_available', val: true });
    assert.deepEqual(queryLog.orderArgs[0], { col: 'price_cents', opts: { ascending: false } });
    assert.deepEqual(queryLog.limitArgs[0], 1);
  });

  await t.test('3. Cheapest item sorting', async () => {
    const { supabase, queryLog } = createMockSupabase();
    await getMenuItems({ ...baseContext, supabase }, { sortBy: 'price_asc' });
    
    assert.deepEqual(queryLog.orderArgs[0], { col: 'price_cents', opts: { ascending: true } });
  });

  await t.test('4. Category filtering', async () => {
    const { supabase, queryLog } = createMockSupabase();
    await getMenuItems({ ...baseContext, supabase }, { category: 'Drinks' });
    
    assert.deepEqual(queryLog.ilikeArgs[0], { col: 'menu_categories.name', val: '%Drinks%' });
  });

  await t.test('5. Search filtering', async () => {
    const { supabase, queryLog } = createMockSupabase();
    await getMenuItems({ ...baseContext, supabase }, { search: 'burger' });
    
    assert.equal(queryLog.orArgs[0], 'name.ilike.%burger%,description.ilike.%burger%');
  });

  await t.test('6 & 7. Unavailable items excluded', async () => {
    const { supabase, queryLog } = createMockSupabase();
    await getMenuItems({ ...baseContext, supabase }, { availableOnly: true });
    
    const isAvailEq = queryLog.eqArgs.find((a: any) => a.col === 'is_available');
    assert.deepEqual(isAvailEq, { col: 'is_available', val: true });
  });

  await t.test('8. Empty menu results', async () => {
    const { supabase } = createMockSupabase([]);
    const res = await getMenuItems({ ...baseContext, supabase }, {});
    assert.equal(res.success, true);
    assert.deepEqual(res.data, []);
  });

  await t.test('9. Invalid role handling', async () => {
    const { supabase } = createMockSupabase();
    const res = await getMenuItems({ ...baseContext, role: 'hacker', supabase }, {});
    assert.equal((res as any).error, 'Unauthorized. Invalid role.');
  });

  await t.test('10. Attempts to pass a different restaurant_id', async () => {
    const { supabase, queryLog } = createMockSupabase();
    await getMenuItems({ ...baseContext, supabase }, { restaurant_id: 'rest-hacked' });
    
    // Ensure the query builder still used context.restaurantId ('rest-1')
    assert.deepEqual(queryLog.eqArgs[0], { col: 'menu_categories.restaurant_id', val: 'rest-1' });
  });

  await t.test('12. AI tool output formatting & vegetarian limitation', async () => {
    const mockDbData = [{
      id: 'item-1',
      name: 'Burger',
      description: 'A burger',
      price_cents: 1000,
      is_available: true,
      menu_categories: { name: 'Mains' }
    }];
    
    const { supabase } = createMockSupabase(mockDbData);
    const res: any = await getMenuItems({ ...baseContext, supabase }, {});
    
    assert.equal(res.success, true);
    assert.equal(res.data.length, 1);
    const item = res.data[0];
    
    assert.equal(item.id, 'item-1');
    assert.equal(item.name, 'Burger');
    assert.equal(item.categoryName, 'Mains');
    assert.equal(item.priceCents, 1000);
    assert.equal(item.available, true);
    assert.deepEqual(item.dietaryTags, [], 'Must return empty dietaryTags as an honest limitation');
  });
});
