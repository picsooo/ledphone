"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import BuyNowButton from "./BuyNowButton";

type Product = {
  id: number;
  name: string;
  slug: string;
  sellPrice: number;
  buyPrice: number;
  image: string;
  compatible: string;
  stock: number;
  featured: boolean;
  category: { name: string; slug: string; comingSoon?: boolean };
};

export default function ProductCard({ product, dark = false }: { product: Product; dark?: boolean }) {
  const { addItem } = useCart();
  const isComingSoon = product.category.comingSoon ?? false;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isComingSoon) return;
    addItem({
      id: product.id,
      name: product.name,
      sellPrice: product.sellPrice,
      image: product.image,
    });
  };

  return (
    <Link
      href={isComingSoon ? "#" : `/produits/${product.slug}`}
      className="rounded-2xl overflow-hidden group block relative transition-all duration-300 hover:-translate-y-1"
      style={dark
        ? { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }
        : { background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }
      }
      onClick={isComingSoon ? (e) => e.preventDefault() : undefined}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ${isComingSoon ? "grayscale opacity-60" : "group-hover:scale-105"}`}
        />

        {/* Coming Soon overlay */}
        {isComingSoon && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
            <span className="bg-sky-500 text-white text-xs font-black px-4 py-1.5 rounded-full tracking-wide shadow-lg shadow-sky-500/30">
              ✨ Coming Soon
            </span>
          </div>
        )}

        {/* Featured badge */}
        {product.featured && !isComingSoon && (
          <div className="absolute top-3 left-3 bg-sky-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm shadow-sky-500/30">
            ⭐ Coup de cœur
          </div>
        )}

        {/* Stock badge */}
        {product.stock <= 5 && !isComingSoon && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Stock limité
          </div>
        )}

        {/* Category pill */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
          {product.category.name}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className={`font-semibold text-sm leading-tight mb-1.5 line-clamp-2 ${dark ? "text-white" : "text-slate-900"}`}>{product.name}</h3>
        <p className="text-slate-400 text-xs mb-4 flex items-center gap-1 line-clamp-1">
          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {product.compatible}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <div className={`font-black text-xl ${isComingSoon ? "text-slate-400" : "text-sky-500"}`}>
              {product.sellPrice.toLocaleString("fr-DZ")} DA
            </div>
            <div className="text-slate-300 text-xs line-through">
              {product.buyPrice.toLocaleString("fr-DZ")} DA
            </div>
          </div>

          {isComingSoon ? (
            <span className="text-sky-500 text-xs font-bold bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-full">
              Bientôt
            </span>
          ) : (
            <button
              onClick={handleAdd}
              className="btn-primary p-2.5 rounded-full shadow-md shadow-sky-500/20 group/btn"
              title="Ajouter au panier"
            >
              <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          )}
        </div>

        {!isComingSoon && (
          <BuyNowButton
            product={{ id: product.id, name: product.name, sellPrice: product.sellPrice, image: product.image }}
            className="w-full py-2 text-sm"
          />
        )}
      </div>
    </Link>
  );
}
