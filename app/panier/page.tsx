"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function PanierPage() {
  const { items, removeItem, updateQty, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-8xl mb-6">🛒</div>
        <h1 className="text-3xl font-black text-slate-900 mb-3">Votre panier est vide</h1>
        <p className="text-slate-400 mb-8">Ajoutez des produits pour commencer vos achats.</p>
        <Link href="/produits" className="btn-primary px-8 py-3.5 text-sm">
          Découvrir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <span className="section-tag mb-3">Mon panier</span>
          <h1 className="text-4xl font-black text-slate-900 mt-3">
            {items.length} article{items.length > 1 ? "s" : ""}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                <Link href={`/produits`} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover hover:scale-105 transition-transform" />
                </Link>
                <div className="flex-1 min-w-0">
                  <h3 className="text-slate-900 font-semibold text-sm leading-tight line-clamp-2 mb-1">{item.name}</h3>
                  <p className="text-sky-500 font-bold">{item.sellPrice.toLocaleString("fr-DZ")} DA / unité</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-slate-200 hover:border-sky-400 hover:text-sky-500 text-slate-600 flex items-center justify-center transition-all text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="text-slate-900 font-bold w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-slate-200 hover:border-sky-400 hover:text-sky-500 text-slate-600 flex items-center justify-center transition-all text-lg font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-slate-900 font-black">{(item.sellPrice * item.quantity).toLocaleString("fr-DZ")} DA</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-300 hover:text-red-400 text-xs transition-colors mt-1 flex items-center gap-1 ml-auto"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Retirer
                  </button>
                </div>
              </div>
            ))}

            <Link href="/produits" className="inline-flex items-center gap-2 text-sky-500 hover:text-sky-600 text-sm font-medium transition-colors mt-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Continuer mes achats
            </Link>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-20">
              <h2 className="text-slate-900 font-bold text-lg mb-4">Récapitulatif</h2>

              <div className="space-y-3 mb-4 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-slate-500">
                    <span className="truncate pr-2">{item.name} ×{item.quantity}</span>
                    <span className="shrink-0 font-medium text-slate-700">{(item.sellPrice * item.quantity).toLocaleString()} DA</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-4 mb-6">
                <div className="flex justify-between text-sm text-slate-500 mb-2">
                  <span>Sous-total</span>
                  <span>{total.toLocaleString("fr-DZ")} DA</span>
                </div>
                <div className="flex justify-between text-sm text-emerald-600 font-semibold mb-3">
                  <span>Livraison</span>
                  <span>Incluse</span>
                </div>
                <div className="flex justify-between font-black text-xl text-slate-900">
                  <span>Total</span>
                  <span className="text-sky-500">{total.toLocaleString("fr-DZ")} DA</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn-primary w-full block text-center py-4 text-sm"
              >
                Commander maintenant →
              </Link>

              <div className="mt-5 space-y-2.5">
                {[
                  { icon: "💵", text: "Paiement à la livraison" },
                  { icon: "🚚", text: "Livraison partout en Algérie" },
                  { icon: "🔒", text: "100% sécurisé" },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2 text-slate-400 text-xs">
                    <span>{b.icon}</span>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
