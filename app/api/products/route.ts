import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const body = await req.json();
    const { name, slug, description, buyPrice, sellPrice, image, compatible, stock, featured, categoryId } = body;

    if (!name || !slug || !description || !buyPrice || !sellPrice || !image || !compatible || !categoryId) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        buyPrice: Number(buyPrice),
        sellPrice: Number(sellPrice),
        image,
        compatible,
        stock: Number(stock) || 10,
        featured: Boolean(featured),
        categoryId: Number(categoryId),
      },
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, product });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    if (message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Ce slug est déjà utilisé." }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
