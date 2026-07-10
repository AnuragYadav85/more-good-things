import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { submitComplaint } from "@/lib/api/api";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/submit-complaint")({
  head: () => ({ meta: [{ title: "Submit Complaint — LMS" }] }),
  component: SubmitComplaintPage,
});

function SubmitComplaintPage() {
  const initialForm = { complaint_type: "", description: "" };
  const [formData, setFormData] = useState({ ...initialForm });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleAuthError = (status?: number) => {
    if (status === 401 || status === 403) {
      logout();
      navigate({ to: "/login", replace: true });
      return true;
    }
    return false;
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.complaint_type.trim()) {
      nextErrors.complaint_type = "Please select a complaint type.";
    }
    if (!formData.description.trim()) {
      nextErrors.description = "Description cannot be empty or only spaces.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) {
      setErrors((p) => ({ ...p, [name]: "" }));
    }
  };

  const handleClearForm = () => {
    setFormData({ ...initialForm });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("complaint_type", formData.complaint_type.trim());
      fd.append("description", formData.description.trim());
      const res = await submitComplaint(fd);
      if (res?.data?.message) toast.success(res.data.message);
      handleClearForm();
      await navigate({
        to: res?.data?.redirect || "/complaint-history",
        search: { message: res?.data?.message },
      });
    } catch (err: any) {
      if (handleAuthError(err?.response?.status)) return;
      toast.error(
        err?.response?.data?.message ||
          (err?.response ? "Failed to submit complaint" : "Unable to connect to server. Please try again."),
      );
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
            {errors.complaint_type && <span className="error-text">{errors.complaint_type}</span>}
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea rows={6} name="description" placeholder="Describe your complaint..." value={formData.description} onChange={handleChange} />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>
          <div className="form-actions" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
            <button type="button" className="secondary-btn" onClick={handleClearForm} disabled={loading}>
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}