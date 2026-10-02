"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Result = {
  id: number;
  name: string;
  slug: string;
  image: string;
  sellPrice: number;
  compatible: string;
  category: { name: string };
};

export default function SearchBox({ dark }: { dark: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return;
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d) => { setResults(d.results || []); setTotal(d.total || 0); setActive(-1); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 200);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = () => { setOpen(false); setQ(""); setResults([]); setTotal(0); };
  const short = q.trim().length < 2;

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, -1)); }
    if (e.key === "Enter" && !short) {
      e.preventDefault();
      const target = active >= 0 ? `/produits/${results[active].slug}` : `/produits?q=${encodeURIComponent(q.trim())}`;
      close();
      router.push(target);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Rechercher"
        className={`p-2 rounded-full transition-all ${dark ? "text-slate-300 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-sky-500 hover:bg-sky-50"}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={close}>
          <div className="max-w-2xl mx-auto mt-3 sm:mt-20 px-3" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 border-b border-slate-100">
                <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
                </svg>
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={onInputKey}
                  placeholder="Coque iPhone 15, chargeur, câble…"
                  className="flex-1 py-4 text-base text-slate-900 outline-none bg-transparent"
                  enterKeyHint="search"
                />
                {loading && <span className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />}
                <button onClick={close} className="text-xs text-slate-400 border border-slate-200 rounded-md px-2 py-1">Échap</button>
              </div>

              <div className="max-h-[65vh] overflow-y-auto">
                {short ? (
                  <p className="px-4 py-6 text-sm text-slate-400 text-center">Tapez au moins 2 lettres</p>
                ) : results.length === 0 && !loading ? (
                  <p className="px-4 py-6 text-sm text-slate-500 text-center">Aucun produit pour « {q.trim()} »</p>
                ) : (
                  <>
                    {results.map((r, i) => (
                      <Link
                        key={r.id}
                        href={`/produits/${r.slug}`}
                        onClick={close}
                        onMouseEnter={() => setActive(i)}
                        className={`flex items-center gap-3 px-4 py-3 border-b border-slate-50 ${active === i ? "bg-sky-50" : ""}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={r.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-900 truncate">{r.name}</div>
                          <div className="text-xs text-slate-400 truncate">{r.category.name}{r.compatible ? ` · ${r.compatible}` : ""}</div>
                        </div>
                        <div className="text-sm font-bold text-sky-600 whitespace-nowrap">{r.sellPrice.toLocaleString("fr-DZ")} DA</div>
                      </Link>
                    ))}
                    {total > results.length && (
                      <Link
                        href={`/produits?q=${encodeURIComponent(q.trim())}`}
                        onClick={close}
                        className="block px-4 py-3 text-sm font-semibold text-sky-600 text-center hover:bg-sky-50"
                      >
                        Voir les {total} résultats →
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
