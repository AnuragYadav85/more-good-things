import axiosInstance from "./axios";

/* AUTH */
export const loginUser = (formData: FormData) =>
  axiosInstance.post("/api/login", formData);
export const sendOtp = (formData: FormData) =>
  axiosInstance.post("/api/send_otp", formData);
export const forgotPassword = (formData: FormData) =>
  axiosInstance.post("/api/forgot_password", formData);

/* DASHBOARD */
export const getDashboard = () => axiosInstance.get("/api/dashboard");

/* LEAVE */
export const applyLeave = (formData: FormData) =>
  axiosInstance.post("/api/applyleave", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getLeaveHistory = () => axiosInstance.get("/api/leave-history");

/* COMPLAINTS */
export const submitComplaint = (formData: FormData) =>
  axiosInstance.post("/api/submit_complaint", formData);
export const getComplaintHistory = () =>
  axiosInstance.get("/api/complaint-history");

/* ADMIN */
export const getPendingLeaves = () =>
  axiosInstance.get("/api/pending-leaves");
export const leaveAction = (leaveId: string | number, action: string) =>
  axiosInstance.post(`/api/action_leave/${leaveId}/${action}`);
export const getPendingComplaints = () =>
  axiosInstance.get("/api/action-complaints");
export const complaintAction = (
  complaintId: string | number,
  action: string,
  formData: FormData,
) => axiosInstance.post(`/api/action_complaint/${complaintId}/${action}`, formData);

/* HR */
export const addEmployeeRequest = (data: unknown) =>
  axiosInstance.post("/api/add_employee_request", data);
export const addLeaveBalanceRequest = (data: unknown) =>
  axiosInstance.post("/api/add_leave_balance_request", data);

/* HEAD HR */
export const getEmployeeRequests = () =>
  axiosInstance.get("/api/employee-requests");
export const employeeRequestAction = (
  requestId: string | number,
  action: string,
) => axiosInstance.post(`/api/action_add_employee/${requestId}/${action}`);
export const getLeaveBalanceRequests = () =>
  axiosInstance.get("/api/leave-balance-requests");
export const leaveBalanceAction = (
  requestId: string | number,
  action: string,
) => axiosInstance.post(`/api/action_leave_balance/${requestId}/${action}`);

/* DIRECTOR */
export const getRemovalRequests = () =>
  axiosInstance.get("/api/removal-requests");
export const removalRequestAction = (
  requestId: string | number,
  action: string,
) => axiosInstance.post(`/api/action_removal_user/${requestId}/${action}`);
export const downloadSelfReport = () =>
  axiosInstance.get("/download_report_self", { responseType: "blob" });
export const downloadAllReports = () =>
  axiosInstance.get("/download_all_reports", { responseType: "blob" });