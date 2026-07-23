import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
import ProductCard from "@/components/ProductCard";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  return { title: `${product.name} — LED Phone`, description: product.description };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id } },
    include: { category: true },
    take: 3,
  });

  const margin = product.sellPrice - product.buyPrice;
  const marginPct = Math.round((margin / product.buyPrice) * 100);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-sky-500 transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/produits" className="hover:text-sky-500 transition-colors">Produits</Link>
            <span>/</span>
            <Link href={`/produits?cat=${product.category.slug}`} className="hover:text-sky-500 transition-colors">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-slate-600 truncate max-w-[180px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
            </div>
            {product.featured && (
              <div className="absolute top-4 left-4 bg-sky-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-md shadow-sky-500/30">
                ⭐ Coup de cœur
              </div>
            )}
            {product.stock <= 5 && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                Stock limité ({product.stock})
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="section-tag">
                {product.category.icon} {product.category.name}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">{product.name}</h1>

            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
              <svg className="w-4 h-4 text-sky-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Compatible : <span className="text-slate-900 font-semibold">{product.compatible}</span>
            </div>

            <p className="text-slate-500 leading-relaxed mb-8 text-base">{product.description}</p>

            {/* Prix */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-6">
              <div className="flex items-end gap-4 mb-3">
                <span className="text-4xl font-black text-sky-500">{product.sellPrice.toLocaleString("fr-DZ")} DA</span>
                <span className="text-emerald-600 text-sm font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full mb-1">
                  +{marginPct}% marge
                </span>
              </div>
              <div className="text-slate-400 text-sm">
                Prix d&apos;achat: <span className="line-through">{product.buyPrice.toLocaleString("fr-DZ")} DA</span>
                <span className="ml-2 text-slate-600 font-medium">· Bénéfice: {margin.toLocaleString("fr-DZ")} DA</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <BuyNowButton
                product={{ id: product.id, name: product.name, sellPrice: product.sellPrice, image: product.image }}
                className="flex-1 py-3.5 text-sm font-semibold"
              />
              <AddToCartButton
                product={{ id: product.id, name: product.name, sellPrice: product.sellPrice, image: product.image }}
              />
              <a
                href={`https://wa.me/213542612265?text=Bonjour, je suis intéressé par : ${encodeURIComponent(product.name)} à ${product.sellPrice} DA`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] font-semibold px-6 py-3.5 rounded-full transition-all text-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Commander sur WhatsApp
              </a>
            </div>

            {/* Trust features */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100">
              {[
                { icon: "✅", label: "Qualité originale garantie" },
                { icon: "🚚", label: "Livraison 24–72h" },
                { icon: "💵", label: "Paiement à la livraison" },
                { icon: "📞", label: "Support 08h – 01h" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2.5 text-slate-500 text-sm">
                  <span className="text-base">{f.icon}</span>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="border-t border-slate-100 pt-14">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900">Produits similaires</h2>
              <Link
                href={`/produits?cat=${product.category.slug}`}
                className="text-sky-500 hover:text-sky-600 text-sm font-semibold flex items-center gap-1 transition-colors"
              >
                Voir tout
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
