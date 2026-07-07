import type { Metadata } from "next";
import { Rajdhani, Exo_2 } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
});

const exo2 = Exo_2({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-exo2",
});

export const metadata: Metadata = {
  title: "Mark's Game Shop — MLBB, CoD, Roblox Top-Up Philippines",
  description: "Affordable game top-ups in the Philippines. MLBB Diamonds, Garena Shells, Robux, Bloodstrike Golds, and Load. Fast delivery, trusted seller.",
  themeColor: "#f97316",
  openGraph: {
    title: "Mark's Game Shop — Affordable Top-Ups PH",
    description: "Fast & trusted game top-up shop. MLBB, CoD, Roblox, Bloodstrike & Load. Delivery 1-5 mins.",
    type: "website",
    url: "https://mark-shop-beryl.vercel.app",
  }
};

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${exo2.variable}`}>
      <body className="font-sans min-h-screen text-tx-main bg-navy-500 transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
