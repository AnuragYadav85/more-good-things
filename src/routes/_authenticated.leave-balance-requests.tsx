import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getLeaveBalanceRequests, leaveBalanceAction } from "@/lib/api/api";
import LoadingSpinner from "@/components/lms/LoadingSpinner";
import PageHeader from "@/components/lms/PageHeader";

export const Route = createFileRoute("/_authenticated/leave-balance-requests")({
  head: () => ({ meta: [{ title: "Leave Balance Requests — LMS" }] }),
  component: LeaveBalanceRequestsPage,
});

function LeaveBalanceRequestsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaveBalanceRequests()
      .then((res) => setRows(res.data || []))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load requests"))
      .finally(() => setLoading(false));
  }, []);

  const action = async (id: any, a: "Approved" | "Rejected") => {
    try {
      const res = await leaveBalanceAction(id, a);
      toast.success(res.data.message);
      setRows((p) => p.filter((r) => r.request_id !== id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Action failed");
    }
  };

  if (loading) return <LoadingSpinner text="Loading leave balance requests..." />;

  return (
    <div className="table-page">
      <div className="table-card">
        <PageHeader title="Leave Balance Requests" description="Review leave balance requests submitted by HR." />
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Employee Email</th><th>Leave Type</th><th>Count</th>
                <th>Requested By</th><th>Requested On</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "1.25rem", color: "var(--color-text-muted)" }}>No pending leave balance requests</td></tr>
              ) : rows.map((r) => (
                <tr key={r.request_id}>
                  <td>{r.request_id}</td>
                  <td>{r.email}</td>
                  <td>{r.leave_type}</td>
                  <td>{r.leave_count}</td>
                  <td>{r.requested_by}</td>
                  <td>{r.requested_on}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="approve-btn" onClick={() => action(r.request_id, "Approved")}>Approve</button>
                      <button className="reject-btn" onClick={() => action(r.request_id, "Rejected")}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}