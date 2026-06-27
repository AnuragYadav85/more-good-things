import { addWeeklyOff } from "@/lib/api/api";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/_authenticated/weekly-off")({
  head: () => ({ meta: [{ title: "Weekly Off Management — LMS" }] }),
  component: WeeklyOffPage,
});

function WeeklyOffPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", weekly_off_type: "",});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => 
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.weekly_off_type) { toast.error("Please provide employee email and weekly off type");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("email", formData.email);
      fd.append("weekly_off_type", formData.weekly_off_type);
      const res = await addWeeklyOff(fd);
      toast.success(res?.data?.message);
      setFormData({ email: "", weekly_off_type: "" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1>Weekly Off Management</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Employee Emails *</label>
            <textarea
              rows={3}
              name="email"
              placeholder="employee1@gmail.com, employee2@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Weekly Off Type *</label>
            <select name="weekly_off_type" value={formData.weekly_off_type} onChange={handleChange}>
              <option value="">Select Weekly Off</option>
              <option value="0">Saturday + Sunday (Type 0)</option>
              <option value="1">Saturday + Sunday (Type 1)</option>
              <option value="2">Tuesday + Wednesday (Type 0)</option>
              <option value="3">Tuesday + Wednesday (Type 1)</option>
            </select>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Saving..." : "Add Weekly Off"}
          </button>
        </form>
      </div>
    </div>
  );
}