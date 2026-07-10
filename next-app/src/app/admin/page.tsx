"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAllOrders, updateOrderStatus, Order } from "@/lib/firestore-service";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

// Extended Order interface to include the document ID
interface AdminOrder extends Order {
  id: string;
}

export default function AdminDashboard() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If finished loading auth and not admin, kick them out
    if (!loading && (!user || userData?.role !== "admin")) {
      router.push("/");
    }
  }, [user, userData, loading, router]);

  useEffect(() => {
    if (userData?.role === "admin") {
      fetchOrders();
    }
  }, [userData]);

  const fetchOrders = async () => {
    setFetching(true);
    try {
      const data = await getAllOrders();
      // Sort by newest first (assuming createdAt is a Firebase Timestamp)
      const sortedData = (data as AdminOrder[]).sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setOrders(sortedData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders.");
    } finally {
      setFetching(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Update local state immediately
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status.");
    }
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-navy-500 text-tx-main flex items-center justify-center">
        <div className="animate-spin text-brand text-4xl">⟳</div>
      </div>
    );
  }

  if (!user || userData?.role !== "admin") {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-navy-500 text-tx-main font-poppins selection:bg-brand/30 pb-20">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-rajdhani font-bold text-white uppercase tracking-wider">
            Admin Dashboard
          </h1>
          <button 
            onClick={fetchOrders}
            className="bg-navy-300 hover:bg-navy-200 px-4 py-2 rounded-lg text-sm transition-colors border border-navy-100"
          >
            ↻ Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="bg-navy-400 border border-navy-300 rounded-xl overflow-x-auto shadow-xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-navy-300/50 border-b border-navy-300 text-tx-muted uppercase tracking-wider text-[0.7rem] font-semibold">
                <th className="p-4">Ticket ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Order Details</th>
                <th className="p-4">Price</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-300 text-sm">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-tx-muted">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-navy-300/20 transition-colors">
                    <td className="p-4 font-mono text-xs text-brand">{order.id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{order.username}</div>
                      <div className="text-[0.65rem] text-tx-muted uppercase mt-0.5">{order.playerData?.ign || "N/A"}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-brand-hover">{order.game}</div>
                      <div className="text-xs text-tx-main">{order.productName}</div>
                      <div className="text-[0.65rem] text-tx-muted mt-0.5">
                        ID: {order.playerData?.id} {order.playerData?.zone ? `(${order.playerData.zone})` : ""}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-amber-400">{order.price}</td>
                    <td className="p-4 uppercase text-xs font-bold tracking-wide">{order.paymentMethod}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[0.65rem] font-bold uppercase tracking-wider border
                        ${order.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                          order.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                          order.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'}
                      `}>
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      {order.status === 'pending' && (
                        <button onClick={() => handleStatusChange(order.id, 'processing')} className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                          Process
                        </button>
                      )}
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <button onClick={() => handleStatusChange(order.id, 'completed')} className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                          Complete
                        </button>
                      )}
                      {order.status !== 'cancelled' && order.status !== 'completed' && (
                        <button onClick={() => handleStatusChange(order.id, 'cancelled')} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
