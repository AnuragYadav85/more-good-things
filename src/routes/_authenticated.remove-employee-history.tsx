import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getRemoveEmployeeHistory,
  cancelRemoveEmployeeRequest,
} from "@/lib/api/api";
import LoadingSpinner from "@/components/lms/LoadingSpinner";
import PageHeader from "@/components/lms/PageHeader";
import StatusBadge from "@/components/lms/StatusBadge";

export const Route = createFileRoute(
  "/_authenticated/remove-employee-history"
)({
  head: () => ({
    meta: [{ title: "Remove Employee History — LMS" }],
  }),
  component: RemoveEmployeeHistoryPage,
});

function RemoveEmployeeHistoryPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await getRemoveEmployeeHistory();
      setRows(res.data || []);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to load removal requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCancel = async (
    requestId: number | string
  ) => {
    try {
      const res = await cancelRemoveEmployeeRequest(
        requestId
      );

      toast.success(res?.data?.message);

      await fetchHistory();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to cancel request"
      );
    }
  };

  if (loading) {
    return (
      <LoadingSpinner text="Loading removal requests..." />
    );
  }

  return (
    <div className="table-page">
      <div className="table-card">
        <PageHeader
          title="Remove Employee Request History"
          description="View all employee removal requests submitted by you."
        />

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Employee Email</th>
                <th>Removal Date</th>
                <th>Status</th>
                <th>Requested On</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "1.25rem",
                      color:
                        "var(--color-text-muted)",
                    }}
                  >
                    No removal requests found
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.request_id}>
                    <td>{row.request_id}</td>
                    <td>{row.email}</td>
                    <td>{row.removal_date}</td>

                    <td>
                      <StatusBadge
                        status={row.status}
                      />
                    </td>

                    <td>{row.requested_on}</td>

                    <td>
                      {row.status === "Pending" ? (
                        <button
                          onClick={() =>
                            handleCancel(
                              row.request_id
                            )
                          }
                        >
                          Cancel
                        </button>
                      ) : (
                        "-"
                      )}
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