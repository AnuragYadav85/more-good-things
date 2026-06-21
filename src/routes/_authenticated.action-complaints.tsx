import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getPendingComplaints, complaintAction } from "@/lib/api/api";
import LoadingSpinner from "@/components/lms/LoadingSpinner";
import PageHeader from "@/components/lms/PageHeader";

export const Route = createFileRoute("/_authenticated/action-complaints")({
  head: () => ({ meta: [{ title: "Complaint Actions — LMS" }] }),
  component: ActionComplaintsPage,
});

function ActionComplaintsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    getPendingComplaints()
      .then((res) => setRows(res.data || []))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load complaints"))
      .finally(() => setLoading(false));
  }, []);

  const submitAction = async () => {
    if (!selected) return;
    try {
      const fd = new FormData();
      fd.append("remark", remark);
      const res = await complaintAction(selected.complaint_id, selected.action, fd);
      toast.success(res.data.message);
      setRows((prev) => prev.filter((r) => r.complaint_id !== selected.complaint_id));
      setSelected(null);
      setRemark("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update complaint");
    }
  };

  if (loading) return <LoadingSpinner text="Loading complaints..." />;

  return (
    <div className="table-page">
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
                <th>Actions</th>
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
                      <button className="approve-btn" onClick={() => { setSelected({ ...c, action: "Resolved" }); setRemark(""); }}>Resolve</button>
                      <button className="reject-btn" onClick={() => { setSelected({ ...c, action: "Rejected" }); setRemark(""); }}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>{selected.action} Complaint #{selected.complaint_id}</h2>
            <div className="form-group">
              <label>Remark</label>
              <textarea rows={4} value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Add a remark for the employee" />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setSelected(null)}>Cancel</button>
              <button className="primary-btn" onClick={submitAction}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}