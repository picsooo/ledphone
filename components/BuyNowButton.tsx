"use client";

import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";

type Props = {
  product: { id: number; name: string; sellPrice: number; image: string };
  className?: string;
};

export default function BuyNowButton({ product, className = "" }: Props) {
  const { addItem } = useCart();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    router.push("/checkout");
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold rounded-full transition-all duration-200 ${className}`}
    >
      Acheter maintenant
    </button>
  );
}
