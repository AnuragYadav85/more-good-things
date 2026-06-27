import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { addLeaveBalanceRequest } from "@/lib/api/api";

export const Route = createFileRoute("/_authenticated/add-leave-balance")({
  head: () => ({ meta: [{ title: "Add Leave Balance — LMS" }] }),
  component: AddLeaveBalancePage,
});

function AddLeaveBalancePage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", leave_type: "", leave_count: "", remark: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.leave_type || !formData.leave_count) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await addLeaveBalanceRequest({
        to_email: formData.email,
        leave_type: formData.leave_type,
        days: Number(formData.leave_count),
        remark: formData.remark,
      });
      toast.success(res?.data?.message);
      navigate({to: "/leave-balance-history", search: { message: res.data.message,},});
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1>Add Leave Balance</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Employee Email *</label>
            <input type="email" name="email" placeholder="employee@company.com" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-row">
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
              </select>
            </div>
            <div className="form-group">
              <label>Leave Count *</label>
              <input type="number" step="0.5" min="0" name="leave_count" placeholder="0" value={formData.leave_count} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Remark</label>
            <textarea rows={4} name="remark" placeholder="Reason for adding balance..." value={formData.remark} onChange={handleChange} />
          </div>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}