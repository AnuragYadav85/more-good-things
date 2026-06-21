import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getLeaveHistory } from "@/lib/api/api";
import LoadingSpinner from "@/components/lms/LoadingSpinner";
import PageHeader from "@/components/lms/PageHeader";
import StatusBadge from "@/components/lms/StatusBadge";

export const Route = createFileRoute("/_authenticated/leave-history")({
  head: () => ({ meta: [{ title: "Leave History — LMS" }] }),
  component: LeaveHistoryPage,
});

function LeaveHistoryPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaveHistory()
      .then((res) => setRows(res.data || []))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load leave history"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading leave history..." />;

  return (
    <div className="table-page">
      <div className="table-card">
        <PageHeader title="Leave History" description="All your leave applications and their status." />
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Leave ID</th>
                <th>Type</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Approved By</th>
                <th>Applied On</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "1.25rem", color: "var(--color-text-muted)" }}>No leave history found</td></tr>
              ) : rows.map((leave) => (
                <tr key={leave.leave_id}>
                  <td>{leave.leave_id}</td>
                  <td>{leave.leave_type}</td>
                  <td>{leave.start_date}</td>
                  <td>{leave.end_date}</td>
                  <td><StatusBadge status={leave.status} /></td>
                  <td>{leave.approved_by || "-"}</td>
                  <td>{leave.applied_on}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}