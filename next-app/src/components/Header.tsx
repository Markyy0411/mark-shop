"use client";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { LogOut, Search, User as UserIcon, Moon, Sun } from "lucide-react";

export default function Header() {
  const { user, userData, isGuest, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-navy-400/80 backdrop-blur-md border-b border-brand/25 p-3 text-center shadow-sm transition-colors duration-300">
      <h1 className="font-rajdhani text-2xl font-bold text-brand tracking-[3px] uppercase drop-shadow-sm">
        ⚡ Mark&apos;s Game Shop
      </h1>
      <p className="text-xs text-tx-muted mt-1 font-medium">The fastest & cheapest top-up center in the PH</p>
      
      <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
        <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1 text-[0.7rem] font-semibold text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
          Online
        </div>

        {user && userData ? (
          <>
            <div className="inline-flex items-center gap-1.5 bg-brand/10 border border-brand/30 rounded-full px-3 py-1 text-[0.7rem] font-semibold text-brand">
              <UserIcon size={12} /> {userData.username}
            </div>
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1 text-[0.7rem] font-semibold text-amber-400">
              🪙 {userData.markcoins} MarkCoins
            </div>
            <button 
              onClick={logout}
              className="inline-flex items-center gap-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold hover:bg-red-500/20 transition-colors"
            >
              <LogOut size={12} /> Logout
            </button>
          </>
        ) : isGuest ? (
          <>
            <div className="inline-flex items-center gap-1.5 bg-navy-200 border border-navy-100 rounded-full px-3 py-1 text-[0.7rem] font-semibold text-tx-main">
              <UserIcon size={12} /> Guest
            </div>
            <button 
              onClick={logout}
              className="inline-flex items-center gap-1 bg-brand/10 border border-brand/30 text-brand rounded-full px-3 py-1 text-[0.7rem] font-semibold hover:bg-brand/20 transition-colors"
            >
              <LogOut size={12} /> Sign In
            </button>
          </>
        ) : null}

        <button className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full px-3 py-1 text-[0.7rem] font-semibold text-blue-400 hover:bg-blue-500/20 transition-colors">
          <Search size={12} /> Track Order
        </button>

        <button 
          onClick={toggleTheme}
          className="ml-2 p-1.5 rounded-full bg-navy-300/30 hover:bg-navy-300/50 text-tx-main transition-colors border border-navy-300/30 flex items-center justify-center"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </header>
  );
}
