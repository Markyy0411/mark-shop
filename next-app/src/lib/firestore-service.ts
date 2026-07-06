import { collection, getDocs, query, where, addDoc, serverTimestamp, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export interface Product {
  id: string;
  name: string;
  desc?: string;
  price: string;
  category: string; // e.g., 'mlbb-dias', 'mlbb-promos'
  orderIndex: number;
}

export interface Order {
  userId: string;
  username: string;
  game: string;
  productName: string;
  price: string;
  playerData: any; // { id, zone }
  paymentMethod: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: any;
}

const FALLBACK_API = 'https://script.google.com/macros/s/AKfycbymHhomzky-F8dLk1Fx42V7JadjA8wvhYUdiDydv7dqCSXhD86yFsK50DbW9Atx4AUCgA/exec?action=getPrices';

export async function getProductsByCategory(category: string): Promise<Product[]> {
  // 1. Fetch from Google Apps Script to ensure your products are intact immediately
  try {
    const res = await fetch(FALLBACK_API);
    const data = await res.json();
    
    if (data.success && data.prices) {
      const [gameKey, catKey] = category.split("-");
      
      const filtered = data.prices.filter((p: any) => {
        const pGame = String(p.game).toLowerCase().trim();
        const pCat = String(p.category).toLowerCase().trim();
        return pGame === gameKey && (pCat === catKey || pCat === 'main');
      });

      if (filtered.length > 0) {
        return filtered.map((p: any, idx: number) => {
          let priceStr = String(p.price).replace(/[^0-9.]/g, '');
          let priceNum = parseFloat(priceStr);
          let formattedPrice = isNaN(priceNum) ? String(p.price) : `₱${Math.round(priceNum)}`;
          
          return {
            id: `legacy-${idx}`,
            name: p.name,
            price: formattedPrice,
            desc: p.description || '',
            category: category,
            orderIndex: idx,
            game: gameKey,
            isAvailable: true
          } as Product;
        });
      }
    }
  } catch (error) {
    console.error("Apps Script fetch failed:", error);
  }

  // 2. If Apps Script is empty or fails, attempt to fetch from Firestore
  try {
    const q = query(collection(db, "products"), where("category", "==", category));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      return products.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    }
  } catch (error) {
    console.error("Firestore fetch error:", error);
  }

  return [];
}

export async function submitOrder(orderData: Omit<Order, 'status' | 'createdAt'>): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting order:", error);
    return null;
  }
}
