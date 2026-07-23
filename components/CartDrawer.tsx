"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "./CartProvider";

export default function CartDrawer() {
  const { items, removeItem, updateQty, total, count, drawerOpen, closeDrawer } = useCart();

  // Fermer avec Echap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeDrawer(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  // Bloquer le scroll du body quand ouvert
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.18,1)] ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ width: "min(420px, 100vw)", background: "#0d1526", borderLeft: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sky-500/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">Mon panier</span>
            {count > 0 && (
              <span className="bg-sky-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-white font-semibold mb-2">Votre panier est vide</p>
              <p className="text-slate-500 text-sm mb-6">Ajoutez des produits pour commencer</p>
              <button
                onClick={closeDrawer}
                className="btn-primary px-6 py-2.5 text-sm"
              >
                Voir les produits
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {/* Image */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-1">{item.name}</h4>
                  <p className="text-sky-400 font-bold text-sm">{item.sellPrice.toLocaleString("fr-DZ")} DA</p>
                </div>

                {/* Qty + remove */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm font-bold"
                      style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                    >
                      −
                    </button>
                    <span className="text-white font-bold text-sm w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm font-bold"
                      style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {/* Subtotal */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-sm">Sous-total</span>
              <span className="text-slate-300 text-sm font-semibold">{total.toLocaleString("fr-DZ")} DA</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400 text-sm">Livraison</span>
              <span className="text-emerald-400 text-sm font-semibold">Incluse</span>
            </div>
            <div className="flex justify-between items-center mb-5">
              <span className="text-white font-bold text-base">Total</span>
              <span className="text-sky-400 font-black text-xl">{total.toLocaleString("fr-DZ")} DA</span>
            </div>

            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="btn-primary w-full block text-center py-4 text-sm font-bold"
            >
              Commander maintenant →
            </Link>

            <button
              onClick={closeDrawer}
              className="w-full text-center text-slate-500 hover:text-slate-300 text-sm mt-3 transition-colors"
            >
              Continuer mes achats
            </button>

            {/* Trust */}
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-600">
              <span>💵 Paiement à la livraison</span>
              <span>🔒 Sécurisé</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
