"use client";

import { useAuth } from "@/context/AuthContext";
import { Mail, Phone, ShieldCheck, Zap, Clock } from "lucide-react";

export default function AuthModal() {
  const { user, isGuest, loginWithGoogle, loginAsGuest, loading } = useAuth();

  if (loading || user || isGuest) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-navy-500 via-navy-400 to-navy-500 z-[9999] flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
      
      {/* LEFT SIDE: The Pitch / Introduction */}
      <div className="relative w-full md:w-[60%] flex flex-col justify-center p-8 md:p-16 lg:p-24 text-tx-main">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-[600px] mx-auto w-full">
          <h1 className="font-rajdhani text-4xl md:text-5xl lg:text-6xl font-bold text-brand tracking-wide uppercase drop-shadow-lg mb-6">
            ⚡ Mark&apos;s Game Shop
          </h1>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-tx-main mb-2">Tired of getting scammed?</h3>
              <p className="text-tx-muted leading-relaxed">
                Gamers lose thousands of pesos every day to fake sellers, unverified top-up centers, and painfully slow processing times that ruin the gaming experience.
              </p>
            </div>
            
            <div className="border-l-4 border-brand pl-4 py-1">
              <h3 className="text-xl font-semibold text-white mb-2">We are the solution.</h3>
              <p className="text-gray-300 leading-relaxed">
                Welcome to the most trusted, lightning-fast game top-up platform in the Philippines. We process orders instantly so you can get back to the game.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            <div className="bg-navy-300/30 p-4 rounded-xl border border-navy-300">
              <Zap className="text-amber-400 mb-2" size={24} />
              <h4 className="font-bold text-sm text-tx-main mb-1">Instant Delivery</h4>
              <p className="text-xs text-tx-muted">Receive your diamonds in seconds.</p>
            </div>
            <div className="bg-navy-300/30 p-4 rounded-xl border border-navy-300">
              <ShieldCheck className="text-green-400 mb-2" size={24} />
              <h4 className="font-bold text-sm text-tx-main mb-1">100% Legal</h4>
              <p className="text-xs text-tx-muted">No bans, pure official currency.</p>
            </div>
            <div className="bg-navy-300/30 p-4 rounded-xl border border-navy-300">
              <Clock className="text-blue-400 mb-2" size={24} />
              <h4 className="font-bold text-sm text-tx-main mb-1">24/7 Support</h4>
              <p className="text-xs text-tx-muted">We are always online to help.</p>
            </div>
          </div>

          <div className="mt-12 bg-navy-500 p-5 rounded-2xl border border-brand/20 shadow-lg">
            <h4 className="text-sm font-semibold text-tx-muted mb-3 uppercase tracking-wider">Contact Us</h4>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2.5 text-sm font-medium text-tx-main">
                <div className="bg-brand/20 p-2 rounded-lg text-brand"><Mail size={16} /></div>
                marcangelguevarra@gmail.com
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-tx-main">
                <div className="bg-brand/20 p-2 rounded-lg text-brand"><Phone size={16} /></div>
                +63 928 897 8005
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: The Login Box */}
      <div className="w-full md:w-[40%] flex items-center justify-center p-8 md:pr-16 lg:pr-24">
        <div className="w-full max-w-[380px] bg-navy-400/80 backdrop-blur-md border border-brand/20 rounded-3xl p-10 text-center shadow-[0_0_40px_rgba(249,115,22,0.15)] relative">
          <div className="mb-8">
            <h2 className="text-2xl font-bold font-rajdhani text-tx-main tracking-widest uppercase drop-shadow-md mb-2">
              Sign In
            </h2>
            <div className="text-sm text-tx-muted font-medium">To securely track your orders</div>
          </div>
          
          <button 
            onClick={loginWithGoogle}
            className="w-full bg-white text-black p-3.5 rounded-xl font-bold border border-gray-300 cursor-pointer flex items-center justify-center gap-3 hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-navy-300"></div>
            <span className="px-3 text-xs text-tx-muted uppercase tracking-wider font-semibold">OR</span>
            <div className="flex-1 border-t border-navy-300"></div>
          </div>
          
          <button 
            onClick={loginAsGuest}
            className="w-full bg-navy-300 text-tx-main p-3.5 rounded-xl font-bold border border-navy-100 cursor-pointer flex items-center justify-center gap-2 hover:bg-navy-200 transition hover:border-brand/50"
          >
            👤 Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
