import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartProvider from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LED Phone — Accessoires iPhone Premium",
  description:
    "Coques, protections et accessoires iPhone haut de gamme. Livraison partout en Algérie. Qualité originale garantie.",
  keywords: "coque iPhone, antichoc, MagSafe, Lacoste, BMW, Algérie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={geist.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
