import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { getReviewState, saveReviewState, sanitize } from "@/lib/review";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json({ state: await getReviewState(admin.username) });
}

export async function PUT(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const state = sanitize(await req.json());
    await saveReviewState(admin.username, state);
    return NextResponse.json({ ok: true, state });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur sauvegarde" }, { status: 500 });
  }
}
