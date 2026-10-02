import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") || "").trim().slice(0, 60);
  if (q.length < 2) return NextResponse.json({ results: [], total: 0 });

  // Every word must match the name, the compatibility or the category
  const words = q.split(/\s+/).filter(Boolean).slice(0, 5);
  const where = {
    AND: words.map((w) => ({
      OR: [
        { name: { contains: w } },
        { compatible: { contains: w } },
        { category: { name: { contains: w } } },
      ],
    })),
  };

  const [results, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: { id: true, name: true, slug: true, image: true, sellPrice: true, compatible: true, category: { select: { name: true } } },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 8,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ results, total });
}
