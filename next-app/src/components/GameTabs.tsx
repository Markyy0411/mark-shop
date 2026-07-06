"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { id: "mlbb", label: "MLBB", icon: "⚔️", href: "/" },
  { id: "cod", label: "Garena CoD", icon: "🎖️", href: "/cod" },
  { id: "roblox", label: "Roblox", icon: "🧱", href: "/roblox" },
  { id: "bs", label: "Bloodstrike", icon: "🩸", href: "/bs" },
  { id: "load", label: "Load", icon: "📶", href: "/load" },
  { id: "custom", label: "Custom Order", icon: "🛎️", href: "/custom", customClass: "text-purple-400 border-purple-400/20 hover:bg-purple-400/5 hover:border-purple-400/40" },
];

export default function GameTabs() {
  const pathname = usePathname();

  return (
    <div className="flex overflow-x-auto gap-0.5 px-2.5 pt-2.5 bg-navy-400 border-b border-navy-300 no-scrollbar">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href || (pathname === "/" && tab.id === "mlbb");
        
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`flex-shrink-0 px-3 py-2 border-t border-l border-r border-navy-300 rounded-t-lg font-rajdhani font-semibold text-[0.82rem] tracking-wide flex items-center gap-1.5 transition-all
              ${tab.customClass || "text-tx-muted hover:text-tx-main hover:bg-navy-200"}
              ${isActive ? (tab.id === "custom" ? "bg-navy-500 border-purple-400/60 !border-b-navy-500" : "bg-navy-500 text-brand border-brand/50 !border-b-navy-500") : "bg-navy-300"}
            `}
            style={{ marginBottom: "-1px" }}
          >
            <span>{tab.icon}</span> {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
