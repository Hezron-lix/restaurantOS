"use client";

import { useEffect, useRef } from "react";
import { Search, Command } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

// Mock command categories for the UI shell
const MOCK_CATEGORIES = [
  {
    name: "Orders",
    commands: [
      { id: "new-order", label: "Create New Order", shortcut: "N" },
      { id: "active-orders", label: "View Active Orders" },
    ],
  },
  {
    name: "Kitchen",
    commands: [
      { id: "view-kds", label: "Open Kitchen Display" },
      { id: "86-item", label: "86 an Item (Out of Stock)" },
    ],
  },
  {
    name: "Quick Actions",
    commands: [
      { id: "switch-restaurant", label: "Switch Restaurant Location" },
      { id: "theme-toggle", label: "Toggle Dark/Light Mode" },
    ],
  },
];

export function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const inputRef = useRef<HTMLInputElement>(null);

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

  if (!isCommandPaletteOpen) return null;

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
            className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted text-base"
            placeholder="Search commands, orders, or tables..."
          />
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/5 border border-white/10 rounded text-text-muted">ESC</kbd>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {MOCK_CATEGORIES.map((category) => (
            <div key={category.name} className="mb-4 last:mb-0">
              <h4 className="px-3 py-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                {category.name}
              </h4>
              <div className="flex flex-col gap-0.5">
                {category.commands.map((cmd) => (
                  <button
                    key={cmd.id}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm text-left transition-colors",
                      "hover:bg-brand/10 hover:text-brand text-text-secondary group"
                    )}
                    onClick={() => setCommandPaletteOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <Command className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                      <span className="font-medium">{cmd.label}</span>
                    </div>
                    {cmd.shortcut && (
                      <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white/5 border border-white/10 rounded text-text-muted">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                ))}
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
