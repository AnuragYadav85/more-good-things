import {createFileRoute, useSearch,} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {getEmployeeRequestHistory, cancelEmployeeRequest,} from "@/lib/api/api";
import LoadingSpinner from "@/components/lms/LoadingSpinner";
import PageHeader from "@/components/lms/PageHeader";
import StatusBadge from "@/components/lms/StatusBadge";

export const Route = createFileRoute("/_authenticated/employee-request-history")({
  validateSearch: (search: Record<string, unknown>) => ({
    message: typeof search.message === "string" ? search.message : undefined,
  }),

  head: () => ({
    meta: [{ title: "Employee Request History — LMS" }],
  }),

  component: EmployeeRequestHistoryPage,
});

function EmployeeRequestHistoryPage() {
  const search = useSearch({ from: "/_authenticated/employee-request-history", });
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (search.message) {
      toast.success(search.message);
    }
  }, [search.message]);

  const fetchEmployeeRequestHistory = async () => {
    try {
      const res = await getEmployeeRequestHistory();

      setRows(res.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (
    requestId: number | string
  ) => {
    try {
      const res = await cancelEmployeeRequest(requestId);

      toast.success(
        res?.data?.message
      );

      await fetchEmployeeRequestHistory();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message
      );
    }
  };

  const canCancelRequest = (request: any) => {
    return request.status === "Pending";
   };

  useEffect(() => {
    fetchEmployeeRequestHistory();
  }, []);

  if (loading)
    return (
      <LoadingSpinner text="Loading employee requests..." />
    );

  return (
    <div className="table-page">
      <div className="table-card">
        <PageHeader title="Employee Request History" description="All employee requests submitted by you." />
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Email</th>
                <th>Name</th>
                <th>Surname</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Status</th>
                <th>Requested On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{textAlign: "center", padding: "1.25rem", color: "var(--color-text-muted)",}}>No employee requests found</td>
                    </tr>) : (
                    rows.map((request) => (
                    <tr key={request.request_id}>
                        <td>{request.request_id}</td>
                        <td>{request.email}</td>
                        <td>{request.name}</td>
                        <td>{request.surname}</td>
                        <td>{request.designation}</td>
                        <td>{request.department}</td>
                        <td>
                        <StatusBadge status={request.status} />
                        </td>
                        <td>{request.requested_on}</td>
                        <td> {canCancelRequest(request) ? (<button onClick={() => handleCancelRequest(request.request_id)}>Cancel</button>
                        ) : ("-")}</td>
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