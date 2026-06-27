import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getLeaveBalanceRequests, leaveBalanceAction } from "@/lib/api/api";
import LoadingSpinner from "@/components/lms/LoadingSpinner";
import PageHeader from "@/components/lms/PageHeader";

export const Route = createFileRoute("/_authenticated/leave-balance-requests")({
  head: () => ({ meta: [{ title: "Leave Balance Requests — LMS" }] }),
  component: LeaveBalanceRequestsPage,
});

function LeaveBalanceRequestsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<any | null>(null);
  const [mode, setMode] = useState<"none" | "reject">("none");
  const [remark, setRemark] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getLeaveBalanceRequests()
      .then((res) => setRows(res.data || []))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load requests"))
      .finally(() => setLoading(false));
  }, []);

  const handleView = (request: any) => {
    setSelected(request);
    setMode("none");
    setRemark("");
  };

  const handleClose = () => {
    setSelected(null);
    setMode("none");
    setRemark("");
  };

  const submitAction = async (action: "Approved" | "Rejected") => {
    if (!selected) return;

    if (
      action === "Rejected" &&
      !remark.trim()
    ) {
      toast.error(
        "Rejection reason is required"
      );
      return;
    }

    try {
      setSubmitting(true);

      const fd = new FormData();

      if (remark.trim()) {
        fd.append(
          "remark",
          remark.trim()
        );
      }

      const res =
        await leaveBalanceAction(
          selected.request_id,
          action,
          fd
        );

      toast.success(
        res?.data?.message
      );

      handleClose();

      setRows((prev) =>
        prev.filter(
          (r) =>
            r.request_id !==
            selected.request_id
        )
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading leave balance requests..." />;

  return (
    <div className="table-page">

      {selected && (
        <div
          className="table-card"
          style={{ marginBottom: "1rem" }}
        >
          <PageHeader
            title="Leave Balance Request"
            description="Review request details before taking action."
          />

          <div style={{ padding: "1rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <strong>Request ID</strong>
                <div>{selected.request_id}</div>
              </div>

              <div>
                <strong>Employee Email</strong>
                <div>{selected.email}</div>
              </div>

              <div>
                <strong>Leave Type</strong>
                <div>{selected.leave_type}</div>
              </div>

              <div>
                <strong>Leave Count</strong>
                <div>{selected.leave_count}</div>
              </div>

              <div>
                <strong>Requested By</strong>
                <div>{selected.requested_by}</div>
              </div>

              <div>
                <strong>Requested On</strong>
                <div>{selected.requested_on}</div>
              </div>

              <div>
                <strong>Status</strong>
                <div>{selected.status}</div>
              </div>
            </div>

            {mode === "reject" && (
              <div
                style={{
                  marginBottom: "1rem",
                }}
              >
                <label>
                  Rejection Reason *
                </label>

                <textarea
                  rows={4}
                  value={remark}
                  onChange={(e) =>
                    setRemark(
                      e.target.value
                    )
                  }
                  placeholder="Enter rejection reason..."
                  style={{
                    width: "100%",
                    marginTop: "0.5rem",
                  }}
                />
              </div>
            )}

            <div
              className="action-buttons"
              style={{
                display: "flex",
                gap: "0.5rem",
              }}
            >
              <button
                className="approve-btn"
                disabled={submitting}
                onClick={() =>
                  submitAction(
                    "Approved"
                  )
                }
              >
                Approve
              </button>

              <button
                className="reject-btn"
                disabled={submitting}
                onClick={() => {
                  if (
                    mode !== "reject"
                  ) {
                    setMode(
                      "reject"
                    );
                    return;
                  }

                  submitAction(
                    "Rejected"
                  );
                }}
              >
                {mode === "reject"
                  ? "Submit Rejection"
                  : "Reject"}
              </button>

              <button
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-card">
        <PageHeader
          title="Leave Balance Requests"
          description="Review leave balance requests submitted by HR."
        />

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Email</th>
                <th>Leave Type</th>
                <th>Count</th>
                <th>Requested By</th>
                <th>Requested On</th>
                <th>View</th>
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
                    No pending leave balance requests
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={
                      r.request_id
                    }
                  >
                    <td>
                      {r.request_id}
                    </td>

                    <td>
                      {r.email}
                    </td>

                    <td>
                      {r.leave_type}
                    </td>

                    <td>
                      {r.leave_count}
                    </td>

                    <td>
                      {r.requested_by}
                    </td>

                    <td>
                      {r.requested_on}
                    </td>

                    <td>
                      <button
                        className="approve-btn"
                        onClick={() =>
                          handleView(
                            r
                          )
                        }
                      >
                        View
                      </button>
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