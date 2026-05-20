const styles = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-teal-100 text-teal-700 border-teal-200",
  rejected: "bg-red-100 text-red-600 border-red-200",
} as const;

const labels = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
} as const;

type Status = keyof typeof styles;

export function StatusBadge({ status }: { status: string }) {
  const s = (status in styles ? status : "pending") as Status;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[s]}`}>
      {labels[s]}
    </span>
  );
}
