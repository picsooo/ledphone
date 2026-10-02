import { requireAdmin } from "@/lib/auth";
import ProductReview from "@/components/ProductReview";

export const metadata = { title: "Revue des produits — LED Phone" };
export const dynamic = "force-dynamic";

export default async function RevuePage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await requireAdmin();
  const { id } = await searchParams;
  return <ProductReview initialId={id ? parseInt(id) : undefined} />;
}
