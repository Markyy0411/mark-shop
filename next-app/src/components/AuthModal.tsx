"use client";

import { useAuth } from "@/context/AuthContext";

export default function AuthModal() {
  const { user, isGuest, loginWithGoogle, loginAsGuest, loading } = useAuth();

  if (loading || user || isGuest) return null;

  return (
    <div className="fixed inset-0 bg-navy-500/95 z-[9999] flex items-center justify-center p-5 backdrop-blur-md">
      <div className="bg-navy-400 border border-brand/25 rounded-3xl p-8 w-full max-w-[400px] text-center shadow-[0_0_40px_rgba(249,115,22,0.15)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="font-rajdhani text-4xl font-bold text-brand tracking-[4px] mb-2 drop-shadow-md">⚡ MARK'S SHOP</div>
          <div className="text-sm text-tx-muted mb-8 font-medium">Affordable Top-Ups · Fast Delivery</div>
          
          <button 
            onClick={loginWithGoogle}
            className="w-full bg-white text-black p-3.5 rounded-xl font-bold border border-gray-300 cursor-pointer flex items-center justify-center gap-3 hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
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
          
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <span className="text-[0.65rem] text-tx-muted flex items-center gap-1.5"><span className="text-brand">🔒</span> Secure</span>
            <span className="text-[0.65rem] text-tx-muted flex items-center gap-1.5"><span className="text-brand">💬</span> 24/7 Support</span>
            <span className="text-[0.65rem] text-tx-muted flex items-center gap-1.5"><span className="text-brand">⚡</span> Instant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
