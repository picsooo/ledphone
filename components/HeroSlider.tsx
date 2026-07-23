"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: 1,
    tag: "Collection 2026",
    title: "Protégez votre iPhone",
    titleAccent: "avec style",
    desc: "Découvrez notre sélection exclusive de coques haut de gamme, antichoc et MagSafe pour tous vos modèles iPhone.",
    cta: { label: "Explorer la collection", href: "/produits" },
    ctaSecondary: { label: "Passer commande", href: "/panier" },
    image: "/images/00000046-PHOTO-2026-04-26-17-08-09.jpg",
    badge: "🆕 Nouveautés",
    bg: "from-sky-50 via-white to-indigo-50",
    accent: "#0ea5e9",
  },
  {
    id: 2,
    tag: "Coques Premium",
    title: "Lacoste, BMW &",
    titleAccent: "marques premium",
    desc: "Des coques de marque pour afficher votre style. Qualité originale garantie, disponibles à El Achour.",
    cta: { label: "Voir le premium", href: "/produits?cat=premium" },
    ctaSecondary: { label: "Commander", href: "/panier" },
    image: "/images/00000103-PHOTO-2026-04-26-17-15-23.jpg",
    badge: "👑 Premium",
    bg: "from-amber-50 via-white to-orange-50",
    accent: "#f59e0b",
  },
  {
    id: 3,
    tag: "Technologie MagSafe",
    title: "Chargez sans fil,",
    titleAccent: "protégez toujours",
    desc: "Nos coques MagSafe sont compatibles avec tous les accessoires magnétiques Apple. Finition premium, protection maximale.",
    cta: { label: "Coques MagSafe", href: "/produits?cat=magsafe" },
    ctaSecondary: { label: "En savoir plus", href: "/produits" },
    image: "/images/00000039-PHOTO-2026-04-26-17-06-34.jpg",
    badge: "🔮 MagSafe",
    bg: "from-violet-50 via-white to-sky-50",
    accent: "#6366f1",
  },
  {
    id: 4,
    tag: "Coques Fashion",
    title: "Exprimez votre",
    titleAccent: "personnalité",
    desc: "Nœuds papillons, fleurs, paillettes — des designs tendance exclusifs pour se démarquer au quotidien.",
    cta: { label: "Voir les fashion", href: "/produits?cat=fashion" },
    ctaSecondary: { label: "Toute la boutique", href: "/produits" },
    image: "/images/00000223-PHOTO-2026-04-26-17-27-06.jpg",
    badge: "✨ Fashion",
    bg: "from-pink-50 via-white to-purple-50",
    accent: "#ec4899",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const goTo = useCallback((index: number, dir: "left" | "right" = "right") => {
    if (animating) return;
    setAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 600);
  }, [animating]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, "right");
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, "left");
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${slide.bg} transition-all duration-700`}
      style={{ minHeight: "88vh" }}>

      {/* Background decorative circles */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl transition-all duration-700"
        style={{ background: `radial-gradient(circle, ${slide.accent}22, transparent 70%)` }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: `radial-gradient(circle, ${slide.accent}33, transparent 70%)` }} />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center min-h-[88vh] gap-12 py-20">

        {/* TEXT SIDE */}
        <div className="flex-1 order-2 lg:order-1">
          {/* Badge */}
          <div key={`badge-${current}`}
            className="animate-fade-up inline-flex items-center gap-2 mb-6"
            style={{ animationDuration: "0.5s" }}>
            <span className="section-tag">{slide.badge}</span>
          </div>

          {/* Title */}
          <h1 key={`title-${current}`}
            className="animate-fade-up delay-100 text-5xl sm:text-6xl xl:text-7xl font-black text-slate-900 leading-[1.05] mb-5">
            {slide.title}
            <br />
            <span className="text-gradient">{slide.titleAccent}</span>
          </h1>

          {/* Desc */}
          <p key={`desc-${current}`}
            className="animate-fade-up delay-200 text-slate-500 text-lg leading-relaxed max-w-lg mb-8">
            {slide.desc}
          </p>

          {/* CTAs */}
          <div key={`cta-${current}`}
            className="animate-fade-up delay-300 flex flex-wrap gap-3">
            <Link href={slide.cta.href} className="btn-primary px-8 py-3.5 text-sm">
              {slide.cta.label}
              <svg className="inline-block w-4 h-4 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href={slide.ctaSecondary.href} className="btn-outline px-8 py-3.5 text-sm">
              {slide.ctaSecondary.label}
            </Link>
          </div>

          {/* Stats */}
          <div key={`stats-${current}`}
            className="animate-fade-up delay-400 mt-10 flex gap-8">
            {[
              { val: "23+", label: "Produits" },
              { val: "100%", label: "Original" },
              { val: "48h", label: "Livraison" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black text-slate-900">{s.val}</div>
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* IMAGE SIDE */}
        <div className="flex-1 order-1 lg:order-2 flex items-center justify-center">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 xl:w-[440px] xl:h-[440px]">
            {/* Glow behind image */}
            <div className="absolute inset-4 rounded-3xl blur-2xl opacity-30 transition-all duration-700"
              style={{ background: slide.accent }} />

            {/* Floating image container */}
            <div key={`img-${current}`}
              className={`animate-float relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white ${
                animating
                  ? direction === "right" ? "translate-x-8 opacity-0" : "-translate-x-8 opacity-0"
                  : "translate-x-0 opacity-100"
              } transition-all duration-500`}>
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl shadow-slate-200/80 px-4 py-3 flex items-center gap-2 border border-slate-100">
              <span className="text-lg">{slide.badge.split(" ")[0]}</span>
              <div>
                <div className="text-xs font-bold text-slate-900">{slide.tag}</div>
                <div className="text-[10px] text-slate-400">LED Phone</div>
              </div>
            </div>

            {/* Bottom stats bubble */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl shadow-slate-200/80 px-4 py-3 border border-slate-100">
              <div className="text-xs text-slate-400 mb-0.5">Stock disponible</div>
              <div className="text-sm font-black text-slate-900">23 produits ✅</div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-6">
        {/* Prev */}
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-md hover:shadow-lg hover:bg-white text-slate-600 hover:text-sky-500 flex items-center justify-center transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? "right" : "left")}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 h-2.5 bg-sky-500"
                  : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={next}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-md hover:shadow-lg hover:bg-white text-slate-600 hover:text-sky-500 flex items-center justify-center transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-slate-100 w-full">
        <div
          key={current}
          className="h-full bg-sky-500 transition-none"
          style={{ animation: "progress 5.5s linear forwards" }}
        />
      </div>
      <style>{`
        @keyframes progress { from { width: 0% } to { width: 100% } }
      `}</style>
    </section>
  );
}
