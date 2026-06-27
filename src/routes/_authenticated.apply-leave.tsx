import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { applyLeave } from "@/lib/api/api";

export const Route = createFileRoute("/_authenticated/apply-leave")({
  head: () => ({ meta: [{ title: "Apply Leave — LMS" }] }),
  component: ApplyLeavePage,
});

function ApplyLeavePage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leave_type: "",
    apply_start_date: "",
    apply_end_date: "",
    reason: "",
    supporting_documents: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, supporting_documents: e.target.files?.[0] || null }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.leave_type || !formData.apply_start_date || !formData.apply_end_date || !formData.reason) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("leave_type", formData.leave_type);
      fd.append("apply_start_date", formData.apply_start_date);
      fd.append("apply_end_date", formData.apply_end_date);
      fd.append("reason", formData.reason);
      if (formData.supporting_documents) fd.append("supporting_documents", formData.supporting_documents);
      const res = await applyLeave(fd);

      await navigate({
        to: "/leave-history",
        search: {
          message: res?.data?.message,
        },
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1>Apply Leave</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Leave Type *</label>
            <select name="leave_type" value={formData.leave_type} onChange={handleChange}>
              <option value="">Select leave type</option>
              <option value="Sick_Leave">Sick Leave</option>
              <option value="Casual_Leave">Casual Leave</option>
              <option value="Earned_Leave">Earned Leave</option>
              <option value="Compensation_off">Compensation Off</option>
              <option value="Summer_Vacation">Summer Vacation</option>
              <option value="Planned_Leave">Planned Leave</option>
              <option value="Duty_Leave">Duty Leave</option>
              <option value="Early_Leave">Early Leave</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input type="date" name="apply_start_date" value={formData.apply_start_date} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>End Date *</label>
              <input type="date" name="apply_end_date" value={formData.apply_end_date} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Reason *</label>
            <textarea name="reason" rows={5} placeholder="Enter leave reason" value={formData.reason} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Supporting Document</label>
            <input type="file" onChange={handleFile} />
          </div>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Submitting..." : "Apply Leave"}
          </button>
        </form>
      </div>
    </div>
  );
}