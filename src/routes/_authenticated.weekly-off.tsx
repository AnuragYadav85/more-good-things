import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/_authenticated/weekly-off")({
  head: () => ({ meta: [{ title: "Weekly Off Management — LMS" }] }),
  component: WeeklyOffPage,
});

const WEEKLY_OFFS = [
  { day: "Sunday", department: "All" },
  { day: "Saturday", department: "Support" },
];

function WeeklyOffPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ week_day: "", department: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.week_day) { toast.error("Please select a day"); return; }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      toast.success("Weekly off added successfully");
      setFormData({ week_day: "", department: "" });
    } catch {
      toast.error("Failed to add weekly off");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1>Weekly Off Management</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Week Day *</label>
              <select name="week_day" value={formData.week_day} onChange={handleChange}>
                <option value="">Select day</option>
                {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Department</label>
              <input type="text" name="department" placeholder="All departments" value={formData.department} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Saving..." : "Add Weekly Off"}
          </button>
        </form>
      </div>

      <div className="table-card" style={{ marginTop: "1.5rem" }}>
        <div className="table-header"><h2>Configured Weekly Offs</h2></div>
        <div className="table-container">
          <table>
            <thead><tr><th>Day</th><th>Department</th></tr></thead>
            <tbody>
              {WEEKLY_OFFS.map((item, i) => (
                <tr key={i}><td>{item.day}</td><td>{item.department}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}