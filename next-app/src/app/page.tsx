"use client";

import Header from "@/components/Header";
import GameTabs from "@/components/GameTabs";
import AuthModal from "@/components/AuthModal";
import ProductCard from "@/components/ProductCard";
import OrderForm from "@/components/OrderForm";
import { useState, useEffect } from "react";
import { getProductsByCategory, Product } from "@/lib/firestore-service";

export default function Home() {
  const [activeTab, setActiveTab] = useState("mlbb-dias");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState("all");
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await getProductsByCategory(activeTab);
      setProducts(data);
      setLoading(false);
      setSelectedProduct(null); // Reset selection when changing tabs
      setActiveSubTab("all");
    }
    loadProducts();
  }, [activeTab]);

  return (
    <>
      <AuthModal />
      <Header />
      <GameTabs />

      <main className="p-3.5 max-w-[650px] mx-auto w-full pb-20">
        
        {/* Codashop-style Hero Section */}
        <div className="mb-6 mt-2 rounded-2xl overflow-hidden relative shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-navy-500/95 via-navy-500/70 to-transparent z-10"></div>
          <div className="h-40 sm:h-48 bg-gradient-to-r from-brand to-purple-600 w-full object-cover relative">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
          </div>
          
          <div className="absolute inset-0 z-20 flex flex-col justify-center p-6 sm:p-8">
            <h2 className="font-rajdhani text-2xl sm:text-3xl font-bold text-white tracking-wide uppercase drop-shadow-lg mb-2 flex items-center gap-2">
              <span className="text-brand">⚡</span> Mobile Legends
            </h2>
            <p className="text-xs sm:text-sm text-gray-200 max-w-[280px] sm:max-w-[340px] leading-relaxed drop-shadow-md">
              Top up MLBB Diamonds in seconds! Just enter your MLBB user ID, select the value of Diamonds you wish to purchase, complete the payment, and your top-up will be processed immediately.
            </p>
          </div>
        </div>

        {/* MLBB Content */}
        <div className="my-3">
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            <button onClick={() => setActiveTab("mlbb-promos")} className={`px-3 py-1.5 rounded-full border text-xs transition-all whitespace-nowrap ${activeTab === "mlbb-promos" ? "bg-red-600 border-red-600 text-white font-semibold" : "border-red-500/35 bg-red-500/10 text-red-400 hover:border-red-400"}`}>🔥 Promos</button>
            <button onClick={() => setActiveTab("mlbb-dias")} className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all whitespace-nowrap ${activeTab === "mlbb-dias" ? "bg-brand border-brand text-white font-semibold" : "border-navy-100 bg-navy-300 text-tx-muted hover:border-brand hover:text-tx-main"}`}>💎 Diamonds</button>
            <button onClick={() => setActiveTab("mlbb-starlight")} className={`px-3 py-1.5 rounded-full border text-xs transition-all whitespace-nowrap ${activeTab === "mlbb-starlight" ? "bg-amber-600 border-amber-600 text-white font-semibold" : "border-amber-400/30 bg-amber-400/10 text-amber-400 hover:border-amber-400"}`}>⭐ Starlight</button>
          </div>
        </div>

        {activeTab === "mlbb-promos" && !loading && products.length > 0 && (
          <div className="mb-4 overflow-x-auto pb-1 scrollbar-hide">
            <div className="flex gap-2 w-max">
              <button 
                onClick={() => setActiveSubTab("all")} 
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${activeSubTab === "all" ? "bg-white text-navy-500" : "bg-navy-300 text-tx-muted hover:bg-navy-200"}`}
              >
                All
              </button>
              {Array.from(new Set(products.map(p => p.subCategory).filter(Boolean))).map((sub) => {
                let label = sub as string;
                if (label === 'dd') label = 'Daily Diamonds';
                else if (label === 'skinsc' || label === 'skinsd') label = 'Skins';
                else if (label === 'dias-indo' || label === 'dias-global') label = 'Global Dias';
                else label = label.charAt(0).toUpperCase() + label.slice(1);
                
                return (
                  <button 
                    key={sub}
                    onClick={() => setActiveSubTab(sub as string)} 
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${activeSubTab === sub ? "bg-white text-navy-500" : "bg-navy-300 text-tx-muted hover:bg-navy-200"}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <div className="font-rajdhani text-[0.7rem] font-semibold tracking-[2px] uppercase text-tx-muted border-l-[3px] border-brand pl-2 mb-2.5 mt-1.5">
            {activeTab === "mlbb-dias" ? "Direct Top-Up (PH Server)" : activeTab === "mlbb-promos" ? "Special Promos" : "Starlight & Memberships"}
          </div>
          
          {loading ? (
            <div className="text-center text-tx-muted text-sm py-10 animate-pulse">Loading products...</div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-4">
              {(activeSubTab === "all" ? products : products.filter(p => p.subCategory === activeSubTab)).map((p) => (
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
              No products available right now for <span className="font-bold">{activeTab}</span>.
            </div>
          )}
        </div>

        {/* Order Form pops up at the bottom when a product is selected */}
        {selectedProduct && (
          <OrderForm 
            gameId="mlbb"
            gameLabel="Mobile Legends"
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}

      </main>
    </>
  );
}
