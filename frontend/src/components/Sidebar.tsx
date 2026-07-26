"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, FileSearch, ShieldAlert, Cpu, Share2, FileText, Settings, Layers } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Investigations", href: "/cases", icon: Briefcase },
    { name: "Evidence Vault", href: "/evidence", icon: FileSearch },
    { name: "Threat Intel & Map", href: "/threat-intel", icon: ShieldAlert },
    { name: "Attack Timeline", href: "/timeline", icon: Settings },
    { name: "IOC Graph", href: "/graph", icon: Share2 },
    { name: "AI Assistant", href: "/ai-assistant", icon: Cpu },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "System Architecture", href: "/pitch", icon: Layers },
  ];

  return (
    <aside className="w-64 border-r border-gray-800 bg-[#0f172a]/60 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Platform Modules
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-gray-400"}`} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-3 border border-gray-800 rounded-lg bg-gray-900/50 text-xs text-gray-400 space-y-1">
        <div className="font-semibold text-gray-300">Active Node Status</div>
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          FastAPI & DB Connected
        </div>
      </div>
    </aside>
  );
}
