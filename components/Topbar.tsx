"use client";

import { Bell, Menu, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-16 sticky top-0 z-20 bg-[rgb(var(--bg-elev))]/80 backdrop-blur border-b border-[rgb(var(--border))] flex items-center px-4 lg:px-6 gap-3">
      <button onClick={onMenuClick} className="btn-ghost !p-2 lg:hidden">
        <Menu size={18} />
      </button>

      <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
        <div className="relative w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]"
          />
          <input
            className="input pl-9"
            placeholder="Search tasks, agents, outputs…"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="btn-ghost !p-2 relative">
          <Bell size={16} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
        </button>
        <ThemeToggle />
        <div className="h-9 w-9 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-semibold">
          HZ
        </div>
      </div>
    </header>
  );
}
