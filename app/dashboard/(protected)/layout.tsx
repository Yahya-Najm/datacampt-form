import { requireSession } from "@/lib/session";
import { logout } from "@/actions/auth";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <img src="/foroz-logo.svg" alt="FOROZ" className="h-6 w-auto" />
              <span className="text-gray-300">/</span>
              <span className="text-sm font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                Dashboard
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs text-gray-400">{session.adminEmail}</span>
            {session.isSuperAdmin && (
              <Link
                href="/dashboard/admins"
                className="text-xs text-gray-500 hover:text-teal-600 transition-colors"
              >
                Admins
              </Link>
            )}
            <Link
              href="/apply"
              target="_blank"
              className="text-xs text-gray-500 hover:text-teal-600 transition-colors"
            >
              View form ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="text-xs font-medium text-gray-500 hover:text-red-600 transition-colors focus:outline-none"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
