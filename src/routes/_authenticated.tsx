import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/lms/Sidebar";
import Navbar from "@/components/lms/Navbar";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate({ to: "/login", replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading || !isAuthenticated) {
    return (
      <div className="login-container">
        <div className="spinner-container">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="lms-layout">
      <Sidebar />
      <div className="lms-main">
        <Navbar />
        <main className="lms-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}