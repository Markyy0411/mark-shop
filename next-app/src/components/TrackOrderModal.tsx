"use client";

import { useState } from "react";
import { Search, X, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { getOrderById, Order } from "@/lib/firestore-service";

interface TrackOrderModalProps {
  onClose: () => void;
}

export default function TrackOrderModal({ onClose }: TrackOrderModalProps) {
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    const data = await getOrderById(ticketId.trim());
    if (data) {
      setOrder(data);
    } else {
      setError("Order not found. Please check your Ticket ID and try again.");
    }
    setLoading(false);
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="text-amber-400 flex items-center gap-1"><Clock size={14} /> Pending</span>;
      case "processing":
        return <span className="text-blue-400 flex items-center gap-1"><Package size={14} /> Processing</span>;
      case "completed":
        return <span className="text-green-400 flex items-center gap-1"><CheckCircle size={14} /> Completed</span>;
      case "cancelled":
        return <span className="text-red-400 flex items-center gap-1"><XCircle size={14} /> Cancelled</span>;
      default:
        return <span className="text-tx-muted uppercase">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-navy-500/90 z-[9999] flex items-center justify-center p-5 backdrop-blur-sm">
      <div className="bg-navy-400 border border-blue-500/30 rounded-3xl p-6 w-full max-w-[450px] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500 to-blue-500/0"></div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-rajdhani tracking-wider text-tx-main flex items-center gap-2 uppercase">
            <Search className="text-blue-500" /> Track Order
          </h2>
          <button onClick={onClose} className="text-tx-muted hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleTrack} className="flex gap-2 mb-6">
          <input 
            type="text" 
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="Enter your Ticket ID..."
            className="flex-1 bg-navy-500 border border-navy-300 rounded-xl p-3 text-sm text-tx-main focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          <button 
            type="submit"
            disabled={loading || !ticketId.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "Searching..." : "Track"}
          </button>
        </form>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {order && (
          <div className="bg-navy-500 border border-navy-300 rounded-xl p-5">
            <div className="flex justify-between items-start border-b border-navy-300/50 pb-3 mb-3">
              <div>
                <div className="text-[0.65rem] text-tx-muted uppercase tracking-wider mb-1">Status</div>
                <div className="font-semibold text-lg">{getStatusDisplay(order.status)}</div>
              </div>
              <div className="text-right">
                <div className="text-[0.65rem] text-tx-muted uppercase tracking-wider mb-1">Date</div>
                <div className="text-sm font-medium text-tx-main">
                  {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-tx-muted">Game:</span>
                <span className="font-semibold text-tx-main">{order.game}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tx-muted">Item:</span>
                <span className="font-semibold text-brand">{order.productName} ({order.price})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tx-muted">IGN:</span>
                <span className="font-semibold text-green-400">{order.playerData?.ign}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tx-muted">Payment:</span>
                <span className="font-semibold text-tx-main uppercase">{order.paymentMethod}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
