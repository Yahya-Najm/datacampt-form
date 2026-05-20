"use client";

import { useActionState, useEffect, useRef } from "react";
import { createAdmin } from "@/actions/admins";

const initial = { error: undefined as string | undefined, success: false };

export function CreateAdminForm() {
  const [state, action, isPending] = useActionState(createAdmin, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            required
            placeholder="colleague@example.com"
            className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-1"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            name="password"
            type="text"
            required
            placeholder="Set a password for them"
            className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-1"
          />
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-700">
          Admin created successfully. Share the email and password with them.
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="h-10 px-5 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 disabled:opacity-60 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
        >
          {isPending ? "Creating…" : "Create Admin"}
        </button>
      </div>
    </form>
  );
}
