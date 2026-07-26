"use client";

import { useState, useTransition } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Check, Loader2, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { createMenuCategoryAction, createMenuItemAction, toggleMenuItemAvailabilityAction } from "@/app/actions/menu";
import { cn } from "@/lib/utils";

import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { useRestaurant } from "@/components/providers/staff-providers";

interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price_cents: number;
  is_available: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  items?: MenuItem[];
}

interface MenuManagerProps {
  restaurantId: string;
  categories: MenuCategory[];
}

export function MenuManager({ restaurantId, categories }: MenuManagerProps) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || "");
  const [isPending, startTransition] = useTransition();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);

  // New Category State
  const [newCatName, setNewCatName] = useState("");

  // New Item State
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  const handleAddCategory = () => {
    if (!newCatName) return;
    startTransition(async () => {
      try {
        await createMenuCategoryAction(restaurantId, newCatName);
        toast.success("Category added");
        setNewCatName("");
        setIsAddingCategory(false);
      } catch {
        toast.error("Failed to add category");
      }
    });
  };

  const handleAddItem = () => {
    if (!newItemName || !newItemPrice || !activeCategory) return;
    
    // Parse price to cents (e.g., 10.99 -> 1099)
    const priceCents = Math.round(parseFloat(newItemPrice) * 100);
    if (isNaN(priceCents)) {
      toast.error("Invalid price");
      return;
    }

    startTransition(async () => {
      try {
        await createMenuItemAction(activeCategory, newItemName, "", priceCents);
        toast.success("Menu item added");
        setNewItemName("");
        setNewItemPrice("");
        setIsAddingItem(false);
      } catch {
        toast.error("Failed to add item");
      }
    });
  };

  const handleToggleItem = (itemId: string, current: boolean) => {
    startTransition(async () => {
      try {
        await toggleMenuItemAvailabilityAction(itemId, !current);
        toast.success(current ? "Item marked out of stock" : "Item marked available");
      } catch {
        toast.error("Failed to update item");
      }
    });
  };

  const activeCategoryData = categories.find(c => c.id === activeCategory);
  const items = activeCategoryData?.items || [];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide border-b border-white/5 mb-6">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setIsAddingItem(false);
            }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              activeCategory === cat.id 
                ? "bg-brand text-zinc-950" 
                : "bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-white/5"
            )}
          >
            {cat.name}
          </button>
        ))}
        
        {isAddingCategory ? (
          <div className="flex items-center gap-2 ml-2 bg-zinc-900/50 p-1 rounded-full border border-brand/50">
            <Input 
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              placeholder="Category Name"
              className="h-8 w-40 bg-transparent border-0 focus-visible:ring-0 text-sm"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
            />
            <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full hover:bg-brand/20 text-brand" onClick={handleAddCategory} disabled={isPending}>
              {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
            </Button>
            <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full text-zinc-400 hover:text-zinc-200" onClick={() => setIsAddingCategory(false)}>
              ×
            </Button>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            className="rounded-full px-4 text-zinc-400 hover:text-zinc-200 border border-dashed border-zinc-700 ml-2"
            onClick={() => setIsAddingCategory(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Button>
        )}
      </div>

      {/* Main Content Area */}
      {categories.length === 0 && !isAddingCategory ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-zinc-900/20 rounded-2xl border border-white/5 border-dashed">
          <UtensilsCrossed className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-xl font-medium text-zinc-200">Your Menu is Empty</h3>
          <p className="text-zinc-400 max-w-sm mt-2 mb-6">Start by creating your first menu category, then you can add delicious items to it.</p>
          <Button onClick={() => setIsAddingCategory(true)} className="bg-brand text-zinc-950 hover:bg-brand/90">
            <Plus className="w-4 h-4 mr-2" /> Create First Category
          </Button>
        </div>
      ) : activeCategory ? (
        <div className="flex-1 overflow-y-auto pb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-zinc-100">{activeCategoryData?.name}</h2>
            <Button 
              onClick={() => setIsAddingItem(true)} 
              disabled={isAddingItem}
              className="bg-brand/10 text-brand hover:bg-brand/20"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isAddingItem && (
              <GlassCard className="p-4 border-brand/50 animate-in fade-in slide-in-from-top-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-400">Item Name</label>
                    <Input 
                      value={newItemName}
                      onChange={e => setNewItemName(e.target.value)}
                      placeholder="e.g. Avocado Toast"
                      className="h-8 mt-1 bg-zinc-900/50"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400">Price</label>
                    <Input 
                      value={newItemPrice}
                      onChange={e => setNewItemPrice(e.target.value)}
                      placeholder="12.99"
                      type="number"
                      step="0.01"
                      className="h-8 mt-1 bg-zinc-900/50"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1 bg-brand text-zinc-950 hover:bg-brand/90 h-8 text-sm"
                      onClick={handleAddItem}
                      disabled={isPending || !newItemName || !newItemPrice}
                    >
                      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="flex-1 h-8 text-sm text-zinc-400 hover:text-white"
                      onClick={() => setIsAddingItem(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </GlassCard>
            )}

            {items.map(item => (
              <GlassCard key={item.id} className={cn("p-4 flex flex-col justify-between transition-all", !item.is_available && "opacity-50")}>
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-zinc-200">{item.name}</h3>
                    <span className="font-medium text-brand bg-brand/10 px-2 py-0.5 rounded text-sm">
                      <CurrencyDisplay cents={item.price_cents} />
                    </span>
                  </div>
                  {item.description && <p className="text-sm text-zinc-500 mt-2 line-clamp-2">{item.description}</p>}
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className={cn("text-xs font-medium px-2 py-1 rounded-full", item.is_available ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-400")}>
                    {item.is_available ? "In Stock" : "Sold Out"}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs text-zinc-400 hover:text-white"
                    onClick={() => handleToggleItem(item.id, item.is_available)}
                    disabled={isPending}
                  >
                    {item.is_available ? "Mark Out of Stock" : "Mark In Stock"}
                  </Button>
                </div>
              </GlassCard>
            ))}

            {items.length === 0 && !isAddingItem && (
              <div className="col-span-full py-12 text-center text-zinc-500 border border-dashed border-white/5 rounded-xl bg-zinc-900/20">
                No items in this category yet.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
