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
  const [selectedLeave, setSelectedLeave] = useState<any | null>(null);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadPending = (showError = true) => {
    return getPendingLeaves()
      .then((res) => setRows(res.data || []))
      .catch((err) => {
        if (showError) toast.error(err?.response?.data?.message || "Failed to load leave requests");
      });
  };

  useEffect(() => {
    loadPending().finally(() => setLoading(false));
  }, []);

  const handleView = (l: any) => {
    setSelectedLeave(l);
    setShowRejectReason(false);
    setRejectReason("");
  };

  const handleApprove = async () => {
    if (!selectedLeave) return;
    setSubmitting(true);
    try {
      const res = await leaveAction(selectedLeave.leave_id, "Approved");
      toast.success(res.data?.message || "Leave approved");
      setSelectedLeave(null);
      await loadPending(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedLeave) return;
    if (!showRejectReason) {
      setShowRejectReason(true);
      return;
    }
    if (!rejectReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("reason", rejectReason.trim());
      const res = await leaveAction(selectedLeave.leave_id, "Rejected", fd);
      toast.success(res.data?.message || "Leave rejected");
      setSelectedLeave(null);
      setShowRejectReason(false);
      setRejectReason("");
      await loadPending(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  const getAttachmentInfo = (l: any) => {
    const url = l?.attachment_url || l?.attachment_path || l?.attachment || l?.file_url || l?.file;
    if (!url) return { name: null, url: null };
    const name = l?.attachment_name || l?.file_name || String(url).split("/").pop();
    return { name, url };
  };

  if (loading) return <LoadingSpinner text="Loading pending leave requests..." />;

  return (
    <div className="table-page">
      {selectedLeave && (
        <div className="table-card" style={{ marginBottom: "1rem" }}>
          <PageHeader title="Leave Details" description="Review the request below, then approve or reject." />
          <div style={{ padding: "0 1rem 1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem 1.25rem", marginBottom: "1rem" }}>
              <div><div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Leave ID</div><div>{selectedLeave.leave_id}</div></div>
              <div><div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Employee Name</div><div>{selectedLeave.employee}</div></div>
              <div><div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Leave Type</div><div>{selectedLeave.leave_type}</div></div>
              <div><div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Start Date</div><div>{selectedLeave.start_date}</div></div>
              <div><div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>End Date</div><div>{selectedLeave.end_date}</div></div>
              <div><div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Applied On</div><div>{selectedLeave.applied_on}</div></div>
              {selectedLeave.reason && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Reason</div>
                  <div>{selectedLeave.reason}</div>
                </div>
              )}
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Attachment</div>
                {(() => {
                  const { name, url } = getAttachmentInfo(selectedLeave);
                  if (!url) return <div>No Attachment</div>;
                  return (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                      <span>{name}</span>
                      <a href={url} target="_blank" rel="noopener noreferrer" download className="approve-btn" style={{ textDecoration: "none", display: "inline-block" }}>Download Attachment</a>
                    </div>
                  );
                })()}
              </div>
            </div>

            {showRejectReason && (
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>
                  Rejection Reason <span style={{ color: "red" }}>*</span>
                </label>
                <textarea
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  style={{ width: "100%", padding: "0.5rem", border: "1px solid var(--color-border)", borderRadius: "4px", fontFamily: "inherit" }}
                  placeholder="Enter reason for rejection"
                />
              </div>
            )}

            <div className="action-buttons" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button className="approve-btn" onClick={handleApprove} disabled={submitting}>Approve</button>
              <button className="reject-btn" onClick={handleReject} disabled={submitting}>
                {showRejectReason ? "Submit Rejection" : "Reject"}
              </button>
              <button
                className="reject-btn"
                style={{ background: "var(--color-text-muted)" }}
                onClick={() => { setSelectedLeave(null); setShowRejectReason(false); setRejectReason(""); }}
                disabled={submitting}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
                <th>View</th>
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
                      <button className="approve-btn" onClick={() => handleView(l)}>View</button>
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