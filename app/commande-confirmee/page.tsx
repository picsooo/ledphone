import Link from "next/link";

export const metadata = { title: "Commande confirmée — LED Phone" };

type Props = { searchParams: Promise<{ id?: string }> };

export default async function CommandeConfirmeePage({ searchParams }: Props) {
  const { id } = await searchParams;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center">
        {/* Success animation */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-40" />
          <div className="relative bg-emerald-500 rounded-full w-24 h-24 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-2">Commande confirmée !</h1>
        {id && (
          <p className="text-slate-400 text-sm mb-4">Numéro de commande : <span className="font-bold text-slate-700">#{id.padStart(5, "0")}</span></p>
        )}

        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 mb-6 text-left">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📦</span>
            <div>
              <div className="font-bold text-sky-800 mb-1">Que se passe-t-il maintenant ?</div>
              <ul className="text-sky-700 text-sm space-y-1">
                <li>✅ Votre commande a été enregistrée</li>
                <li>📞 Nous vous appellerons sous 24h pour confirmer</li>
                <li>🚚 Livraison en 24–72h selon votre wilaya</li>
                <li>💵 Vous payez uniquement à la réception</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-slate-500 text-sm mb-8">
          Pour toute question, contactez-nous au{" "}
          <a href="tel:0542612265" className="text-sky-500 font-bold hover:underline">0542 61 22 65</a>{" "}
          ou sur{" "}
          <a href="https://wa.me/213542612265" target="_blank" rel="noreferrer" className="text-emerald-500 font-bold hover:underline">WhatsApp</a>.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/produits" className="btn-primary px-6 py-3 text-sm">
            Continuer mes achats
          </Link>
          <a
            href="https://wa.me/213542612265"
            target="_blank"
            rel="noreferrer"
            className="btn-outline px-6 py-3 text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
