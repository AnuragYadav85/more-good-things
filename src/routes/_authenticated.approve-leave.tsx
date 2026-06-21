import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getPendingLeaves, leaveAction } from "@/lib/api/api";
import LoadingSpinner from "@/components/lms/LoadingSpinner";
import PageHeader from "@/components/lms/PageHeader";

export const Route = createFileRoute("/_authenticated/approve-leave")({
  head: () => ({ meta: [{ title: "Approve Leave — LMS" }] }),
  component: ApproveLeavePage,
});

function ApproveLeavePage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPendingLeaves()
      .then((res) => setRows(res.data || []))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load leave requests"))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: any, action: "Approved" | "Rejected") => {
    try {
      const res = await leaveAction(id, action);
      toast.success(res.data.message);
      setRows((p) => p.filter((l) => l.leave_id !== id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Action failed");
    }
  };

  if (loading) return <LoadingSpinner text="Loading pending leave requests..." />;

  return (
    <div className="table-page">
      <div className="table-card">
        <PageHeader title="Approve Leave Requests" description="Review and process pending leave requests." />
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Type</th>
                <th>Start</th>
                <th>End</th>
                <th>Applied On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "1.25rem", color: "var(--color-text-muted)" }}>No pending leave requests</td></tr>
              ) : rows.map((l) => (
                <tr key={l.leave_id}>
                  <td>{l.leave_id}</td>
                  <td>{l.employee}</td>
                  <td>{l.leave_type}</td>
                  <td>{l.start_date}</td>
                  <td>{l.end_date}</td>
                  <td>{l.applied_on}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="approve-btn" onClick={() => handleAction(l.leave_id, "Approved")}>Approve</button>
                      <button className="reject-btn" onClick={() => handleAction(l.leave_id, "Rejected")}>Reject</button>
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