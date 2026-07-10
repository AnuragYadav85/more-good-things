import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAttendanceHistory } from "@/lib/api/api";
import { useAuth } from "@/lib/auth-context";
import LoadingSpinner from "@/components/lms/LoadingSpinner";
import PageHeader from "@/components/lms/PageHeader";
import StatusBadge from "@/components/lms/StatusBadge";

export const Route = createFileRoute("/_authenticated/attendance-history")({
  head: () => ({ meta: [{ title: "Attendance History — LMS" }] }),
  component: AttendanceHistoryPage,
});

function AttendanceHistoryPage() {
  const [week, setWeek] = useState(0);
  const [rows, setRows] = useState<any[]>([]);
  const [weekStart, setWeekStart] = useState<string>("");
  const [weekEnd, setWeekEnd] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthError = (status?: number) => {
    if (status === 401 || status === 403) {
      logout();
      navigate({ to: "/login", replace: true });
      return true;
    }
    return false;
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAttendanceHistory(week)
      .then((res) => {
        if (cancelled) return;
        setRows(res.data?.data || []);
        setWeekStart(res.data?.week_start || "");
        setWeekEnd(res.data?.week_end || "");
      })
      .catch((err: any) => {
        if (cancelled) return;
        if (handleAuthError(err?.response?.status)) return;
        toast.error(
          err?.response?.data?.message ||
            (err?.response
              ? "Failed to load attendance history"
              : "Unable to connect to server. Please try again."),
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [week]);

  const handlePrevious = () => setWeek((prev) => prev + 1);
  const handleNext = () => {
    if (week > 0) setWeek((prev) => prev - 1);
  };



  if (loading) return <LoadingSpinner text="Loading attendance history..." />;

  return (
    <div className="table-page">
      <div className="table-card">
        <PageHeader
          title="Attendance History"
          description="View your weekly attendance records."
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            padding: "0 0 1rem 0",
          }}
        >
          <div style={{ fontWeight: 500 }}>
            {weekStart && weekEnd
              ? `Week: ${weekStart} to ${weekEnd}`
              : "Week: -"}
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handlePrevious}
            >
              Previous Week
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleNext}
              disabled={week === 0}
            >
              Next Week
            </button>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: "1.25rem",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    No attendance records found
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <tr key={`${row.attendance_date}-${idx}`}>
                    <td>{row.attendance_date}</td>
                    <td>{row.day_name}</td>
                    <td>{row.check_in_time || "-"}</td>
                    <td>{row.check_out_time || "-"}</td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}