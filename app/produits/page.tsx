import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const metadata = {
  title: "Produits — LED Phone",
  description: "Toute notre collection de coques et accessoires iPhone.",
};

type SearchParams = Promise<{ cat?: string; q?: string }>;

export default async function ProduitsPage({ searchParams }: { searchParams: SearchParams }) {
  const { cat, q } = await searchParams;

  const allCats = await prisma.category.findMany();
  const categories = allCats.sort((a, b) => Number(a.comingSoon) - Number(b.comingSoon));

  const products = await prisma.product.findMany({
    where: {
      ...(cat ? { category: { slug: cat } } : {}),
      ...(q
        ? {
            AND: q.trim().split(/\s+/).filter(Boolean).slice(0, 5).map((w) => ({
              OR: [
                { name: { contains: w } },
                { compatible: { contains: w } },
                { category: { name: { contains: w } } },
              ],
            })),
          }
        : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const activeCategory = categories.find((c) => c.slug === cat);

  return (
    <div className="bg-white min-h-screen">
      {/* Page header */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
            <Link href="/" className="hover:text-sky-500 transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-slate-600">
              {activeCategory ? activeCategory.name : "Tous les produits"}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-2">
            {activeCategory ? (
              <>
                <span>{activeCategory.icon} </span>
                {activeCategory.name}
              </>
            ) : (
              "Tous les produits"
            )}
          </h1>
          <p className="text-slate-400">
            {products.length} produit{products.length !== 1 ? "s" : ""} trouvé{products.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-60 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-20">
              <h2 className="text-slate-900 font-bold mb-4 text-sm uppercase tracking-wider">Catégories</h2>

              {/* Search */}
              <form method="GET" action="/produits" className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    name="q"
                    defaultValue={q}
                    placeholder="Rechercher…"
                    className="input-premium pr-9 text-sm"
                  />
                  <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>

              <div className="flex flex-col gap-1">
                <Link
                  href="/produits"
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors font-medium ${
                    !cat ? "bg-sky-500 text-white shadow-sm shadow-sky-500/30" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>Tous les produits</span>
                </Link>

                {/* Active categories */}
                <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest mt-3 mb-1 px-1">Disponibles</p>
                {categories.filter(c => !c.comingSoon).map((category) => (
                  <Link
                    key={category.id}
                    href={`/produits?cat=${category.slug}`}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      cat === category.slug
                        ? "bg-sky-500 text-white font-semibold shadow-sm shadow-sky-500/30"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-base">{category.icon}</span>
                    <span>{category.name}</span>
                  </Link>
                ))}

                {/* Coming soon categories */}
                <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest mt-4 mb-1 px-1">Bientôt</p>
                {categories.filter(c => c.comingSoon).map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm opacity-50 cursor-not-allowed"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base grayscale">{category.icon}</span>
                      <span className="text-slate-400">{category.name}</span>
                    </div>
                    <span className="text-[9px] font-bold text-sky-500 bg-sky-50 px-1.5 py-0.5 rounded-full border border-sky-200 shrink-0">
                      Soon
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-slate-400 text-xs mb-3">Besoin d&apos;aide pour choisir ?</p>
                <a
                  href="https://wa.me/213542612265"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 text-[#25D366] px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Nous contacter
                </a>
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-slate-900 font-bold text-xl mb-2">Aucun produit trouvé</h3>
                <p className="text-slate-400 mb-6">
                  {activeCategory?.comingSoon
                    ? "Cette catégorie sera bientôt disponible. Revenez nous voir !"
                    : "Essayez une autre catégorie ou effacez votre recherche."}
                </p>
                <Link href="/produits" className="btn-primary px-6 py-2.5 text-sm inline-block">
                  Voir tous les produits
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
