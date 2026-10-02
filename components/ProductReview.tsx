"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";

type Category = { id: number; name: string; icon: string };
type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  buyPrice: number;
  sellPrice: number;
  image: string;
  compatible: string;
  stock: number;
  featured: boolean;
  categoryId: number;
  category: Category;
  _count: { orderItems: number };
};
type Draft = {
  name: string;
  description: string;
  compatible: string;
  image: string;
  sellPrice: string;
  buyPrice: string;
  stock: string;
  categoryId: string;
};

const DONE_KEY = "ledphone-revue-validés";

const toDraft = (p: Product): Draft => ({
  name: p.name,
  description: p.description,
  compatible: p.compatible,
  image: p.image,
  sellPrice: String(p.sellPrice),
  buyPrice: String(p.buyPrice),
  stock: String(p.stock),
  categoryId: String(p.categoryId),
});

// Resize the picked photo in the browser and keep it as a compact JPEG
function resizeImage(file: File, max = 900, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Lecture impossible"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Image invalide"));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProductReview({ initialId }: { initialId?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [edit, setEdit] = useState<{ id: number; d: Draft } | null>(null);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [modified, setModified] = useState<Set<number>>(new Set());
  const [deleted, setDeleted] = useState(0);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const [phase, setPhase] = useState<"review" | "resume" | "paused">("review");
  const [saving, setSaving] = useState(false);
  const [onlyTodo, setOnlyTodo] = useState(false);
  const [catFilter, setCatFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  const [lastSaved, setLastSaved] = useState<{ name: string; slug: string; price: number } | null>(null);
  const [toast, setToast] = useState<{ text: string; tone: "ok" | "err" } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);
  const [showUrl, setShowUrl] = useState(false);

  const flash = (text: string, tone: "ok" | "err" = "ok") => {
    setToast({ text, tone });
    setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/review-state").then((r) => r.json()).catch(() => ({ state: null })),
    ])
      .then(([d, r]) => {
        const prods: Product[] = d.products || [];
        const st = r.state as { done: number[]; modified: number[]; deleted: number; lastId: number | null; startedAt: string } | null;
        let doneIds = new Set<number>(st?.done || []);
        // Older progress kept in this browser before it was saved on the server
        if (!st) {
          try { doneIds = new Set(JSON.parse(localStorage.getItem(DONE_KEY) || "[]")); } catch {}
        }
        const modIds = new Set<number>(st?.modified || []);
        setProducts(prods);
        setCategories(d.categories || []);
        setDone(doneIds);
        setModified(modIds);
        setDeleted(st?.deleted || 0);
        if (st?.startedAt) setStartedAt(st.startedAt);

        if (initialId) {
          const i = prods.findIndex((p) => p.id === initialId);
          if (i >= 0) setIndex(i);
        } else {
          // Resume at the first unchecked product from where they stopped
          const from = Math.max(0, prods.findIndex((p) => p.id === st?.lastId));
          const order = [...prods.slice(from), ...prods.slice(0, from)];
          const next = order.find((p) => !doneIds.has(p.id));
          const i = next ? prods.indexOf(next) : 0;
          setIndex(i);
          const remaining = prods.filter((p) => !doneIds.has(p.id)).length;
          const started = doneIds.size > 0 || modIds.size > 0 || (st?.deleted || 0) > 0;
          if (started && remaining > 0) setPhase("resume");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [initialId]);

  const persist = useCallback(
    (state: { done: Set<number>; modified: Set<number>; deleted: number; lastId: number | null; startedAt: string }) =>
      fetch("/api/admin/review-state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({ ...state, done: [...state.done], modified: [...state.modified] }),
      }).then((r) => r.ok),
    []
  );

  const saveDone = (next: Set<number>) => setDone(next);

  const list = useMemo(
    () =>
      products.filter(
        (p) => (catFilter === "all" || String(p.categoryId) === catFilter) && (!onlyTodo || !done.has(p.id))
      ),
    [products, catFilter, onlyTodo, done]
  );

  const safeIndex = Math.min(index, Math.max(0, list.length - 1));
  const current = list[safeIndex];

  const draft: Draft | null = current ? (edit && edit.id === current.id ? edit.d : toDraft(current)) : null;
  const setDraft = (d: Draft) => { if (current) setEdit({ id: current.id, d }); };

  const dirty = useMemo(() => {
    if (!current || !draft) return false;
    return JSON.stringify(toDraft(current)) !== JSON.stringify(draft);
  }, [current, draft]);

  // Auto-save progress (debounced) while reviewing
  const currentId = current?.id ?? null;
  useEffect(() => {
    if (loading || phase !== "review") return;
    const t = setTimeout(() => {
      persist({ done, modified, deleted, lastId: currentId, startedAt }).catch(() => {});
    }, 700);
    return () => clearTimeout(t);
  }, [loading, phase, done, modified, deleted, currentId, startedAt, persist]);

  const go = useCallback(
    (delta: number) => setIndex((i) => Math.min(Math.max(0, i + delta), Math.max(0, list.length - 1))),
    [list.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const set = (k: keyof Draft, v: string) => { if (draft) setDraft({ ...draft, [k]: v }); };

  // With "à revoir seulement", the validated product leaves the list, so the index already points to the next one
  const advanceAfter = () => { if (!onlyTodo) go(1); };

  const keep = async () => {
    if (!current || !draft) return;
    if (!draft.name.trim()) return flash("Le nom ne peut pas être vide.", "err");
    if (isNaN(Number(draft.sellPrice)) || draft.sellPrice === "") return flash("Prix de vente invalide.", "err");
    setBusy(true);
    try {
      if (dirty) {
        const res = await fetch(`/api/products/${current.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur");
        setProducts((ps) => ps.map((p) => (p.id === current.id ? data : p)));
        setLastSaved({ name: data.name, slug: data.slug, price: data.sellPrice });
        setModified((m) => new Set(m).add(current.id));
      }
      const next = new Set(done);
      next.add(current.id);
      saveDone(next);
      flash(dirty ? "Modifications enregistrées ✓" : "Produit validé ✓");
      setEdit(null);
      advanceAfter();
    } catch (e) {
      flash(e instanceof Error ? e.message : "Erreur réseau", "err");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!current) return;
    if (!confirm(`Supprimer définitivement « ${current.name} » ?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/products/${current.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setProducts((ps) => ps.filter((p) => p.id !== current.id));
      setDeleted((n) => n + 1);
      flash("Produit supprimé");
    } catch (e) {
      flash(e instanceof Error ? e.message : "Erreur réseau", "err");
    } finally {
      setBusy(false);
    }
  };

  const onPhoto = async (file?: File) => {
    if (!file) return;
    try {
      const data = await resizeImage(file);
      set("image", data);
    } catch {
      flash("Impossible de lire cette photo.", "err");
    }
  };

  const total = products.length;
  const validated = products.filter((p) => done.has(p.id)).length;
  const pct = total ? Math.round((validated / total) * 100) : 0;
  const remaining = total - validated;
  const modifiedCount = products.filter((p) => modified.has(p.id)).length;

  const pauseForLater = async () => {
    if (dirty && !confirm("Ce produit a des modifications non enregistrées. Les abandonner ?")) return;
    setSaving(true);
    const ok = await persist({ done, modified, deleted, lastId: currentId, startedAt }).catch(() => false);
    setSaving(false);
    if (!ok) return flash("Impossible de sauvegarder, réessayez.", "err");
    setEdit(null);
    setPhase("paused");
  };

  const restart = async () => {
    if (!confirm("Recommencer la vérification depuis le premier produit ?")) return;
    const now = new Date().toISOString();
    setDone(new Set());
    setModified(new Set());
    setDeleted(0);
    setStartedAt(now);
    setIndex(0);
    setOnlyTodo(false);
    setCatFilter("all");
    setPhase("review");
  };

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

  const recap = (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
      {[
        { n: validated, l: "vérifiés", c: "text-emerald-600" },
        { n: modifiedCount, l: "modifiés", c: "text-sky-600" },
        { n: deleted, l: "supprimés", c: "text-red-500" },
        { n: remaining, l: "restants", c: "text-slate-900" },
      ].map((x) => (
        <div key={x.l} className="bg-slate-50 rounded-xl p-4 text-center">
          <div className={`text-3xl font-black ${x.c}`}>{x.n}</div>
          <div className="text-xs text-slate-500 mt-1">{x.l}</div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Chargement des produits…</div>;
  }

  if (phase !== "review") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
          {phase === "resume" ? (
            <>
              <div className="text-4xl mb-2">👋</div>
              <h1 className="text-2xl font-black text-slate-900">Bon retour !</h1>
              <p className="text-slate-500 mt-1">Vérification commencée le {fmtDate(startedAt)}. Voici où tu en es :</p>
              {recap}
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
              </div>
              <button onClick={() => setPhase("review")} className="w-full h-12 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500">
                Reprendre là où je me suis arrêté →
              </button>
              <button onClick={restart} className="w-full mt-3 text-sm text-slate-400 underline">
                Recommencer depuis le début
              </button>
            </>
          ) : (
            <>
              <div className="text-4xl mb-2">💾</div>
              <h1 className="text-2xl font-black text-slate-900">C&apos;est enregistré</h1>
              <p className="text-slate-500 mt-1">
                Il te reste <b className="text-slate-900">{remaining} produit{remaining > 1 ? "s" : ""}</b> à vérifier.
                À ta prochaine connexion, tu reprendras exactement ici.
              </p>
              {recap}
              <button onClick={() => setPhase("review")} className="w-full h-12 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500">
                Finalement, je continue
              </button>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Link href="/admin" className="h-11 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold flex items-center justify-center">
                  Tableau de bord
                </Link>
                <form action={logoutAction}>
                  <button type="submit" className="w-full h-11 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold">
                    Se déconnecter
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <Link href="/admin" className="text-slate-400 hover:text-sky-500 text-sm">← Admin</Link>
          <h1 className="font-black text-slate-900">Revue des produits</h1>
          <div className="flex-1 min-w-[140px]">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="text-xs text-slate-500 mt-1">{validated} / {total} validés ({pct}%)</div>
          </div>
          <select value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setIndex(0); }} className="input-premium !py-1.5 !w-auto text-sm">
            <option value="all">Toutes catégories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={onlyTodo} onChange={(e) => { setOnlyTodo(e.target.checked); setIndex(0); }} />
            À revoir seulement
          </label>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 pb-52">
        {!current || !draft ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-slate-900 font-bold text-lg">Aucun produit à revoir ici.</p>
            {onlyTodo && validated > 0 && (
              <button onClick={restart} className="mt-4 text-sm text-slate-500 underline">
                Recommencer la revue depuis le début
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3 text-sm text-slate-500">
              <span>Produit {safeIndex + 1} sur {list.length}</span>
              <span className="flex items-center gap-2">
                {done.has(current.id) && <span className="text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-xs font-semibold">Validé</span>}
                {dirty && <span className="text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-semibold">Modifié, non enregistré</span>}
                <Link href={`/produits/${current.slug}`} target="_blank" className="hover:text-sky-500">Voir sur le site ↗</Link>
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden grid md:grid-cols-2">
              {/* Photo */}
              <div className="bg-slate-50 p-5 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="relative aspect-square rounded-xl overflow-hidden bg-white border border-slate-100 flex items-center justify-center group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={draft.image} alt={draft.name} className="w-full h-full object-contain" />
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    Toucher pour changer
                  </span>
                  {draft.image !== current.image && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">Nouvelle photo</span>
                  )}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { onPhoto(e.target.files?.[0]); e.target.value = ""; }} />
                <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { onPhoto(e.target.files?.[0]); e.target.value = ""; }} />
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => fileRef.current?.click()} className="py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700">
                    🖼️ Galerie
                  </button>
                  <button type="button" onClick={() => camRef.current?.click()} className="py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-semibold">
                    📷 Prendre une photo
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs">
                  {draft.image !== current.image ? (
                    <button type="button" onClick={() => set("image", current.image)} className="text-slate-500 underline">Remettre l&apos;ancienne photo</button>
                  ) : <span />}
                  <button type="button" onClick={() => setShowUrl((v) => !v)} className="text-slate-400 underline">
                    {showUrl ? "Masquer le lien" : "Utiliser un lien d'image"}
                  </button>
                </div>
                {showUrl && (
                  <input
                    type="text"
                    value={draft.image.startsWith("data:") ? "" : draft.image}
                    onChange={(e) => set("image", e.target.value)}
                    placeholder="Coller un lien d'image (https://…)"
                    className="input-premium text-xs"
                  />
                )}
              </div>

              {/* Fields */}
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nom</label>
                  <input value={draft.name} onChange={(e) => set("name", e.target.value)} className="input-premium font-semibold" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Prix de vente (DA)</label>
                    <input type="number" inputMode="numeric" value={draft.sellPrice} onChange={(e) => set("sellPrice", e.target.value)} className="input-premium text-lg font-bold text-sky-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Prix d&apos;achat (DA)</label>
                    <input type="number" inputMode="numeric" value={draft.buyPrice} onChange={(e) => set("buyPrice", e.target.value)} className="input-premium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Catégorie</label>
                    <select value={draft.categoryId} onChange={(e) => set("categoryId", e.target.value)} className="input-premium">
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Stock</label>
                    <input type="number" inputMode="numeric" value={draft.stock} onChange={(e) => set("stock", e.target.value)} className="input-premium" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Compatible avec</label>
                  <input value={draft.compatible} onChange={(e) => set("compatible", e.target.value)} className="input-premium" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
                  <textarea value={draft.description} onChange={(e) => set("description", e.target.value)} rows={6} className="input-premium resize-y" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action bar */}
      {(current || lastSaved || total > 0) && (
        <div className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-slate-100" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          {lastSaved && (
            <div className="bg-emerald-50 border-b border-emerald-100">
              <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-3 text-sm">
                <span className="text-emerald-700 truncate flex-1">
                  ✓ <b>{lastSaved.name}</b> enregistré à {lastSaved.price.toLocaleString("fr-DZ")} DA
                </span>
                <a href={`/produits/${lastSaved.slug}`} target="_blank" rel="noreferrer" className="shrink-0 font-semibold text-emerald-700 underline">
                  Vérifier sur le site ↗
                </a>
                <button onClick={() => setLastSaved(null)} className="text-emerald-500" aria-label="Fermer">✕</button>
              </div>
            </div>
          )}
          <div className="max-w-5xl mx-auto px-4 pt-2.5 flex items-center justify-between gap-3 text-sm">
            <span className="text-slate-600">
              {remaining > 0 ? (
                <>Il te reste <b className="text-slate-900">{remaining} produit{remaining > 1 ? "s" : ""}</b> à vérifier</>
              ) : (
                <b className="text-emerald-600">🎉 Tous les produits sont vérifiés</b>
              )}
            </span>
            <button onClick={pauseForLater} disabled={saving || busy} className="shrink-0 font-semibold text-slate-500 hover:text-slate-900 underline disabled:opacity-50">
              {saving ? "Sauvegarde…" : remaining > 0 ? "Continuer plus tard" : "Terminer"}
            </button>
          </div>
          {current && draft && (
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2">
            <button onClick={() => go(-1)} disabled={safeIndex === 0 || busy} className="w-11 h-11 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-30" aria-label="Précédent">←</button>
            <button onClick={remove} disabled={busy} className="px-4 h-11 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 disabled:opacity-50">
              Supprimer
            </button>
            {dirty && (
              <button onClick={() => setEdit(null)} disabled={busy} className="px-4 h-11 rounded-xl border border-slate-200 text-slate-600 text-sm hidden sm:block">
                Annuler les modifs
              </button>
            )}
            <button onClick={keep} disabled={busy} className="flex-1 h-11 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 disabled:opacity-50">
              {busy ? "…" : dirty ? "Enregistrer et suivant →" : "Garder ✓ et suivant →"}
            </button>
            <button onClick={() => go(1)} disabled={safeIndex >= list.length - 1 || busy} className="w-11 h-11 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-30" aria-label="Suivant">→</button>
          </div>
          )}
        </div>
      )}

      {toast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-30 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg ${toast.tone === "ok" ? "bg-slate-900 text-white" : "bg-red-600 text-white"}`}>
          {toast.text}
        </div>
      )}
    </div>
  );
}
