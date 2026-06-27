import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getDashboard } from "@/lib/api/api";
import { useAuth } from "@/lib/auth-context";
import LoadingSpinner from "@/components/lms/LoadingSpinner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — LMS" }] }),
  component: DashboardPage,
});

const COLORS = ["#0d6efd", "#198754", "#ffc107", "#dc3545", "#6f42c1", "#0dcaf0", "#6c757d"];

function DashboardPage() {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    getDashboard()
      .then((res) => mounted && setData(res.data))
      .catch(() => mounted && toast.error("Failed to load dashboard"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const user = data?.user || authUser || {};
  const balances = data?.leave_balance || {};
  const attendance = data?.attendance_summary || {};
  const attendanceData = Object.entries(attendance)
    .filter(([, v]) => Number(v) > 0)
    .map(([name, value]) => ({ name, value: Number(value) }));

  const cards = [
    { label: "Sick Leave", value: balances.sick_leave },
    { label: "Casual Leave", value: balances.casual_leave },
    { label: "Earned Leave", value: balances.earned_leave },
    { label: "Comp Off", value: balances.compensation_off },
    { label: "Summer Vacation", value: balances.summer_vacation },
    { label: "Planned Leave", value: balances.planned_leave },
  ];

  const designation = (user.designation || "").toString();
  const quickActionsByRole: Record<string, { label: string; to: string }[]> = {
    Employee: [
      { label: "Apply Leave", to: "/apply-leave" },
      { label: "Leave History", to: "/leave-history" },
      { label: "Attendance History", to: "/attendance-history" },
      { label: "Submit Complaint", to: "/submit-complaint" },
      { label: "Complaint History", to: "/complaint-history" },
      { label: "Self Report", to: "/download-reports" },
    ],
    Admin: [
      { label: "Apply Leave", to: "/apply-leave" },
      { label: "Leave History", to: "/leave-history" },
      { label: "Approve Leave", to: "/approve-leave" },
      { label: "Attendance History", to: "/attendance-history" },
      { label: "Submit Complaint", to: "/submit-complaint" },
      { label: "Complaint History", to: "/complaint-history" },
      { label: "Action Complaints", to: "/action-complaints" },
      { label: "Self Report", to: "/download-reports" },
    ],
    HR: [
      { label: "Apply Leave", to: "/apply-leave" },
      { label: "Leave History", to: "/leave-history" },
      { label: "Approve Leave", to: "/approve-leave" },
      { label: "Attendance History", to: "/attendance-history" },
      { label: "Submit Complaint", to: "/submit-complaint" },
      { label: "Complaint History", to: "/complaint-history" },
      { label: "Action Complaints", to: "/action-complaints" },
      { label: "Add Employee", to: "/add-employee" },
      { label: "Employee Request History", to: "/employee-request-history" },
      { label: "Leave Balance Requests", to: "/leave-balance-requests" },
      { label: "Leave Balance History", to: "/leave-balance-history" },
      { label: "Add Holiday", to: "/add-holiday" },
      { label: "Self Report", to: "/download-reports" },
    ],
    HeadHR: [
      { label: "Apply Leave", to: "/apply-leave" },
      { label: "Leave History", to: "/leave-history" },
      { label: "Attendance History", to: "/attendance-history" },
      { label: "Submit Complaint", to: "/submit-complaint" },
      { label: "Complaint History", to: "/complaint-history" },
      { label: "Employee Requests Approval", to: "/employee-requests" },
      { label: "Remove Employee", to: "/remove-employee" },
      { label: "Remove Employee Request History", to: "/remove-employee-history" },
      { label: "Add Leave Balance", to: "/add-leave-balance" },
      { label: "Weekly Off Management", to: "/weekly-off" },
      { label: "Self Report", to: "/download-reports" },
    ],
    Director: [
      { label: "Apply Leave", to: "/apply-leave" },
      { label: "Leave History", to: "/leave-history" },
      { label: "Attendance History", to: "/attendance-history" },
      { label: "Submit Complaint", to: "/submit-complaint" },
      { label: "Complaint History", to: "/complaint-history" },
      { label: "Action Complaints", to: "/action-complaints" },
      { label: "Remove Employee Requests Approval", to: "/remove-employee-requests" },
      { label: "Download Reports", to: "/download-reports" },
      { label: "Self Report", to: "/download-reports" },
    ],
  };
  const quickActions = quickActionsByRole[designation] || [];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome Back</h1>
          <p>{user.email}</p>
        </div>

        {user.designation && (
          <div className="role-badge">
            {user.designation}
          </div>
        )}
      </div>

      <div className="dashboard-cards">
        {cards.map((c) => (
          <div key={c.label} className="dashboard-card">
            <h4>{c.label}</h4>
            <h2>{c.value ?? 0}</h2>
          </div>
        ))}
      </div>

      <div className="dashboard-chart-card">
        <div className="chart-header">
          <h2>Attendance Summary</h2>
        </div>
        {attendanceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={360}>
            <PieChart>
              <Pie data={attendanceData} cx="50%" cy="50%" outerRadius={120} label dataKey="value">
                {attendanceData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-chart">No attendance data available.</div>
        )}
      </div>
    </div>
  );
}