import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { StatusActions } from "@/components/dashboard/StatusActions";

const PAGE_SIZE = 30;

interface Props {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  await requireSession();
  const { status, q, page: pageStr } = await searchParams;

  const page = Math.max(1, parseInt(pageStr ?? "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  const statusFilter = status && status !== "all" ? status : undefined;
  const searchFilter = q?.trim()
    ? {
        OR: [
          { name: { contains: q.trim(), mode: "insensitive" as const } },
          { email: { contains: q.trim(), mode: "insensitive" as const } },
          { country: { contains: q.trim(), mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const where = {
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(searchFilter ?? {}),
  };

  const [applications, total, stats] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { submittedAt: "desc" },
      skip,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        email: true,
        country: true,
        city: true,
        submittedAt: true,
        status: true,
        currentSituation: true,
      },
    }),
    prisma.application.count({ where }),
    prisma.application.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const statMap = Object.fromEntries(stats.map((s) => [s.status, s._count.status]));
  const counts = {
    all: statMap.pending ?? 0 + (statMap.approved ?? 0) + (statMap.rejected ?? 0),
    pending: statMap.pending ?? 0,
    approved: statMap.approved ?? 0,
    rejected: statMap.rejected ?? 0,
  };
  counts.all = counts.pending + counts.approved + counts.rejected;

  const tabs = [
    { label: "All", value: "all", count: counts.all },
    { label: "Pending", value: "pending", count: counts.pending },
    { label: "Approved", value: "approved", count: counts.approved },
    { label: "Rejected", value: "rejected", count: counts.rejected },
  ];

  const activeTab = status ?? "all";

  function buildUrl(params: Record<string, string | undefined>) {
    const sp = new URLSearchParams();
    if (params.status && params.status !== "all") sp.set("status", params.status);
    if (params.q) sp.set("q", params.q);
    if (params.page && params.page !== "1") sp.set("page", params.page);
    const str = sp.toString();
    return `/dashboard${str ? `?${str}` : ""}`;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {tabs.map((t) => (
          <div key={t.value} className="bg-white rounded-xl border border-gray-200 px-5 py-4">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{t.label}</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{t.count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Status tabs */}
        <div className="flex rounded-lg border border-gray-200 bg-white p-1 gap-1">
          {tabs.map((t) => (
            <Link
              key={t.value}
              href={buildUrl({ status: t.value, q })}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap
                ${activeTab === t.value
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              {t.label}
              <span className={`ml-1.5 text-xs ${activeTab === t.value ? "text-teal-100" : "text-gray-400"}`}>
                {t.count}
              </span>
            </Link>
          ))}
        </div>

        {/* Search */}
        <form className="flex-1 flex gap-2" method="GET" action="/dashboard">
          {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
          <input
            name="q"
            defaultValue={q}
            type="search"
            placeholder="Search by name, email or country…"
            className="flex-1 h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-1"
          />
          <button
            type="submit"
            className="h-10 px-4 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {applications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-gray-400 text-sm">No applications found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Applicant</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Location</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Submitted</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/applications/${app.id}`} className="block">
                        <p className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                          {app.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{app.email}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-600">
                      {app.city}, {app.country}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500 whitespace-nowrap">
                      {new Date(app.submittedAt).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusActions id={app.id} currentStatus={app.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-500">
              Showing {skip + 1}–{Math.min(skip + PAGE_SIZE, total)} of {total}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={buildUrl({ status: activeTab, q, page: String(page - 1) })}
                  className="h-8 px-3 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 flex items-center"
                >
                  ← Prev
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={buildUrl({ status: activeTab, q, page: String(page + 1) })}
                  className="h-8 px-3 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 flex items-center"
                >
                  Next →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
