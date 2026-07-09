"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Order } from "@/lib/firestore-service";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Replace with the real admin email
  const ADMIN_EMAIL = "marcangelguevarra@gmail.com";
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<(Order & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push("/");
      } else {
        setIsAdmin(true);
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!isAdmin) return;

    // Listen to orders in real-time
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (Order & { id: string })[];
      
      setOrders(fetchedOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update status");
    }
  };

  if (authLoading || (!isAdmin && loading)) {
    return <div className="h-screen w-full flex items-center justify-center bg-navy-500 text-brand animate-pulse">Checking credentials...</div>;
  }

  if (!isAdmin) return null; // router.push handles redirect

  return (
    <div className="min-h-screen bg-navy-500 text-tx-main p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-rajdhani font-bold text-brand uppercase tracking-wider">Admin Dashboard</h1>
            <p className="text-tx-muted text-sm mt-1">Manage all incoming orders here.</p>
          </div>
          <button onClick={() => router.push("/")} className="bg-navy-300 hover:bg-navy-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            Back to Shop
          </button>
        </div>

        {loading ? (
          <div className="text-center text-tx-muted py-10 animate-pulse">Loading orders...</div>
        ) : (
          <div className="bg-navy-400 border border-navy-300 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-navy-500/50 text-[0.7rem] uppercase tracking-wider text-tx-muted border-b border-navy-300">
                    <th className="p-4 font-semibold">Date / TXN ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Order</th>
                    <th className="p-4 font-semibold">Details</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-300">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-navy-300/30 transition-colors">
                      <td className="p-4">
                        <div className="text-xs text-tx-muted mb-1">
                          {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString('en-PH', {timeZone: 'Asia/Manila'}) : 'Just now'}
                        </div>
                        <div className="font-mono text-brand text-sm font-semibold">{order.id}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-sm">{order.username}</div>
                        <div className="text-xs text-tx-muted bg-navy-500 inline-block px-2 py-0.5 rounded mt-1 border border-navy-200">
                          {order.paymentMethod.toUpperCase()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-sm">{order.game}</div>
                        <div className="text-amber-400 text-xs font-semibold mt-0.5">{order.productName} ({order.price})</div>
                      </td>
                      <td className="p-4">
                        <div className="text-xs">
                          <span className="text-tx-muted uppercase tracking-wide text-[0.65rem] block">IGN</span>
                          <span className="font-semibold text-green-400 block mb-1">{order.playerData?.ign || '—'}</span>
                          <span className="text-tx-muted uppercase tracking-wide text-[0.65rem] block">ID/Zone</span>
                          <span className="font-semibold">{order.playerData?.id || '—'} {order.playerData?.zone ? `(${order.playerData.zone})` : ''}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider rounded-full border whitespace-nowrap
                          ${order.status === 'completed' ? 'bg-green-500/10 border-green-500/30 text-green-400' : ''}
                          ${order.status === 'pending' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : ''}
                          ${order.status === 'processing' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : ''}
                          ${order.status === 'cancelled' ? 'bg-red-500/10 border-red-500/30 text-red-400' : ''}
                        `}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-navy-500 border border-navy-200 rounded p-1.5 text-xs text-tx-main focus:outline-none focus:border-brand cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-tx-muted">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
