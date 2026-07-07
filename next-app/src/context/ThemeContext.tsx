"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Check local storage or system preference on load
    const savedTheme = localStorage.getItem("mark-shop-theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("light", savedTheme === "light");
    } else {
      const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      if (systemPrefersLight) {
        setTheme("light");
        document.documentElement.classList.add("light");
      }
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("mark-shop-theme", newTheme);
      document.documentElement.classList.toggle("light", newTheme === "light");
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
