import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { CreateAdminForm } from "./CreateAdminForm";
import { DeleteAdminButton } from "./DeleteAdminButton";

export default async function AdminsPage() {
  const session = await requireSession();
  if (!session.isSuperAdmin) redirect("/dashboard");

  const admins = await prisma.admin.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Manage Admins</h1>
        <p className="text-sm text-gray-500 mt-1">
          Create admin accounts and share the credentials with your team.
        </p>
      </div>

      {/* Create form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-5">
          Create New Admin
        </h2>
        <CreateAdminForm />
      </div>

      {/* Existing admins */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">
            Existing Admins
          </h2>
        </div>

        {admins.length === 0 ? (
          <p className="px-6 py-8 text-sm text-gray-400 text-center">
            No admins created yet.
          </p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {admins.map((admin) => (
              <li key={admin.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{admin.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Added {new Date(admin.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
                <DeleteAdminButton id={admin.id} email={admin.email} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
