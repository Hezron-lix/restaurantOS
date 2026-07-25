"use client";

import { useState, useTransition } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ArrowLeft, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { submitOrderAction } from "@/app/actions/orders";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  price_cents: number;
}

interface OrderItem {
  menu_item_id: string;
  name: string;
  price_cents: number;
  quantity: number;
}

interface PosInterfaceProps {
  tableId: string;
  tableNumber: number;
  orderId: string;
  categories: Category[];
  menuItems: MenuItem[];
}

export function PosInterface({ tableId, tableNumber, orderId, categories, menuItems }: PosInterfaceProps) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || "");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isPending, startTransition] = useTransition();

  const filteredItems = menuItems.filter(item => item.category_id === activeCategory);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menu_item_id === item.id);
      if (existing) {
        return prev.map(i => i.menu_item_id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menu_item_id: item.id, name: item.name, price_cents: item.price_cents, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.menu_item_id === itemId) {
        const newQ = i.quantity + delta;
        return { ...i, quantity: Math.max(0, newQ) };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price_cents * item.quantity), 0);
  const tax = 0; // Keeping simple for demo
  const total = subtotal + tax;

  const handleSendToKitchen = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    
    startTransition(async () => {
      try {
        await submitOrderAction(tableId, orderId, cart, total);
        toast.success("Order sent to kitchen");
      } catch {
        toast.error("Failed to submit order");
      }
    });
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] -mx-6 md:-mx-8">
      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/5 bg-zinc-950/50">
        <div className="flex items-center gap-4">
          <Link href="/tables">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-zinc-100">Table {tableNumber}</h1>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Menu Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto px-6 md:px-8 py-4 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  activeCategory === cat.id 
                    ? "bg-brand text-zinc-950" 
                    : "bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map(item => (
                <GlassCard 
                  key={item.id} 
                  onClick={() => addToCart(item)}
                  className="p-4 cursor-pointer hover:bg-white/5 hover:border-brand/30 transition-all active:scale-95 flex flex-col justify-between min-h-[120px]"
                >
                  <p className="font-medium text-zinc-200 line-clamp-2">{item.name}</p>
                  <p className="text-brand font-semibold mt-2">{formatPrice(item.price_cents)}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* Ticket Section */}
        <div className="w-80 md:w-96 border-l border-white/5 bg-zinc-950/30 flex flex-col">
          <div className="p-4 border-b border-white/5 bg-zinc-900/20">
            <h2 className="font-semibold text-zinc-100">Current Order</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                Select items to add to order
              </div>
            ) : (
              cart.map(item => (
                <div key={item.menu_item_id} className="flex flex-col gap-2 p-3 bg-zinc-900/50 rounded-lg border border-white/5">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-zinc-200 text-sm flex-1">{item.name}</span>
                    <span className="text-zinc-400 text-sm ml-2">{formatPrice(item.price_cents * item.quantity)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-3 bg-zinc-950 rounded-lg border border-white/5 p-1">
                      <button onClick={() => updateQuantity(item.menu_item_id, -1)} className="w-6 h-6 flex items-center justify-center rounded bg-zinc-800 text-zinc-400 hover:text-white">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.menu_item_id, 1)} className="w-6 h-6 flex items-center justify-center rounded bg-zinc-800 text-zinc-400 hover:text-white">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-white/5 bg-zinc-900/30">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-zinc-400 text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-sm">
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-zinc-100 font-bold text-lg pt-2 border-t border-white/5">
                <span>Total</span>
                <span className="text-brand">{formatPrice(total)}</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-brand text-zinc-950 hover:bg-brand/90 py-6 text-lg"
              disabled={cart.length === 0 || isPending}
              onClick={handleSendToKitchen}
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
              Send to Kitchen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
