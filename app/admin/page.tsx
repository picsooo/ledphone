import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import DeleteProductButton from "@/components/DeleteProductButton";
import LogoutButton from "@/components/LogoutButton";

export const metadata = { title: "Admin — LED Phone" };

export default async function AdminPage() {
  await requireAdmin();

  const [products, categories, orders] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ include: { _count: { select: { products: true } } } }),
    prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="section-tag mb-3">Dashboard</span>
            <h1 className="text-3xl font-black text-slate-900 mt-3">Administration</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/revue"
              className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-700 transition-colors"
            >
              Revue des produits
            </Link>
            <Link
              href="/admin/produit/nouveau"
              className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouveau produit
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Produits", value: products.length, icon: "📦", bg: "bg-sky-50", border: "border-sky-100", text: "text-sky-600" },
            { label: "Catégories", value: categories.length, icon: "🗂️", bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-600" },
            { label: "Commandes", value: orders.length, icon: "🛒", bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600" },
            { label: "En attente", value: pendingOrders, icon: "⏳", bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-600" },
            { label: "Revenu total", value: `${totalRevenue.toLocaleString("fr-DZ")} DA`, icon: "💰", bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-600" },
          ].map((stat) => (
            <div key={stat.label} className={`bg-white rounded-2xl border ${stat.border} shadow-sm p-5`}>
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center text-xl mb-3`}>
                {stat.icon}
              </div>
              <div className={`text-2xl font-black ${stat.text} mb-0.5`}>{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Products table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-slate-900 font-bold">Produits ({products.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left text-slate-500 font-semibold">Produit</th>
                  <th className="px-4 py-3 text-left text-slate-500 font-semibold">Catégorie</th>
                  <th className="px-4 py-3 text-right text-slate-500 font-semibold">P. achat</th>
                  <th className="px-4 py-3 text-right text-slate-500 font-semibold">P. vente</th>
                  <th className="px-4 py-3 text-right text-slate-500 font-semibold">Marge</th>
                  <th className="px-4 py-3 text-center text-slate-500 font-semibold">Stock</th>
                  <th className="px-4 py-3 text-center text-slate-500 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const margin = product.sellPrice - product.buyPrice;
                  const marginPct = Math.round((margin / product.buyPrice) * 100);
                  return (
                    <tr key={product.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                            <Image src={product.image} alt={product.name} fill sizes="40px" className="object-cover" />
                          </div>
                          <div>
                            <div className="text-slate-900 font-semibold leading-tight line-clamp-1">{product.name}</div>
                            <div className="text-slate-400 text-xs">{product.compatible}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {product.category.icon} {product.category.name}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-400">{product.buyPrice.toLocaleString()} DA</td>
                      <td className="px-4 py-3 text-right text-sky-500 font-bold">{product.sellPrice.toLocaleString()} DA</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-emerald-600 font-semibold text-xs bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          +{marginPct}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          product.stock <= 5 ? "bg-orange-100 text-orange-600 border border-orange-200" : "bg-slate-100 text-slate-500"
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/produits/${product.slug}`}
                            className="text-slate-400 hover:text-sky-500 transition-colors"
                            title="Voir"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <Link
                            href={`/admin/revue?id=${product.id}`}
                            className="text-slate-400 hover:text-amber-500 transition-colors"
                            title="Modifier"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <DeleteProductButton id={product.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-slate-900 font-bold">Commandes récentes</h2>
            <span className="text-slate-400 text-xs">{orders.length} commandes</span>
          </div>
          {orders.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <div className="text-4xl mb-3">📋</div>
              <p>Aucune commande pour le moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left text-slate-500 font-semibold">#</th>
                    <th className="px-4 py-3 text-left text-slate-500 font-semibold">Client</th>
                    <th className="px-4 py-3 text-left text-slate-500 font-semibold">Tél.</th>
                    <th className="px-4 py-3 text-left text-slate-500 font-semibold">Wilaya</th>
                    <th className="px-4 py-3 text-right text-slate-500 font-semibold">Total</th>
                    <th className="px-4 py-3 text-center text-slate-500 font-semibold">Statut</th>
                    <th className="px-4 py-3 text-left text-slate-500 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-400 text-xs font-mono">#{String(order.id).padStart(5, "0")}</td>
                      <td className="px-4 py-3 text-slate-900 font-semibold">{order.name}</td>
                      <td className="px-4 py-3">
                        <a href={`tel:${order.phone}`} className="text-sky-500 hover:underline">{order.phone}</a>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{(order as { wilaya?: string }).wilaya || "—"}</td>
                      <td className="px-4 py-3 text-right text-sky-500 font-bold">{order.total.toLocaleString()} DA</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          order.status === "completed"
                            ? "bg-emerald-100 text-emerald-600 border border-emerald-200"
                            : order.status === "pending"
                            ? "bg-amber-100 text-amber-600 border border-amber-200"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          {order.status === "pending" ? "En attente" : order.status === "completed" ? "Livré" : order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
