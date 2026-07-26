"use client";

import React, { useState } from "react";
import { Shield, Search, Bell, User, LogOut } from "lucide-react";
import { api } from "@/lib/api";

export default function Navbar({ onSearch }: { onSearch?: (q: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <header className="h-16 border-b border-gray-800 bg-[#0f172a]/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-blue-500" />
        <span className="font-bold text-xl tracking-wider text-white">INVESTICORE</span>
        <span className="text-xs bg-blue-900/50 text-blue-400 border border-blue-700/50 px-2 py-0.5 rounded font-mono">
          ENTERPRISE v1.0
        </span>
      </div>

      <form onSubmit={handleSearchSubmit} className="relative w-96">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Global Search (IPs, Hashes, Domains, Cases...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
        />
      </form>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </button>

        <div className="flex items-center gap-2 pl-4 border-l border-gray-800">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
            INV
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 text-gray-400 hover:text-red-400 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
