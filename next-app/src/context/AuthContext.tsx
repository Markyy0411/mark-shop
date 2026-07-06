"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  userData: { markcoins: number; role: string; username: string } | null;
  isGuest: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user previously chose guest mode
    const guestStored = localStorage.getItem("markshop_guest") === "true";
    if (guestStored) setIsGuest(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setIsGuest(false);
        localStorage.removeItem("markshop_guest");
        
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          // Initialize user in Firestore
          const newUserData = {
            username: firebaseUser.displayName || "User",
            role: "user",
            markcoins: 0,
            mlbbId: "",
            mlbbZone: ""
          };
          await setDoc(docRef, newUserData);
          setUserData(newUserData);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  const loginAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem("markshop_guest", "true");
  };

  const logout = async () => {
    if (isGuest) {
      setIsGuest(false);
      localStorage.removeItem("markshop_guest");
    } else {
      await signOut(auth);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, isGuest, loginWithGoogle, loginAsGuest, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
