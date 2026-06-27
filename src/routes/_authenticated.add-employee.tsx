import {createFileRoute, useNavigate,} from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { addEmployeeRequest } from "@/lib/api/api";

export const Route = createFileRoute("/_authenticated/add-employee")({
  head: () => ({ meta: [{ title: "Add Employee — LMS" }] }),
  component: AddEmployeePage,
});

function AddEmployeePage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "", name: "", surname: "", designation: "", department: "", join_date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required = ["email", "name", "surname", "designation", "department", "join_date"] as const;
    if (required.some((k) => !formData[k])) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await addEmployeeRequest(formData);
      await navigate({
        to: "/employee-request-history",
        search: {
          message: res?.data?.message,
        },
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1>Add Employee</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" placeholder="employee@company.com" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Join Date *</label>
              <input type="date" name="join_date" value={formData.join_date} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input type="text" name="name" placeholder="First name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input type="text" name="surname" placeholder="Last name" value={formData.surname} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Designation *</label>
              <select name="designation" value={formData.designation} onChange={handleChange}>
                <option value="">Select designation</option>
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
                <option value="HR">HR</option>
                <option value="HeadHR">HeadHR</option>
              </select>
            </div>
            <div className="form-group">
              <label>Department *</label>
              <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Submitting..." : "Add Employee"}
          </button>
        </form>
      </div>
    </div>
  );
}