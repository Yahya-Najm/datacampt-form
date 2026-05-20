"use server";

import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function login(
  _prev: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password are required." };

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Check superadmin from env first
  if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
    const session = await getSession();
    session.isLoggedIn = true;
    session.adminEmail = email;
    session.isSuperAdmin = true;
    await session.save();
    redirect("/dashboard");
  }

  // Check database admins
  const dbAdmin = await prisma.admin.findUnique({ where: { email } });
  if (dbAdmin && await compare(password, dbAdmin.password)) {
    const session = await getSession();
    session.isLoggedIn = true;
    session.adminEmail = email;
    session.isSuperAdmin = false;
    await session.save();
    redirect("/dashboard");
  }

  return { error: "Invalid email or password." };
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/dashboard/login");
}
