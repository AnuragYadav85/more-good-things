import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getPendingComplaints, complaintAction } from "@/lib/api/api";
import LoadingSpinner from "@/components/lms/LoadingSpinner";
import PageHeader from "@/components/lms/PageHeader";
import StatusBadge from "@/components/lms/StatusBadge";

export const Route = createFileRoute("/_authenticated/action-complaints")({
  head: () => ({ meta: [{ title: "Complaint Actions — LMS" }] }),
  component: ActionComplaintsPage,
});

function ActionComplaintsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [mode, setMode] = useState<"none" | "resolve" | "reject">("none");
  const [remark, setRemark] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadPending = (showError = true) => {
    return getPendingComplaints()
      .then((res) => setRows(res.data || []))
      .catch((err) => {
        if (showError) toast.error(err?.response?.data?.message || "Failed to load complaints");
      });
  };

  useEffect(() => {
    loadPending().finally(() => setLoading(false));
  }, []);

  const handleView = (c: any) => {
    setSelected(c);
    setMode("none");
    setRemark("");
  };

  const handleClose = () => {
    setSelected(null);
    setMode("none");
    setRemark("");
  };

  const submitAction = async (action: "resolve_complaint" | "reject_complaint") => {
    if (!selected) return;
    if (!remark.trim()) {
      toast.error(action === "resolve_complaint" ? "Action Taken is required" : "Rejection Reason is required");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("remark", remark.trim());
      const res = await complaintAction(selected.complaint_id, action, fd);
      toast.success(res?.data?.message);
      handleClose();
      await loadPending(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveClick = () => {
    if (mode !== "resolve") { setMode("resolve"); setRemark(""); return; }
    submitAction("resolve_complaint");
  };

  const handleRejectClick = () => {
    if (mode !== "reject") { setMode("reject"); setRemark(""); return; }
    submitAction("reject_complaint");
  };

  if (loading) return <LoadingSpinner text="Loading complaints..." />;

  return (
    <div className="table-page">
      {selected && (
        <div className="table-card" style={{ marginBottom: "1rem" }}>
          <PageHeader title="Complaint Details" description="Review the complaint below, then resolve or reject." />
          <div style={{ padding: "0 1rem 1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem 1.25rem", marginBottom: "1rem" }}>
              <div><div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Complaint ID</div><div>{selected.complaint_id}</div></div>
              <div><div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Employee Name</div><div>{selected.email}</div></div>
              <div><div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Complaint Type</div><div>{selected.complaint_type}</div></div>
              <div><div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Created Date</div><div>{selected.created_at}</div></div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Current Status</div>
                <div><StatusBadge status={selected.status || "Pending"} /></div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Description</div>
                <div>{selected.description}</div>
              </div>
            </div>

            {mode !== "none" && (
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>
                  {mode === "resolve" ? "Action Taken" : "Rejection Reason"} <span style={{ color: "red" }}>*</span>
                </label>
                <textarea
                  required
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={3}
                  style={{ width: "100%", padding: "0.5rem", border: "1px solid var(--color-border)", borderRadius: "4px", fontFamily: "inherit" }}
                  placeholder={mode === "resolve" ? "Describe the action taken" : "Enter reason for rejection"}
                />
              </div>
            )}

            <div className="action-buttons" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button className="approve-btn" onClick={handleResolveClick} disabled={submitting}>
                {mode === "resolve" ? "Submit Resolution" : "Resolve"}
              </button>
              <button className="reject-btn" onClick={handleRejectClick} disabled={submitting}>
                {mode === "reject" ? "Submit Rejection" : "Reject"}
              </button>
              <button
                className="reject-btn"
                style={{ background: "var(--color-text-muted)" }}
                onClick={handleClose}
                disabled={submitting}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-card">
        <PageHeader title="Complaint Actions" description="Review and resolve employee complaints." />
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Type</th>
                <th>Description</th>
                <th>Created</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "1.25rem", color: "var(--color-text-muted)" }}>No pending complaints</td></tr>
              ) : rows.map((c) => (
                <tr key={c.complaint_id}>
                  <td>{c.complaint_id}</td>
                  <td>{c.email}</td>
                  <td>{c.complaint_type}</td>
                  <td style={{ maxWidth: 320 }}>{c.description}</td>
                  <td>{c.created_at}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="approve-btn" onClick={() => handleView(c)}>View</button>
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