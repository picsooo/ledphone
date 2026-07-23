import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "crypto";
import { prisma } from "./db";

const SESSION_COOKIE = "admin_session";

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function login(username: string, password: string): Promise<boolean> {
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) return false;
  if (admin.password !== hashPassword(password)) return false;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, admin.username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return true;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value) return null;
  return prisma.admin.findUnique({ where: { username: session.value } });
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
