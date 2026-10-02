import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type RouteParams = { params: Promise<{ id: string }> };

const unauthorized = () => NextResponse.json({ error: "Non autorisé" }, { status: 401 });

export async function DELETE(_req: Request, { params }: RouteParams) {
  if (!(await getAdmin())) return unauthorized();
  const { id } = await params;
  const productId = parseInt(id);
  try {
    const used = await prisma.orderItem.count({ where: { productId } });
    if (used > 0) {
      return NextResponse.json(
        { error: `Ce produit figure dans ${used} commande(s), il ne peut pas être supprimé. Mettez son stock à 0 pour le retirer de la vente.` },
        { status: 409 }
      );
    }
    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  if (!(await getAdmin())) return unauthorized();
  const { id } = await params;
  const body = await req.json();

  // Only these fields can be edited
  const data: Record<string, unknown> = {};
  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
  if (typeof body.description === "string") data.description = body.description.trim();
  if (typeof body.compatible === "string") data.compatible = body.compatible.trim();
  if (typeof body.image === "string" && body.image.trim()) data.image = body.image.trim();
  if (body.sellPrice !== undefined && !isNaN(Number(body.sellPrice))) data.sellPrice = Number(body.sellPrice);
  if (body.buyPrice !== undefined && !isNaN(Number(body.buyPrice))) data.buyPrice = Number(body.buyPrice);
  if (body.stock !== undefined && !isNaN(Number(body.stock))) data.stock = Math.max(0, Math.round(Number(body.stock)));
  if (typeof body.featured === "boolean") data.featured = body.featured;
  if (body.categoryId !== undefined && !isNaN(Number(body.categoryId))) data.categoryId = Number(body.categoryId);

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data,
      include: { category: true, _count: { select: { orderItems: true } } },
    });
    revalidatePath("/", "layout");
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
  }
}
