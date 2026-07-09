"use client";

import { useAuth } from "@/context/AuthContext";
import { Mail, Phone, ShieldCheck, Zap, Clock } from "lucide-react";

export default function AuthModal() {
  const { user, isGuest, loginWithGoogle, loginAsGuest, loading } = useAuth();

  if (loading || user || isGuest) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-navy-500 via-navy-400 to-navy-500 z-[9999] flex flex-col overflow-y-auto">
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* HEADER: Logo & Login Buttons */}
      <header className="relative z-20 w-full flex justify-between items-center p-6 md:px-12">
        <div className="font-rajdhani text-2xl md:text-3xl font-bold text-brand tracking-wide uppercase drop-shadow-lg">
          ⚡ Mark&apos;s Game Shop
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={loginAsGuest}
            className="text-sm font-semibold text-tx-muted hover:text-white transition-colors"
          >
            Continue as Guest
          </button>
          
          <button 
            onClick={loginWithGoogle}
            className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm border border-gray-300 cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-100 transition shadow-lg transform hover:-translate-y-0.5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
            Sign in
          </button>
        </div>
      </header>

      {/* MAIN CONTENT: Centered Pitch */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-8 max-w-[800px] mx-auto w-full mt-[-5vh]">
        <h1 className="font-rajdhani text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-wide uppercase drop-shadow-xl mb-6">
          Premium Game Top-Ups
        </h1>
        
        <p className="text-lg md:text-xl text-tx-muted leading-relaxed mb-10 max-w-[600px]">
          Tired of slow processing times and unverified sellers? Welcome to the most trusted, lightning-fast platform in the Philippines. We process orders instantly so you can get back to the game.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
          <div className="bg-navy-400/50 backdrop-blur-sm p-6 rounded-2xl border border-navy-300 text-center shadow-lg">
            <Zap className="text-amber-400 mb-3 mx-auto" size={32} />
            <h4 className="font-bold text-md text-white mb-2">Instant Delivery</h4>
            <p className="text-sm text-tx-muted">Receive your diamonds in seconds.</p>
          </div>
          <div className="bg-navy-400/50 backdrop-blur-sm p-6 rounded-2xl border border-navy-300 text-center shadow-lg">
            <ShieldCheck className="text-green-400 mb-3 mx-auto" size={32} />
            <h4 className="font-bold text-md text-white mb-2">100% Legal</h4>
            <p className="text-sm text-tx-muted">No bans, pure official currency.</p>
          </div>
          <div className="bg-navy-400/50 backdrop-blur-sm p-6 rounded-2xl border border-navy-300 text-center shadow-lg">
            <Clock className="text-blue-400 mb-3 mx-auto" size={32} />
            <h4 className="font-bold text-md text-white mb-2">24/7 Support</h4>
            <p className="text-sm text-tx-muted">We are always online to help.</p>
          </div>
        </div>
      </main>

      {/* FOOTER: Contact Info */}
      <footer className="relative z-10 w-full p-6 text-center border-t border-navy-300/50 mt-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-sm text-tx-muted">
            <Mail size={16} className="text-brand" /> marcangelguevarra@gmail.com
          </div>
          <div className="flex items-center gap-2 text-sm text-tx-muted">
            <Phone size={16} className="text-brand" /> +63 928 897 8005
          </div>
        </div>
      </footer>

    </div>
  );
}
