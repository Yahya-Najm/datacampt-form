"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export type AppStatus = "pending" | "approved" | "rejected";

export async function updateStatus(id: string, status: AppStatus) {
  await requireSession();
  await prisma.application.update({ where: { id }, data: { status } });
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/applications/${id}`);
}

export async function getStats() {
  await requireSession();
  const [total, pending, approved, rejected] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: "pending" } }),
    prisma.application.count({ where: { status: "approved" } }),
    prisma.application.count({ where: { status: "rejected" } }),
  ]);
  return { total, pending, approved, rejected };
}
