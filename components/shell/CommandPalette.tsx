"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Search, Command, Map, UtensilsCrossed, Users, Sparkles, LayoutDashboard, Settings } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useRestaurant } from "@/components/providers/staff-providers";
import { getSearchData } from "@/app/actions/search";

// Static Pages
const PAGES = [
  { id: "page-dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: "page-orders", label: "Orders", href: "/orders", icon: Command },
  { id: "page-kitchen", label: "Kitchen", href: "/kitchen", icon: UtensilsCrossed },
  { id: "page-tables", label: "Tables", href: "/tables", icon: Map },
  { id: "page-reservations", label: "Reservations", href: "/reservations", icon: Command },
  { id: "page-menu", label: "Menu", href: "/menu", icon: UtensilsCrossed },
  { id: "page-staff", label: "Staff", href: "/staff", icon: Users },
  { id: "page-analytics", label: "Analytics", href: "/analytics", icon: Command },
  { id: "page-ai", label: "Restaurant Copilot", href: "/ai", icon: Sparkles },
  { id: "page-settings", label: "Settings", href: "/settings", icon: Settings },
];

type SearchItem = {
  id: string;
  label: string;
  href: string;
  type: string;
  icon: any;
  category: string;
};

export function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const { restaurant } = useRestaurant();
  const router = useRouter();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const [tables, setTables] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);

  // Fetch search data on open
  useEffect(() => {
    if (isCommandPaletteOpen && restaurant?.id) {
      getSearchData(restaurant.id).then((data) => {
        setTables(data.tables);
        setMenuItems(data.menuItems);
        setStaff(data.staff);
      });
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen, restaurant?.id]);

  // Handle global Cmd+K to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  // Focus input on open
  useEffect(() => {
    if (isCommandPaletteOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Filter results
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return PAGES.map(p => ({ ...p, type: 'page', category: 'Navigation' })) as SearchItem[];
    }

    const filtered: SearchItem[] = [];
    
    // 1. Pages
    const matchedPages = PAGES.filter(p => p.label.toLowerCase().includes(q));
    matchedPages.forEach(p => filtered.push({ ...p, type: 'page', category: 'Navigation' }));
    
    // 2. Tables
    const matchedTables = tables.filter(t => `table ${t.table_number}`.toLowerCase().includes(q) || t.table_number.toString().includes(q));
    matchedTables.forEach(t => filtered.push({ id: `table-${t.id}`, label: `Table ${t.table_number}`, href: '/tables', type: 'table', icon: Map, category: 'Tables' }));

    // 3. Menu Items
    const matchedMenu = menuItems.filter(m => m.name.toLowerCase().includes(q));
    matchedMenu.forEach(m => filtered.push({ id: `menu-${m.id}`, label: m.name, href: '/menu', type: 'menu', icon: UtensilsCrossed, category: 'Menu' }));

    // 4. Staff
    const matchedStaff = staff.filter(s => s.full_name?.toLowerCase().includes(q) || s.role?.toLowerCase().includes(q));
    matchedStaff.forEach(s => filtered.push({ id: `staff-${s.id}`, label: s.full_name, href: '/staff', type: 'staff', icon: Users, category: 'Staff' }));

    // 5. Fallback if no exact entity matches or if it feels like a question
    if (filtered.length === 0 || q.includes('how') || q.includes('what') || q.includes('?')) {
      filtered.push({
        id: 'ask-copilot',
        label: `"${query}"`,
        href: `/ai?q=${encodeURIComponent(query)}`,
        type: 'copilot',
        icon: Sparkles,
        category: 'Ask Restaurant Copilot'
      });
    }

    return filtered;
  }, [query, tables, menuItems, staff]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length]);

  // Handle Keyboard Navigation
  useEffect(() => {
    if (!isCommandPaletteOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, results, selectedIndex]);
  
  // Scroll selected item into view
  useEffect(() => {
    if (scrollRef.current) {
      const selectedEl = scrollRef.current.querySelector('[data-selected="true"]');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (item: SearchItem) => {
    setCommandPaletteOpen(false);
    router.push(item.href);
  };

  if (!isCommandPaletteOpen) return null;

  // Group by category for rendering
  const groupedResults = results.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SearchItem[]>);

  let renderIndex = 0;

  return (
    <>
      <div 
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setCommandPaletteOpen(false)}
      />
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[101] w-[90vw] max-w-2xl bg-zinc-950 border border-border/60 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 py-3 border-b border-border/50 bg-zinc-900/50">
          <Search className="w-5 h-5 text-text-muted mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted text-base"
            placeholder="Search RestaurantOS or ask Restaurant Copilot..."
          />
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/5 border border-white/10 rounded text-text-muted">ESC</kbd>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2" ref={scrollRef}>
          {Object.keys(groupedResults).map((category) => (
            <div key={category} className="mb-4 last:mb-0">
              <h4 className="px-3 py-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                {category}
              </h4>
              <div className="flex flex-col gap-0.5">
                {groupedResults[category].map((item) => {
                  const isSelected = renderIndex === selectedIndex;
                  const currentIndex = renderIndex++;
                  
                  const Icon = item.icon;
                  
                  return (
                    <button
                      key={item.id}
                      data-selected={isSelected}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm text-left transition-colors",
                        isSelected ? "bg-brand/10 text-brand" : "text-text-secondary hover:bg-brand/5"
                      )}
                      onClick={() => handleSelect(item)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn("w-4 h-4", isSelected ? "text-brand" : "opacity-50")} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.type === 'copilot' && (
                        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-brand/20 text-brand rounded">
                          Enter to Ask
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-2 border-t border-border/50 bg-zinc-900/30 flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-white/5 rounded">↑</kbd>
            <kbd className="px-1 py-0.5 bg-white/5 rounded">↓</kbd>
            to navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-white/5 rounded">↵</kbd>
            to select
          </span>
        </div>
      </div>
    </>
  );
}
