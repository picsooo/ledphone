"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

type Props = {
  product: { id: number; name: string; sellPrice: number; image: string };
};

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      className={`btn-shine flex items-center justify-center gap-2 font-semibold px-6 py-3.5 rounded-full transition-all duration-300 flex-1 ${
        added
          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
          : "bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/30"
      }`}
    >
      {added ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Ajouté !
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Ajouter au panier
        </>
      )}
    </button>
  );
}
