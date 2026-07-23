import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type RouteParams = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await req.json();
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: body,
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
  }
}
