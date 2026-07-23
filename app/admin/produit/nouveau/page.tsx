"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Category = { id: number; name: string; icon: string };

export default function NouveauProduitPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    buyPrice: "",
    sellPrice: "",
    image: "",
    compatible: "",
    stock: "10",
    featured: false,
    categoryId: "",
  });

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  const update = (field: string, value: string | boolean) => {
    setForm((f) => {
      const next = { ...f, [field]: value };
      // Auto-generate slug from name
      if (field === "name" && typeof value === "string") {
        next.slug = value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.categoryId) { setError("Veuillez sélectionner une catégorie."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          buyPrice: parseFloat(form.buyPrice),
          sellPrice: parseFloat(form.sellPrice),
          stock: parseInt(form.stock),
          categoryId: parseInt(form.categoryId),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin");
      } else {
        setError(data.error || "Une erreur est survenue.");
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  const margin = form.buyPrice && form.sellPrice
    ? Math.round(((parseFloat(form.sellPrice) - parseFloat(form.buyPrice)) / parseFloat(form.buyPrice)) * 100)
    : null;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-slate-400 hover:text-sky-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <span className="section-tag mb-2">Admin</span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Nouveau produit</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-slate-900 font-bold mb-4 text-sm uppercase tracking-wider">Informations générales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom du produit *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Ex: Coque Silicone Apple Originale"
                  className="input-premium"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Slug (URL) *</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => update("slug", e.target.value)}
                  placeholder="coque-silicone-apple-originale"
                  className="input-premium font-mono text-sm"
                />
                <p className="text-slate-400 text-xs mt-1">Généré automatiquement. Modifiable.</p>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Description détaillée du produit..."
                  rows={3}
                  className="input-premium resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Compatible *</label>
                <input
                  type="text"
                  required
                  value={form.compatible}
                  onChange={(e) => update("compatible", e.target.value)}
                  placeholder="Ex: iPhone 13 → 17 Pro Max"
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Catégorie *</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => update("categoryId", e.target.value)}
                  className="input-premium"
                >
                  <option value="">Sélectionner</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-slate-900 font-bold mb-4 text-sm uppercase tracking-wider">Prix & stock</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prix d&apos;achat (DA) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.buyPrice}
                  onChange={(e) => update("buyPrice", e.target.value)}
                  placeholder="1500"
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prix de vente (DA) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.sellPrice}
                  onChange={(e) => update("sellPrice", e.target.value)}
                  placeholder="2800"
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Stock *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.stock}
                  onChange={(e) => update("stock", e.target.value)}
                  placeholder="10"
                  className="input-premium"
                />
              </div>
            </div>
            {margin !== null && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <span className="text-emerald-600 font-bold text-sm">Marge calculée : +{margin}%</span>
                <span className="text-emerald-500 text-sm">
                  ({(parseFloat(form.sellPrice) - parseFloat(form.buyPrice)).toLocaleString("fr-DZ")} DA de bénéfice par unité)
                </span>
              </div>
            )}
          </div>

          {/* Image */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-slate-900 font-bold mb-4 text-sm uppercase tracking-wider">Image</h2>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Chemin de l&apos;image *</label>
              <input
                type="text"
                required
                value={form.image}
                onChange={(e) => update("image", e.target.value)}
                placeholder="/images/nom-du-fichier.jpg"
                className="input-premium font-mono text-sm"
              />
              <p className="text-slate-400 text-xs mt-1">
                Placez le fichier dans <code className="bg-slate-100 px-1 rounded">public/images/</code> et entrez le chemin ici.
              </p>
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => update("featured", e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors ${form.featured ? "bg-sky-500" : "bg-slate-200"}`} />
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-4" : ""}`} />
                </div>
                <span className="text-sm font-semibold text-slate-700">Coup de cœur (mis en avant sur l&apos;accueil)</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">
              ⚠️ {error}
            </div>
          )}

          <div className="flex justify-between">
            <Link href="/admin" className="btn-outline px-6 py-3 text-sm">
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-3 text-sm flex items-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Création en cours...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Créer le produit
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
