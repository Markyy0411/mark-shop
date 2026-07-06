"use client";

import Header from "@/components/Header";
import GameTabs from "@/components/GameTabs";
import AuthModal from "@/components/AuthModal";
import ProductCard from "@/components/ProductCard";
import OrderForm from "@/components/OrderForm";
import { useState, useEffect, use } from "react";
import { getProductsByCategory, Product } from "@/lib/firestore-service";

const GAME_INFO: Record<string, { label: string, desc: string, icon: string, bg: string }> = {
  cod: { 
    label: "Garena Call of Duty", 
    desc: "Top up Garena Shells or CP instantly! Enter your CoD Player ID, select the value, and pay seamlessly.",
    icon: "🎖️",
    bg: "from-orange-500 to-red-600"
  },
  roblox: { 
    label: "Roblox", 
    desc: "Get Robux in seconds! Enter your Roblox username, select your Robux package, and check out.",
    icon: "🧱",
    bg: "from-gray-600 to-gray-800"
  },
  bs: { 
    label: "Bloodstrike", 
    desc: "Top up Bloodstrike Gold instantly. Enter your User ID to proceed.",
    icon: "🩸",
    bg: "from-red-600 to-red-900"
  },
  load: { 
    label: "E-Load", 
    desc: "Buy regular load or promos for all networks (Globe, Smart, TM, TNT, DITO).",
    icon: "📶",
    bg: "from-blue-500 to-indigo-600"
  }
};

export default function GamePage({ params }: { params: Promise<{ game: string }> }) {
  const resolvedParams = use(params);
  const game = resolvedParams.game;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const info = GAME_INFO[game] || { label: game, desc: `Top up for ${game}`, icon: "🎮", bg: "from-brand to-purple-600" };

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await getProductsByCategory(`${game}-main`);
      setProducts(data);
      setLoading(false);
      setSelectedProduct(null);
    }
    loadProducts();
  }, [game]);

  return (
    <>
      <AuthModal />
      <Header />
      <GameTabs />

      <main className="p-3.5 max-w-[650px] mx-auto w-full pb-20">
        
        {/* Hero Section */}
        <div className="mb-6 mt-2 rounded-2xl overflow-hidden relative shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-navy-500/95 via-navy-500/70 to-transparent z-10"></div>
          <div className={`h-40 sm:h-48 bg-gradient-to-r w-full object-cover relative ${info.bg}`}>
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
          </div>
          
          <div className="absolute inset-0 z-20 flex flex-col justify-center p-6 sm:p-8">
            <h2 className="font-rajdhani text-2xl sm:text-3xl font-bold text-white tracking-wide uppercase drop-shadow-lg mb-2 flex items-center gap-2">
              <span>{info.icon}</span> {info.label}
            </h2>
            <p className="text-xs sm:text-sm text-gray-200 max-w-[280px] sm:max-w-[340px] leading-relaxed drop-shadow-md">
              {info.desc}
            </p>
          </div>
        </div>

        <div>
          <div className="font-rajdhani text-[0.7rem] font-semibold tracking-[2px] uppercase text-tx-muted border-l-[3px] border-brand pl-2 mb-2.5 mt-1.5">
            Select Product
          </div>
          
          {loading ? (
            <div className="text-center text-tx-muted text-sm py-10 animate-pulse">Loading products...</div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {products.map((p) => (
                <ProductCard 
                  key={p.id} 
                  name={p.name} 
                  desc={p.desc} 
                  price={p.price} 
                  selected={selectedProduct?.id === p.id}
                  onClick={() => setSelectedProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-tx-muted text-sm py-10 border border-dashed border-navy-300 rounded-xl bg-navy-400/50">
              No products available right now for <span className="font-bold">{info.label}</span>.
            </div>
          )}
        </div>

        {selectedProduct && (
          <OrderForm 
            gameId={game}
            gameLabel={info.label}
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}

      </main>
    </>
  );
}
