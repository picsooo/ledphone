import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendOrderEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, wilaya, commune, address, note, deliveryType, deliveryFee, items } = body;

    if (!name || !phone || !wilaya || !commune || !address || !items?.length) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // Validate that all product IDs exist
    const productIds = items.map((item: { id: number }) => item.id);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });
    const existingIds = existingProducts.map((p) => p.id);
    const missingIds = productIds.filter((id: number) => !existingIds.includes(id));
    if (missingIds.length > 0) {
      return NextResponse.json(
        { error: "Certains produits de votre panier ne sont plus disponibles. Veuillez vider votre panier et recommencer.", staleCart: true },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (sum: number, item: { sellPrice: number; quantity: number }) =>
        sum + item.sellPrice * item.quantity,
      0
    );
    const fee = typeof deliveryFee === "number" && deliveryFee >= 0 ? deliveryFee : 0;
    const total = subtotal + fee;

    const order = await prisma.order.create({
      data: {
        name,
        phone,
        wilaya,
        commune,
        address,
        note: note || "",
        deliveryType: deliveryType || "domicile",
        deliveryFee: fee,
        total,
        status: "pending",
        items: {
          create: items.map((item: { id: number; quantity: number; sellPrice: number }) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.sellPrice,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    // Send notification email (non-blocking — don't fail the order if email fails)
    sendOrderEmail({
      orderId: order.id,
      name,
      phone,
      wilaya,
      commune,
      address,
      note: note || "",
      deliveryType: deliveryType || "domicile",
      deliveryFee: fee,
      total,
      items: order.items.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        price: i.price,
      })),
    }).catch((err) => console.error("Email send failed:", err));

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[orders API]", msg, err);
    return NextResponse.json({ error: "Erreur serveur", detail: msg }, { status: 500 });
  }
}

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}
