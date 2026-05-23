"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export async function getSocialLinks() {
  return prisma.socialLink.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getAllSocialLinks() {
  await requireSession();
  return prisma.socialLink.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function addSocialLink(data: {
  platform: string;
  label: string;
  url: string;
  order: number;
}) {
  await requireSession();
  await prisma.socialLink.create({ data });
  revalidatePath("/dashboard/social-links");
  revalidatePath("/apply");
}

export async function updateSocialLink(
  id: string,
  data: { platform?: string; label?: string; url?: string; order?: number; isActive?: boolean }
) {
  await requireSession();
  await prisma.socialLink.update({ where: { id }, data });
  revalidatePath("/dashboard/social-links");
  revalidatePath("/apply");
}

export async function deleteSocialLink(id: string) {
  await requireSession();
  await prisma.socialLink.delete({ where: { id } });
  revalidatePath("/dashboard/social-links");
  revalidatePath("/apply");
}
