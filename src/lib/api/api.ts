import axiosInstance from "./axios";

/* AUTH */
export const loginUser = (formData: FormData) =>
  axiosInstance.post("/api/login", formData);
export const sendOtp = (formData: FormData) =>
  axiosInstance.post("/api/send_otp", formData);
export const forgotPassword = (formData: FormData) =>
  axiosInstance.post("/api/forgot_password", formData);
export const changePassword = (formData: FormData) =>
  axiosInstance.post("/api/change_password", formData);

/* DASHBOARD */
export const getDashboard = () => axiosInstance.get("/api/dashboard");

/* LEAVE */
export const applyLeave = (formData: FormData) =>
  axiosInstance.post("/api/apply_leave", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getLeaveHistory = () => axiosInstance.get("/api/leave_history");
export const cancelLeave = (leaveId: string | number) =>
  axiosInstance.post(`/api/cancel_leave_action/${leaveId}`);

/* ATTENDANCE */
export const getAttendanceHistory = (week: number = 0) =>
  axiosInstance.get(`/api/attendance_history?week=${week}`);

/* COMPLAINTS */
export const submitComplaint = (formData: FormData) =>
  axiosInstance.post("/api/submit_complaint", formData);
export const getComplaintHistory = () =>
  axiosInstance.get("/api/complaint-history");
export const cancelComplaint = (complaintId: string | number) =>
  axiosInstance.post(`/api/cancel_complaint_action/${complaintId}`);

/* ADMIN */
export const getPendingLeaves = () =>
  axiosInstance.get("/api/pending_leaves_requests");
export const leaveAction = (leaveId: string | number, formData: FormData) =>
  axiosInstance.post(`/api/action_leave/${leaveId}`, formData);
export const getPendingComplaints = () =>
  axiosInstance.get("/api/action-complaints");
export const complaintAction = (complaintId: string | number, action: string, formData: FormData,) =>
  axiosInstance.post(`/api/action_complaint/${complaintId}/${action}`, formData);

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
  formData?: FormData
) =>
  axiosInstance.post(`/api/action_leave_balance/${requestId}/${action}`, formData);

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

export const getEmployeeRequestHistory = () =>
  axiosInstance.get("/api/employee-request-history");

export const cancelEmployeeRequest = (requestId: string | number) =>
  axiosInstance.post(`/api/cancel_employee_request/${requestId}`);

export const addHoliday = (data: {holiday_name: string; holiday_date: string; description: string;}) =>
  axiosInstance.post("/api/add_holiday", data);

export const addWeeklyOff = (formData: FormData) =>
  axiosInstance.post("/add_weekly_off", formData);

export const getLeaveBalanceHistory =() =>
    axiosInstance.get("/api/leave-balance-history");

export const cancelLeaveBalanceRequest = (requestId: string | number) =>
    axiosInstance.post(`/api/cancel_leave_balance_request/${requestId}`);

export const removeEmployee = (formData: FormData) =>
  axiosInstance.post("/api/remove-employee", formData);

export const getRemoveEmployeeHistory = () =>
  axiosInstance.get("/api/remove-employee-history");

export const cancelRemoveEmployeeRequest = (requestId: number | string) =>
  axiosInstance.post(`/api/cancel-remove-employee/${requestId}`);