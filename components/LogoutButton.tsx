"use client";

import { logoutAction } from "@/app/actions/auth";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-red-500 border border-slate-200 hover:border-red-200 rounded-xl transition-colors"
      >
        Déconnexion
      </button>
    </form>
  );
}
