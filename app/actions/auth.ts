"use server";

import { login, logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getReviewSummary } from "@/lib/review";

export async function loginAction(_prev: { error?: string } | null, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Veuillez remplir tous les champs." };
  }

  const success = await login(username, password);
  if (!success) {
    return { error: "Nom d'utilisateur ou mot de passe incorrect." };
  }

  // Unfinished product review: take the admin straight back to it
  let resume = false;
  try {
    const summary = await getReviewSummary(username);
    resume = !!summary && summary.remaining > 0;
  } catch {}

  redirect(resume ? "/admin/revue" : "/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}
