"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

async function requireSuperAdmin() {
  const session = await requireSession();
  if (!session.isSuperAdmin) throw new Error("Unauthorized");
  return session;
}

export async function createAdmin(
  _prev: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  await requireSuperAdmin();

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password are required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) return { error: "An admin with this email already exists." };

  const hashed = await hash(password, 12);
  await prisma.admin.create({ data: { email, password: hashed } });

  revalidatePath("/dashboard/admins");
  return { success: true };
}

export async function deleteAdmin(id: string) {
  await requireSuperAdmin();
  await prisma.admin.delete({ where: { id } });
  revalidatePath("/dashboard/admins");
}
