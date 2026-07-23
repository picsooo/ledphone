import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-slate-900 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-sky-400/30">
                <Image src="/logo.jpeg" alt="LED Phone" fill sizes="40px" className="object-cover" />
              </div>
              <span className="text-xl font-black">
                <span className="text-sky-400">LED</span>
                <span className="text-white"> Phone</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              Votre référence en accessoires iPhone haut de gamme en Algérie.
              Qualité originale, livraison nationale, paiement à la livraison.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/213542612265"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 text-[#25D366] text-sm font-semibold px-4 py-2 rounded-full transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              <a
                href="tel:0542612265"
                className="flex items-center gap-2 bg-sky-500/10 border border-sky-400/20 hover:bg-sky-500/20 text-sky-400 text-sm font-semibold px-4 py-2 rounded-full transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                0542 61 22 65
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Navigation</h3>
            <div className="flex flex-col gap-2.5 text-sm text-slate-400">
              <Link href="/" className="hover:text-sky-400 transition-colors">Accueil</Link>
              <Link href="/produits" className="hover:text-sky-400 transition-colors">Tous les produits</Link>
              <Link href="/produits?cat=premium" className="hover:text-sky-400 transition-colors">Coques Premium</Link>
              <Link href="/produits?cat=magsafe" className="hover:text-sky-400 transition-colors">Coques MagSafe</Link>
              <Link href="/produits?cat=antichoc" className="hover:text-sky-400 transition-colors">Antichoc</Link>
              <Link href="/panier" className="hover:text-sky-400 transition-colors">Mon panier</Link>
              <Link href="/contact" className="hover:text-sky-400 transition-colors">Contact</Link>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Informations</h3>
            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Oued Romane, El Achour<br />En face la poste, Alger</span>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Ouvert 08h00 — 01h00</span>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>@led_phone16</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800">
                <div className="flex gap-2">
                  <span className="bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">
                    ✅ Produits originaux
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs font-semibold px-3 py-1 rounded-full">
                    💵 Paiement à la livraison
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} LED Phone. Tous droits réservés.</p>
          <p>Conçu avec ❤️ en Algérie 🇩🇿</p>
        </div>
      </div>
    </footer>
  );
}
