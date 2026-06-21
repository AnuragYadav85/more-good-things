import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/_authenticated/add-holiday")({
  head: () => ({ meta: [{ title: "Add Holiday — LMS" }] }),
  component: AddHolidayPage,
});

function AddHolidayPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ holiday_name: "", holiday_date: "", description: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.holiday_name || !formData.holiday_date) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      // (No backend endpoint provided — UI-only stub matches your original implementation.)
      await new Promise((r) => setTimeout(r, 400));
      toast.success("Holiday added successfully");
      setFormData({ holiday_name: "", holiday_date: "", description: "" });
    } catch {
      toast.error("Failed to add holiday");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1>Add Holiday</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Holiday Name *</label>
            <input type="text" name="holiday_name" placeholder="Holiday name" value={formData.holiday_name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Holiday Date *</label>
            <input type="date" name="holiday_date" value={formData.holiday_date} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={4} name="description" placeholder="Holiday description" value={formData.description} onChange={handleChange} />
          </div>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Adding..." : "Add Holiday"}
          </button>
        </form>
      </div>
    </div>
  );
}