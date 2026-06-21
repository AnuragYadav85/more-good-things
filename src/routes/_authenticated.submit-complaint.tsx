import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { submitComplaint } from "@/lib/api/api";

export const Route = createFileRoute("/_authenticated/submit-complaint")({
  head: () => ({ meta: [{ title: "Submit Complaint — LMS" }] }),
  component: SubmitComplaintPage,
});

function SubmitComplaintPage() {
  const [formData, setFormData] = useState({ complaint_type: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.complaint_type || !formData.description) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("complaint_type", formData.complaint_type);
      fd.append("description", formData.description);
      const res = await submitComplaint(fd);
      toast.success(res?.data?.message || "Complaint submitted successfully");
      setFormData({ complaint_type: "", description: "" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1>Submit Complaint</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Complaint Type *</label>
            <select name="complaint_type" value={formData.complaint_type} onChange={handleChange}>
              <option value="">Select complaint type</option>
              <option value="Attendance">Attendance</option>
              <option value="Leave">Leave</option>
              <option value="Payroll">Payroll</option>
              <option value="System">System</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea rows={6} name="description" placeholder="Describe your complaint..." value={formData.description} onChange={handleChange} />
          </div>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}