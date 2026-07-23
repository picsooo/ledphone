"use server";

import { login, logout } from "@/lib/auth";
import { redirect } from "next/navigation";

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

  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}
