import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2>Leave Management System</h2>
      </div>
      <div className="navbar-right">
        <div className="user-info">
          <span className="user-email">{user?.email}</span>
          <span className="role-badge">{user?.designation}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}