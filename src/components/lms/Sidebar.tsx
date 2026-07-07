import { Link, useRouterState } from "@tanstack/react-router";
import {
  HiOutlineViewGrid,
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineChatAlt2,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineUserAdd,
  HiOutlineUsers,
  HiOutlineScale,
  HiOutlineSun,
  HiOutlineClock,
  HiOutlineUserRemove,
  HiOutlineDownload,
} from "react-icons/hi";
import type { ComponentType } from "react";
import { useAuth } from "@/lib/auth-context";

type NavItem = {
  name: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
};

type NavSection = { label: string; items: NavItem[] };

const COMMON_TOP: NavItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: HiOutlineViewGrid },
];
const SELF_SERVICE: NavItem[] = [
  { name: "Apply Leave", path: "/apply-leave", icon: HiOutlineCalendar },
  { name: "Leave History", path: "/leave-history", icon: HiOutlineClipboardList },
  { name: "Attendance History", path: "/attendance-history", icon: HiOutlineClock },
  { name: "Submit Complaint", path: "/submit-complaint", icon: HiOutlineChatAlt2 },
  { name: "Complaint History", path: "/complaint-history", icon: HiOutlineDocumentText },
];
const APPROVALS: NavItem[] = [
  { name: "Pending Leave Requests", path: "/approve-leave", icon: HiOutlineCheckCircle },
  { name: "Pending Complaints", path: "/action-complaints", icon: HiOutlineChatAlt2 },
];
const HR_TOOLS: NavItem[] = [
  { name: "Add Employee Request", path: "/add-employee", icon: HiOutlineUserAdd },
  { name: "Add Employee History", path: "/employee-request-history", icon: HiOutlineUsers },
  { name: "Add Leave Balance Request", path: "/add-leave-balance", icon: HiOutlineScale },
  { name: "Leave Balance History", path: "/leave-balance-history", icon: HiOutlineScale },
  { name: "Holiday Management", path: "/add-holiday", icon: HiOutlineSun },
];
const HEADHR_TOOLS: NavItem[] = [
  { name: "Pending Employee Requests", path: "/employee-requests", icon: HiOutlineUsers },
  { name: "Pending Leave Balance Requests", path: "/leave-balance-requests", icon: HiOutlineScale },
  { name: "Weekly Off Management", path: "/weekly-off", icon: HiOutlineClock },
  { name: "Remove Employee Request", path: "/remove-employee", icon: HiOutlineUserRemove },
  { name: "Remove Employee History", path: "/remove-employee-history", icon: HiOutlineUserRemove },
];
const DIRECTOR_TOOLS: NavItem[] = [
  { name: "Pending Remove Employee Requests", path: "/removal-requests", icon: HiOutlineUserRemove },
];
const SELF_REPORT: NavItem[] = [
  { name: "Download My Report", path: "/download-reports", icon: HiOutlineDownload },
];
const ALL_REPORTS: NavItem[] = [
  { name: "Download All Reports", path: "/download-reports", icon: HiOutlineDownload },
];

const SECTIONS_BY_ROLE: Record<string, NavSection[]> = {
  Employee: [
    { label: "Overview", items: COMMON_TOP },
    { label: "Self Service", items: SELF_SERVICE },
    { label: "Reports", items: SELF_REPORT },
  ],
  Admin: [
    { label: "Overview", items: COMMON_TOP },
    { label: "Self Service", items: SELF_SERVICE },
    { label: "Approvals", items: APPROVALS },
    { label: "Reports", items: SELF_REPORT },
  ],
  HR: [
    { label: "Overview", items: COMMON_TOP },
    { label: "Self Service", items: SELF_SERVICE },
    { label: "Approvals", items: APPROVALS },
    { label: "HR", items: HR_TOOLS },
    { label: "Reports", items: SELF_REPORT },
  ],
  HeadHR: [
    { label: "Overview", items: COMMON_TOP },
    { label: "Self Service", items: SELF_SERVICE },
    { label: "Approvals", items: APPROVALS },
    { label: "HR", items: HR_TOOLS },
    { label: "Head HR", items: HEADHR_TOOLS },
    { label: "Reports", items: [...SELF_REPORT, ...ALL_REPORTS] },
  ],
  Director: [
    { label: "Overview", items: COMMON_TOP },
    { label: "Self Service", items: SELF_SERVICE },
    { label: "Approvals", items: APPROVALS },
    { label: "HR", items: HR_TOOLS },
    { label: "Head HR", items: HEADHR_TOOLS },
    { label: "Director", items: DIRECTOR_TOOLS },
    { label: "Reports", items: [...SELF_REPORT, ...ALL_REPORTS] },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.designation || "Employee";
  const sections = SECTIONS_BY_ROLE[role] || SECTIONS_BY_ROLE.Employee;
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">L</div>
        <span className="sidebar-brand">LMS</span>
      </div>
      <nav className="sidebar-nav">
        {sections.map((section) => (
          <div key={section.label}>
            <div className="sidebar-section-label">{section.label}</div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link${active ? " active" : ""}`}
                >
                  <span className="sidebar-link-icon">
                    <Icon />
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}