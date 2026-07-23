import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    take: 6,
  });
}

async function getSubscriptions() {
  return prisma.product.findMany({
    where: { category: { slug: "abonnements" } },
    orderBy: { featured: "desc" },
    take: 8,
  });
}

async function getCategories() {
  const cats = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });
  return cats.sort((a, b) => Number(a.comingSoon) - Number(b.comingSoon));
}

export default async function HomePage() {
  const [featured, categories, subscriptions] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getSubscriptions(),
  ]);

  const activeCategories = categories.filter((c) => !c.comingSoon);
  const comingSoonCategories = categories.filter((c) => c.comingSoon);

  return (
    <div style={{ background: "#070b16" }}>

      {/* ── HERO SLIDER ─────────────────────────────────── */}
      <HeroSlider />

      {/* ── TRUST BAR ───────────────────────────────────── */}
      <div style={{ background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: "✅", title: "100% Original", sub: "Produits authentiques garantis" },
              { icon: "🚚", title: "Livraison nationale", sub: "Partout en Algérie" },
              { icon: "💵", title: "Paiement à la livraison", sub: "Payez à réception" },
              { icon: "📞", title: "Support 08h–01h", sub: "WhatsApp & téléphone" },
            ].map((b) => (
              <div key={b.title} className="flex items-center gap-3">
                <span className="text-2xl shrink-0">{b.icon}</span>
                <div>
                  <div className="text-white font-semibold text-sm">{b.title}</div>
                  <div className="text-slate-500 text-xs">{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORIES ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
            Nos catégories
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 mb-3 leading-tight">
            Trouvez votre{" "}
            <span style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              coque idéale
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Silicone, antichoc, MagSafe, premium — pour chaque style et chaque iPhone.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {activeCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/produits?cat=${cat.slug}`}
              className="group rounded-2xl p-5 text-center cursor-pointer transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={undefined}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
              <div className="text-white font-semibold text-sm leading-tight mb-1">{cat.name}</div>
              <div className="text-slate-500 text-xs">{cat._count.products} produits</div>
            </Link>
          ))}
        </div>

        {/* Coming soon */}
        <div className="mt-4">
          <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest text-center mb-4">Bientôt disponibles</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {comingSoonCategories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-2xl p-5 text-center opacity-40"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="text-4xl mb-3 grayscale">{cat.icon}</div>
                <div className="text-slate-400 font-semibold text-sm leading-tight mb-2">{cat.name}</div>
                <span className="inline-flex items-center gap-1 bg-sky-500/10 text-sky-500 text-[10px] font-bold px-2.5 py-1 rounded-full border border-sky-500/20">
                  <span className="w-1 h-1 bg-sky-500 rounded-full animate-pulse" />
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ───────────────────────────── */}
      <section style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }} className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-5">
                Sélection
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white mt-4">
                Nos coups de{" "}
                <span style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  cœur
                </span>
              </h2>
            </div>
            <Link
              href="/produits"
              className="hidden sm:flex items-center gap-2 text-sky-400 hover:text-sky-300 font-semibold text-sm transition-colors"
            >
              Tout voir
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} dark />
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link href="/produits" className="btn-primary px-8 py-3 text-sm inline-block">
              Voir tous les produits
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABONNEMENTS & SERVICES ──────────────────────── */}
      {subscriptions.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-5">
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
              Abonnements & Services
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 mb-3 leading-tight">
              Vos{" "}
              <span style={{ background: "linear-gradient(135deg,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                services préférés
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              Netflix, Snapchat+, Tinder, Shahid, Disney+ et plus — livrés par email en moins de 2h.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {subscriptions.map((sub) => (
              <Link
                key={sub.id}
                href={`/produits/${sub.slug}`}
                className="group relative rounded-2xl p-5 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {sub.featured && (
                  <span className="absolute top-3 right-3 bg-amber-400/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                    ★ Top
                  </span>
                )}
                <div className="w-14 h-14 rounded-2xl overflow-hidden mb-4 ring-1 ring-white/10 bg-white flex items-center justify-center p-2">
                  {sub.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sub.image}
                      alt={sub.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-2xl">🎬</span>
                  )}
                </div>
                <div className="text-white font-semibold text-sm leading-tight mb-1">{sub.name}</div>
                <div className="text-slate-500 text-xs mb-3 line-clamp-2">{sub.compatible}</div>
                <div className="mt-auto">
                  <div className="text-violet-400 font-black text-lg">{sub.sellPrice.toLocaleString("fr-DZ")} DA</div>
                  <div className="text-slate-600 text-xs">/ mois</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/produits?cat=abonnements"
              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-semibold text-sm transition-colors"
            >
              Voir tous les abonnements
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* ── STATS ───────────────────────────────────────── */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #0c1a3a 0%, #0f0c29 50%, #0c1a3a 100%)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: "23+", label: "Produits disponibles", color: "#38bdf8" },
              { value: "100%", label: "Originaux garantis", color: "#818cf8" },
              { value: "58", label: "Wilayas livrées", color: "#34d399" },
              { value: "24h", label: "Délai de livraison", color: "#f472b6" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-4xl sm:text-5xl font-black mb-2" style={{ color: s.color }}>{s.value}</div>
                <div className="text-slate-400 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-5">
            Pourquoi nous ?
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mt-4">
            L&apos;excellence à votre{" "}
            <span style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              service
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "✅", title: "100% Original", desc: "Toutes nos coques sont authentiques et garanties originales.", glow: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.2)" },
            { icon: "⚡", title: "Livraison rapide", desc: "Expédition le jour même, livraison 24–72h partout en Algérie.", glow: "rgba(56,189,248,0.15)", border: "rgba(56,189,248,0.2)" },
            { icon: "💎", title: "Qualité premium", desc: "Sélection rigoureuse des meilleurs produits du marché.", glow: "rgba(129,140,248,0.15)", border: "rgba(129,140,248,0.2)" },
            { icon: "🤝", title: "Service client", desc: "Disponible 08h - 01h via WhatsApp pour vous conseiller.", glow: "rgba(251,191,36,0.15)", border: "rgba(251,191,36,0.2)" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
              style={{ background: item.glow, border: `1px solid ${item.border}` }}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-white font-bold mb-2 text-lg">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        <div
          className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(99,102,241,0.15) 100%)", border: "1px solid rgba(56,189,248,0.2)" }}
        >
          {/* Glow blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }} />
          <div className="relative">
            <div className="text-5xl mb-6">📱</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Prêt à protéger votre iPhone ?
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Commandez maintenant avec livraison à domicile et paiement à la réception.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/produits" className="btn-primary px-8 py-4 text-sm">
                Voir les produits
              </Link>
              <a
                href="https://wa.me/213542612265"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold transition-all"
                style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)", color: "#25D366" }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contacter sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
