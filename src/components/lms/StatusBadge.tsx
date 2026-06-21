export default function StatusBadge({ status }: { status?: string | null }) {
  const cls = (status || "pending").toLowerCase().replace(/\s+/g, "-");
  return <span className={`status-badge ${cls}`}>{status || "Pending"}</span>;
}