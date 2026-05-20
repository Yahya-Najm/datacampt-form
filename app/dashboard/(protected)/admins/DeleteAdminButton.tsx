"use client";

import { useTransition } from "react";
import { deleteAdmin } from "@/actions/admins";

export function DeleteAdminButton({ id, email }: { id: string; email: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (!confirm(`Remove admin access for ${email}?`)) return;
        startTransition(() => deleteAdmin(id));
      }}
      disabled={isPending}
      className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors focus:outline-none"
    >
      {isPending ? "Removing…" : "Remove"}
    </button>
  );
}
