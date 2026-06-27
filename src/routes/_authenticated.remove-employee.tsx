import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { removeEmployee } from "@/lib/api/api";

export const Route = createFileRoute("/_authenticated/remove-employee")({
  head: () => ({ meta: [{ title: "Remove Employee — LMS" }] }),
  component: RemoveEmployeePage,
});

function RemoveEmployeePage() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    removal_date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!formData.email || !formData.removal_date) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();

      fd.append("email", formData.email);
      fd.append("removal_date", formData.removal_date);

      const res = await removeEmployee(fd);

      toast.success(
        res?.data?.message ||
          "Removal request submitted successfully"
      );

      setFormData({
        email: "",
        removal_date: "",
      });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to submit request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1>Remove Employee</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Employee Email *</label>

            <input
              type="email"
              name="email"
              placeholder="employee@company.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Removal Date *</label>

            <input
              type="date"
              name="removal_date"
              value={formData.removal_date}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Submit Removal Request"}
          </button>
        </form>
      </div>
    </div>
  );
}