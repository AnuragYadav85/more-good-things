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
  HiOutlineCoffee,
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
  { name: "Submit Complaint", path: "/submit-complaint", icon: HiOutlineChatAlt2 },
  { name: "Complaint History", path: "/complaint-history", icon: HiOutlineDocumentText },
];
const APPROVALS: NavItem[] = [
  { name: "Approve Leave", path: "/approve-leave", icon: HiOutlineCheckCircle },
  { name: "Complaint Actions", path: "/action-complaints", icon: HiOutlineChatAlt2 },
];
const HR_TOOLS: NavItem[] = [
  { name: "Add Employee", path: "/add-employee", icon: HiOutlineUserAdd },
  { name: "Add Leave Balance", path: "/add-leave-balance", icon: HiOutlineScale },
  { name: "Add Holiday", path: "/add-holiday", icon: HiOutlineSun },
  { name: "Weekly Off", path: "/weekly-off", icon: HiOutlineCoffee },
];
const HEADHR_TOOLS: NavItem[] = [
  { name: "Employee Requests", path: "/employee-requests", icon: HiOutlineUsers },
  { name: "Leave Balance Requests", path: "/leave-balance-requests", icon: HiOutlineScale },
];
const DIRECTOR_TOOLS: NavItem[] = [
  { name: "Removal Requests", path: "/removal-requests", icon: HiOutlineUserRemove },
  { name: "Download Reports", path: "/download-reports", icon: HiOutlineDownload },
];

const SECTIONS_BY_ROLE: Record<string, NavSection[]> = {
  Employee: [
    { label: "Overview", items: COMMON_TOP },
    { label: "Self Service", items: SELF_SERVICE },
  ],
  Admin: [
    { label: "Overview", items: COMMON_TOP },
    { label: "Self Service", items: SELF_SERVICE },
    { label: "Approvals", items: APPROVALS },
  ],
  HR: [
    { label: "Overview", items: COMMON_TOP },
    { label: "Self Service", items: SELF_SERVICE },
    { label: "Approvals", items: APPROVALS },
    { label: "HR", items: HR_TOOLS },
  ],
  HeadHR: [
    { label: "Overview", items: COMMON_TOP },
    { label: "Self Service", items: SELF_SERVICE },
    { label: "Approvals", items: APPROVALS },
    { label: "Head HR", items: HEADHR_TOOLS },
  ],
  Director: [
    { label: "Overview", items: COMMON_TOP },
    { label: "Self Service", items: SELF_SERVICE },
    { label: "Approvals", items: APPROVALS },
    { label: "Director", items: DIRECTOR_TOOLS },
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