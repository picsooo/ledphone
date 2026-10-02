import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true, _count: { select: { orderItems: true } } },
      orderBy: [{ categoryId: "asc" }, { id: "asc" }],
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  return NextResponse.json({ products, categories });
}
