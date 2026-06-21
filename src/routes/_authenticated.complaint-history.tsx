import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getComplaintHistory } from "@/lib/api/api";
import LoadingSpinner from "@/components/lms/LoadingSpinner";
import PageHeader from "@/components/lms/PageHeader";
import StatusBadge from "@/components/lms/StatusBadge";

export const Route = createFileRoute("/_authenticated/complaint-history")({
  head: () => ({ meta: [{ title: "Complaint History — LMS" }] }),
  component: ComplaintHistoryPage,
});

function ComplaintHistoryPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComplaintHistory()
      .then((res) => setRows(res.data || []))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load complaints"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading complaint history..." />;

  return (
    <div className="table-page">
      <div className="table-card">
        <PageHeader title="Complaint History" description="All complaints you've submitted and their status." />
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action By</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "1.25rem", color: "var(--color-text-muted)" }}>No complaints found</td></tr>
              ) : rows.map((c) => (
                <tr key={c.complaint_id}>
                  <td>{c.complaint_id}</td>
                  <td>{c.complaint_type}</td>
                  <td style={{ maxWidth: 360 }}>{c.description}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>{c.action_by || "-"}</td>
                  <td>{c.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}