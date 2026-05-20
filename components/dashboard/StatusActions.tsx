"use client";

import { useTransition } from "react";
import { updateStatus, type AppStatus } from "@/actions/dashboard";

interface Props {
  id: string;
  currentStatus: string;
  size?: "sm" | "md";
}

const btn =
  "inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-1";

export function StatusActions({ id, currentStatus, size = "sm" }: Props) {
  const [isPending, startTransition] = useTransition();

  const act = (status: AppStatus) =>
    startTransition(() => updateStatus(id, status));

  return (
    <div className={`flex items-center gap-2 ${size === "md" ? "flex-wrap" : ""}`}>
      {currentStatus !== "approved" && (
        <button
          onClick={() => act("approved")}
          disabled={isPending}
          className={`${btn} border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 focus:ring-teal-400`}
        >
          Approve
        </button>
      )}
      {currentStatus !== "rejected" && (
        <button
          onClick={() => act("rejected")}
          disabled={isPending}
          className={`${btn} border-red-200 bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-400`}
        >
          Reject
        </button>
      )}
      {currentStatus !== "pending" && (
        <button
          onClick={() => act("pending")}
          disabled={isPending}
          className={`${btn} border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 focus:ring-gray-400`}
        >
          Reset
        </button>
      )}
      {isPending && (
        <svg className="h-4 w-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
    </div>
  );
}
