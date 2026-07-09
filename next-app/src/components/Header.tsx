"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { LogOut, Search, User as UserIcon, Moon, Sun, AlertTriangle, ShieldAlert } from "lucide-react";
import TrackOrderModal from "./TrackOrderModal";
import Link from "next/link";

export default function Header() {
  const { user, userData, isGuest, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutInput, setLogoutInput] = useState("");
  const [showTrackOrder, setShowTrackOrder] = useState(false);

  const handleConfirmLogout = () => {
    if (logoutInput.toLowerCase() === "logout") {
      logout();
      setShowLogoutConfirm(false);
      setLogoutInput("");
    }
  };

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
            {user.email === "marcangelguevarra@gmail.com" && (
              <Link 
                href="/admin"
                className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-full px-3 py-1 text-[0.7rem] font-semibold hover:bg-purple-500/20 transition-colors"
              >
                <ShieldAlert size={12} /> Admin
              </Link>
            )}
            <button 
              onClick={() => setShowLogoutConfirm(true)}
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

        <button 
          onClick={() => setShowTrackOrder(true)}
          className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full px-3 py-1 text-[0.7rem] font-semibold text-blue-400 hover:bg-blue-500/20 transition-colors"
        >
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

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-navy-500/90 z-[9999] flex items-center justify-center p-5 backdrop-blur-sm">
          <div className="bg-navy-400 border border-red-500/30 rounded-2xl p-6 w-full max-w-[320px] text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500 to-red-500/0"></div>
            
            <div className="flex justify-center mb-4">
              <div className="bg-red-500/10 p-3 rounded-full">
                <AlertTriangle className="text-red-500" size={32} />
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-tx-main mb-2">Confirm Logout</h3>
            <p className="text-sm text-tx-muted mb-4">
              Please type <span className="font-bold text-red-400 select-none">logout</span> below to confirm.
            </p>
            
            <input 
              type="text" 
              value={logoutInput}
              onChange={(e) => setLogoutInput(e.target.value)}
              placeholder="Type logout here"
              className="w-full bg-navy-500 border border-navy-300 rounded-lg p-2.5 text-center text-tx-main outline-none focus:border-red-500/50 transition-colors mb-4"
              autoFocus
            />
            
            <div className="flex gap-3">
              <button 
                onClick={() => { setShowLogoutConfirm(false); setLogoutInput(""); }}
                className="flex-1 bg-navy-300 text-tx-main py-2 rounded-lg font-semibold text-sm hover:bg-navy-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmLogout}
                disabled={logoutInput.toLowerCase() !== "logout"}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRACK ORDER MODAL */}
      {showTrackOrder && (
        <TrackOrderModal onClose={() => setShowTrackOrder(false)} />
      )}
    </header>
  );
}
