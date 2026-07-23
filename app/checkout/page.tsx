"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/CartProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WILAYAS, ALGERIA_WILAYAS_COMMUNES } from "@/lib/algeria";
import { getDeliveryFee, type DeliveryType } from "@/lib/delivery";

const SAVED_INFO_KEY = "ledphone_client_info";

type Step = "cart" | "info" | "confirm";

type FormState = {
  name: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  note: string;
  deliveryType: DeliveryType;
};

const DEFAULT_FORM: FormState = {
  name: "",
  phone: "",
  wilaya: "",
  commune: "",
  address: "",
  note: "",
  deliveryType: "domicile",
};

export default function CheckoutPage() {
  const { items, total: subtotal, clearCart, count, loaded } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>("cart");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);

  // Load saved client info from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_INFO_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FormState>;
        setForm((f) => ({
          ...f,
          name: parsed.name || "",
          phone: parsed.phone || "",
          wilaya: parsed.wilaya || "",
          commune: parsed.commune || "",
          address: parsed.address || "",
        }));
      }
    } catch {}
  }, []);

  const communes = form.wilaya ? (ALGERIA_WILAYAS_COMMUNES[form.wilaya] ?? []) : [];
  const deliveryFee = form.wilaya ? getDeliveryFee(form.wilaya, form.deliveryType) : 0;
  const total = subtotal + deliveryFee;

  const updateForm = (field: keyof FormState, value: string) => {
    setForm((f) => {
      const next = { ...f, [field]: value };
      // Reset commune when wilaya changes
      if (field === "wilaya") next.commune = "";
      return next;
    });
  };

  const saveClientInfo = () => {
    try {
      const toSave: Partial<FormState> = {
        name: form.name,
        phone: form.phone,
        wilaya: form.wilaya,
        commune: form.commune,
        address: form.address,
      };
      localStorage.setItem(SAVED_INFO_KEY, JSON.stringify(toSave));
    } catch {}
  };

  const isFormValid =
    form.name.trim() &&
    form.phone.trim().length >= 9 &&
    form.wilaya &&
    form.commune &&
    form.address.trim();

  const handleSubmit = async () => {
    setSubmitError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, deliveryFee, items }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        saveClientInfo();
        clearCart();
        router.push(`/commande-confirmee?id=${data.orderId}`);
      } else {
        if (data.staleCart) {
          clearCart();
          router.push("/produits");
        } else {
          setSubmitError(data.detail || data.error || "Une erreur est survenue. Veuillez réessayer.");
        }
      }
    } catch {
      setSubmitError("Erreur réseau. Vérifiez votre connexion et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  if (!loaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <svg className="w-10 h-10 text-sky-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  if (count === 0 && !orderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h1 className="text-3xl font-black text-slate-900 mb-3">Votre panier est vide</h1>
        <Link href="/produits" className="btn-primary inline-block px-8 py-3.5 text-sm mt-4">
          Voir les produits
        </Link>
      </div>
    );
  }

  const steps: { id: Step; label: string; icon: string }[] = [
    { id: "cart", label: "Panier", icon: "🛒" },
    { id: "info", label: "Livraison", icon: "📦" },
    { id: "confirm", label: "Confirmation", icon: "✅" },
  ];

  const stepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Votre commande</h1>
          <p className="text-slate-500">Livraison à domicile partout en Algérie</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => i < stepIndex && setStep(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  s.id === step ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30" :
                  i < stepIndex ? "bg-emerald-500 text-white" :
                  "bg-white text-slate-400 border border-slate-200"
                }`}
              >
                <span>{i < stepIndex ? "✓" : s.icon}</span>
                <span className="hidden sm:block">{s.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 transition-all ${i < stepIndex ? "bg-emerald-400" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="lg:col-span-2">

            {/* STEP 1 — Cart review */}
            {step === "cart" && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  🛒 Récapitulatif de votre panier
                </h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-white flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-slate-900 font-semibold text-sm leading-tight line-clamp-2">{item.name}</h3>
                        <p className="text-slate-400 text-xs mt-0.5">Qté : {item.quantity}</p>
                      </div>
                      <div className="text-sky-500 font-black text-sm shrink-0">
                        {(item.sellPrice * item.quantity).toLocaleString("fr-DZ")} DA
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setStep("info")}
                    className="btn-primary px-8 py-3.5 text-sm flex items-center gap-2"
                  >
                    Continuer vers la livraison
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 — Delivery info */}
            {step === "info" && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  📦 Informations de livraison
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom complet *</label>
                    <input
                      type="text"
                      placeholder="Votre nom et prénom"
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      className="input-premium"
                    />
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Téléphone *</label>
                    <input
                      type="tel"
                      placeholder="0X XX XX XX XX"
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      className="input-premium"
                    />
                  </div>

                  {/* Wilaya */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Wilaya *</label>
                    <select
                      value={form.wilaya}
                      onChange={(e) => updateForm("wilaya", e.target.value)}
                      className="input-premium"
                    >
                      <option value="">— Sélectionner une wilaya —</option>
                      {WILAYAS.map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>

                  {/* Commune */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Commune *</label>
                    {form.wilaya ? (
                      <select
                        value={form.commune}
                        onChange={(e) => updateForm("commune", e.target.value)}
                        className="input-premium"
                        disabled={communes.length === 0}
                      >
                        <option value="">— Sélectionner une commune —</option>
                        {communes.map((c, i) => (
                          <option key={`${c}-${i}`} value={c}>{c}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="input-premium text-slate-400 cursor-not-allowed select-none">
                        Sélectionnez d&apos;abord une wilaya
                      </div>
                    )}
                  </div>

                  {/* Mode de livraison */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Mode de livraison *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["domicile", "stopdesk"] as DeliveryType[]).map((type) => {
                        const fee = form.wilaya ? getDeliveryFee(form.wilaya, type) : null;
                        const isSelected = form.deliveryType === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => updateForm("deliveryType", type)}
                            className={`flex flex-col items-start gap-1 p-4 rounded-2xl border-2 transition-all text-left ${
                              isSelected
                                ? "border-sky-500 bg-sky-50"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <span className="text-xl">{type === "domicile" ? "🏠" : "🏪"}</span>
                            <span className={`font-bold text-sm ${isSelected ? "text-sky-700" : "text-slate-700"}`}>
                              {type === "domicile" ? "À domicile" : "Stop desk"}
                            </span>
                            <span className={`text-xs ${isSelected ? "text-sky-500" : "text-slate-400"}`}>
                              {fee !== null ? `${fee.toLocaleString("fr-DZ")} DA` : "Sélectionnez une wilaya"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Adresse */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      {form.deliveryType === "stopdesk" ? "Point de retrait (stop desk)" : "Adresse complète"} *
                    </label>
                    <input
                      type="text"
                      placeholder={form.deliveryType === "stopdesk" ? "Nom ou adresse du point de retrait..." : "Rue, numéro, quartier..."}
                      value={form.address}
                      onChange={(e) => updateForm("address", e.target.value)}
                      className="input-premium"
                    />
                  </div>

                  {/* Note */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Note pour le livreur (optionnel)</label>
                    <textarea
                      placeholder="Exemple : appeler avant de venir, porte rouge..."
                      value={form.note}
                      onChange={(e) => updateForm("note", e.target.value)}
                      rows={3}
                      className="input-premium resize-none"
                    />
                  </div>
                </div>

                {/* Payment info */}
                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                  <span className="text-2xl">💵</span>
                  <div>
                    <div className="font-bold text-emerald-800 text-sm">Paiement à la livraison</div>
                    <div className="text-emerald-700 text-xs mt-0.5">
                      Vous payez uniquement à la réception de votre commande. Aucun paiement en ligne requis.
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep("cart")} className="btn-outline px-6 py-3 text-sm">
                    ← Retour
                  </button>
                  <button
                    onClick={() => isFormValid && setStep("confirm")}
                    disabled={!isFormValid}
                    className="btn-primary px-8 py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Vérifier ma commande →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 — Confirm */}
            {step === "confirm" && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  ✅ Vérification finale
                </h2>

                {/* Recap info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "Nom", value: form.name },
                    { label: "Téléphone", value: form.phone },
                    { label: "Wilaya", value: form.wilaya },
                    { label: "Commune", value: form.commune },
                    { label: "Livraison", value: form.deliveryType === "domicile" ? "🏠 À domicile" : "🏪 Stop desk" },
                    { label: form.deliveryType === "stopdesk" ? "Point de retrait" : "Adresse", value: form.address },
                    ...(form.note ? [{ label: "Note", value: form.note }] : []),
                  ].map((f) => (
                    <div key={f.label} className="bg-slate-50 rounded-xl p-3">
                      <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-0.5">{f.label}</div>
                      <div className="text-slate-900 font-semibold text-sm">{f.value}</div>
                    </div>
                  ))}
                </div>

                {/* Products recap */}
                <div className="space-y-2 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm py-2 border-b border-slate-100">
                      <span className="text-slate-700">{item.name} <span className="text-slate-400">×{item.quantity}</span></span>
                      <span className="text-slate-900 font-bold">{(item.sellPrice * item.quantity).toLocaleString("fr-DZ")} DA</span>
                    </div>
                  ))}
                </div>

                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm text-sky-700">
                    <span>Produits</span>
                    <span>{subtotal.toLocaleString("fr-DZ")} DA</span>
                  </div>
                  <div className="flex justify-between text-sm text-sky-700">
                    <span>Livraison {form.deliveryType === "stopdesk" ? "(stop desk)" : "(domicile)"}</span>
                    <span>{deliveryFee.toLocaleString("fr-DZ")} DA</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-sky-200">
                    <span className="text-sky-700 font-bold">Total à payer à la livraison</span>
                    <span className="text-sky-600 font-black text-2xl">{total.toLocaleString("fr-DZ")} DA</span>
                  </div>
                </div>

                {submitError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {submitError}
                  </div>
                )}

                <div className="flex justify-between">
                  <button onClick={() => setStep("info")} className="btn-outline px-6 py-3 text-sm">
                    ← Modifier
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary px-8 py-3.5 text-sm disabled:opacity-70 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      <>🚀 Confirmer ma commande</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sticky top-20">
              <h3 className="text-slate-900 font-bold mb-4">Résumé</h3>
              <div className="space-y-3 mb-4">
                {items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-700 text-xs font-medium line-clamp-1">{item.name}</div>
                      <div className="text-slate-400 text-xs">×{item.quantity}</div>
                    </div>
                    <div className="text-sky-500 text-xs font-bold shrink-0">
                      {(item.sellPrice * item.quantity).toLocaleString()} DA
                    </div>
                  </div>
                ))}
                {items.length > 3 && (
                  <div className="text-slate-400 text-xs text-center">+{items.length - 3} autre(s) produit(s)</div>
                )}
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Sous-total</span>
                  <span>{subtotal.toLocaleString("fr-DZ")} DA</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-500">Livraison {form.deliveryType === "stopdesk" ? "(stop desk)" : "(domicile)"}</span>
                  {deliveryFee > 0
                    ? <span className="text-slate-700">{deliveryFee.toLocaleString("fr-DZ")} DA</span>
                    : <span className="text-slate-400 italic text-xs">selon la wilaya</span>
                  }
                </div>
                <div className="flex justify-between font-black text-lg text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total</span>
                  <span className="text-sky-500">{total.toLocaleString("fr-DZ")} DA</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-6 space-y-2">
                {[
                  { icon: "💵", text: "Paiement à la livraison" },
                  { icon: "🔒", text: "Commande 100% sécurisée" },
                  { icon: "🚚", text: "Livraison partout en Algérie" },
                  { icon: "↩️", text: "Retour possible sous 7 jours" },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2 text-slate-500 text-xs">
                    <span className="text-base">{b.icon}</span>
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
