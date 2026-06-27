import { createFileRoute } from "@tanstack/react-router";
import { useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getLeaveBalanceHistory,
  cancelLeaveBalanceRequest,
} from "@/lib/api/api";
import LoadingSpinner from "@/components/lms/LoadingSpinner";
import PageHeader from "@/components/lms/PageHeader";
import StatusBadge from "@/components/lms/StatusBadge";

export const Route = createFileRoute(
  "/_authenticated/leave-balance-history"
)({
  validateSearch: (
    search: Record<string, unknown>
  ) => ({
    message:
      typeof search.message === "string"
        ? search.message
        : undefined,
  }),

  head: () => ({
    meta: [
      {
        title:
          "Leave Balance History — LMS",
      },
    ],
  }),

  component: LeaveBalanceHistoryPage,
});

function LeaveBalanceHistoryPage() {
  const search = useSearch({
    from:
      "/_authenticated/leave-balance-history",
  });

  const [rows, setRows] = useState<any[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (search.message) {
      toast.success(search.message);
    }
  }, [search.message]);

  const fetchLeaveBalanceHistory =
    async () => {
      try {
        const res =
          await getLeaveBalanceHistory();

        setRows(res.data || []);
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message
        );
      } finally {
        setLoading(false);
      }
    };

  const handleCancelRequest =
    async (
      requestId: number | string
    ) => {
      try {
        const res =
          await cancelLeaveBalanceRequest(
            requestId
          );

        toast.success(
          res?.data?.message
        );

        await fetchLeaveBalanceHistory();
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message
        );
      }
    };

  const canCancelRequest = (
    request: any
  ) => {
    return (
      request.status === "Pending"
    );
  };

  useEffect(() => {
    fetchLeaveBalanceHistory();
  }, []);

  if (loading)
    return (
      <LoadingSpinner text="Loading leave balance requests..." />
    );

  return (
    <div className="table-page">
      <div className="table-card">
        <PageHeader
          title="Leave Balance History"
          description="All leave balance requests submitted by you."
        />

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Email</th>
                <th>Leave Type</th>
                <th>Days</th>
                <th>Status</th>
                <th>Requested On</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "1.25rem",
                      color:
                        "var(--color-text-muted)",
                    }}
                  >
                    No leave balance
                    requests found
                  </td>
                </tr>
              ) : (
                rows.map((request) => (
                  <tr
                    key={
                      request.request_id
                    }
                  >
                    <td>
                      {
                        request.request_id
                      }
                    </td>

                    <td>
                      {request.email}
                    </td>

                    <td>
                      {
                        request.leave_type
                      }
                    </td>

                    <td>
                      {request.days}
                    </td>

                    <td>
                      <StatusBadge
                        status={
                          request.status
                        }
                      />
                    </td>

                    <td>
                      {
                        request.requested_on
                      }
                    </td>

                    <td>
                      {canCancelRequest(
                        request
                      ) ? (
                        <button
                          onClick={() =>
                            handleCancelRequest(
                              request.request_id
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