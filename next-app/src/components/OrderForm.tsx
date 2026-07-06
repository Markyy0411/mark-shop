"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { submitOrder } from "@/lib/firestore-service";

interface ReceiptData {
  txnId: string;
  game: string;
  productName: string;
  price: string;
  playerId: string;
  zoneId?: string;
  ign: string;
  paymentMethod: string;
}

interface OrderFormProps {
  gameId: string;
  gameLabel: string;
  product: { id: string; name: string; price: string } | null;
  onClose: () => void;
}

export default function OrderForm({ gameId, gameLabel, product, onClose }: OrderFormProps) {
  const { user, userData, isGuest } = useAuth();
  
  const [playerId, setPlayerId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  
  const [ign, setIgn] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [manualIgn, setManualIgn] = useState("");

  const formRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to form when a product is selected
  useEffect(() => {
    if (product && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [product]);

  if (!product) return null;

  const isMLBB = gameId === "mlbb";
  const isCoD = gameId === "cod";
  const isRoblox = gameId === "roblox";
  const needsVerification = isMLBB || isCoD || isRoblox;

  const verifyPlayer = async () => {
    if (!playerId || (isMLBB && !zoneId)) {
      setError(`Please enter all required ${gameLabel} details.`);
      return;
    }
    
    setError(null);
    setVerifying(true);
    setIgn(null);

    try {
      let url = "";
      if (isMLBB) url = `/api/verify-mlbb?id=${playerId}&zone=${zoneId}`;
      else if (isCoD) url = `/api/verify-cod?id=${playerId}`;
      else if (isRoblox) url = `/api/verify-roblox?username=${playerId}`;

      const res = await fetch(url);
      const data = await res.json();
      
      if (res.ok && data.verified) {
        setIgn(data.region ? `${data.ign || data.displayName} (${data.region})` : (data.ign || data.displayName));
        setVerificationFailed(false);
      } else {
        setError(data.error || "Failed to verify player.");
        setVerificationFailed(true);
      }
    } catch (err) {
      setError("An error occurred while verifying. Please enter your name manually.");
      setVerificationFailed(true);
    } finally {
      setVerifying(false);
    }
  };

  const handleOrder = async () => {
    if (!user && !isGuest) {
      setError("You must be logged in or continue as guest to place an order.");
      return;
    }

    if (needsVerification && !ign && !manualIgn) {
      setError("Please verify your account or enter your IGN manually.");
      return;
    }

    if (!needsVerification && !playerId) {
      setError("Please enter your details.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const txnId = await submitOrder({
      userId: user ? user.uid : "guest",
      username: userData ? userData.username : "Guest",
      game: gameLabel,
      productName: product.name,
      price: product.price,
      playerData: { id: playerId, zone: zoneId, ign: ign || manualIgn || playerId },
      paymentMethod,
    });

    setSubmitting(false);

    if (txnId) {
      setReceipt({
        txnId,
        game: gameLabel,
        productName: product.name,
        price: product.price,
        playerId,
        zoneId,
        ign: ign || manualIgn || playerId,
        paymentMethod
      });
    } else {
      setError("Failed to place order. Please try again.");
    }
  };

  return (
    <div ref={formRef} className="bg-navy-400 border border-navy-300 rounded-xl p-4 mt-4 animate-in fade-in slide-in-from-bottom-2 shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-rajdhani text-lg font-bold text-brand uppercase tracking-wider">
          Order Details
        </h3>
        <button onClick={onClose} className="text-tx-muted hover:text-white text-xl leading-none">&times;</button>
      </div>

      <div className="bg-brand/10 border border-brand/25 rounded-lg p-3 mb-4">
        <div className="text-[0.68rem] uppercase tracking-wide text-tx-muted mb-1">Selected Item</div>
        <div className="font-rajdhani font-bold text-brand text-lg">{product.name}</div>
        <div className="font-rajdhani font-semibold text-amber-400 text-lg mt-0.5">{product.price}</div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-[0.7rem] font-semibold tracking-wide uppercase text-tx-muted mb-1">
            {isRoblox ? "Username" : isMLBB || isCoD ? "Player ID" : "Account ID / Number"} <span className="text-brand">*</span>
          </label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              className="flex-1 bg-navy-300 border border-navy-100 rounded-lg p-2.5 text-sm text-tx-main focus:outline-none focus:border-brand transition-colors"
              placeholder={isRoblox ? "e.g. myusername" : "e.g. 12345678"}
            />
            {needsVerification && !isMLBB && (
              <button 
                onClick={verifyPlayer}
                disabled={verifying}
                className="bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg px-4 font-semibold text-xs hover:bg-blue-500/20 disabled:opacity-50"
              >
                {verifying ? "..." : "Verify"}
              </button>
            )}
          </div>
        </div>
        
        {isMLBB && (
          <div>
            <label className="block text-[0.7rem] font-semibold tracking-wide uppercase text-tx-muted mb-1">
              Zone ID <span className="text-brand">*</span>
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className="flex-1 bg-navy-300 border border-navy-100 rounded-lg p-2.5 text-sm text-tx-main focus:outline-none focus:border-brand transition-colors"
                placeholder="e.g. 3124"
              />
              <button 
                onClick={verifyPlayer}
                disabled={verifying}
                className="bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg px-4 font-semibold text-xs hover:bg-blue-500/20 disabled:opacity-50"
              >
                {verifying ? "..." : "Verify"}
              </button>
            </div>
          </div>
        )}

        {ign && !verificationFailed && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-xs text-green-400 flex items-center gap-2 mt-3">
            ✅ <span className="font-semibold">{ign}</span>
          </div>
        )}

        {verificationFailed && !ign && (
          <div className="mt-3 animate-in fade-in">
            <label className="block text-[0.7rem] font-semibold tracking-wide uppercase text-tx-muted mb-1">
              Account Name (Manual Entry) <span className="text-brand">*</span>
            </label>
            <input 
              type="text" 
              value={manualIgn}
              onChange={(e) => setManualIgn(e.target.value)}
              className="w-full bg-red-500/5 border border-red-500/30 rounded-lg p-2.5 text-sm text-tx-main focus:outline-none focus:border-red-400 transition-colors"
              placeholder="API is down, please type your Exact IGN here"
            />
          </div>
        )}
      </div>

      <div className="mb-5">
        <label className="block text-[0.7rem] font-semibold tracking-wide uppercase text-tx-muted mb-2">
          Payment Method <span className="text-brand">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {["gcash", "maya", "gotyme", "paypal"].map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`p-2 rounded-lg border text-xs font-semibold uppercase tracking-wide transition-all
                ${paymentMethod === method ? "bg-brand/10 border-brand text-brand" : "bg-navy-300 border-navy-100 text-tx-muted hover:border-brand/50"}
              `}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {receipt ? (
        <div className="bg-brand/10 border border-brand/30 p-5 rounded-xl text-left animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 mb-4 text-brand font-bold text-lg border-b border-brand/20 pb-2">
            🧾 Transaction Receipt
          </div>
          
          <div className="space-y-2 text-sm text-tx-main">
            <div className="flex justify-between">
              <span className="text-tx-muted">Ticket ID:</span>
              <span className="font-mono text-brand cursor-pointer hover:underline" onClick={() => navigator.clipboard.writeText(receipt.txnId)} title="Click to copy">{receipt.txnId} 📋</span>
            </div>
            <div className="flex justify-between">
              <span className="text-tx-muted">Game:</span>
              <span className="font-semibold">{receipt.game}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-tx-muted">Order:</span>
              <span className="font-semibold">{receipt.productName} ({receipt.price})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-tx-muted">Player ID:</span>
              <span className="font-semibold">{receipt.playerId} {receipt.zoneId ? `(${receipt.zoneId})` : ""}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-tx-muted">IGN:</span>
              <span className="font-semibold text-green-400">{receipt.ign}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-tx-muted">Payment:</span>
              <span className="font-semibold uppercase">{receipt.paymentMethod}</span>
            </div>
          </div>

          <div className="mt-5 text-xs text-tx-muted text-center italic">
            Please screenshot this receipt and wait for Mark to confirm your order before sending payment.
          </div>

          <button 
            onClick={() => { setReceipt(null); setPlayerId(""); setZoneId(""); setIgn(""); setManualIgn(""); setVerificationFailed(false); }}
            className="w-full mt-4 bg-surface hover:bg-surface-hover text-white font-rajdhani font-bold tracking-wider py-2.5 rounded-lg transition-colors border border-dk5"
          >
            PLACE ANOTHER ORDER
          </button>
        </div>
      ) : (
        <button 
          onClick={handleOrder}
          disabled={submitting || (needsVerification && !ign && !manualIgn)}
          className="w-full bg-brand hover:bg-brand-hover text-white font-rajdhani font-bold text-lg tracking-wider py-3 rounded-xl uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(249,115,22,0.3)]"
        >
          {submitting ? "Processing..." : "Place Order"}
        </button>
      )}
    </div>
  );
}
