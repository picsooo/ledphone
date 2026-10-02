"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "./CartProvider";
import { usePathname } from "next/navigation";
import SearchBox from "./SearchBox";

export default function Header() {
  const { count, openDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = isHome && !scrolled;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        dark
          ? "bg-transparent border-b border-white/5"
          : "bg-white/95 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-sky-400/30 group-hover:ring-sky-400/60 transition-all shadow-sm">
            <Image src="/logo.jpeg" alt="LED Phone" fill sizes="36px" className="object-cover" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-black tracking-tight">
              <span className="text-sky-400">LED</span>
              <span className={dark ? "text-white" : "text-slate-900"}> Phone</span>
            </span>
            <span className={`text-[10px] font-medium tracking-widest uppercase ${dark ? "text-slate-400" : "text-slate-400"}`}>
              Accessories
            </span>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {[
            { href: "/", label: "Accueil" },
            { href: "/produits", label: "Produits" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full transition-all ${
                dark
                  ? "text-slate-300 hover:text-white hover:bg-white/10"
                  : "text-slate-600 hover:text-sky-500 hover:bg-sky-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <SearchBox dark={dark} />
          {/* Cart */}
          <button
            onClick={openDrawer}
            className="relative flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-md shadow-sky-500/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="hidden sm:block">Panier</span>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                {count}
              </span>
            )}
          </button>

          {/* Admin */}
          <Link
            href="/admin"
            className={`hidden md:flex items-center gap-1 text-xs px-3 py-2 rounded-full transition-all ${
              dark
                ? "text-slate-500 hover:text-slate-200 hover:bg-white/10"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>

          {/* Mobile burger */}
          <button
            className={`md:hidden p-2 rounded-full transition-all ${
              dark ? "text-slate-300 hover:text-white hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-4 py-3 flex flex-col gap-1"
          style={dark ? { background: "rgba(7,11,22,0.95)", borderTop: "1px solid rgba(255,255,255,0.06)" } : { background: "#fff", borderTop: "1px solid #f1f5f9" }}
        >
          {[
            { href: "/", label: "🏠 Accueil" },
            { href: "/produits", label: "📦 Produits" },
            { href: "/contact", label: "📞 Contact" },
            { href: "/admin", label: "⚙️ Administration" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                dark ? "text-slate-300 hover:bg-white/10 hover:text-white" : "text-slate-700 hover:bg-sky-50 hover:text-sky-600"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
