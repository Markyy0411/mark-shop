import { collection, getDocs, query, where, addDoc, serverTimestamp, doc, getDoc, setDoc, increment } from "firebase/firestore";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getProductsByCategory(category: string): Promise<Product[]> {
  // 1. Fetch from Google Apps Script to ensure your products are intact immediately
  try {
    const res = await fetch(FALLBACK_API, { cache: 'no-store' });
    const data = await res.json();
    
    if (data.success && data.prices) {
      const [gameKey, catKey] = category.split("-");
      
      const filtered = data.prices.filter((p: any) => {
        const pGame = String(p.game).toLowerCase().trim();
        const pCat = String(p.category).toLowerCase().trim();
        
        if (pGame !== gameKey) return false;

        // Custom mapping for our tabs
        if (catKey === "dias") {
          return pCat === "dias" || pCat === "main";
        }
        if (catKey === "starlight") {
          return pCat === "starlight";
        }
        if (catKey === "promos") {
          // Map all the special offer categories from the spreadsheet to the Promos tab
          return ["combo", "bundles", "dd", "dias-indo", "dias-global", "skinsc", "skinsd"].includes(pCat);
        }

        return pCat === catKey || pCat === 'main';
      });

      if (filtered.length > 0) {
        return filtered.map((p: any, idx: number) => {
          const priceStr = String(p.price).replace(/[^0-9.]/g, '');
          const priceNum = parseFloat(priceStr);
          const formattedPrice = isNaN(priceNum) ? String(p.price) : `₱${Math.round(priceNum)}`;
          
          return {
            id: `legacy-${pCat}-${idx}`,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function submitOrder(orderId: string, orderData: any): Promise<void> {
  try {
    await setDoc(doc(db, "orders", orderId), {
      ...orderData,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    if (orderData.userId && orderData.userId !== "guest" && orderData.coinsEarned > 0) {
      await setDoc(doc(db, "users", orderData.userId), {
        markcoins: increment(orderData.coinsEarned)
      }, { merge: true });
    }
  } catch (error) {
    console.error("Error submitting order:", error);
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const docRef = doc(db, "orders", orderId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { id: snapshot.id, ...(snapshot.data() as any) } as Order;
    }
    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}
